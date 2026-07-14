<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, withBase, useData } from 'vitepress'

interface ArticleMeta {
  title?: string
  description?: string
  date?: string
  category?: string
  recommend?: boolean
  hidden?: boolean
  [key: string]: any
}

interface ArticlePage {
  route: string
  meta: ArticleMeta
}

const router = useRouter()
const { theme } = useData()

// 从 theme.blog.pagesData 获取文章列表（构建时注入）
const docs = computed<ArticlePage[]>(() => {
  const pagesData = theme.value?.blog?.pagesData || []
  return pagesData.map((page: any) => ({
    route: page.route || '',
    meta: page.meta || {} as ArticleMeta,
  }))
})

// 推荐文章：取 recommend: true 的文章，按日期倒序
const recommendList = computed(() => {
  const data = docs.value.filter(v => v.meta.recommend === true && !v.meta.hidden)
  data.sort((a, b) => {
    const dateA = a.meta.date ? new Date(a.meta.date).getTime() : 0
    const dateB = b.meta.date ? new Date(b.meta.date).getTime() : 0
    return dateB - dateA
  })
  return data.slice(0, 6)
})

function handleLinkClick(link: string) {
  router.go(link)
}
</script>

<template>
  <div v-if="recommendList.length" class="recommend-section" data-pagefind-ignore="all">
    <div class="recommend-header">
      <h2 class="recommend-title">
        <span class="recommend-icon">⭐</span>
        精选推荐
      </h2>
    </div>
    <div class="recommend-grid">
      <a
        v-for="v in recommendList"
        :key="v.route"
        :href="withBase(v.route)"
        class="recommend-card"
        @click="(e) => {
          e.preventDefault()
          handleLinkClick(withBase(v.route))
        }"
      >
        <div class="recommend-card-title">{{ v.meta.title }}</div>
        <p v-if="v.meta.description" class="recommend-card-desc">{{ v.meta.description }}</p>
        <div class="recommend-card-meta">
          <span v-if="v.meta.date" class="recommend-card-date">{{ v.meta.date }}</span>
          <span v-if="v.meta.category" class="recommend-card-category">{{ v.meta.category }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.recommend-section {
  margin: 2rem auto;
  padding: 0 1.5rem;
  max-width: 1200px;
}

.recommend-header {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recommend-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recommend-icon {
  font-size: 1.1rem;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.recommend-card {
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

.recommend-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.recommend-card-title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.recommend-card-desc {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.recommend-card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.recommend-card-date {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.recommend-card-category {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

@media screen and (max-width: 640px) {
  .recommend-grid {
    grid-template-columns: 1fr;
  }
}
</style>
