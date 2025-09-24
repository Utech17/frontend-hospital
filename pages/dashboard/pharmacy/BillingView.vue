<template>
    <div class="DataGridbilling">
        <Default page-title="Farmacia > Facturación">
            <DataGridbilling /> <!-- Este es el componente hijo que se pasará al slot -->
        </Default> 
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Default from '~/layouts/default.vue';
import DataGridbilling from '@/components/utils/pharmacy/DataGridbilling.vue';

export default defineComponent({
    name: 'BillingView',
    components: {
        Default,
        DataGridbilling,
    },
});
</script>

<style scoped></style>