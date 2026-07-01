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

Claude Code 是 Anthropic 官方出的 CLI 编程助手，跑在终端里，能读懂你的项目上下文，帮你写代码、调试、执行 Shell 命令、操作文件。

但 Claude 官方订阅和 Anthropic API 在国内用起来挺折腾：网络不稳、支付受限、调用延迟高，劝退了不少人。好在 Claude Code 支持通过 OpenAI 兼容 API 接第三方提供商，可以直接拿**国产大模型 API** 顶上，体验并不差。这篇就讲在国内环境下怎么把它配上、用起来。

## 前提条件

### Node.js 18+ 已安装

Claude Code 依赖 Node.js 18 或更高版本。先看一眼当前版本：

```bash
node --version
```

版本低于 18 或根本没装，推荐用 nvm 装（详见 [macOS 开发环境准备教程](/posts/macOS-环境准备教程)）：

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

Anthropic 官方 API 在国内不好用，下面这几家国产替代都是 OpenAI 兼容格式，可以直接接进 Claude Code：

| 提供商 | 模型 | 特点 | API 兼容性 |
|--------|------|------|-----------|
| **讯飞 Coding Plan** | 星火/GLM 5.1/DeepSeek V4 等 | 多模型，中文能力强，编程专用 | OpenAI 兼容 |
| **DeepSeek** | DeepSeek-V3/Coder | 性价比高，代码能力强 | OpenAI 兼容 |
| **OpenRouter** | 多模型聚合 | 可访问 Claude/GPT 等多种模型 | OpenAI 兼容 |
| **硅基流动 (SiliconFlow)** | 多模型 | 国内访问友好，价格实惠 | OpenAI 兼容 |

> 💡 这些提供商都支持 OpenAI 兼容 API 格式，接进 Claude Code 没有额外适配成本。

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

这是本文的核心。Claude Code 支持通过环境变量或 `settings.json` 配第三方 API 提供商，两种都行。

### 方式一：通过环境变量配置

在 `~/.zshrc` 中设置以下环境变量：

```bash
# 使用 DeepSeek API
echo 'export ANTHROPIC_BASE_URL="https://api.deepseek.com"' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="your-deepseek-api-key"' >> ~/.zshrc

# 或者使用 OpenRouter
# echo 'export ANTHROPIC_BASE_URL="https://openrouter.ai/api/v1"' >> ~/.zshrc
# echo 'export ANTHROPIC_AUTH_TOKEN="your-openrouter-api-key"' >> ~/.zshrc

# 或者使用硅基流动
# echo 'export ANTHROPIC_BASE_URL="https://api.siliconflow.cn/v1"' >> ~/.zshrc
# echo 'export ANTHROPIC_AUTH_TOKEN="your-siliconflow-api-key"' >> ~/.zshrc

source ~/.zshrc
```

### 方式二：通过 settings.json 配置

相比环境变量，更推荐把配置写进 `~/.claude/settings.json` 的 `env` 块。配置集中在一处，也不污染整个 Shell 环境：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com",
    "ANTHROPIC_AUTH_TOKEN": "your-deepseek-api-key"
  }
}
```

::: warning 注意认证字段的区别
第三方 API 网关（DeepSeek、讯飞、硅基流动、OpenRouter 等）几乎都走 **Bearer Token** 认证，所以必须用 `ANTHROPIC_AUTH_TOKEN`，它会被拼成 `Authorization: Bearer <key>` 发出去。

- `ANTHROPIC_AUTH_TOKEN` —— 发送为 `Authorization: Bearer <值>`，**接第三方网关用这个**
- `ANTHROPIC_API_KEY` —— 发送为 `X-Api-Key` 头，这是 Anthropic 官方 API 的格式，第三方网关多半不认

要是你拿 `ANTHROPIC_API_KEY` 去接第三方网关，大概率会收到 401。详细说明见 [Claude Code 配置详解](/posts/macOS-Claude-Code-配置详解)，常见报错排查见 [常见报错排查](/posts/macOS-Claude-Code-报错排查)。
:::

### 各提供商详细配置

#### 讯飞 Coding Plan

讯飞 Coding Plan 一个套餐能切多种模型，包括星火、GLM 5.1、DeepSeek V4 等：

```bash
# 设置 API 地址和密钥
echo 'export ANTHROPIC_BASE_URL="https://spark-api-open.xf-yun.com/v1"' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="your-spark-api-key"' >> ~/.zshrc
source ~/.zshrc
```

获取 API Key：
1. 访问 [讯飞开放平台](https://www.xfyun.cn/) 注册账号
2. 创建应用，选择星火大模型
3. 获取 API Key 和 API Secret

#### DeepSeek

DeepSeek 是目前最火的国产编程大模型之一，代码能力在线，价格也便宜：

```bash
echo 'export ANTHROPIC_BASE_URL="https://api.deepseek.com"' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="your-deepseek-api-key"' >> ~/.zshrc
source ~/.zshrc
```

获取 API Key：
1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册账号
2. 在 API Keys 页面创建新的 Key
3. 充值余额（DeepSeek 价格非常实惠）

#### OpenRouter

OpenRouter 是个聚合层，通过它可以用上 Claude、GPT 等国际模型：

```bash
echo 'export ANTHROPIC_BASE_URL="https://openrouter.ai/api/v1"' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="your-openrouter-api-key"' >> ~/.zshrc
source ~/.zshrc
```

> ⚠️ OpenRouter 本身是海外服务，可能需要代理访问。

#### 硅基流动 (SiliconFlow)

国内访问友好，接了不少开源模型：

```bash
echo 'export ANTHROPIC_BASE_URL="https://api.siliconflow.cn/v1"' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="your-siliconflow-api-key"' >> ~/.zshrc
source ~/.zshrc
```

### 使用 cc-Switch 快速切换提供商

配了好几家提供商之后，手动改环境变量就嫌麻烦了。推荐用 **cc-Switch** 命令行工具一键切换：

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

`CLAUDE.md` 放在项目根目录，Claude Code 每次启动都会自动读取。可以用 `/init` 命令生成，也可以手动建：

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

项目级别的配置在 `.claude/settings.json`：

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

macOS 的好处是少了一层虚拟化，文件 I/O 更快，项目放哪都行，没有跨文件系统的坑。系统通知集成也顺（可以用 `osascript`），代理直接走系统代理。

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
echo $ANTHROPIC_AUTH_TOKEN
```

2. 确认 API Key 有效且有余额
3. 检查 `ANTHROPIC_BASE_URL` 是否包含 `/v1` 后缀（不同提供商要求不同）
4. 确认你用的是 `ANTHROPIC_AUTH_TOKEN` 而非 `ANTHROPIC_API_KEY`——第三方网关需要 Bearer 认证，详见 [Claude Code 配置详解](/posts/macOS-Claude-Code-配置详解)

### 切换提供商后 Claude Code 行为异常

**问题**：从 Anthropic 切换到国产 API 后，某些功能异常

**解决方案**：

1. 不同提供商的模型能力有差异，部分高级功能可能不完全兼容
2. 使用 `/model` 切换到提供商支持的模型
3. 使用 cc-Switch 管理不同提供商的配置，避免手动修改出错

## 总结

配好国产大模型 API，国内流畅用 Claude Code 辅助编程就没问题了。核心就这几步：

- **安装 Claude Code**：`npm install -g @anthropic-ai/claude-code`
- **配置国产 API**：设置 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_API_KEY` 环境变量
- **推荐提供商**：DeepSeek（性价比高）、讯飞 Coding Plan（编程专用）、硅基流动（国内友好）
- **使用 cc-Switch 管理多配置**：一键切换不同提供商和账户

更多信息和最新文档，请参考 [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code)。
