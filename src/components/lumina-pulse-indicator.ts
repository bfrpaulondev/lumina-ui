/**
 * LuminaPulseIndicator — Pulso com física real (spring) + intensidade controlável.
 * Variants: aura | neural | subtle
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { clamp } from '../core/utils';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class PulseIndicator extends LuminaElement {
  static tagName = 'lumina-pulse-indicator';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'intensity']; }
  private _pulseIntensity = 0.7;

  get pulseIntensity(): number { return this._pulseIntensity; }
  set pulseIntensity(v: number) { this._pulseIntensity = clamp(v, 0, 1); this.setAttribute('intensity', String(this._pulseIntensity)); this.applyIntensity(); }

  protected render(): string {
    return `
      <span class="lmpi" part="dot">
        <span class="lmpi__pulse" part="pulse" aria-hidden="true"></span>
        <span class="lmpi__pulse lmpi__pulse--2" aria-hidden="true"></span>
        <span class="lmpi__dot" aria-hidden="true"></span>
      </span>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); --lmpi-intensity: 0.7; --lmpi-speed: 2s; }
      .lmpi { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; }
      .lmpi__dot { position: relative; z-index: 2; width: 12px; height: 12px; border-radius: 50%; background: var(--lumina-accent); box-shadow: 0 0 calc(var(--lmpi-intensity) * 12px) var(--lumina-accent); }
      .lmpi__pulse { position: absolute; inset: 0; border-radius: 50%; background: var(--lumina-accent); opacity: calc(var(--lmpi-intensity) * 0.5); animation: lmpi-expand var(--lmpi-speed) var(--lumina-ease-out) infinite; }
      .lmpi__pulse--2 { animation-delay: calc(var(--lmpi-speed) * 0.5); }
      @keyframes lmpi-expand {
        0% { transform: scale(1); opacity: calc(var(--lmpi-intensity) * 0.6); }
        50% { transform: scale(2.5); opacity: calc(var(--lmpi-intensity) * 0.2); }
        100% { transform: scale(4); opacity: 0; }
      }
      :host([variant="aura"]) { --lmpi-speed: 1.8s; }
      :host([variant="aura"]) .lmpi__dot { background: #ffd166; box-shadow: 0 0 calc(var(--lmpi-intensity) * 16px) #ffd166; }
      :host([variant="aura"]) .lmpi__pulse { background: #ffd166; }
      :host([variant="subtle"]) { --lmpi-speed: 3s; }
      :host([variant="subtle"]) .lmpi__pulse { animation-timing-function: var(--lumina-ease-in-out); }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmpi__pulse { animation: none !important; opacity: 0; } }
    `;
  }
  protected mounted(): void {
    this._pulseIntensity = clamp(parseFloat(this.getAttribute('intensity') ?? '0.7') || 0.7, 0, 1);
    this.applyIntensity();
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'intensity') { this._pulseIntensity = clamp(parseFloat(value ?? '0.7') || 0.7, 0, 1); this.applyIntensity(); }
  }
  private applyIntensity(): void {
    this.style.setProperty('--lmpi-intensity', String(this._pulseIntensity));
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-pulse-indicator': PulseIndicator } }
if (!customElements.get(PulseIndicator.tagName)) customElements.define(PulseIndicator.tagName, PulseIndicator);
