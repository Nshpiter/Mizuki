---
title: CS61A（Discussion1）
published: 2025-07-30
category: 学习
---

## Q1: 赛跑

```python
def race(x, y):
    """The tortoise always walks x feet per minute, while the hare repeatedly
    runs y feet per minute for 5 minutes, then rests for 5 minutes. Return how
    many minutes pass until the tortoise first catches up to the hare.

    >>> race(5, 7)  # After 7 minutes, both have gone 35 steps
    7
    >>> race(2, 4) # After 10 minutes, both have gone 20 steps
    10
    """
    assert y > x and y <= 2 * x, 'the hare must be fast but not too fast'
    tortoise, hare, minutes = 0, 0, 0
    while minutes == 0 or tortoise - hare:
        tortoise += x
        if minutes % 10 < 5:
            hare += y
        minutes += 1
    return minutes
```

**Bug分析**：循环条件 `tortoise - hare` 等价于 `tortoise != hare`，只有两者路程完全相等才停止，而正确逻辑应是"乌龟追上或超过兔子"（`tortoise >= hare`）。

- **永远运行**：`race(3, 5)` → 在第9分钟乌龟(27)超过兔子(25)，但差值为2不为0，之后差值在正负间跳跃，永远无法为0
- **返回错误值**：`race(4, 6)` → 第8分钟乌龟(32)已超兔子(30)，正确答案应为8，但函数继续运行到第15分钟两者都为60才停止，返回错误的15

## Q2: Fizzbuzz

```python
def fizzbuzz(n):
    i = 1
    while i <= n:
        if i % 3 == 0 and i % 5 == 0:
            print("fizzbuzz")
        elif i % 3 == 0:
            print("fizz")
        elif i % 5 == 0:
            print("buzz")
        else:
            print(i)
        i = i + 1
    return None
```

## Q3: 是素数吗？

```python
def is_prime(n):
    if n == 1:
        return False
    else:
        i = 2
        while i < n:
            if n % i == 0:
                return False
        i = i + 1
    return True
```

## Q4: 唯一数字

```python
def unique_digits(n):
    unique = 0
    while n > 0:
        k = n % 10
        n = n // 10
        if not has_digit(n, k):
            unique = unique + 1
    return unique

def has_digit(n, k):
    assert k >= 0 and k < 10
    while n > 0:
        last = n % 10
        n = n // 10
        if last == k:
            return True
    return False
```
