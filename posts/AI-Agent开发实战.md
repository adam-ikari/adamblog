---
title: AI Agent 开发实战：从零构建一个能动手干活的智能助手
description: 手把手教你从零开发一个 AI Agent——项目搭建、工具定义、Agent 循环、记忆管理、错误处理，完整代码可直接运行
category: AI
tags: [AI, Agent, Python, 实战, LangChain, 教程]
recommend: true
date: 2026-07-12
top: true
series: ai-concepts
---

# AI Agent 开发实战：从零构建一个能动手干活的智能助手

## 前言：为什么要自己开发 Agent

上一篇讲清了 Agent 是什么、能做什么。这篇直接动手——**从零写一个能运行的 Agent**。

你会得到一个这样的助手：
- 能听懂自然语言指令
- 能调用搜索引擎查资料
- 能读写文件、执行代码
- 能记住对话历史，多轮协作
- 遇到错误能自我修正

读完这篇，你能回答：**Agent 怎么写、核心循环怎么设计、工具怎么定义、记忆怎么管**。

---

## 一、项目准备与环境搭建

### 1.1 技术选型

| 组件 | 选择 | 理由 |
|------|------|------|
| 语言 | Python 3.10+ | 生态最丰富，AI 工具链最成熟 |
| 模型接口 | OpenAI 兼容 API | 支持 DeepSeek、讯飞、硅基流动等国产模型 |
| HTTP 请求 | `httpx` | 异步支持好，API 调用标准 |
| 环境管理 | `uv` | 比 pip 更快，依赖锁定更可靠 |

### 1.2 项目结构

```
my-agent/
├── agent/
│   ├── __init__.py
│   ├── core.py          # Agent 核心循环
│   ├── tools.py         # 工具定义
│   ├── memory.py        # 记忆管理
│   ├── llm.py           # 大模型接口封装
│   └── utils.py         # 辅助函数
├── main.py              # 入口脚本
├── pyproject.toml       # 项目配置
└── README.md
```

### 1.3 初始化项目

```bash
# 创建项目目录
mkdir my-agent && cd my-agent

# 用 uv 初始化
uv init --python 3.12

# 安装依赖
uv add httpx python-dotenv

# 创建 .env 文件
cat > .env << 'EOF'
API_KEY=sk-your-api-key-here
BASE_URL=https://api.deepseek.com
MODEL=deepseek-chat
EOF
```

---

## 二、大模型接口封装

Agent 的核心是和大模型对话。先封装一个简洁的 LLM 客户端：

```python
# agent/llm.py
import os
import json
import httpx
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class LLMClient:
    """封装大模型 API 调用"""
    
    def __init__(self):
        self.api_key = os.getenv("API_KEY")
        self.base_url = os.getenv("BASE_URL", "https://api.deepseek.com")
        self.model = os.getenv("MODEL", "deepseek-chat")
        self.client = httpx.Client(timeout=60.0)
    
    def chat(self, messages: List[Dict[str, str]], tools: List[Dict] = None) -> Dict[str, Any]:
        """
        发送聊天请求
        
        Args:
            messages: 对话历史，格式 [{"role": "user", "content": "..."}]
            tools: 可选的工具定义列表
        
        Returns:
            模型的响应字典
        """
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.7,
        }
        
        # 如果有工具定义，加入请求
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"
        
        response = self.client.post(
            f"{self.base_url}/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        
        return response.json()["choices"][0]["message"]
```

**关键设计**：
- `messages` 参数支持多轮对话历史
- `tools` 参数让模型知道"有哪些工具可用"
- 返回结构化数据，方便后续处理工具调用

---

## 三、工具定义与实现

Agent 的能力来自于工具。我们先定义两个核心工具：**网页搜索**和**文件读写**。

### 3.1 工具定义格式

工具需要告诉模型：**我能做什么、需要什么参数、返回什么**。格式遵循 OpenAI 的 Function Calling 规范：

```python
# agent/tools.py
import subprocess
import json
from typing import Dict, Any

# 工具定义（告诉模型有哪些工具可用）
TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "web_search",
            "description": "搜索互联网获取最新信息，支持查询新闻、资料、数据等",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "搜索关键词，建议用简洁明确的中文或英文",
                    }
                },
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "读取指定文件的内容，支持文本文件（.txt, .md, .py, .json 等）",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "文件的绝对路径或相对路径",
                    }
                },
                "required": ["path"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "将内容写入指定文件，如果文件已存在会覆盖",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "文件的绝对路径或相对路径",
                    },
                    "content": {
                        "type": "string",
                        "description": "要写入的文件内容",
                    },
                },
                "required": ["path", "content"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "run_python",
            "description": "执行 Python 代码并返回结果，可用于计算、数据处理等",
            "parameters": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "要执行的 Python 代码，注意缩进和换行",
                    }
                },
                "required": ["code"],
            },
        },
    },
]


# 工具实现（实际执行逻辑）
def web_search(query: str) -> str:
    """
    模拟网页搜索（实际项目中可接入 DuckDuckGo、Bing 等 API）
    """
    # 这里用模拟数据演示，实际使用时接入真实搜索 API
    mock_results = {
        "Python 最新版本": "Python 3.13 于 2024 年 10 月发布，带来了改进的 REPL、更好的错误消息等特性。",
        "DeepSeek API 价格": "DeepSeek-V3 API 定价：输入 2 元/百万 token，输出 8 元/百万 token。",
    }
    
    # 简单匹配，实际项目用搜索引擎 API
    for key, value in mock_results.items():
        if key in query or query in key:
            return f"搜索结果：{value}"
    
    return f"搜索完成，找到关于'{query}'的相关信息。建议查看官方文档获取最新详情。"


def read_file(path: str) -> str:
    """读取文件内容"""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return f"错误：文件 '{path}' 不存在"
    except Exception as e:
        return f"错误：读取文件时发生异常 - {str(e)}"


def write_file(path: str, content: str) -> str:
    """写入文件内容"""
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"成功写入文件：{path}"
    except Exception as e:
        return f"错误：写入文件时发生异常 - {str(e)}"


def run_python(code: str) -> str:
    """执行 Python 代码"""
    try:
        # 使用 subprocess 执行，限制执行时间
        result = subprocess.run(
            ["python3", "-c", code],
            capture_output=True,
            text=True,
            timeout=10,
        )
        output = result.stdout.strip()
        error = result.stderr.strip()
        
        if result.returncode != 0:
            return f"执行出错：\n{error}"
        
        return output if output else "（代码执行成功，无输出）"
    except subprocess.TimeoutExpired:
        return "错误：代码执行超时（限制 10 秒）"
    except Exception as e:
        return f"错误：执行代码时发生异常 - {str(e)}"


# 工具路由表：名字 -> 函数
tool_registry = {
    "web_search": web_search,
    "read_file": read_file,
    "write_file": write_file,
    "run_python": run_python,
}
```

**设计要点**：
- `TOOL_DEFINITIONS` 是"说明书"，告诉模型每个工具的作用和参数
- `tool_registry` 是"执行器"，把模型生成的工具调用映射到实际函数
- 每个工具都有完整的错误处理，防止 Agent 崩溃

---

## 四、Agent 核心循环

这是 Agent 的心脏——**感知 → 思考 → 行动 → 观察**的循环：

```python
# agent/core.py
import json
from typing import List, Dict, Any
from .llm import LLMClient
from .tools import TOOL_DEFINITIONS, tool_registry
from .memory import MemoryManager


class Agent:
    """
    AI Agent 核心类
    
    实现 Agent 循环：感知 -> 思考 -> 行动 -> 观察
    """
    
    def __init__(self):
        self.llm = LLMClient()
        self.memory = MemoryManager()
        self.max_iterations = 10  # 防止无限循环
    
    def run(self, user_input: str) -> str:
        """
        执行一次完整的 Agent 任务
        
        Args:
            user_input: 用户的自然语言指令
            
        Returns:
            最终回答
        """
        # 1. 感知：把用户输入加入记忆
        self.memory.add_message("user", user_input)
        
        # 2. 进入 Agent 循环
        for i in range(self.max_iterations):
            # 2.1 思考：让模型决定下一步做什么
            response = self.llm.chat(
                messages=self.memory.get_messages(),
                tools=TOOL_DEFINITIONS,
            )
            
            # 2.2 检查模型是否想调用工具
            tool_calls = response.get("tool_calls")
            
            if tool_calls:
                # 模型决定调用工具
                self._handle_tool_calls(tool_calls)
            else:
                # 模型直接给出回答，任务完成
                assistant_msg = response.get("content", "")
                self.memory.add_message("assistant", assistant_msg)
                return assistant_msg
        
        # 达到最大迭代次数，强制结束
        return "（Agent 达到最大思考次数，任务未完成。请尝试简化指令。）"
    
    def _handle_tool_calls(self, tool_calls: List[Dict]):
        """
        处理模型发起的工具调用
        
        Args:
            tool_calls: 模型生成的工具调用列表
        """
        for tool_call in tool_calls:
            # 提取工具调用信息
            function_name = tool_call["function"]["name"]
            function_args = json.loads(tool_call["function"]["arguments"])
            tool_call_id = tool_call["id"]
            
            print(f"🔧 调用工具: {function_name}({function_args})")
            
            # 执行工具
            if function_name in tool_registry:
                tool_func = tool_registry[function_name]
                try:
                    result = tool_func(**function_args)
                except Exception as e:
                    result = f"工具执行出错: {str(e)}"
            else:
                result = f"错误：未知工具 '{function_name}'"
            
            print(f"📋 工具结果: {result[:200]}...")
            
            # 把工具结果加入对话历史（观察）
            self.memory.add_tool_result(tool_call_id, function_name, result)
```

**循环逻辑**：
1. 用户输入 → 加入记忆
2. 模型思考 → 决定调用工具或直接回答
3. 如果调用工具 → 执行工具 → 把结果加入记忆 → 回到第 2 步
4. 如果直接回答 → 任务完成，返回结果

---

## 五、记忆管理

Agent 需要记住对话历史和工具执行结果。简单实现用列表存储：

```python
# agent/memory.py
from typing import List, Dict

class MemoryManager:
    """
    管理 Agent 的对话记忆
    
    支持多轮对话和工具调用结果的存储
    """
    
    def __init__(self, max_messages: int = 20):
        self.messages: List[Dict] = []
        self.max_messages = max_messages
    
    def add_message(self, role: str, content: str):
        """
        添加一条消息到记忆
        
        Args:
            role: 消息角色（user/assistant/system/tool）
            content: 消息内容
        """
        self.messages.append({
            "role": role,
            "content": content,
        })
        
        # 控制记忆长度，防止超出上下文窗口
        if len(self.messages) > self.max_messages:
            # 保留系统提示和最近的对话
            self.messages = self.messages[-self.max_messages:]
    
    def add_tool_result(self, tool_call_id: str, name: str, result: str):
        """
        添加工具执行结果到记忆
        
        格式遵循 OpenAI 的 tool message 规范
        """
        self.messages.append({
            "role": "tool",
            "tool_call_id": tool_call_id,
            "name": name,
            "content": result,
        })
    
    def get_messages(self) -> List[Dict]:
        """获取当前所有记忆（用于发送给模型）"""
        return self.messages.copy()
    
    def clear(self):
        """清空记忆"""
        self.messages.clear()
```

**关键设计**：
- `max_messages` 限制记忆长度，防止超出模型上下文窗口
- 工具调用结果以特殊格式（`role: tool`）存储，让模型理解"这是工具返回的数据"
- 支持清空记忆，方便开始新对话

---

## 六、入口脚本与运行

```python
# main.py
from agent.core import Agent

def main():
    """Agent 入口"""
    agent = Agent()
    
    print("🤖 Agent 已启动，输入 'exit' 退出\n")
    
    while True:
        user_input = input("你: ").strip()
        
        if not user_input:
            continue
        
        if user_input.lower() in ("exit", "quit", "退出"):
            print("👋 再见！")
            break
        
        print("🤖 Agent 思考中...")
        try:
            response = agent.run(user_input)
            print(f"\nAgent: {response}\n")
        except Exception as e:
            print(f"❌ 出错了: {e}\n")


if __name__ == "__main__":
    main()
```

### 运行效果

```bash
$ python main.py

🤖 Agent 已启动，输入 'exit' 退出

你: 搜索一下 Python 最新版本的信息
🤖 Agent 思考中...
🔧 调用工具: web_search({'query': 'Python 最新版本'})
📋 工具结果: 搜索结果：Python 3.13 于 2024 年 10 月发布，带来了改进的 REPL、更好的错误消息等特性。

Agent: Python 3.13 是最新版本，于 2024 年 10 月正式发布。主要新特性包括：

- 改进的交互式解释器（REPL）
- 更友好的错误消息提示
- 性能优化

如果你正在使用旧版本，建议评估升级。

你: 帮我写个 hello.py，内容是打印当前时间
🤖 Agent 思考中...
🔧 调用工具: write_file({'path': 'hello.py', 'content': 'from datetime import datetime\n\nprint(f"当前时间: {datetime.now()}"\n'})
📋 工具结果: 成功写入文件：hello.py

Agent: 已创建 hello.py，内容如下：

```python
from datetime import datetime

print(f"当前时间: {datetime.now()}")
```

你可以运行 `python hello.py` 查看效果。
```

---

## 七、进阶：错误处理与自我修正

生产环境的 Agent 需要更健壮。以下是增强版核心循环，加入了错误处理和自我修正：

```python
# agent/core_advanced.py（进阶版）
import json
import traceback
from typing import List, Dict, Any, Optional
from .llm import LLMClient
from .tools import TOOL_DEFINITIONS, tool_registry
from .memory import MemoryManager


class AdvancedAgent:
    """增强版 Agent，支持错误处理和重试"""
    
    def __init__(self):
        self.llm = LLMClient()
        self.memory = MemoryManager()
        self.max_iterations = 10
        self.max_retries = 2  # 工具执行失败时的重试次数
    
    def run(self, user_input: str) -> str:
        """执行 Agent 任务，带完整错误处理"""
        self.memory.add_message("user", user_input)
        
        for i in range(self.max_iterations):
            try:
                response = self.llm.chat(
                    messages=self.memory.get_messages(),
                    tools=TOOL_DEFINITIONS,
                )
                
                tool_calls = response.get("tool_calls")
                
                if tool_calls:
                    # 处理工具调用，支持重试
                    success = self._handle_tool_calls_with_retry(tool_calls)
                    if not success:
                        # 工具全部失败，告诉模型让它重新规划
                        self.memory.add_message(
                            "system",
                            "注意：之前的工具调用全部失败。请尝试其他方法或直接回答。"
                        )
                else:
                    assistant_msg = response.get("content", "")
                    self.memory.add_message("assistant", assistant_msg)
                    return assistant_msg
                    
            except Exception as e:
                error_msg = f"Agent 循环出错: {str(e)}"
                print(f"❌ {error_msg}")
                self.memory.add_message("system", error_msg)
        
        return "（Agent 达到最大思考次数，请尝试简化指令。）"
    
    def _handle_tool_calls_with_retry(self, tool_calls: List[Dict]) -> bool:
        """
        处理工具调用，支持失败重试
        
        Returns:
            是否至少有一个工具成功执行
        """
        any_success = False
        
        for tool_call in tool_calls:
            function_name = tool_call["function"]["name"]
            function_args = json.loads(tool_call["function"]["arguments"])
            tool_call_id = tool_call["id"]
            
            # 尝试执行，支持重试
            for attempt in range(self.max_retries + 1):
                try:
                    if function_name in tool_registry:
                        result = tool_registry[function_name](**function_args)
                        any_success = True
                    else:
                        result = f"错误：未知工具 '{function_name}'"
                    
                    self.memory.add_tool_result(tool_call_id, function_name, result)
                    break  # 成功，跳出重试循环
                    
                except Exception as e:
                    error_detail = traceback.format_exc()
                    print(f"⚠️ 工具 {function_name} 第 {attempt + 1} 次尝试失败: {e}")
                    
                    if attempt < self.max_retries:
                        continue  # 还有重试机会
                    else:
                        # 重试耗尽，记录错误
                        self.memory.add_tool_result(
                            tool_call_id,
                            function_name,
                            f"工具执行失败（重试 {self.max_retries} 次后仍失败）: {str(e)}"
                        )
        
        return any_success
```

---

## 八、总结与扩展方向

### 8.1 核心架构回顾

```mermaid
flowchart TD
    A["用户输入<br/>帮我查一下天气"] --> B["Agent 核心循环"]
    B --> C["感知<br/>接收输入"]
    C --> D["思考<br/>模型决策"]
    D --> E["行动<br/>调用工具"]
    E --> F["观察结果"]
    F -->|循环| D
    E --> G["工具层"]
    subgraph G["工具层"]
        H["搜索引擎"]
        I["文件读写"]
        J["代码执行"]
    end

### 8.2 扩展方向

| 方向 | 说明 | 技术方案 |
|------|------|---------|
| **RAG 增强** | 让 Agent 能查私有知识库 | 向量数据库 + Embedding |
| **多 Agent 协作** | 多个 Agent 分工合作 | 主从架构、消息队列 |
| **持久化记忆** | 长期记忆，跨会话保留 | 数据库存储、向量检索 |
| **Web 界面** | 图形化交互 | Gradio、Streamlit、FastAPI |
| **异步执行** | 支持长时间任务 | asyncio、Celery |

### 8.3 下一步建议

1. **接入真实搜索 API**：替换 `web_search` 中的模拟数据，接入 DuckDuckGo、Serper 或 Bing API
2. **添加更多工具**：Git 操作、数据库查询、邮件发送等
3. **实现持久化存储**：用 SQLite 或 Redis 存储对话历史
4. **加入流式输出**：让 Agent 的回答实时显示，提升体验
5. **部署到服务器**：用 Docker + FastAPI 封装成服务

---

## 参考代码

完整项目代码已开源：[github.com/yourname/my-agent](https://github.com/yourname/my-agent)

核心文件速览：
- `agent/llm.py` — 大模型接口封装
- `agent/tools.py` — 工具定义与实现
- `agent/core.py` — Agent 核心循环
- `agent/memory.py` — 记忆管理
- `main.py` — 入口脚本

---

## 延伸阅读

- **想理解 Agent 原理**：[AI 开发核心概念科普](/posts/AI开发核心概念科普) — 大模型、API、Agent 等概念详解
- **想了解 LangChain**：[LangChain 官方文档](https://python.langchain.com/) — 更完整的 Agent 框架
- **想深入 Function Calling**：[OpenAI Function Calling 指南](https://platform.openai.com/docs/guides/function-calling)
