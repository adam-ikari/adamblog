---
title: Vuex介绍
category: 前端
description: Vuex介绍
tags: [前端, Vuex, Vue, Vue.js]
date: 2023-05-11
---

# Vuex介绍
Vuex 是 Vue.js 里最常用的状态管理库，学 Vue 绕不开它。下面这份指南面向刚入门的开发者，尽量把概念讲清楚。

![Vuex 状态流转](/posts/Vuex介绍/vuex-data-flow.svg)

## 什么是 Vuex?

Vuex 是专门为 Vue.js 应用设计的状态管理模式。它把所有组件的状态集中存储在一个地方，并用一套规则保证状态以可预测的方式变化。

简单的应用其实用不着 Vuex。但应用一旦变大，尤其多个组件要共享状态时，它的价值就显现出来了。

下面是一个示例 Vuex 架构图：

![Vuex Architecture](https://vuex.vuejs.org/vuex.png)

> 这张是 Vuex 的概念图，展示了 Vue 组件、Vuex store 和后端服务器之间的数据流动。组件可以通过 dispatch action 触发 store 里的 mutation，从而改变 state；也可以通过 getters 读取 state。store 则通过调用 API 和后端服务器通信，获取或更新数据。

## Vuex 的核心概念

- **State（状态）**：所有状态存在一个单一的 state 对象里，状态变了，视图跟着更新。

- **Getter（获取器）**：从 store 读取状态值的计算属性。

- **Mutation（变化）**：更改 store 状态的同步操作。多个 Mutation 之间可能有依赖关系，按特定顺序执行。

- **Action（动作）**：提交 mutation 的异步操作，可以包含任意异步逻辑。Action 和 Mutation 是独立的，但通常是 Action 调用 Mutation 来更新状态。

- **Module（模块）**：当不同状态由不同子模块管理时，用模块来组织代码。

## 安装和使用 Vuex

1. 安装 Vuex

```
npm install vuex --save
```

2. 将 Vuex 添加到 Vue.js 应用程序中:

```javascript
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
```

3. 创建 Vuex store:

```javascript
const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});
```

4. 在 Vue.js 应用程序中使用 store:

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">+</button>
  </div>
</template>

<script>
export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
  methods: {
    increment() {
      this.$store.commit("increment");
    },
  },
};
</script>
```

这里只给了一个最简单的例子，更多用法参考官方文档：[Vuex 文档](https://vuex.vuejs.org/)。

## 工程中的使用方式

实际工程里一般会专门留一个文件夹放 vuex 相关代码，比如 `store` 或 `src/store`。常见的组织方式有三种：

- 单文件模式：state、mutations、actions、getters 全写在一个 index.js 里，再在 main.js 中导入并注册 store 实例。适合小型或简单应用，但状态逻辑一复杂，这个文件会变得又长又难维护。
- 拆分模式：把 state、mutations、actions、getters 分别写在不同文件里（state.js、mutations.js 等），在 index.js 中导入合并成一个 store，再到 main.js 注册。代码更模块化、更清晰，代价是要在多个文件之间来回切换查找。
- 模块模式：按功能或业务把状态拆成不同模块，每个模块自带 state、mutations、actions、getters，在 index.js 导入注册，再到 main.js 注册。结构最清楚、最好维护，但要注意命名空间，避免不同模块之间冲突。

不管选哪种，组件里都是通过 `this.$store` 访问 store 实例，用 `this.$store.commit` 或 `this.$store.dispatch` 触发状态变化。也可以用 mapState、mapMutations、mapActions、mapGetters 这些辅助函数简化代码。

## 总结

学 Vuex 需要一点 Vue.js 基础。掌握上面几个核心概念后，就能写出结构更清晰、更易维护的 Vue.js 应用，开发效率也会跟着上来。
