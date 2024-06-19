<script>


import { useWizardStore } from '@/stores/wizard.js'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSnippetStore } from '@/stores/SnippetStore.js'

export default {
  name: 'BookingWizard',
  props: {
    lang: {
      type: String,
      required: true
    },
    sid: {
      type: String,
      required: true
    },
    eventID: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { locale } = useI18n()
    const wizardStore = useWizardStore()
    const wizardSteps = wizardStore.getWizardSteps
    const snippetStore = useSnippetStore()


    onMounted(() => {
      snippetStore.fetch(props.sid)
      wizardStore.fetchTrackdayEvent(props.eventID)
      locale.value = props.lang
    })
    return {
      snippetStore,
      wizardStore,
      wizardSteps,
      ...props
    }
  }


}
</script>

<template>
  <div class="spinner" v-if="wizardStore.isFetching">
    <v-progress-circular size="70" color="green" indeterminate></v-progress-circular>
  </div>
  <v-container v-else>
    <v-row justify="center"><h1 class="main-heading">{{ wizardStore?.getTrackdayItem?.name }}</h1></v-row>
    <v-row class="wizard-row" justify="center">
      <v-col lg="9" md="8" sm="8" xs="12">
        <v-sheet class="wizard-sheet">
          <v-stepper>
            <v-stepper-header>
              <template v-for="(step,index) in wizardStore.getWizardSteps" :key="index">
                <v-divider v-if="index"></v-divider>

                <v-stepper-item :title="$t(step)" :value="index+1"></v-stepper-item>
              </template>
              <template v-if="snippetStore.getSnippet?.has_payment">
                <v-divider></v-divider>

                <v-stepper-item :title="$t('payment')" :value="wizardStore.getWizardSteps.length +1"></v-stepper-item>
              </template>
            </v-stepper-header>
          </v-stepper>
        </v-sheet>
      </v-col>
      <v-col lg="3" md="4" sm="4" xs="12" class="summary-test">
        <v-sheet>
          TEST
        </v-sheet>
      </v-col>
    </v-row>
    <!--v-if--><button data-v-12aa4c13="" class="v-stepper-item v-stepper-item--selected" disabled=""><!----><div class="v-avatar v-theme--light v-avatar--density-default v-avatar--variant-flat v-stepper-item__avatar" style="width: 24px; height: 24px;">1<!----><span class="v-avatar__underlay"></span></div><div class="v-stepper-item__content"><div class="v-stepper-item__title">Teilnehmer Details</div><!----><!----></div></button><hr data-v-12aa4c13="" class="v-divider v-theme--light" aria-orientation="horizontal" role="separator"><button data-v-12aa4c13="" class="v-stepper-item" disabled=""><!----><div class="v-avatar v-theme--light v-avatar--density-default v-avatar--variant-flat v-stepper-item__avatar" style="width: 24px; height: 24px;">2<!----><span class="v-avatar__underlay"></span></div><div class="v-stepper-item__content"><div class="v-stepper-item__title">Fahrzeug</div><!----><!----></div></button><hr data-v-12aa4c13="" class="v-divider v-theme--light" aria-orientation="horizontal" role="separator"><button data-v-12aa4c13="" class="v-stepper-item" disabled=""><!----><div class="v-avatar v-theme--light v-avatar--density-default v-avatar--variant-flat v-stepper-item__avatar" style="width: 24px; height: 24px;">3<!----><span class="v-avatar__underlay"></span></div><div class="v-stepper-item__content"><div class="v-stepper-item__title">Zusatzleistungen</div><!----><!----></div></button><hr data-v-12aa4c13="" class="v-divider v-theme--light" aria-orientation="horizontal" role="separator"><button data-v-12aa4c13="" class="v-stepper-item" disabled=""><!----><div class="v-avatar v-theme--light v-avatar--density-default v-avatar--variant-flat v-stepper-item__avatar" style="width: 24px; height: 24px;">4<!----><span class="v-avatar__underlay"></span></div><div class="v-stepper-item__content"><div class="v-stepper-item__title">Gutschein einlösen</div><!----><!----></div></button><hr data-v-12aa4c13="" class="v-divider v-theme--light" aria-orientation="horizontal" role="separator"><button data-v-12aa4c13="" class="v-stepper-item" disabled=""><!----><div class="v-avatar v-theme--light v-avatar--density-default v-avatar--variant-flat v-stepper-item__avatar" style="width: 24px; height: 24px;">5<!----><span class="v-avatar__underlay"></span></div><div class="v-stepper-item__content"><div class="v-stepper-item__title">Bestätigen</div><!----><!----></div></button><hr data-v-12aa4c13="" class="v-divider v-theme--light" aria-orientation="horizontal" role="separator"><button data-v-12aa4c13="" class="v-stepper-item" disabled=""><!----><div class="v-avatar v-theme--light v-avatar--density-default v-avatar--variant-flat v-stepper-item__avatar" style="width: 24px; height: 24px;">6<!----><span class="v-avatar__underlay"></span></div><div class="v-stepper-item__content"><div class="v-stepper-item__title">Zahlung</div><!----><!----></div></button>

  </v-container>

</template>

<style scoped>


@media (min-width: 992px) {
  .wizard-row {
    max-width: 960px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (min-width: 1200px) {
  .wizard-row {
    max-width: 1140px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (min-width: 1400px) {
  .wizard-row {
    max-width: 1320px;
    margin-left: auto;
    margin-right: auto;

  }
}

@media (max-width: 600px) {
  .wizard-row {
    flex-direction: column;
    align-items: center;
  }
}
.wizard-row{
  background: transparent;
}
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Ensure it takes the full viewport height */
}
.v-theme--light{
  background: transparent;
}
.v-stepper-item--selected{
  color: var(--primary-color);
}
.v-stepper-item--selected  
.main-heading {
  padding: 24px;
}
</style>