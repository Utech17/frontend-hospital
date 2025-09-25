import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { API } from "~/utils/constant";

const doctoresView = () => import(/* webpackChunkName: "doctores" */ '@/pages/dashboard/usuarios/doctores.vue')
const pacientesView = () => import(/* webpackChunkName: "pacientes" */ '@/pages/dashboard/usuarios/pacientes.vue')
const proveedoresView = () => import(/* webpackChunkName: "proveedores" */ '@/pages/dashboard/usuarios/proveedores.vue')
const clientesView = () => import(/* webpackChunkName: "clientes" */ '@/pages/dashboard/usuarios/clientes.vue')
const Login = () => import(/* webpackChunkName: "homeScreen" */ '@/pages/login/index.vue')
const HomeView = () => import(/* webpackChunkName: "home" */ '@/pages/dashboard/index.vue')
const ReportsView = () => import(/* webpackChunkName: "reports" */ '@/pages/dashboard/finanzas/Reportes.vue')

const PharmacyInventoryView = () => import(/* webpackChunkName: "pharmacy-inventory" */ '../pages/dashboard/pharmacy/PharmacyInventoryView.vue')
const BillingView = () => import(/* webpackChunkName: "pharmacy-billing" */ '../pages/dashboard/pharmacy/BillingView.vue')
const SalesListView = () => import(/* webpackChunkName: "sales" */ '../pages/dashboard/Sales/SaleslistView.vue')
const BuyListView = () => import(/* webpackChunkName: "buy" */ '../pages/dashboard/finanzas/compras/SolicitarCompra.vue')
const BuyListViewRequest = () => import(/* webpackChunkName: "buy-request" */ '../pages/dashboard/finanzas/Compras/SolicitudesCompras.vue')
const AppointmentsListView = () => import(/* webpackChunkName: "appointments" */ '../pages/dashboard/appointments/appointmentsListView.vue')
const BillingAppointmentsListView = () => import(/* webpackChunkName: "billing-appointments" */ '../pages/dashboard/BillingAppointments/BillingAppointmentsListView.vue')
const BillingEmergenciesListView = () => import(/* webpackChunkName: "billing-emergencies" */ '../pages/dashboard/BillingEmergencies/BillingEmergenciesListView.vue')
const BillingLaboratoriesListView = () => import(/* webpackChunkName: "billing-laboratories" */ '../pages/dashboard/BillingLaboratories/BillingLaboratoriesListView.vue')
const EmergencyListView = () => import(/* webpackChunkName: "emergency" */ '@/pages/dashboard/emergency/EmergencyListView.vue')
const FinanceView = () => import(/* webpackChunkName: "finance" */ '~/pages/dashboard/finanzas/Finanzas.vue')
const StoreProductsListView = () => import(/* webpackChunkName: "store-products" */ '@/pages/dashboard/storeProducts/StoreProductsListView.vue')
const SaleslistView = () => import(/* webpackChunkName: "sales" */ '@/pages/dashboard/Sales/SaleslistView.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/dashboard',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/usuarios/pacientes',
    component: pacientesView,
    meta: { requiresAuth: true}
  },
  {
    path: '/dashboard/usuarios/doctores',
    component: doctoresView,
    meta: { requiresAuth: true}
  },
  {
    path: '/dashboard/usuarios/proveedores',
    component: proveedoresView,
    meta: { requiresAuth: true}
  },{
    path: '/dashboard/usuarios/clientes',
    component: clientesView,
    meta: { requiresAuth: true}
  },
  {
    path: '/dashboard/finanzas/reportes',
    component: ReportsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/finanzas/compras/SolicitarCompra',
    component: BuyListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/finanzas/compras/SolicitudesCompras',
    component: BuyListViewRequest,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard//finanzas/ventas',
    component: SalesListView,
    meta: { requiresAuth: true }
  },



  {
    path: '/dashboard/laboratorio/facturacion',
    component: BillingLaboratoriesListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/citas/facturacion',
    component: BillingAppointmentsListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/farmacia/inventario',
    component: PharmacyInventoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/farmacia/facturacion',
    component: BillingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/emergencia/listado',
    component: EmergencyListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/emergencia/facturacion',
    component: BillingEmergenciesListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/almacen/productos',
    component: StoreProductsListView,
    meta: { requiresAuth: true }
  },
 
  {
    path: '/dashboard/cita',
    component: AppointmentsListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/finanzas/resumen',
    component: FinanceView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/sales',
    component: SaleslistView,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(API),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('user_id en guard:', sessionStorage.getItem('user_id'));
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = !!sessionStorage.getItem('user_id')

  if (requiresAuth && !isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
});


export default router