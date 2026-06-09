import BlogTheme from '@sugarat/theme'
import { h } from 'vue'
import SeriesNav from './components/SeriesNav.vue'

export default {
  extends: BlogTheme,
  Layout: () => {
    return h(BlogTheme.Layout, null, {
      'doc-before': () => h(SeriesNav),
    })
  },
}