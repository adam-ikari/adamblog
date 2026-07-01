---
title: Gemini CLI 入门教程（Windows 篇）
description: 在 Windows 上安装和使用 Google Gemini CLI，通过命令行与 Gemini AI 模型交互
category: AI
tags: [Gemini CLI, Gemini, AI]
date: 2025-07-07
---

# Gemini CLI 入门教程（Windows 篇）

Google 的 Gemini CLI 是个命令行工具，让你在终端里直接跟 Gemini 模型对话。这篇讲的是在 Windows 上怎么把它装起来、用起来。



## 目录

- [目录](#目录)
- [1. 环境准备](#1-环境准备)
  - [安装 Node.js](#安装-nodejs)
- [2. 安装 Gemini CLI](#2-安装-gemini-cli)
- [3. 登录与授权](#3-登录与授权)
  - [方式一：使用 Google 账号登录（推荐）](#方式一使用-google-账号登录推荐)
  - [方式二：使用 API 密钥（可选）](#方式二使用-api-密钥可选)
- [4. 基本使用](#4-基本使用)
- [总结](#总结)

## 1. 环境准备

动手之前，先确认两件事：系统能正常访问 Google，Node.js 和 npm 已经装好了。

### 安装 Node.js

Gemini CLI 本身是个 Node.js 包，得先有 Node.js 环境。

1.  **下载 Node.js**:
    访问 [Node.js 官方网站](https://nodejs.org/en/download/)，建议下载 **LTS（长期支持）** 版本的 Windows 安装包 (`.msi`)。

2.  **安装 Node.js**:
    双击下载的 `.msi` 文件，按向导提示装完。注意安装时勾上 "Add to PATH"，这样 `node` 和 `npm` 命令在任何终端位置才能用。

3.  **验证安装**:
    装完打开终端（推荐 **Windows Terminal**，PowerShell 或命令提示符也行，开始菜单里都能找到），输入：

    ```bash
    node -v
    npm -v
    ```

    能看到版本号输出（比如 `v20.11.0` 和 `10.2.4`），就说明装好了。

4.  **修改 npm 源（大陆使用者需要本步骤）**

大陆网络下，直接装 Gemini CLI 容易卡，得先把 npm 源换掉。

推荐用 chsrc 工具来换。

4.1. **安装 chsrc**

在终端接着输入下面的命令安装 chsrc 工具：

```powershell
winget install RubyMetric.chsrc
```

等待数分钟后提示安装成功。
接着可以输入命令

```powershell
chsrc set npm
```

出现下面的画面说明 npm 换源成功了

![alt text](/posts/Gemini-CLI-入门教程（windows篇）/chsrc.png)

## 2. 安装 Gemini CLI

环境准备就绪，就可以用 npm 全局安装了：

```bash
npm install -g @google/gemini-cli
```

`-g` 表示全局安装，装完之后在任何路径下都能用 `gemini` 命令。

装完可以用下面这条验证一下：

```bash
gemini --version
```

或者看看帮助：

```bash
gemini help
```

直接输入 `gemini` 就能启动。第一次会弹出主题选择，上下键挑个顺眼的，按 `Enter` 确定。

## 3. 登录与授权

接下来这一步要授权。Gemini CLI 支持两种方式：用 Google 账号走 OAuth 2.0 登录，或者直接用 API 密钥。

### 方式一：使用 Google 账号登录（推荐）

最简单，适合大多数个人用户。在终端里用上下键选 Google 账号登录，回车确认。它会自动打开浏览器跳到 Google 登录页，跟着引导登录就行（期间网络得畅通），登完就能用了。

### 方式二：使用 API 密钥（可选）

如果是在没法开浏览器的环境（服务器、CI/CD 流水线），或者你更习惯用 API 密钥，就走这条。

1.  **获取 API 密钥**:
    访问 [Google AI Studio](https://aistudio.google.com/app/apikey)（原 MakerSuite），登录 Google 账号后点 "Create API key" 创建一个新密钥。

2.  **复制 API 密钥**:
    把生成的那一长串字符复制下来。这东西别泄露给别人。

3.  **配置 API 密钥**:
    在 Windows 的环境变量里加一项 `GEMINI_API_KEY`，值就是上一步拿到的密钥。

## 4. 基本使用

授权过了，就能开始用了。

在要用 Gemini CLI 的文件夹里，按住 shift 同时点鼠标右键，从右键菜单里选“在终端中打开”。
![alt text](/posts/Gemini-CLI-入门教程（windows篇）/open_terminal_at_explorer.png)

此时终端里打开的是 PowerShell，输入 `gemini`：

![alt text](/posts/Gemini-CLI-入门教程（windows篇）/terminal.png)

```powershell
gemini
```

回车后，就能在终端里用自然语言指挥 Gemini 操作电脑了。

![alt text](/posts/Gemini-CLI-入门教程（windows篇）/gemini_cli_logo.png)

比如让它查北京未来十五天的天气，再写进 markdown 文件。它会自己去搜天气，然后把结果整理进文件。

![alt text](/posts/Gemini-CLI-入门教程（windows篇）/gemini-cli_example1.png)

这时候目录下就多了一个 `beijing_weather_forecast.md`，内容长这样：

```markdown
# 北京未来 15 天天气预报

根据气象台预报，北京未来 15 天天气多变，以多云和雷阵雨为主，并伴有高温天气。

**具体预报如下：**

| 日期               | 天气         | 最高温 | 最低温 |
| ------------------ | ------------ | ------ | ------ |
| 7 月 7 日（周一）  | 多云转雷阵雨 | 33℃    | 24℃    |
| 7 月 8 日（周二）  | 雷阵雨       | 31℃    | 25℃    |
| 7 月 9 日（周三）  | 雷阵雨转多云 | 32℃    | 24℃    |
| 7 月 10 日（周四） | 多云         | 31℃    | 23℃    |
| 7 月 11 日（周五） | 多云         | 33℃    | 24℃    |
| 7 月 12 日（周六） | 多云         | 33℃    | 24℃    |
| 7 月 13 日（周日） | 雷阵雨转阴   | 34℃    | 25℃    |
| 7 月 14 日（周一） | 阴转雨       | 37℃    | 25℃    |
| 7 月 15 日（周二） | 多云         | 41℃    | 28℃    |
| 7 月 16 日（周三） | 阴           | 29℃    | 23℃    |
| 7 月 17 日（周四） | 小雨         | 36℃    | 23℃    |
| 7 月 18 日（周五） | 小雨         | 36℃    | 25℃    |
| 7 月 19 日（周六） | 小雨         | 38℃    | 25℃    |
| 7 月 20 日（周日） | 小雨         | 34℃    | 27℃    |

**温馨提示:**

未来几天气温较高，请注意防暑降温。雷雨天气频繁，出行请注意安全，并随身携带雨具。
```

## 总结

装完用上一圈，会发现 Gemini CLI 把"用自然语言让电脑干活"这件事推进到了终端里。从前命令行是给会敲命令的人用的，现在你只要能把需求说清楚，它就替你去查、去写、去整理。当然它现在还远谈不上完美，复杂任务该出错还是会出错，但方向已经摆在这儿了。
