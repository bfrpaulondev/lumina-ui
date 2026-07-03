/**
 * LuminaDataGrid — Declarative data grid (M1 foundation).
 *
 * Reads columns from <lumina-datagrid-column> children and data from the
 * `data` attribute (or `data-src` URL — M2). Renders a glassmorphic
 * table with sticky header, ARIA grid role, and full LuminaUI variant
 * support (glass/morph/neural/void/aura/dimensional).
 *
 * M1 scope:
 *   ✓ Static render (no sort/filter/pagination — those land in M2)
 *   ✓ All 6 variants + intensity + accent-color + depth
 *   ✓ Density: comfortable (44px) | compact (36px) | dense (28px)
 *   ✓ Sticky header
 *   ✓ Row hover + zebra striping (toggle via `zebra`)
 *   ✓ Empty state
 *   ✓ ARIA grid role + cell roles + rowcount/colcount
 *   ✓ Responsive: horizontal scroll when columns overflow
 *   ✓ Cell types: text, number, currency, date, boolean, chip, badge
 *
 * Usage:
 *
 *   <lumina-datagrid
 *     variant="neural"
 *     intensity="intense"
 *     accent-color="#78f0ff"
 *     density="comfortable"
 *     zebra
 *     data='[
 *       {"id":1,"name":"Marina","revenue":12450.5,"active":true,"role":"admin","joined":"2024-01-15"},
 *       {"id":2,"name":"Rafael","revenue":0,"active":false,"role":"user","joined":"2024-03-22"}
 *     ]'
 *   >
 *     <lumina-datagrid-column field="id"      label="#"        type="number" width="60"></lumina-datagrid-column>
 *     <lumina-datagrid-column field="name"    label="Nome"     width="200"></lumina-datagrid-column>
 *     <lumina-datagrid-column field="revenue" label="Receita"  type="currency"></lumina-datagrid-column>
 *     <lumina-datagrid-column field="active"  label="Ativo"    type="boolean" width="100"></lumina-datagrid-column>
 *     <lumina-datagrid-column field="role"    label="Cargo"    type="badge"
 *                         options='[{"value":"admin","label":"Admin","color":"#7c5cff"},{"value":"user","label":"User","color":"#78f0ff"}]'></lumina-datagrid-column>
 *     <lumina-datagrid-column field="joined"  label="Entrou em" type="date"></lumina-datagrid-column>
 *   </lumina-datagrid>
 *
 * Events:
 *   lumina-row-click   — { row, index }
 *   lumina-row-enter   — { row, index } (mouse enter)
 *   lumina-row-leave   — { row, index } (mouse leave)
 *   lumina-cell-click  — { row, index, field, value }
 */

import { LuminaElement } from '../../core/LuminaElement';
import type { LuminaElementAttributes } from '../../core/LuminaElement';
import {
  LuminaDataGridColumn,
  type GridColumnSpec,
} from './lumina-datagrid-column';
import { formatCell } from '../../core/data-systems/formatters';

export type GridDensity = 'comfortable' | 'compact' | 'dense';

const DENSITY_VALUES: GridDensity[] = ['comfortable', 'compact', 'dense'];

function coerceDensity(v: string | null): GridDensity {
  if (v && (DENSITY_VALUES as readonly string[]).includes(v)) {
    return v as GridDensity;
  }
  return 'comfortable';
}

const DENSITY_ROW_HEIGHT: Record<GridDensity, number> = {
  comfortable: 48,
  compact: 38,
  dense: 28,
};

const DENSITY_PADDING: Record<GridDensity, string> = {
  comfortable: '14px 18px',
  compact: '10px 14px',
  dense: '6px 10px',
};

const DENSITY_FONT: Record<GridDensity, string> = {
  comfortable: '14px',
  compact: '13px',
  dense: '12px',
};

export class LuminaDataGrid extends LuminaElement {
  static tagName = 'lumina-datagrid';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'data',
      'density',
      'zebra',
      'sticky-header',
      'empty-state',
    ];
  }

  private _columns: GridColumnSpec[] = [];
  private _data: Array<Record<string, unknown>> = [];
  private _density: GridDensity = 'comfortable';
  private _dataParseError: string | null = null;
  private _gridObserver: MutationObserver | null = null;

  /* ---------------------------------------------------------------- */
  /* Render — initial shadow markup. Body is filled by renderRows().  */
  /* ---------------------------------------------------------------- */

  protected render(): string {
    return `
      <div class="lmgrid" part="root" role="grid"
           aria-rowcount="0" aria-colcount="0">
        <div class="lmgrid__scroll" part="scroll">
          <table class="lmgrid__table" part="table">
            <thead class="lmgrid__head" part="head">
              <tr class="lmgrid__head-row" part="head-row"></tr>
            </thead>
            <tbody class="lmgrid__body" part="body"></tbody>
          </table>
        </div>
        <div class="lmgrid__empty" part="empty" hidden>
          <slot name="empty">
            <div class="lmgrid__empty-icon" aria-hidden="true">◇</div>
            <div class="lmgrid__empty-text" data-empty-text></div>
          </slot>
        </div>
        <div class="lmgrid__error" part="error" hidden data-error></div>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        --lmgrid-row-h: ${DENSITY_ROW_HEIGHT.comfortable}px;
        --lmgrid-cell-pad: ${DENSITY_PADDING.comfortable};
        --lmgrid-font-size: ${DENSITY_FONT.comfortable};
        --lmgrid-stripe: rgb(var(--lumina-accent-rgb) / 0.03);
        --lmgrid-hover: rgb(var(--lumina-accent-rgb) / 0.08);
        --lmgrid-selected: rgb(var(--lumina-accent-rgb) / 0.18);
        --lmgrid-header-bg: rgb(var(--lumina-accent-rgb) / 0.10);
        --lmgrid-border: var(--lumina-border);
        --lmgrid-radius: var(--lumina-radius-lg);
      }

      /* Density overrides set via :host[data-density="..."] */
      :host([data-density="comfortable"]) {
        --lmgrid-row-h: ${DENSITY_ROW_HEIGHT.comfortable}px;
        --lmgrid-cell-pad: ${DENSITY_PADDING.comfortable};
        --lmgrid-font-size: ${DENSITY_FONT.comfortable};
      }
      :host([data-density="compact"]) {
        --lmgrid-row-h: ${DENSITY_ROW_HEIGHT.compact}px;
        --lmgrid-cell-pad: ${DENSITY_PADDING.compact};
        --lmgrid-font-size: ${DENSITY_FONT.compact};
      }
      :host([data-density="dense"]) {
        --lmgrid-row-h: ${DENSITY_ROW_HEIGHT.dense}px;
        --lmgrid-cell-pad: ${DENSITY_PADDING.dense};
        --lmgrid-font-size: ${DENSITY_FONT.dense};
      }

      .lmgrid {
        position: relative;
        border-radius: var(--lmgrid-radius);
        overflow: hidden;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        border: 1px solid var(--lmgrid-border);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        backdrop-filter: blur(14px) saturate(1.4);
        box-shadow: var(--lumina-shadow);
      }

      .lmgrid__scroll {
        max-height: var(--lmgrid-max-height, 60vh);
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: rgb(var(--lumina-accent-rgb) / 0.4) transparent;
      }
      .lmgrid__scroll::-webkit-scrollbar { width: 8px; height: 8px; }
      .lmgrid__scroll::-webkit-scrollbar-track { background: transparent; }
      .lmgrid__scroll::-webkit-scrollbar-thumb {
        background: rgb(var(--lumina-accent-rgb) / 0.35);
        border-radius: 4px;
      }
      .lmgrid__scroll::-webkit-scrollbar-thumb:hover {
        background: rgb(var(--lumina-accent-rgb) / 0.55);
      }

      .lmgrid__table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: var(--lmgrid-font-size);
        table-layout: auto;
      }

      /* ----- Header ----- */
      .lmgrid__head {
        position: sticky;
        top: 0;
        z-index: 3;
      }
      .lmgrid__head-row {
        background: var(--lmgrid-header-bg);
        border-bottom: 1px solid var(--lmgrid-border);
        -webkit-backdrop-filter: blur(20px) saturate(1.6);
        backdrop-filter: blur(20px) saturate(1.6);
      }
      .lmgrid__head-cell {
        padding: var(--lmgrid-cell-pad);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--lumina-text-muted);
        text-align: left;
        white-space: nowrap;
        user-select: none;
        position: relative;
        transition: color calc(var(--lumina-speed) * 0.6) var(--lumina-ease-out);
      }
      .lmgrid__head-cell[data-align="right"] { text-align: right; }
      .lmgrid__head-cell[data-align="center"] { text-align: center; }
      .lmgrid__head-cell[data-sortable] { cursor: pointer; }
      .lmgrid__head-cell[data-sortable]:hover { color: var(--lumina-accent); }
      .lmgrid__head-cell[data-sortable]::after {
        content: '↕';
        opacity: 0.25;
        margin-left: 6px;
        font-size: 10px;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmgrid__head-cell[data-sortable]:hover::after { opacity: 0.6; }

      /* ----- Body ----- */
      .lmgrid__body-row {
        border-bottom: 1px solid rgb(var(--lumina-border) / 0.5);
        transition: background calc(var(--lumina-speed) * 0.5) var(--lumina-ease-out);
        animation: lmgrid-row-in calc(var(--lumina-speed) * 0.6) var(--lumina-ease-out);
      }
      @keyframes lmgrid-row-in {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .lmgrid__body-row:hover { background: var(--lmgrid-hover); }
      :host([zebra]) .lmgrid__body-row:nth-child(even) { background: var(--lmgrid-stripe); }
      :host([zebra]) .lmgrid__body-row:nth-child(even):hover { background: var(--lmgrid-hover); }

      .lmgrid__cell {
        padding: var(--lmgrid-cell-pad);
        font-size: var(--lmgrid-font-size);
        color: var(--lumina-text);
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        max-width: 0; /* lets ellipsis kick in when table-layout is auto */
      }
      .lmgrid__cell[data-align="right"] { text-align: right; }
      .lmgrid__cell[data-align="center"] { text-align: center; }

      /* ----- Boolean pill ----- */
      .lmgrid__bool {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.04em;
        line-height: 1.4;
      }
      .lmgrid__bool--on {
        background: rgb(34 197 94 / 0.18);
        color: rgb(110 231 183);
        border: 1px solid rgb(34 197 94 / 0.35);
      }
      .lmgrid__bool--off {
        background: rgb(255 70 90 / 0.12);
        color: rgb(252 165 165);
        border: 1px solid rgb(255 70 90 / 0.30);
      }

      /* ----- Chip ----- */
      .lmgrid__chip {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 6px;
        font-size: 12px;
        background: rgb(var(--lumina-accent-rgb) / 0.14);
        color: var(--lumina-accent);
        border: 1px solid rgb(var(--lumina-accent-rgb) / 0.30);
      }
      .lmgrid__chip[style*="--chip-color"] {
        background: color-mix(in srgb, var(--chip-color) 16%, transparent);
        color: var(--chip-color);
        border-color: color-mix(in srgb, var(--chip-color) 40%, transparent);
      }

      /* ----- Badge (with optional color override) ----- */
      .lmgrid__badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.04em;
        background: rgb(var(--lumina-accent-rgb) / 0.14);
        color: var(--lumina-accent);
        border: 1px solid rgb(var(--lumina-accent-rgb) / 0.32);
      }
      .lmgrid__badge::before {
        content: '';
        width: 6px; height: 6px;
        border-radius: 50%;
        background: currentColor;
        box-shadow: 0 0 6px currentColor;
      }
      .lmgrid__badge[data-color] {
        background: color-mix(in srgb, attr(data-color color, #7c5cff) 16%, transparent);
        color: attr(data-color color, #7c5cff);
        border-color: color-mix(in srgb, attr(data-color color, #7c5cff) 40%, transparent);
      }
      /* Fallback for browsers without attr() color — set via inline style by JS */

      /* ----- Empty state ----- */
      .lmgrid__empty {
        padding: 48px 24px;
        text-align: center;
        color: var(--lumina-text-muted);
      }
      .lmgrid__empty-icon {
        font-size: 36px;
        opacity: 0.4;
        margin-bottom: 12px;
        background: linear-gradient(135deg, var(--lumina-accent), rgb(var(--lumina-accent-rgb) / 0.4));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .lmgrid__empty-text { font-size: 14px; }

      .lmgrid__error {
        padding: 16px 20px;
        background: rgb(255 70 90 / 0.08);
        color: rgb(252 165 165);
        border-top: 1px solid rgb(255 70 90 / 0.30);
        font-family: var(--lumina-font-mono);
        font-size: 12px;
        white-space: pre-wrap;
      }

      /* ----- Variant: glass (default) — already styled above ----- */

      /* ----- Variant: morph — pill-shaped cells, organic curves ----- */
      :host([variant="morph"]) .lmgrid { border-radius: var(--lumina-radius-pill); overflow: hidden; }
      :host([variant="morph"]) .lmgrid__head-cell,
      :host([variant="morph"]) .lmgrid__cell { border-radius: 14px; }
      :host([variant="morph"]) .lmgrid__head-row { border-bottom: 0; }
      :host([variant="morph"]) .lmgrid__head-row::after {
        content: '';
        position: absolute;
        left: 10%; right: 10%;
        bottom: 0;
        height: 2px;
        background: linear-gradient(90deg,
          transparent,
          rgb(var(--lumina-accent-rgb) / 0.6),
          transparent);
        border-radius: 2px;
      }
      :host([variant="morph"]) .lmgrid__body-row { border-bottom: 0; }
      :host([variant="morph"]) .lmgrid__body-row:hover .lmgrid__cell {
        background: rgb(var(--lumina-accent-rgb) / 0.10);
        transform: scale(1.02);
      }
      :host([variant="morph"]) .lmgrid__cell {
        transition: transform calc(var(--lumina-speed) * 0.5) var(--lumina-ease-spring),
                    background calc(var(--lumina-speed) * 0.5) var(--lumina-ease-out);
      }

      /* ----- Variant: neural — connecting glow on header ----- */
      :host([variant="neural"]) .lmgrid__head-row {
        background:
          linear-gradient(90deg,
            transparent 0%,
            rgb(var(--lumina-accent-rgb) / 0.18) 50%,
            transparent 100%),
          var(--lmgrid-header-bg);
        box-shadow: inset 0 -1px 0 0 rgb(var(--lumina-accent-rgb) / 0.4);
      }
      :host([variant="neural"]) .lmgrid__head-cell {
        color: var(--lumina-accent);
        text-shadow: 0 0 8px rgb(var(--lumina-accent-rgb) / 0.5);
      }
      :host([variant="neural"]) .lmgrid__body-row:hover {
        background: linear-gradient(90deg,
          transparent 0%,
          rgb(var(--lumina-accent-rgb) / 0.12) 50%,
          transparent 100%);
      }

      /* ----- Variant: void — black-deep with cyan scan ----- */
      :host([variant="void"]) .lmgrid {
        background: rgb(0 0 0 / 0.7);
        border-color: rgb(120 240 255 / 0.18);
        -webkit-backdrop-filter: blur(6px);
        backdrop-filter: blur(6px);
      }
      :host([variant="void"]) .lmgrid__head-row {
        background: rgb(0 0 0 / 0.5);
        border-bottom-color: rgb(120 240 255 / 0.25);
      }
      :host([variant="void"]) .lmgrid__head-cell { color: rgb(120 240 255); }
      :host([variant="void"]) .lmgrid__body-row:hover {
        background: rgb(120 240 255 / 0.06);
        box-shadow: inset 2px 0 0 rgb(120 240 255);
      }
      :host([variant="void"]) .lmgrid__body-row {
        border-bottom-color: rgb(255 255 255 / 0.04);
      }

      /* ----- Variant: aura — pulsing header halo + row auras ----- */
      :host([variant="aura"]) .lmgrid {
        position: relative;
        overflow: visible;
      }
      :host([variant="aura"]) .lmgrid__scroll { overflow: visible; }
      :host([variant="aura"]) .lmgrid__head-row {
        position: sticky; top: 0;
        background:
          radial-gradient(140% 100% at 50% -40%,
            rgb(var(--lumina-accent-rgb) / 0.45),
            rgb(var(--lumina-accent-rgb) / 0.10) 40%,
            var(--lmgrid-header-bg) 75%);
        animation: lmgrid-aura-pulse 2.4s ease-in-out infinite;
        box-shadow:
          0 0 32px rgb(var(--lumina-accent-rgb) / 0.30),
          inset 0 -2px 0 0 rgb(var(--lumina-accent-rgb) / 0.6);
      }
      @keyframes lmgrid-aura-pulse {
        0%, 100% { box-shadow: 0 0 24px rgb(var(--lumina-accent-rgb) / 0.20),
                               inset 0 -2px 0 0 rgb(var(--lumina-accent-rgb) / 0.5); }
        50%      { box-shadow: 0 0 56px rgb(var(--lumina-accent-rgb) / 0.55),
                               inset 0 -2px 0 0 rgb(var(--lumina-accent-rgb) / 0.9); }
      }
      :host([variant="aura"]) .lmgrid__head-cell {
        color: var(--lumina-accent);
        text-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.6);
      }
      :host([variant="aura"]) .lmgrid__body-row {
        position: relative;
      }
      :host([variant="aura"]) .lmgrid__body-row:hover {
        background: radial-gradient(80% 100% at 50% 50%,
          rgb(var(--lumina-accent-rgb) / 0.18),
          transparent 70%);
        box-shadow: 0 0 24px rgb(var(--lumina-accent-rgb) / 0.20);
      }

      /* ----- Variant: dimensional — 3D extrude header + parallax rows ----- */
      :host([variant="dimensional"]) .lmgrid {
        transform-style: preserve-3d;
        perspective: 1200px;
        perspective-origin: center top;
      }
      :host([variant="dimensional"]) .lmgrid__table {
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"]) .lmgrid__head-row {
        transform: translateZ(20px);
        background:
          linear-gradient(180deg,
            rgb(var(--lumina-accent-rgb) / 0.35),
            rgb(var(--lumina-accent-rgb) / 0.10));
        box-shadow:
          0 12px 32px -8px rgb(0 0 0 / 0.7),
          0 4px 0 0 rgb(var(--lumina-accent-rgb) / 0.4),
          inset 0 1px 0 0 rgb(255 255 255 / 0.20);
        border-bottom: 0;
      }
      :host([variant="dimensional"]) .lmgrid__head-cell {
        color: #fff;
        text-shadow: 0 1px 2px rgb(0 0 0 / 0.5);
      }
      :host([variant="dimensional"]) .lmgrid__body-row {
        transform: translateZ(0);
        transition: transform calc(var(--lumina-speed) * 0.5) var(--lumina-ease-spring),
                    background calc(var(--lumina-speed) * 0.5) var(--lumina-ease-out),
                    box-shadow calc(var(--lumina-speed) * 0.5) var(--lumina-ease-out);
      }
      :host([variant="dimensional"]) .lmgrid__body-row:hover {
        transform: translateZ(12px);
        background: rgb(var(--lumina-accent-rgb) / 0.15);
        box-shadow:
          0 16px 32px -10px rgb(0 0 0 / 0.7),
          0 8px 16px -8px rgb(var(--lumina-accent-rgb) / 0.45);
      }

      /* ----- Intensity scaling — affects hover/selection strength ----- */
      :host([intensity="subtle"])  { --lmgrid-hover: rgb(var(--lumina-accent-rgb) / 0.04); }
      :host([intensity="medium"])  { --lmgrid-hover: rgb(var(--lumina-accent-rgb) / 0.08); }
      :host([intensity="intense"]) { --lmgrid-hover: rgb(var(--lumina-accent-rgb) / 0.14); }
      :host([intensity="extreme"]) { --lmgrid-hover: rgb(var(--lumina-accent-rgb) / 0.22); }

      @media (prefers-reduced-motion: reduce) {
        .lmgrid__body-row,
        .lmgrid__head-row,
        .lmgrid__head-cell { animation: none !important; transition: none !important; }
      }
    `;
  }

  /* ---------------------------------------------------------------- */
  /* Lifecycle                                                        */
  /* ---------------------------------------------------------------- */

  protected mounted(): void {
    this._density = coerceDensity(this.getAttribute('density'));
    this.setAttribute('data-density', this._density);
    this._parseData();
    this._readColumnsFromChildren();
    this._renderAll();

    // Watch for added/removed <lumina-grid-column> children.
    this._gridObserver = new MutationObserver(this._onChildMutation);
    this._gridObserver.observe(this, { childList: true, subtree: false });
  }

  protected unmounted(): void {
    this._gridObserver?.disconnect();
    this._gridObserver = null;
  }

  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {
    // Variant/intensity/accent-color changes only affect CSS — no DOM
    // rebuild needed. The base class already pushed the new tokens.
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    if (!this._mounted) return;
    switch (name) {
      case 'data':
        this._parseData();
        this._renderAll();
        break;
      case 'density':
        this._density = coerceDensity(value);
        this.setAttribute('data-density', this._density);
        // CSS custom properties drive everything — no DOM rebuild needed.
        break;
      case 'zebra':
      case 'sticky-header':
      case 'empty-state':
        this._renderAll();
        break;
      default:
        break;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Public typed accessors                                            */
  /* ---------------------------------------------------------------- */

  get density(): GridDensity {
    return this._density;
  }
  set density(v: GridDensity) {
    this._density = v;
    this.setAttribute('density', v);
    this.setAttribute('data-density', v);
  }

  get data(): Array<Record<string, unknown>> {
    return this._data;
  }
  set data(v: Array<Record<string, unknown>>) {
    this._data = Array.isArray(v) ? v : [];
    this._renderAll();
  }

  get columns(): GridColumnSpec[] {
    return this._columns;
  }

  /* ---------------------------------------------------------------- */
  /* Parsing                                                          */
  /* ---------------------------------------------------------------- */

  private _parseData(): void {
    const raw = this.getAttribute('data');
    this._dataParseError = null;
    if (!raw || !raw.trim()) {
      this._data = [];
      return;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        this._dataParseError = '`data` must be a JSON array of objects.';
        this._data = [];
        return;
      }
      this._data = parsed.filter(
        (r): r is Record<string, unknown> =>
          r !== null && typeof r === 'object' && !Array.isArray(r),
      );
    } catch (e) {
      this._dataParseError = `Failed to parse \`data\` JSON: ${
        (e as Error).message
      }`;
      this._data = [];
    }
  }

  private _readColumnsFromChildren(): void {
    const cols = Array.from(this.querySelectorAll<LuminaDataGridColumn>(
      LuminaDataGridColumn.tagName,
    ));
    this._columns = cols.map((c) => c.toSpec()).filter((c) => c.field);
  }

  private _onChildMutation = (mutations: MutationRecord[]): void => {
    const relevant = mutations.some(
      (m) =>
        m.type === 'childList' &&
        Array.from(m.addedNodes).concat(Array.from(m.removedNodes)).some(
          (n) =>
            n instanceof LuminaDataGridColumn ||
            (n instanceof Element &&
              n.tagName.toLowerCase() === LuminaDataGridColumn.tagName),
        ),
    );
    if (relevant) {
      this._readColumnsFromChildren();
      this._renderAll();
    }
  };

  /* ---------------------------------------------------------------- */
  /* Rendering                                                        */
  /* ---------------------------------------------------------------- */

  private _renderAll(): void {
    this._renderHeader();
    this._renderBody();
    this._renderEmptyState();
    this._renderError();
    this._updateAria();
  }

  private _renderHeader(): void {
    const headRow = this.$$('.lmgrid__head-row');
    if (!headRow) return;
    headRow.innerHTML = '';
    if (this._columns.length === 0) {
      headRow.innerHTML =
        '<th class="lmgrid__head-cell" data-empty>(no columns)</th>';
      return;
    }
    for (const col of this._columns) {
      if (col.hidden) continue;
      const th = document.createElement('th');
      th.className = 'lmgrid__head-cell';
      th.setAttribute('data-align', col.align);
      th.setAttribute('scope', 'col');
      th.setAttribute('aria-sort', 'none');
      if (col.sortable) th.setAttribute('data-sortable', '');
      if (col.width && col.width !== 'auto') {
        th.style.width = col.width;
        th.style.minWidth = col.minWidth;
      }
      th.textContent = col.label;
      headRow.appendChild(th);
    }
  }

  private _renderBody(): void {
    const body = this.$$('.lmgrid__body');
    if (!body) return;
    body.innerHTML = '';
    if (this._dataParseError) return;
    if (this._data.length === 0 || this._columns.length === 0) return;

    const frag = document.createDocumentFragment();
    this._data.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'lmgrid__body-row';
      tr.setAttribute('role', 'row');
      tr.dataset.index = String(idx);
      tr.addEventListener('click', () => this._onRowClick(idx, row));
      tr.addEventListener('mouseenter', () => this._onRowEnter(idx, row));
      tr.addEventListener('mouseleave', () => this._onRowLeave(idx, row));

      for (const col of this._columns) {
        if (col.hidden) continue;
        const td = document.createElement('td');
        td.className = 'lmgrid__cell';
        td.setAttribute('role', 'gridcell');
        td.setAttribute('data-align', col.align);
        td.setAttribute('data-field', col.field);
        if (col.width && col.width !== 'auto') {
          td.style.width = col.width;
          td.style.minWidth = col.minWidth;
        }
        const value = row[col.field];
        const formatted = formatCell(value, col);
        td.innerHTML = formatted.html;
        if (formatted.ariaLabel) {
          td.setAttribute('aria-label', formatted.ariaLabel);
        }
        // Click-to-cell event
        td.addEventListener('click', (e) => {
          // Prevent double-fire with row click only when stopPropagation is called.
          e.stopPropagation();
          this._onCellClick(idx, col.field, value);
        });
        tr.appendChild(td);
      }
      frag.appendChild(tr);
    });
    body.appendChild(frag);
  }

  private _renderEmptyState(): void {
    const empty = this.$$('.lmgrid__empty');
    const textEl = this.$$('[data-empty-text]');
    if (!empty) return;
    const hasData =
      this._data.length > 0 &&
      this._columns.length > 0 &&
      !this._dataParseError;
    empty.hidden = hasData;
    if (textEl) {
      textEl.textContent =
        this.getAttribute('empty-state') ?? 'Nenhum registro para exibir.';
    }
  }

  private _renderError(): void {
    const err = this.$$('[data-error]');
    if (!err) return;
    if (this._dataParseError) {
      err.hidden = false;
      err.textContent = this._dataParseError;
    } else {
      err.hidden = true;
    }
  }

  private _updateAria(): void {
    const root = this.$$('.lmgrid');
    if (!root) return;
    root.setAttribute(
      'aria-rowcount',
      String(this._columns.length === 0 ? 0 : this._data.length + 1),
    );
    root.setAttribute(
      'aria-colcount',
      String(this._columns.filter((c) => !c.hidden).length),
    );
  }

  /* ---------------------------------------------------------------- */
  /* Event dispatch                                                   */
  /* ---------------------------------------------------------------- */

  private _onRowClick(index: number, row: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent('lumina-row-click', {
        bubbles: true,
        composed: true,
        detail: { index, row },
      }),
    );
  }

  private _onRowEnter(index: number, row: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent('lumina-row-enter', {
        bubbles: true,
        composed: true,
        detail: { index, row },
      }),
    );
  }

  private _onRowLeave(index: number, row: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent('lumina-row-leave', {
        bubbles: true,
        composed: true,
        detail: { index, row },
      }),
    );
  }

  private _onCellClick(
    index: number,
    field: string,
    value: unknown,
  ): void {
    this.dispatchEvent(
      new CustomEvent('lumina-cell-click', {
        bubbles: true,
        composed: true,
        detail: { index, field, value },
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-datagrid': LuminaDataGrid;
  }
}

if (!customElements.get(LuminaDataGrid.tagName)) {
  customElements.define(LuminaDataGrid.tagName, LuminaDataGrid);
}
