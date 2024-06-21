<script>

import { useI18n } from 'vue-i18n'
import { ref } from 'vue'


export default {

  setup() {
    const { locale } = useI18n()
    const hasInvoiceAddress = ref(false)
    return {
      locale,
      hasInvoiceAddress
    }
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col md="6" sm="12">
        <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
      </v-col>
      <v-col md="6" sm="12">
        <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" sm="12">
        <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
      </v-col>
      <v-col md="6" sm="12">
        <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" sm="12">
        <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
      </v-col>
      <v-col md="6" sm="12">
        <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" sm="12">
        <v-select label="label" variant="outlined" color="#57ab27"></v-select>
      </v-col>
      <v-col md="6" sm="12">
        <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" sm="12">
        <v-select label="label" variant="outlined" color="#57ab27"></v-select>
      </v-col>
      <v-col md="6" sm="12">
        <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea label="label" variant="outlined" color="#57ab27"></v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <input v-model="hasInvoiceAddress" type="checkbox">
        <label>{{ hasInvoiceAddress }}</label>
      </v-col>
    </v-row>
    <template v-if="hasInvoiceAddress">
      <v-row>
        <v-col md="6" sm="12">
          <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6" sm="12">
          <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6" sm="12">
          <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6" sm="12">
          <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6" sm="12">
          <v-select label="label" variant="outlined" color="#57ab27"></v-select>
        </v-col>
        <v-col md="6" sm="12">
          <v-text-field label="label" variant="outlined" color="#57ab27"></v-text-field>
        </v-col>
      </v-row>
    </template>


  </v-container>


</template>

<style scoped>

</style>