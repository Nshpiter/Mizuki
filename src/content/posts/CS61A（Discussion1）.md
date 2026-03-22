---
title: "CS61A（Discussion1）"
published: 2025-07-30
category: 学习
---

## Q1: 赛跑

下面的 `race` 函数有时会返回错误的值，有时会永远运行。

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
    assert y > x and y > 0 and x > 0
    tortoise, hare, minutes = 0, 0, 0
    while tortoise - hare:
        tortoise += x
        if minutes % 10 < 5:
            hare += y
        minutes += 1
    return minutes
```

**问题分析：**

- **返回错误值**：函数等待的是乌龟路程恰好**等于**兔子路程，而不是乌龟第一次**追上或超过**兔子。乌龟可能先超过兔子（差值从负变正），然后由于兔子又开始跑，差距拉大，直到未来某一刻两者路程恰好相等才返回。这时返回的不是第一次追上的时刻。

- **永远运行（死循环）**：乌龟路程可能永远无法恰好等于兔子路程——在某分钟还落后，下一分钟直接超过，差值从负数跳到正数，跨过了零点，循环永不终止。

### 导致"永远运行"的例子：`race(3, 5)`

追踪关键节点（`x=3`，`y=5`）：

| Minutes | 状态 | 乌龟 | 兔子 | 差值 | 说明 |
|---------|------|------|------|------|------|
| 8 | 歇 | 24 | 25 | -1 | 乌龟还差一步 |
| **9** | **歇** | **27** | **25** | **+2** | **乌龟超过了兔子，但差值不为0** |
| 13 | 跑 | 39 | 40 | -1 | 兔子又超过了乌龟 |

在第 9 分钟，乌龟路程（27）超过了兔子（25），但差值是 2，不为 0，循环没有停止。之后差值在正负之间跳跃，永远无法回到 0。因此 `race(3, 5)` 导致无限循环。

### 导致"返回错误值"的例子：`race(4, 6)`

追踪关键节点（`x=4`，`y=6`）：

| Minutes | 状态 | 乌龟 | 兔子 | 差值 | 说明 |
|---------|------|------|------|------|------|
| **8** | **歇** | **32** | **30** | **+2** | **乌龟第一次追上（正确答案应为 8）** |
| 15 | 跑 | 60 | 60 | 0 | 路程恰好相等，循环停止，返回 15 |

在第 8 分钟，乌龟第一次超过兔子，正确答案应该是 `8`。但代码检查的是 `tortoise == hare`，没有在第 8 分钟停止，直到第 15 分钟两者路程都为 60 才停止，返回了错误值 `15`。

---

## Q2: Fizzbuzz

实现经典的 Fizz Buzz 序列。`fizzbuzz` 函数接受一个正整数 `n`，为 1 到 `n` 之间的每个整数打印一行输出：

- 能同时被 3 和 5 整除，打印 `fizzbuzz`
- 能被 3 整除（但不被 5 整除），打印 `fizz`
- 能被 5 整除（但不被 3 整除），打印 `buzz`
- 否则，打印数字 `i`

```python
def fizzbuzz(n):
    """
    >>> result = fizzbuzz(16)
    1
    2
    fizz
    4
    buzz
    fizz
    7
    8
    fizz
    buzz
    11
    fizz
    13
    14
    fizzbuzz
    16
    >>> print(result)
    None
    """
    i = 1
    while i <= n:
        if i % 3 == 0 and i % 5 == 0:
            print('fizzbuzz')
        elif i % 3 == 0:
            print('fizz')
        elif i % 5 == 0:
            print('buzz')
        else:
            print(i)
        i += 1
```

> 注意 `if` 和 `elif` 的顺序：先检查能否同时被 3 和 5 整除，再分别检查能否被 3 或 5 整除。

---

## Q3: is_prime

判断 `n` 是否为素数：

```python
def is_prime(n):
    """
    >>> is_prime(10)
    False
    >>> is_prime(7)
    True
    >>> is_prime(1)
    False
    """
    if n == 1:
        return False
    i = 2
    while i < n:
        if n % i == 0:
            return False
        i += 1
    return True
```

---

## Q4: unique_digits

返回 `n` 中不重复数字的个数：

```python
def has_digit(n, k):
    """Returns whether k is a digit in n."""
    assert 0 <= k <= 9
    while n > 0:
        last = n % 10
        n = n // 10
        if last == k:
            return True
    return False

def unique_digits(n):
    """
    >>> unique_digits(8675309)  # All are unique
    7
    >>> unique_digits(13173131)  # 1, 3, and 7
    3
    >>> unique_digits(101)  # 0 and 1
    2
    """
    unique = 0
    while n > 0:
        k = n % 10
        n = n // 10
        if not has_digit(n, k):
            unique += 1
    return unique
```
