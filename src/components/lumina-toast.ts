/**
 * LuminaToast — Toast com auto-dismiss.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: feedback
 *
 * Description: Notificação toast com entrada e saída animadas.
 *
 * Variants: `glass` | `neural` | `aura`
 * Events:    lumina-show
   * lumina-dismiss
 * CSS parts: toast, icon, message, action
 * Props:     `duration`
 * Slots:     (none)
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class Toast extends LuminaElement {
  static tagName = 'lumina-toast';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "duration"];
  }

  get duration(): number {
    return parseFloat(this.getAttribute('duration') ?? '4000') || 0;
  }
  set duration(v: number) {
    this.setAttribute('duration', String(v));
  }

  protected render(): string {
    return `
      <div class="lmc" part="toast" role="alert">
        <span class="lmc__icon" part="icon" aria-hidden="true">●</span>
        <span class="lmc__msg" part="message"><slot></slot></span>
        <button class="lmc__action" part="action" aria-label="Dismiss">×</button>
      </div>
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
    this.$$('.lmc__close, .lmc__remove, .lmc__action')?.addEventListener('click', () => this.emit('lumina-dismiss'));
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
    'lumina-toast': Toast;
  }
}

if (!customElements.get(Toast.tagName)) {
  customElements.define(Toast.tagName, Toast);
}
