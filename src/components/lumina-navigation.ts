/**
 * LuminaNavigation — Adaptive top nav with morphing active indicator.
 *
 * The active item is tracked via the `active` attribute on `<lumina-nav-item>`.
 * When it changes, the glowing indicator FLIP-animates from the previous
 * position to the new one. Proximity-aware glow follows the cursor.
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion, throttle } from '../core/utils';

export class LuminaNavigation extends LuminaElement {
  static tagName = 'lumina-navigation';

  private indicator: HTMLElement | null = null;
  private items: HTMLElement[] = [];
  private currentActive: HTMLElement | null = null;
  private glow: HTMLElement | null = null;

  protected render(): string {
    return `
      <nav class="lumina-nav" part="root">
        <div class="lumina-nav__glow" part="glow" aria-hidden="true"></div>
        <div class="lumina-nav__bar" part="bar">
          <div class="lumina-nav__indicator" part="indicator" aria-hidden="true"></div>
          <slot></slot>
        </div>
      </nav>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-nav {
        position: relative;
        padding: 12px;
        border-radius: var(--lumina-radius-pill);
      }

      .lumina-nav__glow {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(
          240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))),
          transparent 60%
        );
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lumina-nav__glow { opacity: 1; }

      .lumina-nav__bar {
        position: relative;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 0 0 rgb(255 255 255 / 0.08),
          var(--lumina-shadow);
      }

      .lumina-nav__indicator {
        position: absolute;
        top: 6px;
        left: 6px;
        height: calc(100% - 12px);
        border-radius: var(--lumina-radius-pill);
        background: linear-gradient(135deg,
          rgb(var(--lumina-accent-rgb) / 0.95),
          rgb(var(--lumina-accent-rgb) / 0.65)
        );
        box-shadow:
          0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4),
          inset 0 1px 0 rgb(255 255 255 / 0.25);
        opacity: 0;
        transition:
          transform var(--lumina-speed) var(--lumina-ease-spring),
          width var(--lumina-speed) var(--lumina-ease-spring),
          opacity var(--lumina-speed) var(--lumina-ease-out);
        z-index: 0;
        pointer-events: none;
      }
      .lumina-nav__indicator[data-active] { opacity: 1; }

      ::slotted(lumina-nav-item) {
        position: relative;
        z-index: 1;
      }

      /* Variant: void */
      :host([variant="void"]) .lumina-nav__bar {
        background: rgb(0 0 0 / 0.55);
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }

      /* Variant: morph */
      :host([variant="morph"]) .lumina-nav__indicator {
        border-radius: 8px;
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-nav__indicator,
        .lumina-nav__glow { transition: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.indicator = this.$$('.lumina-nav__indicator');
    this.glow = this.$$('.lumina-nav__glow');

    this.items = Array.from(this.querySelectorAll('lumina-nav-item')) as HTMLElement[];
    this.items.forEach((item) => {
      item.addEventListener('click', () => this.setActive(item));
    });

    // Set initial active
    const initial = this.items.find((i) => i.hasAttribute('active')) ?? this.items[0];
    if (initial) {
      requestAnimationFrame(() => this.positionIndicator(initial, false));
    }

    this.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('resize', this.onResize);
  }

  protected unmounted(): void {
    this.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('resize', this.onResize);
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  private setActive(item: HTMLElement): void {
    this.items.forEach((i) => i.removeAttribute('active'));
    item.setAttribute('active', '');
    this.positionIndicator(item, true);
    this.dispatchEvent(
      new CustomEvent('lumina-nav-change', {
        detail: { value: item.getAttribute('value') ?? item.textContent?.trim() },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private positionIndicator(item: HTMLElement, animate: boolean): void {
    if (!this.indicator) return;
    const bar = this.$$('.lumina-nav__bar');
    if (!bar) return;
    const barRect = bar.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const x = itemRect.left - barRect.left;
    const w = itemRect.width;
    if (animate) {
      this.indicator.style.transition = '';
    } else if (prefersReducedMotion()) {
      this.indicator.style.transition = 'none';
    }
    this.indicator.style.transform = `translateX(${x - 6}px)`;
    this.indicator.style.width = `${w}px`;
    this.indicator.setAttribute('data-active', '');
    this.currentActive = item;
  }

  private onPointerMove = throttle((e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    this.style.setProperty('--lx', `${x}%`);
  }, 16);

  private onResize = (): void => {
    if (this.currentActive) this.positionIndicator(this.currentActive, false);
  };
}

/* The nav item itself is a tiny inline custom element for ergonomic slotted markup. */
export class LuminaNavItem extends HTMLElement {
  static tagName = 'lumina-nav-item';

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host {
        display: inline-flex;
        align-items: center;
        height: 38px;
        padding: 0 16px;
        border-radius: var(--lumina-radius-pill);
        color: var(--lumina-text-muted);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        transition: color var(--lumina-speed) var(--lumina-ease-out);
        white-space: nowrap;
      }
      :host(:hover) { color: var(--lumina-text); }
      :host([active]) { color: #fff; font-weight: 600; }
      :host(:focus-visible) {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 2px;
      }
      ::slotted(*) { pointer-events: none; }
    `);
    root.adoptedStyleSheets = [sheet];
    root.innerHTML = '<slot></slot>';
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');

    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-navigation': LuminaNavigation;
    'lumina-nav-item': LuminaNavItem;
  }
}

if (!customElements.get(LuminaNavigation.tagName)) {
  customElements.define(LuminaNavigation.tagName, LuminaNavigation);
}
if (!customElements.get(LuminaNavItem.tagName)) {
  customElements.define(LuminaNavItem.tagName, LuminaNavItem);
}
