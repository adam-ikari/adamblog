<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface Article {
  title: string
  link: string
  order: number
}

interface SeriesData {
  id: string
  name: string
  description: string
  articles: Article[]
}

const props = defineProps<{
  seriesId?: string
}>()

const { theme, frontmatter } = useData()

const seriesData = computed<SeriesData | null>(() => {
  const id = props.seriesId || frontmatter.value?.seriesId
  if (!id) return null

  const seriesList = theme.value?.seriesList as SeriesData[] | undefined
  if (!seriesList) return null

  return seriesList.find((s: SeriesData) => s.id === id) || null
})

const articles = computed(() => {
  return seriesData.value?.articles || []
})
</script>

<template>
  <div v-if="seriesData" class="series-detail">
    <p class="series-desc">{{ seriesData.description }}</p>
    <div class="series-card-list">
      <a
        v-for="article in articles"
        :key="article.order"
        :href="article.link"
        class="series-card"
      >
        <div class="series-card-order">{{ article.order }}</div>
        <div class="series-card-content">
          <p class="series-card-title">{{ article.title }}</p>
        </div>
        <span class="series-card-arrow">→</span>
      </a>
    </div>
  </div>
  <div v-else class="series-empty">
    未找到系列数据
  </div>
</template>

<style scoped>
.series-detail {
  margin: 1rem 0;
}

.series-desc {
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.series-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.series-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}

.series-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.series-card-order {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.series-card-content {
  flex: 1;
  min-width: 0;
}

.series-card-title {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin: 0;
}

.series-card-arrow {
  color: var(--vp-c-text-3);
  font-size: 1.2rem;
  transition: color 0.2s;
}

.series-card:hover .series-card-arrow {
  color: var(--vp-c-brand-1);
}

.series-empty {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-3);
}
</style>
