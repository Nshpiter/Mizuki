---
title: "python-Day1"
published: 2025-04-08
category: 学习
---

## 简单的python画图代码学习

`main.py`

```python
# coding: utf-8

from turtle import *
from customer import action

def clean_screen():
    clear()
    penup()
    home()
    pendown()
    showturtle()

def close():
    bye()

def main():
    setup(width=800, height=600, startx=0, starty=0)
    title('按 S 开始绘图，按 D 清除界面，按 Esc 关闭')
    showturtle()
    speed(2)
    onkeyrelease(action, 's')
    onkeyrelease(clean_screen, 'd')
    onkeyrelease(close, 'Escape')
    listen()
    done()

if __name__ == '__main__':
    main()

```

> 简单的学习逻辑画图

**比如:画三角形**

`customer.py`

```python
# coding: utf-8

from turtle import *

def action():
    forward(10)
    right(120)
    forward(10)
    right(120)
    forward(10)
    right(120)

```

第二个正方形：

```python
# coding: utf-8

from turtle import *

def action():
    forward(99)
    right(90)
    forward(99)
    right(90)
    forward(99)
    right(90)
    forward(99)

```

其实是动画的形式的

先学这么多，下次见ξ( ✿＞◡❛)
