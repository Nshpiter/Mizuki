---
title: "python-Day2"
published: 2025-04-09
category: 学习
---

随机图片的 Python 代码，基于 `FastAPI`。

```python
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
import random
import os

# 图片存储目录
IMAGE_DIR = "D:\\Cyber-Space\\AI绘画图片"#IMAGE_DIR里面的地址替换为你的实际地址，注意是反斜杠两个\\

@app.get("/api/today_wife")
async def get_today_wife():
    try:
        # 获取图片列表
        image_files = [f for f in os.listdir(IMAGE_DIR) if os.path.isfile(os.path.join(IMAGE_DIR, f))]
        if not image_files:
            raise HTTPException(status_code=404, detail="No images found")

        # 随机选择图片
        image_file = random.choice(image_files)
        image_path = os.path.join(IMAGE_DIR, image_file)

        # 调试信息
        print(f"Selected image: {image_path}")

        # 返回图片文件
        return FileResponse(image_path)
    except Exception as e:
        # 调试信息
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)

```

**逐行解释：**

- `from fastapi import FastAPI, HTTPException`:

**含义:** 从 `fastapi` 库中导入 `FastAPI` 类和 `HTTPException` 类。

- **作用:**

`FastAPI`: 用于创建 FastAPI 应用实例，是构建 API 的核心类。

- `HTTPException`: 用于在 API 中抛出 HTTP 错误，例如 404 (Not Found) 或 500 (Internal Server Error)。

- `from fastapi.responses import FileResponse`:

**含义:** 从 `fastapi.responses` 模块中导入 `FileResponse` 类。

- **作用:** `FileResponse` 用于直接返回文件内容作为 API 响应，例如图片文件。

- `import random`:

**含义:** 导入 Python 的 `random` 模块。

- **作用:** `random` 模块提供了生成伪随机数的函数，例如 `random.choice()` 用于从列表中随机选择一个元素。

- `import os`:

**含义:** 导入 Python 的 `os` 模块。

- **作用:** `os` 模块提供了与操作系统交互的函数，例如文件和目录操作。

- `# 图片存储目录`:

**含义:** 注释，说明下一行的作用。

- `IMAGE_DIR = "D:\\Cyber-Space\\AI绘画图片"#IMAGE_DIR里面的地址替换为你的实际地址，注意是反斜杠两个\\`:

**含义:** 定义一个常量 `IMAGE_DIR`，存储图片所在的目录。

- **作用:** 指定 API 从哪个目录读取图片。  **务必替换为你的实际图片目录!**  `\\` 是为了在字符串中表示一个反斜杠，因为单个反斜杠有转义的含义。

- `@app.get("/api/today_wife")`:

**含义:** 这是一个装饰器，用于将下面的函数 `get_today_wife` 注册为处理 `/api/today_wife` 路径的 GET 请求的函数。

- **作用:**  当客户端发送一个 GET 请求到 `/api/today_wife` 时，FastAPI 会调用 `get_today_wife` 函数来处理请求。

- `async def get_today_wife():`:

**含义:** 定义一个异步函数 `get_today_wife`，用于处理 API 请求。

- **作用:**

`async`:  关键字表示这是一个异步函数，可以并发处理多个请求，提高 API 的性能。

- `def`:  定义函数的关键字。

- `get_today_wife()`:  函数名。

- `try:`:

**含义:** 开启一个 `try...except` 块，用于捕获可能发生的异常。

- **作用:**  提供错误处理机制，防止程序因错误而崩溃。

- `# 获取图片列表`:

**含义:** 注释，说明下一行的作用。

- `image_files = [f for f in os.listdir(IMAGE_DIR) if os.path.isfile(os.path.join(IMAGE_DIR, f))]`:

**含义:**  使用列表推导式获取 `IMAGE_DIR` 目录下所有文件的文件名列表。

- **作用:**

`os.listdir(IMAGE_DIR)`:  获取 `IMAGE_DIR` 目录下的所有文件和子目录的名称列表。

- `os.path.join(IMAGE_DIR, f)`:  将目录 `IMAGE_DIR` 和文件名 `f` 拼接成完整的路径。

- `os.path.isfile(...)`:  检查拼接后的路径是否为文件 (而不是目录)。

- `[f for f in ... if ...]`:  列表推导式，用于创建一个新的列表，其中包含满足条件的元素。

- `if not image_files:`:

**含义:**  如果 `image_files` 列表为空 (即没有找到任何图片文件)。

- **作用:**  检查是否有图片文件，如果没有，则抛出一个错误。

- `raise HTTPException(status_code=404, detail="No images found")`:

**含义:** 抛出一个 HTTP 404 错误，提示 "No images found"。

- **作用:**  告诉客户端服务器找不到请求的资源 (图片)。

`HTTPException`:  FastAPI 提供的异常类，用于抛出 HTTP 错误。

- `status_code=404`:  设置 HTTP 状态码为 404 (Not Found)。

- `detail="No images found"`:  设置错误的详细信息。

- `# 随机选择图片`:

**含义:** 注释，说明下一行的作用。

- `image_file = random.choice(image_files)`:

**含义:**  从 `image_files` 列表中随机选择一个图片文件名。

- **作用:**  实现随机选择图片的功能。

- `image_path = os.path.join(IMAGE_DIR, image_file)`:

**含义:** 将目录 `IMAGE_DIR` 和随机选择的文件名 `image_file` 拼接成完整的图片路径。

- **作用:**  构建图片的完整路径，以便后续读取图片文件。

- `# 调试信息`:

**含义:** 注释，说明下一行的作用。

- `print(f"Selected image: {image_path}")`:

**含义:**  打印选中的图片路径到控制台。

- **作用:**  用于调试，方便查看程序选择了哪张图片。 `f"..."` 是 f-string，用于格式化字符串。

- `# 返回图片文件`:

**含义:** 注释，说明下一行的作用。

- `return FileResponse(image_path)`:

**含义:** 创建一个 `FileResponse` 对象，将指定路径的图片文件作为 API 响应返回给客户端。

- **作用:**  将图片文件发送给客户端。

- `except Exception as e:`:

**含义:** 捕获 `try` 块中可能发生的任何异常。

- **作用:**  处理异常，防止程序崩溃。

- `# 调试信息`:

**含义:** 注释，说明下一行的作用。

- `print(f"Error: {str(e)}")`:

**含义:**  打印错误信息到控制台。

- **作用:**  方便调试，查看发生了什么错误。

- `raise HTTPException(status_code=500, detail=str(e))`:

**含义:** 抛出一个 HTTP 500 错误，提示 "Internal Server Error"，并将错误信息作为详细信息返回。

- **作用:**  告诉客户端服务器内部发生了错误。

- `if __name__ == "__main__":`:

**含义:**  这是一个 Python 惯用法，表示只有当这个脚本直接运行时，才会执行下面的代码。  如果这个脚本被作为模块导入到其他脚本中，则下面的代码不会执行。

- **作用:**  用于启动 Uvicorn 服务器。

- `import uvicorn`:

**含义:** 导入 `uvicorn` 模块。

- `uvicorn.run(app, host="0.0.0.0", port=5000)`:

**含义:**  使用 Uvicorn 服务器启动 FastAPI 应用。

- **作用:**  启动 Web 服务器，监听指定端口，并处理客户端的请求。

`app`:  要运行的 FastAPI 应用实例。

- `host="0.0.0.0"`:  监听所有可用的网络接口 (允许从任何 IP 地址访问)。

- `port=5000`:  监听的端口号。

#### 关于Fastapi，多用于调用AI接口，下次试试，比如新的openai的response接口
