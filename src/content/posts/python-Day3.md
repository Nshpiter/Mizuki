---
title: "python-Day3"
published: 2025-04-12
category: 学习
---

学了点函数调用。

`customer.py`

```python
# coding: utf-8

from turtle import *

# 实现函数，用于画一个正方形
# 参数 x, y 是正方形左上角坐标
# 参数 l 是正方形边长
def square(x, y, l):
    penup()
    goto(x, y)
    pendown()
    setheading(0)
    i = 0
    while i < 4:
        forward(l)
        right(90)
        i += 1
```

明天见！
