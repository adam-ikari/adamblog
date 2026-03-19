import {
  a,
  i,
  s
} from "./chunk-MXGY3IJX.js";
import {
  t
} from "./chunk-HCPEYRNK.js";
import {
  Fragment,
  createBaseVNode,
  createCommentVNode,
  createElementBlock,
  defineComponent,
  inject,
  openBlock,
  renderList,
  toDisplayString,
  unref
} from "./chunk-NPGVKGNX.js";

// node_modules/vitepress-plugin-blog/dist/components/BlogCard.vue2.js
var x = { class: "blog-card" };
var C = ["href"];
var U = {
  key: 0,
  class: "blog-card__cover"
};
var z = ["src", "alt"];
var D = { class: "blog-card__content" };
var E = { class: "blog-card__header" };
var G = ["datetime"];
var H = {
  key: 1,
  class: "blog-card__meta"
};
var N = { class: "blog-card__title" };
var T = {
  key: 0,
  class: "blog-card__excerpt"
};
var V = { class: "blog-card__footer" };
var j = { class: "blog-card__author" };
var p = ["src", "alt"];
var A = {
  key: 0,
  class: "blog-card__tags"
};
var S = defineComponent({
  __name: "BlogCard",
  props: {
    post: {}
  },
  setup(t2) {
    const r = inject(t);
    function m(l) {
      var n;
      return ((n = r == null ? void 0 : r.value) == null ? void 0 : n.call(r, l)) ?? l;
    }
    return (l, n) => {
      var d;
      return openBlock(), createElementBlock("article", x, [
        createBaseVNode("a", {
          href: m(t2.post.url),
          class: "blog-card__link"
        }, [
          t2.post.cover ? (openBlock(), createElementBlock("div", U, [
            createBaseVNode("img", {
              src: t2.post.cover,
              alt: t2.post.title,
              loading: "lazy"
            }, null, 8, z)
          ])) : createCommentVNode("", true),
          createBaseVNode("div", D, [
            createBaseVNode("header", E, [
              t2.post.date ? (openBlock(), createElementBlock("time", {
                key: 0,
                class: "blog-card__meta",
                datetime: t2.post.date
              }, toDisplayString(unref(a)(t2.post.date)), 9, G)) : createCommentVNode("", true),
              t2.post.readingTime ? (openBlock(), createElementBlock("span", H, " · " + toDisplayString(t2.post.readingTime) + " min read ", 1)) : createCommentVNode("", true)
            ]),
            createBaseVNode("h2", N, toDisplayString(t2.post.title), 1),
            t2.post.description ? (openBlock(), createElementBlock("p", T, toDisplayString(t2.post.description), 1)) : createCommentVNode("", true),
            createBaseVNode("footer", V, [
              createBaseVNode("div", j, [
                unref(s)(t2.post.author) ? (openBlock(), createElementBlock("img", {
                  key: 0,
                  src: unref(i)(t2.post.author),
                  alt: `${t2.post.author}'s avatar`,
                  class: "blog-card__avatar",
                  loading: "lazy"
                }, null, 8, p)) : createCommentVNode("", true),
                createBaseVNode("span", null, toDisplayString(t2.post.author), 1)
              ]),
              (d = t2.post.tags) != null && d.length ? (openBlock(), createElementBlock("ul", A, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(t2.post.tags, (u) => (openBlock(), createElementBlock("li", { key: u }, "#" + toDisplayString(u), 1))), 128))
              ])) : createCommentVNode("", true)
            ])
          ])
        ], 8, C)
      ]);
    };
  }
});

export {
  S
};
//# sourceMappingURL=chunk-J4Q5XZY7.js.map
