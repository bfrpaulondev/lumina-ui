/**
 * LuminaContextAware — Detecta contexto (modal/sidebar/card/form) e ajusta componentes automaticamente.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

type Context = 'modal' | 'sidebar' | 'card' | 'form' | 'drawer' | 'page';

export class ContextAware extends LuminaElement {
  static tagName = 'lumina-context-aware';

  protected render(): string { return `<div class="lmca" part="root"><div class="lmca__sensor" part="sensor" aria-hidden="true"></div><div class="lmca__output" part="output"><slot></slot></div></div>`; }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmca { position: relative; }
      .lmca__sensor { position: absolute; inset: 0; pointer-events: none; opacity: 0; }
      .lmca__output { position: relative; }
      :host([data-context="modal"]) .lmca__output { --lumina-intensity: 1; --lumina-surface-alpha: 0.7; }
      :host([data-context="sidebar"]) .lmca__output { --lumina-intensity: 0.6; }
      :host([data-context="card"]) .lmca__output { --lumina-intensity: 0.8; --lumina-surface-alpha: 0.4; }
      :host([data-context="form"]) .lmca__output { --lumina-intensity: 0.5; }
      :host([data-context="drawer"]) .lmca__output { --lumina-intensity: 1; --lumina-surface-alpha: 0.7; }
      :host([data-context="page"]) .lmca__output { --lumina-intensity: 0.7; }
    `;
  }
  protected mounted(): void { this.detectContext(); }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private detectContext(): void {
    let ctx: Context = 'page';
    let parent = this.parentElement;
    while (parent) {
      const tag = parent.tagName.toLowerCase();
      if (tag === 'form') { ctx = 'form'; break; }
      if (tag.startsWith('lumina-')) {
        if (tag.includes('modal') || tag.includes('dialog')) { ctx = 'modal'; break; }
        if (tag.includes('drawer')) { ctx = 'drawer'; break; }
        if (tag.includes('sidebar')) { ctx = 'sidebar'; break; }
        if (tag.includes('card')) { ctx = 'card'; break; }
      }
      parent = parent.parentElement;
    }
    this.setAttribute('data-context', ctx);
    this.dispatchEvent(new CustomEvent('lumina-context-change', { bubbles: true, composed: true, detail: { context: ctx } }));
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-context-aware': ContextAware } }
if (!customElements.get(ContextAware.tagName)) customElements.define(ContextAware.tagName, ContextAware);
