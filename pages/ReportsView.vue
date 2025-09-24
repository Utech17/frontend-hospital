<template>
    <div class="DataGridbilling container mt-5">
        <h5>Libro Diario, Estado de Cuenta, Balance General</h5>

        <form @submit.prevent="generateReport">
            <div class="form-container">
                <div>
                    <label for="time1">Fecha Desde</label>
                    <input type="date" id="time1" v-model="dates.startDate" required class="form-control input-time">
                </div>
                <div>
                    <label for="time2">Fecha Hasta</label>
                    <input type="date" id="time2" v-model="dates.endDate" required class="form-control input-time">
                </div>
                <button type="submit" class="button-time btn btn-primary" :disabled="isLoading">
                    {{ isLoading ? 'Generando...' : 'Generar Excel' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
    name: 'ReportsViewRoot',
    setup() {
        const dates = reactive({ startDate: '', endDate: '' });
        const isLoading = false;
        return { dates, isLoading };
    },
});
</script>

<style scoped>
.title {
    text-align: left;
}

.form-container {
    display: flex;
    gap: 16px;
    align-items: end;
}

.input-time {
    width: 220px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.button-time {
    width: 220px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}
</style>