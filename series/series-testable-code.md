---
title: 编写可测试代码系列
description: 翻译 misko hevery 的 Guide to Testable Code，可测试代码四大缺陷的完整论述
date: 2026-07-01
category: 文档翻译
tags: [编写可测试代码, C++, 重构, 系列]
recommend: false
---

# 编写可测试代码系列

本系列译自 Miško Hevery 的《Guide: Writing Testable Code》，讲的是什么样的代码设计会让代码难以测试，以及怎么改。原文围绕四大"缺陷"展开——构造函数做实事、挖掘合作者、全局状态与单例、类做得太多。每条缺陷都先给危险信号，再讲为什么是缺陷、怎么识别、怎么修复。

为贴合 C++ 语境，系列中的代码示例由原文的 Java 改写为 C++17，风格偏向 Java 的面向对象写法，便于对照设计思想。

<SeriesCardList :articles="[
  { title: '指南：编写可测试代码（总纲）', desc: '四大缺陷的危险信号与要害总览', link: '/posts/【文档翻译】指南：编写可测试代码（总纲）', order: 1 },
  { title: '缺陷一：构造函数做实事', desc: '构造函数为何只该赋值、new 与静态调用的危害、三种初始化方案', link: '/posts/【文档翻译】编写可测试代码-缺陷一-构造函数做实事', order: 2 },
  { title: '缺陷二：挖掘合作者', desc: '迪米特定律、context 对象、只传入真正需要的合作者', link: '/posts/【文档翻译】编写可测试代码-缺陷二-挖掘合作者', order: 3 },
  { title: '缺陷三：全局状态与单例', desc: '全局状态的传染性、单例即全局状态、用依赖注入替代', link: '/posts/【文档翻译】编写可测试代码-缺陷三-全局状态与单例', order: 4 },
  { title: '缺陷四：类做的太多', desc: '单一职责、提取类、无家可归的静态方法', link: '/posts/【文档翻译】编写可测试代码-缺陷四-类做的太多', order: 5 },
]" />

> 原文仓库：[mhevery/guide-to-testable-code](https://github.com/mhevery/guide-to-testable-code)
