<template>
    <div class="BillingLaboratoriesList">
        <DataGridBillingLaboratories />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridBillingLaboratories from '@/components/utils/BillingLaboratories/DataGridBillingLaboratories.vue';

export default defineComponent({
    name: 'BillingLaboratoriesListView',
    components: { DataGridBillingLaboratories }
});
</script>

<style scoped></style>



