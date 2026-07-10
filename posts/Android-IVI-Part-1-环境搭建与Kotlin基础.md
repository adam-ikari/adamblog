---
title: Android IVI 开发 Part 1：环境搭建与 Kotlin 基础
description: 从零开始搭建 Android IVI 开发环境，学习 Kotlin 基础语法，为车载应用开发打下基础
category: Android
tags: [Android, IVI, 车载, Kotlin, Jetpack Compose]
recommend: true
date: 2026-07-10
series:
  - id: series-android-ivi
    name: Android IVI 开发从零基础到实战
    order: 1
    prev:
    next: /posts/Android-IVI-Part-2-Android-Automotive-OS与IVI架构
---

# Android IVI 开发 Part 1：环境搭建与 Kotlin 基础

## 前言

欢迎来到 Android IVI（车载信息娱乐系统）开发的世界！本系列教程将带你从零基础开始，逐步掌握使用 Kotlin 和 Jetpack Compose Automotive 开发车载应用的核心技能。

**什么是 IVI？**

IVI（In-Vehicle Infotainment）即车载信息娱乐系统，是安装在汽车中的多媒体系统，负责音频播放、导航、车辆信息显示等功能。与传统的手机应用不同，IVI 应用需要特别注意驾驶安全、大字体显示、触摸优化等特殊需求。

**本系列目标**

完成本系列后，你将能够独立开发一个完整的车载音乐播放器应用，包括：
- 本地音乐扫描与播放
- 美观的车载 UI 界面
- 方向盘按键控制
- 驾驶模式适配

**Part 1 内容概览**

- 安装 Android Studio 和 Automotive OS 模拟器
- Kotlin 基础语法（变量、函数、类）
- Kotlin 进阶特性（空安全、扩展函数、Lambda）
- 编写第一个 Kotlin 程序

## 1. 开发环境搭建

### 1.1 安装 Android Studio

Android Studio 是 Google 官方推荐的 Android 开发 IDE，内置了所有必要的工具。

**下载与安装**

1. 访问 [Android Studio 官网](https://developer.android.com/studio)
2. 下载对应系统的安装包
3. 按照向导完成安装

**配置 SDK**

打开 Android Studio，进入 SDK Manager：
- SDK Platforms: 勾选 `Android 13.0 (API 33)` 或更高版本
- SDK Tools: 勾选 `Android SDK Build-Tools`、`Android Emulator`、`Android SDK Platform-Tools`

### 1.2 配置 Android Automotive OS 模拟器

Automotive OS 是专为车载场景优化的 Android 系统。

**创建 Automotive 虚拟设备**

1. 打开 AVD Manager（Tools > AVD Manager）
2. 点击 "Create Device"
3. 选择 "Automotive" 类别
4. 选择分辨率和 API 级别（建议 API 33+）
5. 完成创建并启动

**验证环境**

启动模拟器后，你应该能看到类似车机的界面，包含导航栏、媒体控制等元素。

### 1.3 创建第一个 IVI 项目

1. File > New > New Project
2. 选择 "Empty Activity"
3. 项目配置：
   - Name: `MyFirstIVI`
   - Package name: `com.example.myfirstivi`
   - Language: Kotlin
   - Minimum SDK: API 29 (Android 10)
4. 点击 Finish

**项目结构说明**

```
MyFirstIVI/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/myfirstivi/
│   │       │   └── MainActivity.kt
│   │       └── res/
│   │           └── layout/
│   │               └── activity_main.xml
│   └── build.gradle
├── build.gradle
└── settings.gradle
```

## 2. Kotlin 基础语法

Kotlin 是 Google 推荐的 Android 开发语言，简洁、安全、与 Java 完全互操作。

### 2.1 变量与常量

```kotlin
// 可变变量
var name: String = "IVI"
name = "Android Automotive"

// 不可变变量（推荐优先使用）
val version: Int = 13

// 类型推断
val platform = "Automotive" // 编译器自动推断为 String
```

### 2.2 函数定义

```kotlin
// 基本函数
fun greet(name: String): String {
    return "Hello, $name!"
}

// 单表达式函数
fun add(a: Int, b: Int) = a + b

// 默认参数
fun greet(name: String, greeting: String = "Hello"): String {
    return "$greeting, $name!"
}
```

### 2.3 类与对象

```kotlin
// 定义类
class Car(val brand: String, val model: String) {
    fun info(): String {
        return "$brand $model"
    }
}

// 创建对象
val myCar = Car("Toyota", "Camry")
println(myCar.info()) // 输出: Toyota Camry
```

### 2.4 条件语句与循环

```kotlin
// if-else
fun checkSpeed(speed: Int): String {
    return if (speed > 120) {
        "超速了！"
    } else {
        "速度正常"
    }
}

// when（类似 switch）
fun getDayType(day: Int): String {
    return when (day) {
        1, 2, 3, 4, 5 -> "工作日"
        6, 7 -> "周末"
        else -> "未知"
    }
}

// for 循环
for (i in 1..5) {
    println(i)
}

// 遍历集合
val songs = listOf(" song1", "song2", "song3")
for (song in songs) {
    println(song)
}
```

## 3. Kotlin 进阶特性

### 3.1 空安全（Null Safety）

Kotlin 通过类型系统避免空指针异常。

```kotlin
// 不可为空
var name: String = "IVI"
// name = null // 编译错误！

// 可为空
var nullableName: String? = "IVI"
nullableName = null // 可以

// 安全调用
val length = nullableName?.length // 如果为 null，返回 null

// Elvis 运算符
val displayName = nullableName ?: "默认名称"

// 非空断言（慎用）
val forceName = nullableName!! // 如果为 null，抛出异常
```

### 3.2 扩展函数

为现有类添加新功能。

```kotlin
// 为 String 添加扩展函数
fun String.addPrefix(prefix: String): String {
    return "$prefix$this"
}

val result = "World".addPrefix("Hello ")
println(result) // 输出: Hello World
```

### 3.3 Lambda 表达式

```kotlin
// 基本 Lambda
val sum = { a: Int, b: Int -> a + b }
println(sum(3, 5)) // 输出: 8

// 集合操作
val numbers = listOf(1, 2, 3, 4, 5)
val doubled = numbers.map { it * 2 }
println(doubled) // 输出: [2, 4, 6, 8, 10]

// 过滤
val even = numbers.filter { it % 2 == 0 }
println(even) // 输出: [2, 4]
```

## 4. 第一个 Kotlin 程序

在 `MainActivity.kt` 中编写：

```kotlin
package com.example.myfirstivi

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.TextView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val textView = TextView(this)
        textView.text = generateGreeting("Android IVI")
        textView.textSize = 24f
        
        setContentView(textView)
    }
    
    private fun generateGreeting(name: String): String {
        return "Welcome to $name!"
    }
}
```

**运行程序**

1. 点击工具栏的 "Run" 按钮
2. 选择 Automotive 模拟器
3. 看到 "Welcome to Android IVI!" 即为成功

## 5. 本章小结

本章我们完成了：
- ✅ Android Studio 安装与配置
- ✅ Android Automotive OS 模拟器创建
- ✅ Kotlin 基础语法（变量、函数、类、条件、循环）
- ✅ Kotlin 进阶特性（空安全、扩展函数、Lambda）
- ✅ 第一个 Kotlin 程序

**下章预告**

Part 2 将深入 Android Automotive OS 架构，学习 IVI 核心概念和 Car API。

## 延伸阅读

- [Kotlin 官方文档](https://kotlinlang.org/docs/home.html)
- [Android Automotive OS 概述](https://developer.android.com/training/cars)
- [Jetpack Compose 入门](https://developer.android.com/jetpack/compose)
