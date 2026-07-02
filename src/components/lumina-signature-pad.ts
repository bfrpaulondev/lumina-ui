/**
 * LuminaSignaturePad — Suavização com física, efeito de tinta que escorre, exportação.
 * Variants: glass | neural | minimal
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

export class SignaturePad extends LuminaElement {
  static tagName = 'lumina-signature-pad';
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private drawing = false;
  private lastX = 0; private lastY = 0;
  private points: Array<{x:number;y:number;p:number}> = [];
  private inkDrops: Array<{x:number;y:number;radius:number;life:number}> = [];
  private rafId = 0;

  protected render(): string {
    return `
      <div class="lmsp" part="canvas">
        <canvas class="lmsp__canvas"></canvas>
        <div class="lmsp__toolbar" part="toolbar">
          <button class="lmsp__clear" type="button" aria-label="Limpar">🗑 Limpar</button>
          <button class="lmsp__export" type="button" aria-label="Exportar PNG">⬇ PNG</button>
        </div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmsp { position: relative; border-radius: var(--lumina-radius-lg); overflow: hidden; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); }
      .lmsp__canvas { display: block; width: 100%; height: 200px; cursor: crosshair; touch-action: none; }
      .lmsp__toolbar { display: flex; gap: 8px; padding: 8px 12px; border-top: 1px solid var(--lumina-border); background: rgb(var(--lumina-surface) / 0.3); }
      .lmsp__clear, .lmsp__export { appearance: none; border: 1px solid var(--lumina-border); background: rgb(var(--lumina-accent-rgb) / 0.1); color: var(--lumina-text); padding: 6px 12px; border-radius: 6px; cursor: pointer; font: 600 12px var(--lumina-font-sans); transition: background 0.2s; }
      .lmsp__clear:hover, .lmsp__export:hover { background: rgb(var(--lumina-accent-rgb) / 0.3); }
      :host([variant="minimal"]) .lmsp { border: 0; background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; }
      :host([variant="minimal"]) .lmsp__toolbar { background: transparent; border: 0; }
    `;
  }
  protected mounted(): void {
    this.canvas = this.$$('.lmsp__canvas') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    this.resizeCanvas();
    this.canvas?.addEventListener('pointerdown', this.onPointerDown);
    this.canvas?.addEventListener('pointermove', this.onPointerMove);
    this.canvas?.addEventListener('pointerup', this.onPointerUp);
    this.canvas?.addEventListener('pointerleave', this.onPointerUp);
    this.$$('.lmsp__clear')?.addEventListener('click', this.clear);
    this.$$('.lmsp__export')?.addEventListener('click', this.exportPNG);
    window.addEventListener('resize', () => this.resizeCanvas());
    if (!prefersReducedMotion()) this.rafId = requestAnimationFrame(this.rafLoop);
  }
  protected unmounted(): void { cancelAnimationFrame(this.rafId); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private resizeCanvas(): void {
    if (!this.canvas || !this.ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.clientWidth; const h = this.canvas.clientHeight;
    this.canvas.width = w * dpr; this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  private getPos(e: PointerEvent): {x:number;y:number} {
    if (!this.canvas) return {x:0,y:0};
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  private onPointerDown = (e: PointerEvent): void => {
    this.drawing = true;
    const p = this.getPos(e);
    this.lastX = p.x; this.lastY = p.y;
    this.points = [{x:p.x, y:p.y, p:e.pressure || 0.5}];
    this.dispatchEvent(new CustomEvent('lumina-signature-start', { bubbles: true, composed: true }));
  };
  private onPointerMove = (e: PointerEvent): void => {
    if (!this.drawing || !this.ctx) return;
    const p = this.getPos(e);
    this.points.push({x:p.x, y:p.y, p:e.pressure || 0.5});
    // Smooth bezier curve between last 3 points
    if (this.points.length >= 3) {
      const p0 = this.points[this.points.length - 3];
      const p1 = this.points[this.points.length - 2];
      const p2 = this.points[this.points.length - 1];
      const midX1 = (p0.x + p1.x) / 2;
      const midY1 = (p0.y + p1.y) / 2;
      const midX2 = (p1.x + p2.x) / 2;
      const midY2 = (p1.y + p2.y) / 2;
      const width = Math.max(1, 2 + (e.pressure || 0.5) * 2);
      this.ctx.strokeStyle = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent').trim() || '#7c5cff';
      this.ctx.lineWidth = width;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(midX1, midY1);
      this.ctx.quadraticCurveTo(p1.x, p1.y, midX2, midY2);
      this.ctx.stroke();
    }
    // Random ink drops
    if (Math.random() < 0.05) {
      this.inkDrops.push({ x: p.x + (Math.random() - 0.5) * 4, y: p.y + (Math.random() - 0.5) * 4, radius: 0, life: 0 });
    }
    this.lastX = p.x; this.lastY = p.y;
  };
  private onPointerUp = (): void => {
    if (!this.drawing) return;
    this.drawing = false;
    this.dispatchEvent(new CustomEvent('lumina-signature-end', { bubbles: true, composed: true }));
  };
  private rafLoop = (): void => {
    if (this.ctx && this.canvas) {
      const color = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent').trim() || '#7c5cff';
      this.inkDrops = this.inkDrops.filter((d) => d.life < 20);
      for (const d of this.inkDrops) {
        d.life += 1;
        d.radius += 0.3;
        const a = (1 - d.life / 20) * 0.3;
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = a;
        this.ctx.beginPath();
        this.ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }
    }
    this.rafId = requestAnimationFrame(this.rafLoop);
  };
  private clear = (): void => {
    if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.inkDrops = [];
    this.points = [];
  };
  private exportPNG = (): void => {
    if (!this.canvas) return;
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = this.canvas.toDataURL();
    link.click();
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-signature-pad': SignaturePad } }
if (!customElements.get(SignaturePad.tagName)) customElements.define(SignaturePad.tagName, SignaturePad);
