---
title: vue学习系列-01-工程创建学习
toc: true
categories:
  - 前端
date: 2023-02-22 10:28:57
tags:
  - Vue
  - Vue 学习系列
  - Web
  - 前端
cover: covers/Vue学习系列.png
---

## 前言

开始 vue 的学习。后面会陆续的更新一些学习 vue 过程中的理解和记录。

<!--more-->

接下来的 vue 工程创建参考了官网的文档:[《快速上手 | Vue.js 》](https://cn.vuejs.org/guide/quick-start.html)

## 阅读方法

> 这样在引用块中的文字表示引用官网文档的内容

## 创建 vue 工程

> 创建的项目将使用基于 Vite 的构建设置，并允许我们使用 Vue 的单文件组件 (SFC)。
> 确保你安装了最新版本的 Node.js，然后在命令行中运行以下命令 (不要带上 > 符号)：

我用的 node.js 版本是 18，运行下面的命令将使用 vite 创建的是 vue3 的工程。

```shell
npm init vue@latest
```

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
> 如果不确定是否要开启某个功能，你可以直接按下回车键选择 No。

具体的选项：

    ✔ Add TypeScript? … No / Yes

    集成 TypeScript 支持

    ✔ Add JSX Support? … No / Yes

    集成 JSX 支持

    ✔ Add Vue Router for Single Page Application development? … No / Yes

    集成 Vue Router

    ✔ Add Pinia for state management? … No / Yes

    集成 Pinia（Pinia 是 vue3 推荐使用的一个状态管理插件，替代了以前的 vuex）

    ✔ Add Vitest for Unit Testing? … No / Yes

    集成 Vitest 用于单元测试

    ✔ Add an End-to-End Testing Solution? › No

    集成一个端到端的测试解决方案。

    ✔ Add ESLint for code quality? … No / Yes

    集成 ESLint 代码质量检查

![创建 vue 工程的过程](Vue%E5%AD%A6%E4%B9%A0%E7%B3%BB%E5%88%97-01-%E5%B7%A5%E7%A8%8B%E5%88%9B%E5%BB%BA%E5%AD%A6%E4%B9%A0/%E5%88%9B%E5%BB%BAVue%E5%B7%A5%E7%A8%8B%E8%BF%87%E7%A8%8B.JPG)

我创建的时候选择了集成 Vue Router、Pinia、Vitest、eslint 和 Prettier。

## 分析一下创建的 vue 工程

先看看工程的目录结构。

```
├── README.md
├── index.html
├── package.json
├── public
│   └── favicon.ico
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── base.css
│   │   ├── logo.svg
│   │   └── main.css
│   ├── components
│   │   ├── HelloWorld.vue
│   │   ├── TheWelcome.vue
│   │   ├── WelcomeItem.vue
│   │   ├── __tests__
│   │   │   └── HelloWorld.spec.js
│   │   └── icons
│   │       ├── IconCommunity.vue
│   │       ├── IconDocumentation.vue
│   │       ├── IconEcosystem.vue
│   │       ├── IconSupport.vue
│   │       └── IconTooling.vue
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── stores
│   │   └── counter.js
│   └── views
│       ├── AboutView.vue
│       └── HomeView.vue
└── vite.config.js
```

### package.json 文件

分析一下 package.json 文件的内容

```json
{
  // ...
  "dependencies": {
    "pinia": "^2.0.28",
    "vue": "^3.2.45",
    "vue-router": "^4.1.6"
  },
  // ...
  "devDependencies": {
    "@rushstack/eslint-patch": "^1.1.4",
    "@vitejs/plugin-vue": "^4.0.0",
    "@vue/eslint-config-prettier": "^7.0.0",
    "@vue/test-utils": "^2.2.6",
    "eslint": "^8.22.0",
    "eslint-plugin-vue": "^9.3.0",
    "jsdom": "^20.0.3",
    "prettier": "^2.7.1",
    "vite": "^4.0.0",
    "vitest": "^0.25.6"
  }
  // ...
}
```

可以看到工程依赖了 pinia2、vue3 和 vue-router4。pinia2 和 vue-router4 以后再专门学习。

工程的开发依赖主要是 vite、eslint 、prettier 和 vitest。

分析一下脚本。

```json
{
  // ...
  "scripts": {
    "dev": "vite", // <= 启动开发服务，做到所见即所得
    "build": "vite build", // <= 构建工程，构建后的结果输出到工程的 ./dist 目录下
    "preview": "vite preview", // <= 预览构建到 ./dist 目录下的页面的效果，就不需要另外准备一个 http 服务了
    "test:unit": "vitest --environment jsdom --root src/", // <= 运行单体测试
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore" // <= 运行代码检查
  }
  // ...
}
```

### public 文件夹

这个文件夹下的内容会拷贝到生成的./dist/public 文件夹下，适合放一些静态文件和传统的 html 文件中 script 标签导入的 js 文件。

### src 文件夹

src 文件夹放 vue 工程的源码，包括 vue 组件，图片资源，需要打包到一起的 js 代码和 css 样式。

```
─ src
  ├── App.vue
  ├── assets  <= 放 css、svg 、图片等要使用 vite 打包的资源
  │   ├── base.css
  │   ├── logo.svg
  │   └── main.css
  ├── components  <= 放 vue 组件
  │   ├── HelloWorld.vue
  │   ├── TheWelcome.vue
  │   ├── WelcomeItem.vue
  │   ├── __tests__  <= 放 vue 组件的单体测试代码
  │   │   └── HelloWorld.spec.js
  │   └── icons
  │       ├── IconCommunity.vue
  │       ├── IconDocumentation.v
  │       ├── IconEcosystem.vue
  │       ├── IconSupport.vue
  │       └── IconTooling.vue
  ├── main.js <= vue 工程入口js文件
  ├── router <= 放路由的配置文件
  │   └── index.js
  ├── stores <= 放 vue store 的文件, 相当于 mvvm 模型中的 model。
  │   └── counter.js
  └── views <= 放路由的页面
      ├── AboutView.vue
      └── HomeView.vue
```

## 安装工程依赖

在项目被创建后，通过以下步骤安装依赖

```shell
cd <your-project-name>
npm install
```

## 启动开发服务

开发 vue 项目的时候需要有个开发服务用于预览工程部署后的效果，做到所见即所得。

```shell
npm run dev
```

## 构建工程

```shell
npm run build
```

> 此命令会在 ./dist 文件夹中为你的应用创建一个生产环境的构建版本。关于将应用上线生产环境的更多内容，请阅读[生产环境部署指南](https://cn.vuejs.org/guide/best-practices/production-deployment.html)。

## 参考

快速上手 | Vue.js ：<https://cn.vuejs.org/guide/quick-start.html>
