export const meta = {
  name: 'article-illustrations',
  description: '为剩余 32 篇博客文章并行生成 SVG 概念图并插入引用',
  phases: [
    { title: 'Generate', detail: '每篇文章一个 agent，读内容生成 SVG 并插入引用' },
  ],
}

// 剩余 32 篇无图文章
const articles = [
  ['45个-GIT-经典操作场景，专治不会合代码.md', 'Git 常用操作场景分类（提交/分支/合并/撤销/远程）'],
  ['Android媒体库更新问题.md', 'Android 媒体库更新机制与触发方式'],
  ['cc-Switch-CLI-使用教程.md', 'cc-Switch CLI 命令与提供商切换流程'],
  ['chai-js-断言库使用说明.md', 'chai.js 断言风格（expect/should/assert）与常用断言'],
  ['CPP-入门教程-Part-1.md', 'C++ 入门基础概念（变量/类型/控制流/函数）'],
  ['CPP-入门教程-Part-2.md', 'C++ 进阶（指针/引用/类/面向对象）'],
  ['element-plus-register-all-icon-with-alias-globally.md', 'Element Plus 全局注册图标+别名的步骤'],
  ['JavaScript代码规范.md', 'JS 代码规范要点分类（命名/格式/性能/错误）'],
  ['linux_shell_get_start.md', 'Linux 入门命令分类（文件/权限/进程）'],
  ['macOS-安装和配置-Claude-Code-教程.md', 'macOS 安装配置 Claude Code 流程（安装→配置→验证）'],
  ['macOS-配置Python环境教程-uv.md', 'uv 配置 Python 环境流程（安装uv→版本→虚拟环境→依赖）'],
  ['NAT测试工具.md', 'NAT 四种类型与检测工具原理'],
  ['NonNull用法.md', 'NonNull 注解的作用与使用场景'],
  ['nvm-安装和管理-Nodejs-版本教程.md', 'nvm 安装与 Node 版本管理流程'],
  ['python-应用-docker-镜像瘦身小技巧.md', 'Docker 镜像瘦身方法（多阶段/精简基础/清理缓存）'],
  ['Series-of-Learning-Flask-0.md', 'Flask 学习路线/核心概念总览'],
  ['sony-nw-a306-china-version-player-upgrade-to-international-firmware-tutorial.md', '索尼播放器国行升国际版固件步骤'],
  ['uv-安装和管理-Python-教程.md', 'uv 管理 Python（版本/虚拟环境/依赖/项目）一站式'],
  ['vscode-ssh-remote-tutorial.md', 'VSCode Remote-SSH 远程开发配置流程'],
  ['Vue学习系列-Vue3的script-setup语法糖.md', 'Vue3 script setup 语法糖与传统写法对比'],
  ['Vue知识点思维导图.md', 'Vue 核心知识点图谱（响应式/组件/生命周期/指令）'],
  ['Windows11-配置WSL2教程.md', 'Win11 配置 WSL2 流程（启用→安装→配置）'],
  ['WSL2-安装和使用-Claude-Code-教程.md', 'WSL2 安装使用 Claude Code 流程'],
  ['使用AI编写Python流体仿真代码.md', 'AI 辅助流体仿真开发流程'],
  ['在离线环境使用-nvm-windows-安装和管理-node-js.md', '离线环境 nvm-windows 安装 Node 流程'],
  ['【文档翻译】Lisp 的根源.md', 'Lisp 起源与进化（历史脉络）'],
  ['【文档翻译】指南：编写可测试代码（总纲）.md', '可测试代码总纲/缺陷分类总览'],
  ['【文档翻译】编写可测试代码-缺陷一-构造函数做实事.md', '缺陷一：构造函数做实事（问题与重构）'],
  ['【文档翻译】编写可测试代码-缺陷三-全局状态与单例.md', '缺陷三：全局状态与单例（问题与解法）'],
  ['【文档翻译】编写可测试代码-缺陷二-挖掘合作者.md', '缺陷二：挖掘合作者（依赖与方法）'],
  ['【文档翻译】编写可测试代码-缺陷四-类做的太多.md', '缺陷四：类做的太多（SRP 与拆分）'],
  ['流体仿真入门.md', 'CFD 基础概念与数值方法流程'],
]

const STYLE_GUIDE = `SVG 风格规范（必须严格遵守，参考已有 AI产业链/KylinOS 的图）：
- viewBox="0 0 800 H"（H 按内容定，通常 360-620）
- font-family="'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif"
- 中性配色：浅色渐变背景（如 #dbeafe/#dcfce7/#fef3c7/#ede9fe），深色文字（#333/#444/#555）
- 标题 26-27px、正文 14-17px、次要 13-14px
- 卡片用 feDropShadow 轻阴影
- 强调色保留但加深（绿 #16a34a / 红 #dc2626 / 蓝 #1e40af / 橙 #b45309）
- 文字绝不溢出 rect 边界和 viewBox：多行文本 rect 高度足够、长文本用小字号或拆行、底部元素不出 viewBox
- 用 <defs> 定义渐变和 filter，<style> 定义 text 样式
- 纯静态 SVG，不用 JS/外部资源`

phase('Generate')

const results = await parallel(articles.map(([file, topic]) => () => {
  const dir = file.replace(/\.md$/, '')
  return agent(
    `你是为博客文章配 SVG 概念图的设计师。仓库根目录是 /home/gem/project/blog。

任务：为文章 ${file}（主题：${topic}）生成一张 SVG 概念/流程图，并插入文章。

步骤：
1. Read 文章 /home/gem/project/blog/posts/${file}，理解其核心结构（读 ## 标题和关键段落即可，不必全读）。
2. 选一个最能体现文章核心观点的图：概念分类图、流程图、对比图、关系图之一。不要做成简单重复正文的装饰图——要有信息增量或观点可视化。
3. 用 Write 创建 SVG 文件到 /home/gem/project/blog/posts/${dir}/<英文名>.svg（目录可能不存在，Write 会创建）。文件名用英文 kebab-case。
4. 用 Edit 在文章合适位置插入引用：![描述](/posts/${dir}/<英文名>.svg)。插入点：前言后、或最能呼应图的章节后。如果文章开头是 # 标题+前言，插在前言后第一个 ## 前。注意 Edit 需先 Read 文件。
5. 图的文字必须用中文（与文章一致），描述要呼应文章实际内容，不要编造文章里没有的概念。

${STYLE_GUIDE}

完成后返回：SVG 文件路径 + 一句话说明图的内容。如果文章内容实在不适合配图（如纯代码片段无概念），返回"跳过：<原因>"。`,
    { label: `illus:${file.slice(0, 16)}`, phase: 'Generate' }
  )
}))

const done = results.filter(Boolean)
log(`完成 ${done.length}/${articles.length} 篇`)
return { completed: done.length, total: articles.length, details: done }
