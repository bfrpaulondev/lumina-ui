/**
 * LuminaEchoCard — Gera ecos visuais (ondas se propagando) ao clicar ou hover.
 * Variants: aura | neural | glass
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { clamp } from '../core/utils';

export class EchoCard extends LuminaElement {
  static tagName = 'lumina-echo-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'echo-intensity']; }
  private _echoIntensity = 0.7;
  private echoLayer: HTMLElement | null = null;

  get echoIntensity(): number { return this._echoIntensity; }
  set echoIntensity(v: number) { this._echoIntensity = clamp(v, 0, 1); this.setAttribute('echo-intensity', String(this._echoIntensity)); }

  protected render(): string {
    return `
      <article class="lmec" part="card">
        <div class="lmec__echo" part="echo-layer" aria-hidden="true"></div>
        <div class="lmec__surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmec { position: relative; display: block; border-radius: inherit; overflow: hidden; }
      .lmec__echo { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 1; overflow: hidden; }
      .lmec__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; }
      .lmec__wave { position: absolute; border-radius: 50%; pointer-events: none; border: 2px solid rgb(var(--lumina-accent-rgb) / 0.6); transform: translate(-50%, -50%) scale(0); animation: lmec-wave calc(var(--lumina-speed) * 3) var(--lumina-ease-out) forwards; }
      @keyframes lmec-wave { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; } 100% { transform: translate(-50%, -50%) scale(12); opacity: 0; } }
      :host([variant="aura"]) .lmec__surface { background: radial-gradient(120% 100% at 50% 0%, rgb(var(--lumina-accent-rgb) / 0.15), rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%); }
      :host([variant="neural"]) .lmec__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmec__wave { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._echoIntensity = clamp(parseFloat(this.getAttribute('echo-intensity') ?? '0.7') || 0.7, 0, 1);
    this.echoLayer = this.$$('.lmec__echo');
    this.addEventListener('click', this.onClick);
    this.addEventListener('pointerenter', this.onHover);
  }
  protected unmounted(): void { this.removeEventListener('click', this.onClick); this.removeEventListener('pointerenter', this.onHover); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'echo-intensity') this._echoIntensity = clamp(parseFloat(value ?? '0.7') || 0.7, 0, 1);
  }
  private spawnEcho(x: number, y: number, count = 1): void {
    if (!this.echoLayer) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const wave = document.createElement('span');
        wave.className = 'lmec__wave';
        wave.style.left = `${x}px`;
        wave.style.top = `${y}px`;
        wave.style.width = '20px';
        wave.style.height = '20px';
        wave.style.opacity = String(this._echoIntensity);
        this.echoLayer!.appendChild(wave);
        setTimeout(() => wave.remove(), 1500);
      }, i * 200);
    }
  }
  private onClick = (e: MouseEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.spawnEcho(x, y, 3);
    this.dispatchEvent(new CustomEvent('lumina-echo', { bubbles: true, composed: true, detail: { x, y, intensity: this._echoIntensity, type: 'click' } }));
  };
  private onHover = (): void => {
    const rect = this.getBoundingClientRect();
    this.spawnEcho(rect.width / 2, rect.height / 2, 1);
    this.dispatchEvent(new CustomEvent('lumina-echo', { bubbles: true, composed: true, detail: { type: 'hover', intensity: this._echoIntensity } }));
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-echo-card': EchoCard } }
if (!customElements.get(EchoCard.tagName)) customElements.define(EchoCard.tagName, EchoCard);
