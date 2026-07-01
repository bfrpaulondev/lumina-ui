/**
 * LuminaCheckbox — Morphing do check, ripple ao clicar, estado indeterminado.
 * Variants: glass | neural | morph
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

export class Checkbox extends LuminaElement {
  static tagName = 'lumina-checkbox';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'checked', 'indeterminate']; }
  private _checked = false;
  private _indeterminate = false;
  private box: HTMLElement | null = null;

  get checked(): boolean { return this._checked; }
  set checked(v: boolean) { this._checked = v; if (v) this.setAttribute('checked',''); else this.removeAttribute('checked'); this.updateState(); }
  get indeterminate(): boolean { return this._indeterminate; }
  set indeterminate(v: boolean) { this._indeterminate = v; if (v) this.setAttribute('indeterminate',''); else this.removeAttribute('indeterminate'); this.updateState(); }

  protected render(): string {
    return `
      <div class="lmcb" part="box">
        <input class="lmcb__input" type="checkbox" />
        <span class="lmcb__box" part="box">
          <span class="lmcb__check" part="check">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12l5 5 9-9" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span class="lmcb__indeterminate" aria-hidden="true"></span>
          <span class="lmcb__ripple" aria-hidden="true"></span>
        </span>
        <span class="lmcb__label" part="label"><slot></slot></span>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-flex; align-items: center; gap: 8px; font-family: var(--lumina-font-sans); color: var(--lumina-text); cursor: pointer; user-select: none; }
      .lmcb { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; position: relative; }
      .lmcb__input { position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0; }
      .lmcb__box { position: relative; width: 22px; height: 22px; border-radius: 6px; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 2px solid var(--lumina-border); transition: background var(--lumina-speed) var(--lumina-ease-out), border-color var(--lumina-speed) var(--lumina-ease-out); flex-shrink: 0; overflow: visible; }
      .lmcb__check { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; opacity: 0; transform: scale(0) rotate(-45deg); transition: opacity var(--lumina-speed) var(--lumina-ease-spring), transform var(--lumina-speed) var(--lumina-ease-spring); }
      .lmcb__indeterminate { position: absolute; top: 50%; left: 3px; right: 3px; height: 2px; background: #fff; transform: translateY(-50%) scaleX(0); transition: transform var(--lumina-speed) var(--lumina-ease-spring); border-radius: 1px; }
      :host([checked]) .lmcb__box { background: var(--lumina-accent); border-color: var(--lumina-accent); box-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.5); }
      :host([checked]) .lmcb__check { opacity: 1; transform: scale(1) rotate(0); }
      :host([indeterminate]) .lmcb__box { background: var(--lumina-accent); border-color: var(--lumina-accent); }
      :host([indeterminate]) .lmcb__indeterminate { transform: translateY(-50%) scaleX(1); }
      .lmcb__ripple { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; overflow: hidden; }
      .lmcb__ripple::after { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: rgb(var(--lumina-accent-rgb) / 0.4); transform: translate(-50%, -50%); }
      .lmcb__box[data-ripple] .lmcb__ripple::after { animation: lmcb-ripple 0.6s var(--lumina-ease-out); }
      @keyframes lmcb-ripple { 0% { width: 0; height: 0; opacity: 0.6; } 100% { width: 60px; height: 60px; opacity: 0; } }
      .lmcb__label { font-size: 14px; }
      :host(:focus-visible) .lmcb__box { outline: 2px solid var(--lumina-accent); outline-offset: 2px; }
      :host([variant="morph"]) .lmcb__box { border-radius: 50%; }
      :host([variant="morph"][checked]) .lmcb__box { border-radius: 6px; }
      @media (prefers-reduced-motion: reduce) { .lmcb__box, .lmcb__check, .lmcb__indeterminate { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._checked = this.hasAttribute('checked');
    this._indeterminate = this.hasAttribute('indeterminate');
    this.box = this.$$('.lmcb__box');
    this.setAttribute('role', 'checkbox');
    this.setAttribute('tabindex', '0');
    this.updateState();
    this.$$('.lmcb')?.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void { this.removeEventListener('keydown', this.onKeydown); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'checked') { this._checked = value !== null; this.updateState(); }
    else if (name === 'indeterminate') { this._indeterminate = value !== null; this.updateState(); }
  }
  private updateState(): void {
    this.setAttribute('aria-checked', this._indeterminate ? 'mixed' : String(this._checked));
  }
  private onClick = (): void => {
    if (this._indeterminate) { this._indeterminate = false; this.removeAttribute('indeterminate'); this._checked = true; this.setAttribute('checked',''); }
    else { this._checked = !this._checked; if (this._checked) this.setAttribute('checked',''); else this.removeAttribute('checked'); }
    this.updateState();
    if (!prefersReducedMotion()) {
      this.box?.setAttribute('data-ripple', '');
      setTimeout(() => this.box?.removeAttribute('data-ripple'), 600);
    }
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { checked: this._checked, indeterminate: this._indeterminate } }));
  };
  private onKeydown = (e: KeyboardEvent): void => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.onClick(); } };
}
declare global { interface HTMLElementTagNameMap { 'lumina-checkbox': Checkbox } }
if (!customElements.get(Checkbox.tagName)) customElements.define(Checkbox.tagName, Checkbox);
