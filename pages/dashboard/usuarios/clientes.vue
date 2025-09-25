<template>
  <div class="UserListClient">
    <DataGridClient />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridClient from '@/components/utils/user/client/DataGridClient.vue';

definePageMeta({
  title: 'Usuarios -> Clientes'
})

export default defineComponent({
  name: 'ClientListView',
  components: { DataGridClient }
});
</script>

<style scoped></style>