/**
 * LuminaProgress — Progress bar with organic shimmer + particle head.
 *
 * Updates animate smoothly via Web Animations API. The leading edge
 * emits a faint trail of particles, giving the bar a "living" feel.
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { intensityToMultiplier, prefersReducedMotion, randRange } from '../core/utils';

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export class LuminaProgress extends LuminaElement {
  static tagName = 'lumina-progress';

  private fill: HTMLElement | null = null;
  private head: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private trail: TrailParticle[] = [];
  private raf = 0;
  private _value = 0;

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'value', 'max', 'indeterminate'];
  }

  get value(): number {
    return this._value;
  }
  set value(v: number) {
    this._value = Math.min(Math.max(v, 0), this.max);
    this.setAttribute('value', String(this._value));
    this.renderValue();
  }

  get max(): number {
    return parseFloat(this.getAttribute('max') ?? '100') || 100;
  }

  protected render(): string {
    return `
      <div class="lumina-progress" part="root" role="progressbar"
           aria-valuemin="0" aria-valuemax="${this.max}" aria-valuenow="${this._value}">
        <div class="lumina-progress__track" part="track">
          <div class="lumina-progress__fill" part="fill">
            <div class="lumina-progress__shimmer" part="shimmer" aria-hidden="true"></div>
            <div class="lumina-progress__head" part="head" aria-hidden="true"></div>
          </div>
          <canvas class="lumina-progress__trail" part="trail" aria-hidden="true"></canvas>
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
      }

      .lumina-progress {
        width: 100%;
      }

      .lumina-progress__track {
        position: relative;
        height: 8px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--lumina-border);
        overflow: visible;
      }

      .lumina-progress__fill {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0%;
        border-radius: inherit;
        background: linear-gradient(90deg,
          rgb(var(--lumina-accent-rgb) / 0.7),
          var(--lumina-accent)
        );
        box-shadow:
          0 0 12px rgb(var(--lumina-accent-rgb) / 0.6),
          inset 0 1px 0 rgb(255 255 255 / 0.25);
        transition: width calc(var(--lumina-speed) * 1.5) var(--lumina-ease-out);
        overflow: hidden;
      }

      .lumina-progress__shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg,
          transparent 0%,
          rgb(255 255 255 / 0.4) 50%,
          transparent 100%
        );
        transform: translateX(-100%);
        animation: lumina-progress-shimmer 2s linear infinite;
      }

      .lumina-progress__head {
        position: absolute;
        right: -2px;
        top: 50%;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--lumina-accent);
        transform: translateY(-50%);
        box-shadow:
          0 0 12px var(--lumina-accent),
          0 0 24px rgb(var(--lumina-accent-rgb) / 0.6);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lumina-progress__fill[style*="width"]:not([style*="width: 0%"]) .lumina-progress__head {
        opacity: 1;
      }

      .lumina-progress__trail {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      /* Indeterminate mode */
      :host([indeterminate]) .lumina-progress__fill {
        width: 35% !important;
        animation: lumina-progress-indeterminate 1.6s var(--lumina-ease-in-out) infinite;
      }

      /* Variant: void */
      :host([variant="void"]) .lumina-progress__fill {
        background: linear-gradient(90deg,
          rgb(0 200 255 / 0.6),
          var(--lumina-accent)
        );
        box-shadow:
          0 0 12px var(--lumina-accent),
          -2px 0 1px rgb(255 0 80 / 0.5),
          2px 0 1px rgb(0 200 255 / 0.5);
      }

      /* Variant: morph */
      :host([variant="morph"]) .lumina-progress__fill {
        clip-path: polygon(
          0 0, 100% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%
        );
      }

      @keyframes lumina-progress-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @keyframes lumina-progress-indeterminate {
        0% { left: -35%; }
        100% { left: 100%; }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-progress__shimmer,
        .lumina-progress__fill,
        .lumina-progress__head {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }

  protected mounted(): void {
    this.fill = this.$$('.lumina-progress__fill');
    this.head = this.$$('.lumina-progress__head');
    this.canvas = this.$$('.lumina-progress__trail') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;

    const initial = parseFloat(this.getAttribute('value') ?? '0') || 0;
    this._value = Math.min(Math.max(initial, 0), this.max);
    this.renderValue();

    if (!prefersReducedMotion()) {
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  protected unmounted(): void {
    cancelAnimationFrame(this.raf);
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  private renderValue(): void {
    if (!this.fill) return;
    const pct = (this._value / this.max) * 100;
    this.fill.style.width = `${pct}%`;
    this.setAttribute('aria-valuenow', String(this._value));
    // Also update the inner progressbar element's aria-valuenow
    const pb = this.shadow.querySelector('[role="progressbar"]');
    if (pb) pb.setAttribute('aria-valuenow', String(this._value));
  }

  private tick = (): void => {
    if (!this.ctx || !this.canvas || !this.fill) {
      this.raf = requestAnimationFrame(this.tick);
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth;
    const h = this.clientHeight;
    if (this.canvas.width !== Math.floor(w * dpr) || this.canvas.height !== Math.floor(h * dpr)) {
      this.canvas.width = Math.max(1, Math.floor(w * dpr));
      this.canvas.height = Math.max(1, Math.floor(h * dpr));
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Spawn particles from the head position
    if (this._value > 0 && this._value < this.max && !prefersReducedMotion()) {
      const headX = (this._value / this.max) * w;
      const intensity = intensityToMultiplier(this.intensity);
      if (Math.random() < 0.4 * intensity) {
        this.trail.push({
          x: headX,
          y: h / 2,
          vx: randRange(-0.3, 0.6),
          vy: randRange(-0.8, 0.8),
          life: 0,
          maxLife: 30 + Math.random() * 20,
          size: randRange(0.5, 1.6),
        });
      }
    }

    this.ctx.clearRect(0, 0, w, h);
    const accentRgb = (this.shadow.host as HTMLElement).style
      .getPropertyValue('--lumina-accent-rgb')
      .trim() || '124 92 255';

    this.trail = this.trail.filter((p) => p.life < p.maxLife);
    for (const p of this.trail) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // slight gravity
      p.life += 1;
      const a = (1 - p.life / p.maxLife) * 0.8;
      this.ctx.fillStyle = `rgba(${accentRgb} / ${a})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.raf = requestAnimationFrame(this.tick);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-progress': LuminaProgress;
  }
}

if (!customElements.get(LuminaProgress.tagName)) {
  customElements.define(LuminaProgress.tagName, LuminaProgress);
}
