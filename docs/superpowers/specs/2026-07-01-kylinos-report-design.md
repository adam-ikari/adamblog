# KylinOS 调查报告 设计文档

## 概述

在 Adam 的博客（VitePress）中新增一篇深度长文：**KylinOS（银河麒麟）调查报告**。性质为"技术科普 + 体验报告"，聚焦系统的**来历、技术、架构**，联网核验事实，不编造亲历体验。

- 产出文件：`posts/KylinOS-调查报告.md`
- 分类：`信创`（该分类首篇）
- 篇幅：深度长文单篇
- 暂不挂系列（后续若写 UOS/Deepin 对比再组「信创」系列）

## 目标读者

对国产操作系统/信创感兴趣的技术读者。读完应能回答：麒麟从哪来、基于什么、家族有哪些成员、技术架构如何、生态现状与局限。

## 核心立意

本报告有两条主线：

**1. 血缘真相**——纠正"麒麟就是套壳 Ubuntu"的误解：
- 麒麟本体始于 FreeBSD（2001，863 计划，国防科大）
- 3.0 起转向 Linux 内核（非基于某个发行版）
- Ubuntu Kylin（优麒麟）是 Canonical 与工信部合作的**独立支线**，不能等同于麒麟本体

**2. 理念分野（本报告重点）**——麒麟/openKylin 与其他发行版的差异，根子不在补丁，而在**管理维护理念**：
- 定位为"开源根社区"，不把自己当某发行版的下游派生，而要建自主技术栈——区别于 Ubuntu(基于 Debian)、Fedora(自身即上游)
- 基金会托管（开放原子）+ SIG 治理 + 木兰宽松许可证，区别于 SPI/Debian、Red Hat/Fedora 的治理与许可
- "自主可控 / 信创合规"驱动维护，而非纯粹的技术先进性或社区共识驱动
- 商业版(银河麒麟专有)与社区版(openKylin 开源)双轨，区别于 Fedora/RHEL 的上游-下游模式

把"血缘真相"和"理念分野"讲清楚，是本报告的核心价值——其中理念分野是重点。

## 文章结构（11 章）

| 章 | 标题 | 内容 | 事实来源 |
|---|---|---|---|
| 一 | 来历：麒麟从何而来 | 863 计划、国防科大 2001 起源、命名"麒麟" | 维基百科 ✅ |
| 二 | 技术演进：三次转身 | FreeBSD → Linux 内核(3.0) → openKylin 开源；澄清"基于 Ubuntu"误解 | 维基百科 ✅ |
| 三 | 版本谱系 | 银河麒麟（桌面/服务器/智算/工业）、NeoKylin、Ubuntu Kylin、openKylin、V10→V11 | 维基/官方 ✅ |
| 四 | 技术架构 | Linux 内核、UKUI（Qt/fork MATE/4.0/类 Win7）、apt/dpkg 系包管理、x86-64/ARM 架构 | 维基/官方 ✅ |
| 五 | 安全机制与信创 | 早期 B2 级安全、自主可控、国产 CPU 适配 | 维基 ✅ |
| 六 | 生态与应用 | 政府份额、天河超算、Dell 预装、兼容数 | 维基 ✅ |
| 七 | 不可变文件系统 | 不可变(immutable)架构趋势、只读系统目录、原子更新；与 Fedora Silverblue/SteamOS 类比；麒麟/openKylin 在此方向的具体实现 | 待核验 ⚠️ |
| 八 | 应用生态 | deb/rpm 传统包、玲珑(linglong)沙箱包、麒麟应用商店、安卓应用兼容；生态痛点 | 待核验 ⚠️ |
| 九 | 内核源码深挖 | openKylin 开源内核仓库(gitee/GitCode)、基于 Linux 6.6 LTS、19 分支、国产CPU适配分支(兆芯/intel)、河流代号(黄河/尼罗/长江)、Kconfig.kylin 定制；**与主线 Linux 的差别**：定制文件(Kconfig.kylin/Makefile.kylin/MAINTAINERS-DIR)、新增 CONFIG 选项(如 CONFIG_DRM_MWV207)、`ok` 后缀版本号方案、Debian 风格打包；逐补丁差异标注"需 diff upstream 可知，不逐条列举"；商业版专有补丁不可得 | 官方仓库 ✅ |
| 十 | **与其他发行版的管理维护理念差异（重点）** | ①"开源根社区"定位 vs Ubuntu/Fedora 的上游-下游关系；②治理：开放原子基金会+SIG+木兰PSL2 vs SPI/Debian、Red Hat/Fedora；③维护驱动：自主可控/信创合规 vs 技术先进性/社区共识；④双轨：商业专有(银河麒麟)+社区开源(openKylin) vs Fedora/RHEL 模式；⑤对"自主"的不同诠释 | 官方/维基 ✅+分析 |
| 十一 | 客观评价与局限 | 以理念差异收束：理念优势(自主可控)的代价(生态、社区活力、软件兼容)；与 UOS/Deepin 对比 | 维基+分析 |

## 已核验的关键事实

- 2001 年国防科大启动，863 计划，命名"qilin/麒麟"
- 早期基于 FreeBSD 5.3（2006 年被分析相似度 99.45%）
- 3.0 起转 Linux 内核
- 2010 年与中标软件合作推出 NeoKylin
- 2013 年 Ubuntu Kylin 13.04（Canonical + 工信部）
- 2020 年 8 月 Kylin V10 发布
- 2022 年 7 月 openKylin（"开放麒麟"）开源，开放原子开源基金会孵化，木兰宽松许可证 v2（MulanPSL2），最新有 openKylin 3.0
- UKUI = Ultimate Kylin User Interface，Qt 编写，fork 自 MATE，稳定版 4.0（2023），类 Win7 视觉，轻量
- 支持架构：x86-64、ARM（信创扩展龙芯/飞腾/鲲鹏等，标注以官方为准）
- 商业版 Kylin 本体为专有软件；openKylin 为开源

### 管理维护理念（与其他发行版的差异，本报告重点）

- openKylin 定位"开源根社区"——不依赖其他发行版作上游，要建自主技术栈，区别于 Ubuntu(基于 Debian 下游)、Fedora(自身即上游)
- 治理：开放原子开源基金会孵化运营 + 技术委员会设 SIG 组 + CLA 贡献协议；社区原则"开源、自愿、平等、协作"
- 许可证：木兰宽松许可证 v2（MulanPSL2），区别于 Debian/Fedora 的自由许可证体系
- 维护驱动：自主可控 / 信创合规优先，而非纯技术先进性或社区共识
- 双轨：商业版银河麒麟(专有) + 社区版 openKylin(开源)，区别于 Fedora(社区)→RHEL(商业) 的单向上下游模式

### 内核源码（openKylin 开源内核，可深挖）

- 仓库 `gitee.com/openkylin/kernel`，已迁移至 GitCode（gitcode.com/openkylin/linux）继续维护
- 许可证 GPL-2.0 WITH Linux-syscall-note（标准 Linux 内核）
- 主要基于 **Linux 6.6 LTS**，同时维护 6.1、5.15，有 6.12、7.0 开发线
- 约 19 个分支，国产 CPU 适配分支：`linux-zhaoxin-5.15`（兆芯）、`sandbox/intel/`（Intel）
- openKylin 发行版分支以河流命名：`openkylin/huanghe`（黄河）、`openkylin/nile`（尼罗）、`openkylin/yangtze`（长江）
- 定制文件：`Kconfig.kylin`、`Makefile.kylin`（麒麟专属内核配置/构建规则）
- **与主线 Linux 的差别**（可从仓库实据看到）：
  - 上游不存在的定制文件：`Kconfig.kylin`、`Makefile.kylin`、`MAINTAINERS-DIR`
  - 新增上游没有的 CONFIG 选项，如 PR #70 `Add CONFIG_DRM_MWV207=m`（启用特定显示驱动，疑国产 GPU 相关）
  - `ok` 后缀版本号方案：`dev/6.6.0-15.0ok10`、`build/6.6.0-23.0ok2`
  - Debian 风格内核打包：`debian/`、`debian.master/` 目录
  - 提交量远超上游 6.6（126 万+ 提交，含大量 openKylin 额外提交）
- 逐补丁差异需 `git diff upstream` 才能详列，Gitee 仓库已转只读归档——本文点到结构性差异，不逐条列举补丁
- 商业版银河麒麟的专有内核补丁不公开，不可得——深挖限于开源 openKylin 内核

## 写作原则

- 核验过的事实以维基/官方为准；易变项（版本号、规格、价格）标注"截至撰写时"或"以官方最新为准"
- 不编造使用体验——体验部分以"公开评测/社区反馈汇总"形式呈现，明确标注来源性质，不伪装亲历
- **待核验内容（第七、八章）**：不可变文件系统、玲珑/应用生态的权威英文资料覆盖不足。写作时先尽力补核（openKylin 官方文档/中文社区/玲珑官方仓库）；**核验到的写为事实并标注来源，核验不到的以"行业趋势/方向性描述"呈现并明确标注"具体实现以官方文档为准"，绝不把未核实的细节写成既成事实**
- 沿用博客风格：前言 → 分章 → 对比表 → 总结，带 frontmatter（title/description/category/tags/date）

## frontmatter

```yaml
title: KylinOS 调查报告
description: 银河麒麟操作系统的来历、技术演进、版本谱系与架构调查报告
category: 信创
tags: [KylinOS, 银河麒麟, 国产操作系统, 信创, Linux, UKUI]
recommend: false
date: 2026-07-01
```

## 不做（YAGNI）

- 不做实际安装/真机体验（环境限制 + 用户未亲历）
- 不挂系列（单篇独立）
- 不深挖具体内核补丁的逐行代码细节（点到仓库、分支、定制文件层面即可，不做逐 commit 考古）
