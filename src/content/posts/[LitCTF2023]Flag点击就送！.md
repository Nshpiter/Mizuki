---
title: "[LitCTF2023]Flag点击就送！"
published: 2024-11-29
category: CTF
---

![](https://pic.npiter.de/file/1771514312364_20260219231821838.png)

题目一开始提示管理员才能拿到flag。

有输入框，想都没想直接填写 **admin**。

![](https://pic.npiter.de/file/1771514320245_20260219231821840.png)

不出所料，登录失败。那就尝试别的随便用户名，诶有个拿flag的按钮，但要 **管理员** 才可以。

![](https://pic.npiter.de/file/1771514330266_20260219231821841.png)

那就只能伪造了。

## 找到 Session

和之前做过的邮箱重置链接的JWT不同，这里找到的是 session。

![](https://pic.npiter.de/file/1771514335635_20260219231821842.png)

有点像base64，但根据经验，有点像签名。

## 扔给赛博厨子

![](https://pic.npiter.de/file/1771514335027_20260219231821843.png)

果然是签名。

## 仔细查看网页框架

![](https://pic.npiter.de/file/1771514342145_20260219231821844.png)

是 flask 框架，这次是 **session 伪造**。

查看 flask 资料和各位师傅的 wp：

> flask 框架的 session 是存储在客户端的，需要通过 `secret_key` 对数据进行签名来防止 session 被篡改。

Flask session 示例代码：

```python
from flask import Flask, request, render_template, session, redirect
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'laowangaigebi'  # 设置session加密的密钥

@app.route('/login', methods=['GET', 'POST'])
def login():
    session['uid'] = '123456'
    session['username'] = 'laowang'
    return redirect('/')

@app.route('/', methods=['GET', 'POST'])
def index():
    username = session.get('username')
    if username:
        return 'welcome %s' % username
    else:
        return '请登录'

app.config['DEBUG'] = True
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

## 猜测 key

由于题目没有给，猜测 key 为 `LitCTF`，使用 flask-session-cookie-manager 伪造：

```bash
python flask_session_cookie_manager3.py encode -s 'LitCTF' -t '{"name":"admin"}'
# 输出：eyJuYW1lIjoiYWRtaW4ifQ.ZUoYpw.-wWfai1NY-VXpGGXHqnCG5H9-Ug
```

将得到的 session 填入 cookie-editor 保存，刷新后即可拿到 flag。

**Flag：** `NSSCTF{47877fbb-32b0-46ec-bdd6-a926b910870e}`
