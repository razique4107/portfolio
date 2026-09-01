import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import http from 'http';

describe('UI Smoke & Routing Suite', () => {
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

  it('GET / should serve home HTML page with required elements', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Karachi — City of Light'));
    assert.ok(html.includes('id="scene-mazar"'));
    assert.ok(html.includes('id="scene-mohatta"'));
    assert.ok(html.includes('id="scene-frere"'));
    assert.ok(html.includes('id="scene-empress"'));
    assert.ok(html.includes('id="scene-clifton"'));
    assert.ok(html.includes('id="sightsSlider"'));
  });

  it('GET /login should resolve login.html without extension', async () => {
    const res = await fetch(`${baseUrl}/login`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Sign In'));
  });

  it('GET /register should resolve register.html without extension', async () => {
    const res = await fetch(`${baseUrl}/register`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Create Account'));
  });

  it('GET /forgot-password should resolve forgot-password.html', async () => {
    const res = await fetch(`${baseUrl}/forgot-password`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Reset Password'));
  });

  it('GET /sources should resolve sources.html', async () => {
    const res = await fetch(`${baseUrl}/sources`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Sources & Attribution'));
  });

  it('GET /privacy and /terms should serve legal pages', async () => {
    const resPriv = await fetch(`${baseUrl}/privacy`);
    assert.strictEqual(resPriv.status, 200);
    const resTerms = await fetch(`${baseUrl}/terms`);
    assert.strictEqual(resTerms.status, 200);
  });
});
