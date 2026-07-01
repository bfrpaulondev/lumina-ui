/**
 * LuminaMorphButton — Botão que morphs entre diferentes formas (clip-path)
 * ou ícones com transição controlada por speed.
 *
 * Variants: morph | glass | dimensional
 * Props: from (forma/ícone inicial), to (forma/ícone final após hover)
 * Eventos: lumina-click, lumina-morph-start, lumina-morph-end
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

const SHAPES: Record<string, string> = {
  pill: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
  squircle: 'polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)',
  hexagon: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)',
  diamond: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  star: 'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
};

export class MorphButton extends LuminaElement {
  static tagName = 'lumina-morph-button';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'from', 'to'];
  }
  private _from = 'pill';
  private _to = 'squircle';
  private iconEl: HTMLElement | null = null;

  get from(): string { return this._from; }
  set from(v: string) { this._from = v; this.setAttribute('from', v); this.applyShape(); }
  get to(): string { return this._to; }
  set to(v: string) { this._to = v; this.setAttribute('to', v); this.applyShape(); }

  protected render(): string {
    return `
      <button class="lmob" part="button" type="button">
        <span class="lmob__bg" aria-hidden="true"></span>
        <span class="lmob__icon" part="icon"><slot></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmob {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; min-width: 80px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        transition: clip-path var(--lumina-speed) var(--lumina-ease-spring), transform var(--lumina-speed) var(--lumina-ease-spring);
        isolation: isolate;
      }
      .lmob__bg { position: absolute; inset: 0; background: linear-gradient(135deg, rgb(var(--lumina-accent-rgb) / 0.8), rgb(var(--lumina-surface) / var(--lumina-surface-alpha))); border: 1px solid var(--lumina-border); z-index: 0; }
      .lmob__icon { position: relative; z-index: 1; white-space: nowrap; transition: transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host(:hover) .lmob { transform: scale(1.05); }
      :host(:active) .lmob { transform: scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      @media (prefers-reduced-motion: reduce) { .lmob, .lmob__icon { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._from = this.getAttribute('from') ?? 'pill';
    this._to = this.getAttribute('to') ?? 'squircle';
    this.iconEl = this.$$('.lmob__icon');
    this.applyShape();
    if (this.getAttribute('role') !== 'button') this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.$$('.lmob')?.addEventListener('click', this.onClick);
    this.$$('.lmob')?.addEventListener('keydown', this.onKeydown);
    this.addEventListener('pointerenter', this.onEnter);
    this.addEventListener('pointerleave', this.onLeave);
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'from') { this._from = value ?? 'pill'; this.applyShape(); }
    else if (name === 'to') { this._to = value ?? 'squircle'; this.applyShape(); }
  }
  private applyShape(): void {
    const btn = this.$$('.lmob');
    if (btn) btn.style.clipPath = SHAPES[this._from] ?? SHAPES.pill;
  }
  private onEnter = (): void => {
    const btn = this.$$('.lmob');
    if (btn) btn.style.clipPath = SHAPES[this._to] ?? SHAPES.squircle;
    // If from/to look like single chars, swap them as icon content
    if (this._from.length <= 2 && this._to.length <= 2 && this.iconEl) {
      this.iconEl.textContent = this._to;
    }
    this.dispatchEvent(new CustomEvent('lumina-morph-start', { bubbles: true, composed: true, detail: { from: this._from, to: this._to } }));
  };
  private onLeave = (): void => {
    const btn = this.$$('.lmob');
    if (btn) btn.style.clipPath = SHAPES[this._from] ?? SHAPES.pill;
    if (this._from.length <= 2 && this._to.length <= 2 && this.iconEl) {
      this.iconEl.textContent = this._from;
    }
    this.dispatchEvent(new CustomEvent('lumina-morph-end', { bubbles: true, composed: true, detail: { from: this._to, to: this._from } }));
  };
  private onClick = (): void => { this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true })); };
  private onKeydown = (e: KeyboardEvent): void => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onClick(); } };
}
declare global { interface HTMLElementTagNameMap { 'lumina-morph-button': MorphButton } }
if (!customElements.get(MorphButton.tagName)) customElements.define(MorphButton.tagName, MorphButton);
