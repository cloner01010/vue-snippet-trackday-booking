import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { provideApolloClient, useMutation, useQuery } from '@vue/apollo-composable'
import { watch } from 'vue'
import apolloClient from '@/apolloClient.js'

const ADD_VEHICLE_MUTATION = gql`
    mutation addVehicle($input: VehicleInput!) {
        addVehicle(input: $input) {
            type{
                name
            }
            make{
                name
            }
            model{
                name
            }
            year_construction
        }
    }
`
export const useMotoDBStore = defineStore('motoDB', {
  state: () => ({
    addedVehicle:{
      make: '',
      model: '',
      year:null
    },
    types: [],
    makes: [],
    models: [],
    loadingModels: false,
    loadingMakes: false,
    loadingTypes: false,
    vehicleInput: {
      trackday_item_id: null,
      user_id: null,
      participant_id: null,
      booking_id: null,
      type_id: null,
      make_id: null,
      model_id: null,
      year_construction: null
    }
  }),
  getters: {
    getTypesSelect(state) {
      return state.types.map(type => ({
        title: type.name,
        value: type.id
      }))
    },
    getMakesSelect(state) {
      return state.makes.map(make => ({
        title: make.name,
        value: make.id
      }))
    },
    getModelsSelect(state) {
      return state.models.map(model => ({
        title: model.name,
        value: model.id
      }))
    },
    getYearsSelect() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let year = currentYear; year >= 1960 ; year--) {
        years.push({
          title: year.toString(),
          value: year
        })
      }
      return years
    }
  }
  ,
  actions: {
    fetchTypes() {
      const { result, loading, error } = useQuery(gql`
          query getTypes {
              motoDBTypes {
                  id
                  name
              }
          }
      `)
      this.loadingTypes = loading
      watch(result, (newValue) => {
        if (newValue) {
          this.types = newValue.motoDBTypes
        }
      })

      if (error.value) {
        console.error('Error fetching data:', error.value)
      }
    },
    fetchMakes() {
      watch(this.vehicleInput, () => {
        const { result, loading, error } = provideApolloClient(apolloClient)(() => useQuery(gql`
            query getMakes($typeId: ID!) {
                motoDBMakes(typeId: $typeId){
                    id
                    name
                }
            }
        `, { typeId: this.vehicleInput.type_id }))

        this.loadingMakes = loading
        watch(result, (newValue) => {
          if (newValue) {
            this.makes = newValue.motoDBMakes
          }
        })

        if (error.value) {
          console.error('Error fetching data:', error.value)
        }
      }, { deep: true })

    },

    fetchModels() {
      watch(this.vehicleInput, () => {
        const { result, loading, error } = provideApolloClient(apolloClient)(() => useQuery(gql`
            query getModels($makeId: ID!) {
                motoDBModels(makeId: $makeId) {
                    id
                    name
                }
            }
        `, { makeId: this.vehicleInput.make_id }))

        this.loadingModels = loading
        watch(result, (newValue) => {
          if (newValue) {
            this.models = newValue.motoDBModels
          }
        })

        if (error.value) {
          console.error('Error fetching data:', error.value)
        }
      }, { deep: true })

    },


    async addVehicle() {
      this.vehicleInput.year_construction = parseInt(this.vehicleInput.year_construction)
      const { mutate: addVehicle, loading } = provideApolloClient(apolloClient)(() =>
        useMutation(ADD_VEHICLE_MUTATION)
      )
      try {
        const response = await addVehicle({
          input: this.vehicleInput
        })
        if (response.data) {
          this.addedVehicle.model = response.data.addVehicle.model.name
          this.addedVehicle.make = response.data.addVehicle.make.name
          this.addedVehicle.year = response.data.addVehicle.year_construction
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
