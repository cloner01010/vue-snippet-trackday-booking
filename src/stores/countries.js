import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { watch } from 'vue'


export const useCountriesStore = defineStore('countries', {
  state: () => ({
    countries: [],
    isFetching: false,
  }),
  getters: {
    getCountriesByLang: (state) => (lang) => {
      return state.countries.map((country) => {
        const translation = country.translations.find(
          (translation) => translation.lang === lang
        )
        return {
          title: translation ? translation.name : 'No translation available',
          value: country.id,
        }
      })
    },
    getCountries:
      (state) => state.countries
  }
  ,
  actions: {
    fetch() {
      const { result, loading, error } = useQuery(gql`
          query getCountries {
              countries {
                  id
                  name
                  translations{
                      lang
                      name
                  }
              }
          }
      `)
      this.isFetching = loading
      watch(result, (newValue) => {
        if (newValue) {
          this.countries = newValue.countries
        }
      })

      if (error.value) {
        console.error('Error fetching data:', error.value)
      }
    }
  }
})
