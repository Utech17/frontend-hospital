<template>
  <div class="layout">
    <SideMenu ref="sideMenu" @menu-toggled="updateSideMenuWidth"/>
    <div class="content flex-grow-1" :style="{ marginLeft: sideMenuWidth }">
      <NavBar :title="pageTitle" :sideMenuWidth="sideMenuWidth" @toggle-menu="toggleSideMenu"/>
      <main class="main-content">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pageTitle = ref('Inicio')

watchEffect(() => {
  pageTitle.value = route.meta?.title || 'Inicio'
})
</script>

<script>
import NavBar from '~/components/ui/navbar/NavBar.vue'
import SideMenu from '~/components/ui/sidemenu/SideMenu.vue'

export default {
  name: 'default',
  components: {
    NavBar,
    SideMenu
  },
  props: {
    pageTitle: {
      type: String,
      default: 'Inicio'
    }
  },
  data() {
    return {
      sideMenuWidth: '240px' 
    }
  },
  methods: {
    toggleSideMenu() {
      this.$refs.sideMenu.toggleMenu();
    },
    updateSideMenuWidth(isOpen, width) {
      if (width) {
        this.sideMenuWidth = width;
      } else {
        this.sideMenuWidth = isOpen ? '240px' : '80px'; 
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  background-color: #f5f7fa;
  min-height: 100vh;
  width: 100%;
}
.content {
    transition: margin-left 0.3s ease;
}

.side-menu {
    width: 240px;
}

.side-menu-minimized {
    width: 80px;
}
</style>