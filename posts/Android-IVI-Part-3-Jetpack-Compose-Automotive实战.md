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
