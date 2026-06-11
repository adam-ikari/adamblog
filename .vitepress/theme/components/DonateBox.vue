<script setup lang="ts">
import { ref } from 'vue'

const xmrAddress = '44YiYqoKSQhMSs1okCBbxJi876t4hEEozGuioN5snRvdG6m1NkAyRHZFFjD8Ka61NH7pL5aFKaAf2VX1WdW8W8pwBh2cK6k'
const copied = ref(false)

function copyAddress() {
  navigator.clipboard.writeText(xmrAddress)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="donate-box">
    <div class="donate-header">
      <span class="donate-icon">☕</span>
      <span class="donate-title">请我喝杯咖啡</span>
    </div>
    <p class="donate-desc">如果你觉得文章有帮助，欢迎用 Monero (XMR) 打赏，完全匿名，无需注册。</p>
    <div class="donate-content">
      <div class="donate-qr">
        <img src="/images/xmr-donate.png" alt="Monero Donate QR Code" />
        <span class="donate-label">扫码打赏 XMR</span>
      </div>
      <div class="donate-address">
        <span class="address-label">Monero 地址：</span>
        <div class="address-box">
          <code class="address-text">{{ xmrAddress }}</code>
          <button class="copy-btn" @click="copyAddress">
            {{ copied ? '✓ 已复制' : '复制' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donate-box {
  margin-top: 2rem;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand-soft);
  background: var(--vp-c-bg-soft);
}

.donate-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.donate-icon {
  font-size: 1.25rem;
}

.donate-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.donate-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.donate-content {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.donate-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.donate-qr img {
  width: 140px;
  height: 140px;
  border-radius: 4px;
  image-rendering: pixelated;
}

.donate-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.donate-address {
  flex: 1;
  min-width: 200px;
}

.address-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  display: block;
  margin-bottom: 0.4rem;
}

.address-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.address-text {
  display: block;
  font-size: 0.7rem;
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  word-break: break-all;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  flex: 1;
}

.copy-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 4px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.copy-btn:hover {
  opacity: 0.85;
}
</style>
