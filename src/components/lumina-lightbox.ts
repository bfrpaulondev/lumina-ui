/**
 * LuminaLightbox — Lightbox com zoom e setas.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: overlays
 *
 * Description: Lightbox para imagens com zoom e navegação.
 *
 * Variants: `glass` | `holo` | `dimensional`
 * Events:    lumina-open
   * lumina-close
   * lumina-navigate
 * CSS parts: backdrop, image, controls, caption
 * Props:     `src`
 * Slots:     `default`, `caption`
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class Lightbox extends LuminaElement {
  static tagName = 'lumina-lightbox';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "src"];
  }

  get src(): string {
    return this.getAttribute('src') ?? '';
  }
  set src(v: string) {
    this.setAttribute('src', v);
  }

  protected render(): string {
    return `
      <div class="lmc" part="backdrop" aria-hidden="true"></div>
      <div class="lmc__img-wrap" part="image">
        <img class="lmc__img" />
      </div>
      <div class="lmc__controls" part="controls">
        <button aria-label="Previous">‹</button>
        <button aria-label="Next">›</button>
        <button aria-label="Close">×</button>
      </div>
      <div class="lmc__caption" part="caption"><slot name="caption"></slot></div>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: contents;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: fixed; inset: 0;
        background: rgb(0 0 0 / 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        opacity: 0;
        transition: opacity calc(var(--lumina-speed) * 1.2) var(--lumina-ease-out);
        z-index: 1000;
      }
      :host([data-open]) .lmc,
      :host([open]) .lmc { opacity: 1; }
      @media (prefers-reduced-motion: reduce) {
        .lmc { transition: none !important; }
      }
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
    'lumina-lightbox': Lightbox;
  }
}

if (!customElements.get(Lightbox.tagName)) {
  customElements.define(Lightbox.tagName, Lightbox);
}
