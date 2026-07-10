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
