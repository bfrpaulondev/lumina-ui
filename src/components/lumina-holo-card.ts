/**
 * LuminaHoloCard — Holográfico iridescente que muda com o ângulo do mouse.
 * Variants: holo | dimensional | cosmic
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { throttle } from '../core/utils';

export class HoloCard extends LuminaElement {
  static tagName = 'lumina-holo-card';
  private holo: HTMLElement | null = null;

  protected render(): string {
    return `
      <article class="lmho" part="card">
        <div class="lmho__holo" part="holo-layer" aria-hidden="true"></div>
        <div class="lmho__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); perspective: 800px; }
      .lmho { position: relative; display: block; border-radius: inherit; transform-style: preserve-3d; transition: transform var(--lumina-speed) var(--lumina-ease-spring); will-change: transform; }
      .lmho__holo { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 1; opacity: 0.6; background: linear-gradient(var(--holo-angle, 135deg), rgb(255 0 128 / 0.3) 0%, rgb(0 200 255 / 0.3) 25%, rgb(255 255 0 / 0.25) 50%, rgb(0 255 128 / 0.3) 75%, rgb(255 0 128 / 0.3) 100%); mix-blend-mode: overlay; transition: opacity var(--lumina-speed) var(--lumina-ease-out), background var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmho__holo { opacity: 1; }
      .lmho__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid rgb(255 255 255 / 0.2); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.15), var(--lumina-shadow); padding: 24px; overflow: hidden; }
      :host(:hover) .lmho__surface { border-color: rgb(255 255 255 / 0.4); }
      :host([variant="dimensional"]) .lmho__surface { box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.15), 0 calc(var(--lumina-depth) * 0.5) 0 calc(var(--lumina-depth) * -0.3) rgb(var(--lumina-accent-rgb) / 0.4), var(--lumina-shadow); }
      :host([variant="cosmic"]) .lmho__surface { background: linear-gradient(135deg, rgb(180 120 255 / 0.15), rgb(120 240 255 / 0.1), rgb(var(--lumina-surface) / var(--lumina-surface-alpha))); }
      :host([variant="cosmic"]) .lmho__holo { background: linear-gradient(var(--holo-angle, 135deg), rgb(180 120 255 / 0.4) 0%, rgb(120 240 255 / 0.4) 50%, rgb(255 0 200 / 0.3) 100%); }
      @media (prefers-reduced-motion: reduce) { .lmho, .lmho__holo { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this.holo = this.$$('.lmho__holo');
    this.addEventListener('pointermove', this.onMove);
    this.addEventListener('pointerleave', this.onLeave);
  }
  protected unmounted(): void { this.removeEventListener('pointermove', this.onMove); this.removeEventListener('pointerleave', this.onLeave); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private onMove = throttle((e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const angle = Math.atan2(py, px) * (180 / Math.PI) + 180;
    this.style.setProperty('--holo-angle', `${angle}deg`);
    const card = this.$$('.lmho');
    if (card) card.style.transform = `perspective(800px) rotateY(${px * 15}deg) rotateX(${-py * 15}deg)`;
    this.dispatchEvent(new CustomEvent('lumina-hover', { bubbles: true, composed: true, detail: { angle, x: px, y: py } }));
  }, 16);
  private onLeave = (): void => {
    const card = this.$$('.lmho');
    if (card) card.style.transform = '';
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-holo-card': HoloCard } }
if (!customElements.get(HoloCard.tagName)) customElements.define(HoloCard.tagName, HoloCard);
