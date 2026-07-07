---
title: Android四大组件学习
description: Android 四大组件（Activity、Service、BroadcastReceiver、ContentProvider）学习笔记与使用场景解析
category: Android
tags: [Android]
date: 2019-09-19
---

# Android四大组件学习
> 这篇博文是从本人过去的 github pages 博客迁移过来，时间上会比较古老。

![Android 四大组件](/posts/Android四大组件学习/android-four-components.svg)

## 简介

Android 四大组件包括：

- Activity
- Serivce
- Content Provider
- Broadcast receiver

这四个组件其实是 Google 把一个应用拆开的方式：UI 逻辑、后台逻辑、持久化、应用间通讯，各管一方面。理清这四个抽象，再看 Android 应用就不会觉得乱。



## Activity

Activity 是用户最能直观感受到的部分，UI 的显示和它背后的逻辑都归它管。

## Serivce

为了不把前台 UI 卡住，应用里那些要在后台跑的逻辑就交给 Service。

## Content Provider

Provider 是个简化版的数据持久层，特点是可以被多个应用访问。

## Broadcast receiver

Broadcast receiver 是广播的接收端，既能收系统广播，也能收指定应用发出的自定义广播。

说到底，广播本身是一种很轻量的进程间通讯方式。
