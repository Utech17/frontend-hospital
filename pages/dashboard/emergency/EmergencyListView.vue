<template>
    <div class="EmergencyListView">
        <Default page-title="Emergencias">
            <DataGridEmergency /> <!-- Este es el componente hijo que se pasará al slot -->
        </Default> <!-- Asegúrate de que este componente esté en el template -->
    </div>
  </template>
  
    <script lang="ts">
    import { defineComponent } from 'vue';
    import Default from '~/layouts/default.vue';
    import DataGridEmergency from '@/components/utils/emergency/DataGridEmergency.vue'; // Asegúrate de que la ruta y el nombre del archivo sean correctos

    export default defineComponent({
        name: 'EmergencyListView',
        components: { Default, DataGridEmergency },
    });
    </script>
  
  <style scoped>
  </style>
  