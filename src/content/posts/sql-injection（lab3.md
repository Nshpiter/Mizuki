---
title: "SQL injection（Lab3)"
published: 2026-10-13
description: "PortSwigger SQLi 入门：UNION 确定返回列数 Lab：SQL injection UNION attack, …"
category: "靶场"
---

# PortSwigger SQLi 入门：UNION 确定返回列数

> Lab：[SQL injection UNION attack, determining the number of columns returned by the query](https://portswigger.net/web-security/sql-injection/union-attacks/lab-determine-number-of-columns)  
> 原理：[Determining the number of columns required](https://portswigger.net/web-security/sql-injection/union-attacks#determining-the-number-of-columns-required)

## 题目在考什么

做 UNION 注入前，必须先知道原查询返回几列——`UNION` 两边列数必须一致，否则数据库会报错。

## 注入点

类别筛选。点一个分类（如 Accessories）后：

```text
/filter?category=Accessories
```

![](https://pic.npiter.de/file/1791904689455_20261013231756614.png)

## 方法一：ORDER BY（自用）

逐个加大排序列号：

```text
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--
' ORDER BY 4--
```

到 `ORDER BY 4` 报错（或结果明显异常），说明只有 3 列。`ORDER BY` 用的是列的序号，不用知道列名；列号超出范围时数据库会报错，有的站点直接把错误吐回页面，有的只给泛化错误或空结果——只要响应有差异，就能推断列数。

## 方法二：UNION SELECT NULL（官方主推）

一列一列加 `NULL`：

```text
' UNION SELECT NULL--
' UNION SELECT NULL,NULL--
' UNION SELECT NULL,NULL,NULL--
```

列数不对时，常见报错类似：_All queries combined using a UNION… must have an equal number of expressions…_  
列数对上时，结果集多出一行（各列为 NULL）。页面上可能多一行空数据，也可能触发别的异常；最差情况下和「列数不对」看起来一样，这时这种方法就不灵。

为什么用 `NULL`：注入查询和原查询各列类型要兼容，`NULL` 能转成常见类型，成功率最高。

## payload

先 `ORDER BY` 定出 3 列，再提交：

```text
'+UNION+SELECT+NULL,NULL,NULL--
```

页面正常，lab 通过。

![](https://pic.npiter.de/file/1791904695556_20261013231756615.png)

## 小结

| 方法 | 思路 | 优点 |
| --- | --- | --- |
| `ORDER BY n` | 列号超范围就报错 | 往往更快摸出列数 |
| `UNION SELECT NULL…` | 列数对齐才成功 | 直接验证 UNION 能跑通 |

## 附：

在 Oracle 数据库中，每一条 `SELECT` 查询都必须使用 `FROM` 关键字并指定一个有效的表。Oracle 中有一个名为 `dual` 的内置表可用于此目的。因此，在 Oracle 上注入的查询需要如下所示：

```
' UNION SELECT NULL FROM DUAL--`
```
