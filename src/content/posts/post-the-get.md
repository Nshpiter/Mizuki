---
title: "post-the-get"
published: 2026-02-20
category: CTF
---

![](https://pic.npiter.de/file/1771552619092_20260220095654570.png)

![](https://pic.npiter.de/file/1771552638278_20260220095708645.png)

打开题目发现禁止输入且禁止 POST，提示表单坏了。

打开源代码来修改：

第一次修改尝试了半天，在源代码里找到了，但其实要在元素面板里才能改。

发现需要将 `GET` 改成 `POST`，并删掉 `disabled` 属性。

经过仔细查找，删掉后随便填写用户名和密码即可拿到 flag：

![](https://pic.npiter.de/file/1771552672413_20260220095751349.png)

**`shellmates{7HE_w3B_is_w31RD}`**
