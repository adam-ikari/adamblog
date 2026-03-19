import {
  e
} from "./chunk-HCPEYRNK.js";
import {
  computed,
  inject,
  ref
} from "./chunk-NPGVKGNX.js";

// node_modules/vitepress-plugin-blog/dist/composables/useBlogPosts.js
function p() {
  const t = inject(e, ref([])), a = computed(() => t.value.length), c = computed(() => {
    const r = /* @__PURE__ */ new Set();
    for (const o of t.value)
      for (const s of o.tags ?? []) {
        const e2 = s.trim();
        e2 && r.add(e2);
      }
    return Array.from(r).sort((o, s) => o.localeCompare(s));
  });
  return {
    posts: t,
    totalPosts: a,
    allTags: c
  };
}

export {
  p
};
//# sourceMappingURL=chunk-322YQTTG.js.map
