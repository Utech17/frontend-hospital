<template>
    <div class="doctorview">
        <Doctor />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Doctor from '@/components/utils/user/doctors/DataGridDoctor.vue';

definePageMeta({
  title: 'Usuarios -> Doctores'
})

export default defineComponent({
    name: 'DoctorView',
    components: { Doctor }
});
</script>

<style scoped>
</style>
 
