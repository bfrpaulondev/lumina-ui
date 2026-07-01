/**
 * LuminaPopover — Flip automático, rich content, fecha on scroll/click outside.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

const PLACEMENTS = ['top','bottom','left','right'] as const;
type Placement = (typeof PLACEMENTS)[number];

export class Popover extends LuminaElement {
  static tagName = 'lumina-popover';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'placement', 'interactive']; }
  private _placement: Placement = 'top'; private _interactive = false; private _open = false;
  private pop: HTMLElement | null = null;

  get open(): boolean { return this._open; }
  protected render(): string {
    return `<span class="lmpo" part="popover"><slot></slot><div class="lmpo__pop" part="content" role="popover" aria-hidden="true"><span class="lmpo__arrow" part="arrow" aria-hidden="true"></span><slot name="content"></slot></div></span>`;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; position: relative; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmpo { display: inline-block; position: relative; }
      .lmpo__pop { position: absolute; z-index: 1000; min-width: 200px; max-width: 320px; padding: 14px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); opacity: 0; transform: scale(0.92); pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); }
      .lmpo__pop[data-open] { opacity: 1; transform: scale(1); pointer-events: auto; }
      .lmpo__pop[data-placement="top"] { bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%) scale(0.92); transform-origin: bottom center; }
      .lmpo__pop[data-placement="top"][data-open] { transform: translateX(-50%) scale(1); }
      .lmpo__pop[data-placement="bottom"] { top: calc(100% + 10px); left: 50%; transform: translateX(-50%) scale(0.92); transform-origin: top center; }
      .lmpo__pop[data-placement="bottom"][data-open] { transform: translateX(-50%) scale(1); }
      .lmpo__pop[data-placement="left"] { right: calc(100% + 10px); top: 50%; transform: translateY(-50%) scale(0.92); transform-origin: right center; }
      .lmpo__pop[data-placement="left"][data-open] { transform: translateY(-50%) scale(1); }
      .lmpo__pop[data-placement="right"] { left: calc(100% + 10px); top: 50%; transform: translateY(-50%) scale(0.92); transform-origin: left center; }
      .lmpo__pop[data-placement="right"][data-open] { transform: translateY(-50%) scale(1); }
      .lmpo__arrow { position: absolute; width: 10px; height: 10px; background: inherit; border: inherit; transform: rotate(45deg); z-index: -1; }
      .lmpo__pop[data-placement="top"] .lmpo__arrow { bottom: -5px; left: 50%; margin-left: -5px; border-top: none; border-left: none; }
      .lmpo__pop[data-placement="bottom"] .lmpo__arrow { top: -5px; left: 50%; margin-left: -5px; border-bottom: none; border-right: none; }
      .lmpo__pop[data-placement="left"] .lmpo__arrow { right: -5px; top: 50%; margin-top: -5px; border-left: none; border-bottom: none; }
      .lmpo__pop[data-placement="right"] .lmpo__arrow { left: -5px; top: 50%; margin-top: -5px; border-right: none; border-top: none; }
      ::slotted([slot="content"]) { font-size: 13px; line-height: 1.5; }
      @media (prefers-reduced-motion: reduce) { .lmpo__pop { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._placement = (this.getAttribute('placement') as Placement) ?? 'top';
    this._interactive = this.hasAttribute('interactive');
    this.pop = this.$$('.lmpo__pop');
    this.pop?.setAttribute('data-placement', this._placement);
    this.addEventListener('click', this.onClick);
    document.addEventListener('click', this.onDocClick);
    document.addEventListener('scroll', this.onScroll, true);
  }
  protected unmounted(): void { document.removeEventListener('click', this.onDocClick); document.removeEventListener('scroll', this.onScroll, true); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'placement') { this._placement = (value as Placement) ?? 'top'; this.pop?.setAttribute('data-placement', this._placement); }
    else if (name === 'interactive') this._interactive = value !== null;
  }
  private onClick = (e: MouseEvent): void => { e.stopPropagation(); if (this._open) this.hide(); else this.show(); };
  private onDocClick = (e: MouseEvent): void => { if (!this.contains(e.target as Node) && this._open) this.hide(); };
  private onScroll = (): void => { if (this._open && !this._interactive) this.hide(); else this.reposition(); };
  public show(): void {
    if (this._open) return; this._open = true; this.pop?.setAttribute('data-open',''); this.pop?.setAttribute('aria-hidden','false');
    this.reposition();
    this.dispatchEvent(new CustomEvent('lumina-show', { bubbles: true, composed: true }));
  }
  public hide(): void {
    if (!this._open) return; this._open = false; this.pop?.removeAttribute('data-open'); this.pop?.setAttribute('aria-hidden','true');
    this.dispatchEvent(new CustomEvent('lumina-hide', { bubbles: true, composed: true }));
  }
  private reposition(): void {
    if (!this.pop) return;
    const rect = this.pop.getBoundingClientRect();
    if (this._placement === 'top' && rect.top < 8) { this.pop.setAttribute('data-placement','bottom'); this._placement = 'bottom'; }
    else if (this._placement === 'bottom' && rect.bottom + 8 > window.innerHeight) { this.pop.setAttribute('data-placement','top'); this._placement = 'top'; }
    else if (this._placement === 'left' && rect.left < 8) { this.pop.setAttribute('data-placement','right'); this._placement = 'right'; }
    else if (this._placement === 'right' && rect.right + 8 > window.innerWidth) { this.pop.setAttribute('data-placement','left'); this._placement = 'left'; }
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-popover': Popover } }
if (!customElements.get(Popover.tagName)) customElements.define(Popover.tagName, Popover);
