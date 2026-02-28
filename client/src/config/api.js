/**
 * API base URL for all backend requests.
 * - Local dev: uses http://localhost:5000 if env is unset or empty.
 * - Production (Vercel): set VITE_API_URL in Vercel → Settings → Environment Variables
 *   to your backend URL (e.g. https://rastogicodeworksbackend.onrender.com), then redeploy.
 */
const BACKEND_URL = 'https://rastogicodeworksbackend.onrender.com';
const raw = (import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER_URL || '').trim();
const API_BASE = raw || (import.meta.env.PROD ? BACKEND_URL : 'http://localhost:5000');

/**
 * True when the app is running in production (non-localhost) but API_BASE is still localhost.
 * Use this to show a clear error instead of a generic "Network error".
 */
export function isProductionWithoutApi() {
  if (typeof window === 'undefined') return false;
  const isProduction = !['localhost', '127.0.0.1'].includes(window.location.hostname);
  const isLocalhostApi = API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1');
  return isProduction && isLocalhostApi;
}

export const PRODUCTION_API_MESSAGE =
  'Backend not configured for production. In Vercel → Project → Settings → Environment Variables, add VITE_API_URL = https://rastogicodeworksbackend.onrender.com (or your backend URL), then redeploy.';

/** Message when running on localhost but backend is unreachable (e.g. server not started). */
export const LOCAL_SERVER_UNREACHABLE_MESSAGE =
  "Can't reach the server. Is the backend running? From the project root run: npm run server (then try again).";

/** True when app is on localhost and API_BASE points to localhost (so we can show "start the server" hint). */
export function isLocalWithLocalApi() {
  if (typeof window === 'undefined') return false;
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const isLocalApi = API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1');
  return isLocal && isLocalApi;
}

export default API_BASE;
