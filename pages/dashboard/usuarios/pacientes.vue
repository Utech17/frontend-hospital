<template>
  <div class="UserListPatient">
    <DataGridPatient />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridPatient from '@/components/utils/user/patient/DataGridPatient.vue';

definePageMeta({
  title: 'Usuarios -> Pacientes'
})

export default defineComponent({
  name: 'UserListPatientView',
  components: { DataGridPatient }
});
</script>