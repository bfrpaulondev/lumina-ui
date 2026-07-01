/**
 * LuminaNotificationBadge — Contador pop animado, 99+ especial, glow pulsante, clear.
 * Variants: glass | neural | aura
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class NotificationBadge extends LuminaElement {
  static tagName = 'lumina-notification-badge';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'count']; }
  private _count = 0;
  private _prevCount = 0;
  private badge: HTMLElement | null = null;
  private countEl: HTMLElement | null = null;

  get count(): number { return this._count; }
  set count(v: number) {
    this._prevCount = this._count;
    this._count = Math.max(0, v);
    this.setAttribute('count', String(this._count));
    this.updateDisplay();
    if (this._count > this._prevCount) this.popAnimation();
  }

  protected render(): string {
    return `
      <span class="lmnb" part="badge">
        <slot></slot>
        <span class="lmnb__badge" aria-hidden="true">
          <span class="lmnb__count" part="count">0</span>
        </span>
      </span>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-flex; position: relative; font-family: var(--lumina-font-sans); color: var(--lumina-text); cursor: pointer; }
      .lmnb { display: inline-flex; position: relative; }
      .lmnb__badge {
        position: absolute; top: -6px; right: -6px; min-width: 18px; height: 18px;
        padding: 0 5px; border-radius: 999px;
        background: #ff5577; color: #fff;
        font: 700 10px 'JetBrains Mono', monospace;
        display: inline-flex; align-items: center; justify-content: center;
        box-shadow: 0 0 0 2px var(--lumina-bg, #06060c), 0 0 8px rgb(255 85 119 / 0.6);
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
        z-index: 1;
      }
      .lmnb__badge[data-hidden] { transform: scale(0); opacity: 0; }
      .lmnb__badge[data-pulse] { animation: lmnb-pulse 1s ease-in-out infinite; }
      @keyframes lmnb-pulse { 0%, 100% { box-shadow: 0 0 0 2px var(--lumina-bg, #06060c), 0 0 8px rgb(255 85 119 / 0.6); } 50% { box-shadow: 0 0 0 2px var(--lumina-bg, #06060c), 0 0 16px rgb(255 85 119 / 1); } }
      .lmnb__badge[data-pop] { animation: lmnb-pop 0.4s var(--lumina-ease-spring); }
      @keyframes lmnb-pop { 0% { transform: scale(1); } 50% { transform: scale(1.5); } 100% { transform: scale(1); } }
      .lmnb__count { line-height: 1; }
      :host([variant="neural"]) .lmnb__badge { background: var(--lumina-accent); box-shadow: 0 0 0 2px var(--lumina-bg, #06060c), 0 0 12px rgb(var(--lumina-accent-rgb) / 0.7); }
      :host([variant="aura"]) .lmnb__badge { background: #ffd166; color: #1a1a2e; box-shadow: 0 0 0 2px var(--lumina-bg, #06060c), 0 0 12px rgb(255 209 102 / 0.7); }
      @media (prefers-reduced-motion: reduce) { .lmnb__badge { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._count = parseInt(this.getAttribute('count') ?? '0', 10) || 0;
    this.badge = this.$$('.lmnb__badge');
    this.countEl = this.$$('.lmnb__count');
    this.updateDisplay();
    this.addEventListener('click', this.onClick);
  }
  protected unmounted(): void { this.removeEventListener('click', this.onClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'count') { this._prevCount = this._count; this._count = parseInt(value ?? '0', 10) || 0; this.updateDisplay(); if (this._count > this._prevCount) this.popAnimation(); }
  }
  private updateDisplay(): void {
    if (!this.countEl || !this.badge) return;
    const display = this._count > 99 ? '99+' : String(this._count);
    this.countEl.textContent = display;
    if (this._count === 0) this.badge.setAttribute('data-hidden', '');
    else this.badge.removeAttribute('data-hidden');
    if (this._count > 0) this.badge.setAttribute('data-pulse', '');
    else this.badge.removeAttribute('data-pulse');
  }
  private popAnimation(): void {
    if (!this.badge) return;
    this.badge.setAttribute('data-pop', '');
    setTimeout(() => this.badge?.removeAttribute('data-pop'), 400);
  }
  private onClick = (): void => {
    this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true, detail: { count: this._count } }));
    // Clear on click
    if (this._count > 0) {
      this._prevCount = this._count;
      this._count = 0;
      this.setAttribute('count', '0');
      this.updateDisplay();
      this.dispatchEvent(new CustomEvent('lumina-clear', { bubbles: true, composed: true }));
    }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-notification-badge': NotificationBadge } }
if (!customElements.get(NotificationBadge.tagName)) customElements.define(NotificationBadge.tagName, NotificationBadge);
