// https://nuxt.com/docs/api/configuration/nuxt-config
import { API } from "./utils/constant";

export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: "MediPlus - Hospital Management System",
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/icon.png",
        },
      ],
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    '@vee-validate/nuxt',
  ],
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'vForm',
      Field: 'vField',
      FieldArray: 'vFieldArray',
      ErrorMessage: 'vErrorMessage',
    },
  },
  buildModules: ["@nuxtjs/moment"],
  vite: {
    build: {
      rollupOptions: {
        external: "~/public",
      },
    }, 
  },
  ssr: false,
  spaLoadingTemplate: "spa-loading.html",
  telemetry: false,
  pinia: {
    autoImports: ["defineStore", "definePiniaStore"],
  },
  imports: {
    dirs: ["store"],
  },
  routeRules: {
    '/api/**': { proxy: API }
  },  
  css: ["~/assets/tailwind.css"],
  compatibilityDate: "2025-02-21",
});
