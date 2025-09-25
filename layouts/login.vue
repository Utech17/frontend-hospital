<template>
    <div class="auth-layout">
        <NuxtPage />
    </div>
</template>

<script>
import Login from '~/pages/login/index.vue'
export default {
    name: 'login',
    components: {
    Login,
    },
}
</script>

<style lang="scss" scoped>
    .auth-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
    }
</style>