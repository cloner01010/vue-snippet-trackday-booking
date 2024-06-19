import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { watch } from 'vue'


export const useWizardStore = defineStore('wizard', {
  state: () => ({
    data:[],
    wizardSteps: [],
    isFetching: false
  }),
  getters: {
    getTrackdayItem(state) {
      return state.data?.trackdayItemByID || null;
    },
    getWizardSteps(state) {
      const trackdayData = state.data?.trackdayItemByID
      if(trackdayData){
        let counter = 0
        state.wizardSteps.push("contactInformation")
        counter++
        if(trackdayData.is_own_vehicle_mandatory){
          state.wizardSteps.splice(counter, 0, "addVehicle");
          counter++
        }
        if(trackdayData.services.length > 0){
          state.wizardSteps.splice(counter, 0, "addService");
          counter++
        }
        if(trackdayData.max_coupon_redeem_per_trackday_item > 0){
          state.wizardSteps.splice(counter, 0, "redeemVoucher");
          counter++
        }
        state.wizardSteps.push("confirmation")
      }
      return state.wizardSteps || null
    }
  },
  actions: {
    fetchTrackdayEvent(id) {
      const { result, loading, error } = useQuery(gql`
          query getTrackdayEvent($id: ID!){
              trackdayItemByID(id: $id){
                  name
                  date_start
                  date_end
                  trackday_name
                  max_coupon_redeem_per_trackday_item
                  available_bookings
                  is_own_vehicle_mandatory
                  vehicle_type{
                      id
                      name
                  }
                  price{
                      price_gross
                      currency{
                          unit
                      }
                  }
                  services{
                      id
                  }
              }
          }
      `,{id: id})
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
