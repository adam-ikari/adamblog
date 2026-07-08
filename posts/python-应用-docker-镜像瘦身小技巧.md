---
title: python 应用 docker 镜像瘦身小技巧
description: Python 应用 Docker 镜像瘦身技巧，通过多阶段构建、精简基础镜像等方法减小镜像体积
category: 还没有分类
date: 2025-03-05
tags:
---

# python 应用 docker 镜像瘦身小技巧
<!--
注释的方法：
在正文需要注释的地方插入下面的代码，根据需要修改编号：
  <sup>[1](#note1)</sup>
在"注"章节插入对应编号的注释内容:
  <div id="note1"></div>
  [1] 这是注的内容
-->

![Python 镜像瘦身六大方法分类图](/posts/python-应用-docker-镜像瘦身小技巧/docker-image-slim-methods.svg)

## 正文

把 Python 应用容器化，Docker 镜像多大，直接影响部署快慢、存储和传输成本。镜像越小，推拉越省事。下面是几个实用的瘦身办法。



### 1. 使用精简的基础镜像

基础镜像选对了，瘦身就成功一半。Python 应用推荐 `python:3.x-slim` 或 `python:3.x-alpine` 这种轻量版。比如 `python:3.9-slim` 大约 60 MB，`python:3.9-alpine` 才 23 MB，比基于 Ubuntu 的镜像小一大截。

```dockerfile
FROM python:3.9-slim
```

### 2. 多阶段构建

多阶段构建是 Docker 里很顶用的一个特性：一个阶段专门编译构建，另一个阶段只负责运行，最后镜像里只留下需要的文件。最终体积能小不少。

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

Dockerfile 里每条 `RUN` 之类指令都会叠一层。把多条命令并到同一个 `RUN` 里，层数少了，镜像也跟着小。

```dockerfile
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*
```

### 4. 使用 `.dockerignore` 文件

`.dockerignore` 能把不该进镜像的文件和目录挡在外面，既减小体积，也能让构建快点。

```plaintext
# .dockerignore 文件示例
.git
__pycache__
*.log
```

### 5. 清理缓存和临时文件

装完依赖，随手把缓存和临时文件清掉，还能再省一点。比如装完 Python 依赖后用 `rm -rf /root/.cache/pip` 把 pip 缓存删了。

```dockerfile
RUN pip install --no-cache-dir -r requirements.txt && \
    rm -rf /root/.cache/pip
```

#### 6. 使用 `--no-install-recommends` 标志

装系统包时加上 `--no-install-recommends`，跳过那些"推荐"但非必需的包，镜像又能小一截。

```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*
```



## 注

无

## 参考

无
