---
title: "[SWPUCTF 2022 新生赛]funny_web"
published: 2026-10-21
description: "[SWPUCTF 2022 新生赛]funny_web 平台：NSSCTF 2637 · 题目页 题面 & 登录 先是一个 …"
category: "CTF"
---

# \[SWPUCTF 2022 新生赛\]funny\_web

平台：NSSCTF 2637 · [题目页](https://www.nssctf.cn/problem/2637)

## 题面 & 登录

先是一个登录页。赛时密码线索要去招新群里找 QQ，复现环境里可以直接用（页面乱填一次也会给提示）：

-   账号：`NSS`
-   密码：`2122693401`

登录后进到 `rea11y.php`，页面直接高亮源码。

## 源码

```php
<?php
error_reporting(0);
header("Content-Type: text/html;charset=utf-8");
highlight_file(__FILE__);
include('flag.php');
if (isset($_GET['num'])) {
    $num = $_GET['num'];
    if ($num != '12345') {
        if (intval($num) == '12345') {
            echo $FLAG;
        }
    } else {
        echo "这为何相等又不相等";
    }
}
```

## 在干嘛（对照读）

GET 传一个 `num`，要同时过两关：

1.  `$num != '12345'` —— 你传的字符串**不能**刚好等于 `12345`（这里用的是弱比较，两个等号那套）
2.  `intval($num) == '12345'` —— 把 `$num` 转成整数之后，又要等于 12345

直接传 `12345` 会进 `else`，打印「这为何相等又不相等」，拿不到 flag。

## 知识点：`intval` 截断 + 弱比较

`intval("……")` 从左往右读数字字符，**碰到第一个不是数字的字符就停下**，前面读到的部分变成整数。

举例：

| 输入 | `intval` 结果 | 和 `'12345'` 弱比较 |
| --- | --- | --- |
| `12345` | 12345 | 相等（但第一关 `$num != '12345'` 过不去） |
| `12345abc` | 12345 | 相等，且字符串本身不等于 `12345` |
| `abc` | 0 | 不相等 |

所以 payload 思路：**前面是目标数字，后面随便跟非数字尾巴**，让「字符串看起来不一样」，但 `intval` 仍吃到 `12345`。

```text
?num=12345abc
```

`12345/`、`12345\` 一类尾巴也行，原理一样。

HackBar 改 GET 参数提交即可。

![](https://pic.npiter.de/file/1792596166686_20261021232244448.png)

## Flag

`NSSCTF{2608520a-e9f7-4338-ab99-91d69b69732f}`
