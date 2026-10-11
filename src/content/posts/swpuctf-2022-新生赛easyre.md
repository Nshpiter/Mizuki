---
title: "[SWPUCTF 2022 新生赛]easyre"
published: 2026-10-10
description: "[SWPUCTF 2022 新生赛]easyre [!IMPORTANT] 考点：用 IDA 看 main 伪代码，读懂简单的输入 …"
category: "CTF"
---

# \[SWPUCTF 2022 新生赛\]easyre

> \[!IMPORTANT\]
> 
> 考点：用 IDA 看 `main` 伪代码，读懂简单的输入与判断。

用 IDA 打开附件，找到 `main`，按 `F5` 看伪代码。

程序会用类似 `scanf` 的方式读入一个整数，再和一个固定值比较；条件成立就打印 flag。伪代码里判断和输出都写得很直白，直接就能看到：

![](https://pic.npiter.de/file/1791596787769_20261010094624927.png)

`NSSCTF{oh_you_find_it}`

> \[!NOTE\]
> 
> 和 babyre 一样，入门逆向优先看 `main` + `F5`。这题多了一层 `if`：先看它在和什么比，再决定要不要真的去跑程序。后面遇上把 flag 拆开或异或的题，套路还是先找到比较的地方，再把逻辑反着算回去。
