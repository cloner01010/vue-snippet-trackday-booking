<script>


import { onBeforeMount, onMounted } from 'vue'

import { useWizardStore } from '@/stores/wizard.js'


export default {
  props: {
    action: {
      type: Boolean,
      required: true
    },
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
    eventId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const wizardStore = useWizardStore()

    const { previousStep, nextStep } = wizardStore

    onMounted(() => {
      wizardStore.fetchParticipant(props.eventId, props.participantId, props.bookingId, props.userId)
    })

    return {
      wizardStore,
      previousStep,
      nextStep,
      ...props
    }
  }
}
</script>

<template>
  <div class="spinner" v-if="wizardStore.participantDataIsLoading">
    <v-progress-circular size="70" color="green" indeterminate></v-progress-circular>
  </div>
  <v-container v-else>
    <v-row xl="12" md="12" sm="6"><h3>{{ $t('participantDetails') }}</h3></v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-text-field  variant="solo" :label="$t('firstname')" readonly flat
                      :model-value="wizardStore.getParticipant.address.firstname"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" :label="$t('lastname')" readonly flat
                      :model-value="wizardStore.getParticipant.address.lastname"></v-text-field>
      </v-col>
    </v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-text-field variant="solo" :label="$t('street')" readonly flat
                      :model-value="wizardStore.getParticipant.address.street"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" :label="$t('streetNumber')" readonly flat
                      :model-value="wizardStore.getParticipant.address.number"></v-text-field>
      </v-col>
    </v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-text-field variant="solo" :label="$t('zip')" readonly flat
                      :model-value="wizardStore.getParticipant.address.zip"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" :label="$t('city')" readonly flat
                      :model-value="wizardStore.getParticipant.address.city"></v-text-field>
      </v-col>
    </v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-text-field variant="solo" :label="$t('phone')" readonly flat
                      :model-value="wizardStore.getParticipant.address.phone"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" :label="$t('email')" readonly flat
                      :model-value="wizardStore.getParticipant.address.email"></v-text-field>
      </v-col>
    </v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-text-field variant="solo" :label="$t('country')" readonly flat
                      :model-value="wizardStore.getParticipant.address.country.name"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" :label="$t('language')" readonly flat
                      :model-value="wizardStore.getParticipant.user.lang"></v-text-field>
      </v-col>
    </v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-textarea variant="solo" :label="$t('additional')" readonly flat
                    :model-value="wizardStore.getParticipant.address.additional1"></v-textarea>
      </v-col>
    </v-row>
    <v-row xl="12" md="12" sm="6"><h3>{{ $t('invoiceAddress') }}</h3></v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-text-field variant="solo" :label="$t('companyName')" readonly flat
                      :model-value="wizardStore.getParticipant.invoice_address.company_name"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" :label="$t('vatNumber')" readonly flat
                      :model-value="wizardStore.getParticipant.invoice_address.vat"></v-text-field>
      </v-col>
    </v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-text-field variant="solo" :label="$t('firstname')" readonly flat
                      :model-value="wizardStore.getParticipant.invoice_address.firstname"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" :label="$t('lastname')" readonly flat
                      :model-value="wizardStore.getParticipant.invoice_address.lastname"></v-text-field>
      </v-col>
    </v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-text-field variant="solo" :label="$t('street')" readonly flat
                      :model-value="wizardStore.getParticipant.invoice_address.street"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" :label="$t('streetNumber')" readonly flat
                      :model-value="wizardStore.getParticipant.invoice_address.number"></v-text-field>
      </v-col>
    </v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-text-field variant="solo" :label="$t('zip')" readonly flat
                      :model-value="wizardStore.getParticipant.invoice_address.zip"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" :label="$t('city')" readonly flat
                      :model-value="wizardStore.getParticipant.invoice_address.city"></v-text-field>
      </v-col>
    </v-row>
    <v-row xl="12" md="12" sm="6">
      <v-col>
        <v-text-field density="compact" variant="solo" :label="$t('country')" readonly flat
                      :model-value="wizardStore.getParticipant.invoice_address.country.name"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field variant="solo" :label="$t('email')" readonly flat
                      :model-value="wizardStore.getParticipant.invoice_address.email"></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="action" justify="space-between" class="action-btn">
      <v-col color="green" class="back-btn" cols="3">
        <v-btn @click="previousStep()" :text="$t('back')" variant="elevated" rounded="lg" size="x-large"
               color="#d5d5d5"></v-btn>
      </v-col>
      <v-col color="#57ab27" class="next-btn" cols="3">
        <v-btn @click="nextStep" :text="$t('gotoPayment')" variant="elevated" rounded="lg" size="x-large"
                color="#57ab27"></v-btn>
      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>

</style>