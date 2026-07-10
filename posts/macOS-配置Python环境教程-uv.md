---
title: macOS 配置 Python 环境（uv 教程）
description: 使用 uv 在 macOS 上配置 Python 环境，管理版本和项目
category: 开发工具
tags: [macOS, uv, Python, 版本管理]
recommend: false
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

Python 环境管理一直是开发者的痛点：传统 pip + venv 慢，conda 环境臃肿，pyenv 管版本又麻烦。uv 是 Astral 团队（也就是做 Ruff 那帮人）出的新一代 Python 包管理器，用 Rust 写的，快得离谱——比 pip 快一到两个数量级。它把版本管理、虚拟环境、包管理都收进了一个工具，单二进制文件，不拖家带口，跟 pip 和 PyPI 生态也完全兼容。

![uv 配置 Python 环境全流程](/posts/macOS-配置Python环境教程-uv/uv-python-workflow.svg)

## macOS 上安装 uv

### 方式一：Homebrew（推荐）

如果你已经用 Homebrew 管 Mac 上的软件，直接走这条最省事——和已有工具一条命令统一管理，后续 `brew upgrade` 也会顺手把 uv 一起升了。装完终端里能直接敲 `uv` 就行。

```bash
brew install uv
```

### 方式二：官方安装脚本

没用 Homebrew、或想拿到最新版本，走官方脚本。它会下载 uv 的独立二进制，塞进 `~/.local/bin`（默认路径），并把那行写进你的 shell 配置里。装完如果敲 `uv` 提示找不到命令，多半是 `~/.local/bin` 没在 `PATH` 里，按提示加一下即可。

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

安装完成后验证：

```bash
uv --version
```

## Python 版本管理

uv 自己就能管 Python 版本，不用再装 pyenv。

### 安装 Python 版本

uv 装的 Python 是它自己托管的独立副本，不会动系统自带的 `/usr/bin/python3`——这也是它比 pyenv 省心的地方：不污染系统 Python，多版本互不干扰。不带参数就拉最新稳定版；想锁旧版（比如项目卡在 3.11）就显式给版本号，一次还能装多个。

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

装完心里没底就列一下。默认会把 uv 能识别到的所有 Python（含系统自带、Homebrew 装的、uv 自己装的）都列出来，路径和来源标得清清楚楚；只想看自己亲手装过哪些，加 `--only-installed` 把系统的滤掉。

```bash
# 列出所有已安装的 Python
uv python list

# 只查看已安装的
uv python list --only-installed
```

### 固定项目 Python 版本

进项目目录敲一下，会在当前目录生成一个 `.python-version` 文件，里面就一行版本号。之后 uv 在这个目录下跑任何命令，都默认认这个版本，换台机器、克隆下来也能自动对齐——别把这事交给 README 里一句话提醒，靠文件比靠人记靠谱。

```bash
# 在项目目录下固定版本
uv python pin 3.12

# 这会创建 .python-version 文件
```

## 创建虚拟环境

### 基本用法

裸 `uv venv` 在当前目录建一个 `.venv`，用的就是上一步 pin 住的版本（没 pin 就取系统默认）。想临时换个版本建环境，加 `--python` 指定；要给环境起别的名字（比如同时维护多套）直接把名字当参数传。注意自定义名字的环境 uv 后续不会自动激活，得手动 `source` 那个路径。

```bash
# 在当前目录创建 .venv（使用固定版本或系统默认）
uv venv

# 指定 Python 版本创建
uv venv --python 3.12

# 指定环境名称
uv venv myenv
```

### 激活虚拟环境

`source ... activate` 是把 `.venv` 的路径塞到当前 shell 的 `PATH` 前面，这之后敲 `python`、`pip` 命中的都是虚拟环境里的副本，提示符前面也会多个 `(.venv)` 标记。`deactivate` 是反过来把它从 `PATH` 摘掉、回到系统环境。嫌每次 source 麻烦的话，下面 `uv run` 那种方式可以根本不激活。

```bash
# 激活环境
source .venv/bin/activate

# 退出环境
deactivate
```

## 项目管理

uv 有一套完整的项目管理功能，用法上跟 Cargo 或 npm 很像。

### 初始化新项目

`uv init` 一步把项目骨架搭好——它和 venv 那条路是两回事：venv 只管隔离环境，`init` 是按现代 Python 项目标准（PEP 621）生成 `pyproject.toml` 当配置中心，再附赠一份 `.python-version`、一个 `main.py` 样板和 `.venv`。之后加依赖、锁版本全围绕 `pyproject.toml` 走，不用再手写 `requirements.txt`。

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

`uv add` 不只是装包，它干三件事：解析并下载依赖、写进 `pyproject.toml`、刷新 `uv.lock` 锁文件。`--dev` 把依赖归到 dev 分组，生产环境同步时可以整体跳过。带版本约束的写法（那串引号里的大于小于）是 PEP 440 标准写法，必须加引号，否则 shell 会把 `<` 当重定向吃掉。

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

`uv sync` 按 `uv.lock` 把虚拟环境对齐到锁定的状态——装上该有的、卸掉多余的，所以团队里换台机器跑一遍 `sync` 就能拿到完全一致的环境。CI 里特别认这个。`--no-dev` 用来跑只含生产依赖的精简环境，部署时常用。

```bash
# 根据 pyproject.toml 同步环境
uv sync

# 只同步生产依赖
uv sync --no-dev
```

### 运行命令

`uv run` 会临时拉起项目环境跑命令——自动检查依赖是否同步、没同步先 `sync` 一遍，再在 `.venv` 里执行。好处是不用手动 `activate`，跑脚本、跑测试一行搞定，CI 脚本里也干净。所以前面激活环境嫌麻烦的，全程用 `uv run` 就行。

```bash
# 在虚拟环境中运行命令
uv run python main.py
uv run pytest
```

## 常用工具安装

uv 也能全局装命令行工具，作用类似 pipx。

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

下面拿一个流体仿真项目走一遍完整流程：

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

可以，但不推荐。uv 跟 pip 完全兼容，可混着用容易把依赖搞冲突。建议统一用 uv。

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

uv 是目前最好用的 Python 环境管理工具之一。要快速搭环境的开发者、追求安装快和缓存友好的 CI/CD 流水线、多版本 Python 项目，还有想用上现代开发体验的团队，用它都合适。

对流体仿真这类科学计算项目，uv 的速度优势尤其明显，能省不少等依赖安装的时间。配上 pyproject.toml 的项目管理能力，做出可复现的开发环境很轻松。

下一篇就接着用这套环境开始流体仿真入门。
