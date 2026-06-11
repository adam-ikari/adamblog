import BlogTheme from '@sugarat/theme'
import { h } from 'vue'
import SeriesNav from './components/SeriesNav.vue'
import SeriesCardList from './components/SeriesCardList.vue'

export default {
  extends: BlogTheme,
  Layout: () => {
    return h(BlogTheme.Layout, null, {
      'doc-before': () => h(SeriesNav),
    })
  },
  enhanceApp({ app }) {
    app.component('SeriesCardList', SeriesCardList)
  },
}
