/**
 * LuminaAvatar — Avatar com imagem, fallback de iniciais,
 * indicador de status (online/busy/offline/away) e efeitos glow/holo.
 *
 * Variants: glass | neural | holo | minimal
 *
 * Uso:
 *   <lumina-avatar
 *     src="https://example.com/me.jpg"
 *     name="Jane Doe"
 *     status="online"
 *     size="md"
 *     variant="glass"
 *     interactive
 *   ></lumina-avatar>
 *
 * Evento: lumina-click (quando interactive)
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { coerceAttr } from '../core/utils';

const SIZES = ['sm', 'md', 'lg', 'xl'] as const;
type Size = (typeof SIZES)[number];

const SIZE_PX: Record<Size, number> = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 80,
};

const STATUSES = ['online', 'busy', 'offline', 'away'] as const;
type Status = (typeof STATUSES)[number];

const STATUS_COLORS: Record<Status, string> = {
  online: '#22c55e',
  busy: '#ef4444',
  offline: '#6b7280',
  away: '#f59e0b',
};

export class LuminaAvatar extends LuminaElement {
  static tagName = 'lumina-avatar';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'src',
      'name',
      'status',
      'size',
      'interactive',
    ];
  }

  private imgEl: HTMLImageElement | null = null;
  private initialsEl: HTMLElement | null = null;
  private statusEl: HTMLElement | null = null;

  private _src = '';
  private _name = '';
  private _status: Status | null = null;
  private _size: Size = 'md';

  get src(): string { return this._src; }
  set src(v: string) {
    this._src = v;
    this.setAttribute('src', v);
    this.applySrc();
  }

  get name(): string { return this._name; }
  set name(v: string) {
    this._name = v;
    this.setAttribute('name', v);
    this.applyInitials();
  }

  get status(): Status | null { return this._status; }
  set status(v: Status | null) {
    this._status = v;
    if (v) this.setAttribute('status', v);
    else this.removeAttribute('status');
    this.applyStatus();
  }

  get size(): Size { return this._size; }
  set size(v: Size) {
    this._size = v;
    this.setAttribute('size', v);
    this.applySize();
  }

  get interactive(): boolean { return this.hasAttribute('interactive'); }
  set interactive(v: boolean) {
    if (v) this.setAttribute('interactive', '');
    else this.removeAttribute('interactive');
    this.applyInteractive();
  }

  protected render(): string {
    return `
      <span class="lmav" part="avatar">
        <img class="lmav__img" part="image" alt="" />
        <span class="lmav__initials" part="initials" aria-hidden="true"></span>
        <span class="lmav__status" part="status" aria-hidden="true"></span>
        <span class="lmav__ring" aria-hidden="true"></span>
        <span class="lmav__holo" aria-hidden="true"></span>
      </span>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: inline-block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        --lmav-size: 40px;
      }

      .lmav {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--lmav-size);
        height: var(--lmav-size);
        border-radius: 50%;
        overflow: visible;
        isolation: isolate;
      }

      .lmav__img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        z-index: 1;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmav__img[data-loaded] { opacity: 1; }

      .lmav__initials {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(135deg,
          rgb(var(--lumina-accent-rgb) / 0.4),
          rgb(var(--lumina-accent-rgb) / 0.2)
        );
        color: var(--lumina-text);
        font-weight: 700;
        font-size: calc(var(--lmav-size) * 0.36);
        letter-spacing: -0.02em;
        text-transform: uppercase;
        border: 1px solid var(--lumina-border);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.15),
          var(--lumina-shadow);
      }
      .lmav__initials[data-hidden] { display: none; }

      .lmav__status {
        position: absolute;
        bottom: 0;
        right: 0;
        width: calc(var(--lmav-size) * 0.3);
        height: calc(var(--lmav-size) * 0.3);
        min-width: 10px;
        min-height: 10px;
        max-width: 16px;
        max-height: 16px;
        border-radius: 50%;
        background: var(--lmav-status, #6b7280);
        border: 2px solid var(--lumina-bg, #06060c);
        z-index: 3;
        box-shadow: 0 0 8px var(--lmav-status, #6b7280);
      }
      .lmav__status[data-busy] { animation: lmav-busy 1.2s ease-in-out infinite; }
      @keyframes lmav-busy {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(0.7); opacity: 0.7; }
      }
      .lmav__status:not([data-status]) { display: none; }

      .lmav__ring {
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        background: conic-gradient(from 0deg,
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
        padding: 2px;
        opacity: 0;
        animation: lmav-spin 6s linear infinite;
        animation-play-state: paused;
      }
      :host(:hover) .lmav__ring { opacity: 0.6; animation-play-state: running; }
      :host([interactive]:hover) .lmav__ring { opacity: 1; }

      .lmav__holo {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        opacity: 0;
        background: linear-gradient(135deg,
          rgb(255 0 128 / 0.4) 0%,
          rgb(0 200 255 / 0.4) 50%,
          rgb(255 255 0 / 0.3) 100%
        );
        mix-blend-mode: overlay;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host([variant="holo"]:hover) .lmav__holo { opacity: 1; }

      /* Interactive state */
      :host([interactive]) { cursor: pointer; }
      :host([interactive]) .lmav { transition: transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host([interactive]:hover) .lmav { transform: scale(1.05); }
      :host([interactive]:active) .lmav { transform: scale(0.95); }
      :host([interactive]:focus-visible) {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 4px;
      }

      /* Variant: minimal — no ring, no blur, flat */
      :host([variant="minimal"]) .lmav__initials {
        background: rgb(var(--lumina-surface) / 0.6);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: none;
      }
      :host([variant="minimal"]) .lmav__ring { display: none; }

      /* Variant: neural — pulsing glow around */
      :host([variant="neural"]) .lmav__ring {
        opacity: 0.4;
        animation-play-state: running;
      }
      :host([variant="neural"]) .lmav__initials {
        background:
          radial-gradient(circle at 30% 30%,
            rgb(var(--lumina-accent-rgb) / 0.5),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha))
          );
      }

      /* Variant: holo — iridescent border */
      :host([variant="holo"]) .lmav__initials {
        background: linear-gradient(135deg,
          rgb(255 0 128 / 0.3),
          rgb(0 200 255 / 0.3),
          rgb(255 255 0 / 0.3)
        );
        border-color: rgb(255 255 255 / 0.3);
      }

      @keyframes lmav-spin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        .lmav, .lmav__ring, .lmav__status, .lmav__holo {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }

  protected mounted(): void {
    this.imgEl = this.$$('.lmav__img') as HTMLImageElement | null;
    this.initialsEl = this.$$('.lmav__initials');
    this.statusEl = this.$$('.lmav__status');

    // Read initial attributes
    this._src = this.getAttribute('src') ?? '';
    this._name = this.getAttribute('name') ?? '';
    const statusAttr = this.getAttribute('status');
    this._status = statusAttr && (STATUSES as readonly string[]).includes(statusAttr)
      ? (statusAttr as Status)
      : null;
    this._size = coerceAttr(this.getAttribute('size'), SIZES, 'md');

    this.applySize();
    this.applySrc();
    this.applyInitials();
    this.applyStatus();
    this.applyInteractive();

    if (this.imgEl) {
      this.imgEl.addEventListener('load', () => {
        this.imgEl?.setAttribute('data-loaded', '');
        this.initialsEl?.setAttribute('data-hidden', '');
      });
      this.imgEl.addEventListener('error', () => {
        this.imgEl?.removeAttribute('data-loaded');
        this.initialsEl?.removeAttribute('data-hidden');
      });
    }

    if (this.interactive) {
      this.setAttribute('role', 'button');
      this.setAttribute('tabindex', '0');
      this.addEventListener('click', this.onClick);
      this.addEventListener('keydown', this.onKeydown);
    }
  }

  protected unmounted(): void {
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('keydown', this.onKeydown);
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'src') {
      this._src = value ?? '';
      this.applySrc();
    } else if (name === 'name') {
      this._name = value ?? '';
      this.applyInitials();
    } else if (name === 'status') {
      this._status = value && (STATUSES as readonly string[]).includes(value)
        ? (value as Status)
        : null;
      this.applyStatus();
    } else if (name === 'size') {
      this._size = coerceAttr(value, SIZES, 'md');
      this.applySize();
    } else if (name === 'interactive') {
      this.applyInteractive();
    }
  }

  private applySize(): void {
    this.style.setProperty('--lmav-size', `${SIZE_PX[this._size]}px`);
  }

  private applySrc(): void {
    if (!this.imgEl) return;
    if (this._src) {
      this.imgEl.src = this._src;
      this.imgEl.alt = this._name || 'Avatar';
    } else {
      this.imgEl.removeAttribute('src');
      this.imgEl.removeAttribute('data-loaded');
      this.initialsEl?.removeAttribute('data-hidden');
    }
  }

  private applyInitials(): void {
    if (!this.initialsEl) return;
    const initials = this.computeInitials(this._name);
    this.initialsEl.textContent = initials;
  }

  private applyStatus(): void {
    if (!this.statusEl) return;
    if (this._status) {
      this.statusEl.setAttribute('data-status', this._status);
      this.style.setProperty('--lmav-status', STATUS_COLORS[this._status]);
      if (this._status === 'busy') this.statusEl.setAttribute('data-busy', '');
      else this.statusEl.removeAttribute('data-busy');
    } else {
      this.statusEl.removeAttribute('data-status');
      this.statusEl.removeAttribute('data-busy');
    }
  }

  private applyInteractive(): void {
    if (this.interactive && this._mounted) {
      this.setAttribute('role', 'button');
      this.setAttribute('tabindex', '0');
      this.addEventListener('click', this.onClick);
      this.addEventListener('keydown', this.onKeydown);
    } else {
      this.removeAttribute('role');
      this.removeAttribute('tabindex');
      this.removeEventListener('click', this.onClick);
      this.removeEventListener('keydown', this.onKeydown);
    }
  }

  /** Compute 1-2 letter initials from a name. */
  private computeInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  private onClick = (): void => {
    if (!this.interactive) return;
    this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
  };

  private onKeydown = (e: KeyboardEvent): void => {
    if (!this.interactive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-avatar': LuminaAvatar;
  }
}

if (!customElements.get(LuminaAvatar.tagName)) {
  customElements.define(LuminaAvatar.tagName, LuminaAvatar);
}
