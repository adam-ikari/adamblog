---
title: 所有文章
layout: page
---

<script setup>
import { data as posts } from './posts.data.mjs'
</script>

<div class="post-list">
  <div v-for="post of posts" class="post-item">
    <h3 class="post-title">
      <a :href="post.url">{{ post.title }}</a>
    </h3>
    <div class="post-meta">
      <span v-if="post.date">{{ post.date }}</span>
      <span v-if="post.category" class="category-badge">{{ post.category }}</span>
    </div>
    <div v-if="post.tags" class="post-tags">
      <span v-for="tag in post.tags" class="post-tag">{{ tag }}</span>
    </div>
  </div>
</div>
