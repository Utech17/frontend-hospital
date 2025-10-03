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
const Productos = () => import(/* webpackChunkName: "store-products" */ '@/pages/dashboard/almacen/productos/index.vue')
const Emergencia = () => import(/* webpackChunkName: "emergency" */ '@/pages/dashboard/emergencia/index.vue')
const EmergenciaFacturacion = () => import(/* webpackChunkName: "billing-emergencies" */ '../pages/dashboard/emergencia/facturacion.vue')
const Citas = () => import(/* webpackChunkName: "appointments" */ '../pages/dashboard/citas/index.vue')
const CitasFacturacion = () => import(/* webpackChunkName: "billing-appointments" */ '../pages/dashboard/citas/facturacion.vue')
const Farmacia = () => import(/* webpackChunkName: "farmacia-inventory" */ '../pages/dashboard/farmacia/inventario.vue')
const FarmaciaFacturacion = () => import(/* webpackChunkName: "farmacia-billing" */ '../pages/dashboard/farmacia/facturacion.vue')

const SalesListView = () => import(/* webpackChunkName: "sales" */ '../pages/dashboard/Sales/SaleslistView.vue')
const BuyListView = () => import(/* webpackChunkName: "buy" */ '../pages/dashboard/finanzas/compras/SolicitarCompra.vue')
const BuyListViewRequest = () => import(/* webpackChunkName: "buy-request" */ '../pages/dashboard/finanzas/Compras/SolicitudesCompras.vue')
const BillingLaboratoriesListView = () => import(/* webpackChunkName: "billing-laboratories" */ '../pages/dashboard/laboratorio/BillingLaboratoriesListView.vue')
const FinanceView = () => import(/* webpackChunkName: "finance" */ '~/pages/dashboard/finanzas/Finanzas.vue')
const SaleslistView = () => import(/* webpackChunkName: "sales" */ '@/pages/dashboard/ventas/index.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/dashboard',
    component: HomeView,
  },
  {
    path: '/dashboard/usuarios/pacientes',
    component: pacientesView,
  },
  {
    path: '/dashboard/usuarios/doctores',
    component: doctoresView,
  },
  {
    path: '/dashboard/usuarios/proveedores',
    component: proveedoresView,
  },{
    path: '/dashboard/usuarios/clientes',
    component: clientesView,
  },
  {
    path: '/dashboard/finanzas/reportes',
    component: ReportsView,
  },
  {
    path: '/dashboard/finanzas/compras/SolicitarCompra',
    component: BuyListView,
  },
  {
    path: '/dashboard/finanzas/compras/SolicitudesCompras',
    component: BuyListViewRequest,
  },
  {
    path: '/dashboard/finanzas/ventas',
    component: SalesListView,
  },
  {
    path: '/dashboard/finanzas/resumen',
    component: FinanceView,
  },
  {
    path: '/dashboard/almacen/productos',
    component: Productos,
  },
  {
    path: '/dashboard/emergencias',
    component: Emergencia,
  },
  // {
  //   path: '/dashboard/emergencia/facturacion',
  //   component: EmergenciaFacturacion,
  // },
  {
    path: '/dashboard/citas',
    component: Citas,
  },
  // {
  //   path: '/dashboard/citas/facturacion',
  //   component: CitasFacturacion,
  // },
  {
    path: '/dashboard/farmacia/inventario',
    component: Farmacia,
  },
  // {
  //   path: '/dashboard/farmacia/facturacion',
  //   component: FarmaciaFacturacion,
  // },



  {
    path: '/dashboard/laboratorio/facturacion',
    component: BillingLaboratoriesListView,
  },
  {
    path: '/dashboard/sales',
    component: SaleslistView,
  },
]

const router = createRouter({
  history: createWebHistory(API),
  routes
})

export default router