---
title: "Python 处理 Excel 基础教程：快速求和（by mihoyo）"
published: 2025-02-22
category: 学习
---

本教程将带你快速入门 Python 处理 Excel 表格，实现最基本的数据求和功能。无需复杂操作，只需几行代码，就能轻松搞定！

**准备工作：**

- **新建 Excel 表格：** 创建一个包含数据的 Excel 文件，例如在 C 列输入一些数字。

- **安装 pandas 库：** 如果未安装，请使用 `pip install pandas` 命令安装。

**核心步骤：**

- **导入 pandas 库：** `import pandas as pd # 可以给 pandas 起个别名，例如 pd`

- **定义 Excel 文件路径：** `file_path = "C:\\Users\\你的用户名\\Desktop\\你的Excel文件.xlsx" # 注意：反斜杠需要转义为双反斜杠`

- **读取 Excel 数据到 DataFrame：** `df = pd.read_excel(file_path, sheet_name="Sheet1") # Sheet1 是工作表名称`

- **求和指定列的数据：** `e = df.iloc[:, 2].sum() # iloc 按位置索引，第 3 列（索引为 2）求和`

- **输出结果：** `print(f"C 列数字之和为 {e}") # 使用 f-string 格式化输出`

**代码总览：**

```python
import pandas as pd

file_path = r"C:\Users\你的用户名\Desktop\你的Excel文件.xlsx"
df = pd.read_excel(file_path, sheet_name="Sheet1")
e = df.iloc[:, 2].sum()
print(f"C 列数字之和为 {e}")
```
