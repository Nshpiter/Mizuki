/**
 * GitHub star 数同步脚本
 * 读取 src/data/projects.ts 中各条目的 sourceCode 指向的 GitHub 仓库，
 * 拉取最新 stargazers_count 并写回 stars 字段；无变化不动文件。
 *
 * 与 sync-wp.mjs 共同挂载于 GitHub Actions 每日定时同步工作流。
 * 认证：优先使用 GITHUB_TOKEN / GH_TOKEN 环境变量（CI 自带），
 * 缺失时匿名请求（限流 60 次/小时，6 个仓库足够）。
 *
 * 用法：node scripts/sync-stars.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";

// Node fetch 默认不走系统代理；检测到代理环境变量时启用（与 curl 行为一致）
if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) {
	setGlobalDispatcher(new EnvHttpProxyAgent());
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PROJECTS_FILE = path.join(ROOT, "src/data/projects.ts");

const API_TIMEOUT_MS = 30_000;

async function fetchStars(repo) {
	const headers = { Accept: "application/vnd.github+json" };
	const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;

	const res = await fetch(`https://api.github.com/repos/${repo}`, {
		headers,
		signal: AbortSignal.timeout(API_TIMEOUT_MS),
	});
	if (!res.ok) {
		throw new Error(`GitHub API ${res.status}: ${repo}`);
	}
	const data = await res.json();
	return data.stargazers_count;
}

async function main() {
	const content = fs.readFileSync(PROJECTS_FILE, "utf-8");

	// 每个条目块内没有嵌套花括号（仅数组），可用非嵌套匹配定位
	const entryRe = /\{[^{}]+\}/g;
	const repoRe = /sourceCode:\s*"https:\/\/github\.com\/([^"]+)"/;
	const starsRe = /\bstars:\s*(\d+)/;

	let updated = 0;
	let failed = 0;
	let next = content;

	for (const entry of content.match(entryRe) ?? []) {
		const id = entry.match(/id:\s*"([^"]+)"/)?.[1];
		const repo = entry.match(repoRe)?.[1];
		const current = entry.match(starsRe)?.[1];
		if (!id || !repo || current === undefined) continue;

		try {
			const stars = await fetchStars(repo);
			if (stars === Number(current)) {
				console.log(`  = ${id} (${repo}): ${stars} 未变更`);
				continue;
			}
			next = next.replace(
				entry,
				entry.replace(starsRe, `stars: ${stars}`),
			);
			updated += 1;
			console.log(`  ✏️  ${id} (${repo}): ${current} → ${stars}`);
		} catch (err) {
			failed += 1;
			console.error(`  ❌ ${id} (${repo}): ${err instanceof Error ? err.message : err}`);
		}
	}

	if (updated > 0) {
		fs.writeFileSync(PROJECTS_FILE, next, "utf-8");
	}
	console.log(`\nstar 同步完成：更新 ${updated} 个，失败 ${failed} 个。`);
	if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
	console.error(`❌ star 同步失败：${err instanceof Error ? err.message : err}`);
	process.exit(1);
});
