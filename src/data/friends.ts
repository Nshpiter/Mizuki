// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "秋雨样",
		imgurl: "https://avatars.githubusercontent.com/u/60593418?v=4",
		desc: "会长giegie",
		siteurl: "https://amqyy.cn/",
		tags: ["friend"],
	},
	{
		id: 2,
		title: "慕鸢のblog",
		imgurl: "https://www.muyuanhuck.cn/wp-content/uploads/2025/03/1743151856-4c9b4ff922eceec6cba771bc8e84257968e6bb1a1fd6b224da6c4dd35198211b.png",
		desc: "网安大佬",
		siteurl: "https://www.muyuanhuck.cn",
		tags: ["friend"],
	},
	{
		id: 3,
		title: "spocel的小站",
		imgurl: "https://spocel.de/wp-content/uploads/2025/04/1745776993-GbDld9-bQActQxd.jpg",
		desc: "spocel佬~",
		siteurl: "https://spocel.de/",
		tags: ["friend"],
	},
	{
		id: 4,
		title: "Recopec 的博客",
		imgurl: "https://cdn.jsdelivr.net/gh/Recopec/Recopec.github.io@latest/images/avatar.jpg",
		desc: "HARDWARE, HAM, CTF, SEC, NETWORK",
		siteurl: "https://blog.irec.moe/",
		tags: ["friend"],
	},
	{
		id: 5,
		title: "Heavenの小破站",
		imgurl: "https://pic-bed.dearheaven.cn/img/touxiang.webp",
		desc: "唯有热爱可抵岁月漫长",
		siteurl: "https://www.dearheaven.cn/",
		tags: ["friend"],
	},
	{
		id: 6,
		title: "糖糖球",
		imgurl: "https://img.tantanchugasuki.cn/i/r/avatar",
		desc: "会长酱~",
		siteurl: "https://tantanchugasuki.cn/",
		tags: ["friend"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
