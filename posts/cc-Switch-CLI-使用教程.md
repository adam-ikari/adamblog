---
title: cc-Switch CLI 使用教程
category: AI工具
tags: [Claude Code, cc-Switch, CLI工具, AI编程]
date: 2026-06-08
recommend: ['series-windows-ai', 3]
series:
  - id: series-windows-ai
    name: Windows 11 AI 工具系列
    order: 3
    prev: /posts/WSL2-安装和使用-Claude-Code-教程
    next:
---

# cc-Switch CLI 使用教程
## 前言

在使用 Claude Code 的过程中，很多开发者会遇到一个常见问题：当你同时使用多个 AI 提供商（如 Anthropic 官方、OpenRouter、DeepSeek、Kimi 等），或者需要在不同的 API Key 之间切换时，每次都要手动编辑 `~/.claude/settings.json`，不仅繁琐，还容易出错。当 Claude Code 的使用额度在会话中途耗尽时，手动切换提供商更是打断工作流。

**cc-Switch** 就是为了解决这个问题而生的 CLI 工具。它让你可以用一条命令在多个 Claude Code 配置之间快速切换，无需手动编辑配置文件，也无需重启终端。目前社区中有多个 cc-Switch 实现，本文主要介绍功能最完善的两个版本：

- **@aravhawk/cc-switch** — 配置文件 Profile 管理器，适合管理多套完整的 settings.json 配置
- **@adithya-13/cc-switch** — 提供商快速切换器，适合在 Anthropic、OpenRouter、DeepSeek 等提供商之间一键切换

此外还有 **@imvhb/cc-switch-mcp-server**，可以作为 MCP Server 集成到 Claude Code 中使用。

> **注意：** cc-Switch 是社区开发的第三方工具，非 Anthropic 官方产品。本文内容基于 npm 上的包信息和 GitHub 仓库文档整理，具体功能请以官方仓库最新版本为准。

## 安装和配置

### 前提条件

- Node.js 18 或更高版本
- Claude Code 已安装，且 `~/.claude/settings.json` 文件存在

检查环境：

```bash
# 检查 Node.js 版本
node --version

# 确认 Claude Code 配置文件存在
ls ~/.claude/settings.json
```

### 安装 @aravhawk/cc-switch（Profile 管理器）

```bash
# 使用 npm 全局安装
npm install -g @aravhawk/cc-switch

# 或使用 pnpm
pnpm add -g @aravhawk/cc-switch

# 验证安装
cc-switch --version
```

### 安装 @adithya-13/cc-switch（提供商切换器）

```bash
# 使用 npm 全局安装
npm install -g @adithya-13/cc-switch

# 或使用 curl 安装脚本
curl -fsSL https://raw.githubusercontent.com/adithya-13/cc-switch/main/install.sh | bash

# 验证安装
cc-switch version
```

> **注意：** 两个包都提供 `cc-switch` 命令，不能同时全局安装。请根据你的使用场景选择其中一个。如果你需要管理多套完整的配置文件，选择 @aravhawk/cc-switch；如果你主要在不同 AI 提供商之间切换，选择 @adithya-13/cc-switch。

### 安装 MCP Server 版本（可选）

如果你想在 Claude Code 内部通过 MCP 协议使用 cc-Switch：

```bash
npm install -g @imvhb/cc-switch-mcp-server
```

然后在 Claude Code 的 MCP 配置中添加：

```json
{
  "mcpServers": {
    "cc-switch": {
      "command": "cc-switch-mcp-server",
      "args": []
    }
  }
}
```

## 基本使用方法

### @aravhawk/cc-switch — Profile 管理模式

这个版本的核心概念是 **Profile（配置档案）**。每个 Profile 保存了一份完整的 `settings.json` 副本，切换 Profile 就是替换 `~/.claude/settings.json` 的内容。

**工作原理：**

1. Profile 存储在 `~/.cc-switch/profiles/` 目录下
2. `~/.cc-switch/state.json` 记录当前激活的 Profile
3. 切换时，先将当前 settings.json 同步回当前 Profile 目录，再将目标 Profile 的配置复制到 `~/.claude/settings.json`
4. 这样确保切换时不会丢失任何配置

**交互式菜单：**

直接运行 `cc-switch` 即可进入交互式菜单：

```bash
cc-switch
```

交互式菜单提供创建、切换、删除、重命名 Profile 等操作，适合不熟悉命令行参数的用户。

### @adithya-13/cc-switch — 提供商切换模式

这个版本的核心概念是 **Provider（提供商）**。每个 Provider 对应一个 AI 服务商的 API 配置，切换 Provider 就是更新 API 地址和密钥。

**工作原理：**

1. API Key 存储在 `~/.cc-switch/keys.json`，文件权限为 chmod 600
2. 切换时自动更新 `~/.claude/settings.json` 中的 `ANTHROPIC_BASE_URL` 和认证信息
3. 密钥不会被硬编码或暴露在配置文件中

**快速切换：**

```bash
# 切换到 Claude Pro/Max（使用 OAuth 认证）
cc-switch use pro

# 切换到 OpenRouter
cc-switch use openrouter

# 切换到 DeepSeek
cc-switch use deepseek
```

## 常用命令

### @aravhawk/cc-switch 命令一览

| 命令 | 说明 |
|------|------|
| `cc-switch` | 打开交互式菜单 |
| `cc-switch <profile-name>` | 快速切换到指定 Profile |
| `cc-switch --create <name>` | 从当前配置创建新 Profile |
| `cc-switch --create <name> --template <provider> --api-key <key>` | 使用提供商模板创建 Profile |
| `cc-switch --delete <name>` | 删除指定 Profile（不能删除当前激活的） |
| `cc-switch --rename <old> <new>` | 重命名 Profile |
| `cc-switch --list` | 列出所有 Profile |
| `cc-switch --current` | 显示当前激活的 Profile |
| `cc-switch --help` | 显示帮助信息 |

### @adithya-13/cc-switch 命令一览

| 命令 | 说明 |
|------|------|
| `cc-switch use <provider>` | 切换到指定提供商 |
| `cc-switch list` | 列出所有提供商及 Key 状态 |
| `cc-switch status` | 显示当前激活的提供商 |
| `cc-switch add <name>` | 通过交互式向导添加自定义提供商 |
| `cc-switch doctor` | 检查配置状态和已保存的 Key |

### 支持的提供商模板

@aravhawk/cc-switch 内置的提供商模板：

| 模板名 | 对应服务 | 说明 |
|--------|----------|------|
| `anthropic` | Claude | 官方 API，使用 ANTHROPIC_API_KEY |
| `moonshot` | Kimi | 月之暗面，使用 ANTHROPIC_AUTH_TOKEN |
| `zai` | GLM | 智谱 AI，使用 ANTHROPIC_AUTH_TOKEN |
| `minimax` | MiniMax | MiniMax API |

@adithya-13/cc-switch 支持的提供商：

| 提供商 | 命令 | 可用模型 |
|--------|------|----------|
| Claude Pro/Max | `cc-switch use pro` | Claude Sonnet/Opus（OAuth） |
| z.ai | `cc-switch use zai` | GLM-4.7, GLM-5 |
| Kimi (Moonshot) | `cc-switch use kimi` | Kimi K2.5 |
| OpenRouter | `cc-switch use openrouter` | 320+ 模型 |
| DeepSeek | `cc-switch use deepseek` | DeepSeek V3, R1 |
| Qwen (Alibaba) | `cc-switch use qwen` | Qwen3.5 |
| Ollama (本地) | `cc-switch use ollama` | 任意本地模型 |

## 使用场景和示例

### 场景一：在工作和个人账户之间切换

如果你有一个公司的 Anthropic API Key 和一个个人 Key，可以创建两个 Profile：

```bash
# 创建工作配置 Profile
cc-switch --create work --template anthropic --api-key sk-ant-work-xxxxx

# 切换到工作 Profile
cc-switch work

# 创建个人配置 Profile
cc-switch --create personal --template anthropic --api-key sk-ant-personal-xxxxx

# 切换到个人 Profile
cc-switch personal

# 查看当前使用的 Profile
cc-switch --current
```

### 场景二：额度耗尽时快速切换提供商

使用 @adithya-13/cc-switch，当 Claude Pro 额度用完时一键切换：

```bash
# 查看当前状态
cc-switch status

# Claude Pro 额度用完，切换到 OpenRouter
cc-switch use openrouter

# 或者切换到 DeepSeek
cc-switch use deepseek

# 检查配置是否正确
cc-switch doctor
```

### 场景三：使用本地模型

通过 Ollama 运行本地模型，无需 API Key：

```bash
# 切换到 Ollama 本地模型
cc-switch use ollama

# 确保 Ollama 服务正在运行
ollama serve
```

### 场景四：添加自定义提供商

如果你使用的提供商不在预设列表中，可以通过交互式向导添加：

```bash
# @adithya-13/cc-switch 方式
cc-switch add my-provider

# 按提示输入：
# - API Base URL
# - API Key
# - 默认模型名称
```

或使用 @aravhawk/cc-switch 的模板方式：

```bash
# 先切换到目标配置，手动编辑 settings.json
# 然后保存为 Profile
cc-switch --create my-custom-config
```

### 场景五：管理多个项目的不同配置

不同项目可能需要不同的 Claude Code 配置（如不同的权限设置、MCP Server 配置等）：

```bash
# 为前端项目创建 Profile
cc-switch --create frontend-project

# 为后端项目创建 Profile
cc-switch --create backend-project

# 列出所有 Profile
cc-switch --list

# 开始前端开发时
cc-switch frontend-project

# 切换到后端项目时
cc-switch backend-project
```

## 常见问题

### Q: 两个 cc-switch 包可以同时安装吗？

不可以。它们都注册了 `cc-switch` 全局命令，会产生冲突。请根据需求选择其中一个安装。如果需要同时使用 Profile 管理和提供商切换功能，建议安装 @aravhawk/cc-switch（它也支持提供商模板），然后手动添加不内置的提供商。

### Q: 切换后 Claude Code 需要重启吗？

需要重启当前 Claude Code 会话。切换配置后，退出正在运行的 Claude Code（输入 `/exit` 或按 `Ctrl+C`），然后重新启动 `claude` 即可生效。

### Q: 切换配置会丢失当前设置吗？

不会。@aravhawk/cc-switch 在切换时会先将当前 settings.json 同步回当前 Profile 目录，确保不会丢失任何配置。@adithya-13/cc-switch 的 Key 存储在独立的 `keys.json` 中，也不影响原有配置。

### Q: Profile 名称有什么限制？

Profile 名称必须非空，只能包含字母、数字、连字符和下划线，不能包含路径分隔符，也不能使用保留字（如 `help`、`version`）。

```bash
# 合法的 Profile 名称
cc-switch --create my-work
cc-switch --create project_2024
cc-switch --create dev-config

# 不合法的名称（会报错）
cc-switch --create my/config   # 包含路径分隔符
cc-switch --create help         # 保留字
```

### Q: API Key 安全吗？

@adithya-13/cc-switch 将 Key 存储在 `~/.cc-switch/keys.json`，文件权限设置为 chmod 600（仅所有者可读写）。Key 不会被硬编码在代码中或暴露在日志中。但仍建议定期轮换 API Key，不要将 keys.json 文件提交到版本控制。

### Q: 如何卸载 cc-switch？

```bash
# 卸载 @aravhawk/cc-switch
npm uninstall -g @aravhawk/cc-switch

# 卸载 @adithya-13/cc-switch
npm uninstall -g @adithya-13/cc-switch

# 清理配置目录（可选，会删除所有保存的 Profile 和 Key）
rm -rf ~/.cc-switch
```

### Q: 如何恢复到默认配置？

```bash
# @aravhawk/cc-switch：创建一个 Profile 保存默认配置
cc-switch --create default

# 之后随时可以切回
cc-switch default

# @adithya-13/cc-switch：切回 Claude Pro
cc-switch use pro
```

## 总结

cc-Switch 解决了 Claude Code 多配置管理的痛点，让开发者可以：

- **一键切换** — 无需手动编辑 settings.json，一条命令完成配置切换
- **安全可靠** — 切换时自动保存当前配置，不会丢失任何设置
- **多提供商支持** — 支持 Anthropic、OpenRouter、DeepSeek、Kimi、Ollama 等主流提供商
- **灵活扩展** — 支持自定义提供商和配置模板

如果你经常在多个 AI 提供商或多个 Claude Code 配置之间切换，cc-Switch 是一个值得加入工具链的效率工具。建议根据你的使用场景选择合适的版本：

| 需求 | 推荐版本 |
|------|----------|
| 管理多套完整的 settings.json 配置 | @aravhawk/cc-switch |
| 在多个 AI 提供商之间快速切换 | @adithya-13/cc-switch |
| 在 Claude Code 内部通过 MCP 使用 | @imvhb/cc-switch-mcp-server |

相关链接：

- @aravhawk/cc-switch: https://www.npmjs.com/package/@aravhawk/cc-switch
- @adithya-13/cc-switch: https://www.npmjs.com/package/@adithya-13/cc-switch
- @imvhb/cc-switch-mcp-server: https://www.npmjs.com/package/@imvhb/cc-switch-mcp-server
