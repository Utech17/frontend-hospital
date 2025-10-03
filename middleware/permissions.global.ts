// Middleware placeholder for permissions checks.
// The original implementation was commented out; provide a safe default export
// so Nuxt can import the middleware during build.

// import { authStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to) => {
	// Ejecutar sólo en cliente — sessionStorage no existe en el servidor
	if (!process.client) {
		// No-op durante la generación/SSR
		return;
	}

	// Log util para debugging (tal como lo pediste)
	// Nota: sessionStorage es seguro de usar aquí porque estamos en client-side
	console.log('user_id en guard:', sessionStorage.getItem('user_id'));

	// Determinar si la ruta requiere autenticación. Soportamos meta directo y matched (vue-router).
	const requiresAuth = Boolean(
		(to.meta && (to.meta as any).requiresAuth) ||
		(to.matched && to.matched.some((r: any) => r.meta && r.meta.requiresAuth))
	);

	const isAuthenticated = Boolean(sessionStorage.getItem('user_id'));

	if (requiresAuth && !isAuthenticated) {
		// Redirigir al login con query para volver luego
		return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
	}

	// Si no requiere o ya está autenticado, dejar continuar
	return;
});
