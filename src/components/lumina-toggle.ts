/**
 * LuminaToggle — Switch with aura + reactive particles.
 *
 * Toggling on bursts a small particle shower from the knob and lights
 * up an aura ring. Reduced-motion users get a clean crossfade instead.
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { intensityToMultiplier, prefersReducedMotion, randRange } from '../core/utils';

interface ToggleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export class LuminaToggle extends LuminaElement {
  static tagName = 'lumina-toggle';

  private knob: HTMLElement | null = null;
  private track: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: ToggleParticle[] = [];
  private raf = 0;
  private _checked = false;

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'checked', 'disabled', 'label'];
  }

  get checked(): boolean {
    return this._checked;
  }
  set checked(v: boolean) {
    this._checked = v;
    this.setAttribute('aria-checked', String(v));
    if (v) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
    if (v && !prefersReducedMotion()) this.burst();
  }

  protected render(): string {
    return `
      <button
        class="lumina-toggle"
        part="root"
        role="switch"
        aria-checked="${this.hasAttribute('checked')}"
        ${this.hasAttribute('disabled') ? 'disabled' : ''}
      >
        <span class="lumina-toggle__aura" part="aura" aria-hidden="true"></span>
        <span class="lumina-toggle__track" part="track">
          <span class="lumina-toggle__rail" part="rail" aria-hidden="true"></span>
          <span class="lumina-toggle__glow" part="glow" aria-hidden="true"></span>
          <span class="lumina-toggle__knob" part="knob">
            <canvas class="lumina-toggle__burst" part="burst" aria-hidden="true"></canvas>
          </span>
        </span>
        <span class="lumina-toggle__label" part="label">
          <slot></slot>
        </span>
      </button>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-toggle {
        appearance: none;
        border: 0;
        background: transparent;
        padding: 0;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        outline: none;
        font: inherit;
        color: inherit;
      }
      .lumina-toggle:disabled { cursor: not-allowed; opacity: 0.4; }

      .lumina-toggle__aura {
        position: absolute;
        width: 60px;
        height: 60px;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        background: radial-gradient(circle,
          rgb(var(--lumina-accent-rgb) / calc(0.5 * var(--lumina-intensity))),
          transparent 70%
        );
        filter: blur(12px);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
        pointer-events: none;
        z-index: 0;
      }

      .lumina-toggle__track {
        position: relative;
        width: 56px;
        height: 30px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 4px rgb(0 0 0 / 0.25),
          var(--lumina-shadow);
        flex-shrink: 0;
        z-index: 1;
      }

      .lumina-toggle__rail {
        position: absolute;
        inset: 3px;
        border-radius: inherit;
        background: rgb(0 0 0 / 0.2);
        opacity: 1;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-toggle__glow {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(90deg,
          rgb(var(--lumina-accent-rgb) / 0.6),
          rgb(var(--lumina-accent-rgb) / 0.95)
        );
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-toggle__knob {
        position: absolute;
        top: 50%;
        left: 3px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ffffff, #d8d8e8);
        box-shadow:
          0 2px 6px rgb(0 0 0 / 0.4),
          inset 0 1px 0 rgb(255 255 255 / 0.6);
        transform: translateY(-50%);
        transition: left var(--lumina-speed) var(--lumina-ease-spring),
                    background var(--lumina-speed) var(--lumina-ease-out);
        z-index: 2;
      }

      .lumina-toggle__burst {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .lumina-toggle__label {
        font-size: 14px;
        font-weight: 500;
      }
      .lumina-toggle__label:empty { display: none; }

      /* Checked state */
      :host([checked]) .lumina-toggle__glow { opacity: 1; }
      :host([checked]) .lumina-toggle__knob { left: 29px; background: #fff; }
      :host([checked]) .lumina-toggle__aura { opacity: 1; }

      /* Focus */
      .lumina-toggle:focus-visible {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 4px;
      }

      /* Hover */
      .lumina-toggle:hover:not(:disabled) .lumina-toggle__knob {
        box-shadow:
          0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.2),
          0 2px 6px rgb(0 0 0 / 0.4),
          inset 0 1px 0 rgb(255 255 255 / 0.6);
      }

      /* Void variant: minimal black + neon knob */
      :host([variant="void"]) .lumina-toggle__track {
        background: rgb(0 0 0 / 0.6);
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }
      :host([variant="void"][checked]) .lumina-toggle__knob {
        box-shadow:
          0 0 12px var(--lumina-accent),
          0 2px 6px rgb(0 0 0 / 0.4);
      }

      /* Aura variant: floating knob */
      :host([variant="aura"]) .lumina-toggle__knob {
        animation: lumina-toggle-float 3s ease-in-out infinite;
      }

      /* Morph variant: knob morphs from circle to squircle */
      :host([variant="morph"]) .lumina-toggle__knob {
        border-radius: 50%;
        transition: left var(--lumina-speed) var(--lumina-ease-spring),
                    border-radius var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([variant="morph"][checked]) .lumina-toggle__knob {
        border-radius: 6px;
      }

      @keyframes lumina-toggle-float {
        0%, 100% { transform: translateY(-50%); }
        50% { transform: translateY(calc(-50% - 1px)); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-toggle__knob,
        .lumina-toggle__glow,
        .lumina-toggle__aura { transition: none !important; animation: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.knob = this.$$('.lumina-toggle__knob');
    this.track = this.$$('.lumina-toggle__track');
    this.canvas = this.$$('.lumina-toggle__burst') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;

    this._checked = this.hasAttribute('checked');
    this.setAttribute('role', 'switch');
    this.setAttribute('aria-checked', String(this._checked));

    const btn = this.$$('.lumina-toggle');
    btn?.addEventListener('click', this.onClick);
  }

  protected unmounted(): void {
    this.$$('.lumina-toggle')?.removeEventListener('click', this.onClick);
    cancelAnimationFrame(this.raf);
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {
    // Nothing dynamic to re-bind here; CSS handles most visual changes.
  }

  private onClick = (): void => {
    if (this.getAttribute('disabled') !== null) return;
    this.checked = !this._checked;
    this.dispatchEvent(
      new CustomEvent('lumina-toggle', {
        detail: { checked: this._checked },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private burst(): void {
    if (!this.ctx || !this.canvas || !this.knob) return;
    const dpr = window.devicePixelRatio || 1;
    const w = 24;
    const h = 24;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const accentRgb = (this.shadow.host as HTMLElement).style
      .getPropertyValue('--lumina-accent-rgb')
      .trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    const count = Math.round(14 * intensity);

    for (let i = 0; i < count; i++) {
      const angle = randRange(0, Math.PI * 2);
      const speed = randRange(1.5, 3.5);
      this.particles.push({
        x: w / 2,
        y: h / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 30 + Math.random() * 20,
        size: randRange(0.8, 2),
      });
    }
    if (!this.raf) this.tick(accentRgb);
  }

  private tick = (rgb: string): void => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, 24, 24);
    this.particles = this.particles.filter((p) => p.life < p.maxLife);
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.life += 1;
      const a = 1 - p.life / p.maxLife;
      this.ctx.fillStyle = `rgba(${rgb} / ${a})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
      this.ctx.fill();
    }
    if (this.particles.length > 0) {
      this.raf = requestAnimationFrame(() => this.tick(rgb));
    } else {
      this.raf = 0;
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-toggle': LuminaToggle;
  }
}

if (!customElements.get(LuminaToggle.tagName)) {
  customElements.define(LuminaToggle.tagName, LuminaToggle);
}
