import BlogTheme from '@sugarat/theme'
import { h } from 'vue'
import SeriesNav from './components/SeriesNav.vue'
import SeriesCardList from './components/SeriesCardList.vue'
import DynamicSeriesList from './components/DynamicSeriesList.vue'
import DonateBox from './components/DonateBox.vue'
import ImageFullscreen from './components/ImageFullscreen.vue'
import RelatedArticles from './components/RelatedArticles.vue'
import './styles.css'

export default {
  extends: BlogTheme,
  Layout: () => {
    return h(BlogTheme.Layout, null, {
      'doc-after': () => h('div', null, [h(ImageFullscreen), h(SeriesNav), h(RelatedArticles), h(DonateBox)]),
    })
  },
  enhanceApp({ app }) {
    app.component('SeriesCardList', SeriesCardList)
    app.component('DynamicSeriesList', DynamicSeriesList)
  },
}
