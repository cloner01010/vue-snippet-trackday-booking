<script>

import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { useCountriesStore } from '@/stores/countries.js'
import { useLanguagesStore } from '@/stores/languages.js'
import { storeToRefs } from 'pinia'
import { useWizardStore } from '@/stores/wizard.js'
import { useRouter } from 'vue-router'
import requiredFields from '@/rules.js'


export default {
  props: {
    eventID: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const form = ref()
    const { locale } = useI18n()
    const WizardStore = useWizardStore()
    const CountryStore = useCountriesStore()
    const LangStore = useLanguagesStore()
    const countries = computed(() => CountryStore.getCountriesByLang(locale.value))
    const languages = computed(() => LangStore.getLanguagesByLang(locale.value))
    const { contactInfo, isWizardLoading } = storeToRefs(WizardStore)
    const { sendContactInfo, nextStep } = WizardStore
    const router = useRouter()
    const requiredFieldRules = requiredFields
    const goBack = () => {
      router.go(-1)
    }
    const submitForm = async () => {
      try {
        const { valid } = await form.value.validate()
        if(valid){
          contactInfo.value.trackday_item_id = props.eventID
          sendContactInfo()
          nextStep()
        }
      } catch (e) {
        console.error(e)
      }
    }


    onMounted(() => {
      CountryStore.fetch()
    })
    return {
      form,
      requiredFieldRules,
      goBack,
      isWizardLoading,
      submitForm,
      CountryStore,
      countries,
      languages,
      contactInfo
    }
  }
}
</script>

<template>
  <div class="spinner" v-if="isWizardLoading">
    <v-progress-circular size="70" color="green" indeterminate></v-progress-circular>
  </div>
  <v-form v-else @submit.prevent="submitForm" ref="form">
    <v-container>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field :rules="[requiredFieldRules($t('firstname'))]" :label="$t('firstname')"
                        v-model="contactInfo.firstname" variant="outlined"
                        color="#57ab27"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('lastname')" v-model="contactInfo.lastname" variant="outlined"
                        color="#57ab27" :rules="[requiredFieldRules($t('lastname'))]"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('street')" v-model="contactInfo.street" variant="outlined"
                        color="#57ab27" :rules="[requiredFieldRules($t('street'))]"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('streetNumber')" v-model="contactInfo.number" variant="outlined"
                        color="#57ab27" :rules="[requiredFieldRules($t('streetNumber'))]"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('zip')" v-model="contactInfo.zip" variant="outlined" color="#57ab27" :rules="[requiredFieldRules($t('zip'))]"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('city')" v-model="contactInfo.city" variant="outlined"
                        color="#57ab27" :rules="[requiredFieldRules($t('city'))]"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6" sm="12">
          <v-autocomplete :label="$t('country')" v-model="contactInfo.country_id" :items="countries" variant="outlined"
                          color="#57ab27" :rules="[requiredFieldRules($t('country'))]"></v-autocomplete>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('phone')" v-model="contactInfo.phone" variant="outlined"
                        color="#57ab27" :rules="[requiredFieldRules($t('phone'))]"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field :label="$t('email')" v-model="contactInfo.email" variant="outlined"
                        color="#57ab27" :rules="[requiredFieldRules($t('email'))]"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-select :label="$t('language')" v-model="contactInfo.lang" :items="languages" variant="outlined"
                    color="#57ab27" :rules="[requiredFieldRules($t('language'))]"></v-select>
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
                          color="#57ab27" :rules="[requiredFieldRules($t('firstname'))]"></v-text-field>
          </v-col>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('lastname')" v-model="contactInfo.invoice_lastname" variant="outlined"
                          color="#57ab27" :rules="[requiredFieldRules($t('lastname'))]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('street')" v-model="contactInfo.invoice_street" variant="outlined"
                          color="#57ab27" :rules="[requiredFieldRules($t('street'))]"></v-text-field>
          </v-col>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('streetNumber')" v-model="contactInfo.invoice_streetNumber" variant="outlined"
                          color="#57ab27" :rules="[requiredFieldRules($t('streetNumber'))]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('zip')" v-model="contactInfo.invoice_zip" variant="outlined"
                          color="#57ab27" :rules="[requiredFieldRules($t('zip'))]"></v-text-field>
          </v-col>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('city')" v-model="contactInfo.invoice_city" variant="outlined"
                          color="#57ab27" :rules="[requiredFieldRules($t('city'))]"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="6" sm="12">
            <v-autocomplete :label="$t('country')" v-model="contactInfo.invoice_country_id" :items="countries"
                            variant="outlined" color="#57ab27" :rules="[requiredFieldRules($t('country'))]"></v-autocomplete>
          </v-col>
          <v-col md="6" sm="12">
            <v-text-field :label="$t('email')" v-model="contactInfo.invoice_email" variant="outlined"
                          color="#57ab27" :rules="[requiredFieldRules($t('email'))]"></v-text-field>
          </v-col>
        </v-row>
      </template>

      <v-row justify="space-between">
        <v-col color="green" class="back-btn" cols="2">
          <v-btn @click="goBack" :text="$t('back')" variant="elevated" rounded="lg" size="x-large"
                 color="#d5d5d5"></v-btn>
        </v-col>
        <v-col color="#57ab27" class="next-btn" cols="2">
          <v-btn  :text="$t('next')" variant="elevated" rounded="lg" type="submit" size="x-large"
                 color="#57ab27"></v-btn>
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