---
title: Vue学习系列 -- 告别繁琐，从Vue3的script setup语法糖开始
category: 前端
description: 使用Vue3的script setup语法糖进行前端，优化开发体验，告别繁琐。
tags: [Vue3, script setup, 前端, 优化开发体验]

date: 2023-05-11
---

# Vue学习系列 -- 告别繁琐，从Vue3的script setup语法糖开始
`<script setup>` 是一种编译时的语法糖，用来在单文件组件（SFC）中使用组合式 API。如果你同时用 SFC 和组合式 API，这是官方推荐的写法。它能少写不少样板代码，运行时性能也更好——模板会被编译成同作用域内的渲染函数，没有中间代理；IDE 的类型推断也更快，因为语言服务器从代码里提取类型的工作量少了。



# 使用\<script setup\>编写Vue单文件组件

Vue 单文件组件（SFC）是一种特殊的文件格式，把一个组件的模板、逻辑和样式封装在同一个文件里。一个最简单的 SFC 长这样：

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

可以看出，Vue SFC 是 HTML、CSS、JavaScript 三件套的自然延伸——`<template>`、`<script>`、`<style>` 三个块分别放视图、逻辑和样式，全部收在一个文件里。

如果你用过 Vue 2.x，对这种写法应该不陌生。但 Vue 3.x 多了一个选择：`<script setup>`。

## 什么是\<script setup\>？

`<script setup>` 是编译时的语法糖，用来在单文件组件里使用组合式 API。这是官方推荐的写法——前提是你同时用 SFC 和组合式 API。它的好处前面提过：样板代码更少、运行时性能更好、IDE 类型推断更快。

要启用它，只要在 `<script>` 标签上加个 `setup` 属性：

```vue
<script setup>
console.log('hello script setup')
</script>
```

`<script setup>` 内部的代码会被编译成组件 `setup()` 函数的内容。这里有个关键区别：普通的 `<script>` 只在组件第一次导入时执行一次，而 `<script setup>` 里的代码每次创建组件实例时都会执行。

## 如何在\<script setup\>中使用数据和方法？

用 `<script setup>` 时，内部声明的顶层绑定（变量、函数声明、import）都可以直接在模板里用：

```vue
<script setup>
// 变量
const msg = 'Hello!'

// 函数
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

import 进来的模块也能直接在模板里用。这意味着你可以直接用某个导入的辅助函数，不必再通过 `methods` 选项暴露它：

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## 如何在\<script setup\>中使用响应式状态？

响应式状态需要用响应式 API 显式创建。和 `setup()` 函数返回的值一样，ref 在模板里引用时会自动解包：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

也可以用 `reactive()` 创建一个响应式对象：

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  message: 'Hello'
})
</script>

<template>
  <button @click="state.count++">{{ state.count }}</button>
  <p>{{ state.message }}</p>
</template>
```

## 如何在\<script setup\>中使用组件？

`<script setup>` 里的值也可以直接当成自定义组件的标签名用：

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

这里把 `MyComponent` 当成一个变量来引用。用过 JSX 的话，这个心智模型是一样的。模板里写短横线形式 `<my-component>` 也能跑，但还是推荐用帕斯卡命名的组件标签，保持一致性的同时，也方便和原生自定义元素区分开。

## 如何在\<script setup\>中使用动态组件？

因为组件是作为变量引用的，而不是注册在字符串键下，所以动态组件要用 `:is` 绑定：

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

注意组件可以作为变量用在三元表达式里。

# 使用TypeScript和自定义类型

要在 `<script setup>` 里用 TypeScript，把标签属性改成 `lang="ts"`：

```vue
<script setup lang="ts">
// TypeScript code here
</script>
```

这样就能用上 TypeScript 的类型检查和自动补全了。

## 如何在\<script setup\>中声明props和emitted events？

声明 props 用 `defineProps()`，它接收一个对象作为 props 的选项。每个 prop 可以用字符串或构造函数指定类型，也可以用对象指定更多选项，比如默认值、校验器：

```vue
<script setup>
import { defineProps } from 'vue'

// 字符串类型
const props = defineProps({
  msg: String
})

// 构造函数类型
const props = defineProps({
  count: Number
})

// 对象类型
const props = defineProps({
  foo: {
    type: String,
    default: 'bar',
    validator: value => value.length > 3
  }
})
</script>
```

声明 emitted events 用 `defineEmits()`，它接收一个数组，列出 emit 函数能触发的事件名：

```vue
<script setup>
import { defineEmits } from 'vue'

// 数组类型
const emit = defineEmits([
  'change',
  'submit'
])
</script>
```

这样就能在 `<script setup>` 里用 JS 语法声明 props 和 emitted events 了。

## 如何在\<script setup\>中使用生命周期钩子？

在 `<script setup>` 里，生命周期钩子的用法和普通 `setup()` 函数一样：从 `vue` 模块导入，然后在内部调用：

```vue
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  console.log('component is mounted')
})

onUpdated(() => {
  console.log('component is updated')
})

onUnmounted(() => {
  console.log('component is unmounted')
})
</script>
```

注意，`<script setup>` 里不能自己定义函数来当生命周期钩子——必须用从 `vue` 模块导入的函数。原因是 `<script setup>` 内部的代码会被编译成 `setup()` 函数的内容，而生命周期钩子必须在 `setup()` 函数里调用。

## \<script setup\>的局限性
`<script setup>` 用起来方便，但也有几条限制要注意：

- 不能和 `<script>` 共存。如果同一个组件里两种语法都要用，可以把 `<script setup>` 放进子组件，再在父组件里导入。
- 不能用 `src` 属性，代码必须直接写在 `<script setup>` 标签里。
- `defineProps()` 和 `defineEmits()` 不能在函数内部调用，必须在 `<script setup>` 的顶层。
- 生命周期钩子同样不能在函数里定义，要用从 vue 模块导入的钩子函数，并在 `<script setup>` 顶层调用。
- 不能用模板字符串插值，得用普通字符串拼接或模板字面量。

## \<script setup\>的注意事项
除了上面的局限，还有几条用的时候容易踩的点：

- `<script setup>` 内部的代码会被编译成 `setup()` 函数的内容，所以每次创建组件实例时都会执行，而不是只在首次导入时执行一次。
- 内部声明的变量、函数和 import 都会暴露给模板。想藏起一些内部实现，可以用下划线前缀，比如 `_internalValue`，这样就不会暴露给模板或父组件。
- 这些声明默认会被当作响应式依赖。要避免不必要的渲染更新，可以用常量前缀标记，比如 `const __UNREF__ = 1`，就不会被收集为响应式依赖。
- 它们也会被当作组件选项。为避免和 Vue 保留的选项名冲突，可以用大写字母或其他符号命名，比如 `const $foo = 'bar'` 或 `const FOO = 'bar'`。