---
title: "简单的一道web题"
published: 2024-10-26
category: 技术
---

## web 工具

中国蚁剑

## 题目来源

新疆大学出的一道 CTF Web 题。

![](https://pic.npiter.de/file/1771507960065_image.png)

![](https://pic.npiter.de/file/1771508001822_image.png)

![](https://pic.npiter.de/file/1771508039219_image.png)

打开题目网站，首先观察页面的图像文字信息，查看源代码：

![](https://pic.npiter.de/file/1771508065411_image.png)

看起来并没有什么东西，再看页面源代码：

![](https://pic.npiter.de/file/1771508078875_image.png)

找到了！题目让我们访问这个隐藏路径。

按照要求访问：

![](https://pic.npiter.de/file/1771508098768_image.png)

进入了一个隐藏页面。

## 中国蚁剑的使用

拿出中国蚁剑：

![](https://pic.npiter.de/file/1771508108515_image.png)

右键添加数据：

![](https://pic.npiter.de/file/1771508148377_image.png)

将网页的 URL 和密码输入（POST 里面就是密码）：

![](https://pic.npiter.de/file/1771508202582_image.png)

连接成功！

![](https://pic.npiter.de/file/1771508215562_image.png)

翻找该网站的目录文件夹：

![](https://pic.npiter.de/file/1771508238488_image.png)

一般来说 flag 放在主目录下：

![](https://pic.npiter.de/file/1771508257755_image.png)

找到了 flag！

![](https://pic.npiter.de/file/1771508264661_image.png)

## 总结

这是一道简单的 Web 题，通过工具**中国蚁剑**操作即可。稍微难一点的 Web 题需要自己上传一句话木马来连接获取 flag。
