---
title: macOS 配置国产大模型 API 系列
layout: page
publish: false
---

<div class="series-page">

# macOS 配置国产大模型 API 系列

Claude Code 在国内使用困难，本系列教程帮助你在 macOS 上配置国产大模型 API（讯飞 Coding Plan 等）作为替代方案，实现同样强大的 AI 编程体验。

| 序号 | 文章 | 简介 |
|------|------|------|
| 1 | [macOS 开发环境准备教程](/posts/macOS-环境准备教程) | Homebrew、Node.js、终端配置、Git |
| 2 | [macOS 安装和配置 Claude Code 教程](/posts/macOS-安装和配置-Claude-Code-教程) | 安装 Claude Code、配置国产大模型 API |
| 3 | [macOS 配置 cc-Switch 教程](/posts/macOS-配置cc-Switch教程) | 多提供商切换（讯飞/DeepSeek/OpenRouter） |

> 💡 第 1 篇同时属于 **macOS 配置 cc-Switch 系列**，第 3 篇也属于该系列。

</div>

<style>
.series-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
}
.series-page h1 {
  margin-bottom: 1rem;
}
.series-page table {
  width: 100%;
  margin-top: 1rem;
}
</style>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const footer = document.querySelector('.VPDocFooter')
  if (footer) footer.style.display = 'none'
  const lastUpdated = document.querySelector('.VPLastUpdated')
  if (lastUpdated) lastUpdated.style.display = 'none'
})
</script>
