---
title: macOS 配置 cc-Switch 教程
description: 在 macOS 上安装配置 cc-Switch，实现 Claude Code 多提供商一键切换
category: AI工具
tags: [macOS, cc-Switch, Claude Code, CLI工具]
recommend: false
date: 2026-06-09
series:
  - id: series-macOS-claude
    name: macOS 配置 Claude Code 系列
    order: 3
    prev: /posts/macOS-安装和配置-Claude-Code-教程
    next: /posts/macOS-国产模型提供商选型指南
  - id: series-macOS-cc-switch
    name: macOS 配置 cc-Switch 系列
    order: 2
    prev: /posts/macOS-环境准备教程
    next:
---

# macOS 配置 cc-Switch 教程

## 前言

在使用 Claude Code 时，很多开发者会同时使用多个 AI 提供商（DeepSeek、讯飞、硅基流动、Kimi、Anthropic 官方、OpenRouter 等），或者需要在不同的 API Key 之间切换。尤其是**接入国产模型后，常常会同时配几家**——这家额度耗尽了切到那家、这个模型写代码好用那个模型便宜。每次手动编辑 `~/.claude/settings.json` 不仅繁琐，还容易出错：改错认证字段、漏改 Base URL、忘了重启会话，都会让 Claude Code 直接罢工。

**cc-Switch** 是一个命令行配置切换工具，专门为 Claude Code 设计。它让你用一条命令在多个配置之间快速切换，无需手动编辑配置文件，也无需重启终端。目前社区中有两个主要实现：

- **@aravhawk/cc-switch** — 配置文件 Profile 管理器，适合管理多套完整的 settings.json 配置
- **@adithya-13/cc-switch** — 提供商快速切换器，适合在 Anthropic、OpenRouter、DeepSeek 等提供商之间一键切换

> **注意：** cc-Switch 是社区开发的第三方工具，非 Anthropic 官方产品。具体功能请以官方仓库最新版本为准。

## 安装 cc-Switch

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

> **注意：** 两个包都提供 `cc-switch` 命令，不能同时全局安装。如果你需要管理多套完整的配置文件，选择 @aravhawk/cc-switch；如果你主要在不同 AI 提供商之间切换，选择 @adithya-13/cc-switch。

## 基本使用

### @aravhawk/cc-switch — Profile 管理模式

核心概念是 **Profile（配置档案）**。每个 Profile 保存一份完整的 `settings.json` 副本，切换 Profile 就是替换 `~/.claude/settings.json` 的内容。

**工作原理：**

1. Profile 存储在 `~/.cc-switch/profiles/` 目录下
2. `~/.cc-switch/state.json` 记录当前激活的 Profile
3. 切换时，先将当前 settings.json 同步回当前 Profile 目录，再将目标 Profile 的配置复制到 `~/.claude/settings.json`

**交互式菜单：**

```bash
cc-switch
```

直接运行即可进入交互式菜单，提供创建、切换、删除、重命名 Profile 等操作。

**命令行方式：**

```bash
# 切换到指定 Profile
cc-switch <profile-name>

# 从当前配置创建新 Profile
cc-switch --create <name>

# 使用提供商模板创建 Profile
cc-switch --create <name> --template <provider> --api-key <key>

# 列出所有 Profile
cc-switch --list

# 显示当前激活的 Profile
cc-switch --current
```

### @adithya-13/cc-switch — 提供商切换模式

核心概念是 **Provider（提供商）**。每个 Provider 对应一个 AI 服务商的 API 配置，切换 Provider 就是更新 API 地址和密钥。

**工作原理：**

1. API Key 存储在 `~/.cc-switch/keys.json`，文件权限为 chmod 600
2. 切换时自动更新 `~/.claude/settings.json` 中的 `ANTHROPIC_BASE_URL` 和认证信息
3. 密钥不会被硬编码或暴露在配置文件中

**命令行方式：**

```bash
# 切换到指定提供商
cc-switch use <provider>

# 列出所有提供商及 Key 状态
cc-switch list

# 通过交互式向导添加自定义提供商
cc-switch add <name>

# 显示当前激活的提供商
cc-switch status

# 检查配置状态和已保存的 Key
cc-switch doctor
```

**快速切换示例：**

```bash
# 切换到 Claude Pro/Max（使用 OAuth 认证）
cc-switch use pro

# 切换到 OpenRouter
cc-switch use openrouter

# 切换到 DeepSeek
cc-switch use deepseek

# 切换到 Ollama 本地模型
cc-switch use ollama
```

## macOS 上的使用场景

### 场景零：在多个国产模型之间切换（本系列核心）

接入国产模型后，最常见的需求就是**在几家之间来回切**：DeepSeek 写代码顺手但额度耗尽了，切到讯飞 Coding Plan 顶上；想试试硅基流动的免费额度；或者国际模型经 OpenRouter 临时用一下。这正是 cc-Switch 最该出场的地方。

下面分别用两个工具演示切换国产模型，注意配置里都用 **`ANTHROPIC_AUTH_TOKEN`**（国产模型走 Bearer 认证，详见 [配置详解](/posts/macOS-Claude-Code-配置详解)）。

**用 @aravhawk/cc-switch（Profile 模式）切换国产模型：**

每个国产模型一份完整 Profile，切 Profile 就是整体替换 settings.json：

```bash
# 用模板创建各国产模型 Profile（--api-key 填你的真实 Key）
cc-switch --create deepseek --template deepseek --api-key sk-deepseek-xxx
cc-switch --create xunfei  --template spark    --api-key your-spark-xxx
cc-switch --create silicon --template siliconflow --api-key sk-silicon-xxx

# 切到 DeepSeek
cc-switch deepseek

# DeepSeek 额度耗尽，切到讯飞
cc-switch xunfei

# 看看当前用的是谁
cc-switch --current
```

如果模板没覆盖某家（比如智谱、通义），用手动方式：先 `cc-switch --create <name>` 建空 Profile，再编辑对应的 Profile 文件填入正确的 `ANTHROPIC_BASE_URL` + `ANTHROPIC_AUTH_TOKEN` + `ANTHROPIC_MODEL`，之后就能一条命令切换。

**用 @adithya-13/cc-switch（Provider 模式）切换国产模型：**

内置 DeepSeek 等 Provider，切换只更新 API 地址和密钥，不动其他配置：

```bash
# 添加各提供商（交互式向导会问你 Base URL / Key / 模型）
cc-switch add deepseek
cc-switch add siliconflow

# 切到 DeepSeek
cc-switch use deepseek

# 切到硅基流动
cc-switch use siliconflow

# 确认当前生效的提供商和配置
cc-switch status
cc-switch doctor
```

::: tip 两套工具怎么选
- 同时管理「模型 + 权限 + MCP」整套配置、不同项目用不同套 → **@aravhawk（Profile 模式）**
- 只是想在几家国产模型 API 之间快速换 Key/地址 → **@adithya-13（Provider 模式）**，更轻
:::

### 场景一：工作/个人账户切换

macOS 用户经常同时拥有工作账户和个人账户。使用 @aravhawk/cc-switch 创建两个 Profile，一条命令即可切换：

```bash
# 创建讯飞配置 Profile
cc-switch --create work --template spark --api-key your-spark-api-key

# 切换到工作 Profile
cc-switch work

# 创建 DeepSeek 配置 Profile
cc-switch --create personal --template deepseek --api-key your-deepseek-api-key

# 切换到个人 Profile
cc-switch personal

# 查看当前使用的 Profile
cc-switch --current
```

### 场景二：API 额度耗尽时切换提供商

当 Claude Pro 额度用完时，使用 @adithya-13/cc-switch 一键切换到备用提供商：

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

### 场景三：多项目管理

不同项目可能需要不同的 Claude Code 配置（权限设置、MCP Server 配置等）。macOS 上使用 @aravhawk/cc-switch 为每个项目创建独立 Profile：

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

### 场景四：使用本地模型

macOS 上通过 Ollama 运行本地模型，无需 API Key，适合离线或隐私敏感场景：

```bash
# 切换到 Ollama 本地模型
cc-switch use ollama

# 确保 Ollama 服务正在运行
ollama serve
```

## 与 Windows 版本的差异

cc-Switch 在 macOS 和 Windows 上的核心功能一致，但存在以下差异：

### 配置文件路径

| 项目 | macOS | Windows (WSL2) |
|------|-------|----------------|
| Claude Code 配置 | `~/.claude/settings.json` | `~/.claude/settings.json`（WSL 内） |
| cc-Switch Profile 目录 | `~/.cc-switch/profiles/` | `~/.cc-switch/profiles/`（WSL 内） |
| cc-Switch Key 存储 | `~/.cc-switch/keys.json` | `~/.cc-switch/keys.json`（WSL 内） |

macOS 直接使用 Unix 路径，Windows 用户需要在 WSL2 环境内操作。

### 安装方式

macOS 上 npm 全局安装通常无需额外权限配置。Windows 上如果遇到权限问题，可能需要修改 npm 全局安装路径或使用 sudo。

```bash
# macOS：直接安装即可
npm install -g @aravhawk/cc-switch

# Windows WSL2：可能需要配置 npm 全局路径
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @aravhawk/cc-switch
```

### 文件权限

macOS 基于 Unix，`chmod 600` 等权限命令原生支持。@adithya-13/cc-switch 的 `keys.json` 文件权限设置在 macOS 上直接生效，无需额外操作。

Windows 的 NTFS 文件系统不支持 Unix 权限模型，WSL2 中通过 chmod 设置的权限仅在 WSL 内有效。

### Shell 集成

macOS 默认使用 zsh，环境变量配置写入 `~/.zshrc`：

```bash
# macOS：添加到 ~/.zshrc（国产模型用 AUTH_TOKEN 走 Bearer 认证）
echo 'export ANTHROPIC_BASE_URL="https://spark-api-open.xf-yun.com/v1"' >> ~/.zshrc
echo 'export ANTHROPIC_AUTH_TOKEN="your-spark-api-key"' >> ~/.zshrc
source ~/.zshrc
```

Windows WSL2 默认使用 bash，配置写入 `~/.bashrc`：

```bash
# Windows WSL2：添加到 ~/.bashrc
echo 'export ANTHROPIC_BASE_URL="https://spark-api-open.xf-yun.com/v1"' >> ~/.bashrc
echo 'export ANTHROPIC_AUTH_TOKEN="your-spark-api-key"' >> ~/.bashrc
source ~/.bashrc
```

### 代理配置

macOS 上如果使用代理，配置方式：

```bash
# macOS：添加到 ~/.zshrc
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
```

Windows WSL2 中代理配置类似，但需要注意 WSL2 的网络架构与宿主机的差异。

## 常见问题

### Q: 两个 cc-switch 包可以同时安装吗？

不可以。它们都注册了 `cc-switch` 全局命令，会产生冲突。请根据需求选择其中一个。如果需要同时使用 Profile 管理和提供商切换功能，建议安装 @aravhawk/cc-switch（它也支持提供商模板），然后手动添加不内置的提供商。

### Q: 切换后 Claude Code 需要重启吗？

需要重启当前 Claude Code 会话。切换配置后，退出正在运行的 Claude Code（输入 `/exit` 或按 `Ctrl+C`），然后重新启动 `claude` 即可生效。

### Q: macOS 上安装时报权限错误怎么办？

macOS 上 npm 全局安装一般不会遇到权限问题。如果出现 `EACCES` 错误，说明 npm 全局目录权限不正确：

```bash
# 修改 npm 全局安装路径（推荐）
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# 重新安装
npm install -g @aravhawk/cc-switch
```

不建议使用 `sudo npm install -g`，这可能导致文件权限混乱。

### Q: 切换配置会丢失当前设置吗？

不会。@aravhawk/cc-switch 在切换时会先将当前 settings.json 同步回当前 Profile 目录，确保不会丢失任何配置。@adithya-13/cc-switch 的 Key 存储在独立的 `keys.json` 中，也不影响原有配置。

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

cc-Switch 解决了 Claude Code 多配置管理的痛点，让 macOS 上的开发者可以：

- **一键切换** — 无需手动编辑 settings.json，一条命令完成配置切换
- **安全可靠** — 切换时自动保存当前配置，不会丢失任何设置
- **多提供商支持** — 支持 Anthropic、OpenRouter、DeepSeek、Kimi、Ollama 等主流提供商
- **灵活扩展** — 支持自定义提供商和配置模板

根据你的使用场景选择合适的版本：

| 需求 | 推荐版本 |
|------|----------|
| 管理多套完整的 settings.json 配置 | @aravhawk/cc-switch |
| 在多个 AI 提供商之间快速切换 | @adithya-13/cc-switch |

相关链接：

- @aravhawk/cc-switch: https://www.npmjs.com/package/@aravhawk/cc-switch
- @adithya-13/cc-switch: https://www.npmjs.com/package/@adithya-13/cc-switch
