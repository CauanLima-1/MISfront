const DEFAULT_HOST = process.env.HOST || 'localhost';
const DEFAULT_PORT = Number(process.env.PORT || 3000);

const APPS = [
  {
    name: 'dashboard',
    alias: 'mis_dashboard',
    route: '/mis_dashboard/',
    dir: 'mis_dashboard'
  },
  {
    name: 'pendencias',
    alias: 'mis_pendências',
    route: '/mis_pendências/',
    dir: 'mis_pendências'
  }
];

function buildUrl(path = '') {
  return `http://${DEFAULT_HOST}:${DEFAULT_PORT}${path}`;
}

module.exports = {
  HOST: DEFAULT_HOST,
  PORT: DEFAULT_PORT,
  APPS,
  buildUrl
};
