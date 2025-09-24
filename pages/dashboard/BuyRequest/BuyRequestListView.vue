<template>
    <div class="BuyListRequest">
        <Default page-title="Solicitudes de Compras">
            <DataGridBuyRequest />
        </Default>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Default from '~/layouts/default.vue';
import DataGridBuyRequest from '@/components/utils/BuyRequest/DataGridBuyRequest.vue';
import authGuard from '~/mixins/authGuard';

export default defineComponent({
    name: 'BuyListView',
    components: {
        Default,
        DataGridBuyRequest,
    },
    mixins: [authGuard],
});
</script>

<style scoped></style>