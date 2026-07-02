/**
 * LuminaPortalButton — Botão com efeito de portal dimensional ao clicar:
 * swirl (conic gradient) + partículas sendo sugadas para o centro.
 *
 * Variants: void | dimensional | neural
 * Eventos: lumina-click, lumina-portal-open
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { intensityToMultiplier, prefersReducedMotion, randRange } from '../core/utils';

interface VortexParticle { x: number; y: number; angle: number; radius: number; life: number; maxLife: number; size: number; }

export class PortalButton extends LuminaElement {
  static tagName = 'lumina-portal-button';
  private portal: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: VortexParticle[] = [];
  private raf = 0;
  private portalActive = false;

  protected render(): string {
    return `
      <button class="lmpb" part="button" type="button">
        <span class="lmpb__bg" aria-hidden="true"></span>
        <span class="lmpb__portal" part="portal" aria-hidden="true"></span>
        <canvas class="lmpb__particles" part="particles" aria-hidden="true"></canvas>
        <span class="lmpb__label"><slot></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmpb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmpb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(0 0 0 / 0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.25); z-index: 0; }
      .lmpb__portal {
        position: absolute; top: 50%; left: 50%; width: 0; height: 0;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: conic-gradient(from 0deg, transparent 0%, var(--lumina-accent) 25%, transparent 50%, var(--lumina-accent) 75%, transparent 100%);
        filter: blur(8px);
        opacity: 0;
        z-index: 1;
        pointer-events: none;
      }
      .lmpb__portal.is-active {
        animation: lmpb-portal calc(var(--lumina-speed) * 3) var(--lumina-ease-out) forwards;
      }
      @keyframes lmpb-portal {
        0%   { width: 0; height: 0; opacity: 1; transform: translate(-50%, -50%) rotate(0deg); }
        50%  { width: 80px; height: 80px; opacity: 1; transform: translate(-50%, -50%) rotate(720deg); }
        100% { width: 300px; height: 300px; opacity: 0; transform: translate(-50%, -50%) rotate(1440deg); }
      }
      .lmpb__particles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2; }
      .lmpb__label { position: relative; z-index: 3; white-space: nowrap; color: var(--lumina-accent); text-shadow: -1px 0 1px rgb(255 0 80 / 0.6), 1px 0 1px rgb(0 200 255 / 0.6); }
      :host(:hover) .lmpb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmpb__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      :host(:active) .lmpb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      @media (prefers-reduced-motion: reduce) { .lmpb__portal { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this.portal = this.$$('.lmpb__portal');
    this.canvas = this.$$('.lmpb__particles') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.$$('.lmpb')?.addEventListener('click', this.onClick);
    this.$$('.lmpb')?.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private onClick = (): void => {
    this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
    this.openPortal();
  };
  private onKeydown = (e: KeyboardEvent): void => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onClick(); } };
  private openPortal(): void {
    if (prefersReducedMotion() || this.portalActive) return;
    this.portalActive = true;
    this.portal?.classList.add('is-active');
    this.spawnVortex();
    this.dispatchEvent(new CustomEvent('lumina-portal-open', { bubbles: true, composed: true }));
    setTimeout(() => {
      this.portal?.classList.remove('is-active');
      this.portalActive = false;
    }, 1500);
  }
  private spawnVortex(): void {
    if (!this.ctx || !this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth; const h = this.clientHeight;
    this.canvas.width = w * dpr; this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`; this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rgb = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent-rgb').trim() || '120 240 255';
    const intensity = intensityToMultiplier(this.intensity);
    const count = Math.round(24 * intensity);
    const cx = w / 2; const cy = h / 2;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: cx + Math.cos(i) * (40 + Math.random() * 60),
        y: cy + Math.sin(i) * (40 + Math.random() * 60),
        angle: Math.random() * Math.PI * 2,
        radius: 40 + Math.random() * 60,
        life: 0,
        maxLife: 60 + Math.random() * 30,
        size: randRange(1, 2.5),
      });
    }
    if (!this.raf) this.tick(rgb, cx, cy);
  }
  private tick = (rgb: string, cx: number, cy: number): void => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);
    this.particles = this.particles.filter((p) => p.life < p.maxLife && p.radius > 2);
    for (const p of this.particles) {
      p.angle += 0.15;
      p.radius *= 0.96;
      p.life += 1;
      p.x = cx + Math.cos(p.angle) * p.radius;
      p.y = cy + Math.sin(p.angle) * p.radius;
      const a = 1 - p.life / p.maxLife;
      this.ctx.fillStyle = `rgba(${rgb} / ${a})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(0, p.size * a), 0, Math.PI * 2);
      this.ctx.fill();
    }
    if (this.particles.length > 0) this.raf = requestAnimationFrame(() => this.tick(rgb, cx, cy));
    else { this.raf = 0; this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight); }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-portal-button': PortalButton } }
if (!customElements.get(PortalButton.tagName)) customElements.define(PortalButton.tagName, PortalButton);
