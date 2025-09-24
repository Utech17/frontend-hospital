<template>
  <div class="StoreList">
    <Default page-title="Almacén > Productos">
      <DataGridStore /> <!-- Este es el componente hijo que se pasará al slot -->
    </Default> <!-- Asegúrate de que este componente esté en el template -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Default from '~/layouts/default.vue';
import DataGridStore from '@/components/utils/products/DataGridStore.vue';

export default defineComponent({
  name: 'StoreProductsListView',
  components: { Default, DataGridStore },
});
</script>

<style scoped>

</style>
