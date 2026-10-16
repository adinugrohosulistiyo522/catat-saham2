import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../index.js';

const URL_OK = 'https://script.google.com/macros/s/ABC_123-xyz/exec';
const API_KEY = 'TEST_SECRET_NEVER_RETURN_TO_BROWSER';
const makeEnv = (extra = {}) => ({
  ASSETS: { fetch: async (request) => new Response(`ASSET:${new URL(request.url).pathname}`, { status: 200 }) },
  ...extra
});
const request = (path, init = {}) => new Request(`https://catat-saham.test${path}`, init);

test('GET /healthz gives fast health response without Apps Script', async () => {
  let networkCalls = 0;
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => { networkCalls++; throw new Error('must not call upstream'); };
  try {
    const response = await worker.fetch(request('/healthz'), makeEnv());
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.workerVersion, '5.0.0');
    assert.equal(body.appsScriptUrlConfigured, false);
    assert.equal(networkCalls, 0);
    assert.equal(response.headers.get('x-catatsaham-worker'), '5.0.0');
  } finally { globalThis.fetch = oldFetch; }
});

test('GET /api responds in Kliktiva style without requiring environment', async () => {
  const response = await worker.fetch(request('/api'), makeEnv());
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.service, 'CatatSaham API proxy');
  assert.equal(body.workerVersion, '5.0.0');
  assert.equal(body.appsScriptUrlConfigured, false);
});

test('non-API requests go through ASSETS binding', async () => {
  for (const path of ['/', '/index.html', '/some-spa-route']) {
    const response = await worker.fetch(request(path), makeEnv());
    assert.equal(response.status, 200);
    assert.equal(await response.text(), `ASSET:${path}`);
  }
});

test('POST /api returns a useful error when environment is missing', async () => {
  const response = await worker.fetch(request('/api', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://catat-saham.test' },
    body: JSON.stringify({ action: 'login', username: 'demo_admin', password: 'irrelevant' })
  }), makeEnv());
  assert.equal(response.status, 500);
  assert.equal((await response.json()).code, 'APPS_SCRIPT_URL_NOT_CONFIGURED');
});

test('POST /api rejects a foreign Origin', async () => {
  const response = await worker.fetch(request('/api', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://attacker.example' },
    body: JSON.stringify({ action: 'login' })
  }), makeEnv());
  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, 'ORIGIN_NOT_ALLOWED');
});

test('POST /api rejects actions not implemented by Apps Script', async () => {
  const response = await worker.fetch(request('/api', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'deleteAllData' })
  }), makeEnv({ APPS_SCRIPT_URL: URL_OK, CATATSAHAM_API_KEY: API_KEY }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, 'ACTION_NOT_ALLOWED');
});

test('POST /api securely injects API key and preserves Apps Script response', async () => {
  const originalFetch = globalThis.fetch;
  let upstreamCall;
  globalThis.fetch = async (url, init) => {
    upstreamCall = { url: String(url), init, payload: JSON.parse(init.body) };
    return new Response(JSON.stringify({ ok: true, token: 'test-session', user: { username: 'trader01' }, state: { tradingPlans: [] } }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  };
  try {
    const response = await worker.fetch(request('/api', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://catat-saham.test' },
      body: JSON.stringify({ action: 'login', username: 'trader01', password: 'demo-password', apiKey: 'attacker-value' })
    }), makeEnv({ APPS_SCRIPT_URL: URL_OK, CATATSAHAM_API_KEY: API_KEY }));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.token, 'test-session');
    assert.equal(upstreamCall.url, URL_OK);
    assert.equal(upstreamCall.init.method, 'POST');
    assert.equal(upstreamCall.payload.action, 'login');
    assert.equal(upstreamCall.payload.username, 'trader01');
    assert.equal(upstreamCall.payload.apiKey, API_KEY, 'server secret must overwrite a key supplied by browser');
    assert.equal(JSON.stringify(body).includes(API_KEY), false, 'secret never returns to browser');
  } finally { globalThis.fetch = originalFetch; }
});

test('unknown /api subpath does not fall through to static HTML', async () => {
  const response = await worker.fetch(request('/api/unknown'), makeEnv());
  assert.equal(response.status, 404);
  assert.equal((await response.json()).code, 'API_ROUTE_NOT_FOUND');
});
