/**
 * LuminaRippleButton — Botão focado no efeito de ripple avançado e controlável.
 *
 * Variants: glass | neural | void
 * Props: ripple-color, ripple-duration (ms), multi (boolean)
 * Eventos: lumina-click, lumina-ripple (detail: { x, y })
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

export class RippleButton extends LuminaElement {
  static tagName = 'lumina-ripple-button';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'ripple-color', 'ripple-duration', 'multi'];
  }
  private _rippleColor = '';
  private _rippleDuration = 600;
  private _multi = true;
  private container: HTMLElement | null = null;

  get rippleColor(): string { return this._rippleColor; }
  set rippleColor(v: string) { this._rippleColor = v; this.setAttribute('ripple-color', v); }
  get rippleDuration(): number { return this._rippleDuration; }
  set rippleDuration(v: number) { this._rippleDuration = v; this.setAttribute('ripple-duration', String(v)); this.applyDuration(); }
  get multi(): boolean { return this._multi; }
  set multi(v: boolean) { this._multi = v; if (v) this.setAttribute('multi',''); else this.removeAttribute('multi'); }

  protected render(): string {
    return `
      <button class="lmrb" part="button" type="button">
        <span class="lmrb__bg" aria-hidden="true"></span>
        <span class="lmrb__ripple" part="ripple" aria-hidden="true"></span>
        <span class="lmrb__label"><slot></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmrb-duration: 600ms; }
      .lmrb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmrb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmrb__ripple { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; border-radius: inherit; }
      .lmrb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmrb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmrb__bg { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      :host(:active) .lmrb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      .lmrb__ripple-dot {
        position: absolute; border-radius: 50%; pointer-events: none;
        transform: translate(-50%, -50%) scale(0);
        animation: lmrb-expand var(--lmrb-duration, 600ms) var(--lumina-ease-out) forwards;
      }
      @keyframes lmrb-expand {
        0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
        100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) { .lmrb, .lmrb__ripple-dot { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._rippleColor = this.getAttribute('ripple-color') ?? '';
    this._rippleDuration = parseInt(this.getAttribute('ripple-duration') ?? '600', 10) || 600;
    this._multi = this.hasAttribute('multi') ? true : (this.getAttribute('multi') === null ? true : this.hasAttribute('multi'));
    this.applyDuration();
    this.container = this.$$('.lmrb__ripple');
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.$$('.lmrb')?.addEventListener('click', this.onClick);
    this.$$('.lmrb')?.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'ripple-color') this._rippleColor = value ?? '';
    else if (name === 'ripple-duration') { this._rippleDuration = parseInt(value ?? '600', 10) || 600; this.applyDuration(); }
    else if (name === 'multi') this._multi = value !== null;
  }
  private applyDuration(): void { this.style.setProperty('--lmrb-duration', `${this._rippleDuration}ms`); }
  private onClick = (e: MouseEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.spawnRipple(x, y);
    this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('lumina-ripple', { bubbles: true, composed: true, detail: { x, y } }));
  };
  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const rect = this.getBoundingClientRect();
      this.spawnRipple(rect.width / 2, rect.height / 2);
      this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
    }
  };
  private spawnRipple(x: number, y: number): void {
    if (prefersReducedMotion() || !this.container) return;
    if (!this._multi) {
      // Clear existing ripples
      this.container.innerHTML = '';
    }
    const dot = document.createElement('span');
    dot.className = 'lmrb__ripple-dot';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.width = '20px';
    dot.style.height = '20px';
    dot.style.background = this._rippleColor || 'rgb(var(--lumina-accent-rgb) / 0.4)';
    this.container.appendChild(dot);
    setTimeout(() => dot.remove(), this._rippleDuration + 50);
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-ripple-button': RippleButton } }
if (!customElements.get(RippleButton.tagName)) customElements.define(RippleButton.tagName, RippleButton);
