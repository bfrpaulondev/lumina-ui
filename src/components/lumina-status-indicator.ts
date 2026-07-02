/**
 * LuminaStatusIndicator — Animações diferentes por status + tooltip.
 * Variants: online | offline | busy | neural
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

const STATUS_COLORS: Record<string, string> = {
  online: '#22c55e', offline: '#6b7280', busy: '#ef4444', away: '#f59e0b', neural: 'var(--lumina-accent)',
};

export class StatusIndicator extends LuminaElement {
  static tagName = 'lumina-status-indicator';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'status', 'tooltip']; }
  private _status = 'online';
  private _tooltip = '';

  get status(): string { return this._status; }
  set status(v: string) { this._status = v; this.setAttribute('status', v); this.applyStatus(); }

  protected render(): string {
    return `
      <span class="lmsi" part="dot" data-status="online">
        <span class="lmsi__dot" aria-hidden="true"></span>
        <span class="lmsi__pulse" part="pulse" aria-hidden="true"></span>
        <span class="lmsi__tooltip" aria-hidden="true"></span>
        <span class="lmsi__label" part="label"><slot></slot></span>
      </span>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-flex; align-items: center; gap: 8px; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; cursor: default; }
      .lmsi { display: inline-flex; align-items: center; gap: 8px; position: relative; }
      .lmsi__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--lmsi-color, #22c55e); box-shadow: 0 0 8px var(--lmsi-color, #22c55e); flex-shrink: 0; transition: background 0.3s; }
      .lmsi__pulse { position: absolute; left: 5px; width: 10px; height: 10px; border-radius: 50%; background: var(--lmsi-color, #22c55e); transform: translateX(-50%); opacity: 0; pointer-events: none; }
      [data-status="online"] .lmsi__dot { animation: lmsi-online-pulse 2s ease-in-out infinite; }
      [data-status="online"] .lmsi__pulse { animation: lmsi-online-ring 2s ease-out infinite; }
      @keyframes lmsi-online-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      @keyframes lmsi-online-ring { 0% { transform: translateX(-50%) scale(1); opacity: 0.6; } 100% { transform: translateX(-50%) scale(3); opacity: 0; } }
      [data-status="busy"] .lmsi__dot { animation: lmsi-busy-pulse 0.6s ease-in-out infinite; }
      [data-status="busy"] .lmsi__pulse { animation: lmsi-busy-ring 0.6s ease-out infinite; }
      @keyframes lmsi-busy-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.7); } }
      @keyframes lmsi-busy-ring { 0% { transform: translateX(-50%) scale(1); opacity: 0.4; } 100% { transform: translateX(-50%) scale(2.5); opacity: 0; } }
      [data-status="offline"] .lmsi__dot { opacity: 0.4; animation: lmsi-offline-fade 3s ease-in-out infinite; }
      @keyframes lmsi-offline-fade { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.15; } }
      [data-status="away"] .lmsi__dot { animation: lmsi-away-blink 1.5s ease-in-out infinite; }
      @keyframes lmsi-away-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      .lmsi__tooltip { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); padding: 4px 10px; border-radius: 6px; background: rgb(var(--lumina-surface) / 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); color: var(--lumina-text); font-size: 11px; font-weight: 600; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 100; }
      .lmsi:hover .lmsi__tooltip { opacity: 1; }
      .lmsi__label { font-size: 13px; font-weight: 500; }
      .lmsi__label:empty { display: none; }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmsi__dot, .lmsi__pulse { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._status = this.getAttribute('status') ?? 'online';
    this._tooltip = this.getAttribute('tooltip') ?? '';
    this.applyStatus();
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'status') { this._status = value ?? 'online'; this.applyStatus(); this.dispatchEvent(new CustomEvent('lumina-status-change', { bubbles: true, composed: true, detail: { status: this._status } })); }
    else if (name === 'tooltip') { this._tooltip = value ?? ''; this.applyTooltip(); }
  }
  private applyStatus(): void {
    const el = this.$$('.lmsi');
    if (el) el.setAttribute('data-status', this._status);
    const color = STATUS_COLORS[this._status] ?? STATUS_COLORS.online;
    this.style.setProperty('--lmsi-color', color);
    this.applyTooltip();
  }
  private applyTooltip(): void {
    const tt = this.$$('.lmsi__tooltip');
    if (tt) tt.textContent = this._tooltip || this._status.charAt(0).toUpperCase() + this._status.slice(1);
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-status-indicator': StatusIndicator } }
if (!customElements.get(StatusIndicator.tagName)) customElements.define(StatusIndicator.tagName, StatusIndicator);
