/**
 * LuminaForm — Form orchestrator with zero-dependency validation.
 *
 * v2 enhancements:
 *  - Async validation (setAsyncValidator(name, fn))
 *  - Cross-field validation (data-validate="match:otherField" or custom fn)
 *  - validate-on attribute: "submit" | "change" | "blur" (default: submit)
 *  - Custom error messages via data-msg-* attributes
 *  - Custom validator functions via setValidator(name, fn)
 *
 * Validation rules (in data-validate attribute, space-separated):
 *   - required         → must have a non-empty value
 *   - email            → must match a basic email regex
 *   - min:N            → value length >= N (string) or value >= N (number)
 *   - max:N            → value length <= N (string) or value <= N (number)
 *   - pattern:regex    → value must match the regex
 *   - cpf              → CPF checksum (Brazilian ID) — uses unmasked value
 *   - match:otherName → value must equal the value of field `otherName`
 *
 * Custom error messages: set data-msg-required, data-msg-email, etc.
 *   Example: data-msg-required="Por favor, digite seu nome"
 *
 * Async validators: form.setAsyncValidator('email', async (value, allValues) => {
 *   const res = await fetch(`/api/check-email?email=${value}`);
 *   return (await res.json()).exists ? 'Email já cadastrado' : null;
 * });
 *
 * Sync custom validators: form.setValidator('username', (value, allValues) => {
 *   return value === 'admin' ? 'Nome reservado' : null;
 * });
 *
 * Validation timing: set `validate-on` attribute on lumina-form:
 *   - "submit" (default) — only validates when user submits
 *   - "blur"             — validates each field on blur
 *   - "change"           — validates each field on every change (after first blur)
 *
 * For lumina-masked-input, the validator uses the clean (unmasked) value.
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export interface FormValues { [name: string]: any; }
export interface FormErrors { [name: string]: string; }

export type SyncValidator = (value: any, allValues: FormValues) => string | null;
export type AsyncValidator = (value: any, allValues: FormValues) => Promise<string | null>;

export class Form extends LuminaElement {
  static tagName = 'lumina-form';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'validate-on'];
  }

  private syncValidators: Map<string, SyncValidator> = new Map();
  private asyncValidators: Map<string, AsyncValidator> = new Map();
  private asyncValidating: Set<string> = new Set();
  private validateMode: 'submit' | 'blur' | 'change' = 'submit';
  private dirtyFields: Set<string> = new Set(); // fields the user has interacted with

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
    this.validateMode = (this.getAttribute('validate-on') as any) ?? 'submit';
    // Listen to change/blur events from inner Lumina inputs (they bubble)
    this.addEventListener('lumina-change', this.onFieldChange);
    this.addEventListener('lumina-blur', this.onFieldBlur);
    this.addEventListener('change', this.onNativeFieldChange);
    this.addEventListener('blur', this.onNativeFieldBlur, true);
  }

  protected unmounted(): void {
    const form = this.$$('.lfm') as HTMLFormElement | null;
    form?.removeEventListener('submit', this.onSubmit);
    form?.removeEventListener('reset', this.onReset);
    this.removeEventListener('lumina-change', this.onFieldChange);
    this.removeEventListener('lumina-blur', this.onFieldBlur);
    this.removeEventListener('change', this.onNativeFieldChange);
    this.removeEventListener('blur', this.onNativeFieldBlur, true);
  }

  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'validate-on' && value) {
      this.validateMode = (value as any) ?? 'submit';
    }
  }

  /** Register a custom sync validator for a field. */
  public setValidator(name: string, fn: SyncValidator): void {
    this.syncValidators.set(name, fn);
  }

  /** Register a custom async validator for a field. */
  public setAsyncValidator(name: string, fn: AsyncValidator): void {
    this.asyncValidators.set(name, fn);
  }

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

  /**
   * Validate all fields. Returns errors object (sync errors only — async
   * validators run in the background and update the UI when they resolve).
   * Use validateAsync() to await async validators.
   */
  public validate(): FormErrors {
    const errors: FormErrors = {};
    const values = this.getValues();
    this._getFields().forEach((el) => {
      const name = el.getAttribute('name');
      if (!name) return;
      const rules = el.getAttribute('data-validate');
      const value = values[name];
      let error: string | null = null;
      if (rules) error = this._runRules(value, rules, el, values);
      if (!error && this.syncValidators.has(name)) {
        error = this.syncValidators.get(name)!(value, values);
      }
      if (error) errors[name] = error;
      // Kick off async validator (if any) — don't block the sync return
      if (!error && this.asyncValidators.has(name)) {
        this._runAsyncValidator(name, value, values);
      }
    });
    this.setErrors(errors);
    return errors;
  }

  /** Validate and wait for async validators. Returns full errors object. */
  public async validateAsync(): Promise<FormErrors> {
    const errors = this.validate();
    const values = this.getValues();
    const asyncNames = Array.from(this.asyncValidators.keys());
    const asyncResults = await Promise.all(
      asyncNames.map(async (name) => {
        if (errors[name]) return [name, errors[name]] as const; // skip if sync failed
        const err = await this.asyncValidators.get(name)!(values[name], values);
        return [name, err] as const;
      }),
    );
    for (const [name, err] of asyncResults) {
      if (err) errors[name] = err;
    }
    this.setErrors(errors);
    return errors;
  }

  /** Validate a single field by name. Useful for onChange/onBlur validation. */
  public validateField(name: string): string | null {
    const el = this._getFieldByName(name);
    if (!el) return null;
    const values = this.getValues();
    const value = values[name];
    const rules = el.getAttribute('data-validate');
    let error: string | null = null;
    if (rules) error = this._runRules(value, rules, el, values);
    if (!error && this.syncValidators.has(name)) {
      error = this.syncValidators.get(name)!(value, values);
    }
    if (error) {
      this.setFieldError(name, error);
    } else {
      this.clearFieldError(name);
      if (this.asyncValidators.has(name)) {
        this._runAsyncValidator(name, value, values);
      }
    }
    return error;
  }

  private _getFieldByName(name: string): HTMLElement | null {
    return this.querySelector<HTMLElement>(`[name="${name}"]`);
  }

  private async _runAsyncValidator(name: string, value: any, values: FormValues): Promise<void> {
    if (this.asyncValidating.has(name)) return;
    this.asyncValidating.add(name);
    this._setFieldLoading(name, true);
    try {
      const err = await this.asyncValidators.get(name)!(value, values);
      if (err) this.setFieldError(name, err);
      else this.clearFieldError(name);
    } catch (e) {
      this.setFieldError(name, 'Erro ao validar');
    } finally {
      this.asyncValidating.delete(name);
      this._setFieldLoading(name, false);
    }
  }

  private _setFieldLoading(name: string, loading: boolean): void {
    const el = this._getFieldByName(name);
    if (!el) return;
    const field = this._findFieldWrapper(el);
    if (loading) {
      el.setAttribute('data-loading', '');
      field?.setAttribute('data-loading', '');
    } else {
      el.removeAttribute('data-loading');
      field?.removeAttribute('data-loading');
    }
  }

  private _runRules(value: any, rules: string, el: HTMLElement, allValues: FormValues): string | null {
    const parts = rules.split(/\s+/).filter(Boolean);
    for (const rule of parts) {
      let error: string | null = null;
      if (rule === 'required') {
        if (!value || (typeof value === 'string' && !value.trim())) {
          error = this._msg(el, 'required', 'Campo obrigatório');
        }
      } else if (rule === 'email') {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
          error = this._msg(el, 'email', 'Email inválido');
        }
      } else if (rule.startsWith('min:')) {
        const n = parseFloat(rule.slice(4));
        if (typeof value === 'number' ? value < n : String(value).length < n) {
          error = this._msg(el, 'min', `Mínimo: ${n}`);
        }
      } else if (rule.startsWith('max:')) {
        const n = parseFloat(rule.slice(4));
        if (typeof value === 'number' ? value > n : String(value).length > n) {
          error = this._msg(el, 'max', `Máximo: ${n}`);
        }
      } else if (rule.startsWith('pattern:')) {
        const re = new RegExp(rule.slice(8));
        if (!re.test(String(value))) {
          error = this._msg(el, 'pattern', 'Formato inválido');
        }
      } else if (rule === 'cpf') {
        if (!this._validateCPF(String(value))) {
          error = this._msg(el, 'cpf', 'CPF inválido');
        }
      } else if (rule.startsWith('match:')) {
        // Cross-field validation — value must match another field's value
        const otherName = rule.slice(6);
        const otherValue = allValues[otherName];
        if (value !== otherValue) {
          error = this._msg(el, 'match', `Deve ser igual a ${otherName}`);
        }
      }
      if (error) return error;
    }
    return null;
  }

  /** Get a custom error message from data-msg-* attributes, or use default. */
  private _msg(el: HTMLElement, rule: string, defaultMsg: string): string {
    return el.getAttribute(`data-msg-${rule}`) ?? defaultMsg;
  }

  private _validateCPF(cpf: string): boolean {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(clean)) return false;
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

  /** Set error on a single field. */
  public setFieldError(name: string, message: string): void {
    const el = this._getFieldByName(name);
    if (!el) return;
    const field = this._findFieldWrapper(el);
    el.setAttribute('invalid', '');
    el.removeAttribute('valid');
    if (field) {
      field.setAttribute('invalid', '');
      field.removeAttribute('valid');
      const errorSlot = field.querySelector('[slot="error"]');
      if (errorSlot) errorSlot.textContent = message;
    }
  }

  /** Clear error on a single field (and mark valid if it had a value). */
  public clearFieldError(name: string): void {
    const el = this._getFieldByName(name);
    if (!el) return;
    const field = this._findFieldWrapper(el);
    el.removeAttribute('invalid');
    const value = this._getFieldValue(el);
    if (value) el.setAttribute('valid', '');
    if (field) {
      field.removeAttribute('invalid');
      if (value) field.setAttribute('valid', '');
      const errorSlot = field.querySelector('[slot="error"]');
      if (errorSlot) errorSlot.textContent = '';
    }
  }

  /** Mark fields as invalid and show error messages in lumina-form-field wrappers. */
  public setErrors(errors: FormErrors): void {
    this._getFields().forEach((el) => {
      const name = el.getAttribute('name');
      if (!name) return;
      const field = this._findFieldWrapper(el);
      if (errors[name]) {
        el.setAttribute('invalid', '');
        el.removeAttribute('valid');
        if (field) {
          field.setAttribute('invalid', '');
          field.removeAttribute('valid');
          const errorSlot = field.querySelector('[slot="error"]');
          if (errorSlot) errorSlot.textContent = errors[name];
        }
      } else {
        el.removeAttribute('invalid');
        const value = this._getFieldValue(el);
        if (value) el.setAttribute('valid', '');
        if (field) {
          field.removeAttribute('invalid');
          if (value) field.setAttribute('valid', '');
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

  private onFieldChange = (e: Event): void => {
    const target = e.target as HTMLElement;
    const name = target.getAttribute('name');
    if (!name) return;
    this.dirtyFields.add(name);
    if (this.validateMode === 'change') {
      this.validateField(name);
    }
  };

  private onFieldBlur = (e: Event): void => {
    const target = e.target as HTMLElement;
    const name = target.getAttribute('name');
    if (!name) return;
    this.dirtyFields.add(name);
    if (this.validateMode === 'blur' || this.validateMode === 'change') {
      this.validateField(name);
    }
  };

  // Native input fallback (for users using native <input> inside lumina-form)
  private onNativeFieldChange = (e: Event): void => {
    const target = e.target as HTMLElement;
    if (!target.hasAttribute('name')) return;
    if (target.tagName.toLowerCase().startsWith('lumina-')) return; // already handled by lumina-change
    this.onFieldChange(e);
  };
  private onNativeFieldBlur = (e: Event): void => {
    const target = e.target as HTMLElement;
    if (!target.hasAttribute('name')) return;
    if (target.tagName.toLowerCase().startsWith('lumina-')) return;
    this.onFieldBlur(e);
  };

  private onSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();
    // Run sync validation first
    const errors = this.validate();
    if (Object.keys(errors).length === 0) {
      // If any async validators, run them and await
      if (this.asyncValidators.size > 0) {
        const asyncErrors = await this.validateAsync();
        if (Object.keys(asyncErrors).length > 0) {
          this.dispatchEvent(new CustomEvent('lumina-submit', {
            bubbles: true, composed: true,
            detail: { values: this.getValues(), errors: asyncErrors, valid: false },
          }));
          return;
        }
      }
    }
    const values = this.getValues();
    const valid = Object.keys(errors).length === 0;
    this.dispatchEvent(
      new CustomEvent('lumina-submit', {
        bubbles: true,
        composed: true,
        detail: { values, errors, valid },
      }),
    );
  };

  private onReset = (e: Event): void => {
    e.preventDefault();
    this.clearErrors();
    this.dirtyFields.clear();
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
