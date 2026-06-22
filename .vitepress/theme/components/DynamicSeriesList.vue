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
  articles: SeriesArticle[]
}

const { frontmatter } = useData()

const seriesList = computed(() => {
  return (frontmatter.value?.seriesList as SeriesInfo[] | undefined) || []
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
        :href="`/series/series-${series.id}`"
        class="series-item"
      >
        <span class="series-name">{{ series.name }}</span>
        <span class="series-count">{{ series.articles.length }} 篇</span>
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.series-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
}

.series-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.series-name {
  font-weight: 500;
}

.series-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
</style>
