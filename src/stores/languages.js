import { defineStore } from 'pinia'


export const useLanguagesStore = defineStore('languages', {
  state: () => ({
    data:[
      {
        title:"Deutsch",
        value:"de",
        lang:"de",
      },
      {
        title:"Englisch",
        value:"en",
        lang:"de",
      },
      {
        title:"German",
        value:"de",
        lang:"en",
      },
      {
        title:"English",
        value:"en",
        lang:"en",
      }
    ],
  }),
  getters: {
    getLanguagesByLang: (state) => (lang) => {
      return state.data
        .filter(item => item.lang === lang)
        .map(item => ({
          title: item.title,
          value: item.value,
        }));
    }
  },
  actions: {

  }
})
