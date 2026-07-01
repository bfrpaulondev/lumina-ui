/**
 * LuminaNeuralButton — Botão com rede neural animada (partículas conectadas
 * por linhas) que reage ao hover e clique.
 *
 * Variants: neural | intense | subtle
 * Props: particle-count
 * Evento: lumina-click
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { intensityToMultiplier, prefersReducedMotion } from '../core/utils';

export class NeuralButton extends LuminaElement {
  static tagName = 'lumina-neural-button';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'particle-count'];
  }
  private _particleCount = 20;
  private field: ParticleField | null = null;
  private fieldHost: HTMLElement | null = null;

  get particleCount(): number { return this._particleCount; }
  set particleCount(v: number) { this._particleCount = v; this.setAttribute('particle-count', String(v)); this.rebuildField(); }

  protected render(): string {
    return `
      <button class="lmnb" part="button" type="button">
        <span class="lmnb__bg" aria-hidden="true"></span>
        <span class="lmnb__field" part="particles" aria-hidden="true"></span>
        <span class="lmnb__label"><slot></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmnb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmnb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.3); z-index: 0; }
      .lmnb__field { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 1; opacity: 0.8; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmnb__label { position: relative; z-index: 2; white-space: nowrap; text-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.8); }
      :host(:hover) .lmnb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmnb__field { opacity: 1; }
      :host(:hover) .lmnb__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.6); }
      :host(:active) .lmnb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="intense"]) .lmnb__field { opacity: 1; }
      :host([variant="intense"]) .lmnb__label { text-shadow: 0 0 16px rgb(var(--lumina-accent-rgb) / 1); }
      :host([variant="subtle"]) .lmnb__field { opacity: 0.5; }
      @media (prefers-reduced-motion: reduce) { .lmnb { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._particleCount = parseInt(this.getAttribute('particle-count') ?? '20', 10) || 20;
    this.fieldHost = this.$$('.lmnb__field');
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.$$('.lmnb')?.addEventListener('click', this.onClick);
    this.$$('.lmnb')?.addEventListener('keydown', this.onKeydown);
    if (!prefersReducedMotion()) this.buildField();
  }
  protected unmounted(): void { this.field?.destroy(); this.field = null; }
  protected onConfigChange(changed: Partial<LuminaElementAttributes>): void {
    if (changed.intensity || changed['accent-color']) this.rebuildField();
  }
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'particle-count') { this._particleCount = parseInt(value ?? '20', 10) || 20; this.rebuildField(); }
  }
  private rebuildField(): void {
    this.field?.destroy();
    this.field = null;
    if (!prefersReducedMotion()) this.buildField();
  }
  private buildField(): void {
    if (!this.fieldHost) return;
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    this.field = new ParticleField(this.shadow.host as HTMLElement, {
      count: Math.round(this._particleCount * intensity),
      rgb,
      sizeRange: [0.6, 1.8],
      speedRange: [0.15, 0.5],
      lifeRange: [100, 200],
      connect: true,
    });
    this.field.mount(this.fieldHost);
  }
  private onClick = (): void => { this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true })); };
  private onKeydown = (e: KeyboardEvent): void => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onClick(); } };
}
declare global { interface HTMLElementTagNameMap { 'lumina-neural-button': NeuralButton } }
if (!customElements.get(NeuralButton.tagName)) customElements.define(NeuralButton.tagName, NeuralButton);
