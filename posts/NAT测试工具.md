---
title: NAT测试工具
category: 开源项目
description: pystun3-gui是一个基于Python的NAT类型检测工具，提供图形界面，方便用户快速检测网络NAT类型。
tags: [Python, 网络工具, 开源项目]
date: 2025-04-14
---

# NAT测试工具
## 前言

做网络应用开发，搞清楚当前网络的 NAT 类型，对 P2P 通信和连通性诊断都挺关键。pystun3-gui 这个项目做的就是这件事——一个简单的图形界面工具，帮你快速测出 NAT 类型。

![NAT 四种类型与穿透难度](/posts/NAT测试工具/nat-types-and-traversal.svg)

## 简介

pystun3-gui 是基于 Python 的 NAT 类型检测工具，本质是对 pystun3 库做了一层图形界面封装。界面简洁，支持自定义 STUN 服务器，能同时显示本地 IP 和公网 IP；检测放在多线程里跑，界面不会卡；Windows、Linux、MacOS 都能用。



## 主要功能

### NAT类型检测
工具能检测并显示本地 IP 地址、公网 IP 地址，以及 NAT 类型（Full Cone、Restricted Cone、Port Restricted Cone、Symmetric 等）。

### 自定义服务器
服务器这块，既可以用默认的 STUN 服务器，也能自己填地址和端口，常用配置还能存下来下次直接用。

## 注

<div id="note1"></div>
[1] STUN（Session Traversal Utilities for NAT）是一种网络协议，用于发现NAT（Network Address Translation，网络地址转换）的存在并获取翻译后的公网IP地址。

## 参考

1. [pystun3-gui项目地址](https://github.com/chenzd123456/pystun3-gui)
2. [pystun3库文档](https://pypi.org/project/pystun3/)
3. [STUN协议 - RFC 3489](https://tools.ietf.org/html/rfc3489)
