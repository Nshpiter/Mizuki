/**
 * AI 文章摘要生成脚本
 * 扫描 src/content/posts/ 下所有 .md 文件，
 * 对没有 description 字段的文章调用 Claude API 生成摘要，
 * 并直接写回文件的 frontmatter。
 *
 * 用法：
 *   1. 在 .env 文件中配置 ANTHROPIC_API_KEY
 *   2. node scripts/gen-descriptions.mjs
 *   3. git add & commit 更新后的文章文件
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "src/content/posts");

// 读取 .env
const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
	const envContent = fs.readFileSync(envPath, "utf-8");
	for (const line of envContent.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eq = trimmed.indexOf("=");
		if (eq === -1) continue;
		const key = trimmed.slice(0, eq).trim();
		const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
		if (!process.env[key]) process.env[key] = val;
	}
}

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
	console.error("❌ 未找到 ANTHROPIC_API_KEY，请在 .env 文件中配置。");
	process.exit(1);
}

// 解析 frontmatter
function parseFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!match) return null;
	return { yaml: match[1], body: match[2] };
}

// 从 frontmatter YAML 中提取某个字段值
function getField(yaml, field) {
	const re = new RegExp(`^${field}:\\s*(.+)$`, "m");
	const m = yaml.match(re);
	return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
}

// 提取正文纯文本（去掉 Markdown 语法、图片、代码块等）
function extractPlainText(body) {
	return body
		.replace(/```[\s\S]*?```/g, "") // 代码块
		.replace(/`[^`]+`/g, "") // 行内代码
		.replace(/!\[.*?\]\(.*?\)/g, "") // 图片
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 链接保留文字
		.replace(/^#{1,6}\s+/gm, "") // 标题 #
		.replace(/^\s*[-*>|]+\s*/gm, "") // 列表、引用、表格
		.replace(/[*_~]/g, "") // 加粗、斜体
		.replace(/\n{3,}/g, "\n\n")
		.trim()
		.slice(0, 1500); // 只取前 1500 字符够了
}

// 调用 Claude API 生成摘要
async function generateDescription(title, plainText) {
	const resp = await fetch("https://api.anthropic.com/v1/messages", {
		method: "POST",
		headers: {
			"x-api-key": API_KEY,
			"anthropic-version": "2023-06-01",
			"content-type": "application/json",
		},
		body: JSON.stringify({
			model: "claude-haiku-4-5-20251001",
			max_tokens: 120,
			messages: [
				{
					role: "user",
					content: `请为以下博客文章生成一句话摘要（30-60字，中文，不要引号，不要句号以外的标点，直接输出摘要文本）：

文章标题：${title}
文章内容：
${plainText}`,
				},
			],
		}),
	});

	if (!resp.ok) {
		const err = await resp.text();
		throw new Error(`API 错误 ${resp.status}: ${err}`);
	}

	const data = await resp.json();
	return data.content[0].text.trim().replace(/^["'「]|["'」]$/g, "");
}

// 将 description 写入 frontmatter
function injectDescription(content, description) {
	// 转义特殊字符
	const escaped = description.replace(/"/g, '\\"');
	// 在 frontmatter 末尾（--- 之前）插入 description
	return content.replace(
		/^(---\n[\s\S]*?)(---)/m,
		`$1description: "${escaped}"\n$2`,
	);
}

async function main() {
	const files = fs
		.readdirSync(POSTS_DIR)
		.filter((f) => f.endsWith(".md"))
		.map((f) => path.join(POSTS_DIR, f));

	const todo = [];
	for (const file of files) {
		const content = fs.readFileSync(file, "utf-8");
		const parsed = parseFrontmatter(content);
		if (!parsed) continue;
		const desc = getField(parsed.yaml, "description");
		if (!desc) todo.push({ file, content, parsed });
	}

	if (todo.length === 0) {
		console.log("✅ 所有文章都已有 description，无需生成。");
		return;
	}

	console.log(`📝 共 ${todo.length} 篇文章需要生成摘要...\n`);

	for (const { file, content, parsed } of todo) {
		const title = getField(parsed.yaml, "title") || path.basename(file, ".md");
		const plainText = extractPlainText(parsed.body);

		process.stdout.write(`  → ${title} ... `);

		try {
			const description = await generateDescription(title, plainText);
			const updated = injectDescription(content, description);
			fs.writeFileSync(file, updated, "utf-8");
			console.log(`✅ ${description}`);
		} catch (err) {
			console.log(`❌ 失败: ${err.message}`);
		}

		// 避免触发 API 速率限制
		await new Promise((r) => setTimeout(r, 300));
	}

	console.log("\n🎉 完成！请检查并 git commit 更新后的文章。");
}

main();
