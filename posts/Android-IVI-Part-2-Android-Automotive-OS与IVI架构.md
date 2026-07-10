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
