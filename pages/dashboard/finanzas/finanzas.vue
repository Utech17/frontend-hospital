<template>
  <div class="Finance">
    <DataGridFinance />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridFinance from '@/components/utils/finance/DataGridFinance.vue';



export default defineComponent({
  name: 'FinanceView',
  components: { DataGridFinance }
});
</script>

<style scoped>

</style>