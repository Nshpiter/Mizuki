import type { DeepPartial, SiteConfig } from "../../types/config";

// 站点个性化覆盖（本仓库主站模式，overrides 目录随代码提交）
// 仅声明与上游默认值不同的字段，其余字段深合并自 src/config/siteConfig.ts
export default {
	title: "piterの小窝",
	subtitle: "芽吹き",
	siteURL: "https://npiter.de/", // 请以斜杠结尾

	lang: "zh_CN",

	themeColor: {
		hue: 60, // 黄色主题色
	},

	// 只保留 friends / projects / timeline 三个页面（默认 true，其余关闭）
	featurePages: {
		anime: false,
		diary: false,
		skills: false,
		albums: false,
		devices: false,
		aiTools: false,
	},

	navbarTitle: {
		mode: "text-icon",
		text: "piterの小窝",
		icon: "/images/avatar.webp",
		logo: "/images/avatar.webp",
	},

	banner: {
		// 随机图片 API
		src: {
			desktop: "https://t.alcy.cc/pc",
			mobile: "https://t.alcy.cc/mp",
		},

		carousel: {
			enable: false, // 关闭轮播，每次随机显示一张
		},

		homeText: {
			title: "piterの小窝",
			subtitle: [
				"我们都是阴沟里的虫子，但总还是得有人仰望星空。",
				"永远不要因为需要大量时间才能完成，就放弃梦想，时间怎么样都会过去的",
				"话说回来，现充还真是麻烦啊。——大老师",
				"只要能接近她，我愿意忍受任何肮脏与玷污。",
			],
		},
	},

	favicon: [
		{
			src: "/images/avatar.webp",
			theme: "light",
			sizes: "128x128",
		},
		{
			src: "/images/avatar.webp",
			theme: "dark",
			sizes: "128x128",
		},
	],
} satisfies DeepPartial<SiteConfig>;
