/**
 * LuminaMultiSelect — Chips removíveis com drag & drop, limite máximo e busca.
 * Variants: glass | neural | compact
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

interface Option { value: string; label: string; }

export class MultiSelect extends LuminaElement {
  static tagName = 'lumina-multi-select';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'options', 'value', 'max']; }
  private _options: Option[] = [];
  private _selected: string[] = [];
  private _max = 0;
  private chipsEl: HTMLElement | null = null;
  private menuEl: HTMLElement | null = null;
  private searchEl: HTMLInputElement | null = null;
  private _open = false;
  private draggedChip: string | null = null;

  get value(): string { return this._selected.join(','); }
  set value(v: string) { this._selected = v ? v.split(',') : []; this.setAttribute('value', v); this.renderChips(); }
  get options(): Option[] { return this._options; }
  set options(v: Option[]) { this._options = v; this.setAttribute('options', JSON.stringify(v)); this.renderMenu(); }
  get max(): number { return this._max; }
  set max(v: number) { this._max = v; this.setAttribute('max', String(v)); }

  protected render(): string {
    return `
      <div class="lmms" part="trigger">
        <div class="lmms__bg" aria-hidden="true"></div>
        <div class="lmms__chips" part="chips" data-chips></div>
        <button class="lmms__add" type="button" aria-label="Adicionar">+</button>
        <div class="lmms__menu" part="menu" aria-hidden="true">
          <input class="lmms__search" type="text" placeholder="Buscar..." />
          <div class="lmms__options" data-options></div>
        </div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmms { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 44px; padding: 8px 12px; border-radius: var(--lumina-radius-md); cursor: pointer; }
      .lmms__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmms__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmms__chips { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 6px; flex: 1; }
      .lmms__chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; padding-right: 4px; border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-accent-rgb) / 0.2); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.4); font-size: 12px; font-weight: 600; color: var(--lumina-text); cursor: grab; animation: lmms-chip-in var(--lumina-speed) var(--lumina-ease-spring); }
      .lmms__chip[draggable="true"] { cursor: grab; }
      .lmms__chip[data-dragging] { opacity: 0.4; }
      .lmms__chip[data-drag-over] { border-color: var(--lumina-accent); box-shadow: 0 0 8px rgb(var(--lumina-accent-rgb) / 0.5); }
      @keyframes lmms-chip-in { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .lmms__chip-remove { appearance: none; border: 0; background: rgb(var(--lumina-accent-rgb) / 0.3); color: var(--lumina-text); width: 16px; height: 16px; border-radius: 50%; cursor: pointer; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }
      .lmms__chip-remove:hover { background: rgb(239 68 68 / 0.5); }
      .lmms__add { position: relative; z-index: 1; appearance: none; border: 1px dashed var(--lumina-border); background: transparent; color: var(--lumina-text-muted); width: 28px; height: 28px; border-radius: var(--lumina-radius-md); cursor: pointer; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; }
      .lmms__add:hover { border-color: var(--lumina-accent); color: var(--lumina-accent); }
      .lmms__menu { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 1000; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); overflow: hidden; max-height: 0; opacity: 0; transition: max-height var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmms__menu { max-height: 280px; opacity: 1; }
      .lmms__search { width: 100%; padding: 10px 14px; border: 0; border-bottom: 1px solid var(--lumina-border); background: transparent; color: var(--lumina-text); font: 500 13px var(--lumina-font-sans); outline: none; }
      .lmms__options { max-height: 200px; overflow-y: auto; padding: 4px; }
      .lmms__option { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background 0.15s; }
      .lmms__option:hover { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lmms__option[data-selected] { background: rgb(var(--lumina-accent-rgb) / 0.3); }
      .lmms__option[disabled] { opacity: 0.4; pointer-events: none; }
      .lmms__option-check { color: var(--lumina-accent); font-weight: 700; }
      :host([variant="compact"]) .lmms { min-height: 36px; padding: 6px 10px; }
      @media (prefers-reduced-motion: reduce) { .lmms__menu, .lmms__chip { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._max = parseInt(this.getAttribute('max') ?? '0', 10) || 0;
    const optAttr = this.getAttribute('options');
    if (optAttr) { try { this._options = JSON.parse(optAttr); } catch { this._options = []; } }
    const valAttr = this.getAttribute('value');
    this._selected = valAttr ? valAttr.split(',') : [];
    this.chipsEl = this.$$('.lmms__chips');
    this.menuEl = this.$$('.lmms__menu');
    this.searchEl = this.$$('.lmms__search') as HTMLInputElement | null;
    this.renderChips();
    this.renderMenu();
    this.$$('.lmms__add')?.addEventListener('click', this.toggleMenu);
    this.searchEl?.addEventListener('input', () => this.renderMenu());
    document.addEventListener('click', this.onDocClick);
  }
  protected unmounted(): void { document.removeEventListener('click', this.onDocClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'options' && value) { try { this._options = JSON.parse(value); this.renderMenu(); } catch {} }
    else if (name === 'value') { this._selected = value ? value.split(',') : []; this.renderChips(); }
    else if (name === 'max') this._max = parseInt(value ?? '0', 10) || 0;
  }
  private toggleMenu = (e?: Event): void => {
    e?.stopPropagation();
    this._open = !this._open;
    if (this._open) { this.setAttribute('data-open', ''); setTimeout(() => this.searchEl?.focus(), 50); }
    else this.removeAttribute('data-open');
  };
  private onDocClick = (e: MouseEvent): void => { if (!this.contains(e.target as Node) && this._open) this.toggleMenu(); };
  private renderChips(): void {
    if (!this.chipsEl) return;
    this.chipsEl.innerHTML = '';
    this._selected.forEach((val) => {
      const opt = this._options.find((o) => o.value === val);
      if (!opt) return;
      const chip = document.createElement('span');
      chip.className = 'lmms__chip';
      chip.setAttribute('draggable', 'true');
      chip.setAttribute('data-value', val);
      chip.innerHTML = `<span>${opt.label}</span>`;
      const remove = document.createElement('button');
      remove.className = 'lmms__chip-remove';
      remove.textContent = '×';
      remove.addEventListener('click', (e) => { e.stopPropagation(); this.removeChip(val); });
      chip.appendChild(remove);
      chip.addEventListener('dragstart', (e) => { this.draggedChip = val; chip.setAttribute('data-dragging', ''); e.dataTransfer?.setData('text/plain', val); });
      chip.addEventListener('dragend', () => { this.draggedChip = null; chip.removeAttribute('data-dragging'); });
      chip.addEventListener('dragover', (e) => { e.preventDefault(); chip.setAttribute('data-drag-over', ''); });
      chip.addEventListener('dragleave', () => chip.removeAttribute('data-drag-over'));
      chip.addEventListener('drop', (e) => {
        e.preventDefault();
        chip.removeAttribute('data-drag-over');
        if (this.draggedChip && this.draggedChip !== val) {
          const fromIdx = this._selected.indexOf(this.draggedChip);
          const toIdx = this._selected.indexOf(val);
          this._selected.splice(fromIdx, 1);
          this._selected.splice(toIdx, 0, this.draggedChip);
          this.setAttribute('value', this._selected.join(','));
          this.renderChips();
          this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { value: this.value } }));
        }
      });
      this.chipsEl!.appendChild(chip);
    });
  }
  private renderMenu(): void {
    const optsEl = this.$$('.lmms__options');
    if (!optsEl) return;
    const q = (this.searchEl?.value ?? '').toLowerCase().trim();
    const filtered = this._options.filter((o) => !q || o.label.toLowerCase().includes(q));
    optsEl.innerHTML = '';
    filtered.forEach((opt) => {
      const el = document.createElement('div');
      el.className = 'lmms__option';
      el.setAttribute('data-value', opt.value);
      const isSel = this._selected.includes(opt.value);
      if (isSel) el.setAttribute('data-selected', '');
      if (this._max > 0 && this._selected.length >= this._max && !isSel) el.setAttribute('disabled', '');
      el.innerHTML = `<span>${opt.label}</span>${isSel ? '<span class="lmms__option-check">✓</span>' : ''}`;
      el.addEventListener('click', () => this.toggleOption(opt.value));
      optsEl.appendChild(el);
    });
  }
  private toggleOption(val: string): void {
    const idx = this._selected.indexOf(val);
    if (idx >= 0) { this._selected.splice(idx, 1); }
    else {
      if (this._max > 0 && this._selected.length >= this._max) return;
      this._selected.push(val);
    }
    this.setAttribute('value', this._selected.join(','));
    this.renderChips();
    this.renderMenu();
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { value: this.value } }));
  }
  private removeChip(val: string): void {
    this._selected = this._selected.filter((v) => v !== val);
    this.setAttribute('value', this._selected.join(','));
    this.renderChips();
    this.renderMenu();
    this.dispatchEvent(new CustomEvent('lumina-chip-remove', { bubbles: true, composed: true, detail: { value: val } }));
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { value: this.value } }));
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-multi-select': MultiSelect } }
if (!customElements.get(MultiSelect.tagName)) customElements.define(MultiSelect.tagName, MultiSelect);
