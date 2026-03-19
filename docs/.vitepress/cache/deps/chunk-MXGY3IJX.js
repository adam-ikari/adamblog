// node_modules/vitepress-plugin-blog/dist/utils/date.js
var n = new Intl.DateTimeFormat(void 0, {
  month: "long",
  day: "numeric",
  year: "numeric"
});
function a(r2, e = n) {
  if (!r2) return "";
  const t = Date.parse(r2);
  return Number.isNaN(t) ? r2 : e.format(new Date(t));
}
function o(r2) {
  if (!r2) return 0;
  const e = Date.parse(r2);
  return Number.isNaN(e) ? 0 : e;
}

// node_modules/vitepress-plugin-blog/dist/utils/author.js
var r = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
function s(t) {
  return !t || typeof t != "string" || t.includes(" ") ? false : r.test(t);
}
function i(t, e) {
  const n2 = `https://github.com/${t}.png`;
  return e ? `${n2}?size=${e}` : n2;
}

export {
  a,
  o,
  s,
  i
};
//# sourceMappingURL=chunk-MXGY3IJX.js.map
