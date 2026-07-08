---
title: 索尼NW-A306播放器国行版升级国际版固件教程
description: 索尼 NW-A306 国行版升级国际版固件教程，获取 Google 框架和完整功能的操作指南（2.x.x 固件后已失效）
category: HIFI
tags: [HIFI, NW-A306, 播放器, 国际版, 升级, Sony, 索尼, 谷歌服务]
date: 2024-04-28
---

# 索尼NW-A306播放器国行版升级国际版固件教程
## 升级国际版固件

~~升级国际版固件，可以把国行版固件刷成国际版。~~
不过在 2.x.x 固件之后，这个方法已经失效。

> [!caution]
> 警告
>
> NW-A306 国行版升级到国际版 2.x.x 固件会无限重启，最后升级失败、固件回滚。
> 目前没有办法解决。



> [!tip]
> 手动升级方法：
>
> 1. 将高于当前固件版本的`.UPG`固件文件拷贝到播放器文件系统根目录下（千万不要放到 SD 卡目录，看清楚再拷贝）。
> 2. 断开和电脑的连接，然后在 NW-A306 的设置里把无线网络关掉。
> 3. 进入 NW-A306 的 `设置 -> 系统 -> 高级 -> 系统更新`，就能发现新固件，点击"开始更新"即可。
> 4. 重启，完成设置。

> [!note]
> 注意：
>
> 更新后，固件将无法恢复到以前的版本；
> 更新过程中，数据可能丢失，请事先进行备份；
> 更新过程中，播放器需要有 4.0GB 左右的可用空间，请确认存储空间；
> 如果没有足够的内部存储空间，将不必要的数据转移到计算机中；
> 请确保 Walkman 播放器电量超过 60%，并且处于充电状态；

![NW-A306 国行版升国际版固件流程：1.x 可行、2.x 失败的分叉路径](/posts/sony-nw-a306-china-version-player-upgrade-to-international-firmware-tutorial/firmware-upgrade-flow.svg)

## 附录

### 固件下载地址

| 版本         | 地址                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| 国行版 1.0.1 | https://info.update.sony.net/PA001/NW-A300Series_0003/contents/0001/NW-A300Series_0003_V1_01_04_NW_WM_FW.UPG |
| 国行版 2.0.1 | https://info.update.sony.net/PA001/NW-A300Series_0003/contents/0004/NW-A300Series_0003_V2_01_00_NW_WM_FW.UPG |
| 国行版 2.0.2 | https://info.update.sony.net/PA001/NW-A300Series_0003/contents/0005/NW-A300Series_0003_V2_02_00_NW_WM_FW.UPG |
| 国际版 1.0.1 | https://info.update.sony.net/PA001/NW-A300Series_0000/contents/0001/NW-A300Series_0000_V1_01_04_NW_WM_FW.UPG |
| 国际版 2.0.1 | https://info.update.sony.net/PA001/NW-A300Series_0000/contents/0004/NW-A300Series_0000_V2_01_00_NW_WM_FW.UPG |
| 国际版 2.0.2 | https://info.update.sony.net/PA001/NW-A300Series_0000/contents/0005/NW-A300Series_0000_V2_02_00_NW_WM_FW.UPG |

### 取得固件下载地址方法

直接从设备信息文件里拿到最新固件地址和版本（以我手头的 NW-A306 为例）。

国行：

```shell
curl -s https://info.update.sony.net/PA001/NW-A300Series_0003/info/info.xml | grep "Distribution "
```

国际：

```shell
curl -s https://info.update.sony.net/PA001/NW-A300Series_0000/info/info.xml | grep "Distribution "
```
