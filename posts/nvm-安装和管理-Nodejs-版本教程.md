---
title: 使用 nvm 安装和管理 Node.js 版本
category: 开发工具
tags: [nvm, Node.js, 版本管理, 开发工具]
date: 2026-06-08
---

# 使用 nvm 安装和管理 Node.js 版本
## 前言：为什么需要 Node.js 版本管理

在日常开发中，不同项目往往依赖不同的 Node.js 版本。一个旧项目可能需要 Node.js 14 才能正常运行，而新项目则要求 Node.js 20 甚至更高版本。如果全局只安装一个版本，在项目间切换时就会遇到兼容性问题：

- 运行旧项目报语法错误或依赖不兼容
- 升级 Node.js 后全局工具失效
- 团队成员版本不一致导致"我这边没问题"的尴尬

手动卸载再安装不同版本既繁琐又容易出错。Node.js 版本管理工具正是为解决这些问题而生，它可以让你在同一台机器上安装多个 Node.js 版本，并随时快速切换。

## nvm 介绍

### nvm 是什么

nvm（Node Version Manager）是一个基于 Shell 的 Node.js 版本管理工具，允许你在同一台机器上安装和切换多个 Node.js 版本。它通过修改 PATH 环境变量来实现版本切换，每个版本拥有独立的 Node.js 运行时和全局包目录。

### 与其他版本管理工具对比

| 特性 | nvm | fnm | volta |
|------|-----|-----|-------|
| 实现语言 | Shell | Rust | Rust |
| 切换速度 | 较慢（需重新加载 Shell） | 快 | 快 |
| 跨平台 | Linux/macOS（Windows 需 nvm-windows） | Linux/macOS/Windows | Linux/macOS/Windows |
| 项目级版本 | .nvmrc | .node-version / .nvmrc | package.json |
| 全局包管理 | 每个版本独立 | 每个版本独立 | 自动跨版本迁移 |
| 稳定性 | 非常稳定，社区成熟 | 稳定，社区活跃 | 稳定 |
| 适合场景 | 通用，社区最广泛 | 追求速度 | 需要全局包迁移 |

nvm 是最经典、社区最广泛的方案，本文将重点讲解 nvm 的使用。

## 安装 nvm

### Linux / macOS 安装

使用官方安装脚本：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

或使用 wget：

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

安装脚本会自动完成以下操作：

1. 将 nvm 仓库克隆到 `~/.nvm` 目录
2. 在 `~/.bashrc`、`~/.zshrc` 或 `~/.profile` 中添加以下加载代码：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 加载 nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # nvm 补全
```

如果安装脚本没有自动添加，可以手动将上述代码追加到你的 Shell 配置文件中。

### Windows 安装（nvm-windows）

Windows 系统无法使用原版 nvm，需要使用 nvm-windows：

1. 先卸载已安装的 Node.js（控制面板 -> 卸载程序）
2. 前往 [nvm-windows Releases 页面](https://github.com/coreybutler/nvm-windows/releases) 下载最新的 `nvm-setup.exe`
3. 运行安装程序，按提示完成安装

安装完成后，nvm-windows 会自动配置环境变量。

### 验证安装

安装完成后，重新打开终端，运行以下命令验证：

```bash
nvm --version
```

输出示例：

```
0.40.3
```

如果看到版本号输出，说明 nvm 已安装成功。如果提示 `nvm: command not found`，请检查 Shell 配置文件是否正确加载了 nvm。

## 基本使用

### nvm install - 安装指定版本

安装最新的 LTS 版本：

```bash
nvm install --lts
```

输出示例：

```
Installing latest LTS version.
Downloading and installing node v22.16.0...
Local version of npm is out of date. To install the latest, run:
  npm install -g npm@latest
```

安装指定版本：

```bash
nvm install 20.19.0
```

输出示例：

```
Downloading and installing node v20.19.0...
Local version of npm is out of date. To install the latest, run:
  npm install -g npm@latest
```

安装最新的 Node.js 版本：

```bash
nvm install node
```

### nvm use - 切换版本

切换到已安装的指定版本：

```bash
nvm use 20.19.0
```

输出示例：

```
Now using node v20.19.0 (npm v10.8.2)
```

切换到最新的 LTS 版本：

```bash
nvm use --lts
```

输出示例：

```
Now using node v22.16.0 (npm v10.9.2)
```

::: tip 注意
在 Linux/macOS 中，`nvm use` 只在当前 Shell 会话中生效。新开的终端会使用 default 别名指向的版本。
:::

### nvm ls - 查看已安装版本

查看本地已安装的所有 Node.js 版本：

```bash
nvm ls
```

输出示例：

```
       v18.20.5
       v20.19.0
->      v22.16.0
         system
default -> lts/* (-> v22.16.0)
iojs -> N/A (default)
unstable -> N/A (default)
node -> stable (-> v22.16.0) (default)
stable -> 22.16.0 (-> v22.16.0)
lts/* -> lts/jod (-> v22.16.0)
lts/argon -> v4.9.1 (-> N/A)
lts/boron -> v6.17.1 (-> N/A)
...
lts/jod -> v22.16.0
```

其中 `->` 指向的是当前正在使用的版本。

### nvm ls-remote - 查看可安装版本

查看所有可安装的 Node.js 版本：

```bash
nvm ls-remote
```

输出示例（截取部分）：

```
          v0.1.14
          v0.1.15
          ...
         v20.18.0   (LTS: Iron)
         v20.19.0   (Latest LTS: Iron)
         v22.16.0   (Latest LTS: Jod)
```

只查看 LTS 版本：

```bash
nvm ls-remote --lts
```

输出示例：

```
         v4.2.0   (LTS: Argon)
         v4.2.1   (LTS: Argon)
         ...
         v22.16.0   (Latest LTS: Jod)
```

### nvm current - 查看当前版本

查看当前 Shell 会话正在使用的 Node.js 版本：

```bash
nvm current
```

输出示例：

```
v22.16.0
```

## 进阶使用

### nvm alias - 设置别名

nvm 支持为版本号设置别名，方便记忆和切换。

为某个版本设置别名：

```bash
nvm alias legacy 18.20.5
```

输出示例：

```
legacy -> 18.20.5
```

使用别名切换版本：

```bash
nvm use legacy
```

输出示例：

```
Now using node v18.20.5 (npm v10.8.2)
```

删除别名：

```bash
nvm unalias legacy
```

输出示例：

```
Deleted alias legacy - restore it with `nvm alias legacy 18.20.5`
```

### nvm alias default - 设置默认版本

设置每次打开新终端时默认使用的 Node.js 版本：

```bash
nvm alias default 20.19.0
```

输出示例：

```
default -> 20.19.0
```

设置默认版本为最新 LTS：

```bash
nvm alias default 'lts/*'
```

输出示例：

```
default -> lts/* (-> v22.16.0)
```

::: tip 提示
`nvm use` 只影响当前终端，`nvm alias default` 影响所有新开的终端。建议将最常用的版本设为 default。
:::

### .nvmrc 文件使用（项目级版本管理）

在项目根目录创建 `.nvmrc` 文件，声明项目所需的 Node.js 版本：

```bash
echo "20.19.0" > .nvmrc
```

`.nvmrc` 文件内容：

```
20.19.0
```

也支持使用 LTS 代号：

```
lts/iron
```

进入项目目录后，运行以下命令自动切换到 `.nvmrc` 指定的版本：

```bash
nvm use
```

输出示例：

```
Found '/path/to/project/.nvmrc' with version <20.19.0>
Now using node v20.19.0 (npm v10.8.2)
```

::: tip 自动切换
可以在 Shell 配置中添加以下函数，实现进入目录时自动切换版本：

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
cdnvm() {
  cd "$@" && if [ -f .nvmrc ]; then nvm use; fi
}
```

也可以使用 [avn](https://github.com/wbyoung/avn) 等工具实现目录切换时自动加载 `.nvmrc`。
:::

### nvm exec - 在指定版本下执行命令

在不切换当前版本的情况下，使用指定版本运行命令：

```bash
nvm exec 18.20.5 node -v
```

输出示例：

```
Running node v18.20.5 (npm v10.8.2)
v18.20.5
```

在指定版本下运行 npm 脚本：

```bash
nvm exec 20.19.0 npm run build
```

也可以使用 `nvm run` 在指定版本下运行 Node.js 脚本：

```bash
nvm run 18.20.5 app.js
```

输出示例：

```
Running node v18.20.5 (npm v10.8.2)
Hello from Node.js v18.20.5!
```

## 常见问题

### 切换版本后 npm 全局包丢失

**原因**：nvm 为每个 Node.js 版本维护独立的全局包目录。切换版本后，全局包自然不会跟随。

**解决方案**：

查看当前版本的全局包：

```bash
nvm use 18.20.5
npm ls -g --depth=0
```

输出示例：

```
/home/user/.nvm/versions/node/v18.20.5/lib
├── pnpm@9.15.0
└── typescript@5.7.2
```

如果希望在新版本中也有这些包，需要重新安装：

```bash
nvm use 22.16.0
npm install -g pnpm typescript
```

::: tip 提示
如果跨版本迁移全局包是常见需求，可以考虑使用 [volta](https://volta.sh/)，它支持全局包自动迁移。
:::

### nvm install 速度慢（配置镜像源）

国内网络环境下，从 Node.js 官方源下载可能很慢。可以配置国内镜像源。

临时使用镜像源：

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
nvm install 20.19.0
```

永久配置，在 Shell 配置文件（`~/.bashrc` 或 `~/.zshrc`）中添加：

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
```

保存后重新加载配置：

```bash
source ~/.zshrc
```

Windows（nvm-windows）配置镜像源：

```bash
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

### 与全局 npm 包的关系

每个 Node.js 版本都有自己独立的全局 `node_modules` 目录，位于：

```
~/.nvm/versions/node/<version>/lib/node_modules/
```

这意味着：

- 在 v18 下安装的全局包，在 v20 下不可用
- 切换版本后，全局命令的来源也会改变
- 删除某个版本时，该版本下的全局包也会一并删除

查看全局包安装路径：

```bash
npm root -g
```

输出示例：

```
/home/user/.nvm/versions/node/v20.19.0/lib/node_modules
```

如果某些全局工具需要跨版本使用，推荐做法是将它们作为项目的 devDependencies 安装，通过 `npx` 调用。

## 最佳实践

1. **始终使用 LTS 版本作为 default**。生产项目应使用 LTS 版本，只有需要测试新特性时才使用 Current 版本。

2. **每个项目使用 `.nvmrc`**。将 `.nvmrc` 加入版本控制，确保团队成员使用一致的 Node.js 版本。

3. **全局包最小化**。尽量使用项目级依赖（devDependencies）和 npx，减少对全局包的依赖，降低版本切换时的维护成本。

4. **定期清理不再使用的版本**。使用 `nvm ls` 查看已安装版本，用 `nvm uninstall` 删除不需要的版本，释放磁盘空间：

   ```bash
   nvm uninstall 16.20.0
   ```

   输出示例：

   ```
   Uninstalled node v16.20.0
   ```

5. **升级前先安装再切换**。升级 Node.js 时，先安装新版本，确认项目正常运行后再切换 default，避免旧版本已删除但新版本还没装好的尴尬。

6. **CI 环境中使用 `.nvmrc`**。在 CI 配置中读取 `.nvmrc` 的版本号来指定 Node.js 版本，保持本地和 CI 一致。GitHub Actions 示例：

   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version-file: '.nvmrc'
   ```

## 总结

nvm 是管理 Node.js 版本最成熟的工具，通过简单的命令即可实现多版本安装和快速切换。掌握以下核心命令即可覆盖日常大部分场景：

| 命令 | 作用 |
|------|------|
| `nvm install <version>` | 安装指定版本 |
| `nvm use <version>` | 切换版本 |
| `nvm ls` | 查看已安装版本 |
| `nvm ls-remote` | 查看可安装版本 |
| `nvm alias default <version>` | 设置默认版本 |
| `nvm current` | 查看当前版本 |
| `nvm uninstall <version>` | 卸载指定版本 |

配合 `.nvmrc` 文件实现项目级版本管理，可以让团队协作更加顺畅，不再为 Node.js 版本不一致而烦恼。
