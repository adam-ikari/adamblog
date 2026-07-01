---
title: VSCode SSH 远程开发教程
description: 使用 VSCode Remote-SSH 扩展进行远程开发，配置 SSH 连接、免密登录和远程调试的完整指南
category: tools
tags: [Tools, VSCode, SSH Remote]
date: 2024-02-22
---

# VSCode SSH 远程开发教程
<!--
注释的方法：
在正文需要注释的地方插入下面的代码，根据需要修改编号：
  <sup>[1](#note1)</sup>
在"注"章节插入对应编号的注释内容:
  <div id="note1"></div>
  [1] 这是注的内容
-->

## 前言

磨刀不误砍柴功。哪怕不是软件行业的人，偶尔也得 ssh 远程登服务器写两段代码。这时候学会 VSCode 的远程开发功能，能省掉不少在本地和服务器之间来回倒腾文件的麻烦。



## 安装 VSCode

先在本地装好 VSCode。去 [VSCode 官方网站](https://code.visualstudio.com/) 下对应系统的安装程序，按提示装上就行。

## 安装 Remote - SSH 插件

要用 SSH 连远程机器开发，得先装上 Remote - SSH 这个插件。

1. 打开 VSCode。
2. 点击左侧的扩展图标（四个方块组成的图标）。
3. 在搜索框中输入"Remote - SSH"。
4. 在搜索结果中找到"Remote - SSH"插件，并点击安装按钮。

## 配置 SSH 连接

插件装好，接下来配一条 SSH 连接，告诉 VSCode 怎么连到远程机器。

1. 点击左下角的"Remote Explorer"图标（纸飞机图标）。
2. 在 Remote Explorer 面板中，点击右上角的"SSH Targets"按钮。
3. 在弹出的菜单中选择"Add SSH Host"。
4. 在弹出的输入框中输入远程计算机的 SSH 连接信息，包括主机名、用户名和密码或私钥路径。

   例如:

   ```text
   ssh user_name@host_domain:22 -A
   ```

   `user_name` 替换成自己的用户名
   `host_domain` 替换成连接的服务器的域名或 ip
   这里 `22` 是 ssh 默认端口号，也可能是其他的端口号

5. 点击"Add"按钮，保存 SSH 连接配置。

## 连接到远程计算机

配置存好，就可以实际连上去开始远程开发了。

1. 在 Remote Explorer 面板中，找到你添加的 SSH 连接配置。
2. 右键点击连接配置，选择"Connect to Host"。
3. 如果你使用密码进行身份验证，输入密码并点击"OK"。
4. 如果一切顺利，VSCode 将连接到远程计算机，并在编辑器中显示远程文件系统。

## 远程开发

连上之后，操作起来就跟本地差不多：在远程文件系统里打开文件或文件夹，编辑、调试、运行都在编辑器里完成，版本控制、终端这些 VSCode 自带的功能也都能用。区别只在于，代码实际跑在那台远程机器上，本地只是个操作的窗口。

## 注

无

## 参考

无
