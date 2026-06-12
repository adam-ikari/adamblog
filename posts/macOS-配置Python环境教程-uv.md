---
title: macOS 配置 Python 环境（uv 教程）
description: 使用 uv 在 macOS 上配置 Python 环境，管理版本和项目
category: 开发工具
tags: [macOS, uv, Python, 版本管理]
date: 2026-06-09
series:
  - id: series-fluid-simulation
    name: 流体仿真系列
    order: 1
    prev:
    next: /posts/流体仿真入门
---

# macOS 配置 Python 环境（uv 教程）

## 前言：为什么使用 uv 管理 Python

Python 环境管理一直是开发者的痛点。传统的 pip + venv 方式速度慢，conda 环境臃肿，pyenv 版本管理复杂。uv 是 Astral 团队（Ruff 的开发者）推出的新一代 Python 包管理器，用 Rust 编写，具有以下优势：

- **极速**：比 pip 快 10-100 倍
- **一体化**：集成了版本管理、虚拟环境、包管理
- **兼容性好**：完全兼容 pip 和 PyPI 生态
- **轻量**：无额外依赖，单二进制文件

## macOS 上安装 uv

### 方式一：Homebrew（推荐）

```bash
brew install uv
```

### 方式二：官方安装脚本

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

安装完成后验证：

```bash
uv --version
```

## Python 版本管理

uv 可以直接管理 Python 版本，无需安装 pyenv。

### 安装 Python 版本

```bash
# 安装最新稳定版
uv python install

# 安装指定版本
uv python install 3.12
uv python install 3.11 3.12

# 安装特定实现
uv python install pypy3.10
```

### 查看已安装版本

```bash
# 列出所有已安装的 Python
uv python list

# 只查看已安装的
uv python list --only-installed
```

### 固定项目 Python 版本

```bash
# 在项目目录下固定版本
uv python pin 3.12

# 这会创建 .python-version 文件
```

## 创建虚拟环境

### 基本用法

```bash
# 在当前目录创建 .venv（使用固定版本或系统默认）
uv venv

# 指定 Python 版本创建
uv venv --python 3.12

# 指定环境名称
uv venv myenv
```

### 激活虚拟环境

```bash
# 激活环境
source .venv/bin/activate

# 退出环境
deactivate
```

## 项目管理

uv 提供了完整的项目管理功能，类似 Cargo 或 npm。

### 初始化新项目

```bash
# 创建新项目
uv init my-project
cd my-project

# 项目结构
# my-project/
# ├── .python-version
# ├── pyproject.toml
# ├── README.md
# ├── main.py
# └── .venv/
```

### 添加依赖

```bash
# 添加依赖
uv add numpy
uv add pandas matplotlib

# 添加开发依赖
uv add --dev pytest black

# 添加指定版本
uv add "django>=4.0,<5.0"
```

### 同步依赖

```bash
# 根据 pyproject.toml 同步环境
uv sync

# 只同步生产依赖
uv sync --no-dev
```

### 运行命令

```bash
# 在虚拟环境中运行命令
uv run python main.py
uv run pytest
```

## 常用工具安装

uv 可以全局安装命令行工具，类似 pipx。

```bash
# 安装常用工具
uv tool install black
uv tool install ruff
uv tool install mypy
uv tool install ipython

# 从 git 安装
uv tool install --from git+https://github.com/user/repo tool-name

# 查看已安装工具
uv tool list

# 升级工具
uv tool upgrade black

# 卸载工具
uv tool uninstall black
```

## 与 pip/conda 的对比

| 特性 | uv | pip + venv | conda |
|------|-----|------------|-------|
| 安装速度 | 极快 | 慢 | 中等 |
| 版本管理 | 内置 | 需要 pyenv | 内置 |
| 虚拟环境 | 内置 | 需要 venv | 内置 |
| 依赖解析 | 快速准确 | 基础 | 较好 |
| 二进制包 | PyPI wheels | PyPI wheels | conda-forge |
| 锁文件 | uv.lock | 无 | 无 |
| 语言 | Rust | Python | Python |

### 命令对照表

```bash
# pip -> uv
pip install package    -> uv add package
pip install -r req.txt -> uv pip install -r req.txt
pip freeze             -> uv pip freeze
pip list               -> uv pip list

# conda -> uv
conda create -n env    -> uv venv
conda install package  -> uv add package
conda activate env     -> source .venv/bin/activate
```

## 流体仿真项目环境配置示例

以下是一个流体仿真项目的完整配置流程：

```bash
# 1. 创建项目
uv init fluid-simulation
cd fluid-simulation

# 2. 固定 Python 版本
uv python pin 3.12

# 3. 添加核心依赖
uv add numpy scipy matplotlib

# 4. 添加可选依赖
uv add taichi  # GPU 加速
uv add vtk     # 可视化

# 5. 添加开发工具
uv add --dev pytest jupyter

# 6. 同步环境
uv sync

# 7. 运行项目
uv run python simulation.py

# 8. 启动 Jupyter
uv run jupyter lab
```

`pyproject.toml` 示例：

```toml
[project]
name = "fluid-simulation"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "numpy>=1.26",
    "scipy>=1.12",
    "matplotlib>=3.8",
    "taichi>=1.6",
    "vtk>=9.3",
]

[project.optional-dependencies]
dev = ["pytest", "jupyter"]
```

## 常见问题

### Q: uv 和 pip 可以混用吗？

可以，但不推荐。uv 完全兼容 pip，但混用可能导致依赖冲突。建议统一使用 uv。

### Q: 如何从现有项目迁移？

```bash
# 从 requirements.txt 安装
uv pip install -r requirements.txt

# 或者让 uv 管理依赖
uv add $(cat requirements.txt)
```

### Q: 如何处理私有包？

```bash
# 配置私有源
uv pip install --index-url https://private.pypi.org/simple/ package
```

或在 `pyproject.toml` 中配置：

```toml
[[tool.uv.index]]
name = "private"
url = "https://private.pypi.org/simple/"
```

### Q: 环境变量如何配置？

uv 会读取标准环境变量：

```bash
UV_INDEX_URL        # 自定义 PyPI 源
UV_CACHE_DIR        # 缓存目录
UV_PYTHON_INSTALL_DIR  # Python 安装目录
```

### Q: 如何清理缓存？

```bash
# 清理所有缓存
uv cache clean

# 查看缓存信息
uv cache dir
```

## 总结

uv 是目前最优秀的 Python 环境管理工具之一，特别适合：

- 需要快速环境搭建的开发者
- CI/CD 流水线（安装快，缓存友好）
- 多版本 Python 项目
- 追求现代开发体验的团队

对于流体仿真等科学计算项目，uv 的速度优势尤为明显，能大幅提升开发效率。结合 pyproject.toml 的项目管理功能，可以轻松实现可复现的开发环境。

下一篇文章将介绍如何使用这个环境开始流体仿真入门。
