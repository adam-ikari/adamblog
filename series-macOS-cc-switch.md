---
title: macOS 配置 cc-Switch 系列
layout: page
publish: false
---

<div class="series-page">

# macOS 配置 cc-Switch 系列

本系列教程帮助你在 macOS 上配置 cc-Switch 命令行工具，实现 Claude Code 的多提供商/账户切换。

| 序号 | 文章 | 简介 |
|------|------|------|
| 1 | [macOS 开发环境准备教程](/posts/macOS-环境准备教程) | Homebrew、Node.js、终端配置 |
| 2 | [macOS 配置 cc-Switch 教程](/posts/macOS-配置cc-Switch教程) | 安装、配置、使用场景 |

> 💡 第 1 篇同时属于 **macOS 配置 Claude Code 系列**，第 2 篇也属于该系列。

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
