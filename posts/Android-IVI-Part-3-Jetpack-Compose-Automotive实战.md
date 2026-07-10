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

> 🤖 **AI 辅助开发 Tip**
>
> **传统方式**：阅读 Jetpack Compose 官方文档，从基础 Composable 开始逐步学习。`remember`、`mutableStateOf`、`collectAsState` 等概念容易混淆，需要通过大量练习才能掌握状态在 Compose 中的流转规律。手动编写布局代码时，需要反复调整 Modifier 链的参数顺序和组合方式。
>
> **AI 辅助方式**：在 Claude Code 中描述你的 UI 需求（如 "创建一个带有计数器和按钮的 Compose 界面，点击按钮计数器加一"），AI 会生成包含正确状态管理方式的完整代码，并自动选择合适的 Composable（如 `Column`、`Button`、`Text`）和 Modifier 组合。遇到状态不更新的问题时，将代码片段粘贴给 AI 并描述现象，它能快速诊断出是 `remember` 还是 `mutableStateOf` 使用不当，或者是否遗漏了 `by` 委托关键字。
>
> **进阶技巧**：让 AI "将这段传统 Android View 的 XML 布局转换为 Jetpack Compose 代码"，AI 会自动识别 `LinearLayout` → `Column`/`Row`、`RecyclerView` → `LazyColumn`、`TextView` → `Text` 等对应关系，并生成符合 Compose 最佳实践的代码。你还可以要求 AI "为这段 Compose 代码添加预览函数"，AI 会自动生成 `@Preview` 注解和合适的预览参数，让你在 Android Studio 的 Preview 面板中实时查看 UI 效果，无需反复编译运行。

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

> 🤖 **AI 辅助开发 Tip**
>
> **传统方式**：手动定义车载主题颜色，逐一调整每个 Composable 的字体大小和对比度。驾驶模式的 UI 适配需要维护两套几乎相同的布局代码，容易因修改不同步导致显示不一致。手动编写大字体样式时，容易遗漏 Material Design 的 Typography Scale 规范。
>
> **AI 辅助方式**：在 Claude Code 中定义设计需求 "创建一个符合 Material Design 3 规范的车载深色主题，主色调为蓝色，确保所有文字在车载屏幕上的可读性"。AI 会生成完整的 `Color.kt`、`Type.kt`、`Theme.kt` 文件，包含符合规范的颜色定义、字体比例和主题配置。对于驾驶模式适配，让 AI "用 Compose 的状态管理实现驾驶模式检测，驾驶时隐藏复杂 UI，只显示简化的播放控制"，AI 会生成基于 `derivedStateOf` 或自定义 `CompositionLocal` 的优雅实现，避免重复代码。
>
> **进阶技巧**：将设计稿截图或描述提供给 AI（如 "设计一个音乐播放器界面，包含专辑封面、歌曲信息、进度条和控制按钮"），AI 可以直接生成接近设计稿的 Compose 代码，包括合适的间距、圆角、阴影和动画效果。你还可以让 AI "为这套 UI 组件生成 Accessibility 测试用例"，确保所有按钮都有正确的 `contentDescription`，所有文字都有足够的对比度，满足车载场景下的无障碍访问需求。

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

> 🤖 **AI 辅助开发 Tip**
>
> **传统方式**：手动编写列表、卡片、按钮等基础组件，反复调整 Modifier 参数以达到理想效果。`LazyColumn` 的 `items` 函数和 `Card` 的 `elevation` 参数容易记错。编写进度条和时间格式化函数时，需要手动处理毫秒到分钟的转换逻辑，容易在边界情况（如进度为 0、时长小于 1 分钟）出错。
>
> **AI 辅助方式**：在 Claude Code 中描述 "创建一个车载音乐播放器的歌曲列表，每首歌显示专辑封面、歌曲名和歌手，点击后播放"，AI 会生成包含 `LazyColumn`、`Card`、`Row`、`AsyncImage`（Coil）的完整代码，并自动处理图片加载失败、列表为空等边界情况。对于时间格式化，直接让 AI "写一个将毫秒转换为 mm:ss 格式的函数，要处理负数、超大值等异常输入"，AI 会生成健壮的 `formatTime` 实现，包含输入校验和默认值处理。
>
> **进阶技巧**：让 AI "为这段 UI 代码生成 Preview 函数，展示列表有数据、列表为空、加载中三种状态"，AI 会自动创建多个 `@Preview` 函数，使用 `@PreviewParameter` 或硬编码的测试数据展示不同 UI 状态。你还可以要求 AI "优化这个 Composable 的性能，减少不必要的重组"，AI 会建议使用 `remember`、`derivedStateOf`、`key` 等 Compose 性能优化技巧，并解释每处优化的原理。这对于车载场景尤为重要，因为流畅的 UI 直接影响驾驶安全。

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

> 🤖 **AI 辅助开发 Tip**
>
> **本课回顾**：本章我们学习了 Jetpack Compose Automotive 的核心知识，为构建车载 UI 打下了基础。在继续下一章之前，可以用 AI 来巩固和扩展所学：
>
> 1. **UI 生成**：向 AI 描述你想要的界面（如 "一个带有专辑封面旋转动画、歌词滚动显示、频谱可视化效果的音乐播放器界面"），AI 会生成包含自定义动画、Canvas 绘制、状态联动等高级特性的 Compose 代码，让你见识 Compose 的强大能力。
> 2. **代码审查**：将本章的 Compose 代码粘贴给 AI，让它检查是否存在性能隐患（如 `Modifier` 链中不必要的对象创建、列表项缺少 `key`、状态提升不当等），并给出优化建议。
> 3. **跨平台对比**：让 AI "将这段 Jetpack Compose 代码转换为 SwiftUI 实现"，对比两种声明式 UI 框架的异同，加深对声明式编程范式的理解。
>
> **推荐 AI 工具**：本章涉及大量 UI 代码，强烈建议使用支持实时代码补全和预览的 AI 工具（如 Cursor、GitHub Copilot + Android Studio）。在编写 Compose 代码时，AI 能根据上下文自动补全 `Modifier` 链、推荐合适的 Composable、生成 Preview 函数。对于复杂的动画和自定义绘制，Claude Code 的深度理解和代码生成能力更能帮助你快速实现创意。

## 延伸阅读

- [Jetpack Compose 官方文档](https://developer.android.com/jetpack/compose)
- [Compose for Automotive](https://developer.android.com/jetpack/compose/automotive)
- [Material Design 3](https://m3.material.io/)
