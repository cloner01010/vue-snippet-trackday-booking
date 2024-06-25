<script>

import { onMounted, ref } from 'vue'
import { useWizardStore } from '@/stores/wizard.js'
import { storeToRefs } from 'pinia'


export default {
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
   eventId: {
     type: String,
     required: true
   }
 },
  setup(props) {
    const form = ref()
    const wizardStore = useWizardStore()
    const {couponInput, redeemedCoupons}= storeToRefs(wizardStore)

    const { previousStep, nextStep } = wizardStore
    const redeem = async () => {
      couponInput.value.trackday_item_id = props.eventId
      couponInput.value.participant_id = props.participantId
      couponInput.value.booking_id = props.bookingId
      couponInput.value.user_id = props.userId
      await wizardStore.redeemCoupons()

    }
    return {
      wizardStore,
      redeemedCoupons,
      redeem,
      couponInput,
      form,
      previousStep,
      nextStep
    }
  }
}
</script>

<template>
<v-form class="form">

 <v-container>

   <v-row>
       <v-text-field v-model="couponInput.code" :label="$t('coupon')" variant="outlined" color="#57ab27">
         <template v-slot:append-inner>
           <v-btn :loading="wizardStore.isRedeeming" @click="redeem" class="apply-btn" :text="$t('apply')" variant="elevated" rounded="lg" size="large"
                  color="#57ab27">
             <template v-slot:loader>
               <v-progress-circular
                 color="white"
                 indeterminate
               ></v-progress-circular>
             </template>
           </v-btn>
         </template>
       </v-text-field>
   </v-row>
   <v-row justify="space-between" class="action-btn">
     <v-col color="green" class="back-btn" cols="2">
       <v-btn @click="previousStep()" :text="$t('back')" variant="elevated" rounded="lg" size="x-large"
              color="#d5d5d5"></v-btn>
     </v-col>
     <v-col @click="nextStep()" color="#57ab27" class="next-btn" cols="2">
       <v-btn :text="$t('next')" variant="elevated" rounded="lg" size="x-large"
              color="#57ab27"></v-btn>
     </v-col>
   </v-row>

  </v-container>
</v-form>
</template>

<style scoped>
.action-btn{
  margin-top : 120px;
}
.apply-btn{
  min-width: 150px;
  height: var(--button-height);
}
</style>