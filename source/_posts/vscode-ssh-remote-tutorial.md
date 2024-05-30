---
title: VSCode SSH 远程开发教程
toc: true
categories:
  - tools
keywords:
  - VSCode
  - SSH Remote
tags:
  - Tools
  - VSCode
  - SSH Remote
abbrlink: c9c2d418
date: 2024-02-22 18:44:47
description:
cover:
---

<!--
注释的方法：
在正文需要注释的地方插入下面的代码，根据需要修改编号：
  <sup>[1](#note1)</sup>
在"注"章节插入对应编号的注释内容:
  <div id="note1"></div>
  [1] 这是注的内容
-->

## 前言

磨刀不误砍柴功，非软件行业的朋友可能也需要使用 ssh 远程登录服务器写代码，学习一下 VSCode 的 ssh 远程开发功能能给工作带来不少便利。

<!-- more -->

## 安装 VSCode

首先，你需要在本地计算机上安装 VSCode。你可以从[VSCode 官方网站](https://code.visualstudio.com/)下载适用于你的操作系统的安装程序，并按照提示进行安装。

## 安装 Remote - SSH 插件

在 VSCode 中，你需要安装 Remote - SSH 插件，以便能够通过 SSH 远程连接到其他计算机进行开发。

1. 打开 VSCode。
2. 点击左侧的扩展图标（四个方块组成的图标）。
3. 在搜索框中输入"Remote - SSH"。
4. 在搜索结果中找到"Remote - SSH"插件，并点击安装按钮。

## 配置 SSH 连接

在 VSCode 中配置 SSH 连接，以便能够连接到远程计算机。

1. 点击左下角的"Remote Explorer"图标（纸飞机图标）。
2. 在 Remote Explorer 面板中，点击右上角的"SSH Targets"按钮。
3. 在弹出的菜单中选择"Add SSH Host"。
4. 在弹出的输入框中输入远程计算机的 SSH 连接信息，包括主机名、用户名和密码或私钥路径。

   例如:

   ```input
   ssh user_name@host_domain:22 -A
   ```

   `user_name` 替换成自己的用户名
   `host_domain` 替换成连接的服务器的域名或 ip
   这里 `22` 是 ssh 默认端口号，也可能是其他的端口号

5. 点击"Add"按钮，保存 SSH 连接配置。

## 连接到远程计算机

连接到远程计算机，开始通过 SSH 进行远程开发。

1. 在 Remote Explorer 面板中，找到你添加的 SSH 连接配置。
2. 右键点击连接配置，选择"Connect to Host"。
3. 如果你使用密码进行身份验证，输入密码并点击"OK"。
4. 如果一切顺利，VSCode 将连接到远程计算机，并在编辑器中显示远程文件系统。

## 远程开发

现在，你可以在 VSCode 中进行远程开发了。

1. 在远程文件系统中打开文件或文件夹。
2. 在编辑器中进行代码编辑、调试和运行。
3. 使用 VSCode 的其他功能进行开发，如版本控制、终端等。

## 注

无

## 参考

无
