---
title: Element Plus 全局注册图标并使用别名
toc: false
categories:
  - 前端
keywords:
  - Web
  - 前端
  - Element Plus
  - Vue3
tags:
  - Web
  - 前端
  - Element Plus
  - Vue3
abbrlink: 40ddb3a9
date: 2024-09-05 12:03:12
description:
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

项目中需要动态的配置侧边导航菜单中的图标，所以需要所有的 Element Plus 的图标。
因为 HTML 标准已经定义了一个名为 menu 的标签，需要使用别名来 menu 渲染图标。
所以采取了全局注册 Element Plus 的图标并注册别名的方法。

<!-- more -->

## 注册所有图标

```js
// 导入 '@element-plus/icons-vue'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 注册所有的图标, 并设置别名。 前面添加了`el-icon-`作为别名。
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(`ElIcon${key}`, component);
}
```

## 使用方法

因为全局注册并使用了别名，使用的时候不需要导入图标，但是需要通过别名来使用图标组件。
需要在图标组件前面加上`el-icon-`使用。比如 xxx 图标， 那么需要通过 el-icon-xxx 别名使用。

请使用如下的写法。

```html
<el-icon><el-icon-menu /></el-icon>
<el-icon><el-icon-setting /></el-icon>
<el-icon><el-icon-document /></el-icon>
```

对应 Element Plus 的 menu 图标、setting 图标和 document 图标。

## 注

无

## 参考

[Element Plus 注册所有图标](https://element-plus.org/zh-CN/component/icon.html#%E6%B3%A8%E5%86%8C%E6%89%80%E6%9C%89%E5%9B%BE%E6%A0%87)
