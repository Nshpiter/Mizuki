---
title: "Web 8 [suctf 2019]EasySQL"
published: 2024-12-02
category: CTF
---

![](https://pic.npiter.de/file/1771550075820_20260220091425674.png)

前面用过 SQLMap 自动化注入，这次先尝试手注。

![](https://pic.npiter.de/file/1771550086200_20260220091438166.png)

## 初步 Fuzz

常规的单引号、双引号、括号、数字组合 fuzz 一遍：

![](https://pic.npiter.de/file/1771550092220_20260220091443934.png)

![](https://pic.npiter.de/file/1771550123556_20260220091515522.png)

## 过滤测试

尝试直接输入 flag 或常见 SQL 关键字（`order by`、`union select`、`information_schema`）：

![](https://pic.npiter.de/file/1771550130939_20260220091522918.png)

看来过滤了 flag 等敏感词。

## 堆叠注入

回头看第一种情况，发现可以堆叠注入。

**什么是堆叠注入？**

堆叠注入是指在同一 SQL 查询中执行多个 SQL 语句的能力。MySQL 允许用分号 `;` 分隔多个语句，在同一连接中顺序执行。

**识别方法**：
- 输入分号 `;`，观察是否有异常
- 尝试 `1;SELECT 1`，看返回是否有变化

## 分析返回值规律

尝试输入 `1`、`2`、`3`、`4`：

![](https://pic.npiter.de/file/1771550149125_20260220091548749.png)

发现输出没有规律，到 `4` 时有变化。

猜测后端是逻辑运算，尝试 `query=true` 和 `query=false`：

`query=true` 返回：

```
Array
(
    [0] => 1
)
```

`query=false` 返回：

```
Array
(
    [0] => 0
)
```

无论什么情况下单次注入只返回 0 或 1，推测算法为：

```sql
select $_POST['query'] || 某神秘字符;
```

后端将输入与某神秘字符进行逻辑 OR 运算，这个神秘字符本身是 true（非零）。

## 绕过 flag 过滤

直接输入 `flag,2,3,4` 返回 `Nonono.`，被过滤了。

用 `*` 星号匹配多列，输入 `*,2,3,4`：

![](https://pic.npiter.de/file/1771550172512_20260220091610395.png)

得到 flag！

**`NSSCTF{74bbe503-55b5-45b3-8127-0be82ec04f41}`**

后面发现本题用 SQLMap 注入无效：

![](https://pic.npiter.de/file/1771550175920_20260220091614057.png)

## 总结

- SQL 手注基本方法
- 堆叠注入原理与识别
- 用 `*` 绕过关键词过滤
