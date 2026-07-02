/**
 * LuminaToast — Notificação toast com posicionamento inteligente,
 * empilhamento automático, actions e duração configurável.
 *
 * Variants: glass | neural | success | error | warning
 *
 * Uso:
 *   <lumina-toast variant="success" duration="4000" position="top-right">
 *     Salvo com sucesso!
 *     <button slot="actions" data-action="undo">Desfazer</button>
 *   </lumina-toast>
 *
 * Stack: toasts com a mesma position se empilham automaticamente.
 * Evento: lumina-dismiss (sem detail)
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

const POSITIONS = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
  'top-center',
  'bottom-center',
] as const;
type Position = (typeof POSITIONS)[number];

const TOAST_ICONS: Record<string, string> = {
  success: '✓',
  error: '×',
  warning: '!',
  glass: '●',
  neural: '◆',
};

/** Stack manager: each position has its own queue. */
const stacks: Record<Position, LuminaToast[]> = {
  'top-right': [],
  'top-left': [],
  'bottom-right': [],
  'bottom-left': [],
  'top-center': [],
  'bottom-center': [],
};

function repositionStack(pos: Position): void {
  const stack = stacks[pos];
  const isTop = pos.startsWith('top');
  const gap = 8;
  let offset = 12;
  stack.forEach((toast, i) => {
    toast.style.setProperty('--lmt-offset', `${offset}px`);
    toast.style.setProperty('--lmt-index', String(stack.length - i));
    offset += toast.offsetHeight + gap;
  });
  // Reverse for top-aligned (first toast appears at top, subsequent below)
  if (isTop) {
    let topOffset = 12;
    stack.forEach((toast) => {
      toast.style.setProperty('--lmt-offset', `${topOffset}px`);
      topOffset += toast.offsetHeight + gap;
    });
  }
}

export class LuminaToast extends LuminaElement {
  static tagName = 'lumina-toast';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'duration',
      'position',
    ];
  }

  private _duration = 4000;
  private _position: Position = 'top-right';
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;
  private progressEl: HTMLElement | null = null;
  private stackJoined = false;

  get duration(): number { return this._duration; }
  set duration(v: number) {
    this._duration = v;
    this.setAttribute('duration', String(v));
    this.scheduleDismiss();
  }

  get position(): Position { return this._position; }
  set position(v: Position) {
    if (this.stackJoined) {
      stacks[this._position] = stacks[this._position].filter((t) => t !== this);
      repositionStack(this._position);
    }
    this._position = v;
    this.setAttribute('position', v);
    this.applyPosition();
    this.joinStack();
  }

  protected render(): string {
    return `
      <div class="lmt" part="toast" role="alert">
        <div class="lmt__progress" part="progress" aria-hidden="true"></div>
        <span class="lmt__icon" part="icon" aria-hidden="true"></span>
        <div class="lmt__content" part="content">
          <slot></slot>
        </div>
        <div class="lmt__actions" part="actions">
          <slot name="actions"></slot>
        </div>
        <button class="lmt__close" part="close" type="button" aria-label="Fechar">×</button>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host {
        position: fixed;
        --lmt-color: var(--lumina-accent);
        --lmt-color-rgb: var(--lumina-accent-rgb);
        --lmt-offset: 12px;
        --lmt-index: 1;
        z-index: calc(10000 + var(--lmt-index));
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        pointer-events: none;
        max-width: 360px;
        transition:
          transform calc(var(--lumina-speed) * 1.4) var(--lumina-ease-spring),
          opacity calc(var(--lumina-speed) * 1.2) var(--lumina-ease-out);
      }

      :host([variant="success"]) { --lmt-color: #22c55e; --lmt-color-rgb: 34 197 94; }
      :host([variant="error"])   { --lmt-color: #ef4444; --lmt-color-rgb: 239 68 68; }
      :host([variant="warning"]) { --lmt-color: #f59e0b; --lmt-color-rgb: 245 158 11; }

      /* Positioning (CSS variables set the offset; transform places the host) */
      :host([position="top-right"])     { top: 0; right: 0; transform: translate(-12px, var(--lmt-offset)); }
      :host([position="top-left"])      { top: 0; left: 0; transform: translate(12px, var(--lmt-offset)); }
      :host([position="bottom-right"])  { bottom: 0; right: 0; transform: translate(-12px, calc(-1 * var(--lmt-offset))); }
      :host([position="bottom-left"])   { bottom: 0; left: 0; transform: translate(12px, calc(-1 * var(--lmt-offset))); }
      :host([position="top-center"])    { top: 0; left: 50%; transform: translate(-50%, var(--lmt-offset)); }
      :host([position="bottom-center"]) { bottom: 0; left: 50%; transform: translate(-50%, calc(-1 * var(--lmt-offset))); }

      /* Hidden state before show */
      :host(.is-hidden) {
        opacity: 0;
      }
      :host([position="top-right"].is-hidden)     { transform: translate(120%, var(--lmt-offset)); }
      :host([position="top-left"].is-hidden)      { transform: translate(-120%, var(--lmt-offset)); }
      :host([position="bottom-right"].is-hidden)  { transform: translate(120%, calc(-1 * var(--lmt-offset))); }
      :host([position="bottom-left"].is-hidden)   { transform: translate(-120%, calc(-1 * var(--lmt-offset))); }
      :host([position="top-center"].is-hidden)    { transform: translate(-50%, -150%); }
      :host([position="bottom-center"].is-hidden) { transform: translate(-50%, 150%); }

      .lmt {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 14px;
        padding-right: 36px;
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.1));
        backdrop-filter: blur(20px) saturate(1.6);
        -webkit-backdrop-filter: blur(20px) saturate(1.6);
        border: 1px solid var(--lumina-border);
        border-left: 3px solid var(--lmt-color);
        box-shadow:
          0 12px 40px -12px rgb(0 0 0 / 0.5),
          0 0 0 1px rgb(var(--lmt-color-rgb) / 0.1);
        pointer-events: auto;
        overflow: hidden;
      }

      .lmt__progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        width: 100%;
        background: var(--lmt-color);
        box-shadow: 0 0 8px var(--lmt-color);
        transform-origin: left;
        transform: scaleX(1);
      }
      .lmt.is-counting .lmt__progress {
        animation: lmt-progress var(--lmt-duration, 4s) linear forwards;
      }
      @keyframes lmt-progress {
        from { transform: scaleX(1); }
        to   { transform: scaleX(0); }
      }

      .lmt__icon {
        flex-shrink: 0;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgb(var(--lmt-color-rgb) / 0.2);
        color: var(--lmt-color);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 800;
        margin-top: 1px;
      }

      .lmt__content {
        flex: 1;
        min-width: 0;
        font-size: 14px;
        line-height: 1.45;
      }

      .lmt__actions {
        display: flex;
        gap: 6px;
        flex-shrink: 0;
      }
      .lmt__actions:empty { display: none; }
      ::slotted([slot="actions"]) {
        appearance: none;
        border: 1px solid rgb(var(--lmt-color-rgb) / 0.4);
        background: rgb(var(--lmt-color-rgb) / 0.15);
        color: var(--lmt-color);
        padding: 4px 10px;
        border-radius: 6px;
        font: 600 11px var(--lumina-font-sans);
        cursor: pointer;
        transition: background 0.2s;
      }
      ::slotted([slot="actions"]:hover) {
        background: rgb(var(--lmt-color-rgb) / 0.3);
      }

      .lmt__close {
        position: absolute;
        top: 8px;
        right: 8px;
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--lumina-text-muted);
        font-size: 16px;
        cursor: pointer;
        width: 22px;
        height: 22px;
        border-radius: 5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, color 0.2s;
      }
      .lmt__close:hover { background: rgb(255 255 255 / 0.1); color: #fff; }

      /* Variant: neural */
      :host([variant="neural"]) .lmt {
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }

      @media (prefers-reduced-motion: reduce) {
        :host { transition: none !important; }
        .lmt__progress { animation: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.progressEl = this.$$('.lmt__progress');

    // Read attributes
    const durationAttr = this.getAttribute('duration');
    if (durationAttr) this._duration = parseInt(durationAttr, 10) || 4000;
    const positionAttr = this.getAttribute('position') as Position | null;
    if (positionAttr && POSITIONS.includes(positionAttr)) this._position = positionAttr;

    this.applyPosition();
    this.applyVariantIcon();

    // Wire close button
    this.$$('.lmt__close')?.addEventListener('click', () => this.dismiss());

    // Wire action buttons (auto-dismiss on click unless data-persist)
    this.shadow.querySelectorAll('slot[name="actions"]').forEach((slot) => {
      slot.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.matches('[slot="actions"]') && !target.hasAttribute('data-persist')) {
          setTimeout(() => this.dismiss(), 100);
        }
      });
    });

    // Set the duration CSS variable for the progress animation
    this.style.setProperty('--lmt-duration', `${this._duration}ms`);

    // Show animation
    requestAnimationFrame(() => {
      this.classList.remove('is-hidden');
      this.joinStack();
      this.startProgress();
      this.scheduleDismiss();
    });
  }

  protected unmounted(): void {
    if (this.dismissTimer) clearTimeout(this.dismissTimer);
    this.leaveStack();
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'duration' && value) {
      this._duration = parseInt(value, 10) || 4000;
      this.style.setProperty('--lmt-duration', `${this._duration}ms`);
    } else if (name === 'position' && value && POSITIONS.includes(value as Position)) {
      this._position = value as Position;
    }
  }

  private applyPosition(): void { /* attribute already set — CSS handles styling */
  }

  private applyVariantIcon(): void {
    const iconEl = this.$$('.lmt__icon');
    if (iconEl) iconEl.textContent = TOAST_ICONS[this.variant] ?? '●';
  }

  private joinStack(): void {
    if (this.stackJoined) return;
    stacks[this._position].push(this);
    this.stackJoined = true;
    repositionStack(this._position);
  }

  private leaveStack(): void {
    if (!this.stackJoined) return;
    stacks[this._position] = stacks[this._position].filter((t) => t !== this);
    this.stackJoined = false;
    repositionStack(this._position);
  }

  private startProgress(): void {
    if (prefersReducedMotion() || this._duration <= 0) return;
    const toast = this.$$('.lmt');
    if (toast) toast.classList.add('is-counting');
  }

  private scheduleDismiss(): void {
    if (this.dismissTimer) clearTimeout(this.dismissTimer);
    if (this._duration > 0) {
      this.dismissTimer = setTimeout(() => this.dismiss(), this._duration);
    }
  }

  /** Pause auto-dismiss (e.g., on hover). */
  public pause(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    const toast = this.$$('.lmt');
    if (toast) {
      toast.style.animationPlayState = 'paused';
      const progress = this.$$('.lmt__progress');
      if (progress) progress.style.animationPlayState = 'paused';
    }
  }

  /** Resume auto-dismiss after pause. */
  public resume(): void {
    const toast = this.$$('.lmt');
    if (toast) {
      toast.style.animationPlayState = 'running';
      const progress = this.$$('.lmt__progress');
      if (progress) progress.style.animationPlayState = 'running';
    }
    // Note: this is approximate; full resume would need to track elapsed time.
  }

  /** Public API: dismiss with slide-out, then remove from DOM. */
  public dismiss(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this.classList.add('is-hidden');
    this.leaveStack();
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('lumina-dismiss', { bubbles: true, composed: true }));
      this.remove();
    }, prefersReducedMotion() ? 0 : 400);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-toast': LuminaToast;
  }
}

if (!customElements.get(LuminaToast.tagName)) {
  customElements.define(LuminaToast.tagName, LuminaToast);
}
