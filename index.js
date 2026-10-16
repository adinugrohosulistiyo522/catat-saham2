// CatatSaham Worker entrypoint.
// This follows the root-flat layout compatible with the existing GitHub repository and Kliktiva handler pattern:
// route API requests through the root api.js and serve all other requests via ASSETS.
import { onRequestGet, onRequestPost, onRequest, onRequestHealth } from './api.js';

const API_PATH = '/api';
const HEALTH_PATH = '/healthz';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === HEALTH_PATH) {
      if (request.method !== 'GET') return onRequest({ request, env });
      return onRequestHealth({ request, env });
    }
    if (url.pathname === API_PATH || url.pathname.startsWith(`${API_PATH}/`)) {
      if (url.pathname !== API_PATH && url.pathname !== `${API_PATH}/`) {
        return new Response(JSON.stringify({ ok: false, code: 'API_ROUTE_NOT_FOUND', error: 'Endpoint API tidak dikenal.' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store, max-age=0', 'X-CatatSaham-Worker': '6.0.0' }
        });
      }
      if (request.method === 'GET') return onRequestGet({ request, env });
      if (request.method === 'POST' || request.method === 'OPTIONS') return onRequest({ request, env });
      return onRequest({ request, env });
    }
    if (!env?.ASSETS || typeof env.ASSETS.fetch !== 'function') {
      return new Response('Aset CatatSaham tidak terpasang. Pastikan wrangler.jsonc dengan binding ASSETS digunakan saat deploy.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-CatatSaham-Worker': '6.0.0' }
      });
    }
    try {
      const response = await env.ASSETS.fetch(request);
      const headers = new Headers(response.headers);
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('X-CatatSaham-Worker', '6.0.0');
      if (url.pathname === '/' || url.pathname.endsWith('.html')) headers.set('Cache-Control', 'no-store, max-age=0');
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    } catch {
      return new Response('Gagal menyajikan aset CatatSaham.', {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-CatatSaham-Worker': '6.0.0' }
      });
    }
  }
};
