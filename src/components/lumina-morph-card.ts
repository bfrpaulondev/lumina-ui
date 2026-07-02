/**
 * LuminaMorphCard — Morphing visual entre estados via clip-path + Web Animations API.
 * Variants: subtle | intense | extreme
 * Events: lumina-morph-start, lumina-morph-end
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

const SHAPES: Record<string, Record<string, string>> = {
  subtle: {
    rest: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    hover: 'polygon(3% 0, 97% 0, 100% 50%, 97% 100%, 3% 100%, 0 50%)',
  },
  intense: {
    rest: 'polygon(8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%, 0 8%)',
    hover: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
  },
  extreme: {
    rest: 'polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%)',
    hover: 'polygon(20% 0, 80% 0, 100% 50%, 80% 100%, 20% 100%, 0 50%)',
  },
};

export class MorphCard extends LuminaElement {
  static tagName = 'lumina-morph-card';
  private card: HTMLElement | null = null;

  protected render(): string {
    return `
      <article class="lmmc" part="card">
        <div class="lmmc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; color: var(--lumina-text); }
      .lmmc { position: relative; display: block; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transition: clip-path var(--lumina-speed) var(--lumina-ease-spring); }
      .lmmc__surface { position: relative; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; overflow: hidden; }
      :host(:hover) .lmmc { transform: scale(1.03); }
      @media (prefers-reduced-motion: reduce) { .lmmc { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this.card = this.$$('.lmmc');
    this.applyShape('rest');
    this.addEventListener('pointerenter', this.onEnter);
    this.addEventListener('pointerleave', this.onLeave);
  }
  protected unmounted(): void { this.removeEventListener('pointerenter', this.onEnter); this.removeEventListener('pointerleave', this.onLeave); }
  protected onConfigChange(changed: Partial<LuminaElementAttributes>): void {
    if (changed.variant) this.applyShape('rest');
  }
  private applyShape(state: 'rest' | 'hover'): void {
    if (!this.card) return;
    const shapes = SHAPES[this.variant] ?? SHAPES.subtle;
    this.card.style.clipPath = shapes[state];
  }
  private onEnter = (): void => {
    this.applyShape('hover');
    this.dispatchEvent(new CustomEvent('lumina-morph-start', { bubbles: true, composed: true, detail: { variant: this.variant, state: 'hover' } }));
  };
  private onLeave = (): void => {
    this.applyShape('rest');
    this.dispatchEvent(new CustomEvent('lumina-morph-end', { bubbles: true, composed: true, detail: { variant: this.variant, state: 'rest' } }));
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-morph-card': MorphCard } }
if (!customElements.get(MorphCard.tagName)) customElements.define(MorphCard.tagName, MorphCard);
