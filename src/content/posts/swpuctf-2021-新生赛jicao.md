---
title: "[SWPUCTF 2021 新生赛]jicao"
published: 2026-10-07
description: "[SWPUCTF 2021 新生赛]jicao 题目源码 <?php highlight_file(‘index.php’) …"
category: "CTF"
---

# \[SWPUCTF 2021 新生赛\]jicao

## 题目源码

```php
<?php
highlight_file('index.php');
include("flag.php");
$id = $_POST['id'];
$json = json_decode($_GET['json'], true);

if ($id == "wllmNB" && $json['x'] == "wllm") {
    echo $flag;
}
?>
```

## 思路

打开环境就能看到源码（`highlight_file` 干的事）。要拿到 flag，需要同时满足两个条件：

1.  **POST** 参数 `id` 等于 `wllmNB`
2.  **GET** 参数 `json` 是一段 JSON，解完之后 `$json['x']` 等于 `wllm`

也就是说：URL 里带 query（进 `$_GET`），请求体里带表单（进 `$_POST`）。一次请求可以两种都有，并不冲突。

`json_decode($_GET['json'], true)` 会把字符串 `{"x":"wllm"}` 解成数组，第二个参数 `true` 表示解成关联数组，才能用 `$json['x']` 取值。

JSON 里必须使用双引号，写成单引号会导致解析失败。

## 利用

用 HackBar：

-   URL：`http://node4.anna.nssctf.cn:21134/?json={"x":"wllm"}`
-   打开 **Use POST method**
-   Body：`id=wllmNB`
-   点 **EXECUTE**

也可以使用 curl：

```bash
curl -X POST 'http://node4.anna.nssctf.cn:21134/?json={"x":"wllm"}' -d 'id=wllmNB'
```

## Flag

`NSSCTF{2b388b2d-3a07-4e6f-b70c-7a7ab174c17b}`

![image](https://pic.npiter.de/file/1791347705480_20261007123456383.png)

## 小结

-   审计时先分清每个变量是从 GET 还是 POST 来的
-   看到 `json_decode`，要想清楚传入的必须是合法 JSON 字符串，而不是拆开的字段
-   改请求时，方法（POST）和 URL 参数（GET）可以同时存在
