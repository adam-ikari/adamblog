---
title: NonNull用法
toc: false
categories:
  - Java
date: 2019-09-18 00:00:00
tags:
  - Java Android 
---


> 这篇博文是从本人过去的 github pages 博客迁移过来，时间上会比较古老。

在编程中经常会需要对传入的参数做空引用检查。传统的做法是使用一连串的if语句对入参做检查，代码冗长又破坏整体感。

<!--more-->

可以使用@NonNull在方法或构造函数的参数上，让lombok为您生成null-check语句。
*@NonNull在Java库lombok v0.11.10中引入,而Android可以通过androidx.annotation库导入。*

写一个例子：

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
