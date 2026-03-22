---
title: "Web 9 [SWPUCTF 2021 新生赛]Do_you_know_http"
published: 2024-12-05
category: CTF
---

![](https://pic.npiter.de/file/1771550288013_20260220091804276.png)

本题考查 BurpSuite 以及 HTTP 相关知识。

![](https://pic.npiter.de/file/1771550292509_20260220091804277.png)

题目要求使用 WLLM 浏览器打开，用 BurpSuite 抓包修改 `User-Agent` 即可绕过。

![](https://pic.npiter.de/file/1771550303788_20260220091804278.png)

发现 `Location` 头有新的重定向地址，跟随重定向进入下一个文件。

**重定向**：服务器告诉浏览器去访问另一个地址，就像本来要去 A 地，但被告知应该去 B 地。

访问新地址：

![](https://pic.npiter.de/file/1771550297868_20260220091804279.png)

提示需要从本地访问，添加请求头：

```
X-Forwarded-For: 127.0.0.1
```

![](https://pic.npiter.de/file/1771550303336_20260220091804280.png)

访问即可拿到 flag：

**`NSSCTF{51fe3534-cbaa-4dd8-9db5-017bbf9b1cbc}`**
