/**
 * LuminaForm — Form orchestrator with zero-dependency validation.
 *
 * Wraps any number of Lumina inputs (or native inputs) and provides:
 *   - submit / reset events with detail.values (clean values for masked inputs)
 *   - per-field validation via `data-validate` attribute on inputs
 *   - automatic error UI on lumina-form-field wrappers
 *   - getValues() returns the current values keyed by input name
 *   - setErrors({ name: 'message' }) marks fields invalid and shows messages
 *   - clearErrors() resets the invalid state
 *
 * Validation rules (in data-validate attribute, space-separated):
 *   - required  → must have a non-empty value
 *   - email     → must match a basic email regex
 *   - min:N     → value length >= N (string) or value >= N (number)
 *   - max:N     → value length <= N (string) or value <= N (number)
 *   - pattern:regex → value must match the regex
 *   - cpf       → CPF checksum (Brazilian ID) — uses unmasked value
 *
 * For lumina-masked-input, the validator uses the clean (unmasked) value.
 * For other Lumina inputs, it uses the `value` property or attribute.
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export interface FormValues { [name: string]: any; }
export interface FormErrors { [name: string]: string; }

export class Form extends LuminaElement {
  static tagName = 'lumina-form';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes];
  }

  protected render(): string {
    return `
      <form class="lfm" part="form" novalidate>
        <slot></slot>
        <slot name="actions">
          <div class="lfm__actions" part="actions">
            <lumina-button type="submit" data-action="submit">Enviar</lumina-button>
            <lumina-button type="reset" variant="glass" data-action="reset">Limpar</lumina-button>
          </div>
        </slot>
      </form>
    `;
  }

  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lfm { display: flex; flex-direction: column; gap: 16px; }
      .lfm__actions { display: flex; gap: 10px; margin-top: 8px; }
    `;
  }

  protected mounted(): void {
    const form = this.$$('.lfm') as HTMLFormElement | null;
    form?.addEventListener('submit', this.onSubmit);
    form?.addEventListener('reset', this.onReset);
  }

  protected unmounted(): void {
    const form = this.$$('.lfm') as HTMLFormElement | null;
    form?.removeEventListener('submit', this.onSubmit);
    form?.removeEventListener('reset', this.onReset);
  }

  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}

  /** Collect all named fields inside the form (any element with a `name`). */
  private _getFields(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>('[name]'));
  }

  /** Get the value of a single field (clean value for masked inputs). */
  private _getFieldValue(el: HTMLElement): any {
    if (el.tagName.toLowerCase() === 'lumina-masked-input') {
      return (el as any).value ?? '';
    }
    if ('value' in el) return (el as HTMLInputElement).value;
    return el.getAttribute('value') ?? '';
  }

  /** Get all current values keyed by name. */
  public getValues(): FormValues {
    const values: FormValues = {};
    this._getFields().forEach((el) => {
      const name = el.getAttribute('name');
      if (!name) return;
      values[name] = this._getFieldValue(el);
    });
    return values;
  }

  /** Validate all fields with data-validate attribute. Returns errors object. */
  public validate(): FormErrors {
    const errors: FormErrors = {};
    this._getFields().forEach((el) => {
      const name = el.getAttribute('name');
      if (!name) return;
      const rules = el.getAttribute('data-validate');
      if (!rules) return;
      const value = this._getFieldValue(el);
      const error = this._runRules(value, rules, el);
      if (error) errors[name] = error;
    });
    this.setErrors(errors);
    return errors;
  }

  private _runRules(value: any, rules: string, el: HTMLElement): string | null {
    const parts = rules.split(/\s+/).filter(Boolean);
    for (const rule of parts) {
      if (rule === 'required') {
        if (!value || (typeof value === 'string' && !value.trim())) return 'Campo obrigatório';
      } else if (rule === 'email') {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) return 'Email inválido';
      } else if (rule.startsWith('min:')) {
        const n = parseFloat(rule.slice(4));
        if (typeof value === 'number' ? value < n : String(value).length < n) return `Mínimo: ${n}`;
      } else if (rule.startsWith('max:')) {
        const n = parseFloat(rule.slice(4));
        if (typeof value === 'number' ? value > n : String(value).length > n) return `Máximo: ${n}`;
      } else if (rule.startsWith('pattern:')) {
        const re = new RegExp(rule.slice(8));
        if (!re.test(String(value))) return 'Formato inválido';
      } else if (rule === 'cpf') {
        if (!this._validateCPF(String(value))) return 'CPF inválido';
      }
    }
    return null;
  }

  private _validateCPF(cpf: string): boolean {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(clean)) return false; // all same digit
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(clean[i], 10) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev >= 10) rev = 0;
    if (rev !== parseInt(clean[9], 10)) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(clean[i], 10) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev >= 10) rev = 0;
    return rev === parseInt(clean[10], 10);
  }

  /** Mark fields as invalid and show error messages in lumina-form-field wrappers. */
  public setErrors(errors: FormErrors): void {
    this._getFields().forEach((el) => {
      const name = el.getAttribute('name');
      if (!name) return;
      const field = this._findFieldWrapper(el);
      if (errors[name]) {
        el.setAttribute('invalid', '');
        if (field) {
          field.setAttribute('invalid', '');
          const errorSlot = field.querySelector('[slot="error"]');
          if (errorSlot) errorSlot.textContent = errors[name];
        }
      } else {
        el.removeAttribute('invalid');
        el.setAttribute('valid', '');
        if (field) {
          field.removeAttribute('invalid');
          field.setAttribute('valid', '');
        }
      }
    });
  }

  /** Clear all errors and valid states. */
  public clearErrors(): void {
    this._getFields().forEach((el) => {
      el.removeAttribute('invalid');
      el.removeAttribute('valid');
      const field = this._findFieldWrapper(el);
      if (field) {
        field.removeAttribute('invalid');
        field.removeAttribute('valid');
        const errorSlot = field.querySelector('[slot="error"]');
        if (errorSlot) errorSlot.textContent = '';
      }
    });
  }

  private _findFieldWrapper(el: HTMLElement): HTMLElement | null {
    let parent: HTMLElement | null = el.parentElement;
    while (parent && parent !== this) {
      if (parent.tagName.toLowerCase() === 'lumina-form-field') return parent;
      parent = parent.parentElement;
    }
    return null;
  }

  private onSubmit = (e: Event): void => {
    e.preventDefault();
    const errors = this.validate();
    const values = this.getValues();
    this.dispatchEvent(
      new CustomEvent('lumina-submit', {
        bubbles: true,
        composed: true,
        detail: { values, errors, valid: Object.keys(errors).length === 0 },
      }),
    );
  };

  private onReset = (e: Event): void => {
    e.preventDefault();
    this.clearErrors();
    this._getFields().forEach((el) => {
      if ('value' in el) (el as HTMLInputElement).value = '';
      else el.removeAttribute('value');
    });
    this.dispatchEvent(new CustomEvent('lumina-reset', { bubbles: true, composed: true, detail: {} }));
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-form': Form;
  }
}

if (!customElements.get(Form.tagName)) {
  customElements.define(Form.tagName, Form);
}
