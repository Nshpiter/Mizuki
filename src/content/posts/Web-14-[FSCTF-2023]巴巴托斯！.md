---
title: "Web 14 [FSCTF 2023]巴巴托斯！"
published: 2025-01-12
category: CTF
---

![](https://pic.npiter.de/file/1771551214875_20260220093325208.png)

打开题目：

![](https://pic.npiter.de/file/1771551222079_20260220093325209.png)

发现需要 FSCTF Browser，用 F12 打开 HackBar 修改 User-Agent：

![](https://pic.npiter.de/file/1771551227450_20260220093325210.png)

出现新的提示：

![](https://pic.npiter.de/file/1771551234687_20260220093325211.png)

题目问是不是 local，猜测需要本地 IP，构造 `X-Forwarded-For: 127.0.0.1`：

![](https://pic.npiter.de/file/1771551233788_20260220093325212.png)

没有反应，也没有新提示。于是思考 PHP 伪协议，加入：

```
php://filter/read=convert.base64-encode/resource=flag.php
```

![](https://pic.npiter.de/file/1771551238910_20260220093325213.png)

得到 base64 内容：

```
PD9waHANCiRmbGFnPSJOU1NDVEZ7MjU4NzE2ZjMtNTY1NS00NGNjLWE0MzktYzhhMGZkOTQ5NjcxfSI7DQo/Pg==
```

解码即可：

![](https://pic.npiter.de/file/1771551242873_20260220093325214.png)

**`NSSCTF{258716f3-5655-44cc-a439-c8a0fd949671}`**
