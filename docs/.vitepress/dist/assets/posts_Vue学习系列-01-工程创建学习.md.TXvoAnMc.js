import{_ as n,o as a,c as p,af as l}from"./chunks/framework.SW4JcFcZ.js";const e="/assets/%E5%88%9B%E5%BB%BAVue%E5%B7%A5%E7%A8%8B%E8%BF%87%E7%A8%8B.fWsqjYGQ.jpg",F=JSON.parse('{"title":"Vue学习系列：01 工程创建学习","description":"","frontmatter":{"title":"Vue学习系列：01 工程创建学习","date":"2023-02-22T00:00:00.000Z","excerpt":"本篇博客将为你讲解Vue学习系列的第一篇文章——工程创建学习，帮助你了解如何创建一个Vue项目。","tags":["Vue","Vue学习","Web开发","前端"],"categories":["前端"]},"headers":[],"relativePath":"posts/Vue学习系列-01-工程创建学习.md","filePath":"posts/Vue学习系列-01-工程创建学习.md","lastUpdated":1773902909000}'),o={name:"posts/Vue学习系列-01-工程创建学习.md"};function t(c,s,r,i,u,y){return a(),p("div",null,[...s[0]||(s[0]=[l(`<p>=&gt; <a href="/tags/Vue学习系列/"><strong>《Vue学习系列》</strong></a></p><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to &quot;前言&quot;">​</a></h2><p>开始 Vue 的学习。后面会陆续的更新一些学习 Vue 过程中的理解和记录。</p><p>接下来的 Vue 工程创建参考了官网的文档:<a href="https://cn.vuejs.org/guide/quick-start.html" target="_blank" rel="noreferrer">《快速上手 | Vue.js 》</a></p><h2 id="阅读方法" tabindex="-1">阅读方法 <a class="header-anchor" href="#阅读方法" aria-label="Permalink to &quot;阅读方法&quot;">​</a></h2><blockquote><p>这样在引用块中的文字表示引用官网文档的内容</p></blockquote><h2 id="创建-vue-工程" tabindex="-1">创建 Vue 工程 <a class="header-anchor" href="#创建-vue-工程" aria-label="Permalink to &quot;创建 Vue 工程&quot;">​</a></h2><blockquote><p>创建的项目将使用基于 Vite 的构建设置，并允许我们使用 Vue 的单文件组件 (SFC)。 确保你安装了最新版本的 Node.js，然后在命令行中运行以下命令 (不要带上 &gt; 符号)：</p></blockquote><p>我用的 node.js 版本是 18，运行下面的命令将使用 vite 创建的是 vue3 的工程。</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-light vp-code" tabindex="0"><code><span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#032F62;"> init</span><span style="color:#032F62;"> Vue@latest</span></span></code></pre></div><blockquote><p>这一指令将会安装并执行 create-vue，它是 Vue 官方的项目脚手架工具。你将会看到一些诸如 TypeScript 和测试支持之类的可选功能提示：</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-light vp-code" tabindex="0"><code><span class="line"><span style="color:#6F42C1;">✔</span><span style="color:#032F62;"> Project</span><span style="color:#032F62;"> name:</span><span style="color:#032F62;"> …</span><span style="color:#D73A49;"> &lt;</span><span style="color:#032F62;">your-project-nam</span><span style="color:#24292E;">e</span><span style="color:#D73A49;">&gt;</span></span>
<span class="line"><span style="color:#6F42C1;">✔</span><span style="color:#032F62;"> Add</span><span style="color:#032F62;"> TypeScript?</span><span style="color:#032F62;"> …</span><span style="color:#032F62;"> No</span><span style="color:#032F62;"> /</span><span style="color:#032F62;"> Yes</span></span>
<span class="line"><span style="color:#6F42C1;">✔</span><span style="color:#032F62;"> Add</span><span style="color:#032F62;"> JSX</span><span style="color:#032F62;"> Support?</span><span style="color:#032F62;"> …</span><span style="color:#032F62;"> No</span><span style="color:#032F62;"> /</span><span style="color:#032F62;"> Yes</span></span>
<span class="line"><span style="color:#6F42C1;">✔</span><span style="color:#032F62;"> Add</span><span style="color:#032F62;"> Vue</span><span style="color:#032F62;"> Router</span><span style="color:#032F62;"> for</span><span style="color:#032F62;"> Single</span><span style="color:#032F62;"> Page</span><span style="color:#032F62;"> Application</span><span style="color:#032F62;"> development?</span><span style="color:#032F62;"> …</span><span style="color:#032F62;"> No</span><span style="color:#032F62;"> /</span><span style="color:#032F62;"> Yes</span></span>
<span class="line"><span style="color:#6F42C1;">✔</span><span style="color:#032F62;"> Add</span><span style="color:#032F62;"> Pinia</span><span style="color:#032F62;"> for</span><span style="color:#032F62;"> state</span><span style="color:#032F62;"> management?</span><span style="color:#032F62;"> …</span><span style="color:#032F62;"> No</span><span style="color:#032F62;"> /</span><span style="color:#032F62;"> Yes</span></span>
<span class="line"><span style="color:#6F42C1;">✔</span><span style="color:#032F62;"> Add</span><span style="color:#032F62;"> Vitest</span><span style="color:#032F62;"> for</span><span style="color:#032F62;"> Unit</span><span style="color:#032F62;"> testing?</span><span style="color:#032F62;"> …</span><span style="color:#032F62;"> No</span><span style="color:#032F62;"> /</span><span style="color:#032F62;"> Yes</span></span>
<span class="line"><span style="color:#6F42C1;">✔</span><span style="color:#032F62;"> Add</span><span style="color:#032F62;"> Cypress</span><span style="color:#032F62;"> for</span><span style="color:#032F62;"> both</span><span style="color:#032F62;"> Unit</span><span style="color:#032F62;"> and</span><span style="color:#032F62;"> End-to-End</span><span style="color:#032F62;"> testing?</span><span style="color:#032F62;"> …</span><span style="color:#032F62;"> No</span><span style="color:#032F62;"> /</span><span style="color:#032F62;"> Yes</span></span>
<span class="line"><span style="color:#6F42C1;">✔</span><span style="color:#032F62;"> Add</span><span style="color:#032F62;"> ESLint</span><span style="color:#032F62;"> for</span><span style="color:#032F62;"> code</span><span style="color:#032F62;"> quality?</span><span style="color:#032F62;"> …</span><span style="color:#032F62;"> No</span><span style="color:#032F62;"> /</span><span style="color:#032F62;"> Yes</span></span>
<span class="line"><span style="color:#6F42C1;">✔</span><span style="color:#032F62;"> Add</span><span style="color:#032F62;"> Prettier</span><span style="color:#032F62;"> for</span><span style="color:#032F62;"> code</span><span style="color:#032F62;"> formatting?</span><span style="color:#032F62;"> …</span><span style="color:#032F62;"> No</span><span style="color:#032F62;"> /</span><span style="color:#032F62;"> Yes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">Scaffolding</span><span style="color:#032F62;"> project</span><span style="color:#032F62;"> in</span><span style="color:#032F62;"> ./</span><span style="color:#D73A49;">&lt;</span><span style="color:#032F62;">your-project-nam</span><span style="color:#24292E;">e</span><span style="color:#D73A49;">&gt;</span><span style="color:#032F62;">...</span></span>
<span class="line"><span style="color:#6F42C1;">Done.</span></span></code></pre></div><p>如果不确定是否要开启某个功能，你可以直接按下回车键选择 No。</p></blockquote><p>具体的选项：</p><pre><code>✔ Add TypeScript? … No / Yes

集成 TypeScript 支持

✔ Add JSX Support? … No / Yes

集成 JSX 支持

✔ Add Vue Router for Single Page Application development? … No / Yes

集成 Vue Router

✔ Add Pinia for state management? … No / Yes

集成 Pinia（Pinia 是 vue3 推荐使用的一个状态管理插件，替代了以前的 vuex）

✔ Add Vitest for Unit Testing? … No / Yes

集成 Vitest 用于单元测试

✔ Add an End-to-End Testing Solution? › No

集成一个端到端的测试解决方案。

✔ Add ESLint for code quality? … No / Yes

集成 ESLint 代码质量检查
</code></pre><p><img src="`+e+`" alt="创建 Vue 工程的过程"></p><p>我创建的时候选择了集成 Vue Router、Pinia、Vitest、eslint 和 Prettier。</p><h2 id="分析一下创建的-vue-工程" tabindex="-1">分析一下创建的 Vue 工程 <a class="header-anchor" href="#分析一下创建的-vue-工程" aria-label="Permalink to &quot;分析一下创建的 Vue 工程&quot;">​</a></h2><p>先看看工程的目录结构。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-light vp-code" tabindex="0"><code><span class="line"><span>├── README.md</span></span>
<span class="line"><span>├── index.html</span></span>
<span class="line"><span>├── package.json</span></span>
<span class="line"><span>├── public</span></span>
<span class="line"><span>│   └── favicon.ico</span></span>
<span class="line"><span>├── src</span></span>
<span class="line"><span>│   ├── App.Vue</span></span>
<span class="line"><span>│   ├── assets</span></span>
<span class="line"><span>│   │   ├── base.css</span></span>
<span class="line"><span>│   │   ├── logo.svg</span></span>
<span class="line"><span>│   │   └── main.css</span></span>
<span class="line"><span>│   ├── components</span></span>
<span class="line"><span>│   │   ├── HelloWorld.Vue</span></span>
<span class="line"><span>│   │   ├── TheWelcome.Vue</span></span>
<span class="line"><span>│   │   ├── WelcomeItem.Vue</span></span>
<span class="line"><span>│   │   ├── __tests__</span></span>
<span class="line"><span>│   │   │   └── HelloWorld.spec.js</span></span>
<span class="line"><span>│   │   └── icons</span></span>
<span class="line"><span>│   │       ├── IconCommunity.Vue</span></span>
<span class="line"><span>│   │       ├── IconDocumentation.Vue</span></span>
<span class="line"><span>│   │       ├── IconEcosystem.Vue</span></span>
<span class="line"><span>│   │       ├── IconSupport.Vue</span></span>
<span class="line"><span>│   │       └── IconTooling.Vue</span></span>
<span class="line"><span>│   ├── main.js</span></span>
<span class="line"><span>│   ├── router</span></span>
<span class="line"><span>│   │   └── index.js</span></span>
<span class="line"><span>│   ├── stores</span></span>
<span class="line"><span>│   │   └── counter.js</span></span>
<span class="line"><span>│   └── views</span></span>
<span class="line"><span>│       ├── AboutView.Vue</span></span>
<span class="line"><span>│       └── HomeView.Vue</span></span>
<span class="line"><span>└── vite.config.js</span></span></code></pre></div><h3 id="package-json-文件" tabindex="-1">package.json 文件 <a class="header-anchor" href="#package-json-文件" aria-label="Permalink to &quot;package.json 文件&quot;">​</a></h3><p>分析一下 package.json 文件的内容</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-light vp-code" tabindex="0"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">  // ...</span></span>
<span class="line"><span style="color:#005CC5;">  &quot;dependencies&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;pinia&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^2.0.28&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;Vue&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^3.2.45&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;Vue-router&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^4.1.6&quot;</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#6A737D;">  // ...</span></span>
<span class="line"><span style="color:#005CC5;">  &quot;devDependencies&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;@rushstack/eslint-patch&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^1.1.4&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;@vitejs/plugin-Vue&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^4.0.0&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;@Vue/eslint-config-prettier&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^7.0.0&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;@Vue/test-utils&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^2.2.6&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;eslint&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^8.22.0&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;eslint-plugin-Vue&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^9.3.0&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;jsdom&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^20.0.3&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;prettier&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^2.7.1&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;vite&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^4.0.0&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;vitest&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;^0.25.6&quot;</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#6A737D;">  // ...</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>可以看到工程依赖了 pinia2、vue3 和 Vue-router4。pinia2 和 Vue-router4 以后再专门学习。</p><p>工程的开发依赖主要是 vite、eslint 、prettier 和 vitest。</p><p>分析一下脚本。</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-light vp-code" tabindex="0"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#6A737D;">  // ...</span></span>
<span class="line"><span style="color:#005CC5;">  &quot;scripts&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;dev&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;vite&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// &lt;= 启动开发服务，做到所见即所得</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;build&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;vite build&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// &lt;= 构建工程，构建后的结果输出到工程的 ./dist 目录下</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;preview&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;vite preview&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// &lt;= 预览构建到 ./dist 目录下的页面的效果，就不需要另外准备一个 http 服务了</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;test:unit&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;vitest --environment jsdom --root src/&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// &lt;= 运行单体测试</span></span>
<span class="line"><span style="color:#005CC5;">    &quot;lint&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;eslint . --ext .Vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore&quot;</span><span style="color:#6A737D;"> // &lt;= 运行代码检查</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#6A737D;">  // ...</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="public-文件夹" tabindex="-1">public 文件夹 <a class="header-anchor" href="#public-文件夹" aria-label="Permalink to &quot;public 文件夹&quot;">​</a></h3><p>这个文件夹下的内容会拷贝到生成的./dist/public 文件夹下，适合放一些静态文件和传统的 html 文件中 script 标签导入的 js 文件。</p><h3 id="src-文件夹" tabindex="-1">src 文件夹 <a class="header-anchor" href="#src-文件夹" aria-label="Permalink to &quot;src 文件夹&quot;">​</a></h3><p>src 文件夹放 Vue 工程的源码，包括 Vue 组件，图片资源，需要打包到一起的 js 代码和 css 样式。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-light vp-code" tabindex="0"><code><span class="line"><span>─ src</span></span>
<span class="line"><span>  ├── App.Vue</span></span>
<span class="line"><span>  ├── assets  &lt;= 放 css、svg 、图片等要使用 vite 打包的资源</span></span>
<span class="line"><span>  │   ├── base.css</span></span>
<span class="line"><span>  │   ├── logo.svg</span></span>
<span class="line"><span>  │   └── main.css</span></span>
<span class="line"><span>  ├── components  &lt;= 放 Vue 组件</span></span>
<span class="line"><span>  │   ├── HelloWorld.Vue</span></span>
<span class="line"><span>  │   ├── TheWelcome.Vue</span></span>
<span class="line"><span>  │   ├── WelcomeItem.Vue</span></span>
<span class="line"><span>  │   ├── __tests__  &lt;= 放 Vue 组件的单体测试代码</span></span>
<span class="line"><span>  │   │   └── HelloWorld.spec.js</span></span>
<span class="line"><span>  │   └── icons</span></span>
<span class="line"><span>  │       ├── IconCommunity.Vue</span></span>
<span class="line"><span>  │       ├── IconDocumentation.v</span></span>
<span class="line"><span>  │       ├── IconEcosystem.Vue</span></span>
<span class="line"><span>  │       ├── IconSupport.Vue</span></span>
<span class="line"><span>  │       └── IconTooling.Vue</span></span>
<span class="line"><span>  ├── main.js &lt;= Vue 工程入口js文件</span></span>
<span class="line"><span>  ├── router &lt;= 放路由的配置文件</span></span>
<span class="line"><span>  │   └── index.js</span></span>
<span class="line"><span>  ├── stores &lt;= 放 Vue store 的文件, 相当于 mvvm 模型中的 model。</span></span>
<span class="line"><span>  │   └── counter.js</span></span>
<span class="line"><span>  └── views &lt;= 放路由的页面</span></span>
<span class="line"><span>      ├── AboutView.Vue</span></span>
<span class="line"><span>      └── HomeView.Vue</span></span></code></pre></div><h2 id="安装工程依赖" tabindex="-1">安装工程依赖 <a class="header-anchor" href="#安装工程依赖" aria-label="Permalink to &quot;安装工程依赖&quot;">​</a></h2><p>在项目被创建后，通过以下步骤安装依赖</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-light vp-code" tabindex="0"><code><span class="line"><span style="color:#005CC5;">cd</span><span style="color:#D73A49;"> &lt;</span><span style="color:#032F62;">your-project-nam</span><span style="color:#24292E;">e</span><span style="color:#D73A49;">&gt;</span></span>
<span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#032F62;"> install</span></span></code></pre></div><h2 id="启动开发服务" tabindex="-1">启动开发服务 <a class="header-anchor" href="#启动开发服务" aria-label="Permalink to &quot;启动开发服务&quot;">​</a></h2><p>开发 Vue 项目的时候需要有个开发服务用于预览工程部署后的效果，做到所见即所得。</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-light vp-code" tabindex="0"><code><span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#032F62;"> run</span><span style="color:#032F62;"> dev</span></span></code></pre></div><h2 id="构建工程" tabindex="-1">构建工程 <a class="header-anchor" href="#构建工程" aria-label="Permalink to &quot;构建工程&quot;">​</a></h2><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-light vp-code" tabindex="0"><code><span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#032F62;"> run</span><span style="color:#032F62;"> build</span></span></code></pre></div><blockquote><p>此命令会在 ./dist 文件夹中为你的应用创建一个生产环境的构建版本。关于将应用上线生产环境的更多内容，请阅读<a href="https://cn.vuejs.org/guide/best-practices/production-deployment.html" target="_blank" rel="noreferrer">生产环境部署指南</a>。</p></blockquote><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><p>快速上手 | Vue.js ：<a href="https://cn.vuejs.org/guide/quick-start.html" target="_blank" rel="noreferrer">https://cn.vuejs.org/guide/quick-start.html</a></p>`,41)])])}const h=n(o,[["render",t]]);export{F as __pageData,h as default};
