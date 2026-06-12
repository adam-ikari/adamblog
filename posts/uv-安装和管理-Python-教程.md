---
title: 使用 uv 安装和管理 Python
description: 使用 uv 工具管理 Python 版本、虚拟环境和依赖，替代 pyenv、venv 和 pip 的一站式解决方案
category: 开发工具
tags: [uv, Python, 版本管理, 包管理, 开发工具]
date: 2026-06-08
---

# 使用 uv 安装和管理 Python
## 前言：Python 环境管理的痛点

Python 开发者对环境管理的痛苦绝不陌生。从入门第一天起，你就不得不面对以下问题：

- **版本管理混乱**：项目 A 需要 Python 3.10，项目 B 需要 Python 3.12，手动安装切换费时费力
- **虚拟环境繁琐**：`python -m venv` 创建环境，`source` 激活环境，再用 `pip` 安装依赖，步骤多且容易遗忘
- **依赖解析慢**：`pip install` 解析大型项目依赖时动辄几分钟，CI 流水线大量时间花在装包上
- **工具链割裂**：版本管理用 pyenv，虚拟环境用 venv，包管理用 pip，项目管理用 poetry，工具之间互不兼容

如果你受够了这些，那么 **uv** 就是你要找的答案。

## uv 介绍

### uv 是什么

uv 是由 Astral 团队（Ruff 的创造者）用 Rust 编写的极速 Python 包管理器。它用一个工具替代了 pip、pip-tools、virtualenv、pyenv、poetry 等一整套工具链，提供从 Python 安装到项目管理的全流程解决方案。

### 与其他工具对比

| 特性 | uv | pip | conda | poetry | pyenv |
|------|-----|-----|-------|--------|-------|
| 实现语言 | Rust | Python | Python/C++ | Python | Shell |
| 安装速度 | 极快（10-100x） | 慢 | 较慢 | 较慢 | N/A |
| Python 版本管理 | 内置 | 无 | 内置 | 无 | 专精 |
| 虚拟环境管理 | 内置 | 需 venv | 内置 | 内置 | 无 |
| 依赖解析 | 全局缓存+并行 | 串行 | 串行 | 串行 | N/A |
| 锁文件 | uv.lock | 无 | 无 | poetry.lock | N/A |
| 项目管理 | 内置 | 无 | 无 | 内置 | 无 |
| 工具安装 | uv tool | pipx | 无 | 无 | 无 |

### uv 的核心优势

- **速度极快**：得益于 Rust 实现和全局包缓存，安装依赖比 pip 快 10-100 倍
- **功能全面**：一个工具覆盖 Python 安装、版本管理、虚拟环境、包管理、项目管理、工具安装
- **兼容性好**：兼容 pyproject.toml 标准，支持 requirements.txt，迁移成本低
- **可靠性强**：严格的依赖解析和锁文件，确保环境可复现

## 安装 uv

### Linux / macOS 安装

使用官方安装脚本：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

安装脚本会自动完成以下操作：

1. 下载最新版本的 uv 二进制文件到 `~/.local/bin/` 目录
2. 将 `~/.local/bin` 添加到 PATH（如果尚未添加）
3. 在 Shell 配置文件中添加环境变量

安装完成后，重新加载 Shell 配置：

```bash
source ~/.bashrc  # 或 source ~/.zshrc
```

### Windows 安装

使用 PowerShell 安装脚本：

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

也可以通过 Scoop 安装：

```powershell
scoop install uv
```

或通过 Winget 安装：

```powershell
winget install astral-sh.uv
```

### 通过 pip 安装

如果已有 Python 环境，也可以通过 pip 安装：

```bash
pip install uv
```

### 验证安装

安装完成后，运行以下命令验证：

```bash
uv --version
```

输出示例：

```
uv 0.7.8
```

如果看到版本号输出，说明 uv 已安装成功。如果提示 `uv: command not found`，请检查 `~/.local/bin` 是否在 PATH 中。

## Python 版本管理

uv 内置了 Python 版本管理功能，无需额外安装 pyenv。

### uv python install - 安装 Python 版本

安装最新的稳定版 Python：

```bash
uv python install
```

输出示例：

```
Installed Python 3.13.3 in 1.28s
 + cpython-3.13.3-linux-gnu-x86_64-gnu
```

安装指定版本：

```bash
uv python install 3.12
```

输出示例：

```
Installed Python 3.12.10 in 1.05s
 + cpython-3.12.10-linux-gnu-x86_64-gnu
```

同时安装多个版本：

```bash
uv python install 3.10 3.11 3.12
```

输出示例：

```
Installed Python 3.10.16 in 0.92s
 + cpython-3.10.16-linux-gnu-x86_64-gnu
Installed Python 3.11.11 in 0.88s
 + cpython-3.11.11-linux-gnu-x86_64-gnu
Installed Python 3.12.10 in 0.95s
 + cpython-3.12.10-linux-gnu-x86_64-gnu
```

安装 PyPy 版本：

```bash
uv python install pypy3.10
```

::: tip 提示
uv 下载的 Python 版本存放在 `~/.local/share/uv/python/` 目录下，不会影响系统已有的 Python 安装。
:::

### uv python list - 查看可用版本

查看本地已安装的 Python 版本：

```bash
uv python list --only-installed
```

输出示例：

```
cpython-3.10.16-linux-gnu-x86_64-gnu    <download available>
cpython-3.11.11-linux-gnu-x86_64-gnu    <download available>
cpython-3.12.10-linux-gnu-x86_64-gnu    <download available>
cpython-3.13.3-linux-gnu-x86_64-gnu     /home/user/.local/share/uv/python/cpython-3.13.3-linux-gnu-x86_64-gnu/install/bin/python3.13
```

查看所有可安装的 Python 版本：

```bash
uv python list
```

输出示例（截取部分）：

```
cpython-3.8.20-linux-gnu-x86_64-gnu     <download available>
cpython-3.9.21-linux-gnu-x86_64-gnu     <download available>
cpython-3.10.16-linux-gnu-x86_64-gnu    <download available>
cpython-3.11.11-linux-gnu-x86_64-gnu    <download available>
cpython-3.12.10-linux-gnu-x86_64-gnu    <download available>
cpython-3.13.3-linux-gnu-x86_64-gnu     <download available>
pypy3.10-linux-gnu-x86_64-gnu           <download available>
graalpy-3.11-linux-gnu-x86_64-gnu       <download available>
```

按主版本号过滤：

```bash
uv python list 3.12
```

输出示例：

```
cpython-3.12.10-linux-gnu-x86_64-gnu    <download available>
```

### uv python pin - 固定项目 Python 版本

在项目目录下固定 Python 版本，会创建 `.python-version` 文件：

```bash
uv python pin 3.12
```

输出示例：

```
Pinned `.python-version` to `3.12`
```

查看生成的 `.python-version` 文件：

```
3.12
```

固定具体小版本：

```bash
uv python pin 3.12.10
```

输出示例：

```
Pinned `.python-version` to `3.12.10`
```

::: tip 提示
建议将 `.python-version` 文件加入版本控制，确保团队成员使用一致的 Python 版本。
:::

### uv python find - 查找 Python 解释器

查找系统中的 Python 解释器：

```bash
uv python find
```

输出示例：

```
/home/user/.local/share/uv/python/cpython-3.13.3-linux-gnu-x86_64-gnu/install/bin/python3.13
```

查找指定版本的 Python：

```bash
uv python find 3.12
```

输出示例：

```
/home/user/.local/share/uv/python/cpython-3.12.10-linux-gnu-x86_64-gnu/install/bin/python3.12
```

查找系统自带的 Python（不使用 uv 安装的）：

```bash
uv python find --system 3.11
```

输出示例：

```
/usr/bin/python3.11
```

## 虚拟环境管理

### uv venv - 创建虚拟环境

在当前目录创建虚拟环境：

```bash
uv venv
```

输出示例：

```
Using CPython 3.13.3 interpreter at: /home/user/.local/share/uv/python/cpython-3.13.3-linux-gnu-x86_64-gnu/install/bin/python3.13
Creating virtual environment at: .venv
Activate with: source .venv/bin/activate
```

指定 Python 版本创建虚拟环境：

```bash
uv venv --python 3.12
```

输出示例：

```
Using CPython 3.12.10 interpreter at: /home/user/.local/share/uv/python/cpython-3.12.10-linux-gnu-x86_64-gnu/install/bin/python3.12
Creating virtual environment at: .venv
Activate with: source .venv/bin/activate
```

指定虚拟环境目录名：

```bash
uv venv .env
```

输出示例：

```
Using CPython 3.13.3 interpreter at: /home/user/.local/share/uv/python/cpython-3.13.3-linux-gnu-x86_64-gnu/install/bin/python3.13
Creating virtual environment at: .env
Activate with: source .env/bin/activate
```

::: tip 提示
如果指定的 Python 版本尚未安装，uv 会自动下载安装后再创建虚拟环境。
:::

### 激活虚拟环境

Linux / macOS 激活虚拟环境：

```bash
source .venv/bin/activate
```

Windows 激活虚拟环境：

```powershell
.venv\Scripts\activate
```

激活后，终端提示符会显示虚拟环境名称：

```
(.venv) user@host:~/project$
```

退出虚拟环境：

```bash
deactivate
```

### 在虚拟环境中安装包

使用 `uv pip install` 在虚拟环境中安装包：

```bash
uv pip install requests
```

输出示例：

```
Resolved 5 packages in 12ms
Installed 5 packages in 18ms
 + certifi==2025.4.26
 + charset-normalizer==3.4.2
 + idna==3.10
 + requests==2.32.3
 + urllib3==2.4.0
```

从 requirements.txt 安装：

```bash
uv pip install -r requirements.txt
```

输出示例：

```
Resolved 12 packages in 45ms
Installed 12 packages in 62ms
 + flask==3.1.0
 + jinja2==3.1.6
 + markupsafe==3.0.2
 ...
```

查看已安装的包：

```bash
uv pip list
```

输出示例：

```
Package            Version
------------------ ---------
certifi            2025.4.26
charset-normalizer 3.4.2
idna               3.10
requests           2.32.3
urllib3            2.4.0
```

## 项目管理

uv 提供了完整的项目管理功能，类似 poetry 但速度更快。

### uv init - 初始化项目

在当前目录初始化项目：

```bash
uv init
```

输出示例：

```
Initialized project `my-project`
```

生成的文件结构：

```
.
├── .python-version
├── hello.py
├── pyproject.toml
└── uv.lock
```

在指定目录创建项目：

```bash
uv init my-app
```

输出示例：

```
Initialized project `my-app` at `/home/user/projects/my-app`
```

查看生成的 `pyproject.toml`：

```toml
[project]
name = "my-project"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.12"
dependencies = []
```

初始化时指定 Python 版本：

```bash
uv init --python 3.10 my-legacy-app
```

### uv add - 添加依赖

添加运行时依赖：

```bash
uv add requests
```

输出示例：

```
Resolved 6 packages in 15ms
Installed 5 packages in 20ms
 + certifi==2025.4.26
 + charset-normalizer==3.4.2
 + idna==3.10
 + requests==2.32.3
 + urllib3==2.4.0
```

添加指定版本的依赖：

```bash
uv add "flask>=3.0,<4.0"
```

输出示例：

```
Resolved 8 packages in 22ms
Installed 3 packages in 15ms
 + blinker==1.9.0
 + flask==3.1.0
 + markupsafe==3.0.2
```

添加开发依赖：

```bash
uv add --dev pytest
```

输出示例：

```
Resolved 9 packages in 30ms
Installed 3 packages in 25ms
 + iniconfig==2.1.0
 + pluggy==1.6.0
 + pytest==8.3.5
```

添加后的 `pyproject.toml`：

```toml
[project]
name = "my-project"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "requests>=2.32.3",
    "flask>=3.0,<4.0",
]

[dependency-groups]
dev = [
    "pytest>=8.3.5",
]
```

### uv remove - 移除依赖

移除运行时依赖：

```bash
uv remove flask
```

输出示例：

```
Resolved 6 packages in 10ms
Uninstalled 3 packages in 5ms
 - blinker==1.9.0
 - flask==3.1.0
 - markupsafe==3.0.2
```

移除开发依赖：

```bash
uv remove --dev pytest
```

输出示例：

```
Resolved 5 packages in 8ms
Uninstalled 3 packages in 4ms
 - iniconfig==2.1.0
 - pluggy==1.6.0
 - pytest==8.3.5
```

### uv sync - 同步依赖

根据 `pyproject.toml` 和 `uv.lock` 安装项目依赖：

```bash
uv sync
```

输出示例：

```
Resolved 5 packages in 12ms
Installed 5 packages in 18ms
 + certifi==2025.4.26
 + charset-normalizer==3.4.2
 + idna==3.10
 + requests==2.32.3
 + urllib3==2.4.0
```

只同步生产依赖（不包含开发依赖）：

```bash
uv sync --no-dev
```

输出示例：

```
Resolved 5 packages in 10ms
Installed 5 packages in 15ms
 + certifi==2025.4.26
 + charset-normalizer==3.4.2
 + idna==3.10
 + requests==2.32.3
 + urllib3==2.4.0
```

::: tip 提示
`uv sync` 会确保虚拟环境中的包与 `uv.lock` 完全一致，多余的包会被移除，缺失的包会被安装，版本不匹配的包会被更新。
:::

### uv lock - 锁定依赖

生成或更新 `uv.lock` 锁文件，不安装任何包：

```bash
uv lock
```

输出示例：

```
Resolved 5 packages in 12ms
```

升级所有依赖到最新兼容版本：

```bash
uv lock --upgrade
```

输出示例：

```
Resolved 5 packages in 45ms
```

升级指定依赖：

```bash
uv lock --upgrade-package requests
```

输出示例：

```
Resolved 5 packages in 30ms
```

### pyproject.toml 和 uv.lock 文件说明

**pyproject.toml** 是项目的配置文件，声明项目的元数据和依赖：

```toml
[project]
name = "my-project"              # 项目名称
version = "0.1.0"                 # 项目版本
description = "A sample project"  # 项目描述
readme = "README.md"              # README 文件
requires-python = ">=3.12"        # Python 版本要求
dependencies = [                  # 运行时依赖
    "requests>=2.32.3",
    "flask>=3.0,<4.0",
]

[dependency-groups]
dev = [                           # 开发依赖
    "pytest>=8.3.5",
    "ruff>=0.11.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

**uv.lock** 是锁文件，记录所有依赖的精确版本和哈希值，确保环境可复现：

```toml
# This file is autogenerated by uv via the following command:
#   uv lock

version = 1
requires-python = ">=3.12"

[[package]]
name = "certifi"
version = "2025.4.26"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/...", hash = "sha256-..." }
wheels = [
    { url = "https://files.pythonhosted.org/...", hash = "sha256-..." },
]

[[package]]
name = "requests"
version = "2.32.3"
source = { registry = "https://pypi.org/simple" }
dependencies = [
    { name = "certifi" },
    { name = "charset-normalizer" },
    { name = "idna" },
    { name = "urllib3" },
]
sdist = { url = "https://files.pythonhosted.org/...", hash = "sha256-..." }
```

::: tip 提示
`uv.lock` 应该加入版本控制，确保所有开发者和 CI 环境使用完全一致的依赖版本。`pyproject.toml` 声明依赖范围，`uv.lock` 锁定精确版本。
:::

## 常用工具安装

uv 提供了 `uv tool` 命令来安装全局命令行工具，替代 pipx 的功能。工具安装在隔离环境中，不会污染全局 Python。

安装工具：

```bash
uv tool install ruff
```

输出示例：

```
Resolved 1 package in 8ms
Installed 1 package in 12ms
 + ruff==0.11.8
Installed 1 executable: ruff
```

安装后可以直接使用：

```bash
ruff --version
```

输出示例：

```
ruff 0.11.8
```

安装指定版本的工具：

```bash
uv tool install ruff@0.11.0
```

安装带有额外依赖的工具：

```bash
uv tool install --with rich httpie
```

查看已安装的工具：

```bash
uv tool list
```

输出示例：

```
ruff v0.11.8
 - ruff
httpie v3.2.4
 - http
 - https
 - httpie
```

升级工具：

```bash
uv tool upgrade ruff
```

输出示例：

```
Upgraded ruff from 0.11.0 to 0.11.8
```

升级所有已安装的工具：

```bash
uv tool upgrade --all
```

卸载工具：

```bash
uv tool uninstall ruff
```

输出示例：

```
Uninstalled ruff
```

临时运行工具（不安装）：

```bash
uv tool run ruff check .
```

输出示例：

```
Found 0 errors. 1 fixable with `ruff check --fix`.
```

`uvx` 是 `uv tool run` 的简写：

```bash
uvx ruff check .
```

## 常见问题与解决

### uv 安装 Python 失败

**问题**：执行 `uv python install` 时下载失败。

**解决方案**：配置国内镜像源。设置环境变量：

```bash
export UV_PYTHON_INSTALL_MIRROR=https://ghgo.xyz/https://github.com/astral-sh/python-build-standalone/releases/download
```

永久配置，在 Shell 配置文件（`~/.bashrc` 或 `~/.zshrc`）中添加：

```bash
export UV_PYTHON_INSTALL_MIRROR=https://ghgo.xyz/https://github.com/astral-sh/python-build-standalone/releases/download
```

### pip install 速度慢

**问题**：`uv pip install` 从 PyPI 下载包速度慢。

**解决方案**：配置 PyPI 镜像源。临时使用：

```bash
uv pip install -i https://pypi.tuna.tsinghua.edu.cn/simple requests
```

永久配置，创建 `~/.config/uv/uv.toml`：

```toml
[pip]
index-url = "https://pypi.tuna.tsinghua.edu.cn/simple"
```

或在项目中配置 `pyproject.toml`：

```toml
[tool.uv]
index-url = "https://pypi.tuna.tsinghua.edu.cn/simple"
```

### 虚拟环境未激活时找不到包

**问题**：运行 Python 脚本提示 `ModuleNotFoundError`。

**解决方案**：确保已激活虚拟环境：

```bash
source .venv/bin/activate
```

或者使用 `uv run` 自动在项目虚拟环境中执行命令，无需手动激活：

```bash
uv run python hello.py
```

### 从 poetry 迁移到 uv

**解决方案**：uv 可以直接读取 `pyproject.toml` 中的 poetry 依赖声明。只需在项目目录执行：

```bash
uv sync
```

uv 会自动识别 poetry 格式的依赖并生成 `uv.lock`。如果需要将 poetry 的依赖声明转换为 uv 格式，可以手动将 `[tool.poetry.dependencies]` 下的依赖移到 `[project.dependencies]` 中。

### uv.lock 冲突

**问题**：多人协作时 `uv.lock` 产生合并冲突。

**解决方案**：删除 `uv.lock` 后重新生成：

```bash
rm uv.lock
uv lock
```

::: tip 提示
建议在合并代码后立即运行 `uv lock` 确保锁文件与 `pyproject.toml` 一致。
:::

## 总结

uv 用一个工具替代了 Python 开发中的整套工具链，从 Python 安装到项目管理一站式解决。掌握以下核心命令即可覆盖日常大部分场景：

| 命令 | 作用 |
|------|------|
| `uv python install <version>` | 安装 Python 版本 |
| `uv python list` | 查看可用 Python 版本 |
| `uv python pin <version>` | 固定项目 Python 版本 |
| `uv python find <version>` | 查找 Python 解释器 |
| `uv venv` | 创建虚拟环境 |
| `uv init` | 初始化项目 |
| `uv add <package>` | 添加依赖 |
| `uv remove <package>` | 移除依赖 |
| `uv sync` | 同步依赖 |
| `uv lock` | 锁定依赖 |
| `uv tool install <tool>` | 安装全局工具 |
| `uv run <command>` | 在项目环境中运行命令 |

如果你还在用 pip + venv + pyenv + poetry 的组合，不妨试试 uv，体验一下 Rust 带来的极致速度。
