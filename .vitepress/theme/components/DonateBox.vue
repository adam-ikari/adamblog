<script setup lang="ts">
import { ref } from 'vue'

const xmrAddress = '44YiYqoKSQhMSs1okCBbxJi876t4hEEozGuioN5snRvdG6m1NkAyRHZFFjD8Ka61NH7pL5aFKaAf2VX1WdW8W8pwBh2cK6k'
const copied = ref(false)

const wallets = [
  { name: 'MyMonero', desc: '网页钱包，无需下载', url: 'https://mymonero.com' },
  { name: 'Cake Wallet', desc: '移动端钱包（iOS/Android）', url: 'https://cakewallet.com' },
  { name: 'Monero GUI', desc: '桌面端钱包（全节点）', url: 'https://www.getmonero.org/downloads/' },
]

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

    <div class="donate-method">
      <div class="method-header">
        <span class="method-name">Monero (XMR)</span>
        <span class="method-tag">匿名</span>
      </div>
      <div class="method-body">
        <div class="donate-qr">
          <img src="/images/xmr-donate.png" alt="Monero Donate QR Code" />
        </div>
        <div class="method-info">
          <!-- 钱包链接 -->
          <div class="wallet-links">
            <span class="wallet-label">打开钱包打赏：</span>
            <div class="wallet-list">
              <a v-for="w in wallets" :key="w.name" :href="w.url" target="_blank" rel="noopener" class="wallet-link">
                {{ w.name }}
                <span class="wallet-desc">{{ w.desc }}</span>
              </a>
            </div>
          </div>
          <!-- 地址 -->
          <div class="address-row">
            <span class="address-label">收款地址：</span>
            <code class="address-text">{{ xmrAddress }}</code>
            <button class="copy-btn" @click="copyAddress">
              {{ copied ? '✓' : '复制' }}
            </button>
          </div>
          <p class="method-note">选择钱包 → 粘贴地址 → 输入金额 → 发送。手机可扫码直接打赏。</p>
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
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.wallet-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.wallet-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.wallet-link {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 4px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg) !important;
  text-decoration: none;
  transition: opacity 0.2s;
  gap: 0.15rem;
}

.wallet-link:hover {
  opacity: 0.85;
}

.wallet-desc {
  font-size: 0.6rem;
  font-weight: 400;
  opacity: 0.8;
}

.address-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.address-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
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
