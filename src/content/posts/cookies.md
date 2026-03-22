---
title: "cookies"
published: 2026-02-20
category: CTF
---

![](https://pic.npiter.de/file/1771552557886_20260220095556779.png)

打开网址，得到
发现网址好像是base64，filename后跟keys.php的64编码，不是keys.txt的64编码

```
if(isset($_COOKIE['margin']) && $_COOKIE['margin'] == 'margin') {
    // 输出flag或关键内容
}

```

请求必须携带 `margin=margin` 的cookie。

- **URL参数**：

`filename`：指定要访问的文件，需为base64编码。正确值是 `keys.php`（`a2V5cy5waHA=`），而不是 `keys.txt`（`a2V5cy50eHQ=`）。

- `line`：控制输出行数，`line=0` 或留空（`line=`）可能返回flag。

- **flag位置**：响应页面可能为空，flag需通过开发者工具（F12）查看，可能在：

响应文本（Response）。

- HTML源码。

- 响应头（`Set-Cookie`）。

干扰啊这里有干扰项

- 默认页面显示乱码（`rfrgrggggggoaihegfdiofi48ty598whrefeoiahfeiafehbaienvdivrbgtubgtrsgbvaerubaufibry`），可能是误导。

- 使用 `keys.txt` 而非 `keys.php` 会失败。

解法：url中只需要把文件名改成keys.php的64编码，然后在加上cookie发包，页面为空，f12查看flag
目标URL

```
http://117.72.52.127:10635/index.php?line=&filename=a2V5cy5waHA=

```

- `filename=a2V5cy5waHA=`（`keys.php` 的base64编码）。

- `line=`（空值，或尝试 `line=0`）。

cookie

```
margin=margin

```

得到flag：`flag{09630950b2b76a43e1bf95d28c106eef}`
