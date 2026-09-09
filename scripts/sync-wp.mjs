/**
 * WordPress 文章同步脚本
 * 从 WordPress REST API 拉取已发布文章，转换为 Markdown 落地到
 * src/content/posts/，并生成 Mizuki frontmatter。
 *
 * 增量策略（以 WP 为准）：
 * - .wp-sync-state.json 记录每篇文章的 wpId → { modified, file }，随仓库提交，
 *   供本地与 CI（GitHub Actions 定时同步）共用；
 * - WP 端 modified 变化 → 以 WP 内容更新本地文件；
 * - 首次遇到的文章若已存在同名/同标题文件（手工迁移的历史文章），
 *   仅登记当前 modified，不覆盖内容，保护历史精修；
 * - WP 端已删除的文章不自动删除本地文件，只提示。
 *
 * 用法：
 *   node scripts/sync-wp.mjs
 * 前置：在 .env 配置 WP_API_BASE，例如 https://blog.example.com
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

// Node fetch 默认不走系统代理；检测到代理环境变量时启用（与 curl 行为一致）
if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) {
	setGlobalDispatcher(new EnvHttpProxyAgent());
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "src/content/posts");
const STATE_FILE = path.join(ROOT, ".wp-sync-state.json");

const API_TIMEOUT_MS = 30_000;
const PER_PAGE = 100;

// ---------- .env 加载（与 gen-descriptions.mjs 保持一致） ----------

function loadEnv() {
	const envPath = path.join(ROOT, ".env");
	if (!fs.existsSync(envPath)) return;
	for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eq = trimmed.indexOf("=");
		if (eq === -1) continue;
		const key = trimmed.slice(0, eq).trim();
		const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
		if (!process.env[key]) process.env[key] = val;
	}
}

// ---------- 工具函数 ----------

/** 解码 WP API 返回文本中的 HTML 实体（命名 + 数字） */
function decodeEntities(text) {
	const named = {
		amp: "&",
		lt: "<",
		gt: ">",
		quot: '"',
		apos: "'",
		nbsp: " ",
		mdash: "—",
		ndash: "–",
		hellip: "…",
		ldquo: "“",
		rdquo: "”",
		lsquo: "‘",
		rsquo: "’",
	};
	return String(text)
		.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
			String.fromCodePoint(Number.parseInt(code, 16)),
		)
		.replace(/&([a-z]+);/gi, (raw, name) => named[name.toLowerCase()] ?? raw);
}

/** 去除 HTML 标签，用于 excerpt 生成纯文本 description */
function stripTags(html) {
	return decodeEntities(
		String(html)
			.replace(/<[^>]*>/g, " ")
			.replace(/\s+/g, " "),
	).trim();
}

/** 由 slug 与标题生成安全的文件名 */
function toFileName(slug, title) {
	let base = "";
	try {
		base = decodeURIComponent(slug || "").trim();
	} catch {
		base = slug || "";
	}
	if (!base || /^[\s%_\-.,]+$/u.test(base)) base = title;
	base = base
		.replace(/[\\/:*?"<>|]/g, "")
		.replace(/\s+/g, "-")
		.slice(0, 80)
		.replace(/^[-.]+|[-.]+$/g, "");
	return `${base || "untitled"}.md`;
}

/**
 * 扫描本地已有文章，建立 frontmatter title → 文件名 的索引。
 * 用于识别"标题相同但尚未登记 state"的历史文章。
 */
function buildTitleIndex() {
	const index = new Map();
	for (const name of fs.readdirSync(POSTS_DIR)) {
		if (!name.endsWith(".md") && !name.endsWith(".mdx")) continue;
		const head = fs
			.readFileSync(path.join(POSTS_DIR, name), "utf-8")
			.split("\n", 30)
			.join("\n");
		const match = head.match(/^title:\s*(.+)$/m);
		if (!match) continue;
		const title = match[1].trim().replace(/^["']|["']$/g, "");
		if (title) index.set(title, name);
	}
	return index;
}

function formatYamlDate(iso) {
	return iso.slice(0, 10);
}

/** 序列化 frontmatter；字符串统一 JSON.stringify 保证转义正确 */
function buildFrontmatter(meta) {
	const lines = ["---"];
	lines.push(`title: ${JSON.stringify(meta.title)}`);
	lines.push(`published: ${formatYamlDate(meta.published)}`);
	if (meta.updated && meta.updated.slice(0, 10) !== meta.published.slice(0, 10)) {
		lines.push(`updated: ${formatYamlDate(meta.updated)}`);
	}
	if (meta.description) lines.push(`description: ${JSON.stringify(meta.description)}`);
	if (meta.image) lines.push(`image: ${JSON.stringify(meta.image)}`);
	if (meta.category) lines.push(`category: ${JSON.stringify(meta.category)}`);
	if (meta.tags.length > 0) {
		lines.push(`tags: [${meta.tags.map((t) => JSON.stringify(t)).join(", ")}]`);
	}
	lines.push("---", "");
	return lines.join("\n");
}

// ---------- WordPress API ----------

async function fetchJson(url) {
	const res = await fetch(url, {
		headers: { Accept: "application/json" },
		signal: AbortSignal.timeout(API_TIMEOUT_MS),
	});
	if (!res.ok) {
		throw new Error(`请求失败 ${res.status} ${res.statusText}: ${url}`);
	}
	return res.json();
}

/** 分页拉取全部已发布文章（WP REST API 默认仅返回 publish 状态） */
async function fetchAllPosts(apiBase) {
	const posts = [];
	let page = 1;
	while (true) {
		const url = `${apiBase}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&_embed=1`;
		const batch = await fetchJson(url);
		posts.push(...batch);
		console.log(`  已拉取第 ${page} 页，累计 ${posts.length} 篇`);
		if (batch.length < PER_PAGE) break;
		page += 1;
	}
	return posts;
}

/** 从 _embed 数据中提取主分类、标签与特色图 */
function extractTerms(post) {
	const embedded = post._embedded ?? {};
	const terms = embedded["wp:term"] ?? [];
	const categories = terms[0] ?? [];
	const tags = terms[1] ?? [];
	const media = embedded["wp:featuredmedia"]?.[0];
	return {
		category: categories[0]?.name ?? "",
		tags: tags.map((t) => decodeEntities(t.name)),
		image: media?.source_url ?? "",
	};
}

// ---------- 同步主流程 ----------

async function main() {
	loadEnv();

	const apiBase = (process.env.WP_API_BASE || "").replace(/\/+$/, "");
	if (!apiBase) {
		console.error("❌ 未找到 WP_API_BASE，请在 .env 文件中配置，例如：");
		console.error("   WP_API_BASE=https://blog.example.com");
		process.exit(1);
	}

	const turndown = new TurndownService({
		codeBlockStyle: "fenced",
		headingStyle: "atx",
		bulletListMarker: "-",
	});
	turndown.use(gfm);
	// Gutenberg 区块注释无内容价值，直接移除
	turndown.addRule("stripGutenbergComments", {
		filter: (node) =>
			node.nodeType === 8 || /^wp:/i.test(node.textContent?.trim() ?? ""),
		replacement: () => "",
	});

	if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

	console.log(`开始同步 WordPress 文章：${apiBase}\n`);
	const posts = await fetchAllPosts(apiBase);
	console.log(`共获取 ${posts.length} 篇已发布文章\n`);

	const state = readJsonSafe(STATE_FILE, {});
	const titleIndex = buildTitleIndex();
	let added = 0;
	let updated = 0;
	let registered = 0;
	let skipped = 0;
	const syncedIds = new Set();

	for (const post of posts) {
		const id = post.id;
		const modified = post.modified;
		syncedIds.add(id);
		const title = decodeEntities(post.title?.rendered ?? "无标题");

		// 已登记且 WP 端无变化 → 跳过
		if (state[id]?.modified === modified) {
			skipped += 1;
			continue;
		}

		const knownFile = state[id]?.file;
		// 首次登记的历史文章（标题命中已有文件）：只登记，不覆盖精修内容
		const isHistorical = !knownFile && titleIndex.has(title);
		const fileName = knownFile ?? (isHistorical
			? titleIndex.get(title)
			: toFileName(post.slug, title));

		if (!isHistorical) {
			const terms = extractTerms(post);
			const markdown = turndown.turndown(post.content?.rendered ?? "").trim();
			const meta = {
				title,
				published: post.date,
				updated: post.modified,
				description: stripTags(post.excerpt?.rendered ?? "").slice(0, 160),
				image: terms.image,
				category: decodeEntities(terms.category),
				tags: terms.tags,
			};
			fs.writeFileSync(
				path.join(POSTS_DIR, fileName),
				`${buildFrontmatter(meta)}\n${markdown}\n`,
				"utf-8",
			);
		}

		state[id] = { modified, file: fileName };
		if (knownFile) {
			updated += 1;
			console.log(`  ✏️  更新：${title}`);
		} else if (isHistorical) {
			registered += 1;
			console.log(`  📌 登记（保留本地内容）：${title}`);
		} else {
			added += 1;
			console.log(`  ➕ 新增：${title}`);
		}
	}

	// 只提示、不自动删除：删除决定留给作者
	const removedInWp = Object.keys(state).filter((id) => !syncedIds.has(Number(id)));
	fs.writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, "utf-8");

	console.log(
		`\n同步完成：新增 ${added}，更新 ${updated}，登记 ${registered}，未变更 ${skipped}。`,
	);
	if (removedInWp.length > 0) {
		console.log(
			`⚠️  以下文章在 WP 端已删除（本地文件保留，请自行处理）：${removedInWp
				.map((id) => state[id]?.file ?? id)
				.join("、")}`,
		);
	}
}

function readJsonSafe(file, fallback) {
	try {
		return JSON.parse(fs.readFileSync(file, "utf-8"));
	} catch {
		return fallback;
	}
}

main().catch((err) => {
	console.error(`❌ 同步失败：${err instanceof Error ? err.message : err}`);
	process.exit(1);
});
