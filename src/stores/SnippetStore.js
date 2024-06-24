import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { watch } from 'vue'


export const useSnippetStore = defineStore('snipppet', {
  state: () => ({
    snippet: [],
    isFetching: false
  }),
  getters: {
    getSnippet: (state) => state.snippet?.snippetByExternalID,
    getTrackdayItems: (state) => {
      const snippet = state.snippet?.snippetByExternalID
      return snippet?.trackday?.trackdayItems || []
    },
  },
  actions: {
    fetch(snippet_external_id) {
      const { result, loading, error } = useQuery(gql`
          query getSnippet($external_id: ID!){
              snippetByExternalID(external_id: $external_id) {
                  external_id
                  css
                  cdn_font1
                  cdn_font2
                  cdn_font3
                  show_past_events
                  show_trackday_events
                  show_race_events
                  html_template
                  transformation
                  stripe_elements_variable
                  template_style
                  has_payment
                  translations {
                      name
                      lang
                      description_external
                      book_now_translation
                      terms_and_conditions_text_1
                      terms_and_conditions_url_1
                      terms_and_conditions_text_2
                      terms_and_conditions_url_2
                      terms_and_conditions_text_3
                      terms_and_conditions_url_3
                      additional_info
                      payment_error_page
                      payment_success_page
                      external_page_1
                      external_page_2
                  }
                  images{
                      url
                  }
                  trackday {
                      name
                      trackdayItems {
                          id
                          name
                          trackday_name
                          available_bookings
                          is_bookable
                          date_start
                          time_start
                          variant {
                              name
                              location {
                                  name
                              }
                          }
                      }
                  }
              }
          }
      `,{external_id: snippet_external_id})
      this.isFetching = loading
      watch(result, (newValue) => {
        if (newValue) {
          this.snippet = newValue
        }
      })

      if (error.value) {
        console.error('Error fetching data:', error.value)
      }
    }
  }
})
