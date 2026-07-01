---
name: browser-research
description: 当需要查资料但目标网页是 JavaScript 动态渲染的、WebFetch 只能拿到空壳或品牌页时使用。用 Python Playwright 驱动 Chromium 真正渲染页面，拿到 JS 渲染后的完整正文内容。适用于查产品官网规格、SPA 应用内容、需要交互/滚动才加载的页面、登录后才可见的公开页面等。当 WebFetch 返回"页面主要是导航""未包含技术细节""是 JS 渲染的"时，改用本 skill。
---

# 浏览器查资料（渲染 JS 页面）

WebFetch 抓的是静态 HTML，对 JavaScript 动态渲染的页面（产品官网、SPA、靠 JS 填充内容的站点）往往只拿到导航壳子或品牌语，拿不到真正的正文。这个 skill 用本地 Python Playwright 驱动 Chromium 真正渲染页面，等 JS 跑完再取 `document.body.innerText`，拿到人眼能看到的内容。

## 环境前提

本环境已装好，直接用即可：

- **Python Playwright 1.60.0**：`python3 -c "from playwright.sync_api import sync_playwright"` 应输出 OK
- **Chromium**：在 `~/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome`
- `playwright` 命令行是 Python 版（`/usr/bin/playwright` 或 `~/.local/bin/playwright`，`#!/usr/bin/python3`），不是 Node 版——所以**用 Python 调用，别用 Node import**（Node 的 playwright 包没真正安装，会 ERR_MODULE_NOT_FOUND）

如果环境变了（换机器/重装），先验证：

```bash
python3 -c "from playwright.sync_api import sync_playwright; print('OK')"
# 若缺浏览器二进制：
python3 -m playwright install chromium
```

## 基本用法：抓单页正文

写一个临时脚本（放 `/tmp/` 即可，用完不留下），渲染后取正文：

```python
# /tmp/fetch.py
from playwright.sync_api import sync_playwright
import re

url = "https://example.com/some-js-heavy-page"
with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto(url, wait_until="networkidle", timeout=35000)
    page.wait_for_timeout(3000)   # 给懒加载/动画一点时间
    text = page.evaluate("() => document.body.innerText")
    text = re.sub(r"\n{3,}", "\n\n", text)   # 压掉多余空行
    print(text)
    b.close()
```

运行：`python3 /tmp/fetch.py`

## 关键参数说明

- `wait_until="networkidle"`：等到网络空闲（页面加载完）再继续。对大多数站点够用；极慢的站点可换 `"domcontentloaded"` 再手动 `wait_for_timeout`。
- `page.wait_for_timeout(3000)`：再等 3 秒，留给 JS 后续填充、懒加载图片、动画。内容多的站可加到 5000。
- `timeout=35000`：总超时，超时抛异常——抓不到就抓不到，别卡死。
- `document.body.innerText`：取渲染后可见文本，不含 HTML 标签，最适合阅读和提取事实。

## 进阶：多页批量抓

```python
from playwright.sync_api import sync_playwright
import re

urls = [
    "https://example.com/page1",
    "https://example.com/page2",
]
with sync_playwright() as p:
    b = p.chromium.launch()
    for url in urls:
        page = b.new_page()
        try:
            page.goto(url, wait_until="networkidle", timeout=35000)
            page.wait_for_timeout(3000)
            text = page.evaluate("() => document.body.innerText")
            text = re.sub(r"\n{3,}", "\n\n", text)
            print(f"\n========== {url} ==========")
            print(text[:7000])   # 长页截断，分段取
        except Exception as e:
            print(f"\n========== {url} ========== ERROR: {e}")
        page.close()
    b.close()
```

长页面正文超过 7000 字符时，分段取：第一次 `text[:7000]`，第二次 `text[7000:14000]`，以此类推。

## 何时用、何时不用

**用：**
- 产品官网（麒麟、统信等）的技术规格页——JS 渲染，WebFetch 只拿到导航
- SPA 站点（React/Vue 单页应用）的实际内容
- 需要滚动才加载的列表（配合 `page.mouse.wheel` 滚动后再取）
- WebFetch 明确返回"页面主要是 X""未包含 Y"时

**不用：**
- 静态 HTML 站点（维基、多数文档站）——WebFetch 更快更省，直接用 WebFetch
- 需要登录的私密内容——Playwright 默认无凭证，拿不到；除非有公开预览
- 只查一个 API/JSON 接口——`curl` 更直接

## 滚动加载场景

有些页面内容靠滚动触发懒加载，渲染完只拿到上半截。滚动几次再取：

```python
for _ in range(5):
    page.mouse.wheel(0, 3000)
    page.wait_for_timeout(1000)
text = page.evaluate("() => document.body.innerText")
```

## 诚实使用

拿到的是渲染后正文，**仍要按 blog-writing 的诚实底线处理**：版本号、规格等易变事实标注"截至查阅时"；拿到的官方营销话术要剥离，只取可核验的技术事实（支持的 CPU、安全标准、具体特性名），不照搬宣传句。浏览器查资料解决的是"拿得到"的问题，"写得准"仍要靠核验和标注。

## 清理

临时脚本放 `/tmp/`，系统重启自动清，无需手动删。不要把抓取脚本留在仓库里——它是工具，不是交付物。
