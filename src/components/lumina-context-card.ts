/**
 * LuminaContextCard — Detecta tipo de conteúdo (imagem/texto/vídeo) e adapta estilo.
 * Variants: adaptive | neural | glass
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

type ContentType = 'text' | 'image' | 'video' | 'mixed' | 'empty';

export class ContextCard extends LuminaElement {
  static tagName = 'lumina-context-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'auto-adapt']; }
  private _autoAdapt = true;
  private observer: MutationObserver | null = null;

  get autoAdapt(): boolean { return this._autoAdapt; }
  set autoAdapt(v: boolean) { this._autoAdapt = v; if (v) this.setAttribute('auto-adapt',''); else this.removeAttribute('auto-adapt'); }

  protected render(): string {
    return `
      <article class="lmcc" part="card">
        <div class="lmcc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); --lmcc-padding: 24px; --lmcc-glow: 0; }
      .lmcc { position: relative; display: block; border-radius: inherit; transition: all var(--lumina-speed) var(--lumina-ease-out); }
      .lmcc__surface { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 calc(var(--lmcc-glow) * 1px) rgb(var(--lumina-accent-rgb) / 0.3), var(--lumina-shadow); padding: var(--lmcc-padding); transition: all var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-content="image"]) { --lmcc-padding: 0px; --lmcc-glow: 20; }
      :host([data-content="image"]) .lmcc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.3); }
      :host([data-content="text"]) { --lmcc-padding: 28px; }
      :host([data-content="video"]) { --lmcc-padding: 0px; --lmcc-glow: 30; }
      :host([data-content="video"]) .lmcc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.4); }
      :host([data-content="mixed"]) { --lmcc-padding: 20px; --lmcc-glow: 15; }
      :host([variant="neural"]) .lmcc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host(:hover) { --lmcc-glow: 30; }
    `;
  }
  protected mounted(): void {
    this._autoAdapt = this.getAttribute('auto-adapt') !== 'false';
    this.detectContent();
    if (this._autoAdapt) {
      this.observer = new MutationObserver(() => this.detectContent());
      this.observer.observe(this, { childList: true, subtree: true });
    }
  }
  protected unmounted(): void { this.observer?.disconnect(); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'auto-adapt') { this._autoAdapt = value !== 'false'; if (this._autoAdapt) { this.detectContent(); this.observer?.observe(this, { childList: true, subtree: true }); } else this.observer?.disconnect(); }
  }
  private detectContent(): void {
    const imgs = this.querySelectorAll('img').length;
    const videos = this.querySelectorAll('video').length;
    const text = this.textContent?.trim().length ?? 0;
    let type: ContentType = 'empty';
    if (imgs > 0 && videos > 0) type = 'mixed';
    else if (videos > 0) type = 'video';
    else if (imgs > 0 && text > 20) type = 'mixed';
    else if (imgs > 0) type = 'image';
    else if (text > 0) type = 'text';
    this.setAttribute('data-content', type);
    this.dispatchEvent(new CustomEvent('lumina-context-change', { bubbles: true, composed: true, detail: { type } }));
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-context-card': ContextCard } }
if (!customElements.get(ContextCard.tagName)) customElements.define(ContextCard.tagName, ContextCard);
