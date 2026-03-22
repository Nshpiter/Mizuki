---
title: cookies
published: 2026-02-20
category: CTF
---

打开网址，发现网址好像是base64，filename后跟 keys.php 的64编码，不是 keys.txt 的64编码。

```php
if(isset($_COOKIE['margin']) && $_COOKIE['margin'] == 'margin') {
    // 输出flag或关键内容
}
```

请求必须携带 `margin=margin` 的Cookie。

**URL参数**：
- `filename`：指定要访问的文件，需为base64编码。正确值是 `keys.php`（`a2V5cy5waHA=`），而非 `keys.txt`（`a2V5cy50eHQ=`）
- `line`：控制输出行数，`line=0` 或留空（`line=`）可能返回flag

**Flag位置**：响应页面可能为空，flag需通过开发者工具（F12）查看，可能在响应文本、HTML源码或响应头（Set-Cookie）中。

**目标URL**：
```
http://117.72.52.127:10635/index.php?line=&filename=a2V5cy5waHA=
```

**Cookie**：`margin=margin`

**Flag**：`flag{09630950b2b76a43e1bf95d28c106eef}`
