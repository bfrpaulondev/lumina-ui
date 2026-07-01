/**
 * LuminaDrawerModal — Gaveta lateral com blur.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: overlays
 *
 * Description: Modal tipo gaveta com animação lateral.
 *
 * Variants: `glass` | `neural` | `void`
 * Events:    lumina-open
   * lumina-close
 * CSS parts: backdrop, panel, header, content
 * Props:     `open`, `side`
 * Slots:     `default`, `title`
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class DrawerModal extends LuminaElement {
  static tagName = 'lumina-drawer-modal';

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
    return this.getAttribute('side') ?? 'right';
  }
  set side(v: string) {
    this.setAttribute('side', v);
  }

  protected render(): string {
    return `
      <div class="lmc" part="backdrop" aria-hidden="true"></div>
      <aside class="lmc__panel" part="panel" role="dialog" aria-modal="true">
        <header class="lmc__header" part="header"><slot name="title">Drawer</slot></header>
        <div class="lmc__content" part="content"><slot></slot></div>
      </aside>
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
    this.$$('.lmc')?.addEventListener('click', (e) => {
      if (e.target === this.$$('.lmc')) { this.emit('lumina-backdrop-click'); if (this.getAttribute('close-on-backdrop') !== 'false') this.close(); }
    });
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
    'lumina-drawer-modal': DrawerModal;
  }
}

if (!customElements.get(DrawerModal.tagName)) {
  customElements.define(DrawerModal.tagName, DrawerModal);
}
