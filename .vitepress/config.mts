import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '大帝的博客',
  description: '技术学习与分享',
  lang: 'zh-CN',

  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'og:type', content: 'website' }],
  ],

  themeConfig: {
    logo: '/images/avataaars.png',
    siteTitle: '大帝的博客',

    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '关于', link: '/about' },
    ],

    sidebar: {
      '/posts/': [
        {
          text: '文章分类',
          items: [
            { text: '所有文章', link: '/posts/' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/adam-ikari' }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换' }
          }
        }
      }
    },

    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024-present 大帝'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

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
})
