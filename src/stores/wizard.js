import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import { watch } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import apolloClient from '@/apolloClient.js'
import { useSnippetStore } from '@/stores/SnippetStore.js'

const REDEEM_COUPON_MUTATION = gql`
    mutation redeemCoupon($input: CouponInput!) {
        redeemCoupon(input: $input) {
            id
            coupon {
                name
                price
            }
        }
    }
`


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
            price{
                price_gross
                currency{
                    unit
                }
            }
        }
    }
`

export const useWizardStore = defineStore('wizard', {
  state: () => ({
    participantDataIsLoading: true,
    isRedeeming: false,
    redeemedCoupons: [],
    totalPrice: {
      value: 0,
      currency: ''
    },
    services: [],
    currentStep: 1,
    participantId: null,
    userId: null,
    bookingId: null,
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
    },
    couponInput: {
      trackday_item_id: null,
      user_id: null,
      participant_id: null,
      booking_id: null,
      code: null
    },
    participant: []

  }),

  getters: {
    getServicesByLang: (state) => (lang) => {
      state.services = []
      // Get today's date
      const today = new Date()
      state.data?.trackdayItemByID.services
        .filter((service) => {
          // Calculate the date difference
          const dateStart = new Date(state.data?.trackdayItemByID.date_start)
          const daysDifference = (dateStart - today) / (1000 * 60 * 60 * 24) // Convert milliseconds to days

          // Apply the filter conditions
          return service.amount_available_per_participant >= 1 && service.days_not_bookable_before < daysDifference
        })
        .map((service) => {
          const translation = service.translations.find(
            (translation) => translation.lang === lang
          )
          const s = {
            id: service.id,
            name: translation !== undefined && translation.name ? translation.name : service.name,
            price: new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(service.price.price_gross),
            priceType: service.price_type,
            availability: service.amount_available_per_participant,
            daysBefore: service.days_not_bookable_before,
            currency: service.price.currency.unit,
            isBookable: true,
            amount: 0
          }
          state.services.push(s)
        })
      return state.services
    },
    getParticipant:
      (state) => {
        return state?.participant?.participant || []
      },
    getServices:
      (state) => {
        return state.data?.trackdayItemByID.services || []
      },
    getContactInfo(state) {
      return state.contactInfo
    }
    ,
    getCurrency(state) {
      return state.data?.trackdayItemByID?.price.currency.unit
    }
    ,
    getPrice(state) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(state.data?.trackdayItemByID?.price.price_gross)
    }
    ,
    getTrackdayItem(state) {
      return state.data?.trackdayItemByID || null
    }
    ,
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
  }
  ,
  actions: {
    nextStep() {
      const snippetStore = useSnippetStore()
      const totalSteps = this.getWizardSteps.length + (snippetStore.getSnippet?.has_payment ? 1 : 0)
      if (this.currentStep < totalSteps) {
        this.currentStep++
      }
    }
    ,
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    }
    ,
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
          this.totalPrice.value = response.data.createParticipant.price.price_gross
          this.totalPrice.currency = response.data.createParticipant.price.currency.unit

        } else {
          throw new Error('No data returned from mutation')
        }
      } catch (error) {
        console.error('Error sending contact info:', error)
        throw error
      }
    }
    ,

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
    },
    async redeemCoupons() {
      this.isRedeeming = true
      const { mutate: redeem } = provideApolloClient(apolloClient)(() =>
        useMutation(REDEEM_COUPON_MUTATION)
      )
      try {
        const response = await redeem({
          input: this.couponInput
        })
        if (response.data) {
          this.isRedeeming = false
          const redeem = {
            id: response.data.redeemCoupon.id,
            name: response.data.redeemCoupon.coupon.name,
            price: new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(response.data.redeemCoupon.coupon.price)
          }
          this.redeemedCoupons.push(redeem)
          this.totalPrice.value -= redeem.price

        } else {
          this.isRedeeming = false
          throw new Error('No data returned from mutation')
        }
      } catch (error) {
        this.isRedeeming = false
        console.error('Error sending contact info:', error)
        throw error
      }
    },


     fetchParticipant(trackday_item_id, participant_id, booking_id, user_id) {
      const { result, loading, error } = useQuery(
        gql`
            query getParticipant( $trackday_item_id: ID!,$participant_id: ID!,$booking_id: ID!,$user_id: ID!) {
                participant(
                    trackday_item_id: $trackday_item_id
                    participant_id: $participant_id
                    booking_id: $booking_id
                    user_id: $user_id
                ) {
                    user {
                        firstname
                        lastname
                        lang
                        email
                    }
                    address {
                        firstname
                        lastname
                        email
                        street
                        zip
                        city
                        number
                        country {
                            name
                            translations {
                                name
                                lang
                            }
                        }
                        phone
                        additional1
                    }
                    invoice_address {
                        company_name
                        vat
                        email
                        firstname
                        lastname
                        street
                        zip
                        city
                        number
                        country {
                            name
                            translations {
                                name
                            }
                        }
                        phone
                        additional1
                    }
                }
            }

        `,
        {
          trackday_item_id: trackday_item_id,
          participant_id: participant_id,
          booking_id: booking_id,
          user_id: user_id
        }
      )
      this.participantDataIsLoading = loading
      watch(result, (newValue) => {
        if (newValue) {
          this.participant = newValue
        }
      })

      if (error.value) {
        console.error('Error fetching data:', error.value)
      }
    }

  }

})
