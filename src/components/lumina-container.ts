/**
 * LuminaContainer — Adaptive wrapper that influences its children.
 *
 * The container broadcasts a shared ambient context (cursor position,
 * intensity, depth, accent) to its slotted Lumina children by setting
 * CSS variables on itself, which cascade into the shadow roots of all
 * descendants via the inherited `--lumina-*` custom properties.
 *
 * In the `neural` and `aura` variants it also renders a faint
 * background field that reacts to pointer proximity.
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { intensityToMultiplier, prefersReducedMotion, throttle } from '../core/utils';

export class LuminaContainer extends LuminaElement {
  static tagName = 'lumina-container';

  private field: ParticleField | null = null;
  private glow: HTMLElement | null = null;

  protected render(): string {
    return `
      <div class="lumina-container" part="root">
        <div class="lumina-container__glow" part="glow" aria-hidden="true"></div>
        <div class="lumina-container__field" part="field" aria-hidden="true"></div>
        <div class="lumina-container__inner" part="inner">
          <slot></slot>
        </div>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        position: relative;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-container {
        position: relative;
        display: block;
        padding: 32px;
        border-radius: var(--lumina-radius-xl);
        min-height: 80px;
      }

      .lumina-container__glow {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(
          500px circle at var(--lx, 50%) var(--ly, 50%),
          rgb(var(--lumina-accent-rgb) / calc(0.10 * var(--lumina-intensity))),
          transparent 60%
        );
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lumina-container__glow { opacity: 1; }

      .lumina-container__field {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        overflow: hidden;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-container__inner {
        position: relative;
        z-index: 1;
      }

      /* Variants */
      :host([variant="glass"]) .lumina-container {
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1));
        -webkit-backdrop-filter: blur(16px) saturate(1.3);
        backdrop-filter: blur(16px) saturate(1.3);
        -webkit-backdrop-filter: blur(16px) saturate(1.3);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 0 0 rgb(255 255 255 / 0.06),
          var(--lumina-shadow);
      }

      :host([variant="neural"]) .lumina-container__field { opacity: 0.5; }
      :host([variant="neural"]) .lumina-container {
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.15));
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        border: 1px solid rgb(var(--lumina-accent-rgb) / 0.15);
      }

      :host([variant="void"]) .lumina-container__field { opacity: 0.8; }
      :host([variant="void"]) .lumina-container {
        background: rgb(0 0 0 / 0.4);
        -webkit-backdrop-filter: blur(6px);
        backdrop-filter: blur(6px);
        border: 1px solid rgb(var(--lumina-accent-rgb) / 0.2);
      }

      :host([variant="aura"]) .lumina-container__field { opacity: 0.4; }
      :host([variant="aura"]) .lumina-container {
        background:
          radial-gradient(80% 60% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.15),
            rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)) 60%
          );
        -webkit-backdrop-filter: blur(14px);
        backdrop-filter: blur(14px);
        border: 1px solid var(--lumina-border);
      }

      :host([variant="morph"]) .lumina-container {
        clip-path: polygon(
          0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px,
          100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px)
        );
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        -webkit-backdrop-filter: blur(14px);
        backdrop-filter: blur(14px);
        border: 1px solid var(--lumina-border);
      }

      :host([variant="dimensional"]) .lumina-container {
        perspective: 1000px;
        transform-style: preserve-3d;
        background:
          linear-gradient(135deg,
            rgb(var(--lumina-accent-rgb) / 0.05),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha))
          );
        -webkit-backdrop-filter: blur(14px);
        backdrop-filter: blur(14px);
        border: 1px solid var(--lumina-border);
        box-shadow:
          0 calc(var(--lumina-depth) * 0.6) 0 calc(var(--lumina-depth) * -0.4)
            rgb(var(--lumina-accent-rgb) / 0.25),
          var(--lumina-shadow);
      }
      :host([variant="dimensional"]) .lumina-container__inner {
        transform: translateZ(calc(var(--lumina-depth) * 0.4));
        transform-style: preserve-3d;
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-container__glow,
        .lumina-container__field { transition: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.glow = this.$$('.lumina-container__glow');
    this.addEventListener('pointermove', this.onPointerMove);
    this.maybeInitField();
  }

  protected unmounted(): void {
    this.removeEventListener('pointermove', this.onPointerMove);
    this.field?.destroy();
    this.field = null;
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
    const slot = this.$$('.lumina-container__field');
    if (!slot) return;

    const accentRgb = (this.shadow.host as HTMLElement).style
      .getPropertyValue('--lumina-accent-rgb')
      .trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);

    this.field = new ParticleField(this.shadow.host as HTMLElement, {
      count: Math.round(60 * intensity),
      rgb: accentRgb,
      sizeRange: [0.6, 2],
      speedRange: [0.1, 0.4],
      lifeRange: [180, 320],
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

    // Cascade the cursor position to children so they can react too.
    this.style.setProperty('--lumina-cursor-x', `${x}%`);
    this.style.setProperty('--lumina-cursor-y', `${y}%`);
  }, 16);
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-container': LuminaContainer;
  }
}

if (!customElements.get(LuminaContainer.tagName)) {
  customElements.define(LuminaContainer.tagName, LuminaContainer);
}
