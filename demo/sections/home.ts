/**
 * Home section — hero + overview cards for all sections.
 */
import type { Route } from '../app';
import { CATEGORIES, COMPONENT_METAS } from '../data/components';
import { el } from './_shared';

export default async function homeSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'home' });
  const totalComponents = COMPONENT_METAS.length;
  const totalVariants = COMPONENT_METAS.reduce((sum, c) => sum + c.variants.length, 0);

  root.innerHTML = `
    <section class="home__hero">
      <lumina-badge variant="aura" dot pulse>v0.3.0 · ${totalComponents} componentes</lumina-badge>
      <h1 class="home__title">
        Biblioteca completa:<br />
        <span class="gradient-text">${totalComponents} componentes</span>, 8 categorias.
      </h1>
      <p class="home__lead">
        Playground expandido: ${totalComponents} Web Components vanilla com ${totalVariants} variantes visuais.
        Veja o código, edite no Monaco, misture variantes, meça performance e gere snippets prontos.
      </p>
      <div class="home__actions">
        <lumina-button variant="dimensional" intensity="intense" accent-color="#7c5cff" depth="deep" data-nav="playground">
          Abrir Playground
        </lumina-button>
        <lumina-button variant="glass" intensity="medium" accent-color="#78f0ff" data-nav="studio">
          Make it Yours Studio
        </lumina-button>
      </div>

      <div class="home__stats">
        <div class="home__stat">
          <strong>${totalComponents}</strong>
          <span>componentes</span>
        </div>
        <div class="home__stat">
          <strong>${CATEGORIES.length}</strong>
          <span>categorias</span>
        </div>
        <div class="home__stat">
          <strong>${totalVariants}</strong>
          <span>variantes</span>
        </div>
        <div class="home__stat">
          <strong>0kb</strong>
          <span>deps</span>
        </div>
        <div class="home__stat">
          <strong>WC</strong>
          <span>padrão</span>
        </div>
      </div>
    </section>

    <section class="home__categories">
      <h2>Categorias</h2>
      <div class="home__cat-grid">
        ${CATEGORIES.map((cat) => {
          const items = COMPONENT_METAS.filter((c) => c.category === cat.id);
          return `
            <a class="home__cat" href="#/playground/${items[0]?.tag ?? ''}">
              <div class="home__cat-head">
                <span class="home__cat-icon">${cat.icon}</span>
                <span class="home__cat-range">${cat.range}</span>
              </div>
              <h3>${cat.label}</h3>
              <p>${items.length} componentes</p>
            </a>
          `;
        }).join('')}
      </div>
    </section>

    <section class="home__grid">
      <a class="home__card" href="#/playground">
        <div class="home__card-icon">▷</div>
        <h3>Playground</h3>
        <p>Veja cada um dos ${totalComponents} componentes com código TypeScript, Vanilla e React.</p>
      </a>
      <a class="home__card" href="#/variants">
        <div class="home__card-icon">◇</div>
        <h3>Variants Explorer</h3>
        <p>Descrições técnicas de cada uma das 6 variantes com casos de uso e dicas CSS.</p>
      </a>
      <a class="home__card" href="#/morphing-lab">
        <div class="home__card-icon">◈</div>
        <h3>Morphing Laboratory</h3>
        <p>Transições morfáveis ao vivo: glass → neural → void, etc.</p>
      </a>
      <a class="home__card" href="#/particle-physics">
        <div class="home__card-icon">⁂</div>
        <h3>Particle Physics</h3>
        <p>Controle quantidade, velocidade, cor e comportamento das partículas.</p>
      </a>
      <a class="home__card" href="#/depth-explorer">
        <div class="home__card-icon">⬢</div>
        <h3>Depth & 3D</h3>
        <p>Perspectiva, tilt e extrusão 3D em tempo real.</p>
      </a>
      <a class="home__card" href="#/context-demo">
        <div class="home__card-icon">◎</div>
        <h3>Context Awareness</h3>
        <p>Componentes que reagem ao cursor e aos vizinhos.</p>
      </a>
      <a class="home__card" href="#/performance">
        <div class="home__card-icon">⚡</div>
        <h3>Performance Benchmark</h3>
        <p>FPS counter ao vivo comparando variantes e intensidades.</p>
      </a>
      <a class="home__card" href="#/a11y">
        <div class="home__card-icon">♿</div>
        <h3>Accessibility Inspector</h3>
        <p>ARIA tree, reduced motion, keyboard nav — tudo verificado.</p>
      </a>
      <a class="home__card" href="#/studio">
        <div class="home__card-icon">✦</div>
        <h3>Make it Yours Studio</h3>
        <p>Tweak atributos e copie o código pronto para seu projeto.</p>
      </a>
    </section>

    <section class="home__docs">
      <h2>Documentação</h2>
      <div class="home__docs-grid">
        <a href="#/install">Installation Guide</a>
        <a href="#/quick-start">Quick Start</a>
        <a href="#/api">API Reference</a>
        <a href="#/tokens">Design Tokens</a>
        <a href="#/browser-support">Browser Support</a>
      </div>
    </section>
  `;

  // Wire buttons
  root.querySelectorAll('lumina-button[data-nav]').forEach((btn) => {
    const target = (btn as HTMLElement).dataset.nav!;
    btn.addEventListener('lumina-press', () => { location.hash = `#/${target}`; });
  });

  return root;
}
