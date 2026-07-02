/**
 * LuminaTextarea — Expansão automática, contador animado, floating label,
 * estados de erro/sucesso, eventos lumina-focus/blur/change.
 *
 * Variants: glass | neural | adaptive
 * Slots: label (for floating label), default (not used)
 * Events: lumina-change, lumina-input, lumina-focus, lumina-blur
 * States: invalid, valid, disabled, required
 *
 * Use inside lumina-form with data-validate:
 *   <lumina-textarea name="bio" data-validate="required min:10" max-length="500"></lumina-textarea>
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class Textarea extends LuminaElement {
  static tagName = 'lumina-textarea';
  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'value', 'rows', 'max-length', 'auto-grow',
      'placeholder', 'name', 'disabled', 'required', 'invalid', 'valid',
      'floating-label',
    ];
  }
  private _value = '';
  private _rows = 4;
  private _maxLength = 0;
  private _autoGrow = true;
  private _floatingLabel = false;
  private textarea: HTMLTextAreaElement | null = null;
  private counter: HTMLElement | null = null;

  get value(): string { return this._value; }
  set value(v: string) { this._value = v; this.setAttribute('value', v); if (this.textarea) this.textarea.value = v; this.updateCounter(); this.autoResize(); this._updateFloatingState(); }
  get rows(): number { return this._rows; }
  set rows(v: number) { this._rows = v; this.setAttribute('rows', String(v)); }
  get maxLength(): number { return this._maxLength; }
  set maxLength(v: number) { this._maxLength = v; this.setAttribute('max-length', String(v)); this.updateCounter(); }
  get autoGrow(): boolean { return this._autoGrow; }
  set autoGrow(v: boolean) { this._autoGrow = v; if (v) this.setAttribute('auto-grow',''); else this.removeAttribute('auto-grow'); }
  get floatingLabel(): boolean { return this._floatingLabel; }
  set floatingLabel(v: boolean) { this._floatingLabel = v; v ? this.setAttribute('floating-label','') : this.removeAttribute('floating-label'); this._updateFloatingState(); }

  protected render(): string {
    const placeholderAttr = this._floatingLabel ? '' : `placeholder="${this.getAttribute('placeholder') ?? 'Digite algo...'}"`;
    const labelSlot = this._floatingLabel ? `<slot name="label"></slot>` : '';
    return `
      <label class="lmtx${this._floatingLabel ? ' lmtx--floating' : ''}" part="field" data-lumina-root>
        ${labelSlot}
        <div class="lmtx__shell" part="control">
          <div class="lmtx__bg" part="bg" aria-hidden="true"></div>
          <div class="lmtx__glow" aria-hidden="true"></div>
          <textarea class="lmtx__el" part="input" rows="${this._rows}" ${placeholderAttr} name="${this.getAttribute('name') ?? ''}" ${this.hasAttribute('disabled') ? 'disabled' : ''} ${this.hasAttribute('required') ? 'required' : ''} aria-invalid="${this.hasAttribute('invalid')}"></textarea>
        </div>
        <div class="lmtx__footer" part="footer">
          <span class="lmtx__counter" aria-hidden="true"></span>
          <span class="lmtx__success" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,8 7,12 13,4"/></svg>
          </span>
        </div>
      </label>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmtx { display: flex; flex-direction: column; gap: 6px; }
      .lmtx__shell { position: relative; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmtx__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmtx__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); animation: lmtx-breathe 2s ease-in-out infinite; }
      @keyframes lmtx-breathe { 0%, 100% { box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 0 0 rgb(var(--lumina-accent-rgb) / 0); } 50% { box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.15); } }
      .lmtx__glow { position: absolute; inset: -2px; border-radius: inherit; pointer-events: none; opacity: 0; background: conic-gradient(from 0deg, transparent 0%, var(--lumina-accent) 25%, transparent 50%, var(--lumina-accent) 75%, transparent 100%); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 2px; animation: lmtx-spin 4s linear infinite; animation-play-state: paused; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmtx__glow { opacity: 0.6; animation-play-state: running; }
      .lmtx__el { position: relative; z-index: 1; width: 100%; min-height: calc(var(--lumina-input-h, 48px) * 2); padding: 12px 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; resize: none; line-height: 1.5; caret-color: var(--lumina-accent); transition: height 0.2s var(--lumina-ease-out); }
      .lmtx__el::placeholder { color: var(--lumina-text-muted); }
      .lmtx__footer { display: flex; justify-content: space-between; align-items: center; padding: 0 4px; }
      .lmtx__counter { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--lumina-text-muted); transition: color 0.3s; }
      .lmtx__counter[data-warning] { color: #f59e0b; }
      .lmtx__counter[data-danger] { color: #ef4444; }
      .lmtx__success { color: #22c55e; opacity: 0; transform: scale(0); transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host([valid]) .lmtx__success { opacity: 1; transform: scale(1); }
      @keyframes lmtx-spin { to { transform: rotate(360deg); } }
      :host([variant="neural"]) .lmtx__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmtx__glow, .lmtx__bg, .lmtx__success { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._value = this.getAttribute('value') ?? '';
    this._rows = parseInt(this.getAttribute('rows') ?? '4', 10) || 4;
    this._maxLength = parseInt(this.getAttribute('max-length') ?? '0', 10) || 0;
    this._autoGrow = this.getAttribute('auto-grow') !== 'false';
    this._floatingLabel = this.hasAttribute('floating-label');
    this.textarea = this.$$('.lmtx__el') as HTMLTextAreaElement | null;
    this.counter = this.$$('.lmtx__counter');
    if (this.textarea) {
      this.textarea.value = this._value;
      this.textarea.addEventListener('input', this.onInput);
      this.textarea.addEventListener('change', this.onChange);
      this.textarea.addEventListener('focus', this.onFocus);
      this.textarea.addEventListener('blur', this.onBlur);
    }
    this.updateCounter();
    this.autoResize();
    this._updateFloatingState();
  }
  protected unmounted(): void {
    this.textarea?.removeEventListener('input', this.onInput);
    this.textarea?.removeEventListener('change', this.onChange);
    this.textarea?.removeEventListener('focus', this.onFocus);
    this.textarea?.removeEventListener('blur', this.onBlur);
  }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value') { this._value = value ?? ''; if (this.textarea) this.textarea.value = this._value; this.updateCounter(); this.autoResize(); this._updateFloatingState(); }
    else if (name === 'rows') this._rows = parseInt(value ?? '4', 10) || 4;
    else if (name === 'max-length') { this._maxLength = parseInt(value ?? '0', 10) || 0; this.updateCounter(); }
    else if (name === 'auto-grow') this._autoGrow = value !== 'false';
    else if (name === 'disabled' && this.textarea) { (this.textarea as any).disabled = value !== null; }
    else if (name === 'floating-label') { this._floatingLabel = value !== null; }
  }
  private onInput = (e: Event): void => {
    this._value = (e.target as HTMLTextAreaElement).value;
    this.updateCounter();
    this.autoResize();
    this._updateFloatingState();
    this.dispatchEvent(new CustomEvent('lumina-input', { bubbles: true, composed: true, detail: { value: this._value } }));
  };
  private onChange = (): void => { this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { value: this._value } })); };
  private onFocus = (): void => { this.dispatchEvent(new CustomEvent('lumina-focus', { bubbles: true, composed: true, detail: { value: this._value } })); };
  private onBlur = (): void => { this.dispatchEvent(new CustomEvent('lumina-blur', { bubbles: true, composed: true, detail: { value: this._value } })); };
  private _updateFloatingState(): void {
    const root = this.$$('.lmtx');
    if (root) root.classList.toggle('lmtx--has-value', this._value.length > 0);
    this.toggleAttribute('data-has-value', this._value.length > 0);
  }
  private updateCounter(): void {
    if (!this.counter) return;
    const len = this._value.length;
    if (this._maxLength > 0) {
      this.counter.textContent = `${len} / ${this._maxLength}`;
      this.counter.removeAttribute('data-warning');
      this.counter.removeAttribute('data-danger');
      if (len > this._maxLength * 0.9) this.counter.setAttribute('data-warning', '');
      if (len >= this._maxLength) this.counter.setAttribute('data-danger', '');
    } else {
      this.counter.textContent = `${len} chars`;
    }
  }
  private autoResize(): void {
    if (!this._autoGrow || !this.textarea) return;
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-textarea': Textarea } }
if (!customElements.get(Textarea.tagName)) customElements.define(Textarea.tagName, Textarea);
