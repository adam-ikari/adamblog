import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  transform(rawData) {
    return rawData
      .filter(page => page.url !== '/posts/')
      .sort((a, b) => {
        const dateA = a.frontmatter.date ? new Date(a.frontmatter.date) : new Date(0)
        const dateB = b.frontmatter.date ? new Date(b.frontmatter.date) : new Date(0)
        return dateB.getTime() - dateA.getTime()
      })
      .map(page => ({
        title: page.frontmatter.title || page.title,
        url: page.url,
        date: page.frontmatter.date || null,
        category: page.frontmatter.category || null,
        tags: page.frontmatter.tags || [],
        excerpt: page.frontmatter.description || page.excerpt?.slice(0, 120) || null,
      }))
  }
})
