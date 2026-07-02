/**
 * LuminaStepIndicator — Steps com conector progressivo.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: navigation
 *
 * Description: Indicador de etapas com progresso visual.
 *
 * Variants: `glass` | `neural` | `vertical`
 * Events:    lumina-step-change
 * CSS parts: list, step, connector
 * Props:     `current`, `total`
 * Slots:     (none)
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class StepIndicator extends LuminaElement {
  static tagName = 'lumina-step-indicator';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "current", "total"];
  }

  get current(): number {
    return parseFloat(this.getAttribute('current') ?? '0') || 0;
  }
  set current(v: number) {
    this.setAttribute('current', String(v));
  }
  get total(): number {
    return parseFloat(this.getAttribute('total') ?? '0') || 0;
  }
  set total(v: number) {
    this.setAttribute('total', String(v));
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
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
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
    'lumina-step-indicator': StepIndicator;
  }
}

if (!customElements.get(StepIndicator.tagName)) {
  customElements.define(StepIndicator.tagName, StepIndicator);
}
