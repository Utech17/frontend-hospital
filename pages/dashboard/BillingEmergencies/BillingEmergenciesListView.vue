<template>
    <div class="BillingEmergenciesListView">
        <Default page-title="Emergencias > Facturación">
            <DataGridBillingEmergencies /> <!-- Este es el componente hijo que se pasará al slot -->
        </Default> <!-- Asegúrate de que este componente esté en el template -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Default from '~/layouts/default.vue';
import DataGridBillingEmergencies from '@/components/utils/BillingEmergencies/DataGridBillingEmergencies.vue';

export default defineComponent({
    name: 'BillingEmergenciesListView',
    components: { Default, DataGridBillingEmergencies },
});
</script>

<style scoped></style>



