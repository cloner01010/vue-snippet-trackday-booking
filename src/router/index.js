import { createRouter, createWebHistory } from 'vue-router'
import TrackdayList from '@/components/TrackdayList.vue'
import BookingWizard from '@/components/BookingWizard.vue'

const routes = [
  {
    path: '/trackdays/:lang',
    component: TrackdayList,
    props: route => ({ sid: route.query.sid, lang: route.params.lang })
  },
  {
    path: '/trackdays/:lang/:eventID',
    component: BookingWizard,
    props: route => ({ sid: route.query.sid, lang: route.params.lang, eventID: route.params.eventID })
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
