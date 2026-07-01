/**
 * Performance Benchmark — live FPS comparison across variants.
 *
 * Spawns N instances of a chosen component variant simultaneously and
 * measures FPS. The user can switch variant and intensity to compare.
 */
import type { Route } from '../app';
import { el, sectionHead, selectControl, rangeControl, fpsMeter, startFpsSampler, VARIANTS, INTENSITIES } from './_shared';

export default async function performanceSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'perf-bench' });

  root.innerHTML = `
    ${sectionHead('⚡', 'Performance Benchmark', 'Spawne múltiplas instâncias de uma variante e veja o impacto no FPS em tempo real. Compare variantes e intensidades.').outerHTML}

    <div class="perf-bench__controls" data-controls></div>

    <div class="perf-bench__stats">
      <div class="perf-bench__stat">
        <div class="perf-bench__stat-label">FPS ao vivo</div>
        <div data-fps-host></div>
      </div>
      <div class="perf-bench__stat">
        <div class="perf-bench__stat-label">Instâncias</div>
        <div class="perf-bench__stat-value" data-instance-count>0</div>
      </div>
      <div class="perf-bench__stat">
        <div class="perf-bench__stat-label">Partículas estimadas</div>
        <div class="perf-bench__stat-value" data-particle-count>0</div>
      </div>
      <div class="perf-bench__stat">
        <div class="perf-bench__stat-label">Bundle (gzipped)</div>
        <div class="perf-bench__stat-value">~20kb</div>
      </div>
    </div>

    <div class="perf-bench__stage" data-stage></div>

    <div class="perf-bench__hint">
      <p><strong>Metodologia:</strong> cada instância renderiza um <code>lumina-button</code> com a variante e intensidade selecionadas. Variantes <code>neural</code>, <code>void</code> e <code>aura</code> usam canvas + rAF para partículas — por isso são mais pesadas. <code>glass</code> e <code>morph</code> usam apenas CSS — praticamente gratuitas.</p>
    </div>

    <div class="perf-bench__table">
      <table>
        <thead>
          <tr>
            <th>Variante</th>
            <th>Custo (relativo)</th>
            <th>Canvas/rAF</th>
            <th>Recomendação</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>glass</td><td>★☆☆☆☆</td><td>✗</td><td>Use livremente em listas grandes</td></tr>
          <tr><td>morph</td><td>★☆☆☆☆</td><td>✗</td><td>CTAs e badges — leve</td></tr>
          <tr><td>aura</td><td>★★★☆☆</td><td>✓ (partículas)</td><td>Use em hero / destaques (1-3 instâncias)</td></tr>
          <tr><td>neural</td><td>★★★★☆</td><td>✓ (partículas + linhas)</td><td>Use em 1-2 elementos por tela</td></tr>
          <tr><td>void</td><td>★★★☆☆</td><td>✓ (starfield)</td><td>OK para backgrounds, evite muitos</td></tr>
          <tr><td>dimensional</td><td>★★☆☆☆</td><td>✗ (3D transforms)</td><td>Use em cards premium</td></tr>
        </tbody>
      </table>
    </div>
  `;

  const controlsHost = root.querySelector('[data-controls]') as HTMLElement;
  const stage = root.querySelector('[data-stage]') as HTMLElement;
  const fpsHost = root.querySelector('[data-fps-host]') as HTMLElement;
  const instanceCount = root.querySelector('[data-instance-count]') as HTMLElement;
  const particleCount = root.querySelector('[data-particle-count]') as HTMLElement;

  const meter = fpsMeter();
  fpsHost.appendChild(meter.el);
  const stopSampler = startFpsSampler(meter.update);

  const state = {
    variant: 'neural' as string,
    intensity: 'intense' as string,
    count: 12,
  };

  const intensityToMult: Record<string, number> = { subtle: 0.4, medium: 0.7, intense: 1.0, extreme: 1.6 };

  controlsHost.appendChild(
    selectControl('Variante', VARIANTS.map((v) => ({ value: v, label: v })), state.variant, (v) => {
      state.variant = v;
      rebuild();
    }),
  );
  controlsHost.appendChild(
    selectControl('Intensity', INTENSITIES.map((v) => ({ value: v, label: v })), state.intensity, (v) => {
      state.intensity = v;
      rebuild();
    }),
  );
  controlsHost.appendChild(
    rangeControl('Instâncias', 1, 60, 1, state.count, (v) => {
      state.count = Math.round(v);
      rebuild();
    }),
  );

  function rebuild(): void {
    stage.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'perf-bench__grid';
    for (let i = 0; i < state.count; i += 1) {
      const btn = document.createElement('lumina-button');
      btn.setAttribute('variant', state.variant);
      btn.setAttribute('intensity', state.intensity);
      btn.setAttribute('accent-color', '#7c5cff');
      btn.setAttribute('speed', '0.5');
      btn.textContent = `#${i + 1}`;
      grid.appendChild(btn);
    }
    stage.appendChild(grid);

    instanceCount.textContent = String(state.count);

    // Estimate particles: count × 20 × intensity mult (for variants that have particles)
    const hasParticles = ['neural', 'void', 'aura'].includes(state.variant);
    const particles = hasParticles ? state.count * 20 * intensityToMult[state.intensity] : 0;
    particleCount.textContent = String(Math.round(particles));
  }

  // Cleanup
  const observer = new MutationObserver(() => {
    if (!document.contains(root)) {
      stopSampler();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  rebuild();

  return root;
}
