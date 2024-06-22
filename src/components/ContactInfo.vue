<script>

import { useI18n } from 'vue-i18n'
import { computed, onMounted } from 'vue'
import { useCountriesStore } from '@/stores/countries.js'
import { useLanguagesStore } from '@/stores/languages.js'
import { storeToRefs } from 'pinia'
import { useWizardStore } from '@/stores/wizard.js'





export default {

  setup() {
    const { locale } = useI18n()
    const WizardStore = useWizardStore()
    const CountryStore = useCountriesStore()
    const LangStore = useLanguagesStore()
    const countries = computed(() => CountryStore.getCountriesByLang(locale.value))
    const languages = computed(() => LangStore.getLanguagesByLang(locale.value))
    const { contactInfo } = storeToRefs(WizardStore)
    const { sendContactInfo } = WizardStore

    const submitForm =  () => {
      try {
        contactInfo.value.trackday_item_id = 4
        const response = sendContactInfo();
        console.log(response);
      } catch (e) {
        console.error(e);
      }
    };


    onMounted(() => {
      CountryStore.fetch()
    })
    return {
      submitForm,
      CountryStore,
      locale,
      countries,
      languages,
      contactInfo
    }
  }
}
</script>

<template>
  <v-form @submit.prevent>
    <v-container>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('firstname')" v-model="contactInfo.firstname" variant="outlined"
                        color="#57ab27"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('lastname')" v-model="contactInfo.lastname" variant="outlined"
                        color="#57ab27"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('street')" v-model="contactInfo.street" variant="outlined"
                        color="#57ab27"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('streetNumber')" v-model="contactInfo.number" variant="outlined"
                        color="#57ab27"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('zip')" v-model="contactInfo.zip" variant="outlined" color="#57ab27"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('city')" v-model="contactInfo.city" variant="outlined"
                        color="#57ab27"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6" sm="12">
          <v-autocomplete :label="$t('country')" v-model="contactInfo.country_id" :items="countries" variant="outlined"
                          color="#57ab27"></v-autocomplete>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('phone')" v-model="contactInfo.phone" variant="outlined"
                        color="#57ab27"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('email')" v-model="contactInfo.email" variant="outlined"
                        color="#57ab27"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-select :label="$t('language')" v-model="contactInfo.lang" :items="languages" variant="outlined"
                    color="#57ab27"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea :label="$t('additional')" v-model="contactInfo.additional1" variant="outlined" color="#57ab27"
                      density="compact"></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <input class="has-invoice" name="hasInvoice" v-model="contactInfo.diffInvoiceAddress" type="checkbox">
          <label class="has-inovice-label" for="hasInvoice">{{ $t('hasInvoice') }}</label>
        </v-col>
      </v-row>
      <template v-if="contactInfo.diffInvoiceAddress">
        <v-row>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('companyName')" v-model="contactInfo.invoice_company" variant="outlined"
                          color="#57ab27"></v-text-field>
          </v-col>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('vatNumber')" v-model="contactInfo.invoice_vat" variant="outlined"
                          color="#57ab27"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('firstname')" v-model="contactInfo.invoice_firstname" variant="outlined"
                          color="#57ab27"></v-text-field>
          </v-col>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('lastname')" v-model="contactInfo.invoice_lastname" variant="outlined"
                          color="#57ab27"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('street')" v-model="contactInfo.invoice_street" variant="outlined"
                          color="#57ab27"></v-text-field>
          </v-col>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('streetNumber')" v-model="contactInfo.invoice_streetNumber" variant="outlined"
                          color="#57ab27"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('zip')" v-model="contactInfo.invoice_zip" variant="outlined"
                          color="#57ab27"></v-text-field>
          </v-col>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('city')" v-model="contactInfo.invoice_city" variant="outlined"
                          color="#57ab27"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="6" sm="12">
            <v-autocomplete :label="$t('country')" v-model="contactInfo.invoice_country_id" :items="countries"
                            variant="outlined" color="#57ab27"></v-autocomplete>
          </v-col>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('email')" v-model="contactInfo.invoice_email" variant="outlined"
                          color="#57ab27"></v-text-field>
          </v-col>
        </v-row>
      </template>

      <v-row justify="space-between">
        <v-col color="green" class="next-btn" cols="1">
          <v-btn :text="$t('back')" variant="elevated" rounded="lg"></v-btn>
        </v-col>
        <v-col color="#57ab27" class="back-btn" cols="1">
          <v-btn @click="submitForm" :text="$t('next')" variant="elevated" rounded="lg" type="submit"></v-btn>
        </v-col>
      </v-row>

    </v-container>
  </v-form>
</template>

<style scoped>
.has-inovice-label {
  display: inline-block;
  color: var(--txt-color);
}

.has-invoice {
  margin-right: 10px;
  height: 1rem;
  width: 1rem;
}

</style>