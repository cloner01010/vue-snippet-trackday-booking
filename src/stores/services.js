import { defineStore, storeToRefs } from 'pinia'
import gql from 'graphql-tag'
import { provideApolloClient } from '@vue/apollo-composable'
import { useMutation } from '@vue/apollo-composable'
import apolloClient from '@/apolloClient.js'
import { useWizardStore } from '@/stores/wizard.js'


const ADD_SERVICE_MUTATION = gql`
    mutation addService($input: ServiceInput!) {
        addService(input: $input) {
            id,
            amount,
            price{
                price_gross
                currency{
                    unit
                }
            }
        }
    }
`
const REMOVE_SERVICE_MUTATION = gql`
    mutation removeService($input: ServiceRemoveInput!) {
        removeService(input: $input)
    }
`

export const useServicesStore = defineStore('services', {
  state: () => ({
    isAdding: false,
    isRemoving: false,
    addedService: [],
    addServiceInput: {
      trackday_item_id: null,
      user_id: null,
      participant_id: null,
      booking_id: null,
      price_type: null,
      amount: null,
      service_id: null
    },
    removeServiceInput: {
      trackday_item_id: null,
      user_id: null,
      participant_id: null,
      booking_id: null,
      participant_service_id: null
    }
  }),

  getters: {}
  ,
  actions: {

    async addService() {
      const { mutate: addServices, loading } = provideApolloClient(apolloClient)(() =>
        useMutation(ADD_SERVICE_MUTATION)
      )
      try {
        const response = await addServices({
          input: this.addServiceInput
        })
        this.isAdding = loading
        if (response.data) {
          const wizardStore = useWizardStore()
          const { totalPrice } = storeToRefs(wizardStore)
          totalPrice.value.value += response.data.addService.price.price_gross
          totalPrice.value.currency = response.data.addService.price.currency.unit
          const newService = {
            id: response.data.addService.id,
            amount: response.data.addService.amount,
            price: new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(response.data.addService.price.price_gross),
            currency: response.data.addService.price.currency.unit,
            service_id: this.addServiceInput.service_id
          }
          this.addedService.push(newService)
        } else {
          throw new Error('No data returned from mutation')
        }
      } catch (error) {
        console.error('Error sending contact info:', error)
        throw error
      }
    },
    async removeService() {
      const { mutate: removeServices, loading } = provideApolloClient(apolloClient)(() =>
        useMutation(REMOVE_SERVICE_MUTATION)
      )
      try {
        const response = await removeServices({
          input: this.removeServiceInput
        })
        this.isRemoving = loading
        if (response.data) {
          const s = this.addedService.find(s => s.id === this.removeServiceInput.participant_service_id)
          const wizardStore = useWizardStore()
          const { totalPrice } = storeToRefs(wizardStore)
          totalPrice.value.value -= s.price
          return response.data.removeService
        } else {
          throw new Error('No data returned from mutation')
        }
      } catch (error) {
        console.error('Error sending contact info:', error)
        throw error
      }
    }
  }
})
