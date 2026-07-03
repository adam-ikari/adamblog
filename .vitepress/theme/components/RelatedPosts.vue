<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const related = ref<{ title: string; link: string }[]>([])
const loaded = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('/related-posts.json')
    if (!res.ok) return
    const map: Record<string, { title: string; link: string }[]> = await res.json()
    // 当前页路径，如 /posts/xxx
    const path = page.value.filePath.replace(/^posts\//, '/posts/').replace(/\.md$/, '')
    related.value = map[path] || []
  } catch (e) {
    // 静默失败，不展示
  } finally {
    loaded.value = true
  }
})
</script>

<template>
  <div v-if="related.length" class="related-posts">
    <div class="related-header">
      <span class="related-icon">📎</span>
      <span class="related-title">相关文章</span>
    </div>
    <ul class="related-list">
      <li v-for="r in related" :key="r.link">
        <a :href="r.link" class="related-link">{{ r.title }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.related-posts {
  margin-top: 2rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.related-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.related-icon {
  font-size: 1rem;
}

.related-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.related-link {
  display: block;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  padding: 0.3rem 0;
  border-left: 2px solid var(--vp-c-divider);
  padding-left: 0.75rem;
  transition: all 0.2s;
}

.related-link:hover {
  color: var(--vp-c-brand-1);
  border-left-color: var(--vp-c-brand-1);
}
</style>
