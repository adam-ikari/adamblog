---
title: Windows 11 配置 WSL2 完整教程（Ubuntu 26.04）
description: Windows 11 安装配置 WSL2，使用 Ubuntu 26.04 搭建 Linux 开发环境
category: 系统配置
tags: [Windows 11, WSL2, Ubuntu 26.04, Linux, 系统配置]
recommend: true
date: 2026-07-14
series: series-windows-ai
---
# Windows 11 配置 WSL2 完整教程（Ubuntu 26.04）

![Windows 11 配置 WSL2 全流程图](/posts/Windows11-配置WSL2教程/wsl2-setup-flow.svg)

## 前言

> WSL2 是微软的第二代 Linux 子系统，运行真正的 Linux 内核而非模拟，兼容性较第一代有明显提升。Docker、systemd 这些依赖内核特性的组件在 WSL2 中都能运行，文件系统 I/O 也比 WSL1 快得多。Windows 与 Linux 的文件还可互相访问，无需来回搬运。

本教程将带你一步一步在 Windows 11 上安装 WSL2，并配置 **Ubuntu 26.04** 作为 Linux 发行版。

## 前提条件

### Windows 11 版本要求

- Windows 11 版本 21H2 或更高
- 对于 x64 系统：版本 19044 或更高
- 对于 ARM64 系统：版本 22000 或更高

**查看系统版本：**

```powershell
winver
```

### 硬件要求

- **虚拟化支持**：CPU 必须支持虚拟化技术（Intel VT-x 或 AMD-V）
- **BIOS/UEFI 设置**：需在 BIOS 中启用虚拟化功能

**检查虚拟化是否启用：**

```powershell
systeminfo | findstr /i "虚拟化"
```

> 如果输出显示"虚拟化：已启用"，则可以继续。如果未启用，需要进入 BIOS 设置开启虚拟化。

## 安装 WSL2 和 Ubuntu 26.04

**步骤 1：以管理员身份打开 PowerShell，执行：**

```powershell
wsl --install -d Ubuntu-26.04
```

> 该命令会自动启用 WSL 功能、虚拟机平台，下载 Linux 内核更新包，并安装 **Ubuntu 26.04**。如果不加 `-d Ubuntu-26.04` 参数，默认安装的 Ubuntu 版本不确定。

**步骤 2：重启计算机**

> 安装完成后，重启计算机使更改生效。

**步骤 3：首次启动配置**

重启后会自动进入 Ubuntu 26.04，首次启动时要求创建用户名和密码：

```bash
Enter new UNIX username: your_username
New password: ********
Retype new password: ********
```

> **注意**：Ubuntu 26.04 默认使用 **apt 3.0** 包管理器，命令与之前版本兼容，但部分软件包名称可能有所变化。

---

> **💡 如果一键安装失败，可以手动安装：**
> 
> **手动安装步骤：**
> 
> 1. 启用 WSL 功能：
>    ```powershell
>    dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
>    ```
> 
> 2. 启用虚拟机平台：
>    ```powershell
>    dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
>    ```
> 
> 3. 重启计算机
> 
> 4. 下载并安装 Linux 内核更新包：
>    ```powershell
>    Invoke-WebRequest -Uri "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi" -OutFile "wsl_update_x64.msi"
>    Start-Process msiexec.exe -ArgumentList "/i wsl_update_x64.msi /quiet" -Wait
>    ```
> 
> 5. 设置 WSL 2 为默认版本：
>    ```powershell
>    wsl --set-default-version 2
>    ```
> 
> 6. 安装 Ubuntu 26.04：
>    ```powershell
>    wsl --install -d Ubuntu-26.04
>    ```

## 基础配置

### 配置镜像源

**步骤 1：备份原有源文件**

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

**步骤 2：编辑源文件**

```bash
sudo nano /etc/apt/sources.list
```

**步骤 3：替换为清华源（Ubuntu 26.04）**

```text
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ plucky main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ plucky-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ plucky-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ plucky-security main restricted universe multiverse
```

> 阿里源备选（国内不同地区连通性有时更稳）：
> ```text
> deb http://mirrors.aliyun.com/ubuntu/ plucky main restricted universe multiverse
> deb http://mirrors.aliyun.com/ubuntu/ plucky-updates main restricted universe multiverse
> deb http://mirrors.aliyun.com/ubuntu/ plucky-backports main restricted universe multiverse
> deb http://mirrors.aliyun.com/ubuntu/ plucky-security main restricted universe multiverse
> ```

**步骤 4：更新软件包列表**

```bash
sudo apt update && sudo apt upgrade -y
```

### 配置 WSL2 资源限制

**步骤 1：创建或编辑 `.wslconfig` 文件**

```powershell
notepad $env:USERPROFILE\.wslconfig
```

**步骤 2：添加配置**

```toml
[wsl2]
# 内存限制（默认为 Windows 内存的 50% 或 8GB，取较小值）
memory=4GB

# 处理器限制（默认使用所有可用处理器）
processors=2

# 交换空间大小（默认为 Windows 页面文件大小的 25%）
swap=2GB

# 交换文件路径
swapfile=C:\\temp\\wsl-swap.vhdx

# 本地化内存限制
localhostForwarding=true

# 自动释放内存
autoMemoryReclaim=gradual
```

**步骤 3：保存后重启 WSL**

```powershell
wsl --shutdown
```

### 配置网络（镜像网络模式）

**编辑 `.wslconfig` 文件：**

```toml
[wsl2]
# 启用镜像网络模式
networkingMode=mirrored

# 启用 DNS 隧道
dnsTunneling=true

# 启用防火墙
firewall=true

# 启用自动代理
autoProxy=true
```

> 镜像网络模式的好处是 WSL2 和 Windows 共用同一个网络接口，局域网资源能直接访问，VPN 兼容的老大难问题也顺带解决了，localhost 端口还会自动转发。

## 文件系统

### 从 WSL 访问 Windows 文件

```bash
# 访问 C 盘
cd /mnt/c/

# 访问用户目录
cd /mnt/c/Users/你的用户名/

# 访问 D 盘
cd /mnt/d/
```

### 从 Windows 访问 WSL 文件

**在文件资源管理器地址栏输入：**

```text
\\wsl$\
```

**或访问特定发行版：**

```text
\\wsl$\Ubuntu-26.04\home\username
```

**在 PowerShell 中访问：**

```powershell
# 打开 WSL 目录
explorer.exe .

# 使用 wslpath 转换路径
wslpath -w /home/username
```

> **性能建议**：Linux 项目应放在 WSL 文件系统内（如 `~/projects`），这样速度最快。从 WSL 读取 Windows 侧的文件，跨文件系统会有性能损耗。另外，不要在 Windows 下直接编辑 WSL 内的文件，权限容易出现问题。

## 常见问题与解决方法

### WSL2 无法启动

**问题**：执行 `wsl` 命令无响应或报错

**解决方案：**

**步骤 1：检查虚拟化是否启用**

```powershell
Get-ComputerInfo -Property "HyperV*"
```

**步骤 2：重置 WSL**

```powershell
wsl --unregister Ubuntu-26.04
wsl --install -d Ubuntu-26.04
```

**步骤 3：检查 Hyper-V 功能**

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
```

**步骤 4：修复 WSL 组件**

```powershell
# 重新注册 WSL 组件
regsvr32 /n /i:U shell32
```

### 网络连接问题

**问题**：WSL2 无法访问网络或 DNS 解析失败

**解决方案：**

**步骤 1：手动配置 DNS**

```bash
sudo nano /etc/resolv.conf
```

添加：

```text
nameserver 8.8.8.8
nameserver 114.114.114.114
```

**步骤 2：防止 resolv.conf 被覆盖**

```bash
sudo chattr +i /etc/resolv.conf
```

**或在 `.wslconfig` 中启用 DNS 隧道：**

```toml
[wsl2]
dnsTunneling=true
```

**步骤 3：重启网络服务**

```bash
sudo service networking restart
```

### 性能优化建议

**1. 限制 WSL2 资源使用**

在 `.wslconfig` 中设置合理的内存和处理器限制。

**2. 启用自动内存回收**

```toml
[wsl2]
autoMemoryReclaim=gradual
```

**3. 使用稀疏磁盘**

```powershell
wsl --manage Ubuntu-26.04 --set-sparse true
```

**4. 定期清理磁盘**

```powershell
wsl --shutdown
Optimize-VHD -Path "$env:USERPROFILE\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu26.04onWindows_79rhkp1fndgsc\LocalState\ext4.vhdx" -Mode Full
```

**5. 项目放在 WSL 文件系统**

避免跨文件系统操作带来的性能损耗。

**6. 关闭不用的发行版**

```powershell
wsl --terminate Ubuntu-26.04
```

### 其他常见问题

**问题**：`systemd` 未运行

**解决方案：**

编辑 `/etc/wsl.conf`：

```toml
[boot]
systemd=true
```

重启 WSL：

```powershell
wsl --shutdown
```

---

**问题**：Windows 与 WSL 时间不同步

**解决方案：**

```bash
sudo hwclock -s
```

或在 `/etc/wsl.conf` 中添加：

```toml
[boot]
command = hwclock -s
```

## 总结

配置完成后，Windows 上便有了一个可投入使用的 Linux 环境：WSL2 已就绪、发行版已选定、镜像源与资源限制已配置、常用开发工具也已齐备。常见的几个问题——启动失败、DNS 解析、时间不同步——也有了对应的处理思路。

实际用起来有两点最值得记住：

1. **项目文件尽量放在 WSL 文件系统里**，跨到 `/mnt/c/` 操作会有明显的性能损耗
2. **`.wslconfig` 是你管资源的把手**，内存和处理器都靠它收着，别让 WSL 把整机资源吃满

更多高级配置和最新功能，请参考 [微软官方 WSL 文档](https://learn.microsoft.com/zh-cn/windows/wsl/)。
