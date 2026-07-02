/**
 * LuminaAlert — Alert com níveis de severidade, ícone automático,
 * auto-dismiss configurável e animação slide+fade.
 *
 * Variants: glass | neural | success | warning | error | info
 *
 * Uso:
 *   <lumina-alert variant="success" auto-dismiss="5000">
 *     <span slot="title">Tudo certo!</span>
 *     Operação concluída com sucesso.
 *   </lumina-alert>
 *
 * Evento: lumina-close (sem detail)
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

const SEVERITY_ICONS: Record<string, string> = {
  success: '✓',
  warning: '!',
  error: '×',
  info: 'i',
  glass: 'i',
  neural: '◆',
};

const SEVERITY_COLORS: Record<string, string> = {
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  glass: 'var(--lumina-accent)',
  neural: 'var(--lumina-accent)',
};

export class LuminaAlert extends LuminaElement {
  static tagName = 'lumina-alert';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'dismissible',
      'auto-dismiss',
    ];
  }

  private dismissTimer: ReturnType<typeof setTimeout> | null = null;
  private autoDismissMs = 0;

  get dismissible(): boolean { return this.hasAttribute('dismissible'); }
  set dismissible(v: boolean) {
    if (v) this.setAttribute('dismissible', '');
    else this.removeAttribute('dismissible');
    this.applyDismissible();
  }

  get autoDismiss(): number { return this.autoDismissMs; }
  set autoDismiss(v: number) {
    this.autoDismissMs = v;
    this.setAttribute('auto-dismiss', String(v));
    this.scheduleAutoDismiss();
  }

  protected render(): string {
    return `
      <div class="lma" part="alert" role="alert">
        <span class="lma__icon" part="icon" aria-hidden="true"></span>
        <div class="lma__content" part="content">
          <slot name="title"><strong class="lma__title"></strong></slot>
          <div class="lma__msg"><slot></slot></div>
        </div>
        <button class="lma__close" part="close-button" type="button" aria-label="Fechar">×</button>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        --lma-color: var(--lumina-accent);
        --lma-color-rgb: var(--lumina-accent-rgb);
      }
      :host([variant="success"]) { --lma-color: #22c55e; --lma-color-rgb: 34 197 94; }
      :host([variant="warning"]) { --lma-color: #f59e0b; --lma-color-rgb: 245 158 11; }
      :host([variant="error"])   { --lma-color: #ef4444; --lma-color-rgb: 239 68 68; }
      :host([variant="info"])    { --lma-color: #3b82f6; --lma-color-rgb: 59 130 246; }

      .lma {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 16px;
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
        border-left: 3px solid var(--lma-color);
        box-shadow:
          0 4px 20px -8px rgb(var(--lma-color-rgb) / 0.35),
          inset 0 1px 0 0 rgb(255 255 255 / 0.08);
        animation: lma-slide-in calc(var(--lumina-speed) * 1.4) var(--lumina-ease-spring);
        will-change: transform, opacity;
      }

      @keyframes lma-slide-in {
        from { opacity: 0; transform: translateX(-12px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      .lma.is-dismissing {
        animation: lma-slide-out calc(var(--lumina-speed) * 1.2) var(--lumina-ease-out) forwards;
      }
      @keyframes lma-slide-out {
        from { opacity: 1; transform: translateX(0); }
        to   { opacity: 0; transform: translateX(20px); }
      }

      .lma__icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgb(var(--lma-color-rgb) / 0.2);
        color: var(--lma-color);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 800;
        font-style: italic;
        box-shadow: 0 0 12px rgb(var(--lma-color-rgb) / 0.4);
        font-style: normal;
        margin-top: 1px;
      }

      .lma__content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .lma__title {
        font-size: 13px;
        font-weight: 700;
        color: var(--lma-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: block;
      }
      .lma__title:empty { display: none; }

      .lma__msg {
        font-size: 14px;
        line-height: 1.5;
        color: var(--lumina-text);
      }

      .lma__close {
        flex-shrink: 0;
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--lumina-text-muted);
        font-size: 18px;
        cursor: pointer;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background var(--lumina-speed) var(--lumina-ease-out),
                    color var(--lumina-speed) var(--lumina-ease-out),
                    transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lma__close:hover {
        background: rgb(var(--lma-color-rgb) / 0.2);
        color: var(--lma-color);
        transform: rotate(90deg);
      }
      .lma__close:focus-visible {
        outline: 2px solid var(--lma-color);
        outline-offset: 2px;
      }

      /* Variant: neural — pulsing border */
      :host([variant="neural"]) .lma {
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }
      :host([variant="neural"]) .lma__icon {
        animation: lma-pulse 1.6s ease-in-out infinite;
      }
      @keyframes lma-pulse {
        0%, 100% { box-shadow: 0 0 12px rgb(var(--lma-color-rgb) / 0.4); }
        50%      { box-shadow: 0 0 24px rgb(var(--lma-color-rgb) / 0.8); }
      }

      /* Hide close button when not dismissible */
      :host(:not([dismissible])) .lma__close { display: none; }

      @media (prefers-reduced-motion: reduce) {
        .lma, .lma__icon, .lma__close { animation: none !important; transition: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.applyVariantIcon();
    this.applyTitle();
    this.applyDismissible();

    this.$$('.lma__close')?.addEventListener('click', () => this.dismiss());

    // Read initial attributes
    const autoDismissAttr = this.getAttribute('auto-dismiss');
    if (autoDismissAttr) {
      this.autoDismissMs = parseInt(autoDismissAttr, 10) || 0;
      this.scheduleAutoDismiss();
    }
  }

  protected unmounted(): void {
    if (this.dismissTimer) clearTimeout(this.dismissTimer);
  }

  protected onConfigChange(changed: Partial<LuminaElementAttributes>): void {
    if (changed.variant) this.applyVariantIcon();
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'dismissible') this.applyDismissible();
    else if (name === 'auto-dismiss' && value) {
      this.autoDismissMs = parseInt(value, 10) || 0;
      this.scheduleAutoDismiss();
    } else if (name === 'variant') {
      this.applyVariantIcon();
    }
  }

  private applyVariantIcon(): void {
    const iconEl = this.$$('.lma__icon');
    if (!iconEl) return;
    const variant = this.variant;
    iconEl.textContent = SEVERITY_ICONS[variant] ?? 'i';
  }

  private applyTitle(): void {
    // If there's a slot=title, the strong is filled by slotted content
    const titleSlot = this.$$('.lma__title');
    if (titleSlot && !this.querySelector('[slot="title"]')) {
      // Use the variant name as default title
      titleSlot.textContent = this.variant.charAt(0).toUpperCase() + this.variant.slice(1);
    }
  }

  private applyDismissible(): void {
    // CSS handles the visibility via :host(:not([dismissible]))
    const btn = this.$$('.lma__close');
    if (btn) {
      btn.style.display = this.dismissible ? '' : 'none';
    }
  }

  private scheduleAutoDismiss(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    if (this.autoDismissMs > 0) {
      this.dismissTimer = setTimeout(() => this.dismiss(), this.autoDismissMs);
    }
  }

  /** Public API: dismiss with animation, then remove from DOM if slotted standalone. */
  public dismiss(): void {
    if (prefersReducedMotion()) {
      this.dispatchEvent(new CustomEvent('lumina-close', { bubbles: true, composed: true }));
      this.remove();
      return;
    }
    const alert = this.$$('.lma');
    if (alert) {
      alert.classList.add('is-dismissing');
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent('lumina-close', { bubbles: true, composed: true }));
        this.remove();
      }, 400);
    } else {
      this.dispatchEvent(new CustomEvent('lumina-close', { bubbles: true, composed: true }));
      this.remove();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-alert': LuminaAlert;
  }
}

if (!customElements.get(LuminaAlert.tagName)) {
  customElements.define(LuminaAlert.tagName, LuminaAlert);
}
