<template>
  <div class="StoreList">
    <DataGridStore /> 
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridStore from '@/components/utils/products/DataGridStore.vue';

definePageMeta({
title: 'Almacen -> Productos'
})

export default defineComponent({
  name: 'StoreProductsListView',
  components: { DataGridStore },
});
</script>

<style scoped>
</style>