---
title: "SQL injection（Lab5)"
published: 2026-10-14
description: "PortSwigger SQLi 入门：UNION 从其他表取数据 Lab：SQL injection UNION attack, …"
category: "靶场"
---

# PortSwigger SQLi 入门：UNION 从其他表取数据

> Lab：[SQL injection UNION attack, retrieving data from other tables](https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-data-from-other-tables)  
> 原理：[Using a SQL injection UNION attack to retrieve interesting data](https://portswigger.net/web-security/sql-injection/union-attacks#using-a-sql-injection-union-attack-to-retrieve-interesting-data)

## 题目在考什么

前面已经会：定列数、找能塞字符串的列。这题把它们拼起来，用 `UNION` 从 **别的表**（本题是 `users`）把数据打进当前页面的结果里，拿到 `administrator` 的密码并登录。

![](https://pic.npiter.de/file/1791907731248_20261014000837180.png)

## 注入点

仍是类别筛选 `category`。

## 做法

lab 已给出表名、列名。两列都能显示文本时，可直接：

```text
' UNION SELECT username, password FROM users--
```

页面会多出用户名和密码行，用 `administrator` 那组登录即可过关。

![](https://pic.npiter.de/file/1791907816980_20261014001005983.png)

![](https://pic.npiter.de/file/1791907822519_20261014001005984.png)
