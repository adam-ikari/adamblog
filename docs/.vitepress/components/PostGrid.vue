<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Post {
  title: string
  url: string
  date: string
  category?: string
  excerpt?: string
  tags?: string[]
}

const posts = ref<Post[]>([])
const currentPage = ref(1)
const postsPerPage = 9

// 获取所有文章
onMounted(async () => {
  const modules = import.meta.glob('/posts/*/index.md', { eager: true })
  posts.value = Object.values(modules)
    .map((mod: any) => {
      const frontmatter = mod.default?.frontmatter || {}
      const url = mod.default?.relativePath.replace('index.md', '') || ''
      return {
        title: frontmatter.title || '无标题',
        url: '/' + url,
        date: frontmatter.date || '',
        category: frontmatter.categories?.[0] || '',
        excerpt: frontmatter.description || '',
        tags: frontmatter.tags || []
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// 计算总页数
const totalPages = computed(() => Math.ceil(posts.value.length / postsPerPage))

// 当前页的文章
const currentPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return posts.value.slice(start, end)
})

// 切换页面
const goToPage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}
</script>

<template>
  <div class="post-grid-container">
    <div class="post-grid">
      <div v-for="post in currentPosts" :key="post.url" class="post-card">
        <h3>
          <a :href="post.url">{{ post.title }}</a>
        </h3>
        <div class="post-meta">
          <span v-if="post.date">📅 {{ post.date }}</span>
          <span v-if="post.category">📂 {{ post.category }}</span>
        </div>
        <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
        <div v-if="post.tags && post.tags.length > 0" class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        上一页
      </button>

      <div class="page-numbers">
        <button
          v-for="page in totalPages"
          :key="page"
          class="page-number"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<style scoped>
.post-grid-container {
  padding: 1rem 0;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.post-card h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  line-height: 1.4;
}

.post-card h3 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.post-card h3 a:hover {
  color: var(--vp-c-brand);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.post-excerpt {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.6;
  flex-grow: 1;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-radius: 9999px;
  font-size: 0.8125rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.page-btn {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: var(--vp-c-brand);
  color: var(--vp-c-bg-invert);
  border-color: var(--vp-c-brand);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.page-number {
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
}

.page-number.active {
  background: var(--vp-c-brand);
  color: var(--vp-c-bg-invert);
  border-color: var(--vp-c-brand);
}

@media (max-width: 768px) {
  .post-grid {
    grid-template-columns: 1fr;
  }

  .pagination {
    gap: 0.5rem;
  }

  .page-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .page-number {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
  }
}
</style>