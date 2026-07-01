/**
 * LuminaAutocomplete — Autocomplete com highlight do match.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: inputs
 *
 * Description: Campo com sugestões inteligentes e highlight.
 *
 * Variants: `neural` | `glass` | `contextual`
 * Events:    lumina-change
   * lumina-select
 * CSS parts: field, control, suggestions
 * Props:     (none beyond shared)
 * Slots:     (none)
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class Autocomplete extends LuminaElement {
  static tagName = 'lumina-autocomplete';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes];
  }



  protected render(): string {
    return `
      <label class="lmc" part="field">
        <span class="lmc__label" part="label"><slot name="label"></slot></span>
        <span class="lmc__shell" part="control">
          <span class="lmc__bg" aria-hidden="true"></span>
          <span class="lmc__glow" part="glow" aria-hidden="true"></span>
          <slot name="left-icon"></slot>
          <input class="lmc__el" part="control" type="text" />
          <slot name="right-icon"></slot>
          <span class="lmc__echo" part="echo" aria-hidden="true"></span>
        </span>
      </label>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        --lumina-input-h: 48px;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc { display: flex; flex-direction: column; gap: 6px; }
      .lmc__label { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lumina-text-muted); }
      .lmc__label:empty { display: none; }
      .lmc__shell {
        position: relative;
        display: flex;
        align-items: center;
        height: var(--lumina-input-h);
        border-radius: var(--lumina-radius-md);
        overflow: hidden;
      }
      .lmc__bg {
        position: absolute; inset: 0;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(12px) saturate(1.3);
        -webkit-backdrop-filter: blur(12px) saturate(1.3);
        border: 1px solid var(--lumina-border);
        box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow);
        transition: border-color var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmc__glow {
        position: absolute; inset: -2px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        background: conic-gradient(from 0deg, transparent 0%, var(--lumina-accent) 25%, transparent 50%, var(--lumina-accent) 75%, transparent 100%);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        padding: 2px;
        animation: lmc-spin 4s linear infinite;
        animation-play-state: paused;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:focus-within) .lmc__glow { opacity: 0.7; animation-play-state: running; }
      :host(:focus-within) .lmc__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmc__el {
        position: relative; z-index: 2;
        width: 100%; height: 100%;
        padding: 0 16px;
        border: 0; background: transparent;
        color: var(--lumina-text);
        font: inherit;
        font-size: 14px;
        outline: none;
        caret-color: var(--lumina-accent);
      }
      .lmc__el::placeholder { color: var(--lumina-text-muted); }
      .lmc__echo { position: absolute; inset: 0; pointer-events: none; }
      @keyframes lmc-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow, .lmc__bg { animation: none !important; transition: none !important; }
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
    'lumina-autocomplete': Autocomplete;
  }
}

if (!customElements.get(Autocomplete.tagName)) {
  customElements.define(Autocomplete.tagName, Autocomplete);
}
