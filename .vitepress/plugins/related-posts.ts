import type { Plugin } from 'vite'
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

/**
 * 构建时基于 TF-IDF + 余弦相似度计算文章间相关度，
 * 生成 related-posts.json（每篇 top-N 相关文章），供前端组件读取。
 *
 * 分词：中文用二字滑窗（无需 jieba 依赖，对 TF-IDF 够用），
 * 英文按空格切。去除代码块、frontmatter、标点。
 * 纯本地计算，不依赖任何 LLM/embedding API。
 */

interface Article {
  path: string // /posts/xxx
  title: string
  date: string // YYYY-MM-DD
  terms: Map<string, number> // term -> tf
  norm: number // 向量长度
}

const TOP_N = 10

// 去除 markdown 中的代码块、frontmatter、标点，保留正文文字
function extractText(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/, '') // frontmatter
    .replace(/```[\s\S]*?```/g, ' ') // 代码块
    .replace(/`[^`]*`/g, ' ') // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 图片
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ') // 链接文字
    .replace(/[#>*_\-|]/g, ' ') // markdown 符号
    .replace(/[^一-龥a-zA-Z0-9\s]/g, ' ') // 非中英文数字
}

// 分词：中文二字滑窗 + 英文按空格
function tokenize(text: string): string[] {
  const tokens: string[] = []
  const chunks = text.split(/\s+/)
  for (const chunk of chunks) {
    if (!chunk) continue
    // 英文/数字 token
    if (/^[a-zA-Z0-9]+$/.test(chunk)) {
      if (chunk.length >= 2) tokens.push(chunk.toLowerCase())
      continue
    }
    // 中文二字滑窗
    const cjk = chunk.match(/[一-龥]+/g)
    if (cjk) {
      for (const seg of cjk) {
        for (let i = 0; i < seg.length - 1; i++) {
          tokens.push(seg.slice(i, i + 2))
        }
      }
    }
  }
  return tokens
}

function buildTf(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>()
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1)
  return tf
}

function cosineSim(a: Article, b: Article, idf: Map<string, number>): number {
  let dot = 0
  for (const [term, tfA] of a.terms) {
    const tfB = b.terms.get(term)
    if (tfB) {
      const w = idf.get(term) || 0
      dot += tfA * tfB * w * w
    }
  }
  if (a.norm === 0 || b.norm === 0) return 0
  return dot / (a.norm * b.norm)
}

export function relatedPostsPlugin(): Plugin {
  return {
    name: 'related-posts-tfidf',
    apply: 'build',
    buildStart() {
      const postsDir = join(process.cwd(), 'posts')
      const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'))

      const articles: Article[] = []
      const df = new Map<string, number>() // document frequency

      for (const file of files) {
        const raw = readFileSync(join(postsDir, file), 'utf-8')
        const titleMatch = raw.match(/^title:\s*(.+)$/m)
        const title = (titleMatch?.[1] || file).replace(/['"]/g, '')
        const dateMatch = raw.match(/^date:\s*(['"]?)(\d{4}-\d{2}-\d{2})/m)
        const date = dateMatch?.[2] || ''
        const text = extractText(raw)
        const tokens = tokenize(text)
        const tf = buildTf(tokens)
        const path = '/posts/' + file.replace(/\.md$/, '')

        const article: Article = { path, title, date, terms: tf, norm: 0 }
        for (const term of tf.keys()) df.set(term, (df.get(term) || 0) + 1)
        articles.push(article)
      }

      const N = articles.length
      const idf = new Map<string, number>()
      for (const [term, d] of df) idf.set(term, Math.log((N + 1) / (d + 1)) + 1)

      // 算每篇的向量长度
      for (const a of articles) {
        let sum = 0
        for (const [term, tf] of a.terms) {
          const w = (idf.get(term) || 0) * tf
          sum += w * w
        }
        a.norm = Math.sqrt(sum)
      }

      // 每篇取 top-N 相似
      const related: Record<string, { title: string; link: string; date: string }[]> = {}
      for (const a of articles) {
        const scored = articles
          .filter((b) => b.path !== a.path)
          .map((b) => ({ b, score: cosineSim(a, b, idf) }))
          .sort((x, y) => y.score - x.score)
          .slice(0, TOP_N)
        related[a.path] = scored.map((s) => ({ title: s.b.title, link: s.b.path, date: s.b.date }))
      }

      const outDir = join(process.cwd(), '.vitepress/dist')
      try { mkdirSync(outDir, { recursive: true }) } catch {}
      writeFileSync(join(outDir, 'related-posts.json'), JSON.stringify(related))
      console.log(`  相关文章(TF-IDF): 已生成 related-posts.json，覆盖 ${articles.length} 篇文章`)
    },
  }
}
