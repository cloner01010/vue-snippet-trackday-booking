import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import { watch } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import apolloClient from '@/apolloClient.js'
import { useSnippetStore } from '@/stores/SnippetStore.js'


const CREATE_PARTICIPANT_MUTATION = gql`
    mutation createParticipant($input: UserInput!) {
        createParticipant(input: $input) {
            id
            user {
                id
            }
            booking {
                id
            }
        }
    }
`

export const useWizardStore = defineStore('wizard', {
  state: () => ({
    currentStep: 3,
    participantId: 0,
    userId: 0,
    bookingId: 0,
    data: [],
    wizardSteps: [],
    isFetching: false,
    isWizardLoading: false,
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
    getServicesByLang: (state) => (lang) => {
      return state.data?.trackdayItemByID.services.map((service) => {
        const translation = service.translations.find(
          (translation) => translation.lang === lang
        )
        return {
          id: service.id,
          name: translation ? translation.name : service.name,
          price: new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(service.price.price_gross),
          priceType: service.price_type,
          availability: service.amount_available_per_participant,
          daysBefore: service.days_not_bookable_before,
          currency: service.price.currency.unit
        }
      })
    },
    getServices: (state) => {
      return state.data?.trackdayItemByID.services || []
    },
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
    nextStep() {
      const snippetStore = useSnippetStore()
      const totalSteps = this.getWizardSteps.length + (snippetStore.getSnippet?.has_payment ? 1 : 0)
      if (this.currentStep < totalSteps) {
        this.currentStep++
      }
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    async sendContactInfo() {
      const { mutate: sendContactMutation, loading } = provideApolloClient(apolloClient)(() =>
        useMutation(CREATE_PARTICIPANT_MUTATION)
      )
      try {
        const response = await sendContactMutation({
          input: this.contactInfo
        })
        this.isWizardLoading = loading
        if (response.data) {
          this.participantId = response.data.createParticipant.id
          this.userId = response.data.createParticipant.user.id
          this.bookingId = response.data.createParticipant.booking.id
        } else {
          throw new Error('No data returned from mutation')
        }
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
                        name
                        price {
                            price_gross
                            currency{
                                unit
                            }
                        }
                        price_type
                        amount_available_per_participant
                        days_not_bookable_before
                        translations {
                            name
                            lang
                        }
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
  }

})
