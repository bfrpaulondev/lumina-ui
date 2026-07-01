/**
 * LuminaDrawer — Drawer com portal de entrada.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: navigation
 *
 * Description: Gaveta lateral com efeito de portal.
 *
 * Variants: `glass` | `void` | `dimensional`
 * Events:    lumina-open
   * lumina-close
 * CSS parts: backdrop, panel, portal
 * Props:     `open`, `side`
 * Slots:     `default`
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class Drawer extends LuminaElement {
  static tagName = 'lumina-drawer';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "open", "side"];
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(v: boolean) {
    if (v) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }
  get side(): string {
    return this.getAttribute('side') ?? 'left';
  }
  set side(v: string) {
    this.setAttribute('side', v);
  }

  protected render(): string {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        padding: 8px;
        border-radius: var(--lumina-radius-pill);
      }
      .lmc__glow {
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))), transparent 60%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      .lmc__inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow { transition: none !important; }
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

  /** Close helper for overlay-style components. */
  public close(): void {
    this.removeAttribute('open');
    this.removeAttribute('data-open');
    this.emit('lumina-close');
  }
  /** Open helper for overlay-style components. */
  public show(): void {
    this.setAttribute('open', '');
    this.setAttribute('data-open', '');
    this.emit('lumina-open');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-drawer': Drawer;
  }
}

if (!customElements.get(Drawer.tagName)) {
  customElements.define(Drawer.tagName, Drawer);
}
