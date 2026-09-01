import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import http from 'http';

describe('API Endpoints Suite', () => {
  let server;
  let baseUrl;

  before(async () => {
    const app = createApp();
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('GET /api/health should return ok status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.ok(data.timestamp);
  });

  it('GET /api/content/landmarks should return seeded landmarks', async () => {
    const res = await fetch(`${baseUrl}/api/content/landmarks`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length >= 5);
    const mazar = data.find(l => l.slug === 'mazar-e-quaid');
    assert.ok(mazar);
    assert.strictEqual(mazar.title, 'Mazar-e-Quaid');
  });

  it('GET /api/content/sources should return seeded sources with attribution info', async () => {
    const res = await fetch(`${baseUrl}/api/content/sources`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length >= 5);
  });

  it('GET /api/users should return 401 when unauthenticated', async () => {
    const res = await fetch(`${baseUrl}/api/users`);
    assert.strictEqual(res.status, 401);
  });

  it('GET /api/admin/overview should return 401 when unauthenticated', async () => {
    const res = await fetch(`${baseUrl}/api/admin/overview`);
    assert.strictEqual(res.status, 401);
  });
});
