<template>
  <div class="home">
      <div class="h-full w-full flex justify-center items-center">
        <h2 class="text-5xl font-semibold text-center">
          Bienvenido al Sistema de Gestión Hospitalaria
        </h2>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Default from "~/layouts/default.vue";

export default defineComponent({
  name: 'dashboard',
  components: { Default }
});
</script>

<style lang="scss" scoped>

h2 {
  color: #333;
}
</style> 