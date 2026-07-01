/**
 * Playground section — interactive component browser with live preview
 * and Monaco-based code viewer (TypeScript source, Vanilla usage, React usage).
 *
 * v0.3.0 — now browses all 100 components grouped by category.
 */
import type { Route } from '../app';
import { COMPONENT_METAS, CATEGORIES } from '../data/components';
import type { ComponentMeta } from '../data/components';
import { el, sectionHead, VARIANTS, INTENSITIES } from './_shared';

export default async function playgroundSection(route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'playground' });
  const initialTag = route.param ?? COMPONENT_METAS[0].tag;
  const current = COMPONENT_METAS.find((c) => c.tag === initialTag) ?? COMPONENT_METAS[0];

  // Build sidebar grouped by category
  const sidebarHtml = CATEGORIES.map((cat) => {
    const items = COMPONENT_METAS.filter((c) => c.category === cat.id);
    if (items.length === 0) return '';
    return `
      <div class="playground__sidebar-group">
        <div class="playground__sidebar-cat">
          <span class="playground__sidebar-icon">${cat.icon}</span>
          <span>${cat.label}</span>
          <span class="playground__sidebar-count">${items.length}</span>
        </div>
        ${items.map((c) => `
          <a class="playground__link ${c.tag === current.tag ? 'is-active' : ''}" href="#/playground/${c.tag}">
            <span class="playground__link-tag">&lt;${c.tag}&gt;</span>
          </a>
        `).join('')}
      </div>
    `;
  }).join('');

  root.innerHTML = `
    ${sectionHead('01', 'Playground', '100 componentes · 8 categorias · código TypeScript/Vanilla/React · Monaco editor embutido.').outerHTML}

    <div class="playground__layout">
      <aside class="playground__sidebar">
        <div class="playground__sidebar-label">Componentes (100)</div>
        ${sidebarHtml}
      </aside>

      <div class="playground__main">
        <div class="playground__head">
          <div>
            <h2 class="playground__title">&lt;${current.tag}&gt;</h2>
            <p class="playground__desc">${current.description}</p>
            <div class="playground__meta">
              <span class="playground__meta-pill">${current.tier}</span>
              <span class="playground__meta-pill">${current.variants.length} variants</span>
              <span class="playground__meta-pill">${current.parts.length} parts</span>
              ${(current.events?.length ?? 0) > 0 ? `<span class="playground__meta-pill">${current.events?.length} events</span>` : ''}
            </div>
          </div>
          <div class="playground__controls" data-controls>
            <label class="control control--inline">
              <span class="control__label">variant</span>
              <select data-variant></select>
            </label>
            <label class="control control--inline">
              <span class="control__label">intensity</span>
              <select data-intensity>
                ${INTENSITIES.map((v) => `<option value="${v}">${v}</option>`).join('')}
              </select>
            </label>
            <label class="control control--inline">
              <span class="control__label">accent</span>
              <input type="color" data-accent value="${current.accent ?? '#7c5cff'}" />
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

        <div class="playground__info" data-info></div>
      </div>
    </div>
  `;

  // ---- Wire up ----------------------------------------------------------
  const viewer = root.querySelector('[data-viewer]') as any;
  const previewInner = root.querySelector('[data-preview-inner]') as HTMLElement;
  const variantSel = root.querySelector('[data-variant]') as HTMLSelectElement;
  const intensitySel = root.querySelector('[data-intensity]') as HTMLSelectElement;
  const accentInput = root.querySelector('[data-accent]') as HTMLInputElement;
  const infoHost = root.querySelector('[data-info]') as HTMLElement;

  // Populate variant select with the component's variants
  const componentVariants = current.variants;
  variantSel.innerHTML = componentVariants
    .map((v: string) => `<option value="${v}">${v}</option>`)
    .join('');

  const state = {
    variant: componentVariants[0] ?? 'glass',
    intensity: 'intense' as string,
    accent: current.accent ?? '#7c5cff',
  };

  function renderPreview(): void {
    previewInner.innerHTML = buildPreviewHTML(current, state);
  }

  function renderViewer(): void {
    const tabs = [
      { id: 'component', label: 'TypeScript', language: 'typescript', code: current.snippets.component },
      { id: 'vanilla', label: 'Vanilla HTML', language: 'html', code: current.snippets.vanilla },
      { id: 'react', label: 'React', language: 'typescript', code: current.snippets.react },
    ];
    viewer.setTabs(tabs);
  }

  function renderInfo(): void {
    const events = (current.events ?? []).map((e: string) => `<code>${e}</code>`).join(' ');
    const parts = current.parts.map((p: string) => `<code>${p}</code>`).join(' ');
    const slots = (current.slots ?? []).map((s: string) => `<code>${s}</code>`).join(' ');
    const props = (current.props ?? []).map((p: any) => `<code>${p.name}: ${p.type}</code>`).join(' ');
    infoHost.innerHTML = `
      <div class="playground__info-grid">
        <div><strong>Events</strong><div class="playground__info-list">${events || '<em>(none)</em>'}</div></div>
        <div><strong>CSS parts</strong><div class="playground__info-list">${parts || '<em>(none)</em>'}</div></div>
        <div><strong>Slots</strong><div class="playground__info-list">${slots || '<em>(none)</em>'}</div></div>
        <div><strong>Props</strong><div class="playground__info-list">${props || '<em>(only shared)</em>'}</div></div>
      </div>
    `;
  }

  variantSel.addEventListener('change', () => { state.variant = variantSel.value; renderPreview(); });
  intensitySel.addEventListener('change', () => { state.intensity = intensitySel.value; renderPreview(); });
  accentInput.addEventListener('input', () => { state.accent = accentInput.value; renderPreview(); });

  renderPreview();
  renderViewer();
  renderInfo();

  return root;
}

/** Build live preview HTML per component category. */
function buildPreviewHTML(meta: ComponentMeta, state: { variant: string; intensity: string; accent: string }): string {
  const tag = meta.tag;
  const attrs = `variant="${state.variant}" intensity="${state.intensity}" accent-color="${state.accent}"`;
  const cat = meta.category;
  switch (cat) {
    case 'buttons':
      return `<${tag} ${attrs} speed="0.45">Click me</${tag}>`;
    case 'cards':
      return `<${tag} ${attrs}>
        <h3 slot="title">${meta.name.replace('Lumina', '')}</h3>
        <p slot="subtitle">${meta.tier}</p>
        <p>Conteúdo de exemplo para ${tag}.</p>
      </${tag}>`;
    case 'inputs':
      if (tag === 'lumina-textarea' || tag === 'lumina-signature-pad' || tag === 'lumina-file-upload') {
        return `<${tag} ${attrs} placeholder="Digite algo..."></${tag}>`;
      }
      return `<${tag} ${attrs} placeholder="Digite algo..."></${tag}>`;
    case 'navigation':
      if (tag === 'lumina-tabs' || tag === 'lumina-breadcrumbs' || tag === 'lumina-pagination' || tag === 'lumina-step-indicator') {
        return `<${tag} ${attrs}>
          <span>Item A</span><span>Item B</span><span>Item C</span>
        </${tag}>`;
      }
      return `<${tag} ${attrs}><span>Item 1</span><span>Item 2</span></${tag}>`;
    case 'feedback':
      if (tag === 'lumina-progress') return `<${tag} ${attrs} value="62"></${tag}>`;
      if (tag === 'lumina-skeleton') return `<${tag} ${attrs} shape="rectangle" width="200px" height="60px"></${tag}>`;
      if (tag === 'lumina-loading' || tag === 'lumina-spinner' || tag === 'lumina-neural-loader') {
        return `<${tag} ${attrs} size="64"></${tag}>`;
      }
      if (tag === 'lumina-status-indicator' || tag === 'lumina-pulse-indicator') {
        return `<${tag} ${attrs}>Online</${tag}>`;
      }
      if (tag === 'lumina-notification-badge') return `<${tag} ${attrs} count="7"><span style="font-size:24px;">🔔</span></${tag}>`;
      return `<${tag} ${attrs}>${meta.name.replace('Lumina', '')}</${tag}>`;
    case 'overlays':
      if (tag === 'lumina-modal' || tag === 'lumina-dialog' || tag === 'lumina-confirmation-dialog' || tag === 'lumina-drawer-modal') {
        return `<div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
          <lumina-button ${attrs} id="preview-open-${tag}">Abrir ${meta.name.replace('Lumina', '')}</lumina-button>
          <${tag} ${attrs}>
            <span slot="title">${meta.name.replace('Lumina', '')}</span>
            <p>Preview do ${tag}.</p>
            <div slot="footer"><lumina-button variant="glass">OK</lumina-button></div>
          </${tag}>
        </div>`;
      }
      if (tag === 'lumina-tooltip' || tag === 'lumina-popover') {
        return `<${tag} ${attrs} content="Hint contextual">
          <lumina-button ${attrs}>Hover me</lumina-button>
        </${tag}>`;
      }
      return `<${tag} ${attrs}>Trigger</${tag}>`;
    case 'data':
      if (tag === 'lumina-avatar') return `<${tag} ${attrs} name="John Doe" size="64"></${tag}>`;
      if (tag === 'lumina-avatar-group') return `<${tag} ${attrs} max="3">
        <lumina-avatar name="A"></lumina-avatar>
        <lumina-avatar name="B"></lumina-avatar>
        <lumina-avatar name="C"></lumina-avatar>
        <lumina-avatar name="D"></lumina-avatar>
      </${tag}>`;
      return `<${tag} ${attrs}>
        <div>Row 1</div><div>Row 2</div><div>Row 3</div>
      </${tag}>`;
    case 'unique':
      return `<${tag} ${attrs}>
        <p>Unique component — ${meta.tagline}</p>
      </${tag}>`;
    default:
      return `<${tag} ${attrs}>Default</${tag}>`;
  }
}
