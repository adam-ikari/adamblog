export const meta = {
  name: 'tutorial-explanation-audit',
  description: '审查教程类文章是否有"步骤只贴代码缺说明"问题',
  phases: [
    { title: 'Audit', detail: '每篇教程一个 agent，按 skill 标准审查步骤说明' },
  ],
}

const tutorials = [
  'macOS-配置Python环境教程-uv.md',
  'macOS-环境准备教程.md',
  '45个-GIT-经典操作场景，专治不会合代码.md',
  'macOS-Claude-Code-报错排查.md',
  'Windows11-配置WSL2教程.md',
  'macOS-配置cc-Switch教程.md',
  'cc-Switch-CLI-使用教程.md',
  'macOS-安装和配置-Claude-Code-教程.md',
  'macOS-Claude-Code-实战案例.md',
  'WSL2-安装和使用-Claude-Code-教程.md',
  'macOS-Claude-Code-配置详解.md',
  'element-plus-register-all-icon-with-alias-globally.md',
  'chai-js-断言库使用说明.md',
  'nvm-安装和管理-Nodejs-版本教程.md',
  'uv-安装和管理-Python-教程.md',
  'linux_shell_get_start.md',
  'vscode-ssh-remote-tutorial.md',
  'sony-nw-a306-china-version-player-upgrade-to-international-firmware-tutorial.md',
  '在离线环境使用-nvm-windows-安装和管理-node-js.md',
  'Gemini-CLI-入门教程（windows篇）.md',
  'CPP-入门教程-Part-1.md',
  'CPP-入门教程-Part-2.md',
  '流体仿真入门.md',
]

const STANDARD = `审查标准（来自 blog-writing skill）：
教程最易犯的毛病是"每一步只贴命令/代码，缺说明"。每个步骤至少要回答其中几条：
- 为什么这一步必要（在整体里解决什么、不做会怎样）
- 关键参数/选项什么意思（命令里非显然的部分）
- 预期结果长什么样（执行完该看到什么输出）
- 踩坑点（这步容易卡在哪、错了怎么排查）
判断标准：把每一步的命令全删掉，光读说明文字，读者还能不能理解这步在干嘛、为什么。能，就是好教程；只剩空标题，就是流水账。
注意：命令对照表、Q&A、速查表等本就该直接给命令的章节不算问题。只标记真正的"操作步骤"缺说明的。`

phase('Audit')

const results = await parallel(tutorials.map((file) => () =>
  agent(
    `你是技术博客审稿编辑。审查教程文章 /home/gem/project/blog/posts/${file} 是否有"步骤只贴代码/命令、缺说明"的问题。

${STANDARD}

步骤：
1. Read 该文章全文。
2. 逐个"操作步骤"章节检查（## 或 ### 下涉及执行命令/写代码的步骤）。
3. 对每个有问题的步骤，记录：步骤标题、行号、缺什么说明（为什么/参数/预期结果/踩坑点之一）、严重程度（高=完全无说明只剩命令 / 中=有简短注释但缺关键说明 / 低=基本够）。
4. 不要修改文件，只输出审查报告。

输出格式（JSON 风格）：
文章：${file}
问题步骤数：N
[高] 行号 标题 — 缺：xxx
[中] 行号 标题 — 缺：xxx
...
如果该文步骤说明都到位，输出"无问题"。`,
    { label: `audit:${file.slice(0, 18)}`, phase: 'Audit' }
  )
))

const done = results.filter(Boolean)
log(`审查完成 ${done.length}/${tutorials.length} 篇`)
return { audited: done.length, total: tutorials.length, reports: done }
