<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  src: string
  alt?: string
}

const props = defineProps<Props>()

const isOpen = ref(false)
const scale = ref(1)
const minScale = 0.5
const maxScale = 5
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const translateX = ref(0)
const translateY = ref(0)
const lastTranslateX = ref(0)
const lastTranslateY = ref(0)
const lastDistance = ref(0)

function open() {
  isOpen.value = true
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
  lastTranslateX.value = 0
  lastTranslateY.value = 0
  document.body.style.overflow = 'hidden'
}

function close() {
  isOpen.value = false
  document.body.style.overflow = ''
}

function zoomIn() {
  scale.value = Math.min(scale.value * 1.2, maxScale)
}

function zoomOut() {
  scale.value = Math.max(scale.value / 1.2, minScale)
}

function resetZoom() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
  lastTranslateX.value = 0
  lastTranslateY.value = 0
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const newScale = Math.min(Math.max(scale.value + delta, minScale), maxScale)
  scale.value = newScale
}

function onMouseDown(e: MouseEvent) {
  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  lastTranslateX.value = translateX.value
  lastTranslateY.value = translateY.value
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  const dx = e.clientX - startX.value
  const dy = e.clientY - startY.value
  translateX.value = lastTranslateX.value + dx
  translateY.value = lastTranslateY.value + dy
}

function onMouseUp() {
  isDragging.value = false
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 2) {
    // 双指缩放
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    lastDistance.value = Math.sqrt(dx * dx + dy * dy)
  } else if (e.touches.length === 1) {
    startX.value = e.touches[0].clientX
    startY.value = e.touches[0].clientY
    lastTranslateX.value = translateX.value
    lastTranslateY.value = translateY.value
  }
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  if (e.touches.length === 2) {
    // 双指缩放
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (lastDistance.value > 0) {
      const delta = distance / lastDistance.value
      scale.value = Math.min(Math.max(scale.value * delta, minScale), maxScale)
    }
    lastDistance.value = distance
  } else if (e.touches.length === 1) {
    const dx = e.touches[0].clientX - startX.value
    const dy = e.touches[0].clientY - startY.value
    translateX.value = lastTranslateX.value + dx
    translateY.value = lastTranslateY.value + dy
  }
}

function onTouchEnd() {
  lastDistance.value = 0
}

function onKeyDown(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  if (e.key === '+' || e.key === '=') zoomIn()
  if (e.key === '-') zoomOut()
  if (e.key === '0') resetZoom()
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
})

watch(isOpen, (val) => {
  if (!val) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="zoomable-image-wrapper" @click="open">
    <img :src="props.src" :alt="props.alt || ''" class="zoomable-image-thumb" />
    <div class="zoom-hint">🔍 点击放大</div>
  </div>

  <Teleport to="body">
    <div
      v-if="isOpen"
      class="zoom-overlay"
      @click="close"
    >
      <div class="zoom-toolbar">
        <button @click.stop="zoomOut" title="缩小 (-)">➖</button>
        <span class="zoom-scale">{{ Math.round(scale * 100) }}%</span>
        <button @click.stop="zoomIn" title="放大 (+)">➕</button>
        <button @click.stop="resetZoom" title="重置 (0)">🔄</button>
        <button @click.stop="close" title="关闭 (Esc)">✕</button>
      </div>
      <div
        class="zoom-image-container"
        @click.stop
        @wheel="onWheel"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <img
          :src="props.src"
          :alt="props.alt || ''"
          class="zoom-image"
          :style="{
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }"
        />
      </div>
      <div class="zoom-hint-bar">
        滚轮缩放 / 拖拽移动 / 双指缩放 / ESC关闭
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.zoomable-image-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
  max-width: 100%;
}

.zoomable-image-thumb {
  max-width: 100%;
  border-radius: 8px;
  transition: opacity 0.2s;
}

.zoomable-image-wrapper:hover .zoomable-image-thumb {
  opacity: 0.85;
}

.zoom-hint {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.zoomable-image-wrapper:hover .zoom-hint {
  opacity: 1;
}

.zoom-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.92);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.zoom-toolbar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(40, 40, 40, 0.9);
  padding: 8px 16px;
  border-radius: 8px;
  z-index: 10000;
}

.zoom-toolbar button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.zoom-toolbar button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.zoom-scale {
  color: #fff;
  font-size: 14px;
  min-width: 50px;
  text-align: center;
  font-family: monospace;
}

.zoom-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: none;
}

.zoom-image {
  max-width: 90%;
  max-height: 85vh;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  transition: none;
}

.zoom-hint-bar {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  pointer-events: none;
}

@media (max-width: 768px) {
  .zoom-toolbar {
    padding: 6px 10px;
    gap: 4px;
  }

  .zoom-toolbar button {
    padding: 4px 8px;
    font-size: 12px;
  }

  .zoom-scale {
    font-size: 12px;
    min-width: 40px;
  }

  .zoom-hint-bar {
    font-size: 11px;
  }
}
</style>
