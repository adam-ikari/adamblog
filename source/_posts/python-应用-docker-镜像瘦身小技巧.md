---
title: python 应用 docker 镜像瘦身小技巧
toc: false
categories:
  - 还没有分类
date: 2025-03-05 17:03:47
keywords:
description:
tags:
cover:
---

<!--
注释的方法：
在正文需要注释的地方插入下面的代码，根据需要修改编号：
  <sup>[1](#note1)</sup>
在"注"章节插入对应编号的注释内容:
  <div id="note1"></div>
  [1] 这是注的内容
-->

## 正文

在容器化 Python 应用时，Docker 镜像的大小直接影响部署效率、存储成本和传输速度。为了优化这些方面，我们可以通过一些技巧来显著减小 Docker 镜像的体积。以下是一些实用的瘦身小技巧：

<!-- more -->

### 1. 使用精简的基础镜像

选择合适的基础镜像是减小 Docker 镜像大小的第一步。对于 Python 应用，推荐使用 `python:3.x-slim` 或 `python:3.x-alpine` 这样的轻量级镜像。例如，`python:3.9-slim` 镜像的大小约为 60 MB，而 `python:3.9-alpine` 镜像仅 23 MB，比基于 Ubuntu 的镜像小得多。

```dockerfile
FROM python:3.9-slim
```

### 2. 多阶段构建

多阶段构建是 Docker 中的一个强大特性，它允许你在一个阶段中构建应用，并在另一个阶段中运行应用，从而只保留必要的文件。这种方法可以显著减小最终镜像的大小。

```dockerfile
# 构建阶段
FROM python:3.9-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# 运行阶段
FROM python:3.9-slim
WORKDIR /app
COPY --from=builder /app /app
CMD ["python", "app.py"]
```

### 3. 减少镜像层数

每个 Dockerfile 指令（如 `RUN`）都会创建一个新的镜像层。通过将多个命令合并成一个 `RUN` 指令，可以减少镜像层数，从而减小镜像大小。

```dockerfile
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*
```

### 4. 使用 `.dockerignore` 文件

`.dockerignore` 文件可以排除不必要的文件和目录，避免它们被复制到 Docker 镜像中。这有助于减小镜像大小并加快构建速度。

```plaintext
# .dockerignore 文件示例
.git
__pycache__
*.log
```

### 5. 清理缓存和临时文件

在安装依赖后，及时清理缓存和临时文件可以进一步减小镜像大小。例如，在安装 Python 依赖后，可以使用 `rm -rf /root/.cache/pip` 来清理 pip 缓存。

```dockerfile
RUN pip install --no-cache-dir -r requirements.txt && \
    rm -rf /root/.cache/pip
```

#### 6. 使用 `--no-install-recommends` 标志

在安装系统包时，使用 `--no-install-recommends` 标志可以避免安装不必要的推荐包，从而减小镜像大小。

```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*
```

<!-- more -->

## 注

无

## 参考

无
