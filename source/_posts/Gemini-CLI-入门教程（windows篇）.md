---
title: Gemini CLI 入门教程（Windows 篇）
toc: false
categories:
  - AI
tags:
  - Gemini CLI
  - Gemini
  - AI
abbrlink: 58cdf05b
date: "2025-07-07 12:16"
keywords:
description:
cover:
---

本教程将指导您如何在 Windows 操作系统上安装和使用 Google Gemini CLI。Gemini CLI 是一个命令行工具，可让您直接在终端中与 Gemini 模型进行交互。

<!-- more -->

## 目录

- [目录](#目录)
- [1. 环境准备](#1-环境准备)
  - [安装 Node.js](#安装-nodejs)
- [2. 安装 Gemini CLI](#2-安装-gemini-cli)
- [3. 登录与授权](#3-登录与授权)
  - [方式一：使用 Google 账号登录（推荐）](#方式一使用-google-账号登录推荐)
  - [方式二：使用 API 密钥（可选）](#方式二使用-api-密钥可选)
- [4. 基本使用](#4-基本使用)

## 1. 环境准备

在使用 Gemini CLI 之前，您需要确保您的系统可以正常访问 Google 网站，并已经安装了 Node.js 和 npm。

### 安装 Node.js

Gemini CLI 是一个 Node.js 包，因此需要先安装 Node.js 环境。

1.  **下载 Node.js**:
    访问 [Node.js 官方网站](https://nodejs.org/en/download/)。建议下载 **LTS (长期支持)** 版本的 Windows 安装包 (`.msi`)。

2.  **安装 Node.js**:
    双击下载的 `.msi` 文件，按照安装向导的提示完成安装。请确保在安装过程中勾选了 "Add to PATH" 选项，这样 `node` 和 `npm` 命令才可以在任何终端位置被识别。

3.  **验证安装**:
    安装完成后，打开您的终端（推荐使用 **Windows Terminal**，也可以使用 PowerShell 或命令提示符），输入以下命令来验证 Node.js 和 npm 是否安装成功：

    ```bash
    node -v
    npm -v
    ```

    如果您能看到版本号输出（例如 `v20.11.0` 和 `10.2.4`），则说明安装成功。

## 2. 安装 Gemini CLI

环境准备完成您可以通过 npm 全局安装 Gemini CLI。

在终端中运行以下命令：

```bash
npm install -g @google/gemini-cli
```

`-g` 参数表示全局安装，这样您就可以在系统的任何路径下使用 `gemini` 命令。

安装完成后，可以通过以下命令验证 Gemini CLI 是否安装成功：

```bash
gemini --version
```

或者查看帮助文档：

```bash
gemini help
```

输入 gemini 可以启动 Gemini CLI 工具。此时屏幕上会显示主题选项，通过上下键选择喜欢的主题，按下`Enter`键即可。

## 3. 登录与授权

接下来的步骤需要授权。

Gemini CLI 支持两种授权方式：通过 Google 账号（OAuth 2.0）登录或使用 API 密钥。

### 方式一：使用 Google 账号登录（推荐）

这是最简单直接的方式，适合大多数个人用户。

下终端中使用上下键选择 Google 账号登录，按下回车。
此时会自动大开浏览器进入 Google 账户登录页面，按照引导登录 Google 账号即可（需要保证网络畅通），登录之后就可以使用 Gemini CLI 了。

### 方式二：使用 API 密钥（可选）

如果您在无法打开浏览器的环境（例如服务器、CI/CD 流水线）中使用，或者偏好使用 API 密钥，可以选择此方式。

1.  **获取 API 密钥**:
    访问 [Google AI Studio](https://aistudio.google.com/app/apikey) (原 MakerSuite)。登录您的 Google 账号，然后点击 "Create API key" 创建一个新的密钥。

2.  **复制 API 密钥**:
    将生成的一长串字符复制下来。请务必妥善保管此密钥，不要泄露给他人。

3.  **配置 API 密钥**:
    在 Windows 的环境变量配置中加 GEMINI_API_KEY，值是上一步得到的密钥。

## 4. 基本使用

授权完成后，您就可以开始使用 Gemini CLI 了。
