---
title: "[SWPUCTF 2021 新生赛]re1"
published: 2026-10-19
description: "[SWPUCTF 2021 新生赛]re1 题目：re1 题面 给一个 Windows 可执行文件 re1.exe，跑起来会要你输 …"
category: "CTF"
---

# \[SWPUCTF 2021 新生赛\]re1

题目：[re1](https://www.nssctf.cn/problem/444)

## 题面

给一个 Windows 可执行文件 `re1.exe`，跑起来会要你输入 flag，对了提示 `you are right!`。

## 起手：查壳

DIE（Detect It Easy）打开附件：

![](https://pic.npiter.de/file/1792418935564_20261019220848698.png)

**无壳**，可以直接丢 IDA。有壳时要先脱（比如之前做过的 UPX：`upx -d`），否则 F5 伪代码会很难看或失败。

## IDA 打开 & 看伪代码

1.  IDA 载入 `re1.exe`，等自动分析结束
2.  在函数窗口找到 `main`（或入口附近的 `main`）
3.  光标放在函数里，按 **`F5`** 打开伪代码（Hex-Rays）

```c
int __fastcall main(int argc, const char **argv, const char **envp)
{
  char Str2[1008];
  char Str1[1000];
  int v6;
  int i;

  _main();
  strcpy(Str2, "{34sy_r3v3rs3}");
  printf_0("please put your flag:");
  scanf("%s", Str1);
  for ( i = 0; i <= 665; ++i )
  {
    if ( Str1[i] == 101 )
      Str1[i] = 51;
  }
  for ( i = 0; i <= 665; ++i )
  {
    if ( Str1[i] == 97 )
      Str1[i] = 52;
  }
  v6 = strcmp(Str1, Str2);
  if ( v6 != 0 )
    printf_0("you are wrong,see again!");
  else
    printf_0("you are right!");
  system_0("pause");
  return 0;
}
```

## 知识点：这段程序在干嘛

对照 C 的执行顺序：

1.  `strcpy` 把目标串放进 `Str2`：`{34sy_r3v3rs3}`
2.  `scanf` 读你的输入到 `Str1`
3.  两轮替换（数字是 ASCII）：
    -   `101` → `51`，即字符 **`e` → `3`**
    -   `97` → `52`，即字符 **`a` → `4`**
4.  `strcmp(Str1, Str2) == 0` 才算对

所以：**你的输入经过「e 变 3、a 变 4」之后，必须等于 `{34sy_r3v3rs3}`。**

反推：把目标串里的 `3` 想成可能来自 `e`，`4` 想成可能来自 `a`，能读成单词的还原是：

```text
{34sy_r3v3rs3}  ←反向—  {easy_reverse}
```

正向自检：`easy_reverse` 做同样替换，正好得到 `{34sy_r3v3rs3}`。

## Flag

`NSSCTF{easy_reverse}`

* * *

## IDA 用法（本题用到的 + 入门常备）

本题直接用到：

| 快捷键 | 作用 |
| --- | --- |
| `F5` | 反编译成接近 C 的伪代码 |
| `R` | 把常量当成**字符**显示（`101` → `'e'`） |
| `H` | 显示成**十六进制**（`'e'` → `0x65`） |
| `D` | 显示成**十进制**（回到 `101`） |

注意：`R` 有时不好再按一次切回去，用 `H` / `D` 改显示格式即可。

逆向入门还常摸这些（今天没强依赖，但很快会用到）：

| 操作 | 干嘛 |
| --- | --- |
| `Shift+F12` | 字符串窗口：找 `wrong` / `right` / 疑似 flag 串，双击再 `X` 看引用 |
| `X`（或跳转交叉引用） | 从字符串跳到使用它的代码 |
| `G` | 按地址跳转 |
| `N` | 给变量/函数重命名，伪代码更好读 |
| `;` | 加注释 |
| 空格 | 反汇编 ↔ 图形视图切换（部分版本） |
| `Esc` | 伪代码/窗口里返回上一处 |

**做题固定节奏**（和本题一样）：

1.  DIE 查壳 → 有壳先脱
2.  IDA 打开 → 字符串窗口找提示 → 跟进 `main`
3.  `F5` 读逻辑：输入从哪来、做了什么变换、和谁比较
4.  变换倒过来还原 flag；数字常量用 `R` 看成字符

IDA 功能远不止这些（调试、脚本、结构体……），入门阶段把上面这套练顺就够打新生赛逆向；后面遇到花指令、算法题再加动态调试（`F9`/`F7`/`F8`）也不迟。
