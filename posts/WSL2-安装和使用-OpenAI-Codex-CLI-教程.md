---
title: WSL2 安装和使用 OpenAI Codex CLI 教程
description: 在 WSL2 环境下安装和使用 OpenAI Codex CLI，配置国产 API 替代方案，实现 AI 辅助编程
category: AI工具
tags: [Codex, OpenAI, WSL2, AI编程, CLI工具]
recommend: false
date: 2026-07-13
series: series-windows-ai
---

# WSL2 安装和使用 OpenAI Codex CLI 教程

## 前言

OpenAI Codex CLI 是 OpenAI 推出的命令行编程助手，和 Claude Code 类似，它能读懂你的项目上下文、写代码、调试、运行 Shell 命令。Codex CLI 基于 OpenAI 的模型，支持 GPT-4o 等模型，可以直接在终端里和 AI 协作编程。

放在 WSL2 里用有天然优势：Linux 原生环境对 Node.js 和工具链支持更好，文件权限更规范。这篇就把从安装到配置国产 API 替代方案的全过程走一遍。

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

### Node.js 18+ 已安装

Codex CLI 依赖 Node.js 18 或更高版本。检查当前版本：

```bash
node --version
```

如果版本低于 18 或未安装，使用 nvm 安装：

```bash
# 安装 nvm（如已安装可跳过）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载配置
source ~/.bashrc

# 安装 Node.js 20
nvm install 20
nvm use 20
nvm alias default 20
```

## 安装 Codex CLI

### 方式一：使用官方安装脚本（推荐）

在 WSL2 终端中运行：

```bash
# 使用官方安装脚本
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

安装完成后，验证是否成功：

```bash
codex --version
```

### 方式二：使用 npm 安装

```bash
# 全局安装 Codex CLI
npm install -g @openai/codex

# 验证安装
codex --version
```

### 方式三：手动下载二进制

如果你需要特定版本，可以从 [GitHub Releases](https://github.com/openai/codex/releases/latest) 下载对应平台的二进制文件：

```bash
# 下载 Linux x86_64 版本
wget https://github.com/openai/codex/releases/latest/download/codex-x86_64-unknown-linux-musl.tar.gz

# 解压
tar -xzf codex-x86_64-unknown-linux-musl.tar.gz

# 移动到 PATH 目录
mv codex-x86_64-unknown-linux-musl /usr/local/bin/codex
chmod +x /usr/local/bin/codex
```

## 配置认证

Codex CLI 支持两种认证方式：**ChatGPT 账号登录** 或 **API Key**。

### 方式一：ChatGPT 账号登录（推荐）

如果你有 ChatGPT Plus、Pro、Business、Edu 或 Enterprise 计划，可以直接用 ChatGPT 账号登录：

```bash
# 启动 Codex CLI
codex

# 选择 "Sign in with ChatGPT"
# 按照提示完成浏览器授权
```

这种方式最简单，不需要额外配置 API Key，且可以使用你的 ChatGPT 计划额度。

### 方式二：API Key 认证

如果你没有 ChatGPT 订阅，或者想使用自己的 API Key，可以按以下步骤配置：

1. 获取 OpenAI API Key：
   - 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
   - 创建新的 API Key
   - 复制 Key 备用

2. 配置环境变量：

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export OPENAI_API_KEY="your-api-key-here"

# 使配置生效
source ~/.bashrc
```

3. 验证配置：

```bash
# 启动 Codex CLI
codex

# 选择 "Use API Key" 选项
```

## 配置国产 API 替代方案

由于网络原因，国内访问 OpenAI API 可能不稳定。可以通过配置代理或使用国产 API 替代方案来解决。

### 方案一：使用代理

```bash
# 在 ~/.bashrc 或 ~/.zshrc 中添加
export HTTPS_PROXY="http://your-proxy:port"

# 使配置生效
source ~/.bashrc
```

### 方案二：使用国产 API 中转

部分国产云服务商提供 OpenAI API 兼容的中转服务，可以配置 `OPENAI_BASE_URL` 指向中转地址：

```bash
# 在 ~/.bashrc 或 ~/.zshrc 中添加
export OPENAI_BASE_URL="https://your-api-endpoint.com/v1"
export OPENAI_API_KEY="your-api-key-here"

# 使配置生效
source ~/.bashrc
```

### 方案三：使用 OneAPI 等开源中转方案

如果你有自建 API 中转的需求，可以使用 [OneAPI](https://github.com/songquanpeng/one-api) 等开源项目搭建私有 API 中转服务，然后配置 `OPENAI_BASE_URL` 指向你的服务地址。

## 基本使用

### 启动 Codex CLI

```bash
# 直接启动，进入交互模式
codex

# 或者在项目目录中启动
codex /path/to/your/project
```

### 常用命令

```bash
# 查看帮助
codex --help

# 以非交互模式执行单个指令
codex "请帮我创建一个 Python 的 Flask 项目结构"

# 指定模型
codex --model gpt-4o

# 查看版本
codex --version
```

### 交互模式常用操作

进入 Codex CLI 后，你可以：

- **直接输入自然语言指令**：比如 "请帮我写一个读取 CSV 文件的函数"
- **使用 `/` 命令**：
  - `/help` - 显示帮助
  - `/clear` - 清除对话历史
  - `/exit` - 退出 Codex CLI
- **文件操作**：Codex 会自动读取当前项目的文件上下文

## 与 Claude Code 的对比

| 特性 | OpenAI Codex CLI | Claude Code |
|------|------------------|-------------|
| 开发商 | OpenAI | Anthropic |
| 底层模型 | GPT-4o 系列 | Claude 3.5/4 系列 |
| 安装方式 | 脚本/npm/二进制 | npm |
| 认证方式 | ChatGPT 账号/API Key | API Key |
| 代码理解 | 优秀 | 优秀 |
| 终端集成 | 深度集成 | 深度集成 |
| 价格 | ChatGPT 订阅/API 计费 | API 计费 |

两者都是优秀的 AI 编程助手，选择哪个主要取决于你对模型的偏好和已有的订阅情况。

## 常见问题

### 1. 安装后无法找到 `codex` 命令

```bash
# 检查 npm 全局安装路径
npm config get prefix

# 确保该路径下的 bin 目录在 PATH 中
export PATH="$PATH:$(npm config get prefix)/bin"
```

### 2. 认证失败

```bash
# 清除缓存后重试
rm -rf ~/.codex
codex

# 重新进行认证流程
```

### 3. 网络连接问题

```bash
# 测试 OpenAI API 连通性
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
codex
```

## 进阶配置

### 自定义配置文件

Codex CLI 支持配置文件，可以创建 `~/.codex/config.json` 进行个性化设置：

```json
{
  "model": "gpt-4o",
  "temperature": 0.7,
  "max_tokens": 4096
}
```

### 与 VS Code 集成

Codex CLI 可以与 VS Code 的远程 WSL 扩展配合使用：

1. 在 VS Code 中安装 "Remote - WSL" 扩展
2. 通过 VS Code 连接到 WSL2
3. 在 VS Code 终端中使用 `codex` 命令

## 总结

OpenAI Codex CLI 是一个强大的 AI 编程助手，在 WSL2 环境下运行流畅。通过本文的步骤，你应该能够：

1. ✅ 在 WSL2 中成功安装 Codex CLI
2. ✅ 配置 ChatGPT 账号或 API Key 认证
3. ✅ 了解国产 API 替代方案
4. ✅ 掌握基本使用方法

Codex CLI 和 Claude Code 类似，都是提升开发效率的利器。建议根据实际需求和模型偏好选择合适的工具。

## 参考资料

- [OpenAI Codex 官方文档](https://developers.openai.com/codex)
- [Codex CLI GitHub 仓库](https://github.com/openai/codex)
- [OpenAI Platform API 文档](https://platform.openai.com/docs)
