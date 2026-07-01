/**
 * LuminaGestureButton — Botão que reconhece gestos simples (hold, swipe,
 * double-tap) via Pointer Events com feedback visual diferente por gesto.
 *
 * Variants: neural | aura | glass
 * Props: gestures (lista CSV), hold-delay (ms)
 * Eventos: lumina-gesture (detail: { type: 'hold'|'swipe'|'double-tap' }), lumina-click
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

type GestureType = 'hold' | 'swipe' | 'double-tap';

export class GestureButton extends LuminaElement {
  static tagName = 'lumina-gesture-button';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'gestures', 'hold-delay'];
  }
  private _gestures: GestureType[] = ['hold', 'swipe', 'double-tap'];
  private _holdDelay = 500;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private pointerStartTime = 0;
  private holdTimer: ReturnType<typeof setTimeout> | null = null;
  private lastTapTime = 0;
  private feedback: HTMLElement | null = null;

  get gestures(): GestureType[] { return this._gestures; }
  set gestures(v: GestureType[]) { this._gestures = v; this.setAttribute('gestures', v.join(',')); }
  get holdDelay(): number { return this._holdDelay; }
  set holdDelay(v: number) { this._holdDelay = v; this.setAttribute('hold-delay', String(v)); }

  protected render(): string {
    return `
      <button class="lmgb" part="button" type="button">
        <span class="lmgb__bg" aria-hidden="true"></span>
        <span class="lmgb__feedback" part="feedback" aria-hidden="true"></span>
        <span class="lmgb__label"><slot></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmgb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
        touch-action: none;
      }
      .lmgb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmgb__feedback { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 1; opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmgb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmgb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmgb__bg { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      :host(:active) .lmgb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      .lmgb__feedback[data-gesture="hold"] { background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / 0.5), transparent 70%); animation: lmgb-hold-feedback 0.4s var(--lumina-ease-out); }
      .lmgb__feedback[data-gesture="swipe"] { background: linear-gradient(90deg, transparent, rgb(var(--lumina-accent-rgb) / 0.4), transparent); animation: lmgb-swipe-feedback 0.5s var(--lumina-ease-out); }
      .lmgb__feedback[data-gesture="double-tap"] { background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / 0.6), transparent 60%); animation: lmgb-double-feedback 0.4s var(--lumina-ease-spring); }
      @keyframes lmgb-hold-feedback { 0% { opacity: 0; transform: scale(0.8); } 50% { opacity: 1; } 100% { opacity: 0; transform: scale(1.2); } }
      @keyframes lmgb-swipe-feedback { 0% { opacity: 0; transform: translateX(-100%); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateX(100%); } }
      @keyframes lmgb-double-feedback { 0% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; } 100% { opacity: 0; transform: scale(1.5); } }
      @media (prefers-reduced-motion: reduce) { .lmgb, .lmgb__feedback { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    const gAttr = this.getAttribute('gestures');
    if (gAttr) {
      this._gestures = gAttr.split(',').map((s) => s.trim()) as GestureType[];
    }
    this._holdDelay = parseInt(this.getAttribute('hold-delay') ?? '500', 10) || 500;
    this.feedback = this.$$('.lmgb__feedback');
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    const btn = this.$$('.lmgb');
    btn?.addEventListener('pointerdown', this.onPointerDown);
    btn?.addEventListener('pointerup', this.onPointerUp);
    btn?.addEventListener('pointercancel', this.onPointerCancel);
    btn?.addEventListener('pointermove', this.onPointerMove);
    btn?.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void { if (this.holdTimer) clearTimeout(this.holdTimer); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'gestures' && value) this._gestures = value.split(',').map((s) => s.trim()) as GestureType[];
    else if (name === 'hold-delay') this._holdDelay = parseInt(value ?? '500', 10) || 500;
  }
  private onPointerDown = (e: PointerEvent): void => {
    this.pointerStartX = e.clientX;
    this.pointerStartY = e.clientY;
    this.pointerStartTime = Date.now();
    if (this._gestures.includes('hold')) {
      this.holdTimer = setTimeout(() => {
        this.emitGesture('hold');
        this.holdTimer = null;
      }, this._holdDelay);
    }
  };
  private onPointerMove = (e: PointerEvent): void => {
    if (!this.holdTimer) return;
    const dx = Math.abs(e.clientX - this.pointerStartX);
    const dy = Math.abs(e.clientY - this.pointerStartY);
    if (dx > 10 || dy > 10) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
  };
  private onPointerUp = (e: PointerEvent): void => {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
      const dx = e.clientX - this.pointerStartX;
      const dy = e.clientY - this.pointerStartY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const duration = Date.now() - this.pointerStartTime;
      if (this._gestures.includes('swipe') && dist > 40 && duration < 500) {
        this.emitGesture('swipe');
        return;
      }
      // Check double-tap
      const now = Date.now();
      if (this._gestures.includes('double-tap') && now - this.lastTapTime < 300) {
        this.emitGesture('double-tap');
        this.lastTapTime = 0;
        return;
      }
      this.lastTapTime = now;
      // Single tap / click
      this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
    }
  };
  private onPointerCancel = (): void => { if (this.holdTimer) { clearTimeout(this.holdTimer); this.holdTimer = null; } };
  private emitGesture(type: GestureType): void {
    if (this.feedback) {
      this.feedback.setAttribute('data-gesture', type);
      setTimeout(() => this.feedback?.removeAttribute('data-gesture'), 500);
    }
    this.dispatchEvent(new CustomEvent('lumina-gesture', { bubbles: true, composed: true, detail: { type } }));
  }
  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
    }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-gesture-button': GestureButton } }
if (!customElements.get(GestureButton.tagName)) customElements.define(GestureButton.tagName, GestureButton);
