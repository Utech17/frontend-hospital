<template>
    <div class="EmergencyListView">
        <DataGridEmergency />
    </div>
  </template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import Default from '~/layouts/default.vue';
import DataGridEmergency from '@/components/utils/emergency/DataGridEmergency.vue';

definePageMeta({
title: 'Emergencias'
})

export default defineComponent({
    name: 'EmergencyListView',
    components: { Default, DataGridEmergency },
});
</script>

<style scoped>
</style>
  