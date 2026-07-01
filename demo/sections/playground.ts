/**
 * Playground section — interactive component browser with live preview
 * and Monaco-based code viewer (TypeScript source, Vanilla usage, React usage).
 */
import type { Route } from '../app';
import { COMPONENTS } from '../data/components';
import { el, sectionHead, VARIANTS, INTENSITIES, DEPTHS } from './_shared';

export default async function playgroundSection(route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'playground' });
  const initialTag = route.param ?? COMPONENTS[0].tag;
  const current = COMPONENTS.find((c) => c.tag === initialTag) ?? COMPONENTS[0];

  root.innerHTML = `
    ${sectionHead('01', 'Playground', 'Veja o código de cada Web Component. Edite em tempo real no Monaco. Copie trechos em TypeScript, Vanilla JS/HTML ou React.').outerHTML}

    <div class="playground__layout">
      <aside class="playground__sidebar">
        <div class="playground__sidebar-label">Componentes</div>
        ${COMPONENTS.map((c) => `
          <a class="playground__link ${c.tag === current.tag ? 'is-active' : ''}" href="#/playground/${c.tag}">
            <span class="playground__link-tag">&lt;${c.tag}&gt;</span>
            <span class="playground__link-name">${c.name}</span>
          </a>
        `).join('')}
      </aside>

      <div class="playground__main">
        <div class="playground__head">
          <div>
            <h2 class="playground__title">&lt;${current.tag}&gt;</h2>
            <p class="playground__desc">${current.description}</p>
          </div>
          <div class="playground__controls" data-controls>
            <label class="control control--inline">
              <span class="control__label">variant</span>
              <select data-variant>
                ${VARIANTS.map((v) => `<option value="${v}">${v}</option>`).join('')}
              </select>
            </label>
            <label class="control control--inline">
              <span class="control__label">intensity</span>
              <select data-intensity>
                ${INTENSITIES.map((v) => `<option value="${v}">${v}</option>`).join('')}
              </select>
            </label>
            <label class="control control--inline">
              <span class="control__label">accent</span>
              <input type="color" data-accent value="${current.accent}" />
            </label>
          </div>
        </div>

        <div class="playground__split">
          <div class="playground__preview" data-preview>
            <div class="playground__preview-inner" data-preview-inner></div>
          </div>
          <div class="playground__code">
            <lumina-code-viewer data-viewer></lumina-code-viewer>
          </div>
        </div>

        <div class="playground__variants" data-variants>
          <!-- Variants quick switcher -->
        </div>
      </div>
    </div>
  `;

  // ---- Wire up interactivity -------------------------------------------

  const viewer = root.querySelector('[data-viewer]') as any;
  const previewInner = root.querySelector('[data-preview-inner]') as HTMLElement;
  const variantSel = root.querySelector('[data-variant]') as HTMLSelectElement;
  const intensitySel = root.querySelector('[data-intensity]') as HTMLSelectElement;
  const accentInput = root.querySelector('[data-accent]') as HTMLInputElement;
  const variantsContainer = root.querySelector('[data-variants]') as HTMLElement;

  let state = {
    variant: 'glass' as string,
    intensity: 'intense' as string,
    accent: current.accent,
  };

  // Initialize variant/intensity selects to current component's recommended
  const recommended = current.variants[0].recommended;
  state.variant = (recommended.intensity as any) ? 'glass' : 'glass';
  variantSel.value = state.variant;
  intensitySel.value = state.intensity;

  function renderPreview(): void {
    previewInner.innerHTML = buildPreviewHTML(current.tag, state);
    // Re-register any nested custom elements if they got disconnected
    previewInner.querySelectorAll('lumina-button, lumina-card, lumina-input, lumina-toggle, lumina-badge, lumina-progress, lumina-tooltip, lumina-navigation, lumina-nav-item, lumina-modal, lumina-container').forEach((el) => {
      // Trigger attribute application by toggling
    });
  }

  function renderViewer(): void {
    const tabs = [
      { id: 'component', label: 'TypeScript', language: 'typescript', code: current.snippets.component },
      { id: 'vanilla', label: 'Vanilla HTML', language: 'html', code: current.snippets.vanilla },
      { id: 'react', label: 'React', language: 'typescript', code: current.snippets.react },
    ];
    viewer.setTabs(tabs);
  }

  function renderVariantsRow(): void {
    variantsContainer.innerHTML = `
      <div class="playground__variants-label">Trocar variante rapidamente:</div>
      <div class="playground__variants-row">
        ${VARIANTS.map((v) => `
          <button class="playground__variant-chip ${v === state.variant ? 'is-active' : ''}" data-variant-chip="${v}">
            ${v}
          </button>
        `).join('')}
      </div>
    `;
    variantsContainer.querySelectorAll('[data-variant-chip]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const v = (btn as HTMLElement).dataset.variantChip!;
        state.variant = v;
        variantSel.value = v;
        updateVariantChips();
        renderPreview();
      });
    });
  }

  function updateVariantChips(): void {
    variantsContainer.querySelectorAll('[data-variant-chip]').forEach((btn) => {
      (btn as HTMLElement).classList.toggle('is-active', btn.getAttribute('data-variant-chip') === state.variant);
    });
  }

  variantSel.addEventListener('change', () => {
    state.variant = variantSel.value;
    updateVariantChips();
    renderPreview();
  });
  intensitySel.addEventListener('change', () => {
    state.intensity = intensitySel.value;
    renderPreview();
  });
  accentInput.addEventListener('input', () => {
    state.accent = accentInput.value;
    renderPreview();
  });

  renderPreview();
  renderViewer();
  renderVariantsRow();

  return root;
}

/** Build live preview HTML per component type. */
function buildPreviewHTML(tag: string, state: { variant: string; intensity: string; accent: string }): string {
  const attrs = `variant="${state.variant}" intensity="${state.intensity}" accent-color="${state.accent}"`;
  switch (tag) {
    case 'lumina-button':
      return `<lumina-button ${attrs} speed="0.45">Click me</lumina-button>`;
    case 'lumina-card':
      return `<lumina-card ${attrs}>
        <h3 slot="title">Título do card</h3>
        <p slot="subtitle">subtítulo</p>
        <p>Conteúdo de exemplo para demonstração do card.</p>
      </lumina-card>`;
    case 'lumina-input':
      return `<lumina-input ${attrs} placeholder="Digite algo..."></lumina-input>`;
    case 'lumina-toggle':
      return `<lumina-toggle ${attrs} checked>Ativado</lumina-toggle>`;
    case 'lumina-modal':
      return `<div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
        <lumina-button ${attrs} id="preview-open-modal">Abrir modal</lumina-button>
        <lumina-modal ${attrs}>
          <span slot="title">Modal preview</span>
          <p>Modal de demonstração.</p>
          <div slot="footer"><lumina-button variant="glass">OK</lumina-button></div>
        </lumina-modal>
      </div>`;
    case 'lumina-navigation':
      return `<lumina-navigation ${attrs}>
        <lumina-nav-item active>Home</lumina-nav-item>
        <lumina-nav-item>Explore</lumina-nav-item>
        <lumina-nav-item>Docs</lumina-nav-item>
      </lumina-navigation>`;
    case 'lumina-progress':
      return `<lumina-progress ${attrs} value="62"></lumina-progress>`;
    case 'lumina-badge':
      return `<div style="display:flex; gap:12px; flex-wrap:wrap;">
        <lumina-badge ${attrs} dot>default</lumina-badge>
        <lumina-badge ${attrs} dot pulse>live</lumina-badge>
        <lumina-badge ${attrs}>v0.1.0</lumina-badge>
      </div>`;
    case 'lumina-tooltip':
      return `<lumina-tooltip ${attrs} side="top" content="Tooltip no topo">
        <lumina-button ${attrs}>Hover me</lumina-button>
      </lumina-tooltip>`;
    case 'lumina-container':
      return `<lumina-container ${attrs}>
        <div style="padding:20px; text-align:center;">
          <lumina-button ${attrs}>Inside container</lumina-button>
        </div>
      </lumina-container>`;
    default:
      return `<lumina-button ${attrs}>Default</lumina-button>`;
  }
}
