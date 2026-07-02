/**
 * LuminaSkeleton — Shimmer orgânico (não linear), múltiplas formas, stagger animation.
 * Variants: glass | neural | wave
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class Skeleton extends LuminaElement {
  static tagName = 'lumina-skeleton';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'shape', 'width', 'height', 'count'];
  }
  private _shape = 'text';
  private _width = '';
  private _height = '';
  private _count = 1;

  protected render(): string {
    return `<div class="lmsk-wrap" part="skeleton"></div>`;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); }
      .lmsk-wrap { display: flex; flex-direction: column; gap: 8px; }
      .lmsk {
        position: relative; overflow: hidden;
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05));
        border: 1px solid var(--lumina-border);
        border-radius: var(--lumina-radius-sm);
      }
      .lmsk::after {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(90deg, transparent 0%, rgb(var(--lumina-accent-rgb) / 0.15) 40%, rgb(var(--lumina-accent-rgb) / 0.3) 50%, rgb(var(--lumina-accent-rgb) / 0.15) 60%, transparent 100%);
        background-size: 200% 100%;
        animation: lmsk-shimmer 2s ease-in-out infinite;
      }
      @keyframes lmsk-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .lmsk--text { height: 14px; width: 100%; border-radius: 4px; }
      .lmsk--text:nth-child(even) { width: 80%; }
      .lmsk--circle { border-radius: 50%; width: 48px; height: 48px; flex-shrink: 0; }
      .lmsk--rectangle { border-radius: var(--lumina-radius-md); width: 100%; height: 120px; }
      .lmsk--card { border-radius: var(--lumina-radius-lg); width: 100%; height: 200px; }
      .lmsk--card .lmsk-card-line { height: 12px; margin: 12px; border-radius: 4px; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)); position: relative; overflow: hidden; }
      .lmsk--card .lmsk-card-line::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgb(var(--lumina-accent-rgb) / 0.15) 50%, transparent); background-size: 200% 100%; animation: lmsk-shimmer 2s ease-in-out infinite; }
      :host([variant="wave"]) .lmsk::after { animation: lmsk-wave 1.8s ease-in-out infinite; background: linear-gradient(90deg, transparent, rgb(var(--lumina-accent-rgb) / 0.2), transparent); background-size: 200% 100%; }
      @keyframes lmsk-wave { 0% { background-position: -200% 0; transform: skewX(-12deg); } 100% { background-position: 200% 0; transform: skewX(-12deg); } }
      :host([variant="neural"]) .lmsk { border-color: rgb(var(--lumina-accent-rgb) / 0.2); }
      :host([variant="neural"]) .lmsk::after { background: radial-gradient(circle at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.2), transparent 70%); animation: lmsk-neural-pulse 2s ease-in-out infinite; }
      @keyframes lmsk-neural-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmsk::after, .lmsk-card-line::after { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._shape = this.getAttribute('shape') ?? 'text';
    this._width = this.getAttribute('width') ?? '';
    this._height = this.getAttribute('height') ?? '';
    this._count = parseInt(this.getAttribute('count') ?? '1', 10) || 1;
    this.renderSkeletons();
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'shape') this._shape = value ?? 'text';
    else if (name === 'width') this._width = value ?? '';
    else if (name === 'height') this._height = value ?? '';
    else if (name === 'count') this._count = parseInt(value ?? '1', 10) || 1;
    this.renderSkeletons();
  }
  private renderSkeletons(): void {
    const host = this.$$('.lmsk-wrap');
    if (!host) return;
    host.innerHTML = '';
    for (let i = 0; i < this._count; i++) {
      const el = document.createElement('div');
      el.className = `lmsk lmsk--${this._shape}`;
      el.setAttribute('part', 'skeleton');
      el.style.animationDelay = `${i * 0.15}s`;
      if (this._width) el.style.width = this._width;
      if (this._height) el.style.height = this._height;
      if (this._shape === 'card') {
        el.innerHTML = '<div class="lmsk-card-line" style="width:60%;margin-top:16px"></div><div class="lmsk-card-line" style="width:90%"></div><div class="lmsk-card-line" style="width:75%"></div>';
      }
      host.appendChild(el);
    }
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-skeleton': Skeleton } }
if (!customElements.get(Skeleton.tagName)) customElements.define(Skeleton.tagName, Skeleton);
