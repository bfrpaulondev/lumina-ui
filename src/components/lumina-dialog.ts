/**
 * LuminaDialog — Diálogo simples focado em acessibilidade, entrada suave, foco automático, ações prim/sec.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class Dialog extends LuminaElement {
  static tagName = 'lumina-dialog';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'open', 'title', 'confirm-label', 'cancel-label']; }
  private _open = false; private _title = ''; private _confirmLabel = 'Confirmar'; private _cancelLabel = 'Cancelar';
  private prevFocus: HTMLElement | null = null;

  get open(): boolean { return this._open; }
  set open(v: boolean) { if (v) this.show(); else this.hide(); }

  protected render(): string {
    return `
      <div class="lmdg" part="backdrop" aria-hidden="true"></div>
      <div class="lmdg__dialog" part="dialog" role="dialog" aria-modal="true">
        <div class="lmdg__bg" aria-hidden="true"></div>
        <header class="lmdg__header" part="header"><slot name="title"><span class="lmdg__title"></span></slot></header>
        <div class="lmdg__body" part="body"><slot></slot></div>
        <footer class="lmdg__footer" part="footer">
          <button class="lmdg__cancel" type="button"></button>
          <button class="lmdg__confirm" type="button"></button>
        </footer>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: contents; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmdg { position: fixed; inset: 0; background: rgb(0 0 0 / 0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); opacity: 0; pointer-events: none; z-index: 999; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmdg { opacity: 1; pointer-events: auto; }
      .lmdg__dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.92); opacity: 0; pointer-events: none; z-index: 1000; min-width: 360px; max-width: 90vw; border-radius: var(--lumina-radius-lg); overflow: hidden; transition: transform calc(var(--lumina-speed) * 1.2) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmdg__dialog { transform: translate(-50%, -50%) scale(1); opacity: 1; pointer-events: auto; }
      .lmdg__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(24px) saturate(1.6); -webkit-backdrop-filter: blur(24px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 30px 80px -20px rgb(0 0 0 / 0.6); z-index: 0; }
      .lmdg__header { position: relative; z-index: 1; padding: 20px 24px 12px; font-size: 18px; font-weight: 700; }
      .lmdg__title { display: block; }
      .lmdg__body { position: relative; z-index: 1; padding: 0 24px 20px; font-size: 14px; line-height: 1.6; color: rgba(245,245,255,0.8); }
      .lmdg__footer { position: relative; z-index: 1; display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--lumina-border); }
      .lmdg__cancel, .lmdg__confirm { appearance: none; border: 1px solid var(--lumina-border); padding: 8px 20px; border-radius: var(--lumina-radius-pill); font: 600 13px var(--lumina-font-sans); cursor: pointer; transition: all var(--lumina-speed) var(--lumina-ease-out); }
      .lmdg__cancel { background: transparent; color: var(--lumina-text-muted); }
      .lmdg__cancel:hover { background: rgb(255 255 255 / 0.06); color: var(--lumina-text); }
      .lmdg__confirm { background: var(--lumina-accent); border-color: var(--lumina-accent); color: #fff; box-shadow: 0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4); }
      .lmdg__confirm:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgb(var(--lumina-accent-rgb) / 0.6); }
      .lmdg__confirm:focus-visible, .lmdg__cancel:focus-visible { outline: 2px solid var(--lumina-accent); outline-offset: 2px; }
      :host([variant="minimal"]) .lmdg__bg { backdrop-filter: none; -webkit-backdrop-filter: none; }
      @media (prefers-reduced-motion: reduce) { .lmdg, .lmdg__dialog { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._title = this.getAttribute('title') ?? '';
    this._confirmLabel = this.getAttribute('confirm-label') ?? 'Confirmar';
    this._cancelLabel = this.getAttribute('cancel-label') ?? 'Cancelar';
    this.$$('.lmdg__title')!.textContent = this._title;
    this.$$('.lmdg__confirm')!.textContent = this._confirmLabel;
    this.$$('.lmdg__cancel')!.textContent = this._cancelLabel;
    this.$$('.lmdg')!.addEventListener('click', (e) => { if (e.target === this.$$('.lmdg')) this.hide(); });
    this.$$('.lmdg__cancel')!.addEventListener('click', () => { this.dispatchEvent(new CustomEvent('lumina-cancel', { bubbles: true, composed: true })); this.hide(); });
    this.$$('.lmdg__confirm')!.addEventListener('click', () => { this.dispatchEvent(new CustomEvent('lumina-confirm', { bubbles: true, composed: true })); this.hide(); });
    document.addEventListener('keydown', this.onKeydown);
    if (this.hasAttribute('open')) requestAnimationFrame(() => this.show());
  }
  protected unmounted(): void { document.removeEventListener('keydown', this.onKeydown); document.body.style.overflow = ''; }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'open') { if (value !== null) this.show(); else this.hide(); }
    else if (name === 'title') { this._title = value ?? ''; if (this.$$('.lmdg__title')) this.$$('.lmdg__title')!.textContent = this._title; }
    else if (name === 'confirm-label') { this._confirmLabel = value ?? 'Confirmar'; if (this.$$('.lmdg__confirm')) this.$$('.lmdg__confirm')!.textContent = this._confirmLabel; }
    else if (name === 'cancel-label') { this._cancelLabel = value ?? 'Cancelar'; if (this.$$('.lmdg__cancel')) this.$$('.lmdg__cancel')!.textContent = this._cancelLabel; }
  }
  public show(): void {
    if (this._open) return; this._open = true; this.setAttribute('data-open',''); this.setAttribute('open','');
    this.prevFocus = document.activeElement as HTMLElement; document.body.style.overflow = 'hidden';
    this.dispatchEvent(new CustomEvent('lumina-open', { bubbles: true, composed: true }));
    setTimeout(() => this.shadow.querySelector<HTMLElement>('.lmdg__confirm')?.focus(), 120);
  }
  public hide(): void {
    if (!this._open) return; this._open = false; this.removeAttribute('data-open'); this.removeAttribute('open');
    document.body.style.overflow = ''; this.prevFocus?.focus();
    this.dispatchEvent(new CustomEvent('lumina-close', { bubbles: true, composed: true }));
  }
  private onKeydown = (e: KeyboardEvent): void => {
    if (!this._open) return;
    if (e.key === 'Escape') { e.preventDefault(); this.hide(); }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-dialog': Dialog } }
if (!customElements.get(Dialog.tagName)) customElements.define(Dialog.tagName, Dialog);
