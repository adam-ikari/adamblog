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
  - [方式二：使用 API 密钥](#方式二使用-api-密钥)
- [4. 基本使用](#4-基本使用)
  - [基础文本交互](#基础文本交互)
  - [结合文件内容进行交互](#结合文件内容进行交互)
- [5. 进阶使用技巧](#5-进阶使用技巧)
  - [对话模式（聊天）](#对话模式聊天)
  - [流式输出](#流式输出)
  - [结合管道 (Piping) 使用](#结合管道-piping-使用)
  - [分析图片内容 (Vision)](#分析图片内容-vision)
- [6. 切换模型](#6-切换模型)

## 1. 环境准备

在使用 Gemini CLI 之前，您需要确保您的系统已经安装了 Node.js 和 npm。

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

## 3. 登录与授权

Gemini CLI 支持两种授权方式：通过 Google 账号（OAuth 2.0）登录或使用 API 密钥。

### 方式一：使用 Google 账号登录（推荐）

这是最简单直接的方式，适合大多数个人用户。

1.  在终端中运行以下命令：

    ```bash
    gemini auth login
    ```

2.  该命令会自动打开您的默认浏览器，并跳转到 Google 登录页面。

3.  选择您的 Google 账号，并授权 Gemini CLI 访问所需权限。

4.  授权成功后，浏览器会提示您可以关闭页面。此时，您的身份凭证已经安全地存储在本地，CLI 已准备就绪。

### 方式二：使用 API 密钥

如果您在无法打开浏览器的环境（例如服务器、CI/CD 流水线）中使用，或者偏好使用 API 密钥，可以选择此方式。

1.  **获取 API 密钥**:
    访问 [Google AI Studio](https://aistudio.google.com/app/apikey) (原 MakerSuite)。登录您的 Google 账号，然后点击 "Create API key" 创建一个新的密钥。

2.  **复制 API 密钥**:
    将生成的一长串字符复制下来。请务必妥善保管此密钥，不要泄露给他人。

3.  **配置 CLI**:
    在终端中运行以下命令，将 `<YOUR_API_KEY>` 替换为您刚刚复制的密钥：

    ```bash
    gemini auth <YOUR_API_KEY>
    ```

    执行后，您的 API 密钥将被保存，CLI 会使用它进行后续的所有请求。

## 4. 基本使用

授权完成后，您就可以开始使用 Gemini CLI 了。最核心的命令是 `gemini prompt`。

### 基础文本交互

直接向 Gemini 提问：

```bash
gemini prompt "你好，请用中文做个自我介绍"
```

### 结合文件内容进行交互

您还可以让 Gemini 分析本地文件。例如，您可以让它总结一个名为 `README.md` 的文件内容：

```bash
gemini prompt "请总结一下这个文件的主要内容" -f README.md
```

`-f` 参数用于指定输入文件。

## 5. 进阶使用技巧

掌握了基本用法后，让我们探索一些能极大提升效率的进阶技巧。

### 对话模式（聊天）

如果您需要进行多轮对话，而不是一问一答，可以使用 `chat` 命令启动一个交互式会话。

```bash
gemini chat
```

启动后，您会看到一个提示符 `>>`，可以直接输入问题。Gemini 会记住之前的对话内容，实现连续的上下文感知。

若想在聊天中分析文件，可以在启动时使用 `-f` 参数：

```bash
gemini chat -f "path/to/your/file.txt"
```

### 流式输出

默认情况下，Gemini 会在完全生成好答案后一次性输出。对于耗时较长的请求，您可以开启流式输出，让答案像打字机一 �� 逐字显示。

使用 `--stream` 参数即可：

```bash
gemini prompt "写一个关于太空探索的短篇故事" --stream
```

### 结合管道 (Piping) 使用

Gemini CLI 可以与其它命令行工具无缝结合，通过管道传递输入。这在处理命令行输出时非常有用。

例如，您可以使用 `ls -l` 列出当前目录的文件，并通过管道将结果传给 Gemini 进行分析：

```bash
ls -l | gemini prompt "分析这些文件，告诉我哪个文件最大"
```

### 分析图片内容 (Vision)

Gemini Pro Vision 模型具备强大的识图能力。您可以使用 `-f` 参数传入一张或多张图片（本地路径或 URL），然后提出关于图片的问题。

**分析本地图片**：

```bash
gemini prompt "这张图片里有什么？" -f "path/to/your/image.jpg"
```

**分析网络图片**：

```bash
gemini prompt "描述这张网络图片的内容" -f "https://storage.googleapis.com/generativeai-assets/images/gemini-pro-vision-prompt-example.jpeg"
```

**图文混合提问**：

您可以同时提供图片和文字，进行更复杂的提问。

```bash
gemini prompt "图片里的这个地标叫什么名字？它有什么历史背景？" -f "landmark.png"
```

## 6. 切换模型

Gemini CLI 默认使用 `gemini-1.5-flash` 模型。如果您想使用其它模型（如 `gemini-pro`），可以使用 `--model` 参数进行切换。

```bash
gemini prompt "用 gemini-pro 模型回答这个问题" --model gemini-pro
```

要查看所有可用的模型，可以运行：

```bash
gemini models list
```

---

至此，您已经掌握了在 Windows 上安装和使用 Gemini CLI 的基本流程和进阶技巧。要探索更多高级功能，请随时使用 `gemini help` 命令查看所有可用的命令和选项。
