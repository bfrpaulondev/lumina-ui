/**
 * LuminaConfirmationDialog — Micro-animações nos botões + "Não mostrar novamente".
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class ConfirmationDialog extends LuminaElement {
  static tagName = 'lumina-confirmation-dialog';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'open', 'title', 'message', 'confirm-label', 'cancel-label', 'destructive']; }
  private _open = false; private _title = ''; private _message = ''; private _confirmLabel = 'Confirmar'; private _cancelLabel = 'Cancelar'; private _destructive = false;
  private prevFocus: HTMLElement | null = null;

  get open(): boolean { return this._open; }
  set open(v: boolean) { if (v) this.show(); else this.hide(); }

  protected render(): string {
    return `
      <div class="lmcd" part="backdrop" aria-hidden="true"></div>
      <div class="lmcd__dialog" part="dialog" role="alertdialog" aria-modal="true">
        <div class="lmcd__bg" aria-hidden="true"></div>
        <div class="lmcd__icon" part="icon" aria-hidden="true">⚠</div>
        <h2 class="lmcd__title" part="title"></h2>
        <p class="lmcd__message" part="message"></p>
        <label class="lmcd__dont-show"><input type="checkbox" class="lmcd__checkbox" /> Não mostrar novamente</label>
        <div class="lmcd__actions" part="actions">
          <button class="lmcd__cancel" type="button"></button>
          <button class="lmcd__confirm" type="button"></button>
        </div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: contents; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmcd { position: fixed; inset: 0; background: rgb(0 0 0 / 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); opacity: 0; pointer-events: none; z-index: 999; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmcd { opacity: 1; pointer-events: auto; }
      .lmcd__dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.85); opacity: 0; pointer-events: none; z-index: 1000; min-width: 380px; max-width: 90vw; padding: 32px; border-radius: var(--lumina-radius-lg); text-align: center; transition: transform calc(var(--lumina-speed) * 1.2) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmcd__dialog { transform: translate(-50%, -50%) scale(1); opacity: 1; pointer-events: auto; }
      .lmcd__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(24px) saturate(1.6); -webkit-backdrop-filter: blur(24px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 30px 80px -20px rgb(0 0 0 / 0.6); z-index: 0; }
      .lmcd__icon { position: relative; z-index: 1; font-size: 40px; margin-bottom: 12px; color: #f59e0b; }
      :host([destructive]) .lmcd__icon { color: #ef4444; }
      .lmcd__title { position: relative; z-index: 1; margin: 0 0 8px; font-size: 20px; font-weight: 700; }
      .lmcd__message { position: relative; z-index: 1; margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: rgba(245,245,255,0.7); }
      .lmcd__dont-show { position: relative; z-index: 1; display: flex; align-items: center; gap: 8px; justify-content: center; margin-bottom: 20px; font-size: 12px; color: var(--lumina-text-muted); cursor: pointer; }
      .lmcd__checkbox { accent-color: var(--lumina-accent); }
      .lmcd__actions { position: relative; z-index: 1; display: flex; gap: 12px; justify-content: center; }
      .lmcd__cancel, .lmcd__confirm { appearance: none; border: 1px solid var(--lumina-border); padding: 10px 24px; border-radius: var(--lumina-radius-pill); font: 600 14px var(--lumina-font-sans); cursor: pointer; transition: all var(--lumina-speed) var(--lumina-ease-spring); }
      .lmcd__cancel { background: transparent; color: var(--lumina-text-muted); }
      .lmcd__cancel:hover { background: rgb(255 255 255 / 0.06); color: var(--lumina-text); transform: translateY(-1px); }
      .lmcd__confirm { background: var(--lumina-accent); border-color: var(--lumina-accent); color: #fff; box-shadow: 0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4); }
      .lmcd__confirm:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 24px rgb(var(--lumina-accent-rgb) / 0.6); }
      :host([destructive]) .lmcd__confirm { background: #ef4444; border-color: #ef4444; box-shadow: 0 4px 16px rgb(239 68 68 / 0.4); }
      :host([destructive]) .lmcd__confirm:hover { box-shadow: 0 8px 24px rgb(239 68 68 / 0.6); }
      .lmcd__confirm:active, .lmcd__cancel:active { transform: scale(0.96); }
      .lmcd__confirm:focus-visible, .lmcd__cancel:focus-visible { outline: 2px solid var(--lumina-accent); outline-offset: 2px; }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmcd, .lmcd__dialog { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._title = this.getAttribute('title') ?? 'Confirmar ação';
    this._message = this.getAttribute('message') ?? 'Tem certeza?';
    this._confirmLabel = this.getAttribute('confirm-label') ?? 'Confirmar';
    this._cancelLabel = this.getAttribute('cancel-label') ?? 'Cancelar';
    this._destructive = this.hasAttribute('destructive');
    this.updateContent();
    this.$$('.lmcd')!.addEventListener('click', (e) => { if (e.target === this.$$('.lmcd')) this.hide(); });
    this.$$('.lmcd__cancel')!.addEventListener('click', () => { this.dispatchEvent(new CustomEvent('lumina-cancel', { bubbles: true, composed: true })); this.hide(); });
    this.$$('.lmcd__confirm')!.addEventListener('click', () => {
      const dontShow = (this.$$('.lmcd__checkbox') as HTMLInputElement)?.checked ?? false;
      this.dispatchEvent(new CustomEvent('lumina-confirm', { bubbles: true, composed: true, detail: { dontShowAgain: dontShow } }));
      this.hide();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this._open) { this.dispatchEvent(new CustomEvent('lumina-cancel', { bubbles: true, composed: true })); this.hide(); } });
    if (this.hasAttribute('open')) requestAnimationFrame(() => this.show());
  }
  protected unmounted(): void { document.body.style.overflow = ''; }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'open') { if (value !== null) this.show(); else this.hide(); }
    else if (name === 'title') this._title = value ?? '';
    else if (name === 'message') this._message = value ?? '';
    else if (name === 'confirm-label') this._confirmLabel = value ?? 'Confirmar';
    else if (name === 'cancel-label') this._cancelLabel = value ?? 'Cancelar';
    else if (name === 'destructive') { this._destructive = value !== null; if (this._destructive) this.setAttribute('destructive',''); }
    this.updateContent();
  }
  private updateContent(): void {
    const t = this.$$('.lmcd__title'); if (t) t.textContent = this._title;
    const m = this.$$('.lmcd__message'); if (m) m.textContent = this._message;
    const c = this.$$('.lmcd__confirm'); if (c) c.textContent = this._confirmLabel;
    const x = this.$$('.lmcd__cancel'); if (x) x.textContent = this._cancelLabel;
  }
  public show(): void {
    if (this._open) return; this._open = true; this.setAttribute('data-open',''); this.setAttribute('open','');
    this.prevFocus = document.activeElement as HTMLElement; document.body.style.overflow = 'hidden';
    setTimeout(() => this.$$('.lmcd__confirm')?.focus(), 120);
  }
  public hide(): void {
    if (!this._open) return; this._open = false; this.removeAttribute('data-open'); this.removeAttribute('open');
    document.body.style.overflow = ''; this.prevFocus?.focus();
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-confirmation-dialog': ConfirmationDialog } }
if (!customElements.get(ConfirmationDialog.tagName)) customElements.define(ConfirmationDialog.tagName, ConfirmationDialog);
