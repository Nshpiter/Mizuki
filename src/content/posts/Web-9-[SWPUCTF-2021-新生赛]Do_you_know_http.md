---
title: "Web 9 [SWPUCTF 2021 新生赛]Do_you_know_http"
published: 2024-12-05
updated: 2026-10-07
description: "在SWPUCTF 2021 新生赛中，你是否准备好挑战自己，深入了解HTTP协议的奥秘？本题不仅探讨了Burp Suite的使用技巧，更通过重定向的知识，引导你踏入捕获旗帜的迷人旅程。揭开HTTP背后的秘密，操作WLLM"
category: "CTF"
---

![](https://pic.npiter.de/file/1771550288013_20260220091804276.png)

本题考点：HTTP 请求头（User-Agent、X-Forwarded-For）、重定向，以及用 Burp Suite / HackBar 改包。下面用两种方法各做一遍。

## 前置知识

**User-Agent（UA）**：浏览器在每个请求里自报家门的一行，比如 `Mozilla/5.0 (Windows NT 10.0...) Chrome/...`，服务器靠它判断你用的是什么浏览器。它是客户端自己填的，所以可以改成任何值。

**X-Forwarded-For（XFF）**：本来是代理 / CDN 用来告诉后端"真正的访客 IP 是多少"的请求头。它同样只是请求里的一行普通文字，客户端可以随便写。如果后端直接信任它，写上 `127.0.0.1`（本机地址），服务器就会以为请求来自它自己。

**重定向**就是当用户访问一个网址时，服务器告诉浏览器去访问另一个网址。比如，你输入一个旧的网址，但服务器会自动把你带到新的网址，这就是重定向。简单来说，就是"你本来要去A地，但有人告诉你其实应该去B地"。服务器通过状态码 `302` 加响应头 `Location: 新地址` 来实现。

## 题目分析

![](https://pic.npiter.de/file/1771550292509_20260220091804277.png)

题目提示 `Please use 'WLLM' browser!`，要求我们用 WLLM 浏览器打开。服务器判断浏览器靠的就是 `User-Agent`，所以只要把 UA 改成 `WLLM` 即可。

## 方法一：Burp Suite

### 1\. 伪造 User-Agent

用 Burp Suite 抓包，把 `User-Agent` 改成 `WLLM`。

![](https://pic.npiter.de/file/1771550303788_20260220091804278.png)

发现响应的 `Location` 处有新的地址，跟随重定向进到下一个文件。

### 2\. 伪造本地访问

访问新的地址：

![](https://pic.npiter.de/file/1771550297868_20260220091804279.png)

提示 `You can only read this at local!`，要求本地访问。我们不可能真的在服务器上发请求，所以在请求里添加：

X-Forwarded-For: 127.0.0.1

![](https://pic.npiter.de/file/1771550303336_20260220091804280.png)

响应里出现了下一个地址 `secretttt.php`，带着同样的请求头访问即可拿到 flag。

## 方法二：HackBar

不想开 Burp 的话，用浏览器插件 HackBar 也能做：

1.  URL 填 `http://题目地址/a.php`
    
2.  点 **MODIFY HEADER**，添加两个请求头：
    
    -   `User-Agent: WLLM`
        
    -   `X-Forwarded-For: 127.0.0.1`
        
3.  点 **EXECUTE**，响应里会出现 `secretttt.php`
    
4.  把 URL 换成 `http://题目地址/secretttt.php`，带着同样的请求头再 EXECUTE 一次，拿到 flag
    

![](https://pic.npiter.de/file/1791375177344_20261007201246389.png)

## Flag

NSSCTF{51fe3534-cbaa-4dd8-9db5-017bbf9b1cbc}

## 总结

-   服务器靠请求头判断"你是谁、从哪来"，而请求头是客户端自己填的，**可以伪造**
    
-   遇到"请使用 xx 浏览器"，就改 `User-Agent`
    
-   遇到"只能本地 / 内网访问"，就试 `X-Forwarded-For: 127.0.0.1`，同类的还有 `X-Real-IP`、`Client-IP`
    
-   Burp 和 HackBar 本质上改的是同一个请求包：Burp 适合看完整的请求和响应（比如 `Location`），HackBar 适合快速改参数和请求头
    
-   实战中，一些后台的 IP 白名单、登录次数限制就是因为错误信任 XFF 而被绕过的
    

参考：[MDN - X-Forwarded-For](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Forwarded-For)
