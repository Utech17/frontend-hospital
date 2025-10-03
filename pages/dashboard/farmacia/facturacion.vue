<template>
  <div class="DataGridbilling">
    <DataGridbilling /> 
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridbilling from '@/components/utils/pharmacy/DataGridbilling.vue';

definePageMeta({
  title: 'Farmacia -> Facturación',
  //requiresAuth: true
})

export default defineComponent({
  name: 'BillingView',
  components: {
    DataGridbilling,
  },
});
</script>

<style scoped></style>