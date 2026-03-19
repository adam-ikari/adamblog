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
    // 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { 
        text: '文章', 
        items: [
          { text: '所有文章', link: '/posts/' },
          { text: '最新发布', link: '/posts/' },
          { text: '按分类', link: '/categories/' },
          { text: '按标签', link: '/tags/' },
          { text: '归档', link: '/archives/' }
        ]
      },
      { text: '关于', link: '/about/' }
    ],

    // 侧边栏配置
    sidebar: {
      // 首页不显示侧边栏
      '/': [],
      
      // 文章列表页
      '/posts/': [
        {
          text: '浏览文章',
          items: [
            { text: '📝 所有文章', link: '/posts/' },
            { text: '📂 按分类', link: '/categories/' },
            { text: '🏷️ 按标签', link: '/tags/' },
            { text: '📅 时间归档', link: '/archives/' }
          ]
        }
      ],

      // 分类页
      '/categories/': [
        {
          text: '分类导航',
          items: [
            { text: '📂 所有分类', link: '/categories/' },
            { text: '📝 返回文章', link: '/posts/' }
          ]
        }
      ],

      // 标签页
      '/tags/': [
        {
          text: '标签导航',
          items: [
            { text: '🏷️ 所有标签', link: '/tags/' },
            { text: '📝 返回文章', link: '/posts/' }
          ]
        }
      ],

      // 归档页
      '/archives/': [
        {
          text: '归档导航',
          items: [
            { text: '📅 时间归档', link: '/archives/' },
            { text: '📝 返回文章', link: '/posts/' }
          ]
        }
      ],

      // 关于页
      '/about/': [
        {
          text: '关于',
          items: [
            { text: '👤 关于我', link: '/about/' },
            { text: '🏠 返回首页', link: '/' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/chenzd123456' }
    ],

    // 页脚
    footer: {
      message: '技术记录与分享',
      copyright: 'Copyright © 2023-present Adam'
    },

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            placeholder: '搜索文档',
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/chenzd123456/dadis-blog/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    // 文档页脚
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 大纲配置
    outline: {
      label: '目录',
      level: [2, 3]
    },

    // 返回顶部
    returnToTopLabel: '返回顶部'
  }
})
