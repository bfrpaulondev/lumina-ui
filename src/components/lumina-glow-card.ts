/**
 * LuminaGlowCard — Glow animado que segue o cursor e aumenta de intensidade ao hover.
 * Variants: aura | neural | void
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { clamp, throttle } from '../core/utils';

export class GlowCard extends LuminaElement {
  static tagName = 'lumina-glow-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'glow-intensity']; }
  private _glowIntensity = 0.6;

  get glowIntensity(): number { return this._glowIntensity; }
  set glowIntensity(v: number) { this._glowIntensity = clamp(v, 0, 1); this.setAttribute('glow-intensity', String(this._glowIntensity)); this.applyGlow(); }

  protected render(): string {
    return `
      <article class="lmgl" part="card">
        <div class="lmgl__glow" part="glow" aria-hidden="true"></div>
        <div class="lmgl__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); --lmgl-intensity: 0.6; }
      .lmgl { position: relative; display: block; border-radius: inherit; }
      .lmgl__glow { position: absolute; inset: -5%; border-radius: inherit; pointer-events: none; z-index: 0; opacity: calc(0.3 * var(--lmgl-intensity)); background: radial-gradient(300px circle at var(--lx, 50%) var(--ly, 50%), rgb(var(--lumina-accent-rgb) / calc(0.8 * var(--lmgl-intensity))), transparent 60%); filter: blur(25px); transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmgl__glow { opacity: var(--lmgl-intensity); }
      .lmgl__surface { position: relative; z-index: 1; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; overflow: hidden; }
      :host([variant="aura"]) .lmgl__glow { animation: lmgl-pulse 3s ease-in-out infinite; }
      @keyframes lmgl-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      :host([variant="neural"]) .lmgl__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host([variant="void"]) .lmgl__surface { background: rgb(0 0 0 / 0.5); }
      :host([variant="void"]) .lmgl__glow { background: radial-gradient(300px circle at var(--lx, 50%) var(--ly, 50%), rgb(120 240 255 / calc(0.8 * var(--lmgl-intensity))), transparent 60%); }
      @media (prefers-reduced-motion: reduce) { .lmgl__glow { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._glowIntensity = clamp(parseFloat(this.getAttribute('glow-intensity') ?? '0.6') || 0.6, 0, 1);
    this.applyGlow();
    this.addEventListener('pointermove', this.onMove);
  }
  protected unmounted(): void { this.removeEventListener('pointermove', this.onMove); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'glow-intensity') { this._glowIntensity = clamp(parseFloat(value ?? '0.6') || 0.6, 0, 1); this.applyGlow(); }
  }
  private applyGlow(): void { this.style.setProperty('--lmgl-intensity', String(this._glowIntensity)); }
  private onMove = throttle((e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.setProperty('--lx', `${x}%`);
    this.style.setProperty('--ly', `${y}%`);
    this.dispatchEvent(new CustomEvent('lumina-hover', { bubbles: true, composed: true, detail: { x, y } }));
  }, 16);
}
declare global { interface HTMLElementTagNameMap { 'lumina-glow-card': GlowCard } }
if (!customElements.get(GlowCard.tagName)) customElements.define(GlowCard.tagName, GlowCard);
