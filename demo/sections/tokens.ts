/**
 * Design Tokens reference.
 */
import type { Route } from '../app';
import { TOKENS } from '../../src/core/tokens';
import { el, sectionHead } from './_shared';

export default async function tokensSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'docs' });
  root.innerHTML = `
    ${sectionHead('⬚', 'Design Tokens', 'Toda a identidade visual da LuminaUI é regida por CSS custom properties. Use-as para temas próprios.').outerHTML}

    <h2>Tokens base (CSS variables)</h2>
    <p>Setados em <code>:host</code> de cada componente via constructible stylesheet. Herdáveis via <code>var(--lumina-*)</code>.</p>

    <div class="tokens__grid">
      ${tokenCard('--lumina-bg', TOKENS.darkBg, 'Background do documento/host')}
      ${tokenCard('--lumina-surface', TOKENS.darkSurface, 'Triplet RGB da superfície de vidro (use com rgb(... / alpha)')}
      ${tokenCard('--lumina-surface-alpha', TOKENS.darkSurfaceAlpha, 'Alpha padrão da superfície')}
      ${tokenCard('--lumina-text', TOKENS.darkText, 'Cor de texto principal')}
      ${tokenCard('--lumina-text-muted', TOKENS.darkTextMuted, 'Texto secundário/rótulos')}
      ${tokenCard('--lumina-accent', '#7c5cff', 'Accent do componente (qualquer CSS color)')}
      ${tokenCard('--lumina-accent-rgb', '124 92 255', 'Triplet RGB do accent (para compor com alpha)')}
      ${tokenCard('--lumina-border', TOKENS.darkBorder, 'Cor das bordas')}
      ${tokenCard('--lumina-glow', TOKENS.darkGlow, 'Cor base para glows')}
      ${tokenCard('--lumina-shadow', TOKENS.darkShadow, 'Shadow base')}
    </div>

    <h2>Tokens de geometria</h2>
    <div class="tokens__grid">
      ${tokenCard('--lumina-radius-sm', TOKENS.radiusSm, '8px — badges, chips')}
      ${tokenCard('--lumina-radius-md', TOKENS.radiusMd, '14px — inputs, panels')}
      ${tokenCard('--lumina-radius-lg', TOKENS.radiusLg, '22px — cards')}
      ${tokenCard('--lumina-radius-xl', TOKENS.radiusXl, '34px — modais')}
      ${tokenCard('--lumina-radius-pill', TOKENS.radiusPill, '999px — buttons, toggles')}
    </div>

    <h2>Tokens de motion</h2>
    <div class="tokens__grid">
      ${tokenCard('--lumina-ease-spring', TOKENS.easeSpring, 'cubic-bezier(0.34, 1.56, 0.64, 1) — spring')}
      ${tokenCard('--lumina-ease-out', TOKENS.easeOut, 'cubic-bezier(0.22, 1, 0.36, 1) — out')}
      ${tokenCard('--lumina-ease-in-out', TOKENS.easeInOut, 'cubic-bezier(0.65, 0, 0.35, 1) — in-out')}
      ${tokenCard('--lumina-speed', '0.5s', 'Velocidade base das transições (setado por atributo speed)')}
    </div>

    <h2>Tokens dinâmicos (setados via atributos)</h2>
    <div class="tokens__grid">
      ${tokenCard('--lumina-variant', 'glass', 'Variante atual (string)')}
      ${tokenCard('--lumina-intensity', '0.7', 'Multiplicador 0..2 (intensityToMultiplier)')}
      ${tokenCard('--lumina-depth', '14px', 'Pixel translate do depth (depthToPx)')}
    </div>

    <h2>Temas pré-definidos</h2>
    <p>Use o atributo <code>theme="..."</code> em qualquer componente para mudar todos os tokens:</p>
    <table class="api__table">
      <thead><tr><th>Tema</th><th>bg</th><th>accent</th><th>Vibe</th></tr></thead>
      <tbody>
        <tr><td><code>light</code></td><td>#f3f4fb</td><td>#7c5cff</td><td>Claro, fresco</td></tr>
        <tr><td><code>dark</code></td><td>#06060c</td><td>#7c5cff</td><td>Escuro default</td></tr>
        <tr><td><code>auto</code></td><td>—</td><td>—</td><td>Segue prefers-color-scheme</td></tr>
        <tr><td><code>cosmic</code></td><td>#0a0420</td><td>#b478ff</td><td>Aurora roxa</td></tr>
        <tr><td><code>void</code></td><td>#000000</td><td>#78f0ff</td><td>Black + cyan neon</td></tr>
      </tbody>
    </table>

    <h2>Como customizar</h2>
    <p>Sobrescreva qualquer token em CSS próprio:</p>
    ${code('css', `/* Tema cyberpunk */
lumina-button {
  --lumina-accent: #00ff95;
  --lumina-accent-rgb: 0 255 149;
  --lumina-surface: 10 20 30;
  --lumina-radius-pill: 4px;
  --lumina-speed: 0.3s;
}`)}
    <p>Ou via JS:</p>
    ${code('ts', `const btn = document.querySelector('lumina-button');
btn.style.setProperty('--lumina-accent', '#ff00ff');
btn.style.setProperty('--lumina-speed', '0.8s');`)}
  `;
  return root;
}

function tokenCard(name: string, value: string, desc: string): string {
  return `<div class="tokens__card">
    <div class="tokens__card-name">${name}</div>
    <div class="tokens__card-value">${value}</div>
    <div class="tokens__card-desc">${desc}</div>
  </div>`;
}

function code(lang: string, content: string): string {
  return `<lumina-code-block lang="${lang}" title="${lang}">${escape(content)}</lumina-code-block>`;
}
function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
