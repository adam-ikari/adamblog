---
title: macOS Claude Code 实战案例
description: 用 DeepSeek 接入 Claude Code，端到端完成一个 CLI 工具小项目，展示完整工作流与费用复盘
category: AI工具
tags: [macOS, Claude Code, 实战, DeepSeek, AI编程]
recommend: false
date: 2026-06-30
series:
  - id: series-macOS-claude
    name: macOS 配置国产大模型 API 系列
    order: 7
    prev: /posts/macOS-Claude-Code-报错排查
    next:
---

# macOS Claude Code 实战案例

## 前言

前面六篇讲了怎么准备环境、怎么安装配置、怎么选型、字段怎么写、报错怎么排查。这篇把所有知识点串起来——**从零用国产模型接入 Claude Code，端到端做一个真实的小项目**，并复盘过程中的费用和踩坑。

我们选 DeepSeek 作为本次实战的提供商（性价比高、国内直连、代码能力强，理由见 [选型指南](/posts/macOS-国产模型提供商选型指南)），做一个**命令行待办工具 `todo`**：支持增删查改、持久化到本地 JSON 文件。

## 实战目标

```
todo add "写技术博客"      # 添加任务
todo list                  # 列出所有任务
todo done 1                # 标记第 1 个完成
todo delete 1              # 删除第 1 个
```

技术栈：Node.js + 原生 `fs` 模块，不引入任何依赖，让模型专注实现逻辑。

## 第一步：确认环境

```bash
node --version    # 需要 18+
claude --version  # 已安装 Claude Code
```

没装好的话，回到 [环境准备教程](/posts/macOS-环境准备教程) 和 [安装配置教程](/posts/macOS-安装和配置-Claude-Code-教程) 补齐。

## 第二步：拿到 DeepSeek API Key

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册账号
2. 在 API Keys 页面创建新 Key，复制保存（只显示一次）
3. 充值一点余额（几块钱够本次实战用很久）

## 第三步：配置 Claude Code

编辑 `~/.claude/settings.json`（这是 [配置详解](/posts/macOS-Claude-Code-配置详解) 推荐的写法）：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-你的真实key",
    "ANTHROPIC_MODEL": "deepseek-chat",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-chat",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-chat"
  }
}
```

注意三件事，正好对应前面几篇的核心要点：

1. 用 `ANTHROPIC_AUTH_TOKEN`（Bearer 认证），不是 `ANTHROPIC_API_KEY`——这是 [报错排查](/posts/macOS-Claude-Code-报错排查) 里 401 的头号原因
2. `ANTHROPIC_MODEL` 填 `deepseek-chat`，是 DeepSeek 认识的模型 ID
3. 把 Sonnet/Haiku 档位也映射到 `deepseek-chat`，避免后台小任务找不到模型

## 第四步：先验证再开干

按 [报错排查](/posts/macOS-Claude-Code-报错排查) 教的万能法，先 curl 验证 Key 有效：

```bash
curl -X POST https://api.deepseek.com/chat/completions \
  -H "Authorization: Bearer sk-你的真实key" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}]}'
```

返回正常 JSON 回复就 OK，再启动 Claude Code：

```bash
mkdir ~/todo-cli && cd ~/todo-cli
claude
```

## 第五步：用 CLAUDE.md 设定上下文

先让 Claude Code 帮我们初始化项目说明：

```text
> /init
```

`/init` 会自动分析目录并生成 `CLAUDE.md`，再手动补充规范：

```markdown
# todo-cli

## 说明
命令行待办工具，数据存于 ~/.todo.json。

## 技术栈
- Node.js，零依赖，用原生 fs
- 入口 bin/todo.js，加 shebang

## 编码规范
- 用中文注释
- 函数有错误处理
```

这样模型每次启动都带着项目上下文，不用反复解释。

## 第六步：让模型实现功能

在交互界面里直接提需求，观察它怎么干：

```text
> 实现一个命令行待办工具 todo：add/list/done/delete 四个子命令，
  数据存到 ~/.todo.json，零依赖，入口 bin/todo.js 要加 shebang 能直接执行。
  先给我完整代码，再帮我配 package.json 的 bin 字段。
```

模型会创建文件、写代码、配 `package.json`。你可以让它边写边解释，也可以让它一次给完再 review。

典型的产出会包含：

- `bin/todo.js`：带 `#!/usr/bin/env node` 的入口，解析 `process.argv`
- 读写 `~/.todo.json` 的逻辑
- 四个子命令的实现
- `package.json` 的 `bin` 字段指向 `bin/todo.js`

## 第七步：本地安装并测试

```bash
# 在项目目录下链接到全局
npm link

# 测试
todo add "写技术博客"
todo add "复盘费用"
todo list
todo done 1
todo delete 2
todo list
```

```bash
cat ~/.todo.json   # 看持久化数据
```

如果某个子命令行为不对，直接告诉模型：

```text
> todo done 1 之后 list 还显示它是未完成状态，帮我修一下
```

它会读代码、定位 bug、改掉。这正是 Claude Code 理解项目上下文的优势——它记得自己刚写的代码。

## 第八步：费用复盘

用 `/cost` 查看本次会话的 token 用量和费用。DeepSeek 按量计费，做一个这种规模的小工具，全程对话加代码生成，通常花费在**几毛钱以内**，甚至几分钱。

对比一下：

| 方案 | 本次实战预估费用 |
|------|----------------|
| DeepSeek（按量） | 几分 ~ 几毛 |
| 国际模型（如 Claude/GPT 经 OpenRouter） | 数倍于此 |

这就是 [选型指南](/posts/macOS-国产模型提供商选型指南) 里推荐预算敏感场景用 DeepSeek 的实际体现。

## 踩坑复盘

实战中你可能遇到这几类问题，正好对应前面的排查篇：

| 踩坑 | 现象 | 解法（详见报错排查） |
|------|------|---------------------|
| 用了 `API_KEY` | 401 | 换 `AUTH_TOKEN` |
| 没映射档位 | 后台任务报 model not found | 加 `DEFAULT_*_MODEL` |
| 改配置没重启 | 行为没变 | `/exit` 后重启 |
| 上下文太长 | context exceeded | `/compact` |

## 进阶：把这个项目用起来

实战完成后，可以继续折腾：

- 用 [cc-Switch](/posts/macOS-配置cc-Switch教程) 给这个项目单独建个 Profile，方便切换不同模型对比效果
- 给 `todo` 加优先级、截止日期、标签
- 让 Claude Code 补单元测试（参考 [配置详解](/posts/macOS-Claude-Code-配置详解) 的 permissions 给它放行测试命令的权限）

## 总结

这一个实战把系列前六篇的知识全用上了：

1. **环境准备** → Node.js 就绪
2. **安装配置** → Claude Code 装好
3. **选型** → 选了 DeepSeek
4. **配置详解** → 用 `AUTH_TOKEN` + `env` 块 + 档位映射
5. **报错排查** → 先 curl 验证，遇到问题按手册查
6. **cc-Switch** → 多模型管理

最终用几分到几毛钱的成本，端到端做出了一个能用的 CLI 工具。这就是国产模型 + Claude Code 在国内落地的真实体感：**够用、便宜、可控**。

整个 macOS 配置国产大模型 API 系列到这里就结束了。希望这套从环境到实战的完整教程，能帮你在国内顺畅地用上 AI 辅助编程。
