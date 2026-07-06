import { onMounted, onUnmounted } from 'vue'

/**
 * 文章插图点击全屏查看：
 * - 点击正文内任意 <img> 触发浏览器原生全屏（Fullscreen API）
 * - 全屏后自动锁定屏幕方向为横向（Screen Orientation API，仅移动端生效）
 * - 退出全屏时解锁方向、还原
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

    enterFullscreen(img).then(() => {
      // 仅当真的进入了全屏，才尝试锁横屏 + 监听退出
      if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
        lockLandscape()
        document.addEventListener('fullscreenchange', onFullscreenChange)
        document.addEventListener('webkitfullscreenchange', onFullscreenChange)
      }
    })
  }

  onMounted(() => {
    // capture: true 保证先于主题的冒泡阶段监听执行
    document.addEventListener('click', onClick, { capture: true })
  })

  onUnmounted(() => {
    document.removeEventListener('click', onClick, { capture: true } as EventListenerOptions)
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
  })
}
