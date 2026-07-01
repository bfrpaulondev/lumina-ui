/**
 * LuminaAvatarGroup — Avatares empilhados +N.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: data
 *
 * Description: Grupo de avatares com stacking e tooltip.
 *
 * Variants: `glass` | `neural` | `compact`
 * Events:    (none — inherits standard)
 * CSS parts: group, avatar, overflow
 * Props:     `max`
 * Slots:     `default`
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class AvatarGroup extends LuminaElement {
  static tagName = 'lumina-avatar-group';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "max"];
  }

  get max(): number {
    return parseFloat(this.getAttribute('max') ?? '5') || 0;
  }
  set max(v: number) {
    this.setAttribute('max', String(v));
  }

  protected render(): string {
    return `<span class="lmc" part="group"><slot></slot><span class="lmc__overflow" part="overflow">+N</span></span>`;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
        overflow: hidden;
      }
      ::slotted(*) { padding: 12px 16px; border-bottom: 1px solid var(--lumina-border); }
      ::slotted(*:last-child) { border-bottom: 0; }
      @media (prefers-reduced-motion: reduce) {
        * { transition: none !important; animation: none !important; }
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
    'lumina-avatar-group': AvatarGroup;
  }
}

if (!customElements.get(AvatarGroup.tagName)) {
  customElements.define(AvatarGroup.tagName, AvatarGroup);
}
