/**
 * LuminaPasswordInput — Revelação animada, indicador de força com partículas, máscara animada.
 * Variants: glass | neural | secure
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { randRange } from '../core/utils';

interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; }

export class PasswordInput extends LuminaElement {
  static tagName = 'lumina-password-input';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'value']; }
  private _value = '';
  private _visible = false;
  private input: HTMLInputElement | null = null;
  private strengthBar: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private raf = 0;

  get value(): string { return this._value; }
  set value(v: string) { this._value = v; this.setAttribute('value', v); if (this.input) this.input.value = v; this.updateStrength(); }

  protected render(): string {
    return `
      <label class="lmpw" part="field">
        <div class="lmpw__shell" part="control">
          <div class="lmpw__bg" aria-hidden="true"></div>
          <input class="lmpw__el" type="password" placeholder="Digite sua senha..." />
          <button class="lmpw__toggle" part="toggle" type="button" aria-label="Mostrar senha">👁</button>
        </div>
        <div class="lmpw__strength" part="strength-meter">
          <div class="lmpw__strength-bar"></div>
          <span class="lmpw__strength-label"></span>
        </div>
        <canvas class="lmpw__particles" aria-hidden="true"></canvas>
      </label>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmpw { display: flex; flex-direction: column; gap: 8px; position: relative; }
      .lmpw__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmpw__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmpw__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmpw__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); letter-spacing: 0.1em; }
      .lmpw__el::placeholder { color: var(--lumina-text-muted); letter-spacing: normal; }
      .lmpw__toggle { position: relative; z-index: 1; margin-right: 8px; appearance: none; border: 0; background: transparent; color: var(--lumina-text-muted); cursor: pointer; font-size: 16px; width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; transition: background 0.2s, transform 0.2s; }
      .lmpw__toggle:hover { background: rgb(var(--lumina-accent-rgb) / 0.15); transform: scale(1.1); }
      .lmpw__strength { display: flex; align-items: center; gap: 8px; }
      .lmpw__strength-bar { flex: 1; height: 4px; border-radius: 2px; background: rgb(var(--lumina-surface) / 0.4); overflow: hidden; position: relative; }
      .lmpw__strength-bar::after { content: ''; position: absolute; top: 0; left: 0; height: 100%; width: 0%; border-radius: inherit; transition: width 0.4s var(--lumina-ease-out), background 0.4s; }
      :host([data-strength="1"]) .lmpw__strength-bar::after { width: 25%; background: #ef4444; }
      :host([data-strength="2"]) .lmpw__strength-bar::after { width: 50%; background: #f59e0b; }
      :host([data-strength="3"]) .lmpw__strength-bar::after { width: 75%; background: #22c55e; }
      :host([data-strength="4"]) .lmpw__strength-bar::after { width: 100%; background: #22c55e; box-shadow: 0 0 12px #22c55e; }
      .lmpw__strength-label { font-size: 11px; font-weight: 600; color: var(--lumina-text-muted); min-width: 60px; text-align: right; }
      :host([data-strength="1"]) .lmpw__strength-label { color: #ef4444; }
      :host([data-strength="2"]) .lmpw__strength-label { color: #f59e0b; }
      :host([data-strength="3"]) .lmpw__strength-label { color: #22c55e; }
      :host([data-strength="4"]) .lmpw__strength-label { color: #22c55e; }
      .lmpw__particles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2; }
      :host([variant="secure"]) .lmpw__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.3); }
      @media (prefers-reduced-motion: reduce) { .lmpw__strength-bar::after { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._value = this.getAttribute('value') ?? '';
    this.input = this.$$('.lmpw__el') as HTMLInputElement | null;
    this.strengthBar = this.$$('.lmpw__strength-bar');
    this.canvas = this.$$('.lmpw__particles') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    if (this.input) {
      this.input.value = this._value;
      this.input.addEventListener('input', this.onInput);
    }
    this.$$('.lmpw__toggle')?.addEventListener('click', this.toggleVisibility);
    this.updateStrength();
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value') { this._value = value ?? ''; if (this.input) this.input.value = this._value; this.updateStrength(); }
  }
  private onInput = (e: Event): void => {
    this._value = (e.target as HTMLInputElement).value;
    this.updateStrength();
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { value: this._value } }));
  };
  private toggleVisibility = (): void => {
    this._visible = !this._visible;
    if (this.input) {
      this.input.type = this._visible ? 'text' : 'password';
      // Revelação animada: dispara partículas
      this.spawnRevealParticles();
    }
    this.dispatchEvent(new CustomEvent('lumina-visibility-toggle', { bubbles: true, composed: true, detail: { visible: this._visible } }));
  };
  private updateStrength(): void {
    const v = this._value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    this.setAttribute('data-strength', String(score));
    const labels = ['', 'Fraca', 'Média', 'Boa', 'Forte'];
    const labelEl = this.$$('.lmpw__strength-label');
    if (labelEl) labelEl.textContent = v.length === 0 ? '' : labels[score];
    this.dispatchEvent(new CustomEvent('lumina-strength-change', { bubbles: true, composed: true, detail: { score, label: labels[score] } }));
    if (score === 4) this.spawnStrengthParticles();
  }
  private spawnRevealParticles(): void {
    if (!this.ctx || !this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth; const h = this.clientHeight;
    this.canvas.width = w * dpr; this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`; this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rgb = '124 92 255';
    for (let i = 0; i < 20; i++) {
      this.particles.push({ x: w / 2, y: h / 2, vx: randRange(-2, 2), vy: randRange(-2, 2), life: 0, maxLife: 30 + Math.random() * 20 });
    }
    if (!this.raf) this.tick(rgb);
  }
  private spawnStrengthParticles(): void {
    if (!this.ctx) return;
    const rgb = '34 197 94';
    for (let i = 0; i < 10; i++) {
      this.particles.push({ x: randRange(0, this.clientWidth), y: this.clientHeight - 20, vx: randRange(-0.5, 0.5), vy: randRange(-2, -0.5), life: 0, maxLife: 40 });
    }
    if (!this.raf) this.tick(rgb);
  }
  private tick = (rgb: string): void => {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);
    this.particles = this.particles.filter((p) => p.life < p.maxLife);
    for (const p of this.particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life += 1;
      const a = 1 - p.life / p.maxLife;
      this.ctx.fillStyle = `rgba(${rgb} / ${a})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 2 * a, 0, Math.PI * 2);
      this.ctx.fill();
    }
    if (this.particles.length > 0) this.raf = requestAnimationFrame(() => this.tick(rgb));
    else { this.raf = 0; this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight); }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-password-input': PasswordInput } }
if (!customElements.get(PasswordInput.tagName)) customElements.define(PasswordInput.tagName, PasswordInput);
