import './styles.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// CINEMATIC surface — landing/hero
// ---------------------------------------------------------------------------
// Regras (ver CLAUDE.md → Surfaces):
//   - Ease: power3.out / expo.out apenas.
//   - Duração ≥ 0.6s em reveals.
//   - prefers-reduced-motion: skip timelines, mostra estado final.
//   - GSAP/Lenis NÃO podem aparecer em agricultor.js ou gestor.js.
// ---------------------------------------------------------------------------

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// Lenis × ScrollTrigger — boot global de scroll
// ---------------------------------------------------------------------------
// Smooth scroll só em wheel/desktop. Touch fica nativo pra evitar conflito com
// pin-scroll em iOS Safari. ScrollTrigger sincronizado via RAF do GSAP ticker
// (não usa o RAF interno do Lenis — evita dois loops em paralelo).
// ---------------------------------------------------------------------------
function initSmoothScroll() {
  if (prefersReducedMotion) {
    // Reduced motion: scroll nativo, ScrollTrigger configura tudo como switch
    // instantâneo no start (sem scrub).
    ScrollTrigger.config({ ignoreMobileResize: true });
    return null;
  }

  const lenis = new Lenis({
    smoothWheel: true,
    smoothTouch: false,
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
  });

  // Lenis dispara `scroll` event → ScrollTrigger atualiza
  lenis.on('scroll', ScrollTrigger.update);

  // GSAP ticker rege o RAF do Lenis (um único loop)
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Mobile: ignora resize causado pela barra do Safari aparecendo/sumindo
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Refresh em resize (pin spacing precisa recalcular)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });

  return lenis;
}

// ---------------------------------------------------------------------------
// Scroll-to via data-scroll-to="<selector>"
// ---------------------------------------------------------------------------
// Atalho declarativo: qualquer elemento com [data-scroll-to] vira link de
// scroll suave pro selector indicado. Compensa o header fixo via offset.
// ---------------------------------------------------------------------------
const HEADER_OFFSET_PX = 90; // header h-[74px] + folga visual

function initScrollToButtons(lenis) {
  const buttons = document.querySelectorAll('[data-scroll-to]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = document.querySelector(btn.dataset.scrollTo);
      if (!target) return;
      e.preventDefault();

      if (lenis) {
        // Lenis: scroll smooth controlado, com offset negativo (sobe acima do alvo)
        lenis.scrollTo(target, { offset: -HEADER_OFFSET_PX, duration: 1.4 });
      } else {
        // Reduced motion ou fallback — scroll nativo (jump direto)
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Earth video — fade-in no canplay, fallback gracioso se asset não existir
// ---------------------------------------------------------------------------
const VIDEO_LOAD_TIMEOUT_MS = 3000;

function initEarthVideo() {
  const video = document.querySelector('[data-earth-bg]');
  if (!video) return;
  if (prefersReducedMotion) {
    video.remove();
    return;
  }

  // 0.5x — planeta gira em câmera lenta, reforça vibe cinematic
  video.playbackRate = 0.5;

  let fallbackTimer = null;
  let resolved = false;

  function fail() {
    if (resolved) return;
    resolved = true;
    clearTimeout(fallbackTimer);
    // Sem vídeo: remove o elemento e intensifica o overlay glow via classe
    video.remove();
    document.querySelector('[data-cinematic="hero"]')?.classList.add('hero-video-failed');
  }

  function succeed() {
    if (resolved) return;
    resolved = true;
    clearTimeout(fallbackTimer);
    gsap.to(video, { opacity: 1, duration: 1.2, ease: 'power3.out' });
  }

  // Falha explícita: erro de carregamento OU nenhuma source disponível
  video.addEventListener('error', fail);
  video.querySelectorAll('source').forEach((s) => s.addEventListener('error', fail));

  // Sucesso: primeiro frame disponível para tocar
  video.addEventListener('canplay', succeed, { once: true });

  // Fallback duro: se nada acontece em 3s, considera fracasso
  fallbackTimer = setTimeout(fail, VIDEO_LOAD_TIMEOUT_MS);
}

// ---------------------------------------------------------------------------
// Hero entrance timeline — sequência de reveals
// ---------------------------------------------------------------------------
// t=0   → 0.6s: tensão, só o pattern e o vídeo (se carregar)
// t=0.6 → pre-line sobe (clip-path mask), 0.8s power3.out
// t=1.4 → H1 word-by-word, stagger 0.08s, 0.7s cada
// t=2.2 → subtitle + CTAs sobem juntos, 0.7s power3.out
// t=2.9 → scroll indicator entra
// ---------------------------------------------------------------------------
function buildHeroTimeline() {
  if (prefersReducedMotion) {
    // Limpa estados iniciais já neutralizados pelo CSS — nada a fazer
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Pre-line: clip-path mask sobe revelando o texto. 1.0s pra dar tempo do
  // olho registrar o "selo institucional" antes do título atacar.
  tl.fromTo(
    '[data-hero-preline]',
    { opacity: 0, y: 24, clipPath: 'inset(0 0 100% 0)' },
    { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.0 },
    0.6,
  );

  // H1 word-by-word. expo.out (no lugar do power3.out default) dá um settle
  // mais lento no fim — combina com a transição "blur → claro" (letras se
  // assentam). 14 palavras com stagger 0.07s = ~0.9s de cascata.
  tl.to(
    '[data-hero-word]',
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.07,
      ease: 'expo.out',
    },
    1.6,
  );

  // Subtitle + CTAs sobem juntos (mais peso ao "promessa+ação" como bloco).
  // Entra após o H1 ter respiro (última palavra termina ~3.3s).
  tl.to(
    '[data-hero-subtitle], [data-hero-ctas]',
    { opacity: 1, y: 0, duration: 0.7 },
    2.8,
  );

  // Scroll indicator entra por último, dando "permissão" pra rolar
  tl.to('[data-scroll-indicator]', { opacity: 1, y: 0, duration: 0.6 }, 3.5);

  return tl;
}

// ---------------------------------------------------------------------------
// Anéis orbitais — rotação contínua via GSAP (substitui o CSS animate-spin)
// Sem prefers-reduced-motion graças à checagem global.
// ---------------------------------------------------------------------------
function initOrbitalRings() {
  if (prefersReducedMotion) return;
  const rings = document.querySelectorAll('[data-orbital-ring]');
  rings.forEach((ring, i) => {
    // Anéis em direções opostas e velocidades diferentes
    gsap.to(ring, {
      rotation: i % 2 === 0 ? 360 : -360,
      duration: 60 + i * 20,
      repeat: -1,
      ease: 'none',
    });
  });
}

// ---------------------------------------------------------------------------
// Scroll indicator fade — some quando o hero sai do viewport
// IntersectionObserver é agnóstico de Lenis vs scroll nativo (Fase 4 friendly)
// ---------------------------------------------------------------------------
function initScrollIndicator() {
  const indicator = document.querySelector('[data-scroll-indicator]');
  if (!indicator) return;
  const hero = document.querySelector('[data-cinematic="hero"]');
  if (!hero) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      const visible = entry.intersectionRatio > 0.5;
      gsap.to(indicator, {
        opacity: visible ? 1 : 0,
        y: visible ? 0 : -12,
        duration: 0.6,
        ease: 'power3.out',
      });
    },
    { threshold: [0.5] },
  );
  io.observe(hero);
}

// ---------------------------------------------------------------------------
// Pitch section — iframe YouTube + reveal-on-scroll
// ---------------------------------------------------------------------------
// Mantém placeholder enquanto data-youtube-id ainda for o sentinel.
// Quando substituído por um ID real, carrega o embed do YouTube.
// ---------------------------------------------------------------------------
const YOUTUBE_ID_SENTINEL = 'YOUR_VIDEO_ID_HERE';

function initPitchEmbed() {
  const iframe = document.querySelector('[data-youtube-iframe]');
  if (!iframe) return;
  const id = iframe.dataset.youtubeId;
  if (!id || id === YOUTUBE_ID_SENTINEL) return; // mantém placeholder

  const placeholder = document.querySelector('[data-pitch-placeholder]');
  // rel=0 + modestbranding=1 = embed mais limpo
  iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0&modestbranding=1`;
  if (placeholder) placeholder.remove();
}

// Reveal genérico pra sections de conteúdo (acontecendo agora, El Niño 30s, cost).
// Cada seleciona via attr próprio; entra com label → title → subtitle → stats (stagger).
function initContentSectionReveal({ sectionSelector, labelSel, titleSel, subtitleSel, statsSel }) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;
  if (prefersReducedMotion) return;

  const label = labelSel ? section.querySelector(labelSel) : null;
  const title = titleSel ? section.querySelector(titleSel) : null;
  const subtitle = subtitleSel ? section.querySelector(subtitleSel) : null;
  const stats = statsSel ? section.querySelectorAll(statsSel) : [];

  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (label) tl.to(label, { opacity: 1, y: 0, duration: 0.6 }, 0);
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.8 }, 0.15);
      if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.7 }, 0.35);
      if (stats.length)
        tl.to(stats, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.5);
      io.disconnect();
    },
    { threshold: 0.25 },
  );
  io.observe(section);
}

function initPitchReveal() {
  const section = document.querySelector('[data-cinematic="pitch"]');
  if (!section) return;
  if (prefersReducedMotion) return; // CSS @media já mostra os estados finais

  const label = section.querySelector('[data-pitch-label]');
  const title = section.querySelector('[data-pitch-title]');
  const subtitle = section.querySelector('[data-pitch-subtitle]');
  const frame = section.querySelector('[data-pitch-frame]');

  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (label) tl.to(label, { opacity: 1, y: 0, duration: 0.6 }, 0);
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.8 }, 0.15);
      if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.7 }, 0.35);
      // Frame wipe — money shot da section. 1.4s + expo.out dá a sensação de
      // "cortina de monitor abrindo" em vez de "card aparecendo".
      if (frame) tl.to(frame, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'expo.out' }, 0.5);
      io.disconnect();
    },
    { threshold: 0.3 },
  );
  io.observe(section);
}

// ---------------------------------------------------------------------------
// Pin scroll — "Do Pacífico ao Território" (3 stages scrubbed)
// ---------------------------------------------------------------------------
// Pina a seção por 200% da altura do viewport. Durante esse scroll a timeline
// transiciona entre stage 0 → 1 → 2. Power3.out + stagger 0.2s entre filhos.
// Mobile: pinType 'transform' evita jank em iOS Safari.
// ---------------------------------------------------------------------------
function initPinScroll() {
  if (prefersReducedMotion) return; // CSS converte o pin em fluxo vertical

  const section = document.querySelector('[data-cinematic="pin"]');
  const trigger = section?.querySelector('[data-pin-trigger]');
  if (!trigger) return;

  const labels = [
    trigger.querySelector('[data-stage-label="0"]'),
    trigger.querySelector('[data-stage-label="1"]'),
    trigger.querySelector('[data-stage-label="2"]'),
  ];
  const visuals = [
    trigger.querySelector('[data-stage-visual="0"]'),
    trigger.querySelector('[data-stage-visual="1"]'),
    trigger.querySelector('[data-stage-visual="2"]'),
  ];
  const dotFills = [
    trigger.querySelector('[data-stage-dot="0"] span'),
    trigger.querySelector('[data-stage-dot="1"] span'),
    trigger.querySelector('[data-stage-dot="2"] span'),
  ];

  // Estado inicial: stage 0 visível, 1 e 2 escondidos abaixo
  gsap.set([labels[1], labels[2]], { opacity: 0, y: 32 });
  gsap.set([visuals[1], visuals[2]], { opacity: 0, scale: 0.94 });

  // expo.inOut no scrub: curva simétrica que combina com o gesto bidirecional
  // do scroll (pra cima e pra baixo). power3.out daria sensação "discreta"
  // entre stages; inOut suaviza tanto o "soltar" do anterior quanto o
  // "entrar" do novo, parecendo mais um corte de câmera contínuo.
  const tl = gsap.timeline({
    defaults: { ease: 'expo.inOut' },
    scrollTrigger: {
      trigger: trigger,
      start: 'top top',
      end: '+=200%',
      pin: true,
      pinType: 'transform',
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // ── Segmento 0 → 1 (primeiro terço do scroll) ──
  // Dot 0 enche enquanto stage 0 sai
  tl.to(dotFills[0], { scaleX: 1, ease: 'none', duration: 1 }, 0);
  tl.to(labels[0], { opacity: 0, y: -32, duration: 1 }, 0);
  tl.to(visuals[0], { opacity: 0, scale: 1.04, duration: 1 }, 0);
  tl.to(visuals[1], { opacity: 1, scale: 1, duration: 1 }, 0.2);
  tl.to(labels[1], { opacity: 1, y: 0, duration: 1 }, 0.4);

  // ── Segmento 1 → 2 (segundo terço) ──
  tl.to(dotFills[1], { scaleX: 1, ease: 'none', duration: 1 }, 1);
  tl.to(labels[1], { opacity: 0, y: -32, duration: 1 }, 1);
  tl.to(visuals[1], { opacity: 0, scale: 1.04, duration: 1 }, 1);
  tl.to(visuals[2], { opacity: 1, scale: 1, duration: 1 }, 1.2);
  tl.to(labels[2], { opacity: 1, y: 0, duration: 1 }, 1.4);

  // ── Hold no stage 2 (terço final) — dot 2 enche pra dar fechamento ──
  tl.to(dotFills[2], { scaleX: 1, ease: 'none', duration: 1 }, 2);
}

// ---------------------------------------------------------------------------
// Legacy operacional — preservar comportamentos não-cinematic
// ---------------------------------------------------------------------------

// Header ganha leve glass-blur ao rolar (microinteração — fica fora do regime
// cinematic; é responsividade pura de UI).
function initHeaderScroll() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  let ticking = false;
  function update() {
    const scrolled = window.scrollY > 20;
    header.classList.toggle('backdrop-blur-md', scrolled);
    header.classList.toggle('bg-ocean-deep/95', scrolled);
    ticking = false;
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
}

// Tilt 3D dos cards CTA — pointer fino apenas
function initCardTilt() {
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsFinePointer || prefersReducedMotion) return;

  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach((card) => {
    card.style.transition = 'transform 150ms var(--ease-out)';
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width - 0.5) * 4;
      const yPercent = (y / rect.height - 0.5) * -4;
      card.style.transform = `perspective(1000px) rotateX(${yPercent}deg) rotateY(${xPercent}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Scroll engine ANTES de qualquer ScrollTrigger (Fase 3 depende disso)
  const lenis = initSmoothScroll();

  initScrollToButtons(lenis);
  initEarthVideo();
  initOrbitalRings();
  buildHeroTimeline();
  initScrollIndicator();
  initPitchEmbed();
  initPitchReveal();

  // Sections novas de conteúdo (estado atual, explicação, custo)
  initContentSectionReveal({
    sectionSelector: '[data-cinematic="now"]',
    labelSel: '[data-now-label]',
    titleSel: '[data-now-title]',
    subtitleSel: '[data-now-subtitle]',
    statsSel: '[data-now-stat]',
  });
  initContentSectionReveal({
    sectionSelector: '[data-cinematic="explain"]',
    labelSel: '[data-explain-label]',
    titleSel: '[data-explain-title]',
    subtitleSel: '[data-explain-body]',
  });
  initContentSectionReveal({
    sectionSelector: '[data-cinematic="cost"]',
    labelSel: '[data-cost-label]',
    titleSel: '[data-cost-title]',
    statsSel: '[data-cost-stat], [data-cost-quote]',
  });

  initPinScroll();
  initHeaderScroll();
  initCardTilt();
});
