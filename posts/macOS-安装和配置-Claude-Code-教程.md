---
title: macOS 安装和配置 Claude Code 教程
description: 在 macOS 上安装 Claude Code 并配置讯飞 Coding Plan、DeepSeek 等国产大模型 API
category: AI工具
tags: [macOS, Claude Code, AI编程, CLI工具, 国产大模型]
recommend: false
date: 2026-06-09
series:
  - id: series-macOS-claude
    name: macOS 配置国产大模型 API 系列
    order: 2
    prev: /posts/macOS-环境准备教程
    next: /posts/macOS-配置cc-Switch教程
---

# macOS 安装和配置 Claude Code 教程

## 前言

Claude Code 是 Anthropic 官方推出的 CLI 编程助手，它直接运行在终端中，能够理解你的项目上下文，帮你编写代码、调试问题、执行 Shell 命令、操作文件等。

**但是，Claude 官方订阅（Claude Pro/Max）和 Anthropic API 在国内使用存在很大困难**：网络访问不稳定、支付方式受限、API 调用延迟高等问题让很多开发者望而却步。

好消息是，Claude Code 支持通过 OpenAI 兼容 API 接入第三方提供商，这意味着我们可以使用**国产大模型 API** 作为替代方案，享受同样强大的 AI 编程体验。本文将重点介绍如何在国内环境下配置和使用 Claude Code。

## 前提条件

### Node.js 18+ 已安装

Claude Code 依赖 Node.js 18 或更高版本。检查当前版本：

```bash
node --version
```

如果版本低于 18 或未安装，推荐使用 nvm 安装（详见 [macOS 开发环境准备教程](/posts/macOS-环境准备教程)）：

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc

# 安装 Node.js LTS 版本
nvm install --lts
nvm use --lts
node --version   # 应输出 v18.x.x 或更高
```

### 大模型 API Key

由于 Anthropic 官方 API 在国内使用困难，本教程推荐以下国产替代方案：

| 提供商 | 模型 | 特点 | API 兼容性 |
|--------|------|------|-----------|
| **讯飞 Coding Plan** | 星火/GLM 5.1/DeepSeek V4 等 | 多模型，中文能力强，编程专用 | OpenAI 兼容 |
| **DeepSeek** | DeepSeek-V3/Coder | 性价比高，代码能力强 | OpenAI 兼容 |
| **OpenRouter** | 多模型聚合 | 可访问 Claude/GPT 等多种模型 | OpenAI 兼容 |
| **硅基流动 (SiliconFlow)** | 多模型 | 国内访问友好，价格实惠 | OpenAI 兼容 |

> 💡 所有这些提供商都支持 OpenAI 兼容 API 格式，可以直接接入 Claude Code。

## 安装 Claude Code

### 通过 npm 全局安装

```bash
npm install -g @anthropic-ai/claude-code
```

macOS 通常不需要 `sudo`，Homebrew 安装的 Node.js 全局路径在用户目录下。如果遇到权限问题：

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g @anthropic-ai/claude-code
```

### 验证安装

```bash
claude --version
```

## 配置国产大模型 API

这是本文的核心部分。Claude Code 支持通过环境变量或 `settings.json` 配置第三方 API 提供商。

### 方式一：通过环境变量配置

在 `~/.zshrc` 中设置以下环境变量：

```bash
# 使用 DeepSeek API
echo 'export ANTHROPIC_BASE_URL="https://api.deepseek.com"' >> ~/.zshrc
echo 'export ANTHROPIC_API_KEY="your-deepseek-api-key"' >> ~/.zshrc

# 或者使用 OpenRouter
# echo 'export ANTHROPIC_BASE_URL="https://openrouter.ai/api/v1"' >> ~/.zshrc
# echo 'export ANTHROPIC_API_KEY="your-openrouter-api-key"' >> ~/.zshrc

# 或者使用硅基流动
# echo 'export ANTHROPIC_BASE_URL="https://api.siliconflow.cn/v1"' >> ~/.zshrc
# echo 'export ANTHROPIC_API_KEY="your-siliconflow-api-key"' >> ~/.zshrc

source ~/.zshrc
```

### 方式二：通过 settings.json 配置

编辑 `~/.claude/settings.json`：

```json
{
  "apiBaseUrl": "https://api.deepseek.com",
  "apiKey": "your-deepseek-api-key"
}
```

### 各提供商详细配置

#### 讯飞 Coding Plan

讯飞 Coding Plan 提供多种大模型服务，包括星火、GLM 5.1、DeepSeek V4 等：

```bash
# 设置 API 地址和密钥
echo 'export ANTHROPIC_BASE_URL="https://spark-api-open.xf-yun.com/v1"' >> ~/.zshrc
echo 'export ANTHROPIC_API_KEY="your-spark-api-key"' >> ~/.zshrc
source ~/.zshrc
```

获取 API Key：
1. 访问 [讯飞开放平台](https://www.xfyun.cn/) 注册账号
2. 创建应用，选择星火大模型
3. 获取 API Key 和 API Secret

#### DeepSeek

DeepSeek 是目前最受欢迎的国产编程大模型之一，代码能力出色：

```bash
echo 'export ANTHROPIC_BASE_URL="https://api.deepseek.com"' >> ~/.zshrc
echo 'export ANTHROPIC_API_KEY="your-deepseek-api-key"' >> ~/.zshrc
source ~/.zshrc
```

获取 API Key：
1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册账号
2. 在 API Keys 页面创建新的 Key
3. 充值余额（DeepSeek 价格非常实惠）

#### OpenRouter

OpenRouter 聚合了多种模型，可以通过它访问 Claude、GPT 等国际模型：

```bash
echo 'export ANTHROPIC_BASE_URL="https://openrouter.ai/api/v1"' >> ~/.zshrc
echo 'export ANTHROPIC_API_KEY="your-openrouter-api-key"' >> ~/.zshrc
source ~/.zshrc
```

> ⚠️ OpenRouter 本身是海外服务，可能需要代理访问。

#### 硅基流动 (SiliconFlow)

国内访问友好，支持多种开源模型：

```bash
echo 'export ANTHROPIC_BASE_URL="https://api.siliconflow.cn/v1"' >> ~/.zshrc
echo 'export ANTHROPIC_API_KEY="your-siliconflow-api-key"' >> ~/.zshrc
source ~/.zshrc
```

### 使用 cc-Switch 快速切换提供商

当你同时配置了多个提供商时，手动修改环境变量很麻烦。推荐使用 **cc-Switch** 命令行工具一键切换：

```bash
# 安装 cc-Switch
npm install -g @aravhawk/cc-switch

# 添加 DeepSeek 配置
cc-switch add deepseek

# 添加讯飞配置
cc-switch add xunfei

# 切换到 DeepSeek
cc-switch use deepseek

# 切换到讯飞
cc-switch use xunfei
```

::: tip 提示
详细的 cc-Switch 安装和配置教程，请参考 [macOS 配置 cc-Switch 教程](/posts/macOS-配置cc-Switch教程)。
:::

## 基本使用

### 启动 Claude Code

```bash
# 进入你的项目目录
cd ~/projects/my-project

# 启动 Claude Code
claude
```

也可以带参数启动：

```bash
# 带初始提示启动
claude "帮我分析这个项目的结构"

# 以非交互模式运行
claude -p "列出所有 TODO 注释"

# 恢复上一次会话
claude --resume
```

### 交互式对话

启动后进入交互式界面，直接输入你的需求：

```text
> 帮我写一个 Express 服务器，支持 GET /api/users 接口

> 这个函数有 bug，帮我看看哪里有问题

> 把这段代码从 JavaScript 重构为 TypeScript
```

### 常用斜杠命令

| 命令 | 说明 |
|------|------|
| `/help` | 显示帮助信息和可用命令列表 |
| `/clear` | 清除当前对话历史 |
| `/compact` | 压缩对话上下文，释放 token 空间 |
| `/config` | 打开配置管理界面 |
| `/model` | 切换使用的模型 |
| `/fast` | 切换到快速模式 |
| `/cost` | 显示当前会话的 token 用量和费用 |
| `/init` | 在当前项目初始化 CLAUDE.md 文件 |

## 项目配置

### CLAUDE.md 项目说明文件

`CLAUDE.md` 放在项目根目录下，Claude Code 每次启动时都会自动读取。使用 `/init` 命令自动生成，或手动创建：

```markdown
# 项目说明

## 技术栈
- 前端：Vue 3 + TypeScript + Vite
- 后端：Node.js + Express
- 数据库：PostgreSQL

## 编码规范
- 使用 TypeScript 严格模式
- 组件使用 `<script setup>` 语法
- 提交信息遵循 Conventional Commits 规范
```

### .claude/settings.json 配置

项目级别的配置文件位于 `.claude/settings.json`：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npm test *)",
      "Bash(git *)",
      "Read",
      "Edit",
      "Write"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)"
    ]
  }
}
```

## 与 WSL2 版本的差异

| 对比项 | macOS | WSL2 |
|--------|-------|------|
| 默认 Shell | zsh | bash |
| 配置文件 | `~/.zshrc` | `~/.bashrc` |
| 包管理器 | Homebrew | apt |
| 文件系统 | APFS（原生） | ext4（虚拟化） |
| 代理配置 | 系统代理自动生效 | 需手动配置转发 |
| OAuth 流程 | 原生流畅 | 可能有跳转问题 |

macOS 的优势：
- 无需虚拟化层，文件 I/O 性能更好
- 项目可放在任意目录，无跨文件系统问题
- 系统通知集成更好（可用 `osascript`）
- 代理配置更简单，直接使用系统代理

## 常见问题

### 国产 API 连接超时

**问题**：使用国产大模型 API 时偶尔出现连接超时

**解决方案**：

```bash
# 检查网络连接
curl -I https://api.deepseek.com

# 如果需要代理
echo 'export https_proxy=http://127.0.0.1:7890' >> ~/.zshrc
echo 'export http_proxy=http://127.0.0.1:7890' >> ~/.zshrc
source ~/.zshrc
```

### API Key 验证失败

**问题**：启动后提示 API Key 无效

**解决方案**：

1. 检查环境变量是否正确设置：

```bash
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_API_KEY
```

2. 确认 API Key 有效且有余额
3. 检查 `ANTHROPIC_BASE_URL` 是否包含 `/v1` 后缀（不同提供商要求不同）

### 切换提供商后 Claude Code 行为异常

**问题**：从 Anthropic 切换到国产 API 后，某些功能异常

**解决方案**：

1. 不同提供商的模型能力有差异，部分高级功能可能不完全兼容
2. 使用 `/model` 切换到提供商支持的模型
3. 使用 cc-Switch 管理不同提供商的配置，避免手动修改出错

## 总结

通过配置国产大模型 API，你可以在国内流畅地使用 Claude Code 进行 AI 辅助编程。核心要点：

- **安装 Claude Code**：`npm install -g @anthropic-ai/claude-code`
- **配置国产 API**：设置 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_API_KEY` 环境变量
- **推荐提供商**：DeepSeek（性价比高）、讯飞 Coding Plan（编程专用）、硅基流动（国内友好）
- **使用 cc-Switch 管理多配置**：一键切换不同提供商和账户

更多信息和最新文档，请参考 [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code)。
