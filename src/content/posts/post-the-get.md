---
title: post-the-get
published: 2026-02-20
category: CTF
---

打开题目发现他禁止输入和POST，提示我们form表格坏了。

我们打开源代码来修改。

第一次修改尝试了半天，发现大海捞针啊。明明在源代码里面找到了，结果要去元素里面才能改，bushi()

发现要将 `GET` 改成 `POST`，还有删掉 `disable`

经过一段仔细的查找... 删掉后，随便填写用户名和密码即可拿到flag

**Flag**：`shellmates{7HE_w3B_is_w31RD}`
