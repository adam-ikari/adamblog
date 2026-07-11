import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'
import markdownItPangu from 'markdown-it-pangu'
import footnote from 'markdown-it-footnote'
import { RSSOptions, RssPlugin } from 'vitepress-plugin-rss'
import { imageCompressPlugin } from './plugins/image-compress'
import { relatedPostsPlugin } from './plugins/related-posts'
import { readFileSync, readdirSync } from 'fs'
import { resolve, basename } from 'path'
import matter from 'gray-matter'

// 导入主题的配置
import { blogTheme } from './blog-theme'

const SITE_URL = 'https://adamblog.thiz.top'
const SITE_NAME = 'Adam的博客'

// RSS 订阅源配置
const RSS: RSSOptions = {
  title: SITE_NAME,
  baseUrl: SITE_URL,
  description: 'Adam的技术博客，分享编程、AI工具、流体仿真、信创等技术实践与学习心得',
  copyright: `Copyright © 2024-${new Date().getFullYear()} Adam`,
}

// 收集系列数据
const seriesMap = new Map<string, { name: string; articles: { title: string; link: string; order: number }[] }>()

/**
 * 扫描 series/ 目录，自动生成系列列表数据
 */
function scanSeriesFiles(seriesDir: string) {
  const seriesList: { id: string; name: string; description?: string; articles: { title: string; link: string; order: number }[] }[] = []

  let files: string[]
  try {
    files = readdirSync(seriesDir)
  } catch {
    return seriesList
  }

  for (const file of files) {
    if (!file.endsWith('.md')) continue

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

    // 提取文章列表（从 frontmatter.seriesArticles）
    let articles: { title: string; link: string; order: number }[] = []
    if (frontmatter.seriesArticles && Array.isArray(frontmatter.seriesArticles)) {
      articles = frontmatter.seriesArticles.map((a: any) => ({
        title: a.title || '',
        link: a.link || '',
        order: a.order || 0,
      }))
    }

    seriesList.push({ id, name, description, articles })
  }

  // 按名称排序
  seriesList.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))

  return seriesList
}

export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,

  lang: 'zh-cn',
  title: SITE_NAME,
  description: 'Adam的技术博客，分享编程、AI工具、流体仿真等技术实践与学习心得',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'author', content: 'Adam' }],
  ],

  themeConfig: {
    outline: {
      level: [2, 3],
      label: '目录'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',

    logo: '/images/avataaars.png',

    nav: [
      { text: '首页', link: '/' },
      { text: '系列', link: '/series/' },
      { text: '关于', link: '/about' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/adam-ikari' }
    ],

    editLink: {
      pattern: 'https://github.com/adam-ikari/adamblog/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    },

    footer: {
      message: 'Released under the MIT License. · <a href="/terms">服务条款</a> · <a href="/privacy">隐私政策</a> · 客服邮箱：<a href="mailto:adam@moemail.app">adam@moemail.app</a>',
      copyright: `Copyright © 2024-${new Date().getFullYear()} Adam`
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  },

  srcDir: '.',
  srcExclude: ['node_modules', 'convert.mjs', 'fix-paths.mjs', 'docs'],

  lastUpdated: true,

  sitemap: {
    hostname: SITE_URL,
    lastmodDateOnly: true,
  },

  vite: {
    assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.png', '**/*.gif', '**/**/*.svg', '**/*.webp'],
    plugins: [RssPlugin(RSS), imageCompressPlugin(), relatedPostsPlugin()],
  },

  cleanUrls: true,

  markdown: {
    config(md) {
      md.use(mathjax3)
      md.use(markdownItPangu)
      md.use(footnote)
    },
  },

  transformPageData(pageData) {
    const relativePath = pageData.relativePath
    const isHome = relativePath === 'index.md'
    const isPost = relativePath.startsWith('posts/')
    const isSeries = relativePath.startsWith('series/')

    // 收集系列数据
    const series = pageData.frontmatter?.series
    if (series && isPost) {
      const seriesList = Array.isArray(series) ? series : [series]
      const link = '/' + relativePath.replace(/\.md$/, '')
      const title = pageData.title || pageData.frontmatter?.title || '未命名文章'

      for (const s of seriesList) {
        if (!s.id || !s.name) continue

        if (!seriesMap.has(s.id)) {
          seriesMap.set(s.id, { name: s.name, articles: [] })
        }

        const data = seriesMap.get(s.id)!
        if (!data.articles.find(a => a.link === link)) {
          data.articles.push({ title, link, order: s.order || 0 })
        }
      }
    }

    // 为系列列表页面注入系列数据
    // 扫描 series/ 目录下的所有 .md 文件，自动生成系列列表
    if (isSeries && relativePath.endsWith('.md')) {
      const seriesDir = resolve(process.cwd(), 'series')
      const seriesList = scanSeriesFiles(seriesDir)

      // 合并自动扫描的数据和从文章 frontmatter 收集的数据
      if (seriesMap.size > 0) {
        for (const [id, data] of seriesMap.entries()) {
          const existing = seriesList.find(s => s.id === id)
          if (existing) {
            // 合并文章列表
            const existingLinks = new Set(existing.articles.map(a => a.link))
            for (const article of data.articles) {
              if (!existingLinks.has(article.link)) {
                existing.articles.push(article)
              }
            }
            existing.articles.sort((a, b) => a.order - b.order)
          } else {
            seriesList.push({
              id,
              name: data.name,
              description: '',
              articles: data.articles.sort((a, b) => a.order - b.order)
            })
          }
        }
      }

      pageData.frontmatter.seriesList = seriesList
    }

    // 生成规范 URL
    const canonicalPath = relativePath
      .replace(/\.md$/, '')
      .replace(/\/index$/, '/')
    const canonicalUrl = `${SITE_URL}/${canonicalPath}`

    // 页面标题
    const title = pageData.frontmatter.layout === 'home'
      ? SITE_NAME
      : `${pageData.title} | ${SITE_NAME}`

    // 页面描述
    const description = pageData.description || pageData.frontmatter.description || 'Adam的技术博客，分享编程、AI工具、流体仿真等技术实践与学习心得'

    // 注入 head 标签
    pageData.frontmatter.head ??= []
    const head = pageData.frontmatter.head

    // Open Graph
    const ogImage = `${SITE_URL}/images/avataaars.png`
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:url', content: canonicalUrl }])
    head.push(['meta', { property: 'og:site_name', content: SITE_NAME }])
    head.push(['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }])
    head.push(['meta', { property: 'og:locale', content: 'zh_CN' }])
    head.push(['meta', { property: 'og:image', content: ogImage }])

    // Twitter Card
    head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:description', content: description }])
    head.push(['meta', { name: 'twitter:image', content: ogImage }])

    // Canonical URL
    head.push(['link', { rel: 'canonical', href: canonicalUrl }])

    // JSON-LD 结构化数据
    if (isPost) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': pageData.title,
        'description': description,
        'author': {
          '@type': 'Person',
          'name': 'Adam',
          'url': SITE_URL,
        },
        'publisher': {
          '@type': 'Person',
          'name': 'Adam',
        },
        'url': canonicalUrl,
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        'image': `${SITE_URL}/images/avataaars.png`,
      }
      if (pageData.frontmatter.date) {
        jsonLd.datePublished = pageData.frontmatter.date
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])

      // 面包屑结构化数据：首页 > (系列) > 文章
      const itemList: any[] = [{
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: SITE_URL,
      }]
      const series = pageData.frontmatter.series
      const firstSeries = Array.isArray(series) ? series[0] : series
      if (firstSeries?.id) {
        itemList.push({
          '@type': 'ListItem',
          position: 2,
          name: firstSeries.name || '系列',
          item: `${SITE_URL}/series/${firstSeries.id}`,
        })
        itemList.push({
          '@type': 'ListItem',
          position: 3,
          name: pageData.title,
          item: canonicalUrl,
        })
      } else {
        itemList.push({
          '@type': 'ListItem',
          position: 2,
          name: pageData.title,
          item: canonicalUrl,
        })
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: itemList,
      })])
    } else if (isHome) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': SITE_NAME,
        'description': description,
        'url': SITE_URL,
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])
    }
  },

  buildEnd(siteConfig) {
    // 构建结束时，扫描 series/ 目录并注入系列数据到主题配置
    const seriesDir = resolve(process.cwd(), 'series')
    const seriesList = scanSeriesFiles(seriesDir)

    // 合并从文章 frontmatter 收集的系列数据
    if (seriesMap.size > 0) {
      for (const [id, data] of seriesMap.entries()) {
        const existing = seriesList.find(s => s.id === id)
        if (existing) {
          // 合并文章列表
          const existingLinks = new Set(existing.articles.map(a => a.link))
          for (const article of data.articles) {
            if (!existingLinks.has(article.link)) {
              existing.articles.push(article)
            }
          }
          existing.articles.sort((a, b) => a.order - b.order)
        } else {
          seriesList.push({
            id,
            name: data.name,
            description: '',
            articles: data.articles.sort((a, b) => a.order - b.order)
          })
        }
      }
    }

    if (siteConfig.site?.themeConfig) {
      siteConfig.site.themeConfig.seriesList = seriesList
    }

    console.log(`[series] 自动生成 ${seriesList.length} 个系列`)
  },
})
