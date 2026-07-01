/**
 * Make it Yours Studio — tweak attributes via controls, see live preview
 * and copy the generated code (HTML + React).
 */
import type { Route } from '../app';
import { COMPONENTS } from '../data/components';
import { el, sectionHead, VARIANTS, INTENSITIES, DEPTHS, THEMES, ACCENTS } from './_shared';

export default async function studioSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'studio' });

  root.innerHTML = `
    ${sectionHead('✦', 'Make it Yours Studio', 'Escolha componente + variante + intensidade + accent e copie o código pronto para seu projeto.').outerHTML}

    <div class="studio__layout">
      <div class="studio__controls">
        <label class="control">
          <div class="control__head"><span class="control__label">component</span></div>
          <select data-studio-component>
            ${COMPONENTS.map((c) => `<option value="${c.tag}">&lt;${c.tag}&gt;</option>`).join('')}
          </select>
        </label>
        <label class="control">
          <div class="control__head"><span class="control__label">variant</span></div>
          <select data-studio-variant>
            ${VARIANTS.map((v) => `<option value="${v}">${v}</option>`).join('')}
          </select>
        </label>
        <label class="control">
          <div class="control__head"><span class="control__label">intensity</span></div>
          <select data-studio-intensity>
            ${INTENSITIES.map((v) => `<option value="${v}">${v}</option>`).join('')}
          </select>
        </label>
        <label class="control">
          <div class="control__head"><span class="control__label">depth</span></div>
          <select data-studio-depth>
            ${DEPTHS.map((v) => `<option value="${v}">${v}</option>`).join('')}
          </select>
        </label>
        <label class="control">
          <div class="control__head"><span class="control__label">theme</span></div>
          <select data-studio-theme>
            ${THEMES.map((v) => `<option value="${v}">${v}</option>`).join('')}
          </select>
        </label>
        <label class="control">
          <div class="control__head"><span class="control__label">speed (s)</span></div>
          <input type="range" min="0.1" max="2" step="0.1" value="0.5" data-studio-speed />
        </label>
        <label class="control">
          <div class="control__head"><span class="control__label">accent-color</span></div>
          <input type="color" value="#7c5cff" data-studio-accent />
        </label>
        <div class="studio__swatches">
          <span class="studio__swatches-label">Paletas rápidas:</span>
          ${ACCENTS.map((c) => `<button class="studio__swatch" style="background:${c}" data-swatch="${c}" aria-label="${c}"></button>`).join('')}
        </div>
      </div>

      <div class="studio__preview">
        <div class="studio__preview-label">Preview ao vivo</div>
        <div class="studio__preview-stage" data-preview-stage></div>
      </div>

      <div class="studio__code">
        <div class="studio__code-tabs">
          <button class="studio__code-tab is-active" data-code-tab="html">HTML</button>
          <button class="studio__code-tab" data-code-tab="react">React</button>
        </div>
        <div class="studio__code-body" data-code-body></div>
      </div>
    </div>
  `;

  const state = {
    component: COMPONENTS[0].tag,
    variant: 'glass',
    intensity: 'intense',
    depth: 'medium',
    theme: 'dark',
    speed: 0.5,
    accent: '#7c5cff',
  };
  let codeMode: 'html' | 'react' = 'html';

  const componentSel = root.querySelector('[data-studio-component]') as HTMLSelectElement;
  const variantSel = root.querySelector('[data-studio-variant]') as HTMLSelectElement;
  const intensitySel = root.querySelector('[data-studio-intensity]') as HTMLSelectElement;
  const depthSel = root.querySelector('[data-studio-depth]') as HTMLSelectElement;
  const themeSel = root.querySelector('[data-studio-theme]') as HTMLSelectElement;
  const speedInput = root.querySelector('[data-studio-speed]') as HTMLInputElement;
  const accentInput = root.querySelector('[data-studio-accent]') as HTMLInputElement;
  const previewStage = root.querySelector('[data-preview-stage]') as HTMLElement;
  const codeBody = root.querySelector('[data-code-body]') as HTMLElement;

  componentSel.addEventListener('change', () => { state.component = componentSel.value; render(); });
  variantSel.addEventListener('change', () => { state.variant = variantSel.value; render(); });
  intensitySel.addEventListener('change', () => { state.intensity = intensitySel.value; render(); });
  depthSel.addEventListener('change', () => { state.depth = depthSel.value; render(); });
  themeSel.addEventListener('change', () => { state.theme = themeSel.value; render(); });
  speedInput.addEventListener('input', () => { state.speed = parseFloat(speedInput.value); render(); });
  accentInput.addEventListener('input', () => { state.accent = accentInput.value; render(); });
  root.querySelectorAll('[data-swatch]').forEach((b) => {
    b.addEventListener('click', () => {
      state.accent = (b as HTMLElement).dataset.swatch!;
      accentInput.value = state.accent;
      render();
    });
  });
  root.querySelectorAll('[data-code-tab]').forEach((b) => {
    b.addEventListener('click', () => {
      codeMode = (b as HTMLElement).dataset.codeTab as 'html' | 'react';
      root.querySelectorAll('[data-code-tab]').forEach((t) => t.classList.toggle('is-active', t === b));
      renderCode();
    });
  });

  function attrs(): string {
    return `variant="${state.variant}" intensity="${state.intensity}" depth="${state.depth}" theme="${state.theme}" speed="${state.speed}" accent-color="${state.accent}"`;
  }

  function renderPreview(): void {
    const a = attrs();
    const tag = state.component;
    let inner = '';
    switch (tag) {
      case 'lumina-button': inner = `<lumina-button ${a}>Clique aqui</lumina-button>`; break;
      case 'lumina-card': inner = `<lumina-card ${a}><h3 slot="title">Título</h3><p>Conteúdo do card.</p></lumina-card>`; break;
      case 'lumina-input': inner = `<lumina-input ${a} placeholder="Digite..."></lumina-input>`; break;
      case 'lumina-toggle': inner = `<lumina-toggle ${a} checked>Toggle</lumina-toggle>`; break;
      case 'lumina-progress': inner = `<lumina-progress ${a} value="55"></lumina-progress>`; break;
      case 'lumina-badge': inner = `<lumina-badge ${a} dot pulse>NEW</lumina-badge>`; break;
      case 'lumina-modal': inner = `<lumina-button ${a} id="studio-open">Abrir modal</lumina-button><lumina-modal ${a}><span slot="title">Modal</span><p>Demo.</p></lumina-modal>`; break;
      case 'lumina-navigation': inner = `<lumina-navigation ${a}><lumina-nav-item active>Home</lumina-nav-item><lumina-nav-item>About</lumina-nav-item></lumina-navigation>`; break;
      case 'lumina-tooltip': inner = `<lumina-tooltip ${a} side="top" content="Dica"><lumina-button ${a}>Hover</lumina-button></lumina-tooltip>`; break;
      case 'lumina-container': inner = `<lumina-container ${a}><div style="padding:20px;"><lumina-button ${a}>Inside</lumina-button></div></lumina-container>`; break;
      default: inner = `<lumina-button ${a}>Default</lumina-button>`;
    }
    previewStage.innerHTML = inner;
    const openBtn = previewStage.querySelector('#studio-open');
    const modal = previewStage.querySelector('lumina-modal') as any;
    if (openBtn && modal) {
      openBtn.addEventListener('lumina-press', () => modal.showModal());
    }
  }

  function renderCode(): void {
    const a = attrs();
    const tag = state.component;
    let html = '';
    if (codeMode === 'html') {
      switch (tag) {
        case 'lumina-button': html = `<lumina-button ${a}>Clique aqui</lumina-button>`; break;
        case 'lumina-card': html = `<lumina-card ${a}>\n  <h3 slot="title">Título</h3>\n  <p>Conteúdo do card.</p>\n</lumina-card>`; break;
        case 'lumina-input': html = `<lumina-input ${a} placeholder="Digite..."></lumina-input>`; break;
        case 'lumina-toggle': html = `<lumina-toggle ${a} checked>Toggle</lumina-toggle>`; break;
        case 'lumina-progress': html = `<lumina-progress ${a} value="55"></lumina-progress>`; break;
        case 'lumina-badge': html = `<lumina-badge ${a} dot pulse>NEW</lumina-badge>`; break;
        case 'lumina-modal': html = `<lumina-modal ${a}>\n  <span slot="title">Modal</span>\n  <p>Conteúdo do modal.</p>\n  <div slot="footer"><lumina-button variant="glass">OK</lumina-button></div>\n</lumina-modal>`; break;
        case 'lumina-navigation': html = `<lumina-navigation ${a}>\n  <lumina-nav-item active>Home</lumina-nav-item>\n  <lumina-nav-item>About</lumina-nav-item>\n</lumina-navigation>`; break;
        case 'lumina-tooltip': html = `<lumina-tooltip ${a} side="top" content="Dica">\n  <lumina-button ${a}>Hover</lumina-button>\n</lumina-tooltip>`; break;
        case 'lumina-container': html = `<lumina-container ${a}>\n  <lumina-button ${a}>Inside</lumina-button>\n</lumina-container>`; break;
        default: html = `<lumina-button ${a}>Default</lumina-button>`;
      }
      codeBody.innerHTML = `<lumina-code-block lang="html" title="HTML">${escapeHtml(html)}</lumina-code-block>`;
    } else {
      const camelAttrs = a
        .replace(/variant="([^"]+)"/g, 'variant="$1"')
        .replace(/intensity="([^"]+)"/g, 'intensity="$1"')
        .replace(/depth="([^"]+)"/g, 'depth="$1"')
        .replace(/theme="([^"]+)"/g, 'theme="$1"')
        .replace(/speed="([^"]+)"/g, 'speed={$1}')
        .replace(/accent-color="([^"]+)"/g, 'accent-color="$1"');
      html = `import 'lumina-ui';\n\nexport function MyComponent() {\n  return (\n    <${tag} ${camelAttrs}>\n      Conteúdo\n    </${tag}>\n  );\n}`;
      codeBody.innerHTML = `<lumina-code-block lang="tsx" title="React">${escapeHtml(html)}</lumina-code-block>`;
    }
  }

  function render(): void {
    renderPreview();
    renderCode();
  }

  render();
  return root;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
