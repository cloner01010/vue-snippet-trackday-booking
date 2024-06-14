import { createRouter, createWebHistory } from 'vue-router'
import TrackdayList from '@/components/TrackdayList.vue'

const routes = [
  {
    path: '/trackdays/:lang',
    component: TrackdayList,
    props: route => ({ sid: route.query.sid, lang: route.params.lang })
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
