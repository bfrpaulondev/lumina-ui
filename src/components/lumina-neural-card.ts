/**
 * LuminaNeuralCard — Cartão com rede neural canvas e partículas reativas ao hover/scroll.
 * Variants: neural | aura | void
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { intensityToMultiplier, prefersReducedMotion } from '../core/utils';

export class NeuralCard extends LuminaElement {
  static tagName = 'lumina-neural-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'particle-count']; }
  private _particleCount = 40;
  private field: ParticleField | null = null;
  private fieldHost: HTMLElement | null = null;

  get particleCount(): number { return this._particleCount; }
  set particleCount(v: number) { this._particleCount = v; this.setAttribute('particle-count', String(v)); this.rebuildField(); }

  protected render(): string {
    return `
      <article class="lmnc" part="card">
        <div class="lmnc__particles" part="particles" aria-hidden="true"></div>
        <div class="lmnc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmnc { position: relative; display: block; border-radius: inherit; overflow: hidden; }
      .lmnc__particles { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 1; opacity: 0.5; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmnc__particles { opacity: 0.9; }
      .lmnc__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1)); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.25); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.08), var(--lumina-shadow); padding: 24px; }
      :host([variant="aura"]) .lmnc__surface { background: radial-gradient(120% 100% at 50% 0%, rgb(var(--lumina-accent-rgb) / 0.15), rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%); }
      :host([variant="void"]) .lmnc__surface { background: rgb(0 0 0 / 0.5); backdrop-filter: blur(6px); }
      @media (prefers-reduced-motion: reduce) { .lmnc__particles { opacity: 0.3; } }
    `;
  }
  protected mounted(): void {
    this._particleCount = parseInt(this.getAttribute('particle-count') ?? '40', 10) || 40;
    this.fieldHost = this.$$('.lmnc__particles');
    if (!prefersReducedMotion()) this.buildField();
    this.addEventListener('pointermove', this.onMove);
    this.addEventListener('click', this.onClick);
  }
  protected unmounted(): void { this.field?.destroy(); this.field = null; }
  protected onConfigChange(changed: Partial<LuminaElementAttributes>): void {
    if (changed.intensity || changed['accent-color']) this.rebuildField();
  }
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'particle-count') { this._particleCount = parseInt(value ?? '40', 10) || 40; this.rebuildField(); }
  }
  private rebuildField(): void { this.field?.destroy(); this.field = null; if (!prefersReducedMotion()) this.buildField(); }
  private buildField(): void {
    if (!this.fieldHost) return;
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    this.field = new ParticleField(this.shadow.host as HTMLElement, {
      count: Math.round(this._particleCount * intensity),
      rgb,
      sizeRange: [0.6, 2],
      speedRange: [0.1, 0.4],
      lifeRange: [120, 240],
      connect: true,
      starfield: this.variant === 'void',
    });
    this.field.mount(this.fieldHost);
  }
  private onMove = (): void => { this.dispatchEvent(new CustomEvent('lumina-hover', { bubbles: true, composed: true })); };
  private onClick = (): void => { this.dispatchEvent(new CustomEvent('lumina-interact', { bubbles: true, composed: true, detail: { type: 'click' } })); };
}
declare global { interface HTMLElementTagNameMap { 'lumina-neural-card': NeuralCard } }
if (!customElements.get(NeuralCard.tagName)) customElements.define(NeuralCard.tagName, NeuralCard);
