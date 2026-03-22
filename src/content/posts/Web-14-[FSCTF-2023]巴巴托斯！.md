---
title: "Web 14 [FSCTF 2023]巴巴托斯！"
published: 2025-01-12
category: CTF
---

![](https://pic.npiter.de/file/1771551214875_20260220093325208.png)

打开题目

![](https://pic.npiter.de/file/1771551222079_20260220093325209.png)

发现需要FSCTF Browser

> 于是构造，F12打开hackbar

![](https://pic.npiter.de/file/1771551227450_20260220093325210.png)

出现新的提示

![](https://pic.npiter.de/file/1771551234687_20260220093325211.png)

猜测题目的意思，题目说问是不是local，猜想127.0.0.1

于是构造

![](https://pic.npiter.de/file/1771551233788_20260220093325212.png)

结果发现没有反应而且没有别的提示出来

思考`伪协议`

于是加入

```
php://filter/read=convert.base64-encode/resource=flag.php

```

![](https://pic.npiter.de/file/1771551238910_20260220093325213.png)

得到base64的内容

> `PD9waHANCiRmbGFnPSJOU1NDVEZ7MjU4NzE2ZjMtNTY1NS00NGNjLWE0MzktYzhhMGZkOTQ5NjcxfSI7DQo/Pg==`

解密即可

![](https://pic.npiter.de/file/1771551242873_20260220093325214.png)

**flag=NSSCTF{258716f3-5655-44cc-a439-c8a0fd949671}**
