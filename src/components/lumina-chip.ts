/**
 * LuminaChip — Chip/tag removível com estado selecionável (toggle),
 * ícones via slot e animação de remoção.
 *
 * Variants: glass | neural | minimal | aura
 *
 * Uso:
 *   <lumina-chip variant="glass" selectable selected>React</lumina-chip>
 *   <lumina-chip removable>
 *     <span slot="icon">⚛</span>
 *     TypeScript
 *   </lumina-chip>
 *
 * Eventos:
 *   lumina-select  — quando selectable é true e o estado muda (detail: { selected })
 *   lumina-remove  — quando o botão × é clicado (antes do elemento ser removido)
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

export class LuminaChip extends LuminaElement {
  static tagName = 'lumina-chip';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'removable',
      'selected',
      'selectable',
    ];
  }

  private _removable = true;
  private _selected = false;
  private _selectable = false;

  get removable(): boolean { return this._removable; }
  set removable(v: boolean) {
    this._removable = v;
    if (v) this.setAttribute('removable', '');
    else this.removeAttribute('removable');
    this.applyRemoveButton();
  }

  get selected(): boolean { return this._selected; }
  set selected(v: boolean) {
    this._selected = v;
    if (v) this.setAttribute('selected', '');
    else this.removeAttribute('selected');
  }

  get selectable(): boolean { return this._selectable; }
  set selectable(v: boolean) {
    this._selectable = v;
    if (v) this.setAttribute('selectable', '');
    else this.removeAttribute('selectable');
    this.applyRole();
  }

  protected render(): string {
    return `
      <span class="lmc" part="chip">
        <span class="lmc__check" aria-hidden="true">✓</span>
        <span class="lmc__icon" part="icon"><slot name="icon"></slot></span>
        <span class="lmc__label" part="label"><slot></slot></span>
        <button class="lmc__remove" part="remove-button" type="button" aria-label="Remover">×</button>
      </span>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: inline-flex;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lmc {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        padding-left: 14px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--lumina-border);
        font-size: 13px;
        font-weight: 600;
        color: var(--lumina-text);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.08),
          var(--lumina-shadow);
        cursor: default;
        transition:
          transform var(--lumina-speed) var(--lumina-ease-spring),
          background var(--lumina-speed) var(--lumina-ease-out),
          border-color var(--lumina-speed) var(--lumina-ease-out),
          opacity var(--lumina-speed) var(--lumina-ease-out);
        will-change: transform, opacity;
      }

      .lmc.is-removing {
        animation: lmc-remove calc(var(--lumina-speed) * 1.5) var(--lumina-ease-in-out) forwards;
      }
      @keyframes lmc-remove {
        0%   { opacity: 1; transform: scale(1); }
        50%  { opacity: 0.6; transform: scale(0.85); }
        100% { opacity: 0; transform: scale(0.4); margin-left: -50px; padding: 0; width: 0; }
      }

      :host([selectable]) .lmc { cursor: pointer; }
      :host([selectable]:hover) .lmc {
        background: rgb(var(--lumina-accent-rgb) / 0.12);
        border-color: rgb(var(--lumina-accent-rgb) / 0.35);
        transform: translateY(-1px);
      }
      :host([selectable]:active) .lmc { transform: scale(0.96); }

      /* Selected state */
      :host([selected]) .lmc {
        background: linear-gradient(135deg,
          rgb(var(--lumina-accent-rgb) / 0.35),
          rgb(var(--lumina-accent-rgb) / 0.18)
        );
        border-color: rgb(var(--lumina-accent-rgb) / 0.6);
        color: #fff;
        box-shadow:
          0 0 16px rgb(var(--lumina-accent-rgb) / 0.35),
          inset 0 1px 0 rgb(255 255 255 / 0.15);
      }

      .lmc__check {
        display: none;
        font-size: 11px;
        font-weight: 800;
        color: #fff;
        width: 14px;
        height: 14px;
        background: var(--lumina-accent);
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        animation: lmc-check-in var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([selected]) .lmc__check { display: inline-flex; }
      @keyframes lmc-check-in {
        from { transform: scale(0); opacity: 0; }
        to   { transform: scale(1); opacity: 1; }
      }

      .lmc__icon {
        display: inline-flex;
        align-items: center;
        font-size: 14px;
        opacity: 0.8;
      }
      .lmc__icon:empty { display: none; }

      .lmc__label { white-space: nowrap; }

      .lmc__remove {
        appearance: none;
        border: 0;
        background: rgb(255 255 255 / 0.06);
        color: var(--lumina-text-muted);
        width: 16px;
        height: 16px;
        border-radius: 50%;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        margin-left: 2px;
        transition: background var(--lumina-speed) var(--lumina-ease-out),
                    color var(--lumina-speed) var(--lumina-ease-out),
                    transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmc__remove:hover {
        background: rgb(239 68 68 / 0.4);
        color: #fff;
        transform: rotate(90deg) scale(1.1);
      }
      .lmc__remove:focus-visible {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 2px;
      }
      :host(:not([removable])) .lmc__remove { display: none; }

      /* Variant: neural */
      :host([variant="neural"]) .lmc {
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }
      :host([variant="neural"]:hover) .lmc {
        box-shadow:
          0 0 20px rgb(var(--lumina-accent-rgb) / 0.4),
          inset 0 1px 0 rgb(255 255 255 / 0.08);
      }

      /* Variant: aura — floating animation */
      :host([variant="aura"]) .lmc {
        animation: lmc-float 4s ease-in-out infinite;
        background:
          radial-gradient(120% 100% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.18),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%
          );
      }
      @keyframes lmc-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }

      /* Variant: minimal — flat */
      :host([variant="minimal"]) .lmc {
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: none;
        border-color: rgb(var(--lumina-accent-rgb) / 0.2);
      }

      @media (prefers-reduced-motion: reduce) {
        .lmc, .lmc__remove, .lmc__check { animation: none !important; transition: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this._removable = this.hasAttribute('removable');
    if (!this.hasAttribute('removable')) this.setAttribute('removable', '');
    this._selected = this.hasAttribute('selected');
    this._selectable = this.hasAttribute('selectable');

    this.applyRole();
    this.applyRemoveButton();

    this.$$('.lmc__remove')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeWithAnimation();
    });

    if (this._selectable) {
      this.addEventListener('click', this.onChipClick);
      this.addEventListener('keydown', this.onKeydown);
    }
  }

  protected unmounted(): void {
    this.removeEventListener('click', this.onChipClick);
    this.removeEventListener('keydown', this.onKeydown);
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'removable') {
      this._removable = value !== null;
      this.applyRemoveButton();
    } else if (name === 'selected') {
      this._selected = value !== null;
    } else if (name === 'selectable') {
      this._selectable = value !== null;
      this.applyRole();
    }
  }

  private applyRole(): void {
    if (this._selectable) {
      if (this.getAttribute('role') !== 'button') this.setAttribute('role', 'button');
      this.setAttribute('tabindex', '0');
      this.setAttribute('aria-pressed', String(this._selected));
    } else {
      this.removeAttribute('role');
      this.removeAttribute('tabindex');
      this.removeAttribute('aria-pressed');
    }
  }

  private applyRemoveButton(): void {
    const btn = this.$$('.lmc__remove');
    if (btn) {
      btn.style.display = this._removable ? '' : 'none';
    }
  }

  private onChipClick = (): void => {
    if (!this._selectable) return;
    this._selected = !this._selected;
    if (this._selected) this.setAttribute('selected', '');
    else this.removeAttribute('selected');
    this.setAttribute('aria-pressed', String(this._selected));
    this.dispatchEvent(
      new CustomEvent('lumina-select', {
        bubbles: true,
        composed: true,
        detail: { selected: this._selected },
      }),
    );
  };

  private onKeydown = (e: KeyboardEvent): void => {
    if (!this._selectable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.onChipClick();
    }
  };

  /** Public API: trigger the remove animation and emit lumina-remove. */
  public removeWithAnimation(): void {
    this.dispatchEvent(new CustomEvent('lumina-remove', { bubbles: true, composed: true }));
    if (prefersReducedMotion()) {
      this.remove();
      return;
    }
    const chip = this.$$('.lmc');
    if (chip) {
      chip.classList.add('is-removing');
      setTimeout(() => this.remove(), 400);
    } else {
      this.remove();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-chip': LuminaChip;
  }
}

if (!customElements.get(LuminaChip.tagName)) {
  customElements.define(LuminaChip.tagName, LuminaChip);
}
