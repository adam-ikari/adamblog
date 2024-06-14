---
title: Vue学习系列 -- 告别繁琐，从Vue3的script setup语法糖开始
toc: true
categories:
  - 前端开发
keywords:
  - Vue3
  - script setup
description: 使用Vue3的script setup语法糖进行前端开发，优化开发体验，告别繁琐。
tags:
  - Vue3
  - script setup
  - 前端开发
  - 优化开发体验
cover: covers/Vue学习系列.png
abbrlink: f1307045
date: 2023-05-11 13:57:45
---

\<script setup\>是一种编译时的语法糖，用于在单文件组件（SFC）中使用组合式API。它是推荐的语法，如果你同时使用SFC和组合式API。它提供了一些优点，比如：

- 代码更简洁，减少了样板代码
- 可以使用纯TypeScript声明props和emitted events
- 更好的运行时性能（模板被编译为在同一作用域内的渲染函数，没有中间代理）
- 更好的IDE类型推断性能（语言服务器从代码中提取类型的工作量更少）

<!-- more -->

# 使用\<script setup\>编写Vue单文件组件

Vue单文件组件（SFC）是一种特殊的文件格式，允许我们在一个文件中封装一个Vue组件的模板、逻辑和样式。这是一个简单的SFC示例：

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

我们可以看到，Vue SFC是HTML、CSS和JavaScript这三种经典技术的自然延伸。`<template>`、`<script>`和`<style>`块将一个组件的视图、逻辑和样式封装和放置在同一个文件中。

如果你使用过Vue 2.x，你可能已经熟悉了这种写法。但是，在Vue 3.x中，有了一个新的选择：`<script setup>`。

## 什么是\<script setup\>？

`<script setup>`是一种编译时的语法糖，用于在单文件组件中使用组合式API。它是推荐的语法，如果你同时使用SFC和组合式API。它提供了一些优点，比如：

- 代码更简洁，减少了样板代码
- 可以使用纯TypeScript声明props和emitted events
- 更好的运行时性能（模板被编译为在同一作用域内的渲染函数，没有中间代理）
- 更好的IDE类型推断性能（语言服务器从代码中提取类型的工作量更少）

要使用这种语法，只需在`<script>`标签上添加`setup`属性：

```vue
<script setup>
console.log('hello script setup')
</script>
```

`<script setup>`内部的代码会被编译为组件的`setup()`函数的内容。这意味着与普通的`<script>`不同，它只在组件第一次导入时执行一次，`<script setup>`内部的代码会在每次创建组件实例时执行。

## 如何在\<script setup\>中使用数据和方法？

当使用`<script setup>`时，任何在`<script setup>`内部声明的顶层绑定（包括变量、函数声明和导入）都可以直接在模板中使用：

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

导入的模块也可以在模板中直接使用。这意味着你可以直接使用一个导入的辅助函数，而不需要通过`methods`选项暴露它：

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## 如何在\<script setup\>中使用响应式状态？

响应式状态需要使用响应式API显式地创建。类似于从`setup()`函数返回的值，refs在模板中引用时会自动解包：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

你也可以使用`reactive()`创建一个响应式对象：

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

`<script setup>`内部的值也可以直接作为自定义组件的标签名使用：

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

把`MyComponent`当作一个变量来引用。如果你用过JSX，这里的思维模型是类似的。模板中的短横线形式`<my-component>`也可以工作，但是强烈推荐使用帕斯卡命名法的组件标签，以保持一致性。它也有助于区分原生的自定义元素。

## 如何在\<script setup\>中使用动态组件？

由于组件是作为变量引用的，而不是注册在字符串键下，所以我们应该使用动态`:is`绑定来在`<script setup>`中使用动态组件：

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

注意组件可以作为变量在三元表达式中使用。

教程的第二部分可以这样写：

# 使用TypeScript和自定义类型

如果你想在`<script setup>`中使用TypeScript，你需要将标签属性改为`lang="ts"`：

```vue
<script setup lang="ts">
// TypeScript code here
</script>
```

这样就可以享受TypeScript带来的类型检查和自动补全等特性了。

## 如何在\<script setup\>中声明props和emitted events？

要声明props，你可以使用`defineProps()`函数，它接受一个对象参数，表示props的选项。你可以用字符串或者构造函数来指定每个prop的类型，也可以用对象来指定更多的选项，比如默认值、校验器等。例如：

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

要声明emitted events，你可以使用`defineEmits()`函数，它接受一个数组参数，表示emit函数可以触发的事件名。例如：

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

这样就可以在`<script setup>`中使用JS语法来声明props和emitted events了。

## 如何在\<script setup\>中使用生命周期钩子？

在`<script setup>`中，你可以像在普通的`setup()`函数中一样，使用生命周期钩子函数。你需要从`vue`模块导入它们，然后在`<script setup>`内部调用它们。例如：

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

注意，你不能在`<script setup>`内部定义自己的函数来作为生命周期钩子。你必须使用从`vue`模块导入的函数。这是因为`<script setup>`内部的代码会被编译为组件的`setup()`函数的内容，而生命周期钩子必须在`setup()`函数中调用。

## \<script setup\>的局限性
虽然\<script setup\>提供了很多便利，但它也有一些局限性，需要我们注意：

\<script setup\>不能与\<script\>共存。如果你需要在同一个组件中使用两种语法，你可以将\<script setup\>放在一个子组件中，然后在父组件中导入它。
\<script setup\>不能使用src属性。你必须将代码直接写在\<script setup\>标签内部。
\<script setup\>不能在函数内部使用defineProps()和defineEmits()。这些函数必须在\<script setup\>的顶层调用。
\<script setup\>不能在函数内部定义自己的生命周期钩子。你必须使用从vue模块导入的生命周期钩子函数，并在\<script setup\>的顶层调用它们。
\<script setup\>不能使用模板字符串插值。你必须使用普通的字符串拼接或者模板字面量。
\<script setup\>的注意事项
除了上述的局限性，还有一些注意事项，可以帮助我们更好地使用\<script setup\>：

\<script setup\>内部的代码会被编译为组件的setup()函数的内容。这意味着与普通的\<script\>不同，它只在组件第一次导入时执行一次，\<script setup\>内部的代码会在每次创建组件实例时执行。
\<script setup\>内部声明的变量、函数和导入都会被暴露给模板。如果你想隐藏一些内部实现细节，你可以使用下划线前缀来标记它们，例如：_internalValue。这样它们就不会被暴露给模板或者父组件了。
\<script setup\>内部声明的变量、函数和导入都会被视为响应式依赖。如果你想避免不必要的渲染更新，你可以使用常量前缀来标记它们，例如：const __UNREF__ = 1。这样它们就不会被收集为响应式依赖了。
\<script setup\>内部声明的变量、函数和导入都会被视为组件选项。如果你想避免与Vue保留的选项名冲突，你可以使用大写字母或者其他符号来命名它们，例如：const $foo = 'bar'或者const FOO = 'bar'。