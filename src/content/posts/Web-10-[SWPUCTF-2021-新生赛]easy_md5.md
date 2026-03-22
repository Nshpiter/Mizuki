---
title: "Web 10 [SWPUCTF 2021 新生赛]easy_md5"
published: 2024-12-09
category: CTF
---

![](https://pic.npiter.de/file/1771550430377_20260220092023800.png)

题目说了是MD5，打开网页

![](https://pic.npiter.de/file/1771550439686_20260220092023801.png)

> [!NOTE]
>
>
> 题目意思：
>
>
>
>
> - `name`和`password`是通过GET和POST请求分别传递的参数。
>
> - `name`和`password`必须是不同的字符串（`$name != $password`）。
>
> - 但它们的MD5哈希值必须相同（`md5($name) == md5($password)`）。

既要两变量个值不相同，又要两个变量md5值一样

可以发现此时判断md5值是否一样用的是`==`，这是php的弱类型比较

![](https://pic.npiter.de/file/1771550438303_20260220092023802.png)

#### 方法一：

> 可以使用带0e开头的数字穿进行传递参数，因为php会将0e开头的数字转化为0，故此时md5值相等，而两个变量值不相等

使用hackbar来操作

- load URL

- 在网址后输入/?name=240610708

- password=QLTHNDT

![](https://pic.npiter.de/file/1771550445896_20260220092023803.png)

![](https://pic.npiter.de/file/1771550446837_20260220092023804.png)

拿到flag

> [!NOTE]
>
>
> **name和password 的等号后面只需要输入会被MD5加密为0e开头的数字就行，但是内容不能一模一样。**

**NSSCTF{599b6374-4984-467d-aa61-3181aa93ff43}**

#### 方法二：

看了其他师傅的wp，

> 可以传递数组，如name[]=123,password[]=456，md5不能加密数组，故两个md5返回的都是null

> [!IMPORTANT]
>
>
> 若遇到`===`这样的强类型比较，方法一就失效了，方法二仍然有效，或者还可以使用软件fastcoll进行md5碰撞，生成两个字符串使得他们的md5值相同

故传递数组作为`$name`和`$password`的值

```
$name = array('123');
$password = array('456');

```

或者在URL中传递

```
?name[]=123&password[]=456

```

### 总结

- MD5相关知识

- php的弱类型比较
