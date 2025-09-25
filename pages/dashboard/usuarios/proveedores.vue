<template>
    <div class="UserListSupplier">
            <DataGridSupplier />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridSupplier from '@/components/utils/user/supplier/DataGridSupplier.vue';

definePageMeta({
  title: 'Usuarios -> Proveedores'
})

export default defineComponent({
    name: 'UserListSupplierView',
    components: { DataGridSupplier },
});
</script>

<style scoped></style>