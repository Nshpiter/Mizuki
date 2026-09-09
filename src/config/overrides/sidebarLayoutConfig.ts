import type { DeepPartial, SidebarLayoutConfig } from "../../types/config";

// 侧边栏组件布局个性化覆盖（恢复原有组件顺序，动画交给上游默认机制）
export default {
	components: {
		left: ["profile", "announcement", "categories", "tags"],
		right: ["site-stats", "calendar", "music-sidebar", "card-toc"],
		drawer: ["profile", "announcement", "music-sidebar", "categories", "tags"],
	},
} satisfies DeepPartial<SidebarLayoutConfig>;
