import {
  p
} from "./chunk-322YQTTG.js";
import {
  a,
  i,
  s as s2
} from "./chunk-MXGY3IJX.js";
import {
  o,
  s,
  t
} from "./chunk-HCPEYRNK.js";
import {
  Fragment,
  computed,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  defineComponent,
  inject,
  openBlock,
  renderList,
  resolveDynamicComponent,
  toDisplayString,
  unref,
  withCtx
} from "./chunk-NPGVKGNX.js";

// node_modules/vitepress-plugin-blog/dist/layouts/BlogPostLayout.vue2.js
var I = { class: "blog-post" };
var V = { class: "blog-post__meta" };
var j = { class: "blog-post__breadcrumbs" };
var A = ["href"];
var F = { class: "blog-post__title" };
var M = {
  key: 0,
  class: "blog-post__description"
};
var O = { class: "blog-post__details" };
var S = {
  key: 0,
  class: "blog-post__author"
};
var q = ["src", "alt"];
var J = ["datetime"];
var Q = {
  key: 2,
  class: "blog-post__detail"
};
var W = {
  key: 1,
  class: "blog-post__tags"
};
var X = {
  key: 2,
  class: "blog-post__cover"
};
var Y = ["src", "alt"];
var Z = { class: "blog-post__footer" };
var R = {
  key: 0,
  class: "blog-post__pagination",
  "aria-label": "Blog post navigation"
};
var tt = ["href"];
var et = { class: "pagination-title" };
var ot = ["href"];
var at = { class: "pagination-title" };
var ct = defineComponent({
  __name: "BlogPostLayout",
  props: {
    posts: {}
  },
  setup(lt) {
    const y = inject(s);
    y || console.error("[vitepress-plugin-blog] Base layout not found. Make sure to use withBlogTheme() to wrap your theme.");
    const i2 = inject(o), c = inject(t), { posts: p2 } = p(), o2 = computed(() => {
      var t2;
      const e = i2 == null ? void 0 : i2.value;
      return e ? ((t2 = e.frontmatter) == null ? void 0 : t2.value) ?? {} : {};
    }), U = computed(() => {
      var t2;
      const e = i2 == null ? void 0 : i2.value;
      return e ? ((t2 = e.page) == null ? void 0 : t2.value) ?? { relativePath: "" } : { relativePath: "" };
    }), g = computed(() => {
      const e = U.value.relativePath;
      if (!e) return null;
      const t2 = "/" + e.replace(/\.md$/, "").replace(/index$/, "");
      return p2.value.find((d) => {
        const f = d.url.replace(/\/$/, ""), v = t2.replace(/\/$/, "");
        return f === v || d.slug === v.split("/").pop();
      }) ?? null;
    }), _ = computed(() => g.value ? p2.value.findIndex((e) => {
      var t2;
      return e.url === ((t2 = g.value) == null ? void 0 : t2.url);
    }) : -1), m = computed(() => _.value <= 0 ? null : p2.value[_.value - 1]), h = computed(() => _.value < 0 || _.value >= p2.value.length - 1 ? null : p2.value[_.value + 1]);
    function k(e) {
      var t2;
      return ((t2 = c == null ? void 0 : c.value) == null ? void 0 : t2.call(c, e)) ?? e;
    }
    const P = computed(() => {
      const e = o2.value.date;
      return !e || typeof e != "string" ? "" : a(e);
    });
    return (e, t2) => unref(y) ? (openBlock(), createBlock(resolveDynamicComponent(unref(y)), { key: 0 }, {
      "doc-before": withCtx(() => {
        var d, f;
        return [
          createBaseVNode("article", I, [
            createBaseVNode("header", V, [
              createBaseVNode("p", j, [
                createBaseVNode("a", {
                  href: k("/blog/")
                }, "Blog", 8, A),
                t2[0] || (t2[0] = createBaseVNode("span", { "aria-hidden": "true" }, " / ", -1)),
                createBaseVNode("span", null, toDisplayString(o2.value.title), 1)
              ]),
              createBaseVNode("h1", F, toDisplayString(o2.value.title), 1),
              o2.value.description ? (openBlock(), createElementBlock("p", M, toDisplayString(o2.value.description), 1)) : createCommentVNode("", true),
              createBaseVNode("div", O, [
                o2.value.author ? (openBlock(), createElementBlock("div", S, [
                  unref(s2)(o2.value.author) ? (openBlock(), createElementBlock("img", {
                    key: 0,
                    src: unref(i)(o2.value.author),
                    alt: `${o2.value.author}'s avatar`,
                    class: "blog-post__avatar",
                    loading: "lazy"
                  }, null, 8, q)) : createCommentVNode("", true),
                  createBaseVNode("span", null, toDisplayString(o2.value.author), 1)
                ])) : createCommentVNode("", true),
                P.value ? (openBlock(), createElementBlock("time", {
                  key: 1,
                  class: "blog-post__detail",
                  datetime: o2.value.date
                }, toDisplayString(P.value), 9, J)) : createCommentVNode("", true),
                (d = g.value) != null && d.readingTime ? (openBlock(), createElementBlock("span", Q, " · " + toDisplayString(g.value.readingTime) + " min read ", 1)) : createCommentVNode("", true)
              ]),
              (f = o2.value.tags) != null && f.length ? (openBlock(), createElementBlock("ul", W, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(o2.value.tags, (v) => (openBlock(), createElementBlock("li", { key: v }, "#" + toDisplayString(v), 1))), 128))
              ])) : createCommentVNode("", true),
              o2.value.cover ? (openBlock(), createElementBlock("figure", X, [
                createBaseVNode("img", {
                  src: o2.value.cover,
                  alt: o2.value.title,
                  loading: "lazy"
                }, null, 8, Y)
              ])) : createCommentVNode("", true)
            ])
          ])
        ];
      }),
      "doc-after": withCtx(() => [
        createBaseVNode("footer", Z, [
          m.value || h.value ? (openBlock(), createElementBlock("nav", R, [
            m.value ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: k(m.value.url),
              class: "blog-post__pagination-link prev"
            }, [
              t2[1] || (t2[1] = createBaseVNode("span", { class: "pagination-label" }, "← Newer", -1)),
              createBaseVNode("span", et, toDisplayString(m.value.title), 1)
            ], 8, tt)) : createCommentVNode("", true),
            t2[3] || (t2[3] = createBaseVNode("span", {
              class: "blog-post__pagination-spacer",
              "aria-hidden": "true"
            }, null, -1)),
            h.value ? (openBlock(), createElementBlock("a", {
              key: 1,
              href: k(h.value.url),
              class: "blog-post__pagination-link next"
            }, [
              t2[2] || (t2[2] = createBaseVNode("span", { class: "pagination-label" }, "Older →", -1)),
              createBaseVNode("span", at, toDisplayString(h.value.title), 1)
            ], 8, ot)) : createCommentVNode("", true)
          ])) : createCommentVNode("", true)
        ])
      ]),
      _: 1
    })) : createCommentVNode("", true);
  }
});

export {
  ct
};
//# sourceMappingURL=chunk-2MIMKAAD.js.map
