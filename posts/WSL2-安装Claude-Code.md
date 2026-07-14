---
title: WSL2 安装 Claude Code（含 VS Code 插件配置）
description: 使用官方脚本在 WSL2 Ubuntu 26.04 中安装 Claude Code，配合 VS Code 扩展实现 AI 辅助编程
category: AI
tags: [WSL2, Claude Code, VS Code, AI, Ubuntu 26.04]
date: 2026-07-14
series: series-windows-ai
---
# WSL2 安装 Claude Code（含 VS Code 插件配置）

![Claude Code 安装流程图](/posts/WSL2-安装Claude-Code/claude-code-setup-flow.svg)

## 前言

> Claude Code 是 Anthropic 推出的官方命令行 AI 编程助手，能在终端中操作文件系统、执行命令、管理 Git 工作流。本教程带你在 WSL2 Ubuntu 26.04 中用官方一键脚本安装，然后配合 VS Code 扩展，在编辑器内直接与 Claude 交互。

本教程假设你已在 WSL2 中装好 Ubuntu 26.04。如果还没配置，先参考 [Windows 11 配置 WSL2 教程](/posts/Windows11-配置WSL2教程.md)。

## 前提条件

- WSL2 Ubuntu 26.04 已安装并正常运行

## 安装 Claude Code

**步骤 1：执行官方一键安装脚本**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

> 该脚本会自动检测系统环境，安装所需依赖和 Claude Code 原生二进制文件，无需手动安装 Node.js。装完后在任何目录都能用 `claude` 命令。

**步骤 2：验证安装**

```bash
claude --version
```

> 看到版本号（如 `2.1.x`）就说明安装成功。

**步骤 3：首次启动**

```bash
claude
```

> 首次启动会引导完成登录授权：
> - **OAuth 登录（推荐）**：Claude Code 自动打开浏览器跳转到 Anthropic 登录页面，登录后自动返回终端。
> - **API Key**：如果使用第三方 API 代理，需设置 `ANTHROPIC_API_KEY` 和 `ANTHROPIC_BASE_URL` 环境变量后再启动。

## 在 VS Code 中安装 Claude Code 插件

### 步骤 1：安装 VS Code（Windows 侧）

如果还没装 VS Code，从 [官网](https://code.visualstudio.com/) 下载 Windows 版安装。

> VS Code 安装在 Windows 侧（不是 WSL 里），然后通过 WSL 扩展连接到 WSL 中的开发环境。

### 步骤 2：安装 VS Code 扩展

打开 VS Code，按 `Ctrl+Shift+X` 打开扩展市场，搜索并安装以下两个扩展：

1. **WSL**（`ms-vscode-remote.remote-wsl`）——连接 WSL 的必备扩展
2. **Claude Code**（`Anthropic.claude-code`）——Claude 官方 VS Code 扩展

> WSL 扩展通常会在你首次从 WSL 打开 VS Code 时自动提示安装。Claude Code 扩展也可以直接在 PowerShell 中安装：
> ```powershell
> code --install-extension ms-vscode-remote.remote-wsl
> code --install-extension Anthropic.claude-code
> ```

### 步骤 3：连接到 WSL

在 VS Code 中按 `F1`，输入 **"WSL: 连接到 WSL"**（WSL: Connect to WSL），选择 `Ubuntu-26.04`。

> 连接后左下角状态栏会显示 `WSL: Ubuntu-26.04`，文件浏览器显示的是 WSL 中的文件系统，集成终端也自动进入 WSL 的 bash。

### 步骤 4：在 VS Code 中使用 Claude Code

在 VS Code 集成终端中（已是 WSL 环境）：

```bash
cd ~/projects/my-app
claude
```

> Claude Code 会自动识别 VS Code 当前打开的文件和项目上下文，可以直接让它读写项目中的代码文件。

## 常见问题与解决方法

### 安装时脚本下载失败

**问题**：`curl` 下载脚本时超时或失败

**解决方案**：

> 如果官网脚本无法访问，可以用 npm 作为备选：
> ```bash
> npm install -g @anthropic-ai/claude-code
> ```

### 无法连接 API

**问题**：启动后提示连接失败

**解决方案**：

> 如果使用第三方 API 代理，在 `~/.bashrc` 中配置环境变量：
> ```bash
> export ANTHROPIC_API_KEY="your-api-key"
> export ANTHROPIC_BASE_URL="https://your-proxy-url"
> ```
> 然后 `source ~/.bashrc` 重新加载。

### VS Code 扩展无法识别 WSL 中的 Claude

**问题**：VS Code 中 Claude Code 面板报错

**解决方案**：

> 确认两点：
> 1. WSL 中 Claude Code 已安装：`claude --version` 有输出
> 2. VS Code 已连接到 WSL：左下角显示 `WSL: Ubuntu-26.04`
>
> 如果 VS Code 连接的是 Windows 环境（左下角无 WSL 标识），Claude Code 扩展无法找到 WSL 中的 `claude` 命令。按步骤 3 重新连接即可。

## 总结

安装完成后，VS Code 中就有了一套完整的 AI 编程环境：

1. **在终端里运行 `claude`**——Claude 可以读取整个项目，直接编辑代码
2. **在 VS Code 中与 Claude 对话**——选中代码提问、让 Claude 解释或修改
3. **管理 Git 工作流**——Claude Code 能在终端里帮你写 commit message、查看 diff

> 更多信息请参考 [Claude Code 官方文档](https://code.claude.com/docs/en/overview)。
