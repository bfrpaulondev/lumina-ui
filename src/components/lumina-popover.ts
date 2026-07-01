/**
 * LuminaPopover — Popover com flip + shift.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: overlays
 *
 * Description: Popover com posicionamento inteligente.
 *
 * Variants: `glass` | `neural` | `aura`
 * Events:    lumina-show
   * lumina-hide
 * CSS parts: popover, arrow, content
 * Props:     `placement`
 * Slots:     `default`, `content`
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class Popover extends LuminaElement {
  static tagName = 'lumina-popover';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "placement"];
  }

  get placement(): string {
    return this.getAttribute('placement') ?? 'top';
  }
  set placement(v: string) {
    this.setAttribute('placement', v);
  }

  protected render(): string {
    return `
      <span class="lmc" part="root">
        <slot></slot>
        <div class="lmc__pop" part="content" role="menu">
          <span class="lmc__arrow" part="arrow" aria-hidden="true"></span>
          <slot name="content"></slot>
        </div>
      </span>
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
    'lumina-popover': Popover;
  }
}

if (!customElements.get(Popover.tagName)) {
  customElements.define(Popover.tagName, Popover);
}
