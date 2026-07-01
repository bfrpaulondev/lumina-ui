/**
 * LuminaFAB — Floating Action Button com entrada scale+fade, elevação ao
 * hover e modo extended (expande para mostrar texto).
 *
 * Variants: glass | neural | aura | extended
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { coerceAttr } from '../core/utils';

const POSITIONS = ['bottom-right','bottom-left','top-right','top-left'] as const;
type Position = (typeof POSITIONS)[number];

export class Fab extends LuminaElement {
  static tagName = 'lumina-fab';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'extended', 'position'];
  }
  private _extended = false;
  private _position: Position = 'bottom-right';

  get extended(): boolean { return this._extended; }
  set extended(v: boolean) { this._extended = v; if (v) this.setAttribute('extended',''); else this.removeAttribute('extended'); }
  get position(): Position { return this._position; }
  set position(v: Position) { this._position = v; this.setAttribute('position', v);  }

  protected render(): string {
    return `
      <button class="lmfb" part="button" type="button">
        <span class="lmfb__bg" aria-hidden="true"></span>
        <span class="lmfb__glow" part="glow" aria-hidden="true"></span>
        <span class="lmfb__icon" part="icon"><slot></slot></span>
        <span class="lmfb__label" part="label"><slot name="label"></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { position: fixed; z-index: 900; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmfb {
        position: relative; display: inline-flex; align-items: center; gap: 0;
        height: 56px; min-width: 56px; padding: 0; border: 0; background: transparent;
        color: inherit; cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring),
                    box-shadow var(--lumina-speed) var(--lumina-ease-out),
                    min-width var(--lumina-speed) var(--lumina-ease-spring);
        animation: lmfb-enter calc(var(--lumina-speed) * 2) var(--lumina-ease-spring);
        will-change: transform;
      }
      @keyframes lmfb-enter { from { opacity: 0; transform: scale(0) rotate(-90deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
      .lmfb__bg {
        position: absolute; inset: 0; border-radius: inherit;
        background: linear-gradient(135deg, rgb(var(--lumina-accent-rgb) / 0.9), rgb(var(--lumina-accent-rgb) / 0.6));
        backdrop-filter: blur(14px) saturate(1.5);
        -webkit-backdrop-filter: blur(14px) saturate(1.5);
        box-shadow: 0 8px 24px -4px rgb(var(--lumina-accent-rgb) / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.3);
        z-index: 0;
      }
      .lmfb__glow {
        position: absolute; inset: -25%; border-radius: inherit; pointer-events: none; z-index: 0;
        opacity: 0; background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / 0.5), transparent 65%);
        filter: blur(20px); transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmfb__icon {
        position: relative; z-index: 1; font-size: 22px; width: 56px; height: 56px;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .lmfb__label {
        position: relative; z-index: 1; font-size: 14px; font-weight: 600; white-space: nowrap;
        max-width: 0; opacity: 0; overflow: hidden; transition: max-width var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out), padding var(--lumina-speed) var(--lumina-ease-spring);
        padding-right: 0;
      }
      :host([extended]) .lmfb__label { max-width: 200px; opacity: 1; padding-right: 20px; }
      :host([extended]) .lmfb { min-width: auto; }
      :host(:hover) .lmfb { transform: translateY(-4px) scale(1.04); box-shadow: 0 14px 36px -6px rgb(var(--lumina-accent-rgb) / 0.6); }
      :host(:hover) .lmfb__glow { opacity: calc(0.7 * var(--lumina-intensity)); }
      :host(:active) .lmfb { transform: translateY(-2px) scale(0.98); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([position="bottom-right"]) { bottom: 24px; right: 24px; }
      :host([position="bottom-left"])  { bottom: 24px; left: 24px; }
      :host([position="top-right"])    { top: 24px; right: 24px; }
      :host([position="top-left"])     { top: 24px; left: 24px; }
      :host([variant="aura"]) .lmfb { animation: lmfb-enter calc(var(--lumina-speed) * 2) var(--lumina-ease-spring), lmfb-float 4s ease-in-out infinite calc(var(--lumina-speed) * 2); }
      @keyframes lmfb-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      @media (prefers-reduced-motion: reduce) { .lmfb { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._extended = this.hasAttribute('extended');
    this._position = coerceAttr(this.getAttribute('position'), POSITIONS, 'bottom-right');
    this.applyPosition();
    if (this.getAttribute('role') !== 'button') this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.$$('.lmfb')?.addEventListener('click', () => this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true })));
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'extended') this._extended = value !== null;
    else if (name === 'position') { this._position = coerceAttr(value, POSITIONS, 'bottom-right'); this.applyPosition(); }
  }
  private applyPosition(): void { if (this.getAttribute('position') !== this._position) this.setAttribute('position', this._position); }
}
declare global { interface HTMLElementTagNameMap { 'lumina-fab': Fab } }
if (!customElements.get(Fab.tagName)) customElements.define(Fab.tagName, Fab);
