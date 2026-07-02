/**
 * LuminaMemoryCard — Registra interações (hover/clique/tempo) e exibe estado visual acumulado.
 * Variants: neural | glass | aura
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { clamp } from '../core/utils';

interface MemoryPoint { x: number; y: number; age: number; intensity: number; }

export class MemoryCard extends LuminaElement {
  static tagName = 'lumina-memory-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'memory-enabled']; }
  private _memoryEnabled = true;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private memory: MemoryPoint[] = [];
  private raf = 0;
  private hoverCount = 0;
  private clickCount = 0;
  private totalTime = 0;
  private lastTime = 0;

  get memoryEnabled(): boolean { return this._memoryEnabled; }
  set memoryEnabled(v: boolean) { this._memoryEnabled = v; if (v) this.setAttribute('memory-enabled',''); else this.removeAttribute('memory-enabled'); }

  protected render(): string {
    return `
      <article class="lmmc" part="card">
        <canvas class="lmmc__memory" part="memory-layer" aria-hidden="true"></canvas>
        <div class="lmmc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); --lmmc-warmth: 0; }
      .lmmc { position: relative; display: block; border-radius: inherit; overflow: hidden; }
      .lmmc__memory { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; opacity: calc(0.3 + var(--lmmc-warmth) * 0.5); }
      .lmmc__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 calc(var(--lmmc-warmth) * 30px) rgb(var(--lumina-accent-rgb) / calc(var(--lmmc-warmth) * 0.4)), var(--lumina-shadow); padding: 24px; transition: box-shadow var(--lumina-speed) var(--lumina-ease-out); }
      :host([variant="neural"]) .lmmc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host([variant="aura"]) .lmmc__surface { background: radial-gradient(120% 100% at 50% 0%, rgb(var(--lumina-accent-rgb) / calc(0.1 + var(--lmmc-warmth) * 0.2)), rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%); }
      @media (prefers-reduced-motion: reduce) { .lmmc__surface { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._memoryEnabled = this.getAttribute('memory-enabled') !== 'false';
    this.canvas = this.$$('.lmmc__memory') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    if (this._memoryEnabled) {
      this.addEventListener('pointermove', this.onMove);
      this.addEventListener('click', this.onClick);
      this.addEventListener('pointerenter', this.onEnter);
      this.addEventListener('pointerleave', this.onLeave);
      this.lastTime = Date.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); this.removeEventListener('pointermove', this.onMove); this.removeEventListener('click', this.onClick); this.removeEventListener('pointerenter', this.onEnter); this.removeEventListener('pointerleave', this.onLeave); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'memory-enabled') this._memoryEnabled = value !== 'false';
  }
  private onMove = (e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.memory.push({ x, y, age: 0, intensity: 1 });
    if (this.memory.length > 100) this.memory.shift();
  };
  private onClick = (): void => {
    this.clickCount++;
    this.updateWarmth();
    this.dispatchEvent(new CustomEvent('lumina-memory-update', { bubbles: true, composed: true, detail: { hovers: this.hoverCount, clicks: this.clickCount, time: this.totalTime } }));
  };
  private onEnter = (): void => { this.hoverCount++; this.updateWarmth(); };
  private onLeave = (): void => { this.updateWarmth(); };
  private updateWarmth(): void {
    const warmth = clamp(this.hoverCount * 0.1 + this.clickCount * 0.2, 0, 1);
    this.style.setProperty('--lmmc-warmth', String(warmth));
  }
  private tick = (): void => {
    const now = Date.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (this.matches(':hover')) this.totalTime += dt;
    if (this.ctx && this.canvas) {
      const dpr = window.devicePixelRatio || 1;
      const w = this.clientWidth; const h = this.clientHeight;
      if (this.canvas.width !== w * dpr) {
        this.canvas.width = w * dpr; this.canvas.height = h * dpr;
        this.canvas.style.width = `${w}px`; this.canvas.style.height = `${h}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      this.ctx.clearRect(0, 0, w, h);
      const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
      this.memory = this.memory.filter((p) => p.age < 60);
      for (const p of this.memory) {
        p.age += 1;
        const alpha = (1 - p.age / 60) * 0.4;
        this.ctx.fillStyle = `rgba(${rgb} / ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 3 + p.age * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-memory-card': MemoryCard } }
if (!customElements.get(MemoryCard.tagName)) customElements.define(MemoryCard.tagName, MemoryCard);
