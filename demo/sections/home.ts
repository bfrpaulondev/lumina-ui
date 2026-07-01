/**
 * Home section — hero + overview cards for all sections.
 */
import type { Route } from '../app';
import { el } from './_shared';

export default async function homeSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'home' });

  root.innerHTML = `
    <section class="home__hero">
      <lumina-badge variant="aura" dot pulse>v0.1.0 · MVP expandido</lumina-badge>
      <h1 class="home__title">
        Interfaces <span class="gradient-text">vivas</span>, morfáveis<br />
        e <span class="gradient-text">adaptativas</span> — exploráveis.
      </h1>
      <p class="home__lead">
        Playground completo: veja o código, edite em tempo real, misture variantes,
        meça performance, inspecione acessibilidade e gere o snippet pronto.
      </p>
      <div class="home__actions">
        <lumina-button variant="dimensional" intensity="intense" accent-color="#7c5cff" depth="deep" onclick="location.hash='#/playground'">
          Abrir Playground
        </lumina-button>
        <lumina-button variant="glass" intensity="medium" accent-color="#78f0ff" onclick="location.hash='#/studio'">
          Make it Yours Studio
        </lumina-button>
      </div>
    </section>

    <section class="home__grid">
      <a class="home__card" href="#/playground">
        <div class="home__card-icon">▷</div>
        <h3>Playground</h3>
        <p>Veja cada componente com código TypeScript, Vanilla e React. Edite no Monaco.</p>
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

  // Wire buttons (lumina-button uses lumina-press event; onclick works for native, but
  // lumina-button intercepts click and dispatches lumina-press, so bind to that)
  root.querySelectorAll('lumina-button').forEach((btn) => {
    const target = btn.getAttribute('onclick') ?? '';
    if (target) {
      btn.removeAttribute('onclick');
      btn.addEventListener('lumina-press', () => {
        // Match '#/something' inside the onclick string
        const match = target.match(/#\/([a-z-]+)/);
        if (match) location.hash = `#/${match[1]}`;
      });
    }
  });

  return root;
}
