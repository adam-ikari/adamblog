---
title: Markdown 规范
toc: true
categories:
  - markdown
date: 2024-04-22 14:38:12
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

## 前言

Markdown 作为一个轻量级标记语言，以其原始格式的高可读性的特点，在软件开发领域有着很高的流行性。甚至很多非软件开发团队和个人也会考虑使用 Markdown 来编写文档或者记录内容。

如此之高的使用率，使得 Markdown 文档的生态得到了迅速的发展，Markdown 的许多扩展语法也随之诞生并加入到 Markdown 生态。我们现在提起 Markdown 已经不局限于标准的和最初的 Markdown 语法，很多流行的扩展语法也成为 Markdown 使用者需要了解的知识。

Markdown 文档需要遵守 Markdown 标准语法和 Markdown 扩展语法才能称为合法的 Markdown 文档。除语法以外，为了更高的可读性，Markdown 文档还需要有一定的排版规范（typography-specifications）。

而随着 Markdown 流行到中文开发者和使用者群体中，也迅速的发展出适合中文的 Markdown 排版规范。

<!-- more -->

为了更好的维护 Markdown 文档，一份清晰的 Markdown 排版规范说明是十分有必要的。

本文档内容参考了 [GFM 规范 （GitHub Flavored Markdown Spec）](https://github.github.com/gfm/)、[中文技术文档的写作规范](https://github.com/ruanyf/document-style-guide)、网络上流行的 Markdown 扩展的规范和作者个人建议。

> [!note]
> GitHub Flavored Markdown（通常缩写为 GFM）是 Markdown 的方言，目前 GitHub.com 和 GitHub Enterprise 上的用户内容支持该方言。

本文并不不会回答“**Markdown 是什么？**”等问题，假定读者都已经掌握 Markdown 基础用法。如果需要了解这个问题的答案请阅读[维基百科页面](https://zh.wikipedia.org/zh-cn/Markdown)或者在搜索引擎上搜索相关内容。

## 简介

由于缺乏明确的规范以及 Markdown 的各种扩展语法的存在、个人习惯的差异、Markdown 渲染器的差异等现状，在 Markdown 文档编写的中常常会出现 Markdown 文档结构不清晰、部分语法无法渲染、在无渲染器场景下可读性下降等问题。

本 Markdown 规范（以下简称本规范）将明确规范 Markdown 的写法、收录通用的和可读性良好的 Markdown 扩展语法。

任何组织和个人可以使用本规范。

## 为什么需要 Markdown 文档规范？

John Gruber 对 [Markdown 语法的规范描述（canonical description of Markdown’s syntax）](http://daringfireball.net/projects/markdown/syntax)并没有明确指定 Markdown 文档规范。

> [!note]
> John Gruber 是 Markdown 的发明者。

详细的问题可以查看[《GitHub 风格的 Markdown 规范》的 1.3 章节——为什么需要一份规范](https://github.github.com/gfm/#why-is-a-spec-needed-)

## Markdown 文档规范

### 字符和编码

#### 使用 utf-8 字符编码

为了更好的在不同语言的操作系统的使用者之间正确的阅读 Markdown 文档而不必使用 Markdown 渲染器，要求 Markdown 文档使用 utf-8 编码

> [!tip]
> 任何字符序列在 Markdown 文档中都是有效的。Markdown 文档并不要求特定的字符编码。

#### 使用 Unix 风格的行结束符

为了方便在不同操作系统之间分享和方便使用 Git 托管 Markdown 文档、使用 Unix 风格的行结束符（LF）。

> [!tip]
> 行结束符有三种情况：
>
> - 换行符 (U+000A)：这是最常见的行结束符，通常用在 Unix 和 Unix-like > 系统中，如 Linux 和 macOS。即 LF。
> - 回车符 (U+000D) 后不跟换行符：这种情况较少见，可能用在一些旧的文本系统中。
> - 回车符和后面的换行符：这种组合通常用在 Windows 系统中，其中回车符和换行符一起作为行结束符。即 CRLF。

如果你正在使用的操作系统是 Windows，请将文本编辑器或代码编辑器的行结束符设置成使用 LF。

> [!tip]
> 大部分的代码编辑器都支持设置行结束符。

如果使用 Git 托管 Markdown 文档，请配置 Git 的行结束符。

> [!tip]
> Git 可以配置来处理不同操作系统的行结束符。这是通过一个名为 core.autocrlf 的配置选项来实现的。
> 例如：
>
> ```shell
> git config --global core.autocrlf true。
> ```

#### Markdown 文档的结尾必须有一个空行

文件末尾（EOF）只允许出现在空行的结尾，也就是说 Markdown 文档的结尾必须有一个空行，即一个行结束符（line ending）+ 文件末尾（EOF）结束

### 标题

标题由一串字符组成，解析为内联内容，位于 1-6 个未转义 `#` 字符的开始序列和任意数量的未转义 `#` 字符的可选结束序列之间。
`#` 字符的开头序列后面必须跟有空格或行尾。 `#` 的可选结束序列前面必须有一个空格，并且后面只能有空格。
标题的原始内容在被解析为内联内容之前会去除前导和尾随空格。标题级别等于开头序列中 `#` 字符的数量。

#### 标题前不要缩进

标题的`#`前不要有空格、制表符等缩进。

#### 文档的标题使用一级标题

例如：

```markdown
# 文档标题
```

#### 每个文档只有一个一级标题

不要出现下面的情况：

```markdown
# 文档标题 1

# 文档标题 2
```

#### 文档的章节标题使用二级标题

例如：

```markdown
# 文档标题

## 第一章

## 第二章
```

#### 每个小节的标题使用三级标题

例如：

```markdown
# 文档标题

## 第一章

### 第一节

### 第二节

## 第二章
```

#### 进一步分层组织时使用四级标题

例如：

```markdown
# 文档标题

## 第一章

### 第一节

#### 约定

#### 规范

### 第二节

## 第二章
```

#### 尽量少用五级标题和六级标题，考虑用有序列表和无序列表代替

例如：
使用

```markdown
#### h4

- session 1
- session 2
- session 3
- session 4
```

或

```markdown
#### h4

1. session 1
2. session 2
3. session 3
4. session 4
```

代替

```markdown
#### h4

##### session 1

##### session 2

##### session 3

##### session 4
```

#### 标题要避免孤立编号

标题要避免孤立编号（即同级标题只有一个），例如：

```markdown
<!-- 不好的写法 -->

## 安装

### 安装方法 <!-- 同级标题只有一个 -->

## 使用
```

改成：

```markdown
## 安装方法

## 使用
```

#### 下级标题不重复上一级标题的内容

避免以下情况：

```markdown
<!-- 不好的写法 -->

## 安装

### 安装
```

### 全角、半角

#### 英文使用半角标点

如果你的句子全部是英文，那么你应该使用半角标点。例如：

```markdown
<!-- 例子1 -->

Hello, world! This is an example of a complete English sentence.

<!-- 例子2 -->

Have you heard of "Microsoft Edge"? It's a web browser developed by Microsoft.
```

#### 中文使用全角中文标点

中文使用全角中文标点。

```markdown
蒹葭苍苍，白露为霜。
```

中文句子中引用英文名词使用全角标点引号。

```markdown
我最喜欢的浏览器是“Microsoft Edge”。
```

#### 遇到完整的英文整句、特殊名词，其內容使用半角标点

英文句子插入中文段落： 在中文段落中插入完整的英文句子时，应该使用半角标点。例如：

```markdown
我正在学习 Python，Hello, world! 是我写的第一个程序。<!-- Hello, world!使用半角符号 -->
```

### 空格

#### 中英文之间需要增加空格

例如：

```markdown
在 LeanCloud 上，数据存储是围绕 AVObject 进行的。
```

#### 中文与数字之间需要增加空格

例如：

```markdown
今天出去买菜花了 5000 元。
```

#### 数字与英文单位之间无需增加空格

例如：

```markdown
我家的光纤入户宽带有 10Gbps，SSD 一共有 10TB。
今天是 33°C 的高温。
```

#### 全角标点与其他字符之间不加空格

例如：
刚刚买了一部 iPhone，好开心！

> [!tip]
> 在中文和半角的英文、数字、符号之间插入空白符的现象被称为"盘古之白"。这个空白有助于视觉上区分全角的中文字符和半角的英文字符，使得文本更加易读。这个术语来源于汉学家的称呼，因为它象征性地“劈开”了中英文之间的混沌，就像传说中的盘古开天辟地一样。在排版中，适当使用"盘古之白"可以提升文章的整体美观和阅读体验。

### 名词

#### 英文专有名词使用正确的大小写

```markdown
我们的客户有 GitHub、Foursquare、Microsoft Corporation、Google、Facebook, Inc.。
```

#### 强调的词汇

在提到了专有名词和特殊名词时、或者需要着重强调的词汇时，使用行内代码块。例如：

```markdown
我正在学习`Python`，这是一种非常强大的编程语言。
```

#### 缩写

第一次出现英文词汇时，在括号中给出中文标注。此后再次出现时，直接使用英文缩写即可
IOC（International Olympic Committee，国际奥林匹克委员会）。这样定义后，便可以直接使用“IOC”了。

#### 不要使用不地道的缩写

### 正文

#### 正文段落之间用一个空行来分隔

#### 需要强调某处内容时使用粗体

#### 中文排版中不使用斜体

#### 英文排版中可用斜体表达强调，或表示书名、题目

## 参考

1. [GitHub 风格的 Markdown 规范](https://github.github.com/gfm/)
2. [中文技术文档的写作规范](https://github.com/ruanyf/document-style-guide)
3. [养成良好的写作习惯之「盘古之白」](https://indigovoid.github.io/2020/03/17/%E5%86%99%E4%BD%9C%E4%B9%A0%E6%83%AF1/)
