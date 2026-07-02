/**
 * LuminaMaskedInput — Text field with mask formatting.
 *
 * Features:
 *  - Mask syntax via `mask` attribute (e.g. "###.###.###-##" for CPF)
 *  - Clean (unmasked) value via the `value` property — what you'd send to a server
 *  - Formatted value via `formattedValue` property — what the user sees
 *  - Custom `formatter` and `parser` callbacks for non-mask use cases
 *    (e.g. big numbers with thousands separators, currency)
 *  - Works alongside the validation system (set `invalid` to trigger error UI)
 *  - Smooth error + success micro-interactions
 *  - Respects `prefers-reduced-motion`
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import {
  applyMask,
  compileMask,
  type FormatterParser,
  type MaskToken,
  nextInputIndex,
} from '../core/mask';

export class MaskedInput extends LuminaElement {
  static tagName = 'lumina-masked-input';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'mask',
      'placeholder',
      'value',
      'name',
      'disabled',
      'required',
      'invalid',
      'valid',
      'type',
    ];
  }

  private input: HTMLInputElement | null = null;
  private tokens: MaskToken[] = [];
  private _mask = '';
  private _cleanValue = '';
  private _formatter: FormatterParser | null = null;

  /** The clean (unmasked) value — what you'd send to a server. */
  get value(): string {
    return this._cleanValue;
  }
  set value(v: string) {
    this._setCleanValue(v);
  }

  /** The formatted value — what the user sees in the input. */
  get formattedValue(): string {
    return this.input?.value ?? '';
  }
  set formattedValue(v: string) {
    if (this.input) this.input.value = v;
  }

  /** The mask string (e.g. "###.###.###-##"). */
  get mask(): string {
    return this._mask;
  }
  set mask(v: string) {
    this._mask = v;
    this.setAttribute('mask', v);
    this.tokens = v ? compileMask(v) : [];
    this._refreshFromInput();
  }

  /** Optional custom formatter/parser (overrides mask). */
  get formatter(): FormatterParser | null {
    return this._formatter;
  }
  set formatter(fp: FormatterParser | null) {
    this._formatter = fp;
    this._refreshFromInput();
  }

  /** Set value programmatically from a clean (unmasked) string. */
  public setCleanValue(clean: string): void {
    this._setCleanValue(clean);
  }

  /** Get the current clean value (alias for `value`). */
  public getCleanValue(): string {
    return this._cleanValue;
  }

  protected render(): string {
    return `
      <label class="lmf" part="field">
        <span class="lmf__label" part="label"><slot name="label"></slot></span>
        <span class="lmf__shell" part="control">
          <span class="lmf__bg" aria-hidden="true"></span>
          <span class="lmf__bar" aria-hidden="true"></span>
          <span class="lmf__icon" part="icon"><slot name="left-icon"></slot></span>
          <input
            class="lmf__el"
            part="input"
            type="${this.getAttribute('type') ?? 'text'}"
            placeholder="${this.getAttribute('placeholder') ?? ''}"
            name="${this.getAttribute('name') ?? ''}"
            ${this.hasAttribute('disabled') ? 'disabled' : ''}
            ${this.hasAttribute('required') ? 'required' : ''}
            aria-invalid="${this.hasAttribute('invalid')}"
          />
          <span class="lmf__status" part="status" aria-hidden="true"></span>
          <span class="lmf__success" part="success" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,8 7,12 13,4"/></svg>
          </span>
          <span class="lmf__error" part="error"><slot name="error"></slot></span>
        </span>
      </label>
    `;
  }

  protected styles(): string {
    return `
      :host { display: block; --lmf-h: 48px; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmf { display: flex; flex-direction: column; gap: 6px; cursor: text; }
      .lmf__label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lumina-text-muted); }
      .lmf__label:empty { display: none; }
      .lmf__shell { position: relative; display: flex; align-items: center; height: var(--lmf-h); border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmf__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out), box-shadow var(--lumina-speed) var(--lumina-ease-out); }
      .lmf__bar { position: absolute; left: 50%; bottom: 0; width: 0; height: 2px; background: var(--lumina-accent); box-shadow: 0 0 8px var(--lumina-accent); transform: translateX(-50%); transition: width var(--lumina-speed) var(--lumina-ease-spring); z-index: 4; }
      .lmf__icon { display: flex; align-items: center; padding: 0 10px 0 14px; color: var(--lumina-text-muted); font-size: 14px; z-index: 3; }
      .lmf__icon:empty { display: none; }
      .lmf__el { position: relative; z-index: 3; flex: 1; height: 100%; padding: 0 14px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); }
      .lmf__el::placeholder { color: var(--lumina-text-muted); }
      .lmf__status { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; border-radius: 50%; opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); z-index: 4; }
      .lmf__success { position: absolute; right: 12px; top: 50%; transform: translateY(-50%) scale(0); color: #22c55e; opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); z-index: 4; display: flex; align-items: center; justify-content: center; }
      .lmf__error { position: absolute; left: 0; top: calc(100% + 4px); font-size: 11px; color: rgb(255 90 110); opacity: 0; transform: translateY(-4px); transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-out); pointer-events: none; }
      .lmf__error:empty { display: none; }

      :host(:focus-within) .lmf__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); box-shadow: 0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.12); }
      :host(:focus-within) .lmf__bar { width: 70%; }

      /* Invalid state — smooth transition, not abrupt */
      :host([invalid]) .lmf__bg { border-color: rgb(255 70 90 / 0.6); box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10); }
      :host([invalid]) .lmf__bar { background: rgb(255 70 90); width: 100%; }
      :host([invalid]) .lmf__status { background: rgb(255 70 90); opacity: 1; }
      :host([invalid]) .lmf__shell { animation: lmf-shake 0.4s var(--lumina-ease-spring); }
      :host([invalid]) .lmf__error { opacity: 1; transform: translateY(0); }

      /* Valid (success) state — subtle green glow + checkmark */
      :host([valid]) .lmf__bg { border-color: rgb(34 197 94 / 0.5); }
      :host([valid]) .lmf__bar { background: #22c55e; width: 100%; }
      :host([valid]) .lmf__success { opacity: 1; transform: translateY(-50%) scale(1); }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; }

      @keyframes lmf-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
      @media (prefers-reduced-motion: reduce) {
        .lmf__bg, .lmf__bar, .lmf__status, .lmf__success, .lmf__error { transition: none !important; animation: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.input = this.$$('.lmf__el') as HTMLInputElement | null;
    this._mask = this.getAttribute('mask') ?? '';
    this.tokens = this._mask ? compileMask(this._mask) : [];
    const initial = this.getAttribute('value');
    if (initial !== null) this._setCleanValue(initial, false);
    this.input?.addEventListener('input', this.onInput);
    this.input?.addEventListener('keydown', this.onKeydown);
    this.input?.addEventListener('focus', this.onFocus);
    this.input?.addEventListener('blur', this.onBlur);
  }

  protected unmounted(): void {
    this.input?.removeEventListener('input', this.onInput);
    this.input?.removeEventListener('keydown', this.onKeydown);
    this.input?.removeEventListener('focus', this.onFocus);
    this.input?.removeEventListener('blur', this.onBlur);
  }

  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'mask' && value !== null) {
      this.tokens = compileMask(value);
      this._refreshFromInput();
    } else if (name === 'value' && value !== null) {
      this._setCleanValue(value, false);
    }
  }

  private onInput = (e: Event): void => {
    if (!this.input) return;
    const inputEvent = e as InputEvent;
    // Use the inputType to detect backspace
    const isBackspace = inputEvent.inputType === 'deleteContentBackward';
    const raw = this.input.value;
    if (this._formatter) {
      // Custom formatter path
      const formatted = this._formatter.format(raw);
      const clean = this._formatter.parse(raw);
      this.input.value = formatted;
      this._cleanValue = clean;
      this._emitChange(clean, formatted);
      return;
    }
    if (this.tokens.length === 0) {
      this._cleanValue = raw;
      this._emitChange(raw, raw);
      return;
    }
    // Mask path
    const result = applyMask(raw, this.tokens);
    this.input.value = result.formatted;
    this._cleanValue = result.clean;
    // Place cursor at the next input slot after the last typed char
    const cursor = isBackspace ? this.input.selectionStart ?? 0 : result.cursor;
    this.input.setSelectionRange(cursor, cursor);
    this._emitChange(result.clean, result.formatted);
  };

  private onKeydown = (e: KeyboardEvent): void => {
    if (!this.input || this.tokens.length === 0) return;
    // Skip mask handling for non-printable keys
    if (e.key === 'Backspace' || e.key === 'Delete') {
      // Allow default — onInput will re-mask
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length !== 1) return; // ignore Enter, Tab, etc.
    // Find the next input slot at or after cursor
    const cursorPos = this.input.selectionStart ?? 0;
    const tokIdx = this._tokenIndexAt(cursorPos);
    if (tokIdx < 0) return;
    const nextIdx = nextInputIndex(this.tokens, tokIdx);
    if (nextIdx < 0) {
      e.preventDefault();
      return;
    }
    const tok = this.tokens[nextIdx];
    if (!tok.test!(e.key)) {
      e.preventDefault();
      return;
    }
    // Position cursor right after this slot's char so applyMask picks it up
    // (we let the default insertion happen, then onInput re-masks)
  };

  private onFocus = (): void => {
    this.dispatchEvent(new CustomEvent('lumina-focus', { bubbles: true, composed: true, detail: {} }));
  };

  private onBlur = (): void => {
    this.dispatchEvent(new CustomEvent('lumina-blur', { bubbles: true, composed: true, detail: { value: this._cleanValue } }));
  };

  private _tokenIndexAt(cursorPos: number): number {
    // Map a cursor position in the formatted string to a token index.
    let charIdx = 0;
    for (let i = 0; i < this.tokens.length; i++) {
      if (charIdx >= cursorPos) return i;
      charIdx += 1;
    }
    return this.tokens.length;
  }

  private _setCleanValue(clean: string, emit = true): void {
    this._cleanValue = clean;
    if (this.input) {
      if (this._formatter) {
        this.input.value = this._formatter.format(clean);
      } else if (this.tokens.length > 0) {
        this.input.value = applyMask(clean, this.tokens).formatted;
      } else {
        this.input.value = clean;
      }
    }
    this.setAttribute('value', clean);
    if (emit) this._emitChange(clean, this.formattedValue);
  }

  private _refreshFromInput(): void {
    if (!this.input) return;
    const raw = this.input.value;
    if (this._formatter) {
      this._cleanValue = this._formatter.parse(raw);
    } else if (this.tokens.length > 0) {
      this._cleanValue = applyMask(raw, this.tokens).clean;
    } else {
      this._cleanValue = raw;
    }
  }

  private _emitChange(clean: string, formatted: string): void {
    this.dispatchEvent(
      new CustomEvent('lumina-change', {
        bubbles: true,
        composed: true,
        detail: { value: clean, formattedValue: formatted },
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-masked-input': MaskedInput;
  }
}

if (!customElements.get(MaskedInput.tagName)) {
  customElements.define(MaskedInput.tagName, MaskedInput);
}
