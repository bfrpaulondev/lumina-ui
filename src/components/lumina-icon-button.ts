/**
 * LuminaIconButton — Botão circular/quadrado otimizado para ícones,
 * com glow circular, partículas no clique e suporte a sizes sm/md/lg.
 *
 * Variants: glass | neural | aura | minimal
 *
 * Uso:
 *   <lumina-icon-button variant="glass" size="md" shape="circle" accent-color="#7c5cff">
 *     ⚙
 *   </lumina-icon-button>
 *
 * Eventos:
 *   lumina-click, lumina-hover (detail: { hovering: boolean })
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { coerceAttr, intensityToMultiplier, prefersReducedMotion, randRange } from '../core/utils';

const SIZES = ['sm', 'md', 'lg'] as const;
type Size = (typeof SIZES)[number];
const SIZE_PX: Record<Size, number> = { sm: 32, md: 40, lg: 52 };
const SHAPES = ['circle', 'square'] as const;
type Shape = (typeof SHAPES)[number];

interface BurstParticle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; }

export class IconButton extends LuminaElement {
  static tagName = 'lumina-icon-button';

  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'size', 'shape', 'disabled'];
  }

  private _size: Size = 'md';
  private _shape: Shape = 'circle';
  private _disabled = false;
  private burstCanvas: HTMLCanvasElement | null = null;
  private burstCtx: CanvasRenderingContext2D | null = null;
  private burstParticles: BurstParticle[] = [];
  private burstRaf = 0;

  get size(): Size { return this._size; }
  set size(v: Size) { this._size = v; this.setAttribute('size', v);  }
  get shape(): Shape { return this._shape; }
  set shape(v: Shape) { this._shape = v; this.setAttribute('shape', v);  }
  get disabled(): boolean { return this._disabled; }
  set disabled(v: boolean) { this._disabled = v; if (v) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }

  protected render(): string {
    return `
      <button class="lmib" part="button" type="button">
        <span class="lmib__bg" aria-hidden="true"></span>
        <span class="lmib__ring" aria-hidden="true"></span>
        <span class="lmib__glow" part="glow" aria-hidden="true"></span>
        <canvas class="lmib__particles" part="particles" aria-hidden="true"></canvas>
        <span class="lmib__icon" part="icon"><slot></slot></span>
      </button>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: inline-block;
        cursor: pointer;
        outline: none;
        --lmib-size: 40px;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        -webkit-tap-highlight-color: transparent;
      }
      :host([disabled]) { cursor: not-allowed; opacity: 0.4; }
      :host([disabled]) .lmib { pointer-events: none; }

      .lmib {
        position: relative;
        width: var(--lmib-size);
        height: var(--lmib-size);
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: visible;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
        will-change: transform;
        isolation: isolate;
      }
      :host([shape="square"]) .lmib { border-radius: var(--lumina-radius-md); }
      :host([shape="square"]) .lmib__bg { border-radius: var(--lumina-radius-md); }
      :host([shape="square"]) .lmib__ring { border-radius: var(--lumina-radius-md); }

      .lmib__bg {
        position: absolute; inset: 0;
        border-radius: 50%;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
        z-index: 0;
        transition: background var(--lumina-speed) var(--lumina-ease-out);
      }

      .lmib__ring {
        position: absolute; inset: -1px;
        border-radius: 50%;
        pointer-events: none; z-index: 1;
        opacity: 0;
        background: conic-gradient(from 0deg, transparent 0%, var(--lumina-accent) 25%, transparent 50%, var(--lumina-accent) 75%, transparent 100%);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        padding: 1px;
        animation: lmib-spin 6s linear infinite;
        animation-play-state: paused;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lmib__glow {
        position: absolute; inset: -30%;
        border-radius: 50%;
        pointer-events: none; z-index: 0;
        opacity: 0;
        background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / 0.45), transparent 65%);
        filter: blur(14px);
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lmib__particles {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        pointer-events: none; z-index: 3;
      }

      .lmib__icon {
        position: relative; z-index: 4;
        font-size: calc(var(--lmib-size) * 0.45);
        line-height: 1;
        display: inline-flex; align-items: center; justify-content: center;
      }

      :host(:hover) .lmib { transform: scale(1.1); }
      :host(:hover) .lmib__ring { animation-play-state: running; opacity: 0.7; }
      :host(:hover) .lmib__glow { opacity: calc(0.6 * var(--lumina-intensity)); }
      :host(:active) .lmib { transform: scale(0.92); }
      :host(:focus-visible) .lmib__ring { animation-play-state: running; opacity: 1; }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }

      /* Variant: minimal */
      :host([variant="minimal"]) .lmib__bg { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border-color: transparent; }
      :host([variant="minimal"]:hover) .lmib__bg { background: rgb(var(--lumina-accent-rgb) / 0.12); }

      /* Variant: aura — floating */
      :host([variant="aura"]) .lmib { animation: lmib-float 4s ease-in-out infinite; }
      :host([variant="aura"]) .lmib__glow { opacity: calc(0.3 * var(--lumina-intensity)); }
      @keyframes lmib-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }

      @keyframes lmib-spin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        .lmib, .lmib__ring, .lmib__glow { animation: none !important; transition: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this._size = coerceAttr(this.getAttribute('size'), SIZES, 'md');
    this._shape = coerceAttr(this.getAttribute('shape'), SHAPES, 'circle');
    this._disabled = this.hasAttribute('disabled');
    this.applySize();
    this.applyShape();
    if (this.getAttribute('role') !== 'button') this.setAttribute('role', 'button');
    this.setAttribute('tabindex', this._disabled ? '-1' : '0');
    this.burstCanvas = this.$$('.lmib__particles') as HTMLCanvasElement | null;
    this.burstCtx = this.burstCanvas?.getContext('2d') ?? null;
    this.$$('.lmib')?.addEventListener('click', this.onClick);
    this.$$('.lmib')?.addEventListener('pointerenter', () => this.emitHover(true));
    this.$$('.lmib')?.addEventListener('pointerleave', () => this.emitHover(false));
  }

  protected unmounted(): void { cancelAnimationFrame(this.burstRaf); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'size') { this._size = coerceAttr(value, SIZES, 'md'); this.applySize(); }
    else if (name === 'shape') { this._shape = coerceAttr(value, SHAPES, 'circle'); this.applyShape(); }
    else if (name === 'disabled') { this._disabled = value !== null; this.setAttribute('tabindex', this._disabled ? '-1' : '0'); }
  }

  private applySize(): void { this.style.setProperty('--lmib-size', `${SIZE_PX[this._size]}px`); }
  private applyShape(): void { /* attribute already set via HTML/setter — CSS :host([shape=...]) handles styling */ }

  private onClick = (e: MouseEvent): void => {
    if (this._disabled) { e.preventDefault(); e.stopPropagation(); return; }
    const rect = this.getBoundingClientRect();
    const cx = e.offsetX >= 0 ? e.offsetX : rect.width / 2;
    const cy = e.offsetY >= 0 ? e.offsetY : rect.height / 2;
    this.spawnBurst(cx, cy);
    this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
  };

  private emitHover(hovering: boolean): void {
    this.dispatchEvent(new CustomEvent('lumina-hover', { bubbles: true, composed: true, detail: { hovering } }));
  }

  private spawnBurst(cx: number, cy: number): void {
    if (prefersReducedMotion() || !this.burstCtx || !this.burstCanvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth; const h = this.clientHeight;
    this.burstCanvas.width = w * dpr; this.burstCanvas.height = h * dpr;
    this.burstCanvas.style.width = `${w}px`; this.burstCanvas.style.height = `${h}px`;
    this.burstCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '124 92 255';
    const intensity = intensityToMultiplier(this.intensity);
    const count = Math.round(12 * intensity);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const sp = 1.5 + Math.random() * 3 * intensity;
      this.burstParticles.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, maxLife: 30 + Math.random() * 20, size: randRange(1, 2.5) });
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

declare global { interface HTMLElementTagNameMap { 'lumina-icon-button': IconButton } }
if (!customElements.get(IconButton.tagName)) customElements.define(IconButton.tagName, IconButton);
