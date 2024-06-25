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