---
title: macOS 国产大模型提供商对比与选型指南
description: 对比讯飞、DeepSeek、硅基流动、Kimi、智谱GLM、通义等国产大模型 API 提供商，给出 Claude Code 接入选型建议
category: AI工具
tags: [macOS, Claude Code, 国产大模型, 选型, AI编程]
recommend: false
date: 2026-06-30
series:
  - id: series-macOS-claude
    name: macOS 配置国产大模型 API 系列
    order: 4
    prev: /posts/macOS-配置cc-Switch教程
    next: /posts/macOS-Claude-Code-配置详解
---

# macOS 国产大模型提供商对比与选型指南

## 前言

前面几篇教程已经讲清楚：Claude Code 可以通过 `ANTHROPIC_BASE_URL` + `ANTHROPIC_AUTH_TOKEN` 接第三方 API 提供商。可市面上国产大模型 API 一大把，到底该选哪个？

这篇不教你「怎么配」（那是 [安装配置教程](/posts/macOS-安装和配置-Claude-Code-教程) 的事），而是帮你回答「配哪个」。我会从**认证方式、价格、模型能力、适用场景**四个维度横向对比主流国产提供商，最后给一个选型决策树。

> ⚠️ 大模型 API 的价格、模型版本、接入地址都变得挺勤。本文按撰写时（2026 年 6 月）的公开信息整理，**具体以各提供商官网最新公示为准**。

## 选型前要搞清楚的三件事

比较提供商之前，先把自己的情况想清楚，这会直接决定你往哪个方向选。

### 1. 你的网络环境

- **纯国内网络，无代理**：优先选国内直连友好的提供商（讯飞、DeepSeek、硅基流动、智谱、通义）。OpenRouter 这类海外聚合服务需要代理。
- **有稳定代理**：可以放开选，包括 OpenRouter，它能聚合 Claude/GPT 等国际模型。

### 2. 你的使用强度

- **轻度/尝鲜**：在意单次调用便宜，按量计费的提供商更划算（DeepSeek、硅基流动）。
- **重度/日常主力**：在意月度预算可控，订阅制套餐更省心（讯飞 Coding Plan 等）。

### 3. 你最看重什么

- **代码能力**：优先看模型本身的编程评测成绩。
- **中文理解**：国产模型普遍优于国际模型。
- **稳定性与合规**：选大厂背景的（讯飞、阿里、智谱）。
- **价格**：开源模型 + 聚合平台通常最便宜。

## 主流国产提供商横向对比

下面这张表汇总了撰写时各提供商的关键信息。

| 提供商 | API Base URL | 认证方式 | 代表模型 | 计费 | 特点 |
|--------|-------------|---------|---------|------|------|
| **讯飞（Coding Plan）** | `https://spark-api-open.xf-yun.com/v1` | Bearer | 星火 / GLM / DeepSeek | 订阅套餐为主 | 编程专用套餐，多模型可选 |
| **DeepSeek** | `https://api.deepseek.com` | Bearer | DeepSeek-V3 / Coder | 按量计费 | 代码能力强，性价比高 |
| **硅基流动 (SiliconFlow)** | `https://api.siliconflow.cn/v1` | Bearer | 多开源模型 | 按量计费 | 模型多，国内友好，常送额度 |
| **智谱 (BigModel)** | `https://open.bigmodel.cn/api/paas/v4` | Bearer | GLM-4 / GLM-4.6 | 按量计费 | 清华系，中文与代码均衡 |
| **通义千问 (阿里)** | `https://dashscope.aliyuncs.com/compatible-mode/v1` | Bearer | Qwen 系列 | 按量计费 | 阿里云背书，稳定 |
| **Kimi (月之暗面)** | `https://api.moonshot.cn/v1` | Bearer | Kimi K 系列 | 按量计费 | 长上下文见长 |
| **OpenRouter** | `https://openrouter.ai/api/v1` | Bearer | 聚合多模型 | 按量计费 | 海外服务，需代理 |

::: tip 认证方式都是 Bearer
可以看到，所有主流国产提供商都使用 **Bearer Token** 认证。这也是为什么 Claude Code 接入它们时**必须用 `ANTHROPIC_AUTH_TOKEN`（发 `Authorization: Bearer`）而不是 `ANTHROPIC_API_KEY`（发 `X-Api-Key`）**。这个细节是 401 报错的高发原因，详见 [常见报错排查](/posts/macOS-Claude-Code-报错排查)。
:::

## 各提供商详解

### 讯飞 Coding Plan

讯飞出的编程专用套餐，最大的卖点是**一个套餐内能切多种模型**（星火、GLM、DeepSeek 等），相当于拿订阅价买了好几个模型的访问权。适合不想在多个平台分别充值、想一个账号搞定多模型切换的人。

- **适合**：日常重度使用、喜欢订阅制、想一个账号用多模型
- **注意**：套餐是订阅制，不用也会扣费；具体包含哪些模型以官方套餐说明为准

### DeepSeek

DeepSeek 是国产编程大模型里口碑最好的一家之一，模型本身的代码能力经过大量开发者验证，价格也以「便宜」出名。按量计费，用多少花多少，预算敏感的轻度到中度用户很合适。

- **适合**：预算敏感、按量计费、追求代码能力
- **注意**：高峰时段偶有排队/限流；API 地址 `https://api.deepseek.com` 不带 `/v1`

### 硅基流动 (SiliconFlow)

硅基流动是模型聚合平台，接了大量开源模型（DeepSeek、Qwen、GLM 等）。新用户常常送免费额度，是国内开发者「白嫖」体验多种模型的首选。

- **适合**：想免费试多种模型、对具体模型不挑
- **注意**：不同模型价格不一，需看清计费；聚合层多一层，偶有不稳定

### 智谱 (BigModel)

清华系团队，GLM 系列在中文理解和代码能力上都比较均衡，国内访问稳定，合规性强。

- **适合**：看重稳定与合规、中文场景多
- **注意**：API 地址是 `.../api/paas/v4`，路径较深

### 通义千问 (阿里)

阿里云背书，Qwen 系列能力全面，DashScope 平台稳定可靠，企业用户首选之一。

- **适合**：企业/团队使用、看重阿里云生态与稳定性
- **注意**：使用 `compatible-mode` 兼容端点接入

### Kimi (月之暗面)

以超长上下文窗口见长，适合需要让模型一次性吃下大量代码、长文档的场景。

- **适合**：超长上下文需求、大型代码库分析
- **注意**：长上下文按 token 计费会偏贵

### OpenRouter

海外的模型聚合平台，一个 API 就能用上 Claude、GPT、Gemini 加各种开源模型。**得有代理才能访问**。

- **适合**：有代理、想用国际模型、不想在多个海外平台分别注册
- **注意**：海外服务，国内无代理不可用；调用国际模型价格较高

## 选型决策树

按下面的顺序问自己一遍，基本就定下来了：

```text
1. 有稳定代理吗？
   ├─ 否 → 在国内直连提供商里选（讯飞/DeepSeek/硅基流动/智谱/通义/Kimi）
   └─ 是 → 也考虑 OpenRouter（想用 Claude/GPT 等国际模型时）

2. 使用强度如何？
   ├─ 重度/日常主力 → 优先订阅制（讯飞 Coding Plan）
   └─ 轻度/尝鲜 → 优先按量计费（DeepSeek / 硅基流动）

3. 最看重什么？
   ├─ 性价比 → DeepSeek
   ├─ 免费试多模型 → 硅基流动
   ├─ 一个账号用多模型 → 讯飞 Coding Plan
   ├─ 中文/合规稳定 → 智谱 / 通义
   └─ 超长上下文 → Kimi
```

## 给不同人群的推荐

| 人群 | 推荐方案 | 理由 |
|------|---------|------|
| **学生/个人尝鲜** | 硅基流动（免费额度）+ DeepSeek（按量） | 零成本起步，按量不浪费 |
| **日常开发主力** | 讯飞 Coding Plan | 订阅制预算可控，多模型可选 |
| **预算敏感的独立开发者** | DeepSeek | 代码强、价格低 |
| **企业/团队** | 通义 / 智谱 | 大厂背书，稳定合规 |
| **需要国际模型** | OpenRouter（需代理） | 一个 API 用 Claude/GPT |

## 实测建议

选定提供商后，**别急着在 Claude Code 里长跑**，先用最小成本验证一把：

1. 按各提供商官网指引拿到 API Key 和 Base URL
2. 用 `curl` 发一个最小请求，确认 Key 和地址都对（方法见 [常见报错排查](/posts/macOS-Claude-Code-报错排查)）
3. 再按 [安装配置教程](/posts/macOS-安装和配置-Claude-Code-教程) 接入 Claude Code
4. 跑一个简单任务，观察响应速度和效果

跑顺了，再考虑用 [cc-Switch](/posts/macOS-配置cc-Switch教程) 把几个提供商管起来，额度耗尽时好切换。

## 选完之后：用 cc-Switch 管理多个国产模型

选型最难的不是挑出「最好」的那家，而是现实里你往往会**同时用好几家**——DeepSeek 当主力、讯飞 Coding Plan 兜底、硅基流动薅免费额度。手动改 settings.json 在它们之间切来切去，又累又容易写错（最典型的就是忘了把 `ANTHROPIC_API_KEY` 换成 `ANTHROPIC_AUTH_TOKEN`，结果 401）。

这就是 [cc-Switch](/posts/macOS-配置cc-Switch教程) 的用武之地：把每家国产模型存成一个配置，一条命令切。

```bash
# 用 @adithya-13/cc-switch 切换国产模型（轻量，只换 Key/地址）
cc-switch add deepseek        # 交互式填入 DeepSeek 的地址、Key、模型
cc-switch add siliconflow     # 填硅基流动
cc-switch use deepseek        # 切到 DeepSeek
cc-switch use siliconflow     # 切到硅基流动
```

要是还想把权限、MCP、档位映射整套配置一起切，就用 `@aravhawk/cc-switch` 的 Profile 模式，给每家国产模型建一份完整 Profile。

::: tip 别只备一家
强烈建议**至少配两家国产模型**：主力 + 备用。当主力额度耗尽或服务波动时，`cc-switch use <备用>` 一条命令就能顶上，不用打断工作流去翻控制台充值。这也是本系列反复强调的实践。
:::

具体的安装、Profile/Provider 两种模式的完整用法，见 [macOS 配置 cc-Switch 教程](/posts/macOS-配置cc-Switch教程)。

## 总结

选型的核心其实就一句话：**先看网络环境定方向，再看使用强度定计费方式，最后按最看重的点挑模型**。

- 纯国内、轻度、要便宜 → DeepSeek 或硅基流动
- 纯国内、重度、要省心 → 讯飞 Coding Plan
- 要稳定合规 → 智谱 / 通义
- 要超长上下文 → Kimi
- 要国际模型（需代理）→ OpenRouter

下一篇 [Claude Code 配置详解](/posts/macOS-Claude-Code-配置详解) 会深入讲解 `settings.json` 的完整字段，让你彻底搞懂 `ANTHROPIC_AUTH_TOKEN`、`model` 等配置到底怎么写。
