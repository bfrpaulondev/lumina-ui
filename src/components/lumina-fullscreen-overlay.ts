/**
 * LuminaFullscreenOverlay — Portal/buraco negro em tela cheia para experiências imersivas.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion, randRange } from '../core/utils';

export class FullscreenOverlay extends LuminaElement {
  static tagName = 'lumina-fullscreen-overlay';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'open']; }
  private _open = false;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Array<{x:number;y:number;angle:number;radius:number;life:number;size:number}> = [];
  private raf = 0;

  get open(): boolean { return this._open; }
  set open(v: boolean) { if (v) this.show(); else this.hide(); }

  protected render(): string {
    return `
      <div class="lmfo" part="overlay">
        <div class="lmfo__backdrop" part="backdrop" aria-hidden="true"></div>
        <div class="lmfo__portal" aria-hidden="true"></div>
        <canvas class="lmfo__canvas" aria-hidden="true"></canvas>
        <div class="lmfo__content" part="content"><slot></slot></div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: contents; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmfo { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity calc(var(--lumina-speed) * 1.5) var(--lumina-ease-out); }
      :host([data-open]) .lmfo { opacity: 1; pointer-events: auto; }
      .lmfo__backdrop { position: absolute; inset: 0; background: rgb(0 0 0 / 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
      .lmfo__portal { position: absolute; top: 50%; left: 50%; width: 0; height: 0; transform: translate(-50%, -50%); border-radius: 50%; background: conic-gradient(from 0deg, transparent 0%, rgb(var(--lumina-accent-rgb) / 0.4) 15%, transparent 30%, rgb(var(--lumina-accent-rgb) / 0.6) 50%, transparent 70%, rgb(var(--lumina-accent-rgb) / 0.4) 85%, transparent 100%); filter: blur(30px); opacity: 0; pointer-events: none; }
      :host([data-open]) .lmfo__portal { animation: lmfo-portal calc(var(--lumina-speed) * 3) var(--lumina-ease-out) forwards; }
      @keyframes lmfo-portal { 0% { width: 0; height: 0; opacity: 1; } 100% { width: 200vmax; height: 200vmax; opacity: 0.3; } }
      .lmfo__canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      .lmfo__content { position: relative; z-index: 2; padding: 40px; text-align: center; max-width: 600px; }
      :host([variant="cosmic"]) .lmfo__backdrop { background: radial-gradient(ellipse at center, #0a0420 0%, #000 70%); }
      :host([variant="dimensional"]) .lmfo__backdrop { background: radial-gradient(ellipse at center, #06060c 0%, #000 70%); }
      @media (prefers-reduced-motion: reduce) { .lmfo, .lmfo__portal { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this.canvas = this.$$('.lmfo__canvas') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    if (this.hasAttribute('open')) requestAnimationFrame(() => this.show());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this._open) this.hide(); });
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'open') { if (value !== null) this.show(); else this.hide(); }
  }
  public show(): void {
    if (this._open) return; this._open = true; this.setAttribute('data-open',''); this.setAttribute('open','');
    document.body.style.overflow = 'hidden';
    if (!prefersReducedMotion()) { this.resize(); this.spawnParticles(); this.raf = requestAnimationFrame(this.tick); }
    this.dispatchEvent(new CustomEvent('lumina-open', { bubbles: true, composed: true }));
  }
  public hide(): void {
    if (!this._open) return; this._open = false; this.removeAttribute('data-open'); this.removeAttribute('open');
    document.body.style.overflow = ''; cancelAnimationFrame(this.raf);
    this.dispatchEvent(new CustomEvent('lumina-close', { bubbles: true, composed: true }));
  }
  private resize(): void {
    if (!this.canvas || !this.ctx) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr; this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  private spawnParticles(): void {
    const cx = window.innerWidth / 2; const cy = window.innerHeight / 2;
    for (let i = 0; i < 60; i++) {
      this.particles.push({ x: cx, y: cy, angle: Math.random() * Math.PI * 2, radius: 100 + Math.random() * 400, life: 0, size: randRange(1, 3) });
    }
  }
  private tick = (): void => {
    if (!this.ctx) { this.raf = requestAnimationFrame(this.tick); return; }
    const w = window.innerWidth; const h = window.innerHeight; const cx = w / 2; const cy = h / 2;
    this.ctx.clearRect(0, 0, w, h);
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '120 240 255';
    this.particles = this.particles.filter((p) => p.radius > 5);
    for (const p of this.particles) {
      p.angle += 0.03; p.radius *= 0.98; p.life += 1;
      p.x = cx + Math.cos(p.angle) * p.radius; p.y = cy + Math.sin(p.angle) * p.radius;
      const a = Math.max(0, 1 - p.life / 100) * 0.6;
      this.ctx.fillStyle = `rgba(${rgb} / ${a})`;
      this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); this.ctx.fill();
    }
    while (this.particles.length < 60) this.particles.push({ x: cx, y: cy, angle: Math.random() * Math.PI * 2, radius: 100 + Math.random() * 400, life: 0, size: randRange(1, 3) });
    this.raf = requestAnimationFrame(this.tick);
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-fullscreen-overlay': FullscreenOverlay } }
if (!customElements.get(FullscreenOverlay.tagName)) customElements.define(FullscreenOverlay.tagName, FullscreenOverlay);
