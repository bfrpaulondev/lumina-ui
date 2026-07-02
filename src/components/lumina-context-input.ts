/**
 * LuminaContextInput — Detecta contexto da página (form/modal/card) e adapta estilo.
 * Variants: adaptive | neural | glass
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

type ContextType = 'form' | 'modal' | 'card' | 'sidebar' | 'standalone';

export class ContextInput extends LuminaElement {
  static tagName = 'lumina-context-input';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'value']; }
  private _value = '';
  private input: HTMLInputElement | null = null;
  private observer: MutationObserver | null = null;

  get value(): string { return this._value; }
  set value(v: string) { this._value = v; this.setAttribute('value', v); if (this.input) this.input.value = v; }

  protected render(): string {
    return `
      <label class="lmci" part="field">
        <div class="lmci__shell" part="control">
          <div class="lmci__bg" aria-hidden="true"></div>
          <input class="lmci__el" type="text" placeholder="Adaptive input..." />
        </div>
      </label>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmci-pad: 16px; }
      .lmci__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; transition: all var(--lumina-speed) var(--lumina-ease-out); }
      .lmci__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: all var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmci__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmci__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 var(--lmci-pad); border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); transition: padding var(--lumina-speed) var(--lumina-ease-out); }
      .lmci__el::placeholder { color: var(--lumina-text-muted); }
      :host([data-context="form"]) { --lmci-pad: 16px; }
      :host([data-context="modal"]) .lmci__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.3); box-shadow: 0 0 16px rgb(var(--lumina-accent-rgb) / 0.1); }
      :host([data-context="modal"]) { --lmci-pad: 20px; }
      :host([data-context="card"]) .lmci__bg { background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)); }
      :host([data-context="card"]) { --lmci-pad: 12px; }
      :host([data-context="sidebar"]) .lmci__shell { border-radius: var(--lumina-radius-sm); }
      :host([data-context="sidebar"]) { --lmci-pad: 10px; }
      @media (prefers-reduced-motion: reduce) { .lmci__shell, .lmci__bg, .lmci__el { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._value = this.getAttribute('value') ?? '';
    this.input = this.$$('.lmci__el') as HTMLInputElement | null;
    if (this.input) this.input.value = this._value;
    this.input?.addEventListener('input', (e) => {
      this._value = (e.target as HTMLInputElement).value;
      this.dispatchEvent(new CustomEvent('lumina-context-change', { bubbles: true, composed: true, detail: { value: this._value } }));
    });
    this.detectContext();
    this.observer = new MutationObserver(() => this.detectContext());
    this.observer.observe(document.body, { childList: true, subtree: true });
  }
  protected unmounted(): void { this.observer?.disconnect(); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private detectContext(): void {
    let ctx: ContextType = 'standalone';
    let parent = this.parentElement;
    while (parent) {
      const tag = parent.tagName.toLowerCase();
      if (tag === 'form') { ctx = 'form'; break; }
      if (tag.startsWith('lumina-') && (tag.includes('modal') || tag.includes('dialog'))) { ctx = 'modal'; break; }
      if (tag.startsWith('lumina-') && tag.includes('card')) { ctx = 'card'; break; }
      if (tag.startsWith('lumina-') && tag.includes('sidebar')) { ctx = 'sidebar'; break; }
      if (tag.startsWith('lumina-') && tag.includes('drawer')) { ctx = 'modal'; break; }
      parent = parent.parentElement;
    }
    const oldCtx = this.getAttribute('data-context');
    this.setAttribute('data-context', ctx);
    if (oldCtx !== ctx) {
      this.dispatchEvent(new CustomEvent('lumina-context-change', { bubbles: true, composed: true, detail: { context: ctx } }));
    }
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-context-input': ContextInput } }
if (!customElements.get(ContextInput.tagName)) customElements.define(ContextInput.tagName, ContextInput);
