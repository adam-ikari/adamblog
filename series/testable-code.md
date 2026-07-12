---
title: 编写可测试代码系列
description: 翻译 misko hevery 的 Guide to Testable Code，可测试代码四大缺陷的完整论述
---

# 编写可测试代码系列

本系列译自 Miško Hevery 的《Guide: Writing Testable Code》，讲的是什么样的代码设计会让代码难以测试，以及怎么改。原文围绕四大"缺陷"展开——构造函数做实事、挖掘合作者、全局状态与单例、类做得太多。每条缺陷都先给危险信号，再讲为什么是缺陷、怎么识别、怎么修复。

为贴合 C++ 语境，系列中的代码示例由原文的 Java 改写为 C++17，风格偏向 Java 的面向对象写法，便于对照设计思想。

**适合谁**：想写出更好测试代码的 C++ 开发者，或想了解可测试代码设计原则的任何语言开发者
**前置要求**：熟悉 C++ 基础语法和面向对象概念
**学习目标**：识别代码中的不可测试设计，掌握重构为可测试代码的方法

<SeriesCardList />

> 原文仓库：[mhevery/guide-to-testable-code](https://github.com/mhevery/guide-to-testable-code)
