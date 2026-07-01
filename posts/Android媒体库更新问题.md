---
title: Android媒体库更新问题
description: Android MediaProvider 媒体库更新机制解析，系统扫描时机、触发条件和常见问题排查
category: Android
tags: [Android, MediaProvider]
date: 2019-09-21
---

# Android媒体库更新问题
> 这篇博文是从本人过去的 github pages 博客迁移过来，时间上会比较古老。

## 简介

Android 媒体库（MediaProvider）说到底就是一个 Provider。

**Android 4.4** 之后，遇到这几种情况——**系统启动完成**、**SD 卡插拔**，或者收到 **`Intent.ACTION_MEDIA_SCANNER_SCAN_FILE` 广播**——系统就会扫一遍文件系统，把新增和删除的文件信息同步进这个 MediaProvider。别的应用要用到媒体文件，直接读它就行，不必自己去翻目录。



## 背景

事情起因是这样：我做的拍照应用，拍完照之后 MediaProvider 没把新照片收进去，图库里自然也看不到。

## 调查过程

对照一下触发 MediaProvider 更新的那几个条件，拍照之后应该主动发一条 `Intent.ACTION_MEDIA_SCANNER_SCAN_FILE` 广播，通知系统去更新。而我的相机应用恰恰漏了这一步。

于是我写了个类，专门负责发这条广播：

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

在拍照 `Activity` 里拿到 `MediaUtils` 实例，调 `setContext` 把 Activity 自己传进去。

拍完照之后再取一次实例，调 `updateMedia` 把新照片的路径喂给它，相册里就能看到这张照片了。

## 结论

一句话：想让应用产生的图片或视频被别的应用找到、用上，就得主动发 `Intent.ACTION_MEDIA_SCANNER_SCAN_FILE` 这条广播。
