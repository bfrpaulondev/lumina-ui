/**
 * LuminaConfirmationDialog — Confirm dialog com warning.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: overlays
 *
 * Description: Diálogo de confirmação com micro-animações.
 *
 * Variants: `glass` | `neural` | `warning`
 * Events:    lumina-confirm
   * lumina-cancel
 * CSS parts: backdrop, dialog, icon, title, message, actions
 * Props:     `open`, `title`, `message`
 * Slots:     `default`
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class ConfirmationDialog extends LuminaElement {
  static tagName = 'lumina-confirmation-dialog';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "open", "title", "message"];
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(v: boolean) {
    if (v) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }
  get title(): string {
    return this.getAttribute('title') ?? '';
  }
  set title(v: string) {
    this.setAttribute('title', v);
  }
  get message(): string {
    return this.getAttribute('message') ?? '';
  }
  set message(v: string) {
    this.setAttribute('message', v);
  }

  protected render(): string {
    return `
      <div class="lmc" part="backdrop" aria-hidden="true"></div>
      <div class="lmc__dialog" part="dialog" role="dialog" aria-modal="true">
        <header class="lmc__header" part="header"><slot name="title">Dialog</slot></header>
        <div class="lmc__body" part="body"><slot></slot></div>
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
    'lumina-confirmation-dialog': ConfirmationDialog;
  }
}

if (!customElements.get(ConfirmationDialog.tagName)) {
  customElements.define(ConfirmationDialog.tagName, ConfirmationDialog);
}
