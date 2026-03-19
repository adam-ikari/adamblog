#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 默认模板
const DEFAULT_TEMPLATE = `---
title: {{title}}
date: {{date}}
description: ''
tags: []
categories: []
---

# {{title}}

<!-- more -->

`;

// 从文件读取模板
function loadTemplate(templatePath) {
  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf8');
  }
  return DEFAULT_TEMPLATE;
}

// 替换模板变量
function replaceVariables(template, variables) {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

// 格式化日期
function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return {
    date: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`,
    readable: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  };
}

// 解析命令行参数
function parseArgs(args) {
  const result = {
    title: '',
    template: 'default',
    categories: [],
    tags: [],
    description: ''
  };
  
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    if (arg === '--title' || arg === '-t') {
      // 检查下一个参数是否是选项
      if (nextArg && !nextArg.startsWith('-')) {
        result.title = nextArg;
        i++;
      }
    } else if (arg === '--template') {
      if (nextArg && !nextArg.startsWith('-')) {
        result.template = nextArg;
        i++;
      }
    } else if (arg === '--category' || arg === '-c') {
      if (nextArg && !nextArg.startsWith('-')) {
        result.categories.push(nextArg);
        i++;
      }
    } else if (arg === '--tag') {
      if (nextArg && !nextArg.startsWith('-')) {
        result.tags.push(nextArg);
        i++;
      }
    } else if (arg === '--description' || arg === '-d') {
      if (nextArg && !nextArg.startsWith('-')) {
        result.description = nextArg;
        i++;
      }
    } else if (!arg.startsWith('-') && result.title === '') {
      // 第一个非选项参数作为标题
      result.title = arg;
    }
    i++;
  }
  
  return result;
}

// 主函数
function main() {
  const args = parseArgs(process.argv.slice(2));
  
  if (!args.title) {
    console.error('错误: 请指定文章标题');
    console.log('\n用法:');
    console.log('  node new-post.js "文章标题"');
    console.log('  node new-post.js --title "文章标题"');
    console.log('  node new-post.js "文章标题" --category 前端 --tag Vue');
    console.log('  node new-post.js "文章标题" -c 前端 -t Vue -t "Vue3"');
    console.log('  node new-post.js "文章标题" --template custom');
    console.log('\n选项:');
    console.log('  -t, --title        文章标题');
    console.log('  -c, --category     文章分类（可多次使用）');
    console.log('  --tag              文章标签（可多次使用）');
    console.log('  -d, --description  文章描述');
    console.log('  --template         模板名称（默认: default）');
    process.exit(1);
  }
  
  const postsDir = path.join(__dirname, 'docs/posts');
  const templateDir = path.join(__dirname, 'scaffolds');
  
  // 创建文章文件夹
  const postFolder = path.join(postsDir, args.title);
  if (fs.existsSync(postFolder)) {
    console.error(`错误: 文章文件夹已存在: ${args.title}`);
    process.exit(1);
  }
  
  fs.mkdirSync(postFolder, { recursive: true });
  
  // 加载模板
  const templatePath = path.join(templateDir, `${args.template}.md`);
  const template = loadTemplate(templatePath);
  
  // 准备变量
  const dates = formatDate();
  const variables = {
    title: args.title,
    date: dates.date,
    datetime: dates.readable,
    year: dates.date.substring(0, 4),
    month: dates.date.substring(5, 7),
    day: dates.date.substring(8, 10),
    categories: args.categories.length > 0 ? JSON.stringify(args.categories) : '[]',
    tags: args.tags.length > 0 ? JSON.stringify(args.tags) : '[]',
    description: args.description
  };
  
  // 生成内容
  let content = replaceVariables(template, variables);
  
  // 创建 index.md
  const indexPath = path.join(postFolder, 'index.md');
  fs.writeFileSync(indexPath, content);
  
  console.log(`✓ 文章创建成功!`);
  console.log(`  路径: docs/posts/${args.title}/`);
  console.log(`  文件: index.md`);
  console.log(`  分类: ${args.categories.join(', ') || '无'}`);
  console.log(`  标签: ${args.tags.join(', ') || '无'}`);
  console.log(`  描述: ${args.description || '无'}`);
  console.log(`\n提示: 图片资源请放在同一文件夹中，使用 ./图片名.png 引用`);
}

// 运行主函数
main();