const SHARED_STATE_KEY = 'mis-shared-state';

const banner = document.createElement('div');
banner.style.cssText = 'margin:12px 0;padding:10px 12px;border-radius:10px;border:1px solid rgba(96,165,250,0.28);background:rgba(14,116,144,0.16);color:#d0f2ff;font-size:12px;';

const host = document.querySelector('.content') || document.getElementById('root') || document.body;
if (host && host.parentNode && host !== document.body) {
  host.parentNode.insertBefore(banner, host);
} else if (host && host !== document.body) {
  host.prepend(banner);
} else {
  document.body.prepend(banner);
}

function renderSharedState(state) {
  if (!state) {
    banner.textContent = 'Nenhum estado compartilhado entre as telas ainda.';
    return;
  }

  const time = new Date(state.updatedAt).toLocaleTimeString('pt-BR');
  banner.textContent = `Comunicação ativa: ${state.message || state.page} (${time})`;
}

function saveSharedState(page, message, source) {
  const state = {
    page,
    source,
    message,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(SHARED_STATE_KEY, JSON.stringify(state));
  renderSharedState(state);
}

const config = window.MIS_SHARED_BRIDGE_CONFIG || {};
const source = config.source || 'unknown';

const storedState = (() => {
  try {
    return JSON.parse(localStorage.getItem(SHARED_STATE_KEY) || 'null');
  } catch (error) {
    return null;
  }
})();

if (!storedState) {
  saveSharedState(config.pageLabel || 'Tela', config.fallbackMessage || 'Tela ativa', source);
} else {
  renderSharedState(storedState);
}

window.addEventListener('storage', (event) => {
  if (event.key === SHARED_STATE_KEY && event.newValue) {
    try {
      renderSharedState(JSON.parse(event.newValue));
    } catch (error) {
      renderSharedState(null);
    }
  }
});

if (config.navLinkSelector && config.navMessage) {
  document.querySelectorAll(config.navLinkSelector).forEach(link => {
    link.addEventListener('click', () => {
      saveSharedState(config.navPageLabel || 'Outra tela', config.navMessage, source);
    });
  });
}

