/**
 * 自动生成系列页面数据脚本
 *
 * 扫描 series/ 目录下的所有 .md 文件（排除 index.md），
 * 提取 frontmatter 信息，生成 seriesList 数据注入到 themeConfig。
 *
 * 用法：在 .vitepress/config.ts 的 buildEnd 中调用
 */

import { readFileSync, readdirSync } from 'fs'
import { resolve, basename, extname } from 'path'
import matter from 'gray-matter'

interface SeriesArticle {
  title: string
  link: string
  order: number
}

interface SeriesInfo {
  id: string
  name: string
  description?: string
  articles: SeriesArticle[]
}

/**
 * 扫描 series/ 目录，自动生成 seriesList
 * @param seriesDir series 目录路径
 * @returns SeriesInfo[]
 */
export function generateSeriesList(seriesDir: string): SeriesInfo[] {
  const seriesList: SeriesInfo[] = []

  let files: string[]
  try {
    files = readdirSync(seriesDir)
  } catch {
    return seriesList
  }

  for (const file of files) {
    if (!file.endsWith('.md') || file === 'index.md') continue

    const filePath = resolve(seriesDir, file)
    const content = readFileSync(filePath, 'utf-8')
    const { data: frontmatter } = matter(content)

    // 从文件名提取 id（去掉 .md 后缀）
    const fileName = basename(file, '.md')
    const id = fileName

    // 提取系列名称：优先使用 frontmatter.title，否则使用文件名
    const name = frontmatter.title || id

    // 提取描述
    const description = frontmatter.description || ''

    // 提取文章列表（从 frontmatter.seriesArticles 或正文中解析）
    let articles: SeriesArticle[] = []

    // 如果 frontmatter 中有 seriesArticles，直接使用
    if (frontmatter.seriesArticles && Array.isArray(frontmatter.seriesArticles)) {
      articles = frontmatter.seriesArticles.map((a: any) => ({
        title: a.title || '',
        link: a.link || '',
        order: a.order || 0,
      }))
    }

    seriesList.push({
      id,
      name,
      description,
      articles,
    })
  }

  // 按名称排序
  seriesList.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))

  return seriesList
}

/**
 * VitePress buildEnd 钩子调用函数
 * 将 seriesList 写入 themeConfig
 */
export function injectSeriesList(themeConfig: any, seriesDir: string) {
  const seriesList = generateSeriesList(seriesDir)
  themeConfig.seriesList = seriesList
  console.log(`[series] 自动生成 ${seriesList.length} 个系列: ${seriesList.map(s => s.name).join(', ')}`)
}
