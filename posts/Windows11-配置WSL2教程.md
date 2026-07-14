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

## 安装 WSL2

### 方法一：一键安装（推荐）

**步骤 1：以管理员身份打开 PowerShell，执行：**

```powershell
wsl --install
```

> 该命令会自动完成以下操作：
> 1. 启用 WSL 功能
> 2. 启用虚拟机平台
> 3. 下载并安装 Linux 内核更新包
> 4. 安装 Ubuntu 作为默认 Linux 发行版
> 5. 将 WSL 2 设置为默认版本

**步骤 2：重启计算机**

> 安装完成后，重启计算机使更改生效。

---

### 方法二：手动启用功能

> 如果一键安装失败，可以手动执行以下步骤。

**步骤 1：启用 WSL 功能**

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

> 这条命令用 `dism` 把 `Microsoft-Windows-Subsystem-Linux` 这个可选功能在当前系统（`/online`）上打开，`/all` 表示连带依赖的子功能一起开，`/norestart` 是先别急着重启——因为下一步还要再开一个功能，攒一起重启省事。

**步骤 2：启用虚拟机平台**

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

> WSL2 跑的是真正的 Linux 内核，靠的是 Hyper-V 那套轻量虚拟机底座，`VirtualMachinePlatform` 就是提供这个底座的功能——不开它，WSL 只能退化成第一代兼容层，性能和兼容性都差一截。

**步骤 3：重启计算机**

> 到这一步两个功能都开了，可以重启计算机。如果重启后启动 WSL 仍报 `WslRegisterDomain` 之类错误，进 BIOS 确认 CPU 虚拟化（Intel VT-x / AMD-V）是打开的——这是最常见的卡点。

**步骤 4：下载并安装 Linux 内核更新包**

```powershell
# 使用 PowerShell 下载
Invoke-WebRequest -Uri "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi" -OutFile "wsl_update_x64.msi"

# 安装更新包
Start-Process msiexec.exe -ArgumentList "/i wsl_update_x64.msi /quiet" -Wait
```

**步骤 5：设置 WSL 2 为默认版本**

```powershell
wsl --set-default-version 2
```

> 这条命令把默认版本钉在 2 上，往后装的发行版都按 WSL2 启动，省得每个都手动 `--set-version` 切一遍。注意这条只影响**之后新装的**发行版，已经装好的旧发行版默认版本不会自动变，需要单独用 `wsl --set-version <发行版> 2` 转。

**步骤 6：重启计算机使更改生效**

## 安装 Linux 发行版

### 从 Microsoft Store 安装

1. 打开 Microsoft Store
2. 搜索 "WSL" 或具体发行版名称（如 "Ubuntu"）
3. 选择需要的发行版并点击"获取"

**常用发行版：**
- Ubuntu 26.04 LTS
- Ubuntu 24.04 LTS
- Ubuntu 22.04 LTS
- Debian
- openSUSE Leap
- SUSE Linux Enterprise Server

### 使用命令行安装

**查看可用的发行版列表：**

```powershell
wsl --list --online
```

**安装指定发行版：**

```powershell
# 安装 Ubuntu 26.04
wsl --install -d Ubuntu-26.04

# 安装 Ubuntu 24.04
wsl --install -d Ubuntu-24.04

# 安装 Debian
wsl --install -d Debian
```

### 首次启动配置

**首次启动 Ubuntu 26.04 时会要求创建用户名和密码：**

```bash
# 系统提示
Enter new UNIX username: your_username
New password: ********
Retype new password: ********
```

> **注意**：Ubuntu 26.04 默认使用 **apt 3.0** 包管理器，命令与之前版本兼容，但部分软件包名称可能有所变化。

## 基础配置

### 设置默认用户

**在 PowerShell 中执行：**

```powershell
# 设置 Ubuntu 的默认用户为 root
ubuntu config --default-user root
```

**或在 WSL 内部使用：**

```bash
# 切换到 root 用户
sudo -i
```

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

## 常用开发工具安装

### 安装 Git

```bash
sudo apt install git -y
```

**配置用户信息：**

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**配置换行符：**

```bash
git config --global core.autocrlf input
```

> `core.autocrlf input` 是处理换行符的：WSL 里换行是 LF，而 Windows 是 CRLF，设成 `input` 让 Git 在提交时把 CRLF 转成 LF、检出不转——避免跨系统协作时一堆莫名其妙的 diff。

### 安装 Node.js

**使用 NodeSource 仓库安装：**

```bash
# 安装 Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node --version
npm --version
```

**或使用 nvm 管理 Node.js 版本：**

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

```bash
# 安装 Python 3 和 pip
sudo apt install python3 python3-pip python3-venv -y

# 创建虚拟环境
python3 -m venv myenv
source myenv/bin/activate
```

### 安装 Docker

#### 方式一：Docker Desktop for Windows

1. 安装 Docker Desktop for Windows
2. 在设置中启用 "Use WSL 2 based engine"
3. 在 Resources > WSL Integration 中启用对应发行版

#### 方式二：在 WSL2 内直接安装 Docker Engine

**步骤 1：安装依赖**

```bash
sudo apt install ca-certificates curl gnupg -y
```

**步骤 2：添加 Docker GPG 密钥**

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

**步骤 3：添加 Docker 仓库**

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

**步骤 4：安装 Docker**

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

**步骤 5：启动 Docker 服务**

```bash
sudo service docker start
```

**步骤 6：将用户添加到 docker 组**

```bash
sudo usermod -aG docker $USER
```

> `usermod -aG` 把你加进 docker 组是为了免 sudo 跑 docker，但这条**当前 shell 不会立刻生效**——要么关掉 WSL 重开，要么 `newgrp docker` 切一下组，否则还会提示权限不足。另外每次重启 WSL 后 docker 服务不会自己起来，得重新 `sudo service docker start`，想开机自启就把 systemd 开了再 `systemctl enable docker`。

**验证安装：**

```bash
docker run hello-world
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

> `build-essential` 是 C/C++ 编译链（gcc、make 一类），很多从源码装的工具都依赖它；`net-tools`/`curl`/`wget` 是网络排障和下载的常备件；`vim`/`nano` 是命令行编辑器，nano 更新手友好；`zsh` 配 Oh My Zsh 则是把默认 shell 换成更好用的版本，自动补全和主题都比 bash 顺手。

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
