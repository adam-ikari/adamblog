import sharp from 'sharp'
import type { Plugin } from 'vite'

/**
 * 构建时自动压缩图片：
 * - PNG/JPG 资产用 sharp 重新压缩（PNG 用调色板压缩，JPG 质量 80）
 * - 不改格式、不改文件名哈希、不改引用，只减小体积
 * - 跳过已是很小的图（< 4KB）
 * - 跳过 webp/gif/svg（webp 已压缩，gif/svg 无损）
 *
 * 仅处理 vite 打包进 assets 的图片（即 posts/ 下被相对引用的图，
 * 迁移后都走这条路）。public/ 下的图不经 vite，不在此处理。
 */
export function imageCompressPlugin(): Plugin {
  return {
    name: 'image-compress',
    apply: 'build',
    async generateBundle(_opts, bundle) {
      const tasks: Promise<void>[] = []
      for (const [fileName, chunk] of Object.entries(bundle)) {
        const type = (chunk as any).type
        if (type !== 'asset') continue
        const src = (chunk as any).source
        if (!(src instanceof Uint8Array) && typeof src !== 'string') continue
        const isImg = /\.(png|jpe?g)$/i.test(fileName)
        if (!isImg) continue

        const buf = typeof src === 'string' ? Buffer.from(src) : Buffer.from(src)
        if (buf.length < 4 * 1024) continue // 小图跳过

        tasks.push(
          (async () => {
            try {
              let out: Buffer
              if (/\.png$/i.test(fileName)) {
                out = await sharp(buf, { failOn: 'none' })
                  .png({ quality: 80, palette: true, compressionLevel: 9 })
                  .toBuffer()
              } else {
                out = await sharp(buf, { failOn: 'none' })
                  .jpeg({ quality: 80, mozjpeg: true })
                  .toBuffer()
              }
              // 只在确实变小时替换
              if (out.length < buf.length) {
                ;(chunk as any).source = out
                console.log(`  图片压缩 ${fileName}: ${(buf.length / 1024).toFixed(0)}KB -> ${(out.length / 1024).toFixed(0)}KB`)
              }
            } catch (e: any) {
              console.warn(`  图片压缩失败 ${fileName}: ${e.message}`)
            }
          })()
        )
        if (tasks.length >= 8) {
          await Promise.all(tasks)
          tasks.length = 0
        }
      }
      if (tasks.length) await Promise.all(tasks)
    },
  }
}
