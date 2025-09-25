<template>
    <div class="doctorview">
        <AddDoctor />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AddDoctor from '@/components/utils/user/doctors/AddDoctor.vue';

definePageMeta({
  title: 'Usuarios -> Doctores'
})

export default defineComponent({
    name: 'DoctorView',
    components: { AddDoctor }
});
</script>

<style scoped>
</style>
 
