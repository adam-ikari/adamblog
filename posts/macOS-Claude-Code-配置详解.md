---
title: macOS Claude Code 配置详解
description: 深入讲解 Claude Code 的 settings.json 完整字段、env 块、ANTHROPIC_BASE_URL/AUTH_TOKEN/API_KEY 区别、model 配置、权限与 CLAUDE.md
category: AI工具
tags: [macOS, Claude Code, 配置, settings.json, 国产大模型]
recommend: false
date: 2026-06-30
series:
  - id: series-macOS-claude
    name: macOS 配置国产大模型 API 系列
    order: 5
    prev: /posts/macOS-国产模型提供商选型指南
    next: /posts/macOS-Claude-Code-报错排查
---

# macOS Claude Code 配置详解

## 前言

前面的 [安装配置教程](/posts/macOS-安装和配置-Claude-Code-教程) 教了你「怎么把国产模型接上」，但这篇文章要解决的是「为什么这么配、还能怎么配」。

很多开发者照着教程抄了环境变量能跑起来，却不知道 `ANTHROPIC_AUTH_TOKEN` 和 `ANTHROPIC_API_KEY` 到底有什么区别，不知道怎么锁定一个具体模型，也不知道 `settings.json` 里还能配权限、配 MCP。结果一旦报错就抓瞎，想进阶也无处下手。

本文基于 Claude Code 官方文档，把接入国产模型时用到的核心配置字段讲透。

## 配置的三种来源与优先级

Claude Code 的配置不只来自一个地方，它会按优先级合并多个来源：

| 来源 | 位置 | 作用范围 | 典型用途 |
|------|------|---------|---------|
| **环境变量** | Shell（`~/.zshrc`） | 当前终端会话 | 临时切换、快速测试 |
| **用户级 settings.json** | `~/.claude/settings.json` | 该用户所有项目 | 接入第三方 API、全局偏好 |
| **项目级 settings.json** | `<项目>/.claude/settings.json` | 单个项目 | 项目专属权限、MCP |
| **CLI 参数** | `claude --model xxx` | 单次启动 | 临时覆盖 |

**优先级**：CLI 参数 > 环境变量 > 项目级 settings > 用户级 settings。

> 💡 接入国产模型时，推荐把 `ANTHROPIC_BASE_URL` / `ANTHROPIC_AUTH_TOKEN` 放进**用户级 settings.json 的 `env` 块**，而不是 `~/.zshrc`。这样配置集中、不污染 Shell，也方便用 [cc-Switch](/posts/macOS-配置cc-Switch教程) 整体切换。

## settings.json 整体结构

一份接入国产模型的典型 `~/.claude/settings.json` 长这样：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxxxxxxxxxxxxxx",
    "ANTHROPIC_MODEL": "deepseek-chat"
  },
  "model": "deepseek-chat",
  "permissions": {
    "allow": ["Bash(npm run *)", "Read", "Edit"],
    "deny": ["Bash(rm -rf *)"]
  }
}
```

下面逐块讲解。

## 核心字段：env 块与认证三剑客

`env` 块里设置的环境变量会应用到每个会话，以及 Claude Code 启动的子进程。接入第三方 API 时，下面三个变量最关键。

### ANTHROPIC_BASE_URL —— 指向哪个 API 端点

```json
"ANTHROPIC_BASE_URL": "https://api.deepseek.com"
```

覆盖默认的 API 端点，把请求路由到你指定的提供商或网关。

**几点注意**：

- 设成非官方域名后，Claude Code 会**默认禁用部分依赖官方服务的能力**（如远程工具搜索），这是正常的安全行为
- 不同提供商对路径后缀要求不同：DeepSeek 用 `https://api.deepseek.com`（不带 `/v1`），硅基流动用 `https://api.siliconflow.cn/v1`（带 `/v1`），具体见 [选型指南](/posts/macOS-国产模型提供商选型指南) 的对比表

### ANTHROPIC_AUTH_TOKEN vs ANTHROPIC_API_KEY —— 最容易踩的坑

这两个都用于认证，但**发送的请求头不同**，这是接入国产模型时 401 报错的首要原因。

| 字段 | 发送的请求头 | 适用场景 |
|------|------------|---------|
| `ANTHROPIC_AUTH_TOKEN` | `Authorization: Bearer <值>` | **第三方网关**（DeepSeek/讯飞/硅基流动/OpenRouter 等） |
| `ANTHROPIC_API_KEY` | `X-Api-Key: <值>` | Anthropic 官方 API |

**结论**：接入国产模型，**几乎一律用 `ANTHROPIC_AUTH_TOKEN`**。

> 官方文档原文：`ANTHROPIC_AUTH_TOKEN` 是 "Custom value for the `Authorization` header (the value you set here will be prefixed with `Bearer `)"，即你设的值会被自动加上 `Bearer ` 前缀。所以你只需要填纯 Key，不要自己加 `Bearer `。

如果你误用了 `ANTHROPIC_API_KEY` 接第三方网关，网关收到的 `X-Api-Key` 头它不认，就会返回 401。详细排查见 [常见报错排查](/posts/macOS-Claude-Code-报错排查)。

### ANTHROPIC_MODEL —— 指定具体模型

```json
"ANTHROPIC_MODEL": "deepseek-chat"
```

指定使用的模型名称。注意这里填的是**提供商认识的模型 ID**，不是 `claude-sonnet-4-6` 这种 Anthropic 模型名。例如：

- DeepSeek：`deepseek-chat`、`deepseek-reasoner`
- 硅基流动：`deepseek-ai/DeepSeek-V3` 等带命名空间的 ID
- 具体可用模型 ID 以各提供商文档为准

## model 字段与模型档位

### 顶级 model 字段

除了 `env` 里的 `ANTHROPIC_MODEL`，settings.json 还支持一个顶级 `model` 字段：

```json
{
  "model": "deepseek-chat"
}
```

优先级：`--model`（CLI）和 `/model`（会话内命令）会覆盖 `ANTHROPIC_MODEL`，而 `ANTHROPIC_MODEL` 又覆盖顶级 `model` 字段。

### ANTHROPIC_DEFAULT_*_MODEL —— 自定义模型档位

Claude Code 内部有 Opus / Sonnet / Haiku 等档位概念。接入第三方模型时，可以用一组环境变量把档位映射到具体模型 ID：

| 档位变量 | 作用 |
|---------|------|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Opus 档位实际用的模型 ID |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Sonnet 档位实际用的模型 ID |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Haiku 档位（后台小任务）实际用的模型 ID |

每个档位还有配套的 `_NAME`（显示名）、`_DESCRIPTION`（显示描述）、`_SUPPORTED_CAPABILITIES`（能力声明）变量，用于在 `/model` 选择器里好看好懂。

一个常见的实用做法是把 Haiku 档位也指向你的国产模型，避免后台小任务因找不到 Haiku 模型而报错：

```json
"env": {
  "ANTHROPIC_BASE_URL": "https://api.deepseek.com",
  "ANTHROPIC_AUTH_TOKEN": "sk-xxx",
  "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-chat",
  "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-chat"
}
```

> 💡 旧变量 `ANTHROPIC_SMALL_FAST_MODEL` 已弃用，现在统一用 `ANTHROPIC_DEFAULT_HAIKU_MODEL`。

## permissions —— 权限控制

控制 Claude Code 能自动执行哪些操作，是项目级配置的常见内容：

```json
"permissions": {
  "allow": [
    "Bash(npm run *)",
    "Bash(npm test *)",
    "Bash(git *)",
    "Read",
    "Edit",
    "Write"
  ],
  "deny": [
    "Bash(rm -rf *)",
    "Bash(sudo *)"
  ]
}
```

- `allow`：自动放行，不弹确认
- `deny`：直接拒绝
- 规则支持 `Bash(命令通配)`、`Read`、`Edit`、`Write` 等工具维度

> ⚠️ 权限配置更多是为了减少确认弹窗、防止误操作，**不能替代代码审查**。敏感操作建议保持确认。

## CLAUDE.md —— 项目上下文说明

`CLAUDE.md` 放在项目根目录，Claude Code 每次启动自动读取。它不是 settings.json 的一部分，但和配置同等重要——它告诉模型「这是个什么项目、有什么规范」。

```markdown
# 项目说明

## 技术栈
- 前端：Vue 3 + TypeScript + Vite
- 后端：Node.js + Express

## 编码规范
- 使用 TypeScript 严格模式
- 提交信息遵循 Conventional Commits
```

可以用 `/init` 命令让 Claude Code 自动分析项目并生成初版 CLAUDE.md，再手动精修。

## 配置生效与验证

改完 settings.json 不需要重启终端，但**正在运行的 Claude Code 会话需要重启**才能读到新配置：输入 `/exit` 退出，再重新 `claude` 启动。

验证配置是否真的生效，最直接的方式是查环境变量是否被正确注入。在 Claude Code 会话里可以问它「你当前用的是哪个模型 / base url」，或者直接用 `curl` 对提供商发请求验证 Key（方法见 [常见报错排查](/posts/macOS-Claude-Code-报错排查)）。

## 配置速查表

| 需求 | 字段 | 写在哪 |
|------|------|-------|
| 指向第三方 API | `env.ANTHROPIC_BASE_URL` | settings.json |
| 第三方认证 | `env.ANTHROPIC_AUTH_TOKEN` | settings.json |
| 官方 API 认证 | `env.ANTHROPIC_API_KEY` | settings.json |
| 指定具体模型 | `env.ANTHROPIC_MODEL` 或顶级 `model` | settings.json |
| 映射模型档位 | `env.ANTHROPIC_DEFAULT_*_MODEL` | settings.json |
| 临时覆盖模型 | `--model` / `/model` | CLI / 会话 |
| 权限控制 | `permissions.allow/deny` | settings.json |
| 项目说明 | `CLAUDE.md` | 项目根目录 |

## 总结

把配置搞懂，报错排查和进阶玩法就都有底了。记住三个要点：

- **接入国产模型用 `ANTHROPIC_AUTH_TOKEN`（Bearer），别用 `ANTHROPIC_API_KEY`**
- **配置放 settings.json 的 `env` 块，比放 `~/.zshrc` 更干净**
- **用 `ANTHROPIC_MODEL` / `ANTHROPIC_DEFAULT_*_MODEL` 锁定具体模型，别让档位映射缺失**

下一篇 [常见报错排查](/posts/macOS-Claude-Code-报错排查) 会把这些配置写错时遇到的典型报错，整理成一份可对照的排查手册。
