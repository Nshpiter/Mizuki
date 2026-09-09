import type { DeepPartial, NavBarConfig } from "../../types/config";
import { LinkPreset } from "../../types/config";

// 导航栏菜单个性化覆盖（deepMerge 对数组整体替换，此处提供完整 links）
export default {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		// 分类导航
		{
			name: "分类",
			url: "/archive/",
			icon: "material-symbols:category",
			children: [
				{
					name: "技术",
					url: "/category/技术/",
					icon: "material-symbols:code",
				},
				{
					name: "学习",
					url: "/category/学习/",
					icon: "material-symbols:school",
				},
				{
					name: "CTF",
					url: "/category/CTF/",
					icon: "material-symbols:security",
				},
				{
					name: "生活",
					url: "/category/生活/",
					icon: "material-symbols:favorite",
				},
			],
		},
		{
			name: "关于",
			url: "/about/",
			icon: "material-symbols:info",
			children: [
				{
					name: "关于我",
					url: "/about/",
					icon: "material-symbols:person",
				},
				{
					name: "友人帐",
					url: "/friends/",
					icon: "material-symbols:group",
				},
			],
		},
		{
			name: "更多",
			url: "#",
			icon: "material-symbols:more-horiz",
			children: [
				{
					name: "项目",
					url: "/projects/",
					icon: "material-symbols:work",
				},
				{
					name: "时间线",
					url: "/timeline/",
					icon: "material-symbols:timeline",
				},
			],
		},
	],
} satisfies DeepPartial<NavBarConfig>;
