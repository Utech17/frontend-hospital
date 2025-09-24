import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const doctoresView = () => import(/* webpackChunkName: "doctores" */ '@/pages/usuarios/doctores.vue')
const pacientesView = () => import(/* webpackChunkName: "pacientes" */ '@/pages/usuarios/pacientes.vue')
const proveedoresView = () => import(/* webpackChunkName: "proveedores" */ '@/pages/usuarios/proveedores.vue')
const clientesView = () => import(/* webpackChunkName: "clientes" */ '@/pages/usuarios/clientes.vue')

const Login = () => import(/* webpackChunkName: "homeScreen" */ '@/pages/index.vue')
const HomeView = () => import(/* webpackChunkName: "home" */ '../pages/home/HomeView.vue')
const PharmacyInventoryView = () => import(/* webpackChunkName: "pharmacy-inventory" */ '../pages/pharmacy/PharmacyInventoryView.vue')
const BillingView = () => import(/* webpackChunkName: "pharmacy-billing" */ '../pages/pharmacy/BillingView.vue')
const SalesListView = () => import(/* webpackChunkName: "sales" */ '../pages/Sales/SaleslistView.vue')
const BuyListView = () => import(/* webpackChunkName: "buy" */ '../pages/buy/BuyListView.vue')
const BuyListViewRequest = () => import(/* webpackChunkName: "buy-request" */ '../pages/BuyRequest/BuyRequestListView.vue')
const AppointmentsListView = () => import(/* webpackChunkName: "appointments" */ '../pages/appointments/appointmentsListView.vue')
const BillingAppointmentsListView = () => import(/* webpackChunkName: "billing-appointments" */ '../pages/BillingAppointments/BillingAppointmentsListView.vue')
const BillingEmergenciesListView = () => import(/* webpackChunkName: "billing-emergencies" */ '../pages/BillingEmergencies/BillingEmergenciesListView.vue')
const BillingLaboratoriesListView = () => import(/* webpackChunkName: "billing-laboratories" */ '../pages/BillingLaboratories/BillingLaboratoriesListView.vue')
const EmergencyListView = () => import(/* webpackChunkName: "emergency" */ '@/pages/emergency/EmergencyListView.vue')
const FinanceView = () => import(/* webpackChunkName: "finance" */ '@/pages/finance/FinanceView.vue')
const StoreProductsListView = () => import(/* webpackChunkName: "store-products" */ '@/pages/storeProducts/StoreProductsListView.vue')
const SaleslistView = () => import(/* webpackChunkName: "sales" */ '@/pages/Sales/SaleslistView.vue')
const ReportsView = () => import(/* webpackChunkName: "reports" */ '@/pages/ReportsView.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/usuarios/pacientes',
    name: 'pacientes',
    component: pacientesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/usuarios/doctores',
    name: 'doctores',
    component: doctoresView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/usuarios/proveedores',
    name: 'proveedores',
    component: proveedoresView,
    meta: { requiresAuth: true }
  },{
    path: '/dashboard/usuarios/clientes',
    name: 'clientes',
    component: clientesView,
    meta: { requiresAuth: true }
  },

  {
    path: '/laboratorio/facturacion',
    name: 'facturacion-laboratorio',
    component: BillingLaboratoriesListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/citas/facturacion',
    name: 'facturacion-citas',
    component: BillingAppointmentsListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/farmacia/inventario',
    name: 'inventario',
    component: PharmacyInventoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/farmacia/facturacion',
    name: 'facturacion-farmacia',
    component: BillingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/emergencia/listado',
    name: 'listado-emergencia',
    component: EmergencyListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/emergencia/facturacion',
    name: 'facturacion-emergencia',
    component: BillingEmergenciesListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/almacen/productos',
    name: 'productos',
    component: StoreProductsListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/ventas',
    name: 'ventas',
    component: SalesListView,
    meta: { 
      requiresAuth: true,
      title: 'Ventas'
    }
  },
  {
    path: '/compras/solicitar-compra',
    name: 'solicitar-compras',
    component: BuyListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/compras/solicitudes-de-compras',
    name: 'solicitudes-de-compras',
    component: BuyListViewRequest,
    meta: { requiresAuth: true }
  },
  {
    path: '/cita',
    name: 'cita',
    component: AppointmentsListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/finanzas/resumen',
    name: 'finanzas',
    component: FinanceView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reportes',
    name: 'reportes',
    component: ReportsView,
    meta: { 
      requiresAuth: true,
      title: 'Reportes',
    }
  },
  {
    path: '/sales',
    name: 'sales',
    component: SaleslistView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Agregar guard de navegación
router.beforeEach((to, from, next) => {
  // During development allow navigation to simplify testing (bypass auth guard)
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  // Verificar si la ruta requiere autenticación
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verificar si existe la sesión
    if (!sessionStorage.getItem('user_id')) {
      // No hay sesión, redirigir al login
      next({
        path: '/',
        query: { redirect: to.fullPath }  // Guardar la ruta a la que intentaba ir
      })
    } else {
      // Hay sesión, permitir la navegación
      next()
    }
  } else {
    // Ruta pública, permitir la navegación
    next()
  }
})

export default router