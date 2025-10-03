<template>
  <div class="BillingEmergenciesListView">
    <DataGridBillingEmergencies />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridBillingEmergencies from '@/components/utils/BillingEmergencies/DataGridBillingEmergencies.vue';

definePageMeta({
  title: 'Emergencias -> Facturación',
  //requiresAuth: true
})

export default defineComponent({
    name: 'BillingEmergenciesListView',
    components: {DataGridBillingEmergencies },
});
</script>

<style scoped>
</style>