export default {
  created() {
    // Only redirect to login when the current route requires authentication
    const hasSession = !!sessionStorage.getItem('user_id');
    const route = (this as any).$route;
    const requiresAuth = route && route.matched && route.matched.some((rec: any) => rec.meta && rec.meta.requiresAuth);

    if (!hasSession && requiresAuth) {
      const r = (this as any).$router;
      if (r && typeof r.push === 'function') {
        r.push('/');
      } else {
        window.location.href = '/';
      }
    }
  }
}

export const authGuard = {
  beforeRouteEnter(to: any, from: any, next: any) {
    next()
  }
}