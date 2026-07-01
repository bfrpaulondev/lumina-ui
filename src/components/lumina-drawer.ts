/**
 * LuminaDrawer — Gaveta lateral com slide+blur no backdrop,
 * swipe-to-close no mobile, focus trap e tamanhos sm/md/lg/full.
 *
 * Variants: glass | void | dimensional
 *
 * Uso:
 *   <lumina-drawer open placement="right" size="md" variant="glass">
 *     <h2 slot="header">Filtros</h2>
 *     <p>Conteúdo do drawer...</p>
 *   </lumina-drawer>
 *
 * Eventos:
 *   lumina-open  — disparado ao abrir
 *   lumina-close — disparado ao fechar
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { coerceAttr, prefersReducedMotion } from '../core/utils';

const PLACEMENTS = ['left', 'right'] as const;
type Placement = (typeof PLACEMENTS)[number];

const SIZES = ['sm', 'md', 'lg', 'full'] as const;
type Size = (typeof SIZES)[number];

const SIZE_WIDTH: Record<Size, string> = {
  sm: '320px',
  md: '420px',
  lg: '560px',
  full: '100vw',
};

export class LuminaDrawer extends LuminaElement {
  static tagName = 'lumina-drawer';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'open',
      'placement',
      'size',
    ];
  }

  private backdrop: HTMLElement | null = null;
  private panel: HTMLElement | null = null;
  private _open = false;
  private _placement: Placement = 'left';
  private _size: Size = 'md';
  private previouslyFocused: HTMLElement | null = null;
  private swipeStartX = 0;
  private swipeCurrentX = 0;
  private swiping = false;

  get open(): boolean { return this._open; }
  set open(v: boolean) {
    if (v) this.show();
    else this.hide();
  }

  get placement(): Placement { return this._placement; }
  set placement(v: Placement) {
    this._placement = v;
    this.setAttribute('placement', v);
    
  }

  get size(): Size { return this._size; }
  set size(v: Size) {
    this._size = v;
    this.setAttribute('size', v);
    
  }

  protected render(): string {
    return `
      <div class="lmd" part="backdrop" aria-hidden="true"></div>
      <aside class="lmd__drawer" part="drawer" role="dialog" aria-modal="true">
        <header class="lmd__header" part="header">
          <slot name="header"><span class="lmd__default-title">Drawer</span></slot>
          <button class="lmd__close" part="close" type="button" aria-label="Fechar">×</button>
        </header>
        <div class="lmd__content" part="content">
          <slot></slot>
        </div>
      </aside>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: contents;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        --lmd-width: 420px;
      }

      .lmd {
        position: fixed;
        inset: 0;
        background: rgb(0 0 0 / 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        opacity: 0;
        pointer-events: none;
        z-index: 999;
        transition: opacity calc(var(--lumina-speed) * 1.4) var(--lumina-ease-out);
      }
      :host([data-open]) .lmd {
        opacity: 1;
        pointer-events: auto;
      }

      .lmd__drawer {
        position: fixed;
        top: 0;
        bottom: 0;
        width: var(--lmd-width);
        max-width: 100vw;
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.1));
        backdrop-filter: blur(24px) saturate(1.6);
        -webkit-backdrop-filter: blur(24px) saturate(1.6);
        border: 1px solid var(--lumina-border);
        box-shadow:
          0 0 80px -20px rgb(0 0 0 / 0.7),
          inset 0 1px 0 0 rgb(255 255 255 / 0.10);
        display: flex;
        flex-direction: column;
        z-index: 1000;
        transition: transform calc(var(--lumina-speed) * 1.4) var(--lumina-ease-spring);
        will-change: transform;
        touch-action: pan-y;
      }

      :host([placement="left"]) .lmd__drawer {
        left: 0;
        transform: translateX(-105%);
        border-left: 0;
        border-right: 1px solid var(--lumina-border);
      }
      :host([placement="right"]) .lmd__drawer {
        right: 0;
        transform: translateX(105%);
        border-right: 0;
        border-left: 1px solid var(--lumina-border);
      }
      :host([data-open]) .lmd__drawer {
        transform: translateX(0);
      }
      :host([data-swiping]) .lmd__drawer {
        transition: none;
      }

      .lmd__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--lumina-border);
        flex-shrink: 0;
      }
      ::slotted([slot="header"]) {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
      }
      .lmd__default-title { font-size: 16px; font-weight: 700; }

      .lmd__close {
        appearance: none;
        border: 0;
        background: rgb(255 255 255 / 0.06);
        color: var(--lumina-text);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.2s;
      }
      .lmd__close:hover {
        background: rgb(var(--lumina-accent-rgb) / 0.3);
        transform: rotate(90deg);
      }
      .lmd__close:focus-visible {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 2px;
      }

      .lmd__content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      /* Variant: void — pure black + neon edge */
      :host([variant="void"]) .lmd__drawer {
        background: rgb(0 0 0 / 0.85);
        backdrop-filter: blur(8px);
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }
      :host([variant="void"]) .lmd__header {
        border-color: rgb(var(--lumina-accent-rgb) / 0.2);
      }

      /* Variant: dimensional — entrance with rotateY */
      :host([variant="dimensional"]) .lmd__drawer {
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"][placement="left"]) .lmd__drawer {
        transform: translateX(-105%) perspective(1200px) rotateY(35deg);
        transform-origin: right center;
      }
      :host([variant="dimensional"][placement="right"]) .lmd__drawer {
        transform: translateX(105%) perspective(1200px) rotateY(-35deg);
        transform-origin: left center;
      }
      :host([variant="dimensional"][data-open]) .lmd__drawer {
        transform: translateX(0) perspective(1200px) rotateY(0deg);
      }

      @media (prefers-reduced-motion: reduce) {
        .lmd, .lmd__drawer, .lmd__close {
          transition: none !important;
          animation: none !important;
        }
      }

      @media (max-width: 600px) {
        :host { --lmd-width: 100vw; }
        .lmd__drawer { width: 100vw !important; }
      }
    `;
  }

  protected mounted(): void {
    this.backdrop = this.$$('.lmd');
    this.panel = this.$$('.lmd__drawer');

    this._placement = coerceAttr(this.getAttribute('placement'), PLACEMENTS, 'left');
    this._size = coerceAttr(this.getAttribute('size'), SIZES, 'md');

    this.applyPlacement();
    this.applySize();

    this.backdrop?.addEventListener('click', () => this.hide());
    this.$$('.lmd__close')?.addEventListener('click', () => this.hide());

    // Swipe-to-close (touch)
    this.panel?.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.panel?.addEventListener('touchmove', this.onTouchMove, { passive: true });
    this.panel?.addEventListener('touchend', this.onTouchEnd);

    document.addEventListener('keydown', this.onKeydown);

    if (this.hasAttribute('open')) {
      requestAnimationFrame(() => this.show());
    }
  }

  protected unmounted(): void {
    this.panel?.removeEventListener('touchstart', this.onTouchStart);
    this.panel?.removeEventListener('touchmove', this.onTouchMove);
    this.panel?.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('keydown', this.onKeydown);
    document.body.style.overflow = '';
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'open') {
      if (value !== null) this.show();
      else this.hide();
    } else if (name === 'placement') {
      this._placement = coerceAttr(value, PLACEMENTS, 'left');
      this.applyPlacement();
    } else if (name === 'size') {
      this._size = coerceAttr(value, SIZES, 'md');
      this.applySize();
    }
  }

  private applyPlacement(): void {
    if (this.getAttribute('placement') !== this._placement) this.setAttribute('placement', this._placement);
  }

  private applySize(): void {
    this.style.setProperty('--lmd-width', SIZE_WIDTH[this._size]);
    if (this.getAttribute('size') !== this._size) this.setAttribute('size', this._size);
  }

  /** Public API: open the drawer. */
  public show(): void {
    if (this._open) return;
    this._open = true;
    this.setAttribute('data-open', '');
    this.setAttribute('open', '');
    this.previouslyFocused = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    this.dispatchEvent(new CustomEvent('lumina-open', { bubbles: true, composed: true }));
    // Focus first focusable
    setTimeout(() => this.focusFirst(), 120);
  }

  /** Public API: close the drawer. */
  public hide(): void {
    if (!this._open) return;
    this._open = false;
    this.removeAttribute('data-open');
    this.removeAttribute('open');
    document.body.style.overflow = '';
    this.previouslyFocused?.focus();
    this.dispatchEvent(new CustomEvent('lumina-close', { bubbles: true, composed: true }));
  }

  private focusFirst(): void {
    const focusable = this.shadow.querySelector<HTMLElement>(
      'button, [tabindex]:not([tabindex="-1"]), input, a[href]',
    );
    focusable?.focus();
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (!this._open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.hide();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = Array.from(
        this.shadow.querySelectorAll<HTMLElement>(
          'button, [tabindex]:not([tabindex="-1"]), input, a[href]',
        ),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  /* ---------------------------------------------------------------- */
  /* Swipe-to-close (mobile)                                          */
  /* ---------------------------------------------------------------- */

  private onTouchStart = (e: TouchEvent): void => {
    if (e.touches.length !== 1) return;
    this.swipeStartX = e.touches[0].clientX;
    this.swipeCurrentX = this.swipeStartX;
    this.swiping = true;
    this.setAttribute('data-swiping', '');
  };

  private onTouchMove = (e: TouchEvent): void => {
    if (!this.swiping || e.touches.length !== 1) return;
    this.swipeCurrentX = e.touches[0].clientX;
    const delta = this.swipeCurrentX - this.swipeStartX;
    // Only allow swipe in the closing direction
    const isClosingSwipe =
      (this._placement === 'left' && delta < 0) ||
      (this._placement === 'right' && delta > 0);
    if (!isClosingSwipe) return;
    if (this.panel) {
      this.panel.style.transform = `translateX(${delta}px)`;
    }
  };

  private onTouchEnd = (): void => {
    if (!this.swiping) return;
    this.swiping = false;
    this.removeAttribute('data-swiping');
    const delta = this.swipeCurrentX - this.swipeStartX;
    const threshold = 80;
    const shouldClose =
      (this._placement === 'left' && delta < -threshold) ||
      (this._placement === 'right' && delta > threshold);
    if (this.panel) this.panel.style.transform = '';
    if (shouldClose) this.hide();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-drawer': LuminaDrawer;
  }
}

if (!customElements.get(LuminaDrawer.tagName)) {
  customElements.define(LuminaDrawer.tagName, LuminaDrawer);
}
