/**
 * LuminaAvatar — Avatar com iniciais e status.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: data
 *
 * Description: Avatar com status, glow e fallback.
 *
 * Variants: `glass` | `neural` | `holo`
 * Events:    (none — inherits standard)
 * CSS parts: avatar, image, fallback, status
 * Props:     `src`, `name`, `size`
 * Slots:     (none)
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class Avatar extends LuminaElement {
  static tagName = 'lumina-avatar';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "src", "name", "size"];
  }

  get src(): string {
    return this.getAttribute('src') ?? '';
  }
  set src(v: string) {
    this.setAttribute('src', v);
  }
  get name(): string {
    return this.getAttribute('name') ?? '';
  }
  set name(v: string) {
    this.setAttribute('name', v);
  }
  get size(): number {
    return parseFloat(this.getAttribute('size') ?? '40') || 0;
  }
  set size(v: number) {
    this.setAttribute('size', String(v));
  }

  protected render(): string {
    return `
      <span class="lmc" part="avatar">
        <img class="lmc__img" part="image" />
        <span class="lmc__fallback" part="fallback"></span>
        <span class="lmc__status" part="status" aria-hidden="true"></span>
      </span>
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
    'lumina-avatar': Avatar;
  }
}

if (!customElements.get(Avatar.tagName)) {
  customElements.define(Avatar.tagName, Avatar);
}
