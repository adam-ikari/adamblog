import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

// 导入主题的配置
import { blogTheme } from './blog-theme'

export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,

  lang: 'zh-cn',
  title: 'Adam的博客',
  description: '技术学习与分享',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
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

  vite: {
    assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.webp'],
  },

  cleanUrls: true,

  markdown: {
    config(md) {
      md.use(mathjax3)
    },
  },
})