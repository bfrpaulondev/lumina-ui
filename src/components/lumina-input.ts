/**
 * LuminaInput — Text field with visual echo and neural feedback.
 *
 * Every keystroke emits a soft "echo" ripple at the cursor position;
 * focus state activates a neural particle field around the field's
 * perimeter. Invalid input shakes briefly and turns the accent red.
 */

import { LuminaFormElement } from '../core/LuminaFormElement';
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { intensityToMultiplier, prefersReducedMotion } from '../core/utils';

export class LuminaInput extends LuminaFormElement {
  static tagName = 'lumina-input';

  private field: ParticleField | null = null;
  private input: HTMLInputElement | null = null;
  private echo: HTMLCanvasElement | null = null;
  private echoCtx: CanvasRenderingContext2D | null = null;
  private echoRipples: Array<{
    x: number;
    y: number;
    life: number;
    maxLife: number;
  }> = [];
  private echoRaf = 0;

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'type',
      'placeholder',
      'value',
      'label',
      'disabled',
      'required',
      'invalid',
      'name',
      'floating-label',
    ];
  }

  private _floatingLabel = false;

  /** Enable floating label animation (label shrinks to top when field has value/focus). */
  get floatingLabel(): boolean { return this._floatingLabel; }
  set floatingLabel(v: boolean) {
    this._floatingLabel = v;
    v ? this.setAttribute('floating-label', '') : this.removeAttribute('floating-label');
    this._updateFloatingState();
  }

  /* Typed accessors for input-specific properties */
  get value(): string {
    return this.input?.value ?? '';
  }
  set value(v: string) {
    if (this.input) this.input.value = v;
    this.setAttribute('value', v);
    this._updateFloatingState();
  }

  protected render(): string {
    const placeholderAttr = this._floatingLabel ? '' : `placeholder="${this.getAttribute('placeholder') ?? ''}"`;
    // Allow `label="..."` attribute as a shorthand for the label slot.
    // If a <slot name="label"> child is provided, it takes precedence.
    const labelAttr = this.getAttribute('label');
    const labelContent = labelAttr !== null ? labelAttr : '';
    return `
      <label class="lumina-input${this._floatingLabel ? ' lumina-input--floating' : ''}" part="root">
        <span class="lumina-input__label" part="label">
          <slot name="label">${labelContent}</slot>
        </span>
        <span class="lumina-input__shell" part="shell">
          <span class="lumina-input__field" part="field" aria-hidden="true"></span>
          <span class="lumina-input__bg" part="bg"></span>
          <span class="lumina-input__ring" part="ring" aria-hidden="true"></span>
          <span class="lumina-input__bar" part="bar" aria-hidden="true"></span>
          <canvas class="lumina-input__echo" part="echo" aria-hidden="true"></canvas>
          <input
            class="lumina-input__el"
            part="input"
            type="${this.getAttribute('type') ?? 'text'}"
            ${placeholderAttr}
            name="${this.getAttribute('name') ?? ''}"
            ${this.hasAttribute('disabled') ? 'disabled' : ''}
            ${this.hasAttribute('required') ? 'required' : ''}
            aria-invalid="${this.hasAttribute('invalid')}"
          />
        </span>
      </label>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        --lumina-input-h: 52px;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-input {
        display: flex;
        flex-direction: column;
        gap: 8px;
        cursor: text;
      }

      .lumina-input__label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--lumina-text-muted);
      }
      .lumina-input__label:empty { display: none; }

      /* Floating label mode: label sits inside the shell and floats up on focus/value */
      .lumina-input--floating { gap: 0; }
      .lumina-input--floating .lumina-input__label {
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);
        z-index: 4;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0;
        text-transform: none;
        color: var(--lumina-text-muted);
        pointer-events: none;
        transition: top var(--lumina-speed) var(--lumina-ease-spring),
                    font-size var(--lumina-speed) var(--lumina-ease-spring),
                    color var(--lumina-speed) var(--lumina-ease-out);
        background: transparent;
        padding: 0 4px;
      }
      .lumina-input--floating .lumina-input__shell:focus-within .lumina-input__label,
      .lumina-input--floating.lumina-input--has-value .lumina-input__label {
        top: 0;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--lumina-accent);
        transform: translateY(-50%) translateX(-2px);
      }

      .lumina-input__shell {
        position: relative;
        display: flex;
        align-items: center;
        height: var(--lumina-input-h);
        border-radius: var(--lumina-radius-md);
        overflow: hidden;
        cursor: text;
      }

      .lumina-input__field {
        position: absolute;
        inset: -4px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-input__bg {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(12px) saturate(1.3);
        -webkit-backdrop-filter: blur(12px) saturate(1.3);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 0 0 rgb(255 255 255 / 0.10),
          var(--lumina-shadow);
        transition: border-color var(--lumina-speed) var(--lumina-ease-out),
                    box-shadow var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-input__ring {
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        background: conic-gradient(
          from 0deg,
          transparent 0%,
          var(--lumina-accent) 25%,
          transparent 50%,
          var(--lumina-accent) 75%,
          transparent 100%
        );
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude;
        padding: 2px;
        animation: lumina-input-spin 4s linear infinite;
        animation-play-state: paused;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-input__bar {
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 0;
        height: 2px;
        background: var(--lumina-accent);
        box-shadow: 0 0 8px var(--lumina-accent);
        transform: translateX(-50%);
        transition: width var(--lumina-speed) var(--lumina-ease-spring);
        z-index: 4;
      }

      .lumina-input__echo {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        mix-blend-mode: screen;
      }

      .lumina-input__el {
        position: relative;
        z-index: 3;
        width: 100%;
        height: 100%;
        padding: 0 16px;
        border: 0;
        background: transparent;
        color: var(--lumina-text);
        font-family: inherit;
        font-size: 15px;
        outline: none;
        caret-color: var(--lumina-accent);
      }
      .lumina-input__el::placeholder { color: var(--lumina-text-muted); }

      /* ----- Focus state ----- */
      :host(:focus-within) .lumina-input__field { opacity: 1; }
      :host(:focus-within) .lumina-input__ring { opacity: 0.7; animation-play-state: running; }
      :host(:focus-within) .lumina-input__bar { width: 70%; }
      :host(:focus-within) .lumina-input__bg {
        border-color: rgb(var(--lumina-accent-rgb) / 0.5);
        box-shadow:
          0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.12),
          var(--lumina-shadow);
      }

      /* ----- Invalid state ----- */
      :host([invalid]) .lumina-input__bg { border-color: rgb(255 70 90 / 0.6); }
      :host([invalid]) .lumina-input__bar { background: rgb(255 70 90); width: 100%; }
      :host([invalid]) .lumina-input__shell { animation: lumina-input-shake 0.4s; }

      /* ----- Disabled ----- */
      :host([disabled]) { opacity: 0.5; cursor: not-allowed; }
      :host([disabled]) .lumina-input__el { cursor: not-allowed; }

      /* ----- Variant-specific ----- */
      :host([variant="morph"]) .lumina-input__shell {
        border-radius: var(--lumina-radius-pill);
      }
      :host([variant="morph"]) .lumina-input__el { padding: 0 22px; }

      :host([variant="void"]) .lumina-input__bg {
        background: rgb(0 0 0 / 0.55);
        backdrop-filter: blur(6px);
      }
      :host([variant="void"]) .lumina-input__el { color: var(--lumina-accent); }

      :host([variant="aura"]:focus-within) .lumina-input__field { opacity: 1; }
      :host([variant="aura"]) .lumina-input__bg {
        background:
          radial-gradient(120% 100% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.18),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%
          );
      }

      @keyframes lumina-input-spin { to { transform: rotate(360deg); } }
      @keyframes lumina-input-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-input__ring,
        .lumina-input__bar,
        .lumina-input__bg { animation: none !important; transition: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.input = this.$$('.lumina-input__el') as HTMLInputElement | null;
    this.echo = this.$$('.lumina-input__echo') as HTMLCanvasElement | null;
    this.echoCtx = this.echo?.getContext('2d') ?? null;
    this._floatingLabel = this.hasAttribute('floating-label');

    if (this.input) {
      this.input.addEventListener('input', this.onInput);
      this.input.addEventListener('focus', this.onFocus);
      this.input.addEventListener('blur', this.onBlur);
      this.input.addEventListener('keydown', this.onKeyDown);
      const initial = this.getAttribute('value');
      if (initial !== null) this.input.value = initial;
      // Capture initial value for form reset, then push it to the form.
      this._initialValue = initial ?? '';
      this._setFormValue(this.input.value);
      // Reflect disabled state to the inner input so the form knows.
      if (this.hasAttribute('disabled')) this.input.disabled = true;
    }
    this._updateFloatingState();
  }

  /** Update the floating-label "has value" state. */
  private _updateFloatingState(): void {
    if (!this.input) return;
    const hasValue = this.input.value.length > 0;
    const root = this.$$('.lumina-input');
    if (root) {
      root.classList.toggle('lumina-input--has-value', hasValue);
    }
  }

  protected unmounted(): void {
    this.input?.removeEventListener('input', this.onInput);
    this.input?.removeEventListener('focus', this.onFocus);
    this.input?.removeEventListener('blur', this.onBlur);
    this.input?.removeEventListener('keydown', this.onKeyDown);
    this.field?.destroy();
    this.field = null;
    cancelAnimationFrame(this.echoRaf);
  }

  protected onConfigChange(changed: Partial<LuminaElementAttributes>): void {
    if (changed.variant || changed.intensity) {
      this.field?.destroy();
      this.field = null;
      // The field is only spawned on focus — no-op here.
    }
  }

  /** Restore value on form reset. */
  formResetCallback(): void {
    super.formResetCallback();
    if (this.input) {
      this.input.value = this._initialValue ?? '';
      this._updateFloatingState();
    }
  }

  /** Restore value on browser back/forward. */
  formStateRestoreCallback(
    state: string | File | FormData | null,
    mode: 'restore' | 'autocomplete',
  ): void {
    super.formStateRestoreCallback(state, mode);
    if (typeof state === 'string' && this.input) {
      this.input.value = state;
      this._updateFloatingState();
    }
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value' && value !== null && this.input) {
      this.input.value = value;
      this._updateFloatingState();
    } else if (name === 'floating-label') {
      this._floatingLabel = value !== null;
      // Re-render with new floating state
      if (this._mounted) {
        this.shadow.innerHTML = this.render();
        this.input = this.$$('.lumina-input__el') as HTMLInputElement | null;
        if (this.input) {
          this.input.value = this.getAttribute('value') ?? '';
          this.input.addEventListener('input', this.onInput);
          this.input.addEventListener('focus', this.onFocus);
          this.input.addEventListener('blur', this.onBlur);
          this.input.addEventListener('keydown', this.onKeyDown);
        }
        this._updateFloatingState();
      }
    }
  }

  private onInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    this.spawnEcho();
    this._updateFloatingState();
    // Propagate value to the owner <form> so FormData / form.submit() works.
    this._setFormValue(target.value);
    this.dispatchEvent(
      new CustomEvent('lumina-change', {
        detail: { value: target.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private onFocus = (): void => {
    if (this.variant === 'neural' || this.variant === 'aura') {
      this.spawnField();
    }
    this.dispatchEvent(
      new CustomEvent('lumina-focus', {
        detail: { value: this.input?.value ?? '' },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private onBlur = (): void => {
    this.field?.destroy();
    this.field = null;
    this.dispatchEvent(
      new CustomEvent('lumina-blur', {
        detail: { value: this.input?.value ?? '' },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.dispatchEvent(
        new CustomEvent('lumina-submit', {
          detail: { value: this.input?.value ?? '' },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  private spawnField(): void {
    if (this.field) return;
    const slot = this.$$('.lumina-input__field');
    if (!slot) return;
    const accentRgb = (this.shadow.host as HTMLElement).style
      .getPropertyValue('--lumina-accent-rgb')
      .trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    this.field = new ParticleField(this.shadow.host as HTMLElement, {
      count: Math.round(18 * intensity),
      rgb: accentRgb,
      sizeRange: [0.6, 1.8],
      speedRange: [0.2, 0.5],
      lifeRange: [80, 140],
      connect: this.variant === 'neural',
    });
    this.field.mount(slot);
  }

  private spawnEcho(): void {
    if (prefersReducedMotion() || !this.echoCtx || !this.echo || !this.input) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth;
    const h = this.clientHeight;
    this.echo.width = w * dpr;
    this.echo.height = h * dpr;
    this.echo.style.width = `${w}px`;
    this.echo.style.height = `${h}px`;
    this.echoCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Approximate cursor x position based on input value width
    const cs = window.getComputedStyle(this.input);
    const fontSize = parseFloat(cs.fontSize);
    const paddingLeft = parseFloat(cs.paddingLeft);
    const valueWidth = this.input.value.length * fontSize * 0.55;
    const x = Math.min(paddingLeft + valueWidth + 2, w - 8);
    const y = h / 2;

    this.echoRipples.push({ x, y, life: 0, maxLife: 30 });
    if (!this.echoRaf) this.tickEcho();
  }

  private tickEcho = (): void => {
    if (!this.echoCtx) return;
    const accentRgb = (this.shadow.host as HTMLElement).style
      .getPropertyValue('--lumina-accent-rgb')
      .trim() || '124 92 255';
    const w = this.clientWidth;
    const h = this.clientHeight;
    this.echoCtx.clearRect(0, 0, w, h);

    this.echoRipples = this.echoRipples.filter((r) => r.life < r.maxLife);
    for (const r of this.echoRipples) {
      r.life += 1;
      const t = r.life / r.maxLife;
      const radius = 4 + t * 30;
      const alpha = (1 - t) * 0.6;
      this.echoCtx.strokeStyle = `rgba(${accentRgb} / ${alpha})`;
      this.echoCtx.lineWidth = 1.5;
      this.echoCtx.beginPath();
      this.echoCtx.arc(r.x, r.y, radius, 0, Math.PI * 2);
      this.echoCtx.stroke();
    }

    if (this.echoRipples.length > 0) {
      this.echoRaf = requestAnimationFrame(this.tickEcho);
    } else {
      this.echoRaf = 0;
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-input': LuminaInput;
  }
}

if (!customElements.get(LuminaInput.tagName)) {
  customElements.define(LuminaInput.tagName, LuminaInput);
}
