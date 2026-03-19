const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'docs/posts');

// 获取所有文章文件
const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // 替换 /public/ 路径为 / 路径
  const newContent = content.replace(/\/public\//g, '/');

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed: ${file}`);
  }
});

console.log('\nPath fix completed!');