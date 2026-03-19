import {
  Fragment,
  computed,
  createBaseVNode,
  createCommentVNode,
  createElementBlock,
  defineComponent,
  openBlock,
  renderList,
  toDisplayString
} from "./chunk-NPGVKGNX.js";

// node_modules/vitepress-plugin-blog/dist/components/BlogPagination.vue2.js
var h = {
  key: 0,
  class: "blog-index__pagination"
};
var f = { class: "blog-index__pagination-info" };
var k = { class: "blog-index__pagination-controls" };
var y = ["disabled"];
var C = ["disabled"];
var N = { class: "blog-index__pagination-current" };
var $ = ["disabled"];
var B = ["disabled"];
var M = {
  key: 0,
  class: "blog-index__page-size"
};
var O = ["value"];
var w = ["value"];
var F = defineComponent({
  __name: "BlogPagination",
  props: {
    currentPage: {},
    pageSize: {},
    totalPosts: {},
    pageSizeOptions: {}
  },
  emits: ["update:currentPage", "update:pageSize"],
  setup(t, { emit: P }) {
    const a = t, c = P, s = computed(
      () => Math.max(1, Math.ceil(a.totalPosts / a.pageSize))
    ), v = computed(
      () => a.totalPosts === 0 ? 0 : (a.currentPage - 1) * a.pageSize + 1
    ), m = computed(
      () => Math.min(a.currentPage * a.pageSize, a.totalPosts)
    ), b = computed(
      () => a.pageSizeOptions.length > 1
    );
    function l(g) {
      c("update:currentPage", g);
    }
    function _(g) {
      const e = g.target;
      c("update:pageSize", Number(e.value)), c("update:currentPage", 1);
    }
    return (g, e) => s.value > 1 || b.value ? (openBlock(), createElementBlock("div", h, [
      createBaseVNode("div", f, " Showing " + toDisplayString(v.value) + "-" + toDisplayString(m.value) + " of " + toDisplayString(t.totalPosts) + " posts ", 1),
      createBaseVNode("div", k, [
        createBaseVNode("button", {
          type: "button",
          class: "blog-index__pagination-btn",
          disabled: t.currentPage === 1,
          "aria-label": "First page",
          onClick: e[0] || (e[0] = (o) => l(1))
        }, " «« ", 8, y),
        createBaseVNode("button", {
          type: "button",
          class: "blog-index__pagination-btn",
          disabled: t.currentPage === 1,
          "aria-label": "Previous page",
          onClick: e[1] || (e[1] = (o) => l(t.currentPage - 1))
        }, " « ", 8, C),
        createBaseVNode("span", N, " Page " + toDisplayString(t.currentPage) + " of " + toDisplayString(s.value), 1),
        createBaseVNode("button", {
          type: "button",
          class: "blog-index__pagination-btn",
          disabled: t.currentPage === s.value,
          "aria-label": "Next page",
          onClick: e[2] || (e[2] = (o) => l(t.currentPage + 1))
        }, " » ", 8, $),
        createBaseVNode("button", {
          type: "button",
          class: "blog-index__pagination-btn",
          disabled: t.currentPage === s.value,
          "aria-label": "Last page",
          onClick: e[3] || (e[3] = (o) => l(s.value))
        }, " »» ", 8, B)
      ]),
      b.value ? (openBlock(), createElementBlock("div", M, [
        e[4] || (e[4] = createBaseVNode("label", { for: "blog-page-size" }, "Posts per page:", -1)),
        createBaseVNode("select", {
          id: "blog-page-size",
          value: t.pageSize,
          class: "blog-index__page-size-select",
          onChange: _
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(t.pageSizeOptions, (o) => (openBlock(), createElementBlock("option", {
            key: o,
            value: o
          }, toDisplayString(o), 9, w))), 128))
        ], 40, O)
      ])) : createCommentVNode("", true)
    ])) : createCommentVNode("", true);
  }
});

export {
  F
};
//# sourceMappingURL=chunk-GV7W5DTG.js.map
