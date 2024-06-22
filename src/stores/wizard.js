import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import { watch } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import apolloClient from '@/apolloClient.js'




const CREATE_PARTICIPANT_MUTATION = gql`
    mutation createParticipant($input: UserInput!) {
        createParticipant(input: $input) {
            id
        }
    }
`

export const useWizardStore = defineStore('wizard', {
  state: () => ({
    data: [],
    wizardSteps: [],
    isFetching: false,
    contactInfo: {
      trackday_item_id: null,
      firstname: null,
      lastname: null,
      street: null,
      number: null,
      zip: null,
      city: null,
      country_id: null,
      lang: null,
      phone: null,
      email: null,
      additional1: null,
      diffInvoiceAddress: false,
      invoice_company: null,
      invoice_firstname: null,
      invoice_lastname: null,
      invoice_street: null,
      invoice_streetNumber: null,
      invoice_city: null,
      invoice_vat: null,
      invoice_zip: null,
      invoice_email: null,
      invoice_country_id: null
    }

  }),

  getters: {
    getContactInfo(state) {
      return state.contactInfo
    },
    getCurrency(state) {
      return state.data?.trackdayItemByID?.price.currency.unit
    },
    getPrice(state) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(state.data?.trackdayItemByID?.price.price_gross)
    },
    getTrackdayItem(state) {
      return state.data?.trackdayItemByID || null
    },
    getWizardSteps(state) {
      const trackdayData = state.data?.trackdayItemByID
      if (trackdayData) {
        let counter = 0
        state.wizardSteps.push('contactInformation')
        counter++
        if (trackdayData.is_own_vehicle_mandatory) {
          state.wizardSteps.splice(counter, 0, 'addVehicle')
          counter++
        }
        if (trackdayData.services.length > 0) {
          state.wizardSteps.splice(counter, 0, 'addService')
          counter++
        }
        if (trackdayData.max_coupon_redeem_per_trackday_item > 0) {
          state.wizardSteps.splice(counter, 0, 'redeemVoucher')
          counter++
        }
        state.wizardSteps.push('confirmation')
      }
      return state.wizardSteps || null
    }
  },
  actions: {
     sendContactInfo() {
      const { mutate: sendContactMutation } =
       provideApolloClient(apolloClient)(() => useMutation(CREATE_PARTICIPANT_MUTATION))

      try {
        const response =  sendContactMutation({
          input: this.contactInfo
        })
        console.log(response)
        return response
      } catch (error) {
        console.error('Error sending contact info:', error)
        throw error
      }
    },

    fetchTrackdayEvent(id) {
      const { result, loading, error } = useQuery(
        gql`
            query getTrackdayEvent($id: ID!) {
                trackdayItemByID(id: $id) {
                    name
                    date_start
                    date_end
                    trackday_name
                    max_coupon_redeem_per_trackday_item
                    available_bookings
                    is_own_vehicle_mandatory
                    vehicle_type {
                        id
                        name
                    }
                    price {
                        price_gross
                        currency {
                            unit
                        }
                    }
                    services {
                        id
                    }
                }
            }
        `,
        { id: id }
      )
      this.isFetching = loading
      watch(result, (newValue) => {
        if (newValue) {
          this.data = newValue
        }
      })

      if (error.value) {
        console.error('Error fetching data:', error.value)
      }
    }
  },

})
