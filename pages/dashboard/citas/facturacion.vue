<template>
    <div class="BillingAppointmentsList">
        <DataGridBillingAppointments />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridBillingAppointments from '@/components/utils/BillingAppointments/DataGridBillingAppointments.vue';

export default defineComponent({
    name: 'BillingAppointmentsListView',
    components: { DataGridBillingAppointments }
});
</script>

<style scoped></style>



