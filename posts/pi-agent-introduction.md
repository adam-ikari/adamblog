# Pi Agent: 极简而强大的终端编码助手

在 AI 编程助手蓬勃发展的今天，工具之间的同质化越来越严重。大多数产品都试图提供"全功能"解决方案，内置了各种特性和工作流。然而，Pi Agent 选择了一条不同的道路——它相信**极简主义**和**极致的可扩展性**才是未来的方向。

## 什么是 Pi Agent？

Pi 是一个**极简的终端编码工具架**。它的核心理念很简单：让工具适应你的工作流，而不是相反。与其他试图预测你需求的工具不同，Pi 提供了一个干净的核心，并允许你通过 TypeScript 扩展、技能、提示模板和主题来定制它。

### 设计哲学

Pi 的设计哲学可以概括为以下几点：

1. **最小化核心**：只提供最基础但强大的功能
2. **最大可扩展性**：任何你想要的功能都可以通过扩展添加
3. **拒绝预设工作流**：不强制你使用某种特定的开发方式
4. **完全控制权**：你决定如何使用它，而不是它决定你如何工作

## 核心特性

### 四种运行模式

Pi 提供四种不同的运行模式，适应各种使用场景：

1. **交互模式**：默认模式，提供丰富的 TUI 界面
2. **打印模式**：非交互式，输出结果后退出
3. **JSON 模式**：以 JSON Lines 格式输出所有事件，便于脚本集成
4. **RPC 模式**：通过 stdin/stdout 进行进程间通信，支持非 Node.js 集成
5. **SDK 模式**：可以直接在 Node.js 应用中嵌入 Pi

### 强大的会话管理

会话以 JSONL 文件存储，采用树状结构：

- **分支功能**：可以在任何历史点创建新分支，无需复制整个会话文件
- **内建树视图**：可视化展示会话历史，方便导航和切换
- **智能压缩**：当会话过长时自动压缩旧消息，保留完整历史
- **持续保存**：所有操作自动保存，不会丢失任何工作

### 内置工具

默认情况下，Pi 为模型提供四个核心工具：

- `read`：读取文件内容
- `write`：写入文件（覆盖或新建）
- `edit`：精确的文本替换编辑
- `bash`：执行 shell 命令

这些工具足以完成大多数编程任务，但你可以通过扩展添加任意数量的自定义工具。

## 极致的可扩展性

这是 Pi 最强大的特性。与其他工具将功能硬编码不同，Pi 的几乎所有方面都可以定制：

### 扩展（Extensions）

扩展是 TypeScript 模块，可以添加：

- **自定义工具**：添加新的工具或完全替换内置工具
- **自定义命令**：注册 `/` 开头的命令
- **键盘快捷键**：绑定自定义按键操作
- **事件处理**：监听和响应各种事件（工具调用、消息发送等）
- **UI 组件**：自定义编辑器、状态栏、页眉页脚、覆盖层等

示例扩展可以做什么：
- 实现子代理和计划模式
- 自定义压缩和摘要策略
- 权限控制和路径保护
- Git 检查点和自动提交
- SSH 和沙箱执行
- MCP 服务器集成
- 甚至可以在等待时玩游戏（没错，Doom 可以在 Pi 里运行）

### 技能（Skills）

技能遵循 Agent Skills 标准，是按需加载的功能包：

```markdown
# My Skill
当用户询问 X 时使用此技能。

## 步骤
1. 做这个
2. 然后那个
```

技能可以通过 `/skill:name` 手动调用，也可以让 AI 自动加载它们。技能非常适合封装特定的编程模式或最佳实践。

### 提示模板（Prompt Templates）

可重用的提示词，以 Markdown 文件存储：

```markdown
<!-- ~/.pi/agent/prompts/review.md -->
审查此代码的 bug、安全问题和性能问题。
重点关注：{{focus}}
```

在编辑器中输入 `/name` 即可展开模板，支持变量替换。

### 主题（Themes）

内置 `dark` 和 `light` 主题，支持热重载。你可以创建自己的主题来定制外观。

### Pi 包（Pi Packages）

将扩展、技能、提示模板和主题打包，通过 npm 或 git 分享：

```bash
pi install npm:@foo/pi-tools
pi install git:github.com/user/repo
pi install https://github.com/user/repo@v1
```

在 [npmjs.com](https://www.npmjs.com/search?q=keywords%3Api-package) 可以找到很多社区维护的 Pi 包。

## Pi 选择不做什么？

这可能是 Pi 最有趣的部分。在设计上，Pi 有意识地**不包含**一些在其他 AI 编程工具中常见的功能：

### 为什么没有内置 MCP？

Pi 的创始人认为，构建具有良好 README 的 CLI 工具或通过扩展添加 MCP 支持是更好的方式。详情可见 [这篇博客文章](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)。

### 为什么没有子代理？

子代理有多种实现方式。你可以：
- 通过 tmux 启动多个 Pi 实例
- 用扩展构建自己的子代理系统
- 安装符合你工作流的第三方包

### 为什么没有权限弹窗？

Pi 认为你应该在容器中运行，或者通过扩展构建适合你环境和安全需求的确认流程，而不是使用通用的权限系统。

### 为什么没有计划模式？

你可以：
- 将计划写入文件
- 用扩展构建计划模式
- 安装提供计划模式的包

### 为什么没有内置待办事项？

内置待办事项会让模型困惑。你可以：
- 使用 TODO.md 文件
- 用扩展构建自己的待办系统

### 为什么没有后台 bash？

Pi 推荐使用 tmux。这样可以获得完全的可观察性和直接交互能力。

## 实际使用体验

### 快速开始

安装很简单：

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

然后设置 API 密钥：

```bash
export ANTHROPIC_API_KEY=sk-ant-...
pi
```

或者使用现有的订阅：

```bash
pi
/login  # 选择提供商
```

### 交互式界面

Pi 的交互界面分为几个部分：

1. **启动头部**：显示快捷键、加载的 AGENTS.md 文件、提示模板、技能和扩展
2. **消息区域**：显示你的消息、AI 的响应、工具调用和结果
3. **编辑器**：你输入的地方，边框颜色表示当前的思考级别
4. **页脚**：显示工作目录、会话名称、token 使用情况、成本和当前模型

### 有用的命令

- `/model`：切换模型
- `/settings`：调整设置
- `/tree`：导航会话历史树
- `/compact`：手动压缩上下文
- `/export`：导出会话到 HTML 或 JSONL
- `/share`：上传到 GitHub gist 生成可分享链接

### 键盘快捷键

一些常用的快捷键：

- `Ctrl+C`：清空编辑器（两次退出）
- `Escape`：取消/中止（两次打开树视图）
- `Ctrl+L`：打开模型选择器
- `Ctrl+P`：循环切换作用域模型
- `Shift+Tab`：循环切换思考级别
- `Ctrl+O`：折叠/展开工具输出
- `Ctrl+T`：折叠/展开思考块

## 支持的提供商和模型

Pi 支持广泛的 AI 提供商：

**订阅服务：**
- Anthropic Claude Pro/Max
- OpenAI ChatGPT Plus/Pro (Codex)
- GitHub Copilot

**API 密钥：**
- Anthropic、OpenAI、Azure OpenAI
- DeepSeek、NVIDIA NIM
- Google Gemini、Google Vertex
- Amazon Bedrock、Mistral、Groq
- Cloudflare AI Gateway、xAI
- OpenRouter、Vercel AI Gateway
- 以及更多...

还支持 llama.cpp 路由服务器，可以在本地运行模型。

## 程序化使用

### SDK

```typescript
import { createAgentSession, ModelRuntime, SessionManager } from "@earendil-works/pi-coding-agent";

const modelRuntime = await ModelRuntime.create();
const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  modelRuntime,
});

await session.prompt("当前目录有哪些文件？");
```

### RPC 模式

对于非 Node.js 集成，使用 RPC 模式：

```bash
pi --mode rpc
```

RPC 模式使用严格的 LF 分隔 JSONL 帧协议。

## 社区和生态

Pi 有一个活跃的社区，你可以在：

- [Discord](https://discord.com/invite/3cU7Bz4UPx) 参与讨论
- [npmjs.com](https://www.npmjs.com/search?q=keywords%3Api-package) 查找社区包
- [GitHub](https://github.com/badlogic/pi) 查看源代码和贡献

### 分享会话数据

如果你使用 Pi 进行开源工作，作者鼓励你分享编码会话数据。这有助于使用真实的开发工作流程改进模型、提示词、工具和评估。

可以使用 [`badlogic/pi-share-hf`](https://github.com/badlogic/pi-share-hf) 工具将会话发布到 Hugging Face。

## 适用场景

Pi 特别适合：

- **追求定制化的开发者**：希望工具完全按照自己的方式工作
- **需要深度集成**：想要将 AI 编程助手嵌入到现有工具链中
- **重视隐私和安全**：希望在容器中运行或构建自己的权限系统
- **喜欢实验和创新**：想要尝试新的工作流和功能
- **团队协作**：通过共享技能、提示模板和扩展来统一团队实践

## 对比其他工具

与 Claude Code、Cursor、Cline 等工具相比：

| 特性 | Pi | Claude Code | Cursor | Cline |
|------|-----|-------------|--------|-------|
| 核心理念 | 极简 + 可扩展 | 内置所有功能 | 内置 + 插件 | VS Code 扩展 |
| MCP 支持 | 通过扩展 | 原生支持 | 原生支持 | 原生支持 |
| 子代理 | 通过扩展 | 原生支持 | 原生支持 | 有限支持 |
| 计划模式 | 通过扩展 | 原生支持 | 原生支持 | 支持 |
| 定制能力 | 极高 | 中等 | 中等 | 中等 |
| 学习曲线 | 中等 | 低 | 低 | 低 |
| 适用场景 | 灵活多变 | 通用 | VS Code 用户 | VS Code 用户 |

## 总结

Pi Agent 是一个与众不同的 AI 编程助手。它不试图预测你需要什么，而是给你构建自己工具的能力。这种"少即是多"的设计哲学让 Pi 成为了一个高度灵活、适应性极强的工具。

如果你喜欢：
- 完全控制你的工作流
- 根据需要添加功能
- 在终端中工作
- 参与一个活跃的开源社区

那么 Pi 可能就是你在寻找的 AI 编程助手。

## 资源链接

- **官方网站**：https://pi.dev
- **GitHub**：https://github.com/badlogic/pi
- **NPM**：https://www.npmjs.com/package/@earendil-works/pi-coding-agent
- **Discord**：https://discord.com/invite/3cU7Bz4UPx
- **创始人博客**：https://mariozechner.at/posts/2025-11-30-pi-coding-agent/

---

*本文基于 Pi Agent 0.84.2 版本编写，功能可能随版本更新而变化。*