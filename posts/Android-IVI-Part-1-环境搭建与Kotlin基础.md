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

> 🤖 **AI 辅助开发 Tip**
>
> **传统方式**：手动下载 Android Studio，在 SDK Manager 中逐一勾选平台版本和工具，创建 AVD 时反复调整参数，容易遗漏配置。
>
> **AI 辅助方式**：在 Claude Code 或 Copilot 中输入 "帮我生成一个 Android Automotive 项目的完整开发环境配置脚本"，AI 会自动生成包含 SDK 安装、模拟器创建、Gradle 配置的脚本，一键执行即可完成环境搭建。遇到报错时，直接将错误信息粘贴给 AI，它能快速定位问题（如 SDK 版本冲突、模拟器硬件加速未开启等）。
>
> **进阶技巧**：让 AI 分析你的开发机器配置，推荐最适合的模拟器参数（内存、分辨率、API 级别），避免手动试错的低效过程。

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

> 🤖 **AI 辅助开发 Tip**
>
> **传统方式**：阅读官方文档学习 Kotlin 语法，手动编写示例代码，遇到编译错误时逐个排查（如类型不匹配、空指针异常等）。
>
> **AI 辅助方式**：在 IDE 中安装 AI 助手插件（如 GitHub Copilot、Claude Code），编写代码时 AI 会自动补全函数体。例如输入 `fun checkSpeed(speed: Int): String =` 后，AI 会智能补全 `if (speed > 120) "超速了！" else "速度正常"`。遇到不懂的语法点时，直接选中代码问 AI "这段代码的 when 表达式是什么含义"，AI 会结合上下文给出精准解释。
>
> **进阶技巧**：让 AI 将 Java 代码转换为 Kotlin 代码（IDEA 内置的转换功能有时不够智能），或者要求 AI "用 Kotlin 的函数式编程风格重写这段循环代码"，学习更地道的 Kotlin 写法。

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

> 🤖 **AI 辅助开发 Tip**
>
> **传统方式**：阅读 Kotlin 官方文档的空安全章节，手动编写 `?.`、`?:`、`!!` 的测试用例，通过反复试错理解三种运算符的区别。扩展函数和 Lambda 的学习曲线较陡，需要查阅大量示例才能掌握最佳实践。
>
> **AI 辅助方式**：在 Claude Code 中打开你的项目，输入 "帮我检查这段代码的空安全问题"，AI 会自动扫描并标注潜在的空指针风险，建议将 `!!` 替换为 `?.let` 或 `?:`。学习扩展函数时，让 AI "为 Android 的 View 类写一个实用的扩展函数示例"，AI 会生成如 `fun View.dpToPx(dp: Float): Float = dp * resources.displayMetrics.density` 这样的实战代码，比文档中的抽象示例更易理解。
>
> **进阶技巧**：遇到复杂的 Lambda 链式操作时（如 `list.filter { }.map { }.sortedBy { }`），让 AI 用注释解释每一步的数据变换过程，或者要求 AI 将其改写为更易读的命名函数形式，帮助你理解函数式编程的思维模式。

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

> 🤖 **AI 辅助开发 Tip**
>
> **传统方式**：按照教程一步步复制粘贴代码，手动排查运行时错误（如 `NullPointerException`、`Resources$NotFoundException`），在 Stack Overflow 上搜索相似问题，耗时较长。
>
> **AI 辅助方式**：在 Claude Code 中直接描述需求 "创建一个显示欢迎文本的 Android Automotive Activity，文字要足够大以便在车载屏幕上阅读"，AI 会一次性生成完整的、符合车载规范的代码（包括合适的字体大小、颜色对比度、布局边距）。运行报错时，将完整的错误堆栈粘贴给 AI，它能立即指出问题根源（如忘记在 AndroidManifest.xml 中声明 Activity、主题继承错误等）。
>
> **进阶技巧**：让 AI "为这段代码编写单元测试"，AI 会自动生成 JUnit 测试用例，覆盖正常输入、边界条件（如空字符串）和异常情况。或者要求 AI "用 Jetpack Compose 重写这个传统的 View 实现"，提前接触下一章的内容，感受声明式 UI 的简洁性。

## 5. 本章小结

本章我们完成了：
- ✅ Android Studio 安装与配置
- ✅ Android Automotive OS 模拟器创建
- ✅ Kotlin 基础语法（变量、函数、类、条件、循环）
- ✅ Kotlin 进阶特性（空安全、扩展函数、Lambda）
- ✅ 第一个 Kotlin 程序

**下章预告**

Part 2 将深入 Android Automotive OS 架构，学习 IVI 核心概念和 Car API。

> 🤖 **AI 辅助开发 Tip**
>
> **本课回顾**：本章我们学习了环境搭建和 Kotlin 基础。在继续下一章之前，不妨用 AI 来巩固所学：
>
> 1. **代码审查**：将你的 Kotlin 练习代码粘贴给 AI，让它以资深 Android 工程师的角度进行代码审查，指出可以优化的地方（如 `val` 和 `var` 的选择、函数命名规范、空安全处理等）。
> 2. **生成练习题**：让 AI "生成 5 道 Kotlin 空安全的练习题，难度从简单到复杂"，通过实战加深理解。
> 3. **项目规划**：向 AI 描述你想实现的车载应用功能，让它帮你规划项目结构、技术选型和开发步骤，为后续章节的学习建立整体认知。
>
> **推荐 AI 工具**：本章内容适合使用支持实时代码补全的 AI 工具（如 GitHub Copilot、Cursor），在编写 Kotlin 代码时能获得即时反馈。遇到概念性问题时，Claude Code 的深度解释能力更有优势。

## 延伸阅读

- [Kotlin 官方文档](https://kotlinlang.org/docs/home.html)
- [Android Automotive OS 概述](https://developer.android.com/training/cars)
- [Jetpack Compose 入门](https://developer.android.com/jetpack/compose)
