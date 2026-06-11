---
title: Windows 11 AI 工具系列
layout: page
publish: false
---

<div class="series-page">

# Windows 11 AI 工具系列

本系列教程帮助你在 Windows 11 + WSL2 环境下配置和使用 AI 开发工具。

| 序号 | 文章 | 简介 |
|------|------|------|
| 1 | [Windows 11 配置 WSL2 完整教程](/posts/Windows11-配置WSL2教程) | WSL2 安装、Linux 发行版、基础配置 |
| 2 | [WSL2 安装和使用 Claude Code 教程](/posts/WSL2-安装和使用-Claude-Code-教程) | Claude Code 安装、认证、使用 |
| 3 | [cc-Switch CLI 使用教程](/posts/cc-Switch-CLI-使用教程) | 多提供商/账户切换 |

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
