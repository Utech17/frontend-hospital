// Minimal API helper — easy to import and use from pages or components
// Usage:
// import api from '~/utils/simpleApi';
// await api.post('/user/login', { email, password });

function normalizeBase(raw?: string) {
  if (!raw) return '/api';
  let v = String(raw).trim();
  v = v.replace(/\/+$/g, '');
  if (!/^https?:\/\//i.test(v)) v = `http://${v}`;
  return v;
}

function getBase() {
  if (typeof process !== 'undefined' && process.env && process.env.API_HOST) return normalizeBase(process.env.API_HOST);
  if (typeof window !== 'undefined' && (window as any).API_HOST) return normalizeBase((window as any).API_HOST);
  return '/api';
}

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const base = getBase();
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

async function request(method: string, path: string, body?: any, opts: RequestInit = {}) {
  const url = buildUrl(path);
  const headers: Record<string, string> = Object.assign({ 'Content-Type': 'application/json' }, (opts.headers as any) || {});

  try {
    const token = typeof window !== 'undefined' ? window.sessionStorage.getItem('token') : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    // ignore storage errors
  }

  const res = await fetch(url, Object.assign({}, opts, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: (opts.credentials as RequestCredentials) || 'include'
  }));

  const ctype = res.headers.get('content-type') || '';
  let data: any = null;
  if (ctype.includes('application/json')) data = await res.json().catch(() => null);
  else data = await res.text().catch(() => null);

  if (!res.ok) {
    const err: any = new Error(data?.message || res.statusText || 'HTTP error');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function get(path: string, opts?: RequestInit) { return request('GET', path, undefined, opts); }
export function post(path: string, body?: any, opts?: RequestInit) { return request('POST', path, body, opts); }
export function put(path: string, body?: any, opts?: RequestInit) { return request('PUT', path, body, opts); }
export function del(path: string, opts?: RequestInit) { return request('DELETE', path, undefined, opts); }

export function setToken(t?: string | null) {
  try {
    if (typeof window !== 'undefined') {
      if (t) window.sessionStorage.setItem('token', t);
      else window.sessionStorage.removeItem('token');
    }
  } catch (e) {}
}

export function clearToken() { setToken(null); }

const api = { get, post, put, del, setToken, clearToken, buildUrl };
export default api;

