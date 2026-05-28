/* ═══════════════════════════════════════════════
   MIS — main.js  |  Interactivity & Data Layer
   ═══════════════════════════════════════════════ */

/* ─── Portfolio Data ────────────────────────── */
const OBRAS = [
  {
    name: 'Residencial Aurora',
    location: 'Moema, SP',
    progress: 78,
    status: 'good',
    label: 'Em dia',
    bg: 'linear-gradient(155deg, #0353a4 0%, #0466c8 55%, #3a8fde 100%)'
  },
  {
    name: 'Ed. Corporate Tower',
    location: 'Brooklin, SP',
    progress: 42,
    status: 'warn',
    label: 'Atenção',
    bg: 'linear-gradient(155deg, #33415c 0%, #5c677d 60%, #7d8597 100%)'
  },
  {
    name: 'Complexo Industrial Norte',
    location: 'Guarulhos, SP',
    progress: 15,
    status: 'bad',
    label: 'Risco',
    bg: 'linear-gradient(155deg, #001233 0%, #001845 55%, #002855 100%)'
  },
  {
    name: 'Loft Vila Olímpia',
    location: 'Vila Olímpia, SP',
    progress: 93,
    status: 'good',
    label: 'Em dia',
    bg: 'linear-gradient(155deg, #023e7d 0%, #0353a4 60%, #0466c8 100%)'
  },
  {
    name: 'Cond. Sol Nascente',
    location: 'Alphaville, SP',
    progress: 57,
    status: 'warn',
    label: 'Atenção',
    bg: 'linear-gradient(155deg, #5c677d 0%, #33415c 100%)'
  }
];

/* ─── Status Color Map ──────────────────────── */
const STATUS_COLOR = { good: '#16a34a', warn: '#d97706', bad: '#dc2626' };

/* ─── Render Portfolio Rail ─────────────────── */
function renderPortfolio() {
  const rail = document.getElementById('portfolio-rail');
  if (!rail) return;

  OBRAS.forEach((obra, i) => {
    const item = document.createElement('div');
    item.className = 'rail-item' + (i === 0 ? ' active' : '');
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `${obra.name} — ${obra.label} — ${obra.progress}%`);

    const sc = STATUS_COLOR[obra.status];
    const grid = `
      <!-- structural grid lines -->
      <line x1="0"   y1="0"   x2="0"   y2="340" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
      <line x1="65"  y1="0"   x2="65"  y2="340" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
      <line x1="130" y1="0"   x2="130" y2="340" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
      <line x1="0"   y1="85"  x2="130" y2="85"  stroke="rgba(255,255,255,.06)" stroke-width="1"/>
      <line x1="0"   y1="170" x2="130" y2="170" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
      <line x1="0"   y1="255" x2="130" y2="255" stroke="rgba(255,255,255,.06)" stroke-width="1"/>
    `;

    /* SVG building silhouette */
    const svgs = [
      /* Aurora - tall residential */
      `<rect x="30" y="80"  width="70" height="200" rx="3" fill="rgba(255,255,255,.12)"/>
       <rect x="40" y="60"  width="50" height="30"  rx="2" fill="rgba(255,255,255,.1)"/>
       ${[0,1,2,3,4,5].map(r=>`${[0,1,2].map(c=>`<rect x="${42+c*16}" y="${90+r*28}" width="10" height="14" rx="1" fill="rgba(255,255,255,.18)"/>`).join('')}`).join('')}
       <rect x="25" y="270" width="80" height="10" rx="2" fill="rgba(255,255,255,.15)"/>`,
      /* Corporate Tower - glass */
      `<rect x="20" y="60"  width="90" height="230" rx="2" fill="rgba(255,255,255,.1)"/>
       <rect x="50" y="40"  width="30" height="25"  rx="2" fill="rgba(255,255,255,.08)"/>
       ${[0,1,2,3,4,5,6].map(r=>`${[0,1,2,3].map(c=>`<rect x="${24+c*22}" y="${68+r*28}" width="16" height="18" rx="1" fill="rgba(255,255,255,.${14+c})"/>`).join('')}`).join('')}
       <line x1="20" y1="290" x2="110" y2="290" stroke="rgba(255,255,255,.2)" stroke-width="2"/>`,
      /* Industrial - wide complex */
      `<rect x="5"  y="130" width="120" height="170" rx="2" fill="rgba(255,255,255,.1)"/>
       <rect x="35" y="100" width="60"  height="40"  rx="2" fill="rgba(255,255,255,.08)"/>
       <rect x="60" y="70"  width="10"  height="35"  rx="1" fill="rgba(255,255,255,.15)"/>
       ${[0,1,2,3].map(r=>`${[0,1,2,3,4].map(c=>`<rect x="${10+c*23}" y="${140+r*36}" width="16" height="22" rx="1" fill="rgba(255,255,255,.12)"/>`).join('')}`).join('')}`,
      /* Loft - modern low-rise */
      `<rect x="15" y="150" width="100" height="150" rx="3" fill="rgba(255,255,255,.12)"/>
       <rect x="15" y="120" width="65"  height="35"  rx="2" fill="rgba(255,255,255,.1)"/>
       <rect x="10" y="290" width="110" height="8"   rx="2" fill="rgba(255,255,255,.18)"/>
       ${[0,1,2].map(r=>`${[0,1,2,3].map(c=>`<rect x="${20+c*23}" y="${160+r*44}" width="16" height="28" rx="1" fill="rgba(255,255,255,.2)"/>`).join('')}`).join('')}`,
      /* Condominio - cluster */
      `<rect x="10" y="90"  width="48" height="210" rx="2" fill="rgba(255,255,255,.1)"/>
       <rect x="72" y="120" width="48" height="180" rx="2" fill="rgba(255,255,255,.1)"/>
       ${[0,1,2,3,4].map(r=>`
         <rect x="14" y="${100+r*36}" width="16" height="22" rx="1" fill="rgba(255,255,255,.16)"/>
         <rect x="34" y="${100+r*36}" width="16" height="22" rx="1" fill="rgba(255,255,255,.16)"/>
         <rect x="76" y="${130+r*30}" width="16" height="18" rx="1" fill="rgba(255,255,255,.16)"/>
         <rect x="96" y="${130+r*30}" width="16" height="18" rx="1" fill="rgba(255,255,255,.16)"/>`).join('')}
       <line x1="10" y1="298" x2="118" y2="298" stroke="rgba(255,255,255,.2)" stroke-width="2"/>`,
    ];

    item.innerHTML = `
      <div class="rail-bg" style="background:${obra.bg}">
        <svg viewBox="0 0 130 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0">
          ${grid}
          ${svgs[i] || ''}
        </svg>
      </div>
      <div class="rail-meta">
        <div class="status-badge">
          <span style="width:7px;height:7px;border-radius:50%;background:${sc};display:inline-block;flex-shrink:0"></span>
          ${obra.label}
        </div>
        <h4>${obra.name}</h4>
        <p class="location">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          ${obra.location}
        </p>
        <div class="progress-wrap">
          <div class="progress-fill" style="width:${obra.progress}%;background:${sc}"></div>
        </div>
        <div class="progress-pct">${obra.progress}%</div>
      </div>
      <span class="rail-dot" style="background:${sc}"></span>
    `;

    item.addEventListener('click', () => toggleRailItem(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleRailItem(item); }
    });

    rail.appendChild(item);
  });
}

function toggleRailItem(item) {
  const rail  = item.closest('.rail');
  const items = rail.querySelectorAll('.rail-item');
  const was   = item.classList.contains('active');
  items.forEach(el => el.classList.remove('active'));
  if (!was) {
    item.classList.add('active');
    setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 50);
  }
}

/* ─── Step Navigation ───────────────────────── */
function initSteps() {
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
    step.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); step.click(); }
    });
  });
}

/* ─── Login Toggle ──────────────────────────── */
function showLogin() {
  const v = document.getElementById('login-view');
  v.classList.add('visible');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('email')?.focus(), 100);
}

function hideLogin() {
  const v = document.getElementById('login-view');
  v.classList.remove('visible');
  document.body.style.overflow = '';
}

/* ─── Password Toggle ───────────────────────── */
function togglePass() {
  const inp = document.getElementById('senha');
  const btn = document.querySelector('.toggle-pass');
  if (!inp) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  } else {
    inp.type = 'password';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
}

/* ─── Login Submit ──────────────────────────── */
function handleLogin(e) {
  if (e) e.preventDefault();
  const emailEl = document.getElementById('email');
  const btn     = document.getElementById('login-btn');
  if (!emailEl || !emailEl.value.includes('@')) {
    emailEl.style.borderColor = 'var(--bad)';
    emailEl.style.boxShadow   = '0 0 0 3px rgba(220,38,38,.12)';
    emailEl.focus();
    return;
  }
  btn.disabled   = true;
  btn.textContent = 'Entrando…';
  setTimeout(() => {
    window.location.href = '/MISfront/mis_feed/';
  }, 800);
}

/* ─── Scroll Animations ─────────────────────── */
function initScrollAnimations() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}

/* ─── Nav Active Link ───────────────────────── */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (match) match.style.color = 'var(--accent)';
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));
}

/* ─── Keyboard ESC ──────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') hideLogin();
});

/* ─── Init ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  initSteps();
  initScrollAnimations();
  initNavHighlight();
});
