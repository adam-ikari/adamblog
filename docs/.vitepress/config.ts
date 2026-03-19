import { defineConfig } from "vitepress";
import { blogPlugin } from "vitepress-plugin-blog/plugin";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Adam的博客",
  description: "本博客主要作用是记录自己折(muo)腾(yu)的各种技术，以上！",
  base: process.env.BASE_URL || "/",
  vite: {
    plugins: [blogPlugin()],
  },
  appearance: true,
  lastUpdated: true,
  markdown: {
    theme: "github-light",
  },
  ignoreDeadLinks: true,
  lang: "zh-CN",
});