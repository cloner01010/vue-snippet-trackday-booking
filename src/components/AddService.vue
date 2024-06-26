<script>

import { onMounted, ref } from 'vue'
import { useWizardStore } from '@/stores/wizard.js'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useServicesStore } from '@/stores/services.js'


export default {
  props: {
    participantId: {
      type: String,
      required: true
    },
    bookingId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    eventId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const form = ref()
    const { locale } = useI18n()
    const wizardStore = useWizardStore()
    const serviceStore = useServicesStore()
    const { services } = storeToRefs(wizardStore)
    const { previousStep, nextStep } = wizardStore
    const { addedService, addServiceInput, removeServiceInput } = storeToRefs(serviceStore)

    onMounted(() => {
      wizardStore.getServicesByLang(locale.value)
    })

    const removeService = async (serviceId) => {
      const serviceToRemove = addedService.value.find(s => s.service_id === serviceId)
      if (!serviceToRemove) {
        console.error('Service not found')
        return
      }
      removeServiceInput.value.trackday_item_id = props.eventId
      removeServiceInput.value.participant_id = props.participantId
      removeServiceInput.value.booking_id = props.bookingId
      removeServiceInput.value.user_id = props.userId
      removeServiceInput.value.participant_service_id = serviceToRemove.id

      const serviceRemoved = await serviceStore.removeService()

      if (serviceRemoved) {
        // Find the index of the service to remove
        const index = addedService.value.findIndex(s => s.id === serviceToRemove.id)

        // Remove the service from addedService
        if (index > -1) {
          addedService.value.splice(index, 1)
          const service = services.value.find(s => s.id === serviceId)
          service.availability++
          service.amount--

        }
      } else {
        console.error('Failed to remove service')
      }
    }


    const addService = async (serviceId) => {
      const service = services.value.find(s => s.id === serviceId)
      if (!service) {
        return
      }
      addServiceInput.value.service_id = service.id
      addServiceInput.value.amount = 1
      addServiceInput.value.price_type = service.priceType
      addServiceInput.value.trackday_item_id = props.eventId
      addServiceInput.value.participant_id = props.participantId
      addServiceInput.value.booking_id = props.bookingId
      addServiceInput.value.user_id = props.userId
      if (service.availability > 0) {
        await serviceStore.addService()
        service.availability--
        service.amount++

        if (service.availability === 0) {
          services.value = services.value.map(s =>
            s.id === service.id ? { ...s, isBookable: false } : s
          )

        }
      }
    }

    return {
      removeService,
      serviceStore,
      addService,
      addedService,
      addServiceInput,
      form,
      services,
      previousStep,
      nextStep
    }
  }
}
</script>

<template>
  <v-form ref="form">
    <v-table>
      <thead>
      <tr>
        <th class="text-left">
          {{ $t('serviceName') }}
        </th>
        <th class="text-left">
          {{ $t('price') }}
        </th>
        <th class="text-left">
          {{ $t('priceType') }}
        </th>
        <th class="text-left">
          {{ $t('availability') }}
        </th>
        <th class="text-center">
          {{ $t('amount') }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="service in services" :key="service.id">
        <td>{{ service.name }}</td>
        <td>{{ `${service.price} ${service.currency}` }}</td>
        <td>{{ $t(service.priceType) }}</td>
        <td>{{ service.availability }}</td>
        <td>
          <v-container>
            <v-row align="center" justify="center">
              <v-col cols="4">
                <v-btn :loading="serviceStore.isRemoving" @click="removeService(service.id)" variant="elevated"
                       rounded="lg" size="small" color="#d5d5d5" :disabled="service.amount <= 0">
                  <font-awesome-icon :icon="['fas', 'minus']" />
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-text-field variant="solo"  bg-color="transparent"
                              class="amount-container text-center" :model-value="service.amount" readonly flat>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-btn :loading="serviceStore.isAdding" @click="addService(service.id)" size="small" variant="elevated"
                       rounded="lg" color="#d5d5d5"
                       :disabled="service.availability <= 0">
                  <font-awesome-icon :icon="['fas', 'plus']" />
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </td>
      </tr>
      </tbody>
    </v-table>
    <v-row justify="space-between" class="pt-15 ma-0">
      <v-col color="green" class="back-btn" cols="2">
        <v-btn @click="previousStep()" :text="$t('back')" variant="elevated" rounded="lg" size="x-large"
               color="#d5d5d5"></v-btn>
      </v-col>
      <v-col @click="nextStep()" color="#57ab27" class="next-btn" cols="2">
        <v-btn :text="$t('next')" variant="elevated" rounded="lg" size="x-large"
               color="#57ab27"></v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>

.amount {
  display: inline-block;
  text-align: center;
  font-size: 1.5rem;
  width: 100%;
  color: white;
}

td {
  font-size: 1rem;
}

</style>

