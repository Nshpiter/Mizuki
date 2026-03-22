---
title: "Web 9 [SWPUCTF 2021 新生赛]Do_you_know_http"
published: 2024-12-05
category: CTF
---

![](https://pic.npiter.de/file/1771550288013_20260220091804276.png)

> [!IMPORTANT]
>
>
> 本题考查burpsuite以及http的相关知识

![](https://pic.npiter.de/file/1771550292509_20260220091804277.png)

题目要求我们使用WLLM浏览器打开，我们使用burpsuite抓包更改

![](https://pic.npiter.de/file/1771550303788_20260220091804278.png)

发现location处有新的地址,跟随重定向进到下一个文件

> [!NOTE]
>
>
> **重定向**就是当用户访问一个网址时，服务器告诉浏览器去访问另一个网址。比如，你输入一个旧的网址，但服务器会自动把你带到新的网址，这就是重定向。简单来说，就是“你本来要去A地，但有人告诉你其实应该去B地”。

访问新的地址

![](https://pic.npiter.de/file/1771550297868_20260220091804279.png)

提示我们使用本地来访问，故添加

```
X-Forwarded-For:127.0.0.1

```

![](https://pic.npiter.de/file/1771550303336_20260220091804280.png)

访问地址即可拿到flag

NSSCTF{51fe3534-cbaa-4dd8-9db5-017bbf9b1cbc}
