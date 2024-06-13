---
title: Android媒体库更新问题
toc: false
categories:
  - Android
tags:
  - Android
  - MediaProvider
abbrlink: dde550d4
date: 2019-09-21 00:00:00
---

> 这篇博文是从本人过去的 github pages 博客迁移过来，时间上会比较古老。

## 简介

Android 媒体库(MediaProvider)实际上是个 Provider。

**Android 4.4** 以后，当**系统启动完成**、**SD 卡插拔**或者**接收到 `Intent.ACTION_MEDIA_SCANNER_SCAN_FILE` 广播**时，系统会扫描文件系统中的数据，将新增和删除的文件信息更新到这个 MediaProvider 中。其他应用如果要使用，直接读取这个 MediaProvider 就可以直接取得系统中媒体文件的信息。

<!--more-->

## 背景

笔者遇到的问题是开发的拍照应用在拍照之后，MediaProvider 没有更新新增的照片文件，图库中也看不到新增的照片。

## 调查过程

从触发更新 MediaProvider 的条件来看，拍照之后应该发送广播`Intent.ACTION_MEDIA_SCANNER_SCAN_FILE`通知系统去更新 MediaProvider，而开发的相机应用没有进行这个动作。

笔者写了一个类用来发送`Intent.ACTION_MEDIA_SCANNER_SCAN_FILE`广播：

```java
public class MediaUtils {
    private static final String TAG = "MediaUtils";
    private static MediaUtils sInstance;
    private Context mContext;

    public static synchronized MediaUtils getInstance() {
        Log.d(TAG, "getInstance()");
        if (sInstance == null) {
            sInstance = new MediaUtils();
        }
        return sInstance;
    }

    private MediaUtils() {}

    /**
     * set Context: send BroadCast need a Context.
     * @param context context
     */
    public void setContext(@NonNull Context context) {
        Log.d(TAG, "setContext()");
        mContext = context;
    }

    /**
     * update Media.
     * @param filePath path of updated file
     */
    public void updateMedia(@NonNull String filePath) {
        Log.d(TAG, "updateMedia() filePath:" + filePath);
        Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        intent.setData(Uri.fromFile(new File(filePath)));
        mContext.sendBroadcast(intent);
    }
}
```

在拍照`Activity`取得`MediaUtils`的实例并调用`setContext`方法传入`Activity`本身。

在拍照之后取得 MediaUtils 的实例并调用`updateMedia`方法将新增照片的路径传入，相册里就可以显示新增的照片了。

## 结论

如果想要应用产生的图片或者视频被其他应用找到并使用，必须要发送`Intent.ACTION_MEDIA_SCANNER_SCAN_FILE`广播。
