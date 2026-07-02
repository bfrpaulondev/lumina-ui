/**
 * Variants Explorer — deep technical breakdown of each variant.
 * v0.3.0 — redesigned with:
 *   - Visual comparator (all 6 variants side-by-side)
 *   - Interactive intensity selector (subtle/medium/intense/extreme)
 *   - Links to playground with variant pre-selected
 *   - Intensity explanation section
 */
import type { Route } from '../app';
import { el, sectionHead } from './_shared';

interface VariantInfo {
  name: string;
  visualDesc: string;
  technicalDesc: string;
  recommended: { intensity?: string; depth?: string; accent?: string };
  useCases: string[];
  cssTips: string[];
}

const SHARED_VARIANTS: VariantInfo[] = [
  {
    name: 'glass',
    visualDesc: 'Vidro fosco com blur sutil, saturação reforçada e brilho de borda.',
    technicalDesc:
      'Usa backdrop-filter: blur(14px) saturate(1.4) em uma superfície translúcida, com highlight inset para simular borda de vidro. Anel cônico aparece no hover.',
    recommended: { intensity: 'medium', depth: 'medium', accent: '#7c5cff' },
    useCases: [
      'Botões em landing pages premium',
      'Cards sobre backgrounds coloridos',
      'Toolbars flutuantes',
      'Modais sobre conteúdo rico',
    ],
    cssTips: [
      'Ajuste --lumina-surface-alpha (0..1) para mais/menos transparência',
      'Use backdrop-filter diferente via part="bg" para blur mais forte',
      'Combine com theme="light" sobre imagens claras',
    ],
  },
  {
    name: 'morph',
    visualDesc: 'Polígono que morfa entre pill e squircle no hover.',
    technicalDesc:
      'Anima clip-path polygon() com cubic-bezier(0.34, 1.56, 0.64, 1) spring easing. O elemento fica no fluxo normal; só a forma visual se transforma.',
    recommended: { intensity: 'intense', depth: 'flat', accent: '#78f0ff' },
    useCases: [
      'Botões de call-to-action únicos',
      'Badges de status com personalidade',
      'Cards com bordas vivas',
      'Tooltips com identidade',
    ],
    cssTips: [
      'Troque os pontos do clip-path para criar morphs próprios',
      'Combine com transition: border-radius para suavizar cantos',
      'Em Safari antigo use -webkit-clip-path',
    ],
  },
  {
    name: 'neural',
    visualDesc: 'Superfície translúcida com rede viva de partículas conectadas.',
    technicalDesc:
      'Um canvas com campo de partículas roda atrás da superfície. Cada partícula deriva; pares a menos de 90px recebem uma linha conectora cuja opacidade escala com a distância inversa. rAF-driven, HiDPI.',
    recommended: { intensity: 'intense', depth: 'medium', accent: '#ff6ec7' },
    useCases: [
      'Hero sections de produtos tech/IA',
      'Dashboards analíticos',
      'Cards de feature "inteligente"',
      'Botões de ações neurais / smart',
    ],
    cssTips: [
      'Reduza --lumina-intensity para 0.4 em ambientes com várias instâncias',
      'Mude --lumina-accent-rgb para colorir as partículas',
      'Pause o campo em prefers-reduced-motion (já é automático)',
    ],
  },
  {
    name: 'void',
    visualDesc: 'Superfície preta profunda com starfield e glow de aberração cromática.',
    technicalDesc:
      'Background canvas renderiza pontos de estrela com wrap-around. Texto recebe text-shadow split em vermelho e ciano (aberração cromática). Borda usa accent translúcido a 0.2 alpha.',
    recommended: { intensity: 'extreme', depth: 'deep', accent: '#78f0ff' },
    useCases: [
      'Modos escuros premium / "pro tools"',
      'Telas de boot, splash, init',
      'Componentes em sites de tecnologia espacial/futurista',
      'Status de erro crítico ou alerta',
    ],
    cssTips: [
      'Ajuste os offsets de text-shadow para mais/menos aberração',
      'Use accent colors frias (#78f0ff, #00ff95) para combinar com o tema',
      'Sobreponha void com container void para efeito mais profundo',
    ],
  },
  {
    name: 'aura',
    visualDesc: 'Elemento flutuante com aura radial suave que respira ao redor.',
    technicalDesc:
      'Um pseudo-elemento radial-gradient com blur 20px fica atrás da superfície. O host anima com keyframe translateY 4s. No hover a aura intensifica conforme --lumina-intensity.',
    recommended: { intensity: 'intense', depth: 'medium', accent: '#ffd166' },
    useCases: [
      'Hero CTAs que precisam "respirar"',
      'Cards de destaque / featured',
      'Badges "live" / "new"',
      'Toggle de funcionalidades premium',
    ],
    cssTips: [
      'Mude a keyframe float para 6-8s se quiser mais suave',
      'Combine accent warm (#ffd166, #ff6ec7) para auras mais vivas',
      'Aumente blur(20px) para aura mais difusa',
    ],
  },
  {
    name: 'dimensional',
    visualDesc: 'Elemento 3D extrudado com sheen de parallax e sombra de profundidade.',
    technicalDesc:
      'Usa CSS transform-style: preserve-3d, perspective(800px) e rotateX/Y controlados por pointer. O bg carrega translateZ depth shadow usando --lumina-depth. Sheen gradient no hover.',
    recommended: { intensity: 'intense', depth: 'deep', accent: '#7c5cff' },
    useCases: [
      'Cards de produto premium',
      'Botões de checkout / conversão',
      'Tiles de dashboards financeiros',
      'Modais com entrada dramática',
    ],
    cssTips: [
      'Ajuste perspective() para mais/menos dramaticidade (400-1200px)',
      'Aumente --lumina-depth para extrusão mais profunda (32-64px)',
      'Combine com variant="dimensional" no container pai para herdar perspectiva',
    ],
  },
];

const INTENSITY_LEVELS = ['subtle', 'medium', 'intense', 'extreme'] as const;
const INTENSITY_MULTIPLIERS: Record<string, number> = {
  subtle: 0.4,
  medium: 0.7,
  intense: 1.0,
  extreme: 1.6,
};

const INTENSITY_DESCRIPTIONS: Record<string, { title: string; desc: string; effect: string }> = {
  subtle: {
    title: 'Subtle (0.4x)',
    desc: 'Efeitos visuais reduzidos a 40% da intensidade padrão.',
    effect: 'Glow quase imperceptível, partículas raras, animações discretas. Ideal para interfaces profissionais onde o foco é conteúdo, não efeito.',
  },
  medium: {
    title: 'Medium (0.7x)',
    desc: 'Equilíbrio entre estética e discrição.',
    effect: 'Glow visível mas contido, partículas moderadas, animações presentes mas não distractivas. Bom para uso geral em dashboards e apps.',
  },
  intense: {
    title: 'Intense (1.0x)',
    desc: 'Intensidade padrão — efeitos completos.',
    effect: 'Glow forte, partículas abundantes, animações impactantes. Ideal para landing pages, showcases e demos onde o visual é o foco.',
  },
  extreme: {
    title: 'Extreme (1.6x)',
    desc: 'Efeitos exagerados a 160% — máximo impacto.',
    effect: 'Glow muito intenso, partículas em quantidade máxima, animações dramáticas. Use com moderação — pode ser distractativo em uso diário.',
  },
};

export default async function variantsSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'variants-explorer' });

  root.innerHTML = `
    ${sectionHead('02', 'Variants Explorer', 'Compare as 6 variantes lado a lado, ajuste a intensidade em tempo real e veja descrições técnicas detalhadas.').outerHTML}

    <!-- ===== VISUAL COMPARATOR ===== -->
    <section class="variant-comparator" data-comparator>
      <h2 class="variant-comparator__title">Comparador Visual</h2>
      <p class="variant-comparator__desc">O mesmo componente em todas as 6 variantes. Mude a intensidade para ver como cada nível afeta o visual.</p>

      <div class="variant-comparator__intensity-bar">
        <span class="variant-comparator__intensity-label">Intensity:</span>
        ${INTENSITY_LEVELS.map((level) => `
          <button class="variant-comparator__intensity-btn ${level === 'intense' ? 'is-active' : ''}" data-intensity="${level}">
            ${level}
          </button>
        `).join('')}
      </div>

      <div class="variant-comparator__grid" data-comparator-grid>
        ${SHARED_VARIANTS.map((v) => `
          <div class="variant-comparator__cell">
            <div class="variant-comparator__cell-label">${v.name}</div>
            <div class="variant-comparator__cell-demo">
              <lumina-button variant="${v.name}" intensity="intense" accent-color="${v.recommended.accent ?? '#7c5cff'}" depth="${v.recommended.depth ?? 'medium'}" speed="0.45" theme="dark">${v.name}</lumina-button>
            </div>
            <a class="variant-comparator__cell-link" href="#/playground/lumina-button">Abrir no playground →</a>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- ===== INTENSITY EXPLAINER ===== -->
    <section class="intensity-explainer" data-intensity-explainer>
      <h2 class="intensity-explainer__title">O que é <code>intensity</code>?</h2>
      <p class="intensity-explainer__intro">
        O atributo <code>intensity</code> controla a intensidade de TODOS os efeitos visuais do componente — glow, partículas, animações, blur.
        É um multiplicador global que escala de <strong>0.4x</strong> (subtle) a <strong>1.6x</strong> (extreme).
        Internamente, ele seta a variável CSS <code>--lumina-intensity</code> que é usada em cálculos de opacidade, quantidade de partículas e força de glow.
      </p>

      <div class="intensity-explainer__grid">
        ${INTENSITY_LEVELS.map((level) => {
          const info = INTENSITY_DESCRIPTIONS[level];
          return `
            <div class="intensity-explainer__card ${level === 'intense' ? 'is-active' : ''}" data-intensity-card="${level}">
              <div class="intensity-explainer__card-header">
                <span class="intensity-explainer__card-name">${info.title}</span>
                <span class="intensity-explainer__card-mult">${INTENSITY_MULTIPLIERS[level]}x</span>
              </div>
              <p class="intensity-explainer__card-desc">${info.desc}</p>
              <p class="intensity-explainer__card-effect">${info.effect}</p>
              <div class="intensity-explainer__card-demo">
                <lumina-button variant="aura" intensity="${level}" accent-color="#ffd166" speed="0.5" theme="dark">${level}</lumina-button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="intensity-explainer__tech">
        <h3>Como funciona tecnicamente</h3>
        <p>O <code>intensity</code> é convertido para um número via <code>INTENSITY_MULTIPLIERS</code> e setado como <code>--lumina-intensity</code> no host. Componentes usam essa variável em:</p>
        <ul>
          <li><strong>Quantidade de partículas:</strong> <code>count = baseCount × --lumina-intensity</code></li>
          <li><strong>Opacidade de glow:</strong> <code>opacity = baseOpacity × --lumina-intensity</code></li>
          <li><strong>Força de blur:</strong> <code>blur = baseBlur × --lumina-intensity</code></li>
          <li><strong>Escala de animação:</strong> <code>scale = baseScale × --lumina-intensity</code></li>
        </ul>
        <p>Isso significa que mudar <code>intensity</code> afeta todos os efeitos de forma consistente e proporcional.</p>
      </div>
    </section>

    <!-- ===== DETAILED VARIANT CARDS ===== -->
    <h2 class="variants-explorer__section-title">Detalhes por variante</h2>
    <div class="variants-explorer__list">
      ${SHARED_VARIANTS.map((v) => `
        <article class="variant-detail" id="variant-${v.name}">
          <header class="variant-detail__head">
            <div class="variant-detail__name">${v.name}</div>
            <div class="variant-detail__demo">
              <lumina-button variant="${v.name}" intensity="${v.recommended.intensity ?? 'intense'}" accent-color="${v.recommended.accent ?? '#7c5cff'}" depth="${v.recommended.depth ?? 'medium'}" speed="0.45" theme="dark">${v.name}</lumina-button>
              <a class="variant-detail__playground-link" href="#/playground/lumina-button">→ Playground</a>
            </div>
          </header>

          <div class="variant-detail__grid">
            <div class="variant-detail__col">
              <h4>Visual</h4>
              <p>${v.visualDesc}</p>

              <h4>Técnica</h4>
              <p>${v.technicalDesc}</p>
            </div>

            <div class="variant-detail__col">
              <h4>Parâmetros recomendados</h4>
              <ul class="variant-detail__params">
                <li><strong>intensity:</strong> <code>${v.recommended.intensity ?? 'intense'}</code></li>
                <li><strong>depth:</strong> <code>${v.recommended.depth ?? 'medium'}</code></li>
                <li><strong>accent-color:</strong> <code>${v.recommended.accent ?? '#7c5cff'}</code></li>
              </ul>

              <h4>Casos de uso</h4>
              <ul class="variant-detail__list">
                ${v.useCases.map((u) => `<li>${u}</li>`).join('')}
              </ul>
            </div>

            <div class="variant-detail__col">
              <h4>Dicas de CSS</h4>
              <ul class="variant-detail__tips">
                ${v.cssTips.map((t) => `<li>${t}</li>`).join('')}
              </ul>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;

  // ===== Wire up intensity selector in comparator =====
  const comparatorGrid = root.querySelector('[data-comparator-grid]');
  const intensityBtns = root.querySelectorAll('[data-intensity]');

  intensityBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const level = (btn as HTMLElement).dataset.intensity!;
      // Update active button
      intensityBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      // Update all buttons in comparator
      comparatorGrid?.querySelectorAll('lumina-button').forEach((lb) => {
        (lb as HTMLElement).setAttribute('intensity', level);
      });
      // Update intensity explainer cards
      root.querySelectorAll('[data-intensity-card]').forEach((card) => {
        card.classList.toggle('is-active', (card as HTMLElement).dataset.intensityCard === level);
      });
    });
  });

  return root;
}
