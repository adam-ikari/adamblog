---
id: blog-conventions
title: "博客发布方式与写作风格"
category: project
status: active
tags: [blog, writing-style, publishing, markdown]
created: "2026-08-24T00:58:37"
updated: "2026-09-23T06:20:03"
---

<!-- compiled_truth -->
# 博客发布方式与写作风格（互联网交叉印证版）

## 项目基本信息
- **仓库**: https://github.com/adam-ikari/adamblog.git
- **框架**: VitePress + @sugarat/theme
- **域名**: https://adamblog.thiz.top
- **站点名**: "Adam的博客"
- **标语**: 技术学习与分享
- **作者**: Adam (GitHub: adam-ikari)
- **包管理**: pnpm（pnpm-lock.yaml, 9.15.0）
- **构建**: `vitepress build && pagefind --site .vitepress/dist`
- **部署**: Vercel（vercel.json: pnpm install --frozen-lockfile → vitepress build，输出 .vitepress/dist）
- **搜索**: pagefind 离线全文搜索（build 后执行）
- **RSS**: vitepress-plugin-rss，默认生成 `/feed.rss`（已验证可用，80条文章）

## 主题与插件（交叉印证：theme.sugarat.top 官方文档 + 本地代码）
- **主题**: @sugarat/theme（简约风 VitePress 博客主题）
- **数学公式**: markdown-it-mathjax3（$$ 包裹 LaTeX）
- **图表**: vitepress-plugin-mermaid + SVG 图解
- **Markdown 增强**: markdown-it-pangu（中英文空格）、markdown-it-footnote
- **图片压缩**: 自定义插件 image-compress (sharp)
- **相关文章**: 自定义 ArticleRelated 组件（TF-IDF 算法）
- **打赏**: @waffo/pancake-ts
- **自定义组件**: SeriesNav, SeriesCardList, SeriesDetail, DynamicSeriesList, DonateBox, ImageFullscreen, ArticleRelated, HomeRecommend
- **页面底部布局**: ImageFullscreen → SeriesNav → ArticleRelated → DonateBox

## 文章结构（交叉印证：sugarat 主题 frontmatter 文档 + 实际文章）
- **位置**: posts/ 目录
- **命名**: 中文标题文件夹内含同名 .md 文件，或单文件 posts/xxx.md
- **Frontmatter 字段**（✔=已验证）：
  - `title` ✔ 文章标题，与正文 H1 一致
  - `description` ✔ 一句话描述，列表/SEO 用
  - `category` ✔ 博客自定义字段（单数）。主题官方支持 `categories`（复数），博客实际用 `category`（单数），这是自定义扩展
  - `tags` ✔ 数组，`[标签1, 标签2]`
  - `recommend` ✔ true/false，推荐列表控制
  - `date` ✔ YYYY-MM-DD
  - `series` ✔ 博客自定义字段（非主题官方字段）。仅系列文章使用，定义在 series/ 目录
  - 主题官方还支持但博客未用：`cover`, `hidden`, `sticky`, `top`, `publish`, `author`, `readingTime`, `comment`, `buttonAfterArticle`, `layout`, `blog`
- **系列文章**: 37 篇文章有 series 字段。定义在 series/ 目录（markdown 格式，含 id/name/articles 列表），通过 frontmatter 的 series 字段关联

## 写作风格（权威来源：claude.md + blog-writing skill + 实际文章交叉印证）

### 最高优先级：去 AI 感
1. **观点融在叙述里** — 不另起一段讲"我的观点是"。立场从措辞、选材、轻重、对比里透出来
2. **段落长短交错** — 不写每段等长、每个列表硬凑三项的对称结构
3. **删套话** — "此外""值得注意的是""总而言之""接下来我们来看""随着 XX 的发展"直接删
4. **敢取舍、敢下判断** — 不写"各有优劣，看需求"。该略过的略过，该表态的表态
5. **措辞书面但不文言** — 不用"皆须""亦""之"连用的半文半白；不用方言口语和生造比喻
6. **破折号克制** — 一篇文章里 `——` 不超过三五个

### 教程/实操类文章特色
- 要有节奏起伏，不能写成"第一步第二步第三步"流水账
- 带一点故事性：交代动机、小挫折、转折
- 步骤要有说明，不能只甩命令——每步要回答"为什么必要""关键参数什么意思""预期结果""踩坑点"
- 判断标准：把命令删掉，光读说明文字还能理解这一步在干嘛

### AI 词汇黑名单（对照清理）
此外、值得注意的是、至关重要、深入探讨、强调、彰显、不断演变的格局、关键作用、织锦、充满活力、自然之美、致力于、开创性的、令人叹为观止、凸显、为……奠定基础、标志着……的转变
口语禁用：根子、卡手、喂熟、一摊/一滩、"最X的一块/一层/一环"、成色、核验声明预告
**作者点名禁用（2026-09，perry wasm 文逐句打回时确认，优先级最高）**：
- `根因`、`归因`——学术/报告腔，改用"问题出在""症结在""原因在""排查"，或直接陈述是什么问题。
- `三道坎`、`缝隙`、`轮不到`、`舞台`类"机会/门槛"比喻——AI 式意象，改直陈事实。
- `事件循环不用你搭`——替读者下结论的口吻，改陈述语言本身提供了什么。
- `裸算法模块`——生造术语，改描述产物实际形态。
- `单线程模型碰不到数据竞争`——过度绝对的技术断言，改"同一时刻只有一段代码在跑，共享状态不用加锁"这类可核验表述。
- `探针`用于描述一次性实验路线——作者认可的用法仅限"隔离实验/对照"语境，泛指实验改"实验""对照"。

### 句式黑名单
夸大意义、-ing肤浅分析、否定式排比、虚假范围、模糊归因、通用积极结论、内联粗体标题列表、破折号过度

### 格式约定
- frontmatter 字段齐
- 代码块带语言标记（bash/json/text/powershell 等）
- 提示框用 `:::` 语法（tip/warning）
- 对比/速查用表格
- 内部链接用相对路径（不带 .md，cleanUrls 已开启）
- 图片放 posts/文章名/ 目录，相对路径引用
- 禁止 ASCII 艺术图，改用 Mermaid 图表
- C++ 代码用 C++17+ 语法，风格偏 Java OOP

### 事实底线
- 会变的事实（版本号、价格、API地址、配置字段）必须联网核验
- 不编造使用体验
- 引用配置代码、命令确保能跑通

## 提交与发布规范（按 blog-writing skill + CLAUDE.md）
- 分开提交：新文章 `feat:`，改旧文 `docs:`/`refactor:`，运维 `chore:`/`fix:`
- 提交前自检：风格符合规范、事实已核验、frontmatter 完整、代码块带语言、`pnpm build` 通过
- 推送后 GitHub Dependabot 警告若与本仓库无关可忽略

## 交叉印证摘要
| 来源 | 验证内容 | 结果 |
|------|---------|------|
| theme.sugarat.top 官方 frontmatter 文档 | frontmatter 字段 | 博客用 `category`（单数，自定义）而非主题官方 `categories`（复数） |
| adamblog.thiz.top/feed.rss | RSS 订阅可达 | 80条文章，无 category 标签（RSS 插件不输出） |
| adamblog.thiz.top/CLAUDE | 写作风格权威规则 | 去 AI 感最高优先级，与 blog-writing skill 一致 |
| .claude/skills/blog-writing/SKILL.md | 完整写作规范 | 权威来源，含行文风格/格式/黑名单/流程 |
| 实际文章 posts/*.md | frontmatter 使用 | category 和 series 均为自定义字段 |
| vercel.json | 部署配置 | Vercel pnpm build |


## Timeline

- time: 2026-08-24T00:58:37
  kind: decision
  summary: "Created this page: 博客发布方式与写作风格"
  source: created via brain create-page
  affects: [blog-conventions]

- time: 2026-08-24T00:58:51
  kind: decision
  summary: "记录博客发布方式与写作风格"
  source: "分析仓库后整理"
  affects: [blog-conventions]

- time: 2026-08-24T01:02:58
  kind: decision
  summary: "从互联网收集资料交叉印证后更新"
  source: "互联网：theme.sugarat.top frontmatter文档、adamblog.thiz.top feed.rss、adamblog.thiz.top CLAUDE.md、blog-writing skill"
  affects: [blog-conventions]

- time: 2026-09-23T04:09:46
  kind: note
  summary: "形成可复用的去 AI 感量化自检口径（改稿前后各跑一次）：① 正文行内粗体标记数（黑名单：列表项写成 - **标签：** 内容）；② 破折号 —— 计数（≤3–5）；③ 冒号式标题『主：副』占全部标题比例（重写前 16/18，目标降到 1/3 以下）；④ 正文段落长度分布，尤其最短段落与 <100 字短段落数量（重写前最短 169 字、零短段落=节奏被尺子量过）；⑤ 成组的 1./2./3. 编号列表与『证据一/二/三』『第一层/二/三层』式工整枚举的组数；⑥ 前言是否出现核验声明预告。守恒硬指标：表格行数、代码块内容、公式、frontmatter 必须与原文逐字节一致，且用数字串 multiset diff 确认事实无丢失。"
  source: "perry wasm 文去 AI 感重写"
  affects: [blog-conventions]

- time: 2026-09-23T06:15:35
  kind: decision
  summary: "补入作者点名禁用的措辞清单（perry wasm 文逐句打回时确认）"
  source: "perry wasm 文风格修订：用户逐句否定 三道坎/缝隙/事件循环不用你搭/裸算法模块/单线程模型碰不到数据竞争/根因"
  affects: [blog-conventions]

- time: 2026-09-23T06:20:03
  kind: decision
  summary: "禁用清单补入 归因"
  source: "perry wasm 文修订：用户追加禁用 归因"
  affects: [blog-conventions]
