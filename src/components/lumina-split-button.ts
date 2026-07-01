/**
 * LuminaSplitButton — Botão dividido em ação principal + menu dropdown
 * com itens e ícones. Clique na seta abre o menu.
 *
 * Variants: glass | morph | neural
 *
 * Eventos: lumina-click, lumina-menu-open, lumina-menu-close, lumina-menu-select
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

interface MenuItem { label: string; icon?: string; value?: string; disabled?: boolean; }

export class SplitButton extends LuminaElement {
  static tagName = 'lumina-split-button';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'menu-items', 'disabled'];
  }
  private _menuItems: MenuItem[] = [];
  private _disabled = false;
  private _open = false;
  private menu: HTMLElement | null = null;

  get disabled(): boolean { return this._disabled; }
  set disabled(v: boolean) { this._disabled = v; if (v) this.setAttribute('disabled',''); else this.removeAttribute('disabled'); }
  get menuItems(): MenuItem[] { return this._menuItems; }
  set menuItems(v: MenuItem[]) { this._menuItems = v; this.renderMenu(); }

  protected render(): string {
    return `
      <div class="lmsb" part="button">
        <button class="lmsb__primary" part="trigger" type="button">
          <span class="lmsb__bg" aria-hidden="true"></span>
          <span class="lmsb__label"><slot></slot></span>
        </button>
        <button class="lmsb__chevron" part="trigger" type="button" aria-label="Abrir menu">
          <span class="lmsb__bg" aria-hidden="true"></span>
          <span class="lmsb__chevron-icon">▾</span>
        </button>
        <div class="lmsb__menu" part="menu" role="menu" aria-hidden="true"></div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; position: relative; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      :host([disabled]) { opacity: 0.5; pointer-events: none; }
      .lmsb { position: relative; display: inline-flex; border-radius: var(--lumina-radius-pill); overflow: visible; isolation: isolate; }
      .lmsb__primary, .lmsb__chevron {
        position: relative; border: 0; background: transparent; color: inherit; cursor: pointer;
        font: 600 14px var(--lumina-font-sans); display: inline-flex; align-items: center; gap: 6px;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmsb__primary { padding: 0 22px; height: 44px; border-radius: var(--lumina-radius-pill) 0 0 var(--lumina-radius-pill); }
      .lmsb__chevron { padding: 0 12px; height: 44px; border-radius: 0 var(--lumina-radius-pill) var(--lumina-radius-pill) 0; border-left: 1px solid var(--lumina-border); }
      .lmsb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmsb__primary .lmsb__bg { border-right: 0; }
      .lmsb__label, .lmsb__chevron-icon { position: relative; z-index: 1; }
      .lmsb__primary:hover .lmsb__bg, .lmsb__chevron:hover .lmsb__bg { background: rgb(var(--lumina-accent-rgb) / 0.2); }
      :host(:hover) .lmsb__primary { transform: translateY(-1px); }
      .lmsb__chevron[data-open] .lmsb__chevron-icon { transform: rotate(180deg); }
      .lmsb__chevron-icon { transition: transform var(--lumina-speed) var(--lumina-ease-spring); }
      .lmsb__menu {
        position: absolute; top: calc(100% + 8px); right: 0; min-width: 200px; z-index: 1000;
        padding: 6px; border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15));
        backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6);
        border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5);
        opacity: 0; transform: scale(0.92) translateY(-8px); transform-origin: top right; pointer-events: none;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([data-open]) .lmsb__menu { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
      .lmsb__menu-item {
        display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px;
        cursor: pointer; font-size: 14px; color: var(--lumina-text); transition: background 0.15s;
      }
      .lmsb__menu-item:hover { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lmsb__menu-item[disabled] { opacity: 0.4; pointer-events: none; }
      .lmsb__menu-item-icon { font-size: 16px; }
      @media (prefers-reduced-motion: reduce) { .lmsb__menu, .lmsb__primary, .lmsb__chevron-icon { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._disabled = this.hasAttribute('disabled');
    this.menu = this.$$('.lmsb__menu');
    const itemsAttr = this.getAttribute('menu-items');
    if (itemsAttr) { try { this._menuItems = JSON.parse(itemsAttr); } catch { this._menuItems = []; } }
    this.renderMenu();
    this.$$('.lmsb__primary')?.addEventListener('click', (e) => {
      if (this._disabled) { e.preventDefault(); return; }
      this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
    });
    this.$$('.lmsb__chevron')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this._open) this.closeMenu(); else this.openMenu();
    });
    document.addEventListener('click', this.onDocClick);
  }
  protected unmounted(): void { document.removeEventListener('click', this.onDocClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'menu-items' && value) { try { this._menuItems = JSON.parse(value); this.renderMenu(); } catch {} }
    else if (name === 'disabled') this._disabled = value !== null;
  }
  private renderMenu(): void {
    if (!this.menu) return;
    this.menu.innerHTML = '';
    this._menuItems.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'lmsb__menu-item';
      el.setAttribute('part', 'menu-item');
      el.setAttribute('role', 'menuitem');
      if (item.disabled) el.setAttribute('disabled','');
      if (item.icon) { const ic = document.createElement('span'); ic.className = 'lmsb__menu-item-icon'; ic.textContent = item.icon; el.appendChild(ic); }
      const lb = document.createElement('span'); lb.textContent = item.label; el.appendChild(lb);
      el.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('lumina-menu-select', { bubbles: true, composed: true, detail: { value: item.value ?? item.label, label: item.label } }));
        this.closeMenu();
      });
      this.menu!.appendChild(el);
    });
  }
  private openMenu(): void {
    if (this._open) return;
    this._open = true; this.setAttribute('data-open','');
    this.$$('.lmsb__chevron')?.setAttribute('data-open','');
    this.dispatchEvent(new CustomEvent('lumina-menu-open', { bubbles: true, composed: true }));
  }
  private closeMenu(): void {
    if (!this._open) return;
    this._open = false; this.removeAttribute('data-open');
    this.$$('.lmsb__chevron')?.removeAttribute('data-open');
    this.dispatchEvent(new CustomEvent('lumina-menu-close', { bubbles: true, composed: true }));
  }
  private onDocClick = (e: MouseEvent): void => { if (!this.contains(e.target as Node) && this._open) this.closeMenu(); };
}
declare global { interface HTMLElementTagNameMap { 'lumina-split-button': SplitButton } }
if (!customElements.get(SplitButton.tagName)) customElements.define(SplitButton.tagName, SplitButton);
