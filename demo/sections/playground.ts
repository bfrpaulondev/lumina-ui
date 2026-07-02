/**
 * LuminaUI — Playground section (v2)
 *
 * Redesigned with:
 * - Rich multi-variant previews for buttons (semantic types + states + variants)
 * - Live event console showing all lumina-* and native events
 * - Code that mirrors exactly what's in the preview
 * - Interactive controls for variant/intensity/accent
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
    ${sectionHead('01', 'Playground', '100 componentes · 8 categorias · código TypeScript/Vanilla/React · console de eventos ao vivo.').outerHTML}

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

        <!-- Event Console (always visible) -->
        <div class="playground__console" data-console>
          <div class="playground__console-head">
            <span class="playground__console-title">📡 Event Console</span>
            <button class="playground__console-clear" data-console-clear>Limpar</button>
          </div>
          <div class="playground__console-body" data-console-body></div>
        </div>

        <!-- Preview Gallery -->
        <div class="playground__gallery" data-gallery></div>

        <!-- Code Viewer -->
        <div class="playground__code">
          <lumina-code-viewer data-viewer></lumina-code-viewer>
        </div>

        <!-- Info Grid -->
        <div class="playground__info" data-info></div>
      </div>
    </div>
  `;

  // ---- Wire up ----------------------------------------------------------
  const viewer = root.querySelector('[data-viewer]') as any;
  const gallery = root.querySelector('[data-gallery]') as HTMLElement;
  const consoleBody = root.querySelector('[data-console-body]') as HTMLElement;
  const variantSel = root.querySelector('[data-variant]') as HTMLSelectElement;
  const intensitySel = root.querySelector('[data-intensity]') as HTMLSelectElement;
  const accentInput = root.querySelector('[data-accent]') as HTMLInputElement;
  const infoHost = root.querySelector('[data-info]') as HTMLElement;

  const componentVariants = current.variants;
  variantSel.innerHTML = componentVariants
    .map((v: string) => `<option value="${v}">${v}</option>`)
    .join('');

  const state = {
    variant: componentVariants[0] ?? 'glass',
    intensity: 'intense' as string,
    accent: current.accent ?? '#7c5cff',
  };

  // ===== Event Console =====
  function logEvent(eventName: string, detail?: any): void {
    const time = new Date().toLocaleTimeString();
    const detailStr = detail ? ` <span style="color:#78f0ff">detail: ${JSON.stringify(detail)}</span>` : '';
    const entry = document.createElement('div');
    entry.className = 'playground__console-entry';
    entry.innerHTML = `<span style="color:rgba(245,245,255,0.4)">[${time}]</span> <span style="color:#7c5cff;font-weight:700">${eventName}</span>${detailStr}`;
    consoleBody.appendChild(entry);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  // Clear console
  root.querySelector('[data-console-clear]')?.addEventListener('click', () => {
    consoleBody.innerHTML = '';
  });

  // ===== Attach events to all elements in gallery =====
  function attachGalleryEvents(): void {
    const allLumina = gallery.querySelectorAll('[id^="demo-"]');
    allLumina.forEach((el) => {
      const events = [
        'lumina-click', 'lumina-press', 'lumina-hover-start', 'lumina-hover-end',
        'lumina-focus', 'lumina-blur', 'lumina-change', 'lumina-ripple',
        'lumina-magnetic-start', 'lumina-portal-open', 'lumina-echo',
        'lumina-shortcut', 'lumina-gesture', 'lumina-menu-open', 'lumina-menu-close',
        'lumina-menu-select', 'lumina-morph-start', 'lumina-morph-end',
        'lumina-card-select', 'lumina-stack-change', 'lumina-reveal',
        'lumina-parallax', 'lumina-hover', 'lumina-interact',
        'lumina-particle-interact', 'lumina-memory-update', 'lumina-echo',
        'lumina-context-change', 'lumina-sentiment-change', 'lumina-input',
        'lumina-file-add', 'lumina-file-remove', 'lumina-upload-progress',
        'lumina-color-change', 'lumina-date-change', 'lumina-time-change',
        'lumina-signature-start', 'lumina-signature-end',
        'lumina-voice-start', 'lumina-voice-end', 'lumina-transcript',
        'lumina-tab-change', 'lumina-nav-change', 'lumina-navigate',
        'lumina-page-change', 'lumina-toggle', 'lumina-step-change',
        'lumina-show', 'lumina-hide', 'lumina-select', 'lumina-confirm',
        'lumina-cancel', 'lumina-open', 'lumina-close', 'lumina-dismiss',
        'lumina-close', 'lumina-strength-change', 'lumina-visibility-toggle',
        'lumina-suggestion-select', 'lumina-suggestion-highlight',
        'lumina-progress', 'lumina-progress-complete',
        'lumina-status-change', 'lumina-clear', 'lumina-pulse',
        'lumina-depth-change', 'lumina-particle-burst',
        'lumina-backdrop-click', 'lumina-zoom-change', 'lumina-navigate',
        'lumina-expand', 'lumina-collapse', 'lumina-reveal-start',
        'lumina-reveal-complete', 'lumina-morph', 'lumina-tilt-start',
        'lumina-tilt-end', 'lumina-press',
      ];
      events.forEach((evt) => {
        el.addEventListener(evt, (e: Event) => {
          const ce = e as CustomEvent;
          logEvent(evt, ce.detail);
        });
      });

      // Native events
      ['click', 'dblclick'].forEach((nativeEvt) => {
        el.addEventListener(nativeEvt, () => {
          logEvent(`native:${nativeEvt}`);
          if (nativeEvt === 'dblclick') {
            logEvent('💡 Double-click detectado! Use addEventListener("dblclick", ...) para capturar.');
          }
        });
      });
    });
  }

  // ===== Gallery: build rich multi-variant previews =====
  function renderGallery(): void {
    gallery.innerHTML = buildGalleryHTML(current, state);
    attachGalleryEvents();
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

  variantSel.addEventListener('change', () => { state.variant = variantSel.value; renderGallery(); });
  intensitySel.addEventListener('change', () => { state.intensity = intensitySel.value; renderGallery(); });
  accentInput.addEventListener('input', () => { state.accent = accentInput.value; renderGallery(); });

  renderGallery();
  renderViewer();
  renderInfo();

  return root;
}

/**
 * Build the gallery HTML — a rich multi-variant showcase for each component.
 * For buttons, this includes semantic types (primary, default, dashed, text, link),
 * states (danger, ghost, disabled, loading), and all visual variants.
 */
function buildGalleryHTML(meta: ComponentMeta, state: { variant: string; intensity: string; accent: string }): string {
  const tag = meta.tag;
  const cat = meta.category;
  const a = `variant="${state.variant}" intensity="${state.intensity}" accent-color="${state.accent}" theme="dark"`;

  // ===== BUTTONS: rich gallery with semantic types + states + variants =====
  if (cat === 'buttons') {
    return buildButtonGallery(tag, state, a);
  }

  // ===== Default: single preview =====
  return `<div class="playground__gallery-row">
    <div class="playground__gallery-label">Preview</div>
    <div class="playground__gallery-items">${buildSinglePreview(tag, a, meta)}</div>
  </div>`;
}

function buildButtonGallery(tag: string, state: { variant: string; intensity: string; accent: string }, attrs: string): string {
  // Special galleries for each button type
  switch (tag) {
    case 'lumina-button':
      return buildLuminaButtonGallery(state, attrs);
    case 'lumina-icon-button':
      return `
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Sizes (sm / md / lg)</div>
          <div class="playground__gallery-items">
            <lumina-icon-button id="demo-1" ${attrs} size="sm">⚙</lumina-icon-button>
            <lumina-icon-button id="demo-2" ${attrs} size="md">★</lumina-icon-button>
            <lumina-icon-button id="demo-3" ${attrs} size="lg">♥</lumina-icon-button>
          </div>
        </div>
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Variants</div>
          <div class="playground__gallery-items">
            <lumina-icon-button id="demo-4" variant="glass" intensity="${state.intensity}" accent-color="${state.accent}" size="md" theme="dark">⚙</lumina-icon-button>
            <lumina-icon-button id="demo-5" variant="neural" intensity="${state.intensity}" accent-color="${state.accent}" size="md" theme="dark">⚙</lumina-icon-button>
            <lumina-icon-button id="demo-6" variant="aura" intensity="${state.intensity}" accent-color="${state.accent}" size="md" theme="dark">⚙</lumina-icon-button>
            <lumina-icon-button id="demo-7" variant="minimal" intensity="${state.intensity}" accent-color="${state.accent}" size="md" theme="dark">⚙</lumina-icon-button>
          </div>
        </div>
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Disabled</div>
          <div class="playground__gallery-items">
            <lumina-icon-button id="demo-8" ${attrs} size="md" disabled>⚙</lumina-icon-button>
          </div>
        </div>
      `;
    case 'lumina-fab':
      return `
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Variants</div>
          <div class="playground__gallery-items" style="min-height:80px;">
            <lumina-fab id="demo-1" variant="glass" accent-color="${state.accent}" theme="dark">+</lumina-fab>
            <lumina-fab id="demo-2" variant="neural" accent-color="${state.accent}" theme="dark">★</lumina-fab>
            <lumina-fab id="demo-3" variant="aura" accent-color="${state.accent}" theme="dark">♥</lumina-fab>
          </div>
        </div>
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Extended (with label)</div>
          <div class="playground__gallery-items">
            <lumina-fab id="demo-4" variant="extended" accent-color="${state.accent}" theme="dark">+<span slot="label">Nova tarefa</span></lumina-fab>
          </div>
        </div>
      `;
    case 'lumina-split-button':
      return `
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Split Button (clique na seta para o menu)</div>
          <div class="playground__gallery-items">
            <lumina-split-button id="demo-1" ${attrs}
              menu-items='[{"label":"Editar","icon":"✎","value":"edit"},{"label":"Duplicar","icon":"⧉","value":"dup"},{"label":"Excluir","icon":"✕","value":"del"}]'
            >Salvar</lumina-split-button>
          </div>
        </div>
      `;
    case 'lumina-toggle-button':
      return `
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Toggle (clique para alternar)</div>
          <div class="playground__gallery-items">
            <lumina-toggle-button id="demo-1" ${attrs}>Modo escuro</lumina-toggle-button>
            <lumina-toggle-button id="demo-2" variant="neural" intensity="${state.intensity}" accent-color="#ff6ec7" pressed theme="dark">Neural ON</lumina-toggle-button>
            <lumina-toggle-button id="demo-3" variant="aura" intensity="${state.intensity}" accent-color="#ffd166" theme="dark">Aura</lumina-toggle-button>
          </div>
        </div>
      `;
    case 'lumina-button-group':
      return `
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Segmented (clique para selecionar)</div>
          <div class="playground__gallery-items">
            <lumina-button-group id="demo-1" ${attrs} variant="segmented" value="b">
              <button data-value="a">A</button>
              <button data-value="b">B</button>
              <button data-value="c">C</button>
            </lumina-button-group>
          </div>
        </div>
      `;
    case 'lumina-command-button':
      return `
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Command Button (tente Ctrl+S!)</div>
          <div class="playground__gallery-items">
            <lumina-command-button id="demo-1" ${attrs} shortcut="⌘K">Buscar comandos</lumina-command-button>
            <lumina-command-button id="demo-2" variant="neural" intensity="${state.intensity}" accent-color="#ff6ec7" shortcut="Ctrl+S" theme="dark">Salvar</lumina-command-button>
          </div>
        </div>
      `;
    case 'lumina-ripple-button':
      return `
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Ripple (clique em diferentes pontos!)</div>
          <div class="playground__gallery-items">
            <lumina-ripple-button id="demo-1" ${attrs} ripple-duration="800">Clique aqui</lumina-ripple-button>
          </div>
        </div>
      `;
    case 'lumina-magnetic-button':
      return `
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Magnetic (aproxime o cursor!)</div>
          <div class="playground__gallery-items">
            <lumina-magnetic-button id="demo-1" ${attrs} magnetic-strength="0.5">Aproxime o cursor</lumina-magnetic-button>
          </div>
        </div>
      `;
    case 'lumina-gesture-button':
      return `
        <div class="playground__gallery-row">
          <div class="playground__gallery-label">Gesture (toque • segure 0.5s • arraste • 2x clique)</div>
          <div class="playground__gallery-items">
            <lumina-gesture-button id="demo-1" ${attrs} gestures="hold,swipe,double-tap">Toque • segure • arraste</lumina-gesture-button>
          </div>
        </div>
      `;
    default:
      return `<div class="playground__gallery-row">
        <div class="playground__gallery-label">Demo</div>
        <div class="playground__gallery-items">
          <${tag} id="demo-1" ${attrs}>${tag.replace('lumina-', '').replace(/-/g, ' ')}</${tag}>
        </div>
      </div>`;
  }
}

/**
 * The main lumina-button gallery — shows semantic types, states, and variants.
 */
function buildLuminaButtonGallery(state: { variant: string; intensity: string; accent: string }, attrs: string): string {
  return `
    <!-- Semantic Types -->
    <div class="playground__gallery-row">
      <div class="playground__gallery-label">🔵 Primary (ação principal)</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-primary" ${attrs} speed="0.45">Confirmar</lumina-button>
      </div>
    </div>

    <div class="playground__gallery-row">
      <div class="playground__gallery-label">⚪️ Default (sem prioridade)</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-default" ${attrs} intensity="medium">Cancelar</lumina-button>
        <lumina-button id="demo-default2" ${attrs} intensity="medium">Voltar</lumina-button>
      </div>
    </div>

    <div class="playground__gallery-row">
      <div class="playground__gallery-label">🔤 Text (ação secundária)</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-text" variant="glass" intensity="subtle" accent-color="${state.accent}" speed="0.3" theme="dark">Saiba mais</lumina-button>
      </div>
    </div>

    <div class="playground__gallery-row">
      <div class="playground__gallery-label">🔗 Link (link externo)</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-link" variant="glass" intensity="subtle" accent-color="#78f0ff" speed="0.3" theme="dark">Abrir documentação →</lumina-button>
      </div>
    </div>

    <!-- States -->
    <div class="playground__gallery-row">
      <div class="playground__gallery-label">🔴 Danger (ação de risco)</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-danger" variant="void" intensity="extreme" accent-color="#ff5577" speed="0.4" theme="dark">Excluir permanentemente</lumina-button>
      </div>
    </div>

    <div class="playground__gallery-row">
      <div class="playground__gallery-label">👻 Ghost (fundo complexo)</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-ghost" variant="glass" intensity="subtle" accent-color="${state.accent}" speed="0.3" theme="dark">Ghost button</lumina-button>
      </div>
    </div>

    <div class="playground__gallery-row">
      <div class="playground__gallery-label">🚫 Disabled (indisponível)</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-disabled" ${attrs} disabled>Disabled</lumina-button>
      </div>
    </div>

    <div class="playground__gallery-row">
      <div class="playground__gallery-label">🔃 Loading (carregando)</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-loading" ${attrs} disabled>Carregando...</lumina-button>
      </div>
    </div>

    <!-- Block -->
    <div class="playground__gallery-row">
      <div class="playground__gallery-label">⬛ Block (largura total)</div>
      <div class="playground__gallery-items" style="max-width:300px;">
        <lumina-button id="demo-block" ${attrs} style="width:100%;display:block;">Botão em bloco</lumina-button>
      </div>
    </div>

    <!-- All Variants -->
    <div class="playground__gallery-row">
      <div class="playground__gallery-label">🎨 Todas as variantes</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-v1" variant="glass" intensity="${state.intensity}" accent-color="${state.accent}" theme="dark">Glass</lumina-button>
        <lumina-button id="demo-v2" variant="morph" intensity="${state.intensity}" accent-color="${state.accent}" theme="dark">Morph</lumina-button>
        <lumina-button id="demo-v3" variant="neural" intensity="${state.intensity}" accent-color="${state.accent}" theme="dark">Neural</lumina-button>
        <lumina-button id="demo-v4" variant="void" intensity="${state.intensity}" accent-color="${state.accent}" theme="dark">Void</lumina-button>
        <lumina-button id="demo-v5" variant="aura" intensity="${state.intensity}" accent-color="${state.accent}" theme="dark">Aura</lumina-button>
        <lumina-button id="demo-v6" variant="dimensional" intensity="${state.intensity}" accent-color="${state.accent}" depth="deep" theme="dark">Dimensional</lumina-button>
      </div>
    </div>

    <!-- Icon + Text -->
    <div class="playground__gallery-row">
      <div class="playground__gallery-label">🔤 Ícone + Texto</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-icon1" ${attrs}>✓ Salvar</lumina-button>
        <lumina-button id="demo-icon2" ${attrs}>🗑 Excluir</lumina-button>
        <lumina-button id="demo-icon3" ${attrs}>⬇ Download</lumina-button>
        <lumina-button id="demo-icon4" ${attrs}>⚡ Ação rápida</lumina-button>
      </div>
    </div>

    <!-- Custom Colors -->
    <div class="playground__gallery-row">
      <div class="playground__gallery-label">🌈 Cores customizadas</div>
      <div class="playground__gallery-items">
        <lumina-button id="demo-c1" variant="aura" intensity="extreme" accent-color="#ff6ec7" theme="dark">Pink</lumina-button>
        <lumina-button id="demo-c2" variant="dimensional" intensity="extreme" accent-color="#22c55e" depth="extrude" theme="dark">Green 3D</lumina-button>
        <lumina-button id="demo-c3" variant="neural" intensity="extreme" accent-color="#f59e0b" theme="dark">Amber</lumina-button>
        <lumina-button id="demo-c4" variant="void" intensity="extreme" accent-color="#ef4444" theme="dark">Red Void</lumina-button>
      </div>
    </div>
  `;
}

function buildSinglePreview(tag: string, attrs: string, meta: ComponentMeta): string {
  const cat = meta.category;
  switch (cat) {
    case 'cards':
      return `<${tag} id="demo-1" ${attrs}>
        <h3 slot="title">${meta.name.replace('Lumina', '')}</h3>
        <p>Conteúdo de exemplo.</p>
      </${tag}>`;
    case 'inputs':
      if (tag === 'lumina-select') {
        return `<${tag} id="demo-1" ${attrs} searchable placeholder="Escolha..." options='[{"value":"br","label":"Brasil","icon":"🇧🇷"},{"value":"us","label":"EUA","icon":"🇺🇸"}]'></${tag}>`;
      }
      if (tag === 'lumina-slider') {
        return `<${tag} id="demo-1" ${attrs} min="0" max="100" value="50" step="5"></${tag}>`;
      }
      if (tag === 'lumina-radio-group') {
        return `<${tag} id="demo-1" ${attrs} value="b">
          <button data-value="a">A</button>
          <button data-value="b">B</button>
          <button data-value="c">C</button>
        </${tag}>`;
      }
      return `<${tag} id="demo-1" ${attrs} placeholder="Digite algo..."></${tag}>`;
    case 'navigation':
      if (tag === 'lumina-tabs') {
        return `<${tag} id="demo-1" ${attrs} active-tab="t2">
          <lumina-tab id="t1" label="Geral" icon="⚙">Conteúdo Geral</lumina-tab>
          <lumina-tab id="t2" label="Conta" icon="👤" badge="3">Conteúdo Conta</lumina-tab>
          <lumina-tab id="t3" label="Ajuda" icon="?">Conteúdo Ajuda</lumina-tab>
        </${tag}>`;
      }
      return `<${tag} id="demo-1" ${attrs}><span>Item 1</span><span>Item 2</span></${tag}>`;
    case 'feedback':
      if (tag === 'lumina-progress') return `<${tag} id="demo-1" ${attrs} value="62"></${tag}>`;
      if (tag === 'lumina-skeleton') return `<${tag} id="demo-1" ${attrs} shape="rectangle" width="200px" height="60px"></${tag}>`;
      if (tag === 'lumina-loading') return `<${tag} id="demo-1" ${attrs} size="64" text="Carregando..."></${tag}>`;
      return `<${tag} id="demo-1" ${attrs}>${meta.name.replace('Lumina', '')}</${tag}>`;
    case 'overlays':
      if (tag === 'lumina-modal' || tag.endsWith('-dialog') || tag === 'lumina-drawer-modal') {
        return `<div style="display:flex;flex-direction:column;gap:12px;align-items:center;">
          <lumina-button id="demo-open-${tag}" ${attrs}>Abrir ${meta.name.replace('Lumina', '')}</lumina-button>
          <${tag} id="demo-1" ${attrs}>
            <span slot="title">${meta.name.replace('Lumina', '')}</span>
            <p>Preview do ${tag}.</p>
            <div slot="footer"><lumina-button variant="glass">OK</lumina-button></div>
          </${tag}>
        </div>`;
      }
      return `<${tag} id="demo-1" ${attrs}>Trigger</${tag}>`;
    case 'data':
      if (tag === 'lumina-avatar') return `<${tag} id="demo-1" ${attrs} name="John Doe" status="online" size="lg"></${tag}>`;
      return `<${tag} id="demo-1" ${attrs}>
        <div>Row 1</div><div>Row 2</div>
      </${tag}>`;
    case 'unique':
      return `<${tag} id="demo-1" ${attrs}>
        <p>${meta.tagline}</p>
      </${tag}>`;
    default:
      return `<${tag} id="demo-1" ${attrs}>Default</${tag}>`;
  }
}
