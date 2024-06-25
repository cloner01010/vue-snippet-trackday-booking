<script>

import BookingSummary from '@/components/BookingSummary.vue'
import { storeToRefs } from 'pinia'
import { useWizardStore } from '@/stores/wizard.js'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { last } from 'eslint-plugin-vue/lib/utils/indent-utils.js'

export default{
  components: { BookingSummary },
  props: {
    participantId: {
      type: String,
      required: true
    },
    bookingId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
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
    const {locale} = useI18n()
    const wStore = useWizardStore()
    onMounted(()=>{
      locale.value = props.lang
      wStore.fetchParticipant(props.eventID, props.participantId, props.bookingId, props.userId)
    })
    return {
      wStore,

      ...props
    }
  }
}
</script>

<template>
  <div class="spinner" v-if="wStore.participantDataIsLoading">
    <v-progress-circular size="70" color="green" indeterminate></v-progress-circular>
  </div>
  <v-container class="w-container" theme="dark" v-else>
    <v-row justify="center"
    ><h1 class="main-heading">{{ wStore?.getTrackdayItem?.name }}</h1></v-row
    >
    <v-row justify="center"
    ><h1 class="main-heading">{{`${$t('bookingSuccessMsg') } (no. pgm_${bookingId})`}}</h1></v-row>

    <v-row class="wizard-row" justify="center">
      <v-col class="wizard-container" xl="9" lg="8" md="7" sm="12" xs="12">
        <v-sheet color="transparent" class="wizard-sheet" theme="dark">
                <confirmation-page :booking-id="bookingId" :event-id="eventID"
                                   :participant-id="participantId"
                                   :user-id="userId" :action="false"></confirmation-page>

        </v-sheet>
      </v-col>
      <v-col xl="3" lg="4" md="5" sm="12" xs="12" class="wizard-summary">
        <booking-summary :event-i-d="eventID" :sid="sid"></booking-summary>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
h3{
  color: var(--secondary-color);
}
</style>