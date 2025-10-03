<template>
    <div class="SalesList">
        <DataGridSales 
            :sales="salesData" 
            :clients="clientData"  
            :products="productsData" 
            :patients="patientsData" 
            :payments="paymentData"
            @sale-added="loadSalesData"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataGridSales from '@/components/utils/Sales/DataGridSales.vue';

definePageMeta({
  title: 'Finanzas -> Ventas'
})

export default defineComponent({
    name: 'SalesListView',
    components: {
        DataGridSales,
    },
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