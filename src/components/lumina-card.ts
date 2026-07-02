/**
 * LuminaCard — Morphable card with glass / depth / context-aware glow.
 *
 * The card listens to pointer position over its surface and projects a
 * soft radial light that follows the cursor (parallax sheen). In the
 * `dimensional` variant the card also tilts in 3D based on cursor
 * position (FLIP-friendly, no layout thrashing).
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { intensityToMultiplier, prefersReducedMotion, throttle } from '../core/utils';

export class LuminaCard extends LuminaElement {
  static tagName = 'lumina-card';

  private field: ParticleField | null = null;
  private tiltRaf = 0;
  private targetRX = 0;
  private targetRY = 0;
  private currentRX = 0;
  private currentRY = 0;

  protected render(): string {
    return `
      <article class="lumina-card" part="card">
        <div class="lumina-card__glow" part="glow" aria-hidden="true"></div>
        <div class="lumina-card__field" part="field" aria-hidden="true"></div>
        <div class="lumina-card__glass" part="glass">
          <div class="lumina-card__sheen" part="sheen" aria-hidden="true"></div>
          <div class="lumina-card__inner" part="inner">
            <slot name="media"></slot>
            <div class="lumina-card__body" part="body">
              <slot name="title"></slot>
              <slot name="subtitle"></slot>
              <slot></slot>
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  protected styles(): string {
    return `
      :host {
        --lumina-card-radius: var(--lumina-radius-lg);
        display: block;
        position: relative;
        border-radius: var(--lumina-card-radius);
        color: var(--lumina-text);
        perspective: 800px;
      }

      .lumina-card {
        position: relative;
        display: block;
        border-radius: var(--lumina-card-radius);
        transform-style: preserve-3d;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
        will-change: transform;
      }

      .lumina-card__glow {
        position: absolute;
        inset: -10%;
        border-radius: inherit;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
        background: radial-gradient(
          400px circle at var(--lx, 50%) var(--ly, 50%),
          rgb(var(--lumina-accent-rgb) / calc(0.45 * var(--lumina-intensity))),
          transparent 60%
        );
        filter: blur(30px);
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-card__field {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-card__glass {
        position: relative;
        z-index: 2;
        border-radius: inherit;
        overflow: hidden;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(18px) saturate(1.5);
        -webkit-backdrop-filter: blur(18px) saturate(1.5);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 0 0 rgb(255 255 255 / 0.10),
          var(--lumina-shadow);
        transform: translateZ(0);
      }

      .lumina-card__sheen {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(
          300px circle at var(--lx, 50%) var(--ly, 50%),
          rgb(255 255 255 / calc(0.18 * var(--lumina-intensity))),
          transparent 50%
        );
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
        mix-blend-mode: overlay;
      }

      .lumina-card__inner {
        position: relative;
        padding: 24px;
        transform: translateZ(20px);
      }

      .lumina-card__body {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      ::slotted([slot="title"]) {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      ::slotted([slot="subtitle"]) {
        margin: 0;
        font-size: 12px;
        font-weight: 500;
        color: var(--lumina-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      ::slotted([slot="media"]) {
        display: block;
        width: 100%;
        border-radius: calc(var(--lumina-card-radius) - 6px);
        margin-bottom: 12px;
      }
      ::slotted([slot="footer"]) {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--lumina-border);
      }

      /* Hover state */
      :host(:hover) .lumina-card__glow,
      :host(:hover) .lumina-card__sheen { opacity: 1; }
      :host(:hover) .lumina-card {
        transform: translateY(-4px);
      }

      /* ----- Variant: glass (default styling enhanced) ----- */
      :host([variant="glass"]) .lumina-card__glass {
        background:
          linear-gradient(135deg,
            rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.05)) 0%,
            rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)) 100%
          );
      }

      /* ----- Variant: morph ----- */
      :host([variant="morph"]) .lumina-card {
        clip-path: polygon(
          0 8%, 8% 0, 92% 0, 100% 8%,
          100% 92%, 92% 100%, 8% 100%, 0 92%
        );
        border-radius: 0;
        transition: clip-path var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([variant="morph"]:hover) .lumina-card {
        clip-path: polygon(
          0 0, 100% 0, 100% 100%, 0 100%
        );
      }
      :host([variant="morph"]) .lumina-card__glass { border-radius: 0; }

      /* ----- Variant: neural ----- */
      :host([variant="neural"]) .lumina-card__field { opacity: 0.4; }
      :host([variant="neural"]) .lumina-card__glass {
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1));
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }
      :host([variant="neural"]) .lumina-card__inner {
        text-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.5);
      }

      /* ----- Variant: void ----- */
      :host([variant="void"]) .lumina-card__field { opacity: 0.8; }
      :host([variant="void"]) .lumina-card__glass {
        background: rgb(0 0 0 / 0.5);
        backdrop-filter: blur(6px);
        border-color: rgb(var(--lumina-accent-rgb) / 0.2);
      }

      /* ----- Variant: aura ----- */
      :host([variant="aura"]) .lumina-card__field { opacity: 0.4; }
      :host([variant="aura"]) .lumina-card__glow {
        opacity: calc(0.25 * var(--lumina-intensity));
      }
      :host([variant="aura"]) .lumina-card {
        animation: lumina-card-float 5s ease-in-out infinite;
      }
      :host([variant="aura"]) .lumina-card__glass {
        background:
          radial-gradient(120% 100% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.18),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%
          );
      }

      /* ----- Variant: dimensional ----- */
      :host([variant="dimensional"]) .lumina-card {
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"]) .lumina-card__inner {
        transform: translateZ(40px);
      }
      :host([variant="dimensional"]) .lumina-card__glass::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(135deg,
          rgb(var(--lumina-accent-rgb) / 0.18),
          transparent 60%
        );
        pointer-events: none;
      }
      :host([variant="dimensional"]) .lumina-card__glass {
        box-shadow:
          0 calc(var(--lumina-depth) * 0.5) 0 calc(var(--lumina-depth) * -0.3)
            rgb(var(--lumina-accent-rgb) / 0.4),
          var(--lumina-shadow);
      }

      @keyframes lumina-card-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-card,
        .lumina-card__glow,
        .lumina-card__sheen {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }

  protected mounted(): void {
    this.addEventListener('pointermove', this.onPointerMove);
    this.addEventListener('pointerleave', this.onPointerLeave);
    this.maybeInitField();
  }

  protected unmounted(): void {
    this.removeEventListener('pointermove', this.onPointerMove);
    this.removeEventListener('pointerleave', this.onPointerLeave);
    this.field?.destroy();
    this.field = null;
    cancelAnimationFrame(this.tiltRaf);
  }

  protected onConfigChange(changed: Partial<LuminaElementAttributes>): void {
    if (changed.variant || changed.intensity) {
      this.field?.destroy();
      this.field = null;
      this.maybeInitField();
    }
  }

  private maybeInitField(): void {
    const v = this.variant;
    const needsField = v === 'neural' || v === 'void' || v === 'aura';
    if (!needsField) return;

    const slot = this.$$('.lumina-card__field');
    if (!slot) return;

    const accentRgb = (this.shadow.host as HTMLElement).style
      .getPropertyValue('--lumina-accent-rgb')
      .trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);

    this.field = new ParticleField(this.shadow.host as HTMLElement, {
      count: Math.round(40 * intensity),
      rgb: accentRgb,
      sizeRange: [0.6, 2.2],
      speedRange: [0.15, 0.5],
      lifeRange: [120, 220],
      connect: v === 'neural',
      starfield: v === 'void',
    });
    this.field.mount(slot);
  }

  private onPointerMove = throttle((e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.setProperty('--lx', `${x}%`);
    this.style.setProperty('--ly', `${y}%`);

    // 3D tilt only for dimensional variant
    if (this.variant === 'dimensional' && !prefersReducedMotion()) {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      this.targetRY = px * 18; // yaw
      this.targetRX = -py * 18; // pitch
      if (!this.tiltRaf) this.tickTilt();
    }
  }, 16);

  private onPointerLeave = (): void => {
    this.targetRX = 0;
    this.targetRY = 0;
    if (!this.tiltRaf) this.tickTilt();
  };

  private tickTilt = (): void => {
    this.currentRX += (this.targetRX - this.currentRX) * 0.18;
    this.currentRY += (this.targetRY - this.currentRY) * 0.18;
    const card = this.$$('.lumina-card');
    if (card) {
      card.style.transform = `perspective(800px) rotateX(${this.currentRX}deg) rotateY(${this.currentRY}deg) translateY(-4px)`;
    }
    if (
      Math.abs(this.targetRX - this.currentRX) > 0.05 ||
      Math.abs(this.targetRY - this.currentRY) > 0.05
    ) {
      this.tiltRaf = requestAnimationFrame(this.tickTilt);
    } else {
      this.tiltRaf = 0;
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-card': LuminaCard;
  }
}

if (!customElements.get(LuminaCard.tagName)) {
  customElements.define(LuminaCard.tagName, LuminaCard);
}
