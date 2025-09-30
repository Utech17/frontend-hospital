<template>
  <div class="ListAppointments">
    <DataGridAppointments />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridAppointments from '@/components/utils/appointments/DataGridAppointments.vue';

definePageMeta({
  title: 'Citas'
})

export default defineComponent({
  name: 'AppointmentsListView',
  components: { DataGridAppointments }
});
</script>

<style scoped>

</style>