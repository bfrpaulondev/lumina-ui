/**
 * LuminaRevealCard — Revela conteúdo via IntersectionObserver ao entrar na viewport.
 * Variants: glass | morph | neural
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class RevealCard extends LuminaElement {
  static tagName = 'lumina-reveal-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'reveal-on-scroll']; }
  private _revealOnScroll = true;
  private observer: IntersectionObserver | null = null;
  private revealed = false;

  get revealOnScroll(): boolean { return this._revealOnScroll; }
  set revealOnScroll(v: boolean) { this._revealOnScroll = v; if (v) this.setAttribute('reveal-on-scroll',''); else this.removeAttribute('reveal-on-scroll'); }

  protected render(): string {
    return `
      <article class="lmrc" part="card">
        <div class="lmrc__content" part="content">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmrc { position: relative; display: block; border-radius: inherit; }
      .lmrc__content { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; overflow: hidden; opacity: 0; transform: translateY(40px) scale(0.95); transition: opacity calc(var(--lumina-speed) * 2) var(--lumina-ease-out), transform calc(var(--lumina-speed) * 2) var(--lumina-ease-spring); }
      :host([data-revealed]) .lmrc__content { opacity: 1; transform: translateY(0) scale(1); }
      :host([reveal-on-scroll="false"]) .lmrc__content { opacity: 1; transform: none; }
      :host([variant="morph"]) .lmrc__content { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transition: clip-path calc(var(--lumina-speed) * 2) var(--lumina-ease-spring), opacity calc(var(--lumina-speed) * 2) var(--lumina-ease-out); }
      :host([variant="morph"]) .lmrc__content { clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%); }
      :host([variant="morph"][data-revealed]) .lmrc__content { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      :host([variant="neural"]) .lmrc__content { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmrc__content { transition: none !important; opacity: 1 !important; transform: none !important; } }
    `;
  }
  protected mounted(): void {
    this._revealOnScroll = this.getAttribute('reveal-on-scroll') !== 'false';
    if (this._revealOnScroll && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.revealed) {
            this.revealed = true;
            this.dispatchEvent(new CustomEvent('lumina-reveal-start', { bubbles: true, composed: true }));
            requestAnimationFrame(() => {
              this.setAttribute('data-revealed', '');
              setTimeout(() => this.dispatchEvent(new CustomEvent('lumina-reveal-complete', { bubbles: true, composed: true })), 800);
            });
            this.observer?.disconnect();
          }
        });
      }, { threshold: 0.2 });
      this.observer.observe(this);
    } else {
      this.setAttribute('data-revealed', '');
    }
  }
  protected unmounted(): void { this.observer?.disconnect(); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'reveal-on-scroll') this._revealOnScroll = value !== 'false';
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-reveal-card': RevealCard } }
if (!customElements.get(RevealCard.tagName)) customElements.define(RevealCard.tagName, RevealCard);
