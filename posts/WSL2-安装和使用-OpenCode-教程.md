---
title: WSL2 安装和使用 OpenCode（Crush）教程
description: 在 WSL2 环境下安装和使用 OpenCode（现名 Crush）AI 编程助手，配置多模型支持
category: AI工具
tags: [OpenCode, Crush, WSL2, AI编程, CLI工具]
recommend: false
date: 2026-07-13
series: series-windows-ai
---

# WSL2 安装和使用 OpenCode（Crush）教程

## 前言

OpenCode 是一款终端 AI 编程助手，基于 Go 语言开发，提供交互式 TUI（终端用户界面），支持多种 AI 模型（OpenAI、Claude、Gemini 等）。它的特点是会话管理、LSP 集成、文件变更追踪等功能，可以直接在终端里和 AI 协作编程。

**注意**：OpenCode 原仓库已归档，项目由 Charm 团队接手并更名为 **Crush**。本文以 Crush 为例进行安装和使用说明，但保留了 OpenCode 的相关背景介绍。

放在 WSL2 里用有天然优势：Linux 原生环境对 Go 和工具链支持更好，文件权限更规范。这篇就把从安装到用的全过程走一遍。

## 前提条件

### WSL2 已安装

确保你的 Windows 系统已安装并配置好 WSL2。如果尚未安装，可以参考 [Windows 11 配置 WSL2 完整教程](/posts/Windows11-配置WSL2教程)。

验证 WSL2 是否正常运行：

```bash
# 在 PowerShell 中查看 WSL 版本
wsl --version

# 确认默认版本为 2
wsl --status
```

### Go 环境（可选）

Crush 提供预编译二进制，通常不需要 Go 环境。如果你想从源码编译，需要 Go 1.21+：

```bash
# 检查 Go 版本
go version
```

## 安装 Crush（OpenCode 的继任者）

### 方式一：使用官方安装脚本（推荐）

在 WSL2 终端中运行：

```bash
# 使用官方安装脚本
curl -fsSL https://raw.githubusercontent.com/opencode-ai/opencode/refs/heads/main/install | bash
```

或者使用 Crush 的安装方式：

```bash
# 使用 Homebrew
brew install charmbracelet/tap/crush
```

安装完成后，验证是否成功：

```bash
crush --version
```

### 方式二：手动下载二进制

从 [GitHub Releases](https://github.com/charmbracelet/crush/releases/latest) 下载对应平台的二进制文件：

```bash
# 下载最新版本（以 x86_64 为例）
wget https://github.com/charmbracelet/crush/releases/latest/download/crush_Linux_x86_64.tar.gz

# 解压
tar -xzf crush_Linux_x86_64.tar.gz

# 移动到 PATH 目录
mv crush /usr/local/bin/
chmod +x /usr/local/bin/crush

# 验证安装
crush --version
```

### 方式三：使用 Go 安装

```bash
# 从源码安装
go install github.com/charmbracelet/crush@latest

# 确保 Go bin 目录在 PATH 中
export PATH="$PATH:$(go env GOPATH)/bin"
```

## 配置认证

Crush 支持多种 AI 提供商，需要配置对应的 API Key。

### 配置环境变量

在 `~/.bashrc` 或 `~/.zshrc` 中添加：

```bash
# OpenAI
export OPENAI_API_KEY="your-openai-api-key"

# Anthropic Claude
export ANTHROPIC_API_KEY="your-anthropic-api-key"

# Google Gemini
export GEMINI_API_KEY="your-gemini-api-key"

# 其他提供商...
```

使配置生效：

```bash
source ~/.bashrc
```

### 配置国产 API 替代方案

由于网络原因，国内访问 OpenAI API 可能不稳定。可以通过配置代理或使用国产 API 兼容服务：

```bash
# 设置代理
export HTTPS_PROXY="http://your-proxy:port"

# 或者使用国产 API 中转
export OPENAI_BASE_URL="https://your-api-endpoint.com/v1"
```

## 基本使用

### 启动 Crush

```bash
# 直接启动，进入交互模式
crush

# 或者在项目目录中启动
crush /path/to/your/project
```

### 常用命令

```bash
# 查看帮助
crush --help

# 以非交互模式执行单个指令
crush "请帮我创建一个 Python 的 Flask 项目结构"

# 指定模型
crush --model gpt-4o

# 查看版本
crush --version
```

### 交互模式常用操作

进入 Crush 后，你可以：

- **直接输入自然语言指令**：比如 "请帮我写一个读取 CSV 文件的函数"
- **使用 `/` 命令**：
  - `/help` - 显示帮助
  - `/clear` - 清除对话历史
  - `/exit` - 退出 Crush
- **文件操作**：Crush 会自动读取当前项目的文件上下文
- **切换模型**：在会话中切换不同的 AI 模型

## 与 Claude Code 的对比

| 特性 | Crush (OpenCode) | Claude Code |
|------|------------------|-------------|
| 开发商 | Charm | Anthropic |
| 底层模型 | 多模型支持 | Claude 3.5/4 系列 |
| 安装方式 | 脚本/二进制/Go | npm |
| 认证方式 | API Key | API Key |
| 代码理解 | 优秀 | 优秀 |
| 终端集成 | TUI 界面 | 命令行 |
| 会话管理 | 支持 | 支持 |
| LSP 集成 | 支持 | 不支持 |

两者都是优秀的 AI 编程助手，选择哪个主要取决于你对模型的偏好和界面偏好。

## 常见问题

### 1. 安装后无法找到 `crush` 命令

```bash
# 检查安装路径
which crush

# 如果没有找到，手动添加 PATH
export PATH="$PATH:/usr/local/bin"
```

### 2. 认证失败

```bash
# 检查环境变量是否设置正确
echo $OPENAI_API_KEY

# 清除缓存后重试
rm -rf ~/.config/crush
crush
```

### 3. 网络连接问题

```bash
# 测试 API 连通性
curl -I https://api.openai.com/v1/models

# 如果无法访问，检查代理配置
# 或考虑使用国产 API 中转方案
```

### 4. WSL2 文件权限问题

```bash
# 确保项目文件在 WSL2 文件系统中
# 避免在 /mnt/c/ 等 Windows 挂载点操作

# 推荐在项目目录中操作
cd ~/projects/your-project
crush
```

## 进阶配置

### 配置文件

Crush 支持配置文件，可以创建 `~/.config/crush/config.yaml` 进行个性化设置：

```yaml
# 默认模型
model: gpt-4o

# 会话保存路径
sessions_dir: ~/.config/crush/sessions

# 编辑器设置
editor: vim
```

### 插件系统

Crush 支持通过 MCP（Model Context Protocol）扩展功能：

```bash
# 安装 MCP 插件
crush mcp install <plugin-name>

# 列出已安装插件
crush mcp list
```

## 总结

Crush（原 OpenCode）是一个功能强大的终端 AI 编程助手，在 WSL2 环境下运行流畅。通过本文的步骤，你应该能够：

1. ✅ 在 WSL2 中成功安装 Crush
2. ✅ 配置 API Key 认证
3. ✅ 了解国产 API 替代方案
4. ✅ 掌握基本使用方法

Crush 和 Claude Code 类似，都是提升开发效率的利器。建议根据实际需求和模型偏好选择合适的工具。

## 参考资料

- [Crush GitHub 仓库](https://github.com/charmbracelet/crush)
- [OpenCode 原仓库（已归档）](https://github.com/opencode-ai/opencode)
- [Charm 官网](https://charm.sh)
- [Bubble Tea TUI 框架](https://github.com/charmbracelet/bubbletea)
