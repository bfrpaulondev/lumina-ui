/**
 * LuminaVoidCard — Cartão com efeito de portal/buraco negro (conic gradient animado + sucção de partículas).
 * Variants: void | dimensional | deep
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

export class VoidCard extends LuminaElement {
  static tagName = 'lumina-void-card';
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Array<{ x: number; y: number; angle: number; radius: number; life: number; maxLife: number; size: number; }> = [];
  private raf = 0;

  protected render(): string {
    return `
      <article class="lmvc" part="card">
        <div class="lmvc__portal" part="portal" aria-hidden="true"></div>
        <canvas class="lmvc__canvas" aria-hidden="true"></canvas>
        <div class="lmvc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmvc { position: relative; display: block; border-radius: inherit; overflow: hidden; min-height: 200px; }
      .lmvc__portal { position: absolute; top: 50%; left: 50%; width: 80%; height: 80%; transform: translate(-50%, -50%); border-radius: 50%; background: conic-gradient(from 0deg, transparent 0%, rgb(var(--lumina-accent-rgb) / 0.3) 15%, transparent 30%, rgb(var(--lumina-accent-rgb) / 0.5) 50%, transparent 70%, rgb(var(--lumina-accent-rgb) / 0.3) 85%, transparent 100%); filter: blur(20px); animation: lmvc-spin 12s linear infinite; pointer-events: none; z-index: 0; }
      @keyframes lmvc-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
      .lmvc__canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
      .lmvc__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(0 0 0 / 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.2); box-shadow: inset 0 0 40px rgb(0 0 0 / 0.5), var(--lumina-shadow); padding: 24px; min-height: 200px; }
      :host([variant="dimensional"]) .lmvc__surface { background: rgb(0 0 0 / 0.7); border-color: rgb(var(--lumina-accent-rgb) / 0.3); }
      :host([variant="deep"]) .lmvc__surface { background: rgb(0 0 0 / 0.85); }
      :host([variant="deep"]) .lmvc__portal { animation-duration: 8s; }
      :host(:hover) .lmvc__portal { animation-duration: 4s; }
      @media (prefers-reduced-motion: reduce) { .lmvc__portal { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this.canvas = this.$$('.lmvc__canvas') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    if (!prefersReducedMotion()) {
      this.spawnParticles();
      this.raf = requestAnimationFrame(this.tick);
    }
    this.addEventListener('pointermove', this.onMove);
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); this.removeEventListener('pointermove', this.onMove); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private spawnParticles(): void {
    if (!this.ctx || !this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth || 300; const h = this.clientHeight || 200;
    this.canvas.width = w * dpr; this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`; this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: w / 2, y: h / 2,
        angle: Math.random() * Math.PI * 2,
        radius: 20 + Math.random() * Math.max(w, h) * 0.6,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
        size: 0.5 + Math.random() * 1.5,
      });
    }
  }
  private tick = (): void => {
    if (!this.ctx) { this.raf = requestAnimationFrame(this.tick); return; }
    const w = this.clientWidth || 300; const h = this.clientHeight || 200;
    const cx = w / 2; const cy = h / 2;
    this.ctx.clearRect(0, 0, w, h);
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '120 240 255';
    this.particles = this.particles.filter((p) => p.life < p.maxLife && p.radius > 2);
    for (const p of this.particles) {
      p.angle += 0.04;
      p.radius *= 0.985;
      p.life += 1;
      p.x = cx + Math.cos(p.angle) * p.radius;
      p.y = cy + Math.sin(p.angle) * p.radius;
      const a = (1 - p.life / p.maxLife) * 0.8;
      this.ctx.fillStyle = `rgba(${rgb} / ${a})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    // Respawn
    while (this.particles.length < 30) {
      this.particles.push({ x: cx, y: cy, angle: Math.random() * Math.PI * 2, radius: 20 + Math.random() * Math.max(w, h) * 0.6, life: 0, maxLife: 100 + Math.random() * 100, size: 0.5 + Math.random() * 1.5 });
    }
    this.raf = requestAnimationFrame(this.tick);
  };
  private onMove = (): void => { this.dispatchEvent(new CustomEvent('lumina-hover', { bubbles: true, composed: true })); };
}
declare global { interface HTMLElementTagNameMap { 'lumina-void-card': VoidCard } }
if (!customElements.get(VoidCard.tagName)) customElements.define(VoidCard.tagName, VoidCard);
