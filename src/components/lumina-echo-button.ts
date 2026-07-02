/**
 * LuminaEchoButton — Botão que gera eco visual do clique: ondas circulares
 * se expandindo a partir do ponto clicado. Múltiplos ecos podem coexistir.
 *
 * Variants: glass | aura | neural
 * Props: echo-count (número de ondas concêntricas)
 * Eventos: lumina-click, lumina-echo (detail: { x, y })
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

export class EchoButton extends LuminaElement {
  static tagName = 'lumina-echo-button';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'echo-count'];
  }
  private _echoCount = 3;
  private container: HTMLElement | null = null;

  get echoCount(): number { return this._echoCount; }
  set echoCount(v: number) { this._echoCount = v; this.setAttribute('echo-count', String(v)); }

  protected render(): string {
    return `
      <button class="lmeb" part="button" type="button">
        <span class="lmeb__bg" aria-hidden="true"></span>
        <span class="lmeb__echo" part="echo" aria-hidden="true"></span>
        <span class="lmeb__label"><slot></slot></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmeb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmeb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmeb__echo { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; border-radius: inherit; }
      .lmeb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmeb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmeb__bg { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      :host(:active) .lmeb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="aura"]) .lmeb { animation: lmeb-float 4s ease-in-out infinite; }
      @keyframes lmeb-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      .lmeb__wave {
        position: absolute; border-radius: 50%; pointer-events: none;
        border: 2px solid var(--lumina-accent);
        transform: translate(-50%, -50%) scale(0);
        animation: lmeb-wave calc(var(--lumina-speed) * 3) var(--lumina-ease-out) forwards;
      }
      @keyframes lmeb-wave {
        0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
        100% { transform: translate(-50%, -50%) scale(10); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) { .lmeb, .lmeb__wave { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._echoCount = parseInt(this.getAttribute('echo-count') ?? '3', 10) || 3;
    this.container = this.$$('.lmeb__echo');
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.$$('.lmeb')?.addEventListener('click', this.onClick);
    this.$$('.lmeb')?.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'echo-count') this._echoCount = parseInt(value ?? '3', 10) || 3;
  }
  private onClick = (e: MouseEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.spawnEchoes(x, y);
    this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('lumina-echo', { bubbles: true, composed: true, detail: { x, y } }));
  };
  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const rect = this.getBoundingClientRect();
      this.spawnEchoes(rect.width / 2, rect.height / 2);
      this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
    }
  };
  private spawnEchoes(x: number, y: number): void {
    if (prefersReducedMotion() || !this.container) return;
    for (let i = 0; i < this._echoCount; i++) {
      setTimeout(() => {
        const wave = document.createElement('span');
        wave.className = 'lmeb__wave';
        wave.style.left = `${x}px`;
        wave.style.top = `${y}px`;
        wave.style.width = '20px';
        wave.style.height = '20px';
        this.container!.appendChild(wave);
        setTimeout(() => wave.remove(), 1500);
      }, i * 150);
    }
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-echo-button': EchoButton } }
if (!customElements.get(EchoButton.tagName)) customElements.define(EchoButton.tagName, EchoButton);
