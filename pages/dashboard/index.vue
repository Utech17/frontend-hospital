<template>
  <div class="home">
      <div class="dashboard-content">
        <h2>Bienvenido al Sistema de Gestión Hospitalaria</h2>
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
.dashboard-content {
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}
</style> 