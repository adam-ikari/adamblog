---
title: 索尼NW-A306播放器国行版升级国际版固件教程
toc: false
categories:
  - HIFI
tags:
  - HIFI
  - NW-A306
  - 播放器
  - 国际版
  - 升级
  - Sony
  - 索尼
  - 谷歌服务
abbrlink: f80c826
date: 2024-04-28 17:00:00
---

## 升级国际版固件

~~升级国际版固件的方法可以将国行版固件刷成国际版。~~
在 2.x.x 固件之后这个方法已经失效。

> [!caution]
> 警告
>
> NW-A306 国行版升级到国际版 2.x.x 固件会无限重启，最终导致升级失败固件回滚。
> 目前没有办法解决。

<!-- more -->

> [!tip]
> 手动升级方法：
>
> 1. 将高于当前固件版本的`.UPG`固件文件拷贝到播放器文件系统根目录下（千万不要放到 SD 卡目录，看清楚再拷贝）。
> 2. 断开和电脑的链接，然后在 NW-A306 的设置中将无线网络关闭。
> 3. 进入 NW-A306 的 `设置 -> 系统 -> 高级 -> 系统更新`就可以发现新的固件，点击 开始更新即可。
> 4. 重启，完成设置。

> [!note]
> 注意：
>
> 更新后，固件将无法恢复到以前的版本；
> 更新过程中，数据可能丢失，请事先进行备份；
> 更新过程中，播放器需要有 4.0GB 左右的可用空间，请确认存储空间；
> 如果没有足够的内部存储空间，将不必要的数据转移到计算机中；
> 请确保 Walkman 播放器电量超过 60%，并且处于充电状态；

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

直接从设备信息文件中获取最新固件地址和版本（以我手头的 NW-A306 举例）

国行：

```shell
curl -s https://info.update.sony.net/PA001/NW-A300Series_0003/info/info.xml | grep "Distribution "
```

国际：

```shell
curl -s https://info.update.sony.net/PA001/NW-A300Series_0000/info/info.xml | grep "Distribution "
```
