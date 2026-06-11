---
title: WSL2 安装和使用 Claude Code 教程
description: 在 WSL2 环境下安装和使用 Claude Code，配置国产大模型 API
category: AI工具
tags: [Claude Code, WSL2, AI编程, CLI工具]
date: 2026-06-08
recommend: ['series-windows-ai', 2]
series:
  - id: series-windows-ai
    name: Windows 11 AI 工具系列
    order: 2
    prev: /posts/Windows11-配置WSL2教程
    next: /posts/cc-Switch-CLI-使用教程
---

# WSL2 安装和使用 Claude Code 教程
## 前言

Claude Code 是 Anthropic 官方推出的 CLI 编程助手，它直接运行在终端中，能够理解你的项目上下文，帮你编写代码、调试问题、执行 Shell 命令、操作文件等。与传统的 AI 编程助手不同，Claude Code 不是一个 IDE 插件，而是一个独立的命令行工具，可以与任何开发工作流无缝集成。

在 WSL2 中使用 Claude Code 有天然的优势：Linux 原生环境对 Node.js 和开发工具链的支持更好，文件权限管理更规范，Shell 命令兼容性更强。本文将手把手带你完成从安装到进阶使用的全过程。

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

Claude Code 依赖 Node.js 18 或更高版本。检查当前版本：

```bash
node --version
```

如果版本低于 18 或未安装，使用 nvm 安装：

```bash
# 安装 nvm（如已安装可跳过）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载配置
source ~/.bashrc

# 安装 Node.js LTS 版本
nvm install --lts
nvm use --lts

# 验证版本
node --version   # 应输出 v18.x.x 或更高
npm --version
```

### 国内大模型 API

由于 Anthropic 官方 API 在国内使用困难，本教程推荐以下国产替代方案：

| 提供商 | Base URL | 特点 |
|--------|----------|------|
| 讯飞 Coding Plan | `https://spark-api-open.xf-yun.com/v1` | 多模型（星火/GLM 5.1/DeepSeek V4 等），国内首选 |
| DeepSeek | `https://api.deepseek.com` | 性价比高，响应快 |
| OpenRouter | `https://openrouter.ai/api/v1` | 多模型聚合平台 |
| SiliconFlow | `https://api.siliconflow.cn/v1` | 国内平台，多模型可选 |

选择其中一个提供商，注册账号并获取 API Key。

## 安装 Claude Code

### 通过 npm 安装

在 WSL2 终端中执行：

```bash
npm install -g @anthropic-ai/claude-code
```

如果遇到权限问题，可以使用以下方式：

```bash
# 方式一：使用 sudo
sudo npm install -g @anthropic-ai/claude-code

# 方式二：修改 npm 全局安装路径（推荐）
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @anthropic-ai/claude-code
```

### 验证安装

```bash
claude --version
```

安装成功后会输出版本号信息。

## 首次配置

### 登录认证

Claude Code 支持通过环境变量配置 API 认证。

#### 配置国内 API

将国内 API 的 Base URL 和 API Key 设置为环境变量：

```bash
# 以讯飞 Coding Plan 为例
echo 'export ANTHROPIC_BASE_URL="https://spark-api-open.xf-yun.com/v1"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="your-spark-api-key"' >> ~/.bashrc
source ~/.bashrc
```

也可以使用其他提供商：

```bash
# DeepSeek
echo 'export ANTHROPIC_BASE_URL="https://api.deepseek.com"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="your-deepseek-api-key"' >> ~/.bashrc

# OpenRouter
echo 'export ANTHROPIC_BASE_URL="https://openrouter.ai/api/v1"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="your-openrouter-api-key"' >> ~/.bashrc

# SiliconFlow
echo 'export ANTHROPIC_BASE_URL="https://api.siliconflow.cn/v1"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="your-siliconflow-api-key"' >> ~/.bashrc
source ~/.bashrc
```

> **注意：** `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_API_KEY` 是 Claude Code 识别的环境变量名，虽然名称中包含 "ANTHROPIC"，但实际指向的是国内 API 提供商。

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

### 文件操作

Claude Code 可以直接读取、编辑和创建文件：

```text
> 读取 src/index.ts 的内容

> 把 src/utils/helpers.js 中的 fetchData 函数改为使用 async/await

> 创建一个新文件 src/config/database.ts，配置 PostgreSQL 连接
```

在执行文件修改前，Claude Code 会展示变更预览并征求你的确认。

### 执行 Shell 命令

Claude Code 可以在沙箱环境中执行 Shell 命令：

```text
> 运行 npm test 看看哪些测试失败了

> 查看 git log 最近的 5 条提交记录

> 执行 npm run build 并检查是否有编译错误
```

执行命令前同样需要你的确认，确保安全性。

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

### 权限管理

Claude Code 采用权限控制系统，每次执行敏感操作前都会征求你的确认。你可以通过以下方式管理权限：

**交互式授权**：当 Claude Code 请求权限时，你可以选择：
- 仅本次允许
- 本次会话允许
- 始终允许（会写入配置文件）

**手动配置**：直接编辑 `.claude/settings.json`，使用 glob 模式匹配：

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
      "Bash(sudo *)",
      "Bash(curl * | bash)"
    ]
  }
}
```

权限规则优先级：deny 规则优先于 allow 规则。推荐只放开你信任的操作，保持最小权限原则。

## 进阶使用

### MCP Server 集成

MCP（Model Context Protocol）允许 Claude Code 连接外部工具和数据源。配置文件位于 `.claude/settings.json`：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/user/projects"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://user:password@localhost:5432/mydb"
      ]
    }
  }
}
```

常用 MCP Server：

| Server | 用途 |
|--------|------|
| `@modelcontextprotocol/server-filesystem` | 文件系统访问 |
| `@modelcontextprotocol/server-github` | GitHub 操作 |
| `@modelcontextprotocol/server-postgres` | PostgreSQL 数据库 |
| `@modelcontextprotocol/server-brave-search` | 网络搜索 |

### Hooks 配置

Hooks 允许你在特定事件触发时执行自定义脚本，在 `.claude/settings.json` 中配置：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "echo 'Executing bash command...' >> /tmp/claude-hooks.log"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit",
        "command": "npm run lint --silent"
      }
    ],
    "Notification": [
      {
        "matcher": "",
        "command": "notify-send 'Claude Code' 'Task completed'"
      }
    ]
  }
}
```

可用的 Hook 事件：

| 事件 | 触发时机 |
|------|----------|
| `PreToolUse` | 工具执行前 |
| `PostToolUse` | 工具执行后 |
| `Notification` | Claude Code 发出通知时 |
| `Stop` | Claude Code 完成响应时 |

### 多模型切换

使用 `/model` 命令在会话中切换模型：

```text
> /model
```

可选模型包括：

- `claude-sonnet-4-20250514` - 默认模型，平衡性能和速度
- `claude-opus-4-20250514` - 最强推理能力，适合复杂任务

在配置文件中设置默认模型：

```json
{
  "model": "claude-sonnet-4-20250514"
}
```

### 快速模式

使用 `/fast` 命令切换到快速模式，该模式使用响应速度更快的模型，适合简单的问答和快速修改：

```text
> /fast
```

再次输入 `/fast` 可以切换回标准模式。快速模式适合以下场景：

- 简单的代码格式化
- 快速问答
- 小幅度的代码修改
- 不需要深度推理的任务

## 推荐工具：cc-Switch

在使用 Claude Code 的过程中，你可能会遇到以下场景：

- 同时使用多个 AI 提供商（讯飞、DeepSeek、OpenRouter 等）
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

cc-Switch 是一个命令行工具，安装后直接在终端中使用：

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

### 典型场景

**1. 工作/个人账户切换**

提前配置好两个 Profile（工作用讯飞、个人用 DeepSeek），一条命令即可切换。

**2. API 额度耗尽时切换提供商**

当讯飞 API 额度用完，可以快速切换到 DeepSeek 或 OpenRouter 继续工作。

**3. 不同项目使用不同模型**

某些项目适合用 Opus 深度思考，某些项目用 Sonnet 就够了。通过 cc-Switch 为不同项目创建对应的 Profile。

::: tip 提示
详细的 cc-Switch 安装和使用教程，请参考 [cc-Switch CLI 使用教程](/posts/cc-Switch-CLI-使用教程)。
:::

## 常见问题

### 认证失败

**问题**：启动后提示认证失败或 API Key 无效

**解决方案**：

1. 检查 API Key 和 Base URL 是否正确设置：

```bash
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_API_KEY
```

2. 确认 API Key 没有过期或被撤销，在对应提供商的控制台中查看

3. 检查 `ANTHROPIC_BASE_URL` 是否包含 `/v1` 后缀（不同提供商要求不同）

3. 如果使用 OAuth 登录，尝试重新认证：

```bash
claude /login
```

4. 检查网络连接，WSL2 中可能需要配置代理：

```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
```

### 权限问题

**问题**：Claude Code 无法读取文件或执行命令

**解决方案**：

1. 确认项目目录的文件权限：

```bash
ls -la ~/projects/my-project
```

2. 修复文件所有权：

```bash
sudo chown -R $USER:$USER ~/projects/my-project
```

3. 检查 `.claude/settings.json` 中的权限配置，确保需要的操作在 `allow` 列表中

4. WSL2 中访问 Windows 文件系统（`/mnt/c/`）时可能遇到权限问题，建议将项目放在 WSL2 文件系统内（如 `~/projects/`）

### 性能优化

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

5. **限制 WSL2 资源**：在 Windows 用户目录的 `.wslconfig` 中设置合理的资源限制：

```toml
[wsl2]
memory=4GB
processors=2
autoMemoryReclaim=gradual
```

6. **项目放在 WSL 文件系统**：避免在 `/mnt/c/` 下操作项目，跨文件系统访问性能较差

## 总结

Claude Code 是一个强大的 AI 编程助手，在 WSL2 环境下可以充分发挥其能力。通过本教程，你应该已经掌握了：

- Claude Code 的安装与认证配置
- 交互式对话和斜杠命令的使用
- 文件操作与 Shell 命令执行
- 项目级配置（CLAUDE.md、settings.json、权限管理）
- 进阶功能（MCP Server、Hooks、模型切换、快速模式）
- 常见问题的排查与解决

关键建议：

- **善用 CLAUDE.md**：完善的项目说明能让 Claude Code 更准确地理解你的需求
- **合理配置权限**：在便利性和安全性之间找到平衡
- **利用 MCP 扩展能力**：连接 GitHub、数据库等外部工具，让 Claude Code 的能力更上一层楼
- **使用 cc-Switch 管理多配置**：如果需要频繁切换提供商或账户，cc-Switch 能大幅简化操作
- **保持 WSL2 环境优化**：项目放在 WSL 文件系统、定期清理资源

更多信息和最新文档，请参考 [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code)。
