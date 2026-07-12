<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface Article {
  title: string
  desc: string
  link: string
  order: number
}

const props = defineProps<{
  articles?: Article[]
}>()

const { frontmatter, theme } = useData()

const displayArticles = computed(() => {
  // 优先使用传入的 articles prop
  if (props.articles && props.articles.length > 0) {
    return props.articles
  }
  // 其次从 frontmatter.seriesArticles 获取（由 config.mts 自动注入）
  const autoArticles = frontmatter.value?.seriesArticles
  if (autoArticles && Array.isArray(autoArticles) && autoArticles.length > 0) {
    return autoArticles.map((a: any) => ({
      title: a.title || '',
      desc: a.desc || '',
      link: a.link || '',
      order: a.order || 0,
    }))
  }
  // 最后从 themeConfig.seriesList 获取（由 buildEnd 脚本生成，数据更完整）
  const seriesList = theme.value?.seriesList as any[] | undefined
  const currentSeriesId = frontmatter.value?.series
  if (seriesList && currentSeriesId) {
    const currentSeries = seriesList.find((s: any) => s.id === currentSeriesId)
    if (currentSeries?.articles?.length > 0) {
      return currentSeries.articles.map((a: any) => ({
        title: a.title || '',
        desc: a.desc || '',
        link: a.link || '',
        order: a.order || 0,
      }))
    }
  }
  return []
})
</script>

<template>
  <div class="series-card-list">
    <a
      v-for="article in displayArticles"
      :key="article.order"
      :href="article.link"
      class="series-card"
    >
      <div class="series-card-order">{{ article.order }}</div>
      <div class="series-card-content">
        <p class="series-card-title">{{ article.title }}</p>
        <p class="series-card-desc">{{ article.desc }}</p>
      </div>
      <span class="series-card-arrow">→</span>
    </a>
  </div>
</template>

<style scoped>
.series-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.series-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow);
  background-color: rgba(var(--bg-gradient));
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.series-card:hover {
  box-shadow: var(--box-shadow-hover);
}

.series-card-order {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  font-size: 14px;
  font-weight: 600;
  margin-right: 16px;
  flex-shrink: 0;
}

.series-card-content {
  flex: 1;
  min-width: 0;
}

.series-card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.4;
}

.series-card-desc {
  font-size: 14px;
  color: var(--description-font-color);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.series-card-arrow {
  font-size: 18px;
  color: var(--vp-c-brand-1);
  margin-left: 12px;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.series-card:hover .series-card-arrow {
  transform: translateX(4px);
}
</style>