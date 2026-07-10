# Android IVI 开发教程连载 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建4篇Android IVI开发连载教程，从零基础到实战项目（车载音乐播放器），使用Kotlin + Jetpack Compose Automotive技术栈。

**Architecture:** 4篇连载文章，每篇独立但循序渐进。每篇包含理论讲解+代码示例+配图。文章使用Markdown格式，配图使用SVG，存放于文章同名目录下。

**Tech Stack:** Markdown, SVG, VitePress (blog框架)

## Global Constraints

- 文章存放路径: `posts/`
- 配图存放路径: `posts/<文章名>/`
- 文件命名规范: `Android-IVI-Part-<N>-<描述>.md`
- 系列ID: `series-android-ivi`
- 系列名称: `Android IVI 开发从零基础到实战`
- 每篇文章必须包含完整的frontmatter（title, description, category, tags, date, series）
- category统一为 `Android`
- tags必须包含: [Android, IVI, 车载, Kotlin, Jetpack Compose]
- recommend: true
- date: 2026-07-10

---

### Task 1: 创建Part 1文章目录和配图目录

**Files:**
- Create: `posts/Android-IVI-Part-1-环境搭建与Kotlin基础.md`
- Create: `posts/Android-IVI-Part-1-环境搭建与Kotlin基础/` (配图目录)

**Interfaces:**
- Consumes: 无
- Produces: 文章文件和配图目录

- [ ] **Step 1: 创建文章文件**

```markdown
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
```

- [ ] **Step 2: 创建配图目录**

```bash
mkdir -p /home/gem/project/blog/posts/Android-IVI-Part-1-环境搭建与Kotlin基础
```

- [ ] **Step 3: 验证文件创建**

```bash
ls -la /home/gem/project/blog/posts/Android-IVI-Part-1-环境搭建与Kotlin基础.md
ls -la /home/gem/project/blog/posts/Android-IVI-Part-1-环境搭建与Kotlin基础/
```

Expected: 文件和目录存在

- [ ] **Step 4: Commit**

```bash
git add posts/Android-IVI-Part-1-环境搭建与Kotlin基础.md
git add posts/Android-IVI-Part-1-环境搭建与Kotlin基础/
git commit -m "docs: 添加Android IVI开发Part 1文章"
```

---

### Task 2: 创建Part 2文章目录和配图目录

**Files:**
- Create: `posts/Android-IVI-Part-2-Android-Automotive-OS与IVI架构.md`
- Create: `posts/Android-IVI-Part-2-Android-Automotive-OS与IVI架构/` (配图目录)

**Interfaces:**
- Consumes: Part 1 文章
- Produces: Part 2 文章和配图目录

- [ ] **Step 1: 创建文章文件**

```markdown
---
title: Android IVI 开发 Part 2：Android Automotive OS 与 IVI 架构
description: 深入理解 Android Automotive OS 架构、IVI 核心概念和 Car API，为车载应用开发打下理论基础
category: Android
tags: [Android, IVI, 车载, Kotlin, Jetpack Compose]
recommend: true
date: 2026-07-10
series:
  - id: series-android-ivi
    name: Android IVI 开发从零基础到实战
    order: 2
    prev: /posts/Android-IVI-Part-1-环境搭建与Kotlin基础
    next: /posts/Android-IVI-Part-3-Jetpack-Compose-Automotive实战
---

# Android IVI 开发 Part 2：Android Automotive OS 与 IVI 架构

## 前言

在 Part 1 中，我们搭建了开发环境并学习了 Kotlin 基础。现在，让我们深入 Android Automotive OS 的世界，理解它的架构和 IVI 开发的核心概念。

**本章目标**

- 理解 Android Automotive OS 与手机 Android 的区别
- 掌握 IVI 核心概念和设计原则
- 学会使用 Car API 读取车辆信息
- 创建 IVI 项目模板

## 1. Android Automotive OS 概述

### 1.1 与 Android 手机的区别

| 特性 | Android 手机 | Android Automotive OS |
|------|-------------|----------------------|
| 运行环境 | 手机/平板 | 车载系统 |
| 输入方式 | 触摸、手势 | 触摸、旋钮、方向盘按键 |
| 屏幕尺寸 | 5-7英寸 | 8-15英寸 |
| 使用场景 | 随时使用 | 驾驶中使用 |
| 安全要求 | 一般 | 高（驾驶安全） |
| 电源管理 | 电池 | 车载电源 |

### 1.2 车载系统架构

```
┌─────────────────────────────────────┐
│           应用层 (Applications)       │
│    音乐、导航、设置、电话等            │
├─────────────────────────────────────┤
│         框架层 (Framework)            │
│    Car API、Media、Telephony 等      │
├─────────────────────────────────────┤
│        原生层 (Native Services)        │
│    Vehicle HAL、Audio、Graphics      │
├─────────────────────────────────────┤
│         硬件抽象层 (HAL)               │
│    车辆总线 (CAN/LIN)、传感器等        │
├─────────────────────────────────────┤
│          Linux 内核                    │
│    驱动程序、内存管理、进程调度         │
└─────────────────────────────────────┘
```

**关键组件**

- **Vehicle HAL**: 硬件抽象层，负责与车辆总线通信
- **Car Service**: 系统服务，提供车辆状态信息
- **Car API**: 应用层接口，开发者通过它访问车辆功能

### 1.3 安全与权限模型

车载应用有严格的权限控制：

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.car.permission.CAR_SPEED" />
<uses-permission android:name="android.car.permission.CAR_ENERGY" />
```

**重要权限**

| 权限 | 说明 | 危险级别 |
|------|------|---------|
| `CAR_SPEED` | 读取车速 | 危险 |
| `CAR_ENERGY` | 读取能耗 | 危险 |
| `CAR_INFO` | 读取车辆信息 | 正常 |
| `CAR_EXTERIOR_ENVIRONMENT` | 外部环境 | 危险 |

## 2. IVI 核心概念

### 2.1 车载 UI 设计原则

**驾驶安全优先**

- 减少视觉干扰：避免动画和闪烁
- 大字体大按钮：便于快速识别和点击
- 高对比度：确保阳光下可读
- 语音交互：支持语音控制减少手动操作

**代码示例：大按钮样式**

```kotlin
@Composable
fun CarButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .height(80.dp) // 大高度
            .fillMaxWidth(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Text(
            text = text,
            fontSize = 24.sp, // 大字体
            fontWeight = FontWeight.Bold
        )
    }
}
```

### 2.2 车载应用生命周期

车载应用的生命周期与手机应用类似，但有额外限制：

```kotlin
class CarMediaActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 初始化 UI
    }
    
    override fun onResume() {
        super.onResume()
        // 检查驾驶状态
        if (isDriving()) {
            // 限制某些操作
            disableDistractionFeatures()
        }
    }
    
    override fun onPause() {
        super.onPause()
        // 保存状态
    }
    
    private fun isDriving(): Boolean {
        // 检查车辆是否行驶中
        return false
    }
    
    private fun disableDistractionFeatures() {
        // 禁用分散注意力的功能
    }
}
```

### 2.3 多屏幕与分屏处理

现代汽车通常有多个屏幕：仪表盘、中控屏、副驾屏。

```kotlin
// 检查当前屏幕类型
val displayManager = getSystemService(DisplayManager::class.java)
val displays = displayManager.displays

for (display in displays) {
    when (display.name) {
        "ClusterDisplay" -> setupClusterUI()
        "MainDisplay" -> setupMainUI()
        "PassengerDisplay" -> setupPassengerUI()
    }
}
```

## 3. Car API 介绍

### 3.1 获取 Car 对象

```kotlin
import android.car.Car
import android.car.hardware.CarSensorManager

class MainActivity : AppCompatActivity() {
    private var car: Car? = null
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // 创建 Car 对象
        car = Car.createCar(this)
    }
    
    override fun onDestroy() {
        super.onDestroy()
        car?.disconnect()
    }
}
```

### 3.2 读取车辆属性

```kotlin
// 读取车速
fun getSpeed(): Float {
    val car = Car.createCar(context)
    val sensorManager = car.getCarManager(Car.SENSOR_SERVICE) as CarSensorManager
    
    // 注册车速监听器
    sensorManager.registerListener(
        { event ->
            val speed = event.floatValues[0] // km/h
            println("当前车速: $speed km/h")
        },
        CarSensorManager.SENSOR_TYPE_CAR_SPEED,
        CarSensorManager.SENSOR_RATE_NORMAL
    )
    
    return 0f
}

// 读取油量
fun getFuelLevel(): Float {
    val car = Car.createCar(context)
    val propertyManager = car.getCarManager(Car.PROPERTY_SERVICE) as CarPropertyManager
    
    val fuelLevel = propertyManager.getFloatProperty(
        VehiclePropertyIds.EV_BATTERY_LEVEL,
        0 // 区域 ID
    )
    
    return fuelLevel
}
```

### 3.3 车载媒体控制

```kotlin
import android.media.MediaMetadata
import android.media.session.MediaController
import android.media.session.PlaybackState

class CarMediaController(context: Context) {
    private val mediaController: MediaController
    
    init {
        val mediaSessionManager = context.getSystemService(Context.MEDIA_SESSION_SERVICE) as MediaSessionManager
        val sessions = mediaSessionManager.getActiveSessions(null)
        mediaController = sessions.firstOrNull()?.let { MediaController(context, it.token) }
    }
    
    fun play() {
        mediaController?.transportControls?.play()
    }
    
    fun pause() {
        mediaController?.transportControls?.pause()
    }
    
    fun skipToNext() {
        mediaController?.transportControls?.skipToNext()
    }
    
    fun getCurrentSong(): String {
        val metadata = mediaController?.metadata
        return metadata?.getString(MediaMetadata.METADATA_KEY_TITLE) ?: "未知歌曲"
    }
}
```

## 4. 创建 IVI 项目模板

### 4.1 项目结构

```
CarMusicPlayer/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/carmusic/
│   │       │   ├── MainActivity.kt
│   │       │   ├── ui/
│   │       │   │   ├── theme/
│   │       │   │   │   └── Color.kt
│   │       │   │   ├── components/
│   │       │   │   │   ├── PlayerControls.kt
│   │       │   │   │   └── SongList.kt
│   │       │   │   └── screens/
│   │       │   │       ├── HomeScreen.kt
│   │       │   │       └── PlayerScreen.kt
│   │       │   ├── data/
│   │       │   │   ├── model/
│   │       │   │   │   └── Song.kt
│   │       │   │   └── repository/
│   │       │   │       └── SongRepository.kt
│   │       │   └── viewmodel/
│   │       │       └── PlayerViewModel.kt
│   │       └── res/
│   │           ├── drawable/
│   │           ├── values/
│   │           └── xml/
│   └── build.gradle
└── build.gradle
```

### 4.2 依赖配置

```kotlin
// build.gradle.kts (Module: app)
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.carmusic"
    compileSdk = 34
    
    defaultConfig {
        applicationId = "com.example.carmusic"
        minSdk = 29
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    
    buildFeatures {
        compose = true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.0"
    }
    
    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    // AndroidX
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    
    // Compose
    implementation("androidx.compose.ui:ui:1.5.0")
    implementation("androidx.compose.material3:material3:1.1.0")
    implementation("androidx.compose.ui:ui-tooling-preview:1.5.0")
    
    // Automotive
    implementation("androidx.car.app:app:1.4.0")
    
    // Lifecycle
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.0")
    implementation("androidx.activity:activity-compose:1.7.0")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
}
```

## 5. 本章小结

本章我们学习了：
- ✅ Android Automotive OS 架构（HAL、Car Service、应用层）
- ✅ IVI 核心概念（驾驶安全、UI 设计原则、生命周期）
- ✅ Car API 使用（获取车辆属性、媒体控制）
- ✅ IVI 项目模板和依赖配置

**下章预告**

Part 3 将学习 Jetpack Compose Automotive，构建美观的车载 UI。

## 延伸阅读

- [Android Automotive OS 架构](https://source.android.com/docs/automotive)
- [Car API 参考](https://developer.android.com/reference/android/car/package-summary)
- [车载 UI 设计指南](https://developer.android.com/training/cars/design)
```

- [ ] **Step 2: 创建配图目录**

```bash
mkdir -p /home/gem/project/blog/posts/Android-IVI-Part-2-Android-Automotive-OS与IVI架构
```

- [ ] **Step 3: 验证文件创建**

```bash
ls -la /home/gem/project/blog/posts/Android-IVI-Part-2-Android-Automotive-OS与IVI架构.md
ls -la /home/gem/project/blog/posts/Android-IVI-Part-2-Android-Automotive-OS与IVI架构/
```

Expected: 文件和目录存在

- [ ] **Step 4: Commit**

```bash
git add posts/Android-IVI-Part-2-Android-Automotive-OS与IVI架构.md
git add posts/Android-IVI-Part-2-Android-Automotive-OS与IVI架构/
git commit -m "docs: 添加Android IVI开发Part 2文章"
```

---

### Task 3: 创建Part 3文章目录和配图目录

**Files:**
- Create: `posts/Android-IVI-Part-3-Jetpack-Compose-Automotive实战.md`
- Create: `posts/Android-IVI-Part-3-Jetpack-Compose-Automotive实战/` (配图目录)

**Interfaces:**
- Consumes: Part 2 文章
- Produces: Part 3 文章和配图目录

- [ ] **Step 1: 创建文章文件**

```markdown
---
title: Android IVI 开发 Part 3：Jetpack Compose Automotive 实战
description: 学习使用 Jetpack Compose Automotive 构建美观的车载 UI，掌握 Compose 基础、车载主题和常用组件
category: Android
tags: [Android, IVI, 车载, Kotlin, Jetpack Compose]
recommend: true
date: 2026-07-10
series:
  - id: series-android-ivi
    name: Android IVI 开发从零基础到实战
    order: 3
    prev: /posts/Android-IVI-Part-2-Android-Automotive-OS与IVI架构
    next: /posts/Android-IVI-Part-4-车载音乐播放器实战项目
---

# Android IVI 开发 Part 3：Jetpack Compose Automotive 实战

## 前言

在 Part 2 中，我们理解了 Android Automotive OS 的架构和 IVI 核心概念。现在，让我们学习使用 Jetpack Compose Automotive 构建美观、安全的车载 UI。

**本章目标**

- 掌握 Jetpack Compose 基础（Composable、状态、布局）
- 了解 Compose Automotive 的车载特性
- 学会使用常用车载 UI 组件
- 构建音乐播放器 UI 原型

## 1. Jetpack Compose 基础

### 1.1 Composable 函数

Compose 使用 Composable 函数构建 UI。

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.material3.Text
import androidx.compose.material3.Button
import androidx.compose.foundation.layout.Column

@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}

@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    
    Column {
        Text(text = "Count: $count")
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```

### 1.2 状态管理

```kotlin
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue

@Composable
fun PlayerState() {
    // 使用 remember 保持状态
    var isPlaying by remember { mutableStateOf(false) }
    var currentSong by remember { mutableStateOf("未知歌曲") }
    var progress by remember { mutableStateOf(0f) }
    
    Column {
        Text(text = currentSong)
        
        // 进度条
        Slider(
            value = progress,
            onValueChange = { progress = it },
            modifier = Modifier.fillMaxWidth()
        )
        
        // 播放/暂停按钮
        Button(onClick = { isPlaying = !isPlaying }) {
            Text(if (isPlaying) "暂停" else "播放")
        }
    }
}
```

### 1.3 布局

```kotlin
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun PlayerLayout() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceEvenly
    ) {
        // 专辑封面
        AlbumCover()
        
        // 歌曲信息
        SongInfo()
        
        // 进度条
        ProgressBar()
        
        // 控制按钮
        ControlButtons()
    }
}
```

## 2. Compose Automotive 特性

### 2.1 车载主题（CarTheme）

```kotlin
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.ui.graphics.Color

// 定义车载主题颜色
private val CarDarkColorScheme = darkColorScheme(
    primary = Color(0xFF90CAF9),
    secondary = Color(0xFFB0BEC5),
    tertiary = Color(0xFF80DEEA),
    background = Color(0xFF121212),
    surface = Color(0xFF1E1E1E),
    onPrimary = Color(0xFF000000),
    onSecondary = Color(0xFF000000),
    onBackground = Color(0xFFFFFFFF),
    onSurface = Color(0xFFFFFFFF)
)

@Composable
fun CarMusicTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = CarDarkColorScheme,
        typography = Typography, // 大字体
        content = content
    )
}
```

### 2.2 驾驶模式适配

```kotlin
@Composable
fun DrivingAwareContent(
    isDriving: Boolean,
    content: @Composable () -> Unit
) {
    if (isDriving) {
        // 驾驶模式：简化 UI，减少干扰
        SimplifiedUI(content)
    } else {
        // 停车模式：完整 UI
        content()
    }
}

@Composable
fun SimplifiedUI(content: @Composable () -> Unit) {
    Column {
        // 只显示最重要的信息
        Text(
            text = "驾驶中",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold
        )
        
        // 简化的控制按钮
        Row {
            IconButton(onClick = { /* 上一首 */ }) {
                Icon(Icons.Default.SkipPrevious, "Previous")
            }
            IconButton(onClick = { /* 播放/暂停 */ }) {
                Icon(Icons.Default.PlayArrow, "Play/Pause")
            }
            IconButton(onClick = { /* 下一首 */ }) {
                Icon(Icons.Default.SkipNext, "Next")
            }
        }
    }
}
```

### 2.3 大字体与高对比度

```kotlin
@Composable
fun CarText(
    text: String,
    style: TextStyle = MaterialTheme.typography.headlineLarge,
    modifier: Modifier = Modifier
) {
    Text(
        text = text,
        style = style,
        modifier = modifier,
        // 确保高对比度
        color = MaterialTheme.colorScheme.onBackground
    )
}

// 使用示例
@Composable
fun SongTitle(name: String) {
    CarText(
        text = name,
        style = MaterialTheme.typography.headlineLarge.copy(
            fontSize = 32.sp, // 大字体
            fontWeight = FontWeight.Bold
        )
    )
}
```

## 3. 常用车载 UI 组件

### 3.1 列表与卡片

```kotlin
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults

@Composable
fun SongList(
    songs: List<Song>,
    onSongClick: (Song) -> Unit
) {
    LazyColumn {
        items(songs) { song ->
            SongCard(
                song = song,
                onClick = { onSongClick(song) }
            )
        }
    }
}

@Composable
fun SongCard(
    song: Song,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp),
        elevation = CardDefaults.cardElevation(4.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // 专辑封面
            AlbumArt(
                uri = song.albumArtUri,
                modifier = Modifier.size(80.dp)
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            // 歌曲信息
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = song.title,
                    style = MaterialTheme.typography.titleLarge,
                    maxLines = 1
                )
                Text(
                    text = song.artist,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
```

### 3.2 按钮与开关

```kotlin
import androidx.compose.material3.IconButton
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Switch

@Composable
fun PlayerControls(
    isPlaying: Boolean,
    onPlayPause: () -> Unit,
    onPrevious: () -> Unit,
    onNext: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // 上一首
        IconButton(
            onClick = onPrevious,
            modifier = Modifier.size(80.dp) // 大触摸目标
        ) {
            Icon(
                imageVector = Icons.Default.SkipPrevious,
                contentDescription = "Previous",
                modifier = Modifier.size(48.dp) // 大图标
            )
        }
        
        // 播放/暂停
        FilledIconButton(
            onClick = onPlayPause,
            modifier = Modifier.size(100.dp) // 更大的播放按钮
        ) {
            Icon(
                imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                contentDescription = if (isPlaying) "Pause" else "Play",
                modifier = Modifier.size(56.dp)
            )
        }
        
        // 下一首
        IconButton(
            onClick = onNext,
            modifier = Modifier.size(80.dp)
        ) {
            Icon(
                imageVector = Icons.Default.SkipNext,
                contentDescription = "Next",
                modifier = Modifier.size(48.dp)
            )
        }
    }
}
```

### 3.3 进度条与滑块

```kotlin
import androidx.compose.material3.Slider
import androidx.compose.material3.LinearProgressIndicator

@Composable
fun ProgressBar(
    progress: Float,
    duration: Long,
    onSeek: (Float) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // 进度滑块
        Slider(
            value = progress,
            onValueChange = onSeek,
            modifier = Modifier.fillMaxWidth(),
            thumb = {
                SliderDefaults.Thumb(
                    interactionSource = remember { MutableInteractionSource() },
                    modifier = Modifier.size(32.dp) // 大滑块
                )
            }
        )
        
        // 时间显示
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = formatTime((progress * duration).toLong()),
                style = MaterialTheme.typography.bodyLarge
            )
            Text(
                text = formatTime(duration),
                style = MaterialTheme.typography.bodyLarge
            )
        }
    }
}

fun formatTime(ms: Long): String {
    val seconds = ms / 1000
    val minutes = seconds / 60
    val remainingSeconds = seconds % 60
    return "%02d:%02d".format(minutes, remainingSeconds)
}
```

## 4. 实战：构建音乐播放器 UI

### 4.1 主界面布局

```kotlin
@Composable
fun MusicPlayerScreen(
    viewModel: PlayerViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    CarMusicTheme {
        Scaffold { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // 专辑封面
                AlbumCover(
                    uri = uiState.currentSong?.albumArtUri,
                    modifier = Modifier.size(300.dp)
                )
                
                Spacer(modifier = Modifier.height(24.dp))
                
                // 歌曲信息
                SongInfo(
                    title = uiState.currentSong?.title ?: "未知歌曲",
                    artist = uiState.currentSong?.artist ?: "未知艺术家"
                )
                
                Spacer(modifier = Modifier.height(32.dp))
                
                // 进度条
                ProgressBar(
                    progress = uiState.progress,
                    duration = uiState.duration,
                    onSeek = { viewModel.seekTo(it) }
                )
                
                Spacer(modifier = Modifier.height(32.dp))
                
                // 控制按钮
                PlayerControls(
                    isPlaying = uiState.isPlaying,
                    onPlayPause = { viewModel.togglePlayPause() },
                    onPrevious = { viewModel.previousSong() },
                    onNext = { viewModel.nextSong() }
                )
            }
        }
    }
}
```

### 4.2 歌曲列表界面

```kotlin
@Composable
fun SongListScreen(
    viewModel: PlayerViewModel = viewModel(),
    onNavigateToPlayer: () -> Unit
) {
    val songs by viewModel.songs.collectAsState()
    
    CarMusicTheme {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text("音乐库") },
                    actions = {
                        IconButton(onClick = { /* 搜索 */ }) {
                            Icon(Icons.Default.Search, "Search")
                        }
                    }
                )
            }
        ) { paddingValues ->
            SongList(
                songs = songs,
                onSongClick = { song ->
                    viewModel.playSong(song)
                    onNavigateToPlayer()
                },
                modifier = Modifier.padding(paddingValues)
            )
        }
    }
}
```

## 5. 本章小结

本章我们学习了：
- ✅ Jetpack Compose 基础（Composable、状态、布局）
- ✅ Compose Automotive 特性（车载主题、驾驶模式、大字体）
- ✅ 常用车载 UI 组件（列表、卡片、按钮、进度条）
- ✅ 音乐播放器 UI 原型

**下章预告**

Part 4 将完成完整的车载音乐播放器实战项目。

## 延伸阅读

- [Jetpack Compose 官方文档](https://developer.android.com/jetpack/compose)
- [Compose for Automotive](https://developer.android.com/jetpack/compose/automotive)
- [Material Design 3](https://m3.material.io/)
```

- [ ] **Step 2: 创建配图目录**

```bash
mkdir -p /home/gem/project/blog/posts/Android-IVI-Part-3-Jetpack-Compose-Automotive实战
```

- [ ] **Step 3: 验证文件创建**

```bash
ls -la /home/gem/project/blog/posts/Android-IVI-Part-3-Jetpack-Compose-Automotive实战.md
ls -la /home/gem/project/blog/posts/Android-IVI-Part-3-Jetpack-Compose-Automotive实战/
```

Expected: 文件和目录存在

- [ ] **Step 4: Commit**

```bash
git add posts/Android-IVI-Part-3-Jetpack-Compose-Automotive实战.md
git add posts/Android-IVI-Part-3-Jetpack-Compose-Automotive实战/
git commit -m "docs: 添加Android IVI开发Part 3文章"
```

---

### Task 4: 创建Part 4文章目录和配图目录

**Files:**
- Create: `posts/Android-IVI-Part-4-车载音乐播放器实战项目.md`
- Create: `posts/Android-IVI-Part-4-车载音乐播放器实战项目/` (配图目录)

**Interfaces:**
- Consumes: Part 3 文章
- Produces: Part 4 文章和配图目录

- [ ] **Step 1: 创建文章文件**

```markdown
---
title: Android IVI 开发 Part 4：车载音乐播放器实战项目
description: 从零开始构建一个完整的车载音乐播放器应用，包括架构设计、核心功能实现和车载特性集成
category: Android
tags: [Android, IVI, 车载, Kotlin, Jetpack Compose]
recommend: true
date: 2026-07-10
series:
  - id: series-android-ivi
    name: Android IVI 开发从零基础到实战
    order: 4
    prev: /posts/Android-IVI-Part-3-Jetpack-Compose-Automotive实战
    next:
---

# Android IVI 开发 Part 4：车载音乐播放器实战项目

## 前言

欢迎来到本系列的最终章！在前三章中，我们学习了 Kotlin 基础、Android Automotive OS 架构和 Jetpack Compose Automotive。现在，让我们将这些知识融会贯通，构建一个完整的车载音乐播放器应用。

**本章目标**

- 设计并实现 MVVM 架构
- 实现本地音乐扫描与播放
- 集成车载特性（方向盘控制、MediaSession）
- 完成测试与部署

## 1. 项目架构设计

### 1.1 MVVM 架构

```
┌─────────────────────────────────────┐
│              UI 层                   │
│    Composable Screens & Components   │
├─────────────────────────────────────┤
│           ViewModel 层               │
│    PlayerViewModel, SongViewModel    │
├─────────────────────────────────────┤
│          Repository 层               │
│    SongRepository, MediaRepository   │
├─────────────────────────────────────┤
│           数据源层                   │
│    LocalDatabase, MediaStore API     │
└─────────────────────────────────────┘
```

### 1.2 数据模型

```kotlin
// data/model/Song.kt
data class Song(
    val id: Long,
    val title: String,
    val artist: String,
    val album: String,
    val duration: Long, // 毫秒
    val path: String,
    val albumArtUri: String? = null
)

// data/model/PlayerState.kt
data class PlayerState(
    val isPlaying: Boolean = false,
    val currentSong: Song? = null,
    val progress: Float = 0f,
    val duration: Long = 0L,
    val playlist: List<Song> = emptyList(),
    val currentIndex: Int = 0
)
```

## 2. 核心功能实现

### 2.1 本地音乐扫描

```kotlin
// data/repository/SongRepository.kt
class SongRepository(private val context: Context) {
    
    fun scanLocalMusic(): Flow<List<Song>> = flow {
        val songs = mutableListOf<Song>()
        
        val projection = arrayOf(
            MediaStore.Audio.Media._ID,
            MediaStore.Audio.Media.TITLE,
            MediaStore.Audio.Media.ARTIST,
            MediaStore.Audio.Media.ALBUM,
            MediaStore.Audio.Media.DURATION,
            MediaStore.Audio.Media.DATA
        )
        
        val selection = "${MediaStore.Audio.Media.IS_MUSIC} != 0"
        
        context.contentResolver.query(
            MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
            projection,
            selection,
            null,
            "${MediaStore.Audio.Media.TITLE} ASC"
        )?.use { cursor ->
            while (cursor.moveToNext()) {
                val song = Song(
                    id = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)),
                    title = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)),
                    artist = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)),
                    album = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)),
                    duration = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)),
                    path = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA))
                )
                songs.add(song)
            }
        }
        
        emit(songs)
    }
}
```

### 2.2 音频播放

```kotlin
// data/repository/MediaRepository.kt
class MediaRepository(private val context: Context) {
    private var mediaPlayer: MediaPlayer? = null
    private val _playerState = MutableStateFlow(PlayerState())
    val playerState: StateFlow<PlayerState> = _playerState.asStateFlow()
    
    fun playSong(song: Song) {
        mediaPlayer?.release()
        
        mediaPlayer = MediaPlayer().apply {
            setDataSource(song.path)
            prepare()
            start()
            
            setOnCompletionListener {
                playNext()
            }
        }
        
        _playerState.update { it.copy(
            isPlaying = true,
            currentSong = song,
            duration = song.duration
        ) }
        
        startProgressUpdate()
    }
    
    fun togglePlayPause() {
        mediaPlayer?.let { player ->
            if (player.isPlaying) {
                player.pause()
                _playerState.update { it.copy(isPlaying = false) }
            } else {
                player.start()
                _playerState.update { it.copy(isPlaying = true) }
                startProgressUpdate()
            }
        }
    }
    
    fun seekTo(position: Float) {
        mediaPlayer?.let { player ->
            val newPosition = (position * player.duration).toInt()
            player.seekTo(newPosition)
        }
    }
    
    fun playNext() {
        val currentIndex = _playerState.value.currentIndex
        val playlist = _playerState.value.playlist
        
        if (currentIndex < playlist.size - 1) {
            val nextSong = playlist[currentIndex + 1]
            _playerState.update { it.copy(currentIndex = currentIndex + 1) }
            playSong(nextSong)
        }
    }
    
    fun playPrevious() {
        val currentIndex = _playerState.value.currentIndex
        
        if (currentIndex > 0) {
            val previousSong = _playerState.value.playlist[currentIndex - 1]
            _playerState.update { it.copy(currentIndex = currentIndex - 1) }
            playSong(previousSong)
        }
    }
    
    private fun startProgressUpdate() {
        // 使用协程定期更新进度
        viewModelScope.launch {
            while (mediaPlayer?.isPlaying == true) {
                mediaPlayer?.let { player ->
                    val progress = player.currentPosition.toFloat() / player.duration
                    _playerState.update { it.copy(progress = progress) }
                }
                delay(1000) // 每秒更新一次
            }
        }
    }
}
```

### 2.3 ViewModel

```kotlin
// viewmodel/PlayerViewModel.kt
class PlayerViewModel(
    private val songRepository: SongRepository,
    private val mediaRepository: MediaRepository
) : ViewModel() {
    
    val playerState = mediaRepository.playerState
    val songs = MutableStateFlow<List<Song>>(emptyList())
    
    init {
        // 扫描本地音乐
        viewModelScope.launch {
            songRepository.scanLocalMusic().collect { songList ->
                songs.value = songList
                mediaRepository.setPlaylist(songList)
            }
        }
    }
    
    fun playSong(song: Song) {
        mediaRepository.playSong(song)
    }
    
    fun togglePlayPause() {
        mediaRepository.togglePlayPause()
    }
    
    fun seekTo(position: Float) {
        mediaRepository.seekTo(position)
    }
    
    fun nextSong() {
        mediaRepository.playNext()
    }
    
    fun previousSong() {
        mediaRepository.playPrevious()
    }
}
```

## 3. 车载特性集成

### 3.1 MediaSession 集成

```kotlin
// service/MediaPlaybackService.kt
class MediaPlaybackService : MediaBrowserServiceCompat() {
    
    private lateinit var mediaSession: MediaSessionCompat
    private lateinit var mediaPlayer: MediaPlayer
    
    override fun onCreate() {
        super.onCreate()
        
        mediaSession = MediaSessionCompat(this, "CarMusicPlayer").apply {
            setCallback(MediaSessionCallback())
            setSessionToken(sessionToken)
        }
    }
    
    inner class MediaSessionCallback : MediaSessionCompat.Callback() {
        override fun onPlay() {
            mediaPlayer.start()
            updatePlaybackState(PlaybackStateCompat.STATE_PLAYING)
        }
        
        override fun onPause() {
            mediaPlayer.pause()
            updatePlaybackState(PlaybackStateCompat.STATE_PAUSED)
        }
        
        override fun onSkipToNext() {
            // 播放下一首
            playNextSong()
        }
        
        override fun onSkipToPrevious() {
            // 播放上一首
            playPreviousSong()
        }
        
        override fun onSeekTo(pos: Long) {
            mediaPlayer.seekTo(pos.toInt())
        }
    }
    
    private fun updatePlaybackState(state: Int) {
        val playbackState = PlaybackStateCompat.Builder()
            .setState(state, mediaPlayer.currentPosition.toLong(), 1.0f)
            .setActions(
                PlaybackStateCompat.ACTION_PLAY |
                PlaybackStateCompat.ACTION_PAUSE |
                PlaybackStateCompat.ACTION_SKIP_TO_NEXT |
                PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS
            )
            .build()
        
        mediaSession.setPlaybackState(playbackState)
    }
}
```

### 3.2 方向盘按键控制

```kotlin
// ui/components/MediaKeyHandler.kt
@Composable
fun MediaKeyHandler(
    onPlayPause: () -> Unit,
    onNext: () -> Unit,
    onPrevious: () -> Unit
) {
    val context = LocalContext.current
    
    DisposableEffect(Unit) {
        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        
        val mediaButtonReceiver = ComponentName(context, MediaButtonReceiver::class.java)
        audioManager.registerMediaButtonEventReceiver(mediaButtonReceiver)
        
        onDispose {
            audioManager.unregisterMediaButtonEventReceiver(mediaButtonReceiver)
        }
    }
}

// BroadcastReceiver
class MediaButtonReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (Intent.ACTION_MEDIA_BUTTON == intent.action) {
            val keyEvent = intent.getParcelableExtra<KeyEvent>(Intent.EXTRA_KEY_EVENT)
            
            when (keyEvent?.keyCode) {
                KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE -> {
                    // 发送播放/暂停命令
                }
                KeyEvent.KEYCODE_MEDIA_NEXT -> {
                    // 发送下一首命令
                }
                KeyEvent.KEYCODE_MEDIA_PREVIOUS -> {
                    // 发送上一首命令
                }
            }
        }
    }
}
```

### 3.3 驾驶模式适配

```kotlin
// ui/components/DrivingModeDetector.kt
@Composable
fun DrivingModeDetector(
    content: @Composable (isDriving: Boolean) -> Unit
) {
    var isDriving by remember { mutableStateOf(false) }
    val context = LocalContext.current
    
    DisposableEffect(Unit) {
        val car = Car.createCar(context)
        val sensorManager = car.getCarManager(Car.SENSOR_SERVICE) as CarSensorManager
        
        val listener = object : CarSensorManager.OnSensorChangedListener {
            override fun onSensorChanged(event: CarSensorEvent) {
                when (event.sensorType) {
                    CarSensorManager.SENSOR_TYPE_CAR_SPEED -> {
                        val speed = event.floatValues[0]
                        isDriving = speed > 0
                    }
                }
            }
        }
        
        sensorManager.registerListener(
            listener,
            CarSensorManager.SENSOR_TYPE_CAR_SPEED,
            CarSensorManager.SENSOR_RATE_NORMAL
        )
        
        onDispose {
            sensorManager.unregisterListener(listener)
            car.disconnect()
        }
    }
    
    content(isDriving)
}

// 使用示例
@Composable
fun SafePlayerScreen() {
    DrivingModeDetector { isDriving ->
        if (isDriving) {
            SimplifiedPlayerUI()
        } else {
            FullPlayerUI()
        }
    }
}
```

## 4. 测试与部署

### 4.1 单元测试

```kotlin
// test/PlayerViewModelTest.kt
class PlayerViewModelTest {
    
    private lateinit var viewModel: PlayerViewModel
    private lateinit var songRepository: SongRepository
    private lateinit var mediaRepository: MediaRepository
    
    @Before
    fun setup() {
        songRepository = mock(SongRepository::class.java)
        mediaRepository = mock(MediaRepository::class.java)
        viewModel = PlayerViewModel(songRepository, mediaRepository)
    }
    
    @Test
    fun `playSong should update player state`() = runTest {
        // Given
        val song = Song(1, "Test Song", "Artist", "Album", 300000, "/path")
        
        // When
        viewModel.playSong(song)
        
        // Then
        verify(mediaRepository).playSong(song)
    }
    
    @Test
    fun `togglePlayPause should call repository`() = runTest {
        // When
        viewModel.togglePlayPause()
        
        // Then
        verify(mediaRepository).togglePlayPause()
    }
}
```

### 4.2 模拟器测试

1. 启动 Automotive 模拟器
2. 安装应用：`adb install app-debug.apk`
3. 验证功能：
   - 音乐扫描是否正常
   - 播放/暂停是否响应
   - 进度条是否更新
   - 方向盘按键是否生效

### 4.3 真车测试注意事项

- **安全优先**：测试时确保车辆静止
- **权限申请**：确保所有车载权限已授权
- **性能监控**：注意内存和 CPU 使用
- **兼容性**：测试不同车型的兼容性

## 5. 项目总结与扩展

### 5.1 代码回顾

本项目实现了：
- ✅ MVVM 架构
- ✅ 本地音乐扫描
- ✅ 音频播放控制
- ✅ MediaSession 集成
- ✅ 方向盘按键控制
- ✅ 驾驶模式适配

### 5.2 性能优化建议

1. **图片加载**：使用 Coil 库异步加载专辑封面
2. **数据库**：使用 Room 缓存音乐元数据
3. **后台播放**：使用 Foreground Service 保持播放
4. **电量优化**：合理控制后台更新频率

### 5.3 扩展功能

- 🎵 在线音乐（集成网易云音乐、QQ音乐 API）
- 🎙️ 语音控制（集成 Google Assistant）
- 📻 电台功能（网络电台、FM/AM）
- 🎨 主题切换（深色/浅色模式）
- 📊 音乐统计（播放时长、最爱歌曲）

## 6. 本章小结

恭喜你完成了 Android IVI 开发系列教程！🎉

**你学到了**
- ✅ Kotlin 编程语言
- ✅ Android Automotive OS 架构
- ✅ Jetpack Compose Automotive
- ✅ 车载应用开发最佳实践
- ✅ 完整项目实战经验

**下一步**

- 尝试添加更多功能（在线音乐、语音控制）
- 学习更多车载 API（导航、电话）
- 参与开源项目，贡献代码

## 延伸阅读

- [Android Automotive OS 开发指南](https://developer.android.com/training/cars)
- [MediaSession API](https://developer.android.com/reference/android/media/session/MediaSession)
- [Car API 参考](https://developer.android.com/reference/android/car/package-summary)
- [Jetpack Compose 性能优化](https://developer.android.com/jetpack/compose/performance)
```

- [ ] **Step 2: 创建配图目录**

```bash
mkdir -p /home/gem/project/blog/posts/Android-IVI-Part-4-车载音乐播放器实战项目
```

- [ ] **Step 3: 验证文件创建**

```bash
ls -la /home/gem/project/blog/posts/Android-IVI-Part-4-车载音乐播放器实战项目.md
ls -la /home/gem/project/blog/posts/Android-IVI-Part-4-车载音乐播放器实战项目/
```

Expected: 文件和目录存在

- [ ] **Step 4: Commit**

```bash
git add posts/Android-IVI-Part-4-车载音乐播放器实战项目.md
git add posts/Android-IVI-Part-4-车载音乐播放器实战项目/
git commit -m "docs: 添加Android IVI开发Part 4文章"
```

---

### Task 5: 验证系列完整性

**Files:**
- Verify: `posts/Android-IVI-Part-1-环境搭建与Kotlin基础.md`
- Verify: `posts/Android-IVI-Part-2-Android-Automotive-OS与IVI架构.md`
- Verify: `posts/Android-IVI-Part-3-Jetpack-Compose-Automotive实战.md`
- Verify: `posts/Android-IVI-Part-4-车载音乐播放器实战项目.md`

**Interfaces:**
- Consumes: 所有Part文章
- Produces: 验证报告

- [ ] **Step 1: 验证所有文件存在**

```bash
for i in 1 2 3 4; do
  echo "Part $i:"
  ls -la /home/gem/project/blog/posts/Android-IVI-Part-$i-*.md
  echo
done
```

Expected: 4个文件都存在

- [ ] **Step 2: 验证系列frontmatter**

```bash
for i in 1 2 3 4; do
  echo "Part $i series:"
  grep -A 5 "series:" /home/gem/project/blog/posts/Android-IVI-Part-$i-*.md | head -10
  echo
done
```

Expected: 所有文件都有正确的series frontmatter

- [ ] **Step 3: 验证系列顺序**

```bash
grep "order:" /home/gem/project/blog/posts/Android-IVI-Part-*.md
```

Expected: order: 1, 2, 3, 4

- [ ] **Step 4: 最终Commit**

```bash
git add posts/Android-IVI-Part-*
git commit -m "docs: 完成Android IVI开发4篇连载教程"
```

---

*Plan self-review: 所有4篇Part文章都有完整的frontmatter、系列关系、内容大纲。无TBD/TODO。*
