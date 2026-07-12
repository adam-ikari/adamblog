---
title: macOS 开发环境准备教程
description: 在 macOS 上配置开发环境，安装 Homebrew、Node.js、终端和 Git
category: 系统配置
tags: [macOS, Homebrew, Node.js, 开发环境]
recommend: false
date: 2026-06-09
series:
  - series-macOS-claude
  - series-macOS-cc-switch
---
# macOS 开发环境准备教程

![macOS 开发环境准备流程](/posts/macOS-环境准备教程/macos-dev-env-flow.svg)

## 前言

macOS 凭借 Unix 内核与不错的用户体验，是不少开发者的首选系统。但一台新 Mac 开箱后，并不能直接投入开发——包管理器、运行时、终端、版本控制，这些基础件都得自己装一遍。本文就带你从零搭起一套够用的 macOS 开发环境。

这里说的"够用"，不只是能跑起来，还包括日后好维护：环境能用脚本或配置文件重建，运行时版本能灵活切换，重复操作尽量少。下面按 Homebrew、Node.js、终端、Git 的顺序依次来。

## Homebrew 安装和使用

Homebrew 是 macOS 上最常用的包管理器，把软件安装这件事变得简单且可追溯。它的定位类似 Linux 上的 apt 或 yum，命令行装、更新、卸载软件包都靠它。

### 安装 Homebrew

打开终端（Terminal.app 或 iTerm2），执行以下命令：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装完成后，按终端提示把 Homebrew 加入 PATH。Apple Silicon 机型（M 系列芯片）这一步不能省，因为 Homebrew 默认装在 `/opt/homebrew`，不在默认搜索路径里：

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

下面这些是日常用得最多的几条，搜索、装、卸、升、清理各一档。`brew update` 只更新 Homebrew 自身和软件包索引，并不会动你已装的版本；要真正升级软件包得靠 `brew upgrade`，两个概念新手容易混。装完如果某条命令报错或行为诡异，先跑 `brew doctor`，它会自检 PATH、权限、孤儿包这些常见问题并给出修复建议。

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

Node.js 是现代前端开发和不少 CLI 工具的运行时基础。装它推荐用版本管理器，方便日后在不同 Node 版本间切换。

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

nvm（Node Version Manager）能在多个 Node.js 版本间自由切换，是开发者的首选方案。

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

macOS Catalina 之后默认 Shell 就是 zsh。配上 Oh My Zsh 框架，命令行体验会好不少。

### 安装 Oh My Zsh

这一步会改写你的 `~/.zshrc`（安装脚本会自动备份原文件为 `.zshrc.pre-oh-my-zsh`），所以如果之前手写过别名或环境变量，装完记得把备份里的内容并回来。装完终端会自动切到 zsh 并加载新配置，提示符样式变了就说明成功了。

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

Oh My Zsh 的插件生态很丰富。编辑 `~/.zshrc`，在 `plugins` 里加上想要的：

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

Git 是版本控制的基础工具，装完后做几项基本配置就能用起来。

### 安装 Git

macOS 自带的 Git 通常是命令行工具（Command Line Tools）附带的版本，偏旧。用 Homebrew 装能拿到新版，且后续 `brew upgrade` 时会一并更新。装完 `git --version` 看一眼，确认走的是 Homebrew 的路径（`/opt/homebrew/bin/git`）而不是系统自带的，否则配置可能对不上。

```bash
# macOS 通常已预装 Git，或通过 Homebrew 安装最新版
brew install git

# 验证版本
git --version
```

### 基本配置

这几项是每次提交都会用到的基础信息：`user.name` 和 `user.email` 会写进每次 commit 的作者字段，建议和 GitHub/GitLab 账号邮箱保持一致，否则提交记录无法关联到你的账号。`init.defaultBranch` 改成 `main` 是为了对齐 GitHub 现在的默认，免得本地 `git init` 出来还是 `master`，推上去又得改。`core.editor` 设成 `code --wait` 后，遇到 merge 冲突这类需要编辑的场景，会自动用 VS Code 打开，关掉窗口才继续——`--wait` 不能省，少了它 Git 会直接往下走。

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

SSH 密钥是用来免密推送和拉取私有仓库的，配好后就不用每次输 HTTPS 的 token 了。这里选 Ed25519 算法，因为它比传统 RSA 更短、更快、安全性也更高。`-C` 后面的注释只是给这把钥匙起个名，习惯填邮箱方便日后在 `~/.ssh` 里认。

`ssh-agent` 是后台进程，负责在内存里保管已解锁的私钥，省得你每次连接都要输密码短语；`ssh-add` 把私钥交给它。最后那条 `cat` 是打印公钥，复制输出（以 `ssh-ed25519` 开头那一长串）粘到 GitHub 的 Settings → SSH and GPG keys 里——粘的是 `.pub` 公钥，私钥 `id_ed25519` 千万不能外泄。

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

上面配了 SSH 走密钥免密，但如果你有些仓库还是用 HTTPS 地址（比如克隆公开项目时直接复制了网页上的链接），第一次推拉会要求输用户名和 access token。这条配置让 Git 把凭据存进 macOS 钥匙串，输过一次后续就免了。SSH 和 HTTPS 两套不冲突，按仓库 remote 地址走哪套用哪套。

```bash
# macOS 使用系统钥匙串存储凭据
git config --global credential.helper osxkeychain
```

## 常用开发工具推荐

### 编辑器和 IDE

这步就是按需挑一个主力编辑器，命令本身没啥弯绕。VS Code 通用性最好、插件生态最全，是大多数前端和脚本场景的安全选择；JetBrains 那几款针对特定语言做得更深，但启动重、占内存，确定主力语言再装，别一上来全装一遍占满磁盘。下面都是 `--cask` 装的图形应用，和直接从官网下 dmg 效果一样，但走 Homebrew 后续能统一升级。

```bash
# Visual Studio Code
brew install --cask visual-studio-code

# JetBrains IDE（按需选择）
brew install --cask intellij-idea-ce    # IntelliJ IDEA Community
brew install --cask webstorm            # WebStorm
brew install --cask pycharm-ce          # PyCharm Community
```

### 开发工具

这里分两类看：前四个（Docker、Postman、TablePlus、HTTPie）是具体场景的工具，按你实际做的事挑着装，不做后端/数据库的可以跳过。后面那一串 `jq`、`ripgrep`、`fd`、`bat`、`exa`、`tldr` 是命令行增强件，分别替代原生 `grep`/`find`/`cat`/`ls`/`man`，速度更快、输出更友好，属于装了就回不去的那种，建议整组装上。

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

这几个是提升日常 Mac 使用效率的小工具，不直接参与开发但用熟了省很多事：Rectangle 用快捷键把窗口靠左/靠右/最大化，省去手动拖窗口；Alfred 是 Spotlight 的加强版，自定义工作流能跑脚本、查文档；AppCleaner 卸应用时连带清残留文件；Stats 在菜单栏看 CPU、内存、网速。都可选，按习惯挑。

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

本文把 macOS 开发环境的核心组件过了一遍：

| 组件 | 用途 | 推荐方案 |
|------|------|----------|
| Homebrew | 包管理器 | 官方脚本安装 |
| Node.js | JavaScript 运行时 | nvm 版本管理 |
| Oh My Zsh | Shell 增强 | 配合常用插件 |
| Git | 版本控制 | SSH 密钥认证 |

这套配置做完，你的 macOS 就具备了基本开发能力。往后可以接着装 Claude Code 体验 AI 辅助编程，或用 cc-Switch 管理多个 AI 提供商，也可以按项目需要补装 Python、Go、Rust 等语言环境。

最后一个小建议：把你的配置文件（`.zshrc`、`.gitconfig` 等）备份到 Git 仓库，换新机器时能快速恢复整套环境。
