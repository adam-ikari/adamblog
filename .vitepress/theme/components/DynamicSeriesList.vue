<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface SeriesInfo {
  id: string
  name: string
  description?: string
  articleCount: number
}

const { theme, frontmatter } = useData()

const seriesList = computed<SeriesInfo[]>(() => {
  // 优先使用 frontmatter.seriesList（如果用户手动配置了）
  if (frontmatter.value?.seriesList?.length > 0) {
    return (frontmatter.value.seriesList as any[]).map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      articleCount: s.articles?.length || 0,
    }))
  }

  // 否则使用 themeConfig.seriesList（由 buildEnd 脚本自动生成）
  const autoList = theme.value?.seriesList as any[] | undefined
  if (autoList?.length > 0) {
    return autoList.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      articleCount: s.articles?.length || 0,
    }))
  }

  return []
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
        <div class="series-head">
          <span class="series-name">{{ series.name }}</span>
          <span class="series-count">{{ series.articleCount }} 篇</span>
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
