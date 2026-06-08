// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({
  // 搜索 - 启用 pagefind 离线全文搜索
  // search: false,

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
