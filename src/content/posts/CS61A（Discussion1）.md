---
title: "CS61A（Discussion1）"
published: 2025-07-30
category: 学习
---

### Q1: 赛跑

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
    assert y > x and y  hare`），然后由于兔子开始跑，差距又被拉开，直到未来的某个时刻，两者的路程才恰好相等。这时函数返回的是后面这个“恰好相等”的时刻，而不是第一次“追上或超过”的时刻。

 	- **永远运行（死循环）**：乌龟的路程可能永远无法恰好等于兔子的路程。它可能在某一分钟还落后于兔子，下一分钟就直接超过了兔子，两者路程的差值从一个负数直接跳到一个正数，完美地“跨过”了零。

#### 1. 导致“永远运行”的例子：`race(3, 5)`

我们来手动跟踪一下 `race(3, 5)` 的执行过程。

 	- `x = 3` (乌龟速度)

 	- `y = 5` (兔子速度)

 	- 约束条件检查: `5 > 3` (True) and `5

Minutes
`minutes % 10
Tortoise (乌龟)
Hare (兔子)
`tortoise - hare`
说明

**初始**

0
0
0
循环开始 (`minutes == 0`)

1
True (跑)
3
5
-2

2
True (跑)
6
10
-4

3
True (跑)
9
15
-6

4
True (跑)
12
20
-8

5
True (跑)
15
25
-10

6
False (歇)
18
25
-7

7
False (歇)
21
25
-4

8
False (歇)
24
25
-1

**9**
**False (歇)**
**27**
**25**
**2**
**乌龟超过了兔子！但差值不为0，循环继续**

10
False (歇)
30
25
5

11
True (跑)
33
30
3
兔子又开始跑了

12
True (跑)
36
35
1

13
True (跑)
39
40
-1
兔子又超过了乌龟

你会发现，在第9分钟，乌龟的路程（27）已经超过了兔子（25），但它们的差值是2，不为0。循环没有停止。之后，它们的差值永远无法回到0。乌龟和兔子的路程差值会不断在正负数之间跳跃，但永远不会恰好是0。

因此，`race(3, 5)` 会导致一个无限循环。

#### 2. 导致“返回错误值”的例子：`race(4, 6)`

我们再来跟踪一下 `race(4, 6)` 的执行过程。

 	- `x = 4` (乌龟速度)

 	- `y = 6` (兔子速度)

 	- 约束条件检查: `6 > 4` (True) and `6

Minutes
`minutes % 10
Tortoise (乌龟)
Hare (兔子)
`tortoise - hare`
说明

...
...
...
...
...
（前面几步省略）

7
False (歇)
28
30
-2

**8**
**False (歇)**
**32**
**30**
**2**
**乌龟第一次追上（并超过）兔子！正确答案应为 8**

9
False (歇)
36
30
6
差值不为0，循环继续

10
False (歇)
40
30
10

11
True (跑)
44
36
8

12
True (跑)
48
42
6

13
True (跑)
52
48
4

14
True (跑)
56
54
2

**15**
**True (跑)**
**60**
**60**
**0**
**路程相等！循环停止，函数返回 15**

在这个例子中：

 	- 在第8分钟，乌龟的路程（32）第一次超过了兔子（30）。这才是题目意义上的“第一次追上”，所以正确答案应该是 `8`。

 	- 但是因为代码检查的是 `tortoise == hare`，循环没有在第8分钟停止。

 	- 直到第15分钟，两者的路程才恰好都为60。此时循环停止，函数返回 `15`。

这是一个错误的值，因为它不是**第一次**追上的时间。

### Q2: Fizzbuzz

实现经典的 [*Fizz Buzz* 序列](https://en.wikipedia.org/wiki/Fizz_buzz)。 `fizzbuzz` 函数接受一个正整数 `n`，并为 1 到 `n` 之间的每个整数打印*一行*输出。 对于每个 `i`：

 	- 如果 `i` 可以同时被 3 和 5 整除，则打印 `fizzbuzz`。

 	- 如果 `i` 可以被 3 整除（但不能被 5 整除），则打印 `fizz`。

 	- 如果 `i` 可以被 5 整除（但不能被 3 整除），则打印 `buzz`。

 	- 否则，打印数字 `i`。

尝试使您的 `fizzbuzz` 实现简洁。

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
    "*** YOUR CODE HERE ***"
```

Run in 61A Code

[**提示**]

请注意 `if` 和 `elif` 子句的顺序：首先尝试检查当前数字是否可以同时被 3 和 5 整除，然后检查是否仅能被 3 整除以及是否仅能被 5 整除。

#### 解答：

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
    while i >> is_prime(10)
    False
    >>> is_prime(7)
    True
    >>> is_prime(1) # one is not a prime number!!
    False
    """
    "*** YOUR CODE HERE ***"
```

在 61A 代码中运行

**展示时间**：请用**一句话**概括你们解决 `is_prime` 问题所使用的思路，确保即使不看代码也能理解。 选出一位同学来讲解，然后在 Discord 的 `discuss-queue` 频道发送带有 `@discuss` 标签的消息，内容包括你们的小组编号和 “Prime Time!”。 助教或老师会加入你们的语音频道，听取讲解并给出反馈。

#### 解答：

```python
def is_prime(n):
    """
    >>> is_prime(10)
    False
    >>> is_prime(7)
    True
    >>> is_prime(1) # one is not a prime number!!
    False
    """
    if  n == 1:
        return False
    else:
        i = 2
        while i >> unique_digits(8675309) # All are unique
    7
    >>> unique_digits(13173131) # 1, 3, and 7
    3
    >>> unique_digits(101) # 0 and 1
    2
    """
    "*** YOUR CODE HERE ***"

def has_digit(n, k):
    """Returns whether k is a digit in n.

    >>> has_digit(10, 1)
    True
    >>> has_digit(12, 7)
    False
    """
    assert k >= 0 and k >> unique_digits(8675309) # All are unique
    7
    >>> unique_digits(13173131) # 1, 3, and 7
    3
    >>> unique_digits(101) # 0 and 1
    2
    """
    unique = 0
    while n > 0:
        k = n % 10
        n = n // 10
        if not has_digit(n,k):
            unique = unique + 1
    return unique

def has_digit(n, k):
    """Returns whether k is a digit in n.

    >>> has_digit(10, 1)
    True
    >>> has_digit(12, 7)
    False
    """
    assert k >= 0 and k  0:
        last = n % 10
        n = n // 10
        if last == k:
            return True
    return False
```
