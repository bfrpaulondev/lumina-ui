/**
 * LuminaButton — Morphing button with particle bursts.
 *
 * Variants:
 *   - glass       : frosted glass with subtle glow rim
 *   - morph       : clip-path morph between pill ↔ squircle on hover
 *   - neural      : neural-network particle field behind translucent body
 *   - void        : starfield + chromatic-aberration ring
 *   - aura        : floating aura + soft particles
 *   - dimensional : 3D extrude with parallax sheen
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { intensityToMultiplier, prefersReducedMotion } from '../core/utils';

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export class LuminaButton extends LuminaElement {
  static tagName = 'lumina-button';

  private field: ParticleField | null = null;
  private burstCanvas: HTMLCanvasElement | null = null;
  private burstCtx: CanvasRenderingContext2D | null = null;
  private burstParticles: BurstParticle[] = [];
  private burstRaf = 0;
  private contentSlot: HTMLElement | null = null;

  /* ---------------------------------------------------------------- */
  /* Rendering                                                        */
  /* ---------------------------------------------------------------- */

  protected render(): string {
    return `
      <span class="lumina-btn__shell" part="shell">
        <span class="lumina-btn__bg" part="bg"></span>
        <span class="lumina-btn__ring" part="ring" aria-hidden="true"></span>
        <span class="lumina-btn__aura" part="aura" aria-hidden="true"></span>
        <span class="lumina-btn__field" part="field" aria-hidden="true"></span>
        <canvas class="lumina-btn__burst" part="burst" aria-hidden="true"></canvas>
        <span class="lumina-btn__sheen" part="sheen" aria-hidden="true"></span>
        <span class="lumina-btn__content" part="content">
          <slot></slot>
        </span>
      </span>
    `;
  }

  protected styles(): string {
    return `
      :host {
        --lumina-btn-h: 48px;
        --lumina-btn-px: 22px;
        display: inline-block;
        position: relative;
        cursor: pointer;
        outline: none;
        border-radius: var(--lumina-radius-pill);
        font-family: var(--lumina-font-sans);
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.02em;
        color: var(--lumina-text);
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      :host([disabled]) { cursor: not-allowed; opacity: 0.5; filter: saturate(0.4); }
      :host([disabled]) .lumina-btn__shell { pointer-events: none; }

      .lumina-btn__shell {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: var(--lumina-btn-h);
        padding: 0 var(--lumina-btn-px);
        border-radius: inherit;
        overflow: hidden;
        transition:
          transform var(--lumina-speed) var(--lumina-ease-spring),
          border-radius var(--lumina-speed) var(--lumina-ease-spring),
          box-shadow var(--lumina-speed) var(--lumina-ease-out);
        transform-style: preserve-3d;
        will-change: transform;
        isolation: isolate;
      }

      .lumina-btn__bg {
        position: absolute;
        inset: 0;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
        border-radius: inherit;
        z-index: 0;
        transition: background var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-btn__ring {
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        pointer-events: none;
        z-index: 1;
        opacity: 0.35;
        background:
          conic-gradient(
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
        padding: 1px;
        animation: lumina-btn-spin 6s linear infinite;
        animation-play-state: paused;
      }

      .lumina-btn__aura {
        position: absolute;
        inset: -20%;
        border-radius: inherit;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
        background: radial-gradient(
          60% 60% at 50% 50%,
          rgb(var(--lumina-accent-rgb) / 0.45) 0%,
          transparent 70%
        );
        filter: blur(20px);
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-btn__field {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-btn__burst {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 3;
      }

      .lumina-btn__sheen {
        position: absolute;
        top: 0;
        left: -120%;
        width: 60%;
        height: 100%;
        background: linear-gradient(
          100deg,
          transparent 0%,
          rgb(255 255 255 / 0.25) 50%,
          transparent 100%
        );
        transform: skewX(-18deg);
        pointer-events: none;
        z-index: 2;
        opacity: 0;
      }

      .lumina-btn__content {
        position: relative;
        z-index: 4;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        text-shadow: 0 1px 6px rgb(0 0 0 / 0.25);
      }

      /* ----- Interactions ----- */
      :host(:hover) .lumina-btn__shell {
        transform: translateY(-2px) scale(1.02);
      }
      :host(:hover) .lumina-btn__ring { animation-play-state: running; opacity: 0.7; }
      :host(:hover) .lumina-btn__aura { opacity: calc(0.5 * var(--lumina-intensity)); }
      :host(:hover) .lumina-btn__field { opacity: 1; }
      :host(:hover) .lumina-btn__sheen {
        opacity: 1;
        left: 120%;
        transition: left calc(var(--lumina-speed) * 2.2) var(--lumina-ease-in-out),
                    opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      :host(:active) .lumina-btn__shell {
        transform: translateY(0) scale(0.97);
      }

      :host(:focus-visible) .lumina-btn__ring {
        animation-play-state: running;
        opacity: 1;
      }
      :host(:focus-visible) {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 4px;
      }

      /* ----- Variant: glass ----- */
      :host([variant="glass"]) .lumina-btn__bg {
        background:
          linear-gradient(135deg,
            rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.1)) 0%,
            rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1)) 100%
          );
        box-shadow:
          inset 0 1px 0 0 rgb(255 255 255 / 0.18),
          inset 0 -1px 0 0 rgb(0 0 0 / 0.15),
          var(--lumina-shadow);
      }

      /* ----- Variant: morph ----- */
      :host([variant="morph"]) .lumina-btn__shell {
        border-radius: var(--lumina-radius-pill);
        clip-path: polygon(
          12% 0, 88% 0, 100% 30%, 100% 70%, 88% 100%, 12% 100%, 0 70%, 0 30%
        );
        transition:
          clip-path var(--lumina-speed) var(--lumina-ease-spring),
          transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([variant="morph"]:hover) .lumina-btn__shell {
        clip-path: polygon(
          0 0, 100% 0, 100% 100%, 0 100%
        );
      }
      :host([variant="morph"]) .lumina-btn__bg {
        background:
          linear-gradient(135deg,
            rgb(var(--lumina-accent-rgb) / 0.8),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha))
          );
      }

      /* ----- Variant: neural ----- */
      :host([variant="neural"]) .lumina-btn__field { opacity: 0.7; }
      :host([variant="neural"]) .lumina-btn__bg {
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1));
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }
      :host([variant="neural"]) .lumina-btn__content {
        text-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.8);
      }

      /* ----- Variant: void ----- */
      :host([variant="void"]) .lumina-btn__field { opacity: 1; }
      :host([variant="void"]) .lumina-btn__bg {
        background: rgb(0 0 0 / 0.6);
        backdrop-filter: blur(8px);
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }
      :host([variant="void"]) .lumina-btn__ring {
        opacity: 0.6;
        animation-play-state: running;
      }
      :host([variant="void"]) .lumina-btn__content {
        color: var(--lumina-accent);
        text-shadow:
          0 0 4px var(--lumina-accent),
          -1px 0 1px rgb(255 0 80 / 0.6),
          1px 0 1px rgb(0 200 255 / 0.6);
      }

      /* ----- Variant: aura ----- */
      :host([variant="aura"]) .lumina-btn__aura { opacity: calc(0.3 * var(--lumina-intensity)); }
      :host([variant="aura"]) .lumina-btn__field { opacity: 0.6; }
      :host([variant="aura"]) .lumina-btn__bg {
        background:
          radial-gradient(120% 80% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.3),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%
          );
      }
      :host([variant="aura"]) .lumina-btn__shell {
        animation: lumina-btn-float 4s ease-in-out infinite;
      }

      /* ----- Variant: dimensional ----- */
      :host([variant="dimensional"]) .lumina-btn__shell {
        transform: perspective(400px) rotateX(0deg) translateZ(0);
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"]:hover) .lumina-btn__shell {
        transform: perspective(400px) rotateX(8deg) translateZ(calc(var(--lumina-depth) * 0.5));
      }
      :host([variant="dimensional"]) .lumina-btn__bg {
        background:
          linear-gradient(180deg,
            rgb(var(--lumina-accent-rgb) / 0.85),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha))
          );
        box-shadow:
          0 calc(var(--lumina-depth) * 0.6) 0 calc(var(--lumina-depth) * -0.4)
            rgb(var(--lumina-accent-rgb) / 0.5),
          var(--lumina-shadow);
      }
      :host([variant="dimensional"]) .lumina-btn__bg::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(115deg, transparent 30%, rgb(255 255 255 / 0.25) 50%, transparent 70%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host([variant="dimensional"]:hover) .lumina-btn__bg::after { opacity: 1; }

      /* ----- Animation keyframes ----- */
      @keyframes lumina-btn-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes lumina-btn-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-btn__shell,
        .lumina-btn__ring,
        .lumina-btn__aura,
        .lumina-btn__sheen {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }

  /* ---------------------------------------------------------------- */
  /* Lifecycle                                                        */
  /* ---------------------------------------------------------------- */

  protected mounted(): void {
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', this.getAttribute('disabled') === '' ? '-1' : '0');

    this.contentSlot = this.$$('.lumina-btn__content');

    // Wire interaction events
    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeyDown);
    this.addEventListener('pointerenter', this.onPointerEnter);
    this.addEventListener('pointerleave', this.onPointerLeave);

    this.maybeInitField();
    this.initBurstCanvas();
  }

  protected unmounted(): void {
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('keydown', this.onKeyDown);
    this.removeEventListener('pointerenter', this.onPointerEnter);
    this.removeEventListener('pointerleave', this.onPointerLeave);
    this.field?.destroy();
    this.field = null;
    cancelAnimationFrame(this.burstRaf);
  }

  protected onConfigChange(changed: Partial<LuminaElementAttributes>): void {
    if (changed.variant) {
      // Tear down & rebuild the particle field for the new variant
      this.field?.destroy();
      this.field = null;
      this.maybeInitField();
    }
    if (changed.intensity && this.field) {
      this.field?.destroy();
      this.field = null;
      this.maybeInitField();
    }
  }

  /* ---------------------------------------------------------------- */
  /* Particle field                                                   */
  /* ---------------------------------------------------------------- */

  private maybeInitField(): void {
    const v = this.variant;
    const needsField = v === 'neural' || v === 'void' || v === 'aura';
    if (!needsField) return;

    const slot = this.$$('.lumina-btn__field');
    if (!slot) return;

    const accentRgb = (this.shadow.host as HTMLElement).style
      .getPropertyValue('--lumina-accent-rgb')
      .trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);

    this.field = new ParticleField(this.shadow.host as HTMLElement, {
      count: Math.round(20 * intensity),
      rgb: accentRgb,
      sizeRange: [0.6, 2.2],
      speedRange: [0.15, 0.6],
      lifeRange: [80, 160],
      connect: v === 'neural',
      starfield: v === 'void',
      hueRange: [200, 320],
    });
    this.field.mount(slot);
  }

  /* ---------------------------------------------------------------- */
  /* Click burst particles                                            */
  /* ---------------------------------------------------------------- */

  private initBurstCanvas(): void {
    this.burstCanvas = this.$$('.lumina-btn__burst') as HTMLCanvasElement | null;
    if (!this.burstCanvas) return;
    this.burstCtx = this.burstCanvas.getContext('2d');
  }

  private onClick = (e: MouseEvent): void => {
    if (this.getAttribute('disabled') !== null) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.spawnBurst(e.offsetX, e.offsetY);
    this.dispatchEvent(
      new CustomEvent('lumina-press', { bubbles: true, composed: true }),
    );
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.spawnBurst(
        this.clientWidth / 2,
        this.clientHeight / 2,
      );
      this.dispatchEvent(
        new CustomEvent('lumina-press', { bubbles: true, composed: true }),
      );
    }
  };

  private spawnBurst(cx: number, cy: number): void {
    if (prefersReducedMotion() || !this.burstCtx || !this.burstCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth;
    const h = this.clientHeight;
    this.burstCanvas.width = w * dpr;
    this.burstCanvas.height = h * dpr;
    this.burstCanvas.style.width = `${w}px`;
    this.burstCanvas.style.height = `${h}px`;
    this.burstCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const accentRgb = (this.shadow.host as HTMLElement).style
      .getPropertyValue('--lumina-accent-rgb')
      .trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    const count = Math.round(18 * intensity);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 2 + Math.random() * 4 * intensity;
      this.burstParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        size: 1.5 + Math.random() * 2.5,
      });
    }
    if (!this.burstRaf) this.tickBurst(accentRgb);
  }

  private tickBurst = (rgb: string): void => {
    if (!this.burstCtx || !this.burstCanvas) return;
    const ctx = this.burstCtx;
    ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);

    this.burstParticles = this.burstParticles.filter((p) => p.life < p.maxLife);
    for (const p of this.burstParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life += 1;
      const a = 1 - p.life / p.maxLife;
      ctx.fillStyle = `rgba(${rgb} / ${a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0, p.size * a), 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.burstParticles.length > 0) {
      this.burstRaf = requestAnimationFrame(() => this.tickBurst(rgb));
    } else {
      this.burstRaf = 0;
      ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Pointer tracking (aura follow)                                   */
  /* ---------------------------------------------------------------- */

  private onPointerEnter = (): void => {
    if (this.variant === 'aura' && this.contentSlot) {
      this.contentSlot.style.transition = 'transform var(--lumina-speed) var(--lumina-ease-spring)';
    }
  };

  private onPointerLeave = (): void => {
    if (this.contentSlot) {
      this.contentSlot.style.transform = '';
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-button': LuminaButton;
  }
}

if (!customElements.get(LuminaButton.tagName)) {
  customElements.define(LuminaButton.tagName, LuminaButton);
}
