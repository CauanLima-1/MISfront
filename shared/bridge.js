const SHARED_STATE_KEY = 'mis-shared-state';

function renderSharedState(state) {
  return state;
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

