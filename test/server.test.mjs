import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppServer } from '../server.mjs';

async function withServer(run) {
  const server = createAppServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); } finally { await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); }
}

test('health reports Aegis revision and security headers', async () => withServer(async base => {
  const response = await fetch(`${base}/healthz`); const data = await response.json();
  assert.equal(response.status, 200); assert.equal(data.ok, true); assert.equal(data.app, 'aegis'); assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
}));

test('mutating HTTP methods are rejected', async () => withServer(async base => {
  const response = await fetch(`${base}/healthz`, { method:'POST' });
  assert.equal(response.status, 405);
}));
