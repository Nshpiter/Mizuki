import type { DeepPartial, PioConfig } from "../../types/config";

// 看板娘个性化覆盖
// 模型沿用上游默认 NOIR（旧版 pio 模型已在上游 9.0 移除），仅覆盖对话文案
export default {
	dialog: {
		welcome: "欢迎来到 piter 的小窝！",
		touch: ["你在干嘛！", "不许碰我！", "哼！", "别欺负我啦！"],
		home: "点这里返回首页！",
		skin: ["想看我的新造型吗？", "新造型好看吗~"],
		close: "下次见~",
		link: "https://github.com/Nshpiter",
	},
} satisfies DeepPartial<PioConfig>;
