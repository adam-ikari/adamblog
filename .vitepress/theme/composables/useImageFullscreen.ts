import { onMounted, onUnmounted } from 'vue'

/**
 * 文章插图点击全屏查看：
 * - 点击正文内任意 <img> 触发浏览器原生全屏（Fullscreen API）
 * - 全屏后自动锁定屏幕方向为横向（Screen Orientation API，仅移动端生效）
 * - 退出全屏时解锁方向、还原
 * - 支持滚轮缩放、双指缩放、拖拽平移
 *
 * 用 capture 阶段在 document 上拦截，stopImmediatePropagation 阻止
 * 主题自带的图片预览组件（@sugarat/theme BlogImagePreview）接管点击。
 */

function isContentImage(img: HTMLImageElement): boolean {
  // 只处理正文内容区的图片，跳过头像、图标、装饰图等
  const content = img.closest('.vp-doc, article, .VPDoc .content, .content-container')
  if (!content) return false
  // 跳过极小图标（宽高都小于 100px 视为非插图）
  const rect = img.getBoundingClientRect()
  if (rect.width < 100 && rect.height < 100) return false
  return true
}

// 缩放状态
let scale = 1
let translateX = 0
let translateY = 0
let isDragging = false
let startX = 0
let startY = 0
let lastTranslateX = 0
let lastTranslateY = 0
let lastDistance = 0
const minScale = 0.5
const maxScale = 5

// 创建全屏遮罩和控件
let overlay: HTMLDivElement | null = null
let imageEl: HTMLImageElement | null = null
let toolbarEl: HTMLDivElement | null = null
let scaleDisplay: HTMLSpanElement | null = null

function createOverlay(src: string) {
  if (overlay) return

  overlay = document.createElement('div')
  overlay.style.cssText = `
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
  `

  // 工具栏
  toolbarEl = document.createElement('div')
  toolbarEl.style.cssText = `
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
  `

  const zoomOutBtn = document.createElement('button')
  zoomOutBtn.textContent = '➖'
  zoomOutBtn.title = '缩小'

  scaleDisplay = document.createElement('span')
  scaleDisplay.textContent = '100%'
  scaleDisplay.style.cssText = 'color: #fff; font-size: 14px; min-width: 50px; text-align: center; font-family: monospace;'

  const zoomInBtn = document.createElement('button')
  zoomInBtn.textContent = '➕'
  zoomInBtn.title = '放大'

  const resetBtn = document.createElement('button')
  resetBtn.textContent = '🔄'
  resetBtn.title = '重置'

  const closeBtn = document.createElement('button')
  closeBtn.textContent = '✕'
  closeBtn.title = '关闭'

  const btnStyle = `
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  `
  ;[zoomOutBtn, zoomInBtn, resetBtn, closeBtn].forEach(btn => {
    btn.style.cssText = btnStyle
    btn.addEventListener('mouseenter', () => { (btn as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)' })
    btn.addEventListener('mouseleave', () => { (btn as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)' })
  })

  zoomOutBtn.addEventListener('click', (e) => { e.stopPropagation(); zoomOut() })
  zoomInBtn.addEventListener('click', (e) => { e.stopPropagation(); zoomIn() })
  resetBtn.addEventListener('click', (e) => { e.stopPropagation(); resetZoom() })
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeOverlay() })

  toolbarEl.append(zoomOutBtn, scaleDisplay, zoomInBtn, resetBtn, closeBtn)

  // 图片容器
  const container = document.createElement('div')
  container.style.cssText = `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    touch-action: none;
  `

  imageEl = document.createElement('img')
  imageEl.src = src
  imageEl.style.cssText = `
    max-width: 90%;
    max-height: 85vh;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
    transition: none;
    cursor: grab;
  `

  container.appendChild(imageEl)
  overlay.appendChild(toolbarEl)
  overlay.appendChild(container)

  // 底部提示
  const hint = document.createElement('div')
  hint.textContent = '滚轮缩放 / 拖拽移动 / 双指缩放 / ESC关闭'
  hint.style.cssText = `
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    pointer-events: none;
  `
  overlay.appendChild(hint)

  // 事件绑定
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay()
  })

  container.addEventListener('wheel', onWheel, { passive: false })
  container.addEventListener('mousedown', onMouseDown)
  container.addEventListener('mousemove', onMouseMove)
  container.addEventListener('mouseup', onMouseUp)
  container.addEventListener('mouseleave', onMouseUp)
  container.addEventListener('touchstart', onTouchStart, { passive: false })
  container.addEventListener('touchmove', onTouchMove, { passive: false })
  container.addEventListener('touchend', onTouchEnd)

  document.body.appendChild(overlay)
  document.body.style.overflow = 'hidden'
}

function updateTransform() {
  if (imageEl) {
    imageEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
  }
  if (scaleDisplay) {
    scaleDisplay.textContent = `${Math.round(scale * 100)}%`
  }
}

function zoomIn() {
  scale = Math.min(scale * 1.2, maxScale)
  updateTransform()
}

function zoomOut() {
  scale = Math.max(scale / 1.2, minScale)
  updateTransform()
}

function resetZoom() {
  scale = 1
  translateX = 0
  translateY = 0
  updateTransform()
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  scale = Math.min(Math.max(scale + delta, minScale), maxScale)
  updateTransform()
}

function onMouseDown(e: MouseEvent) {
  isDragging = true
  startX = e.clientX
  startY = e.clientY
  lastTranslateX = translateX
  lastTranslateY = translateY
  if (imageEl) imageEl.style.cursor = 'grabbing'
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  translateX = lastTranslateX + dx
  translateY = lastTranslateY + dy
  updateTransform()
}

function onMouseUp() {
  isDragging = false
  if (imageEl) imageEl.style.cursor = 'grab'
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    lastDistance = Math.sqrt(dx * dx + dy * dy)
  } else if (e.touches.length === 1) {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    lastTranslateX = translateX
    lastTranslateY = translateY
  }
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (lastDistance > 0) {
      const delta = distance / lastDistance
      scale = Math.min(Math.max(scale * delta, minScale), maxScale)
    }
    lastDistance = distance
    updateTransform()
  } else if (e.touches.length === 1) {
    const dx = e.touches[0].clientX - startX
    const dy = e.touches[0].clientY - startY
    translateX = lastTranslateX + dx
    translateY = lastTranslateY + dy
    updateTransform()
  }
}

function onTouchEnd() {
  lastDistance = 0
}

function closeOverlay() {
  if (overlay) {
    overlay.remove()
    overlay = null
    imageEl = null
    toolbarEl = null
    scaleDisplay = null
  }
  scale = 1
  translateX = 0
  translateY = 0
  isDragging = false
  lastDistance = 0
  document.body.style.overflow = ''
}

function onKeyDown(e: KeyboardEvent) {
  if (!overlay) return
  if (e.key === 'Escape') closeOverlay()
  if (e.key === '+' || e.key === '=') zoomIn()
  if (e.key === '-') zoomOut()
  if (e.key === '0') resetZoom()
}

async function enterFullscreen(img: HTMLImageElement) {
  const el = img as HTMLImageElement & {
    webkitRequestFullscreen?: () => Promise<void> | void
    webkitEnterFullscreen?: () => void
  }
  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen()
    }
    else if (el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen()
    }
    else if (el.webkitEnterFullscreen) {
      // iOS Safari <img> 专有 API
      el.webkitEnterFullscreen()
    }
  }
  catch {
    // 用户拒绝或环境不支持，静默
  }
}

async function lockLandscape() {
  try {
    await (screen.orientation as Orientation & {
      lock?: (o: 'landscape' | 'portrait') => Promise<void>
    }).lock?.('landscape')
  }
  catch {
    // 桌面端或不支持方向锁，静默；全屏本身仍生效
  }
}

function unlockOrientation() {
  try {
    (screen.orientation as Orientation & {
      unlock?: () => void
    }).unlock?.()
  }
  catch {
    // 静默
  }
}

function onFullscreenChange() {
  const fsEl = document.fullscreenElement
  if (!fsEl) {
    // 退出全屏：还原方向
    unlockOrientation()
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
  }
}

export function useImageFullscreen() {
  function onClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.tagName.toLowerCase() !== 'img') return
    const img = target as HTMLImageElement
    if (!isContentImage(img)) return

    // 拦截后续（主题自带）监听
    e.stopImmediatePropagation()
    e.stopPropagation()
    e.preventDefault()

    // 已全屏则不重复进入
    if (document.fullscreenElement) return

    // 使用新的缩放遮罩代替原生全屏
    createOverlay(img.src)
  }

  onMounted(() => {
    // capture: true 保证先于主题的冒泡阶段监听执行
    document.addEventListener('click', onClick, { capture: true })
    document.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('click', onClick, { capture: true } as EventListenerOptions)
    document.removeEventListener('keydown', onKeyDown)
    closeOverlay()
  })
}
