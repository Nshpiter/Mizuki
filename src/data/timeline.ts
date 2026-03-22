// Timeline data configuration file
// Used to manage data for the timeline page

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string; // If empty, it means current
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: {
		name: string;
		url: string;
		type: "website" | "certificate" | "project" | "other";
	}[];
	icon?: string; // Iconify icon name
	color?: string;
	featured?: boolean;
}

export const timelineData: TimelineItem[] = [
	{
		id: "github-account",
		title: "注册 GitHub 账号",
		description: "开始使用 GitHub 管理代码，踏入开源世界的第一步。",
		type: "achievement",
		startDate: "2024-07-21",
		icon: "fa7-brands:github",
		color: "#6e5494",
		featured: false,
		links: [
			{
				name: "GitHub 主页",
				url: "https://github.com/Nshpiter",
				type: "website",
			},
		],
	},
	{
		id: "wordpress-blog",
		title: "搭建个人博客",
		description:
			"使用 WordPress 在 npiter.de 搭建个人博客，开始记录学习笔记和技术心得，并购买了个人域名。",
		type: "project",
		startDate: "2024-10-19",
		organization: "个人项目",
		skills: ["WordPress", "Linux", "Nginx", "域名配置"],
		achievements: ["成功部署并公开访问", "完成第一篇博客文章"],
		links: [
			{
				name: "npiter.de",
				url: "https://npiter.de",
				type: "website",
			},
		],
		icon: "material-symbols:article",
		color: "#21759b",
		featured: true,
	},
	{
		id: "ctf-start",
		title: "开始参与 CTF 竞赛",
		description:
			"开始接触 CTF（Capture The Flag）网络安全竞赛，参加 NSSCTF 等平台的比赛，深入学习 Web 安全、SQL 注入等知识。",
		type: "achievement",
		startDate: "2024-11-01",
		skills: ["Web 安全", "SQL 注入", "信息收集", "SQLMap"],
		achievements: ["完成 Web 方向多道题目", "开始撰写 WriteUp"],
		icon: "material-symbols:security",
		color: "#e74c3c",
		featured: true,
	},
	{
		id: "cloudflare-imgbed",
		title: "部署 CloudFlare 图床",
		description:
			"基于开源项目在 Cloudflare Pages + R2 上搭建图床服务，解决博客图片托管问题，域名 cfbed.1314883.xyz。",
		type: "project",
		startDate: "2025-03-08",
		organization: "个人项目",
		skills: ["Cloudflare Pages", "Cloudflare R2", "JavaScript"],
		achievements: ["图床成功上线", "博客图片全面迁移至自建图床"],
		links: [
			{
				name: "图床地址",
				url: "https://cfbed.1314883.xyz",
				type: "website",
			},
		],
		icon: "material-symbols:cloud-upload",
		color: "#f39c12",
		featured: false,
	},
	{
		id: "python-learning",
		title: "系统学习 Python",
		description:
			"系统学习 Python 编程语言，从基础语法、函数到文件处理，并参加 CS61A 课程，深入理解计算机科学基础。",
		type: "education",
		startDate: "2025-04-01",
		skills: ["Python", "函数式编程", "算法"],
		achievements: ["完成 CS61A 课程练习", "使用 Python 处理 Excel 数据"],
		icon: "fa7-brands:python",
		color: "#3572A5",
		featured: false,
	},
	{
		id: "mizuki-migration",
		title: "博客迁移至 Mizuki",
		description:
			"将博客从 WordPress 迁移至基于 Astro + Svelte 的 Mizuki 主题，重写所有文章为标准 Markdown 格式，部署至 Cloudflare Pages，获得更快的访问速度和更好的开发体验。",
		type: "project",
		startDate: "2025-12-05",
		organization: "个人项目",
		skills: ["Astro", "Svelte", "TypeScript", "Tailwind CSS", "Cloudflare Pages"],
		achievements: [
			"成功迁移 30+ 篇文章",
			"自定义主题样式",
			"配置随机 Banner 图片",
			"接入个人头像和社交链接",
		],
		links: [
			{
				name: "博客地址",
				url: "https://npiter.de",
				type: "website",
			},
			{
				name: "源码",
				url: "https://github.com/Nshpiter/Mizuki",
				type: "project",
			},
		],
		icon: "material-symbols:rocket-launch",
		color: "#9b59b6",
		featured: true,
	},
];

// Get timeline statistics
export const getTimelineStats = () => {
	const total = timelineData.length;
	const byType = {
		education: timelineData.filter((item) => item.type === "education")
			.length,
		work: timelineData.filter((item) => item.type === "work").length,
		project: timelineData.filter((item) => item.type === "project").length,
		achievement: timelineData.filter((item) => item.type === "achievement")
			.length,
	};

	return { total, byType };
};

// Get timeline items by type
export const getTimelineByType = (type?: string) => {
	if (!type || type === "all") {
		return timelineData.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime(),
		);
	}
	return timelineData
		.filter((item) => item.type === type)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime(),
		);
};

// Get featured timeline items
export const getFeaturedTimeline = () => {
	return timelineData
		.filter((item) => item.featured)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() -
				new Date(a.startDate).getTime(),
		);
};

// Get current ongoing items
export const getCurrentItems = () => {
	return timelineData.filter((item) => !item.endDate);
};

// Calculate total work experience
export const getTotalWorkExperience = () => {
	const workItems = timelineData.filter((item) => item.type === "work");
	let totalMonths = 0;

	workItems.forEach((item) => {
		const startDate = new Date(item.startDate);
		const endDate = item.endDate ? new Date(item.endDate) : new Date();
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
		const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
		totalMonths += diffMonths;
	});

	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
