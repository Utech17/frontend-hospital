<template>
    <div class="BuyListRequest">
        <DataGridBuyRequest />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridBuyRequest from '@/components/utils/BuyRequest/DataGridBuyRequest.vue';

definePageMeta({
  title: 'Finanzas -> Compras -> Solicitudes de Compras'
})

export default defineComponent({
    name: 'BuyListView',
    components: {
        DataGridBuyRequest,
    },
});
</script>

<style scoped></style>