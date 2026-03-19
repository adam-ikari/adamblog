# Adam的博客 - VitePress 版本

博客已成功从 Hexo 迁移到 VitePress！

## 项目结构

```
dadis-blog/
├── docs/                    # VitePress 源文件
│   ├── .vitepress/         # VitePress 配置
│   │   └── config.mts      # 站点配置
│   ├── public/             # 静态资源
│   ├── posts/              # 博客文章
│   ├── categories/         # 分类页面
│   ├── tags/               # 标签页面
│   ├── archives/           # 归档页面
│   ├── about/              # 关于页面
│   └── index.md            # 首页
├── source/                 # Hexo 源文件（保留）
└── package.json
```

## 快速开始

### 开发模式

```bash
npm run docs:dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run docs:build
```

构建输出在 `docs/.vitepress/dist/` 目录

### 预览生产构建

```bash
npm run docs:preview
```

## 主要特性

- ✅ 26 篇博客文章已迁移
- ✅ 静态资源（图片、CSS、JS）已迁移
- ✅ 导航栏和侧边栏已配置
- ✅ 首页、关于页面、分类、标签、归档页面已创建
- ✅ 响应式设计，支持移动端
- ✅ 内置搜索功能
- ✅ GitHub 集成
- ✅ 支持暗色主题

## 文章迁移

已迁移的文章包括：

### Vue 系列
- Vue学习系列-01-工程创建学习
- Vue学习系列-Vue3的script-setup语法糖
- Vue知识点思维导图
- Vuex介绍

### 前端技术
- 前端知识大纲
- JavaScript代码规范
- element-plus-register-all-icon-with-alias-globally

### 后端技术
- Series-of-Learning-Flask-0
- CPP-入门教程-Part-1
- CPP-入门教程-Part-2

### 工具与部署
- python-应用-docker-镜像瘦身小技巧
- NAT测试工具
- 在离线环境使用-nvm-windows-安装和管理-node-js
- Gemini-CLI-入门教程（windows篇）
- vscode-ssh-remote-tutorial
- 45个-GIT-经典操作场景，专治不会合代码

### 其他
- Android四大组件学习
- Android媒体库更新问题
- storybook-cookbook-part1
- 新玩具M5STACK的CARDPUTER的折腾记录(一)_开发环境搭建篇
- chai-js-断言库使用说明
- NonNull用法
- linux_shell_get_start
- sony-nw-a306-china-version-player-upgrade到国际固件教程
- 【文档翻译】指南：编写可测试代码（总纲）
- 【文档翻译】Lisp 的根源

## 下一步

- [ ] 添加更多自定义主题样式
- [ ] 集成评论系统（如 Giscus）
- [ ] 添加 Google Analytics
- [ ] 优化 SEO
- [ ] 添加更多互动功能

## 部署

博客已配置支持多平台部署：

### GitHub Pages

1. 将代码推送到 GitHub
2. 在仓库 Settings → Pages 中启用 GitHub Pages
3. Source 选择 "GitHub Actions"
4. 推送代码后会自动部署到：`https://chenzd123456.github.io/dadis-blog/`

### Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. Vercel 会自动识别 `vercel.json` 配置
4. 部署完成！

### 本地开发

```bash
# 使用默认配置（base: '/'）
npm run docs:dev

# 模拟 GitHub Pages 环境
BASE_URL='/dadis-blog/' npm run docs:dev
```

## 技术栈

- **框架**: VitePress 1.6.4
- **运行时**: Vue 3
- **构建工具**: Vite
- **语言**: TypeScript
- **包管理**: npm

## 注意事项

- 原始的 Hexo 源文件保留在 `source/` 目录中
- 迁移脚本 `migrate-posts.js` 可用于重新迁移文章
- 图片路径已自动转换为 `/public/` 开头的绝对路径
- Hexo 特定的插件标签（如 markmap）已被移除

## 维护

### 添加新文章

1. 在 `docs/posts/` 目录下创建新的 Markdown 文件
2. 使用 VitePress 的 front matter 格式：
```yaml
---
title: 文章标题
date: 2024-03-19
description: 文章描述
tags:
  - 标签1
  - 标签2
categories:
  - 分类
---
```

3. 文章会自动出现在文章列表中

### 更新配置

编辑 `docs/.vitepress/config.mts` 来修改站点配置、导航、侧边栏等。

---

**Enjoy your new VitePress blog!** 🚀