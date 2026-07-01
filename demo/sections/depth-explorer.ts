/**
 * Depth & 3D Explorer — interactive controls for perspective, tilt, extrude.
 *
 * A single LuminaCard variant="dimensional" responds to live controls:
 *  - perspective (px)
 *  - max tilt (deg)
 *  - depth extrude (px)
 *  - intensity
 *  - accent
 *
 * User can also drag the card directly to set the tilt manually.
 */
import type { Route } from '../app';
import { el, sectionHead, rangeControl, colorControl, ACCENTS } from './_shared';

export default async function depthExplorerSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'depth-explorer' });

  root.innerHTML = `
    ${sectionHead('⬢', 'Depth & 3D Explorer', 'Ajuste perspectiva, tilt máximo e extrusão em tempo real. Arraste o card para sentir o parallax.').outerHTML}

    <div class="depth-explorer__layout">
      <div class="depth-explorer__stage" data-stage>
        <lumina-card
          variant="dimensional"
          intensity="intense"
          accent-color="#7c5cff"
          depth="deep"
          data-card
        >
          <h3 slot="title">Card 3D</h3>
          <p slot="subtitle">arraste para tilt</p>
          <p>Este card reage ao cursor com <code>perspective()</code> + <code>rotateX/Y</code>. Ajuste os controles para sentir a extrusão.</p>
          <div slot="footer" style="display:flex; gap:8px;">
            <lumina-button variant="dimensional" accent-color="#7c5cff">Ação</lumina-button>
          </div>
        </lumina-card>
      </div>

      <aside class="depth-explorer__controls">
        ${rangeControl('Perspectiva (px)', 200, 2000, 50, 800, (v) => update('perspective', v)).outerHTML}
        ${rangeControl('Tilt máximo (deg)', 0, 30, 1, 18, (v) => update('tilt', v)).outerHTML}
        ${rangeControl('Profundidade (px)', 0, 80, 2, 32, (v) => update('depth', v)).outerHTML}
        ${rangeControl('Suavidade (lerp)', 0.05, 0.5, 0.01, 0.18, (v) => update('lerp', v)).outerHTML}
        ${rangeControl('Translate Z inner (px)', 0, 80, 1, 40, (v) => update('innerZ', v)).outerHTML}
        ${colorControl('Accent', '#7c5cff', (v) => update('accent', v)).outerHTML}

        <div class="control">
          <div class="control__head"><span class="control__label">Paletas</span></div>
          <div class="depth-explorer__swatches">
            ${ACCENTS.map((c) => `<button class="depth-explorer__swatch" style="background:${c}" data-swatch="${c}"></button>`).join('')}
          </div>
        </div>
      </aside>
    </div>

    <div class="depth-explorer__hint">
      <p>A transformação é feita via <code>requestAnimationFrame</code> com lerp suave — sem layout thrash. O conteúdo interno recebe <code>translateZ()</code> para criar a sensação de profundidade real. Em <code>prefers-reduced-motion: reduce</code> o tilt é desativado automaticamente.</p>
    </div>
  `;

  const stage = root.querySelector('[data-stage]') as HTMLElement;
  const card = root.querySelector('[data-card]') as HTMLElement;

  const state = {
    perspective: 800,
    tilt: 18,
    depth: 32,
    lerp: 0.18,
    innerZ: 40,
    accent: '#7c5cff',
  };

  let targetRX = 0;
  let targetRY = 0;
  let currentRX = 0;
  let currentRY = 0;
  let raf = 0;

  function applyStaticStyles(): void {
    stage.style.perspective = `${state.perspective}px`;
    card.style.setProperty('--lumina-depth', `${state.depth}px`);
    card.setAttribute('accent-color', state.accent);
    // Override inner translateZ via CSS variable on the card host
    card.style.setProperty('--depth-inner-z', `${state.innerZ}px`);
  }

  function tick(): void {
    currentRX += (targetRX - currentRX) * state.lerp;
    currentRY += (targetRY - currentRY) * state.lerp;
    card.style.transform = `perspective(${state.perspective}px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
    // We need to override the card's own transform via inline style — but the
    // card uses its own .lumina-card div. We target the inner element via shadow:
    const inner = (card.shadowRoot as ShadowRoot | null)?.querySelector('.lumina-card') as HTMLElement | null;
    if (inner) {
      inner.style.transform = `perspective(${state.perspective}px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) translateY(-4px)`;
      const innerInner = inner.querySelector('.lumina-card__inner') as HTMLElement | null;
      if (innerInner) innerInner.style.transform = `translateZ(${state.innerZ}px)`;
    }
    if (Math.abs(targetRX - currentRX) > 0.05 || Math.abs(targetRY - currentRY) > 0.05) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  }

  stage.addEventListener('pointermove', (e: PointerEvent) => {
    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    targetRY = px * state.tilt;
    targetRX = -py * state.tilt;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  stage.addEventListener('pointerleave', () => {
    targetRX = 0;
    targetRY = 0;
    if (!raf) raf = requestAnimationFrame(tick);
  });

  function update<K extends keyof typeof state>(key: K, value: (typeof state)[K]): void {
    state[key] = value;
    applyStaticStyles();
  }

  root.querySelectorAll('[data-swatch]').forEach((b) => {
    b.addEventListener('click', () => {
      state.accent = (b as HTMLElement).dataset.swatch!;
      applyStaticStyles();
    });
  });

  applyStaticStyles();

  return root;
}
