/**
 * LuminaImageZoom — Zoom hover/scroll em imagem.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: overlays
 *
 * Description: Componente de zoom em imagem com controles.
 *
 * Variants: `glass` | `neural` | `smooth`
 * Events:    lumina-zoom-change
 * CSS parts: container, image, controls
 * Props:     `src`, `zoom`
 * Slots:     (none)
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class ImageZoom extends LuminaElement {
  static tagName = 'lumina-image-zoom';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "src", "zoom"];
  }

  get src(): string {
    return this.getAttribute('src') ?? '';
  }
  set src(v: string) {
    this.setAttribute('src', v);
  }
  get zoom(): number {
    return parseFloat(this.getAttribute('zoom') ?? '1') || 0;
  }
  set zoom(v: number) {
    this.setAttribute('zoom', String(v));
  }

  protected render(): string {
    return `
      <div class="lmc" part="container">
        <img class="lmc__img" part="image" />
        <div class="lmc__controls" part="controls">
          <button aria-label="Zoom in">+</button>
          <button aria-label="Zoom out">−</button>
        </div>
      </div>
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
    'lumina-image-zoom': ImageZoom;
  }
}

if (!customElements.get(ImageZoom.tagName)) {
  customElements.define(ImageZoom.tagName, ImageZoom);
}
