---
title: "Easyupload 1.0 2.0"
published: 2025-09-07
category: CTF
---

打开网址发现是一个文件上传网站：

![](https://pic.npiter.de/file/1757254537432_image.png)

首先想到传一句话木马，但文件格式要求是 png 或 jpg。尝试用 BurpSuite 改前端，看是否有后端校验。

## 文件上传漏洞基础

**文件上传漏洞**是指程序员对用户文件上传控制不足，导致用户可以越权向服务器上传可执行的动态脚本文件（木马、病毒、WebShell 等）。上传本身没问题，问题在于服务器如何处理上传的文件。

## 1.0 解法

以 `<?php eval($_POST[c]);?>` 为例，用 BurpSuite 将文件名后缀从 `.jpg` 改为 `.php` 发送，发现上传成功：

![](https://pic.npiter.de/file/1757255120424_image.png)

用蚁剑连接，发现给的是假 flag，于是查看 `phpinfo()`，在 environment 里找到真正的 flag。

## 2.0 解法

直接改 `.php` 不行，尝试 `.phtml` 后缀，用蚁剑连接即可拿到 flag。
