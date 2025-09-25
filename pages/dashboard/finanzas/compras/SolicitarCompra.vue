<template>
    <div class="BuyList">
        <DataGridBuy />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridBuy from '~/components/utils/buy/DataGridBuy.vue';

definePageMeta({
  title: 'Finanzas -> Compras -> Solicitar Compra'
})

export default defineComponent({
    name: 'BuyListView',
    components: { DataGridBuy }
});
</script>

<style scoped></style>