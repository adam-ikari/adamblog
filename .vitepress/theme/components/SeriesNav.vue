<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface SeriesNavInfo {
  id: string
  name: string
  order: number
  prev?: string
  next?: string
}

const { frontmatter } = useData()

const seriesList = computed(() => {
  const nav = frontmatter.value.seriesNav
  if (!nav || !Array.isArray(nav)) return []
  return nav as SeriesNavInfo[]
})

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
const isMultiSeries = computed(() => seriesList.value.length > 1)
</script>

<template>
  <div v-if="hasSeries" class="series-nav" :class="{ 'multi-series': isMultiSeries }">
    <!-- 单系列：保持原有样式 -->
    <template v-if="!isMultiSeries">
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
    </template>

    <!-- 多系列：使用 Tab 式布局 -->
    <template v-else>
      <div class="multi-series-header">
        <span class="series-label">📚 系列文章</span>
        <span class="series-count">共 {{ seriesData.length }} 个系列</span>
      </div>
      <div class="multi-series-list">
        <div v-for="s in seriesData" :key="s.id" class="series-card">
          <div class="series-card-header">
            <span class="series-card-name">{{ s.name }}</span>
            <span class="series-card-order">第 {{ s.currentOrder }} 篇</span>
          </div>
          <div class="series-card-nav">
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

/* 单系列样式（保持原有） */
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
  white-space: nowrap;
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

/* 多系列样式 */
.multi-series {
  padding: 1rem 1.25rem;
}

.multi-series-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.multi-series-header .series-label {
  font-size: 0.85rem;
  padding: 0.35rem 0.6rem;
}

.series-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.multi-series-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.series-card {
  padding: 0.875rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-brand-soft);
  background: var(--vp-c-bg);
  transition: all 0.2s ease;
}

.series-card:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.series-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
}

.series-card-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
}

.series-card-order {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-left: auto;
  padding: 0.15rem 0.4rem;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.series-card-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

/* 通用链接样式 */
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

/* 响应式 */
@media screen and (max-width: 768px) {
  .series-nav {
    padding: 0.875rem 1rem;
  }

  .series-banner {
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .series-name {
    width: 100%;
    order: 3;
    margin-top: 0.25rem;
  }

  .series-order {
    margin-left: auto;
  }

  .multi-series-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .series-card-header {
    flex-wrap: wrap;
  }

  .series-card-name {
    width: 100%;
    margin-bottom: 0.25rem;
  }

  .series-card-order {
    margin-left: 0;
  }

  .series-card-nav {
    gap: 0.5rem;
  }

  .series-link {
    padding: 0.3rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
