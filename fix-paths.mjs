import fs from 'fs';
import path from 'path';

const postsDir = './posts';
const files = fs.readdirSync(postsDir);

for (const file of files) {
  if (!file.endsWith('.md')) continue;
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix image paths: update references to point to /posts/foldername/
  const postName = file.replace('.md', '');

  // Replace various image path patterns
  // Pattern: ![alt](foldername/image.png) -> ![alt](/posts/foldername/image.png)
  content = content.replace(
    new RegExp(`\\]\\(${postName}/`, 'g'),
    `](/posts/${postName}/`
  );

  // Pattern: ![alt](./foldername/image.png) -> ![alt](/posts/foldername/image.png)
  content = content.replace(
    new RegExp(`\\]\\(\\.\\/${postName}/`, 'g'),
    `](/posts/${postName}/`
  );

  // Pattern: src="foldername/image.png" -> src="/posts/foldername/image.png"
  content = content.replace(
    new RegExp(`src=["']${postName}/`, 'g'),
    `src="/posts/${postName}/`
  );

  // Remove remaining Hexo-specific frontmatter fields
  content = content.replace(/^keywords:.*\n/gm, '');
  content = content.replace(/^description:\s*$/gm, '');
  content = content.replace(/^cover:.*$/gm, '');

  fs.writeFileSync(filePath, content);
  console.log(`Fixed paths: ${file}`);
}

console.log('Done!');
