const DEFAULT_HOST = process.env.HOST || 'localhost';
const BIND_HOST = process.env.BIND_HOST || '::';
const DEFAULT_PORT = Number(process.env.PORT || 3000);
const BASE_URL = `http://${DEFAULT_HOST}:${DEFAULT_PORT}`;

const APPS = [
  {
    name: 'landing_page',
    alias: 'landing_page',
    route: '/landing_page/',
    dir: 'landing_page'
  },
  {
    name: 'dashboard',
    alias: 'mis_dashboard',
    route: '/mis_dashboard/',
    dir: 'mis_dashboard'
  },
  {
    name: 'pendencias',
    alias: 'mis_pendencias',
    route: '/mis_pendências/',
    aliasRoutes: ['/mis_pendencias/'],
    dir: 'mis_pendências'
  },
  {
    name: 'alertas',
    alias: 'alertas',
    route: '/alertas/',
    file: 'Alertas.html'
  },
  {
    name: 'atualizacoes',
    alias: 'atualizacoes',
    route: '/atualizacoes/',
    file: 'Atualizações.html'
  }
];

function buildUrl(path = '') {
  return `${BASE_URL}${path}`;
}

module.exports = {
  HOST: DEFAULT_HOST,
  BIND_HOST,
  PORT: DEFAULT_PORT,
  BASE_URL,
  APPS,
  buildUrl
};
