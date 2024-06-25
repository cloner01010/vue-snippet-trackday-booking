<script>
import { useWizardStore } from '@/stores/wizard.js'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSnippetStore } from '@/stores/SnippetStore.js'
import ContactInfo from '@/components/ContactInfo.vue'
import { storeToRefs } from 'pinia'
import VehicleInfo from '@/components/VehicleInfo.vue'
import { useMotoDBStore } from '@/stores/motoDB.js'
import AddService from '@/components/AddService.vue'
import { useServicesStore } from '@/stores/services.js'
import PaymentIntent from '@/components/PaymentIntent.vue'


export default {
  name: 'BookingWizard',
  components: { PaymentIntent, AddService, VehicleInfo, ContactInfo },
  props: {
    lang: {
      type: String,
      required: true
    },
    sid: {
      type: String,
      required: true
    },
    eventID: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { locale } = useI18n()
    const wizardStore = useWizardStore()
    const snippetStore = useSnippetStore()
    const motoDBStore = useMotoDBStore()
    const serviceStore = useServicesStore()
    const { addedVehicle } = storeToRefs(motoDBStore)
    const { addedService } = storeToRefs(serviceStore)
    const { currentStep, totalPrice, redeemedCoupons } = storeToRefs(wizardStore)
    const { participantId, userId, bookingId } = storeToRefs(wizardStore)
    const isVehicleInfoComplete = computed(() => {
      return addedVehicle.value.make.trim() !== '' && addedVehicle.value.model.trim() !== ''
    })
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    }
    const price = computed(() => {
      return wizardStore.getPrice + ' ' + wizardStore.getCurrency
    })
    const total = computed(() => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(totalPrice.value.value) + ' ' + totalPrice.value.currency
    })


    const formattedNumber = computed((number) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(number)
    })

    onMounted(() => {
      let stripeScript = document.createElement('script')
      stripeScript.setAttribute('src', 'https://js.stripe.com/v3/')
      document.head.appendChild(stripeScript)
      snippetStore.fetch(props.sid)
      wizardStore.fetchTrackdayEvent(props.eventID)
      locale.value = props.lang
    })
    return {
      totalPrice,
      redeemedCoupons,
      total,
      isVehicleInfoComplete,
      addedVehicle,
      addedService,
      participantId,
      userId,
      bookingId,
      currentStep,
      snippetStore,
      wizardStore,
      formatDate,
      ...props,
      formattedNumber,
      price
    }
  }
}
</script>

<template>
  <div class="spinner" v-if="wizardStore.isFetching">
    <v-progress-circular size="70" color="green" indeterminate></v-progress-circular>
  </div>
  <v-container class="w-container" theme="dark" v-else>
    <v-row justify="center"
    ><h1 class="main-heading">{{ wizardStore?.getTrackdayItem?.name }}</h1></v-row
    >
    <v-row class="wizard-row" justify="center">
      <v-col class="wizard-container" xl="9" lg="8" md="7" sm="12" xs="12">
        <v-sheet color="transparent" class="wizard-sheet">
          <v-stepper v-model="currentStep" theme="dark" class="stepper">
            <v-stepper-header class="wizard-header">
              <template v-for="(step, index) in wizardStore.getWizardSteps" :key="index">
                <v-divider v-if="index"></v-divider>
                <v-stepper-item :title="$t(step)" :value="index + 1"></v-stepper-item>
              </template>
              <template v-if="snippetStore.getSnippet?.has_payment">
                <v-divider></v-divider>
                <v-stepper-item
                  :title="$t('payment')"
                  :value="wizardStore.getWizardSteps.length + 1"
                ></v-stepper-item>
              </template>
            </v-stepper-header>
            <v-stepper-window>
              <v-stepper-window-item :value="1">
                <contact-info :event-i-d="eventID"></contact-info>
              </v-stepper-window-item>

              <v-stepper-window-item
                v-if="wizardStore.getWizardSteps.includes('addVehicle')"
                :value="2"
              >
                <vehicle-info :booking-id="wizardStore.bookingId" :event-id="eventID"
                              :participant-id="wizardStore.participantId" :user-id="wizardStore.userId"></vehicle-info>
              </v-stepper-window-item>

              <v-stepper-window-item
                v-if="wizardStore.getWizardSteps.includes('addService')"
                :value="wizardStore.getWizardSteps.indexOf('addService') + 1"
              >
                <add-service :booking-id="wizardStore.bookingId" :event-id="eventID"
                             :participant-id="wizardStore.participantId" :user-id="wizardStore.userId"></add-service>
              </v-stepper-window-item>
              <v-stepper-window-item
                v-if="wizardStore.getWizardSteps.includes('redeemVoucher')"
                :value="wizardStore.getWizardSteps.indexOf('redeemVoucher') + 1"
              >
                <redeem-voucher :booking-id="wizardStore.bookingId" :event-id="eventID"
                                :participant-id="wizardStore.participantId"
                                :user-id="wizardStore.userId"></redeem-voucher>
              </v-stepper-window-item>
              <v-stepper-window-item
                v-if="wizardStore.getWizardSteps.includes('confirmation')"
                :value="wizardStore.getWizardSteps.indexOf('confirmation') + 1"
              >
                <confirmation-page :booking-id="wizardStore.bookingId" :event-id="eventID"
                                   :participant-id="wizardStore.participantId"
                                   :user-id="wizardStore.userId"></confirmation-page>
              </v-stepper-window-item>
              <v-stepper-window-item
                :value="wizardStore.getWizardSteps.length + 1"
                v-if="snippetStore.getSnippet?.has_payment"
              >
               <payment-intent></payment-intent>
              </v-stepper-window-item>
            </v-stepper-window>
          </v-stepper>
        </v-sheet>
      </v-col>
      <v-col xl="3" lg="4" md="5" sm="12" xs="12" class="wizard-summary">
        <v-sheet class="infobox px-3 py-4" rounded="true">
          <div class="infobox-trackday-name">
            <h4 class="pa-0">{{ wizardStore.getTrackdayItem?.trackday_name }}</h4>
          </div>

          <div class="infobox-row infobox-trackday-date mx-1 py-4">
            <font-awesome-icon :icon="['far', 'calendar-days']" style="color: #ffffff" />
            <span class="mx-2">
              {{ formatDate(wizardStore.getTrackdayItem?.date_start) }} -
              {{ formatDate(wizardStore.getTrackdayItem?.date_end) }}</span
            >
          </div>
          <div class="infobox-trackday-event-name">
            <h4 class="pa-0">{{ wizardStore.getTrackdayItem?.name }}</h4>
          </div>
          <div v-if="isVehicleInfoComplete" class="infobox-row infobox-trackday-vehicle my-4 mx-1">
            <font-awesome-icon :icon="['fas', 'car']" style="color: #ffffff;" />
            <div>{{ `${addedVehicle.make} ${addedVehicle.model} ${addedVehicle.year}` }}</div>
          </div>
          <ul class="pt-4">
            <li class="infobox-list-item infobox-price-item">
              <div class="infobox-list-item-label infobox-price-item-label">{{ $t('price') }}</div>
              <div class="infobox-list-item-value infobox-price-item-value">
                {{ price }}
              </div>
            </li>

            <template v-for="service in addedService" :key="service.id">
              <li class="infobox-list-item-wrapper">
                <div
                  class="infobox-list-item infobox-service-item">
                  <div
                    class="infobox-list-item-label infobox-service-item-label">{{ `${service.amount}` }}x
                  </div>
                  <div
                    class="infobox-list-item-value infobox-service-item-value">{{ `${service.price} ${service.currency}`
                    }}
                  </div>
                </div>
              </li>
            </template>
            <p class="coupon-header">{{ $t('coupon') }}</p>
            <li v-for="coupon in redeemedCoupons" :key="coupon.id"
                class="infobox-list-item infobox-coupon-item">
              <div
                class="infobox-list-item-label infobox-coupon-item-label"><span
                id="couponCode">{{ `${$t('coupon')}: ${coupon.name}` }}</span></div>
              <div
                class="infobox-list-item-value infobox-coupon-item-value">{{ `-${coupon.price} ${totalPrice.currency}`
                }}
              </div>
            </li>

            <li v-if="participantId" class="infobox-list-item infobox-total-item mb-4">
              <div class="infobox-list-item-label infobox-total-item-label">{{ $t('total') }}</div>
              <div class="infobox-list-item-value infobox-total-item-value">
                <span id="totalPriceValue">{{ total }}</span>
              </div>
            </li>
          </ul>
          <div id="vatFooterNote " class="vatFooterNote">
            {{ $t('vatFooterNote') }}
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@media (min-width: 992px) {
  .wizard-row {
    max-width: 960px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (min-width: 1200px) {
  .wizard-row {
    max-width: 1140px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (min-width: 1400px) {
  .wizard-row {
    max-width: 1320px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 600px) {
  .wizard-row {
    flex-direction: column;
    align-items: center;
  }
}
.v-stepper {
  height: 100%;
}
.w-container{
  width: 100%;
  max-width: 100%;
}
.wizard-summary {
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  margin-top: 0;
}
.wizard-container {
  overflow: visible;

}



.wizard-sheet {
  height: 100%;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.v-stepper-item {
  color: var(--txt-color) !important;
}

.v-stepper-item--selected {
  color: var(--primary-color) !important;
}

.main-heading {
  padding: 24px;
}

.infobox {
  height: 100%;
  display: flex;
  flex-direction: column;
}



.wizard-summary .infobox {
  background-color: var(--primary-color) !important;
}

.infobox-trackday-date {
  color: var(--txt-color);
  font-size: 0.875rem;
}

.infobox-trackday-event-name {
  color: var(--txt-color);
}

.infobox-trackday-name {
  color: var(--txt-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.infobox-trackday-vehicle {
  color: var(--txt-color);
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.875rem;
}

.infobox ul {
  color: var(--txt-color);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--infobox-element-gap);
}

.infobox-total-item {
  font-weight: bold;
}

.infobox-list-item {
  font-size: 0.875rem;
  color: var(--txt-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vatFooterNote {
  margin-top: auto;
  font-style: italic;
  color: var(--txt-color);
  font-size: 1rem;
}

.coupon-header {
  font-size: 0.875rem;
}

ul {
  list-style-type: none;
}

</style>
