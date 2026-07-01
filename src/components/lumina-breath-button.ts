/**
 * LuminaBreathButton — Botão com animação contínua de respiração (escala suave).
 * Para ao focar ou clicar.
 *
 * Variants: glass | aura | subtle
 * Evento: lumina-click
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class BreathButton extends LuminaElement {
  static tagName = 'lumina-breath-button';

  protected render(): string {
    return `
      <button class="lmbb" part="button" type="button">
        <span class="lmbb__bg" aria-hidden="true"></span>
        <span class="lmbb__glow" part="glow" aria-hidden="true"></span>
        <span class="lmbb__label"><slot></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmbb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        animation: lmbb-breathe calc(var(--lumina-speed) * 6) ease-in-out infinite;
        will-change: transform;
      }
      @keyframes lmbb-breathe {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.04); }
      }
      .lmbb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmbb__glow { position: absolute; inset: -25%; border-radius: inherit; pointer-events: none; z-index: 0; opacity: calc(0.3 * var(--lumina-intensity)); background: radial-gradient(60% 60% at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.5), transparent 70%); filter: blur(20px); animation: lmbb-glow-pulse calc(var(--lumina-speed) * 6) ease-in-out infinite; }
      @keyframes lmbb-glow-pulse {
        0%, 100% { opacity: calc(0.2 * var(--lumina-intensity)); }
        50%      { opacity: calc(0.5 * var(--lumina-intensity)); }
      }
      .lmbb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmbb { animation-play-state: paused; transform: scale(1.06); }
      :host(:hover) .lmbb__bg { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      :host(:focus-within) .lmbb, :host(:active) .lmbb { animation-play-state: paused; }
      :host(:active) .lmbb { transform: scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="subtle"]) .lmbb { animation: lmbb-breathe calc(var(--lumina-speed) * 10) ease-in-out infinite; }
      :host([variant="subtle"]) .lmbb__glow { animation: lmbb-glow-pulse calc(var(--lumina-speed) * 10) ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) { .lmbb, .lmbb__glow { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.$$('.lmbb')?.addEventListener('click', this.onClick);
    this.$$('.lmbb')?.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private onClick = (): void => { this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true })); };
  private onKeydown = (e: KeyboardEvent): void => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onClick(); } };
}
declare global { interface HTMLElementTagNameMap { 'lumina-breath-button': BreathButton } }
if (!customElements.get(BreathButton.tagName)) customElements.define(BreathButton.tagName, BreathButton);
