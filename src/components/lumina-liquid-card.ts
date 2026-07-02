/**
 * LuminaLiquidCard — Deformação líquida da superfície ao arrastar + onda ao clicar.
 * Variants: morph | glass | neural
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { throttle } from '../core/utils';

export class LiquidCard extends LuminaElement {
  static tagName = 'lumina-liquid-card';
  private surface: HTMLElement | null = null;
  private raf = 0;
  private targetX = 0; private targetY = 0;
  private currentX = 0; private currentY = 0;

  protected render(): string {
    return `
      <article class="lmlc" part="card">
        <div class="lmlc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmlc { position: relative; display: block; border-radius: inherit; }
      .lmlc__surface { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; overflow: hidden; transition: border-radius 0.2s var(--lumina-ease-out); will-change: border-radius, transform; }
      .lmlc__surface::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(200px circle at var(--lx, 50%) var(--ly, 50%), rgb(var(--lumina-accent-rgb) / 0.15), transparent 60%); pointer-events: none; opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmlc__surface::before { opacity: 1; }
      .lmlc__wave { position: absolute; border-radius: 50%; pointer-events: none; border: 2px solid rgb(var(--lumina-accent-rgb) / 0.5); transform: translate(-50%, -50%) scale(0); animation: lmlc-wave 0.8s var(--lumina-ease-out) forwards; }
      @keyframes lmlc-wave { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; } 100% { transform: translate(-50%, -50%) scale(8); opacity: 0; } }
      :host([variant="glass"]) .lmlc__surface { background: linear-gradient(135deg, rgb(255 255 255 / 0.1), rgb(var(--lumina-surface) / var(--lumina-surface-alpha))); }
      :host([variant="neural"]) .lmlc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmlc__surface { transition: none !important; } .lmlc__wave { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this.surface = this.$$('.lmlc__surface');
    this.addEventListener('pointermove', this.onMove);
    this.addEventListener('pointerleave', this.onLeave);
    this.addEventListener('click', this.onClick);
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); this.removeEventListener('pointermove', this.onMove); this.removeEventListener('pointerleave', this.onLeave); this.removeEventListener('click', this.onClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private onMove = throttle((e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.setProperty('--lx', `${x}%`);
    this.style.setProperty('--ly', `${y}%`);
    // Liquid deformation: shift border-radius based on cursor position
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    this.targetX = px;
    this.targetY = py;
    if (!this.raf) this.tick();
    this.dispatchEvent(new CustomEvent('lumina-interact', { bubbles: true, composed: true, detail: { x: px, y: py, type: 'move' } }));
  }, 16);
  private onLeave = (): void => {
    this.targetX = 0; this.targetY = 0;
    if (!this.raf) this.tick();
  };
  private tick = (): void => {
    this.currentX += (this.targetX - this.currentX) * 0.15;
    this.currentY += (this.targetY - this.currentY) * 0.15;
    if (this.surface) {
      const r1 = 40 + this.currentX * 30;
      const r2 = 40 - this.currentX * 30;
      const r3 = 40 + this.currentY * 30;
      const r4 = 40 - this.currentY * 30;
      this.surface.style.borderRadius = `${r1}% ${r2}% ${r3}% ${r4}% / ${r4}% ${r3}% ${r2}% ${r1}%`;
    }
    if (Math.abs(this.targetX - this.currentX) > 0.01 || Math.abs(this.targetY - this.currentY) > 0.01) {
      this.raf = requestAnimationFrame(this.tick);
    } else { this.raf = 0; if (this.surface) this.surface.style.borderRadius = 'inherit'; }
  };
  private onClick = (e: MouseEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const wave = document.createElement('span');
    wave.className = 'lmlc__wave';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    wave.style.width = '30px';
    wave.style.height = '30px';
    this.surface?.appendChild(wave);
    setTimeout(() => wave.remove(), 800);
    this.dispatchEvent(new CustomEvent('lumina-interact', { bubbles: true, composed: true, detail: { x, y, type: 'click' } }));
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-liquid-card': LiquidCard } }
if (!customElements.get(LiquidCard.tagName)) customElements.define(LiquidCard.tagName, LiquidCard);
