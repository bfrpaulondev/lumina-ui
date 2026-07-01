/**
 * LuminaParticleSystem — Camada de partículas universal.
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: unique
 *
 * Description: Sistema de partículas configurável aplicável em qualquer componente.
 *
 * Variants: `neural` | `aura` | `void` | `cosmic`
 * Events:    lumina-particle-burst
 * CSS parts: canvas, controls
 * Props:     `count`, `mode`
 * Slots:     (none)
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import { LuminaElement } from '../core/LuminaElement';

export class ParticleSystem extends LuminaElement {
  static tagName = 'lumina-particle-system';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, "count", "mode"];
  }

  get count(): number {
    return parseFloat(this.getAttribute('count') ?? '60') || 0;
  }
  set count(v: number) {
    this.setAttribute('count', String(v));
  }
  get mode(): string {
    return this.getAttribute('mode') ?? 'plain';
  }
  set mode(v: string) {
    this.setAttribute('mode', v);
  }

  protected render(): string {
    return `
      <div class="lmc" part="root">
        <div class="lmc__core" part="core"><slot></slot></div>
        <canvas class="lmc__canvas" part="canvas" aria-hidden="true"></canvas>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        position: relative;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        border-radius: var(--lumina-radius-lg);
        overflow: hidden;
        min-height: 200px;
      }
      .lmc {
        position: relative;
        width: 100%; height: 100%;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(16px) saturate(1.4);
        -webkit-backdrop-filter: blur(16px) saturate(1.4);
        border: 1px solid var(--lumina-border);
      }
      .lmc__core {
        position: relative; z-index: 2;
        padding: 24px;
      }
      .lmc__canvas {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.7;
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc, .lmc__canvas { transition: none !important; animation: none !important; }
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
    'lumina-particle-system': ParticleSystem;
  }
}

if (!customElements.get(ParticleSystem.tagName)) {
  customElements.define(ParticleSystem.tagName, ParticleSystem);
}
