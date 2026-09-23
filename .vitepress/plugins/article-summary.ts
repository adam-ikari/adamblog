import type MarkdownIt from 'markdown-it'

/**
 * 全文摘要：读 frontmatter.summary，渲染成 h1 之后的摘要块。
 *
 * 放在构建期而非客户端组件里，摘要直接进静态 HTML，
 * 搜索引擎与 RSS 都能拿到，页面无需额外 JS。
 */
export function articleSummaryPlugin(md: MarkdownIt) {
  md.core.ruler.push('article_summary', (state) => {
    const summary = state.env?.frontmatter?.summary
    if (typeof summary !== 'string' || !summary.trim()) return false

    const tokens = state.tokens
    const h1Open = tokens.findIndex(
      (t) => t.type === 'heading_open' && t.tag === 'h1'
    )
    if (h1Open === -1) return false

    const h1Close = tokens.findIndex(
      (t, i) => i > h1Open && t.type === 'heading_close'
    )
    if (h1Close === -1) return false

    const token = new state.Token('html_block', '', 0)
    token.block = true
    token.content =
      `<div class="article-summary">` +
      `<div class="article-summary-label">全文摘要</div>` +
      `<p>${md.utils.escapeHtml(summary.trim())}</p>` +
      `</div>\n`
    tokens.splice(h1Close + 1, 0, token)
    return false
  })
}
