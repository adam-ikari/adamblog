import {
  Fragment,
  createBaseVNode,
  createCommentVNode,
  createElementBlock,
  defineComponent,
  normalizeClass,
  openBlock,
  renderList,
  toDisplayString
} from "./chunk-NPGVKGNX.js";

// node_modules/vitepress-plugin-blog/dist/components/BlogFilters.vue2.js
var y = { class: "blog-index__controls" };
var v = ["value"];
var b = {
  key: 0,
  class: "blog-index__filters"
};
var k = ["onClick"];
var f = { key: 0 };
var x = { key: 1 };
var Q = defineComponent({
  __name: "BlogFilters",
  props: {
    searchQuery: {},
    activeTag: {},
    tags: {}
  },
  emits: ["update:searchQuery", "update:activeTag"],
  setup(n, { emit: c }) {
    const o = c;
    function i(s) {
      const l = s.target;
      o("update:searchQuery", l.value);
    }
    function r(s) {
      o("update:activeTag", s);
    }
    return (s, l) => (openBlock(), createElementBlock("div", y, [
      createBaseVNode("input", {
        value: n.searchQuery,
        type: "search",
        class: "blog-index__search",
        placeholder: "Search posts by title or description",
        "aria-label": "Search blog posts",
        onInput: i
      }, null, 40, v),
      n.tags.length ? (openBlock(), createElementBlock("div", b, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(["all", ...n.tags], (a) => (openBlock(), createElementBlock("button", {
          key: a,
          type: "button",
          class: normalizeClass(["blog-index__tag", { "blog-index__tag--active": a === n.activeTag }]),
          onClick: (C) => r(a)
        }, [
          a === "all" ? (openBlock(), createElementBlock("span", f, "All posts")) : (openBlock(), createElementBlock("span", x, "#" + toDisplayString(a), 1))
        ], 10, k))), 128))
      ])) : createCommentVNode("", true)
    ]));
  }
});

export {
  Q
};
//# sourceMappingURL=chunk-IMJ32XNN.js.map
