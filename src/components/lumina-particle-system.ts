/**
 * LuminaParticleSystem — Sistema de partículas reutilizável aplicável em qualquer componente.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { intensityToMultiplier, prefersReducedMotion } from '../core/utils';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class ParticleSystem extends LuminaElement {
  static tagName = 'lumina-particle-system';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'count', 'mode']; }
  private _count = 60; private _mode = 'plain';
  private field: ParticleField | null = null;
  private host: HTMLElement | null = null;

  protected render(): string { return `<div class="lmps" part="root"><div class="lmps__bg" aria-hidden="true"></div><div class="lmps__canvas" part="canvas" aria-hidden="true"></div><div class="lmps__content"><slot></slot></div></div>`; }
  protected styles(): string {
    return `
      :host { display: block; position: relative; font-family: var(--lumina-font-sans); color: var(--lumina-text); min-height: 200px; border-radius: var(--lumina-radius-lg); overflow: hidden; }
      .lmps { position: relative; width: 100%; height: 100%; min-height: 200px; border-radius: inherit; }
      .lmps__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); z-index: 0; }
      .lmps__canvas { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 1; }
      .lmps__content { position: relative; z-index: 2; padding: 24px; }
      :host([variant="cosmic"]) .lmps__bg { background: radial-gradient(ellipse at center, #0a0420, #000); }
      :host([variant="void"]) .lmps__bg { background: rgb(0 0 0 / 0.7); }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmps__canvas { opacity: 0.3; } }
    `;
  }
  protected mounted(): void {
    this._count = parseInt(this.getAttribute('count') ?? '60', 10) || 60;
    this._mode = this.getAttribute('mode') ?? 'plain';
    this.host = this.$$('.lmps__canvas');
    if (!prefersReducedMotion()) this.buildField();
  }
  protected unmounted(): void { this.field?.destroy(); this.field = null; }
  protected onConfigChange(changed: Partial<LuminaElementAttributes>): void {
    if (changed.intensity || changed['accent-color'] || changed.variant) this.rebuild();
  }
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'count') { this._count = parseInt(value ?? '60', 10) || 60; this.rebuild(); }
    else if (name === 'mode') { this._mode = value ?? 'plain'; this.rebuild(); }
  }
  private rebuild(): void { this.field?.destroy(); this.field = null; if (!prefersReducedMotion()) this.buildField(); }
  private buildField(): void {
    if (!this.host) return;
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    this.field = new ParticleField(this.shadow.host as HTMLElement, {
      count: Math.round(this._count * intensity), rgb,
      sizeRange: [0.6, 2.5], speedRange: [0.1, 0.6], lifeRange: [120, 280],
      connect: this._mode === 'connect', starfield: this._mode === 'starfield',
    });
    this.field.mount(this.host);
  }
  /** Public API: burst particles at position */
  public burst(x: number, y: number, count = 20): void {
    this.dispatchEvent(new CustomEvent('lumina-particle-burst', { bubbles: true, composed: true, detail: { x, y, count } }));
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-particle-system': ParticleSystem } }
if (!customElements.get(ParticleSystem.tagName)) customElements.define(ParticleSystem.tagName, ParticleSystem);
