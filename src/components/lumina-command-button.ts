/**
 * LuminaCommandButton — Botão estilo atalho (Cmd+K) com brilho rápido ao
 * hover e suporte a shortcut de teclado.
 *
 * Variants: glass | neural | minimal
 * Eventos: lumina-click, lumina-shortcut
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class CommandButton extends LuminaElement {
  static tagName = 'lumina-command-button';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'shortcut']; }
  private _shortcut = '';

  get shortcut(): string { return this._shortcut; }
  set shortcut(v: string) { this._shortcut = v; this.setAttribute('shortcut', v); this.renderShortcut(); }

  protected render(): string {
    return `
      <button class="lmcb" part="button" type="button">
        <span class="lmcb__bg" aria-hidden="true"></span>
        <span class="lmcb__sheen" aria-hidden="true"></span>
        <span class="lmcb__label"><slot></slot></span>
        <span class="lmcb__shortcut" part="shortcut"></span>
      </button>
    `;
  }
  protected styles(): string {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmcb {
        position: relative; display: inline-flex; align-items: center; gap: 12px;
        height: 40px; padding: 0 14px; border: 0; background: transparent; color: inherit;
        font: 500 13px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-md);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmcb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out), border-color var(--lumina-speed) var(--lumina-ease-out); }
      .lmcb__sheen { position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(100deg, transparent 0%, rgb(var(--lumina-accent-rgb) / 0.4) 50%, transparent 100%); transform: skewX(-18deg); pointer-events: none; z-index: 1; opacity: 0; }
      .lmcb__label { position: relative; z-index: 2; white-space: nowrap; }
      .lmcb__shortcut { position: relative; z-index: 2; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: rgb(var(--lumina-accent-rgb) / 0.15); color: var(--lumina-accent); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.3); }
      .lmcb__shortcut:empty { display: none; }
      :host(:hover) .lmcb { transform: translateY(-1px); }
      :host(:hover) .lmcb__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); background: rgb(var(--lumina-accent-rgb) / 0.1); }
      :host(:hover) .lmcb__sheen { opacity: 1; left: 120%; transition: left calc(var(--lumina-speed) * 1.5) var(--lumina-ease-in-out), opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:active) .lmcb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="minimal"]) .lmcb__bg { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border-color: transparent; }
      :host([variant="minimal"]:hover) .lmcb__bg { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      @media (prefers-reduced-motion: reduce) { .lmcb, .lmcb__sheen { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._shortcut = this.getAttribute('shortcut') ?? '';
    this.renderShortcut();
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.$$('.lmcb')?.addEventListener('click', this.onClick);
    this.$$('.lmcb')?.addEventListener('keydown', this.onKeydown);
    if (this._shortcut) this.registerShortcut();
  }
  protected unmounted(): void { document.removeEventListener('keydown', this.globalKeydown); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'shortcut') { this._shortcut = value ?? ''; this.renderShortcut(); }
  }
  private renderShortcut(): void {
    const el = this.$$('.lmcb__shortcut');
    if (el) el.textContent = this._shortcut;
  }
  private onClick = (): void => { this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true })); };
  private onKeydown = (e: KeyboardEvent): void => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onClick(); } };
  private registerShortcut(): void {
    document.addEventListener('keydown', this.globalKeydown);
  }
  private globalKeydown = (e: KeyboardEvent): void => {
    if (!this._shortcut) return;
    // Parse simple shortcuts like "Cmd+K", "Ctrl+S", "Shift+P"
    const parts = this._shortcut.toLowerCase().split('+').map((s) => s.trim());
    const key = parts[parts.length - 1];
    const wantsCmd = parts.includes('cmd') || parts.includes('meta') || parts.includes('⌘');
    const wantsCtrl = parts.includes('ctrl') || parts.includes('control');
    const wantsShift = parts.includes('shift');
    const wantsAlt = parts.includes('alt') || parts.includes('option');
    if (e.key.toLowerCase() === key && (!wantsCmd === !e.metaKey) && (!wantsCtrl === !e.ctrlKey) && (!wantsShift === !e.shiftKey) && (!wantsAlt === !e.altKey)) {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('lumina-shortcut', { bubbles: true, composed: true, detail: { shortcut: this._shortcut } }));
      this.dispatchEvent(new CustomEvent('lumina-click', { bubbles: true, composed: true }));
    }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-command-button': CommandButton } }
if (!customElements.get(CommandButton.tagName)) customElements.define(CommandButton.tagName, CommandButton);
