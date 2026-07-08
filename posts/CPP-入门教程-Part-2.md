---
title: CPP 入门教程 Part 2
description: C++ 入门教程第二部分，深入讲解面向对象编程、类与对象、继承和多态等进阶主题
category: C++
date: 2024-10-29
tags:
---

# CPP 入门教程 Part 2
<!--
注释的方法：
在正文需要注释的地方插入下面的代码，根据需要修改编号：
  <sup>[1](#note1)</sup>
在"注"章节插入对应编号的注释内容:
  <div id="note1"></div>
  [1] 这是注的内容
-->

![C++ 类与对象关系图：类是模板，对象是实例，二者靠成员变量（状态）与方法（行为）关联，并由分号、代码块、标识符三块基本语法落地](/posts/CPP-入门教程-Part-2/cpp-class-object-concept.svg)

## C++ 程序结构

先把上一章那个 Hello World 拆开看看，每行到底在做什么。

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```



`#include <iostream>`: 预处理指令，把标准输入输出流库 `<iostream>` 包含进来，这样我们才能用 `std::cout` 往屏幕上输出东西。

`int main() { ... }`: 主函数 `main`，程序就从这里开始跑。

`std::cout << "Hello, World!" << std::endl;`: 用标准输出流 `std::cout` 把字符串 "Hello, World!" 打出来，`std::endl` 负责在末尾换行。

`return 0;`: 程序正常结束，把 0 这个返回值交还给操作系统。

## 编译 & 执行 C++ 程序

代码写完不能直接跑，得先过一遍编译。

### 编译

用 C++ 编译器（比如 g++）把源代码翻译成可执行程序。在命令行里编译上一章的 Hello World：

```bash
g++ -o hello hello.cpp
```

- `g++`: 调用 GNU C++ 编译器。
- `-o hello`: 指定输出文件名为 `hello`。`-o` 是 `g++` 命令的参数，用于指定输出的文件名。
- `hello.cpp`: 源代码文件名。

### 执行

编译没问题的话，会生成一个可执行文件，在终端里这样跑：

```bash
./hello
```

屏幕上就会打出 "Hello, World!"。

## C++ 基本语法

### 面向对象编程 (OOP)

C++ 程序可以看成一组对象的集合，这些对象通过互相调用来完成事情。先简单认几个概念：类、对象、方法、成员变量。

- 对象 - 有状态，也有行为。比如一只狗，状态是颜色、名字、品种，行为是摇尾巴、叫、吃东西。对象就是类的一个实例。

- 类 - 描述对象长什么样、能做什么的模板。

- 方法 - 表示一种行为，一个类里可以有多个方法，逻辑和数据操作都写在这里面。

- 成员变量 - 每个对象都带着自己的一套，对象的当前状态就是由这些变量的值决定的。

### 语句结束符

C++ 里每个语句末尾都得加分号（`;`）。分号是给编译器看的句号，告诉它这句话到这儿结束。漏了它，编译会报错。

例如：

```cpp
int a = 5;
int b = 10;
int sum = a + b;
```

每个变量定义和赋值语句都以分号结尾。

> 早期的编译器比较简单，需要一个明确的标识来切分语句，分号就承担了这个角色。后来编译器技术进步了，理论上能解析得更智能，但 C++ 继承自 C，保留分号是为了向后兼容——动它代价太大。

### 代码块

代码块就是用花括号 `{}` 括起来的一组语句。它的作用是把多条语句打包成一个整体，函数体、条件分支、循环里都常见到。

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

这里 `add` 函数的主体就是花括号括起来的那块。靠着分号和代码块，C++ 才能把一段逻辑切分得清清楚楚，进而搭出复杂的程序。

### 标识符

标识符就是给变量、函数、类这些实体起的名字。可以用字母（大小写都行）、数字和下划线，但不能拿数字打头。例如：

```cpp
int myVariable;
float _value;
char letter1;
```

- 合法标识符示例：`myVariable`, `value123`, `_temp`
- 非法标识符示例：`1stValue`（不能以数字开头）

在 C++ 中，标识符区分大小写，因此 `MyVariable` 和 `myvariable` 是两个不同的标识符。

选择标识符时应尽量用能说明用途的词，日后读起来、改起来都顺手。

### 关键字

下表是 C++ 的保留字。这些词已被语言本身占用，不能再拿来当常量、变量或其他标识符的名字。

| 关键字       |           |                  |          |
| ------------ | --------- | ---------------- | -------- |
| asm          | else      | new              | this     |
| auto         | enum      | operator         | throw    |
| bool         | explicit  | private          | true     |
| break        | export    | protected        | try      |
| case         | extern    | public           | typedef  |
| catch        | false     | register         | typeid   |
| char         | float     | reinterpret_cast | typename |
| class        | for       | return           | union    |
| const        | friend    | short            | unsigned |
| const_cast   | goto      | signed           | using    |
| continue     | if        | sizeof           | virtual  |
| default      | inline    | static           | void     |
| delete       | int       | static_cast      | volatile |
| do           | long      | struct           | wchar_t  |
| double       | mutable   | switch           | while    |
| dynamic_cast | namespace | template         |          |

### 空格

只含空格的行（可能带着注释）叫空白行，编译器会整个忽略掉。

在 C++ 里，空格泛指空白符、制表符、换行符和注释。它把语句的各部分隔开，让编译器知道一个元素（比如 `int`）到哪结束、下一个从哪开始。所以下面这句：

```cpp
int age;
```

这里 `int` 和 `age` 之间至少得有一个空格，不然编译器分不开它们。但换成下面这句：

```cpp
fruit = apples + oranges;   // 获取水果的总数
```

`fruit` 和 `=`、`=` 和 `apples` 之间的空格就不是必须的了，纯粹是为了看着清楚，加不加看个人习惯。

### 注释

注释是写给人看的说明，编译器会忽略。几乎所有编程语言都允许写注释，C++ 也不例外，支持单行和多行两种。

C++ 注释以 `/*` 开始，以 `*/` 终止。例如：

```cpp
/* 这是注释 */
/*
 * C++ 注释也可以跨行
 */
```

注释还能以 `//` 开头，从这往后一直到行末都算注释。例如：

```cpp
#include <iostream>
int main() {
    cout << "Hello World"; // 输出 Hello World
    return 0;
}
```

上面这段编译时，编译器会跳过 `// 输出 Hello World`，最终结果就是：

```
Hello World
```

有意思的是，注释还可以互相嵌套。在 `/* */` 这种注释里面，`//` 没有特殊含义；反过来，在 `//` 注释里写 `/* */` 也不算数。所以你可以把一种注释塞进另一种里：

```cpp
/* 用于输出 Hello World 的注释
cout << "Hello World"; // 输出 Hello World
*/
```

## 注

无

## 参考

无
