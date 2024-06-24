<script >

import { computed, ref } from 'vue'
import { useWizardStore } from '@/stores/wizard.js'
import { useI18n } from 'vue-i18n'


export default {

  setup() {
    const form = ref()
    const {locale} = useI18n()
    const wizardStore = useWizardStore()
    const services = computed(() => wizardStore.getServicesByLang(locale.value))

    return {
      form,
      services
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
          {{$t('serviceName')}}
        </th>
        <th class="text-left">
          {{$t('price')}}
        </th>
        <th class="text-left">
          {{$t('priceType')}}
        </th>
        <th class="text-left">
          {{$t('availability')}}
        </th>
        <th class="text-left">
          {{$t('amount')}}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="service in services" :key="service.id">
        <td>{{service.name}}</td>
        <td>{{ `${service.price} ${service.currency}` }}</td>
        <td>{{service.priceType}}</td>
        <td>{{service.availability}}</td>
        <td>{{0}}</td>
      </tr>
      </tbody>
    </v-table>
  </v-form>
</template>

<style scoped>
/*const isBookable = computed(() => services.value)
/*
const services = computed(() => wizardStore.getServicesByLang(locale.value)) has this value [
{
"id": "6",
"name": "Motorradtransport",
"price": 393,
"priceType": "__PER_DAY__",
"availability": -1,
"daysBefore": 0
},
{
"id": "196",
"name": "Bachelor Service",
"price": 50,
"priceType": "__PER_EVENT__",
"availability": 1,
"daysBefore": 1
}
] write a computed property isBookable which returns true when "availability" and
"daysBefore" are greater than 1
*/
</style>

