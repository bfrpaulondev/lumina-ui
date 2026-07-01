/**
 * Particle Physics Playground — interactive controls for the ParticleField.
 *
 * Spawns a single ParticleField directly on a canvas with live-tweakable
 * parameters: count, speed, size, life, hue range, connect mode, starfield
 * mode, accent color. Shows FPS so the user can see the perf impact.
 */
import type { Route } from '../app';
import { ParticleField } from '../../src/core/ParticleField';
import { el, sectionHead, rangeControl, colorControl, fpsMeter, startFpsSampler, ACCENTS } from './_shared';

export default async function particlePhysicsSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'particle-physics' });

  root.innerHTML = `
    ${sectionHead('⁂', 'Particle Physics Playground', 'Controle em tempo real: quantidade, velocidade, tamanho, cor e comportamento das partículas. Veja o impacto no FPS.').outerHTML}

    <div class="particle-physics__layout">
      <div class="particle-physics__stage" data-stage></div>

      <aside class="particle-physics__controls">
        <div class="particle-physics__fps" data-fps-host></div>

        ${rangeControl('Quantidade', 5, 200, 1, 60, (v) => update('count', Math.round(v))).outerHTML}
        ${rangeControl('Velocidade min', 0.05, 2, 0.05, 0.15, (v) => update('speedMin', v)).outerHTML}
        ${rangeControl('Velocidade max', 0.1, 5, 0.1, 0.8, (v) => update('speedMax', v)).outerHTML}
        ${rangeControl('Tamanho min', 0.3, 4, 0.1, 0.6, (v) => update('sizeMin', v)).outerHTML}
        ${rangeControl('Tamanho max', 0.5, 8, 0.1, 2.2, (v) => update('sizeMax', v)).outerHTML}
        ${rangeControl('Life min', 30, 400, 5, 120, (v) => update('lifeMin', Math.round(v))).outerHTML}
        ${rangeControl('Life max', 60, 600, 5, 240, (v) => update('lifeMax', Math.round(v))).outerHTML}
        ${rangeControl('Hue start', 0, 360, 1, 240, (v) => update('hueStart', Math.round(v))).outerHTML}
        ${rangeControl('Hue end', 0, 360, 1, 320, (v) => update('hueEnd', Math.round(v))).outerHTML}

        ${colorControl('Cor', '#7c5cff', (v) => update('accent', v)).outerHTML}

        <div class="control">
          <div class="control__head"><span class="control__label">Modo</span></div>
          <div class="particle-physics__modes">
            <label><input type="radio" name="mode" value="plain" checked /> Plain</label>
            <label><input type="radio" name="mode" value="connect" /> Neural (connect)</label>
            <label><input type="radio" name="mode" value="starfield" /> Starfield</label>
          </div>
        </div>

        <div class="control">
          <div class="control__head"><span class="control__label">Paletas rápidas</span></div>
          <div class="particle-physics__swatches">
            ${ACCENTS.map((c) => `<button class="particle-physics__swatch" style="background:${c}" data-swatch="${c}"></button>`).join('')}
          </div>
        </div>
      </aside>
    </div>

    <div class="particle-physics__hint">
      <p>Os controles ajustam em tempo real o <code>ParticleField</code>. Modo <strong>Neural</strong> desenha linhas entre partículas próximas (~90px) — mais caro, mas visualmente impressionante. Modo <strong>Starfield</strong> usa wrap-around e pulsação senoidal para simular campo estelar.</p>
    </div>
  `;

  const stage = root.querySelector('[data-stage]') as HTMLElement;
  const fpsHost = root.querySelector('[data-fps-host]') as HTMLElement;
  const meter = fpsMeter();
  fpsHost.appendChild(meter.el);
  const stopSampler = startFpsSampler(meter.update);

  const state = {
    count: 60,
    speedMin: 0.15,
    speedMax: 0.8,
    sizeMin: 0.6,
    sizeMax: 2.2,
    lifeMin: 120,
    lifeMax: 240,
    hueStart: 240,
    hueEnd: 320,
    accent: '#7c5cff',
    mode: 'plain' as 'plain' | 'connect' | 'starfield',
  };

  // Parse accent to "r g b" triplet
  function accentTriplet(hex: string): string {
    const m = hex.match(/^#([0-9a-f]{6})$/i);
    if (!m) return '124 92 255';
    const n = parseInt(m[1], 16);
    return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
  }

  let field: ParticleField | null = null;

  function rebuild(): void {
    field?.destroy();
    const rect = stage.getBoundingClientRect();
    field = new ParticleField(stage, {
      count: state.count,
      rgb: accentTriplet(state.accent),
      sizeRange: [state.sizeMin, state.sizeMax],
      speedRange: [state.speedMin, state.speedMax],
      lifeRange: [state.lifeMin, state.lifeMax],
      hueRange: [state.hueStart, state.hueEnd],
      connect: state.mode === 'connect',
      starfield: state.mode === 'starfield',
    });
    // Ensure the stage has dimensions
    stage.style.width = '100%';
    stage.style.height = '420px';
    field.mount(stage);
    void rect;
  }

  function update<K extends keyof typeof state>(key: K, value: (typeof state)[K]): void {
    state[key] = value;
    rebuild();
  }

  root.querySelectorAll('input[name="mode"]').forEach((r) => {
    r.addEventListener('change', () => {
      state.mode = (r as HTMLInputElement).value as any;
      rebuild();
    });
  });
  root.querySelectorAll('[data-swatch]').forEach((b) => {
    b.addEventListener('click', () => {
      state.accent = (b as HTMLElement).dataset.swatch!;
      rebuild();
    });
  });

  // Clean up sampler when leaving the section
  const observer = new MutationObserver(() => {
    if (!document.contains(root)) {
      stopSampler();
      field?.destroy();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  rebuild();

  return root;
}
