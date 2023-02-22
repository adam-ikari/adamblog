---
title: vue学习系列-01-工程创建学习
toc: true
categories:
  - 前端
date: 2023-02-22 10:28:57
tags:
  - Vue
  - web
  - Vue学习系列
---

## 前言

开始 vue 的学习。
后面会陆续的更新一些学习 vue 过程中的理解和记录。

<!--more-->

## 首先创建 vue 工程

> 创建的项目将使用基于 Vite 的构建设置，并允许我们使用 Vue 的单文件组件 (SFC)。
> 确保你安装了最新版本的 Node.js，然后在命令行中运行以下命令 (不要带上 > 符号)：
>
> ```shell
> npm init vue@latest
> ```

我用的 node.js 版本是 18，创建的是 vue3 的工程。

> 这一指令将会安装并执行 create-vue，它是 Vue 官方的项目脚手架工具。你将会看到一些诸如 TypeScript 和测试支持之类的可选功能提示：
>
> ```shell
> ✔ Project name: … <your-project-name>
> ✔ Add TypeScript? … No / Yes
> ✔ Add JSX Support? … No / Yes
> ✔ Add Vue Router for Single Page Application development? … No / Yes
> ✔ Add Pinia for state management? … No / Yes
> ✔ Add Vitest for Unit testing? … No / Yes
> ✔ Add Cypress for both Unit and End-to-End testing? … No / Yes
> ✔ Add ESLint for code quality? … No / Yes
> ✔ Add Prettier for code formatting? … No / Yes
>
> Scaffolding project in ./<your-project-name>...
> Done.
> ```
>
> 如果不确定是否要开启某个功能，你可以直接按下回车键选择 No。在项目被创建后，通过以下步骤安装依赖并启动开发服务器：
>
> ```shell
> cd <your-project-name>
> npm install
> npm run dev
> ```

每个选项的意思：
✔ Add TypeScript? … No / Yes

支持 TypeScript

✔ Add JSX Support? … No / Yes

支持 JSX

✔ Add Vue Router for Single Page Application development? … No / Yes

支持路由

✔ Add Pinia for state management? … No / Yes

## 未完待续·····

## 参考

快速上手 | Vue.js ：<https://cn.vuejs.org/guide/quick-start.html>
