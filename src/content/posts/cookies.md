---
title: "cookies"
published: 2026-02-20
category: CTF
---

![](https://pic.npiter.de/file/1771552557886_20260220095556779.png)

打开网址，发现 URL 中的 `filename` 参数是 base64 编码，当前值是 `keys.txt` 的编码，但应该改为 `keys.php` 的编码。

## 分析

源码逻辑：

```php
if(isset($_COOKIE['margin']) && $_COOKIE['margin'] == 'margin') {
    // 输出 flag 或关键内容
}
```

请求需要满足两个条件：

- **URL 参数** `filename`：需为 `keys.php` 的 base64 编码 → `a2V5cy5waHA=`（不是 `keys.txt` 的 `a2V5cy50eHQ=`）
- **Cookie** `margin=margin`

flag 在响应中可能不直接显示，需要用 F12 开发者工具查看响应 body 或源码。

注意干扰项：页面默认显示一串乱码 `rfrgrggggggoaihegfdiofi48ty598whrefeoiahfeiafehbaienvdivrbgtubgtrsgbvaerubaufibry`，是误导。

## 解法

目标 URL：

```
http://117.72.52.127:10635/index.php?line=&filename=a2V5cy5waHA=
```

Cookie：

```
margin=margin
```

发包后页面为空，F12 查看响应源码得到 flag。

**`flag{09630950b2b76a43e1bf95d28c106eef}`**
