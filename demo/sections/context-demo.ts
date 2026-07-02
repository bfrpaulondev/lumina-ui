/**
 * Context Awareness Demo — components that change based on cursor position
 * and proximity to neighboring elements.
 *
 * Three demos:
 *  1. Cursor-following: a cluster of badges that "wake up" as the cursor passes
 *  2. Proximity: buttons that grow / glow as the cursor approaches
 *  3. Container broadcast: a container's children inherit cursor position
 */
import type { Route } from '../app';
import { el, sectionHead } from './_shared';

export default async function contextDemoSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'context-demo' });

  root.innerHTML = `
    ${sectionHead('◎', 'Context Awareness Demo', 'Componentes que mudam conforme o conteúdo ao redor e o movimento do mouse. LuminaUI propaga contexto via CSS variables herdadas.').outerHTML}

    <div class="context-demo__section">
      <h3>1. Cursor-following cluster</h3>
      <p>Badges reagem ao passar do cursor, iluminando-se conforme a proximidade.</p>
      <div class="context-demo__cluster" data-cluster>
        ${Array.from({ length: 18 }, (_, i) => `<lumina-badge variant="glass" dot accent-color="#7c5cff" data-cluster-item>node-${i + 1}</lumina-badge>`).join('')}
      </div>
    </div>

    <div class="context-demo__section">
      <h3>2. Proximity-based grow</h3>
      <p>Botões crescem e ganham glow à medida que o cursor se aproxima — sem hover, só proximidade.</p>
      <div class="context-demo__proximity" data-proximity>
        ${['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map((n) => `<lumina-button variant="glass" intensity="medium" accent-color="#78f0ff" data-prox-item>${n}</lumina-button>`).join('')}
      </div>
    </div>

    <div class="context-demo__section">
      <h3>3. Container broadcast</h3>
      <p>O container transmite <code>--lumina-cursor-x/y</code> aos filhos. Passe o cursor — todos os filhos reagem em conjunto.</p>
      <lumina-container variant="neural" intensity="intense" accent-color="#ff6ec7" data-broadcast>
        <div class="context-demo__broadcast-grid">
          <lumina-card variant="glass" intensity="medium" accent-color="#ff6ec7">
            <h3 slot="title">Card A</h3>
            <p slot="subtitle">herda cursor</p>
          </lumina-card>
          <lumina-card variant="glass" intensity="medium" accent-color="#ff6ec7">
            <h3 slot="title">Card B</h3>
            <p slot="subtitle">herda cursor</p>
          </lumina-card>
          <lumina-card variant="glass" intensity="medium" accent-color="#ff6ec7">
            <h3 slot="title">Card C</h3>
            <p slot="subtitle">herda cursor</p>
          </lumina-card>
        </div>
      </lumina-container>
    </div>

    <div class="context-demo__hint">
      <p><strong>Como funciona:</strong> O <code>lumina-container</code> escuta <code>pointermove</code> e seta <code>--lumina-cursor-x</code> / <code>--lumina-cursor-y</code> como porcentagens em si mesmo. Como CSS variables são herdadas, qualquer filho — inclusive elementos dentro de Shadow DOM — pode ler esses valores via <code>var(--lumina-cursor-x)</code>. É assim que o contexto "vaza" para os componentes.</p>
    </div>
  `;

  // --- Demo 1: cluster ---
  const cluster = root.querySelector('[data-cluster]') as HTMLElement;
  const clusterItems = Array.from(cluster.querySelectorAll('[data-cluster-item]')) as HTMLElement[];
  cluster.addEventListener('pointermove', (e: PointerEvent) => {
    const rect = cluster.getBoundingClientRect();
    const mx = e.clientX;
    const my = e.clientY;
    clusterItems.forEach((item) => {
      const r = item.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
      const intensity = Math.max(0, 1 - dist / 180);
      item.style.opacity = String(0.45 + intensity * 0.55);
      item.style.transform = `scale(${1 + intensity * 0.18})`;
      item.style.filter = `brightness(${1 + intensity * 0.6}) drop-shadow(0 0 ${intensity * 12}px currentColor)`;
    });
  });
  cluster.addEventListener('pointerleave', () => {
    clusterItems.forEach((item) => {
      item.style.opacity = '';
      item.style.transform = '';
      item.style.filter = '';
    });
  });

  // --- Demo 2: proximity ---
  const prox = root.querySelector('[data-proximity]') as HTMLElement;
  const proxItems = Array.from(prox.querySelectorAll('[data-prox-item]')) as HTMLElement[];
  prox.addEventListener('pointermove', (e: PointerEvent) => {
    proxItems.forEach((item) => {
      const r = item.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
      const intensity = Math.max(0, 1 - dist / 220);
      item.style.transform = `scale(${1 + intensity * 0.15}) translateY(${-intensity * 6}px)`;
      item.style.setProperty('--prox', String(intensity));
    });
  });
  prox.addEventListener('pointerleave', () => {
    proxItems.forEach((item) => {
      item.style.transform = '';
    });
  });

  return root;
}
