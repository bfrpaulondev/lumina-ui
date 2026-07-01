/**
 * LuminaParticleCard — Sistema de partículas integrado que reage ao hover/clique.
 * Variants: neural | aura | void
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { intensityToMultiplier, prefersReducedMotion, randRange } from '../core/utils';

interface BurstParticle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; }

export class ParticleCard extends LuminaElement {
  static tagName = 'lumina-particle-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'particle-count']; }
  private _particleCount = 50;
  private field: ParticleField | null = null;
  private fieldHost: HTMLElement | null = null;
  private burstCanvas: HTMLCanvasElement | null = null;
  private burstCtx: CanvasRenderingContext2D | null = null;
  private burstParticles: BurstParticle[] = [];
  private burstRaf = 0;

  get particleCount(): number { return this._particleCount; }
  set particleCount(v: number) { this._particleCount = v; this.setAttribute('particle-count', String(v)); this.rebuildField(); }

  protected render(): string {
    return `
      <article class="lmpa" part="card">
        <div class="lmpa__particles" part="particles" aria-hidden="true"></div>
        <canvas class="lmpa__burst" aria-hidden="true"></canvas>
        <div class="lmpa__surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmpa { position: relative; display: block; border-radius: inherit; overflow: hidden; }
      .lmpa__particles { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 0; opacity: 0.6; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmpa__particles { opacity: 1; }
      .lmpa__burst { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
      .lmpa__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.08), var(--lumina-shadow); padding: 24px; }
      :host([variant="aura"]) .lmpa__surface { background: radial-gradient(120% 100% at 50% 0%, rgb(var(--lumina-accent-rgb) / 0.15), rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%); }
      :host([variant="void"]) .lmpa__surface { background: rgb(0 0 0 / 0.5); }
      @media (prefers-reduced-motion: reduce) { .lmpa__particles { opacity: 0.3; } }
    `;
  }
  protected mounted(): void {
    this._particleCount = parseInt(this.getAttribute('particle-count') ?? '50', 10) || 50;
    this.fieldHost = this.$$('.lmpa__particles');
    this.burstCanvas = this.$$('.lmpa__burst') as HTMLCanvasElement | null;
    this.burstCtx = this.burstCanvas?.getContext('2d') ?? null;
    if (!prefersReducedMotion()) this.buildField();
    this.addEventListener('click', this.onClick);
  }
  protected unmounted(): void { this.field?.destroy(); this.field = null; cancelAnimationFrame(this.burstRaf); }
  protected onConfigChange(changed: Partial<LuminaElementAttributes>): void {
    if (changed.intensity || changed['accent-color']) this.rebuildField();
  }
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'particle-count') { this._particleCount = parseInt(value ?? '50', 10) || 50; this.rebuildField(); }
  }
  private rebuildField(): void { this.field?.destroy(); this.field = null; if (!prefersReducedMotion()) this.buildField(); }
  private buildField(): void {
    if (!this.fieldHost) return;
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    this.field = new ParticleField(this.shadow.host as HTMLElement, {
      count: Math.round(this._particleCount * intensity),
      rgb,
      sizeRange: [0.6, 2],
      speedRange: [0.1, 0.5],
      lifeRange: [120, 240],
      connect: this.variant === 'neural',
      starfield: this.variant === 'void',
    });
    this.field.mount(this.fieldHost);
  }
  private onClick = (e: MouseEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.spawnBurst(x, y);
    this.dispatchEvent(new CustomEvent('lumina-particle-interact', { bubbles: true, composed: true, detail: { x, y, type: 'click' } }));
  };
  private spawnBurst(cx: number, cy: number): void {
    if (prefersReducedMotion() || !this.burstCtx || !this.burstCanvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth; const h = this.clientHeight;
    this.burstCanvas.width = w * dpr; this.burstCanvas.height = h * dpr;
    this.burstCanvas.style.width = `${w}px`; this.burstCanvas.style.height = `${h}px`;
    this.burstCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    const count = Math.round(20 * intensity);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const sp = 2 + Math.random() * 4 * intensity;
      this.burstParticles.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, maxLife: 40 + Math.random() * 30, size: randRange(1, 2.5) });
    }
    if (!this.burstRaf) this.tickBurst(rgb);
  }
  private tickBurst = (rgb: string): void => {
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
    if (this.burstParticles.length > 0) this.burstRaf = requestAnimationFrame(() => this.tickBurst(rgb));
    else { this.burstRaf = 0; this.burstCtx.clearRect(0, 0, this.clientWidth, this.clientHeight); }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-particle-card': ParticleCard } }
if (!customElements.get(ParticleCard.tagName)) customElements.define(ParticleCard.tagName, ParticleCard);
