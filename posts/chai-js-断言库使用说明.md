---
title: chai.js 断言库使用说明 (Expect 风格写法)
description: chai.js 断言库 Expect 风格使用指南，涵盖常用断言方法和测试代码编写技巧
category: 前端
date: 2024-10-25
tags:
---

# chai.js 断言库使用说明 (Expect 风格写法)
<!--
注释的方法：
在正文需要注释的地方插入下面的代码，根据需要修改编号：
  <sup>[1](#note1)</sup>
在"注"章节插入对应编号的注释内容:
  <div id="note1"></div>
  [1] 这是注的内容
-->

## 简介

Chai.js 是个用得挺多的 JavaScript 断言库，一般配合 Mocha、Jest 这类测试框架，写前端或后端的测试。它有 BDD（行为驱动开发）和 TDD（测试驱动开发）两种风格，落到代码上就是 `expect`、`should`、`assert` 三种写法。



`expect` 和 `should` 都属于 BDD 风格，也都是链式语法。区别在于：`expect` 是直接调用，`should` 则是挂到任意 JavaScript 对象上。两者用起来的场景差不多。

```javascript
expect(true).to.be.true;
```

```javascript
true.should.be.true;
```

`assert` 是 TDD 风格，写出来更像一个普通函数调用。

```javascript
assert(true, "True is true");
```

Chai 的好处在于好用又灵活，支持插件，Node.js、浏览器、各种构建工具（Browserify、Webpack）都能跑。几种断言挑一种顺手的用就行；遇到复杂用例，它给的错误信息也比较友好，能帮你较快定位测试为什么挂了。

## Expect 风格写法

下面挑 Expect 风格展开，看看各类断言怎么写。

### 引入 Expect

在测试文件开头，用 ES6 模块语法把 Chai 的 Expect 引进来：

```javascript
import { expect } from "chai";
```

### 等于

检查两个值是否相等：

```javascript
expect("hello").to.equal("hello");
expect(42).to.equal(42);
expect(1).to.not.equal(true);
```

### 深度相等

如果你要检查两个对象或数组的值是否相同：

```javascript
expect({ foo: "bar" }).to.deep.equal({ foo: "bar" });
expect([1, 2, 3]).to.deep.equal([1, 2, 3]);
```

### 包含

检查数组里有没有某个元素，或者字符串里有没有一段子串：

```javascript
expect([1, 2, 3]).to.include(2);
expect("foobar").to.contain("foo");
```

### 大于、大于等于、小于、小于等于

```javascript
expect(10).to.be.above(5);
expect(10).to.be.at.least(10);
expect(10).to.be.below(20);
expect(10).to.be.at.most(20);
```

### 判断属性是否存在

检查对象中是否存在某个属性：

```javascript
expect({ a: 1 }).to.have.property("a");
```

### 包含键

假设你要检查一个对象是否包含一个或者多个键：

```javascript
expect({ a: 1, b: 2, c: 3 }).to.include.keys("a", "b");
expect({ x: 1, y: 2, z: 3 }).to.not.include.keys("p", "q");
```

### 类型

检查值的类型：

```javascript
expect("test").to.be.a("string");
expect({ foo: "bar" }).to.be.an("object");
expect(null).to.be.a("null");
expect(undefined).to.be.a("undefined");
```

### 不为空

检查一个值是否为空

```javascript
expect("Hello").to.not.be.empty;
expect([]).to.be.empty;
```

### 类型和类型的属性

想确认某个属性是特定结构时，可以把 `property` 和 `a`/`an` 串起来用。

```javascript
expect({ tea: { temperature: "hot", name: "chai" } })
  .to.have.property("tea")
  .which.has.a.property("temperature")
  .that.is.a("string");
```

### 用'.throw'测试可能出错的函数

测一个可能抛错的函数，用 `throw`：

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

## 其他

这篇只覆盖了 Expect 风格比较常用的部分。更多用法见 [Chai.js Expect API 文档](http://chaijs.com/api/bdd/)。

## 注

无

## 参考

无
