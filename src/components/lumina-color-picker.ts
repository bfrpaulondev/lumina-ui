/**
 * LuminaColorPicker — Preview em tempo real, paletas harmônicas (Neural), histórico.
 * Variants: glass | neural | holo
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export class ColorPicker extends LuminaElement {
  static tagName = 'lumina-color-picker';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'value']; }
  private _value = '#7c5cff';
  private trigger: HTMLElement | null = null;
  private panel: HTMLElement | null = null;
  private swatch: HTMLElement | null = null;
  private hueSlider: HTMLInputElement | null = null;
  private lightSlider: HTMLInputElement | null = null;
  private history: string[] = [];
  private _open = false;

  get value(): string { return this._value; }
  set value(v: string) { this._value = v; this.setAttribute('value', v); this.updatePreview(); }

  protected render(): string {
    return `
      <div class="lmcp" part="trigger">
        <button class="lmcp__trigger" part="trigger" type="button">
          <span class="lmcp__swatch" part="swatch"></span>
          <span class="lmcp__value"></span>
        </button>
        <div class="lmcp__panel" part="panel" aria-hidden="true">
          <div class="lmcp__preview" part="preview"></div>
          <div class="lmcp__control">
            <label>Hue <input class="lmcp__hue" type="range" min="0" max="360" value="260" /></label>
            <label>Sat <input class="lmcp__sat" type="range" min="0" max="100" value="100" /></label>
            <label>Light <input class="lmcp__light" type="range" min="0" max="100" value="68" /></label>
          </div>
          <div class="lmcp__harmony" data-harmony></div>
          <div class="lmcp__history" data-history></div>
        </div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmcp__trigger { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: var(--lumina-radius-md); border: 1px solid var(--lumina-border); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: pointer; color: inherit; font: 600 13px var(--lumina-font-sans); }
      .lmcp__trigger:hover { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmcp__swatch { width: 20px; height: 20px; border-radius: 4px; border: 1px solid var(--lumina-border); transition: background 0.2s, box-shadow 0.2s; }
      .lmcp__panel { position: absolute; top: calc(100% + 6px); left: 0; z-index: 1000; min-width: 240px; padding: 14px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); opacity: 0; transform: scale(0.92) translateY(-8px); pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host([data-open]) .lmcp__panel { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
      .lmcp__preview { width: 100%; height: 60px; border-radius: var(--lumina-radius-md); margin-bottom: 12px; transition: background 0.2s; box-shadow: 0 0 20px var(--lmcp-current, var(--lumina-accent)); }
      .lmcp__control { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
      .lmcp__control label { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--lumina-text-muted); }
      .lmcp__control input[type="range"] { flex: 1; }
      .lmcp__harmony { margin-bottom: 12px; }
      .lmcp__harmony-label { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lumina-text-muted); margin-bottom: 6px; }
      .lmcp__harmony-swatches { display: flex; gap: 4px; }
      .lmcp__harmony-swatch { width: 28px; height: 28px; border-radius: 6px; cursor: pointer; border: 1px solid var(--lumina-border); transition: transform 0.15s; }
      .lmcp__harmony-swatch:hover { transform: scale(1.15); }
      .lmcp__history { display: flex; gap: 4px; flex-wrap: wrap; }
      .lmcp__history-swatch { width: 20px; height: 20px; border-radius: 4px; cursor: pointer; border: 1px solid var(--lumina-border); }
      .lmcp__history-swatch:hover { transform: scale(1.2); }
      :host([variant="holo"]) .lmcp__preview { background: linear-gradient(135deg, var(--lmcp-current), rgb(255 0 128 / 0.5), rgb(0 200 255 / 0.5)) !important; }
      @media (prefers-reduced-motion: reduce) { .lmcp__panel, .lmcp__swatch { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._value = this.getAttribute('value') ?? '#7c5cff';
    this.trigger = this.$$('.lmcp__trigger');
    this.panel = this.$$('.lmcp__panel');
    this.swatch = this.$$('.lmcp__swatch');
    this.hueSlider = this.$$('.lmcp__hue') as HTMLInputElement | null;
    this.lightSlider = this.$$('.lmcp__light') as HTMLInputElement | null;
    this.updatePreview();
    this.trigger?.addEventListener('click', () => this.toggle());
    this.hueSlider?.addEventListener('input', () => this.updateFromSliders());
    this.$$('.lmcp__sat')?.addEventListener('input', () => this.updateFromSliders());
    this.lightSlider?.addEventListener('input', () => this.updateFromSliders());
    document.addEventListener('click', this.onDocClick);
    this.renderHistory();
  }
  protected unmounted(): void { document.removeEventListener('click', this.onDocClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value') { this._value = value ?? '#7c5cff'; this.updatePreview(); }
  }
  private toggle(): void {
    this._open = !this._open;
    if (this._open) { this.setAttribute('data-open',''); this.updateSliders(); this.renderHarmony(); }
    else this.removeAttribute('data-open');
  }
  private onDocClick = (e: MouseEvent): void => { if (!this.contains(e.target as Node) && this._open) this.toggle(); };
  private updatePreview(): void {
    if (this.swatch) this.swatch.style.background = this._value;
    const valEl = this.$$('.lmcp__value');
    if (valEl) valEl.textContent = this._value;
    const preview = this.$$('.lmcp__preview');
    if (preview) { preview.style.background = this._value; preview.style.setProperty('--lmcp-current', this._value); }
    this.style.setProperty('--lmcp-current', this._value);
  }
  private updateSliders(): void {
    const [h, s, l] = hexToHsl(this._value);
    if (this.hueSlider) this.hueSlider.value = String(Math.round(h));
    const satEl = this.$$('.lmcp__sat') as HTMLInputElement | null;
    if (satEl) satEl.value = String(Math.round(s));
    if (this.lightSlider) this.lightSlider.value = String(Math.round(l));
  }
  private updateFromSliders(): void {
    const h = parseFloat(this.hueSlider?.value ?? '0');
    const s = parseFloat((this.$$('.lmcp__sat') as HTMLInputElement)?.value ?? '100');
    const l = parseFloat(this.lightSlider?.value ?? '68');
    this._value = hslToHex(h, s, l);
    this.setAttribute('value', this._value);
    this.updatePreview();
    this.renderHarmony();
    this.dispatchEvent(new CustomEvent('lumina-color-change', { bubbles: true, composed: true, detail: { value: this._value, h, s, l } }));
  }
  private renderHarmony(): void {
    const host = this.$$('.lmcp__harmony');
    if (!host) return;
    const [h, s, l] = hexToHsl(this._value);
    // Complementary, analogous, triadic
    const harmonies = [
      { label: 'Comp', colors: [hslToHex((h + 180) % 360, s, l)] },
      { label: 'Analog', colors: [hslToHex((h + 30) % 360, s, l), hslToHex((h + 330) % 360, s, l)] },
      { label: 'Triad', colors: [hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)] },
    ];
    host.innerHTML = '<div class="lmcp__harmony-label">Paletas harmônicas</div>';
    harmonies.forEach((group) => {
      const row = document.createElement('div');
      row.className = 'lmcp__harmony-swatches';
      row.style.marginBottom = '4px';
      group.colors.forEach((c) => {
        const sw = document.createElement('div');
        sw.className = 'lmcp__harmony-swatch';
        sw.style.background = c;
        sw.title = c;
        sw.addEventListener('click', () => { this.value = c; this.addToHistory(c); this.dispatchEvent(new CustomEvent('lumina-color-change', { bubbles: true, composed: true, detail: { value: c } })); });
        row.appendChild(sw);
      });
      host!.appendChild(row);
    });
  }
  private addToHistory(color: string): void {
    this.history = [color, ...this.history.filter((c) => c !== color)].slice(0, 8);
    this.renderHistory();
  }
  private renderHistory(): void {
    const host = this.$$('.lmcp__history');
    if (!host) return;
    host.innerHTML = '';
    if (this.history.length === 0) return;
    this.history.forEach((c) => {
      const sw = document.createElement('div');
      sw.className = 'lmcp__history-swatch';
      sw.style.background = c;
      sw.title = c;
      sw.addEventListener('click', () => { this.value = c; this.dispatchEvent(new CustomEvent('lumina-color-change', { bubbles: true, composed: true, detail: { value: c } })); });
      host!.appendChild(sw);
    });
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-color-picker': ColorPicker } }
if (!customElements.get(ColorPicker.tagName)) customElements.define(ColorPicker.tagName, ColorPicker);
