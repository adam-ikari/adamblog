---
title: chai.js 断言库使用说明
toc: false
categories:
  - 前端
date: 2024-10-25 10:50:39
keywords:
description:
tags:
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

## 1. 简介

Chai.js 是一个非常流行的 JavaScript 断言库，主要用于配合如 Mocha, Jest 等测试框架编写用户端或服务端的 JavaScript 测试。它提供了 BDD（Behavior-Driven Development，行为驱动开发） 和 TDD（Test-Driven Development，测试驱动开发）两种样式的断言，即 `expect`，`should`, `assert` 三种。

<!-- more -->

`expect` 和 `should` 属于 BDD 风格，他们都是链式语法，所不同的是 `expect` 是直接调用，而 `should` 则是添加在任何 JavaScript 对象上，他们的使用场景都是 BDD。

```javascript
expect(true).to.be.true;
```

```javascript
true.should.be.true;
```

`assert` 是 TDD 风格，它看起来更像一个函数。

```javascript
assert(true, "True is true");
```

Chai 的主要优点是其易于使用和灵活性。它支持插件，并且对多种环境有良好的兼容性，包括 Node.js, 浏览器, and 各种 JavaScript 构建工具（如 Browserify, Webpack）。

通过使用不同类型的断言，你可以选择适合你测试风格的类型。对于更复杂的用例，Chai 提供了友好的错误消息，帮助你快速理解测试失败的原因。

## 2. 目录

- [1. 简介](#1-简介)
- [2. 目录](#2-目录)
- [3. Expect 风格写法](#3-expect-风格写法)
  - [3.1. 引入 Expect](#31-引入-expect)
  - [3.2. 等于](#32-等于)
  - [3.3. 深度相等](#33-深度相等)
  - [3.4. 包含](#34-包含)
  - [3.5. 大于、大于等于、小于、小于等于](#35-大于大于等于小于小于等于)
  - [3.6. 判断属性是否存在](#36-判断属性是否存在)
  - [3.7. 包含键](#37-包含键)
  - [3.8. 类型](#38-类型)
  - [3.9. 不为空](#39-不为空)
  - [3.10. 类型和类型的属性](#310-类型和类型的属性)
  - [3.11. 用'.throw'测试可能出错的函数](#311-用throw测试可能出错的函数)
- [4. 其他](#4-其他)
- [5. 注](#5-注)
- [6. 参考](#6-参考)

## 3. Expect 风格写法

以下指南介绍了如何使用 Expect 风格编写各种类型的断言。

### 3.1. 引入 Expect

在测试文件头部，使用 ES6 模块导入语法引入 Chai 库的 Expect 风格：

```javascript
import { expect } from "chai";
```

### 3.2. 等于

检查两个值是否相等：

```javascript
expect("hello").to.equal("hello");
expect(42).to.equal(42);
expect(1).to.not.equal(true);
```

### 3.3. 深度相等

如果你要检查两个对象或数组的值是否相同：

```javascript
expect({ foo: "bar" }).to.deep.equal({ foo: "bar" });
expect([1, 2, 3]).to.deep.equal([1, 2, 3]);
```

### 3.4. 包含

例子：检查数组是否包含某个元素或字符串包含一段字串：

```javascript
expect([1, 2, 3]).to.include(2);
expect("foobar").to.contain("foo");
```

### 3.5. 大于、大于等于、小于、小于等于

```javascript
expect(10).to.be.above(5);
expect(10).to.be.at.least(10);
expect(10).to.be.below(20);
expect(10).to.be.at.most(20);
```

### 3.6. 判断属性是否存在

检查对象中是否存在某个属性：

```javascript
expect({ a: 1 }).to.have.property("a");
```

### 3.7. 包含键

假设你要检查一个对象是否包含一个或者多个键：

```javascript
expect({ a: 1, b: 2, c: 3 }).to.include.keys("a", "b");
expect({ x: 1, y: 2, z: 3 }).to.not.include.keys("p", "q");
```

### 3.8. 类型

检查值的类型：

```javascript
expect("test").to.be.a("string");
expect({ foo: "bar" }).to.be.an("object");
expect(null).to.be.a("null");
expect(undefined).to.be.a("undefined");
```

### 3.9. 不为空

检查一个值是否为空

```javascript
expect("Hello").to.not.be.empty;
expect([]).to.be.empty;
```

### 3.10. 类型和类型的属性

希望类型是某个特定的结构的时候可以用`property`和`a`或`an`联合使用。

```javascript
expect({ tea: { temperature: "hot", name: "chai" } })
  .to.have.property("tea")
  .which.has.a.property("temperature")
  .that.is.a("string");
```

### 3.11. 用'.throw'测试可能出错的函数

假设你测试一个可能抛出错误的函数，你可以使用 `throw` 结构：

```javascript
let badFn = function () {
  throw new TypeError("Illegal salmon!");
};
expect(badFn).to.throw();
expect(badFn).to.throw("salmon");
expect(badFn).to.throw(/salmon/);
expect(badFn).to.throw(TypeError);
expect(badFn).to.throw(TypeError, "salmon");
```

## 4. 其他

这只是 Chai.js Expect 风格断言更多的用法教程，详细信息请参考 [Chai.js Expect API 文档](http://chaijs.com/api/bdd/)。

## 5. 注

无

## 6. 参考

无
