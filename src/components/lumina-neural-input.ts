/**
 * LuminaNeuralInput — Reage ao tom emocional do texto + floating label + estados.
 *
 * Variants: neural | echo | adaptive
 * Slots: label (for floating label)
 * Events: lumina-input, lumina-change, lumina-focus, lumina-blur, lumina-sentiment-change
 * States: invalid, valid, disabled, required
 * Attributes: name, value, placeholder, floating-label
 *
 * Use inside lumina-form with data-validate:
 *   <lumina-neural-input name="feedback" data-validate="required min:10" placeholder="Digite seu feedback"></lumina-neural-input>
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

const POSITIVE = ['bom','ótimo','excelente','feliz','amor','perfeito','incrível','sucesso','ganhar','vitória','❤','👍','😊','🎉','✨','💪','🚀','💯'];
const NEGATIVE = ['ruim','péssimo','triste','ódio','erro','falha','perder','problema','droga','👎','😢','💀','🔥','⚠','💔','😡'];
const SENTIMENT_COLORS: Record<string, { color: string; glow: string }> = {
  positive: { color: '#22c55e', glow: '34 197 94' },
  negative: { color: '#ef4444', glow: '239 68 68' },
  neutral: { color: 'var(--lumina-accent)', glow: 'var(--lumina-accent-rgb)' },
};

export class NeuralInput extends LuminaElement {
  static tagName = 'lumina-neural-input';
  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'value', 'placeholder', 'name', 'disabled', 'required', 'invalid', 'valid',
      'floating-label',
    ];
  }
  private input: HTMLInputElement | null = null;
  private reactionEl: HTMLElement | null = null;
  private currentSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  private _floatingLabel = false;

  get value(): string { return this.input?.value ?? ''; }
  set value(v: string) { if (this.input) this.input.value = v; this.setAttribute('value', v); this._updateFloatingState(); }
  get floatingLabel(): boolean { return this._floatingLabel; }
  set floatingLabel(v: boolean) { this._floatingLabel = v; v ? this.setAttribute('floating-label','') : this.removeAttribute('floating-label'); this._updateFloatingState(); }

  protected render(): string {
    const placeholderAttr = this._floatingLabel ? '' : `placeholder="${this.getAttribute('placeholder') ?? 'Digite algo...'}"`;
    const labelSlot = this._floatingLabel ? `<slot name="label"></slot>` : '';
    return `
      <label class="lmni" part="field" data-lumina-root>
        ${labelSlot}
        <div class="lmni__shell" part="control">
          <div class="lmni__bg" part="bg" aria-hidden="true"></div>
          <div class="lmni__glow" aria-hidden="true"></div>
          <input class="lmni__el" part="input" type="text" ${placeholderAttr} name="${this.getAttribute('name') ?? ''}" value="${this.getAttribute('value') ?? ''}" ${this.hasAttribute('disabled') ? 'disabled' : ''} ${this.hasAttribute('required') ? 'required' : ''} aria-invalid="${this.hasAttribute('invalid')}" />
          <span class="lmni__reaction" part="reaction" aria-hidden="true"></span>
        </div>
      </label>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmni-color: var(--lumina-accent); --lmni-glow: var(--lumina-accent-rgb); }
      .lmni__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmni__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color 0.3s var(--lumina-ease-out); }
      :host(:focus-within) .lmni__bg { border-color: var(--lmni-color); }
      .lmni__glow { position: absolute; inset: -2px; border-radius: inherit; pointer-events: none; opacity: 0; background: conic-gradient(from 0deg, transparent 0%, var(--lmni-color) 25%, transparent 50%, var(--lmni-color) 75%, transparent 100%); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 2px; animation: lmni-spin 4s linear infinite; animation-play-state: paused; transition: opacity 0.3s; }
      :host(:focus-within) .lmni__glow { opacity: 0.6; animation-play-state: running; }
      .lmni__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lmni-color); transition: caret-color 0.3s; }
      .lmni__el::placeholder { color: var(--lumina-text-muted); }
      .lmni__reaction { position: relative; z-index: 1; margin-right: 12px; font-size: 18px; opacity: 0; transform: scale(0); transition: opacity 0.3s, transform 0.3s var(--lumina-ease-spring); }
      .lmni__reaction[data-show] { opacity: 1; transform: scale(1); }
      @keyframes lmni-spin { to { transform: rotate(360deg); } }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmni__glow { animation: none !important; } .lmni__reaction { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this.input = this.$$('.lmni__el') as HTMLInputElement | null;
    this.reactionEl = this.$$('.lmni__reaction');
    this.input?.addEventListener('input', this.onInput);
    this.input?.addEventListener('focus', this.onFocus);
    this.input?.addEventListener('blur', this.onBlur);
    this._updateFloatingState();
  }
  protected unmounted(): void {
    this.input?.removeEventListener('input', this.onInput);
    this.input?.removeEventListener('focus', this.onFocus);
    this.input?.removeEventListener('blur', this.onBlur);
  }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value' && this.input && value !== null) { this.input.value = value; this._updateFloatingState(); }
    else if (name === 'disabled' && this.input) { (this.input as any).disabled = value !== null; }
    else if (name === 'floating-label') { this._floatingLabel = value !== null; }
  }
  private onInput = (e: Event): void => {
    const value = (e.target as HTMLInputElement).value;
    const lower = value.toLowerCase();
    this._updateFloatingState();
    this.dispatchEvent(new CustomEvent('lumina-input', { bubbles: true, composed: true, detail: { value } }));
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { value } }));
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let emoji = '';
    let posScore = 0; let negScore = 0;
    for (const word of POSITIVE) { if (lower.includes(word.toLowerCase())) { posScore++; } }
    for (const word of NEGATIVE) { if (lower.includes(word.toLowerCase())) { negScore++; } }
    if (posScore > negScore) { sentiment = 'positive'; emoji = '😊'; }
    else if (negScore > posScore) { sentiment = 'negative'; emoji = '😟'; }
    else if (value.length > 0) { emoji = '✨'; }
    if (sentiment !== this.currentSentiment) {
      this.currentSentiment = sentiment;
      const cfg = SENTIMENT_COLORS[sentiment];
      this.style.setProperty('--lmni-color', cfg.color);
      this.style.setProperty('--lmni-glow', cfg.glow);
      this.dispatchEvent(new CustomEvent('lumina-sentiment-change', { bubbles: true, composed: true, detail: { sentiment } }));
    }
    if (this.reactionEl) {
      if (emoji) { this.reactionEl.textContent = emoji; this.reactionEl.setAttribute('data-show', ''); }
      else this.reactionEl.removeAttribute('data-show');
    }
  };
  private onFocus = (): void => { this.dispatchEvent(new CustomEvent('lumina-focus', { bubbles: true, composed: true, detail: { value: this.value } })); };
  private onBlur = (): void => { this.dispatchEvent(new CustomEvent('lumina-blur', { bubbles: true, composed: true, detail: { value: this.value } })); };
  private _updateFloatingState(): void {
    this.toggleAttribute('data-has-value', this.value.length > 0);
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-neural-input': NeuralInput } }
if (!customElements.get(NeuralInput.tagName)) customElements.define(NeuralInput.tagName, NeuralInput);
