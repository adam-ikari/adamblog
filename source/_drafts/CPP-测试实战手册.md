---
title: C++ 测试实战手册
toc: false
categories:
  - C++
date: 2025-03-03 18:48:32
keywords:
  - C++
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

## 简介

无

<!-- more -->

## 正文

### 使用 CMocka 库 MOCK 系统函数时对 open write close 等系统函数 MOCK 时影响了测试框架正常的文件读写操作如何解决？

**问题描述：**
在使用 CMocka 进行单元测试时，Mock 系统函数（如 open、write、close 等）可能会导致测试框架自身的文件操作被覆盖，从而影响测试框架的正常运行。

**解决办法：**

​区分测试框架和被测代码​。通过标志变量区分测试框架和被测代码的文件操作，确保测试框架调用真实的系统函数。
CMocka提供了`__real_`开头的函数可以调用真实的系统函数。

```cpp
    int __wrap_open(const char *pathname, int flags, ...)
    {
        mode_t mode = 0;

        if (flags & O_CREAT)
        {
            va_list args;
            va_start(args, flags);
            mode = va_arg(args, mode_t);
            va_end(args);
        }

        // 检查 is_test 标志，决定是调用 Mock 函数还是真实的系统函数
        if (is_test)
        {
            // 如果 is_test 为 true，调用 Mock 函数
            // mock_functions->open 是用户定义的 Mock 函数指针
            return mock_functions->open(pathname, flags, mode);
        }
        else
        {
            // 如果 is_test 为 false，调用真实的系统函数
            // __real_open 是 CMocka 提供的指向原始 open 函数的指针
            return __real_open(pathname, flags, mode);
        }
    }
```

## 注

无

## 参考

无
