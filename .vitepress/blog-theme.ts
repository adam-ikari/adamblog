// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({
  // 搜索 - 启用 pagefind 离线全文搜索
  // search: false,

  // 推荐文章：禁用主题内置列表，改用自定义 RelatedArticles 组件
  // （基于构建时 TF-IDF 生成的 related-posts.json，每篇只显示最相关 10 篇）
  recommend: false,

  // 页脚
  footer: {
    copyright: 'Copyright © 2024-present Adam',
  },

  // 文章默认作者
  author: 'Adam',

  // 友链
  friend: [
    {
      nickname: 'Adam',
      des: '技术学习与分享',
      avatar: '/images/avataaars.png',
      url: 'https://github.com/adam-ikari',
    },
  ],
})

export { blogTheme }
