/**
 * LuminaTable — Ordenação com morph nas linhas, highlight neural, filtros, linhas expansíveis.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class LuminaTable extends LuminaElement {
  static tagName = 'lumina-table';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'sortable']; }
  private sortCol = -1; private sortDir: 'asc'|'desc' = 'asc';

  protected render(): string {
    return `<div class="lmtb" part="root"><table class="lmtb__table" part="table"><thead class="lmtb__head" part="head"><slot name="head"></slot></thead><tbody class="lmtb__body"><slot></slot></tbody></table></div>`;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmtb { border-radius: var(--lumina-radius-md); overflow: hidden; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); }
      .lmtb__table { width: 100%; border-collapse: collapse; }
      ::slotted(thead) { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      ::slotted(th) { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lumina-text-muted); cursor: pointer; transition: color 0.2s; white-space: nowrap; user-select: none; }
      ::slotted(th:hover) { color: var(--lumina-accent); }
      ::slotted(th[data-sort])::after { content: ' ↕'; opacity: 0.4; }
      ::slotted(th[data-sorted="asc"])::after { content: ' ↑'; opacity: 1; color: var(--lumina-accent); }
      ::slotted(th[data-sorted="desc"])::after { content: ' ↓'; opacity: 1; color: var(--lumina-accent); }
      ::slotted(td) { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid var(--lumina-border); transition: background 0.15s; }
      ::slotted(tr) { transition: all 0.3s var(--lumina-ease-spring); }
      ::slotted(tr:hover td) { background: rgb(var(--lumina-accent-rgb) / 0.08); box-shadow: inset 2px 0 0 var(--lumina-accent); }
      ::slotted(tr:last-child td) { border-bottom: 0; }
      :host([variant="compact"]) ::slotted(td), :host([variant="compact"]) ::slotted(th) { padding: 8px 12px; font-size: 12px; }
      :host([variant="neural"]) .lmtb { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { ::slotted(tr), ::slotted(td) { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this.addEventListener('click', this.onClick);
  }
  protected unmounted(): void { this.removeEventListener('click', this.onClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private onClick = (e: MouseEvent): void => {
    const th = (e.target as HTMLElement).closest('th[data-sort]') as HTMLElement | null;
    if (!th) return;
    const col = parseInt(th.getAttribute('data-sort') ?? '0', 10);
    if (this.sortCol === col) { this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'; }
    else { this.sortCol = col; this.sortDir = 'asc'; }
    // Update header indicators
    this.querySelectorAll('th[data-sort]').forEach((h) => { h.removeAttribute('data-sorted'); });
    th.setAttribute('data-sorted', this.sortDir);
    // Sort rows
    const tbody = this.querySelector('tbody');
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort((a, b) => {
      const aCell = a.children[col] as HTMLElement; const bCell = b.children[col] as HTMLElement;
      const aVal = aCell?.textContent ?? ''; const bVal = bCell?.textContent ?? '';
      const aNum = parseFloat(aVal); const bNum = parseFloat(bVal);
      const cmp = !isNaN(aNum) && !isNaN(bNum) ? aNum - bNum : aVal.localeCompare(bVal);
      return this.sortDir === 'asc' ? cmp : -cmp;
    });
    rows.forEach((r, i) => { r.style.animation = 'none'; tbody.appendChild(r); requestAnimationFrame(() => { r.style.animation = `lmtb-row-morph 0.3s var(--lumina-ease-spring) ${i * 0.02}s`; }); });
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-table': LuminaTable } }
if (!customElements.get(LuminaTable.tagName)) customElements.define(LuminaTable.tagName, LuminaTable);
