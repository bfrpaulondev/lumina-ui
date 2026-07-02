/**
 * LuminaButtonGroup — Grupo de botões conectados visualmente com seleção
 * única ou múltipla e navegação por teclado.
 *
 * Variants: glass | segmented | neural
 *
 * Uso:
 *   <lumina-button-group variant="segmented" value="b">
 *     <button data-value="a">A</button>
 *     <button data-value="b">B</button>
 *     <button data-value="c">C</button>
 *   </lumina-button-group>
 *
 * Evento: lumina-change (detail: { value, values })
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class ButtonGroup extends LuminaElement {
  static tagName = 'lumina-button-group';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'multiple', 'value'];
  }
  private _multiple = false;
  private _value = '';
  private selectedValues = new Set<string>();
  private observer: MutationObserver | null = null;

  get multiple(): boolean { return this._multiple; }
  set multiple(v: boolean) { this._multiple = v; if (v) this.setAttribute('multiple',''); else this.removeAttribute('multiple'); this.syncFromValue(); }
  get value(): string { return this._value; }
  set value(v: string) { this._value = v; this.setAttribute('value', v); this.syncFromValue(); }

  protected render(): string {
    return `<div class="lmbg" part="group"><slot></slot></div>`;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmbg {
        position: relative; display: inline-flex; gap: 0; padding: 4px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5); -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.06), var(--lumina-shadow);
      }
      ::slotted(button), ::slotted([data-value]) {
        appearance: none; border: 0; background: transparent; color: var(--lumina-text-muted);
        font: 600 13px var(--lumina-font-sans); padding: 8px 16px; cursor: pointer; border-radius: var(--lumina-radius-pill);
        transition: background var(--lumina-speed) var(--lumina-ease-out), color var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring);
        position: relative; z-index: 1; white-space: nowrap;
      }
      ::slotted(button:hover), ::slotted([data-value]:hover) { color: var(--lumina-text); transform: translateY(-1px); }
      ::slotted(button[data-active]), ::slotted([data-value][data-active]) {
        background: linear-gradient(135deg, rgb(var(--lumina-accent-rgb) / 0.9), rgb(var(--lumina-accent-rgb) / 0.6));
        color: #fff; box-shadow: 0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.25);
      }
      ::slotted(button:focus-visible), ::slotted([data-value]:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 2px; }
      :host([variant="segmented"]) .lmbg { padding: 4px; gap: 2px; }
      :host([variant="segmented"]) ::slotted(button), :host([variant="segmented"]) ::slotted([data-value]) { flex: 1; justify-content: center; border-radius: var(--lumina-radius-md); }
      :host([variant="neural"]) .lmbg { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { ::slotted(button), ::slotted([data-value]) { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._multiple = this.hasAttribute('multiple');
    this._value = this.getAttribute('value') ?? '';
    this.syncFromValue();
    this.observer = new MutationObserver(() => this.syncFromValue());
    this.observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-value'] });
    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void { this.observer?.disconnect(); this.removeEventListener('click', this.onClick); this.removeEventListener('keydown', this.onKeydown); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'multiple') { this._multiple = value !== null; this.syncFromValue(); }
    else if (name === 'value') { this._value = value ?? ''; this.syncFromValue(); }
  }
  private syncFromValue(): void {
    this.selectedValues = new Set(this._multiple ? this._value.split(',').filter(Boolean) : (this._value ? [this._value] : []));
    this.updateChildren();
  }
  private updateChildren(): void {
    const items = Array.from(this.querySelectorAll('[data-value]')) as HTMLElement[];
    items.forEach((item) => {
      const v = item.getAttribute('data-value') ?? '';
      if (this.selectedValues.has(v)) item.setAttribute('data-active', '');
      else item.removeAttribute('data-active');
    });
  }
  private onClick = (e: MouseEvent): void => {
    const target = (e.target as HTMLElement).closest('[data-value]') as HTMLElement | null;
    if (!target) return;
    const v = target.getAttribute('data-value') ?? '';
    if (this._multiple) {
      if (this.selectedValues.has(v)) this.selectedValues.delete(v);
      else this.selectedValues.add(v);
    } else {
      if (this.selectedValues.has(v) && this.selectedValues.size === 1) this.selectedValues.clear();
      else { this.selectedValues.clear(); this.selectedValues.add(v); }
    }
    this._value = Array.from(this.selectedValues).join(',');
    this.setAttribute('value', this._value);
    this.updateChildren();
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { value: this._multiple ? this._value : (this.selectedValues.values().next().value ?? ''), values: Array.from(this.selectedValues) } }));
  };
  private onKeydown = (e: KeyboardEvent): void => {
    const target = (e.target as HTMLElement).closest('[data-value]') as HTMLElement | null;
    if (!target) return;
    const items = Array.from(this.querySelectorAll('[data-value]')) as HTMLElement[];
    const idx = items.indexOf(target);
    if (idx === -1) return;
    let nextIdx = idx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIdx = (idx + 1) % items.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIdx = (idx - 1 + items.length) % items.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = items.length - 1;
    else return;
    e.preventDefault();
    items[nextIdx].focus();
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-button-group': ButtonGroup } }
if (!customElements.get(ButtonGroup.tagName)) customElements.define(ButtonGroup.tagName, ButtonGroup);
