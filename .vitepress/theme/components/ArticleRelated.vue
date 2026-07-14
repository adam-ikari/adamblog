<template>
  <div class="article-related" v-if="isPost && relatedPosts.length">
    <h3 class="related-title">📚 相关文章</h3>
    <ul class="related-list">
      <li v-for="post in relatedPosts" :key="post.link" class="related-item">
        <a :href="post.link" class="related-link">
          <span class="related-title-text">{{ post.title }}</span>
          <span v-if="post.date" class="related-date">{{ post.date }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const relatedPosts = ref<{ title: string; link: string; date: string }[]>([])

// 只在文章页显示
const isPost = computed(() => page.value.relativePath?.startsWith('posts/'))

onMounted(async () => {
  if (!isPost.value) return
  try {
    const res = await fetch('/related-posts.json')
    if (!res.ok) return
    const data = await res.json()
    const currentPath = page.value.relativePath.replace(/\.md$/, '')
    const key = '/posts/' + currentPath.replace(/^posts\//, '')
    relatedPosts.value = data[key] || []
  } catch (e) {
    console.error('[ArticleRelated] 加载相关文章失败:', e)
  }
})
</script>

<style scoped>
.article-related {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.related-title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-item {
  margin: 0.5rem 0;
}

.related-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  color: var(--vp-c-brand);
  text-decoration: none;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: color 0.2s;
}

.related-link:hover {
  color: var(--vp-c-brand-dark);
}

.related-title-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-date {
  flex-shrink: 0;
  margin-left: 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}
</style>
