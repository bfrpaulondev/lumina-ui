/**
 * LuminaLoading — Loading com 5 estilos visuais (neural/aura/void/dimensional/spinner),
 * modo overlay e texto opcional.
 *
 * Variants: neural | aura | void | dimensional | spinner
 *
 * Uso:
 *   <lumina-loading variant="neural" size="64"></lumina-loading>
 *   <lumina-loading variant="spinner" overlay text="Carregando dados..."></lumina-loading>
 *
 * Eventos: nenhum (componente puramente visual)
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { prefersReducedMotion } from '../core/utils';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class LuminaLoading extends LuminaElement {
  static tagName = 'lumina-loading';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'size',
      'overlay',
      'text',
    ];
  }

  private _size = 64;
  private _overlay = false;
  private _text = '';
  private field: ParticleField | null = null;
  private fieldHost: HTMLElement | null = null;

  get size(): number { return this._size; }
  set size(v: number) {
    this._size = v;
    this.setAttribute('size', String(v));
    this.applySize();
  }

  get overlay(): boolean { return this._overlay; }
  set overlay(v: boolean) {
    this._overlay = v;
    if (v) this.setAttribute('overlay', '');
    else this.removeAttribute('overlay');
  }

  get text(): string { return this._text; }
  set text(v: string) {
    this._text = v;
    this.setAttribute('text', v);
    this.applyText();
  }

  protected render(): string {
    return `
      <div class="lml" part="container">
        <div class="lml__backdrop" aria-hidden="true"></div>
        <div class="lml__spinner" part="spinner">
          <span class="lml__ring lml__ring--1" aria-hidden="true"></span>
          <span class="lml__ring lml__ring--2" aria-hidden="true"></span>
          <span class="lml__ring lml__ring--3" aria-hidden="true"></span>
          <span class="lml__core" aria-hidden="true"></span>
          <div class="lml__particles" part="particles" aria-hidden="true"></div>
        </div>
        <div class="lml__text" part="text"></div>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: inline-flex;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        --lml-size: 64px;
      }

      .lml {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
      }

      .lml__backdrop {
        display: none;
      }
      :host([overlay]) {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      :host([overlay]) .lml__backdrop {
        display: block;
        position: absolute;
        inset: 0;
        background: rgb(var(--lumina-surface) / 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      :host([overlay]) .lml {
        position: relative;
        z-index: 1;
        padding: 32px 48px;
        border-radius: var(--lumina-radius-lg);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
        box-shadow: 0 24px 60px -20px rgb(0 0 0 / 0.5);
      }

      .lml__spinner {
        position: relative;
        width: var(--lml-size);
        height: var(--lml-size);
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .lml__ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 2px solid transparent;
        border-top-color: var(--lumina-accent);
        animation: lml-spin 1.4s linear infinite;
      }
      .lml__ring--2 {
        inset: 12%;
        border-top-color: rgb(var(--lumina-accent-rgb) / 0.6);
        animation-duration: 1.8s;
        animation-direction: reverse;
      }
      .lml__ring--3 {
        inset: 24%;
        border-top-color: rgb(var(--lumina-accent-rgb) / 0.3);
        animation-duration: 2.2s;
      }

      .lml__core {
        width: 20%;
        height: 20%;
        border-radius: 50%;
        background: var(--lumina-accent);
        box-shadow:
          0 0 16px var(--lumina-accent),
          0 0 32px rgb(var(--lumina-accent-rgb) / 0.6);
        animation: lml-pulse 1.2s ease-in-out infinite;
      }
      @keyframes lml-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%      { transform: scale(1.4); opacity: 0.7; }
      }
      @keyframes lml-spin {
        to { transform: rotate(360deg); }
      }

      .lml__particles {
        position: absolute;
        inset: -20%;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lml__text {
        font-size: 13px;
        font-weight: 600;
        color: var(--lumina-text-muted);
        letter-spacing: 0.04em;
        text-align: center;
        display: none;
      }
      .lml__text:not(:empty) { display: block; }

      /* ----- Variant: spinner (clean, default-ish) ----- */
      :host([variant="spinner"]) .lml__ring--2,
      :host([variant="spinner"]) .lml__ring--3 { display: none; }
      :host([variant="spinner"]) .lml__core { display: none; }

      /* ----- Variant: neural — show particles ----- */
      :host([variant="neural"]) .lml__particles { opacity: 1; }
      :host([variant="neural"]) .lml__ring {
        border-top-color: transparent;
        border-color: rgb(var(--lumina-accent-rgb) / 0.2);
        border-top-color: var(--lumina-accent);
      }

      /* ----- Variant: aura — soft glow + slow rings ----- */
      :host([variant="aura"]) .lml__ring {
        border-color: rgb(var(--lumina-accent-rgb) / 0.15);
        border-top-color: rgb(var(--lumina-accent-rgb) / 0.9);
        animation-duration: 3s;
        box-shadow: 0 0 16px rgb(var(--lumina-accent-rgb) / 0.4);
      }
      :host([variant="aura"]) .lml__ring--2 {
        animation-duration: 4s;
        animation-direction: normal;
      }
      :host([variant="aura"]) .lml__ring--3 { display: none; }
      :host([variant="aura"]) .lml__core {
        animation: lml-aura-breathe 2s ease-in-out infinite;
      }
      @keyframes lml-aura-breathe {
        0%, 100% { transform: scale(1); box-shadow: 0 0 16px var(--lumina-accent); }
        50%      { transform: scale(1.6); box-shadow: 0 0 32px var(--lumina-accent), 0 0 64px rgb(var(--lumina-accent-rgb) / 0.5); }
      }

      /* ----- Variant: void — pure black with cyan starfield ----- */
      :host([variant="void"]) .lml__particles { opacity: 1; }
      :host([variant="void"]) .lml__ring {
        border-top-color: transparent;
        border-color: rgb(120 240 255 / 0.15);
        border-top-color: #78f0ff;
        box-shadow: 0 0 8px rgb(120 240 255 / 0.4);
      }
      :host([variant="void"]) .lml__core {
        background: #78f0ff;
        box-shadow:
          0 0 16px #78f0ff,
          -2px 0 4px rgb(255 0 80 / 0.6),
          2px 0 4px rgb(0 200 255 / 0.6);
      }

      /* ----- Variant: dimensional — 3D cube-ish rings ----- */
      :host([variant="dimensional"]) .lml__spinner {
        perspective: 400px;
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"]) .lml__ring {
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"]) .lml__ring--1 {
        animation: lml-dim-x 2s linear infinite;
        border-top-color: transparent;
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }
      :host([variant="dimensional"]) .lml__ring--2 {
        animation: lml-dim-y 2.4s linear infinite;
        inset: 8%;
      }
      :host([variant="dimensional"]) .lml__ring--3 {
        animation: lml-dim-z 2.8s linear infinite;
        inset: 16%;
      }
      @keyframes lml-dim-x {
        from { transform: rotateX(0deg) rotateY(0deg); }
        to   { transform: rotateX(360deg) rotateY(0deg); }
      }
      @keyframes lml-dim-y {
        from { transform: rotateX(0deg) rotateY(0deg); }
        to   { transform: rotateX(0deg) rotateY(360deg); }
      }
      @keyframes lml-dim-z {
        from { transform: rotateZ(0deg); }
        to   { transform: rotateZ(360deg); }
      }


      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) {
        .lml__ring, .lml__core, .lml__particles {
          animation: none !important;
        }
      }
    `;
  }

  protected mounted(): void {
    this.fieldHost = this.$$('.lml__particles');
    this._size = parseFloat(this.getAttribute('size') ?? '64') || 64;
    this._overlay = this.hasAttribute('overlay');
    this._text = this.getAttribute('text') ?? '';

    this.applySize();
    this.applyText();

    if (!prefersReducedMotion()) this.maybeInitField();
  }

  protected unmounted(): void {
    this.field?.destroy();
    this.field = null;
  }

  protected onConfigChange(changed: Partial<LuminaElementAttributes>): void {
    if (changed.variant) {
      this.field?.destroy();
      this.field = null;
      this.maybeInitField();
    }
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'size') {
      this._size = parseFloat(value ?? '64') || 64;
      this.applySize();
    } else if (name === 'overlay') {
      this._overlay = value !== null;
    } else if (name === 'text') {
      this._text = value ?? '';
      this.applyText();
    }
  }

  private applySize(): void {
    this.style.setProperty('--lml-size', `${this._size}px`);
  }

  private applyText(): void {
    const textEl = this.$$('.lml__text');
    if (textEl) textEl.textContent = this._text;
  }

  private maybeInitField(): void {
    if (!this.fieldHost) return;
    const v = this.variant;
    if (v !== 'neural' && v !== 'void') return;
    const accentRgb = (this.shadow.host as HTMLElement).style
      .getPropertyValue('--lumina-accent-rgb')
      .trim() || (v === 'void' ? '120 240 255' : '124 92 255');
    this.field = new ParticleField(this.shadow.host as HTMLElement, {
      count: 24,
      rgb: accentRgb,
      sizeRange: [0.6, 1.8],
      speedRange: [0.2, 0.6],
      lifeRange: [100, 200],
      connect: v === 'neural',
      starfield: v === 'void',
    });
    this.field.mount(this.fieldHost);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-loading': LuminaLoading;
  }
}

if (!customElements.get(LuminaLoading.tagName)) {
  customElements.define(LuminaLoading.tagName, LuminaLoading);
}
