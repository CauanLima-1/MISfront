const http = require('http');
const fs = require('fs');
const path = require('path');

const { APPS, BIND_HOST, PORT, buildUrl } = require('./config/server.config');
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function getAppRoutes(app) {
  return [app.route, ...(app.aliasRoutes || [])];
}

function getAppIndexPath(app) {
  if (app.file) {
    return path.join(ROOT, app.file);
  }

  return path.join(ROOT, app.dir, 'index.html');
}

function resolveFilePath(requestPath) {
  if (requestPath === '/') {
    return path.join(ROOT, 'mis_dashboard', 'index.html');
  }

  if (requestPath.startsWith('/shared/')) {
    const subPath = requestPath.slice('/shared/'.length);
    return path.join(ROOT, 'shared', subPath);
  }

  for (const app of APPS) {
    for (const route of getAppRoutes(app)) {
      const routeWithoutSlash = route.replace(/\/$/, '');

      if (requestPath === routeWithoutSlash) {
        return getAppIndexPath(app);
      }

      if (requestPath.startsWith(route)) {
        const subPath = requestPath.slice(route.length);
        if (subPath === '') {
          return getAppIndexPath(app);
        }
        if (app.file) {
          return null;
        }
        return path.join(ROOT, app.dir, subPath);
      }
    }
  }

  return null;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, buildUrl());
  const requestPath = decodeURIComponent(url.pathname);

  for (const app of APPS) {
    for (const route of getAppRoutes(app)) {
      const routeWithoutSlash = route.replace(/\/$/, '');
      if (requestPath === routeWithoutSlash) {
        res.writeHead(301, { Location: app.route });
        res.end();
        return;
      }
    }
  }

  const filePath = resolveFilePath(requestPath);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('Arquivo não encontrado');
    return;
  }

  const normalizedPath = path.normalize(filePath);
  const normalizedRoot = path.normalize(ROOT);

  if (!normalizedPath.startsWith(normalizedRoot)) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('Requisição inválida');
    return;
  }

  fs.stat(normalizedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Arquivo não encontrado');
      return;
    }

    const ext = path.extname(normalizedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(normalizedPath).pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso em ${buildUrl()}. Pare o processo em execução ou escolha outra porta.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, BIND_HOST, () => {
  const appPaths = APPS.map((app) => app.route);

  console.log(`Servidor unificado rodando em ${buildUrl()}`);
  console.log(`Aplicativos disponíveis: ${appPaths.join(', ')}`);
  console.log(`Landing page: ${buildUrl('/landing_page/')}`);
  console.log(`Dashboard: ${buildUrl('/mis_dashboard/')}`);
  console.log(`Pendências: ${buildUrl('/mis_pendências/')}`);
  console.log(`Alertas: ${buildUrl('/alertas/')}`);
  console.log(`Atualizações: ${buildUrl('/atualizacoes/')}`);
});
