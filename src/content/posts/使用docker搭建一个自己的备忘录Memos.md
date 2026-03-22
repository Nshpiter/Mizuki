---
title: "使用docker搭建一个自己的备忘录Memos"
published: 2024-10-29
category: 技术
---

## 在开始之前

==*了解一下memos*==

**一款清爽且轻量级备忘录中心：memos**

这是一个采用 React+Tailwind+TypeScript+Go 开发的备忘录中心，相当于极简的微博。支持私有/公开备忘录、标签、互动式日历等功能，以及 Docker 部署。

完全开源、自托管的笔记解决方案，专为无缝部署和多平台访问而设计。体验轻松无痛的纯文本书写，并辅以强大的 Markdown 语法支持，以增强格式设置。

## 主要特点

- **隐私第一**🏠：掌控您的数据。所有运行时数据都安全地存储在您的本地数据库中。

- **快速创建**✍️：将内容保存为纯文本以便快速访问，并支持 Markdown 进行快速格式化和轻松共享。

- **轻量但功能强大**🤲：我们的应用程序采用 Go、React.js 和紧凑的架构构建，在轻量级软件包中提供强大的性能。

- **可定制**🧩：轻松定制您的服务器名称、图标、描述、系统样式和执行脚本，使其独一无二。

- **开源**🦦：Memos 拥抱开源的未来，所有代码均可在 GitHub 上获取，以实现透明度和协作。

- **免费使用**💸：完全免费享受所有功能，任何内容均不收费。
1、在线体验 【**[点击前往](https://demo.usememos.com/)**】
2、Github 开源 【**[链接直达](https://github.com/usememos/memos?tab=readme-ov-file)**】
3、Docker 一键部署命令：

```
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos neosmemo/memos:stable

```

安装后通过ip+端口5230 即可打开访问！

我们需要！！！

> [!NOTE]
>
>
> 我们需要：
>
>
>
>
> - 1.安装docker desktop
>
> - 2.镜像源更换
>
> - 3.pull neosmemo/memos.

## 下载安装docker

> 打开官网链接[docker](https://www.docker.com/)

![](https://pic.npiter.de/file/1771508833016_20260219214704547.png)

安装好之后

打开settings

打开docker engines，加入镜像源即可（自己找哈:smile:）

## 拉取 neosmemo/memos容器

> 在powershell中运行一键安装也行(参考一下官方文档)

![](https://pic.npiter.de/file/1771508834187_20260219214704548.png)

**或者**

![](https://pic.npiter.de/file/1771508840049_20260219214704549.png)

## 然后打开网站（ip+5230端口）

网站界面优美，而且支持丰富的Markdown，可以用来自己备忘，写点东西

![](https://pic.npiter.de/file/1771508844994_20260219214704550.png)

==可以对比一下==

![](https://pic.npiter.de/file/1771508856166_20260219214704551.png)

贴一下官方文档[What is Memos - Memos](https://www.usememos.com/docs)

里面的Markdown生态丰富

![](https://pic.npiter.de/file/1771508864112_20260219214704552.png)

## 开始愉快的使用吧！！！
