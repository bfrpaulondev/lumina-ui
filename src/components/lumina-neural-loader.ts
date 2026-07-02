/**
 * LuminaNeuralLoader — Rede neural canvas que se constrói gradualmente conforme o progresso avança.
 * Variants: neural | intense | subtle
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { clamp, prefersReducedMotion, randRange } from '../core/utils';
import { formFieldSharedStyles } from '../core/form-field-mixin';

interface Node { x: number; y: number; vx: number; vy: number; }

export class NeuralLoader extends LuminaElement {
  static tagName = 'lumina-neural-loader';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'progress']; }
  private _progress = 0;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private nodes: Node[] = [];
  private raf = 0;
  private allNodes: Node[] = [];

  get progress(): number { return this._progress; }
  set progress(v: number) { this._progress = clamp(v, 0, 100); this.setAttribute('progress', String(this._progress)); this.updateNodes(); this.dispatchEvent(new CustomEvent('lumina-progress', { bubbles: true, composed: true, detail: { progress: this._progress } })); }

  protected render(): string {
    return `
      <div class="lmnl" part="loader" role="status" aria-label="Carregando">
        <canvas class="lmnl__network" part="network" aria-hidden="true"></canvas>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmnl-size: 80px; }
      .lmnl { position: relative; width: var(--lmnl-size); height: var(--lmnl-size); }
      .lmnl__network { width: 100%; height: 100%; }
      :host([variant="intense"]) { --lmnl-size: 100px; }
      :host([variant="subtle"]) { --lmnl-size: 60px; }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmnl__network { opacity: 0.5; } }
    `;
  }
  protected mounted(): void {
    this._progress = clamp(parseFloat(this.getAttribute('progress') ?? '0') || 0, 0, 100);
    const size = this.getAttribute("variant") === "intense" ? 100 : this.getAttribute("variant") === "subtle" ? 60 : 80;
    this.style.setProperty('--lmnl-size', `${size}px`);
    this.canvas = this.$$('.lmnl__network') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    this.initNodes(size);
    this.updateNodes();
    if (!prefersReducedMotion()) { this.resize(); this.raf = requestAnimationFrame(this.tick); }
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'progress') { this._progress = clamp(parseFloat(value ?? '0') || 0, 0, 100); this.updateNodes(); }
  }
  private initNodes(size: number): void {
    const count = 12;
    this.allNodes = [];
    for (let i = 0; i < count; i++) {
      this.allNodes.push({
        x: randRange(size * 0.2, size * 0.8),
        y: randRange(size * 0.2, size * 0.8),
        vx: randRange(-0.3, 0.3),
        vy: randRange(-0.3, 0.3),
      });
    }
  }
  private updateNodes(): void {
    const visibleCount = Math.ceil((this._progress / 100) * this.allNodes.length);
    this.nodes = this.allNodes.slice(0, Math.max(1, visibleCount));
  }
  private resize(): void {
    if (!this.canvas || !this.ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const size = this.canvas.clientWidth || 80;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  private tick = (): void => {
    if (!this.ctx || !this.canvas) { this.raf = requestAnimationFrame(this.tick); return; }
    const size = this.canvas.clientWidth || 80;
    this.ctx.clearRect(0, 0, size, size);
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    // Move nodes
    for (const n of this.nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < size * 0.15 || n.x > size * 0.85) n.vx *= -1;
      if (n.y < size * 0.15 || n.y > size * 0.85) n.vy *= -1;
    }
    // Draw connections
    const maxDist = size * 0.35;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i]; const b = this.nodes[j];
        const dx = a.x - b.x; const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.4;
          this.ctx.strokeStyle = `rgba(${rgb} / ${alpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }
    }
    // Draw nodes
    for (const n of this.nodes) {
      this.ctx.fillStyle = `rgba(${rgb} / 0.9)`;
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = `rgba(${rgb} / 0.3)`;
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-neural-loader': NeuralLoader } }
if (!customElements.get(NeuralLoader.tagName)) customElements.define(NeuralLoader.tagName, NeuralLoader);
