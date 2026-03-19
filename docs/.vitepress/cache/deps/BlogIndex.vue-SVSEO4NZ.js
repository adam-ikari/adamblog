import {
  Q
} from "./chunk-IMJ32XNN.js";
import {
  F
} from "./chunk-GV7W5DTG.js";
import {
  p
} from "./chunk-322YQTTG.js";
import {
  S
} from "./chunk-J4Q5XZY7.js";
import "./chunk-MXGY3IJX.js";
import "./chunk-HCPEYRNK.js";
import {
  Fragment,
  computed,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createVNode,
  defineComponent,
  openBlock,
  ref,
  renderList,
  unref,
  watch
} from "./chunk-NPGVKGNX.js";
import "./chunk-7D4SUZUM.js";

// node_modules/vitepress-plugin-blog/dist/components/BlogIndex.vue2.js
var $ = { class: "blog-index" };
var V = {
  key: 0,
  class: "blog-index__grid"
};
var E = {
  key: 1,
  class: "blog-index__empty"
};
var A = defineComponent({
  __name: "BlogIndex",
  props: {
    pageSizes: { default: () => [5, 10, 20] },
    defaultPageSize: { default: void 0 },
    pagination: { default: "auto" }
  },
  setup(h) {
    const r = h, { posts: d, allTags: z } = p(), n = ref(""), l = ref("all"), u = ref(1), m = computed(
      () => [...r.pageSizes].sort((a, e) => a - e)
    ), s = ref(
      r.defaultPageSize ?? m.value[0] ?? 10
    );
    watch([n, l], () => {
      u.value = 1;
    });
    const p2 = computed(() => {
      const a = n.value.trim().toLowerCase(), e = l.value;
      return !a && e === "all" ? d.value : d.value.filter((t) => {
        var y;
        const k = !a || [t.title, t.description].some((v) => v.toLowerCase().includes(a)), w = e === "all" || ((y = t.tags) == null ? void 0 : y.some(
          (v) => v.toLowerCase() === e.toLowerCase()
        ));
        return k && w;
      });
    }), f = computed(() => {
      const a = (u.value - 1) * s.value;
      return p2.value.slice(a, a + s.value);
    }), P = computed(() => r.pagination === "never" ? false : r.pagination === "always" ? true : Math.ceil(p2.value.length / s.value) > 1);
    return (a, e) => (openBlock(), createElementBlock("div", $, [
      createVNode(Q, {
        "search-query": n.value,
        "onUpdate:searchQuery": e[0] || (e[0] = (t) => n.value = t),
        "active-tag": l.value,
        "onUpdate:activeTag": e[1] || (e[1] = (t) => l.value = t),
        tags: unref(z)
      }, null, 8, ["search-query", "active-tag", "tags"]),
      f.value.length ? (openBlock(), createElementBlock("div", V, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(f.value, (t) => (openBlock(), createBlock(S, {
          key: t.url,
          post: t
        }, null, 8, ["post"]))), 128))
      ])) : (openBlock(), createElementBlock("p", E, " No posts matched your filters. Try clearing the search or choosing a different tag. ")),
      P.value ? (openBlock(), createBlock(F, {
        key: 2,
        "current-page": u.value,
        "onUpdate:currentPage": e[2] || (e[2] = (t) => u.value = t),
        "page-size": s.value,
        "onUpdate:pageSize": e[3] || (e[3] = (t) => s.value = t),
        "total-posts": p2.value.length,
        "page-size-options": m.value
      }, null, 8, ["current-page", "page-size", "total-posts", "page-size-options"])) : createCommentVNode("", true)
    ]));
  }
});
export {
  A as default
};
//# sourceMappingURL=BlogIndex.vue-SVSEO4NZ.js.map
