// CatatSaham API adapter — same handler pattern used by the working Kliktiva package.
// Imported by the root-level index.js for the flattened GitHub repository layout.
const VERSION = '6.0.0';
const ALLOWED_ACTIONS = new Set(['health', 'login', 'getState', 'saveState', 'changePassword']);
const SCRIPT_URL_RE = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec\/?$/;

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'X-CatatSaham-Worker': VERSION,
      ...extra
    }
  });
}

function readScriptUrl(env) {
  return String(env?.APPS_SCRIPT_URL || '').trim();
}
function readApiKey(env) {
  return String(env?.CATATSAHAM_API_KEY || '').trim();
}
function envStatus(env) {
  return {
    appsScriptUrlConfigured: SCRIPT_URL_RE.test(readScriptUrl(env)),
    apiKeyConfigured: Boolean(readApiKey(env))
  };
}

// GET /healthz: independent health check; never makes an upstream request.
export async function onRequestHealth({ env }) {
  return json({
    ok: true,
    service: 'CatatSaham',
    workerVersion: VERSION,
    runtime: 'cloudflare-worker-with-assets',
    ...envStatus(env)
  });
}

// GET /api: quick diagnostic in the same style as the Kliktiva proxy.
export async function onRequestGet({ env }) {
  return json({
    ok: true,
    service: 'CatatSaham API proxy',
    workerVersion: VERSION,
    message: 'Worker aktif. Gunakan POST untuk login dan operasi aplikasi.',
    ...envStatus(env)
  });
}

export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);
  if (url.pathname !== '/api' && url.pathname !== '/api/') {
    return json({ ok: false, code: 'API_ROUTE_NOT_FOUND', error: 'Endpoint API tidak dikenal.' }, 404);
  }

  // Same-origin browser writes only. Requests from command-line diagnostics without Origin are permitted.
  const origin = request.headers.get('Origin');
  if (origin) {
    try {
      if (new URL(origin).origin !== url.origin) {
        return json({ ok: false, code: 'ORIGIN_NOT_ALLOWED', error: 'Origin tidak diizinkan.' }, 403);
      }
    } catch {
      return json({ ok: false, code: 'INVALID_ORIGIN', error: 'Origin tidak valid.' }, 403);
    }
  }

  const appsScriptUrl = readScriptUrl(env);
  const apiKey = readApiKey(env);
  if (!SCRIPT_URL_RE.test(appsScriptUrl)) {
    return json({
      ok: false,
      code: 'APPS_SCRIPT_URL_NOT_CONFIGURED',
      error: 'APPS_SCRIPT_URL belum diisi atau bukan URL Web App Apps Script berakhiran /exec yang valid.',
      workerVersion: VERSION
    }, 500);
  }
  if (!apiKey) {
    return json({
      ok: false,
      code: 'CATATSAHAM_API_KEY_NOT_CONFIGURED',
      error: 'CATATSAHAM_API_KEY belum diisi sebagai Secret di environment Production.',
      workerVersion: VERSION
    }, 500);
  }

  let input;
  try {
    input = await request.json();
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Body request harus berupa objek JSON.');
  } catch (error) {
    return json({ ok: false, code: 'INVALID_JSON', error: error?.message || 'Body request harus berupa JSON.' }, 400);
  }

  const action = String(input.action || '');
  if (!ALLOWED_ACTIONS.has(action)) {
    return json({ ok: false, code: 'ACTION_NOT_ALLOWED', error: 'API action tidak dikenal atau tidak diizinkan.' }, 400);
  }

  // The secret is always set server-side after spread, so a browser cannot override it.
  const payload = { ...input, apiKey };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 28000);
  try {
    const upstream = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal
    });
    const raw = await upstream.text();
    let result;
    try { result = JSON.parse(raw); }
    catch {
      return json({
        ok: false,
        code: 'APPS_SCRIPT_BAD_RESPONSE',
        error: `Apps Script tidak mengembalikan JSON (HTTP ${upstream.status}). Pastikan Web App telah di-deploy dan URL berakhiran /exec.`,
        workerVersion: VERSION
      }, 502);
    }
    if (!upstream.ok) {
      return json({
        ok: false,
        code: result?.code || 'APPS_SCRIPT_HTTP_ERROR',
        error: result?.error || `Apps Script merespons HTTP ${upstream.status}.`,
        workerVersion: VERSION
      }, 502);
    }
    // Apps Script uses HTTP 200 for application-level errors too; retain its JSON body for the UI.
    return json(result, 200);
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    return json({
      ok: false,
      code: timedOut ? 'APPS_SCRIPT_TIMEOUT' : 'APPS_SCRIPT_UNREACHABLE',
      error: timedOut ? 'Apps Script tidak merespons dalam 28 detik.' : 'Worker gagal menghubungi Apps Script. Periksa URL Web App dan status layanan.',
      detail: String(error?.message || error || 'Unknown upstream error'),
      workerVersion: VERSION
    }, 502);
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  if (request.method === 'GET') return onRequestGet({ request, env });
  if (request.method === 'POST') return onRequestPost({ request, env });
  return json({ ok: false, code: 'METHOD_NOT_ALLOWED', error: 'Gunakan metode GET atau POST.' }, 405, { Allow: 'GET, POST, OPTIONS' });
}
