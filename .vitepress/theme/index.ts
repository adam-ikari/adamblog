import BlogTheme from '@sugarat/theme'
import { h } from 'vue'
import SeriesNav from './components/SeriesNav.vue'
import SeriesCardList from './components/SeriesCardList.vue'
import DynamicSeriesList from './components/DynamicSeriesList.vue'
import DonateBox from './components/DonateBox.vue'
import RelatedPosts from './components/RelatedPosts.vue'
import './styles.css'

export default {
  extends: BlogTheme,
  Layout: () => {
    return h(BlogTheme.Layout, null, {
      'doc-after': () => h('div', null, [h(SeriesNav), h(RelatedPosts), h(DonateBox)]),
    })
  },
  enhanceApp({ app }) {
    app.component('SeriesCardList', SeriesCardList)
    app.component('DynamicSeriesList', DynamicSeriesList)
  },
}
