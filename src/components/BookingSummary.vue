<script>
import { useWizardStore } from '@/stores/wizard.js'
import { useSnippetStore } from '@/stores/SnippetStore.js'
import { useMotoDBStore } from '@/stores/motoDB.js'
import { useServicesStore } from '@/stores/services.js'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

export default {
  props: {
    sid: {
      type: String,
      required: true
    },
    eventID: {
      type: String,
      required: true
    }
  },
  setup(props){
    const wizardStore = useWizardStore()
    const snippetStore = useSnippetStore()
    const motoDBStore = useMotoDBStore()
    const serviceStore = useServicesStore()
    const { addedVehicle } = storeToRefs(motoDBStore)
    const { addedService } = storeToRefs(serviceStore)
    const { totalPrice, redeemedCoupons, participantId } = storeToRefs(wizardStore)
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
      snippetStore.fetch(props.sid)
      wizardStore.fetchTrackdayEvent(props.eventID)

    })
    return {
      participantId,
      totalPrice,
      redeemedCoupons,
      total,
      isVehicleInfoComplete,
      addedVehicle,
      addedService,
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
</template>

<style scoped>

.infobox {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.wizard-summary {
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  margin-top: 0;
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