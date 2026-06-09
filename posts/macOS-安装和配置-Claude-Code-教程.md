---
title: macOS 安装和配置 Claude Code 教程
category: AI工具
tags: [macOS, Claude Code, AI编程, CLI工具]
date: 2026-06-09
recommend: ['series-macOS-claude', 2]
series:
  - id: series-macOS-claude
    name: macOS 配置 Claude Code 系列
    order: 2
    prev: /posts/macOS-环境准备教程
    next: /posts/macOS-配置cc-Switch教程
---

# macOS 安装和配置 Claude Code 教程

## 前言

Claude Code 是 Anthropic 官方推出的 CLI 编程助手，它直接运行在终端中，能够理解你的项目上下文，帮你编写代码、调试问题、执行 Shell 命令、操作文件等。与传统的 AI 编程助手不同，Claude Code 不是一个 IDE 插件，而是一个独立的命令行工具，可以与任何开发工作流无缝集成。

在 macOS 上使用 Claude Code 有着天然的优势：macOS 基于 Unix，终端体验优秀，Homebrew 生态完善，Node.js 和开发工具链的安装配置都非常顺畅。相比 WSL2 环境，macOS 原生终端无需虚拟化层，文件系统性能更好，与系统工具的集成也更紧密。本文将手把手带你完成从安装到进阶使用的全过程。

## 前提条件

### Node.js 18+ 已安装

Claude Code 依赖 Node.js 18 或更高版本。检查当前版本：

```bash
node --version
```

如果版本低于 18 或未安装，推荐使用 Homebrew 或 nvm 安装：

```bash
# 方式一：使用 Homebrew 安装
brew install node

# 方式二：使用 nvm 安装（推荐，方便管理多版本）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载配置
source ~/.zshrc

# 安装 Node.js LTS 版本
nvm install --lts
nvm use --lts

# 验证版本
node --version   # 应输出 v18.x.x 或更高
npm --version
```

### Anthropic API Key 或 Claude Pro/Max 订阅

你需要以下任一认证方式才能使用 Claude Code：

- **API Key**：访问 [Anthropic Console](https://console.anthropic.com/)，注册或登录账号，在 API Keys 页面创建新的 Key
- **Claude Pro/Max 订阅**：通过 OAuth 认证方式登录，无需单独的 API Key

## 安装 Claude Code

### 通过 npm 全局安装

在终端中执行：

```bash
npm install -g @anthropic-ai/claude-code
```

macOS 通常不需要 `sudo`，因为 Homebrew 安装的 Node.js 全局路径在用户目录下。如果遇到权限问题，建议检查 npm 全局路径配置：

```bash
# 查看当前 npm 全局安装路径
npm config get prefix

# 如果路径是 /usr/local，可以修改为用户目录
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

安装成功后会输出版本号信息。

## 首次配置

### API Key 认证

将 API Key 设置为环境变量：

```bash
# 添加到 ~/.zshrc（macOS 默认使用 zsh）
echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

也可以在启动 Claude Code 后通过交互式方式输入 API Key。

### OAuth 认证

如果你有 Claude Pro/Max 订阅，可以使用 OAuth 登录：

```bash
claude
```

首次启动时选择 OAuth 登录方式，浏览器会自动打开认证页面，完成授权后即可使用。macOS 的 OAuth 流程非常顺畅，浏览器和终端之间的跳转是原生的，无需额外配置。

### 基本设置

首次运行时，Claude Code 会引导你完成基本设置，包括：

- 选择默认模型
- 配置权限偏好
- 设置项目目录

你也可以随时通过 `/config` 命令修改这些设置。

## 基本使用

### 启动 Claude Code

在项目目录中启动：

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

# 以非交互模式运行（适合脚本调用）
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

Claude Code 会根据你的项目上下文来理解和响应，它可以读取你的文件、运行命令并直接修改代码。

### 常用斜杠命令

在交互模式中，使用斜杠命令执行特定操作：

| 命令 | 说明 |
|------|------|
| `/help` | 显示帮助信息和可用命令列表 |
| `/clear` | 清除当前对话历史 |
| `/compact` | 压缩对话上下文，释放 token 空间 |
| `/config` | 打开配置管理界面 |
| `/model` | 切换使用的模型 |
| `/fast` | 切换到快速模式（使用更快的模型） |
| `/cost` | 显示当前会话的 token 用量和费用 |
| `/init` | 在当前项目初始化 CLAUDE.md 文件 |
| `/review` | 审查当前代码变更 |
| `/memory` | 查看和管理项目记忆 |
| `/quit` | 退出 Claude Code |

## 项目配置

### CLAUDE.md 项目说明文件

`CLAUDE.md` 是项目的上下文说明文件，放在项目根目录下，Claude Code 每次启动时都会自动读取。它帮助 Claude Code 更好地理解你的项目。

使用 `/init` 命令自动生成，或手动创建：

```markdown
# 项目说明

## 技术栈
- 前端：Vue 3 + TypeScript + Vite
- 后端：Node.js + Express
- 数据库：PostgreSQL

## 项目结构
- src/components/ - Vue 组件
- src/api/ - API 接口
- src/utils/ - 工具函数
- tests/ - 测试文件

## 编码规范
- 使用 TypeScript 严格模式
- 组件使用 `<script setup>` 语法
- 提交信息遵循 Conventional Commits 规范

## 常用命令
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run test` - 运行测试
- `npm run lint` - 代码检查
```

你还可以在不同子目录中放置 `CLAUDE.md`，Claude Code 会根据当前工作目录自动加载对应的上下文。

### .claude/settings.json 配置

项目级别的配置文件位于 `.claude/settings.json`，用于控制 Claude Code 在当前项目中的行为：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npm test *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Read",
      "Edit",
      "Write"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)"
    ]
  },
  "env": {
    "NODE_ENV": "development"
  }
}
```

用户级别的全局配置位于 `~/.claude/settings.json`：

```json
{
  "permissions": {
    "allow": [
      "Bash(node *)",
      "Bash(npm *)",
      "Bash(git *)",
      "Bash(cat *)",
      "Bash(ls *)"
    ]
  },
  "theme": "dark"
}
```

## 与 WSL2 版本的差异说明

如果你之前在 Windows WSL2 环境中使用过 Claude Code，以下是 macOS 原生环境的主要差异：

### 终端环境

| 对比项 | macOS | WSL2 |
|--------|-------|------|
| 默认 Shell | zsh | bash |
| 配置文件 | `~/.zshrc` | `~/.bashrc` |
| 包管理器 | Homebrew | apt |
| 文件系统 | APFS（原生） | ext4（虚拟化） |
| 跨文件系统访问 | 无需 | `/mnt/c/` 访问 Windows 文件 |

### 关键差异

**1. 无需虚拟化层**

macOS 原生运行，没有 WSL2 的虚拟化开销，文件 I/O 性能更好，启动速度更快。

**2. Shell 配置文件不同**

macOS 默认使用 zsh，环境变量和路径配置写在 `~/.zshrc` 而非 `~/.bashrc`：

```bash
# macOS 设置环境变量
echo 'export ANTHROPIC_API_KEY="your-key"' >> ~/.zshrc
source ~/.zshrc
```

**3. 无跨文件系统问题**

WSL2 中访问 `/mnt/c/` 下的 Windows 文件会有性能损耗和权限问题，macOS 不存在这个问题，项目可以放在任意目录。

**4. OAuth 流程更顺畅**

macOS 的浏览器和终端集成是原生的，OAuth 认证时浏览器打开和回调都非常流畅，无需额外配置。

**5. 通知系统**

macOS 原生通知系统与 Claude Code 的集成更好，Hooks 中可以直接使用 `osascript` 发送通知：

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "command": "osascript -e 'display notification \"Claude Code 任务完成\" with title \"Claude Code\"'"
      }
    ]
  }
}
```

**6. 无需配置代理转发**

WSL2 中可能需要额外配置代理才能访问外网，macOS 直接使用系统代理设置，无需额外配置。

## 推荐使用 cc-Switch

在使用 Claude Code 的过程中，你可能会遇到以下场景：

- 同时使用多个 AI 提供商（Anthropic 官方、OpenRouter、DeepSeek 等）
- 工作账户和个人账户需要频繁切换
- API 额度耗尽时需要快速切换到备用提供商
- 不同项目需要不同的模型配置

手动修改 `settings.json` 来切换配置既繁琐又容易出错。**cc-Switch** 是一个专门为 Claude Code 设计的命令行配置切换工具，通过简单的命令即可切换不同的提供商和账户。

### 安装 cc-Switch

```bash
# Profile 管理器版本（推荐）
npm install -g @aravhawk/cc-switch

# 或 提供商快速切换版本
npm install -g @adithya-13/cc-switch
```

### 基本使用

```bash
# 查看当前配置
cc-switch current

# 切换到指定 Profile
cc-switch use <profile-name>

# 列出所有可用 Profile
cc-switch list

# 添加新的 Profile
cc-switch add <profile-name>
```

切换后自动更新 Claude Code 的 `settings.json`，无需手动编辑配置文件。

::: tip 提示
详细的 cc-Switch 安装和使用教程，请参考 [macOS 配置 cc-Switch 教程](/posts/macOS-配置cc-Switch教程)。
:::

## 常见问题

### 认证失败

**问题**：启动后提示认证失败或 API Key 无效

**解决方案**：

1. 检查 API Key 是否正确设置：

```bash
echo $ANTHROPIC_API_KEY
```

2. 确认 API Key 没有过期或被撤销，在 [Anthropic Console](https://console.anthropic.com/) 中查看

3. 如果使用 OAuth 登录，尝试重新认证：

```bash
claude /login
```

4. 检查网络连接，如需使用代理：

```bash
# macOS 设置代理环境变量
echo 'export https_proxy=http://127.0.0.1:7890' >> ~/.zshrc
echo 'export http_proxy=http://127.0.0.1:7890' >> ~/.zshrc
source ~/.zshrc
```

### npm 全局安装权限问题

**问题**：安装时提示 `EACCES` 权限错误

**解决方案**：

```bash
# 方式一：修改 npm 全局路径（推荐）
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# 方式二：使用 Homebrew 安装的 Node.js（默认路径在用户目录下，无权限问题）
brew install node
```

不要使用 `sudo npm install -g`，这可能导致文件权限混乱。

### Claude Code 响应缓慢

**问题**：Claude Code 响应缓慢或占用资源过多

**解决方案**：

1. **使用 `/compact` 压缩上下文**：长对话会消耗大量 token，定期压缩可以提升响应速度

```text
> /compact
```

2. **使用 `/clear` 清除历史**：切换到新任务时清除之前的对话上下文

```text
> /clear
```

3. **使用快速模式**：简单任务使用 `/fast` 切换到更快的模型

```text
> /fast
```

4. **优化 CLAUDE.md**：保持项目说明简洁，避免过多无关信息占用上下文

### zsh 配置未生效

**问题**：修改 `~/.zshrc` 后环境变量未生效

**解决方案**：

```bash
# 手动重新加载配置
source ~/.zshrc

# 如果仍不生效，检查是否在 ~/.zprofile 中也有配置（可能覆盖）
cat ~/.zprofile

# 确认当前 Shell
echo $SHELL
# 如果输出不是 /bin/zsh，执行：
chsh -s /bin/zsh
```

## 总结

Claude Code 在 macOS 上有着出色的使用体验，原生 Unix 环境、优秀的终端生态和流畅的系统集成让整个工作流非常顺畅。通过本教程，你应该已经掌握了：

- Claude Code 的安装与认证配置
- 交互式对话和斜杠命令的使用
- 项目级配置（CLAUDE.md、settings.json）
- macOS 与 WSL2 环境的关键差异
- 常见问题的排查与解决

关键建议：

- **善用 CLAUDE.md**：完善的项目说明能让 Claude Code 更准确地理解你的需求
- **合理配置权限**：在便利性和安全性之间找到平衡
- **使用 cc-Switch 管理多配置**：如果需要频繁切换提供商或账户，cc-Switch 能大幅简化操作
- **利用 macOS 原生优势**：系统通知、流畅的 OAuth 流程、无虚拟化开销

更多信息和最新文档，请参考 [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code)。
