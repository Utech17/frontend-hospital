<template>
    <div class="UserListSupplier">
        <Default page-title="Listado de Proveedores">
            <DataGridSupplier />
        </Default>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Default from '~/layouts/default.vue';
import DataGridSupplier from '@/components/utils/user/supplier/DataGridSupplier.vue';
import authGuard from '~/mixins/authGuard';

export default defineComponent({
    name: 'UserListSupplierView',
    components: { Default, DataGridSupplier },
    mixins: [authGuard as any],
});
</script>

<style scoped></style>