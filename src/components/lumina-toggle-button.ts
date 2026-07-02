/**
 * LuminaToggleButton — Botão que alterna entre dois estados visuais (pressed/released)
 * com glow e partículas ao alternar. Suporta ícones diferentes por estado.
 *
 * Variants: glass | neural | aura
 * Evento: lumina-change (detail: { pressed })
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { intensityToMultiplier, prefersReducedMotion, randRange } from '../core/utils';

interface BurstParticle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; }

export class ToggleButton extends LuminaElement {
  static tagName = 'lumina-toggle-button';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'pressed', 'icon-on', 'icon-off'];
  }
  private _pressed = false;
  private _iconOn = '';
  private _iconOff = '';
  private burstCanvas: HTMLCanvasElement | null = null;
  private burstCtx: CanvasRenderingContext2D | null = null;
  private burstParticles: BurstParticle[] = [];
  private burstRaf = 0;

  get pressed(): boolean { return this._pressed; }
  set pressed(v: boolean) { this._pressed = v; if (v) this.setAttribute('pressed',''); else this.removeAttribute('pressed'); }
  get iconOn(): string { return this._iconOn; }
  set iconOn(v: string) { this._iconOn = v; this.setAttribute('icon-on', v); this.updateIcon(); }
  get iconOff(): string { return this._iconOff; }
  set iconOff(v: string) { this._iconOff = v; this.setAttribute('icon-off', v); this.updateIcon(); }

  protected render(): string {
    return `
      <button class="lmtb" part="button" type="button" role="switch" aria-pressed="false">
        <span class="lmtb__bg" aria-hidden="true"></span>
        <span class="lmtb__glow" part="glow" aria-hidden="true"></span>
        <canvas class="lmtb__particles" aria-hidden="true"></canvas>
        <span class="lmtb__icon" aria-hidden="true"></span>
        <span class="lmtb__label"><slot></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); -webkit-tap-highlight-color: transparent; }
      .lmtb {
        position: relative; display: inline-flex; align-items: center; gap: 8px;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmtb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out), border-color var(--lumina-speed) var(--lumina-ease-out); }
      .lmtb__glow { position: absolute; inset: -20%; border-radius: inherit; pointer-events: none; z-index: 0; opacity: 0; background: radial-gradient(60% 60% at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.5), transparent 70%); filter: blur(20px); transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmtb__particles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 3; }
      .lmtb__icon { position: relative; z-index: 2; font-size: 16px; opacity: 0.8; }
      .lmtb__icon:empty { display: none; }
      .lmtb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmtb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmtb__glow { opacity: calc(0.4 * var(--lumina-intensity)); }
      :host(:active) .lmtb { transform: translateY(0) scale(0.97); }
      :host([pressed]) .lmtb__bg { background: linear-gradient(135deg, rgb(var(--lumina-accent-rgb) / 0.4), rgb(var(--lumina-accent-rgb) / 0.2)); border-color: rgb(var(--lumina-accent-rgb) / 0.6); }
      :host([pressed]) .lmtb__glow { opacity: calc(0.6 * var(--lumina-intensity)); }
      :host([pressed]) .lmtb__label { color: #fff; }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="aura"]) .lmtb { animation: lmtb-float 4s ease-in-out infinite; }
      :host([variant="aura"][pressed]) .lmtb { animation: lmtb-float-pressed 2s ease-in-out infinite; }
      @keyframes lmtb-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      @keyframes lmtb-float-pressed { 0%,100% { transform: translateY(0) scale(1.02); } 50% { transform: translateY(-3px) scale(1.02); } }
      @media (prefers-reduced-motion: reduce) { .lmtb, .lmtb__glow { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._pressed = this.hasAttribute('pressed');
    this._iconOn = this.getAttribute('icon-on') ?? '';
    this._iconOff = this.getAttribute('icon-off') ?? '';
    this.burstCanvas = this.$$('.lmtb__particles') as HTMLCanvasElement | null;
    this.burstCtx = this.burstCanvas?.getContext('2d') ?? null;
    this.updateIcon();
    this.setAttribute('role', 'switch');
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-pressed', String(this._pressed));
    this.$$('.lmtb')?.addEventListener('click', this.onClick);
    this.$$('.lmtb')?.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void { cancelAnimationFrame(this.burstRaf); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'pressed') { this._pressed = value !== null; this.setAttribute('aria-pressed', String(this._pressed)); }
    else if (name === 'icon-on') { this._iconOn = value ?? ''; this.updateIcon(); }
    else if (name === 'icon-off') { this._iconOff = value ?? ''; this.updateIcon(); }
  }
  private updateIcon(): void {
    const iconEl = this.$$('.lmtb__icon');
    if (iconEl) iconEl.textContent = this._pressed ? this._iconOn : this._iconOff;
  }
  private onClick = (): void => {
    this._pressed = !this._pressed;
    if (this._pressed) this.setAttribute('pressed',''); else this.removeAttribute('pressed');
    this.setAttribute('aria-pressed', String(this._pressed));
    this.updateIcon();
    this.spawnBurst();
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { pressed: this._pressed } }));
  };
  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onClick(); }
  };
  private spawnBurst(): void {
    if (prefersReducedMotion() || !this.burstCtx || !this.burstCanvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth; const h = this.clientHeight;
    this.burstCanvas.width = w * dpr; this.burstCanvas.height = h * dpr;
    this.burstCanvas.style.width = `${w}px`; this.burstCanvas.style.height = `${h}px`;
    this.burstCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    const count = Math.round(14 * intensity);
    const cx = w / 2; const cy = h / 2;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const sp = 1.5 + Math.random() * 3 * intensity;
      this.burstParticles.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, maxLife: 30 + Math.random() * 20, size: randRange(1, 2.5) });
    }
    if (!this.burstRaf) this.tick(rgb);
  }
  private tick = (rgb: string): void => {
    if (!this.burstCtx) return;
    this.burstCtx.clearRect(0, 0, this.clientWidth, this.clientHeight);
    this.burstParticles = this.burstParticles.filter((p) => p.life < p.maxLife);
    for (const p of this.burstParticles) {
      p.x += p.vx; p.y += p.vy; p.vx *= 0.94; p.vy *= 0.94; p.life += 1;
      const a = 1 - p.life / p.maxLife;
      this.burstCtx.fillStyle = `rgba(${rgb} / ${a})`;
      this.burstCtx.beginPath();
      this.burstCtx.arc(p.x, p.y, Math.max(0, p.size * a), 0, Math.PI * 2);
      this.burstCtx.fill();
    }
    if (this.burstParticles.length > 0) this.burstRaf = requestAnimationFrame(() => this.tick(rgb));
    else { this.burstRaf = 0; this.burstCtx.clearRect(0, 0, this.clientWidth, this.clientHeight); }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-toggle-button': ToggleButton } }
if (!customElements.get(ToggleButton.tagName)) customElements.define(ToggleButton.tagName, ToggleButton);
