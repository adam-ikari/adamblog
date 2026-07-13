---
title: macOS Claude Code 常见报错排查
description: Claude Code 接入国产大模型时的常见报错排查手册，含 401 认证失败、连接超时、模型不存在、上下文超限等，附 curl 验证法
category: AI工具
tags: [macOS, Claude Code, 报错排查, 调试, 国产大模型]
recommend: false
date: 2026-06-30
series: series-macOS-claude
---
# macOS Claude Code 常见报错排查

## 前言

照着 [安装配置教程](/posts/macOS-安装和配置-Claude-Code-教程) 接好国产模型，不代表就一定能一次跑通。认证方式写错、地址后缀不对、模型 ID 填错、上下文太长……哪个环节出岔子都会报错。

这篇把接入国产模型时最常见的几类报错整理成一份**排查手册**。每个报错都按「典型现象 → 可能原因 → 排查步骤 → 解决方案」走一遍，再教你一个万能的 `curl` 验证法——能在 Claude Code 之外先把问题定位到。

## 万能排查法：先用 curl 验证

折腾 Claude Code 配置之前，先用 `curl` 直接对提供商 API 发一个最小请求。这一步能把问题二分清楚：**到底是 API Key/地址本身的问题，还是 Claude Code 配置的问题**。

以 DeepSeek 为例：

```bash
curl -X POST https://api.deepseek.com/chat/completions \
  -H "Authorization: Bearer $ANTHROPIC_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

- 返回正常的 JSON 回复 → Key 和地址都对，问题在 Claude Code 配置
- 返回 401 → Key 错或认证头格式错
- 返回 404 / model not found → 模型 ID 填错
- 连接超时 → 网络问题

> 💡 这里用的是 DeepSeek 原生的 OpenAI 兼容端点（`/chat/completions`）来验证 Key 有没有效，这跟 Claude Code 走的 Anthropic 协议端点是两回事，但**验证 Key 有效性足够了**。换提供商时把 URL、模型 ID、Token 换成对应的就行。

![Claude Code 报错定位 curl 二分法](/posts/macOS-Claude-Code-报错排查/troubleshoot-curl-decision.svg)

## 报错一：401 认证失败 / Unauthorized

### 典型现象

```
401 Unauthorized
Authentication error
```

### 可能原因

1. **用了 `ANTHROPIC_API_KEY` 而非 `ANTHROPIC_AUTH_TOKEN`**（最常见）
2. API Key 本身填错或已失效
3. Key 对应账户余额不足

### 排查步骤

```bash
# 1. 确认用的是 AUTH_TOKEN 不是 API_KEY
grep -E "ANTHROPIC_(API_KEY|AUTH_TOKEN)" ~/.claude/settings.json

# 2. 用 curl 验证 Key 本身是否有效（见上文）
# 3. 登录提供商控制台，确认 Key 状态和余额
```

### 解决方案

接入国产模型**必须用 `ANTHROPIC_AUTH_TOKEN`**（发 `Authorization: Bearer`），因为第三方网关只认 Bearer 认证。详见 [配置详解](/posts/macOS-Claude-Code-配置详解#anthropic-auth-token-vs-anthropic-api-key-最容易踩的坑)。

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-你的真实key"
  }
}
```

> 如果 `curl` 验证 Key 也返回 401，那是 Key 本身的问题（填错/失效/欠费），去提供商控制台处理，跟 Claude Code 没关系。

## 报错二：连接超时 / Connection timeout

### 典型现象

```
Request timed out
ETIMEDOUT / ECONNREFUSED
```

### 可能原因

1. Base URL 填错（域名拼错、多了或少了路径后缀）
2. 该提供商是海外服务，本地无代理
3. 代理配置未生效

### 排查步骤

```bash
# 1. 测试到 API 域名的连通性
curl -I https://api.deepseek.com

# 2. 检查 Base URL 是否正确（注意 /v1 后缀）
grep ANTHROPIC_BASE_URL ~/.claude/settings.json

# 3. 若用海外服务，检查代理
echo $https_proxy $http_proxy
```

### 解决方案

- 确认 Base URL：DeepSeek 不带 `/v1`，硅基流动/智谱/OpenRouter 带 `/v1`，以提供商文档为准
- 海外服务（如 OpenRouter）需配代理：

```bash
echo 'export https_proxy=http://127.0.0.1:7890' >> ~/.zshrc
echo 'export http_proxy=http://127.0.0.1:7890' >> ~/.zshrc
source ~/.zshrc
```

- 纯国内网络优先选直连友好的提供商，见 [选型指南](/posts/macOS-国产模型提供商选型指南)

## 报错三：模型不存在 / model not found

### 典型现象

```
model not found
invalid model id
```

### 可能原因

1. `ANTHROPIC_MODEL` 填的模型 ID 提供商不认识
2. 该 Key 无权访问指定模型
3. 档位映射缺失，Claude Code 请求了默认的 `claude-*` 模型名但提供商没有

### 排查步骤

```bash
# 1. 查你配的模型 ID
grep -E "ANTHROPIC_MODEL|ANTHROPIC_DEFAULT" ~/.claude/settings.json

# 2. 去提供商文档核对正确的模型 ID
# 3. 用 curl 带上该 model 测试
```

### 解决方案

- 填提供商文档里列出的**正确模型 ID**（注意有的要带命名空间，如 `deepseek-ai/DeepSeek-V3`）
- 把 Opus/Sonnet/Haiku 三个档位都映射到你的国产模型，避免 Claude Code 请求默认模型名时找不到：

```json
"env": {
  "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-chat",
  "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-chat",
  "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-chat"
}
```

## 报错四：上下文超限 / context length exceeded

### 典型现象

```
context length exceeded
maximum context length is ...
```

### 可能原因

1. 单次会话累积的对话/代码太长，超过模型上下文窗口
2. 把大文件整个塞进了上下文

### 排查步骤

在 Claude Code 会话里用 `/cost` 查看当前 token 用量，估算是否接近模型上限。

### 解决方案

- 用 `/compact` 压缩对话历史，释放 token 空间
- 用 `/clear` 清空历史重新开始（会丢失上下文）
- 别一次性读取超大文件，按需 `Read` 指定行范围
- 需要超长上下文的场景，选上下文窗口大的模型（如 Kimi），见 [选型指南](/posts/macOS-国产模型提供商选型指南)

## 报错五：配置改了不生效

### 典型现象

改了 settings.json，但 Claude Code 行为没变，还用着旧配置。

### 可能原因

1. 正在运行的会话没重启
2. 环境变量在 Shell 里也设了同名值，优先级覆盖了 settings.json
3. 改错了文件（用户级 vs 项目级搞混）

### 排查步骤

```bash
# 1. 确认有没有 Shell 层面的同名环境变量覆盖
env | grep ANTHROPIC

# 2. 确认改的是哪个 settings.json
ls -la ~/.claude/settings.json
```

### 解决方案

- 改完配置**重启会话**：`/exit` 退出后重新 `claude`
- 如果 `env | grep ANTHROPIC` 有输出，说明 `~/.zshrc` 里也设了，会覆盖 settings.json。要么删掉 Shell 里的，要么理解这个优先级
- 多套配置用 [cc-Switch](/posts/macOS-配置cc-Switch教程) 管理，避免手动改文件出错

## 通用排查流程

遇到报错别慌，按这个顺序走：

1. **curl 验证 Key/地址是否本身有效**
   - curl 也报错 → 问题在 API 侧（Key/地址/网络/余额），去提供商控制台解决
   - curl 正常 → 问题在 Claude Code 配置，往下走

2. **检查三大配置**：
   - ANTHROPIC_BASE_URL 对不对（含 /v1 后缀）
   - 用的是 ANTHROPIC_AUTH_TOKEN 不是 API_KEY
   - ANTHROPIC_MODEL 的模型 ID 提供商认不认

3. **重启会话再试**
4. **还不行 → 开启调试看详细请求日志**

## 开启调试日志

需要看 Claude Code 实际发出去的请求时，可以开调试：

```bash
claude --debug
```

或者设环境变量调高日志级别，能看到请求的 URL、认证头（注意 Key 会被脱敏）、响应状态码，定位 401 / 404 这类问题很有用。

## 常见报错速查表

| 报错 | 大概率原因 | 一句话解决 |
|------|----------|-----------|
| 401 Unauthorized | 用了 `API_KEY` 而非 `AUTH_TOKEN` | 换成 `ANTHROPIC_AUTH_TOKEN` |
| 连接超时 | 地址错或没代理 | 核对 Base URL，海外服务配代理 |
| model not found | 模型 ID 填错或档位未映射 | 填正确 ID，映射 `DEFAULT_*_MODEL` |
| context exceeded | 上下文太长 | `/compact` 或换大窗口模型 |
| 改配置不生效 | 会话没重启或被 Shell 变量覆盖 | 重启会话，清掉 Shell 同名变量 |

## 总结

排查说到底就是**二分定位**：先用 `curl` 把「API 侧问题」和「Claude Code 配置问题」分开，再针对后者查 Base URL、认证字段、模型 ID 这三样。

记住下面这几条，多数报错自己就能搞定：

- **401 先查是不是用了 `ANTHROPIC_API_KEY`，国产模型要用 `AUTH_TOKEN`**
- **超时先 curl 测连通性，再查地址和代理**
- **model not found 就核对模型 ID + 补全档位映射**
- **改完配置一定重启会话**

下一篇 [实战案例](/posts/macOS-Claude-Code-实战案例) 会拿一个真实小项目，把前面这些知识串起来用一遍。
