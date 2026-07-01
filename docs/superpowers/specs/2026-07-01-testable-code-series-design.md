# 编写可测试代码系列 设计文档

## 概述

将 misko hevery 的《Guide: Writing Testable Code》整理翻译为一个 5 篇的中文系列，代码示例由原 Java 改写为 C++（贴合 C++ 语境，呼应"编写可测试的 C++ 代码"主题）。

- 原文来源：https://github.com/mhevery/guide-to-testable-code（已 clone 到 /tmp/guide-to-testable-code）
- 分类：文档翻译
- 系列文件：posts/ 下 5 篇 + series/ 索引页

## 系列结构（5 篇）

| 篇 | 文件 | 内容 | 原文来源 |
|---|---|---|---|
| 总纲 | 现有 `【文档翻译】指南：编写可测试代码（总纲）.md`（补全） | 4 个缺陷的危险信号 + 每条简要说明 + 系列导引 | README.md |
| 1 | 新建 `【文档翻译】编写可测试代码-缺陷一-构造函数做实事.md` | 构造函数做实事：为何是缺陷、识别、修复、遗留 | flaw-constructor-does-work.md (1091行) |
| 2 | 新建 `【文档翻译】编写可测试代码-缺陷二-挖掘合作者.md` | 挖掘合作者：德米特定律、上下文对象、修复 | flaw-digging-into-colaborators.md (574行) |
| 3 | 新建 `【文档翻译】编写可测试代码-缺陷三-全局状态与单例.md` | 脆弱的全局状态和单例 | flaw-brittle-global-state-singletons.md (848行) |
| 4 | 新建 `【文档翻译】编写可测试代码-缺陷四-类做的太多.md` | 类做的太多：单一职责、提取类 | flaw-class-does-too-much.md (100行) |

每篇原文结构：Why this is a Flaw → Recognizing the Flaw → Fixing the Flaw → Caveat（遗留处理）。

## 翻译原则

- **忠于原文**：这是文档翻译类，不搞原创润色。原文论述、结构、论点完整保留，译文通顺即可。
- **代码示例 Java → C++**：原文 Java 代码改写为等价的 C++（概念对应：依赖注入、工厂、单例、提取类在 C++ 中均有自然写法）。每篇开头标注"代码示例由原 Java 改写为 C++"，避免读者误以为是原文原貌。
- **frontmatter**：沿用现有总纲风格（category: 文档翻译，tags 含"编写可测试代码"），加 series 块串 prev/next。
- **系列索引**：在 series/ 建 series-testable-code.md，含 SeriesCardList。

## 诚实底线

- 不冒称逐字翻译——代码已改写，明确标注。
- 不编造原文没有的内容——论述忠于 misko 原文。
- 译文不通顺处宁可直译保留原意，不为通顺而偏离原文。

## 不做（YAGNI）

- 不加原创评论或个人发挥（翻译类，保持译者立场）。
- 不改原文论点顺序或结构。
- 不逐字翻译 PDF（用仓库 md 文件为准，PDF 仅作参考）。
