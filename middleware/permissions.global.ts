// Middleware placeholder for permissions checks.
// The original implementation was commented out; provide a safe default export
// so Nuxt can import the middleware during build.

// import { authStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to) => {
	// TODO: restore permission logic when ready. Example logic was:
	// const { isLoggin, permissionsSearch } = authStore();
	// if (/\/api\/*/.test(to.path)) return;
	// if (isLoggin) {
	//   if (to.path === "/") return '/dashboard';
	//   permissionsSearch(to.meta?.module_code as string, to);
	// } else if (!isLoggin && to.path !== "/") return "/";

	// No-op middleware to satisfy Nuxt build while permissions code is being migrated.
	return;
});
