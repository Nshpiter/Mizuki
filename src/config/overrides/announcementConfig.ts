import type { AnnouncementConfig, DeepPartial } from "../../types/config";

// 公告栏个性化覆盖
export default {
	content: "欢迎来到 piter 的小窝！",
	link: {
		text: "关于我",
		url: "/about/",
	},
} satisfies DeepPartial<AnnouncementConfig>;
