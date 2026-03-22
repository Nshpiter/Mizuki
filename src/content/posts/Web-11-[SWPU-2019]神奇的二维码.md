---
title: "Web 11 [SWPU 2019]神奇的二维码"
published: 2024-12-09
category: CTF
---

![](https://pic.npiter.de/file/1771550613573_20260220092327509.png)

> 打开题目是图片文件，扫描二维码

![](https://pic.npiter.de/file/1771550620359_20260220092327510.jpg)

是错误的flag

> [!TIP]
>
>
> 于是我们使用010editor打开

> 我们发现了里面暗藏rar文件

![](https://pic.npiter.de/file/1771550617519_20260220092327511.png)

> 打开kali虚拟机，使用binwalk分离文件

![](https://pic.npiter.de/file/1771550629683_20260220092327512.png)

将其放置到桌面上

![](https://pic.npiter.de/file/1771550632022_20260220092327513.png)

#### 1.第一个线索

- **encode.txt中的内容，base64解码后，得到是“看看flag在不在里面^_^.rar”的密 码，得到flag.jpg**

![](https://pic.npiter.de/file/1771550634249_20260220092327514.png)

![](https://pic.npiter.de/file/1771550633495_20260220092327515.png)

#### 2.第二个线索

- **flag.doc中的内容，多次base64解码后的内容是18394.rar的密码，得到good.mp3文件**

> 是的，没错很多次Ctrl+CV，得到了密码

![](https://pic.npiter.de/file/1771550643780_20260220092327516.png)

#### 3.最终线索

> 使用音视频隐写工具-->Audacity.exe打开good.mp3文件

分析可以得到一串摩斯电码

![](https://pic.npiter.de/file/1771550641629_20260220092327517.png)

> [!IMPORTANT]
>
>
> **对摩斯电码进行解码，得到 MORSEISVERYVERYEASY**

提交上去发现错了，尝试改成小写，答案正确

> **NSSCTF{morseisveryveryeasy}**

### 总结

- **010editor使用，base64，binwalk文件分离**
