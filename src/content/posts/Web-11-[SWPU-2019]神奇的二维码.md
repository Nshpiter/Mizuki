---
title: "Web 11 [SWPU 2019]神奇的二维码"
published: 2024-12-09
category: CTF
---

![](https://pic.npiter.de/file/1771550613573_20260220092327509.png)

打开题目是图片文件，扫描二维码：

![](https://pic.npiter.de/file/1771550620359_20260220092327510.jpg)

得到的是错误的 flag。

## 用 010editor 分析

用 010editor 打开图片文件，发现里面暗藏 rar 文件：

![](https://pic.npiter.de/file/1771550617519_20260220092327511.png)

打开 Kali 虚拟机，用 binwalk 分离文件：

![](https://pic.npiter.de/file/1771550629683_20260220092327512.png)

![](https://pic.npiter.de/file/1771550632022_20260220092327513.png)

## 第一个线索

`encode.txt` 中的内容 base64 解码后，得到 "看看flag在不在里面^_^.rar" 的密码，解压得到 `flag.jpg`：

![](https://pic.npiter.de/file/1771550634249_20260220092327514.png)

![](https://pic.npiter.de/file/1771550633495_20260220092327515.png)

## 第二个线索

`flag.doc` 中的内容，多次 base64 解码后得到 `18394.rar` 的密码，解压得到 `good.mp3` 文件：

![](https://pic.npiter.de/file/1771550643780_20260220092327516.png)

## 最终线索：音频隐写

用音视频隐写工具 Audacity 打开 `good.mp3`，分析频谱图得到一串摩斯电码：

![](https://pic.npiter.de/file/1771550641629_20260220092327517.png)

摩斯电码解码得到：`MORSEISVERYVERYEASY`

提交大写发现错误，改成小写后正确。

**`NSSCTF{morseisveryveryeasy}`**

## 总结

- 010editor 查看文件结构，发现隐藏的压缩包
- binwalk 分离嵌入文件
- 多次 base64 解码
- Audacity 音频频谱分析摩斯电码
