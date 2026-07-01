/**
 * LuminaRangeSlider — 2 handles conectados com tensão visual e tooltip duplo.
 * Variants: glass | neural | dimensional
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { clamp } from '../core/utils';

export class RangeSlider extends LuminaElement {
  static tagName = 'lumina-range-slider';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'min-value', 'max-value', 'min', 'max']; }
  private _min = 0;
  private _max = 100;
  private _minVal = 25;
  private _maxVal = 75;
  private track: HTMLElement | null = null;
  private fill: HTMLElement | null = null;
  private thumbMin: HTMLElement | null = null;
  private thumbMax: HTMLElement | null = null;
  private tooltipMin: HTMLElement | null = null;
  private tooltipMax: HTMLElement | null = null;
  private dragging: 'min' | 'max' | null = null;

  get minValue(): number { return this._minVal; }
  set minValue(v: number) { this._minVal = clamp(v, this._min, this._maxVal); this.setAttribute('min-value', String(this._minVal)); this.updateUI(); }
  get maxValue(): number { return this._maxVal; }
  set maxValue(v: number) { this._maxVal = clamp(v, this._minVal, this._max); this.setAttribute('max-value', String(this._maxVal)); this.updateUI(); }

  protected render(): string {
    return `
      <div class="lmrs" part="track">
        <div class="lmrs__rail" aria-hidden="true"></div>
        <div class="lmrs__fill" part="fill" aria-hidden="true"></div>
        <div class="lmrs__thumb lmrs__thumb--min" part="thumb-min" role="slider" tabindex="0" aria-label="Mínimo">
          <div class="lmrs__tooltip" part="tooltip"></div>
        </div>
        <div class="lmrs__thumb lmrs__thumb--max" part="thumb-max" role="slider" tabindex="0" aria-label="Máximo">
          <div class="lmrs__tooltip" part="tooltip"></div>
        </div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); padding: 20px 0; }
      .lmrs { position: relative; height: 8px; cursor: pointer; touch-action: none; }
      .lmrs__rail { position: absolute; top: 50%; left: 0; right: 0; height: 8px; transform: translateY(-50%); border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.25); }
      .lmrs__fill { position: absolute; top: 50%; height: 8px; transform: translateY(-50%); border-radius: var(--lumina-radius-pill); background: linear-gradient(90deg, rgb(var(--lumina-accent-rgb) / 0.7), var(--lumina-accent)); box-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.6), inset 0 1px 0 rgb(255 255 255 / 0.25); transition: width 0.05s linear, left 0.05s linear; }
      :host([data-tension]) .lmrs__fill { animation: lmrs-tension 0.6s ease-in-out; }
      @keyframes lmrs-tension { 0%, 100% { transform: translateY(-50%) scaleY(1); } 50% { transform: translateY(-50%) scaleY(1.5); box-shadow: 0 0 24px rgb(var(--lumina-accent-rgb) / 1); } }
      .lmrs__thumb { position: absolute; top: 50%; width: 20px; height: 20px; transform: translate(-50%, -50%); border-radius: 50%; background: linear-gradient(135deg, #fff, #d8d8e8); box-shadow: 0 2px 8px rgb(0 0 0 / 0.4), 0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.15), inset 0 1px 0 rgb(255 255 255 / 0.8); cursor: grab; z-index: 2; transition: transform 0.15s var(--lumina-ease-spring); will-change: left; }
      .lmrs__thumb:hover { transform: translate(-50%, -50%) scale(1.15); }
      .lmrs__thumb[data-dragging] { cursor: grabbing; transform: translate(-50%, -50%) scale(1.3); }
      .lmrs__thumb:focus-visible { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      .lmrs__tooltip { position: absolute; bottom: calc(100% + 12px); left: 50%; transform: translateX(-50%); padding: 4px 10px; border-radius: 6px; background: rgb(var(--lumina-surface) / 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); color: var(--lumina-text); font: 600 11px 'JetBrains Mono', monospace; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmrs__thumb:hover .lmrs__tooltip, .lmrs__thumb[data-dragging] .lmrs__tooltip, .lmrs__thumb:focus-visible .lmrs__tooltip { opacity: 1; }
      :host([variant="neural"]) .lmrs__fill { animation: lmrs-pulse 2s ease-in-out infinite; }
      @keyframes lmrs-pulse { 0%, 100% { box-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.6); } 50% { box-shadow: 0 0 24px rgb(var(--lumina-accent-rgb) / 0.9); } }
      @media (prefers-reduced-motion: reduce) { .lmrs__fill, .lmrs__thumb { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._min = parseFloat(this.getAttribute('min') ?? '0') || 0;
    this._max = parseFloat(this.getAttribute('max') ?? '100') || 100;
    this._minVal = clamp(parseFloat(this.getAttribute('min-value') ?? '25') || 25, this._min, this._max);
    this._maxVal = clamp(parseFloat(this.getAttribute('max-value') ?? '75') || 75, this._minVal, this._max);
    this.track = this.$$('.lmrs');
    this.fill = this.$$('.lmrs__fill');
    this.thumbMin = this.$$('.lmrs__thumb--min');
    this.thumbMax = this.$$('.lmrs__thumb--max');
    this.tooltipMin = this.thumbMin?.querySelector('.lmrs__tooltip') ?? null;
    this.tooltipMax = this.thumbMax?.querySelector('.lmrs__tooltip') ?? null;
    this.updateUI();
    this.track?.addEventListener('pointerdown', this.onPointerDown);
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
    this.thumbMin?.addEventListener('keydown', (e) => this.onKeydown(e, 'min'));
    this.thumbMax?.addEventListener('keydown', (e) => this.onKeydown(e, 'max'));
  }
  protected unmounted(): void { document.removeEventListener('pointermove', this.onPointerMove); document.removeEventListener('pointerup', this.onPointerUp); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'min') this._min = parseFloat(value ?? '0') || 0;
    else if (name === 'max') this._max = parseFloat(value ?? '100') || 100;
    else if (name === 'min-value') this._minVal = clamp(parseFloat(value ?? '25') || 25, this._min, this._max);
    else if (name === 'max-value') this._maxVal = clamp(parseFloat(value ?? '75') || 75, this._min, this._max);
    this.updateUI();
  }
  private updateUI(): void {
    if (!this.fill || !this.thumbMin || !this.thumbMax) return;
    const minPct = ((this._minVal - this._min) / (this._max - this._min)) * 100;
    const maxPct = ((this._maxVal - this._min) / (this._max - this._min)) * 100;
    this.fill.style.left = `${minPct}%`;
    this.fill.style.width = `${maxPct - minPct}%`;
    this.thumbMin.style.left = `${minPct}%`;
    this.thumbMax.style.left = `${maxPct}%`;
    if (this.tooltipMin) this.tooltipMin.textContent = String(this._minVal);
    if (this.tooltipMax) this.tooltipMax.textContent = String(this._maxVal);
    this.thumbMin.setAttribute('aria-valuenow', String(this._minVal));
    this.thumbMax.setAttribute('aria-valuenow', String(this._maxVal));
  }
  private setValueFromPointer(clientX: number, which: 'min' | 'max'): void {
    if (!this.track) return;
    const rect = this.track.getBoundingClientRect();
    const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = this._min + pct * (this._max - this._min);
    if (which === 'min') this._minVal = clamp(Math.round(raw), this._min, this._maxVal);
    else this._maxVal = clamp(Math.round(raw), this._minVal, this._max);
    this.setAttribute('min-value', String(this._minVal));
    this.setAttribute('max-value', String(this._maxVal));
    this.updateUI();
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { minValue: this._minVal, maxValue: this._maxVal } }));
  }
  private onPointerDown = (e: PointerEvent): void => {
    if (!this.track) return;
    const rect = this.track.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const val = this._min + pct * (this._max - this._min);
    const distMin = Math.abs(val - this._minVal);
    const distMax = Math.abs(val - this._maxVal);
    this.dragging = distMin < distMax ? 'min' : 'max';
    (this.dragging === 'min' ? this.thumbMin : this.thumbMax)?.setAttribute('data-dragging', '');
    this.setAttribute('data-tension', '');
    setTimeout(() => this.removeAttribute('data-tension'), 600);
    this.setValueFromPointer(e.clientX, this.dragging);
    e.preventDefault();
  };
  private onPointerMove = (e: PointerEvent): void => { if (this.dragging) this.setValueFromPointer(e.clientX, this.dragging); };
  private onPointerUp = (): void => {
    if (this.dragging) { (this.dragging === 'min' ? this.thumbMin : this.thumbMax)?.removeAttribute('data-dragging'); this.dragging = null; }
  };
  private onKeydown(e: KeyboardEvent, which: 'min' | 'max'): void {
    const step = (this._max - this._min) / 20;
    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
    else return;
    e.preventDefault();
    if (which === 'min') this.minValue = this._minVal + delta;
    else this.maxValue = this._maxVal + delta;
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { minValue: this._minVal, maxValue: this._maxVal } }));
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-range-slider': RangeSlider } }
if (!customElements.get(RangeSlider.tagName)) customElements.define(RangeSlider.tagName, RangeSlider);
