/**
 * LuminaFormElement — Base class for form-associable Lumina components.
 *
 * Extends {@link LuminaElement} with the [Element Internals API][1] so that
 * custom elements participate in native `<form>` submission, reset and
 * validation just like built-in inputs. Concrete form components
 * (`lumina-input`, `lumina-textarea`, `lumina-checkbox`, `lumina-select`,
 * `lumina-switch`, …) should extend this class instead of `LuminaElement`
 * and call {@link LuminaFormElement._setFormValue} whenever their value
 * changes.
 *
 * [1]: https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals
 *
 * What you get for free:
 *   - `static formAssociated = true`
 *   - `this._internals` (ElementInternals) attached in the constructor
 *   - `_setFormValue(value)` — propagates the current value to the owner form
 *   - `formResetCallback()` — resets `_value` to the initial attribute
 *   - `formStateRestoreCallback(state)` — restores value after browser back/forward
 *   - `setValidity(flags, message, anchor)` — wraps `internals.setValidity`
 *   - `checkValidity()` / `reportValidity()` — wrappers that delegate to internals
 *   - `name` and `disabled` reflected attributes (so FormData picks up the field)
 *
 * What subclasses MUST do:
 *   - Set `this._initialValue` in `mounted()` from the `value` attribute (or
 *     `checked` for checkboxes/toggles).
 *   - Call `this._setFormValue(value)` whenever the user input changes.
 *   - Override `formResetCallback()` if the component needs custom reset
 *     logic (e.g. clearing a search input vs. restoring default).
 */

import { LuminaElement } from './LuminaElement';
import type { LuminaElementAttributes } from './LuminaElement';

export abstract class LuminaFormElement extends LuminaElement {
  static formAssociated = true;

  protected _internals: ElementInternals;

  /** Initial value captured on mount — used by formResetCallback. */
  protected _initialValue: string | null = null;

  constructor() {
    super();
    // attachInternals() must be called in the constructor of a form-associated
    // custom element. Throws if called outside the constructor.
    this._internals = this.attachInternals();
  }

  /* ---------------------------------------------------------------- */
  /* Reflected attributes (name, disabled)                             */
  /* ---------------------------------------------------------------- */

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'name', 'disabled'];
  }

  get name(): string {
    return this.getAttribute('name') ?? '';
  }
  set name(v: string) {
    this.setAttribute('name', v);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(v: boolean) {
    v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  /** The current form value to submit. Subclasses should override if the
   *  value is not a plain string (e.g. checkboxes return 'on' when checked,
   *  null when unchecked). */
  protected _getFormValue(): string | null {
    return null;
  }

  /** Push the current value to the form. Subclasses call this from their
   *  input/change handlers. */
  protected _setFormValue(value: string | File | null): void {
    this._internals.setFormValue(value);
  }

  /* ---------------------------------------------------------------- */
  /* Form lifecycle hooks                                              */
  /* ---------------------------------------------------------------- */

  /** Called by the browser when the owner `<form>` is reset. Restores the
   *  value captured at mount time. Subclasses should override to also
   *  update the visible UI (input.value, toggle checked state, etc.). */
  formResetCallback(): void {
    this._setFormValue(this._initialValue);
  }

  /** Called by the browser when restoring form state (back/forward
   *  navigation, browser restart). Subclasses should override to also
   *  update the visible UI. */
  formStateRestoreCallback(
    state: string | File | FormData | null,
    _mode: 'restore' | 'autocomplete',
  ): void {
    if (typeof state === 'string') {
      this._setFormValue(state);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Validity wrappers (delegate to ElementInternals)                  */
  /* ---------------------------------------------------------------- */

  setValidity(
    flags: ValidityStateFlags,
    message?: string,
    anchor?: HTMLElement,
  ): void {
    this._internals.setValidity(flags, message, anchor);
  }

  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  reportValidity(): boolean {
    return this._internals.reportValidity();
  }

  get validity(): ValidityState {
    return this._internals.validity;
  }

  get validationMessage(): string {
    return this._internals.validationMessage;
  }

  get willValidate(): boolean {
    return this._internals.willValidate;
  }

  /** No-op config change hook — concrete components override. */
  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-form-element': LuminaFormElement;
  }
}
