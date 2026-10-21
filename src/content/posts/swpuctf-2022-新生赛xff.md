---
title: "[SWPUCTF 2022 新生赛]xff"
published: 2026-10-20
description: "[SWPUCTF 2022 新生赛]xff 平台：NSSCTF 2884 · 题目页 题面 页面会提示访问条件，大概两句： Mus …"
category: "CTF"
---

# \[SWPUCTF 2022 新生赛\]xff

平台：NSSCTF 2884 · [题目页](https://www.nssctf.cn/problem/2884)

## 题面

页面会提示访问条件，大概两句：

1.  Must be accessed from Xiaohong's own computer.（必须从「本机」访问）
2.  Must be jump from Home Page.（必须从主页跳转过来）

没有复杂 PHP 源码可读，核心是：**改 HTTP 请求头**，让服务端以为你是本机、而且是从主页过来的。

## 解题过程

工具用 HackBar（Burp / DevTools → Network → Edit and Resend 也行）。

第一关：题面说本机访问。服务端常用「代理转发头」判断客户端 IP，于是加上：

```http
X-Forwarded-For: 127.0.0.1
```

页面变成第二句提示：Must be jump from Home Page.

第二关：再补「来源页」头。本题环境里写成：

```http
Referer: 127.0.0.1
```

两头一起带上后拿到 flag：

![](https://pic.npiter.de/file/1792502967095_20261020212921977.png)

## 知识点：请求不止 URL

一次 HTTP 请求大致是：

```text
方法 + 路径 + 查询参数
一堆 Header（Cookie、User-Agent、X-Forwarded-For、Referer …）
可选的 Body（POST 数据）
```

浏览器地址栏只能改「路径和参数」；**Header 默认看不见**，要用抓包/重放工具改。和之前做过的 babyrce（改 Cookie）是一类思路：服务端读的不只是 `?id=` 这种参数。

### X-Forwarded-For（常简称 XFF）

本意：请求经过反向代理时，代理把「真实客户端 IP」写进这个头，再转给后端。

有的业务（或 CTF 题）会**直接信这个头**当「访客 IP」，于是可以伪造：

```http
X-Forwarded-For: 127.0.0.1
```

`127.0.0.1` 就是本机回环地址。题面写 Xiaohong's own computer / 本机时，优先试它。

注意：真实线上如果盲信 XFF，等于谁都能冒充内网 IP；正确做法是只信任自己的代理写入的值。CTF 里就是在练「服务端读了哪个头」。

### Referer

浏览器从 A 页点链接到 B 页时，请求 B 通常会带：

```http
Referer: https://某站/A页的地址
```

服务端可用它做「必须从某页跳转」之类的弱校验（也常被 CSRF、防盗链用到）。本题第二关要这个头；有的题会要求完整 URL（比如 `http://题目域名/`），本题环境用 `127.0.0.1` 就能过。

拼写提醒：标准头名是 **`Referer`**（少一个 r，历史拼写），不是 Referrer。

### 和 Cookie 的对照（babyrce）

| 头 / 字段 | 常见用途 | 本题 / 旧题 |
| --- | --- | --- |
| Cookie | 会话、身份 | babyrce |
| X-Forwarded-For | 「客户端 IP」 | 本题第一关 |
| Referer | 「从哪页来的」 | 本题第二关 |

看到「本机 / 内网 / admin only / 必须从某某页」这类文案，先想有没有在验 Header，而不是只改 URL。

## Flag

`NSSCTF{th1s_xff_1s_e4ay}`
