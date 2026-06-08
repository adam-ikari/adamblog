import fs from 'fs';
import path from 'path';

const postsDir = './posts';

const files = fs.readdirSync(postsDir);

for (const file of files) {
  const filePath = path.join(postsDir, file);
  const stat = fs.statSync(filePath);

  // Skip directories (image folders) and non-md files
  if (stat.isDirectory() || !file.endsWith('.md')) continue;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Convert Hexo frontmatter to VitePress format
  // Hexo: categories: \n  - Cat1
  // VitePress: category: Cat1
  // Hexo: tags: \n  - tag1 \n  - tag2
  // VitePress: tags: [tag1, tag2]
  // Hexo: date: "2025-07-07 12:16"
  // VitePress: date: 2025-07-07

  // Replace categories block
  content = content.replace(
    /categories:\s*\n(\s+- .+\n?)+/g,
    (match) => {
      const cats = match.match(/- (.+)/g);
      if (cats && cats.length > 0) {
        return `category: ${cats[0].replace('- ', '')}\n`;
      }
      return '';
    }
  );

  // Replace tags block
  content = content.replace(
    /tags:\s*\n(\s+- .+\n?)+/g,
    (match) => {
      const tags = match.match(/- (.+)/g);
      if (tags && tags.length > 0) {
        const tagList = tags.map(t => t.replace('- ', '').trim());
        return `tags: [${tagList.join(', ')}]\n`;
      }
      return '';
    }
  );

  // Convert date format: "2025-07-07 12:16" -> 2025-07-07
  content = content.replace(
    /date:\s*["']?(\d{4}-\d{2}-\d{2})[^"'\n]*["']?/g,
    'date: $1'
  );

  // Remove Hexo-specific fields
  content = content.replace(/abbrlink:.*\n/g, '');
  content = content.replace(/keywords:\s*\n(\s+- .+\n?)+/g, '');
  content = content.replace(/description:\s*\n/g, '');
  content = content.replace(/cover:\s*\n/g, '');
  content = content.replace(/toc:\s*(true|false)\n/g, '');

  // Fix image paths: Hexo uses relative paths like image.png in same folder
  // VitePress needs /posts/foldername/image.png or /images/...
  const postName = file.replace('.md', '');
  const imageFolder = path.join(postsDir, postName);
  if (fs.existsSync(imageFolder) && fs.statSync(imageFolder).isDirectory()) {
    // Replace relative image references
    content = content.replace(
      new RegExp(`\\]\\(${postName}/`, 'g'),
      `](/posts/${postName}/`
    );
    content = content.replace(
      new RegExp(`\\]\\(\\.\\/${postName}/`, 'g'),
      `](/posts/${postName}/`
    );
    // Also handle img tags
    content = content.replace(
      new RegExp(`src=["']${postName}/`, 'g'),
      `src="/posts/${postName}/`
    );
  }

  // Fix /images/ paths to point to public
  // In VitePress, files in public/ are served at /
  // Hexo source/images/ -> VitePress public/images/
  // Already handled by copying to public/images/

  // Remove <!-- more --> tag (VitePress uses different excerpt mechanism)
  content = content.replace(/<!--\s*more\s*-->/g, '');

  fs.writeFileSync(filePath, content);
  console.log(`Converted: ${file}`);
}

console.log('Done!');
