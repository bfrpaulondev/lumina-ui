/**
 * LuminaList — Stagger animation, conexão entre itens ao hover, drag & drop, loading/empty states.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class LuminaList extends LuminaElement {
  static tagName = 'lumina-list';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'sortable']; }
  private draggedIdx = -1;

  protected render(): string { return `<ul class="lmls" part="list"><slot></slot></ul>`; }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmls { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; position: relative; }
      ::slotted(li), ::slotted([data-list-item]) { position: relative; padding: 12px 16px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid var(--lumina-border); cursor: pointer; transition: all var(--lumina-speed) var(--lumina-ease-out); animation: lmls-enter 0.4s var(--lumina-ease-spring) backwards; }
      @keyframes lmls-enter { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      ::slotted(li:hover), ::slotted([data-list-item]:hover) { background: rgb(var(--lumina-accent-rgb) / 0.1); border-color: rgb(var(--lumina-accent-rgb) / 0.3); transform: translateX(4px); box-shadow: -2px 0 0 var(--lumina-accent); }
      ::slotted(li[data-dragging]), ::slotted([data-list-item][data-dragging]) { opacity: 0.4; }
      ::slotted(li[data-drag-over]), ::slotted([data-list-item][data-drag-over]) { border-color: var(--lumina-accent); box-shadow: 0 0 0 2px rgb(var(--lumina-accent-rgb) / 0.3); }
      :host([variant="neural"]) .lmls { gap: 6px; }
      :host([variant="neural"]) ::slotted(li), :host([variant="neural"]) ::slotted([data-list-item]) { border-color: rgb(var(--lumina-accent-rgb) / 0.15); }
      :host([variant="minimal"]) ::slotted(li), :host([variant="minimal"]) ::slotted([data-list-item]) { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border: 0; border-bottom: 1px solid var(--lumina-border); border-radius: 0; }
      @media (prefers-reduced-motion: reduce) { ::slotted(li), ::slotted([data-list-item]) { animation: none !important; transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this.applyStagger();
    if (this.hasAttribute('sortable')) this.setupDragDrop();
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private applyStagger(): void {
    const items = this.querySelectorAll('li, [data-list-item]');
    items.forEach((item, i) => { (item as HTMLElement).style.animationDelay = `${i * 0.06}s`; });
  }
  private setupDragDrop(): void {
    const items = this.querySelectorAll('li, [data-list-item]');
    items.forEach((item, idx) => {
      (item as HTMLElement).setAttribute('draggable', 'true');
      item.addEventListener('dragstart', () => { this.draggedIdx = idx; item.setAttribute('data-dragging',''); });
      item.addEventListener('dragend', () => { item.removeAttribute('data-dragging'); items.forEach(i => i.removeAttribute('data-drag-over')); });
      item.addEventListener('dragover', (e) => { e.preventDefault(); if (idx !== this.draggedIdx) item.setAttribute('data-drag-over',''); });
      item.addEventListener('dragleave', () => item.removeAttribute('data-drag-over'));
      item.addEventListener('drop', (e) => {
        e.preventDefault(); item.removeAttribute('data-drag-over');
        if (this.draggedIdx >= 0 && this.draggedIdx !== idx) {
          const parent = item.parentElement; if (!parent) return;
          const allItems = Array.from(parent.children);
          const dragged = allItems[this.draggedIdx];
          if (idx < this.draggedIdx) parent.insertBefore(dragged, item); else parent.insertBefore(dragged, item.nextSibling);
          this.applyStagger();
          this.dispatchEvent(new CustomEvent('lumina-reorder', { bubbles: true, composed: true, detail: { from: this.draggedIdx, to: idx } }));
        }
        this.draggedIdx = -1;
      });
    });
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-list': LuminaList } }
if (!customElements.get(LuminaList.tagName)) customElements.define(LuminaList.tagName, LuminaList);
