/**
 * LuminaSlider — Slider de valor único com track glow, thumb com escala,
 * marks, tooltip de valor e navegação por teclado.
 *
 * Variants: glass | neural | aura
 *
 * Uso:
 *   <lumina-slider
 *     min="0" max="100" value="50" step="5"
 *     marks='[{"value":0,"label":"0"},{"value":50,"label":"Médio"},{"value":100,"label":"Máx"}]'
 *     variant="glass"
 *   ></lumina-slider>
 *
 * Eventos:
 *   lumina-input  — disparado a cada movimento (detail: { value })
 *   lumina-change — disparado ao soltar o thumb (detail: { value })
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { clamp } from '../core/utils';

interface Mark {
  value: number;
  label?: string;
}

export class LuminaSlider extends LuminaElement {
  static tagName = 'lumina-slider';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'value',
      'min',
      'max',
      'step',
      'marks',
    ];
  }

  private _value = 50;
  private _min = 0;
  private _max = 100;
  private _step = 1;
  private _marks: Mark[] = [];
  private track: HTMLElement | null = null;
  private fill: HTMLElement | null = null;
  private thumb: HTMLElement | null = null;
  private tooltip: HTMLElement | null = null;
  private marksContainer: HTMLElement | null = null;
  private dragging = false;

  get value(): number { return this._value; }
  set value(v: number) {
    this._value = clamp(v, this._min, this._max);
    this.setAttribute('value', String(this._value));
    this.updateUI();
  }

  get min(): number { return this._min; }
  set min(v: number) {
    this._min = v;
    this.setAttribute('min', String(v));
    this.updateUI();
  }

  get max(): number { return this._max; }
  set max(v: number) {
    this._max = v;
    this.setAttribute('max', String(v));
    this.updateUI();
  }

  get step(): number { return this._step; }
  set step(v: number) {
    this._step = v;
    this.setAttribute('step', String(v));
  }

  get marks(): Mark[] { return this._marks; }
  set marks(v: Mark[]) {
    this._marks = v;
    this.setAttribute('marks', JSON.stringify(v));
    this.renderMarks();
  }

  protected render(): string {
    return `
      <div class="lms" part="track">
        <div class="lms__rail" aria-hidden="true"></div>
        <div class="lms__fill" part="fill" aria-hidden="true"></div>
        <div class="lms__marks" aria-hidden="true"></div>
        <div class="lms__thumb" part="thumb" role="slider"
          tabindex="0"
          aria-valuemin="${this._min}"
          aria-valuemax="${this._max}"
          aria-valuenow="${this._value}">
          <div class="lms__tooltip" part="tooltip" aria-hidden="true"></div>
        </div>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        padding: 16px 0;
      }

      .lms {
        position: relative;
        height: 8px;
        cursor: pointer;
        touch-action: none;
      }

      .lms__rail {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 8px;
        transform: translateY(-50%);
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--lumina-border);
        box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.25);
      }

      .lms__fill {
        position: absolute;
        top: 50%;
        left: 0;
        height: 8px;
        width: 50%;
        transform: translateY(-50%);
        border-radius: var(--lumina-radius-pill);
        background: linear-gradient(90deg,
          rgb(var(--lumina-accent-rgb) / 0.7),
          var(--lumina-accent)
        );
        box-shadow:
          0 0 12px rgb(var(--lumina-accent-rgb) / 0.6),
          inset 0 1px 0 rgb(255 255 255 / 0.25);
        transition: width 0.05s linear;
        pointer-events: none;
      }

      .lms__thumb {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: linear-gradient(135deg, #ffffff, #d8d8e8);
        box-shadow:
          0 2px 8px rgb(0 0 0 / 0.4),
          0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.15),
          inset 0 1px 0 rgb(255 255 255 / 0.8);
        cursor: grab;
        z-index: 2;
        transition:
          transform 0.15s var(--lumina-ease-spring),
          box-shadow var(--lumina-speed) var(--lumina-ease-out);
        will-change: left;
      }
      .lms__thumb:hover {
        transform: translate(-50%, -50%) scale(1.15);
        box-shadow:
          0 4px 14px rgb(0 0 0 / 0.5),
          0 0 0 6px rgb(var(--lumina-accent-rgb) / 0.2),
          inset 0 1px 0 rgb(255 255 255 / 0.8);
      }
      .lms__thumb:active,
      .lms__thumb[data-dragging] {
        cursor: grabbing;
        transform: translate(-50%, -50%) scale(1.3);
      }
      .lms__thumb:focus-visible {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 4px;
      }

      .lms__tooltip {
        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 10px;
        border-radius: 6px;
        background: rgb(var(--lumina-surface) / 0.95);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--lumina-border);
        color: var(--lumina-text);
        font: 600 11px 'JetBrains Mono', monospace;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
        box-shadow: 0 4px 12px rgb(0 0 0 / 0.3);
      }
      .lms__tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: var(--lumina-border);
      }
      .lms__thumb:hover .lms__tooltip,
      .lms__thumb[data-dragging] .lms__tooltip,
      .lms__thumb:focus-visible .lms__tooltip {
        opacity: 1;
      }

      .lms__marks {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 8px;
        transform: translateY(-50%);
        pointer-events: none;
      }
      .lms__mark {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgb(var(--lumina-accent-rgb) / 0.4);
      }
      .lms__mark[data-active] {
        background: var(--lumina-accent);
        box-shadow: 0 0 6px var(--lumina-accent);
      }
      .lms__mark-label {
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        font-size: 10px;
        color: var(--lumina-text-muted);
        font-family: 'JetBrains Mono', monospace;
        white-space: nowrap;
      }

      /* Variant: neural — pulsing fill */
      :host([variant="neural"]) .lms__fill {
        animation: lms-pulse 2s ease-in-out infinite;
      }
      @keyframes lms-pulse {
        0%, 100% { box-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.6); }
        50%      { box-shadow: 0 0 24px rgb(var(--lumina-accent-rgb) / 0.9); }
      }

      /* Variant: aura — floating thumb */
      :host([variant="aura"]) .lms__thumb {
        animation: lms-float 3s ease-in-out infinite;
      }
      @keyframes lms-float {
        0%, 100% { transform: translate(-50%, -50%); }
        50%      { transform: translate(-50%, calc(-50% - 1px)); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lms__fill, .lms__thumb, .lms__tooltip { transition: none !important; animation: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.track = this.$$('.lms');
    this.fill = this.$$('.lms__fill');
    this.thumb = this.$$('.lms__thumb');
    this.tooltip = this.$$('.lms__tooltip');
    this.marksContainer = this.$$('.lms__marks');

    // Read initial attributes
    this._min = parseFloat(this.getAttribute('min') ?? '0') || 0;
    this._max = parseFloat(this.getAttribute('max') ?? '100') || 100;
    this._step = parseFloat(this.getAttribute('step') ?? '1') || 1;
    this._value = clamp(
      parseFloat(this.getAttribute('value') ?? '50') || 50,
      this._min,
      this._max,
    );
    const marksAttr = this.getAttribute('marks');
    if (marksAttr) {
      try {
        this._marks = JSON.parse(marksAttr);
      } catch {
        this._marks = [];
      }
    }

    this.renderMarks();
    this.updateUI();

    // Pointer events
    this.track?.addEventListener('pointerdown', this.onPointerDown);
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);

    // Keyboard on thumb
    this.thumb?.addEventListener('keydown', this.onKeydown);
  }

  protected unmounted(): void {
    this.track?.removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
    this.thumb?.removeEventListener('keydown', this.onKeydown);
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value' && value !== null) {
      this._value = clamp(parseFloat(value) || 0, this._min, this._max);
      this.updateUI();
    } else if (name === 'min') {
      this._min = parseFloat(value ?? '0') || 0;
      this.updateUI();
    } else if (name === 'max') {
      this._max = parseFloat(value ?? '100') || 100;
      this.updateUI();
    } else if (name === 'step') {
      this._step = parseFloat(value ?? '1') || 1;
    } else if (name === 'marks' && value) {
      try {
        this._marks = JSON.parse(value);
        this.renderMarks();
      } catch {
        this._marks = [];
      }
    }
  }

  private updateUI(): void {
    if (!this.fill || !this.thumb || !this.tooltip) return;
    const pct = ((this._value - this._min) / (this._max - this._min)) * 100;
    this.fill.style.width = `${pct}%`;
    this.thumb.style.left = `${pct}%`;
    this.tooltip.textContent = String(this._value);
    this.thumb.setAttribute('aria-valuenow', String(this._value));

    // Update active marks
    this.marksContainer?.querySelectorAll('.lms__mark').forEach((m) => {
      const markValue = parseFloat(m.getAttribute('data-value') ?? '');
      m.toggleAttribute('data-active', markValue === this._value);
    });
  }

  private renderMarks(): void {
    if (!this.marksContainer) return;
    this.marksContainer.innerHTML = '';
    for (const mark of this._marks) {
      const pct = ((mark.value - this._min) / (this._max - this._min)) * 100;
      const dot = document.createElement('div');
      dot.className = 'lms__mark';
      dot.style.left = `${pct}%`;
      dot.setAttribute('data-value', String(mark.value));
      this.marksContainer.appendChild(dot);
      if (mark.label) {
        const label = document.createElement('div');
        label.className = 'lms__mark-label';
        label.style.left = `${pct}%`;
        label.textContent = mark.label;
        this.marksContainer.appendChild(label);
      }
    }
  }

  private setValueFromPointer(clientX: number): void {
    if (!this.track) return;
    const rect = this.track.getBoundingClientRect();
    const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = this._min + pct * (this._max - this._min);
    // Snap to step
    const snapped = Math.round(raw / this._step) * this._step;
    const clamped = clamp(snapped, this._min, this._max);
    if (clamped !== this._value) {
      this._value = clamped;
      this.setAttribute('value', String(this._value));
      this.updateUI();
      this.dispatchEvent(
        new CustomEvent('lumina-input', {
          bubbles: true,
          composed: true,
          detail: { value: this._value },
        }),
      );
    }
  }

  private onPointerDown = (e: PointerEvent): void => {
    this.dragging = true;
    this.thumb?.setAttribute('data-dragging', '');
    this.setValueFromPointer(e.clientX);
    e.preventDefault();
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.dragging) return;
    this.setValueFromPointer(e.clientX);
  };

  private onPointerUp = (): void => {
    if (!this.dragging) return;
    this.dragging = false;
    this.thumb?.removeAttribute('data-dragging');
    this.dispatchEvent(
      new CustomEvent('lumina-change', {
        bubbles: true,
        composed: true,
        detail: { value: this._value },
      }),
    );
  };

  private onKeydown = (e: KeyboardEvent): void => {
    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = this._step;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -this._step;
    else if (e.key === 'PageUp') delta = this._step * 10;
    else if (e.key === 'PageDown') delta = -this._step * 10;
    else if (e.key === 'Home') { this.value = this._min; e.preventDefault(); return; }
    else if (e.key === 'End') { this.value = this._max; e.preventDefault(); return; }
    else return;
    e.preventDefault();
    this.value = this._value + delta;
    this.dispatchEvent(
      new CustomEvent('lumina-input', {
        bubbles: true,
        composed: true,
        detail: { value: this._value },
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-slider': LuminaSlider;
  }
}

if (!customElements.get(LuminaSlider.tagName)) {
  customElements.define(LuminaSlider.tagName, LuminaSlider);
}
