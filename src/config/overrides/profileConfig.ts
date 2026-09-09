import type { DeepPartial, ProfileConfig } from "../../types/config";

// 个人资料个性化覆盖
export default {
	avatar: "/images/avatar.webp",
	name: "piter",
	bio: "我们都是阴沟里的虫子，但总还是得有人仰望星空。",
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/Nshpiter",
		},
		{
			name: "Linux.do",
			icon: "material-symbols:forum",
			url: "https://linux.do/u/nshpiter/summary",
		},
	],
} satisfies DeepPartial<ProfileConfig>;
