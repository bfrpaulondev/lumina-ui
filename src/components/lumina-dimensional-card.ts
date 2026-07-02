/**
 * LuminaDimensionalCard — Múltiplas camadas 3D com parallax e tilt forte baseado no mouse.
 * Variants: medium | deep | extrude
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion, throttle } from '../core/utils';

export class DimensionalCard extends LuminaElement {
  static tagName = 'lumina-dimensional-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'interactive']; }
  private _interactive = true;
  private targetRX = 0; private targetRY = 0;
  private currentRX = 0; private currentRY = 0;
  private raf = 0;
  private layers: HTMLElement[] = [];

  get interactive(): boolean { return this._interactive; }
  set interactive(v: boolean) { this._interactive = v; if (v) this.setAttribute('interactive',''); else this.removeAttribute('interactive'); }

  protected render(): string {
    return `
      <article class="lmdc" part="card">
        <div class="lmdc__layers" part="layers">
          <div class="lmdc__layer lmdc__layer--back" data-depth="0.2"></div>
          <div class="lmdc__layer lmdc__layer--mid" data-depth="0.5"></div>
          <div class="lmdc__layer lmdc__layer--front" data-depth="1">
            <div class="lmdc__surface" part="surface">
              <slot></slot>
            </div>
          </div>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); perspective: 1000px; }
      .lmdc { position: relative; display: block; border-radius: inherit; transform-style: preserve-3d; transition: transform var(--lumina-speed) var(--lumina-ease-spring); will-change: transform; }
      .lmdc__layers { position: relative; transform-style: preserve-3d; }
      .lmdc__layer { position: absolute; inset: 0; border-radius: inherit; transform-style: preserve-3d; transition: transform 0.1s var(--lumina-ease-out); }
      .lmdc__layer--back { background: radial-gradient(circle at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.15), transparent 70%); filter: blur(20px); z-index: 0; }
      .lmdc__layer--mid { background: rgb(var(--lumina-accent-rgb) / 0.08); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.15); z-index: 1; }
      .lmdc__layer--front { position: relative; z-index: 2; }
      .lmdc__surface { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: 0 calc(var(--lumina-depth) * 0.5) 0 calc(var(--lumina-depth) * -0.3) rgb(var(--lumina-accent-rgb) / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.1), var(--lumina-shadow); padding: 24px; overflow: hidden; }
      :host([variant="deep"]) .lmdc__layer--mid { transform: translateZ(-20px); }
      :host([variant="extrude"]) .lmdc__layer--mid { transform: translateZ(-40px); }
      :host([variant="extrude"]) .lmdc__layer--back { transform: translateZ(-60px); }
      @media (prefers-reduced-motion: reduce) { .lmdc, .lmdc__layer { transition: none !important; transform: none !important; } }
    `;
  }
  protected mounted(): void {
    this._interactive = this.getAttribute('interactive') !== 'false';
    this.layers = Array.from(this.$$$('.lmdc__layer'));
    if (this._interactive && !prefersReducedMotion()) {
      this.addEventListener('pointermove', this.onMove);
      this.addEventListener('pointerleave', this.onLeave);
    }
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); this.removeEventListener('pointermove', this.onMove); this.removeEventListener('pointerleave', this.onLeave); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'interactive') this._interactive = value !== 'false';
  }
  private onMove = throttle((e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    this.targetRY = px * 20;
    this.targetRX = -py * 20;
    if (!this.raf) {
      this.dispatchEvent(new CustomEvent('lumina-tilt-start', { bubbles: true, composed: true, detail: { rx: this.targetRX, ry: this.targetRY } }));
      this.tick();
    }
  }, 16);
  private onLeave = (): void => {
    this.targetRX = 0; this.targetRY = 0;
    if (!this.raf) this.tick();
  };
  private tick = (): void => {
    this.currentRX += (this.targetRX - this.currentRX) * 0.15;
    this.currentRY += (this.targetRY - this.currentRY) * 0.15;
    const card = this.$$('.lmdc');
    if (card) card.style.transform = `perspective(1000px) rotateX(${this.currentRX}deg) rotateY(${this.currentRY}deg)`;
    this.layers.forEach((layer) => {
      const depth = parseFloat(layer.dataset.depth ?? '0.5');
      layer.style.transform = `translateZ(${depth * 30}px) translateX(${this.currentRY * depth * 0.5}px) translateY(${-this.currentRX * depth * 0.5}px)`;
    });
    if (Math.abs(this.targetRX - this.currentRX) > 0.05 || Math.abs(this.targetRY - this.currentRY) > 0.05) {
      this.raf = requestAnimationFrame(this.tick);
    } else {
      this.raf = 0;
      if (this.targetRX === 0 && this.targetRY === 0) {
        this.dispatchEvent(new CustomEvent('lumina-tilt-end', { bubbles: true, composed: true }));
      }
    }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-dimensional-card': DimensionalCard } }
if (!customElements.get(DimensionalCard.tagName)) customElements.define(DimensionalCard.tagName, DimensionalCard);
