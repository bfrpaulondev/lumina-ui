/**
 * LuminaContextMenu — Abre no ponto do clique, submenus, atalhos, dissolução.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

interface MenuItem { label: string; icon?: string; shortcut?: string; value?: string; submenu?: MenuItem[]; separator?: boolean; disabled?: boolean; }

export class ContextMenu extends LuminaElement {
  static tagName = 'lumina-context-menu';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'items']; }
  private _items: MenuItem[] = [];
  private menu: HTMLElement | null = null;
  private _open = false;

  protected render(): string { return `<div class="lmcm" part="menu" role="menu" aria-hidden="true"></div><slot></slot>`; }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmcm { position: fixed; z-index: 10000; min-width: 180px; padding: 6px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.2)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.6); opacity: 0; transform: scale(0.9); pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); transform-origin: top left; }
      .lmcm[data-open] { opacity: 1; transform: scale(1); pointer-events: auto; }
      .lmcm[data-closing] { opacity: 0; transform: scale(0.95); transition: opacity calc(var(--lumina-speed) * 0.6) var(--lumina-ease-out), transform calc(var(--lumina-speed) * 0.6) var(--lumina-ease-out); }
      .lmcm__item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; color: var(--lumina-text); transition: background 0.15s; position: relative; }
      .lmcm__item:hover { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lmcm__item[disabled] { opacity: 0.4; pointer-events: none; }
      .lmcm__item-icon { font-size: 14px; opacity: 0.8; width: 16px; text-align: center; }
      .lmcm__item-label { flex: 1; }
      .lmcm__item-shortcut { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--lumina-text-muted); }
      .lmcm__separator { height: 1px; background: var(--lumina-border); margin: 4px 8px; }
      .lmcm__submenu { position: absolute; left: 100%; top: 0; min-width: 160px; padding: 6px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.2)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.6); opacity: 0; transform: translateX(-4px); pointer-events: none; transition: opacity 0.2s, transform 0.2s; }
      .lmcm__item:hover .lmcm__submenu { opacity: 1; transform: translateX(0); pointer-events: auto; }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmcm, .lmcm__submenu { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this.menu = this.$$('.lmcm');
    const itemsAttr = this.getAttribute('items');
    if (itemsAttr) { try { this._items = JSON.parse(itemsAttr); } catch { this._items = []; } }
    this.renderItems();
    document.addEventListener('click', this.onDocClick);
    document.addEventListener('contextmenu', this.onContextmenu);
    document.addEventListener('keydown', this.onKeydown);
  }
  protected unmounted(): void { document.removeEventListener('click', this.onDocClick); document.removeEventListener('contextmenu', this.onContextmenu); document.removeEventListener('keydown', this.onKeydown); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'items' && value) { try { this._items = JSON.parse(value); this.renderItems(); } catch {} }
  }
  private renderItems(parent?: HTMLElement, items?: MenuItem[]): void {
    const list = items ?? this._items;
    const host = parent ?? this.menu;
    if (!host) return;
    if (!parent) host.innerHTML = '';
    list.forEach((item) => {
      if (item.separator) { const sep = document.createElement('div'); sep.className = 'lmcm__separator'; sep.setAttribute('part','separator'); host.appendChild(sep); return; }
      const el = document.createElement('div');
      el.className = 'lmcm__item'; el.setAttribute('part','item'); el.setAttribute('role','menuitem');
      if (item.disabled) el.setAttribute('disabled','');
      el.innerHTML = `<span class="lmcm__item-icon">${item.icon ?? ''}</span><span class="lmcm__item-label">${item.label}</span>${item.shortcut ? `<span class="lmcm__item-shortcut">${item.shortcut}</span>` : ''}`;
      if (item.submenu && item.submenu.length > 0) {
        const sub = document.createElement('div'); sub.className = 'lmcm__submenu';
        this.renderItems(sub, item.submenu);
        el.appendChild(sub);
        el.innerHTML += '<span style="margin-left:4px;">▸</span>';
      } else {
        el.addEventListener('click', () => { this.dispatchEvent(new CustomEvent('lumina-select', { bubbles: true, composed: true, detail: { value: item.value ?? item.label, label: item.label } })); this.hide(); });
      }
      host.appendChild(el);
    });
  }
  private onContextmenu = (e: MouseEvent): void => {
    if (!this.contains(e.target as Node)) return;
    e.preventDefault();
    this.show(e.clientX, e.clientY);
  };
  private onDocClick = (e: MouseEvent): void => { if (!this.contains(e.target as Node) && this._open) this.hide(); };
  private onKeydown = (e: KeyboardEvent): void => { if (e.key === 'Escape' && this._open) this.hide(); };
  public show(x: number, y: number): void {
    if (!this.menu) return;
    this._open = true; this.menu.setAttribute('data-open','');
    this.menu.style.left = `${x}px`; this.menu.style.top = `${y}px`;
    // Adjust if overflow
    requestAnimationFrame(() => {
      if (!this.menu) return;
      const rect = this.menu.getBoundingClientRect();
      if (rect.right > window.innerWidth) this.menu.style.left = `${x - rect.width}px`;
      if (rect.bottom > window.innerHeight) this.menu.style.top = `${y - rect.height}px`;
    });
    this.dispatchEvent(new CustomEvent('lumina-show', { bubbles: true, composed: true, detail: { x, y } }));
  }
  public hide(): void {
    if (!this._open || !this.menu) return;
    this.menu.setAttribute('data-closing','');
    setTimeout(() => { this.menu?.removeAttribute('data-open'); this.menu?.removeAttribute('data-closing'); this._open = false; this.dispatchEvent(new CustomEvent('lumina-hide', { bubbles: true, composed: true })); }, 200);
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-context-menu': ContextMenu } }
if (!customElements.get(ContextMenu.tagName)) customElements.define(ContextMenu.tagName, ContextMenu);
