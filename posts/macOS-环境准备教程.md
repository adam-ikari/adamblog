---
title: macOS 开发环境准备教程
description: 在 macOS 上配置开发环境，安装 Homebrew、Node.js、终端和 Git
category: 系统配置
tags: [macOS, Homebrew, Node.js, 开发环境]
date: 2026-06-09
recommend: ['series-macOS-claude', 'series-macOS-cc-switch', 1]
series:
  - id: series-macOS-claude
    name: macOS 配置 Claude Code 系列
    order: 1
    prev:
    next: /posts/macOS-安装和配置-Claude-Code-教程
  - id: series-macOS-cc-switch
    name: macOS 配置 cc-Switch 系列
    order: 1
    prev:
    next: /posts/macOS-配置cc-Switch教程
---

# macOS 开发环境准备教程

## 前言

macOS 凭借其 Unix 内核和优秀的用户体验，成为众多开发者的首选操作系统。然而，新 Mac 开箱后并不能直接投入开发工作，需要安装和配置一系列工具。本文将带你从零开始搭建一个高效的 macOS 开发环境，涵盖包管理器、运行时环境、终端配置、版本控制等核心组件。

一个良好的开发环境应该具备以下特点：

- **可复现性**：通过脚本或配置文件快速重建环境
- **版本管理**：灵活切换不同版本的运行时和工具
- **高效操作**：减少重复劳动，提升开发效率
- **一致性**：与团队其他成员保持环境一致

## Homebrew 安装和使用

Homebrew 是 macOS 上最流行的包管理器，它让软件安装变得简单且可追溯。类似于 Linux 上的 apt 或 yum，Homebrew 可以通过命令行安装、更新和卸载软件包。

### 安装 Homebrew

打开终端（Terminal.app 或 iTerm2），执行以下命令：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装完成后，根据终端提示将 Homebrew 添加到 PATH（Apple Silicon Mac 需要此步骤）：

```bash
# Apple Silicon Mac (M1/M2/M3/M4)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Intel Mac
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

验证安装：

```bash
brew --version
```

### 常用命令

```bash
# 搜索软件包
brew search <package_name>

# 安装软件包
brew install <package_name>

# 卸载软件包
brew uninstall <package_name>

# 查看已安装的软件包
brew list

# 更新 Homebrew 本身
brew update

# 升级所有已安装的软件包
brew upgrade

# 清理旧版本和缓存
brew cleanup

# 查看软件包信息
brew info <package_name>

# 诊断 Homebrew 问题
brew doctor
```

### 使用 Homebrew Cask 安装 GUI 应用

Homebrew Cask 扩展了 Homebrew，支持安装 macOS 图形界面应用：

```bash
# 安装 Visual Studio Code
brew install --cask visual-studio-code

# 安装 Google Chrome
brew install --cask google-chrome

# 安装 Docker Desktop
brew install --cask docker
```

## Node.js 安装

Node.js 是现代前端开发和许多 CLI 工具的基础运行时。推荐使用版本管理器来安装和管理 Node.js，这样可以灵活切换不同版本。

### 方式一：使用 Homebrew 安装（简单直接）

适合只需要一个稳定版本的场景：

```bash
# 安装 Node.js LTS 版本
brew install node

# 验证安装
node --version
npm --version
```

### 方式二：使用 nvm 安装（推荐）

nvm（Node Version Manager）允许你在多个 Node.js 版本之间自由切换，是开发者的首选方案。

安装 nvm：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

重新加载配置：

```bash
source ~/.zshrc
```

使用 nvm 安装和管理 Node.js：

```bash
# 查看可安装的 Node.js 版本
nvm ls-remote

# 安装最新 LTS 版本
nvm install --lts

# 安装指定版本
nvm install 20

# 切换版本
nvm use 20

# 设置默认版本
nvm alias default 20

# 查看已安装版本
nvm ls

# 查看当前使用版本
nvm current
```

### 配置 npm 镜像源（可选）

如果网络访问 npm 官方源较慢，可以配置国内镜像：

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 恢复官方源
npm config set registry https://registry.npmjs.org

# 查看当前源
npm config get registry
```

## 终端配置（zsh + Oh My Zsh）

macOS Catalina 之后默认使用 zsh 作为 Shell。配合 Oh My Zsh 框架，可以获得更强大的命令行体验。

### 安装 Oh My Zsh

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### 配置主题

编辑 `~/.zshrc` 文件，修改 `ZSH_THEME` 变量：

```bash
# 使用 agnoster 主题（需要 Powerline 字体）
ZSH_THEME="agnoster"

# 或使用简洁的 robbyrussell 主题（默认）
ZSH_THEME="robbyrussell"
```

安装 Powerline 字体（如果使用 agnoster 等主题）：

```bash
brew install font-meslo-lg-nerd-font
```

然后在终端偏好设置中选择 "MesloLGS NF" 字体。

### 安装常用插件

Oh My Zsh 提供了丰富的插件生态。编辑 `~/.zshrc`，在 `plugins` 中添加：

```bash
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  z
)
```

安装第三方插件：

```bash
# 自动补全建议
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 语法高亮
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

重新加载配置：

```bash
source ~/.zshrc
```

### 推荐终端应用

- **iTerm2**：功能强大的终端替代品，支持分屏、热键、自动补全等功能
- **Warp**：现代化终端，内置 AI 命令补全
- **Alacritty**：GPU 加速的高性能终端

```bash
# 安装 iTerm2
brew install --cask iterm2
```

## Git 配置

Git 是版本控制的基础工具，安装后需要进行基本配置。

### 安装 Git

```bash
# macOS 通常已预装 Git，或通过 Homebrew 安装最新版
brew install git

# 验证版本
git --version
```

### 基本配置

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 设置默认分支名为 main
git config --global init.defaultBranch main

# 设置默认编辑器
git config --global core.editor "code --wait"

# 查看配置
git config --global --list
```

### 配置 SSH 密钥

```bash
# 生成 SSH 密钥（使用 Ed25519 算法）
ssh-keygen -t ed25519 -C "your.email@example.com"

# 启动 SSH Agent
eval "$(ssh-agent -s)"

# 添加密钥到 Agent
ssh-add ~/.ssh/id_ed25519

# 将公钥添加到 GitHub/GitLab
cat ~/.ssh/id_ed25519.pub
# 复制输出内容，添加到 GitHub Settings > SSH and GPG keys
```

### 配置 Git 凭据缓存

```bash
# macOS 使用系统钥匙串存储凭据
git config --global credential.helper osxkeychain
```

## 常用开发工具推荐

### 编辑器和 IDE

```bash
# Visual Studio Code
brew install --cask visual-studio-code

# JetBrains IDE（按需选择）
brew install --cask intellij-idea-ce    # IntelliJ IDEA Community
brew install --cask webstorm            # WebStorm
brew install --cask pycharm-ce          # PyCharm Community
```

### 开发工具

```bash
# Docker Desktop - 容器化开发
brew install --cask docker

# Postman - API 测试
brew install --cask postman

# TablePlus - 数据库管理
brew install --cask tableplus

# HTTPie - 命令行 HTTP 客户端
brew install httpie

# jq - JSON 处理工具
brew install jq

# ripgrep - 更快的 grep 替代品
brew install ripgrep

# fd - 更快的 find 替代品
brew install fd

# bat - 带语法高亮的 cat 替代品
brew install bat

# exa - 更好的 ls 替代品
brew install exa

# tldr - 简化的命令帮助
brew install tldr
```

### 系统工具

```bash
# Rectangle - 窗口管理
brew install --cask rectangle

# Alfred - 效率启动器
brew install --cask alfred

# AppCleaner - 应用卸载清理
brew install --cask appcleaner

# Stats - 系统状态监控
brew install --cask stats
```

## 总结

本文介绍了 macOS 开发环境的核心组件配置：

| 组件 | 用途 | 推荐方案 |
|------|------|----------|
| Homebrew | 包管理器 | 官方脚本安装 |
| Node.js | JavaScript 运行时 | nvm 版本管理 |
| Oh My Zsh | Shell 增强 | 配合常用插件 |
| Git | 版本控制 | SSH 密钥认证 |

完成以上配置后，你的 macOS 已经具备了基本的开发能力。接下来可以：

- 安装 Claude Code，体验 AI 辅助编程
- 配置 cc-Switch，管理多个 AI 提供商
- 根据项目需求安装其他语言环境（Python、Go、Rust 等）

建议将你的配置文件（`.zshrc`、`.gitconfig` 等）备份到 Git 仓库，方便在新机器上快速恢复开发环境。
