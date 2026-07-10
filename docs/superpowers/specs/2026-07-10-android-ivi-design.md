# Android IVI 开发从零基础到实战（Kotlin + Jetpack Compose Automotive）

## 定位

- **目标读者**：零基础，无编程经验
- **文章类型**：连载教程（4篇）
- **技术栈**：Kotlin + Jetpack Compose Automotive + Android Automotive OS
- **实战项目**：车载音乐播放器
- **目的**：让零基础读者能够独立开发 Android IVI 应用

## 核心原则

- **循序渐进**：从环境搭建到实战项目，每篇建立在前一篇基础上
- **实践导向**：每篇都有可运行的代码示例
- **车载场景**：始终围绕 IVI（车载信息娱乐系统）场景展开
- **最新技术栈**：使用 Jetpack Compose Automotive 和最新 Android Automotive OS API

## 内容结构

### Part 1：环境搭建与 Kotlin 基础

**目标**：搭建开发环境，掌握 Kotlin 基础语法

**内容**：
1. 开发环境搭建
   - 安装 Android Studio
   - 配置 Android Automotive OS 模拟器
   - 创建第一个 IVI 项目
2. Kotlin 基础语法
   - 变量、常量、数据类型
   - 函数定义与调用
   - 条件语句与循环
   - 类与对象基础
3. Kotlin 进阶特性
   - 空安全（Null Safety）
   - 扩展函数
   - Lambda 表达式
   - 集合操作
4. 第一个 Kotlin 程序
   - Hello World in IVI
   - 在模拟器上运行

### Part 2：Android Automotive OS 与 IVI 架构

**目标**：理解 Android Automotive OS 架构和 IVI 核心概念

**内容**：
1. Android Automotive OS 概述
   - 与 Android 手机的区别
   - 车载系统架构（HAL、Car Service、应用层）
   - 安全与权限模型
2. IVI 核心概念
   - 车载 UI 设计原则（驾驶安全、大字体、触摸优化）
   - 车载应用生命周期
   - 多屏幕与分屏处理
3. Car API 介绍
   - Car 对象获取
   - 车辆属性读取（车速、油量等）
   - 车载媒体控制
4. 创建 IVI 项目模板
   - 项目结构
   - 模块划分
   - 依赖配置

### Part 3：Jetpack Compose Automotive 实战

**目标**：掌握 Jetpack Compose Automotive 开发车载 UI

**内容**：
1. Jetpack Compose 基础
   - Composable 函数
   - 状态管理（remember、mutableStateOf）
   - 布局（Column、Row、Box）
   - 主题与样式
2. Compose Automotive 特性
   - 车载主题（CarTheme）
   - 驾驶模式适配
   - 大字体与高对比度支持
   - 触摸目标大小优化
3. 常用车载 UI 组件
   - 列表与卡片（歌曲列表、专辑封面）
   - 按钮与开关（播放/暂停、音量）
   - 进度条与滑块（播放进度、音量）
   - 导航栏与标签页
4. 实战：构建音乐播放器 UI
   - 主界面布局
   - 播放控制界面
   - 歌曲列表界面

### Part 4：车载音乐播放器实战项目

**目标**：完成一个完整的车载音乐播放器应用

**内容**：
1. 项目架构设计
   - MVVM 架构
   - 数据层（Repository、本地音乐扫描）
   - UI 层（ViewModel + Compose）
2. 核心功能实现
   - 本地音乐扫描与索引
   - 音频播放（MediaPlayer/ExoPlayer）
   - 播放控制（播放/暂停/上一首/下一首）
   - 专辑封面显示
3. 车载特性集成
   - 方向盘按键控制
   - 车载媒体会话（MediaSession）
   - 驾驶模式适配（行驶中限制操作）
4. 测试与部署
   - 单元测试
   - 模拟器测试
   - 真车测试注意事项
5. 项目总结与扩展
   - 代码回顾
   - 性能优化建议
   - 扩展功能（在线音乐、语音控制）

## 系列关系

- **系列 ID**: `series-android-ivi`
- **系列名称**: Android IVI 开发从零基础到实战
- **文章数量**: 4篇
- **顺序**：
  1. Part 1: 环境搭建与 Kotlin 基础
  2. Part 2: Android Automotive OS 与 IVI 架构
  3. Part 3: Jetpack Compose Automotive 实战
  4. Part 4: 车载音乐播放器实战项目

## 元数据

```yaml
category: Android
tags: [Android, IVI, 车载, Kotlin, Jetpack Compose, Automotive]
recommend: true
date: 2026-07-10
series:
  - id: series-android-ivi
    name: Android IVI 开发从零基础到实战
```

## 配图规划

1. **Android Automotive OS 架构图**（SVG）：展示 HAL、Car Service、应用层关系
2. **IVI UI 设计规范图**（SVG）：车载界面设计原则示意
3. **Jetpack Compose Automotive 组件图**（SVG）：常用组件展示
4. **音乐播放器界面原型图**（SVG）：实战项目 UI 设计

---

*Spec self-review: 无 TBD/TODO，无矛盾，范围聚焦4篇连载教程，循序渐进，实战导向。*
