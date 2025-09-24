<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white py-2 border-nav">
        <div class="container-fluid">
            <div class="d-flex align-items-center">
                <!-- Brand -->
                <router-link to="/home" class="navbar-brand ms-1 me-3">{{ title }}</router-link>
            </div>

            <div class="collapse navbar-collapse">
                <!-- left empty for now; future nav links could go here -->
            </div>

            <div class="d-flex align-items-center ms-auto gap-3 user-area">
                <!-- Search form -->
                <form class="search-form d-flex align-items-center" @submit.prevent>
                    <div class="position-relative">
                        <input
                            class="form-control rounded-pill ps-4 pe-4 search-input"
                            type="search"
                            placeholder="Buscar..."
                            aria-label="Buscar"
                            v-model="searchQuery"
                        />
                        <img src="/iconos/busqueda.svg" alt="Buscar" class="search-icon" />
                    </div>
                </form>

                <!-- User dropdown (opens only on click) -->
                <div class="dropdown user-menu-root" ref="userMenuRoot">
                    <button class="btn btn-link nav-link " type="button" @click.stop="toggleUserMenu" aria-haspopup="true" :aria-expanded="userMenuOpen">
                        <img src="/iconos/user.svg" alt="Usuario" width="28" height="28" class="iconColor" />
                    </button>
                    <ul v-show="userMenuOpen" class="dropdown-menu dropdown-menu-end show user-dropdown" aria-labelledby="userDropdown">
                        <li>
                            <button class="dropdown-item d-flex align-items-center" @click="cerrarSesion">
                                <i class="bi bi-box-arrow-right me-2"></i>
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import Swal from 'sweetalert2'

export default {
    name: 'NavBar',
    props: {
        title: {
            type: String,
            default: 'Inicio'
        },
        sideMenuWidth: { 
            type: String,
            default: '240px'
        }
    },
    data() {
        return {
            searchQuery: '',
            userMenuOpen: false
        }
    },
    mounted() {
        document.addEventListener('click', this.handleDocumentClick)
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleDocumentClick)
    },
    methods: {
        toggleSideMenu() {
            this.$emit('toggle-menu')
        },
        onSearch() {
            // placeholder: emit search event for parent to handle
            this.$emit('search', this.searchQuery)
        },

        toggleUserMenu() {
            this.userMenuOpen = !this.userMenuOpen
        },

        closeUserMenu() {
            this.userMenuOpen = false
        },

        handleDocumentClick(e) {
            const root = this.$refs.userMenuRoot
            if (!root) return
            if (this.userMenuOpen && !root.contains(e.target)) {
                this.closeUserMenu()
            }
        },

        async cerrarSesion() {
            sessionStorage.clear();
            
            await Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión exitosamente',
                timer: 1500
            });

            const r = this.$router
            if (r && typeof r.push === 'function') {
                r.push('/');
            } else {
                window.location.href = '/';
            }
        }
    }
}
</script>

<style scoped>
.search-container {
    position: relative;
    width: 300px;
}

.search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    filter: invert(48%) sepia(0%) saturate(0%) hue-rotate(147deg) brightness(89%) contrast(93%);
}
.border-nav {
    border-bottom: 1px solid #f5f9fb;
}
.btn {
    width: 40px;
    height: 40px;
}
.form-control:focus {
    border-color: #3c6cff;
    border-width: 2px;
    box-shadow: none;
    outline: 0;
}
.userIcon { 
    filter: invert(48%) sepia(0%) saturate(0%) hue-rotate(147deg) brightness(89%) contrast(93%);
}
.dropdown-toggle::after {
    display: none;
}

.dropdown-menu {
    min-width: 200px;
    padding: 0.5rem 0;
    margin-top: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    border: 1px solid #f5f9fb;
}

.dropdown-item {
    padding: 0.5rem 1rem;
    color: #333;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
    color: #2d60ff;
}

.iconColor {
    filter: invert(48%) sepia(0%) saturate(0%) hue-rotate(147deg) brightness(89%)
        contrast(93%);
}

.search-input {
    width: 260px;
}

.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    pointer-events: none;
}

@media (max-width: 768px) {
    .search-input {
        width: 160px;
    }
    .navbar-brand {
        font-size: 1rem;
    }
}

/* Make user button align exactly at the right edge and dropdown float above everything */
.user-area {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

/* ensure the navbar container uses flex so ms-auto/margin-left:auto works reliably */
nav .container-fluid {
    display: flex;
    align-items: center;
    width: 100%;
}

/* force user area to the far right edge */
.user-area {
    margin-left: auto;
}

.user-menu-root {
    position: relative; /* anchor for absolute dropdown */
}

.user-dropdown {
    position: absolute !important;
    top: calc(100% + 6px) !important;
    right: 0 !important;
    z-index: 9999 !important; /* make sure it appears above all */
    min-width: 180px;
    display: block; /* ensure it renders when v-show true */
}

/* prevent navbar overflow from clipping the dropdown */
nav.navbar { overflow: visible; }
</style>