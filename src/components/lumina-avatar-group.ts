/**
 * LuminaAvatarGroup — Stacking com overlap, separação ao hover, tooltip com nomes, +X animado.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class AvatarGroup extends LuminaElement {
  static tagName = 'lumina-avatar-group';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'max']; }
  private _max = 5;

  protected render(): string { return `<span class="lmag" part="group"><slot></slot><span class="lmag__overflow" part="overflow"></span></span>`; }
  protected styles(): string {
    return `
      :host { display: inline-flex; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmag { display: inline-flex; align-items: center; }
      ::slotted(lumina-avatar), ::slotted(*) { margin-left: -10px; border: 2px solid var(--lumina-bg, #06060c); border-radius: 50%; transition: transform var(--lumina-speed) var(--lumina-ease-spring), margin var(--lumina-speed) var(--lumina-ease-spring); }
      ::slotted(lumina-avatar:first-child), ::slotted(*:first-child) { margin-left: 0; }
      .lmag:hover ::slotted(lumina-avatar), .lmag:hover ::slotted(*) { margin-left: 4px; transform: translateY(-2px); }
      .lmag:hover ::slotted(*:first-child) { margin-left: 0; }
      .lmag__overflow { margin-left: -6px; padding: 0 10px; height: 32px; min-width: 32px; border-radius: 999px; background: rgb(var(--lumina-surface) / 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 2px solid var(--lumina-bg, #06060c); display: inline-flex; align-items: center; justify-content: center; font: 600 11px 'JetBrains Mono', monospace; color: var(--lumina-text-muted); cursor: pointer; transition: all var(--lumina-speed) var(--lumina-ease-spring); }
      .lmag__overflow:hover { background: rgb(var(--lumina-accent-rgb) / 0.2); color: var(--lumina-accent); transform: translateY(-2px) scale(1.05); }
      .lmag__overflow:empty { display: none; }
      :host([variant="compact"]) ::slotted(lumina-avatar), :host([variant="compact"]) ::slotted(*) { margin-left: -14px; }
      @media (prefers-reduced-motion: reduce) { ::slotted(*), .lmag__overflow { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._max = parseInt(this.getAttribute('max') ?? '5', 10) || 5;
    this.updateOverflow();
    this.addEventListener('slotchange', () => this.updateOverflow());
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'max') { this._max = parseInt(value ?? '5', 10) || 5; this.updateOverflow(); }
  }
  private updateOverflow(): void {
    const items = Array.from(this.querySelectorAll('lumina-avatar, [data-avatar]'));
    const overflow = this.$$('.lmag__overflow');
    if (!overflow) return;
    const excess = items.length - this._max;
    if (excess > 0) {
      overflow.textContent = `+${excess}`;
      overflow.title = `${excess} more`;
      // Hide excess avatars
      items.forEach((item, i) => { (item as HTMLElement).style.display = i < this._max ? '' : 'none'; });
    } else {
      overflow.textContent = '';
      items.forEach((item) => { (item as HTMLElement).style.display = ''; });
    }
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-avatar-group': AvatarGroup } }
if (!customElements.get(AvatarGroup.tagName)) customElements.define(AvatarGroup.tagName, AvatarGroup);
