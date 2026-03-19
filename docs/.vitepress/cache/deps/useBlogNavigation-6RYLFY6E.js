import {
  p
} from "./chunk-322YQTTG.js";
import {
  o
} from "./chunk-HCPEYRNK.js";
import {
  computed,
  inject
} from "./chunk-NPGVKGNX.js";
import "./chunk-7D4SUZUM.js";

// node_modules/vitepress-plugin-blog/dist/composables/useBlogNavigation.js
function v() {
  const e = inject(o);
  return computed(() => {
    var s, r, n;
    const l = e == null ? void 0 : e.value;
    if (!l) return "";
    const t = (s = l.frontmatter) == null ? void 0 : s.value, u = (r = l.page) == null ? void 0 : r.value;
    return t && typeof t.slug == "string" && t.slug.trim() ? t.slug.trim() : t && typeof t.permalink == "string" && t.permalink.trim() ? t.permalink.replace(/\/$/, "").split("/").pop() ?? "" : ((n = ((u == null ? void 0 : u.relativePath) ?? "").replace(/index\.md$/i, "").split("/").pop()) == null ? void 0 : n.replace(/\.md$/i, "")) ?? "";
  });
}
function P() {
  const { posts: e } = p(), l = v(), t = computed(() => {
    const r = l.value;
    return e.value.findIndex((n) => n.slug.replace(/\.html$/, "") === r || n.slug === r);
  }), u = computed(
    () => t.value >= 0 ? e.value[t.value] : null
  ), a = computed(
    () => t.value > 0 ? e.value[t.value - 1] : null
  ), s = computed(() => {
    const r = t.value, n = e.value.length;
    return r >= 0 && r < n - 1 ? e.value[r + 1] : null;
  });
  return {
    currentPost: u,
    prevPost: a,
    nextPost: s,
    currentIndex: t
  };
}
export {
  P as useBlogNavigation
};
//# sourceMappingURL=useBlogNavigation-6RYLFY6E.js.map
