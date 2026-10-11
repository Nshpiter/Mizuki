---
title: "[SWPUCTF 2022 新生赛]xor"
published: 2026-10-10
description: "[SWPUCTF 2022 新生赛]xor [!IMPORTANT] 考点：IDA 读伪代码、ASCII、异或（XOR）加密与还原 …"
category: "CTF"
---

# \[SWPUCTF 2022 新生赛\]xor

> \[!IMPORTANT\]
> 
> 考点：IDA 读伪代码、ASCII、异或（XOR）加密与还原。

## 分析

用 IDA 打开附件，找到 `main`，按 `F5` 看伪代码：

![](https://pic.npiter.de/file/1791598261139_20261010101101571.png)

关键逻辑可以缩成这样：

```c
scanf("%s", v6);  // 读入你输入的 flag
qmemcpy(v4, "LQQAVDyZMP]3q]emmf]uc{]vm]glap{rv]dnce", ...);  // 密文
for (i = 0; i <= 38; ++i) {
    if ((v6[i] ^ 2) != v4[i]) {
        printf("wrong flag");
        return 0;
    }
}
printf("flag is right");
```

用人话讲：程序把你输入的每个字符和数字 `2` 做异或，必须等于密文对应位置。注意这里的 `^` 是**按位异或**，不是平方（C / Python 里平方一般写 `x*x`，Python 幂运算是 `**`）。

## 异或为什么能解密

异或的重要性质：同一个数异或两次会变回原来的值，也就是 `(x ^ k) ^ k == x`。

程序做的是：`明文[i] ^ 2 == 密文[i]`  
所以反过来：`密文[i] ^ 2 == 明文[i]`

手算验证第一个字符：`'L'` 的 ASCII 是 76。

```text
76 = 1001100
 2 = 0000010
-------------
异或  1001110  = 78  → 字符 'N'
```

正好是 `NSSCTF` 的开头。

## 脚本解密

对密文每个字符再 `^ 2`：

```python
s = "LQQAVDyZMP]3q]emmf]uc{]vm]glap{rv]dnce"
print("".join(chr(ord(c) ^ 2) for c in s))
```

含义：`ord` 把字符变成数字 → `^ 2` 异或 → `chr` 变回字符 → `join` 拼成整串。

## Flag

`NSSCTF{XOR_1s_good_way_to_encrypt_flag}`

## 小结

-   逆向先找比较：这里是 `(输入 ^ 2) == 密文`
-   异或可逆，密文再异或同一个常数就能还原
-   C / Python 里 `^` 是异或，不是平方
