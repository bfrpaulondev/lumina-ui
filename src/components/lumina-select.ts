/**
 * LuminaSelect — Dropdown com busca interna, animação de abertura escala+fade,
 * flip de posicionamento, ícones nas opções e navegação completa por teclado.
 *
 * Variants: glass | neural | morph
 *
 * Uso:
 *   <lumina-select
 *     variant="glass"
 *     searchable
 *     placeholder="Escolha..."
 *     options='[{"value":"br","label":"Brasil","icon":"🇧🇷"},{"value":"us","label":"EUA","icon":"🇺🇸"}]'
 *   ></lumina-select>
 *
 * Eventos:
 *   lumina-change — disparado ao selecionar uma opção (detail: { value, label })
 *   lumina-open   — disparado ao abrir o dropdown
 *   lumina-close  — disparado ao fechar o dropdown
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

export class LuminaSelect extends LuminaElement {
  static tagName = 'lumina-select';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'value',
      'placeholder',
      'searchable',
      'options',
    ];
  }

  private _value = '';
  private _placeholder = 'Selecione...';
  private _searchable = false;
  private _options: Option[] = [];

  private trigger: HTMLElement | null = null;
  private dropdown: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private optionsContainer: HTMLElement | null = null;
  private _open = false;
  private highlightIdx = -1;
  private filteredOptions: Option[] = [];

  get value(): string { return this._value; }
  set value(v: string) {
    this._value = v;
    this.setAttribute('value', v);
    this.updateTrigger();
  }

  get placeholder(): string { return this._placeholder; }
  set placeholder(v: string) {
    this._placeholder = v;
    this.setAttribute('placeholder', v);
    this.updateTrigger();
  }

  get searchable(): boolean { return this._searchable; }
  set searchable(v: boolean) {
    this._searchable = v;
    if (v) this.setAttribute('searchable', '');
    else this.removeAttribute('searchable');
    this.applySearchable();
  }

  get options(): Option[] { return this._options; }
  set options(v: Option[]) {
    this._options = v;
    this.setAttribute('options', JSON.stringify(v));
    this.filteredOptions = [...v];
    this.renderOptions();
    this.updateTrigger();
  }

  protected render(): string {
    return `
      <div class="lmsl" part="trigger">
        <div class="lmsl__bg" aria-hidden="true"></div>
        <div class="lmsl__glow" part="glow" aria-hidden="true"></div>
        <span class="lmsl__value" part="value"></span>
        <span class="lmsl__placeholder" part="placeholder"></span>
        <span class="lmsl__chevron" aria-hidden="true">▾</span>
        <div class="lmsl__dropdown" part="dropdown" role="listbox" aria-hidden="true">
          <div class="lmsl__search-wrap" part="search">
            <input class="lmsl__search" type="text" placeholder="Buscar..." aria-label="Buscar opções" />
          </div>
          <div class="lmsl__options" part="options"></div>
          <div class="lmsl__empty" aria-hidden="true">Nenhuma opção encontrada</div>
        </div>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: inline-block;
        position: relative;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        min-width: 200px;
      }

      .lmsl {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        padding-right: 36px;
        border-radius: var(--lumina-radius-md);
        cursor: pointer;
        user-select: none;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmsl:hover { transform: translateY(-1px); }

      .lmsl__bg {
        position: absolute; inset: 0;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(12px) saturate(1.3);
        -webkit-backdrop-filter: blur(12px) saturate(1.3);
        border: 1px solid var(--lumina-border);
        box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.08), var(--lumina-shadow);
        transition: border-color var(--lumina-speed) var(--lumina-ease-out);
      }
      :host([data-open]) .lmsl__bg {
        border-color: rgb(var(--lumina-accent-rgb) / 0.5);
      }

      .lmsl__glow {
        position: absolute; inset: -2px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        background: conic-gradient(from 0deg,
          transparent 0%, var(--lumina-accent) 25%,
          transparent 50%, var(--lumina-accent) 75%, transparent 100%);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        padding: 2px;
        animation: lmsl-spin 4s linear infinite;
        animation-play-state: paused;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host([data-open]) .lmsl__glow { opacity: 0.7; animation-play-state: running; }

      .lmsl__value, .lmsl__placeholder {
        position: relative; z-index: 1;
        flex: 1;
        font-size: 14px;
      }
      .lmsl__placeholder { color: var(--lumina-text-muted); }
      .lmsl__value { display: none; }
      :host([data-has-value]) .lmsl__value { display: block; }
      :host([data-has-value]) .lmsl__placeholder { display: none; }

      .lmsl__chevron {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        color: var(--lumina-text-muted);
        z-index: 1;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([data-open]) .lmsl__chevron { transform: translateY(-50%) rotate(180deg); }

      .lmsl__dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        z-index: 1000;
        min-width: 100%;
        max-height: 280px;
        display: flex;
        flex-direction: column;
        padding: 6px;
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15));
        backdrop-filter: blur(20px) saturate(1.6);
        -webkit-backdrop-filter: blur(20px) saturate(1.6);
        border: 1px solid var(--lumina-border);
        box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5);
        opacity: 0;
        transform: scale(0.92) translateY(-8px);
        transform-origin: top center;
        pointer-events: none;
        transition:
          opacity var(--lumina-speed) var(--lumina-ease-out),
          transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([data-open]) .lmsl__dropdown {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: auto;
      }
      :host([data-flip-up]) .lmsl__dropdown {
        top: auto;
        bottom: calc(100% + 8px);
        transform-origin: bottom center;
        transform: scale(0.92) translateY(8px);
      }
      :host([data-flip-up][data-open]) .lmsl__dropdown {
        transform: scale(1) translateY(0);
      }

      .lmsl__search-wrap {
        display: none;
        padding: 4px 4px 8px;
        border-bottom: 1px solid var(--lumina-border);
        margin-bottom: 4px;
      }
      :host([searchable]) .lmsl__search-wrap { display: block; }
      .lmsl__search {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--lumina-border);
        border-radius: 8px;
        background: rgb(255 255 255 / 0.04);
        color: var(--lumina-text);
        font: 500 13px var(--lumina-font-sans);
        outline: none;
      }
      .lmsl__search:focus {
        border-color: rgb(var(--lumina-accent-rgb) / 0.5);
      }
      .lmsl__search::placeholder { color: var(--lumina-text-muted); }

      .lmsl__options {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .lmsl__option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        color: var(--lumina-text);
        transition: background 0.15s, color 0.15s;
      }
      .lmsl__option:hover,
      .lmsl__option[data-highlighted] {
        background: rgb(var(--lumina-accent-rgb) / 0.15);
      }
      .lmsl__option[data-selected] {
        background: rgb(var(--lumina-accent-rgb) / 0.3);
        color: #fff;
        font-weight: 600;
      }
      .lmsl__option-icon {
        font-size: 16px;
      }
      .lmsl__option-icon:empty { display: none; }

      .lmsl__empty {
        padding: 12px;
        text-align: center;
        font-size: 13px;
        color: var(--lumina-text-muted);
        display: none;
      }
      .lmsl__empty[data-show] { display: block; }

      /* Variant: neural */
      :host([variant="neural"]) .lmsl__bg {
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }

      @keyframes lmsl-spin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        .lmsl, .lmsl__bg, .lmsl__glow, .lmsl__chevron, .lmsl__dropdown {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }

  protected mounted(): void {
    this.trigger = this.$$('.lmsl');
    this.dropdown = this.$$('.lmsl__dropdown');
    this.searchInput = this.$$('.lmsl__search') as HTMLInputElement | null;
    this.optionsContainer = this.$$('.lmsl__options');

    // Read attributes
    this._placeholder = this.getAttribute('placeholder') ?? 'Selecione...';
    this._value = this.getAttribute('value') ?? '';
    this._searchable = this.hasAttribute('searchable');
    const optionsAttr = this.getAttribute('options');
    if (optionsAttr) {
      try {
        this._options = JSON.parse(optionsAttr);
      } catch {
        this._options = [];
      }
    }
    this.filteredOptions = [...this._options];

    this.applySearchable();
    this.renderOptions();
    this.updateTrigger();

    this.trigger?.addEventListener('click', this.onTriggerClick);
    this.searchInput?.addEventListener('input', this.onSearchInput);
    document.addEventListener('click', this.onDocClick);
    document.addEventListener('keydown', this.onKeydown);
  }

  protected unmounted(): void {
    this.trigger?.removeEventListener('click', this.onTriggerClick);
    this.searchInput?.removeEventListener('input', this.onSearchInput);
    document.removeEventListener('click', this.onDocClick);
    document.removeEventListener('keydown', this.onKeydown);
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value') {
      this._value = value ?? '';
      this.updateTrigger();
    } else if (name === 'placeholder') {
      this._placeholder = value ?? 'Selecione...';
      this.updateTrigger();
    } else if (name === 'searchable') {
      this._searchable = value !== null;
      this.applySearchable();
    } else if (name === 'options' && value) {
      try {
        this._options = JSON.parse(value);
        this.filteredOptions = [...this._options];
        this.renderOptions();
        this.updateTrigger();
      } catch {
        this._options = [];
      }
    }
  }

  private applySearchable(): void {
    if (this._searchable) this.setAttribute('searchable', '');
    else this.removeAttribute('searchable');
  }

  private updateTrigger(): void {
    const placeholderEl = this.$$('.lmsl__placeholder');
    const valueEl = this.$$('.lmsl__value');
    if (placeholderEl) placeholderEl.textContent = this._placeholder;
    const selected = this._options.find((o) => o.value === this._value);
    if (selected) {
      if (valueEl) valueEl.textContent = (selected.icon ?? '') + ' ' + selected.label;
      this.setAttribute('data-has-value', '');
    } else {
      this.removeAttribute('data-has-value');
    }
  }

  private renderOptions(): void {
    if (!this.optionsContainer) return;
    this.optionsContainer.innerHTML = '';
    this.filteredOptions.forEach((opt, idx) => {
      const el = document.createElement('div');
      el.className = 'lmsl__option';
      el.setAttribute('role', 'option');
      el.setAttribute('data-value', opt.value);
      el.setAttribute('data-idx', String(idx));
      if (opt.value === this._value) el.setAttribute('data-selected', '');
      const iconSpan = document.createElement('span');
      iconSpan.className = 'lmsl__option-icon';
      iconSpan.textContent = opt.icon ?? '';
      el.appendChild(iconSpan);
      const labelSpan = document.createElement('span');
      labelSpan.textContent = opt.label;
      el.appendChild(labelSpan);
      el.addEventListener('click', () => this.selectOption(opt));
      el.addEventListener('mouseenter', () => {
        this.highlightIdx = idx;
        this.updateHighlight();
      });
      this.optionsContainer!.appendChild(el);
    });
    const empty = this.$$('.lmsl__empty');
    if (empty) {
      if (this.filteredOptions.length === 0) empty.setAttribute('data-show', '');
      else empty.removeAttribute('data-show');
    }
  }

  private selectOption(opt: Option): void {
    this._value = opt.value;
    this.setAttribute('value', opt.value);
    this.updateTrigger();
    this.renderOptions();
    this.close();
    this.dispatchEvent(
      new CustomEvent('lumina-change', {
        bubbles: true,
        composed: true,
        detail: { value: opt.value, label: opt.label },
      }),
    );
  }

  private onTriggerClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (this._open) this.close();
    else this.open();
  };

  private onDocClick = (e: MouseEvent): void => {
    if (!this.contains(e.target as Node) && this._open) this.close();
  };

  private onSearchInput = (): void => {
    if (!this.searchInput) return;
    const q = this.searchInput.value.toLowerCase().trim();
    this.filteredOptions = this._options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
    this.highlightIdx = -1;
    this.renderOptions();
  };

  private onKeydown = (e: KeyboardEvent): void => {
    if (!this._open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      this.open();
      return;
    }
    if (!this._open) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      this.trigger?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.highlightIdx = Math.min(this.highlightIdx + 1, this.filteredOptions.length - 1);
      this.updateHighlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.highlightIdx = Math.max(this.highlightIdx - 1, 0);
      this.updateHighlight();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.highlightIdx >= 0 && this.filteredOptions[this.highlightIdx]) {
        this.selectOption(this.filteredOptions[this.highlightIdx]);
      }
    } else if (e.key === 'Tab') {
      this.close();
    }
  };

  private updateHighlight(): void {
    this.optionsContainer?.querySelectorAll('.lmsl__option').forEach((el) => {
      const idx = parseInt(el.getAttribute('data-idx') ?? '-1', 10);
      el.toggleAttribute('data-highlighted', idx === this.highlightIdx);
      if (idx === this.highlightIdx) {
        (el as HTMLElement).scrollIntoView({ block: 'nearest' });
      }
    });
  }

  /** Open the dropdown with smart positioning (flip if no space below). */
  public open(): void {
    if (this._open) return;
    this._open = true;
    this.setAttribute('data-open', '');
    this.dropdown?.setAttribute('aria-hidden', 'false');
    this.checkFlip();
    this.dispatchEvent(new CustomEvent('lumina-open', { bubbles: true, composed: true }));
    // Focus search input if searchable
    setTimeout(() => {
      if (this._searchable) this.searchInput?.focus();
    }, 80);
  }

  public close(): void {
    if (!this._open) return;
    this._open = false;
    this.removeAttribute('data-open');
    this.removeAttribute('data-flip-up');
    this.dropdown?.setAttribute('aria-hidden', 'true');
    if (this.searchInput) this.searchInput.value = '';
    this.filteredOptions = [...this._options];
    this.renderOptions();
    this.dispatchEvent(new CustomEvent('lumina-close', { bubbles: true, composed: true }));
  }

  /** Check if dropdown would overflow viewport bottom; if so, flip up. */
  private checkFlip(): void {
    if (!this.trigger || prefersReducedMotion()) return;
    const rect = this.trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < 320 && rect.top > 320) {
      this.setAttribute('data-flip-up', '');
    } else {
      this.removeAttribute('data-flip-up');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-select': LuminaSelect;
  }
}

if (!customElements.get(LuminaSelect.tagName)) {
  customElements.define(LuminaSelect.tagName, LuminaSelect);
}
