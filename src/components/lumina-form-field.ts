/**
 * LuminaFormField — Wrapper that adds label, hint, error/success states,
 * and smooth micro-interactions to any inner input/control.
 *
 * Use it to wrap any Lumina input or native control:
 *
 *   <lumina-form-field label="Email" required hint="Use seu email corporativo">
 *     <lumina-input slot="control" placeholder="email@exemplo.com"></lumina-input>
 *     <span slot="error">Email inválido</span>
 *   </lumina-form-field>
 *
 * States are driven by attributes:
 *   - invalid → red border + shake + error slot visible (smooth fade-in)
 *   - valid   → green border + checkmark (subtle success feedback)
 *
 * All transitions respect prefers-reduced-motion.
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class FormField extends LuminaElement {
  static tagName = 'lumina-form-field';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'label',
      'hint',
      'required',
      'invalid',
      'valid',
    ];
  }

  get label(): string { return this.getAttribute('label') ?? ''; }
  set label(v: string) { this.setAttribute('label', v); }
  get hint(): string { return this.getAttribute('hint') ?? ''; }
  set hint(v: string) { this.setAttribute('hint', v); }
  get required(): boolean { return this.hasAttribute('required'); }
  set required(v: boolean) { v ? this.setAttribute('required', '') : this.removeAttribute('required'); }

  /** Mark the field as invalid. The error slot becomes visible (smooth transition). */
  get invalid(): boolean { return this.hasAttribute('invalid'); }
  set invalid(v: boolean) { v ? this.setAttribute('invalid', '') : this.removeAttribute('invalid'); }

  /** Mark the field as valid. Shows a subtle checkmark + green border. */
  get valid(): boolean { return this.hasAttribute('valid'); }
  set valid(v: boolean) { v ? this.setAttribute('valid', '') : this.removeAttribute('valid'); }

  protected render(): string {
    const label = this.getAttribute('label') ?? '';
    const hint = this.getAttribute('hint') ?? '';
    const required = this.hasAttribute('required');
    return `
      <div class="lff" part="field">
        <div class="lff__header">
          <span class="lff__label" part="label">${label}${required ? ' <span class="lff__req" aria-hidden="true">*</span>' : ''}</span>
          <span class="lff__hint" part="hint">${hint}</span>
        </div>
        <div class="lff__control" part="control">
          <slot name="control"></slot>
          <span class="lff__check" part="check" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,8 7,12 13,4"/></svg>
          </span>
        </div>
        <div class="lff__error" part="error"><slot name="error"></slot></div>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lff { display: flex; flex-direction: column; gap: 6px; }
      .lff__header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
      .lff__label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--lumina-text-muted); }
      .lff__req { color: rgb(255 90 110); margin-left: 2px; }
      .lff__hint { font-size: 11px; color: var(--lumina-text-muted); opacity: 0.7; }
      .lff__hint:empty { display: none; }
      .lff__control { position: relative; display: block; transition: transform var(--lumina-speed) var(--lumina-ease-spring); }
      .lff__check { position: absolute; right: 12px; top: 50%; transform: translateY(-50%) scale(0); color: #22c55e; opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); pointer-events: none; }
      .lff__error { font-size: 11.5px; color: rgb(255 90 110); max-height: 0; opacity: 0; overflow: hidden; transform: translateY(-4px); transition: max-height var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-out); }
      .lff__error:empty { display: none; }

      /* Invalid state — smooth error appearance (not abrupt) */
      :host([invalid]) .lff__control { animation: lff-shake 0.4s var(--lumina-ease-spring); }
      :host([invalid]) .lff__error { max-height: 40px; opacity: 1; transform: translateY(0); }

      /* Valid (success) state — subtle checkmark appears */
      :host([valid]) .lff__check { opacity: 1; transform: translateY(-50%) scale(1); }

      @keyframes lff-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
      @media (prefers-reduced-motion: reduce) {
        .lff__control, .lff__check, .lff__error { transition: none !important; animation: none !important; }
      }
    `;
  }

  protected mounted(): void {}
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    // Re-render label/hint on change
    if (name === 'label' || name === 'hint' || name === 'required') {
      const labelEl = this.$$('.lff__label');
      const hintEl = this.$$('.lff__hint');
      if (labelEl) {
        const label = this.getAttribute('label') ?? '';
        const required = this.hasAttribute('required');
        labelEl.innerHTML = `${label}${required ? ' <span class="lff__req" aria-hidden="true">*</span>' : ''}`;
      }
      if (hintEl) hintEl.textContent = this.getAttribute('hint') ?? '';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-form-field': FormField;
  }
}

if (!customElements.get(FormField.tagName)) {
  customElements.define(FormField.tagName, FormField);
}
