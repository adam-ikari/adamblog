---
title: NonNull用法
description: Lombok @NonNull 注解用法详解，自动生成空引用检查代码，简化 Java 参数校验
category: Java
tags: [Java, Android]
date: 2019-09-18
---

# NonNull用法
> 这篇博文是从本人过去的 github pages 博客迁移过来，时间上会比较古老。

在编程中经常会需要对传入的参数做空引用检查。传统做法是一连串 if 把入参挨个查一遍，代码冗长，还把整体结构打散了。



可以用 `@NonNull` 标在方法或构造函数的参数上，让 lombok 帮你把 null-check 那段代码生成出来。
*@NonNull 在 Java 库 lombok v0.11.10 中引入，Android 这边可以通过 androidx.annotation 库导入。*

写个例子：

```java
public class Foo {
    Object mSomeObj;

    public Foo() {

    }

    /**
     * 使用 @NonNull 的写法
     * @param obj obj
     */
    public void setSomeObj(@NonNull Object obj) {
        this.mSomeObj = obj;
    }

    /**
     * 不使用 @NonNull 的写法
     * @param obj obj
     * @throws NullPointerException
     */
    public void setSomeObj_old(Object obj) 
            throws NullPointerException {
        if (mSomeObj == null) {
            throw new NullPointerException();
        }
        this.mSomeObj = obj;
    }
}
```
