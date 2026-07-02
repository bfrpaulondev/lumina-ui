/**
 * LuminaTabs — Sistema de abas com transições suaves, indicador FLIP,
 * ícones/badges por aba, navegação por teclado e painel com fade+slide.
 *
 * Variants: glass | neural | segmented | underline
 *
 * Estrutura:
 *   <lumina-tabs active-tab="tab-2" variant="glass">
 *     <lumina-tab id="tab-1" label="Geral" icon="⚙">Conteúdo 1</lumina-tab>
 *     <lumina-tab id="tab-2" label="Conta" badge="3">Conteúdo 2</lumina-tab>
 *   </lumina-tabs>
 *
 * Ouvia lumina-tab-change com e.detail = { id, label }
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { coerceAttr } from '../core/utils';
import { prefersReducedMotion } from '../core/utils';
import { formFieldSharedStyles } from '../core/form-field-mixin';

const ORIENTATIONS = ['horizontal', 'vertical'] as const;
type Orientation = (typeof ORIENTATIONS)[number];

class LuminaTab extends HTMLElement {
  static tagName = 'lumina-tab';

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host { display: none; }
      :host([active]) { display: block; }
    `);
    root.adoptedStyleSheets = [sheet];
  }

  connectedCallback(): void {
    if (!this.id) this.id = `tab-${Math.random().toString(36).slice(2, 9)}`;
  }
}

export class LuminaTabs extends LuminaElement {
  static tagName = 'lumina-tabs';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'active-tab',
      'orientation',
      'lazy',
    ];
  }

  private _activeTab = '';
  private _orientation: Orientation = 'horizontal';
  private _lazy = false;
  private indicator: HTMLElement | null = null;
  private panelsContainer: HTMLElement | null = null;
  private tabsRow: HTMLElement | null = null;
  private renderedPanels = new Set<string>();
  private previousTabRect: DOMRect | null = null;

  get activeTab(): string { return this._activeTab; }
  set activeTab(v: string) {
    this._activeTab = v;
    this.setAttribute('active-tab', v);
    this.activateTab(v);
  }

  get orientation(): Orientation { return this._orientation; }
  set orientation(v: Orientation) {
    this._orientation = v;
    this.setAttribute('orientation', v);
    this.applyOrientation();
  }

  get lazy(): boolean { return this._lazy; }
  set lazy(v: boolean) {
    this._lazy = v;
    if (v) this.setAttribute('lazy', '');
    else this.removeAttribute('lazy');
  }

  protected render(): string {
    return `
      <div class="lmt" part="tabs" data-orientation="horizontal">
        <div class="lmt__row" part="row" role="tablist">
          <div class="lmt__indicator" part="indicator" aria-hidden="true"></div>
        </div>
        <div class="lmt__panels" part="panel"></div>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lmt { display: flex; flex-direction: column; gap: 16px; }
      .lmt[data-orientation="vertical"] { flex-direction: row; gap: 20px; }
      .lmt[data-orientation="vertical"] .lmt__row { flex-direction: column; min-width: 160px; }
      .lmt[data-orientation="vertical"] .lmt__panels { flex: 1; }

      .lmt__row {
        position: relative;
        display: flex;
        gap: 4px;
        padding: 6px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
        box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.06), var(--lumina-shadow);
        overflow: hidden;
      }

      .lmt__indicator {
        position: absolute;
        top: 6px;
        left: 6px;
        width: 0;
        height: calc(100% - 12px);
        border-radius: var(--lumina-radius-pill);
        background: linear-gradient(135deg,
          rgb(var(--lumina-accent-rgb) / 0.95),
          rgb(var(--lumina-accent-rgb) / 0.65)
        );
        box-shadow:
          0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4),
          inset 0 1px 0 rgb(255 255 255 / 0.25);
        opacity: 0;
        transition:
          transform var(--lumina-speed) var(--lumina-ease-spring),
          width var(--lumina-speed) var(--lumina-ease-spring),
          height var(--lumina-speed) var(--lumina-ease-spring),
          opacity var(--lumina-speed) var(--lumina-ease-out);
        z-index: 0;
        pointer-events: none;
      }
      .lmt__indicator[data-active] { opacity: 1; }

      .lmt__tab {
        position: relative;
        z-index: 1;
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--lumina-text-muted);
        font: 600 13px var(--lumina-font-sans);
        padding: 8px 16px;
        border-radius: var(--lumina-radius-pill);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        transition: color var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmt__tab:hover { color: var(--lumina-text); }
      .lmt__tab[data-active="true"] { color: #fff; font-weight: 700; }
      .lmt__tab:focus-visible {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 2px;
      }

      .lmt__tab-icon {
        font-size: 14px;
        opacity: 0.8;
      }

      .lmt__tab-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 700;
        background: rgb(var(--lumina-accent-rgb) / 0.25);
        color: var(--lumina-accent);
        border: 1px solid rgb(var(--lumina-accent-rgb) / 0.4);
      }

      .lmt__panels { position: relative; min-height: 40px; }
      .lmt__panel {
        animation: lmt-fade-in calc(var(--lumina-speed) * 1.2) var(--lumina-ease-out);
      }
      @keyframes lmt-fade-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Variant: segmented */
      :host([variant="segmented"]) .lmt__row {
        padding: 4px;
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05));
      }
      :host([variant="segmented"]) .lmt__tab {
        flex: 1;
        justify-content: center;
        border-radius: var(--lumina-radius-md);
      }

      /* Variant: underline */
      :host([variant="underline"]) .lmt__row {
        padding: 0;
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: 0;
        border-bottom: 1px solid var(--lumina-border);
        box-shadow: none;
        border-radius: 0;
        gap: 0;
      }
      :host([variant="underline"]) .lmt__indicator {
        top: auto;
        bottom: -1px;
        height: 2px;
        border-radius: 0;
        box-shadow: 0 0 8px var(--lumina-accent);
      }
      :host([variant="underline"]) .lmt__tab {
        padding: 12px 18px;
        border-radius: 0;
      }
      :host([variant="underline"]) .lmt__tab[data-active="true"] {
        color: var(--lumina-accent);
      }

      /* Variant: neural */
      :host([variant="neural"]) .lmt__row {
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }
      :host([variant="neural"]) .lmt__indicator {
        background:
          linear-gradient(135deg,
            rgb(var(--lumina-accent-rgb) / 0.4),
            rgb(var(--lumina-accent-rgb) / 0.7)
          );
        box-shadow:
          0 0 20px rgb(var(--lumina-accent-rgb) / 0.5),
          inset 0 1px 0 rgb(255 255 255 / 0.25);
      }


      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) {
        .lmt__indicator, .lmt__panel { transition: none !important; animation: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.indicator = this.$$('.lmt__indicator');
    this.panelsContainer = this.$$('.lmt__panels');
    this.tabsRow = this.$$('.lmt__row');

    this.applyOrientation();
    this.buildTabs();
    this.activateInitial();

    // Watch for lumina-tab children being added/removed
    const observer = new MutationObserver(() => this.buildTabs());
    observer.observe(this, { childList: true });
  }

  protected unmounted(): void {}

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {
    // variant is CSS-driven; nothing to rebind
  }

  /* ---------------------------------------------------------------- */
  /* Attribute plumbing                                               */
  /* ---------------------------------------------------------------- */

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (_old === value) return;
    if (name === 'active-tab' && value) {
      this._activeTab = value;
      this.activateTab(value);
    } else if (name === 'orientation') {
      this._orientation = coerceAttr(value, ORIENTATIONS, 'horizontal');
      this.applyOrientation();
    } else if (name === 'lazy') {
      this._lazy = value !== null;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Building                                                         */
  /* ---------------------------------------------------------------- */

  private buildTabs(): void {
    if (!this.tabsRow) return;
    // Remove existing tab buttons (keep indicator)
    this.tabsRow.querySelectorAll('.lmt__tab').forEach((el) => el.remove());

    const tabs = Array.from(this.querySelectorAll('lumina-tab')) as HTMLElement[];
    tabs.forEach((tab, i) => {
      const btn = document.createElement('button');
      btn.className = 'lmt__tab';
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('data-tab-id', tab.id);
      btn.tabIndex = -1;

      const icon = tab.getAttribute('icon');
      const label = tab.getAttribute('label') ?? tab.id;
      const badge = tab.getAttribute('badge');

      if (icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'lmt__tab-icon';
        iconSpan.textContent = icon;
        iconSpan.setAttribute('aria-hidden', 'true');
        btn.appendChild(iconSpan);
      }

      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      btn.appendChild(labelSpan);

      if (badge) {
        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'lmt__tab-badge';
        badgeSpan.textContent = badge;
        btn.appendChild(badgeSpan);
      }

      btn.addEventListener('click', () => this.activateTab(tab.id));
      btn.addEventListener('keydown', this.onTabKeydown);

      this.tabsRow!.appendChild(btn);
    });

    if (this._activeTab) this.activateTab(this._activeTab);
  }

  private activateInitial(): void {
    const tabs = Array.from(this.querySelectorAll('lumina-tab')) as HTMLElement[];
    const initial = tabs.find((t) => t.id === this._activeTab) ?? tabs[0];
    if (initial) this.activateTab(initial.id);
  }

  private activateTab(id: string): void {
    if (!this._mounted) return;
    this._activeTab = id;
    const tabs = Array.from(this.querySelectorAll('lumina-tab')) as HTMLElement[];

    // Update tab buttons
    this.tabsRow?.querySelectorAll('.lmt__tab').forEach((btn) => {
      const isActive = btn.getAttribute('data-tab-id') === id;
      btn.setAttribute('data-active', String(isActive));
      btn.setAttribute('aria-selected', String(isActive));
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    // Move indicator (FLIP technique)
    this.moveIndicator(id);

    // Render panel (with lazy support)
    if (this.panelsContainer) {
      const tab = tabs.find((t) => t.id === id);
      if (tab) {
        if (this._lazy && !this.renderedPanels.has(id)) {
          this.renderedPanels.add(id);
        }
        // Fade out current, fade in new
        const isReduced = prefersReducedMotion();
        if (isReduced) {
          this.panelsContainer.innerHTML = '';
          this.appendPanelContent(tab);
        } else {
          this.panelsContainer.style.opacity = '0';
          this.panelsContainer.style.transform = 'translateY(8px)';
          window.setTimeout(() => {
            this.panelsContainer!.innerHTML = '';
            this.appendPanelContent(tab);
            this.panelsContainer!.style.opacity = '1';
            this.panelsContainer!.style.transform = 'translateY(0)';
          }, 120);
        }
      }
    }

    // Update lumina-tab children active state
    tabs.forEach((t) => {
      if (t.id === id) t.setAttribute('active', '');
      else t.removeAttribute('active');
    });

    this.dispatchEvent(
      new CustomEvent('lumina-tab-change', {
        bubbles: true,
        composed: true,
        detail: {
          id,
          label: tabs.find((t) => t.id === id)?.getAttribute('label') ?? id,
        },
      }),
    );
  }

  private appendPanelContent(tab: HTMLElement): void {
    if (!this.panelsContainer) return;
    const panel = document.createElement('div');
    panel.className = 'lmt__panel';
    panel.setAttribute('role', 'tabpanel');
    // Move the tab's slotted children into the visible panel
    panel.innerHTML = tab.innerHTML || '<p style="opacity:0.5;"><em>(aba vazia)</em></p>';
    this.panelsContainer.appendChild(panel);
  }

  private moveIndicator(id: string): void {
    if (!this.indicator || !this.tabsRow) return;
    const btn = this.tabsRow.querySelector(`[data-tab-id="${id}"]`) as HTMLElement | null;
    if (!btn) return;
    const rowRect = this.tabsRow.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    if (this._orientation === 'horizontal') {
      this.indicator.style.transform = `translateX(${btnRect.left - rowRect.left - 6}px)`;
      this.indicator.style.width = `${btnRect.width}px`;
      this.indicator.style.height = 'calc(100% - 12px)';
      this.indicator.style.top = '6px';
      this.indicator.style.left = '6px';
    } else {
      this.indicator.style.transform = `translateY(${btnRect.top - rowRect.top - 6}px)`;
      this.indicator.style.width = 'calc(100% - 12px)';
      this.indicator.style.height = `${btnRect.height}px`;
      this.indicator.style.top = '6px';
      this.indicator.style.left = '6px';
    }
    this.indicator.setAttribute('data-active', '');
  }

  private applyOrientation(): void {
    const root = this.$$('.lmt');
    if (root) root.setAttribute('data-orientation', this._orientation);
  }

  /* ---------------------------------------------------------------- */
  /* Keyboard navigation                                              */
  /* ---------------------------------------------------------------- */

  private onTabKeydown = (e: KeyboardEvent): void => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('lmt__tab')) return;
    const tabs = Array.from(this.tabsRow?.querySelectorAll('.lmt__tab') ?? []) as HTMLElement[];
    const idx = tabs.indexOf(target);
    if (idx === -1) return;

    let nextIdx = idx;
    if (this._orientation === 'horizontal') {
      if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = tabs.length - 1;
      else return;
    } else {
      if (e.key === 'ArrowDown') nextIdx = (idx + 1) % tabs.length;
      else if (e.key === 'ArrowUp') nextIdx = (idx - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = tabs.length - 1;
      else return;
    }

    e.preventDefault();
    const nextTab = tabs[nextIdx];
    const tabId = nextTab.getAttribute('data-tab-id');
    if (tabId) this.activateTab(tabId);
    nextTab.focus();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-tabs': LuminaTabs;
    'lumina-tab': LuminaTab;
  }
}

if (!customElements.get(LuminaTabs.tagName)) {
  customElements.define(LuminaTabs.tagName, LuminaTabs);
}
if (!customElements.get(LuminaTab.tagName)) {
  customElements.define(LuminaTab.tagName, LuminaTab);
}
