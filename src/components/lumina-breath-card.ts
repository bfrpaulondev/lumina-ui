/**
 * LuminaBreathCard — Animação sutil e contínua de respiração. Para ao interagir.
 * Variants: subtle | medium | intense
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class BreathCard extends LuminaElement {
  static tagName = 'lumina-breath-card';

  protected render(): string {
    return `
      <article class="lmbc" part="card">
        <div class="lmbc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmbc { position: relative; display: block; border-radius: inherit; animation: lmbc-breathe calc(var(--lumina-speed) * 8) ease-in-out infinite; will-change: transform; }
      @keyframes lmbc-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.015); } }
      .lmbc__surface { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; }
      :host(:hover) .lmbc, :host(:focus-within) .lmbc, :host(:active) .lmbc { animation-play-state: paused; }
      :host([variant="subtle"]) .lmbc { animation-duration: calc(var(--lumina-speed) * 12); }
      :host([variant="subtle"]) { --lumina-intensity: 0.4; }
      :host([variant="intense"]) .lmbc { animation-duration: calc(var(--lumina-speed) * 5); }
      :host([variant="intense"]) .lmbc__surface { box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 30px rgb(var(--lumina-accent-rgb) / 0.2), var(--lumina-shadow); }
      @keyframes lmbc-breathe-intense { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
      :host([variant="intense"]) .lmbc { animation-name: lmbc-breathe-intense; }
      @media (prefers-reduced-motion: reduce) { .lmbc { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this.addEventListener('pointerenter', () => this.$$('.lmbc')?.style.setProperty('animation-play-state', 'paused'));
    this.addEventListener('pointerleave', () => this.$$('.lmbc')?.style.setProperty('animation-play-state', 'running'));
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
}
declare global { interface HTMLElementTagNameMap { 'lumina-breath-card': BreathCard } }
if (!customElements.get(BreathCard.tagName)) customElements.define(BreathCard.tagName, BreathCard);
