/**
 * LuminaModal — Dialog with a dimensional portal open/close transition.
 *
 * On open, the modal scales from 0.6 → 1 with a chromatic ring that
 * expands outward (portal effect). On close, it inverts back. Traps
 * focus and restores it to the previously focused element on close.
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

export class LuminaModal extends LuminaElement {
  static tagName = 'lumina-modal';

  private dialog: HTMLDialogElement | null = null;
  private backdrop: HTMLElement | null = null;
  private portal: HTMLElement | null = null;
  private previouslyFocused: HTMLElement | null = null;
  private _open = false;

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'open', 'closable'];
  }

  get open(): boolean {
    return this._open;
  }
  set open(v: boolean) {
    if (v) this.showModal();
    else this.close();
  }

  protected render(): string {
    return `
      <dialog class="lumina-modal" part="root">
        <div class="lumina-modal__backdrop" part="backdrop" aria-hidden="true"></div>
        <div class="lumina-modal__portal" part="portal" aria-hidden="true"></div>
        <div class="lumina-modal__panel" part="panel">
          <div class="lumina-modal__glass" part="glass">
            <div class="lumina-modal__header" part="header">
              <slot name="title"><h2 class="lumina-modal__title">Modal</h2></slot>
              <button class="lumina-modal__close" part="close" aria-label="Close">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="lumina-modal__body" part="body">
              <slot></slot>
            </div>
            <div class="lumina-modal__footer" part="footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </dialog>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: contents;
      }

      .lumina-modal {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        border: 0;
        padding: 0;
        background: transparent;
        color: var(--lumina-text);
        font-family: var(--lumina-font-sans);
        max-width: none;
        max-height: none;
      }
      .lumina-modal::backdrop { background: transparent; }

      .lumina-modal__backdrop {
        position: absolute;
        inset: 0;
        background: rgb(0 0 0 / 0.6);
        -webkit-backdrop-filter: blur(8px) saturate(0.8);
        backdrop-filter: blur(8px) saturate(0.8);
        -webkit-backdrop-filter: blur(8px) saturate(0.8);
        opacity: 0;
        transition: opacity calc(var(--lumina-speed) * 1.5) var(--lumina-ease-out);
      }

      .lumina-modal__portal {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: radial-gradient(circle,
          rgb(var(--lumina-accent-rgb) / 0.6) 0%,
          rgb(var(--lumina-accent-rgb) / 0.2) 40%,
          transparent 70%
        );
        filter: blur(30px);
        opacity: 0;
        pointer-events: none;
      }

      .lumina-modal__panel {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0.6);
        width: min(92vw, 560px);
        max-height: 86vh;
        opacity: 0;
        transition:
          transform calc(var(--lumina-speed) * 1.4) var(--lumina-ease-spring),
          opacity var(--lumina-speed) var(--lumina-ease-out);
        z-index: 2;
      }

      .lumina-modal__glass {
        position: relative;
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.1));
        -webkit-backdrop-filter: blur(24px) saturate(1.6);
        backdrop-filter: blur(24px) saturate(1.6);
        -webkit-backdrop-filter: blur(24px) saturate(1.6);
        border: 1px solid var(--lumina-border);
        border-radius: var(--lumina-radius-xl);
        box-shadow:
          0 30px 80px -20px rgb(0 0 0 / 0.6),
          inset 0 1px 0 0 rgb(255 255 255 / 0.10);
        overflow: hidden;
      }
      .lumina-modal__glass::before {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        background: conic-gradient(from 0deg,
          transparent 0%,
          rgb(var(--lumina-accent-rgb) / 0.4) 25%,
          transparent 50%,
          rgb(var(--lumina-accent-rgb) / 0.4) 75%,
          transparent 100%
        );
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude;
        padding: 2px;
        animation: lumina-modal-spin 8s linear infinite;
        opacity: 0.6;
        pointer-events: none;
      }

      .lumina-modal__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 20px 24px;
        border-bottom: 1px solid var(--lumina-border);
      }
      .lumina-modal__title { margin: 0; font-size: 18px; font-weight: 700; }
      .lumina-modal__close {
        appearance: none;
        border: 0;
        background: rgb(255 255 255 / 0.06);
        color: var(--lumina-text);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background var(--lumina-speed) var(--lumina-ease-out),
                    transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lumina-modal__close:hover {
        background: rgb(var(--lumina-accent-rgb) / 0.3);
        transform: rotate(90deg);
      }

      .lumina-modal__body {
        padding: 24px;
        overflow-y: auto;
        max-height: calc(86vh - 140px);
      }

      .lumina-modal__footer {
        padding: 16px 24px;
        border-top: 1px solid var(--lumina-border);
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .lumina-modal__footer:empty { display: none; }

      /* Open state */
      :host([data-open]) .lumina-modal__backdrop { opacity: 1; }
      :host([data-open]) .lumina-modal__panel {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      :host([data-open]) .lumina-modal__portal {
        animation: lumina-modal-burst calc(var(--lumina-speed) * 1.4) var(--lumina-ease-out) forwards;
      }

      /* Void variant */
      :host([variant="void"]) .lumina-modal__glass {
        background: rgb(0 0 0 / 0.7);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
      }
      :host([variant="void"]) .lumina-modal__title {
        color: var(--lumina-accent);
        text-shadow:
          -1px 0 1px rgb(255 0 80 / 0.6),
          1px 0 1px rgb(0 200 255 / 0.6);
      }

      /* Dimensional variant */
      :host([variant="dimensional"]) .lumina-modal__panel {
        transform: translate(-50%, -50%) scale(0.6) rotateX(40deg);
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"][data-open]) .lumina-modal__panel {
        transform: translate(-50%, -50%) scale(1) rotateX(0deg);
      }

      @keyframes lumina-modal-spin { to { transform: rotate(360deg); } }
      @keyframes lumina-modal-burst {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(20); opacity: 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-modal__panel,
        .lumina-modal__backdrop,
        .lumina-modal__portal,
        .lumina-modal__glass::before {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }

  protected mounted(): void {
    this.dialog = this.$$('.lumina-modal') as HTMLDialogElement | null;
    this.backdrop = this.$$('.lumina-modal__backdrop');
    this.portal = this.$$('.lumina-modal__portal');

    this.$$('.lumina-modal__close')?.addEventListener('click', () => this.close());
    this.backdrop?.addEventListener('click', () => {
      if (this.getAttribute('closable') !== 'false') this.close();
    });

    document.addEventListener('keydown', this.onKeyDown);

    if (this.hasAttribute('open')) {
      // Defer to ensure dialog is rendered
      requestAnimationFrame(() => this.showModal());
    }
  }

  protected unmounted(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    if (this.dialog?.open) this.dialog.close();
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  /* ---------------------------------------------------------------- */

  showModal(): void {
    if (this._open || !this.dialog) return;
    this.previouslyFocused = document.activeElement as HTMLElement;
    this._open = true;
    this.setAttribute('data-open', '');
    this.setAttribute('open', '');
    try {
      this.dialog.showModal();
    } catch {
      // showModal throws if already open — ignore
    }
    // Focus first focusable in the modal
    requestAnimationFrame(() => {
      const focusable = this.$$<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"]), input, a[href]',
      );
      focusable?.focus();
    });
    this.dispatchEvent(new CustomEvent('lumina-open', { bubbles: true, composed: true }));
  }

  close(): void {
    if (!this._open || !this.dialog) return;
    this._open = false;
    this.removeAttribute('data-open');
    this.removeAttribute('open');
    if (prefersReducedMotion()) {
      this.dialog.close();
    } else {
      // Allow the closing animation to play before actually closing
      setTimeout(() => this.dialog?.close(), 350);
    }
    this.previouslyFocused?.focus();
    this.dispatchEvent(new CustomEvent('lumina-close', { bubbles: true, composed: true }));
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this._open) return;
    if (e.key === 'Escape' && this.getAttribute('closable') !== 'false') {
      e.preventDefault();
      this.close();
    }
    // Focus trap
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
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-modal': LuminaModal;
  }
}

if (!customElements.get(LuminaModal.tagName)) {
  customElements.define(LuminaModal.tagName, LuminaModal);
}
