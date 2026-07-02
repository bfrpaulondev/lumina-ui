/**
 * LuminaTimePicker — Modo circular com arrastar do ponteiro, formato 12h/24h.
 * Variants: glass | neural | circular
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { clamp } from '../core/utils';

export class TimePicker extends LuminaElement {
  static tagName = 'lumina-time-picker';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'value', 'format', 'name', 'disabled', 'required', 'invalid', 'valid']; }
  private _value = '12:00';
  private _format = '24h';
  private trigger: HTMLElement | null = null;
  private dial: HTMLElement | null = null;
  private hand: HTMLElement | null = null;
  private _open = false;
  private editing: 'hour' | 'minute' = 'hour';

  get value(): string { return this._value; }
  set value(v: string) { this._value = v; this.setAttribute('value', v); this.updateTrigger(); this.updateHand(); }

  protected render(): string {
    return `
      <div class="lmtp" part="trigger">
        <button class="lmtp__trigger" type="button">
          <span class="lmtp__icon">🕐</span>
          <span class="lmtp__value"></span>
        </button>
        <div class="lmtp__panel" aria-hidden="true">
          <div class="lmtp__tabs">
            <button class="lmtp__tab" data-mode="hour" data-active>Hora</button>
            <button class="lmtp__tab" data-mode="minute">Minuto</button>
          </div>
          <div class="lmtp__dial" part="dial">
            <div class="lmtp__hand" part="hand"></div>
            <div class="lmtp__center"></div>
          </div>
          <div class="lmtp__display"></div>
        </div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmtp__trigger { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: var(--lumina-radius-md); border: 1px solid var(--lumina-border); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: pointer; color: inherit; font: 500 14px var(--lumina-font-sans); }
      .lmtp__trigger:hover { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmtp__panel { position: absolute; top: calc(100% + 6px); left: 0; z-index: 1000; min-width: 240px; padding: 14px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); opacity: 0; transform: scale(0.92) translateY(-8px); pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host([data-open]) .lmtp__panel { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
      .lmtp__tabs { display: flex; gap: 4px; margin-bottom: 12px; }
      .lmtp__tab { flex: 1; appearance: none; border: 1px solid var(--lumina-border); background: transparent; color: var(--lumina-text-muted); padding: 6px; border-radius: 6px; cursor: pointer; font: 600 12px var(--lumina-font-sans); transition: background 0.2s, color 0.2s; }
      .lmtp__tab[data-active] { background: rgb(var(--lumina-accent-rgb) / 0.2); color: var(--lumina-accent); border-color: rgb(var(--lumina-accent-rgb) / 0.4); }
      .lmtp__dial { position: relative; width: 200px; height: 200px; margin: 0 auto; border-radius: 50%; background: rgb(var(--lumina-surface) / 0.3); border: 1px solid var(--lumina-border); cursor: pointer; touch-action: none; }
      .lmtp__hand { position: absolute; top: 50%; left: 50%; width: 2px; height: 80px; background: var(--lumina-accent); transform-origin: bottom center; transform: translate(-50%, -100%) rotate(0deg); transition: transform 0.2s var(--lumina-ease-spring); box-shadow: 0 0 8px var(--lumina-accent); border-radius: 2px; }
      .lmtp__hand::after { content: ''; position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; border-radius: 50%; background: var(--lumina-accent); box-shadow: 0 0 12px var(--lumina-accent); }
      .lmtp__center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: var(--lumina-accent); }
      .lmtp__display { text-align: center; font: 700 24px 'JetBrains Mono', monospace; color: var(--lumina-accent); margin-top: 12px; }
      @media (prefers-reduced-motion: reduce) { .lmtp__panel, .lmtp__hand { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._value = this.getAttribute('value') ?? '12:00';
    this._format = this.getAttribute('format') ?? '24h';
    this.trigger = this.$$('.lmtp__trigger');
    this.dial = this.$$('.lmtp__dial');
    this.hand = this.$$('.lmtp__hand');
    this.updateTrigger();
    this.updateHand();
    this.trigger?.addEventListener('click', () => this.toggle());
    this.trigger?.addEventListener('focus', () => this.dispatchEvent(new CustomEvent('lumina-focus', { bubbles: true, composed: true, detail: { value: this._value } })));
    this.trigger?.addEventListener('blur', () => this.dispatchEvent(new CustomEvent('lumina-blur', { bubbles: true, composed: true, detail: { value: this._value } })));
    this.dial?.addEventListener('pointerdown', this.onPointerDown);
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
    this.shadow.querySelectorAll('.lmtp__tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.editing = (tab as HTMLElement).dataset.mode as 'hour' | 'minute';
        this.shadow.querySelectorAll('.lmtp__tab').forEach((t) => t.removeAttribute('data-active'));
        (tab as HTMLElement).setAttribute('data-active', '');
        this.updateHand();
      });
    });
    document.addEventListener('click', this.onDocClick);
  }
  protected unmounted(): void { document.removeEventListener('pointermove', this.onPointerMove); document.removeEventListener('pointerup', this.onPointerUp); document.removeEventListener('click', this.onDocClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value') { this._value = value ?? '12:00'; this.updateTrigger(); this.updateHand(); }
  }
  private toggle(): void { this._open = !this._open; if (this._open) this.setAttribute('data-open',''); else this.removeAttribute('data-open'); }
  private onDocClick = (e: MouseEvent): void => { if (!this.contains(e.target as Node) && this._open) this.toggle(); };
  private updateTrigger(): void { const valEl = this.$$('.lmtp__value'); if (valEl) valEl.textContent = this._value; }
  private updateHand(): void {
    const [h, m] = this._value.split(':').map(Number);
    const angle = this.editing === 'hour' ? (h % 12) * 30 : m * 6;
    if (this.hand) this.hand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    const display = this.$$('.lmtp__display');
    if (display) display.textContent = this._value;
  }
  private onPointerDown = (e: PointerEvent): void => {
    e.preventDefault();
    this.updateFromPointer(e.clientX, e.clientY);
  };
  private onPointerMove = (e: PointerEvent): void => {
    if (!this._open) return;
    if (e.buttons === 1) this.updateFromPointer(e.clientX, e.clientY);
  };
  private onPointerUp = (): void => {};
  private updateFromPointer(cx: number, cy: number): void {
    if (!this.dial) return;
    const rect = this.dial.getBoundingClientRect();
    const x = cx - rect.left - rect.width / 2;
    const y = cy - rect.top - rect.height / 2;
    let angle = Math.atan2(x, -y) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    const [h, m] = this._value.split(':').map(Number);
    if (this.editing === 'hour') {
      const newH = Math.round(angle / 30) % 12;
      const finalH = h >= 12 ? newH + 12 : newH;
      this._value = `${String(finalH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    } else {
      const newM = Math.round(angle / 6) % 60;
      this._value = `${String(h).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
    }
    this.setAttribute('value', this._value);
    this.updateTrigger();
    this.updateHand();
    this.dispatchEvent(new CustomEvent('lumina-time-change', { bubbles: true, composed: true, detail: { value: this._value } }));
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-time-picker': TimePicker } }
if (!customElements.get(TimePicker.tagName)) customElements.define(TimePicker.tagName, TimePicker);
