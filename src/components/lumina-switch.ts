/**
 * LuminaSwitch — Spring physics, partículas ao alternar, aura pulsante.
 * Variants: glass | neural | aura | void
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { intensityToMultiplier, prefersReducedMotion, randRange } from '../core/utils';

interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; }

export class Switch extends LuminaElement {
  static tagName = 'lumina-switch';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'checked']; }
  private _checked = false;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private raf = 0;
  private button: HTMLElement | null = null;

  get checked(): boolean { return this._checked; }
  set checked(v: boolean) { this._checked = v; if (v) this.setAttribute('checked',''); else this.removeAttribute('checked'); }

  protected render(): string {
    return `
      <button class="lmsw" part="track" type="button" role="switch" aria-checked="false">
        <span class="lmsw__aura" part="glow" aria-hidden="true"></span>
        <span class="lmsw__track">
          <span class="lmsw__glow" aria-hidden="true"></span>
          <span class="lmsw__thumb" part="thumb">
            <canvas class="lmsw__particles" part="particles" aria-hidden="true"></canvas>
          </span>
        </span>
        <span class="lmsw__label"><slot></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-flex; align-items: center; gap: 12px; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmsw { position: relative; appearance: none; border: 0; background: transparent; padding: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 12px; outline: none; font: inherit; color: inherit; }
      .lmsw:focus-visible .lmsw__track { box-shadow: 0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.2); }
      .lmsw__aura { position: absolute; width: 60px; height: 60px; left: -8px; top: 50%; transform: translateY(-50%); border-radius: 50%; background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / calc(0.5 * var(--lumina-intensity))), transparent 70%); filter: blur(12px); opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); pointer-events: none; z-index: 0; }
      :host([checked]) .lmsw__aura { opacity: 1; animation: lmsw-pulse 2s ease-in-out infinite; }
      @keyframes lmsw-pulse { 0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.6; } 50% { transform: translateY(-50%) scale(1.2); opacity: 1; } }
      .lmsw__track { position: relative; width: 56px; height: 30px; border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 4px rgb(0 0 0 / 0.25), var(--lumina-shadow); flex-shrink: 0; z-index: 1; }
      .lmsw__glow { position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(90deg, rgb(var(--lumina-accent-rgb) / 0.6), rgb(var(--lumina-accent-rgb) / 0.95)); opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([checked]) .lmsw__glow { opacity: 1; }
      .lmsw__thumb { position: absolute; top: 50%; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #fff, #d8d8e8); box-shadow: 0 2px 6px rgb(0 0 0 / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.8); transform: translateY(-50%); transition: left calc(var(--lumina-speed) * 1.2) var(--lumina-ease-spring); z-index: 2; }
      :host([checked]) .lmsw__thumb { left: 29px; }
      .lmsw__particles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      .lmsw__label { font-size: 14px; font-weight: 500; }
      .lmsw__label:empty { display: none; }
      :host([variant="void"]) .lmsw__track { background: rgb(0 0 0 / 0.6); }
      :host([variant="void"][checked]) .lmsw__thumb { box-shadow: 0 0 12px var(--lumina-accent), 0 2px 6px rgb(0 0 0 / 0.4); }
      @media (prefers-reduced-motion: reduce) { .lmsw__thumb, .lmsw__aura, .lmsw__glow { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._checked = this.hasAttribute('checked');
    this.button = this.$$('.lmsw');
    this.canvas = this.$$('.lmsw__particles') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    this.setAttribute('role', 'switch');
    this.setAttribute('aria-checked', String(this._checked));
    this.button?.addEventListener('click', this.onClick);
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'checked') { this._checked = value !== null; this.setAttribute('aria-checked', String(this._checked)); }
  }
  private onClick = (): void => {
    this._checked = !this._checked;
    if (this._checked) this.setAttribute('checked',''); else this.removeAttribute('checked');
    this.setAttribute('aria-checked', String(this._checked));
    if (this._checked && !prefersReducedMotion()) this.burst();
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { checked: this._checked } }));
  };
  private burst(): void {
    if (!this.ctx || !this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = 24; const h = 24;
    this.canvas.width = w * dpr; this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`; this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    const count = Math.round(14 * intensity);
    for (let i = 0; i < count; i++) {
      const a = randRange(0, Math.PI * 2);
      const sp = randRange(1.5, 3.5);
      this.particles.push({ x: w / 2, y: h / 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, maxLife: 30 + Math.random() * 20, size: randRange(0.8, 2) });
    }
    if (!this.raf) this.tick(rgb);
  }
  private tick = (rgb: string): void => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, 24, 24);
    this.particles = this.particles.filter((p) => p.life < p.maxLife);
    for (const p of this.particles) {
      p.x += p.vx; p.y += p.vy; p.vx *= 0.92; p.vy *= 0.92; p.life += 1;
      const a = 1 - p.life / p.maxLife;
      this.ctx.fillStyle = `rgba(${rgb} / ${a})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(0, p.size * a), 0, Math.PI * 2);
      this.ctx.fill();
    }
    if (this.particles.length > 0) this.raf = requestAnimationFrame(() => this.tick(rgb));
    else { this.raf = 0; this.ctx.clearRect(0, 0, 24, 24); }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-switch': Switch } }
if (!customElements.get(Switch.tagName)) customElements.define(Switch.tagName, Switch);
