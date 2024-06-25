import './assets/main.css'
import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { DefaultApolloClient } from '@vue/apollo-composable'
import './assets/trackdayList.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCalendarDays} from '@fortawesome/free-regular-svg-icons'
import { faCar, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ContactInfo from '@/components/ContactInfo.vue'
import apolloClient from '@/apolloClient.js'
import VehicleInfo from '@/components/VehicleInfo.vue'
import AddService from '@/components/AddService.vue'
import RedeemVoucher from '@/components/RedeemVoucher.vue'
import ConfirmationPage from '@/components/ConfirmationPage.vue'
import PaymentIntent from '@/components/PaymentIntent.vue'
//import BookingSummary from '@/components/BookingSummary.vue'

library.add(faCalendarDays)
library.add(faCar)
library.add(faPlus)
library.add(faMinus)

const vuetify = createVuetify({
  components,
  directives
})


const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
})

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('contact-info', ContactInfo)
app.component('vehicle-info', VehicleInfo)
app.component('add-service', AddService)
app.component('redeem-voucher',RedeemVoucher)
app.component('confirmation-page',ConfirmationPage)
app.component('payment-intent',PaymentIntent)
//app.component('booking-summary',BookingSummary)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)
app.mount('#app')
