/**
 * LuminaGlassCard — Glassmorphism avançado com efeito de refração de luz nas bordas.
 * Variants: light | dark | cosmic
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { throttle } from '../core/utils';

export class GlassCard extends LuminaElement {
  static tagName = 'lumina-glass-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'blur']; }
  private _blur = 18;

  get blurAmount(): number { return this._blur; }
  set blurAmount(v: number) { this._blur = v; this.setAttribute('blur', String(v)); this.applyBlur(); }

  protected render(): string {
    return `
      <article class="lmgc" part="card">
        <div class="lmgc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmgc__refraction" aria-hidden="true"></div>
        <div class="lmgc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); perspective: 800px; --lmgc-blur: 18px; }
      .lmgc { position: relative; display: block; border-radius: inherit; transition: transform var(--lumina-speed) var(--lumina-ease-spring); will-change: transform; }
      .lmgc__glow { position: absolute; inset: -10%; border-radius: inherit; pointer-events: none; z-index: 0; opacity: 0; background: radial-gradient(400px circle at var(--lx, 50%) var(--ly, 50%), rgb(var(--lumina-accent-rgb) / calc(0.4 * var(--lumina-intensity))), transparent 60%); filter: blur(30px); transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmgc__glow { opacity: 1; }
      :host(:hover) .lmgc { transform: translateY(-4px); }
      .lmgc__refraction { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 2; background: linear-gradient(135deg, rgb(255 255 255 / 0.12) 0%, transparent 30%, transparent 70%, rgb(255 255 255 / 0.08) 100%); mix-blend-mode: overlay; opacity: 0.6; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmgc__refraction { opacity: 1; background: linear-gradient(135deg, rgb(255 255 255 / 0.2) 0%, transparent 30%, transparent 70%, rgb(255 255 255 / 0.15) 100%); }
      .lmgc__surface { position: relative; z-index: 1; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(var(--lmgc-blur)) saturate(1.6); -webkit-backdrop-filter: blur(var(--lmgc-blur)) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.15), inset 0 -1px 0 0 rgb(0 0 0 / 0.1), var(--lumina-shadow); padding: 24px; overflow: hidden; }
      :host([variant="light"]) .lmgc__surface { background: rgb(255 255 255 / 0.55); border-color: rgb(255 255 255 / 0.4); }
      :host([variant="cosmic"]) .lmgc__surface { background: linear-gradient(135deg, rgb(180 120 255 / 0.25), rgb(120 240 255 / 0.15)); border-color: rgb(200 130 255 / 0.3); }
      @media (prefers-reduced-motion: reduce) { .lmgc, .lmgc__glow, .lmgc__refraction { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._blur = parseFloat(this.getAttribute('blur') ?? '18') || 18;
    this.applyBlur();
    this.addEventListener('pointermove', this.onPointerMove);
  }
  protected unmounted(): void { this.removeEventListener('pointermove', this.onPointerMove); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'blur') { this._blur = parseFloat(value ?? '18') || 18; this.applyBlur(); }
  }
  private applyBlur(): void { this.style.setProperty('--lmgc-blur', `${this._blur}px`); }
  private onPointerMove = throttle((e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.setProperty('--lx', `${x}%`);
    this.style.setProperty('--ly', `${y}%`);
    this.dispatchEvent(new CustomEvent('lumina-hover', { bubbles: true, composed: true, detail: { x, y } }));
  }, 16);
}
declare global { interface HTMLElementTagNameMap { 'lumina-glass-card': GlassCard } }
if (!customElements.get(GlassCard.tagName)) customElements.define(GlassCard.tagName, GlassCard);
