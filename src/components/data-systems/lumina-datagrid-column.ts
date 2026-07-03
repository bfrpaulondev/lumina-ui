/**
 * LuminaDataGridColumn — Declarative column definition for <lumina-datagrid>.
 *
 * Place any number of these as children of <lumina-datagrid>:
 *
 *   <lumina-datagrid data='[{...}]'>
 *     <lumina-datagrid-column field="name"  label="Nome"  width="220"></lumina-datagrid-column>
 *     <lumina-datagrid-column field="email" label="Email" type="email"></lumina-datagrid-column>
 *     <lumina-datagrid-column field="role"  label="Cargo" type="badge"
 *                        options='[{"value":"admin","label":"Admin"}]'></lumina-datagrid-column>
 *   </lumina-datagrid>
 *
 * The column itself renders nothing visually — <lumina-datagrid> reads its
 * attributes and slotted <lumina-datagrid-column> children to build the
 * internal <table>. The element exists purely as a declarative schema.
 *
 * Supported cell types (M1):
 *   text | number | currency | date | boolean | chip | badge
 *
 * Notes:
 *   - `sortable`, `editable`, `resizable`, `filterable`, `pinned` are
 *     parsed and exposed via properties so <lumina-grid> can read them
 *     in M1. The actual sort/resize/filter behaviors land in M2/M3.
 *   - `width` accepts any CSS length (e.g. "220", "220px", "20%").
 *     A bare number is treated as pixels.
 *   - `align` defaults to "left"; number/currency/boolean auto-default
 *     to "right" / "center" respectively unless explicitly set.
 */

import { LuminaElement } from '../../core/LuminaElement';
import type { LuminaElementAttributes } from '../../core/LuminaElement';

export type GridColumnType =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'boolean'
  | 'chip'
  | 'badge';

export type gridColumnAlign = 'left' | 'center' | 'right';
export type GridColumnPin = 'none' | 'left' | 'right';

export interface GridColumnSpec {
  field: string;
  label: string;
  type: GridColumnType;
  width: string;
  minWidth: string;
  align: gridColumnAlign;
  pinned: GridColumnPin;
  hidden: boolean;
  sortable: boolean;
  editable: boolean;
  resizable: boolean;
  filterable: boolean;
  formatter: string;
  formatOptions: Record<string, unknown>;
  options: Array<{ value: string; label: string; color?: string }>;
  /** Reference back to the source <lumina-datagrid-column> element. */
  source: LuminaDataGridColumn;
}

const TYPE_VALUES: GridColumnType[] = [
  'text',
  'number',
  'currency',
  'date',
  'boolean',
  'chip',
  'badge',
];
const ALIGN_VALUES: gridColumnAlign[] = ['left', 'center', 'right'];
const PIN_VALUES: GridColumnPin[] = ['none', 'left', 'right'];

function coerce<T extends string>(
  v: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  if (v === null) return fallback;
  return (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

function defaultAlignForType(t: GridColumnType): gridColumnAlign {
  if (t === 'number' || t === 'currency') return 'right';
  if (t === 'boolean') return 'center';
  return 'left';
}

function normalizeWidth(v: string | null, fallback: string): string {
  if (!v) return fallback;
  const trimmed = v.trim();
  if (/^\d+$/.test(trimmed)) return `${trimmed}px`;
  return trimmed;
}

export class LuminaDataGridColumn extends LuminaElement {
  static tagName = 'lumina-datagrid-column';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'field',
      'label',
      'type',
      'width',
      'min-width',
      'align',
      'pinned',
      'hidden',
      'sortable',
      'editable',
      'resizable',
      'filterable',
      'formatter',
      'format-options',
      'options',
    ];
  }

  /* The column renders nothing — it's a schema source. */
  protected render(): string {
    return '<style>:host{display:none !important;}</style>';
  }

  protected styles(): string {
    return '';
  }

  protected mounted(): void {
    /* no-op */
  }

  protected unmounted(): void {
    /* no-op */
  }

  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {
    /* no-op */
  }

  /* ---------------------------------------------------------------- */
  /* Reflection-free accessors — read directly from attributes so     */
  /* <lumina-grid> always sees the current state.                     */
  /* ---------------------------------------------------------------- */

  get field(): string {
    return this.getAttribute('field') ?? '';
  }

  get label(): string {
    return this.getAttribute('label') ?? this.field;
  }

  get type(): GridColumnType {
    return coerce(this.getAttribute('type'), TYPE_VALUES, 'text');
  }

  get width(): string {
    return normalizeWidth(this.getAttribute('width'), 'auto');
  }

  get minWidth(): string {
    return normalizeWidth(this.getAttribute('min-width'), '80px');
  }

  get align(): gridColumnAlign {
    const explicit = this.getAttribute('align');
    if (explicit && (ALIGN_VALUES as readonly string[]).includes(explicit)) {
      return explicit as gridColumnAlign;
    }
    return defaultAlignForType(this.type);
  }

  get pinned(): GridColumnPin {
    return coerce(this.getAttribute('pinned'), PIN_VALUES, 'none');
  }

  get hidden(): boolean {
    return this.hasAttribute('hidden');
  }

  get sortable(): boolean {
    return this.hasAttribute('sortable');
  }

  get editable(): boolean {
    return this.hasAttribute('editable');
  }

  get resizable(): boolean {
    return this.hasAttribute('resizable');
  }

  get filterable(): boolean {
    return this.hasAttribute('filterable');
  }

  get formatter(): string {
    return this.getAttribute('formatter') ?? '';
  }

  get formatOptions(): Record<string, unknown> {
    const raw = this.getAttribute('format-options');
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  get options(): Array<{ value: string; label: string; color?: string }> {
    const raw = this.getAttribute('options');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (o): o is { value: string; label: string; color?: string } =>
            o !== null &&
            typeof o === 'object' &&
            typeof (o as { value?: unknown }).value === 'string' &&
            typeof (o as { label?: unknown }).label === 'string',
        )
        .map((o) => ({
          value: o.value,
          label: o.label,
          color: typeof o.color === 'string' ? o.color : undefined,
        }));
    } catch {
      return [];
    }
  }

  /** Snapshot of the column as a plain spec object. Read by <lumina-grid>. */
  toSpec(): GridColumnSpec {
    return {
      field: this.field,
      label: this.label,
      type: this.type,
      width: this.width,
      minWidth: this.minWidth,
      align: this.align,
      pinned: this.pinned,
      hidden: this.hidden,
      sortable: this.sortable,
      editable: this.editable,
      resizable: this.resizable,
      filterable: this.filterable,
      formatter: this.formatter,
      formatOptions: this.formatOptions,
      options: this.options,
      source: this,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-datagrid-column': LuminaDataGridColumn;
  }
}

if (!customElements.get(LuminaDataGridColumn.tagName)) {
  customElements.define(LuminaDataGridColumn.tagName, LuminaDataGridColumn);
}
