const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { after, before, test } = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
const SITE_BASE_PATH = '/MISfront';

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
      const response = await request(`${SITE_BASE_PATH}/`);
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
    `${SITE_BASE_PATH}/`,
    `${SITE_BASE_PATH}/feed.html`,
    `${SITE_BASE_PATH}/projetos.html`,
    `${SITE_BASE_PATH}/upload.html`,
    `${SITE_BASE_PATH}/suprimentos.html`,
    `${SITE_BASE_PATH}/pendencias.html`,
    `${SITE_BASE_PATH}/alertas.html`,
    `${SITE_BASE_PATH}/atualizacoes.html`
  ];

  for (const route of routes) {
    const response = await request(route);
    assert.equal(response.statusCode, 200, `${route} should return 200`);
    assert.match(response.contentType, /text\/html/, `${route} should return HTML`);
  }
});

test('shared bridge script is served from the absolute route', async () => {
  const response = await request(`${SITE_BASE_PATH}/shared/bridge.js`);

  assert.equal(response.statusCode, 200);
  assert.match(response.contentType, /application\/javascript/);
});

test('shared global visual theme is served and loaded by every page', async () => {
  const response = await request(`${SITE_BASE_PATH}/shared/global.css`);

  assert.equal(response.statusCode, 200);
  assert.match(response.contentType, /text\/css/);

  const pages = [
    'feed.html',
    'projetos.html',
    'upload.html',
    'suprimentos.html',
    'pendencias.html',
    'alertas.html',
    'atualizacoes.html'
  ];

  for (const page of pages) {
    const html = await fs.readFile(path.join(ROOT, page), 'utf8');
    assert.equal(
      html.includes('href="/MISfront/shared/global.css"'),
      true,
      `${page} should load the shared global theme`
    );
  }

  const landingHtml = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');
  assert.equal(
    landingHtml.includes('href="/MISfront/shared/global.css"'),
    false,
    'index.html is the landing page and should not load the app global theme'
  );
});

test('main pages do not use dashboard routes or stale index-file app links', async () => {
  const pages = [
    'index.html',
    'feed.html',
    'projetos.html',
    'upload.html',
    'suprimentos.html',
    'pendencias.html',
    'alertas.html',
    'atualizacoes.html'
  ];
  const staleLinks = [
    '/MISfront/Alertas.html',
    '/MISfront/mis_feed/',
    'mis_dashboard/index.html',
    '../mis_dashboard/index.html',
    '/mis_dashboard/',
    'Dashboard',
    'Biblioteca'
  ];

  for (const page of pages) {
    const html = await fs.readFile(path.join(ROOT, page), 'utf8');
    for (const link of staleLinks) {
      assert.equal(
        link === 'Dashboard' || link === 'Biblioteca'
          ? html.includes(link)
          : html.includes(`href="${link}"`),
        false,
        `${page} should not link to ${link}`
      );
    }
  }
});

test('main pages share the same primary app navigation', async () => {
  const pages = [
    'feed.html',
    'projetos.html',
    'upload.html',
    'suprimentos.html',
    'pendencias.html',
    'alertas.html',
    'atualizacoes.html'
  ];
  const primaryLinks = [
    `${SITE_BASE_PATH}/feed.html`,
    `${SITE_BASE_PATH}/projetos.html`,
    `${SITE_BASE_PATH}/suprimentos.html`,
    `${SITE_BASE_PATH}/pendencias.html`,
    `${SITE_BASE_PATH}/alertas.html`,
    `${SITE_BASE_PATH}/atualizacoes.html`
  ];

  for (const page of pages) {
    const html = await fs.readFile(path.join(ROOT, page), 'utf8');

    for (const href of primaryLinks) {
      assert.equal(
        html.includes(`href="${href}"`),
        true,
        `${page} should expose ${href} in primary navigation`
      );
    }

    assert.equal(html.includes('href="#"'), false, `${page} should not contain placeholder links`);
    assert.equal(html.includes('<button class="nav-item"'), false, `${page} should not use nav buttons`);
  }
});

test('main page navigation links resolve from their own locations', async () => {
  const pages = [
    ['index.html', `${SITE_BASE_PATH}/index.html`],
    ['feed.html', `${SITE_BASE_PATH}/feed.html`],
    ['projetos.html', `${SITE_BASE_PATH}/projetos.html`],
    ['upload.html', `${SITE_BASE_PATH}/upload.html`],
    ['suprimentos.html', `${SITE_BASE_PATH}/suprimentos.html`],
    ['pendencias.html', `${SITE_BASE_PATH}/pendencias.html`],
    ['alertas.html', `${SITE_BASE_PATH}/alertas.html`],
    ['atualizacoes.html', `${SITE_BASE_PATH}/atualizacoes.html`]
  ];

  for (const [file, pageUrl] of pages) {
    const html = await fs.readFile(path.join(ROOT, file), 'utf8');
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((href) => {
        return !href.startsWith('#') &&
          !href.startsWith('http') &&
          !href.startsWith('mailto:') &&
          href !== './';
      });

    for (const href of hrefs) {
      assert.equal(
        href.startsWith(`${SITE_BASE_PATH}/`),
        true,
        `${file} link ${href} should include ${SITE_BASE_PATH}`
      );

      const resolved = new URL(href, `${BASE_URL}${pageUrl}`).pathname;
      const response = await request(resolved);
      assert.equal(
        response.statusCode,
        200,
        `${file} link ${href} should resolve to ${resolved}`
      );
    }
  }
});
