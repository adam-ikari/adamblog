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
    <p class="donate-desc">如果你觉得文章有帮助，欢迎打赏支持。推荐使用 Monero (XMR)，完全匿名，无需注册。</p>

    <div class="donate-methods">
      <!-- Monero -->
      <div class="donate-method">
        <div class="method-header">
          <span class="method-name">Monero (XMR)</span>
          <span class="method-tag">推荐 · 匿名</span>
        </div>
        <div class="method-body">
          <div class="donate-qr">
            <img src="/images/xmr-donate.png" alt="Monero Donate QR Code" />
          </div>
          <div class="method-info">
            <a :href="'monero:' + xmrAddress" class="donate-link">
              打开钱包打赏 →
            </a>
            <div class="address-row">
              <code class="address-text">{{ xmrAddress }}</code>
              <button class="copy-btn" @click="copyAddress">
                {{ copied ? '✓' : '复制' }}
              </button>
            </div>
            <p class="method-note">扫码或点击链接直接打开 Monero 钱包打赏，也可复制地址手动转账。</p>
          </div>
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

.donate-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.donate-method {
  padding: 0.75rem;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.method-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.method-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.method-tag {
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.method-body {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.donate-qr img {
  width: 120px;
  height: 120px;
  border-radius: 4px;
  image-rendering: pixelated;
}

.method-info {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.donate-link {
  display: inline-block;
  padding: 0.4rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 4px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg) !important;
  text-decoration: none;
  transition: opacity 0.2s;
  width: fit-content;
}

.donate-link:hover {
  opacity: 0.85;
}

.address-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.address-text {
  display: block;
  font-size: 0.65rem;
  padding: 0.35rem 0.6rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  word-break: break-all;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  flex: 1;
}

.copy-btn {
  padding: 0.35rem 0.6rem;
  font-size: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.copy-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.method-note {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin: 0;
}
</style>
