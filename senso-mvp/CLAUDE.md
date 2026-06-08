# CLAUDE.md — senso-mvp (Frontend do pitch)

Este é o frontend do projeto S.ENSO. **Não é o notebook** — o notebook fica em `../` (raiz do repo) e tem seu próprio CLAUDE.md com convenções de dados/Python. Aqui só vivem as 3 telas HTML do pitch.

## O que é

Um **mockup interativo** em Vite multi-page, sem backend, sem API real. As 3 telas existem para a apresentação do GS2:
- `index.html` — landing pública "O sinal do Pacífico, em linguagem de ação"
- `agricultor.html` — painel mobile do Sr. João (Quixadá-CE / Lajeado-RS)
- `gestor.html` — dashboard desktop com sidebar (Defesa Civil municipal)

Os dados exibidos são **hardcoded** a partir das saídas do notebook. Nada é buscado em runtime. Quando o notebook publicar números novos, transcreva manualmente para o HTML.

## Stack

- **Vite 6** em modo multi-page (3 entrypoints declarados em `vite.config.js`).
- **Tailwind v3** com `darkMode: 'class'`. Tokens em `tailwind.config.js` — esta é a **fonte única**.
- **Vanilla JS nos dashboards** (`agricultor.js`, `gestor.js`) — sem React, Vue, framework. Cada tela carrega só o JS dela.
- **GSAP + Lenis isolados na landing** (`landing.js`) — importados APENAS aqui. Vite tree-shake garante que os dashboards não puxem o peso. Ver seção **Surfaces** abaixo.
- **PostCSS + Autoprefixer**.
- Fonts via Google Fonts CDN (Inter + JetBrains Mono + Material Symbols).

```powershell
cd senso-mvp
npm install
npm run dev      # http://localhost:5173/  (use /agricultor.html, /gestor.html)
npm run build
```

## Estrutura

```
senso-mvp/
├── CLAUDE.md            # este arquivo
├── package.json
├── vite.config.js       # entries: index, agricultor, gestor
├── tailwind.config.js   # ÚNICA fonte de tokens
├── postcss.config.js
├── index.html           # landing (Passo 3)
├── agricultor.html      # painel mobile (Passo 2)
├── gestor.html          # dashboard desktop (Passo 4)
├── src/
│   ├── styles.css       # @tailwind + utilitários + estados (.crop-card[data-state], .hold-confirm, etc.)
│   ├── landing.js       # CINEMATIC: boot Lenis + GSAP + ScrollTrigger; hero timeline; reveals
│   ├── agricultor.js    # OPERATIONAL: chip filter (stagger + blur); vanilla
│   └── gestor.js        # OPERATIONAL: tabs + seletor município + score arc + hold-to-confirm
├── assets/
│   ├── logo-static.svg          # cabeçalhos light, identidade fixa
│   ├── logo-static-dark.svg     # cabeçalhos sobre fundo escuro (ocean-deep)
│   ├── logo-animated.svg        # landing, light
│   └── logo-animated-dark.svg   # landing, ocean-deep
└── public/
    └── planeta.mp4              # vídeo de fundo do hero (3.3MB MP4/H.264, sem áudio).
                                 # Referenciado em index.html como /planeta.mp4
                                 # Fallback: orbital-glow + sinusoidal-pattern se o vídeo falhar.
```

## Tokens (não invente — sempre via Tailwind)

Cores em `tailwind.config.js → theme.extend.colors`. As três famílias que importam:

- **Institucionais** — `primary` (#00274a azul-oceano), `secondary` (#00668a azul-ciano), `ocean-deep` (#0B172A para covers), `wave-blue` / `wave-orange` (séries de dados).
- **Alertas funcionais** (escala de risco — **nunca decorativa**): `alert-success` (Verde · Normal), `alert-warning` (Amarelo · Atenção), `alert-danger` (Laranja · Alto), `alert-critical` (Vermelho · Crítico).
- **Neutros** — `surface`, `surface-container-*`, `neutral-dark`, `neutral-mid`, `neutral-line`.

Tipografia (já mapeada em `font-*` e `text-*`):
- `font-headline-h1` / `font-headline-h1-mobile` / `font-subtitle-h2` / `font-body-md` / `font-label-caps` → Inter.
- `font-data-tabular` / `font-data-compact` → JetBrains Mono. **Obrigatório** para qualquer número (ONI, anomalias, score, datas, coordenadas).
- `label-caps` (11px, 0.32em tracking) para tags técnicas (`SINAL · PACÍFICO`, etc).

Spacing customizado: `px-margin-mobile` (20px) e `px-margin-desktop` (40px) nos contêineres principais; `gap-gutter` (16px) padrão.

## Surfaces — duas filosofias, uma codebase

O projeto tem **duas personalidades** intencionais. Não misturar.

### Cinematic surface — `index.html` (landing)

Marketing público. O usuário ROLA por prazer e quer ser convencido. Toolkit:

- **Motion**: GSAP + ScrollTrigger. Use `gsap.timeline()` para sequenciar reveals.
- **Scroll**: Lenis para smooth scroll. Integrar com ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t * 1000))`.
- **Ease**: SOMENTE `power3.out` (entrada/saída) e `expo.out`/`expo.inOut` (scrubs longos). Nunca `ease`, `linear` (exceto progress bars), ou as built-ins de CSS.
- **Duração mínima 0.6s** em qualquer reveal/transição da landing. Pin scroll pode usar `scrub: 1` (sem duração fixa).
- **Marker opt-in**: elementos cinematic recebem `[data-cinematic]` para JS de boot ignorar quem não é.
- **Mobile**: Lenis com `smoothTouch: false, syncTouch: false`; pin scroll com `pinType: 'transform'`; `ScrollTrigger.config({ ignoreMobileResize: true })`.
- **Reduced motion**: skip Lenis inteiro, timelines viram `gsap.set(...)` no estado final, pin scrub vira switch instantâneo no `start`.

### Operational surface — `agricultor.html`, `gestor.html` (dashboards)

Ferramenta para usuário sob pressão (Sr. João decidindo plantio, gestor da Defesa Civil ativando sirenes). Velocidade > beleza. Toolkit:

- **Motion**: vanilla CSS/JS. **Sem GSAP. Sem Lenis.** Importar essas libs em `agricultor.js` ou `gestor.js` é um bug.
- **Ease**: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` (Emil custom — já é o `ease-out` global do Tailwind). `--ease-drawer` em casos raros (score arc).
- **Duração**: ≤ 300ms em hover/state, ≤ 200ms em microinteração. Exceções pontuais (score arc 600ms) precisam justificativa.
- **`active:scale-[0.97]`** em todo botão clicável.
- **`animate-pulse`** limitado a `pulse-3` (3 iterações) — nunca infinito.
- **Hover** já vem gated em `@media (hover: hover)` via `hoverOnlyWhenSupported: true` no `tailwind.config.js`. Não precisa repetir nas classes.
- **Sem `position: fixed` com `backdrop-blur`** (custo de paint).
- **Hold-to-confirm** (`[data-hold-confirm]`) para ações destrutivas — padrão Emil de asymmetric timing (2s linear no press, 200ms ease-out no release).

### A regra de ouro

Se você está editando `index.html` ou `landing.js`, pense em **câmera**. Se está editando `agricultor.html`/`gestor.html` ou seus respectivos JS, pense em **terminal**. Não traga GSAP para o terminal. Não traga `transition-all` ou snappy 100ms para a câmera.

### Por que dashboards NÃO seguem a regra cinematic

A tentação ao revisar o projeto é "uniformizar" — aplicar `≥ 0.6s` e `power3.out` em tudo. **Não faça.** Os dashboards atendem:

- **Sr. João** decidindo plantio de manhã, com bateria fraca e luz solar na tela.
- **Coordenador da Defesa Civil** acionando sirenes municipais a 25.5m de cota do Taquari, com 5 minutos pra agir.

Em ambos os cenários, uma animação de 0.6s entre clicar e ver o resultado **atrapalha a tarefa**. O usuário operacional não quer cinema; quer feedback de que o sistema escutou. Por isso:

- Hold-to-confirm em ACIONAR SIRENES é 2s no press (deliberação), 200ms no release (resposta).
- Chip filter em culturas é 220ms (escolha rápida, sem suspense).
- Score arc é 600ms (exceção justificada — é o único "money shot" da operação, troca raramente).

Se uma proposta de "elevar a UX" do agricultor ou gestor entrar em conflito com essas durações, **rejeite**. A landing já vende; os dashboards entregam.

## Identidade visual (das telas)

- **Header padrão**: `bg-ocean-deep`, altura `h-16`, logo à esquerda dentro de `.logo-container` (controla SVG para 48px de altura).
- **Landing**: usa `logo-animated-dark.svg` no header sobre ocean-deep.
- **Agricultor**: usa `logo-animated-dark.svg` no header (mobile, header fixo, 58px — mesmo tamanho da landing).
- **Gestor**: usa `logo-static-dark.svg` na sidebar lateral.
- **Glow orbital**: `.orbital-glow` (gradiente radial cyan 15%). Usar em heros e cards-âncora, nunca em listas.
- **Sinusoidal pattern**: `.sinusoidal-pattern` (dots 12px, opacity 10%). Decorativo, sobre ocean-deep.
- **Rim highlight**: `.rim-highlight` (inset shadow 1px branca 10%) — para dar "peso 3D" em cards escuros.

## Conteúdo & idioma

- Tudo em **PT-BR**. Textos curtos, técnicos, operacionais.
- Municípios-piloto: **Quixadá-CE** (milho, seca) e **Lajeado-RS** (trigo, enchente). Nunca trocar sem alinhar com o notebook.
- Score de risco: escala **0–100** mapeada para **Verde / Amarelo / Laranja / Vermelho** (não introduzir 5º nível).
- Fases ENSO: 7 buckets (La Niña forte/fraca, Neutro, El Niño fraco/moderado/forte, Super El Niño).

## Referências

- `../Frontend/prototipo/s.enso_operational_identity/DESIGN.md` — design system completo (cores, tipografia, componentes).
- `../Frontend/prototipo/landing_page_s.enso_fixed_logo/code.html` — referência da landing.
- `../Frontend/prototipo/painel_do_agricultor_seu_jo_o_fixed_logo/code.html` — referência do agricultor.
- `../Frontend/prototipo/dashboard_do_gestor_lajeado_rs_fixed_logo/code.html` — referência do gestor.
- `../Escopo e Planos/Estrutura Dashboard.txt` — as 4 telas do pitch (a 4ª, "Apresentação", não está neste MVP).
- `../CLAUDE.md` (raiz) — convenções do notebook; útil quando precisar transcrever números.
