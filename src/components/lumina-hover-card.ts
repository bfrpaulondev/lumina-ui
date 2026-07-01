/**
 * LuminaHoverCard — Expande e revela mais conteúdo ao hover com efeito 3D de elevação.
 * Variants: glass | morph | neural
 * Slots: preview (always visible), default (revealed on hover)
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class HoverCard extends LuminaElement {
  static tagName = 'lumina-hover-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'expand-on-hover']; }
  private _expandOnHover = true;

  get expandOnHover(): boolean { return this._expandOnHover; }
  set expandOnHover(v: boolean) { this._expandOnHover = v; if (v) this.setAttribute('expand-on-hover',''); else this.removeAttribute('expand-on-hover'); }

  protected render(): string {
    return `
      <article class="lmhc" part="card">
        <div class="lmhc__surface" part="surface">
          <div class="lmhc__preview" part="preview">
            <slot name="preview"></slot>
          </div>
          <div class="lmhc__expanded" part="expanded-content">
            <slot></slot>
          </div>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmhc { position: relative; display: block; border-radius: inherit; transition: transform var(--lumina-speed) var(--lumina-ease-spring), box-shadow var(--lumina-speed) var(--lumina-ease-out); will-change: transform; }
      :host(:hover) .lmhc { transform: translateY(-8px) scale(1.02); box-shadow: 0 24px 60px -20px rgb(var(--lumina-accent-rgb) / 0.4); }
      .lmhc__surface { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 20px; overflow: hidden; }
      .lmhc__preview { position: relative; z-index: 1; }
      .lmhc__expanded { position: relative; z-index: 1; max-height: 0; opacity: 0; overflow: hidden; transition: max-height calc(var(--lumina-speed) * 1.5) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out), margin var(--lumina-speed) var(--lumina-ease-spring); margin-top: 0; }
      :host(:hover) .lmhc__expanded, :host([expand-on-hover="false"]) .lmhc__expanded { max-height: 300px; opacity: 1; margin-top: 12px; }
      :host([expand-on-hover="false"]) .lmhc__expanded { transition: none; }
      :host([variant="morph"]) .lmhc { clip-path: polygon(0 8%, 8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%); }
      :host([variant="neural"]) .lmhc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmhc, .lmhc__expanded { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._expandOnHover = this.getAttribute('expand-on-hover') !== 'false';
    this.addEventListener('pointerenter', this.onEnter);
    this.addEventListener('pointerleave', this.onLeave);
  }
  protected unmounted(): void { this.removeEventListener('pointerenter', this.onEnter); this.removeEventListener('pointerleave', this.onLeave); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'expand-on-hover') this._expandOnHover = value !== 'false';
  }
  private onEnter = (): void => {
    this.dispatchEvent(new CustomEvent('lumina-hover', { bubbles: true, composed: true, detail: { hovering: true } }));
    if (this._expandOnHover) this.dispatchEvent(new CustomEvent('lumina-expand', { bubbles: true, composed: true, detail: { expanded: true } }));
  };
  private onLeave = (): void => {
    this.dispatchEvent(new CustomEvent('lumina-hover', { bubbles: true, composed: true, detail: { hovering: false } }));
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-hover-card': HoverCard } }
if (!customElements.get(HoverCard.tagName)) customElements.define(HoverCard.tagName, HoverCard);
