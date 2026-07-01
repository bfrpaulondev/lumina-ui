/**
 * Browser Support matrix.
 */
import type { Route } from '../app';
import { el, sectionHead } from './_shared';

export default async function browserSupportSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'docs' });
  root.innerHTML = `
    ${sectionHead('⌬', 'Browser Support', 'Onde a LuminaUI funciona — e o que fazer quando não funciona.').outerHTML}

    <h2>Matrix oficial (v0.1.0)</h2>
    <table class="api__table">
      <thead><tr><th>Browser</th><th>Versão mínima</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td>Chrome</td><td>96+</td><td>✅ Total</td></tr>
        <tr><td>Edge</td><td>96+</td><td>✅ Total</td></tr>
        <tr><td>Firefox</td><td>96+</td><td>✅ Total</td></tr>
        <tr><td>Safari</td><td>16.4+</td><td>✅ Total</td></tr>
        <tr><td>Safari iOS</td><td>16.4+</td><td>✅ Total</td></tr>
        <tr><td>Samsung Internet</td><td>17+</td><td>✅ Total</td></tr>
        <tr><td>Opera</td><td>82+</td><td>✅ Total</td></tr>
        <tr><td>Safari 15</td><td>15.x</td><td>⚠️ Sem constructible stylesheets — fallback via CSSOM</td></tr>
        <tr><td>IE 11</td><td>—</td><td>❌ Não suportado</td></tr>
      </tbody>
    </table>

    <h2>Recursos web usados</h2>
    <ul>
      <li><strong>Custom Elements v1</strong> — <code>customElements.define()</code></li>
      <li><strong>Shadow DOM v1</strong> — <code>attachShadow({ mode: 'open' })</code></li>
      <li><strong>Constructible Stylesheets</strong> — <code>new CSSStyleSheet()</code> + <code>adoptedStyleSheets</code></li>
      <li><strong>CSS Custom Properties</strong> — todo o sistema de tokens</li>
      <li><strong>backdrop-filter</strong> — variantes glass/aura</li>
      <li><strong>clip-path: polygon()</strong> — variante morph</li>
      <li><strong>transform-style: preserve-3d</strong> — variante dimensional</li>
      <li><strong>Canvas 2D + requestAnimationFrame</strong> — particle fields</li>
      <li><strong>&lt;dialog&gt; element</strong> — lumina-modal</li>
      <li><strong>matchMedia + prefers-reduced-motion</strong> — accessibility</li>
      <li><strong>matchMedia + prefers-color-scheme</strong> — theme auto</li>
      <li><strong>Web Animations API</strong> — alguns componentes usam element.animate()</li>
      <li><strong>Clipboard API</strong> — code blocks do playground</li>
    </ul>

    <h2>Polyfills (opcionais)</h2>
    <p>Para suportar Safari 15.x, adicione o polyfill de Constructible Stylesheets:</p>
    ${code('html', `<script src="https://cdn.jsdelivr.net/npm/construct-style-sheets-polyfill@3.1.0/dist/adoptedStyleSheets.min.js"></script>
<script type="module" src="https://esm.sh/lumina-ui"></script>`)}

    <h2>Degradação graciosa</h2>
    <ul>
      <li><strong>Sem backdrop-filter</strong> (Firefox antigo): a superfície perde o blur mas mantém a transparência.</li>
      <li><strong>Sem clip-path</strong>: variante morph cai para bordas retas sem erro.</li>
      <li><strong>Sem canvas</strong>: partículas não desenham, mas o componente funciona normalmente.</li>
      <li><strong>Sem &lt;dialog&gt;</strong>: lumina-modal perde focus trap nativo, mas abre/fecha via display.</li>
      <li><strong>prefers-reduced-motion</strong>: todas as animações são reduzidas a 0.001s automaticamente.</li>
    </ul>

    <h2>Bundle size</h2>
    <table class="api__table">
      <thead><tr><th>Asset</th><th>Raw</th><th>Gzipped</th></tr></thead>
      <tbody>
        <tr><td>lumina-ui.js (todos os 10 componentes)</td><td>96 kB</td><td>~18 kB</td></tr>
        <tr><td>apenas lumina-button</td><td>~12 kB</td><td>~3 kB</td></tr>
        <tr><td>core (LuminaElement + tokens + utils)</td><td>~8 kB</td><td>~2 kB</td></tr>
        <tr><td>Demo site (Vite build)</td><td>96 kB JS + 7.5 kB CSS</td><td>~20 kB total</td></tr>
      </tbody>
    </table>

    <p><strong>Zero dependências em produção.</strong> Apenas o Monaco editor do playground vem de CDN.</p>
  `;
  return root;
}

function code(lang: string, content: string): string {
  return `<lumina-code-block lang="${lang}" title="${lang}">${escape(content)}</lumina-code-block>`;
}
function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
