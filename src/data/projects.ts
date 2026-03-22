// Project data configuration file
// Used to manage data for the project display page

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
}

export const projectsData: Project[] = [
	{
		id: "npiter-blog",
		title: "piterの小窝",
		description:
			"基于 Mizuki（Astro + Svelte）构建的个人博客，记录 CTF WriteUp、技术笔记和学习心得。从 WordPress 迁移而来，部署于 Cloudflare Pages。",
		image: "",
		category: "web",
		techStack: ["Astro", "Svelte", "TypeScript", "Tailwind CSS", "Cloudflare Pages"],
		status: "in-progress",
		liveDemo: "https://npiter.de",
		sourceCode: "https://github.com/Nshpiter/Mizuki",
		startDate: "2025-12-05",
		featured: true,
		tags: ["博客", "个人网站", "CTF", "技术笔记"],
		visitUrl: "https://npiter.de",
	},
	{
		id: "cloudflare-imgbed",
		title: "CloudFlare 图床",
		description:
			"基于 Cloudflare Pages + R2 搭建的免费图床服务，支持图片上传、管理和外链分享，当前运行于 cfbed.1314883.xyz，用于博客图片托管。",
		image: "",
		category: "web",
		techStack: ["JavaScript", "Cloudflare Pages", "Cloudflare R2"],
		status: "completed",
		liveDemo: "https://cfbed.1314883.xyz",
		sourceCode: "https://github.com/Nshpiter/CloudFlare-ImgBed",
		startDate: "2025-03-08",
		featured: true,
		tags: ["图床", "Cloudflare", "存储"],
		visitUrl: "https://cfbed.1314883.xyz",
	},
	{
		id: "pic-npiter",
		title: "个人图片 CDN",
		description:
			"自建图片 CDN 服务，域名 pic.npiter.de，为博客文章提供稳定的图片外链服务。",
		image: "",
		category: "web",
		techStack: ["Cloudflare", "CDN"],
		status: "completed",
		liveDemo: "https://pic.npiter.de",
		startDate: "2025-01-01",
		tags: ["CDN", "图片托管"],
		visitUrl: "https://pic.npiter.de",
	},
	{
		id: "eridanus",
		title: "Eridanus",
		description:
			"个人探索项目，\"The past holds the key to the future.\" 第一次尝试。",
		image: "",
		category: "other",
		techStack: [],
		status: "planned",
		sourceCode: "https://github.com/Nshpiter/Eridanus",
		startDate: "2025-01-01",
		tags: ["探索", "实验"],
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
