---
title: "[SWPUCTF 2022 新生赛]upx"
published: 2026-10-15
description: "[SWPUCTF 2022 新生赛] upx NSSCTF 2653 · 逆向入门 · UPX 壳 + 异或校验 思路 解压题目 …"
category: "CTF"
---

# \[SWPUCTF 2022 新生赛\] upx

> NSSCTF 2653 · 逆向入门 · UPX 壳 + 异或校验

## 思路

1.  解压题目 zip，拿到 exe
2.  DIE 查壳 → 发现 64 位 UPX
3.  `upx -d` 脱壳
4.  IDA 打开，F5 看 `main`
5.  发现异或校验，脚本还原 flag

## 查壳

打开题目给的 zip，拿到 exe，扔进 DIE：

-   64 位
-   有 **UPX** 壳

提示语里的 “ZIPPED / UNZIP” 也在暗示要先脱壳，不然 IDA 里逻辑不好看。  
![](https://pic.npiter.de/file/1792041226293_20261015131337766.png)

## 脱壳

UPX 是最常见的壳之一，标准 UPX 可以用官方工具直接脱（魔改壳另说，要动态调试，这里不展开）：

```bash
upx -d 文件路径
```

脱完再丢进 IDA。

## 伪代码

F5 后核心逻辑大致如下（字段名以 IDA 为准）：

```c
scanf_s("%s", v6);
qmemcpy(v4, "LQQAVDyWRZ]3q]zmpf]uc{]vm]glap{rv]dnce", sizeof(v4));
v5 = 127;
for (i = 0; i <= 38; ++i) {
    if ((v6[i] ^ 2) != v4[i]) {
        puts("wrong flag");
        return 0;
    }
}
```

含义：

-   输入进 `v6`
-   `v4` 里是 38 字节“加密后”的常量
-   循环判断：`输入[i] ^ 2 == 期望[i]`
-   所以还原：`输入[i] = 期望[i] ^ 2`
-   循环是 `i <= 38`，共 **39** 次；`v4` 只有 38 字节，最后一次比的是紧挨着的 `v5`（值为 `127`）

在 C 里 `^` 是按位异或，不是幂。异或同一常数两次会还原：`(x ^ 2) ^ 2 == x`。

## 脚本还原

```python
s = "LQQAVDyWRZ]3q]zmpf]uc{]vm]glap{rv]dnce"
flag = "".join(chr(ord(c) ^ 2) for c in s) + chr(127 ^ 2)
print(flag)
```

## Flag

```
NSSCTF{UPX_1s_xord_way_to_encrypt_flag}
```

## 小结

| 步骤 | 做什么 |
| --- | --- |
| DIE | 确认 UPX |
| `upx -d` | 脱壳 |
| IDA F5 | 找 `scanf` + 循环里的 `^` |
| 注意边界 | `i <= 38` 多吃了后面的 `v5=127` |
| 脚本 | 整串 `^ 2`，再补 `127 ^ 2` → `}` |

下次同类题：字符串 xref → 失败分支旁的 xor/cmp → `input = const ^ key`。
