---
title: WSL2 安装和使用 Pi Agent 教程
description: 在 WSL2 环境下安装和使用 Pi Agent AI 编程助手，体验 Rust 编写的高性能终端 AI 工具
category: AI工具
tags: [Pi Agent, WSL2, AI编程, CLI工具, Rust]
recommend: false
date: 2026-07-13
series: series-windows-ai
---

# WSL2 安装和使用 Pi Agent 教程

## 前言

Pi Agent 是一款高性能的 AI 编程助手 CLI 工具，由 Rust 语言编写，具有零 unsafe 代码、启动速度快、内存占用低等特点。它提供了交互式 TUI（终端用户界面），支持多种 AI 模型，内置 8 种工具（读取、写入、编辑、执行等），是终端里编程的得力助手。

Pi Agent 最初由 Mario Zechner 开发，Rust 版本 `pi_agent_rust` 由 Dicklesworthstone 移植，获得了原作者的授权。相比其他 AI 编程工具，Pi Agent 的优势在于：

- **极速启动**：Rust 单二进制，无运行时依赖
- **内存友好**：长会话内存占用远低于 Node.js/Python 方案
- **稳定可靠**：结构化并发，无 orphaned 进程
- **内置工具**：8 种常用工具开箱即用
- **会话管理**：支持会话持久化和分支

放在 WSL2 里用有天然优势：Linux 原生环境对 Rust 和工具链支持更好。这篇就把从安装到用的全过程走一遍。

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

## 安装 Pi Agent

### 方式一：使用官方安装脚本（推荐）

在 WSL2 终端中运行：

```bash
# 安装最新版本
curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/pi_agent_rust/main/install.sh?$(date +%s)" | bash

# 非交互式安装（自动更新 PATH）
curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/pi_agent_rust/main/install.sh?$(date +%s)" | bash -s -- --yes --easy-mode
```

安装完成后，验证是否成功：

```bash
pi --version
```

### 方式二：手动下载二进制

从 [GitHub Releases](https://github.com/Dicklesworthstone/pi_agent_rust/releases/latest) 下载对应平台的二进制文件：

```bash
# 下载最新版本（以 x86_64 为例）
wget https://github.com/Dicklesworthstone/pi_agent_rust/releases/latest/download/pi-linux-amd64.tar.xz

# 解压
tar -xJf pi-linux-amd64.tar.xz

# 移动到 PATH 目录
mv pi /usr/local/bin/
chmod +x /usr/local/bin/pi

# 验证安装
pi --version
```

### 安装选项说明

官方安装脚本支持多种选项：

```bash
# 指定版本安装
curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/pi_agent_rust/main/install.sh?$(date +%s)" | bash -s -- --version v0.1.0

# 离线安装（使用本地包）
curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/pi_agent_rust/main/install.sh?$(date +%s)" | bash -s -- --offline ./pi-linux-amd64.tar.xz

# 跳过自动补全安装
curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/pi_agent_rust/main/install.sh?$(date +%s)" | bash -s -- --no-completions

# 跳过技能安装（不安装到 Claude Code/Codex CLI）
curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/pi_agent_rust/main/install.sh?$(date +%s)" | bash -s -- --no-agent-skills
```

## 配置认证

Pi Agent 支持多种 AI 提供商，需要配置对应的 API Key。

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

### 启动 Pi Agent

```bash
# 直接启动，进入交互模式
pi

# 或者在项目目录中启动
pi /path/to/your/project
```

### 常用命令

```bash
# 查看帮助
pi --help

# 以非交互模式执行单个指令（Print 模式）
pi -p "请帮我创建一个 Python 的 Flask 项目结构"

# 继续上一个会话
pi --continue

# 指定模型
pi --model gpt-4o

# 启用深度思考
pi --thinking high "设计一个分布式限流器"

# 查看版本
pi --version
```

### 交互模式常用操作

进入 Pi Agent 后，你可以：

- **直接输入自然语言指令**：比如 "请帮我写一个读取 CSV 文件的函数"
- **使用 `/` 命令**：
  - `/help` - 显示帮助
  - `/model` - 切换模型
  - `/tree` - 查看会话分支
  - `/clear` - 清除对话历史
  - `/compact` - 压缩会话
  - `/exit` - 退出 Pi Agent
- **使用 `@` 引用文件**：输入 `@` 后跟文件路径，可以将文件内容附加到对话中
- **文件操作**：Pi Agent 会自动读取当前项目的文件上下文

### 8 种内置工具

Pi Agent 内置了 8 种常用工具：

| 工具 | 描述 | 示例 |
|------|------|------|
| `read` | 读取文件内容，支持图片 | Read src/main.rs |
| `write` | 创建或覆盖文件 | Write a new config file |
| `edit` | 精确字符串替换 | Fix the typo on line 42 |
| `hashline_edit` | 使用 LINE#HASH 标签精确编辑 | Apply edits to specific lines |
| `bash` | 执行 Shell 命令 | Run the test suite |
| `grep` | 搜索文件内容 | Find all TODO comments |
| `find` | 按模式查找文件 | Find all *.rs files |
| `ls` | 列出目录内容 | What's in src/? |

### 会话管理

Pi Agent 支持会话持久化和分支：

```bash
# 继续最近的会话
pi --continue

# 打开特定会话
pi --session ~/.pi/agent/sessions/--home-user-project--/2024-01-15T10-30-00.jsonl

# 临时会话（不持久化）
pi --no-session
```

### 三种执行模式

Pi Agent 支持三种执行模式：

| 模式 | 调用方式 | 适用场景 |
|------|---------|---------|
| **交互模式** | `pi`（默认） | 完整的 TUI 体验，支持流式输出、工具、会话分支、自动补全 |
| **打印模式** | `pi -p "..."` | 单条响应输出到 stdout，无 TUI，适合脚本 |
| **RPC 模式** | `pi --mode rpc` | 无头 JSON 协议，用于 IDE 集成 |

### 自动补全

Pi Agent 提供上下文感知的自动补全：

- **`@` 文件引用**：输入 `@` 后跟路径片段，自动附加文件内容
- **`/` 命令**：内置命令和用户定义的模板、技能都会显示为补全选项
- **模糊匹配**：前缀匹配优先于子串匹配
- **后台刷新**：每 30 秒重新索引项目文件树

### 深度思考

对于复杂问题，可以启用深度思考：

```bash
pi --thinking high "设计一个分布式限流器"
```

思考级别：`off`、`minimal`、`low`、`medium`、`high`、`xhigh`

## 进阶配置

### 技能和提示模板

Pi Agent 支持自定义技能和提示模板：

```bash
# 技能：将 SKILL.md 放在 ~/.pi/agent/skills/ 或 .pi/skills/ 目录下
# 使用方式：/skill:name

# 提示模板：将 Markdown 文件放在 ~/.pi/agent/prompts/ 或 .pi/prompts/ 目录下
# 使用方式：/<template> [args]
```

### 扩展

Pi Agent 支持两种扩展运行时：

- **JS/TS 扩展**：在嵌入式 QuickJS 运行时中运行，无需 Node 或 Bun
- **Native 扩展**：使用原生 Rust 描述符运行时

## 与 Claude Code 的对比

| 特性 | Pi Agent | Claude Code |
|------|----------|-------------|
| 开发商 | 社区（Rust 版） | Anthropic |
| 底层语言 | Rust | TypeScript/Node.js |
| 启动速度 | 极快（单二进制） | 较快（Node.js 运行时） |
| 内存占用 | 低 | 中等 |
| 终端集成 | TUI + 流式输出 | 命令行 |
| 内置工具 | 8 种 | 多种 |
| 会话管理 | 支持分支 | 支持 |
| LSP 集成 | 不支持 | 不支持 |
| 扩展系统 | JS/TS + Native | 插件 |

两者都是优秀的 AI 编程助手，选择哪个主要取决于你对性能、界面和生态的偏好。

## 常见问题

### 1. 安装后无法找到 `pi` 命令

```bash
# 检查安装路径
which pi

# 如果没有找到，手动添加 PATH
export PATH="$PATH:/usr/local/bin"
```

### 2. 认证失败

```bash
# 检查环境变量是否设置正确
echo $OPENAI_API_KEY

# 清除缓存后重试
rm -rf ~/.pi/agent
pi
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
pi
```

### 5. 会话文件过大

```bash
# Pi Agent 会自动压缩长会话
# 也可以手动清理旧会话
rm -rf ~/.pi/agent/sessions/*/2024-*
```

## 总结

Pi Agent 是一个高性能的终端 AI 编程助手，在 WSL2 环境下运行流畅。通过本文的步骤，你应该能够：

1. ✅ 在 WSL2 中成功安装 Pi Agent
2. ✅ 配置 API Key 认证
3. ✅ 了解国产 API 替代方案
4. ✅ 掌握基本使用方法
5. ✅ 了解进阶配置（技能、提示模板、扩展）

Pi Agent 和 Claude Code 类似，都是提升开发效率的利器。Pi Agent 的优势在于 Rust 编写的高性能和稳定性，适合对性能敏感的场景。

## 参考资料

- [Pi Agent Rust GitHub 仓库](https://github.com/Dicklesworthstone/pi_agent_rust)
- [Pi Agent 原版（TypeScript）](https://github.com/badlogic/pi)
- [asupersync - 结构化并发运行时](https://github.com/Dicklesworthstone/asupersync)
- [rich_rust - 终端输出库](https://github.com/Dicklesworthstone/rich_rust)
