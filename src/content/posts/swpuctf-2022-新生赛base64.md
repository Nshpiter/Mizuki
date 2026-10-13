---
title: "[SWPUCTF 2022 新生赛]base64"
published: 2026-10-12
description: "[SWPUCTF 2022 新生赛]base64 用 IDA 打开题目，习惯性按 F5 看伪代码，结果落在 start 里，一堆 …"
category: "CTF"
---

# \[SWPUCTF 2022 新生赛\]base64

用 IDA 打开题目，习惯性按 `F5` 看伪代码，结果落在 `start` 里，一堆 `_libc_start_main`，完全不像题目逻辑。

![](https://pic.npiter.de/file/1791809206333_20261012204638731.png)

换个思路：`Shift+F12` 打开字符串窗口。

![](https://pic.npiter.de/file/1791809214076_20261012204638732.png)

直接看到一串 Base64：

`TlNTQ1RGe2Jhc2VfNjRfTlRXUTRaR0ROQzdOfQ==`

丢进 CyberChef 解码，得到 flag：

`NSSCTF{base_64_NTWQ4ZGDNC7N}`

后来在左边 Functions 窗口 `Ctrl+F` 搜 `main`，点进去再 `F5`，逻辑也很直白：调一个子函数（多半是解码）再 `strcmp`，对了就打印 `This is flag!!`。跟字符串窗口里那串对上就通了。

## 知识点：`start` 和 `main` 是两回事

Linux 下 C 程序跑起来，真正第一个进的是叫 `start` 的入口（CRT 启动代码），不是 `main`。`start` 会调用 `_libc_start_main`，由它再去调 `main`，顺带帮准备好参数、环境变量这些。

所以在 IDA 里：

-   刚打开二进制，光标常常停在 `start` 上。这时按 `F5`，反编译出来就是启动代码，看起来像废话，但正常。
-   题目逻辑在 `main`（以及它调用的子函数）里。左边 Functions 窗口搜 `main`，双击进去再 `F5` 就对了。

类比一下：`start` 像操作系统帮你做的「开机自检」，`main` 才是你自己写的程序正文。

## 知识点：`Shift+F12` 看字符串

`Shift+F12` 打开 Strings 窗口，列出二进制里能识别出的可读字符串，大多来自 `.rodata`（只读数据段）。出题人把提示、密文、flag 编码后写进程序时，经常直接出现在这里。

这题里既能看到 Base64 字母表，也能看到那串 `TlNTQ1RG...==`，再解码就行。逆向入门题很常见的路径：先扫字符串找线索，再决定要不要深挖伪代码。

`F5` 看逻辑，`Shift+F12` 找线索，两条路可以配合着用。
