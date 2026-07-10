export const meta = {
  name: 'tutorial-explanation-fix',
  description: '修复教程类文章"步骤只贴代码缺说明"问题，按 skill 标准补说明',
  phases: [
    { title: 'Fix', detail: '每篇教程一个 agent，给缺说明的步骤补为什么/参数/预期/踩坑' },
  ],
}

const tutorials = [
  ['macOS-配置Python环境教程-uv.md', [
    '方式一：Homebrew（推荐）', '方式二：官方安装脚本', '安装 Python 版本',
    '查看已安装版本', '固定项目 Python 版本', '基本用法', '激活虚拟环境',
    '初始化新项目', '添加依赖', '同步依赖', '运行命令',
  ]],
  ['macOS-环境准备教程.md', [
    '常用命令', '安装 Oh My Zsh', '安装 Git', '基本配置',
    '配置 SSH 密钥', '配置 Git 凭据缓存', '编辑器和 IDE', '开发工具', '系统工具',
  ]],
  ['Windows11-配置WSL2教程.md', [
    '步骤 1：启用 WSL 功能', '步骤 2：启用虚拟机平台',
    '步骤 4：设置 WSL 2 为默认版本', 'Ubuntu 阿里源', '安装 Git',
    '方式二：在 WSL2 内直接安装 Docker Engine', '安装其他常用工具',
  ]],
  ['macOS-安装和配置-Claude-Code-教程.md', [
    '通过 npm 全局安装', '验证安装', '启动 Claude Code',
  ]],
  ['cc-Switch-CLI-使用教程.md', [
    '安装 @aravhawk/cc-switch（Profile 管理器）', '安装 @adithya-13/cc-switch（提供商切换器）',
  ]],
  ['macOS-配置cc-Switch教程.md', [
    '安装 @aravhawk/cc-switch（Profile 管理器）', '安装 @adithya-13/cc-switch（提供商切换器）',
  ]],
  ['macOS-Claude-Code-实战案例.md', [
    '实战目标', '第一步：确认环境', '第七步：本地安装并测试',
  ]],
]

const STANDARD = `修复标准（来自 blog-writing skill）：
教程最易犯的毛病是"每一步只贴命令/代码，缺说明"。每个步骤至少回答其中几条，不能只甩命令：
- 为什么这一步必要（在整体流程里解决什么、不做会怎样）
- 关键参数/选项什么意思（命令里非显然的部分要解释）
- 预期结果长什么样（执行完该看到什么输出，让读者判断跑对没）
- 踩坑点（这步容易卡在哪、错了怎么排查）
判断标准：把每一步的命令全删掉，光读说明文字，读者还能不能理解这步在干嘛、为什么。能，就是好教程。

修复要求：
- 只给缺说明的步骤【补说明段落】，不删命令、不改命令、不动其他章节
- 说明要有作者视角、像跟同行讲话，不要空洞套话（"接下来我们来看""值得注意的是"禁用）
- 说明放在该步骤标题后、代码块前（先说为什么再做）；或代码块后补预期结果/踩坑
- 不要过度：步骤本身够直白的（如纯列表式"开发工具"罗列几个 brew install）可不补或只补一句归类说明
- 不要编造文章里没有的技术细节；涉及会变的事实（版本号、API 行为）用方向性描述`

phase('Fix')

const results = await parallel(tutorials.map(([file, steps]) => () =>
  agent(
    `你是技术博客编辑。修复教程文章 /home/gem/project/blog/posts/${file} 里"步骤只贴代码缺说明"的问题。

${STANDARD}

需要检查并补说明的步骤标题（这些标题后目前直接是代码块，缺说明）：
${steps.map((s) => '- ' + s).join('\n')}

步骤：
1. Read 该文章全文，理解上下文与已有风格。
2. 对上述每个步骤，用 Edit 在标题与代码块之间（或代码块后）补一段简短说明（1-3 句，覆盖为什么/关键参数/预期/踩坑中的几条）。
3. 只改这些步骤的说明，不动命令、不动其他内容。Edit 前确保 old_string 唯一匹配。
4. 保持文章现有语气（口语化、有作者视角）。

完成后返回：修复了哪些步骤、各补了什么要点。如果某步骤审视后认为说明已够（误报），说明"已够，跳过"。`,
    { label: `fix:${file.slice(0, 16)}`, phase: 'Fix' }
  )
))

const done = results.filter(Boolean)
log(`修复完成 ${done.length}/${tutorials.length} 篇`)
return { fixed: done.length, total: tutorials.length, details: done }
