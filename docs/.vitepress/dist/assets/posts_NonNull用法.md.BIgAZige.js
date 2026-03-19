import{_ as n,o as a,c as l,af as p}from"./chunks/framework.SW4JcFcZ.js";const u=JSON.parse('{"title":"NonNull用法","description":"","frontmatter":{"title":"NonNull用法","date":"2019-09-18T00:00:00.000Z","excerpt":"","tags":["Java","Android"],"categories":["Java"]},"headers":[],"relativePath":"posts/NonNull用法.md","filePath":"posts/NonNull用法.md","lastUpdated":1773902909000}'),o={name:"posts/NonNull用法.md"};function e(t,s,c,r,i,y){return a(),l("div",null,[...s[0]||(s[0]=[p(`<blockquote><p>这篇博文是从本人过去的 github pages 博客迁移过来，时间上会比较古老。</p></blockquote><p>在编程中经常会需要对传入的参数做空引用检查。传统的做法是使用一连串的if语句对入参做检查，代码冗长又破坏整体感。</p><p>可以使用@NonNull在方法或构造函数的参数上，让lombok为您生成null-check语句。 <em>@NonNull在Java库lombok v0.11.10中引入,而Android可以通过androidx.annotation库导入。</em></p><p>写一个例子：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki github-light vp-code" tabindex="0"><code><span class="line"><span style="color:#D73A49;">public</span><span style="color:#D73A49;"> class</span><span style="color:#6F42C1;"> Foo</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    Object mSomeObj;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">    public</span><span style="color:#6F42C1;"> Foo</span><span style="color:#24292E;">() {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * 使用 @NonNull 的写法</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#E36209;"> obj</span><span style="color:#6A737D;"> obj</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#D73A49;">    public</span><span style="color:#D73A49;"> void</span><span style="color:#6F42C1;"> setSomeObj</span><span style="color:#24292E;">(@</span><span style="color:#D73A49;">NonNull</span><span style="color:#24292E;"> Object </span><span style="color:#E36209;">obj</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#005CC5;">        this</span><span style="color:#24292E;">.mSomeObj </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> obj;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * 不使用 @NonNull 的写法</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@param</span><span style="color:#E36209;"> obj</span><span style="color:#6A737D;"> obj</span></span>
<span class="line"><span style="color:#6A737D;">     * </span><span style="color:#D73A49;">@throws</span><span style="color:#6F42C1;"> NullPointerException</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#D73A49;">    public</span><span style="color:#D73A49;"> void</span><span style="color:#6F42C1;"> setSomeObj_old</span><span style="color:#24292E;">(Object </span><span style="color:#E36209;">obj</span><span style="color:#24292E;">) </span></span>
<span class="line"><span style="color:#D73A49;">            throws</span><span style="color:#24292E;"> NullPointerException {</span></span>
<span class="line"><span style="color:#D73A49;">        if</span><span style="color:#24292E;"> (mSomeObj </span><span style="color:#D73A49;">==</span><span style="color:#005CC5;"> null</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#D73A49;">            throw</span><span style="color:#D73A49;"> new</span><span style="color:#6F42C1;"> NullPointerException</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#005CC5;">        this</span><span style="color:#24292E;">.mSomeObj </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> obj;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,5)])])}const D=n(o,[["render",e]]);export{u as __pageData,D as default};
