---
title: 新玩具 M5Stack 的 CardPuter 的折腾记录(一) —— 开发环境搭建篇
keywords:
  - 嵌入式
  - 开发套件
  - M5 Stack
  - CardPuter
  - 乐鑫
  - esp32系列
  - esp32s3
description: 新玩具 M5Stack 的 CardPuter 的折腾记录(一) —— 开发环境搭建篇
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
cover: covers/新玩具M5STACK的CARDPUTER的折腾记录.jpg
abbrlink: 36b48fbf
date: 2023-12-13 11:21:00
---

## 前言

最近一段时间特别迷恋有实体键盘的设备，所以入手了 M5 Stack 家的 CardPuter 开发套件

## 简介

CardPuter 是 基于 esp32s3 的一款开发套件，有显示屏、键盘、麦克风、扬声器、实体键盘、红外发射器、TF 卡槽等外设，自带电池。

<!-- more -->

![cardputer info](<%E6%96%B0%E7%8E%A9%E5%85%B7M5STACK%E7%9A%84CARDPUTER%E7%9A%84%E6%8A%98%E8%85%BE%E8%AE%B0%E5%BD%95(%E4%B8%80)_%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%E7%AF%87/cardputer_info.jpg>)

## 搭建 CardPuter 开发环境

为 CardPuter 搭建 esp-idf 的开发环境<sup>[1](#note1)</sup>

### 安装准备

esp-idf 依赖以下系统软件包。请根据使用的 Linux 发行版本，选择合适的安装命令。

我是 ubuntu 系统，其他系统请参考官方文档

```shell
sudo apt-get install git wget flex bison gperf python3 python3-pip python3-venv cmake ninja-build ccache libffi-dev libssl-dev dfu-util libusb-1.0-0
```

### 获取 esp-idf

打开终端，运行以下命令：

```shell
mkdir -p ~/esp
cd ~/esp
git clone --recursive https://github.com/espressif/esp-idf.git
```

esp-idf 将下载至 ~/esp/esp-idf。

注意当前 CardPuter 的源码依赖 esp-idf 的版本是 v4.4.6

需要切换 esp-idf 的 git 分支到 v4.4.6

```shell
cd ~/esp/esp-idf
git checkout v4.4.6
```

### 使用 esp-idf 工具安装器安装依赖包

运行 `install.sh`

```shell
cd ~/esp/esp-idf
./install.sh
```

> **出现下载失败的现象的原因与解决办法**
>
> 原因：
>
> esp-idf 工具安装器会下载 Github 发布版本中附带的一些工具，如果访问 Github 较为缓慢，可以设置一个环境变量，从而优先选择 Espressif 的下载服务器进行 Github 资源下载。
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

```term
Done! You can now compile esp-idf projects.
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

## 构建 CardPuter 的 Demo 工程

设置完 `esp-idf` 的环境变量。
进入 CardPuter 的 Demo 工程的目录，运行 `idf build`

```shell
cd M5Cardputer-UserDemo
idf build
```

终端出现下面的文字就代表编译成功了

```term
Project build complete. To flash, run this command:
/home/zhaodi-chen/.espressif/python_env/idf4.4_py3.10_env/bin/python ../../esp/esp-idf/components/esptool_py/esptool/esptool.py -p (PORT) -b 460800 --before default_reset --after hard_reset --chip esp32s3  write_flash --flash_mode dio --flash_size detect --flash_freq 80m 0x0 build/bootloader/bootloader.bin 0x8000 build/partition_table/partition-table.bin 0x10000 build/cardputer.bin
or run 'idf.py -p (PORT) flash'
```

## 注

<div id="note1"></div>
[1] CardPuter 使用了乐鑫的 esp32s3 soc 作为主控芯片，esp-idf 是乐鑫为 esp32 系列芯片提供的开发工具包。

## 参考

[Linux 和 macOS 平台工具链的标准设置](https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/get-started/linux-macos-setup.html#get-started-prerequisites)
