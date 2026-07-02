/**
 * LuminaTreeView — Expansão com animação de altura, conexão neural entre nós, seleção múltipla.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class TreeView extends LuminaElement {
  static tagName = 'lumina-tree-view';

  protected render(): string { return `<ul class="lmtv" part="tree" role="tree"><slot></slot></ul>`; }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmtv { list-style: none; padding: 0; margin: 0; }
      ::slotted(ul), ::slotted(.lmtv__children) { list-style: none; padding-left: 20px; margin: 0; overflow: hidden; max-height: 0; opacity: 0; transition: max-height calc(var(--lumina-speed) * 1.5) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      ::slotted(ul[data-expanded]), ::slotted(.lmtv__children[data-expanded]) { max-height: 2000px; opacity: 1; }
      ::slotted(li), ::slotted([data-tree-node]) { position: relative; padding: 6px 12px 6px 28px; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background 0.2s; animation: lmtv-enter 0.3s var(--lumina-ease-out); }
      @keyframes lmtv-enter { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
      ::slotted(li:hover), ::slotted([data-tree-node]:hover) { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      ::slotted(li[data-selected]), ::slotted([data-tree-node][data-selected]) { background: rgb(var(--lumina-accent-rgb) / 0.25); box-shadow: inset 2px 0 0 var(--lumina-accent); }
      ::slotted(li::before), ::slotted([data-tree-node])::before { content: ''; position: absolute; left: 12px; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: rgb(var(--lumina-accent-rgb) / 0.3); transform: translateY(-50%); transition: background 0.2s, box-shadow 0.2s; }
      ::slotted(li:hover::before), ::slotted([data-tree-node]:hover)::before { background: var(--lumina-accent); box-shadow: 0 0 6px var(--lumina-accent); }
      ::slotted([data-expandable]) { position: relative; }
      ::slotted([data-expandable])::after { content: '▸'; position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--lumina-text-muted); transition: transform 0.2s; }
      ::slotted([data-expanded][data-expandable])::after { transform: translateY(-50%) rotate(90deg); }
      :host([variant="minimal"]) ::slotted(li), :host([variant="minimal"]) ::slotted([data-tree-node]) { padding-left: 16px; }
      :host([variant="minimal"]) ::slotted(li::before), :host([variant="minimal"]) ::slotted([data-tree-node])::before { display: none; }
      @media (prefers-reduced-motion: reduce) { ::slotted(ul), ::slotted(.lmtv__children), ::slotted(li), ::slotted([data-tree-node]) { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this.addEventListener('click', this.onClick);
  }
  protected unmounted(): void { this.removeEventListener('click', this.onClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private onClick = (e: MouseEvent): void => {
    const node = (e.target as HTMLElement).closest('li, [data-tree-node]') as HTMLElement | null;
    if (!node) return;
    // Check if has children
    const children = node.querySelector('ul, .lmtv__children');
    if (children) {
      const isExpanded = children.hasAttribute('data-expanded');
      if (isExpanded) { children.removeAttribute('data-expanded'); node.removeAttribute('data-expanded'); }
      else { children.setAttribute('data-expanded',''); node.setAttribute('data-expanded',''); node.setAttribute('data-expandable',''); }
      this.dispatchEvent(new CustomEvent('lumina-expand', { bubbles: true, composed: true, detail: { node: node.textContent?.trim(), expanded: !isExpanded } }));
    }
    // Selection
    this.querySelectorAll('[data-selected]').forEach((s) => s.removeAttribute('data-selected'));
    node.setAttribute('data-selected','');
    this.dispatchEvent(new CustomEvent('lumina-select', { bubbles: true, composed: true, detail: { value: node.textContent?.trim() } }));
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-tree-view': TreeView } }
if (!customElements.get(TreeView.tagName)) customElements.define(TreeView.tagName, TreeView);
