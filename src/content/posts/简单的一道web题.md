---
title: "简单的一道web题"
published: 2024-10-26
category: 技术
---

# 简单的一道web题

## web工具

> 中国蚁剑

## 题目是新疆大学出的一道CTFweb题

![](https://pic.npiter.de/file/1771507960065_image.png)

![](https://pic.npiter.de/file/1771508001822_image.png)

![](https://pic.npiter.de/file/1771508039219_image.png)

> 打开下发的赛题的网站链接，第一步我们应该都是先观察页面的图像文字信息，当然我们要查看源代码😄

![](https://pic.npiter.de/file/1771508065411_image.png)

看起来并没有什么东西，咱们再看页面的源代码

![](https://pic.npiter.de/file/1771508078875_image.png)

找到了呢！题目让我们访问这个

按照要求

![](https://pic.npiter.de/file/1771508098768_image.png)

嘿嘿，进入了一个隐藏页面

## 中国蚁剑的使用

我们拿出中国蚁剑

![](https://pic.npiter.de/file/1771508108515_image.png)

> 右键添加数据

![](https://pic.npiter.de/file/1771508148377_image.png)

> 将网页的URL和密码输入，这里POST里面就是密码

![](https://pic.npiter.de/file/1771508202582_image.png)

连接成功！

![](https://pic.npiter.de/file/1771508215562_image.png)

然后我们就可以翻找该网站的目录文件夹了

![](https://pic.npiter.de/file/1771508238488_image.png)

一般来说放在主目录下

![](https://pic.npiter.de/file/1771508257755_image.png)

找到了flag😄

![](https://pic.npiter.de/file/1771508264661_image.png)

题目解决！！！

## 总结

> 这是一道简单的web题，我们只需要通过工具**中国蚁剑**来操作即可，而其他稍微难一点的web题需要我们自己上传这个一句话木马来连接获取flag
