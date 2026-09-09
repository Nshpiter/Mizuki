// Project data configuration file
// 数据来源：GitHub 主页 Pin 的仓库（2026-09 同步）

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	visitUrl?: string; // 添加前往项目链接字段
	stars?: number; // GitHub star 数
}

export const projectsData: Project[] = [
	{
		id: "eridanus",
		title: "Eridanus",
		description:
			"基于 OneBot 协议的多功能 bot 兼开发框架。以 LLM function calling 为核心构建了更智能的功能调用机制，支持不接入 QQ 的纯 Live2d 桌宠模式。",
		image: "",
		category: "web",
		techStack: ["Python", "LLM", "OneBot", "function-calling"],
		status: "in-progress",
		liveDemo: "https://eridanus.netlify.app",
		sourceCode: "https://github.com/AOrbitron/Eridanus",
		startDate: "2024-07-23",
		featured: true,
		tags: ["bot", "llm", "qqbot"],
		visitUrl: "https://eridanus.netlify.app",
		stars: 200,
	},
	{
		id: "npiter-blog",
		title: "piterの小窝",
		description:
			"基于 Mizuki（Astro + Svelte）构建的个人博客，记录 CTF WriteUp、技术笔记和学习心得。从 WordPress 迁移而来，部署于 Vercel。",
		image: "",
		category: "web",
		techStack: ["Astro", "Svelte", "TypeScript", "Tailwind CSS"],
		status: "in-progress",
		liveDemo: "https://npiter.de",
		sourceCode: "https://github.com/Nshpiter/Mizuki",
		startDate: "2025-12-05",
		featured: true,
		tags: ["博客", "个人网站", "CTF", "技术笔记"],
		visitUrl: "https://npiter.de",
		stars: 0,
	},
	{
		id: "huaweipods",
		title: "HuaweiPods",
		description:
			"Huawei FreeBuds integration for Xiaomi HyperOS — 在小米澎湃OS上集成华为 FreeBuds 耳机体验。",
		image: "",
		category: "mobile",
		techStack: ["Kotlin", "Xposed", "HyperOS"],
		status: "in-progress",
		liveDemo: "https://github.com/Xposed-Modules-Repo/moe.chenxy.huaweipods",
		sourceCode: "https://github.com/Nshpiter/HuaweiPods",
		startDate: "2026-07-17",
		featured: true,
		tags: ["Xposed", "耳机", "模块"],
		stars: 18,
	},
	{
		id: "q-music",
		title: "Q-music",
		description: "个人音乐播放器项目，基于 TypeScript 开发。",
		image: "",
		category: "web",
		techStack: ["TypeScript"],
		status: "in-progress",
		sourceCode: "https://github.com/Nshpiter/Q-music",
		startDate: "2026-07-05",
		tags: ["音乐", "播放器"],
		stars: 5,
	},
	{
		id: "image-compression-tool",
		title: "Image-compression-tool",
		description: "一个简约的图片压缩工具，支持批量压缩，支持二次开发。",
		image: "",
		category: "web",
		techStack: ["HTML", "JavaScript"],
		status: "completed",
		liveDemo: "https://image-compression-tool-eight.vercel.app",
		sourceCode: "https://github.com/Nshpiter/Image-compression-tool",
		startDate: "2025-02-28",
		tags: ["图片", "工具", "压缩"],
		visitUrl: "https://image-compression-tool-eight.vercel.app",
		stars: 0,
	},
	{
		id: "jxufe-csg-website",
		title: "JXUFE-CSG-Website",
		description: "参与维护的江西财经大学计算机社团网站，fork 自 JUFEWPST。",
		image: "",
		category: "web",
		techStack: ["Vue"],
		status: "completed",
		sourceCode: "https://github.com/Nshpiter/JXUFE-CSG-Website",
		startDate: "2025-06-21",
		tags: ["网站", "社团"],
		stars: 0,
	},
	{
		id: "vscode-gitlens",
		title: "vscode-gitlens",
		description:
			"Visual Studio Code 的 Git 能力增强插件，可视化代码作者归属、Git blame 与代码对比（fork 参与贡献）。",
		image: "",
		category: "other",
		techStack: ["TypeScript", "VSCode Extension"],
		status: "completed",
		liveDemo: "http://gitlens.amod.io",
		sourceCode: "https://github.com/Nshpiter/vscode-gitlens",
		startDate: "2026-02-12",
		tags: ["VSCode", "Git", "插件"],
		stars: 1,
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter(
		(p) => p.status === "completed",
	).length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
