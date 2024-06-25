import { createRouter, createWebHistory } from 'vue-router'
import TrackdayList from '@/components/TrackdayList.vue'
import BookingWizard from '@/components/BookingWizard.vue'
import BookingSuccess from '@/components/BookingSuccess.vue'

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
  },
  {
    path: '/trackdays/:eventID/participant/:participantId/booking/:bookingId/user/:userId/success/:lang',
    component: BookingSuccess,
    props: route => ({
      sid: route.query.sid,
      lang: route.params.lang,
      eventID: route.params.eventID,
      participantId:route.params.participantId,
      bookingId:route.params.bookingId,
      userId:route.params.userId,
    })
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
