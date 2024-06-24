<script>
import { useMotoDBStore } from '@/stores/motoDB.js'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWizardStore } from '@/stores/wizard.js'
import requiredFields from '@/rules.js'

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
    const motoDBStore = useMotoDBStore()
    const wizardStore = useWizardStore()
    const typesSelect = computed(() => motoDBStore.getTypesSelect)
    const makesSelect = computed(() => motoDBStore.getMakesSelect)
    const modelsSelect = computed(() => motoDBStore.getModelsSelect)
    const yearsSelect = computed(() => motoDBStore.getYearsSelect)
    const { vehicleInput } = storeToRefs(motoDBStore)
    const { fetchMakes, fetchModels } = motoDBStore
    const {previousStep, nextStep } = wizardStore
    const requiredFieldRules = requiredFields
    onMounted(() => {
      motoDBStore.fetchTypes()
    })
    const submitForm = async () => {
      try {
        const { valid } = await form.value.validate()
        if(valid){
          vehicleInput.value.user_id = props.userId
          vehicleInput.value.booking_id = props.bookingId
          vehicleInput.value.trackday_item_id = props.eventId
          vehicleInput.value.participant_id = props.participantId
          motoDBStore.addVehicle()
          nextStep()
        }
      } catch (e) {
        console.error(e)
      }

    }
    return {
      form,
      requiredFieldRules,
      submitForm,
      previousStep,
      yearsSelect,
      motoDBStore,
      modelsSelect,
      typesSelect,
      fetchModels,
      vehicleInput,
      fetchMakes,
      makesSelect
    }
  }
}
</script>

<template>
  <v-form @submit.prevent="submitForm" ref="form">
    <v-container>
      <v-row>
        <v-col xl="6" md="6" sm="12">
          <v-autocomplete :label="$t('type')" :loading="motoDBStore.loadingTypes" @update:model-value="fetchMakes"
                          v-model="vehicleInput.type_id"
                          :items="typesSelect" variant="outlined" color="#57ab27" :rules="[requiredFieldRules($t('type'))]"></v-autocomplete>
        </v-col>
        <v-col xl="6" md="6" sm="12">
          <v-autocomplete :label="$t('make')" :loading="motoDBStore.loadingMakes" @update:model-value="fetchModels"
                          :items="makesSelect"
                          v-model="vehicleInput.make_id" variant="outlined" color="#57ab27" :rules="[requiredFieldRules($t('make'))]"></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col xl="6" md="6" sm="12">
          <v-autocomplete :label="$t('model')" :loading="motoDBStore.loadingModels" :items="modelsSelect"
                          v-model="vehicleInput.model_id" variant="outlined"
                          color="#57ab27" :rules="[requiredFieldRules($t('model'))]"></v-autocomplete>
        </v-col>
        <v-col xl="6" md="6" sm="12">
          <v-autocomplete :label="$t('constructionYear')" :items="yearsSelect" v-model="vehicleInput.year_construction" variant="outlined"
                          color="#57ab27"></v-autocomplete>
        </v-col>
      </v-row>

      <v-row justify="space-between">
        <v-col color="green" class="back-btn" cols="2">
          <v-btn @click="previousStep" :text="$t('back')" variant="elevated" rounded="lg" size="x-large"
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

</style>