/**
 * LuminaRadioGroup — Indicador animado que viaja entre opções (FLIP).
 * Variants: glass | neural | segmented
 * Slot: children with data-value
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class RadioGroup extends LuminaElement {
  static tagName = 'lumina-radio-group';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'value']; }
  private _value = '';
  private indicator: HTMLElement | null = null;
  private observer: MutationObserver | null = null;

  get value(): string { return this._value; }
  set value(v: string) { this._value = v; this.setAttribute('value', v); this.moveIndicator(); }

  protected render(): string {
    return `
      <div class="lmrg" part="group" role="radiogroup">
        <div class="lmrg__indicator" part="indicator" aria-hidden="true"></div>
        <slot></slot>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmrg { position: relative; display: inline-flex; gap: 0; padding: 4px; border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(20px) saturate(1.5); -webkit-backdrop-filter: blur(20px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.06); }
      .lmrg__indicator { position: absolute; top: 4px; left: 4px; width: 0; height: calc(100% - 8px); border-radius: var(--lumina-radius-pill); background: linear-gradient(135deg, rgb(var(--lumina-accent-rgb) / 0.9), rgb(var(--lumina-accent-rgb) / 0.6)); box-shadow: 0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.25); opacity: 0; transition: transform var(--lumina-speed) var(--lumina-ease-spring), width var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); z-index: 0; pointer-events: none; }
      .lmrg__indicator[data-active] { opacity: 1; }
      ::slotted([data-value]) { position: relative; z-index: 1; appearance: none; border: 0; background: transparent; color: var(--lumina-text-muted); font: 600 13px var(--lumina-font-sans); padding: 8px 16px; cursor: pointer; border-radius: var(--lumina-radius-pill); transition: color var(--lumina-speed) var(--lumina-ease-out); white-space: nowrap; }
      ::slotted([data-value]:hover) { color: var(--lumina-text); }
      ::slotted([data-value][data-active]) { color: #fff; }
      ::slotted([data-value]:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 2px; }
      :host([variant="segmented"]) .lmrg { border-radius: var(--lumina-radius-md); }
      :host([variant="segmented"]) ::slotted([data-value]) { flex: 1; justify-content: center; border-radius: var(--lumina-radius-sm); }
      :host([variant="neural"]) .lmrg { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host([variant="neural"]) .lmrg__indicator { box-shadow: 0 0 20px rgb(var(--lumina-accent-rgb) / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmrg__indicator { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._value = this.getAttribute('value') ?? '';
    this.indicator = this.$$('.lmrg__indicator');
    this.buildOptions();
    this.observer = new MutationObserver(() => this.buildOptions());
    this.observer.observe(this, { childList: true, subtree: true });
    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void { this.observer?.disconnect(); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value') { this._value = value ?? ''; this.moveIndicator(); this.updateActive(); }
  }
  private buildOptions(): void {
    const items = Array.from(this.querySelectorAll('[data-value]')) as HTMLElement[];
    items.forEach((item) => {
      if (!item.hasAttribute('role')) item.setAttribute('role', 'radio');
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1');
    });
    if (!this._value && items.length > 0) { this._value = items[0].getAttribute('data-value') ?? ''; this.setAttribute('value', this._value); }
    this.updateActive();
    requestAnimationFrame(() => this.moveIndicator());
  }
  private updateActive(): void {
    const items = Array.from(this.querySelectorAll('[data-value]')) as HTMLElement[];
    items.forEach((item) => {
      const v = item.getAttribute('data-value') ?? '';
      if (v === this._value) { item.setAttribute('data-active', ''); item.setAttribute('tabindex', '0'); item.setAttribute('aria-checked', 'true'); }
      else { item.removeAttribute('data-active'); item.setAttribute('tabindex', '-1'); item.setAttribute('aria-checked', 'false'); }
    });
  }
  private moveIndicator(): void {
    if (!this.indicator) return;
    const active = this.querySelector(`[data-value="${this._value}"]`) as HTMLElement | null;
    if (!active) { this.indicator.removeAttribute('data-active'); return; }
    const groupRect = this.$$('.lmrg')!.getBoundingClientRect();
    const itemRect = active.getBoundingClientRect();
    this.indicator.style.transform = `translateX(${itemRect.left - groupRect.left - 4}px)`;
    this.indicator.style.width = `${itemRect.width}px`;
    this.indicator.setAttribute('data-active', '');
  }
  private onClick = (e: MouseEvent): void => {
    const target = (e.target as HTMLElement).closest('[data-value]') as HTMLElement | null;
    if (!target) return;
    this._value = target.getAttribute('data-value') ?? '';
    this.setAttribute('value', this._value);
    this.updateActive();
    this.moveIndicator();
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { value: this._value } }));
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
    else return;
    e.preventDefault();
    items[nextIdx].focus();
    this._value = items[nextIdx].getAttribute('data-value') ?? '';
    this.setAttribute('value', this._value);
    this.updateActive();
    this.moveIndicator();
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { value: this._value } }));
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-radio-group': RadioGroup } }
if (!customElements.get(RadioGroup.tagName)) customElements.define(RadioGroup.tagName, RadioGroup);
