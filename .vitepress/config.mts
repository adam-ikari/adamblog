import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

// 导入主题的配置
import { blogTheme } from './blog-theme'

const SITE_URL = 'https://adamblog.thiz.top'
const SITE_NAME = 'Adam的博客'

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
      { text: '系列', items: [
        { text: 'AI 编程工具（总索引）', link: '/series/series-ai' },
        { text: 'macOS 配置国产大模型 API', link: '/series/series-macOS-claude' },
        { text: 'macOS 配置 cc-Switch', link: '/series/series-macOS-cc-switch' },
        { text: '流体仿真系列', link: '/series/series-fluid-simulation' },
        { text: 'Windows 11 AI 工具', link: '/series/series-windows-ai' },
      ]},
      { text: '关于', link: '/about' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/adam-ikari' }
    ],

    editLink: {
      pattern: 'https://github.com/adam-ikari/adamblog/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    }
  },

  srcDir: '.',
  srcExclude: ['node_modules', 'convert.mjs', 'fix-paths.mjs'],

  lastUpdated: true,

  sitemap: {
    hostname: SITE_URL,
    lastmodDateOnly: true,
  },

  vite: {
    assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.png', '**/*.gif', '**/**/*.svg', '**/*.webp'],
  },

  cleanUrls: true,

  markdown: {
    config(md) {
      md.use(mathjax3)
    },
  },

  transformPageData(pageData) {
    const relativePath = pageData.relativePath
    const isHome = relativePath === 'index.md'
    const isPost = relativePath.startsWith('posts/')
    const isSeries = relativePath.startsWith('series/')

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
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:url', content: canonicalUrl }])
    head.push(['meta', { property: 'og:site_name', content: SITE_NAME }])
    head.push(['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }])
    head.push(['meta', { property: 'og:locale', content: 'zh_CN' }])

    // Twitter Card
    head.push(['meta', { name: 'twitter:card', content: 'summary' }])
    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:description', content: description }])

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
      }
      if (pageData.frontmatter.date) {
        jsonLd.datePublished = pageData.frontmatter.date
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])
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
})
