/**
 * LuminaUI — Lightweight 2D particle field.
 *
 * Used by `aura`, `neural` and `void` variants to add floating dots /
 * energy trails / starfields behind a component. The renderer is rAF
 * driven and pauses automatically when the page is hidden or the user
 * prefers reduced motion.
 */

import { createHiDPICanvas, prefersReducedMotion, randRange } from './utils';
import type { Particle, ParticleEmitterOptions } from './types';

export interface ParticleFieldOptions extends Partial<ParticleEmitterOptions> {
  /** RGB triplet string ("r g b") used to tint particles. */
  rgb: string;
  /** Whether to draw connecting lines between nearby particles (neural variant). */
  connect?: boolean;
  /** Background starfield instead of floating particles (void variant). */
  starfield?: boolean;
}

export class ParticleField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private rafId = 0;
  private running = false;
  private readonly opts: ParticleEmitterOptions & {
    rgb: string;
    connect: boolean;
    starfield: boolean;
  };

  constructor(
    private host: HTMLElement,
    options: ParticleFieldOptions,
  ) {
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    this.canvas = createHiDPICanvas(width, height);
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.ctx = this.canvas.getContext('2d')!;

    this.opts = {
      count: options.count ?? 40,
      hueRange: options.hueRange ?? [240, 320],
      sizeRange: options.sizeRange ?? [1, 3],
      speedRange: options.speedRange ?? [0.2, 0.8],
      lifeRange: options.lifeRange ?? [120, 240],
      spread: options.spread ?? Math.PI * 2,
      rgb: options.rgb,
      connect: options.connect ?? false,
      starfield: options.starfield ?? false,
    };

    this.spawn();
  }

  /** Attach the canvas to a parent element. */
  mount(parent: HTMLElement): void {
    parent.appendChild(this.canvas);
    if (!prefersReducedMotion()) this.start();
  }

  /** Start the rAF loop. */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.loop();
  }

  /** Stop the rAF loop. */
  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  /** Remove the canvas and stop the loop. */
  destroy(): void {
    this.stop();
    this.canvas.remove();
  }

  /** Resize the canvas to match a new width/height (CSS pixels). */
  resize(width: number, height: number): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.max(1, Math.floor(width * dpr));
    this.canvas.height = Math.max(1, Math.floor(height * dpr));
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ------------------------------------------------------------------ */

  private spawn(): void {
    const { count, hueRange, sizeRange, speedRange, lifeRange, spread } =
      this.opts;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const angle = randRange(0, spread);
      const speed = randRange(speedRange[0], speedRange[1]);
      this.particles.push({
        x: randRange(0, w),
        y: randRange(0, h),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: randRange(0, lifeRange[1]),
        maxLife: randRange(lifeRange[0], lifeRange[1]),
        size: randRange(sizeRange[0], sizeRange[1]),
        hue: randRange(hueRange[0], hueRange[1]),
      });
    }
  }

  private loop = (): void => {
    if (!this.running) return;
    const ctx = this.ctx;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    ctx.clearRect(0, 0, w, h);

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 1;

      // Wrap-around (starfield) or respawn (energy)
      if (this.opts.starfield) {
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      } else if (p.life >= p.maxLife) {
        p.x = randRange(0, w);
        p.y = randRange(0, h);
        p.life = 0;
      }

      const alpha = this.opts.starfield
        ? 0.4 + 0.6 * Math.sin((p.life / p.maxLife) * Math.PI * 2)
        : 1 - p.life / p.maxLife;
      ctx.fillStyle = `rgba(${this.opts.rgb} / ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.opts.connect) {
      const maxDist = 90;
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(${this.opts.rgb} / ${
              (1 - dist / maxDist) * 0.4
            })`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    this.rafId = requestAnimationFrame(this.loop);
  };
}
