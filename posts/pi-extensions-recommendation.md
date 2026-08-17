# Pi 扩展推荐：提升编码体验的实用工具

基于 Pi Agent 极简可扩展的设计理念，扩展是实现工具定制化的关键。Pi 的扩展生态已经形成了丰富的社区资源。以下是为你精选的几类实用扩展，按使用场景分类：

## 🛡️ 安全与权限控制扩展

### 1. `bash` 命令权限拦截
**适用场景**：防止意外执行危险命令

```typescript
// ~/.pi/agent/extensions/safe-bash.ts
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", async (event, ctx) => {
    if (event.toolName === "bash" && event.input.command?.includes("rm -rf")) {
      const ok = await ctx.ui.confirm("危险操作", "确定要执行 rm -rf 吗？");
      if (!ok) return { block: true, reason: "用户拦截" };
    }
    
    // 拦截敏感文件操作
    if (event.input.command?.includes(".env") || event.input.command.includes("passwd")) {
      return ctx.ui.confirm("敏感操作", "此命令涉及敏感文件，继续？");
    }
  });
}
```

### 2. 路径保护扩展
**适用场景**：防止意外修改关键项目文件

```typescript
pi.on("tool_call", async (event, ctx) => {
  if (event.toolName === "write") {
    const protectedPaths = [".env", "package-lock.json", "yarn.lock"];
    if (protectedPaths.some(p => event.input.path.includes(p))) {
      return ctx.ui.confirm("受保护文件", `确定要修改 ${event.input.path} 吗？`);
    }
  }
});
```

## 📁 Git 与版本控制扩展

### 3. 自动 Git 检查点
**适用场景**：每次工具调用后自动提交 git，便于回滚

```typescript
// 创建 ~/.pi/agent/extensions/git-checkpoint/index.ts
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("tool_execution_end", async (event, ctx) => {
    if (event.toolName === "bash") {
      const cmd = event.input.command as string;
      // 只在 git 仓库中自动提交
      if (cmd.includes("git add") || cmd.match(/\.\./) || cmd.includes("rm")) {
        try {
          await pi.bash({
            command: "git add . && git commit -m 'auto: checkpoint'",
            timeout: 5000
          });
        } catch (e) {
          // 忽略 git 错误（可能没有变更等）
        }
      }
    }
  });
}
```

### 4. 分支智能切换
**适用场景**：自动检测并切换到正确的 git 分支

```typescript
pi.registerTool({
  name: "switch-branch",
  label: "Switch Branch",
  description: "Switch to a git branch with confirmation",
  parameters: {
    type: "object",
    properties: {
      branch: { type: "string", description: "Branch name to switch to" }
    },
    required: ["branch"]
  },
  async execute(_, { branch }) {
    // 确认后切换分支
    const confirmed = await ctx.ui.confirm("分支切换", `确定要切换到 ${branch} 分支吗？`);
    if (confirmed) {
      await pi.bash({ command: `git checkout ${branch}` });
      return { content: [{ type: "text", text: `已切换到 ${branch} 分支` }] };
    }
    return { content: [{ type: "text", text: "分支切换已取消" }] };
  }
});
```

## 🛠️ 开发效率扩展

### 5. 代码审查助手
**适用场景**：自动审查代码变更，发现潜在问题

```typescript
pi.registerTool({
  name: "code-review",
  label: "Code Review",
  description: "Review recent code changes for common issues",
  parameters: {
    type: "object",
    properties: {
      focus: { type: "string", description: "Focus areas (bugs, style, security)", default: "all" }
    },
    required: ["focus"]
  },
  async execute(_, { focus }) {
    // 获取最近的修改并进行审查
    const changes = await pi.bash({ command: "git diff --stat" });
    const issues: string[] = [];
    
    if (changes.content?.some((c: any) => c.includes("TODO"))) {
      issues.push("检测到 TODO 注释");
    }
    if (changes.content?.some((c: any) => c.length > 100 && !c.includes(" "))) {
      issues.push("可能存在很长的一行代码");
    }
    
    return {
      content: [{ type: "text", text: `代码审查结果:\n${issues.join("\n")}` }]
    };
  }
});
```

### 6. 环境变量提醒
**适用场景**：在关键操作前检查环境变量

```typescript
pi.on("before_agent_start", async (event, ctx) => {
  const requiredEnvs = ["ANTHROPIC_API_KEY", "OPENAI_API_KEY"];
  const missing = requiredEnvs.filter(e => !process.env[e]);
  
  if (missing.length > 0) {
    ctx.ui.notify(`缺少环境变量: ${missing.join(", ")}`, "warning");
    // 不阻止，只是提醒
  }
});
```

## 🔧 专用功能扩展

### 7. 思考级别自动切换
**适用场景**：根据任务复杂度自动调整思考级别

```typescript
pi.on("input", async (event, ctx) => {
  // 简单的询问使用低思考级别
  if (/^简单|快速|列出/.test(event.text)) {
    ctx.setThinkingLevel("low");
    ctx.ui.notify("已自动设置为低思考级别", "info");
  }
  // 复杂的问题使用高思考级别
  else if (/解决|分析|优化|复杂/.test(event.text)) {
    ctx.setThinkingLevel("high");
    ctx.ui.notify("已自动设置为高思考级别", "info");
  }
});
```

### 8. 模型智能选择
**适用场景**：根据任务类型推荐最佳模型

```typescript
pi.on("model_select", async (event, ctx) => {
  const taskPatterns: Record<string, string> = {
    "code": "anthropic/claude-3.5-sonnet",
    "creative": "openai/gpt-4o",
    "analysis": "anthropic/claude-3-opus",
    "reasoning": "openai/o1-mini"
  };
  
  const detected = Object.entries(taskPatterns).find(([keyword]) =>
    event.text.toLowerCase().includes(keyword)
  );
  
  if (detected) {
    ctx.ui.notify(`检测到 ${detected[0]} 任务，建议使用 ${detected[1]}`, "info");
  }
});
```

## 📦 如何安装和使用扩展

### 安装方法

```bash
# 全局安装（所有项目可用）
pi install npm:@foo/pi-extensions

# 项目局部安装（仅当前项目）
pi install -l npm:@foo/pi-extensions

# 安装 Git 仓库扩展
pi install git:github.com/user/pi-extensions@v1

# 安装本地扩展
pi install /path/to/local/extension
```

### 常用配置

```json
// settings.json
{
  "extensions": [
    "~/.pi/agent/extensions/safe-bash.ts",
    ".pi/extensions/git-checkpoint/"
  ],
  "packages": [
    "npm:@earendil-works/pi-tools@1.2.0"
  ]
}
```

### 快速测试

```bash
# 临时加载扩展
pi -e ./my-extension.ts "帮我列出目录"

# 或在交互模式中
pi
# 然后在编辑器中
/e safe-bash.ts
```

## 💡 最佳实践

1. **最小化权限**：仅请求必要的 UI 交互权限，避免过度拦截
2. **优雅降级**：当扩展失败时确保基本功能正常
3. **性能考虑**：避免在频繁事件中进行昂贵的操作
4. **文档注释**：清晰的 JSDoc 有助于他人理解和使用你的扩展
5. **测试**：在不同模式（TUI、RPC、print）下测试扩展行为

## 🌐 社区扩展推荐

查看 npm 上的 Pi 扩展：

```bash
# 搜索 Pi 扩展
npm search --keywords=pi-package

# 常见的扩展关键词
# pi-security, pi-git, pi-tool, pi-ui
```

GitHub 上也有很多社区维护的扩展：

- `pi-security-extension` - 安全拦截
- `pi-git-assistant` - Git 操作辅助  
- `pi-todo-integration` - Todo 列表集成
- `pi-theme-collection` - 主题集合

## 🎯 入门建议

如果你是第一次编写 Pi 扩展，推荐从以下开始：

1. **简单的事件监听**：先从 `tool_call` 或 `session_start` 事件入手
2. **UI 交互**：熟悉 `ctx.ui` 的各种方法（confirm, notify, select 等）
3. **自定义工具**：尝试注册一个简单的自定义工具
4. **逐步扩展**：根据实际需求添加更多功能

Pi 的扩展系统设计得非常灵活，你可以根据自己的工作流慢慢打造属于自己的工具集。从小处着手，逐步积累，Pi 将随着你的需求一起成长。

---

*扩展安全提醒：Pi 扩展拥有完整的系统权限，请仅安装来自可信来源的扩展，或审查代码后再安装。*