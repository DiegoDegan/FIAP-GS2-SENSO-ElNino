import './styles.css';

// Chip selector de culturas — filtra cards e ribbons pelo data-crop.
// Entrada: blur+translateY crossfade, 200ms var(--ease-out), stagger 60ms via
// --stagger-i. Saída: blur+scale, 150ms ease-in, sem stagger — display:none só
// depois da transição (imediato cancelaria a animação de saída).
const EXIT_MS = 150;

function initCropFilter() {
  const chipContainer = document.querySelector('[data-crop-chips]');
  if (!chipContainer) return;

  const chips = chipContainer.querySelectorAll('.crop-chip');
  const cards = [...document.querySelectorAll('[data-crop-cards] .crop-card')];
  const ribbons = [...document.querySelectorAll('[data-crop-ribbons] .crop-ribbon')];
  const all = [...cards, ...ribbons];

  function applyFilter(selected) {
    const entering = [];

    all.forEach((el) => {
      const matches = selected === 'all' || el.dataset.crop === selected;
      const isHidden = el.hidden;
      const isExiting = el.dataset.state === 'exiting';

      if (matches && (isHidden || isExiting)) {
        // Vinha escondido (display:none ou em saída) — entrar
        el.hidden = false;
        el.dataset.state = 'hidden'; // estado pré-entrada: opacity 0, blur 4px, translateY 6px
        entering.push(el);
      } else if (!matches && !isHidden && !isExiting) {
        // Estava visível — sair
        el.dataset.state = 'exiting'; // opacity 0, blur 2px, scale 0.97 — 150ms ease-in
        setTimeout(() => {
          // só remove do layout se ainda estiver marcado como "exiting"
          if (el.dataset.state === 'exiting') {
            el.hidden = true;
            delete el.dataset.state;
          }
        }, EXIT_MS);
      }
    });

    // Stagger por tipo (cards e ribbons independentes — primeira ribbon
    // anima junto com primeiro card, não depois dos 3 cards)
    const enteringCards = entering.filter((el) => el.classList.contains('crop-card'));
    const enteringRibbons = entering.filter((el) => el.classList.contains('crop-ribbon'));
    enteringCards.forEach((el, i) => el.style.setProperty('--stagger-i', i));
    enteringRibbons.forEach((el, i) => el.style.setProperty('--stagger-i', i));

    // Duplo RAF: garante que o navegador pinta o estado "hidden" (pré-entrada)
    // antes de remover o atributo e triggerar a transição para o estado visível
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        entering.forEach((el) => delete el.dataset.state);
      });
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const target = chip.dataset.crop;
      chips.forEach((c) => c.setAttribute('aria-selected', String(c === chip)));
      applyFilter(target);
    });
  });
}

document.addEventListener('DOMContentLoaded', initCropFilter);
