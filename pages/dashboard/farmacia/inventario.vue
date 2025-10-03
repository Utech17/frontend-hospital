<template>
  <div class="PharmacyInventory">
    <DataGridMedicine />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridMedicine from '@/components/utils/pharmacy/DataGridMedicine.vue';

definePageMeta({
title: 'Farmacia -> Inventario'
})

export default defineComponent({
  name: 'PharmacyInventoryView',
  components: {  DataGridMedicine },
});
</script>

<style scoped>
.dropdown-menu {
  min-width: 160px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: 1px solid #f5f9fb;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  color: #333;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.text-danger:hover {
  background-color: #fff5f5;
}

.btn-link {
  color: #333;
}

.btn-link:hover {
  color: #2d60ff;
}
</style>

