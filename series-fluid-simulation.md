---
title: 流体仿真系列
layout: page
publish: false
---

<div class="series-page">

# 流体仿真系列

本系列教程带你从 Python 环境配置开始，逐步学习流体仿真基础，并使用 AI 辅助编写仿真代码。

| 序号 | 文章 | 简介 |
|------|------|------|
| 1 | [macOS 配置 Python 环境（uv 教程）](/posts/macOS-配置Python环境教程-uv) | uv 安装、Python 版本管理、项目配置 |
| 2 | [流体仿真入门](/posts/流体仿真入门) | CFD 基础概念、数值方法、Python 工具 |
| 3 | [使用 AI 编写 Python 流体仿真代码](/posts/使用AI编写Python流体仿真代码) | Claude Code 辅助开发实战 |

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
