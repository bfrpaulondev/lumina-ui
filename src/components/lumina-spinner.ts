/**
 * LuminaSpinner — Partículas orbitando o centro + glow pulsante.
 * Variants: neural | aura | glass
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class Spinner extends LuminaElement {
  static tagName = 'lumina-spinner';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'size', 'speed']; }
  private _size = 40;
  private _spinSpeed = 1;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private raf = 0;
  private particles: Array<{angle:number;radius:number;speed:number;size:number}> = [];
  private time = 0;

  protected render(): string {
    return `
      <div class="lmsp" part="spinner" role="status" aria-label="Carregando">
        <div class="lmsp__ring" aria-hidden="true"></div>
        <canvas class="lmsp__particles" part="particles" aria-hidden="true"></canvas>
        <div class="lmsp__core" aria-hidden="true"></div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmsp-size: 40px; }
      .lmsp { position: relative; width: var(--lmsp-size); height: var(--lmsp-size); display: inline-flex; align-items: center; justify-content: center; }
      .lmsp__ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid transparent; border-top-color: var(--lumina-accent); border-right-color: rgb(var(--lumina-accent-rgb) / 0.3); animation: lmsp-spin 1s linear infinite; }
      @keyframes lmsp-spin { to { transform: rotate(360deg); } }
      .lmsp__core { width: 20%; height: 20%; border-radius: 50%; background: var(--lumina-accent); box-shadow: 0 0 12px var(--lumina-accent), 0 0 24px rgb(var(--lumina-accent-rgb) / 0.5); animation: lmsp-pulse 1s ease-in-out infinite; }
      @keyframes lmsp-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.7; } }
      .lmsp__particles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      :host([variant="aura"]) .lmsp__ring { border-top-color: #ffd166; border-right-color: rgb(255 209 102 / 0.3); animation-duration: 1.5s; }
      :host([variant="aura"]) .lmsp__core { background: #ffd166; box-shadow: 0 0 12px #ffd166, 0 0 32px rgb(255 209 102 / 0.5); }
      :host([variant="glass"]) .lmsp__ring { border-top-color: rgb(255 255 255 / 0.6); border-right-color: rgb(255 255 255 / 0.15); }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmsp__ring, .lmsp__core { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._size = parseInt(this.getAttribute('size') ?? '40', 10) || 40;
    this._spinSpeed = parseFloat(this.getAttribute('speed') ?? '1') || 1;
    this.style.setProperty('--lmsp-size', `${this._size}px`);
    this.canvas = this.$$('.lmsp__particles') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    // Init particles
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        angle: (i / 6) * Math.PI * 2,
        radius: this._size * 0.35,
        speed: 0.03 + Math.random() * 0.02,
        size: 1.5 + Math.random() * 1,
      });
    }
    if (!prefersReducedMotion()) {
      this.resize();
      this.raf = requestAnimationFrame(this.tick);
    }
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'size') { this._size = parseInt(value ?? '40', 10) || 40; this.style.setProperty('--lmsp-size', `${this._size}px`); this.particles.forEach((p) => p.radius = this._size * 0.35); }
    else if (name === 'speed') this._spinSpeed = parseFloat(value ?? '1') || 1;
  }
  private resize(): void {
    if (!this.canvas || !this.ctx) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this._size * dpr;
    this.canvas.height = this._size * dpr;
    this.canvas.style.width = `${this._size}px`;
    this.canvas.style.height = `${this._size}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  private tick = (): void => {
    if (!this.ctx) { this.raf = requestAnimationFrame(this.tick); return; }
    const w = this._size; const h = this._size; const cx = w / 2; const cy = h / 2;
    this.ctx.clearRect(0, 0, w, h);
    this.time += 0.016 * this._spinSpeed;
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    // Glow pulse intensity
    const glowIntensity = 0.3 + 0.4 * Math.sin(this.time * 2);
    for (const p of this.particles) {
      p.angle += p.speed * this._spinSpeed;
      const x = cx + Math.cos(p.angle) * p.radius;
      const y = cy + Math.sin(p.angle) * p.radius;
      // Particle trail
      const trailLen = 5;
      for (let t = 0; t < trailLen; t++) {
        const ta = p.angle - t * 0.05 * this._spinSpeed;
        const tx = cx + Math.cos(ta) * p.radius;
        const ty = cy + Math.sin(ta) * p.radius;
        const a = (1 - t / trailLen) * glowIntensity;
        this.ctx.fillStyle = `rgba(${rgb} / ${a})`;
        this.ctx.beginPath();
        this.ctx.arc(tx, ty, Math.max(0, p.size * (1 - t / trailLen)), 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-spinner': Spinner } }
if (!customElements.get(Spinner.tagName)) customElements.define(Spinner.tagName, Spinner);
