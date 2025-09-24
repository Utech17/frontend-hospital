<template>
  <div class="layout">
    <!-- <SideMenu ref="sideMenu" @menu-toggled="updateSideMenuWidth"/> -->
    <div class="content flex-grow-1" :style="{ marginLeft: sideMenuWidth }">
      <!-- <NavBar :title="pageTitle" :sideMenuWidth="sideMenuWidth" @toggle-menu="toggleSideMenu"/> -->
      <main class="main-content">
        <slot><NuxtPage /></slot>
      </main>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/ui/navbar/NavBar.vue'
import SideMenu from '@/components/ui/sidemenu/SideMenu'

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

<style scoped>
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