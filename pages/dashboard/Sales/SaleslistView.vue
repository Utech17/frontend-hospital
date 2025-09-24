<template>
    <div class="SalesList">
        <Default page-title="Ventas">
            <DataGridSales 
                :sales="salesData" 
                :clients="clientData"  
                :products="productsData" 
                :patients="patientsData" 
                :payments="paymentData"
                @sale-added="loadSalesData"
            />
        </Default>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Default from '~/layouts/default.vue';
import DataGridSales from '@/components/utils/Sales/DataGridSales.vue';
import authGuard from '~/mixins/authGuard';

export default defineComponent({
    name: 'SalesListView',
    components: {
        Default,
        DataGridSales,
    },
    mixins: [authGuard],
    data() {
        return {
            salesData: [],
            clientData: [],
            productsData: [],
            patientsData: [],
            paymentData: []
        }
    },
    async mounted() {
        await (this as any).loadAllData?.();
    },
    methods: {
        async loadAllData() {
            await Promise.all([
                // this.loadSalesData(),
                // this.loadClientData(),
                // this.loadProductData(),
                // this.loadPatientData(),
                // this.loadPaymentData()
            ]);
        }
    }
});
</script>

<style scoped></style>