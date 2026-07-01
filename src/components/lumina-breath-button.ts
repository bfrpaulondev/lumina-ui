/**
 * LuminaBreathButton — Respira em loop — escala suave.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: buttons
 *
 * Description: Botão com animação contínua de respiração.
 *
 * Variants: `glass` | `aura` | `subtle`
 * Events:    lumina-click
 * CSS parts: button, label, glow
 * Props:     (none beyond shared)
 * Slots:     (none)
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class BreathButton extends LuminaElement {
  static tagName = 'lumina-breath-button';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes];
  }



  protected render(): string {
    return `
      <button class="lmc" part="button" tabindex="0">
        <span class="lmc__bg" aria-hidden="true"></span>
        <span class="lmc__glow" part="glow" aria-hidden="true"></span>
        <span class="lmc__label" part="label"><slot></slot></span>
      </button>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: inline-block;
        cursor: pointer;
        outline: none;
        border-radius: var(--lumina-radius-pill);
        font-family: var(--lumina-font-sans);
        font-weight: 600;
        font-size: 14px;
        color: var(--lumina-text);
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      :host([disabled]) { cursor: not-allowed; opacity: 0.45; filter: saturate(0.4); }
      .lmc {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 44px;
        padding: 0 22px;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        border-radius: inherit;
        overflow: hidden;
        cursor: pointer;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring),
                    box-shadow var(--lumina-speed) var(--lumina-ease-out);
        will-change: transform;
        isolation: isolate;
      }
      .lmc:focus-visible { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      .lmc__bg {
        position: absolute; inset: 0;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
        border-radius: inherit;
        z-index: 0;
      }
      .lmc__glow {
        position: absolute; inset: -20%;
        border-radius: inherit;
        pointer-events: none; z-index: 0;
        opacity: 0;
        background: radial-gradient(60% 60% at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.45), transparent 70%);
        filter: blur(20px);
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmc__label { position: relative; z-index: 2; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
      :host(:hover) .lmc { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmc__glow { opacity: calc(0.6 * var(--lumina-intensity)); }
      :host(:active) .lmc { transform: translateY(0) scale(0.97); }
      @media (prefers-reduced-motion: reduce) {
        .lmc, .lmc__glow { animation: none !important; transition: none !important; }
      }

      :host([variant="aura"]) .lmc { animation: lmc-float 4s ease-in-out infinite; }
      :host([variant="aura"]) .lmc__glow { opacity: calc(0.3 * var(--lumina-intensity)); }
      @keyframes lmc-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
`;
  }

  protected mounted(): void {
    const btn = this.$$('.lmc');
    btn?.addEventListener('click', () => this.emit('lumina-click'));
    btn?.addEventListener('focus', () => this.emit('lumina-focus'));
    btn?.addEventListener('blur', () => this.emit('lumina-blur'));
    btn?.addEventListener('pointerenter', () => this.emit('lumina-hover-start'));
    btn?.addEventListener('pointerleave', () => this.emit('lumina-hover-end'));
  }

  protected unmounted(): void {
    // Listeners auto-cleaned by the host element removal.
  }

  protected onConfigChange(_changed: any): void {
    // Variants are CSS-driven; nothing to rebind here.
  }

  /** Dispatch a CustomEvent with composed bubbling. */
  private emit(name: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }

  /** For overlay-style components: open/close helpers. */
  public open(): void {
    this.setAttribute('open', '');
    this.setAttribute('data-open', '');
    this.emit('lumina-open');
  }
  public close(): void {
    this.removeAttribute('open');
    this.removeAttribute('data-open');
    this.emit('lumina-close');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-breath-button': BreathButton;
  }
}

if (!customElements.get(BreathButton.tagName)) {
  customElements.define(BreathButton.tagName, BreathButton);
}
