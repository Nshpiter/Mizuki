---
title: "[SWPUCTF 2022 新生赛]numgame"
published: 2026-10-09
description: "[SWPUCTF 2022 新生赛]numgame [!IMPORTANT] 本题考点：前端禁用开发者工具的绕过、从 JS 注释里 …"
category: "CTF"
---

# \[SWPUCTF 2022 新生赛\]numgame

> \[!IMPORTANT\]
> 
> 本题考点：前端禁用开发者工具的绕过、从 JS 注释里挖隐藏路径（Base64）、PHP `call_user_func`、正则过滤的大小写绕过，以及静态方法调用写法 `类名::方法名`。

## 题目现象

打开题目，界面是一个算式：

![](https://pic.npiter.de/file/1791557433933_20261009225029154.png)

试了一下，数字加到 20 会跳回负数，根本点不到正确答案。这说明正确答案不在这个加减按钮上，得换思路。

## 第一步：绕过「禁止 F12」

右键和 `F12` 都无效，常见的 `Ctrl+U` 在这题里也不好使。

换一种打开源码的方式：在地址栏前面加上 `view-source:`，也就是访问：

[view-source:http://node4.anna.nssctf.cn:28998/](view-source:http://node4.anna.nssctf.cn:28998/)

可以正常看到页面源码：

![](https://pic.npiter.de/file/1791557441294_20261009225029155.png)

> \[!NOTE\]
> 
> 网页用 JS 禁止右键 / F12，拦的只是浏览器快捷键，拦不住你直接要源码。`view-source:`、浏览器菜单里的「查看网页源代码」，或先开好开发者工具再进页面，都是常见办法。

源码里引用了 `/js/1.js`，点进去：

![](https://pic.npiter.de/file/1791557452089_20261009225029156.png)

文件末尾有一行注释，长得像 flag，但其实是 **Base64**。解码后得到下一个文件名：`NsScTf.php`。

## 第二步：审计 NsScTf.php

访问 `/NsScTf.php`：

![](https://pic.npiter.de/file/1791557446801_20261009225029157.png)

源码大致如下：

```php
<?php
error_reporting(0);
//hint: 与get相似的另一种请求协议是什么呢
include("flag.php");
class nss{
    static function ctf(){
        include("./hint2.php");
    }
}
if(isset($_GET['p'])){
    if (preg_match("/n|c/m",$_GET['p'], $matches))
        die("no");
    call_user_func($_GET['p']);
}else{
    highlight_file(__FILE__);
}
```

用人话拆开（对照一下 C 的思路）：

1.  **`preg_match("/n|c/m", $_GET['p'])`**：检查你传入的 `p` 里有没有**小写**字母 `n` 或 `c`，有就直接 `no`。
2.  **`call_user_func($_GET['p'])`**：检查过了之后，把 `p` 这段字符串当成「要调用的名字」去执行。有点像按名字去调一个函数。
3.  **`class nss` / `static function ctf`**：PHP 里可以把相关函数收进一个「盒子」——盒子名叫**类**，盒子里的函数叫**方法**。`nss::ctf` 这种写法表示：调用名为 `nss` 的盒子里、名为 `ctf` 的那个函数。`::` 是固定格式。

源码里还 `include` 了 `./hint2.php`，值得打开看看。

## 第三步：hint2.php 的提示

访问 `hint2.php`，页面提示：

![](https://pic.npiter.de/file/1791557453654_20261009225029158.png)

意思是：真正要用的类名是 **`nss2`**，不是源码里写的那个 `nss`。源码里的 `nss` 是障眼法，这一步主要靠提示。

## 第四步：构造 payload

若直接写 `nss2::ctf`，里面全是小写 `n`、`c`，会被正则拦掉。

关键点：**PHP 的函数名、类名、方法名不区分大小写**（这点和 C 不一样）。所以对 PHP 来说 `nss2::ctf` 和 `Nss2::Ctf` 是同一个调用；但对正则 `/n|c/` 来说，大写的 `N`、`C` 不算匹配，可以放行。

于是构造：

```text
/NsScTf.php?p=Nss2::Ctf
```

访问后页面可能看起来是空的（因为内容是 `include` 进来的），再看一次源码就能拿到 flag：

![](https://pic.npiter.de/file/1791557460537_20261009225029159.png)

`NSSCTF{6c42faf1-c1cf-477d-b040-4e0c46e2f809}`

> \[!TIP\]
> 
> 另一条路：`preg_match` 处理不了数组。也可以试 `?p[]=nss2&p[]=ctf`，把 `p` 传成数组来绕过字符串检查。本题用大小写绕过就够了。

## 总结

-   前端禁 F12 ≠ 看不到源码，试试 `view-source:` 或菜单里的查看源代码
-   JS / HTML 注释里常藏 Base64，解一下可能是下一个路径
-   审计时分清：过滤在查什么、调用在执行什么
-   PHP 函数名不区分大小写，可以用来绕只拦小写字母的正则
-   出题人给的 `hint2.php` 要看，真正的类名可能不在你第一眼看到的源码里
