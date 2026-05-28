const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { after, before, test } = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

let server;

function request(pathname) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${pathname}`, (res) => {
      res.resume();
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'] || ''
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy(new Error(`Timed out requesting ${pathname}`));
    });
  });
}

async function waitForServer() {
  const started = Date.now();

  while (Date.now() - started < 10000) {
    try {
      const response = await request('/');
      if (response.statusCode === 200) return;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  throw new Error('Server did not start in time');
}

before(async () => {
  server = spawn(process.execPath, ['server.js'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  server.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  await waitForServer();
});

after(() => {
  if (server && !server.killed) {
    server.kill();
  }
});

test('all public app routes respond successfully', async () => {
  const routes = [
    '/',
    '/mis_feed/',
    '/mis_pendências/',
    '/Alertas.html',
    '/Atualizações.html',
    '/alertas/',
    '/atualizacoes/'
  ];

  for (const route of routes) {
    const response = await request(route);
    assert.equal(response.statusCode, 200, `${route} should return 200`);
    assert.match(response.contentType, /text\/html/, `${route} should return HTML`);
  }
});

test('shared bridge script is served from the absolute route', async () => {
  const response = await request('/shared/bridge.js');

  assert.equal(response.statusCode, 200);
  assert.match(response.contentType, /application\/javascript/);
});

test('main pages do not use dashboard routes or stale index-file app links', async () => {
  const pages = [
    'index.html',
    'Alertas.html',
    'Atualizações.html',
    path.join('mis_pendências', 'index.html'),
    path.join('mis_feed', 'index.html')
  ];
  const staleLinks = [
    'mis_pendências/index.html',
    'mis_dashboard/index.html',
    '../mis_pendências/index.html',
    '../mis_dashboard/index.html',
    '/mis_dashboard/'
  ];

  for (const page of pages) {
    const html = await fs.readFile(path.join(ROOT, page), 'utf8');
    for (const link of staleLinks) {
      assert.equal(
        html.includes(`href="${link}"`),
        false,
        `${page} should not link to ${link}`
      );
    }
  }
});
