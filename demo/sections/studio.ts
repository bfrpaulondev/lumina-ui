/**
 * Make it Yours Studio — tweak attributes via controls, see live preview
 * and copy the generated code (HTML + React). Now uses all 100 components.
 */
import type { Route } from '../app';
import { COMPONENT_METAS, CATEGORIES } from '../data/components';
import type { ComponentMeta } from '../data/components';
import { el, sectionHead, INTENSITIES, DEPTHS, THEMES, ACCENTS } from './_shared';

export default async function studioSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'studio' });

  // Group components by category for the select
  const componentOptgroups = CATEGORIES.map((cat) => {
    const items = COMPONENT_METAS.filter((c) => c.category === cat.id);
    return `<optgroup label="${cat.label}">
      ${items.map((c) => `<option value="${c.tag}">&lt;${c.tag}&gt;</option>`).join('')}
    </optgroup>`;
  }).join('');

  root.innerHTML = `
    ${sectionHead('✦', 'Make it Yours Studio', 'Escolha entre os 100 componentes + variante + intensidade + accent e copie o código pronto.').outerHTML}

    <div class="studio__layout">
      <div class="studio__controls">
        <label class="control">
          <div class="control__head"><span class="control__label">component (100)</span></div>
          <select data-studio-component>${componentOptgroups}</select>
        </label>
        <label class="control">
          <div class="control__head"><span class="control__label">variant</span></div>
          <select data-studio-variant></select>
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

  const initialMeta = COMPONENT_METAS[0];
  const state = {
    component: initialMeta.tag,
    variant: initialMeta.variants[0] ?? 'glass',
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

  function populateVariants(): void {
    const meta = COMPONENT_METAS.find((c) => c.tag === state.component)!;
    variantSel.innerHTML = meta.variants.map((v) => `<option value="${v}">${v}</option>`).join('');
    state.variant = meta.variants[0] ?? 'glass';
  }

  function attrs(): string {
    return `variant="${state.variant}" intensity="${state.intensity}" depth="${state.depth}" theme="${state.theme}" speed="${state.speed}" accent-color="${state.accent}"`;
  }

  function renderPreview(): void {
    const a = attrs();
    const tag = state.component;
    const meta = COMPONENT_METAS.find((c) => c.tag === tag)!;
    previewStage.innerHTML = buildPreviewFor(meta, a);
    // Wire any open buttons inside the preview
    const openBtn = previewStage.querySelector('[data-studio-open]');
    const modal = previewStage.querySelector('[data-studio-modal]') as any;
    if (openBtn && modal) {
      openBtn.addEventListener('lumina-press', () => modal.showModal?.());
    }
  }

  function renderCode(): void {
    const a = attrs();
    const tag = state.component;
    const meta = COMPONENT_METAS.find((c) => c.tag === tag)!;
    let html = '';
    if (codeMode === 'html') {
      html = buildHtmlSnippet(meta, a);
      codeBody.innerHTML = `<lumina-code-block lang="html" title="HTML">${escapeHtml(html)}</lumina-code-block>`;
    } else {
      html = buildReactSnippet(meta, a);
      codeBody.innerHTML = `<lumina-code-block lang="tsx" title="React">${escapeHtml(html)}</lumina-code-block>`;
    }
  }

  function render(): void { renderPreview(); renderCode(); }

  componentSel.addEventListener('change', () => { state.component = componentSel.value; populateVariants(); render(); });
  variantSel.addEventListener('change', () => { state.variant = variantSel.value; render(); });
  intensitySel.addEventListener('change', () => { state.intensity = intensitySel.value; render(); });
  depthSel.addEventListener('change', () => { state.depth = depthSel.value; render(); });
  themeSel.addEventListener('change', () => { state.theme = themeSel.value; render(); });
  speedInput.addEventListener('input', () => { state.speed = parseFloat(speedInput.value); render(); });
  accentInput.addEventListener('input', () => { state.accent = accentInput.value; render(); });
  root.querySelectorAll('[data-swatch]').forEach((b) => {
    b.addEventListener('click', () => { state.accent = (b as HTMLElement).dataset.swatch!; accentInput.value = state.accent; render(); });
  });
  root.querySelectorAll('[data-code-tab]').forEach((b) => {
    b.addEventListener('click', () => {
      codeMode = (b as HTMLElement).dataset.codeTab as 'html' | 'react';
      root.querySelectorAll('[data-code-tab]').forEach((t) => t.classList.toggle('is-active', t === b));
      renderCode();
    });
  });

  populateVariants();
  render();
  return root;
}

function buildPreviewFor(meta: ComponentMeta, attrs: string): string {
  const tag = meta.tag;
  const cat = meta.category;
  switch (cat) {
    case 'buttons':
      return `<${tag} ${attrs}>Clique aqui</${tag}>`;
    case 'cards':
      return `<${tag} ${attrs}><h3 slot="title">Título</h3><p>Conteúdo do ${tag}.</p></${tag}>`;
    case 'inputs':
      return `<${tag} ${attrs} placeholder="Digite..."></${tag}>`;
    case 'feedback':
      if (tag === 'lumina-progress') return `<${tag} ${attrs} value="55"></${tag}>`;
      return `<${tag} ${attrs}>${meta.name.replace('Lumina','')}</${tag}>`;
    case 'overlays':
      if (tag === 'lumina-modal' || tag.endsWith('-dialog') || tag === 'lumina-drawer-modal') {
        return `<${tag} ${attrs}><span slot="title">Modal</span><p>Demo.</p></${tag}>`;
      }
      return `<${tag} ${attrs}>Trigger</${tag}>`;
    default:
      return `<${tag} ${attrs}>Conteúdo</${tag}>`;
  }
}

function buildHtmlSnippet(meta: ComponentMeta, attrs: string): string {
  const tag = meta.tag;
  const cat = meta.category;
  switch (cat) {
    case 'buttons':
      return `<${tag} ${attrs}>Clique aqui</${tag}>`;
    case 'cards':
      return `<${tag} ${attrs}>\n  <h3 slot="title">Título</h3>\n  <p>Conteúdo do ${tag}.</p>\n</${tag}>`;
    case 'inputs':
      return `<${tag} ${attrs} placeholder="Digite..."></${tag}>`;
    case 'feedback':
      if (tag === 'lumina-progress') return `<${tag} ${attrs} value="55"></${tag}>`;
      if (tag === 'lumina-skeleton') return `<${tag} ${attrs} shape="rectangle" width="200px" height="60px"></${tag}>`;
      return `<${tag} ${attrs}>${meta.name.replace('Lumina','')}</${tag}>`;
    case 'overlays':
      if (tag === 'lumina-modal' || tag.endsWith('-dialog') || tag === 'lumina-drawer-modal') {
        return `<${tag} ${attrs}>\n  <span slot="title">Modal</span>\n  <p>Conteúdo do modal.</p>\n  <div slot="footer"><lumina-button variant="glass">OK</lumina-button></div>\n</${tag}>`;
      }
      return `<${tag} ${attrs}>\n  <lumina-button>Trigger</lumina-button>\n</${tag}>`;
    default:
      return `<${tag} ${attrs}>\n  Conteúdo\n</${tag}>`;
  }
}

function buildReactSnippet(meta: ComponentMeta, attrs: string): string {
  const tag = meta.tag;
  const className = meta.name.replace('Lumina', '');
  const reactAttrs = attrs
    .replace(/speed="([^"]+)"/g, 'speed={$1}')
    .replace(/accent-color=/g, 'accent-color=');
  return `import 'lumina-ui';\n\nexport function ${className}Example() {\n  return (\n    <${tag} ${reactAttrs}>\n      Conteúdo\n    </${tag}>\n  );\n}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
