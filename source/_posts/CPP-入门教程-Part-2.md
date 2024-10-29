---
title: CPP 入门教程 Part 2
toc: true
categories:
  - C++
abbrlink: 210bfae
date: 2024-10-29 17:14:34
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

## C++ 程序结构

我们分析一下上一章的 Hello World 程序。

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

<!-- more -->

`#include <iostream>`: 这是一个预处理指令，用于包含标准输入输出流库`<iostream>`，允许我们使用`std::cout`来输出数据。

`int main() { ... }`: 这是主函数`main`，程序从这里开始执行。

`std::cout << "Hello, World!" << std::endl;`: 这行代码使用标准输出流`std::cout`来打印字符串"Hello, World!"，`std::endl`用于在输出后换行。

`return 0;`: 表示程序成功结束，并返回值 0 给操作系统。

## 编译 & 执行 C++ 程序

C++ 程序代码编写完成后，需要编译才能执行。

### 编译

使用一个 C++ 编译器（如 g++）来将源代码转换为可执行程序。
在命令行输入以下命令以编译上一章的 Hello World 程序：

```bash
g++ -o hello hello.cpp
```

- `g++`: 调用 GNU C++ 编译器。
- `-o hello`: 指定输出文件名为 `hello`。`-o` 是 `g++` 命令的参数，用于指定输出的文件名。
- `hello.cpp`: 源代码文件名。

### 执行

编译成功后，生成的可执行文件可以通过在终端输入以下命令运行：

```bash
./hello
```

这将会在终端上打印出 "Hello, World!"。

## C++ 基本语法

### 面向对象编程 (OOP)

C++ 程序可以定义为对象的集合，这些对象通过调用彼此的方法进行交互。现在让我们简要地看一下什么是类、对象，方法、即时变量。

- 对象 - 对象具有状态和行为。例如：一只狗的状态 - 颜色、名称、品种，行为 - 摇动、叫唤、吃。对象是类的实例。

- 类 - 类可以定义为描述对象行为/状态的模板/蓝图。

- 方法 - 从基本上说，一个方法表示一种行为。一个类可以包含多个方法。可以在方法中写入逻辑、操作数据以及执行所有的动作。

- 成员变量 - 每个对象都有其自己成员变量。对象的状态是由这些成员变量的值构成的。

### 语句结束符

在 C++ 中，每个语句通常以分号 (`;`) 结束。这是必须的，因为分号告诉编译器该语句的结束。缺少分号会导致编译错误。

例如：

```cpp
int a = 5;
int b = 10;
int sum = a + b;
```

每个变量定义和赋值语句都以分号结尾。

> 早期的编译器设计较为简单，需要明确的标识符来区分语句，而分号就是这样一个清晰的标识符。随着编译器技术的发展，虽然可以设计更智能的解析方式，但 C++继承自 C 语言, 保留分号可以保持向后兼容性。

### 代码块

代码块是用花括号 `{}` 括起来的一系列语句。代码块用于将多个语句组合为一个单元，通常用于函数、条件和循环中。

示例：

```cpp
if (a < b) {
    std::cout << "a is less than b." << std::endl;
} else {
    std::cout << "a is not less than b." << std::endl;
}
```

在上面的代码中，`if` 和 `else` 都包含各自的代码块。

函数定义也是代码块的一个例子：

```cpp
int add(int x, int y) {
    return x + y;
}
```

这里，`add` 函数的主体是一个代码块，由花括号括起来。

通过使用分号和代码块，C++ 能够明确地分隔逻辑单元，从而支持复杂的逻辑。

### 标识符

标识符是用于标识变量、函数、类等实体的名称。它可以由字母（大写或小写）、数字和下划线组成，但不能以数字开头。例如：

```cpp
int myVariable;
float _value;
char letter1;
```

- 合法标识符示例：`myVariable`, `value123`, `_temp`
- 非法标识符示例：`1stValue`（不能以数字开头）

在 C++ 中，标识符区分大小写，因此 `MyVariable` 和 `myvariable` 是两个不同的标识符。

选择标识符时应使用有意义的名称，以便代码易于阅读和维护。

### 关键字

下表列出了 C++ 中的保留字。这些保留字不能作为常量名、变量名或其他标识符名称。

asm else new this
auto enum operator throw
bool explicit private true
break export protected try
case extern public typedef
catch false register typeid
char float reinterpret_cast typename
class for return union
const friend short unsigned
const_cast goto signed using
continue if sizeof virtual
default inline static void
delete int static_cast volatile
do long struct wchar_t
double mutable switch while
dynamic_cast namespace template

### 空格

只包含空格的行，被称为空白行，可能带有注释，C++ 编译器会完全忽略它。

在 C++ 中，空格用于描述空白符、制表符、换行符和注释。空格分隔语句的各个部分，让编译器能识别语句中的某个元素（比如 int）在哪里结束，下一个元素在哪里开始。因此，在下面的语句中：

```cpp
int age;
```

在这里，int 和 age 之间必须至少有一个空格字符（通常是一个空白符），这样编译器才能够区分它们。另一方面，在下面的语句中：

```cpp
fruit = apples + oranges;   // 获取水果的总数
```

`fruit` 和`=`，或者`=` 和 `apples` 之间的空格字符不是必需的，但是为了增强可读性，您可以根据需要适当增加一些空格。

### 注释

程序的注释是解释性语句，您可以在 C++ 代码中包含注释，这将提高源代码的可读性。所有的编程语言都允许某种形式的注释。

C++ 支持单行注释和多行注释。注释中的所有字符会被 C++ 编译器忽略。

C++ 注释以 `/*` 开始，以 `*/` 终止。例如：

```cpp
/* 这是注释 */
/*
 * C++ 注释也可以跨行
 */
```

注释也能以 `//` 开始，直到行末为止。例如：

```cpp
#include <iostream>
int main() {
    cout << "Hello World"; // 输出 Hello World
    return 0;
}
```

当上面的代码被编译时，编译器会忽略 `// 输出 Hello World`，最后会产生以下结果：

```
Hello World
```

在 `/*` 和 `*/` 注释内部，`//` 字符没有特殊的含义。在 `//` 注释内，`/*` 和 `*/` 字符也没有特殊的含义。因此，您可以在一种注释内嵌套另一种注释。例如：

```cpp
/* 用于输出 Hello World 的注释
cout << "Hello World"; // 输出 Hello World
*/
```

## 注

无

## 参考

无
