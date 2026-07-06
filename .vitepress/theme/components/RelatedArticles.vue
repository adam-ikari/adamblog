<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vitepress'

interface RelatedItem {
  title: string
  link: string
  date: string
}

const route = useRoute()
const router = useRouter()

// 构建时由 related-posts 插件生成：每篇文章 top-10 相似文章
const tfidfMap = ref<Record<string, RelatedItem[]>>({})
const ready = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('/related-posts.json')
    if (res.ok) tfidfMap.value = await res.json()
  } catch {}
  finally {
    ready.value = true
  }
})

// 当前文章路径归一化为 related-posts.json 的 key 形式：/posts/xxx
const currentKey = computed(() =>
  decodeURIComponent(route.path).replace(/\.html$/, '').replace(/\/index$/, ''),
)

const relatedList = computed<RelatedItem[]>(() => {
  if (!ready.value) return []
  return tfidfMap.value[currentKey.value] || []
})

const hasRelated = computed(() => relatedList.value.length > 0)

function formatShowDate(date: string): string {
  if (!date) return ''
  return date
}

function handleLinkClick(link: string) {
  router.go(link)
}
</script>

<template>
  <div v-if="hasRelated" class="related-articles" data-pagefind-ignore="all">
    <div class="ra-header">
      <span class="ra-label">🔗 相关文章</span>
      <span class="ra-count">{{ relatedList.length }} 篇</span>
    </div>
    <ol class="ra-list">
      <li v-for="(item, idx) in relatedList" :key="item.link" class="ra-item">
        <span class="ra-num">{{ idx + 1 }}</span>
        <a
          class="ra-title"
          :href="item.link"
          @click="(e) => {
            e.preventDefault()
            handleLinkClick(item.link)
          }"
        >
          <span>{{ item.title }}</span>
        </a>
        <span v-if="item.date" class="ra-date">{{ formatShowDate(item.date) }}</span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.related-articles {
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand-soft);
  background: var(--vp-c-bg-soft);
}

.ra-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ra-label {
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

.ra-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-left: auto;
}

.ra-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.ra-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.2rem 0;
}

.ra-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 22px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border-radius: 4px;
}

.ra-title {
  flex: 1 1 auto;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}

.ra-title:hover {
  color: var(--vp-c-brand-1);
}

.ra-date {
  flex: 0 0 auto;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

@media screen and (max-width: 768px) {
  .related-articles {
    padding: 0.875rem 1rem;
  }

  .ra-title {
    font-size: 0.82rem;
  }
}
</style>
