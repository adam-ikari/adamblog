# AI 开发核心概念科普文章 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 撰写一篇面向零基础读者的 AI 开发核心概念科普文章，涵盖大模型、API、Agent、Token、上下文窗口等概念，配 5 张 SVG 图解，发布到博客。

**Architecture:** 文章采用 Markdown 格式，存放于 `posts/` 目录；配图采用 SVG 格式，存放于 `posts/<文章名>/` 子目录；遵循现有博客的 frontmatter 格式和文件组织规范。

**Tech Stack:** Markdown, SVG, VitePress (博客框架)

## Global Constraints

- 文章面向零基础读者，所有技术术语必须首次出现时即时解释
- 每个概念必须搭配生活化类比
- 遵循现有博客 frontmatter 格式（title, description, category, tags, recommend, date）
- 文章文件命名使用 kebab-case，与现有文章保持一致
- SVG 配图存放于 `posts/<文章目录名>/` 子目录
- 文章分类使用 `category: AI`，标签包含 `[AI, 大模型, API, Agent, 概念科普, 零基础]`
- 日期使用 `2026-07-09`
- 文章设置为 `recommend: true`（作为系列核心概念文章）

---

## File Structure

```
posts/
  AI开发核心概念科普.md              # 主文章
  AI开发核心概念科普/
    ecosystem-diagram.svg            # 生态全景图
    training-vs-inference.svg        # 训练 vs 推理对比图
    token-split.svg                  # Token 切分示意图
    agent-workflow.svg               # Agent 工作流图
    temperature-comparison.svg       # 温度参数效果对比图
```

---

### Task 1: 创建文章目录结构

**Files:**
- Create: `posts/AI开发核心概念科普/`

**Interfaces:**
- Consumes: 无
- Produces: 配图存放目录

- [ ] **Step 1: 创建文章配图目录**

```bash
mkdir -p /home/gem/project/blog/posts/AI开发核心概念科普
```

- [ ] **Step 2: 验证目录创建成功**

```bash
ls -la /home/gem/project/blog/posts/AI开发核心概念科普/
```

Expected: 目录存在且为空

- [ ] **Step 3: Commit**

```bash
git add posts/AI开发核心概念科普/
git commit -m "docs: 创建AI开发核心概念科普文章配图目录"
```

---

### Task 2: 撰写文章主体（Markdown）

**Files:**
- Create: `posts/AI开发核心概念科普.md`

**Interfaces:**
- Consumes: 无
- Produces: 完整文章内容，引用 5 张 SVG 配图（相对路径 `/posts/AI开发核心概念科普/<name>.svg`）

- [ ] **Step 1: 撰写文章 frontmatter 和前言**

```markdown
---
title: AI 开发核心概念科普：模型、API 与 Agent
description: 零基础入门——用通俗类比讲清大模型、API、Agent、Token、上下文窗口等 AI 开发核心概念，建立完整认知框架
category: AI
tags: [AI, 大模型, API, Agent, 概念科普, 零基础]
recommend: true
date: 2026-07-09
---

# AI 开发核心概念科普：模型、API 与 Agent

## 前言：为什么需要了解这些概念

很多人跟着教程配好了 Claude Code，能跑起来写代码，但一遇到问题就抓瞎：

- 报错 401，不知道是 API Key 错了还是 Base URL 错了
- 模型输出不稳定，不知道"温度参数"能调
- 想换一家模型提供商，不知道 OpenAI 兼容格式是什么意思
- 听说 Agent 很火，但搞不清它和普通聊天机器人到底差在哪

这些问题背后，其实是对几个核心概念没建立认知：**大模型是什么、API 怎么工作、Agent 能做什么、Token 怎么计费、上下文窗口是什么**。这篇就用最通俗的类比，把这些概念一次性讲清楚。

读完这篇，你能回答三个问题：**我在用什么、它怎么工作、出问题怎么定位**。
```

- [ ] **Step 2: 撰写"大模型基础概念"章节**

```markdown
## 一、大模型基础概念

### 1.1 什么是大模型

想象有一个超级读者，读过互联网上几乎所有公开的文字——书、论文、代码、论坛帖子、新闻。它从这些文字里总结出了语言的规律：什么词后面大概率跟什么词，怎么组织句子才通顺，怎么回答才算合理。

**大模型（Large Language Model，LLM）** 就是这样一个"数字大脑"。它不是真的"理解"了世界，而是通过海量数据训练，学会了**预测下一个词**的能力。当你问它问题时，它其实是在根据你的问题，一个字一个字地"猜"出最合理的回答。

关键数字：
- **参数规模**：从几十亿（7B）到几千亿（400B+）不等，参数越多，模型越能处理复杂任务
- **训练数据**：通常包含数万亿个词（token）的文本
- **训练成本**：大模型训练一次需要数千张 GPU 运行数周，成本数百万到数千万美元

### 1.2 模型参数是什么

类比：**参数就像大脑里的神经元连接数量**。

人脑有约 860 亿个神经元，每个神经元和成千上万个其他神经元相连。连接的强弱决定了你记得住什么、反应有多快。

大模型的参数也是类似的"连接权重"。训练过程就是在调整这些权重：猜对了就加强这条连接，猜错了就削弱。最终，数千亿个参数共同编码了模型从数据中学到的所有"知识"。

常见规模对照：

| 规模 | 参数量 | 类比 |
|------|--------|------|
| 小模型 | 7B（70亿） | 一本厚书的容量 |
| 中模型 | 70B（700亿） | 一个小型图书馆 |
| 大模型 | 400B+（4000亿+） | 大型图书馆的藏书量 |

> ⚠️ 参数多 ≠ 一定更好。训练质量、数据质量、架构设计同样重要。一个训练精良的 70B 模型，可能比粗制滥造的 200B 模型更实用。

### 1.3 训练 vs 推理

类比：
- **训练 = 学骑自行车**：摔了很多次，慢慢找到平衡感，调整身体各部位的配合
- **推理 = 骑车上路**：用学好的技能应对新的路况，遇到坑知道躲，遇到坡知道加速

| | 训练（Training） | 推理（Inference） |
|---|---|---|
| 目的 | 让模型学会规律 | 用学好的模型回答问题 |
| 过程 | 大量数据输入 → 预测 → 对比正确答案 → 调整参数 | 输入问题 → 模型计算 → 输出回答 |
| 成本 | 极高（数百万美元级） | 低（按调用次数和 token 量计费） |
| 谁在做 | 大厂、研究机构 | 普通开发者、用户 |
| 时间 | 数周到数月 | 毫秒到秒级 |

**普通用户只接触推理**。训练是大厂的事，你买的 API 服务，本质上就是买"推理调用权"。

### 1.4 模型能力边界

大模型很强大，但不是万能的。清楚它的边界，才能用对地方。

**能做什么：**
- 文本生成：写文章、写邮件、写代码
- 问答对话：解释概念、回答问题、头脑风暴
- 翻译总结：跨语言翻译、长文摘要
- 代码辅助：写函数、改 Bug、解释代码逻辑

**不能做什么：**
- **实时联网**：模型本身不联网，知识截止到训练数据的时间点（除非配了搜索工具）
- **精确计算**：大模型是"概率生成器"，不是计算器。三位数乘法它可能算错，而且错得很自信
- **访问你的私有数据**：除非你主动把数据发给它
- **保证事实准确**：会"幻觉"（Hallucination）——编造假信息但说得像真的一样

> 💡 **关键认知**：大模型是"概率生成器"，不是"真理机器"。它的回答是"看起来最合理的"，不是"绝对正确的"。涉及事实、数据、代码时，务必人工验证。
```

- [ ] **Step 3: 撰写"API 基础概念"章节**

```markdown
## 二、API 基础概念

### 2.1 什么是 API

类比：**API 就像餐厅的点餐系统**。

你去餐厅吃饭，不需要进厨房自己炒菜。你看菜单（接口说明），告诉服务员要什么（发送请求），服务员把话传给厨房（后端处理），再把做好的菜端给你（返回结果）。

**API（Application Programming Interface，应用程序接口）** 就是程序之间的"服务员"。它规定了一套"对话规则"：
- 怎么发起请求（说什么）
- 请求里要包含什么信息（点哪道菜、几份、什么口味）
- 返回的结果长什么样（菜做好了、卖完了、还是厨房着火了）

为什么要用 API？
- **不用了解内部**：你不需要知道模型是怎么训练的，按格式发请求就能用
- **标准化**：所有调用者用同一套规则，降低对接成本
- **可替换**：今天接 DeepSeek，明天接讯飞，接口格式一样，换起来成本低

### 2.2 API Key 与 Base URL

继续餐厅类比：

| 概念 | 类比 | 作用 |
|------|------|------|
| **API Key** | 会员卡 | 证明你有权限调用，用于身份认证和计费 |
| **Base URL** | 餐厅地址 | 告诉请求发到哪里，不同提供商地址不同 |
| **Endpoint** | 具体窗口 | 不同功能走不同路径，如 `/chat/completions` |

实际例子：
```
Base URL: https://api.deepseek.com
API Key: sk-xxxxxxxxxxxxxxxx
```

每次调用时，你的程序会把 API Key 放进请求头里，就像刷卡时出示会员卡。提供商收到后，先验卡（Key 是否有效、余额是否充足），再处理请求。

### 2.3 请求与响应格式

API 通信通常用 **JSON** 格式——一种人和机器都能读的结构化文本。

**请求示例**（问模型"你好"）：
```json
{
  "model": "deepseek-chat",
  "messages": [
    {"role": "user", "content": "你好"}
  ],
  "temperature": 0.7
}
```

**响应示例**：
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "你好！很高兴见到你。"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 2,
    "completion_tokens": 8,
    "total_tokens": 10
  }
}
```

关键字段：
- `model`：指定用哪个模型
- `messages`：对话历史，包含用户和模型的发言
- `temperature`：创造力参数（后面会讲）
- `usage`：计费信息，告诉你这次调用消耗了多少 token

### 2.4 OpenAI 兼容格式

OpenAI 的 API 设计成了行业事实标准。后来出现的国产模型提供商（DeepSeek、讯飞、硅基流动等），为了降低用户的迁移成本，都采用了**兼容 OpenAI 格式**的接口。

这意味着：
- 你用 Claude Code 接 DeepSeek，和接 OpenAI 的代码几乎一样
- 换提供商时，通常只需要改 Base URL 和 API Key
- 工具开发者（如 Claude Code）只需要支持一种格式，就能接多家模型

> 💡 这就是为什么说 Claude Code 能"无缝接入国产模型"——底层格式已经统一了，区别只在于地址和密钥。
```

- [ ] **Step 4: 撰写"Agent 概念"章节**

```markdown
## 三、Agent 概念

### 3.1 什么是 AI Agent

类比：
- **普通 Chatbot** = 问答机器人：你问"北京天气怎么样"，它回答"今天晴，25度"
- **AI Agent** = 能动手办事的助手：你说"帮我查北京天气，如果下雨就提醒我带伞，顺便订个附近的咖啡馆"，它会——查天气 API → 判断是否需要提醒 → 搜索附近咖啡馆 → 给出推荐

**Agent 的核心特征**：不只是"说话"，还能**调用工具、执行操作、多步骤完成任务**。

### 3.2 Agent vs 普通 Chatbot

| | 普通 Chatbot | AI Agent |
|---|---|---|
| 交互模式 | 一问一答 | 多轮协作，主动推进 |
| 能力范围 | 只生成文本 | 生成文本 + 调用工具 + 执行操作 |
| 任务完成 | 单次回答即结束 | 可分解任务、循环执行直到完成 |
| 例子 | "解释什么是 Python" | "帮我写一个 Python 脚本，测试它，修改 Bug，然后提交到 Git" |

### 3.3 Agent 的工作流

Agent 的工作遵循一个循环：**感知 → 思考 → 行动 → 观察 → 再思考……**

```
用户输入
    ↓
┌─────────────┐
│  感知       │  ← 理解用户要什么
│ (Perceive)  │
└─────────────┘
    ↓
┌─────────────┐
│  思考       │  ← 规划步骤：先做什么、后做什么
│  (Think)    │     选择工具：用哪个 API、读哪个文件
└─────────────┘
    ↓
┌─────────────┐
│  行动       │  ← 调用工具、执行操作
│   (Act)     │     如：搜索网页、读写文件、运行代码
└─────────────┘
    ↓
┌─────────────┐
│  观察       │  ← 看工具返回了什么结果
│ (Observe)   │
└─────────────┘
    ↓
  完成？→ 是 → 返回最终结果给用户
    ↓ 否
  回到"思考"，调整计划继续
```

### 3.4 Tool Use（工具调用）

模型本身被关在"黑盒"里，不能直接操作你的电脑。但它可以**生成调用指令**，让外部程序去执行。

流程：
1. 模型分析任务，判断需要用什么工具
2. 模型生成一段"工具调用指令"（如：`{"tool": "read_file", "path": "/etc/hosts"}`）
3. 外部程序收到指令，执行实际操作
4. 执行结果返回给模型
5. 模型基于结果继续下一步

Claude Code 就是一个典型的 Agent：
- 它能**读文件**（`Read` 工具）
- 能**改代码**（`Edit` 工具）
- 能**运行命令**（`Bash` 工具）
- 能**搜索代码**（`Grep` 工具）

你说"帮我给这个项目加个登录功能"，Claude Code 会——读现有代码 → 分析架构 → 写登录逻辑 → 测试运行 → 告诉你结果。
```

- [ ] **Step 5: 撰写"使用中的关键概念"章节**

```markdown
## 四、使用中的关键概念

### 4.1 Token 是什么

类比：**Token 是文字的"碎片"**。

模型不直接读"字"，而是把文字切成碎片（token），每个碎片对应一个数字编号。模型处理的是这些数字，不是原始文字。

**切分规则**：
- 英文：按单词或子词切。`"hello"` → 1 个 token；`"unbelievable"` → 可能切成 `un` + `believ` + `able` 多个 token
- 中文：通常按字切。`"你好世界"` → 4 个 token（你/好/世/界）

**经验值**：
- 1 个汉字 ≈ 1~2 token
- 1 个英文单词 ≈ 1~1.5 token
- 1000 token ≈ 750 个英文单词 ≈ 400~500 个汉字

**为什么重要**：
- **计费单位**：API 按 token 数量收费（输入 + 输出分别计）
- **长度限制**：模型的上下文窗口以 token 为单位计量
- **优化技巧**：写 prompt 时精简表达，能减少 token 消耗、降低成本

### 4.2 上下文窗口（Context Window）

类比：**模型的"短期记忆力"**。

人一次能记住多少信息是有限的。模型也一样——它一次能处理的 token 数量有上限，这个上限就叫**上下文窗口**。

常见窗口大小：

| 窗口大小 | 能容纳的内容 | 适用场景 |
|----------|-------------|---------|
| 4K（4096） | 几页纸 | 简单问答、短对话 |
| 128K（131072） | 一本中篇小说 | 长文档分析、代码库理解 |
| 200K+ | 一部长篇小说 | 整本书分析、大型项目梳理 |

**重要认知**：
- 上下文窗口 = 输入 + 输出 的总和，不是只看输入
- 窗口越大，模型一次能"记住"的信息越多，长文档分析能力越强
- 超出窗口的内容会被截断或遗忘

### 4.3 温度参数（Temperature）

类比：**创造力的"旋钮"**。

温度参数控制模型输出的"随机性"，范围通常是 0 ~ 2（最常用 0 ~ 1）。

| 温度值 | 效果 | 适用场景 |
|--------|------|---------|
| 0 ~ 0.3 | 保守、确定性强、几乎固定回答 | 代码生成、事实问答、数学计算 |
| 0.5 ~ 0.7 | 平衡，有一定变化但不离谱 | 一般对话、邮件撰写 |
| 0.8 ~ 1.0 | 创意多、随机性强、每次回答不同 | 头脑风暴、创意写作、故事生成 |

**原理简述**：温度影响模型选词时的"胆量"。低温时，模型总是选概率最高的词，回答稳定但可能死板；高温时，模型愿意尝试概率较低的词，回答多样但可能离谱。

### 4.4 系统提示词（System Prompt）

类比：**给模型的"角色设定"或"工作手册"**。

系统提示词是在对话开始前植入的一段指令，定义了模型的行为方式。用户通常看不到它，但它深刻影响每一次输出。

**示例对比**：

系统提示词 A：`"你是一个严谨的代码审查员，只关注代码质量和安全性问题。"`
→ 用户问"这段代码怎么样"，模型会挑 Bug、提优化建议

系统提示词 B：`"你是一个幽默的聊天伙伴，用轻松的语言回答问题。"`
→ 同样的问题，模型可能会开玩笑、用比喻解释

**为什么重要**：
- 系统提示词是"隐形的方向盘"，决定了模型的语气、风格和边界
- Claude Code 的 `CLAUDE.md` 本质上就是一个系统提示词文件
- 好的系统提示词能让模型在特定场景下表现大幅提升
```

- [ ] **Step 6: 撰写"生态全景图"和总结章节**

```markdown
## 五、生态位置关系：一张图讲清你在用什么

理解了上面的概念，现在把它们放到一张图里，看清各层之间的关系。

![AI 开发生态全景图](/posts/AI开发核心概念科普/ecosystem-diagram.svg)

### 五层架构详解

**第 1 层：用户层**
- 你通过各种界面使用 AI：Claude Code（终端）、ChatGPT（网页）、Kimi App（手机）
- 这一层只管交互，不管模型怎么跑

**第 2 层：应用/工具层**
- Claude Code、ChatGPT、各类 AI 应用
- 负责：界面交互、Agent 编排、Tool 管理、用户体验
- 一个工具可以同时接多家模型（如 Claude Code 可切换 DeepSeek/讯飞/硅基流动）

**第 3 层：API 网关层**
- OpenAI、DeepSeek、讯飞、硅基流动、OpenRouter
- 负责：身份认证（验 API Key）、计费、请求路由、格式转换
- 一个网关可以聚合多个模型（如 OpenRouter 同时提供 Claude、GPT、DeepSeek）

**第 4 层：模型层**
- GPT-4、Claude、DeepSeek、星火、GLM、Qwen
- 负责：理解输入、生成输出、推理计算
- 这是"大脑"本身

**第 5 层：算力层**
- NVIDIA GPU、华为昇腾、云服务集群
- 负责：运行模型的硬件基础设施
- 训练需要大量算力，推理也需要 GPU 支持

### 数据流向

```
你说"帮我写个 Python 爬虫"
    ↓
Claude Code（工具层）接收请求
    ↓
把请求打包成 API 格式，加上你的 API Key
    ↓
发送到 DeepSeek API 网关（网关层）
    ↓
网关验权后，把请求传给 DeepSeek-V3 模型（模型层）
    ↓
模型在 GPU 集群上运行（算力层），生成回答
    ↓
结果逐层返回：模型 → 网关 → Claude Code → 你的终端
    ↓
Claude Code 可能继续调用工具（如写文件、运行代码）
    ↓
最终把完成的代码展示给你
```

## 六、总结速查表

| 概念 | 一句话解释 | 生活类比 |
|------|----------|---------|
| **大模型** | 从海量数据学习的"数字大脑" | 读过全世界书的超级读者 |
| **参数** | 模型学到的"知识权重" | 大脑神经元连接的数量 |
| **训练** | 让模型学习规律的过程 | 学骑自行车 |
| **推理** | 用学好的模型回答问题 | 骑车上路 |
| **API** | 程序之间的"对话协议" | 餐厅点餐系统 |
| **API Key** | 调用权限的"身份令牌" | 会员卡 |
| **Base URL** | API 服务的"地址" | 餐厅地址 |
| **OpenAI 兼容** | 模仿 OpenAI 格式的接口标准 | 通用插座 |
| **Agent** | 能动手办事的智能助手 | 会自己查资料写报告的助理 |
| **Tool Use** | 模型调用外部工具的能力 | 助理拿起电话帮你预约 |
| **Token** | 计费和分析的"文字碎片" | 拼图块 |
| **上下文窗口** | 模型的"短期记忆力" | 同时能记住多少页书 |
| **温度参数** | 输出创造力的"旋钮" | 严谨 vs 发散的调节器 |
| **系统提示词** | 给模型的"角色设定" | 入职时发的工作手册 |

## 延伸阅读

- **想动手配置 Claude Code**：从 [macOS 环境准备教程](/posts/macOS-环境准备教程) 开始，一步步跟下来
- **想了解模型提供商怎么选**：[国产模型提供商选型指南](/posts/macOS-国产模型提供商选型指南) 帮你对比各家优劣
- **想看产业链全貌**：[AI 产业链分析](/posts/AI产业链分析) 从芯片到应用逐层拆解
- **想深入理解 Claude Code 配置**：[配置详解](/posts/macOS-Claude-Code-配置详解) 讲透每个字段的含义
```

- [ ] **Step 7: 验证文章完整性并 Commit**

```bash
# 检查文件存在
ls -la /home/gem/project/blog/posts/AI开发核心概念科普.md

# 统计字数
wc -m /home/gem/project/blog/posts/AI开发核心概念科普.md

# 检查 frontmatter 格式
head -15 /home/gem/project/blog/posts/AI开发核心概念科普.md
```

Expected: 文件存在，frontmatter 格式正确，内容完整

```bash
git add posts/AI开发核心概念科普.md
git commit -m "docs: 撰写AI开发核心概念科普文章主体"
```

---

### Task 3: 绘制生态全景图 SVG

**Files:**
- Create: `posts/AI开发核心概念科普/ecosystem-diagram.svg`

**Interfaces:**
- Consumes: 无
- Produces: 五层架构 SVG 图，被文章引用（`/posts/AI开发核心概念科普/ecosystem-diagram.svg`）

- [ ] **Step 1: 创建 SVG 文件**

SVG 要求：
- 宽度 800px，高度约 600px
- 五层矩形框，从上到下：用户层、应用/工具层、API 网关层、模型层、算力层
- 每层用不同颜色区分
- 层与层之间用箭头连接
- 右侧标注各层职责
- 支持暗色模式（使用 currentColor 或适配暗色的配色）

```svg
<!-- 文件内容：posts/AI开发核心概念科普/ecosystem-diagram.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <style>
      .layer-box { rx: 8; stroke-width: 2; }
      .arrow { stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
      .label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; }
      .title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; font-weight: bold; }
      .desc { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; fill: #666; }
      @media (prefers-color-scheme: dark) {
        .desc { fill: #aaa; }
      }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>

  <!-- 背景 -->
  <rect width="800" height="600" fill="transparent"/>

  <!-- 第1层：用户层 -->
  <rect x="50" y="20" width="500" height="70" class="layer-box" fill="#e3f2fd" stroke="#1976d2"/>
  <text x="300" y="45" text-anchor="middle" class="title" fill="#1565c0">用户层</text>
  <text x="300" y="65" text-anchor="middle" class="label" fill="#333">你：Claude Code / ChatGPT / Kimi App / 网页</text>
  <text x="570" y="55" class="desc">通过各种界面使用 AI</text>

  <!-- 箭头 1→2 -->
  <line x1="300" y1="90" x2="300" y2="110" class="arrow" stroke="#666"/>

  <!-- 第2层：应用/工具层 -->
  <rect x="50" y="110" width="500" height="70" class="layer-box" fill="#f3e5f5" stroke="#7b1fa2"/>
  <text x="300" y="135" text-anchor="middle" class="title" fill="#6a1b9a">应用 / 工具层</text>
  <text x="300" y="155" text-anchor="middle" class="label" fill="#333">Claude Code / ChatGPT / 各类 AI 应用</text>
  <text x="570" y="145" class="desc">界面交互 · Agent 编排 · Tool 管理</text>

  <!-- 箭头 2→3 -->
  <line x1="300" y1="180" x2="300" y2="200" class="arrow" stroke="#666"/>

  <!-- 第3层：API 网关层 -->
  <rect x="50" y="200" width="500" height="70" class="layer-box" fill="#fff3e0" stroke="#e65100"/>
  <text x="300" y="225" text-anchor="middle" class="title" fill="#d84315">API 网关层</text>
  <text x="300" y="245" text-anchor="middle" class="label" fill="#333">OpenAI / DeepSeek / 讯飞 / 硅基流动 / OpenRouter</text>
  <text x="570" y="235" class="desc">认证 · 计费 · 路由 · 格式转换</text>

  <!-- 箭头 3→4 -->
  <line x1="300" y1="270" x2="300" y2="290" class="arrow" stroke="#666"/>

  <!-- 第4层：模型层 -->
  <rect x="50" y="290" width="500" height="70" class="layer-box" fill="#e8f5e9" stroke="#2e7d32"/>
  <text x="300" y="315" text-anchor="middle" class="title" fill="#1b5e20">模型层</text>
  <text x="300" y="335" text-anchor="middle" class="label" fill="#333">GPT-4 / Claude / DeepSeek / 星火 / GLM / Qwen</text>
  <text x="570" y="325" class="desc">理解输入 · 生成输出 · 推理计算</text>

  <!-- 箭头 4→5 -->
  <line x1="300" y1="360" x2="300" y2="380" class="arrow" stroke="#666"/>

  <!-- 第5层：算力层 -->
  <rect x="50" y="380" width="500" height="70" class="layer-box" fill="#fce4ec" stroke="#c62828"/>
  <text x="300" y="405" text-anchor="middle" class="title" fill="#b71c1c">算力层</text>
  <text x="300" y="425" text-anchor="middle" class="label" fill="#333">NVIDIA GPU / 华为昇腾 / 云服务集群</text>
  <text x="570" y="415" class="desc">运行模型的硬件基础设施</text>

  <!-- 底部说明 -->
  <text x="300" y="490" text-anchor="middle" class="desc" font-size="13px">一个工具可接多家网关 · 一个网关可聚合多个模型</text>
</svg>
```

- [ ] **Step 2: 验证 SVG 可正常显示**

```bash
# 检查文件格式
file /home/gem/project/blog/posts/AI开发核心概念科普/ecosystem-diagram.svg

# 检查 SVG 标签完整性
grep -c "&lt;svg" /home/gem/project/blog/posts/AI开发核心概念科普/ecosystem-diagram.svg
grep -c "&lt;/svg&gt;" /home/gem/project/blog/posts/AI开发核心概念科普/ecosystem-diagram.svg
```

Expected: `file` 命令输出包含 "SVG"，svg 标签成对出现

- [ ] **Step 3: Commit**

```bash
git add posts/AI开发核心概念科普/ecosystem-diagram.svg
git commit -m "docs: 添加AI开发生态全景图SVG"
```

---

### Task 4: 绘制训练 vs 推理对比图 SVG

**Files:**
- Create: `posts/AI开发核心概念科普/training-vs-inference.svg`

**Interfaces:**
- Consumes: 无
- Produces: 训练 vs 推理视觉对比 SVG 图

- [ ] **Step 1: 创建 SVG 文件**

SVG 要求：
- 左右分栏对比布局
- 左侧：训练（学骑自行车）——摔倒、调整、反复练习
- 右侧：推理（骑车上路）——平稳前行、应对路况
- 底部：对比表格（成本、时间、谁在做）

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <style>
      .title { font-family: -apple-system, sans-serif; font-size: 18px; font-weight: bold; }
      .label { font-family: -apple-system, sans-serif; font-size: 14px; }
      .desc { font-family: -apple-system, sans-serif; font-size: 12px; fill: #666; }
      .box { rx: 8; stroke-width: 2; }
      .arrow { stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>

  <!-- 背景 -->
  <rect width="800" height="500" fill="transparent"/>

  <!-- 左侧：训练 -->
  <rect x="30" y="20" width="350" height="200" class="box" fill="#ffebee" stroke="#c62828"/>
  <text x="205" y="45" text-anchor="middle" class="title" fill="#b71c1c">训练（Training）</text>
  <text x="205" y="70" text-anchor="middle" class="label" fill="#333">学骑自行车</text>

  <!-- 训练流程图 -->
  <rect x="60" y="90" width="120" height="35" rx="5" fill="#ffcdd2" stroke="#c62828"/>
  <text x="120" y="112" text-anchor="middle" class="label" font-size="12px" fill="#333">输入数据</text>

  <line x1="180" y1="107" x2="210" y2="107" class="arrow" stroke="#c62828"/>

  <rect x="210" y="90" width="120" height="35" rx="5" fill="#ffcdd2" stroke="#c62828"/>
  <text x="270" y="112" text-anchor="middle" class="label" font-size="12px" fill="#333">预测输出</text>

  <line x1="270" y1="125" x2="270" y2="145" stroke="#c62828" stroke-width="2" stroke-dasharray="5,3"/>

  <rect x="210" y="145" width="120" height="35" rx="5" fill="#ffcdd2" stroke="#c62828"/>
  <text x="270" y="167" text-anchor="middle" class="label" font-size="12px" fill="#333">对比答案</text>

  <line x1="210" y1="162" x2="180" y2="162" class="arrow" stroke="#c62828"/>

  <rect x="60" y="145" width="120" height="35" rx="5" fill="#ffcdd2" stroke="#c62828"/>
  <text x="120" y="167" text-anchor="middle" class="label" font-size="12px" fill="#333">调整参数</text>

  <text x="205" y="205" text-anchor="middle" class="desc">反复循环数百万次，直到准确率达标</text>

  <!-- 右侧：推理 -->
  <rect x="420" y="20" width="350" height="200" class="box" fill="#e8f5e9" stroke="#2e7d32"/>
  <text x="595" y="45" text-anchor="middle" class="title" fill="#1b5e20">推理（Inference）</text>
  <text x="595" y="70" text-anchor="middle" class="label" fill="#333">骑车上路</text>

  <!-- 推理流程图 -->
  <rect x="450" y="100" width="120" height="35" rx="5" fill="#c8e6c9" stroke="#2e7d32"/>
  <text x="510" y="122" text-anchor="middle" class="label" font-size="12px" fill="#333">用户提问</text>

  <line x1="570" y1="117" x2="600" y2="117" class="arrow" stroke="#2e7d32"/>

  <rect x="600" y="100" width="120" height="35" rx="5" fill="#c8e6c9" stroke="#2e7d32"/>
  <text x="660" y="122" text-anchor="middle" class="label" font-size="12px" fill="#333">模型回答</text>

  <text x="595" y="165" text-anchor="middle" class="desc">一次性完成，毫秒到秒级响应</text>

  <!-- 底部对比表 -->
  <rect x="30" y="240" width="740" height="240" class="box" fill="#f5f5f5" stroke="#9e9e9e"/>
  <text x="400" y="265" text-anchor="middle" class="title" fill="#333">训练 vs 推理 对比</text>

  <!-- 表头 -->
  <rect x="50" y="280" width="200" height="30" fill="#e0e0e0" stroke="#9e9e9e"/>
  <text x="150" y="300" text-anchor="middle" class="label" font-weight="bold" fill="#333">对比项</text>

  <rect x="250" y="280" width="250" height="30" fill="#ffcdd2" stroke="#c62828"/>
  <text x="375" y="300" text-anchor="middle" class="label" font-weight="bold" fill="#b71c1c">训练</text>

  <rect x="500" y="280" width="250" height="30" fill="#c8e6c9" stroke="#2e7d32"/>
  <text x="625" y="300" text-anchor="middle" class="label" font-weight="bold" fill="#1b5e20">推理</text>

  <!-- 行1：目的 -->
  <rect x="50" y="310" width="200" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="150" y="330" text-anchor="middle" class="label" fill="#333">目的</text>
  <rect x="250" y="310" width="250" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="375" y="330" text-anchor="middle" class="label" fill="#333">让模型学会规律</text>
  <rect x="500" y="310" width="250" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="625" y="330" text-anchor="middle" class="label" fill="#333">用学好的模型回答问题</text>

  <!-- 行2：成本 -->
  <rect x="50" y="340" width="200" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="150" y="360" text-anchor="middle" class="label" fill="#333">成本</text>
  <rect x="250" y="340" width="250" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="375" y="360" text-anchor="middle" class="label" fill="#333">极高（百万美元级）</text>
  <rect x="500" y="340" width="250" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="625" y="360" text-anchor="middle" class="label" fill="#333">低（按调用计费）</text>

  <!-- 行3：时间 -->
  <rect x="50" y="370" width="200" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="150" y="390" text-anchor="middle" class="label" fill="#333">时间</text>
  <rect x="250" y="370" width="250" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="375" y="390" text-anchor="middle" class="label" fill="#333">数周到数月</text>
  <rect x="500" y="370" width="250" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="625" y="390" text-anchor="middle" class="label" fill="#333">毫秒到秒级</text>

  <!-- 行4：谁在做 -->
  <rect x="50" y="400" width="200" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="150" y="420" text-anchor="middle" class="label" fill="#333">谁在做</text>
  <rect x="250" y="400" width="250" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="375" y="420" text-anchor="middle" class="label" fill="#333">大厂、研究机构</text>
  <rect x="500" y="400" width="250" height="30" fill="#fff" stroke="#e0e0e0"/>
  <text x="625" y="420" text-anchor="middle" class="label" fill="#333">普通开发者、用户</text>

  <!-- 底部提示 -->
  <text x="400" y="460" text-anchor="middle" class="desc" font-size="13px">普通用户只接触推理。训练是大厂的事，API 服务本质就是买"推理调用权"。</text>
</svg>
```

- [ ] **Step 2: 验证 SVG**

```bash
file /home/gem/project/blog/posts/AI开发核心概念科普/training-vs-inference.svg
grep -c "&lt;svg" /home/gem/project/blog/posts/AI开发核心概念科普/training-vs-inference.svg
grep -c "&lt;/svg&gt;" /home/gem/project/blog/posts/AI开发核心概念科普/training-vs-inference.svg
```

- [ ] **Step 3: Commit**

```bash
git add posts/AI开发核心概念科普/training-vs-inference.svg
git commit -m "docs: 添加训练vs推理对比图SVG"
```

---

### Task 5: 绘制 Token 切分示意图 SVG

**Files:**
- Create: `posts/AI开发核心概念科普/token-split.svg`

**Interfaces:**
- Consumes: 无
- Produces: 中英文 Token 切分示意 SVG 图

- [ ] **Step 1: 创建 SVG 文件**

SVG 要求：
- 展示中英文如何被切成 token
- 上方：英文示例 "unbelievable" → un + believ + able
- 下方：中文示例 "你好世界" → 你 / 好 / 世 / 界
- 标注每个 token 的编号

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
  <defs>
    <style>
      .title { font-family: -apple-system, sans-serif; font-size: 18px; font-weight: bold; }
      .label { font-family: -apple-system, sans-serif; font-size: 14px; }
      .token { font-family: -apple-system, sans-serif; font-size: 16px; font-weight: bold; }
      .id { font-family: -apple-system, sans-serif; font-size: 11px; fill: #666; }
      .box { rx: 6; stroke-width: 2; }
    </style>
  </defs>

  <rect width="800" height="400" fill="transparent"/>

  <!-- 标题 -->
  <text x="400" y="30" text-anchor="middle" class="title" fill="#333">Token 切分示意</text>
  <text x="400" y="50" text-anchor="middle" class="label" fill="#666">模型把文字切成"碎片"，每个碎片对应一个数字编号</text>

  <!-- 英文示例 -->
  <text x="50" y="90" class="label" font-weight="bold" fill="#1565c0">英文示例：</text>

  <!-- 原始单词 -->
  <rect x="50" y="105" width="200" height="35" class="box" fill="#e3f2fd" stroke="#1976d2"/>
  <text x="150" y="128" text-anchor="middle" class="token" fill="#1565c0">"unbelievable"</text>

  <text x="260" y="128" class="label" fill="#666">→ 切成 →</text>

  <!-- Token 1 -->
  <rect x="340" y="105" width="80" height="35" class="box" fill="#fff3e0" stroke="#f57c00"/>
  <text x="380" y="128" text-anchor="middle" class="token" fill="#e65100">un</text>
  <text x="380" y="155" text-anchor="middle" class="id">Token #1421</text>

  <!-- Token 2 -->
  <rect x="430" y="105" width="100" height="35" class="box" fill="#fff3e0" stroke="#f57c00"/>
  <text x="480" y="128" text-anchor="middle" class="token" fill="#e65100">believ</text>
  <text x="480" y="155" text-anchor="middle" class="id">Token #5832</text>

  <!-- Token 3 -->
  <rect x="540" y="105" width="80" height="35" class="box" fill="#fff3e0" stroke="#f57c00"/>
  <text x="580" y="128" text-anchor="middle" class="token" fill="#e65100">able</text>
  <text x="580" y="155" text-anchor="middle" class="id">Token #291</text>

  <!-- 说明 -->
  <text x="50" y="180" class="label" fill="#666">英文按子词切分：前缀、词根、后缀各为独立 token</text>

  <!-- 分隔线 -->
  <line x1="50" y1="200" x2="750" y2="200" stroke="#e0e0e0" stroke-width="1"/>

  <!-- 中文示例 -->
  <text x="50" y="240" class="label" font-weight="bold" fill="#2e7d32">中文示例：</text>

  <!-- 原始文字 -->
  <rect x="50" y="255" width="200" height="35" class="box" fill="#e8f5e9" stroke="#2e7d32"/>
  <text x="150" y="278" text-anchor="middle" class="token" fill="#1b5e20">"你好世界"</text>

  <text x="260" y="278" class="label" fill="#666">→ 切成 →</text>

  <!-- Token 1 -->
  <rect x="340" y="255" width="70" height="35" class="box" fill="#fce4ec" stroke="#c62828"/>
  <text x="375" y="278" text-anchor="middle" class="token" fill="#b71c1c">你</text>
  <text x="375" y="305" text-anchor="middle" class="id">Token #1042</text>

  <!-- Token 2 -->
  <rect x="420" y="255" width="70" height="35" class="box" fill="#fce4ec" stroke="#c62828"/>
  <text x="455" y="278" text-anchor="middle" class="token" fill="#b71c1c">好</text>
  <text x="455" y="305" text-anchor="middle" class="id">Token #3856</text>

  <!-- Token 3 -->
  <rect x="500" y="255" width="70" height="35" class="box" fill="#fce4ec" stroke="#c62828"/>
  <text x="535" y="278" text-anchor="middle" class="token" fill="#b71c1c">世</text>
  <text x="535" y="305" text-anchor="middle" class="id">Token #7201</text>

  <!-- Token 4 -->
  <rect x="580" y="255" width="70" height="35" class="box" fill="#fce4ec" stroke="#c62828"/>
  <text x="615" y="278" text-anchor="middle" class="token" fill="#b71c1c">界</text>
  <text x="615" y="305" text-anchor="middle" class="id">Token #8934</text>

  <!-- 说明 -->
  <text x="50" y="340" class="label" fill="#666">中文通常按字切分，每个汉字独立为一个 token</text>

  <!-- 底部经验值 -->
  <rect x="50" y="360" width="700" height="30" rx="5" fill="#f5f5f5" stroke="#e0e0e0"/>
  <text x="400" y="380" text-anchor="middle" class="label" fill="#666">经验值：1 汉字 ≈ 1~2 token | 1 英文单词 ≈ 1~1.5 token | 1000 token ≈ 400~500 汉字</text>
</svg>
```

- [ ] **Step 2: 验证 SVG**

```bash
file /home/gem/project/blog/posts/AI开发核心概念科普/token-split.svg
grep -c "&lt;svg" /home/gem/project/blog/posts/AI开发核心概念科普/token-split.svg
grep -c "&lt;/svg&gt;" /home/gem/project/blog/posts/AI开发核心概念科普/token-split.svg
```

- [ ] **Step 3: Commit**

```bash
git add posts/AI开发核心概念科普/token-split.svg
git commit -m "docs: 添加Token切分示意图SVG"
```

---

### Task 6: 绘制 Agent 工作流图 SVG

**Files:**
- Create: `posts/AI开发核心概念科普/agent-workflow.svg`

**Interfaces:**
- Consumes: 无
- Produces: Agent 感知→思考→行动→观察 循环流程 SVG 图

- [ ] **Step 1: 创建 SVG 文件**

SVG 要求：
- 展示 Agent 的循环工作流
- 中心：用户输入
- 四个步骤：感知 → 思考 → 行动 → 观察
- 循环箭头回到思考或结束
- 标注每个步骤的具体动作

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 550" width="800" height="550">
  <defs>
    <style>
      .title { font-family: -apple-system, sans-serif; font-size: 18px; font-weight: bold; }
      .label { font-family: -apple-system, sans-serif; font-size: 14px; }
      .step-title { font-family: -apple-system, sans-serif; font-size: 15px; font-weight: bold; }
      .step-desc { font-family: -apple-system, sans-serif; font-size: 11px; fill: #666; }
      .box { rx: 10; stroke-width: 2; }
      .arrow { stroke-width: 2.5; fill: none; marker-end: url(#arrowhead); }
      .loop-arrow { stroke-width: 2; fill: none; stroke-dasharray: 6,3; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>

  <rect width="800" height="550" fill="transparent"/>

  <!-- 标题 -->
  <text x="400" y="30" text-anchor="middle" class="title" fill="#333">Agent 工作流：感知 → 思考 → 行动 → 观察</text>

  <!-- 用户输入 -->
  <rect x="300" y="50" width="200" height="45" rx="8" fill="#e3f2fd" stroke="#1976d2" stroke-width="2"/>
  <text x="400" y="68" text-anchor="middle" class="step-title" fill="#1565c0">👤 用户输入</text>
  <text x="400" y="85" text-anchor="middle" class="step-desc">"帮我查天气并订个咖啡馆"</text>

  <!-- 箭头：用户 → 感知 -->
  <line x1="400" y1="95" x2="400" y2="115" class="arrow" stroke="#666"/>

  <!-- 步骤1：感知 -->
  <rect x="280" y="115" width="240" height="70" class="box" fill="#fff3e0" stroke="#f57c00"/>
  <text x="400" y="140" text-anchor="middle" class="step-title" fill="#e65100">1️⃣ 感知（Perceive）</text>
  <text x="400" y="158" text-anchor="middle" class="step-desc">理解用户要什么</text>
  <text x="400" y="175" text-anchor="middle" class="step-desc">识别意图：查天气 + 找咖啡馆</text>

  <!-- 箭头：感知 → 思考 -->
  <line x1="400" y1="185" x2="400" y2="205" class="arrow" stroke="#666"/>

  <!-- 步骤2：思考 -->
  <rect x="280" y="205" width="240" height="70" class="box" fill="#e8f5e9" stroke="#2e7d32"/>
  <text x="400" y="230" text-anchor="middle" class="step-title" fill="#1b5e20">2️⃣ 思考（Think）</text>
  <text x="400" y="248" text-anchor="middle" class="step-desc">规划步骤：先查天气 → 再搜咖啡馆</text>
  <text x="400" y="265" text-anchor="middle" class="step-desc">选择工具：天气 API + 地图搜索</text>

  <!-- 箭头：思考 → 行动 -->
  <line x1="400" y1="275" x2="400" y2="295" class="arrow" stroke="#666"/>

  <!-- 步骤3：行动 -->
  <rect x="280" y="295" width="240" height="70" class="box" fill="#fce4ec" stroke="#c62828"/>
  <text x="400" y="320" text-anchor="middle" class="step-title" fill="#b71c1c">3️⃣ 行动（Act）</text>
  <text x="400" y="338" text-anchor="middle" class="step-desc">调用天气 API 获取北京天气</text>
  <text x="400" y="355" text-anchor="middle" class="step-desc">调用地图 API 搜索附近咖啡馆</text>

  <!-- 箭头：行动 → 观察 -->
  <line x1="400" y1="365" x2="400" y2="385" class="arrow" stroke="#666"/>

  <!-- 步骤4：观察 -->
  <rect x="280" y="385" width="240" height="70" class="box" fill="#f3e5f5" stroke="#7b1fa2"/>
  <text x="400" y="410" text-anchor="middle" class="step-title" fill="#6a1b9a">4️⃣ 观察（Observe）</text>
  <text x="400" y="428" text-anchor="middle" class="step-desc">接收工具返回的结果</text>
  <text x="400" y="445" text-anchor="middle" class="step-desc">天气：晴，25°C | 咖啡馆：3家推荐</text>

  <!-- 判断分支 -->
  <line x1="400" y1="455" x2="400" y2="475" class="arrow" stroke="#666"/>

  <!-- 判断菱形 -->
  <polygon points="400,475 450,500 400,525 350,500" fill="#fff9c4" stroke="#f9a825" stroke-width="2"/>
  <text x="400" y="495" text-anchor="middle" class="label" font-size="12px" fill="#f57f17">任务</text>
  <text x="400" y="508" text-anchor="middle" class="label" font-size="12px" fill="#f57f17">完成了吗？</text>

  <!-- 否：循环回思考 -->
  <path d="M 350 500 Q 200 500 200 240 Q 200 240 280 240" class="loop-arrow" stroke="#f57c00" fill="none" marker-end="url(#arrowhead)"/>
  <text x="220" y="375" text-anchor="middle" class="label" font-size="11px" fill="#e65100">否 → 回到思考</text>
  <text x="220" y="390" text-anchor="middle" class="label" font-size="11px" fill="#e65100">调整计划继续</text>

  <!-- 是：返回结果 -->
  <line x1="450" y1="500" x2="550" y2="500" class="arrow" stroke="#2e7d32"/>
  <rect x="550" y="470" width="180" height="60" rx="8" fill="#c8e6c9" stroke="#2e7d32"/>
  <text x="640" y="495" text-anchor="middle" class="step-title" fill="#1b5e20">✅ 返回结果</text>
  <text x="640" y="515" text-anchor="middle" class="step-desc">"北京今天晴，25°C。</text>
  <text x="640" y="530" text-anchor="middle" class="step-desc">推荐三里屯的 XX 咖啡馆。"</text>

  <!-- 底部说明 -->
  <text x="400" y="545" text-anchor="middle" class="label" font-size="12px" fill="#666">Agent 循环执行直到任务完成，或达到最大步数限制</text>
</svg>
```

- [ ] **Step 2: 验证 SVG**

```bash
file /home/gem/project/blog/posts/AI开发核心概念科普/agent-workflow.svg
grep -c "&lt;svg" /home/gem/project/blog/posts/AI开发核心概念科普/agent-workflow.svg
grep -c "&lt;/svg&gt;" /home/gem/project/blog/posts/AI开发核心概念科普/agent-workflow.svg
```

- [ ] **Step 3: Commit**

```bash
git add posts/AI开发核心概念科普/agent-workflow.svg
git commit -m "docs: 添加Agent工作流图SVG"
```

---

### Task 7: 绘制温度参数效果对比图 SVG

**Files:**
- Create: `posts/AI开发核心概念科普/temperature-comparison.svg`

**Interfaces:**
- Consumes: 无
- Produces: 同一问题在不同温度下输出差异的 SVG 图

- [ ] **Step 1: 创建 SVG 文件**

SVG 要求：
- 三栏布局：低温度(0.2) / 中温度(0.7) / 高温度(1.2)
- 同一提示词："用一句话描述秋天"
- 展示不同温度下的输出风格差异
- 底部标注温度值和适用场景

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <style>
      .title { font-family: -apple-system, sans-serif; font-size: 18px; font-weight: bold; }
      .label { font-family: -apple-system, sans-serif; font-size: 13px; }
      .output { font-family: -apple-system, sans-serif; font-size: 14px; font-style: italic; }
      .temp-label { font-family: -apple-system, sans-serif; font-size: 16px; font-weight: bold; }
      .box { rx: 8; stroke-width: 2; }
      .prompt-box { rx: 6; stroke-width: 1.5; }
    </style>
  </defs>

  <rect width="800" height="450" fill="transparent"/>

  <!-- 标题 -->
  <text x="400" y="30" text-anchor="middle" class="title" fill="#333">温度参数效果对比</text>
  <text x="400" y="50" text-anchor="middle" class="label" fill="#666">同一提示词在不同温度下的输出差异</text>

  <!-- 提示词 -->
  <rect x="200" y="65" width="400" height="30" class="prompt-box" fill="#f5f5f5" stroke="#9e9e9e"/>
  <text x="400" y="85" text-anchor="middle" class="label" fill="#333">提示词："用一句话描述秋天"</text>

  <!-- 低温度 -->
  <rect x="30" y="115" width="230" height="280" class="box" fill="#e3f2fd" stroke="#1976d2"/>
  <text x="145" y="140" text-anchor="middle" class="temp-label" fill="#1565c0">🧊 低温度（0.2）</text>

  <rect x="45" y="155" width="200" height="80" rx="5" fill="#bbdefb" stroke="#1976d2" stroke-width="1"/>
  <text x="145" y="175" text-anchor="middle" class="label" font-weight="bold" fill="#1565c0">输出</text>
  <text x="145" y="195" text-anchor="middle" class="output" fill="#333">秋天是夏季之后、</text>
  <text x="145" y="212" text-anchor="middle" class="output" fill="#333">冬季之前的季节，</text>
  <text x="145" y="229" text-anchor="middle" class="output" fill="#333">气温逐渐降低。</text>

  <text x="145" y="260" text-anchor="middle" class="label" font-size="12px" fill="#666">特点</text>
  <text x="145" y="278" text-anchor="middle" class="label" font-size="12px" fill="#666">保守、确定性强</text>
  <text x="145" y="295" text-anchor="middle" class="label" font-size="12px" fill="#666">几乎固定回答</text>

  <rect x="45" y="310" width="200" height="70" rx="5" fill="#fff" stroke="#e0e0e0"/>
  <text x="145" y="330" text-anchor="middle" class="label" font-size="11px" font-weight="bold" fill="#333">适用场景</text>
  <text x="145" y="348" text-anchor="middle" class="label" font-size="11px" fill="#666">代码生成</text>
  <text x="145" y="363" text-anchor="middle" class="label" font-size="11px" fill="#666">事实问答</text>
  <text x="145" y="378" text-anchor="middle" class="label" font-size="11px" fill="#666">数学计算</text>

  <!-- 中温度 -->
  <rect x="285" y="115" width="230" height="280" class="box" fill="#fff3e0" stroke="#f57c00"/>
  <text x="400" y="140" text-anchor="middle" class="temp-label" fill="#e65100">⚖️ 中温度（0.7）</text>

  <rect x="300" y="155" width="200" height="80" rx="5" fill="#ffe0b2" stroke="#f57c00" stroke-width="1"/>
  <text x="400" y="175" text-anchor="middle" class="label" font-weight="bold" fill="#e65100">输出</text>
  <text x="400" y="195" text-anchor="middle" class="output" fill="#333">金黄的落叶铺满小径，</text>
  <text x="400" y="212" text-anchor="middle" class="output" fill="#333">微风带着一丝凉意，</text>
  <text x="400" y="229" text-anchor="middle" class="output" fill="#333">秋天悄然而至。</text>

  <text x="400" y="260" text-anchor="middle" class="label" font-size="12px" fill="#666">特点</text>
  <text x="400" y="278" text-anchor="middle" class="label" font-size="12px" fill="#666">平衡，有变化</text>
  <text x="400" y="295" text-anchor="middle" class="label" font-size="12px" fill="#666">但不离谱</text>

  <rect x="300" y="310" width="200" height="70" rx="5" fill="#fff" stroke="#e0e0e0"/>
  <text x="400" y="330" text-anchor="middle" class="label" font-size="11px" font-weight="bold" fill="#333">适用场景</text>
  <text x="400" y="348" text-anchor="middle" class="label" font-size="11px" fill="#666">一般对话</text>
  <text x="400" y="363" text-anchor="middle" class="label" font-size="11px" fill="#666">邮件撰写</text>
  <text x="400" y="378" text-anchor="middle" class="label" font-size="11px" fill="#666">内容创作</text>

  <!-- 高温度 -->
  <rect x="540" y="115" width="230" height="280" class="box" fill="#fce4ec" stroke="#c62828"/>
  <text x="655" y="140" text-anchor="middle" class="temp-label" fill="#b71c1c">🔥 高温度（1.2）</text>

  <rect x="555" y="155" width="200" height="80" rx="5" fill="#f8bbd0" stroke="#c62828" stroke-width="1"/>
  <text x="655" y="175" text-anchor="middle" class="label" font-weight="bold" fill="#b71c1c">输出</text>
  <text x="655" y="195" text-anchor="middle" class="output" fill="#333">秋天是宇宙打翻的</text>
  <text x="655" y="212" text-anchor="middle" class="output" fill="#333">调色盘，每一片落叶</text>
  <text x="655" y="229" text-anchor="middle" class="output" fill="#333">都是一封辞职信。</text>

  <text x="655" y="260" text-anchor="middle" class="label" font-size="12px" fill="#666">特点</text>
  <text x="655" y="278" text-anchor="middle" class="label" font-size="12px" fill="#666">创意多、随机性强</text>
  <text x="655" y="295" text-anchor="middle" class="label" font-size="12px" fill="#666">每次回答都不同</text>

  <rect x="555" y="310" width="200" height="70" rx="5" fill="#fff" stroke="#e0e0e0"/>
  <text x="655" y="330" text-anchor="middle" class="label" font-size="11px" font-weight="bold" fill="#333">适用场景</text>
  <text x="655" y="348" text-anchor="middle" class="label" font-size="11px" fill="#666">头脑风暴</text>
  <text x="655" y="363" text-anchor="middle" class="label" font-size="11px" fill="#666">创意写作</text>
  <text x="655" y="378" text-anchor="middle" class="label" font-size="11px" fill="#666">故事生成</text>

  <!-- 底部说明 -->
  <rect x="30" y="415" width="740" height="25" rx="5" fill="#f5f5f5" stroke="#e0e0e0"/>
  <text x="400" y="432" text-anchor="middle" class="label" font-size="12px" fill="#666">温度影响模型选词时的"胆量"：低温选最安全的词，高温愿意尝试更随机的词</text>
</svg>
```

- [ ] **Step 2: 验证 SVG**

```bash
file /home/gem/project/blog/posts/AI开发核心概念科普/temperature-comparison.svg
grep -c "&lt;svg" /home/gem/project/blog/posts/AI开发核心概念科普/temperature-comparison.svg
grep -c "&lt;/svg&gt;" /home/gem/project/blog/posts/AI开发核心概念科普/temperature-comparison.svg
```

- [ ] **Step 3: Commit**

```bash
git add posts/AI开发核心概念科普/temperature-comparison.svg
git commit -m "docs: 添加温度参数效果对比图SVG"
```

---

### Task 8: 最终验证与整合提交

**Files:**
- Verify: `posts/AI开发核心概念科普.md`
- Verify: `posts/AI开发核心概念科普/*.svg` (5 files)

**Interfaces:**
- Consumes: 所有前述任务的产出
- Produces: 完整的、可发布的博客文章

- [ ] **Step 1: 验证所有文件存在**

```bash
ls -la /home/gem/project/blog/posts/AI开发核心概念科普.md
ls -la /home/gem/project/blog/posts/AI开发核心概念科普/
```

Expected:
- `posts/AI开发核心概念科普.md` 存在
- `posts/AI开发核心概念科普/` 目录下包含 5 个 SVG 文件

- [ ] **Step 2: 验证文章引用路径正确**

```bash
grep -n "\.svg" /home/gem/project/blog/posts/AI开发核心概念科普.md
```

Expected: 输出包含 5 个 SVG 引用路径，格式为 `/posts/AI开发核心概念科普/<name>.svg`

- [ ] **Step 3: 验证 frontmatter 完整**

```bash
head -15 /home/gem/project/blog/posts/AI开发核心概念科普.md
```

Expected: 包含完整的 YAML frontmatter（title, description, category, tags, recommend, date）

- [ ] **Step 4: 统计文章规模**

```bash
echo "=== 文章字数 ==="
wc -m /home/gem/project/blog/posts/AI开发核心概念科普.md
echo "=== 配图数量 ==="
ls /home/gem/project/blog/posts/AI开发核心概念科普/*.svg | wc -l
echo "=== 章节数 ==="
grep -c "^## " /home/gem/project/blog/posts/AI开发核心概念科普.md
```

- [ ] **Step 5: 最终 Commit**

```bash
git add posts/AI开发核心概念科普.md posts/AI开发核心概念科普/
git commit -m "docs: 完成AI开发核心概念科普文章及全部配图"
```

---

## Spec Coverage Check

| 设计文档章节 | 对应任务 | 状态 |
|-------------|---------|------|
| 前言 | Task 2 Step 1 | ✅ Task 2 |
| 大模型基础概念 | Task 2 Step 2 | ✅ Task 2 |
| API 基础概念 | Task 2 Step 3 | ✅ Task 2 |
| Agent 概念 | Task 2 Step 4 | ✅ Task 2 |
| 使用中的关键概念 | Task 2 Step 5 | ✅ Task 2 |
| 生态全景图 + 总结 | Task 2 Step 6 | ✅ Task 2 |
| 生态全景图 SVG | Task 3 | ✅ Task 3 |
| 训练 vs 推理 SVG | Task 4 | ✅ Task 4 |
| Token 切分 SVG | Task 5 | ✅ Task 5 |
| Agent 工作流 SVG | Task 6 | ✅ Task 6 |
| 温度参数对比 SVG | Task 7 | ✅ Task 7 |
| 速查表 | Task 2 Step 6 | ✅ Task 2 |
| 延伸阅读 | Task 2 Step 6 | ✅ Task 2 |

## Placeholder Scan

- 无 "TBD"、"TODO"、"implement later"、"fill in details"
- 无 "Add appropriate error handling" 等模糊描述
- 所有步骤包含完整代码/命令
- 无 "Similar to Task N" 引用

## Type Consistency

- 文件路径一致使用 `posts/AI开发核心概念科普/`
- SVG 引用路径一致使用 `/posts/AI开发核心概念科普/<name>.svg`
- Frontmatter 字段与现有博客文章一致
- 所有 SVG 使用相同的样式定义模式
