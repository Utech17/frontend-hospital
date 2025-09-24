import { Money3Directive } from "v-money3";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("money", Money3Directive);
});
