<template>
  <div class="PharmacyInventory">
    <Default page-title="Listado de Medicamentos > Inventario">
      <DataGridMedicine />
      <!-- Este es el componente hijo que se pasará al slot -->
    </Default>
    <!-- Usa Default como estructura principal -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Default from '~/layouts/default.vue';
import DataGridMedicine from '@/components/utils/pharmacy/DataGridMedicine.vue'; // Asegúrate de crear y registrar este componente

export default defineComponent({
  name: 'PharmacyInventoryView',
  components: { Default, DataGridMedicine },
});
</script>

<style scoped>
/* ... otros estilos ... */

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

