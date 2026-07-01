/**
 * LuminaNotificationBadge — Contador animado sobre ícone.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: feedback
 *
 * Description: Badge de notificação com contador animado.
 *
 * Variants: `glass` | `neural` | `aura`
 * Events:    lumina-click
 * CSS parts: badge, count
 * Props:     `count`
 * Slots:     `default`
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class NotificationBadge extends LuminaElement {
  static tagName = 'lumina-notification-badge';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "count"];
  }

  get count(): number {
    return parseFloat(this.getAttribute('count') ?? '0') || 0;
  }
  set count(v: number) {
    this.setAttribute('count', String(v));
  }

  protected render(): string {
    return `
      <span class="lmc" part="root">
        <slot></slot>
        <span class="lmc__badge" part="badge">
          <span class="lmc__count" part="count">0</span>
        </span>
      </span>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: inline-flex;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--lumina-border);
        font-size: 13px; font-weight: 600;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.08), var(--lumina-shadow);
      }
      .lmc__dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: var(--lumina-accent);
        box-shadow: 0 0 8px var(--lumina-accent);
      }
      .lmc__pulse {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
      }
      :host([variant="pulse"]) .lmc__dot,
      :host([variant="aura"]) .lmc__dot,
      :host([variant="online"]) .lmc__dot {
        animation: lmc-pulse 1.6s ease-in-out infinite;
      }
      @keyframes lmc-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.6; }
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc, .lmc__dot, .lmc__pulse { animation: none !important; transition: none !important; }
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
    'lumina-notification-badge': NotificationBadge;
  }
}

if (!customElements.get(NotificationBadge.tagName)) {
  customElements.define(NotificationBadge.tagName, NotificationBadge);
}
