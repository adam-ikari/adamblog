---
title: 关于我
layout: page
---

<div class="about-page">

# 关于我

欢迎来到 Adam 的博客！

我是一名热爱技术的开发者，在这里记录和分享我的学习过程。

## 联系方式

- GitHub: [adam-ikari](https://github.com/adam-ikari)

## 关于本站

本站使用 [VitePress](https://vitepress.dev/) + [@sugarat/theme](https://theme.sugarat.top/) 构建，使用 Markdown 编写文章，通过 Git 管理版本。

</div>

<style>
.about-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
}
.about-page h1 {
  margin-bottom: 1rem;
}
.about-page h2 {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}
</style>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 隐藏关于页的文章特征元素
  const footer = document.querySelector('.VPDocFooter')
  if (footer) footer.style.display = 'none'
  const lastUpdated = document.querySelector('.VPLastUpdated')
  if (lastUpdated) lastUpdated.style.display = 'none'
})
</script>
