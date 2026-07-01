/**
 * LuminaGrid — Masonry com física + elevação 3D no hover.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class LuminaGrid extends LuminaElement {
  static tagName = 'lumina-grid';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'columns']; }
  private _columns = 3;

  protected render(): string { return `<div class="lmgr" part="grid"><slot></slot></div>`; }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmgr-cols: 3; }
      .lmgr { display: grid; grid-template-columns: repeat(var(--lmgr-cols), 1fr); gap: 16px; }
      :host([variant="masonry"]) .lmgr { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
      :host([variant="masonry"]) ::slotted(*) { flex: 1 1 calc(100% / var(--lmgr-cols) - 12px); min-width: 200px; }
      ::slotted(*) { border-radius: var(--lumina-radius-md); padding: 16px; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); transition: transform var(--lumina-speed) var(--lumina-ease-spring), box-shadow var(--lumina-speed) var(--lumina-ease-out); animation: lmgr-enter 0.4s var(--lumina-ease-spring) backwards; }
      @keyframes lmgr-enter { from { opacity: 0; transform: scale(0.8) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      ::slotted(*:hover) { transform: translateY(-6px) scale(1.03); box-shadow: 0 20px 40px -12px rgb(var(--lumina-accent-rgb) / 0.3), inset 0 1px 0 rgb(255 255 255 / 0.1); z-index: 1; }
      :host([variant="neural"]) ::slotted(*) { border-color: rgb(var(--lumina-accent-rgb) / 0.15); }
      :host([variant="neural"]) ::slotted(*:hover) { border-color: rgb(var(--lumina-accent-rgb) / 0.4); box-shadow: 0 20px 40px -12px rgb(var(--lumina-accent-rgb) / 0.4), 0 0 0 1px rgb(var(--lumina-accent-rgb) / 0.2); }
      @media (max-width: 768px) { :host { --lmgr-cols: 2; } }
      @media (max-width: 480px) { :host { --lmgr-cols: 1; } }
      @media (prefers-reduced-motion: reduce) { ::slotted(*) { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._columns = parseInt(this.getAttribute('columns') ?? '3', 10) || 3;
    this.style.setProperty('--lmgr-cols', String(this._columns));
    this.applyStagger();
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'columns') { this._columns = parseInt(value ?? '3', 10) || 3; this.style.setProperty('--lmgr-cols', String(this._columns)); }
  }
  private applyStagger(): void { this.querySelectorAll('*').forEach((item, i) => { (item as HTMLElement).style.animationDelay = `${i * 0.05}s`; }); }
}
declare global { interface HTMLElementTagNameMap { 'lumina-grid': LuminaGrid } }
if (!customElements.get(LuminaGrid.tagName)) customElements.define(LuminaGrid.tagName, LuminaGrid);
