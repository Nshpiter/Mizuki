---
title: "[SWPUCTF 2021 新生赛]include"
published: 2026-10-11
description: "[SWPUCTF 2021 新生赛]include [!IMPORTANT] 本题考点：PHP 文件包含、伪协议 php://fi …"
category: "CTF"
---

# \[SWPUCTF 2021 新生赛\]include

> \[!IMPORTANT\]
> 
> 本题考点：PHP 文件包含、伪协议 `php://filter`、用 Base64 把源码读出来。

## 做题

打开环境：

![](https://pic.npiter.de/file/1791686361394_20261011103917534.png)

页面写着「传入一个 file 试试」。所谓传入，就是在 URL 后面加参数，例如：

```text
?file=1
```

![](https://pic.npiter.de/file/1791686364677_20261011103917535.png)

传了之后它把自己的源码吐出来了，还写着 flag 在 `flag.php`。源码最后一行大概是：

```php
include_once($file);
```

也就是说，你传啥文件名，它就拿去包含啥。

我一开始直接试了 `?file=flag.php`，页面没什么有用的明文。后来才明白：PHP 被 `include` 的时候是**当代码跑**的，不会把源码原文展示给你，所以 flag 藏在文件里也看不见。

正确姿势是换一种「只读、不执行」的读法——伪协议 `php://filter`，读的时候先 Base64 一下：

```text
?file=php://filter/read=convert.base64-encode/resource=flag.php
```

页面出现一长串编码：

![](https://pic.npiter.de/file/1791686370033_20261011103917536.png)

丢进 CyberChef 做 Base64 解码：

![](https://pic.npiter.de/file/1791686370279_20261011103917537.png)

flag：`NSSCTF{2a898823-2984-4c62-a67c-72cb51cb819d}`

## 知识点

### include 是啥

PHP 的 `include` / `include_once` 有点像 C 的 `#include`：按名字把另一个文件塞进来一起跑。这题文件名来自 `$_GET['file']`，你能控制包含谁，这就是文件包含。

### 为啥直接包含看不到 flag

`include` 默认把 `.php` **当代码执行**，不会把源码原文吐到页面上。flag 写在变量或注释里，执行完你也看不见。所以要让 PHP「读出内容」，但「别当 PHP 跑」。

### 伪协议是啥

平时 `include("flag.php")` 是普通文件路径，跟 C 里打开一个文件差不多。

PHP 还允许写成 `协议名://一堆参数`。看起来像网址，但很多时候不是真去上网，而是告诉 PHP：别按普通路径打开，换一种方式取数据。官方叫流封装协议，CTF 里习惯叫伪协议。

### 这题用的 php://filter

读文件时可以先套一层过滤器。我们套 Base64，文件内容变成一串编码。这串不是合法 PHP，`include` 就不会执行它，只会把编码吐到页面上，再解码就还原源码。

```text
php://filter/read=convert.base64-encode/resource=flag.php
```

-   `php://filter`：用过滤器来读
-   `read=convert.base64-encode`：读的时候做 Base64
-   `resource=flag.php`：真正要读的文件

格式记住就行：`filter` + 怎么处理 + `resource=文件名`。

和 C 对照：C 的 `fread` 读字节；PHP `include` 默认当代码执行；`php://filter` + Base64 等于先变成「乱码文本」，执行不了，变相把源码读出来。

### 其他常见伪协议

| 写法 | 大概干啥 | 啥时候见 |
| --- | --- | --- |
| `php://filter/...` | 过滤后再读（常配 Base64 看源码） | 文件包含读源码（本题） |
| `file://` | 明确按本地文件读 | 有时强调本地路径 |
| `php://input` | 读本次请求的 body | POST 里塞内容再包含 |
| `data://` | 数据直接写在字符串里 | 有时用来带一段 PHP 代码 |

官方文档：[PHP 手册 · php://](https://www.php.net/manual/zh/wrappers.php.php)

### 和挖洞的关系

任意文件包含在渗透里很常见：读配置、读源码，后面还可能配合别的手段。CTF 里用 `php://filter` 读源码是最基础的一手。

## 小结

-   `file` 能控 → 文件包含
-   直接包含 `.php` 会执行，看不到源码里的 flag
-   伪协议 = 用 `协议://` 换一种读数据的方式
-   `php://filter` + Base64：只读不执行，解码后找 flag
