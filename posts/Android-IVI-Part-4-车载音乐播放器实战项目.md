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

> 🤖 **AI 辅助开发 Tip**
>
> **AI 辅助方式**：在 Claude Code 中描述 "我要设计一个车载音乐播放器的 MVVM 架构，包含歌曲扫描、播放控制、播放列表管理功能"，AI 会生成完整的项目结构图和各层代码框架，包括 Repository 接口定义、ViewModel 基类、UI 状态封装等。遇到架构设计疑问（如 "这个业务逻辑应该放在 ViewModel 还是 Repository 中？"），AI 会结合 MVVM 的设计原则和车载场景的特殊性给出建议。对于数据流设计，让 AI "用 Kotlin Flow 实现从本地扫描到 UI 更新的完整数据流，包含错误处理和加载状态"，AI 会生成包含 `StateFlow`、`SharedFlow`、`catch`、`onStart` 等操作符的健壮实现。
>
> **进阶技巧**：让 AI "为这套架构生成 UML 类图"，AI 会输出 PlantUML 或 Mermaid 格式的图表代码，你可以在支持这些格式的工具中渲染查看。你还可以要求 AI "分析这个架构的优缺点，提出改进建议"，AI 会从可测试性、可维护性、性能等角度给出专业评估，帮助你不断优化设计。

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

> 🤖 **AI 辅助开发 Tip**
>
> **AI 辅助方式**：在 Claude Code 中描述 "帮我写一个扫描本地音乐的 Repository，使用 MediaStore API，要处理权限申请、空列表、排序等场景"，AI 会生成包含权限检查、空值处理、异常捕获的完整 `SongRepository` 实现。对于 MediaPlayer 封装，让 AI "创建一个状态安全的 MediaPlayer 封装类，使用 StateFlow 暴露播放状态，自动处理进度更新和播放完成后的下一首切换"，AI 会生成基于状态机模式的 `MediaRepository`，确保所有 MediaPlayer 操作都在合法状态下执行。
>
> **进阶技巧**：遇到 MediaPlayer 相关的崩溃（如 `IllegalStateException`），将完整的错误堆栈和触发场景描述给 AI，它能快速定位是状态机转换错误还是线程安全问题。你还可以让 AI "将这段基于回调的 MediaPlayer 代码改为使用 Kotlin Flow 的响应式风格"，AI 会将 `OnCompletionListener`、`OnPreparedListener` 等回调转换为 `callbackFlow` 或 `channelFlow`，让播放状态的变化以更现代化的方式被 UI 层消费。这对于与 Compose 的 `collectAsState` 配合尤为重要。

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

> 🤖 **AI 辅助开发 Tip**
>
> **AI 辅助方式**：在 Claude Code 中描述 "创建一个完整的 MediaSession 服务，支持播放、暂停、上一首、下一首、进度跳转，要处理前台服务通知和蓝牙控制"，AI 会生成包含 `MediaBrowserServiceCompat` 实现、`MediaSessionCompat` 初始化、回调处理、通知管理的完整代码。对于方向盘按键，让 AI "处理 MediaButton 事件，支持播放/暂停和切歌，兼容 Android 8.0 以下的设备"，AI 会生成包含版本判断和降级方案的代码。遇到 Car API 相关崩溃（如 `CarNotConnectedException`），直接粘贴异常信息，AI 会建议添加 try-catch 和重试机制。
>
> **进阶技巧**：让 AI "为 MediaSession 服务生成单元测试，使用 Mockito 模拟 MediaPlayer 和 Car API"，AI 会生成包含依赖注入、模拟对象配置、回调验证的完整测试代码。你还可以要求 AI "将方向盘按键处理改为使用 Android 的 MediaSession 回调（onMediaButtonEvent）而不是 BroadcastReceiver"，AI 会展示更现代化的实现方式，减少 BroadcastReceiver 的注册/注销开销。对于驾驶模式检测，让 AI "用 Kotlin Flow 封装车速传感器数据，在 Compose 中通过 collectAsState 订阅"，AI 会生成响应式的传感器数据流，替代回调式代码。

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

> 🤖 **AI 辅助开发 Tip**
>
> **AI 辅助方式**：在 Claude Code 中描述 "为 PlayerViewModel 编写单元测试，使用 Mockito 和 kotlinx-coroutines-test，覆盖播放、暂停、切歌场景"，AI 会生成包含正确 import、TestDispatcher 配置、Given-When-Then 结构的完整测试代码。遇到 Mockito 和 Kotlin 的兼容性问题（如 "Mockito cannot mock/spy final class"），AI 会建议使用 `mockk` 替代 Mockito，或添加 `mockito-inline` 依赖和 `org.mockito.mock.mock-maker` 配置文件。对于 UI 测试，让 AI "用 Jetpack Compose 的 ComposeTestRule 编写播放器界面的 UI 测试，验证按钮点击和状态显示"，AI 会生成使用 `createComposeRule`、`onNodeWithText`、`performClick`、`assertIsDisplayed` 等 API 的现代 UI 测试代码。
>
> **进阶技巧**：让 AI "为这个项目生成完整的测试策略文档，包括单元测试覆盖率目标、集成测试范围、UI 测试优先级"，AI 会从测试金字塔的角度给出专业建议，帮助你合理分配测试资源。你还可以要求 AI "分析这段测试代码的可维护性问题，提出改进建议"，AI 会识别出硬编码的测试数据、重复的 setup 逻辑、过于脆弱的断言等问题，并建议使用 `@Before` 提取公共逻辑、使用工厂方法生成测试数据、使用 Hamcrest 或 AssertJ 的语义化断言。这对于长期维护的车载项目尤为重要。

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

> 🤖 **AI 辅助开发 Tip**
>
> **系列回顾**：恭喜你完成了 Android IVI 开发系列教程！在整个学习过程中，AI 辅助开发贯穿始终。现在，让我们用 AI 来规划下一步：
>
> 1. **功能扩展**：向 AI 描述 "我想为音乐播放器添加歌词同步显示功能，歌词文件是 LRC 格式，请帮我设计实现方案"，AI 会生成包含 LRC 解析、时间轴匹配、逐字高亮等完整实现。对于在线音乐功能，让 AI "设计一个支持网易云音乐和 QQ 音乐 API 的播放源切换架构，使用策略模式"，AI 会生成模块化的代码结构。
> 2. **性能优化**：将你的项目代码提供给 AI，让它 "分析这个车载音乐播放器的性能瓶颈，提出优化建议"，AI 会从内存使用、CPU 占用、启动时间、电量消耗等角度给出专业分析，并生成优化前后的对比代码。
> 3. **代码生成**：让 AI "为这个项目生成完整的 README 文档，包含项目介绍、功能特性、架构图、安装步骤、贡献指南"，AI 会生成结构清晰、内容完整的文档，提升项目的专业度。
>
> **推荐 AI 工具**：本系列教程涉及的知识面较广，建议根据场景选择合适的 AI 工具：
> - **架构设计**：Claude Code（深度理解、长上下文、能处理复杂的设计权衡）
> - **代码编写**：GitHub Copilot / Cursor（实时代码补全、快速实现功能）
> - **代码审查**：Claude Code（全面的代码质量分析、安全漏洞检测）
> - **文档生成**：Claude Code（结构化的技术文档、API 文档生成）
> - **问题排查**：Claude Code + 搜索引擎（结合深度理解和实时信息，解决疑难问题）
>
> **持续学习**：AI 辅助开发不是替代学习，而是加速学习。在使用 AI 的过程中，务必理解 AI 生成的每一行代码，思考 "为什么这样设计"、"有没有更好的方案"。只有将 AI 的效率提升与自身的深度理解相结合，才能成为真正优秀的车载应用开发者。祝你在 Android IVI 开发的道路上越走越远！

## 延伸阅读

- [Android Automotive OS 开发指南](https://developer.android.com/training/cars)
- [MediaSession API](https://developer.android.com/reference/android/media/session/MediaSession)
- [Car API 参考](https://developer.android.com/reference/android/car/package-summary)
- [Jetpack Compose 性能优化](https://developer.android.com/jetpack/compose/performance)
