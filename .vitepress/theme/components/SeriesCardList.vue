<script setup lang="ts">
interface Article {
  title: string
  desc: string
  link: string
  order: number
}

const props = defineProps<{
  articles: Article[]
}>()
</script>

<template>
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