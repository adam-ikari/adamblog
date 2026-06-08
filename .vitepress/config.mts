import { defineConfig } from 'vitepress'

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
})
