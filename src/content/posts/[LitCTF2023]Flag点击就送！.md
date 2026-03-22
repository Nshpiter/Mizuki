---
title: "[LitCTF2023]Flag点击就送！"
published: 2024-11-29
category: CTF
---

![](https://pic.npiter.de/file/1771514312364_20260219231821838.png)

> [!TIP]
>
>
> 题目一开始提示管理员才能拿到flag

![](assets/2.png)

有输入框，想都没想直接填写**admin**

![](https://pic.npiter.de/file/1771514320245_20260219231821840.png)

不出所料诶~~~

> [!NOTE]
>
>
> 那就尝试一下别的随便用户名，诶有个拿flag的按钮，好吧，要==管理员==才可以

![](https://pic.npiter.de/file/1771514330266_20260219231821841.png)

> [!TIP]
>
>
> 那就只能伪造了

### 和之前做过的邮箱重置链接的JWT不同，这里找到session

![](https://pic.npiter.de/file/1771514335635_20260219231821842.png)

> 有点像base64，但我之前研究的一点经验，有点像签名

### 扔给赛博厨子看看

![](https://pic.npiter.de/file/1771514335027_20260219231821843.png)

果然是签名

### 仔细查看网页框架

![](https://pic.npiter.de/file/1771514342145_20260219231821844.png)

> [!NOTE]
>
>
> 是flask框架，这次是session伪造了

查看flask资料和各位师傅的wp

> [!TIP]
>
>
> **flask框架的session是存储在客户端的，那么就需要解决session是否会被恶意纂改的问题，而flask通过一个secret_key，也就是密钥对数据进行签名来防止session被纂改。**

```
  from flask import Flask, request, render_template, session, redirect
from datetime import datetime

app = Flask(__name__)

app.config['SECRET_KEY'] = 'laowangaigebi'  # 设置session加密的密钥

@app.route('/login', methods=['GET', 'POST'])  # 支持get、post请求
def login():  # 登录视图函数
    # 模拟登录成功后把uid和username存到session里
    session['uid'] = '123456'
    session['username'] = 'laowang'
    return redirect('/')  # 登录成功后到首页

@app.route('/', methods=['GET', 'POST'])  # 支持get、post请求
def index():
    username = session.get('username')  # 取session
    if username:
        return 'welcome %s' % username
    else:
        return '请登录'

app.config['DEBUG'] = True
if __name__ == '__main__':
    # 0.0.0.0代表任何能代表这台机器的地址都可以访问
    app.run(host='0.0.0.0', port=5000)  # 运行程序
#flask的加密语言
作者：小源
链接：https://juejin.cn/post/6844903833663963144
来源：稀土掘金

```

### 猜测key

> 由于题目没有给，我们只好猜测key为LitCTF

```python
python flask_session_cookie_manager3.py encode -s 'LitCTF' -t '{"name":"admin"}'
eyJuYW1lIjoiYWRtaW4ifQ.ZUoYpw.-wWfai1NY-VXpGGXHqnCG5H9-Ug

```

使用kali虚拟机运行一下，将得到的session填入cookie-editor保存，刷新后即可拿到flag

> ==NSSCTF{47877fbb-32b0-46ec-bdd6-a926b910870e}==
