---
title: AI 编程工具系列
description: AI 编程工具系列总索引，汇总 macOS/Windows 上配置 Claude Code 和国产大模型 API 的教程
date: 2026-06-09
category: 技术探索
tags: [AI, Claude-Code, 系列]
recommend: false
top: 999
---

# AI 编程工具系列

Claude Code 是强大的 AI 编程助手，但在国内使用需要配置替代 API。本系列从环境准备到多提供商切换，帮你搭建完整的 AI 编程工作流。

<SeriesCardList :articles="[
  { title: 'macOS 配置国产大模型 API 系列', desc: 'macOS 上安装 Claude Code 并配置讯飞/DeepSeek 等国产 API', link: '/series/series-macOS-claude', order: 1 },
  { title: 'macOS 配置 cc-Switch 系列', desc: '使用 cc-Switch 在多个 API 提供商之间一键切换', link: '/series/series-macOS-cc-switch', order: 2 },
  { title: 'Windows 11 AI 工具系列', desc: 'WSL2 环境下安装和使用 Claude Code', link: '/series/series-windows-ai', order: 3 },
  { title: '流体仿真系列', desc: '从 Python 环境到 AI 辅助编写流体仿真代码', link: '/series/series-fluid-simulation', order: 4 },
]" />
