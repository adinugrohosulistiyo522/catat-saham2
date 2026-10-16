import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './index.js';

const req = (path, method='GET') => new Request(`https://catat-saham2.example.workers.dev${path}`, { method });

test('GET /healthz responds without Apps Script environment', async () => {
  const res = await worker.fetch(req('/healthz'), {});
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.workerVersion, '6.0.0');
  assert.equal(body.appsScriptUrlConfigured, false);
});

test('GET /api responds without Apps Script environment', async () => {
  const res = await worker.fetch(req('/api'), {});
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.workerVersion, '6.0.0');
  assert.equal(body.apiKeyConfigured, false);
});

test('unknown API subroute returns JSON 404', async () => {
  const res = await worker.fetch(req('/api/not-a-route'), {});
  const body = await res.json();
  assert.equal(res.status, 404);
  assert.equal(body.code, 'API_ROUTE_NOT_FOUND');
});

test('root content is served through ASSETS binding', async () => {
  const env = { ASSETS: { fetch: async (request) => new Response('<!doctype html><title>CatatSaham</title>', { headers: {'Content-Type':'text/html; charset=utf-8'} }) } };
  const res = await worker.fetch(req('/'), env);
  const body = await res.text();
  assert.equal(res.status, 200);
  assert.match(body, /CatatSaham/);
  assert.equal(res.headers.get('X-CatatSaham-Worker'), '6.0.0');
});
