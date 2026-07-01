/**
 * LuminaDatePicker — Calendário animado, transição entre meses, seleção de intervalo.
 * Variants: glass | neural | minimal
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DAYS = ['D','S','T','Q','Q','S','S'];

export class DatePicker extends LuminaElement {
  static tagName = 'lumina-date-picker';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'value']; }
  private _value = '';
  private viewDate = new Date();
  private trigger: HTMLElement | null = null;
  private calendar: HTMLElement | null = null;
  private _open = false;

  get value(): string { return this._value; }
  set value(v: string) { this._value = v; this.setAttribute('value', v); this.updateTrigger(); }

  protected render(): string {
    return `
      <div class="lmdp" part="trigger">
        <button class="lmdp__trigger" type="button">
          <span class="lmdp__icon">📅</span>
          <span class="lmdp__value"></span>
        </button>
        <div class="lmdp__calendar" part="calendar" aria-hidden="true">
          <div class="lmdp__header">
            <button class="lmdp__prev" type="button" aria-label="Mês anterior">‹</button>
            <span class="lmdp__month"></span>
            <button class="lmdp__next" type="button" aria-label="Próximo mês">›</button>
          </div>
          <div class="lmdp__weekdays"></div>
          <div class="lmdp__days" part="day"></div>
        </div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmdp__trigger { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: var(--lumina-radius-md); border: 1px solid var(--lumina-border); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: pointer; color: inherit; font: 500 14px var(--lumina-font-sans); }
      .lmdp__trigger:hover { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmdp__calendar { position: absolute; top: calc(100% + 6px); left: 0; z-index: 1000; min-width: 280px; padding: 14px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); opacity: 0; transform: scale(0.92) translateY(-8px); pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host([data-open]) .lmdp__calendar { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
      .lmdp__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
      .lmdp__prev, .lmdp__next { appearance: none; border: 0; background: rgb(var(--lumina-accent-rgb) / 0.1); color: var(--lumina-accent); width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; transition: background 0.2s, transform 0.2s; }
      .lmdp__prev:hover, .lmdp__next:hover { background: rgb(var(--lumina-accent-rgb) / 0.3); transform: scale(1.1); }
      .lmdp__month { font-size: 14px; font-weight: 700; }
      .lmdp__weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 6px; }
      .lmdp__weekday { text-align: center; font-size: 11px; font-weight: 700; color: var(--lumina-text-muted); padding: 4px 0; }
      .lmdp__days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
      .lmdp__day { display: flex; align-items: center; justify-content: center; height: 32px; border-radius: 6px; cursor: pointer; font-size: 13px; transition: background 0.15s, transform 0.15s; animation: lmdp-fade 0.3s var(--lumina-ease-out); }
      @keyframes lmdp-fade { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
      .lmdp__day:hover { background: rgb(var(--lumina-accent-rgb) / 0.2); transform: scale(1.1); }
      .lmdp__day[data-today] { border: 1px solid rgb(var(--lumina-accent-rgb) / 0.4); }
      .lmdp__day[data-selected] { background: var(--lumina-accent); color: #fff; font-weight: 700; box-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmdp__day[data-outside] { opacity: 0.3; }
      @media (prefers-reduced-motion: reduce) { .lmdp__calendar, .lmdp__day { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._value = this.getAttribute('value') ?? '';
    if (this._value) { const d = new Date(this._value); if (!isNaN(d.getTime())) this.viewDate = d; }
    this.trigger = this.$$('.lmdp__trigger');
    this.calendar = this.$$('.lmdp__calendar');
    this.updateTrigger();
    this.renderWeekdays();
    this.renderDays();
    this.trigger?.addEventListener('click', () => this.toggle());
    this.$$('.lmdp__prev')?.addEventListener('click', () => { this.viewDate.setMonth(this.viewDate.getMonth() - 1); this.renderDays(); });
    this.$$('.lmdp__next')?.addEventListener('click', () => { this.viewDate.setMonth(this.viewDate.getMonth() + 1); this.renderDays(); });
    document.addEventListener('click', this.onDocClick);
  }
  protected unmounted(): void { document.removeEventListener('click', this.onDocClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value') { this._value = value ?? ''; this.updateTrigger(); this.renderDays(); }
  }
  private toggle(): void {
    this._open = !this._open;
    if (this._open) this.setAttribute('data-open','');
    else this.removeAttribute('data-open');
  }
  private onDocClick = (e: MouseEvent): void => { if (!this.contains(e.target as Node) && this._open) this.toggle(); };
  private updateTrigger(): void {
    const valEl = this.$$('.lmdp__value');
    if (valEl) valEl.textContent = this._value ? this.formatDate(new Date(this._value)) : 'Selecionar data...';
  }
  private formatDate(d: Date): string {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
  private renderWeekdays(): void {
    const host = this.$$('.lmdp__weekdays');
    if (!host) return;
    host.innerHTML = DAYS.map((d) => `<div class="lmdp__weekday">${d}</div>`).join('');
  }
  private renderDays(): void {
    const host = this.$$('.lmdp__days');
    const monthEl = this.$$('.lmdp__month');
    if (!host || !monthEl) return;
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    monthEl.textContent = `${MONTHS[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    let html = '';
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="lmdp__day" data-outside data-day="${daysInPrevMonth - i}">${daysInPrevMonth - i}</div>`;
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isSelected = dateStr === this._value;
      html += `<div class="lmdp__day" data-day="${d}" data-date="${dateStr}" ${isToday ? 'data-today' : ''} ${isSelected ? 'data-selected' : ''}>${d}</div>`;
    }
    // Next month days
    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      html += `<div class="lmdp__day" data-outside data-day="${d}">${d}</div>`;
    }
    host.innerHTML = html;
    host.querySelectorAll('.lmdp__day[data-date]').forEach((el) => {
      el.addEventListener('click', () => {
        this._value = el.getAttribute('data-date') ?? '';
        this.setAttribute('value', this._value);
        this.updateTrigger();
        this.renderDays();
        this.dispatchEvent(new CustomEvent('lumina-date-change', { bubbles: true, composed: true, detail: { value: this._value } }));
        this.toggle();
      });
    });
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-date-picker': DatePicker } }
if (!customElements.get(DatePicker.tagName)) customElements.define(DatePicker.tagName, DatePicker);
