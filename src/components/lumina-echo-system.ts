/**
 * LuminaEchoSystem — Ecos visuais entre componentes. Cliques em um geram ondas em outros.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class EchoSystem extends LuminaElement {
  static tagName = 'lumina-echo-system';

  protected render(): string { return `<div class="lmes" part="root"><div class="lmes__source" part="source"><slot></slot></div><canvas class="lmes__echoes" aria-hidden="true"></canvas></div>`; }
  protected styles(): string {
    return `
      :host { display: block; position: relative; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmes { position: relative; }
      .lmes__source { position: relative; z-index: 1; }
      .lmes__echoes { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
    `;
  }
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private echoes: Array<{x:number;y:number;radius:number;life:number;maxLife:number}> = [];
  private raf = 0;

  protected mounted(): void {
    this.canvas = this.$$('.lmes__echoes') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    // Listen for lumina-click events from children
    this.addEventListener('lumina-click', this.onInteract);
    this.addEventListener('lumina-press', this.onInteract);
    this.addEventListener('click', this.onInteract);
    if (!prefersReducedMotion()) this.raf = requestAnimationFrame(this.tick);
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private onInteract = (e: Event): void => {
    const me = e as MouseEvent;
    const rect = this.getBoundingClientRect();
    const x = me.clientX ? me.clientX - rect.left : rect.width / 2;
    const y = me.clientY ? me.clientY - rect.top : rect.height / 2;
    this.echoes.push({ x, y, radius: 0, life: 0, maxLife: 60 });
    // Also pulse child lumina components
    this.querySelectorAll('lumina-card, lumina-button, lumina-badge, lumina-chip').forEach((el, i) => {
      setTimeout(() => {
        (el as HTMLElement).style.transition = 'box-shadow 0.4s var(--lumina-ease-out)';
        const oldShadow = (el as HTMLElement).style.boxShadow;
        (el as HTMLElement).style.boxShadow = `0 0 20px rgb(var(--lumina-accent-rgb) / 0.6)`;
        setTimeout(() => { (el as HTMLElement).style.boxShadow = oldShadow; }, 400);
      }, i * 50);
    });
    this.dispatchEvent(new CustomEvent('lumina-echo', { bubbles: true, composed: true, detail: { x, y } }));
    this.dispatchEvent(new CustomEvent('lumina-pulse', { bubbles: true, composed: true }));
  };
  private tick = (): void => {
    if (!this.ctx || !this.canvas) { this.raf = requestAnimationFrame(this.tick); return; }
    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth; const h = this.clientHeight;
    if (this.canvas.width !== w * dpr) { this.canvas.width = w * dpr; this.canvas.height = h * dpr; this.canvas.style.width = `${w}px`; this.canvas.style.height = `${h}px`; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    this.ctx.clearRect(0, 0, w, h);
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    this.echoes = this.echoes.filter((e) => e.life < e.maxLife);
    for (const e of this.echoes) {
      e.life += 1; e.radius = (e.life / e.maxLife) * Math.max(w, h) * 0.5;
      const a = (1 - e.life / e.maxLife) * 0.3 * (this.getAttribute("variant") === "intense" ? 1.5 : this.getAttribute("variant") === "subtle" ? 0.5 : 1);
      this.ctx.strokeStyle = `rgba(${rgb} / ${a})
      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath(); this.ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2); this.ctx.stroke();
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-echo-system': EchoSystem } }
if (!customElements.get(EchoSystem.tagName)) customElements.define(EchoSystem.tagName, EchoSystem);
