/**
 * LuminaLiquidCard — Superfície líquida que ondula.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: cards
 *
 * Description: Cartão com efeito líquido/viscoso ao interagir.
 *
 * Variants: `morph` | `glass` | `neural`
 * Events:    (none — inherits standard)
 * CSS parts: card, liquid, surface
 * Props:     (none beyond shared)
 * Slots:     `default`
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class LiquidCard extends LuminaElement {
  static tagName = 'lumina-liquid-card';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes];
  }



  protected render(): string {
    return `
      <article class="lmc" part="card">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__surface" part="surface">
        <div class="lmc__body" part="body"><slot></slot></div>
        </div>
      </article>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        position: relative;
        border-radius: var(--lumina-radius-lg);
        color: var(--lumina-text);
        perspective: 800px;
      }
      .lmc {
        position: relative;
        display: block;
        border-radius: inherit;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
        will-change: transform;
      }
      .lmc__glow {
        position: absolute; inset: -10%;
        border-radius: inherit;
        pointer-events: none; z-index: 0;
        opacity: 0;
        background: radial-gradient(400px circle at var(--lx, 50%) var(--ly, 50%),
          rgb(var(--lumina-accent-rgb) / calc(0.45 * var(--lumina-intensity))), transparent 60%);
        filter: blur(30px);
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      :host(:hover) .lmc { transform: translateY(-4px); }
      .lmc__surface {
        position: relative; z-index: 2;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(18px) saturate(1.5);
        -webkit-backdrop-filter: blur(18px) saturate(1.5);
        border: 1px solid var(--lumina-border);
        box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow);
        overflow: hidden;
      }
      .lmc__header { padding: 16px 20px; border-bottom: 1px solid var(--lumina-border); }
      .lmc__media { display: block; }
      .lmc__body { padding: 20px; }
      .lmc__footer { padding: 12px 20px; border-top: 1px solid var(--lumina-border); }
      ::slotted([slot="header"]) { margin: 0; font-size: 16px; font-weight: 700; }
      @media (prefers-reduced-motion: reduce) {
        .lmc, .lmc__glow { animation: none !important; transition: none !important; }
      }

      :host([variant="morph"]) .lmc { clip-path: polygon(0 8%, 8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%); border-radius: 0; }
`;
  }

  protected mounted(): void {
    // (no specific handlers — interactivity is CSS-driven)
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
    'lumina-liquid-card': LiquidCard;
  }
}

if (!customElements.get(LiquidCard.tagName)) {
  customElements.define(LiquidCard.tagName, LiquidCard);
}
