/**
 * Variants Explorer — deep technical breakdown of each variant.
 * v0.3.0 — uses local SHARED_VARIANTS (was previously in data/components.ts).
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
    visualDesc: 'Frosted glass with subtle blur, saturation boost and rim light.',
    technicalDesc:
      'Uses backdrop-filter: blur(14px) saturate(1.4) on a translucent surface, with inset highlight to simulate glass edge. Conic gradient ring reveals on hover.',
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
    visualDesc: 'Shape-shifting polygon that morphs between pill and squircle on hover.',
    technicalDesc:
      'Animates clip-path polygon() points with cubic-bezier(0.34, 1.56, 0.64, 1) spring easing. The element stays in normal flow; only the visual shape transforms.',
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
    visualDesc: 'Translucent surface with a living network of connected particles.',
    technicalDesc:
      'A canvas particle field runs behind the surface. Each particle drifts; pairs within 90px get a connecting line whose opacity scales with inverse distance. rAF-driven, HiDPI.',
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
    visualDesc: 'Deep black surface with starfield and chromatic aberration glow.',
    technicalDesc:
      'Background canvas renders wrap-around star points. Text gets text-shadow split into red and cyan channels (chromatic aberration). Border uses translucent accent at 0.2 alpha.',
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
    visualDesc: 'Floating element with a soft radial aura that breathes around it.',
    technicalDesc:
      'A radial-gradient pseudo-element blurred 20px sits behind the surface. The host animates with a 4s translateY keyframe. On hover the aura intensifies by --lumina-intensity.',
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
    visualDesc: '3D extruded element with parallax sheen and depth shadow.',
    technicalDesc:
      'Uses CSS transform-style: preserve-3d, perspective(800px) and rotateX/Y driven by pointer position. The bg carries a translateZ depth shadow using --lumina-depth. Sheen gradient on hover.',
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

export default async function variantsSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'variants-explorer' });

  root.innerHTML = `
    ${sectionHead('02', 'Variants Explorer', 'Cada variante é uma combinação única de técnicas visuais. Veja a descrição técnica, parâmetros recomendados, casos de uso e dicas de CSS.').outerHTML}

    <div class="variants-explorer__list">
      ${SHARED_VARIANTS.map((v) => `
        <article class="variant-detail" id="variant-${v.name}">
          <header class="variant-detail__head">
            <div class="variant-detail__name">${v.name}</div>
            <div class="variant-detail__demo">
              <lumina-button variant="${v.name}" intensity="${v.recommended.intensity ?? 'intense'}" accent-color="${v.recommended.accent ?? '#7c5cff'}" depth="${v.recommended.depth ?? 'medium'}" speed="0.45">${v.name}</lumina-button>
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

  return root;
}
