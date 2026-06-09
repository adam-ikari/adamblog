---
title: 【文档翻译】Lisp 的根源 - Lisp 编程语言的起源、进化与魅力
category: 文档翻译
description: >-
  本文介绍了 Lisp 编程语言的起源、核心思想以及其发展历程。原文作者 Paul Graham
  向我们展现了Lisp如何通过简单的数据结构（列表）和基本函数来创造一种简洁而强大的编程语言。他还阐述了 Lisp
  的宏、闭包和动态作用域等特性。本文将帮助读者深入理解 Lisp 这门编程语言的本质和魅力。
tags: [Lisp, Lisp 之根, Lisp 的根源, The Roots of Lisp, 文档翻译]
date: 2023-03-13
---

# 【文档翻译】Lisp 的根源 - Lisp 编程语言的起源、进化与魅力
《Lisp 的根源》是一个介绍 Lisp 编程语言的起源和核心思想的文章，由 Paul Graham 所著。Lisp 是由 John McCarthy 基于 λ 演算和递归函数的理论，用一种简单的数据结构——列表和几个核心函数创造出来的一门简洁且强大的编程语言。本文不仅展示了如何用 Lisp 实现其编译器和解释器，同时也说明了 Lisp 的一些重要特性如宏、闭包和动态作用域，目的在于让读者深入了解 Lisp 的本质和魅力。

![Lisp 漫画](/posts/lisp-roots/Lisp的根源.jpg)



## 前言

在 1960 年，John McCarthy 发表了一篇杰出的论文，他为编程做了类似于 [Euclid 为几何所做的事情 <sup>[1]</sup>](#note1)。他展示了如何通过一些简单的运算符和函数符号，构建一个完整的编程语言。他将这种语言称为 Lisp，即列表处理，因为他的一个关键思想是使用一种称为列表的简单数据结构来表示代码和数据。

了解 McCarthy 发现的内容是值得的，它不仅仅是作为计算机历史上的一个里程碑，而是作为我们现在编程趋势的一个模型。我认为到目前为止，已经有两个非常清晰、一致的编程模型：C 模型和 Lisp 模型。

这两种似乎是高地，中间是沼泽低地。随着计算机变得更强大，新开发的语言一直在向 Lisp 模型靠拢。过去 20 年中，一种流行的新编程语言的配方是：取 C 模型的计算方式，并逐渐加入从 Lisp 模型中取出的部分，如运行时类型和垃圾回收。

在这篇文章中，我将尽可能简单地解释麦卡锡发现了什么。目的不仅仅是了解 40 年前某人发现了一个有趣的理论结果，而且是要展示语言正在走向何方。Lisp 与众不同之处——事实上，Lisp 的定义特征——就是它可以用自身来编写。要理解麦卡锡这样说的意思，我们要重走他的步骤，把他的数学符号翻译成可以运行的 Common Lisp 代码。

## 七个原始操作符

一开始，我们定义一个表达式。一个表达式要么是一个原子，由一系列英文字母（例如 foo）组成；要么是一个由零个或多个表达式组成的列表，用空格分隔并用括号括起来。这是一些表达式：

```text
foo
()
(foo)
(foo bar)
(a b (c) d)
```

通过算数，表达式 **_1 + 1_** 得到值 **_2_**。合法的 Lisp 表达式也会得到值。如果一个表达式 **_e_** 产生一个值 **_v_** 我们说 **_e 返回 v_**。我们下一步定义有什么种类的表达式，以及每种类型返回什么值。

如果表达式是一个列表，我们称第一个元素为操作符，并且剩下的元素称为参数。我们接下来定义七个原始(某种意义上的公理)操作符：[**quote**](#quote)，[**atom**](#atom)，**eq**，**car**，**cdr**，**cons** 和 **cond**

### quote

(quote x) 返回 x。为了可读性，我们将 (quote x) 记为 'x

```repl
> (quote a)
a
> 'a
a
> (quote (a b c))
(a b c)
```

### atom

如果 x 是原子或空列表 ，(atom x) 返回元素 t 。其他情况返回 () 。在 Lisp 中我们按照管理使用原子 t 表示真，并且使用空列表表示假。

```repl
> (atom 'a)
t
> (atom '(a b c))
()
> (atom '())
t
```

既然我们现在有了一个参数被求值的操作，我们就可以展示 quote 的用途了。通过引用一个列表，我们可以保护它免于求值。当一个未引用的列表作为操作符（如 atom）的参数时，它会被当作代码来处理。

```repl
> (atom (atom 'a))
t
```

当一个列表被 quote 时，它会被当作一个普通的列表来处理。在这种情况下，它是一个包含两个元素的列表。

```repl
> (atom '(atom ）'a))
()
```

这对应于我们在英语中使用引号的方式。Cambridge 是马萨诸塞州的一个城镇，大约有 90,000 人。"Cambridge" 是一个包含九个字母的单词。

quote 可能看起来是有点陌生的概念，因为很少有其他语言有类似的东西。它与 Lisp 最独特的特征之一密不可分：代码和数据由相同的数据结构构成，quote 运算符是我们区分它们的方式。

### eq

如果 x 和 y 的值是相同的原子或都是空列表，则 (eq x y) 返回 t ，否则返回 () 。

```repl
> (eq 'a 'a)
t
> (eq 'a 'b)
()
> (eq '() '())
t
```

### car

如果 x 是一个列表，则 (car x) 返回 x 的第一个元素。在数学中，car 的含义是"Contents of Address Register"。

```repl
> (car '(a b c))
a
```

### cdr

如果 x 是一个列表，则 (cdr x) 返回 x 中除第一个元素外的其余元素。cdr 的含义是"Contents of Decrement Register"。

```repl
> (cdr '(a b c))
(b c)
```

### cons

如果 x 是一个表达式，y 是一个列表，则 (cons x y) 返回一个列表，其第一个元素是 x，后面跟着 y 的元素。

```repl
> (cons 'a '(b c))
(a b c)
> (cons 'a (cons 'b (cons 'c '())))
(a b c)
> (car (cons 'a '(b c)))
a
> (cdr (cons 'a '(b c)))
(b c)
```

### cond

cond 是条件表达式。它的形式为 (cond (p₁ e₁) ... (pₙ eₙ))，依次求值 pᵢ，如果返回 t，则返回对应的 eᵢ 的值。

```repl
> (cond ((eq 'a 'b) 'first)
        ((atom 'a) 'second))
second
```

## 表示函数

现在我们定义一种表示函数的记号。一个函数表示为包含三个元素的表达式：首先是原子 **label**，然后是函数名，最后是函数体。即：

```
(label f (lambda (p₁ ... pₙ) e))
```

其中 **lambda** 表示一个匿名函数，(p₁ ... pₙ) 是参数列表，e 是函数体。一个 lambda 表达式的求值方式是：将参数绑定到对应的值上，然后求值函数体。

```repl
> ((lambda (x) (cons x '(b))) 'a)
(a b)
> ((lambda (x y) (cons x (cdr y)))
   'z
   '(a b c))
(z b c)
```

label 允许我们递归地定义函数。例如，我们可以定义一个函数 not：

```repl
> (label not (lambda (x) (cond (x '()) ('t 't))))
```

这个函数在 x 为假时返回真，x 为真时返回假：

```repl
> (not '())
t
> (not 't)
()
```

## 一些实用函数

利用我们定义的原始操作符和函数记号，我们可以定义更多实用的函数：

**and** — 逻辑与：

```repl
> (label and (lambda (x y) (cond (x (cond (y 't) ('t '()))) ('t '()))))
```

**or** — 逻辑或：

```repl
> (label or (lambda (x y) (cond (x 't) ('t (cond (y 't) ('t '()))))))
```

**pair** — 将两个列表组合成点对列表：

```repl
> (label pair (lambda (x y)
    (cond ((and (atom x) (atom y)) (cons x y))
          ('t (cons (cons (car x) (car y))
                    (pair (cdr x) (cdr y)))))))
```

**append** — 连接两个列表：

```repl
> (label append (lambda (x y)
    (cond ((atom x) y)
          ('t (cons (car x) (append (cdr x) y))))))
```

## 求值器

现在我们来到了 McCarthy 发现的最精彩的部分：**一个用 Lisp 自身编写的 Lisp 求值器**。这个求值器（也称为元循环求值器，metacircular evaluator）展示了 Lisp 的定义特征——Lisp 可以用自身来编写。

我们定义函数 **eval**，它接受一个表达式 e 和一个环境 x（变量到值的映射），返回 e 在环境 x 下的值：

```
(label eval (lambda (e x)
  (cond
    ;; 如果 e 是原子，在环境中查找它的值
    ((atom e) (assoc e x))

    ;; 如果 e 的第一个元素是 quote，返回第二个元素
    ((eq (car e) 'quote) (car (cdr e)))

    ;; 如果第一个元素是 atom，对参数求值后应用 atom
    ((eq (car e) 'atom)  (atom (eval (car (cdr e)) x)))

    ;; 如果第一个元素是 eq，对两个参数求值后应用 eq
    ((eq (car e) 'eq)    (eq (eval (car (cdr e)) x)
                              (eval (car (cdr (cdr e))) x)))

    ;; 如果第一个元素是 car，对参数求值后应用 car
    ((eq (car e) 'car)   (car (eval (car (cdr e)) x)))

    ;; 如果第一个元素是 cdr，对参数求值后应用 cdr
    ((eq (car e) 'cdr)   (cdr (eval (car (cdr e)) x)))

    ;; 如果第一个元素是 cons，对两个参数求值后应用 cons
    ((eq (car e) 'cons)  (cons (eval (car (cdr e)) x)
                               (eval (car (cdr (cdr e))) x)))

    ;; 如果第一个元素是 cond，逐个检查条件
    ((eq (car e) 'cond)  (evcon (cdr e) x))

    ;; 否则，对操作符和参数求值后应用
    ('t (eval (cons (assoc (car e) x)
                    (evlis (cdr e) x))
              x)))))
```

其中辅助函数：

**assoc** — 在环境中查找变量的值：

```
(label assoc (lambda (e x)
  (cond ((eq (car (car x)) e) (cdr (car x)))
        ('t (assoc e (cdr x))))))
```

**evcon** — 处理 cond 表达式的条件分支：

```
(label evcon (lambda (c x)
  (cond ((eval (car (car c)) x)
         (eval (car (cdr (car c))) x))
        ('t (evcon (cdr c) x)))))
```

**evlis** — 对参数列表逐个求值：

```
(label evlis (lambda (m x)
  (cond ((atom m) '())
        ('t (cons (eval (car m) x)
                  (evlis (cdr m) x))))))
```

## 标记（The Mark）

McCarthy 的 1960 年论文不仅仅是定义了 Lisp 的语义。他还定义了一个称为 **mark** 的操作，这是一个用于垃圾回收的标记算法。这展示了 Lisp 的另一个深远影响：垃圾回收的概念正是从 Lisp 中诞生的。

在 McCarthy 之前，程序员必须手动管理内存。Lisp 引入了自动内存管理的概念——当一块内存不再被任何可达的数据结构引用时，它应该被自动回收。mark 算法的工作方式是：

1. 从根集合（当前可访问的变量）开始
2. 递归地标记所有可达的内存单元
3. 未被标记的内存单元就是垃圾，可以被回收

这个概念后来成为了所有现代编程语言垃圾回收器的基础，从 Java 到 JavaScript 到 Python，都受益于 McCarthy 的这一发明。

> **译者注：** 以下为译者补充的参考资料，非 Paul Graham 原文内容。

## 附录：从 McCarthy 记号到 Common Lisp

> McCarthy 的论文使用的是数学记号，而不是 S-表达式。以下对照表帮助读者理解 McCarthy 原始记号与 Common Lisp 代码的对应关系。

| McCarthy 记号 | 含义 | Common Lisp 对应 |
|---|---|---|
| `f[e₁; ...; eₙ]` | 函数调用 | `(f e₁ ... eₙ)` |
| `[α → β; ...]` | 条件表达式 | `(cond (α β) ...)` |
| `¬x` | 逻辑非 | `(not x)` |
| `x ∧ y` | 逻辑与 | `(and x y)` |
| `x ∨ y` | 逻辑或 | `(or x y)` |
| `first[x]` | 取第一个元素 | `(car x)` |
| `rest[x]` | 取其余元素 | `(cdr x)` |
| `cons[x; y]` | 构造列表 | `(cons x y)` |
| `null[x]` | 是否为空 | `(atom x)` |
| `eq[x; y]` | 是否相等 | `(eq x y)` |

> McCarthy 用 `label` 来实现递归定义。在数学上，这等价于不动点组合子（fixed-point combinator），即 Y 组合子。Y 组合子意味着：即使一门语言没有原生的递归支持，只要它支持高阶函数，就可以通过 Y 组合子实现递归。Y 组合子的定义为 `Y = λf.(λx.f(x x))(λx.f(x x))`，即 `Y f = f(Y f)`。

## 附录：自引用与同像性

> 译者注：以下内容是对原文中"Lisp 可以用自身来编写"这一核心论点的补充说明。

> Lisp 如何做到"用自身来编写自身"？这看起来是一个悖论。当我们写 eval 的时候，eval 本身就是一段 Lisp 代码，而 eval 的功能就是求值 Lisp 代码——包括求值 eval 自身。McCarthy 的突破在于三点：
>
> 1. **数据的统一表示**：Lisp 程序本身就是列表，而列表是 Lisp 的原生数据结构。程序和数据之间没有语法上的鸿沟。
> 2. **eval 的存在性**：一旦你有了七个原始操作符和函数记号，你就能定义 eval。而 eval 的定义只用了这些操作符——这意味着 eval 可以被它自身求值。
> 3. **quote 的关键作用**：quote 操作符是区分"代码"和"数据"的唯一手段。一个列表如果不被 quote，它就是代码（会被求值）；如果被 quote，它就是数据（原样返回）。这种区分使得程序可以操作自身而不触发无限递归。

> 这种能力被称为**同像性**（homoiconicity），源自希腊语 homo（相同）和 icon（形象），意思是"代码和数据的形象相同"。

> Lisp 的宏系统就是建立在这种能力之上的。Lisp 的宏不是简单的文本替换（像 C 的 `#define`），而是对代码结构的变换——因为代码本身就是数据结构。这赋予了 Lisp 程序员一种其他语言无法企及的力量：定义新的语言构造。例如，你可以自己写一个 `while` 宏：
>
> ```common-lisp
> (defmacro while (condition &body body)
>   `(loop while ,condition do (progn ,@body)))
> ```

## Lisp 的影响

回顾 McCarthy 的发现，我们可以看到 Lisp 对编程世界的深远影响：

1. **垃圾回收**：Lisp 是第一个引入自动内存管理的语言
2. **高阶函数**：函数可以作为参数传递和返回
3. **宏系统**：代码可以操作代码，这是 Lisp 最独特的特性
4. **同像性（Homoiconicity）**：代码和数据使用相同的表示形式
5. **递归**：Lisp 将递归作为主要的控制结构
6. **动态类型**：运行时类型检查而非编译时
7. **闭包**：函数可以捕获其定义时的环境

McCarthy 在 1960 年不可能预见到这些概念会变得如此重要。但正如 Graham 所指出的，编程语言的发展趋势一直在向 Lisp 模型靠拢。每种新的"现代"编程语言，本质上都是在 C 模型的基础上逐步加入 Lisp 的特性。

> Lisp 之所以与众不同，是因为它可以用自身来编写。

这就是 Lisp 的根源——一种如此简洁而强大的语言，以至于它的求值器只需要几行代码就能表达，而它所蕴含的思想至今仍在指引着编程语言的发展方向。

## 注

<div id="note1"></div>
[1]《符号表达式的递归函数及其机器计算，第一部分》ACM 通讯 3:4，1960年4月，184-195页
