---
title: "Web 10 [SWPUCTF 2021 新生赛]easy_md5"
published: 2024-12-09
category: CTF
---

![](https://pic.npiter.de/file/1771550430377_20260220092023800.png)

题目说了是 MD5，打开网页：

![](https://pic.npiter.de/file/1771550439686_20260220092023801.png)

题目条件：
- `name` 通过 GET 传递，`password` 通过 POST 传递
- `name` 和 `password` 必须是**不同**的字符串（`$name != $password`）
- 但它们的 MD5 哈希值必须相同（`md5($name) == md5($password)`）

既要两个值不相同，又要 MD5 值一样。

注意这里用的是 `==`，是 PHP 的**弱类型比较**。

![](https://pic.npiter.de/file/1771550438303_20260220092023802.png)

## 方法一：0e 开头的魔法哈希

PHP 会将 `0e` 开头的字符串作为科学计数法处理，视为 `0`。利用两个 MD5 值都是 `0e...` 开头的字符串：

- `name=240610708`（MD5 为 `0e462097431906509019562988736854`）
- `password=QLTHNDT`（MD5 为 `0e99181294634472991s`）

两者 MD5 在弱类型比较下都等于 `0`，满足 `md5($name) == md5($password)`，而 `$name != $password` 也成立。

用 HackBar 操作：

- Load URL
- 网址后加 `?name=240610708`
- POST body 填 `password=QLTHNDT`

![](https://pic.npiter.de/file/1771550445896_20260220092023803.png)

![](https://pic.npiter.de/file/1771550446837_20260220092023804.png)

**`NSSCTF{599b6374-4984-467d-aa61-3181aa93ff43}`**

## 方法二：传递数组

传递数组让 MD5 无法加密（返回 `null`）：

```
?name[]=123&password[]=456
```

PHP 中 `md5(array)` 返回 `null`，两者相等，同时 `name[] != password[]` 也成立。

> 若遇到 `===` 强类型比较，方法一失效，方法二仍有效。或者用工具 `fastcoll` 进行 MD5 碰撞，生成两个 MD5 值完全相同的字符串。

## 总结

- PHP 弱类型比较（`==` vs `===`）
- MD5 魔法哈希（0e 绕过）
- 数组绕过 MD5 函数
