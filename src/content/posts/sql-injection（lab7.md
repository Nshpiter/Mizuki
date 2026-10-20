---
title: "SQL injection（Lab7)"
published: 2026-10-19
description: "PortSwigger SQLi 入门：查 MySQL / Microsoft 的库类型与版本 Lab：SQL injection …"
category: "靶场"
---

# PortSwigger SQLi 入门：查 MySQL / Microsoft 的库类型与版本

> Lab：[SQL injection attack, querying the database type and version on MySQL and Microsoft](https://portswigger.net/web-security/sql-injection/examining-the-database/lab-querying-database-version-mysql-microsoft)  
> 原理：[Examining the database in SQL injection attacks](https://portswigger.net/web-security/sql-injection/examining-the-database)

## 题目在考什么

UNION 回显打通之后，下一步常是摸清**后端是哪种库、版本多少**。不同数据库取版本的写法不一样；本题针对 **MySQL / Microsoft**。

## 注入点

类别筛选 `category`（和前面几道 UNION 题同一位置）。

## 步骤

### 1\. 定列数、找可回显列

同前面 UNION 题：`ORDER BY` / `UNION SELECT NULL...` 定列数，再逐列试字符串，确认哪几列能回显文本。本题最终可用 **2 列** 回显。

### 2\. 换成库名 + 版本

MySQL 侧常用内置函数拿当前库名和版本（不必像 Oracle 那样 `FROM dual` / 查 `v$version`）。在能回显的列里放入对应函数即可，例如：

```text
Gifts' union select database(),version() -- -
```

页面打出数据库名和版本字符串，lab 通过。

![](https://pic.npiter.de/file/1792374558725_20261019094916924.png)

## 和 Oracle 那题差在哪

|  | Oracle 题 | 本题（MySQL / Microsoft） |
| --- | --- | --- |
| 取版本 | 常查系统视图（如 `v$version`） | 用内置版本函数 |
| `FROM` | `SELECT` 必须带 `FROM`（常用 `dual`） | 一般不需要 `FROM dual` |
| 注释 | 注意方言差异 | MySQL 常见 `--` 后跟空格；本题用了 `-- -` 也通 |

## 要点

-   列数 / 文本列手法和 UNION 题完全一样，只是 `SELECT` 列表从业务字段换成「库信息」。
-   先确认方言，再查 [cheat sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet) 里 Database version 那一行，别混用 Oracle 写法。
-   `database()` 看当前库，`version()` 看版本；两者一起回显，类型和版本一眼能对上。
