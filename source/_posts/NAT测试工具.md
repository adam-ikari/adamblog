---
title: NAT测试工具
toc: false
categories:
  - 开源项目
date: 2025-04-14 20:34:44
keywords: NAT, STUN, Python, GUI
description: pystun3-gui是一个基于Python的NAT类型检测工具，提供图形界面，方便用户快速检测网络NAT类型。
tags:
  - Python
  - 网络工具
  - 开源项目
cover: 
---

## 前言

在网络应用开发中，了解当前网络的NAT类型对于P2P通信和网络连接性诊断非常重要。pystun3-gui项目提供了一个简单易用的图形界面工具，帮助用户快速检测NAT类型。

## 简介

pystun3-gui是一个基于Python开发的NAT类型检测工具，它是对pystun3库的图形界面封装。该工具具有以下特点：

1. 简洁的图形用户界面
2. 支持自定义STUN服务器
3. 可显示本地IP和公网IP信息
4. 多线程设计，避免界面卡顿
5. 跨平台支持（Windows/Linux/MacOS）

<!-- more -->

## 主要功能

### NAT类型检测
工具可以检测并显示以下信息：
- 本地IP地址
- 公网IP地址
- NAT类型（如Full Cone、Restricted Cone、Port Restricted Cone、Symmetric等）

### 自定义服务器
用户可以：
- 使用默认STUN服务器
- 输入自定义STUN服务器地址和端口
- 保存常用服务器配置

## 注

<div id="note1"></div>
[1] STUN（Session Traversal Utilities for NAT）是一种网络协议，用于发现NAT（Network Address Translation，网络地址转换）的存在并获取翻译后的公网IP地址。

## 参考

1. [pystun3-gui项目地址](https://github.com/chenzd123456/pystun3-gui)
2. [pystun3库文档](https://pypi.org/project/pystun3/)
3. [STUN协议 - RFC 3489](https://tools.ietf.org/html/rfc3489)
