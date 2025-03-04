---
title: 在离线环境使用 nvm-windows 安装和管理 node.js
toc: false
categories:
  - 前端
abbrlink: 8af057e4
date: 2025-03-04 14:32:51
keywords:
  - node.js
  - nvm
  - nvm-windows
  - 离线安装
description: 本文详细介绍了在离线环境中使用 nvm-windows 安装和管理 Node.js 的步骤。首先，需要提前在有网络的环境中下载 nvm-windows 安装包和所需的 Node.js 版本文件，并将其拷贝到离线环境中。接着，通过运行 `nvm-setup.exe` 完成 nvm-windows 的安装，并手动将 Node.js 版本文件解压到 nvm 的安装目录下。最后，使用 nvm 命令查看、切换和验证已安装的 Node.js 版本。通过本教程，用户可以在无网络的环境中轻松管理多个 Node.js 版本。
tags: 前端 nvm 离线安装
cover:
---

<!--
注释的方法：
在正文需要注释的地方插入下面的代码，根据需要修改编号：
  <sup>[1](#note1)</sup>
在"注"章节插入对应编号的注释内容:
  <div id="note1"></div>
  [1] 这是注的内容
-->

## 摘要

本文详细介绍了在离线环境中使用 nvm-windows 安装和管理 Node.js 的步骤。首先，需要提前在有网络的环境中下载 nvm-windows 安装包和所需的 Node.js 版本文件，并将其拷贝到离线环境中。接着，通过运行 `nvm-setup.exe` 完成 nvm-windows 的安装，并手动将 Node.js 版本文件解压到 nvm 的安装目录下。最后，使用 nvm 命令查看、切换和验证已安装的 Node.js 版本。通过本教程，用户可以在无网络的环境中轻松管理多个 Node.js 版本。

<!--more-->

## 正文

### 离线环境安装 nvm-windows 并使用 nvm 安装和管理 Node.js 的教程

#### 1. 准备工作

在离线环境中安装 nvm-windows 需要提前准备好所需的安装包和 Node.js 版本文件。以下是具体步骤：

1. **下载 nvm-windows 安装包**：
   • 在有网络的环境中，访问 [nvm-windows GitHub 仓库](https://github.com/coreybutler/nvm-windows/releases)，下载最新版本的 `nvm-setup.exe` 安装包。
   • 将下载的安装包拷贝到离线环境的电脑中。

2. **下载 Node.js 版本文件**：
   • 在有网络的环境中，访问 [Node.js 官网](https://nodejs.org/dist/)，下载所需的 Node.js 版本的 `.zip` 文件（例如 `node-v14.17.0-win-x64.zip`）。
   • 将下载的 Node.js 版本文件拷贝到离线环境的电脑中。

#### 2. 安装 nvm-windows

1. **运行安装程序**：

   - 在离线环境中，双击 `nvm-setup.exe`，按照安装向导完成安装。
   - 在安装过程中，选择 nvm 的安装路径（例如 `C:\nvm4w`）。

2. **验证安装**：

   打开命令行，输入 `nvm -v`，如果显示 nvm 的版本号，说明安装成功。

   ```powersehll
   nvm -v
   # 返回 nvm 版本号
   # 1.2.2
   ```

#### 3. 手动安装 Node.js 版本

1. **手动安装 Node.js 版本**：
   • 将之前下载的 Node.js 版本文件（例如 `node-v20.18.3-win-x64.zip`）解压到 nvm 的安装目录下，并改名为 `v20.18.3` 文件夹中（例如 `C:\Users\<user>\AppData\Local\nvm`, 其中`<user>`是当前用户名）。

2. **验证**：

   ```powershell
   nvm list
   # 返回已经安装的 Node.js 版本
   # * 20.18.3
   ```

#### 4. 管理 Node.js 版本

1. **查看已经安装的 Node.js 版本**

   ```powershell
   nvm list
   # 返回已经安装的 Node.js 版本
   # * 20.18.3
   #   18.x.x
   ```

2. **切换 Node.js 版本**

   使用以下命令切换到已安装的 Node.js 版本：

   ```powershell
   nvm use 20.18.3
   ```

3. **验证 Node.js 版本**：
   • 输入 `node -v` 和 `npm -v`，查看当前使用的 Node.js 和 npm 版本，确保切换成功。

   ```powershell
   node -v
   # 返回 node.js 版本号
   # 20.18.3
   ```

### 总结

通过以上步骤，你可以在离线环境中成功安装并使用 nvm-windows 来管理多个 Node.js 版本。如果在安装或使用过程中遇到问题，可以参考 nvm-windows 的官方文档或社区支持。

<!-- more -->

## 注

无

## 参考

无
