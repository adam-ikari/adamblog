<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

interface SeriesInfo {
  id: string
  name: string
  order: number
  prev?: string
  next?: string
}

const seriesList = computed(() => {
  const series = frontmatter.value.series
  if (!series || !Array.isArray(series)) return []
  return series as SeriesInfo[]
})

// 计算每个系列的总文章数（基于 seriesList 中的最大 order）
// 由于无法在组件中访问所有文章数据，使用 frontmatter 中的信息
const seriesData = computed(() => {
  return seriesList.value.map((s) => ({
    id: s.id,
    name: s.name,
    currentOrder: s.order,
    prev: s.prev || null,
    next: s.next || null,
  }))
})

const hasSeries = computed(() => seriesList.value.length > 0)
</script>

<template>
  <div v-if="hasSeries" class="series-nav">
    <div v-for="s in seriesData" :key="s.id" class="series-item">
      <div class="series-banner">
        <span class="series-label">📚 系列</span>
        <span class="series-name">{{ s.name }}</span>
        <span class="series-order">第 {{ s.currentOrder }} 篇</span>
      </div>
      <div class="series-navigation">
        <a v-if="s.prev" :href="s.prev" class="series-link prev">
          ← 上一篇
        </a>
        <span v-else class="series-link disabled">← 上一篇</span>
        <a v-if="s.next" :href="s.next" class="series-link next">
          下一篇 →
        </a>
        <span v-else class="series-link disabled">下一篇 →</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.series-nav {
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand-soft);
  background: var(--vp-c-bg-soft);
}

.series-item {
  margin-bottom: 0.75rem;
}

.series-item:last-child {
  margin-bottom: 0;
}

.series-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.series-label {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

.series-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.series-order {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-left: auto;
}

.series-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.series-link {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.series-link.prev,
.series-link.next {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.series-link.prev:hover,
.series-link.next:hover {
  background: var(--vp-c-brand-soft);
}

.series-link.disabled {
  color: var(--vp-c-text-3);
  pointer-events: none;
  user-select: none;
}
</style>