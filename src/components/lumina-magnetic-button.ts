/**
 * LuminaMagneticButton — Botão que atrai sutilmente o cursor do mouse
 * (efeito magnético). Desativa em prefers-reduced-motion.
 *
 * Variants: glass | neural | aura
 * Props: magnetic-strength (0..1)
 * Eventos: lumina-click, lumina-magnetic-start
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { clamp, prefersReducedMotion } from '../core/utils';

export class MagneticButton extends LuminaElement {
  static tagName = 'lumina-magnetic-button';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'magnetic-strength'];
  }
  private _strength = 0.4;
  private btn: HTMLElement | null = null;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private raf = 0;
  private tracking = false;

  get magneticStrength(): number { return this._strength; }
  set magneticStrength(v: number) { this._strength = clamp(v, 0, 1); this.setAttribute('magnetic-strength', String(this._strength)); }

  protected render(): string {
    return `
      <button class="lmmb" part="button" type="button">
        <span class="lmmb__bg" aria-hidden="true"></span>
        <span class="lmmb__glow" part="glow" aria-hidden="true"></span>
        <span class="lmmb__label"><slot></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); padding: 20px; }
      .lmmb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform 0.3s var(--lumina-ease-out);
        will-change: transform;
      }
      .lmmb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmmb__glow { position: absolute; inset: -20%; border-radius: inherit; pointer-events: none; z-index: 0; opacity: 0; background: radial-gradient(60% 60% at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.5), transparent 70%); filter: blur(20px); transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmmb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmmb__glow { opacity: calc(0.6 * var(--lumina-intensity)); }
      :host(:active) .lmmb { transform: scale(0.97) !important; }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="aura"]) .lmmb { animation: lmmb-float 4s ease-in-out infinite; }
      @keyframes lmmb-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      @media (prefers-reduced-motion: reduce) { .lmmb { transition: none !important; animation: none !important; transform: none !important; } }
    `;
  }
  protected mounted(): void {
    this._strength = clamp(parseFloat(this.getAttribute('magnetic-strength') ?? '0.4') || 0.4, 0, 1);
    this.btn = this.$$('.lmmb');
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    if (!prefersReducedMotion()) {
      this.addEventListener('pointermove', this.onPointerMove);
      this.addEventListener('pointerleave', this.onPointerLeave);
    }
    this.btn?.addEventListener('click', this.onClick);
    this.btn?.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'magnetic-strength') this._strength = clamp(parseFloat(value ?? '0.4') || 0.4, 0, 1);
  }
  private onPointerMove = (e: PointerEvent): void => {
    if (!this.btn) return;
    const rect = this.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * this._strength;
    const dy = (e.clientY - cy) * this._strength;
    this.targetX = dx;
    this.targetY = dy;
    if (!this.tracking) {
      this.tracking = true;
      this.dispatchEvent(new CustomEvent('lumina-magnetic-start', { bubbles: true, composed: true, detail: { strength: this._strength } }));
      this.tick();
    }
  };
  private onPointerLeave = (): void => {
    this.targetX = 0;
    this.targetY = 0;
  };
  private tick = (): void => {
    if (!this.btn) return;
    this.currentX += (this.targetX - this.currentX) * 0.15;
    this.currentY += (this.targetY - this.currentY) * 0.15;
    this.btn.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
    if (Math.abs(this.targetX - this.currentX) > 0.1 || Math.abs(this.targetY - this.currentY) > 0.1 || Math.abs(this.currentX) > 0.1 || Math.abs(this.currentY) > 0.1) {
      this.raf = requestAnimationFrame(this.tick);
    } else {
      this.tracking = false;
      this.btn.style.transform = '';
    }
  };
  private onClick = (): void => { this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true })); };
  private onKeydown = (e: KeyboardEvent): void => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onClick(); } };
}
declare global { interface HTMLElementTagNameMap { 'lumina-magnetic-button': MagneticButton } }
if (!customElements.get(MagneticButton.tagName)) customElements.define(MagneticButton.tagName, MagneticButton);
