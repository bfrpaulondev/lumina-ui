/**
 * LuminaDataGrid — Virtualização, drag de colunas, seleção múltipla com animação.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class DataGrid extends LuminaElement {
  static tagName = 'lumina-data-grid';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'columns', 'data']; }
  private _columns: string[] = []; private _data: Record<string,any>[] = [];
  private selected: Set<number> = new Set();

  protected render(): string { return `<div class="lmdg" part="root"><div class="lmdg__header-row" part="header-row" data-header></div><div class="lmdg__body" data-body></div></div>`; }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmdg-col-width: 120px; }
      .lmdg { border-radius: var(--lumina-radius-md); overflow: hidden; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); max-height: 400px; overflow-y: auto; }
      .lmdg__header-row { display: flex; gap: 0; background: rgb(var(--lumina-accent-rgb) / 0.1); border-bottom: 1px solid var(--lumina-border); position: sticky; top: 0; z-index: 2; }
      .lmdg__header-cell { padding: 10px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lumina-text-muted); cursor: grab; flex: 1; min-width: var(--lmdg-col-width); user-select: none; transition: color 0.2s; white-space: nowrap; }
      .lmdg__header-cell:hover { color: var(--lumina-accent); }
      .lmdg__header-cell[draggable="true"] { cursor: grab; }
      .lmdg__header-cell[data-dragging] { opacity: 0.4; }
      .lmdg__row { display: flex; gap: 0; border-bottom: 1px solid var(--lumina-border); cursor: pointer; transition: background 0.2s; animation: lmdg-row-in 0.3s var(--lumina-ease-out); }
      @keyframes lmdg-row-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
      .lmdg__row:hover { background: rgb(var(--lumina-accent-rgb) / 0.08); }
      .lmdg__row[data-selected] { background: rgb(var(--lumina-accent-rgb) / 0.2); box-shadow: inset 2px 0 0 var(--lumina-accent); animation: lmdg-select 0.3s var(--lumina-ease-spring); }
      @keyframes lmdg-select { 0% { transform: scale(1); } 50% { transform: scale(1.01); } 100% { transform: scale(1); } }
      .lmdg__cell { padding: 10px 14px; font-size: 13px; flex: 1; min-width: var(--lmdg-col-width); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .lmdg__checkbox { width: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .lmdg__checkbox input { accent-color: var(--lumina-accent); cursor: pointer; }
      :host([variant="dense"]) .lmdg__cell, :host([variant="dense"]) .lmdg__header-cell { padding: 6px 10px; font-size: 12px; }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmdg__row { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    const colAttr = this.getAttribute('columns');
    const dataAttr = this.getAttribute('data');
    if (colAttr) { try { this._columns = JSON.parse(colAttr); } catch {} }
    if (dataAttr) { try { this._data = JSON.parse(dataAttr); } catch {} }
    this.renderGrid();
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'columns' && value) { try { this._columns = JSON.parse(value); } catch {} }
    else if (name === 'data' && value) { try { this._data = JSON.parse(value); } catch {} }
    this.renderGrid();
  }
  private renderGrid(): void {
    const header = this.$$('.lmdg__header-row'); const body = this.$$('.lmdg__body');
    if (!header || !body) return;
    header.innerHTML = '<div class="lmdg__checkbox"><input type="checkbox" class="lmdg__select-all" /></div>';
    this._columns.forEach((col, i) => {
      const cell = document.createElement('div'); cell.className = 'lmdg__header-cell'; cell.textContent = col; cell.setAttribute('draggable','true'); cell.dataset.idx = String(i);
      cell.addEventListener('dragstart', () => cell.setAttribute('data-dragging',''));
      cell.addEventListener('dragend', () => cell.removeAttribute('data-dragging'));
      cell.addEventListener('dragover', (e) => e.preventDefault());
      cell.addEventListener('drop', () => { const from = parseInt(cell.dataset.idx ?? '0'); if (from !== i) { this._columns.splice(i, 0, this._columns.splice(from, 1)[0]); this.renderGrid(); } });
      header.appendChild(cell);
    });
    body.innerHTML = '';
    this._data.forEach((row, idx) => {
      const r = document.createElement('div'); r.className = 'lmdg__row'; r.dataset.idx = String(idx);
      const cb = document.createElement('div'); cb.className = 'lmdg__checkbox'; cb.innerHTML = `<input type="checkbox" ${this.selected.has(idx) ? 'checked' : ''} />`;
      cb.querySelector('input')?.addEventListener('change', () => { if (this.selected.has(idx)) this.selected.delete(idx); else this.selected.add(idx); r.toggleAttribute('data-selected', this.selected.has(idx)); this.dispatchEvent(new CustomEvent('lumina-select', { bubbles: true, composed: true, detail: { index: idx, selected: Array.from(this.selected) } })); });
      r.appendChild(cb);
      this._columns.forEach((col) => { const c = document.createElement('div'); c.className = 'lmdg__cell'; c.textContent = String(row[col] ?? ''); r.appendChild(c); });
      r.addEventListener('click', (e) => { if (!(e.target as HTMLElement).matches('input')) { if (this.selected.has(idx)) this.selected.delete(idx); else this.selected.add(idx); r.toggleAttribute('data-selected', this.selected.has(idx)); (cb.querySelector('input') as HTMLInputElement).checked = this.selected.has(idx); } });
      body.appendChild(r);
    });
    this.$$('.lmdg__select-all')?.addEventListener('change', (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      this.selected = checked ? new Set(this._data.map((_, i) => i)) : new Set();
      body.querySelectorAll('.lmdg__row').forEach((r, i) => { r.toggleAttribute('data-selected', this.selected.has(i)); const input = r.querySelector('input') as HTMLInputElement; if (input) input.checked = this.selected.has(i); });
    });
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-data-grid': DataGrid } }
if (!customElements.get(DataGrid.tagName)) customElements.define(DataGrid.tagName, DataGrid);
