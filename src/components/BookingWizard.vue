<script>
import { useWizardStore } from '@/stores/wizard.js'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSnippetStore } from '@/stores/SnippetStore.js'
import ContactInfo from '@/components/ContactInfo.vue'
import { storeToRefs } from 'pinia'


export default {
  name: 'BookingWizard',
  components: { ContactInfo },
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
    const snippetStore = useSnippetStore()
    const {currentStep}  = storeToRefs(wizardStore)
    const {participantId, userId, bookingId} = storeToRefs(wizardStore)

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    }
    const price = computed(()=>{
      return wizardStore.getPrice + ' ' + wizardStore.getCurrency
    })

    const formattedNumber = computed(() => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format();
    });

    onMounted(() => {
      snippetStore.fetch(props.sid)
      wizardStore.fetchTrackdayEvent(props.eventID)
      locale.value = props.lang
    })
    return {
      participantId,
      userId,
      bookingId,
      currentStep,
      snippetStore,
      wizardStore,
      formatDate,
      ...props,
      formattedNumber,
      price
    }
  }
}
</script>

<template>
  <div class="spinner" v-if="wizardStore.isFetching">
    <v-progress-circular size="70" color="green" indeterminate></v-progress-circular>
  </div>
  <v-container theme="dark" v-else>
    <v-row justify="center"
    ><h1 class="main-heading">{{ wizardStore?.getTrackdayItem?.name }}</h1></v-row
    >
    <v-row class="wizard-row" justify="center">
      <v-col class="wizard-container" xl="9" lg="8" md="7" sm="12" xs="12">
        <v-sheet color="transparent" class="wizard-sheet">
          <v-stepper v-model="currentStep" theme="dark" class="stepper">
              <v-stepper-header class="wizard-header">
                <template v-for="(step, index) in wizardStore.getWizardSteps" :key="index">
                  <v-divider v-if="index"></v-divider>
                  <v-stepper-item :title="$t(step)" :value="index + 1"></v-stepper-item>
                </template>
                <template v-if="snippetStore.getSnippet?.has_payment">
                  <v-divider></v-divider>
                  <v-stepper-item
                    :title="$t('payment')"
                    :value="wizardStore.getWizardSteps.length + 1"
                  ></v-stepper-item>
                </template>
              </v-stepper-header>
              <v-stepper-window>
                <v-stepper-window-item :value="1">
                  <contact-info></contact-info>
                </v-stepper-window-item>

                <v-stepper-window-item
                  v-if="wizardStore.getWizardSteps.includes('addVehicle')"
                  :value="2"
                >
                  <v-card color="grey-lighten-1" height="200">
                    {{participantId}} <br>
                    {{userId}}<br>
                    {{bookingId}}
                  </v-card>
                </v-stepper-window-item>

                <v-stepper-window-item
                  v-if="wizardStore.getWizardSteps.includes('addService')"
                  :value="wizardStore.getWizardSteps.indexOf('addService') + 1"
                >
                  <v-card color="grey-lighten-1" height="200"> add service</v-card>
                </v-stepper-window-item>
                <v-stepper-window-item
                  v-if="wizardStore.getWizardSteps.includes('redeemVoucher')"
                  :value="wizardStore.getWizardSteps.indexOf('redeemVoucher') + 1"
                >
                  <v-card color="grey-lighten-1" height="200"> Voucher</v-card>
                </v-stepper-window-item>
                <v-stepper-window-item
                  v-if="wizardStore.getWizardSteps.includes('confirmation')"
                  :value="wizardStore.getWizardSteps.indexOf('confirmation') + 1"
                >
                  <v-card color="grey-lighten-1" height="200"> confirmation</v-card>
                </v-stepper-window-item>
                <v-stepper-window-item
                  :value="wizardStore.getWizardSteps.length + 1"
                  v-if="snippetStore.getSnippet?.has_payment"
                >
                  <v-card color="grey-lighten-1" height="200">Payment</v-card>
                </v-stepper-window-item>
              </v-stepper-window>
          </v-stepper>
        </v-sheet>
      </v-col>
      <v-col xl="3" lg="4" md="5" sm="12" xs="12" class="wizard-summary">
        <v-sheet class="infobox px-3 py-4" rounded="true">
          <div class="infobox-trackday-name">
            <h4 class="pa-0">{{ wizardStore.getTrackdayItem?.trackday_name }}</h4>
          </div>

          <div class="infobox-row infobox-trackday-date mx-1 py-4">
            <font-awesome-icon :icon="['far', 'calendar-days']" style="color: #ffffff" />
            <span class="mx-2">
              {{ formatDate(wizardStore.getTrackdayItem?.date_start) }} -
              {{ formatDate(wizardStore.getTrackdayItem?.date_end) }}</span
            >
          </div>
          <div class="infobox-trackday-event-name">
            <h4 class="pa-0">{{ wizardStore.getTrackdayItem?.name }}</h4>
          </div>
          <ul class="pt-4">
            <li class="infobox-list-item infobox-price-item">
              <div class="infobox-list-item-label infobox-price-item-label">{{ $t('price') }}</div>
              <div class="infobox-list-item-value infobox-price-item-value">
                {{ price }}
              </div>
            </li>

            <!-- <span id="serviceSection" style="display: none"></span>
            <span id="couponSection" style="display: none"></span>
            -->
            <!-- <li class="infobox-list-item infobox-total-item" id="totalPrice">
              <div class="infobox-list-item-label infobox-total-item-label">Gesamt</div>
              <div class="infobox-list-item-value infobox-total-item-value">
                <span id="totalPriceValue">1.000,00</span>
                <span>€</span>
              </div>
            </li>
          --></ul>
          <div id="vatFooterNote " class="vatFooterNote">
            {{ $t('vatFooterNote')}}
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.wizard-container{
  overflow: visible;
}
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

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.v-stepper-item {
  color: var(--txt-color) !important;
}

.v-stepper-item--selected {
  color: var(--primary-color) !important;
}

.main-heading {
  padding: 24px;
}
.infobox{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.wizard-summary{
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  margin-top: 0;
}

.wizard-summary .infobox {
  background-color: var(--primary-color) !important;
}

.infobox-trackday-date {
  color: var(--txt-color);
  font-size: 0.875rem;
}

.infobox-trackday-event-name {
  color: var(--txt-color);
}

.infobox-trackday-name {
  color: var(--txt-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.infobox ul {
  color: var(--txt-color);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--infobox-element-gap);
}

.infobox-list-item {
  font-size: 0.875rem;
  color: var(--txt-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vatFooterNote{
  margin-top: auto;
  font-style: italic;
  color: var(--txt-color);
  font-size: 1rem;
}
</style>
