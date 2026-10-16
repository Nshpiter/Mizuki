---
title: "[SWPUCTF 2022 新生赛]ez_ez_php"
published: 2026-10-15
description: "[SWPUCTF 2022 新生赛] ez_ez_php NSSCTF 2640 · Web · PHP 文件包含 + 伪协议 题 …"
category: "CTF"
---

# \[SWPUCTF 2022 新生赛\] ez\_ez\_php

> NSSCTF 2640 · Web · PHP 文件包含 + 伪协议

## 题目源码

```php
<?php
error_reporting(0);
if (isset($_GET['file'])) {
    if ( substr($_GET["file"], 0, 3) === "php" ) {
        echo "Nice!!!";
        include($_GET["file"]);
    }
    else {
        echo "Hacker!!";
    }
} else {
    highlight_file(__FILE__);
}
//flag.php
```

## 在干什么

| 条件 | 行为 |
| --- | --- |
| 没有 `file` | 高亮打印自身源码 |
| `file` 前 3 字符严格等于小写 `php` | 输出 `Nice!!!` 并 `include` 该参数 |
| 其它 | 输出 `Hacker!!` |

注释 `//flag.php` 暗示 flag 相关文件在旁。比较是严格等于小写 `php`（三个等号），所以 `PHP://`、`Php://` 都会被挡。

## 解题

门槛要求参数以 `php` 开头 → 直接走 **`php://` 伪协议**。

用 filter 把目标文件**读出来并 Base64**（避免直接 include 时被当 PHP 执行、或二进制/特殊字符搞乱输出）：

```
?file=php://filter/read=convert.base64-encode/resource=flag.php
```

页面出现 `Nice!!!` 和一长串 Base64 → 丢进 CyberChef / `base64 -d` 解码。

若解码是 PHP 源码，在里面搜 `NSSCTF{`；若仍不对，再试同目录其它文件名（见下）。

本题最终得到：

```
NSSCTF{928fd43c-f4c3-4113-8d14-fae723cdead0}
```

## 为啥「去掉 .php」也能行？

要点：**`resource=` 后面是磁盘上的真实路径/文件名，PHP 不会因为你在做包含就自动补 `.php`。**

-   `resource=flag.php` → 读名为 `flag.php` 的文件
-   `resource=flag` → 读名为 `flag` 的文件（没有后缀）

注释写 `//flag.php` 只是提示「和 flag 有关」，**不保证**唯一文件就叫 `flag.php`。很多题会同时放：

-   `flag.php`：含 PHP 代码（例如赋值、或根本不 echo）
-   `flag` / `flag.txt`：纯文本 flag

所以：

1.  先读 `flag.php` 的 Base64，解码后看源码里有没有 flag
2.  没有或不好抄，再试 `resource=flag`（去掉后缀）——**前提是服务器上真有名叫 `flag` 的文件**；不是「PHP 不需要后缀也能解析」，而是「文件名本来就叫这个」

一句话：**不是 PHP 魔法省略后缀，是换了一个真实存在的文件名。**

## php:// 伪协议

本题要求参数前三个字符严格等于小写 `php`，所以 **`file://` / `data://` / `phar://` / `http://` 都过不了门槛**（它们不以 `php` 开头）。常用且能过关的是：

### 1\. `php://filter`

读文件内容，可挂转换链，**不执行** PHP 代码，适合读源码 / flag 文件。

```
php://filter/read=convert.base64-encode/resource=文件
php://filter/convert.base64-encode/resource=文件
```

还可叠其它 filter（如 `string.rot13`），入门先会 Base64 即可。

### 2\. `php://input`

包含请求 **body**。若能 POST 一段 PHP，可能当代码执行（看 `allow_url_include` 等配置；现代环境常关）。形式：

```
?file=php://input
```

Body 里写 PHP。本题有现成文件可读时，优先 filter。

### 3\. 其它以 `php` 开头的流

`php://stdin`、`php://memory`、`php://temp` 等，题型不同用途不同；新生赛包含题最常见仍是 **filter 读文件**。

## 小结

1.  无参数 → 读源码；有参数 → 必须以 `php` 开头才能 `include`
2.  `php://filter/.../resource=...` 读文件为 Base64，再解码
3.  `.php` 去留取决于**真实文件名**，不是协议自动补后缀
4.  同类题先看前缀限制，再选还能用的 `php://` 包装器

## Flag

```
NSSCTF{928fd43c-f4c3-4113-8d14-fae723cdead0}
```
