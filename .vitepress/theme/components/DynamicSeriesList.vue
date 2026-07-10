<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface SeriesArticle {
  title: string
  link: string
  order: number
}

interface SeriesInfo {
  id: string
  name: string
  description?: string
  articles: SeriesArticle[]
}

const { theme, frontmatter } = useData()

// 优先读 frontmatter.seriesList（series/index.md 静态维护，可靠），
// themeConfig.seriesList 作兜底（buildEnd 注入，受构建时机影响可能为空）
const seriesList = computed(() => {
  return (frontmatter.value?.seriesList as SeriesInfo[] | undefined)
    || (theme.value?.seriesList as SeriesInfo[] | undefined)
    || []
})
</script>

<template>
  <div class="dynamic-series-list">
    <div v-if="seriesList.length === 0" class="series-empty">
      暂无系列数据
    </div>
    <div v-else class="series-items">
      <a
        v-for="series in seriesList"
        :key="series.id"
        :href="`/series/${series.id}`"
        class="series-item"
      >
        <div class="series-head">
          <span class="series-name">{{ series.name }}</span>
          <span class="series-count">{{ series.articles.length }} 篇</span>
        </div>
        <p v-if="series.description" class="series-desc">{{ series.description }}</p>
      </a>
    </div>
  </div>
</template>

<style scoped>
.dynamic-series-list {
  margin: 1rem 0;
}

.series-empty {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-3);
}

.series-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.series-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
}

.series-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-2px);
}

.series-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.series-name {
  font-weight: 600;
  font-size: 1rem;
}

.series-count {
  flex-shrink: 0;
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.series-desc {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
</style>
