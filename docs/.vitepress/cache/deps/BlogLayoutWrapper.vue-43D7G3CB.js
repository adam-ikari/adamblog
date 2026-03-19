import {
  ct
} from "./chunk-2MIMKAAD.js";
import "./chunk-322YQTTG.js";
import "./chunk-MXGY3IJX.js";
import {
  e,
  o,
  s
} from "./chunk-HCPEYRNK.js";
import {
  computed,
  createBlock,
  createSlots,
  defineComponent,
  guardReactiveProps,
  inject,
  mergeProps,
  normalizeProps,
  openBlock,
  renderList,
  resolveDynamicComponent,
  unref,
  useSlots,
  withCtx
} from "./chunk-NPGVKGNX.js";
import "./chunk-7D4SUZUM.js";

// node_modules/vitepress-plugin-blog/dist/components/BlogLayoutWrapper.vue2.js
var q = defineComponent({
  __name: "BlogLayoutWrapper",
  props: {
    blogFlagKey: {}
  },
  setup(p) {
    const m = p, i = useSlots(), y = computed(() => i), o2 = inject(o), f = computed(() => {
      var s2;
      const t = o2 == null ? void 0 : o2.value;
      return t ? ((s2 = t.frontmatter) == null ? void 0 : s2.value) ?? {} : {};
    }), r = inject(e), g = computed(() => (r == null ? void 0 : r.value) ?? []), v = inject(s), _ = computed(() => {
      var t;
      return ((t = f.value) == null ? void 0 : t[m.blogFlagKey]) === true;
    });
    return (t, s2) => _.value ? (openBlock(), createBlock(ct, {
      key: 0,
      posts: g.value
    }, null, 8, ["posts"])) : (openBlock(), createBlock(resolveDynamicComponent(unref(v)), normalizeProps(mergeProps({ key: 1 }, t.$attrs)), createSlots({ _: 2 }, [
      renderList(y.value, (d, b) => ({
        name: b,
        fn: withCtx((K) => [
          (openBlock(), createBlock(resolveDynamicComponent(d), normalizeProps(guardReactiveProps(K || {})), null, 16))
        ])
      }))
    ]), 1040));
  }
});
export {
  q as default
};
//# sourceMappingURL=BlogLayoutWrapper.vue-43D7G3CB.js.map
