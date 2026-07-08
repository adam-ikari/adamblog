---
title: Element Plus 全局注册图标并使用别名
description: Element Plus 全局注册所有图标组件并配置别名，简化 Vue3 项目中图标使用的最佳实践
category: 前端
tags: [Web, 前端, Element Plus, Vue3]
date: 2024-09-05
---

# Element Plus 全局注册图标并使用别名
<!--
注释的方法：
在正文需要注释的地方插入下面的代码，根据需要修改编号：
  <sup>[1](#note1)</sup>
在"注"章节插入对应编号的注释内容:
  <div id="note1"></div>
  [1] 这是注的内容
-->

项目里要动态配置侧边导航菜单的图标，所以需要把 Element Plus 的图标全都拿过来用。但 HTML 标准里已经有一个叫 `menu` 的标签，直接用会冲突，得给它起个别名。最后的做法是全局注册所有图标，并统一加上别名前缀。

![Element Plus 图标全局注册与别名三步流程](/posts/element-plus-register-all-icon-with-alias-globally/register-flow.svg)

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

因为图标是全局注册并带了别名，用的时候不用再 import，直接通过别名引用组件即可。需要在组件名前加上 `el-icon-`，比如某个 `xxx` 图标，就写成 `el-icon-xxx`。

写法如下：

```html
<el-icon><el-icon-menu /></el-icon>
<el-icon><el-icon-setting /></el-icon>
<el-icon><el-icon-document /></el-icon>
```

分别对应 Element Plus 的 menu、setting 和 document 图标。

## 注

无

## 参考

[Element Plus 注册所有图标](https://element-plus.org/zh-CN/component/icon.html#%E6%B3%A8%E5%86%8C%E6%89%80%E6%9C%89%E5%9B%BE%E6%A0%87)
