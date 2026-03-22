---
title: "使用docker搭建一个自己的备忘录Memos"
published: 2024-10-29
category: 技术
---

## 了解一下 Memos

**一款清爽且轻量级备忘录中心：memos**

采用 React + Tailwind + TypeScript + Go 开发的备忘录中心，相当于极简的微博。支持私有/公开备忘录、标签、互动式日历等功能，以及 Docker 部署。

完全开源、自托管的笔记解决方案，专为无缝部署和多平台访问而设计。支持强大的 Markdown 语法。

## 主要特点

- **隐私第一**：掌控您的数据，所有运行时数据安全存储在本地数据库中
- **快速创建**：将内容保存为纯文本，支持 Markdown 快速格式化和共享
- **轻量但功能强大**：采用 Go、React.js 构建，轻量级包中提供强大性能
- **可定制**：轻松定制服务器名称、图标、描述、系统样式
- **开源**：所有代码在 GitHub 上公开
- **免费使用**：完全免费享受所有功能

相关链接：

- [在线体验](https://demo.usememos.com/)
- [GitHub 开源](https://github.com/usememos/memos?tab=readme-ov-file)

Docker 一键部署命令：

```bash
docker run -d --name memos -p 5230:5230 -v ~/.memos/:/var/opt/memos neosmemo/memos:stable
```

安装后通过 `ip:5230` 即可访问。

## 需要准备

1. 安装 Docker Desktop
2. 更换镜像源
3. 拉取 `neosmemo/memos` 镜像

## 下载安装 Docker

打开官网 [docker.com](https://www.docker.com/)：

![](https://pic.npiter.de/file/1771508833016_20260219214704547.png)

安装后打开 Settings，在 Docker Engine 中加入镜像源配置。

## 拉取 neosmemo/memos 容器

在 PowerShell 中运行一键安装命令，或在 Docker Desktop 中搜索拉取：

![](https://pic.npiter.de/file/1771508834187_20260219214704548.png)

![](https://pic.npiter.de/file/1771508840049_20260219214704549.png)

## 打开网站（ip:5230）

网站界面优美，支持丰富的 Markdown，可以用来备忘或写点东西：

![](https://pic.npiter.de/file/1771508844994_20260219214704550.png)

![](https://pic.npiter.de/file/1771508856166_20260219214704551.png)

官方文档：[What is Memos - Memos](https://www.usememos.com/docs)

Markdown 生态丰富：

![](https://pic.npiter.de/file/1771508864112_20260219214704552.png)
