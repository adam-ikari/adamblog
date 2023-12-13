---
title: 新玩具 M5Stack 的 CardPuter 的折腾记录
keywords:
  - 嵌入式
  - 开发套件
  - M5 Stack
  - CardPuter
  - 乐鑫
  - esp32系列
  - esp32s3
description:
date: 2023-12-13 11:21:00
toc: true
tags:
  - 嵌入式
  - 开发套件
  - M5 Stack
  - CardPuter
  - 乐鑫
  - esp32系列
  - esp32s3
categories:
  - 开发套件
cover:
---

## 前言

最近一段时间特别迷恋有实体键盘的设备，所以入手了 M5 Stack 家的 CardPuter 开发套件

## 简介

M5 Stack 是 基于 esp32s3 的一款开发套件，有显示屏、键盘、麦克风、扬声器、实体键盘、红外发射器、TF 卡槽等外设，自带电池。

<!-- more -->

## 搭建 CardPuter 开发环境

为 CardPuter 搭建 ESP-IDF 的开发环境<sup>[1](#note1)</sup>

### 安装准备

编译 ESP-IDF 需要以下软件包。请根据使用的 Linux 发行版本，选择合适的安装命令。

我是 ubuntu 系统，其他系统请参考官方文档

```shell
sudo apt-get install git wget flex bison gperf python3 python3-pip python3-venv cmake ninja-build ccache libffi-dev libssl-dev dfu-util libusb-1.0-0
```

### 获取 ESP-IDF

打开终端，运行以下命令：

```shell
mkdir -p ~/esp
cd ~/esp
git clone --recursive https://github.com/espressif/esp-idf.git
```

ESP-IDF 将下载至 ~/esp/esp-idf。

### 设置 ESP 工具

运行 `install.sh`

```shell
cd ~/esp/esp-idf
./install.sh
```

> **出现下载失败的现象的原因与解决办法**
>
> 原因：
>
> ESP-IDF 工具安装器会下载 Github 发布版本中附带的一些工具，如果访问 Github 较为缓慢，可以设置一个环境变量，从而优先选择 Espressif 的下载服务器进行 Github 资源下载。
>
> 解决办法：
>
> 要在安装工具时优先选择 Espressif 下载服务器，请在运行 `install.sh` 时使用以下命令：
>
> ```shell
> cd ~/esp/esp-idf
> export IDF_GITHUB_ASSETS="dl.espressif.com/github_assets"
> ./install.sh
> ```

运行 `export.sh` 设置环境变量

```shell
cd ~/esp/esp-idf
./export.sh
```

出现这段文字就是设置 ESP 开发环境成功了

```shell
Done! You can now compile ESP-IDF projects.
Go to the project directory and run:

  idf.py build
```

> **出现 `libusb-1.0.so.0` 找不到的问题的原因和解决办法**
>
> 我在设置环境变量遇到了如下的问题:
>
> ```shell
> WARNING: tool openocd-esp32 version v0.12.0-esp32-20230921 is installed, but > returned non-zero exit code (127) with error message:
> /home/zhaodi-chen/.espressif/tools/openocd-esp32/v0.12.0-esp32-20230921/> openocd-esp32/bin/openocd: error while loading shared libraries: libusb-1.0.so.> 0: cannot open shared object file: No such file or directory
> ```
>
> 原因：
>
> 系统中没有安装 `libusb` 开发库, 其实是我忽略了安装 `esp-idf` 的系统依赖
>
> 解决办法：
>
> ubuntu 系统可以使用下面的命令安装`libusb`
>
> ```shell
> sudo apt install libusb-1.0-0-dev
> ```

## 克隆 CardPuter 的 Demo 工程

Demo 工程的页面： <https://github.com/m5stack/M5Cardputer-UserDemo>

```shell
git clone https://github.com/m5stack/M5Cardputer-UserDemo.git
```

> **克隆总是失败解决办法**
>
> 如果克隆总是失败可以使用下面的加速链接下载源码包
>
> ```url
> https://cache.dadilive.top/main.zip?url=aHR0cHM6Ly9naXRodWIuY29tL201c3RhY2svTTVDYXJkcHV0ZXItVXNlckRlbW8vYXJjaGl2ZS9yZWZzL2hlYWRzL21haW4uemlw
> ```

## 注

<div id="note1"></div>
[1] CardPuter 使用了乐鑫的 esp32s3 soc 作为主控芯片，ESP-IDF 是乐鑫为 esp32 系列芯片提供的开发工具包

## 参考

[Linux 和 macOS 平台工具链的标准设置](https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/get-started/linux-macos-setup.html#get-started-prerequisites)
