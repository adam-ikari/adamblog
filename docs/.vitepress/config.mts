import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Adam的博客',
  description: '本博客主要作用是记录自己折(muo)腾(yu)的各种技术，以上！',
  lang: 'zh-CN',
  // 使用环境变量配置 base，支持 GitHub Pages 和 Vercel
  base: process.env.BASE_URL || '/',
  head: [
    ['link', { rel: 'icon', href: `${process.env.BASE_URL || '/'}favicon.ico` }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { name: 'keywords', content: 'Adam, 博客, 技术, Vue, React, Python, Node.js, Docker' }]
  ],

  vite: {
    assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.PNG', '**/*.png', '**/*.gif', '**/*.svg', '**/*.webp']
  },

  // 忽略死链检查
  ignoreDeadLinks: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '分类', link: '/categories/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives/' },
      { text: '关于', link: '/about/' }
    ],

    sidebar: {
      '/posts/': [
        {
          text: '文章列表',
          items: [
            { text: '所有文章', link: '/posts/' },
            { text: '2024年', link: '/posts/17-Gemini-CLI-入门教程（windows篇）.md' },
            { text: '2023年', link: '/posts/12-python-应用-docker-镜像瘦身小技巧.md' }
          ]
        }
      ],
      '/categories/': [
        {
          text: '分类浏览',
          items: [
            { text: '所有分类', link: '/categories/' }
          ]
        }
      ],
      '/tags/': [
        {
          text: '标签浏览',
          items: [
            { text: '所有标签', link: '/tags/' }
          ]
        }
      ],
      '/archives/': [
        {
          text: '文章归档',
          items: [
            { text: '时间归档', link: '/archives/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/chenzd123456' }
    ],

    footer: {
      message: '技术记录与分享',
      copyright: 'Copyright © 2023-present Adam'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/chenzd123456/dadis-blog/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  }
})