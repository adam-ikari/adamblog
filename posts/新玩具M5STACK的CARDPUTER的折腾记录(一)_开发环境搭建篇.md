---
title: 新玩具 M5Stack 的 CardPuter 的折腾记录(一) —— 开发环境搭建篇
description: 新玩具 M5Stack 的 CardPuter 的折腾记录(一) —— 开发环境搭建篇
tags: [嵌入式, 开发套件, M5 Stack, CardPuter, 乐鑫, esp32系列, esp32s3]
category: 开发套件

date: 2023-12-13
---

# 新玩具 M5Stack 的 CardPuter 的折腾记录(一) —— 开发环境搭建篇
## 前言

最近特别迷带实体键盘的设备，于是入手了 M5Stack 家的 CardPuter 开发套件。

## 简介

CardPuter 是一款基于 esp32s3 的开发套件，显示屏、键盘、麦克风、扬声器、实体键盘、红外发射器、TF 卡槽该有的外设都有，还自带电池。



![cardputer info](./新玩具M5STACK的CARDPUTER的折腾记录(一)_开发环境搭建篇/cardputer_info.jpg)

## 搭建 CardPuter 开发环境

这一篇给 CardPuter 搭 esp-idf 的开发环境<sup>[1](#note1)</sup>

### 安装准备

esp-idf 依赖一些系统软件包，按你的 Linux 发行版选合适的安装命令。我用的是 Ubuntu，其他系统请参考官方文档。

```shell
sudo apt-get install git wget flex bison gperf python3 python3-pip python3-venv cmake ninja-build ccache libffi-dev libssl-dev dfu-util libusb-1.0-0
```

### 获取 esp-idf

打开终端，运行：

```shell
mkdir -p ~/esp
cd ~/esp
git clone --recursive https://github.com/espressif/esp-idf.git
```

esp-idf 将下载至 ~/esp/esp-idf。

注意，当前 CardPuter 的源码依赖的是 esp-idf v4.4.6，所以得把 esp-idf 的 git 分支切到 v4.4.6。

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
> esp-idf 工具安装器会下载 GitHub 发布版本里附带的一些工具。如果访问 GitHub 太慢，可以设个环境变量，让它优先走 Espressif 的下载服务器拉 GitHub 资源。
>
> 解决办法：
>
> 想在安装工具时优先走 Espressif 下载服务器，运行 `install.sh` 时用下面的命令：
>
> ```shell
> cd ~/esp/esp-idf
> export IDF_GITHUB_ASSETS="dl.espressif.com/github_assets"
> ./install.sh
> ```

运行 `export.sh` 设置环境变量。

```shell
cd ~/esp/esp-idf
./export.sh
```

看到这段文字，就说明 ESP 开发环境搭好了。

```bash
Done! You can now compile esp-idf projects.
Go to the project directory and run:

  idf.py build
```

> **出现 `libusb-1.0.so.0` 找不到的问题的原因和解决办法**
>
> 我在设置环境变量时遇到了下面这个问题：
>
> ```shell
> WARNING: tool openocd-esp32 version v0.12.0-esp32-20230921 is installed, but > returned non-zero exit code (127) with error message:
> /home/zhaodi-chen/.espressif/tools/openocd-esp32/v0.12.0-esp32-20230921/> openocd-esp32/bin/openocd: error while loading shared libraries: libusb-1.0.so.> 0: cannot open shared object file: No such file or directory
> ```
>
> 原因：
>
> 系统里没装 `libusb` 开发库，其实就是我漏装了 `esp-idf` 的系统依赖。
>
> 解决办法：
>
> Ubuntu 系统可以用下面的命令装 `libusb`：
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
> 克隆总是失败的话，可以用下面的加速链接下载源码包。
>
> ```text
> https://cache.dadilive.top/main.zip?url=aHR0cHM6Ly9naXRodWIuY29tL201c3RhY2svTTVDYXJkcHV0ZXItVXNlckRlbW8vYXJjaGl2ZS9yZWZzL2hlYWRzL21haW4uemlw
> ```

## 构建 CardPuter 的 Demo 工程

设好 `esp-idf` 的环境变量后，进入 CardPuter 的 Demo 工程目录，运行 `idf build`。

```shell
cd M5Cardputer-UserDemo
idf build
```

终端出现下面这段文字，就说明编译成功了。

```bash
Project build complete. To flash, run this command:
/home/zhaodi-chen/.espressif/python_env/idf4.4_py3.10_env/bin/python ../../esp/esp-idf/components/esptool_py/esptool/esptool.py -p (PORT) -b 460800 --before default_reset --after hard_reset --chip esp32s3  write_flash --flash_mode dio --flash_size detect --flash_freq 80m 0x0 build/bootloader/bootloader.bin 0x8000 build/partition_table/partition-table.bin 0x10000 build/cardputer.bin
or run 'idf.py -p (PORT) flash'
```

## 注

<div id="note1"></div>
[1] CardPuter 使用了乐鑫的 esp32s3 soc 作为主控芯片，esp-idf 是乐鑫为 esp32 系列芯片提供的开发工具包。

## 参考

[Linux 和 macOS 平台工具链的标准设置](https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/get-started/linux-macos-setup.html#get-started-prerequisites)
