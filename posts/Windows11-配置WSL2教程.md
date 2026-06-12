---
title: Windows 11 配置 WSL2 完整教程
description: Windows 11 安装配置 WSL2，搭建 Linux 开发环境
category: 系统配置
tags: [Windows 11, WSL2, Linux, 系统配置]
recommend: false
date: 2026-06-08
series:
  - id: series-windows-ai
    name: Windows 11 AI 工具系列
    order: 1
    prev:
    next: /posts/WSL2-安装和使用-Claude-Code-教程
---

# Windows 11 配置 WSL2 完整教程
## 前言

WSL2（Windows Subsystem for Linux 2）是微软推出的第二代 Windows 子系统，它提供了一个真正的 Linux 内核环境，让开发者可以在 Windows 上原生运行 Linux 应用程序。

### 为什么选择 WSL2？

- **真正的 Linux 内核**：WSL2 使用真实的 Linux 内核，兼容性远超 WSL1
- **完整的系统调用兼容性**：支持 Docker、systemd 等需要内核特性的应用
- **性能优异**：文件系统 I/O 性能比 WSL1 提升数倍
- **无缝集成**：Windows 与 Linux 文件系统可以互相访问
- **开发便捷**：无需双系统或虚拟机，节省资源

## 前提条件

### Windows 11 版本要求

- Windows 11 版本 21H2 或更高
- 对于 x64 系统：版本 19044 或更高
- 对于 ARM64 系统：版本 22000 或更高

查看系统版本：

```powershell
winver
```

### 硬件要求

- **虚拟化支持**：CPU 必须支持虚拟化技术（Intel VT-x 或 AMD-V）
- **BIOS/UEFI 设置**：需在 BIOS 中启用虚拟化功能

检查虚拟化是否启用：

```powershell
systeminfo | findstr /i "虚拟化"
```

## 安装 WSL2

### 方法一：一键安装（推荐）

以管理员身份打开 PowerShell，执行以下命令：

```powershell
wsl --install
```

该命令会自动完成以下操作：
1. 启用 WSL 功能
2. 启用虚拟机平台
3. 下载并安装 Linux 内核更新包
4. 安装 Ubuntu 作为默认 Linux 发行版
5. 将 WSL 2 设置为默认版本

安装完成后，重启计算机。

### 方法二：手动启用功能

如果一键安装失败，可以手动执行以下步骤。

#### 步骤 1：启用 WSL 功能

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

#### 步骤 2：启用虚拟机平台

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

#### 步骤 3：下载并安装 Linux 内核更新包

从微软官方下载 WSL2 Linux 内核更新包：

```powershell
# 使用 PowerShell 下载
Invoke-WebRequest -Uri "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi" -OutFile "wsl_update_x64.msi"

# 安装更新包
Start-Process msiexec.exe -ArgumentList "/i wsl_update_x64.msi /quiet" -Wait
```

#### 步骤 4：设置 WSL 2 为默认版本

```powershell
wsl --set-default-version 2
```

重启计算机使更改生效。

## 安装 Linux 发行版

### 从 Microsoft Store 安装

1. 打开 Microsoft Store
2. 搜索 "WSL" 或具体发行版名称（如 "Ubuntu"）
3. 选择需要的发行版并点击"获取"

常用发行版：
- Ubuntu 22.04 LTS / 24.04 LTS
- Debian
- openSUSE Leap
- SUSE Linux Enterprise Server

### 使用命令行安装

查看可用的发行版列表：

```powershell
wsl --list --online
```

安装指定发行版：

```powershell
# 安装 Ubuntu 22.04
wsl --install -d Ubuntu-22.04

# 安装 Debian
wsl --install -d Debian
```

### 首次启动配置

首次启动时会要求创建用户名和密码：

```bash
# 系统提示
Enter new UNIX username: your_username
New password: ********
Retype new password: ********
```

## 基础配置

### 设置默认用户

如果需要更改默认用户，可以在 PowerShell 中执行：

```powershell
# 设置 Ubuntu 的默认用户为 root
ubuntu config --default-user root
```

或在 WSL 内部使用：

```bash
# 切换到 root 用户
sudo -i
```

### 配置镜像源

#### Ubuntu 清华源

备份原有源文件：

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

编辑源文件：

```bash
sudo nano /etc/apt/sources.list
```

替换为清华源（Ubuntu 22.04）：

```text
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
```

更新软件包列表：

```bash
sudo apt update && sudo apt upgrade -y
```

#### Ubuntu 阿里源

```text
deb http://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
```

### 配置 WSL2 资源限制

创建或编辑 `.wslconfig` 文件（位于 Windows 用户目录 `%USERPROFILE%`）：

```powershell
notepad $env:USERPROFILE\.wslconfig
```

配置示例：

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

保存后重启 WSL：

```powershell
wsl --shutdown
```

### 配置网络（镜像网络模式）

WSL2 默认使用 NAT 网络模式，从 Windows 11 22H2 开始支持镜像网络模式。

编辑 `.wslconfig` 文件：

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

镜像网络模式的优点：
- WSL2 与 Windows 共享同一网络接口
- 可以直接访问局域网资源
- 解决 VPN 兼容性问题
- localhost 端口自动转发

## 文件系统

### 从 WSL 访问 Windows 文件

Windows 文件系统挂载在 `/mnt/` 目录下：

```bash
# 访问 C 盘
cd /mnt/c/

# 访问用户目录
cd /mnt/c/Users/你的用户名/

# 访问 D 盘
cd /mnt/d/
```

### 从 Windows 访问 WSL 文件

在文件资源管理器地址栏输入：

```text
\\wsl$\
```

或直接访问特定发行版：

```text
\\wsl$\Ubuntu-22.04\home\username
```

在 PowerShell 中访问：

```powershell
# 打开 WSL 目录
explorer.exe .

# 使用 wslpath 转换路径
wslpath -w /home/username
```

### 文件系统性能建议

- **在 WSL 内操作 Linux 项目**：将项目放在 WSL 文件系统（如 `~/projects`）可获得最佳性能
- **跨系统文件访问**：从 WSL 访问 Windows 文件会有性能损耗
- **避免在 Windows 下修改 WSL 文件**：可能导致文件权限问题

## 常用开发工具安装

### 安装 Git

```bash
sudo apt install git -y

# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 配置换行符
git config --global core.autocrlf input
```

### 安装 Node.js

使用 NodeSource 仓库安装：

```bash
# 安装 Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node --version
npm --version
```

或使用 nvm 管理 Node.js 版本：

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载配置
source ~/.bashrc

# 安装 Node.js
nvm install --lts
nvm use --lts
```

### 安装 Python

Ubuntu 默认已安装 Python，如需安装其他版本：

```bash
# 安装 Python 3 和 pip
sudo apt install python3 python3-pip python3-venv -y

# 创建虚拟环境
python3 -m venv myenv
source myenv/bin/activate
```

### 安装 Docker

在 WSL2 中运行 Docker 有两种方式：

#### 方式一：Docker Desktop for Windows

1. 安装 Docker Desktop for Windows
2. 在设置中启用 "Use WSL 2 based engine"
3. 在 Resources > WSL Integration 中启用对应发行版

#### 方式二：在 WSL2 内直接安装 Docker Engine

```bash
# 安装依赖
sudo apt install ca-certificates curl gnupg -y

# 添加 Docker GPG 密钥
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 添加 Docker 仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# 启动 Docker 服务
sudo service docker start

# 将用户添加到 docker 组
sudo usermod -aG docker $USER
```

### 安装其他常用工具

```bash
# 安装编译工具
sudo apt install build-essential -y

# 安装网络工具
sudo apt install net-tools curl wget -y

# 安装文本编辑器
sudo apt install vim nano -y

# 安装 zsh
sudo apt install zsh -y
chsh -s $(which zsh)

# 安装 Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## 常见问题与解决方法

### WSL2 无法启动

**问题**：执行 `wsl` 命令无响应或报错

**解决方案**：

1. 检查虚拟化是否启用：

```powershell
Get-ComputerInfo -Property "HyperV*"
```

2. 重置 WSL：

```powershell
wsl --unregister Ubuntu-22.04
wsl --install -d Ubuntu-22.04
```

3. 检查 Hyper-V 功能：

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
```

4. 修复 WSL 组件：

```powershell
# 重新注册 WSL 组件
regsvr32 /n /i:U shell32
```

### 网络连接问题

**问题**：WSL2 无法访问网络或 DNS 解析失败

**解决方案**：

1. 手动配置 DNS：

```bash
sudo nano /etc/resolv.conf
```

```text
nameserver 8.8.8.8
nameserver 114.114.114.114
```

2. 防止 resolv.conf 被覆盖：

```bash
sudo chattr +i /etc/resolv.conf
```

3. 或在 `.wslconfig` 中启用 DNS 隧道：

```toml
[wsl2]
dnsTunneling=true
```

4. 重启网络服务：

```bash
sudo service networking restart
```

### 性能优化建议

1. **限制 WSL2 资源使用**：在 `.wslconfig` 中设置合理的内存和处理器限制

2. **启用自动内存回收**：

```toml
[wsl2]
autoMemoryReclaim=gradual
```

3. **使用稀疏磁盘**：

```powershell
wsl --manage Ubuntu-22.04 --set-sparse true
```

4. **定期清理磁盘**：

```powershell
wsl --shutdown
Optimize-VHD -Path "$env:USERPROFILE\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu22.04onWindows_79rhkp1fndgsc\LocalState\ext4.vhdx" -Mode Full
```

5. **项目放在 WSL 文件系统**：避免跨文件系统操作带来的性能损耗

6. **关闭不用的发行版**：

```powershell
wsl --terminate Ubuntu-22.04
```

### 其他常见问题

**问题**：`systemd` 未运行

**解决方案**：WSL2 现已原生支持 systemd，编辑 `/etc/wsl.conf`：

```toml
[boot]
systemd=true
```

重启 WSL：

```powershell
wsl --shutdown
```

**问题**：Windows 与 WSL 时间不同步

**解决方案**：

```bash
sudo hwclock -s
```

或在 `/etc/wsl.conf` 中添加：

```toml
[boot]
command = hwclock -s
```

## 总结

WSL2 为 Windows 开发者提供了一个强大且便捷的 Linux 开发环境。通过本教程，你应该已经完成了：

- WSL2 的安装与基础配置
- Linux 发行版的安装与设置
- 镜像源、资源限制、网络模式的配置
- 常用开发工具的安装
- 常见问题的排查与解决

WSL2 的优势在于它让开发者无需离开 Windows 就能享受完整的 Linux 开发体验，无论是 Web 开发、容器化应用还是系统编程，都能得心应手。建议将项目文件放在 WSL 文件系统内以获得最佳性能，并善用 `.wslconfig` 进行资源管理。

更多高级配置和最新功能，请参考 [微软官方 WSL 文档](https://learn.microsoft.com/zh-cn/windows/wsl/)。
