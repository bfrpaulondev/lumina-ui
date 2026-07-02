/**
 * LuminaBadge — Small label with glow + float.
 *
 * Used for status indicators, counts, version tags. The `pulse` attribute
 * triggers a periodic halo expansion (great for "live" / "new" markers).
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class LuminaBadge extends LuminaElement {
  static tagName = 'lumina-badge';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'pulse', 'dot'];
  }

  protected render(): string {
    return `
      <span class="lumina-badge" part="root">
        <span class="lumina-badge__dot" part="dot" aria-hidden="true"></span>
        <span class="lumina-badge__halo" part="halo" aria-hidden="true"></span>
        <span class="lumina-badge__content" part="content">
          <slot></slot>
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

      .lumina-badge {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: var(--lumina-radius-pill);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.08),
          var(--lumina-shadow);
        color: var(--lumina-text);
        overflow: visible;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring),
                    box-shadow var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-badge__dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--lumina-accent);
        box-shadow: 0 0 6px var(--lumina-accent);
        display: none;
      }
      :host([dot]) .lumina-badge__dot { display: inline-block; }

      .lumina-badge__halo {
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        background: radial-gradient(circle,
          rgb(var(--lumina-accent-rgb) / calc(0.6 * var(--lumina-intensity))),
          transparent 70%
        );
        filter: blur(8px);
        z-index: -1;
      }

      .lumina-badge__content {
        position: relative;
        z-index: 1;
      }

      /* Hover lift */
      :host(:hover) .lumina-badge {
        transform: translateY(-1px);
      }
      :host(:hover) .lumina-badge__halo { opacity: 1; }

      /* Pulse */
      :host([pulse]) .lumina-badge__dot {
        animation: lumina-badge-pulse 1.6s ease-in-out infinite;
      }
      :host([pulse]) .lumina-badge__halo {
        animation: lumina-badge-halo 1.6s ease-out infinite;
        opacity: 1;
      }

      /* Variants */
      :host([variant="void"]) .lumina-badge {
        background: rgb(0 0 0 / 0.6);
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
        color: var(--lumina-accent);
        text-shadow:
          -1px 0 1px rgb(255 0 80 / 0.5),
          1px 0 1px rgb(0 200 255 / 0.5);
      }

      :host([variant="aura"]) .lumina-badge {
        animation: lumina-badge-float 4s ease-in-out infinite;
        background:
          radial-gradient(120% 100% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.25),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%
          );
      }

      :host([variant="morph"]) .lumina-badge {
        border-radius: 4px;
        clip-path: polygon(
          0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%
        );
      }

      :host([variant="dimensional"]) .lumina-badge {
        transform: translateZ(0);
        box-shadow:
          0 4px 0 calc(var(--lumina-depth) * -0.3) rgb(var(--lumina-accent-rgb) / 0.5),
          var(--lumina-shadow);
      }

      @keyframes lumina-badge-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.4); opacity: 0.6; }
      }
      @keyframes lumina-badge-halo {
        0% { transform: scale(0.9); opacity: 0.7; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      @keyframes lumina-badge-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }


      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) {
        .lumina-badge,
        .lumina-badge__dot,
        .lumina-badge__halo {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }

  protected mounted(): void {}
  protected unmounted(): void {}
  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-badge': LuminaBadge;
  }
}

if (!customElements.get(LuminaBadge.tagName)) {
  customElements.define(LuminaBadge.tagName, LuminaBadge);
}
