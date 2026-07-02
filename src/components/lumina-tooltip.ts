/**
 * LuminaTooltip — Contextual popover with smart positioning.
 *
 * Triggered by hover/focus on the slotted element. The tooltip flips to
 * the opposite side if it would overflow the viewport, and the arrow
 * follows the trigger's centroid. Rich content (HTML) is supported via
 * the `content` slot.
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';
import { formFieldSharedStyles } from '../core/form-field-mixin';

type Side = 'top' | 'bottom' | 'left' | 'right';

export class LuminaTooltip extends LuminaElement {
  static tagName = 'lumina-tooltip';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'content', 'side', 'delay'];
  }

  private bubble: HTMLElement | null = null;
  private arrow: HTMLElement | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private _visible = false;

  protected render(): string {
    return `
      <span class="lumina-tooltip" part="root">
        <slot></slot>
        <span class="lumina-tooltip__bubble" part="bubble" role="tooltip" aria-hidden="true">
          <span class="lumina-tooltip__glow" part="glow" aria-hidden="true"></span>
          <span class="lumina-tooltip__arrow" part="arrow" aria-hidden="true"></span>
          <span class="lumina-tooltip__content" part="content">
            <slot name="content">${this.getAttribute('content') ?? ''}</slot>
          </span>
        </span>
      </span>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: inline-block;
        position: relative;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-tooltip {
        position: relative;
        display: inline-block;
      }

      .lumina-tooltip__bubble {
        position: absolute;
        z-index: 1000;
        padding: 8px 12px;
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.2));
        backdrop-filter: blur(18px) saturate(1.6);
        -webkit-backdrop-filter: blur(18px) saturate(1.6);
        border: 1px solid var(--lumina-border);
        box-shadow:
          0 10px 30px -10px rgb(0 0 0 / 0.5),
          inset 0 1px 0 rgb(255 255 255 / 0.08);
        font-size: 13px;
        font-weight: 500;
        color: var(--lumina-text);
        max-width: 260px;
        opacity: 0;
        pointer-events: none;
        transform: scale(0.85);
        transition:
          opacity var(--lumina-speed) var(--lumina-ease-out),
          transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lumina-tooltip__bubble[data-visible] {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1);
      }

      .lumina-tooltip__glow {
        position: absolute;
        inset: -8px;
        border-radius: inherit;
        background: radial-gradient(circle,
          rgb(var(--lumina-accent-rgb) / calc(0.4 * var(--lumina-intensity))),
          transparent 70%
        );
        filter: blur(12px);
        opacity: 0;
        z-index: -1;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lumina-tooltip__bubble[data-visible] .lumina-tooltip__glow { opacity: 1; }

      .lumina-tooltip__arrow {
        position: absolute;
        width: 10px;
        height: 10px;
        background: inherit;
        border: inherit;
        backdrop-filter: inherit;
        transform: rotate(45deg);
        z-index: -1;
      }

      .lumina-tooltip__content {
        position: relative;
        display: block;
      }

      /* Side variants — base position; JS adjusts at runtime */
      [data-side="top"] {
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%) scale(0.85);
        transform-origin: bottom center;
      }
      [data-side="top"][data-visible] { transform: translateX(-50%) scale(1); }

      [data-side="bottom"] {
        top: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%) scale(0.85);
        transform-origin: top center;
      }
      [data-side="bottom"][data-visible] { transform: translateX(-50%) scale(1); }

      [data-side="left"] {
        right: calc(100% + 10px);
        top: 50%;
        transform: translateY(-50%) scale(0.85);
        transform-origin: right center;
      }
      [data-side="left"][data-visible] { transform: translateY(-50%) scale(1); }

      [data-side="right"] {
        left: calc(100% + 10px);
        top: 50%;
        transform: translateY(-50%) scale(0.85);
        transform-origin: left center;
      }
      [data-side="right"][data-visible] { transform: translateY(-50%) scale(1); }

      /* Arrow positions per side */
      [data-side="top"] .lumina-tooltip__arrow {
        bottom: -5px;
        left: 50%;
        margin-left: -5px;
        border-top: none;
        border-left: none;
      }
      [data-side="bottom"] .lumina-tooltip__arrow {
        top: -5px;
        left: 50%;
        margin-left: -5px;
        border-bottom: none;
        border-right: none;
      }
      [data-side="left"] .lumina-tooltip__arrow {
        right: -5px;
        top: 50%;
        margin-top: -5px;
        border-left: none;
        border-bottom: none;
      }
      [data-side="right"] .lumina-tooltip__arrow {
        left: -5px;
        top: 50%;
        margin-top: -5px;
        border-right: none;
        border-top: none;
      }


      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) {
        .lumina-tooltip__bubble { transition: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.bubble = this.$$('.lumina-tooltip__bubble');
    this.arrow = this.$$('.lumina-tooltip__arrow');

    const side = (this.getAttribute('side') ?? 'top') as Side;
    this.bubble?.setAttribute('data-side', side);

    this.addEventListener('pointerenter', this.onEnter);
    this.addEventListener('pointerleave', this.onLeave);
    this.addEventListener('focusin', this.onEnter);
    this.addEventListener('focusout', this.onLeave);
  }

  protected unmounted(): void {
    this.removeEventListener('pointerenter', this.onEnter);
    this.removeEventListener('pointerleave', this.onLeave);
    this.removeEventListener('focusin', this.onEnter);
    this.removeEventListener('focusout', this.onLeave);
    if (this.showTimer) clearTimeout(this.showTimer);
    if (this.hideTimer) clearTimeout(this.hideTimer);
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  private onEnter = (): void => {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    const delay = parseInt(this.getAttribute('delay') ?? '200', 10);
    this.showTimer = setTimeout(() => this.show(), delay);
  };

  private onLeave = (): void => {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    this.hideTimer = setTimeout(() => this.hide(), 80);
  };

  private show(): void {
    if (!this.bubble || this._visible) return;
    this._visible = true;
    this.bubble.setAttribute('data-visible', '');
    this.bubble.setAttribute('aria-hidden', 'false');
    if (!prefersReducedMotion()) this.reposition();
  }

  private hide(): void {
    if (!this.bubble || !this._visible) return;
    this._visible = false;
    this.bubble.removeAttribute('data-visible');
    this.bubble.setAttribute('aria-hidden', 'true');
  }

  /** Clamp the bubble inside the viewport, flipping the side if needed. */
  private reposition(): void {
    if (!this.bubble) return;
    const side = (this.bubble.getAttribute('data-side') ?? 'top') as Side;
    const rect = this.bubble.getBoundingClientRect();
    const margin = 8;

    let newSide = side;
    if (side === 'top' && rect.top < margin) newSide = 'bottom';
    if (side === 'bottom' && rect.bottom + margin > window.innerHeight) newSide = 'top';
    if (side === 'left' && rect.left < margin) newSide = 'right';
    if (side === 'right' && rect.right + margin > window.innerWidth) newSide = 'left';

    if (newSide !== side) {
      this.bubble.setAttribute('data-side', newSide);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-tooltip': LuminaTooltip;
  }
}

if (!customElements.get(LuminaTooltip.tagName)) {
  customElements.define(LuminaTooltip.tagName, LuminaTooltip);
}
