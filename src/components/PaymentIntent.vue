<template>
  <v-container>
    <form id="payment-form" class="w-100">
    <v-row class="mb-6">
      <div style="width: 100%;" id="payment-element"></div>
    </v-row>
    <v-row justify="center">
      <v-btn id="submit" @click="pay" :text="$t('payNow')" variant="elevated" rounded="lg" size="x-large"
             color="#57ab27"></v-btn>
    </v-row>
    </form>
    <v-row>
      <v-btn @click="previousStep()" :text="$t('back')" variant="elevated" rounded="lg" size="x-large"
             color="#d5d5d5"></v-btn>
    </v-row>

  </v-container>


</template>

<script>


import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '@/stores/wizard.js'

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
    },
    sid: {
      type: String,
      required: true
    },

  },
  setup(props) {
    const {locale} = useI18n()
    const wizardStore = useWizardStore()
    const {previousStep} = wizardStore
    const appearance = {
      theme: 'night',
      labels: 'floating',
      variables: {
        colorPrimary: getComputedStyle(document.documentElement)
          .getPropertyValue('--stripe-primary-color'),
        colorBackground: getComputedStyle(document.documentElement)
          .getPropertyValue('--stripe-input-background-color'),
        colorText: getComputedStyle(document.documentElement)
          .getPropertyValue('--stripe-text-color'),
        borderRadius: getComputedStyle(document.documentElement)
          .getPropertyValue('--stripe-border-radius'),
        fontFamily: getComputedStyle(document.documentElement)
          .getPropertyValue('--stripe-font-family'),

      },
    };
    const stripeKey = ref('pk_test_e4wtZSZOABPer3wrFCwB9J0g') // test key
    const stripe = Stripe(stripeKey.value);
    const elements = stripe.elements({
      clientSecret: "pi_3PVX0lESvnAiMlQ61FuLYFfU_secret_dUwqLBwEaaTfgVTVPJojmSO2U",
      appearance,
      locale: locale.value
    });

    onMounted(() =>{

      const paymentElement = elements.create("payment");
      paymentElement.mount("#payment-element");
    })

    const pay = async () => {
      const {
        error,
      } = await stripe.confirmPayment({
        elements,
        //redirect: 'if_required',
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}/trackdays/${props.eventId}/participant/${props.participantId}/booking/${props.bookingId}/user/${props.userId}/success/${locale.value}?sid=${props.sid}`,
        },
      });
    }

    return {
      previousStep,
      pay

    }
  }
}
</script>