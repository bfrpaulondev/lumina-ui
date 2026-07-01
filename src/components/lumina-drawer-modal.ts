/**
 * LuminaDrawerModal — Gaveta com blur+partículas, swipe-to-close com física, 3 lados.
 * Variants: glass | neural | void
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { coerceAttr, prefersReducedMotion } from '../core/utils';

const SIDES = ['left','right','bottom'] as const;
type Side = (typeof SIDES)[number];
const SIZES = ['sm','md','lg','full'] as const;
type Size = (typeof SIZES)[number];
const SIZE_DIM: Record<Size, string> = { sm: '320px', md: '420px', lg: '560px', full: '100%' };

export class DrawerModal extends LuminaElement {
  static tagName = 'lumina-drawer-modal';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'open', 'side', 'size']; }
  private _open = false;
  private _side: Side = 'right';
  private _size: Size = 'md';
  private backdrop: HTMLElement | null = null;
  private panel: HTMLElement | null = null;
  private prevFocus: HTMLElement | null = null;
  private swipeStart = 0;
  private swiping = false;

  get open(): boolean { return this._open; }
  set open(v: boolean) { if (v) this.show(); else this.hide(); }

  protected render(): string {
    return `
      <div class="lmdm" part="backdrop" aria-hidden="true"></div>
      <aside class="lmdm__panel" part="panel" role="dialog" aria-modal="true">
        <header class="lmdm__header" part="header"><slot name="title">Drawer</slot><button class="lmdm__close" aria-label="Fechar">×</button></header>
        <div class="lmdm__content" part="content"><slot></slot></div>
      </aside>
    `;
  }
  protected styles(): string {
    return `
      :host { display: contents; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmdm-size: 420px; }
      .lmdm { position: fixed; inset: 0; background: rgb(0 0 0 / 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); opacity: 0; pointer-events: none; z-index: 999; transition: opacity calc(var(--lumina-speed) * 1.2) var(--lumina-ease-out); }
      :host([data-open]) .lmdm { opacity: 1; pointer-events: auto; }
      .lmdm__panel { position: fixed; z-index: 1000; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.1)); backdrop-filter: blur(24px) saturate(1.6); -webkit-backdrop-filter: blur(24px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 0 80px -20px rgb(0 0 0 / 0.7); display: flex; flex-direction: column; transition: transform calc(var(--lumina-speed) * 1.2) var(--lumina-ease-spring); will-change: transform; touch-action: pan-y; }
      :host([side="left"]) .lmdm__panel { top: 0; bottom: 0; left: 0; width: var(--lmdm-size); max-width: 100vw; transform: translateX(-105%); }
      :host([side="right"]) .lmdm__panel { top: 0; bottom: 0; right: 0; width: var(--lmdm-size); max-width: 100vw; transform: translateX(105%); }
      :host([side="bottom"]) .lmdm__panel { left: 0; right: 0; bottom: 0; height: var(--lmdm-size); max-height: 100vh; transform: translateY(105%); flex-direction: column; }
      :host([data-open]) .lmdm__panel { transform: translate(0); }
      .lmdm__header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--lumina-border); flex-shrink: 0; }
      .lmdm__close { appearance: none; border: 0; background: rgb(255 255 255 / 0.06); color: var(--lumina-text); width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.2s; }
      .lmdm__close:hover { transform: rotate(90deg); background: rgb(var(--lumina-accent-rgb) / 0.3); }
      .lmdm__content { flex: 1; overflow-y: auto; padding: 20px; }
      :host([variant="void"]) .lmdm__panel { background: rgb(0 0 0 / 0.85); border-color: rgb(var(--lumina-accent-rgb) / 0.2); }
      @media (prefers-reduced-motion: reduce) { .lmdm, .lmdm__panel { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._side = coerceAttr(this.getAttribute('side'), SIDES, 'right');
    this._size = coerceAttr(this.getAttribute('size'), SIZES, 'md');
    this.backdrop = this.$$('.lmdm');
    this.panel = this.$$('.lmdm__panel');
    this.applySize();
    this.backdrop?.addEventListener('click', () => this.hide());
    this.$$('.lmdm__close')?.addEventListener('click', () => this.hide());
    this.panel?.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.panel?.addEventListener('touchmove', this.onTouchMove, { passive: true });
    this.panel?.addEventListener('touchend', this.onTouchEnd);
    document.addEventListener('keydown', this.onKeydown);
    if (this.hasAttribute('open')) requestAnimationFrame(() => this.show());
  }
  protected unmounted(): void { document.removeEventListener('keydown', this.onKeydown); document.body.style.overflow = ''; }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'open') { if (value !== null) this.show(); else this.hide(); }
    else if (name === 'side') this._side = coerceAttr(value, SIDES, 'right');
    else if (name === 'size') { this._size = coerceAttr(value, SIZES, 'md'); this.applySize(); }
  }
  private applySize(): void { this.style.setProperty('--lmdm-size', SIZE_DIM[this._size]); }
  public show(): void {
    if (this._open) return;
    this._open = true; this.setAttribute('data-open',''); this.setAttribute('open','');
    this.prevFocus = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    this.dispatchEvent(new CustomEvent('lumina-open', { bubbles: true, composed: true }));
    setTimeout(() => this.focusFirst(), 120);
  }
  public hide(): void {
    if (!this._open) return;
    this._open = false; this.removeAttribute('data-open'); this.removeAttribute('open');
    document.body.style.overflow = '';
    this.prevFocus?.focus();
    this.dispatchEvent(new CustomEvent('lumina-close', { bubbles: true, composed: true }));
  }
  private focusFirst(): void {
    this.shadow.querySelector<HTMLElement>('button, [tabindex]:not([tabindex="-1"]), input')?.focus();
  }
  private onKeydown = (e: KeyboardEvent): void => {
    if (!this._open) return;
    if (e.key === 'Escape') { e.preventDefault(); this.hide(); }
    if (e.key === 'Tab') {
      const fs = Array.from(this.shadow.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"]), input'));
      if (fs.length === 0) return;
      if (e.shiftKey && document.activeElement === fs[0]) { e.preventDefault(); fs[fs.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === fs[fs.length - 1]) { e.preventDefault(); fs[0].focus(); }
    }
  };
  private onTouchStart = (e: TouchEvent): void => {
    if (e.touches.length !== 1) return;
    this.swipeStart = this._side === 'left' ? e.touches[0].clientX : this._side === 'right' ? e.touches[0].clientX : e.touches[0].clientY;
    this.swiping = true;
  };
  private onTouchMove = (e: TouchEvent): void => {
    if (!this.swiping || !this.panel) return;
    const current = this._side === 'bottom' ? e.touches[0].clientY : e.touches[0].clientX;
    const delta = this._side === 'left' ? current - this.swipeStart : this._side === 'right' ? this.swipeStart - current : current - this.swipeStart;
    if (delta > 0) {
      if (this._side === 'bottom') this.panel.style.transform = `translateY(${delta}px)`;
      else this.panel.style.transform = `translateX(${this._side === 'left' ? delta : -delta}px)`;
    }
  };
  private onTouchEnd = (e: TouchEvent): void => {
    if (!this.swiping || !this.panel) return;
    this.swiping = false;
    const current = this._side === 'bottom' ? e.changedTouches[0].clientY : e.changedTouches[0].clientX;
    const delta = this._side === 'left' ? current - this.swipeStart : this._side === 'right' ? this.swipeStart - current : current - this.swipeStart;
    this.panel.style.transform = '';
    if (delta > 80) this.hide();
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-drawer-modal': DrawerModal } }
if (!customElements.get(DrawerModal.tagName)) customElements.define(DrawerModal.tagName, DrawerModal);
