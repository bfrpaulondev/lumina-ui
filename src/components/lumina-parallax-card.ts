/**
 * LuminaParallaxCard — Parallax em 3 camadas internas com velocidades diferentes.
 * Variants: medium | deep | extrude
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion, throttle } from '../core/utils';

export class ParallaxCard extends LuminaElement {
  static tagName = 'lumina-parallax-card';
  private layerBack: HTMLElement | null = null;
  private layerMid: HTMLElement | null = null;
  private layerFront: HTMLElement | null = null;

  protected render(): string {
    return `
      <article class="lmpc" part="card">
        <div class="lmpc__layer lmpc__layer--back" part="layer-back" aria-hidden="true"></div>
        <div class="lmpc__layer lmpc__layer--mid" part="layer-mid" aria-hidden="true"></div>
        <div class="lmpc__layer lmpc__layer--front" part="layer-front">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); perspective: 800px; overflow: hidden; }
      .lmpc { position: relative; display: block; border-radius: inherit; transform-style: preserve-3d; min-height: 200px; overflow: hidden; }
      .lmpc__layer { position: absolute; inset: 0; border-radius: inherit; transition: transform 0.1s var(--lumina-ease-out); will-change: transform; }
      .lmpc__layer--back { background: radial-gradient(circle at 30% 30%, rgb(var(--lumina-accent-rgb) / 0.25), transparent 70%); filter: blur(15px); z-index: 0; }
      .lmpc__layer--mid { background: rgb(var(--lumina-accent-rgb) / 0.08); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.2); z-index: 1; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      .lmpc__layer--front { position: relative; z-index: 2; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; }
      :host([variant="deep"]) .lmpc__layer--back { filter: blur(25px); }
      :host([variant="deep"]) .lmpc__layer--mid { transform: translateZ(20px); }
      :host([variant="extrude"]) .lmpc__layer--back { filter: blur(30px); }
      :host([variant="extrude"]) .lmpc__layer--mid { transform: translateZ(30px); }
      :host([variant="extrude"]) .lmpc__layer--front { transform: translateZ(60px); box-shadow: 0 30px 0 -20px rgb(var(--lumina-accent-rgb) / 0.3), inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); }
      @media (prefers-reduced-motion: reduce) { .lmpc__layer { transition: none !important; transform: none !important; } }
    `;
  }
  protected mounted(): void {
    this.layerBack = this.$$('.lmpc__layer--back');
    this.layerMid = this.$$('.lmpc__layer--mid');
    this.layerFront = this.$$('.lmpc__layer--front');
    if (!prefersReducedMotion()) {
      this.addEventListener('pointermove', this.onMove);
      this.addEventListener('pointerleave', this.onLeave);
    }
  }
  protected unmounted(): void { this.removeEventListener('pointermove', this.onMove); this.removeEventListener('pointerleave', this.onLeave); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private onMove = throttle((e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (this.layerBack) this.layerBack.style.transform = `translateX(${px * 30}px) translateY(${py * 30}px)`;
    if (this.layerMid) this.layerMid.style.transform = `translateX(${px * 18}px) translateY(${py * 18}px)`;
    if (this.layerFront) this.layerFront.style.transform = `translateX(${px * 8}px) translateY(${py * 8}px)`;
    this.dispatchEvent(new CustomEvent('lumina-parallax', { bubbles: true, composed: true, detail: { x: px, y: py } }));
  }, 16);
  private onLeave = (): void => {
    if (this.layerBack) this.layerBack.style.transform = '';
    if (this.layerMid) this.layerMid.style.transform = '';
    if (this.layerFront) this.layerFront.style.transform = '';
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-parallax-card': ParallaxCard } }
if (!customElements.get(ParallaxCard.tagName)) customElements.define(ParallaxCard.tagName, ParallaxCard);
