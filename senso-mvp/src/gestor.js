import './styles.css';

// ---------------------------------------------------------------------------
// Dados — hardcoded a partir das saídas do notebook (transcrição manual).
// ---------------------------------------------------------------------------
// Paleta dos níveis de risco (escala 0–100 → Verde / Amarelo / Laranja / Vermelho).
// Cores aplicadas via style inline pra não depender de class-name dinâmico
// (que seria purgado pelo Tailwind).
const RISK_LEVELS = [
  { max: 25, label: 'BAIXO', color: '#2E7D32' }, // alert-success
  { max: 50, label: 'MODERADO', color: '#F9A825' }, // alert-warning
  { max: 75, label: 'ALTO', color: '#E65100' }, // alert-danger
  { max: 100, label: 'CRÍTICO', color: '#B71C1C' }, // alert-critical
];

const BAND_COLOR = {
  success: '#2E7D32',
  warning: '#F9A825',
  critical: '#B71C1C',
  gap: 'transparent',
};

const DECREE_BADGE = {
  CALAMIDADE: { bg: 'bg-alert-critical/10', text: 'text-alert-critical' },
  EMERGENCIA: { bg: 'bg-alert-warning/10', text: 'text-alert-warning' },
  NORMAL: { bg: '', text: 'text-on-surface-variant' },
};

const MUNICIPIOS = {
  lajeado: {
    nome: 'Lajeado',
    uf: 'RS',
    titulo: 'PAINEL MUNICIPAL',
    subtitulo: 'Setor Lajeado-RS',
    score: 62,
    descricao:
      'Projeção para outubro/2026 aponta score 61,7/100 — janela crítica set–nov com excedente hídrico projetado de até +81% sobre a média histórica, caso o El Niño se intensifique conforme os modelos do IRI/NOAA.',
    decretosTotal: 9,
    recomendacao: {
      titulo: 'Recomendação técnica: Ativação Fase 3 — Monitoramento Intensivo',
      corpo: 'Modelos do IRI/NOAA indicam 65% de chance de intensificação para Super El Niño até outubro. Nesse cenário, a regressão local projeta cerca de +141mm de chuva acumulada na bacia do Taquari-Antas a cada grau de anomalia ONI, e a integral da janela crítica (set–nov) aponta excedente hídrico de até +81% sobre o período neutro. Recomenda-se reforçar o monitoramento da cota do rio e revisar preventivamente o Plano de Contingência Municipal (PLACON).',
      primario: 'ACIONAR ALERTA PREVENTIVO',
      secundario: 'BAIXAR RELATÓRIO COMPLETO',
    },
    culturas: [
      { nome: 'TRIGO', bandas: [
        { w: 40, c: 'success' }, { w: 30, c: 'warning' }, { w: 30, c: 'critical' },
      ] },
      { nome: 'SOJA', bandas: [
        { w: 10, c: 'gap' }, { w: 50, c: 'success' }, { w: 40, c: 'warning' },
      ] },
      { nome: 'ARROZ', bandas: [
        { w: 20, c: 'critical' }, { w: 50, c: 'success' }, { w: 30, c: 'warning' },
      ] },
    ],
    decretos: [
      { ano: 2015, tipo: 'NORMAL', oni: '+1.56', oniColor: 'text-alert-warning' },
      { ano: 2021, tipo: 'EMERGENCIA', oni: '-0.80', oniColor: 'text-wave-blue' },
      { ano: 2023, tipo: 'EMERGENCIA', oni: '+0.91', oniColor: 'text-alert-warning' },
      { ano: 2024, tipo: 'EMERGENCIA', oni: '+0.43', oniColor: 'text-alert-warning' },
    ],
  },
  quixada: {
    nome: 'Quixadá',
    uf: 'CE',
    titulo: 'PAINEL MUNICIPAL',
    subtitulo: 'Setor Quixadá-CE',
    score: 32,
    descricao:
      'Projeção para outubro/2026 aponta score 32,4/100 — El Niño Watch em aceleração (+0,35°C/mês), com 65% de chance de Super El Niño. A janela crítica de plantio (fev–abr) pede atenção redobrada.',
    decretosTotal: 11,
    recomendacao: {
      titulo: 'Recomendação técnica: Alerta Preventivo de Estiagem',
      corpo: 'O ONI está em +0,9°C e acelera a +0,35°C/mês — modelos do IRI/NOAA projetam 65% de chance de Super El Niño até outubro. A correlação com o Atlântico Tropical (AMM, r=+0,378, defasagem de 5 meses) é hoje o sinal mais forte para Quixadá — mais determinante que o Pacífico isolado. Recomenda-se monitorar a janela crítica de plantio (fev–abr), preparar a Operação Carro-Pipa e orientar produtores sobre cultivares mais resilientes (milho → sorgo).',
      primario: 'EMITIR ALERTA PREVENTIVO',
      secundario: 'EMITIR ALERTA AGRÍCOLA',
    },
    culturas: [
      { nome: 'MILHO', bandas: [
        { w: 15, c: 'success' }, { w: 50, c: 'critical' }, { w: 20, c: 'warning' },
      ] },
      { nome: 'FEIJÃO', bandas: [
        { w: 12, c: 'success' }, { w: 40, c: 'warning' }, { w: 25, c: 'gap' },
      ] },
      { nome: 'SORGO', bandas: [
        { w: 20, c: 'success' }, { w: 30, c: 'warning' }, { w: 35, c: 'success' },
      ] },
    ],
    decretos: [
      { ano: 2015, tipo: 'EMERGENCIA', oni: '+1.56', oniColor: 'text-alert-critical' },
      { ano: 2021, tipo: 'EMERGENCIA', oni: '-0.80', oniColor: 'text-wave-blue' },
      { ano: 2023, tipo: 'EMERGENCIA', oni: '+0.91', oniColor: 'text-alert-warning' },
      { ano: 2013, tipo: 'NORMAL', oni: '-0.24', oniColor: 'text-on-surface-variant' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Tab switching (sidebar 01/02/03)
// ---------------------------------------------------------------------------
const TAB_META = {
  '01': { title: 'PAINEL NACIONAL', subtitle: 'Visão Brasil' },
  '02': { title: 'PAINEL MUNICIPAL', subtitle: '—' },
  '03': { title: 'PREVISÃO', subtitle: 'Janela 14 dias' },
};

function initTabs() {
  const nav = document.querySelector('[data-tab-nav]');
  if (!nav) return;
  const buttons = nav.querySelectorAll('[data-tab-target]');
  const panels = document.querySelectorAll('[data-tab-panel]');
  const titleEl = document.querySelector('[data-tab-title]');
  const subtitleEl = document.querySelector('[data-tab-subtitle]');

  function activate(target) {
    buttons.forEach((b) =>
      b.setAttribute('aria-selected', String(b.dataset.tabTarget === target)),
    );
    panels.forEach((p) => {
      const match = p.dataset.tabPanel === target;
      p.hidden = !match;
    });
    const meta = TAB_META[target];
    if (meta) {
      titleEl.textContent = meta.title;
      // Tab 02 herda o subtitle do município ativo
      if (target !== '02') subtitleEl.textContent = meta.subtitle;
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => activate(btn.dataset.tabTarget));
  });
}

// ---------------------------------------------------------------------------
// Score circular SVG — dashoffset calculado a partir do score
// ---------------------------------------------------------------------------
const SCORE_RADIUS = 88;
const SCORE_CIRCUMFERENCE = 2 * Math.PI * SCORE_RADIUS; // ~552.92

function levelFor(score) {
  return RISK_LEVELS.find((l) => score <= l.max) ?? RISK_LEVELS[RISK_LEVELS.length - 1];
}

function renderScore(muni) {
  const arc = document.querySelector('[data-score-arc]');
  const valueEl = document.querySelector('[data-score-value]');
  const levelEl = document.querySelector('[data-score-level]');
  const descEl = document.querySelector('[data-score-description]');
  if (!arc || !valueEl || !levelEl || !descEl) return;

  const level = levelFor(muni.score);
  const offset = SCORE_CIRCUMFERENCE * (1 - muni.score / 100);

  arc.setAttribute('stroke-dashoffset', String(offset.toFixed(2)));
  arc.setAttribute('stroke', level.color);
  valueEl.textContent = String(muni.score);
  levelEl.textContent = level.label;
  levelEl.style.color = level.color;
  descEl.textContent = muni.descricao;
}

// ---------------------------------------------------------------------------
// Recommendation card — texto, cores e botões
// ---------------------------------------------------------------------------
function renderRecommendation(muni) {
  const card = document.querySelector('[data-recommendation-card]');
  const icon = document.querySelector('[data-recommendation-icon]');
  const title = document.querySelector('[data-recommendation-title]');
  const body = document.querySelector('[data-recommendation-body]');
  const primary = document.querySelector('[data-recommendation-primary]');
  const primaryText = primary?.querySelector('[data-hold-text]');
  const secondary = document.querySelector('[data-recommendation-secondary]');
  if (!card) return;

  const level = levelFor(muni.score);
  // background = cor do nível a 6% de opacidade. Hex → rgba.
  const r = parseInt(level.color.slice(1, 3), 16);
  const g = parseInt(level.color.slice(3, 5), 16);
  const b = parseInt(level.color.slice(5, 7), 16);
  card.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.06)`;
  card.style.borderColor = level.color;
  icon.style.backgroundColor = level.color;
  title.style.color = level.color;
  title.textContent = muni.recomendacao.titulo;
  body.textContent = muni.recomendacao.corpo;
  // Reset estado de confirmação ao trocar município
  primary.removeAttribute('data-confirmed');
  primary.removeAttribute('data-holding');
  primary.style.setProperty('--hold-confirm-color', level.color);
  if (primaryText) primaryText.textContent = muni.recomendacao.primario;
  secondary.textContent = muni.recomendacao.secundario;
}

// ---------------------------------------------------------------------------
// Agricultural calendar — rebuilds rows
// ---------------------------------------------------------------------------
function renderCalendar(muni) {
  const container = document.querySelector('[data-crop-rows]');
  if (!container) return;
  container.replaceChildren();

  muni.culturas.forEach((cultura) => {
    const row = document.createElement('div');
    row.className = 'grid grid-cols-4 items-center gap-4';

    const label = document.createElement('span');
    label.className = 'font-bold text-primary font-data-tabular';
    label.textContent = cultura.nome;

    const track = document.createElement('div');
    track.className =
      'col-span-3 h-4 bg-surface-container rounded-full relative overflow-hidden';

    let offset = 0;
    cultura.bandas.forEach((banda) => {
      const seg = document.createElement('div');
      seg.className = 'absolute top-0 bottom-0';
      seg.style.left = `${offset}%`;
      seg.style.width = `${banda.w}%`;
      seg.style.backgroundColor = BAND_COLOR[banda.c];
      track.appendChild(seg);
      offset += banda.w;
    });

    row.append(label, track);
    container.appendChild(row);
  });
}

// ---------------------------------------------------------------------------
// Decree history table
// ---------------------------------------------------------------------------
function renderDecrees(muni) {
  const tbody = document.querySelector('[data-decree-rows]');
  if (!tbody) return;
  tbody.replaceChildren();

  muni.decretos.forEach((d, idx) => {
    const tr = document.createElement('tr');
    const isLast = idx === muni.decretos.length - 1;
    tr.className = `${isLast ? '' : 'border-b border-neutral-line/30'} transition-colors duration-150 hover:bg-surface-container-low`;

    const tdAno = document.createElement('td');
    tdAno.className = 'p-3';
    tdAno.textContent = String(d.ano);

    const tdTipo = document.createElement('td');
    tdTipo.className = 'p-3';
    const badge = DECREE_BADGE[d.tipo] ?? DECREE_BADGE.NORMAL;
    if (d.tipo === 'NORMAL') {
      tdTipo.classList.add('text-on-surface-variant');
      tdTipo.textContent = 'NORMAL';
    } else {
      const span = document.createElement('span');
      span.className = `${badge.bg} ${badge.text} px-2 py-0.5 rounded text-[10px] font-bold`;
      span.textContent = d.tipo;
      tdTipo.appendChild(span);
    }

    const tdOni = document.createElement('td');
    tdOni.className = `p-3 ${d.oniColor}`;
    tdOni.textContent = d.oni;

    tr.append(tdAno, tdTipo, tdOni);
    tbody.appendChild(tr);
  });
}

// ---------------------------------------------------------------------------
// Municipality switching
// ---------------------------------------------------------------------------
function renderMunicipio(muniId) {
  const muni = MUNICIPIOS[muniId];
  if (!muni) return;

  document.querySelector('[data-muni-name]').textContent = `${muni.nome} · ${muni.uf}`;
  document.querySelector('[data-tab-subtitle]').textContent =
    `Setor ${muni.nome}-${muni.uf}`;
  document.querySelector('[data-kpi-decretos]').textContent = String(muni.decretosTotal);

  renderScore(muni);
  renderRecommendation(muni);
  renderCalendar(muni);
  renderDecrees(muni);
}

function initMuniSelector() {
  const selector = document.querySelector('[data-muni-selector]');
  if (!selector) return;
  const chips = selector.querySelectorAll('[data-muni]');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) =>
        c.setAttribute('aria-selected', String(c === chip)),
      );
      renderMunicipio(chip.dataset.muni);
    });
  });
}

// ---------------------------------------------------------------------------
// Hold-to-confirm — padrão Emil para ações destrutivas
// ---------------------------------------------------------------------------
// 2s linear no press (decisão deliberada), 200ms ease-out no release (resposta
// snappy). Em prefers-reduced-motion, vira clique simples (sem hold visual).
const HOLD_DURATION_MS = 2000;
const CONFIRMED_STATE_MS = 2400;

function initHoldConfirm() {
  const buttons = document.querySelectorAll('[data-hold-confirm]');
  buttons.forEach((btn) => {
    const textEl = btn.querySelector('[data-hold-text]');
    const originalText = textEl?.textContent ?? '';
    let timeoutId = null;
    let confirmTimeoutId = null;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function cleanup() {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      btn.removeAttribute('data-holding');
    }

    function confirm() {
      cleanup();
      btn.setAttribute('data-confirmed', 'true');
      const currentText = btn.querySelector('[data-hold-text]');
      const prev = currentText?.textContent ?? '';
      if (currentText) currentText.textContent = '✓ ACIONADO';
      if (confirmTimeoutId !== null) clearTimeout(confirmTimeoutId);
      confirmTimeoutId = setTimeout(() => {
        btn.removeAttribute('data-confirmed');
        if (currentText) currentText.textContent = prev;
      }, CONFIRMED_STATE_MS);
    }

    function start(e) {
      // Bloqueia se já confirmado ou em hold
      if (btn.dataset.confirmed === 'true' || btn.dataset.holding === 'true') return;
      e.preventDefault();
      if (prefersReduced) {
        confirm();
        return;
      }
      btn.setAttribute('data-holding', 'true');
      timeoutId = setTimeout(confirm, HOLD_DURATION_MS);
    }

    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', cleanup);
    btn.addEventListener('pointerleave', cleanup);
    btn.addEventListener('pointercancel', cleanup);
    // Acessibilidade keyboard: Enter/Space confirmam direto (hold não traduz)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        confirm();
      }
    });

    // Restaurar texto se renderRecommendation trocar enquanto está confirmado
    btn.addEventListener('senso:reset', () => {
      cleanup();
      btn.removeAttribute('data-confirmed');
      if (confirmTimeoutId !== null) clearTimeout(confirmTimeoutId);
      const currentText = btn.querySelector('[data-hold-text]');
      if (currentText) currentText.textContent = originalText;
    });
  });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initMuniSelector();
  initHoldConfirm();
  // Estado inicial: Painel Nacional (combina com aria-selected="true" no HTML)
  renderMunicipio('lajeado');
});
