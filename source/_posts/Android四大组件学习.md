---
title: Android四大组件学习
toc: true
categories:
  - Android
date: 2019-09-19 00:00:00
tags:
  - Android
---

> 这篇博文是从本人过去的 github pages 博客迁移过来，时间上会比较古老。

## 简介

Android 四大组件包括：

- Activity
- Serivce
- Content Provider
- Broadcast receiver

从四大组件来看，Google 把应用抽象成了**UI 逻辑**、**后台逻辑**、**持久化**和**应用间通讯**四个部分。

<!--more-->

## Activity

Activity 就是用户最能直观感受到的一个部分，负责 UI 的显示和 UI 的逻辑。

## Serivce

为了不阻塞前台 UI 的显示，应用大部分的后台逻辑都应该放到 Serivce 部分。

## Content Provider

Provider 是一种简化的数据持久层，可以被多个应用访问。

## Broadcast receiver

Broadcast receiver 是广播的接受者，可以接受系统广播，也可以接受指定应用的自定义广播。

广播是一种简单的进程间通讯的方式。
