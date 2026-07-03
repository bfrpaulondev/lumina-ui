/**
 * LuminaUI — Cell formatters for the data grid.
 *
 * Pure functions: (value, spec) => { html: string, ariaLabel?: string }.
 * HTML strings are escaped via `escapeHtml` so user data is never
 * injected as raw markup.
 *
 * M1 supports: text | number | currency | date | boolean | chip | badge
 *
 * Future types (sparkline, progress, avatar, button, image, custom)
 * land in M3/M4.
 */

import type { GridColumnSpec } from '../../components/data-systems/lumina-datagrid-column';

export interface FormattedCell {
  /** HTML-safe string to inject into a cell. */
  html: string;
  /** Optional ARIA label override (defaults to the visible text). */
  ariaLabel?: string;
}

/** Escape <, >, &, ", ' for safe HTML insertion. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Stringify any value (including null/undefined/objects) for display. */
function toDisplayString(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (v instanceof Date) return v.toISOString();
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

/* ------------------------------------------------------------------ */
/* Per-type formatters                                                */
/* ------------------------------------------------------------------ */

function formatText(v: unknown, _spec: GridColumnSpec): FormattedCell {
  const text = toDisplayString(v);
  return { html: escapeHtml(text) };
}

function formatNumber(v: unknown, spec: GridColumnSpec): FormattedCell {
  if (v === null || v === undefined || v === '') {
    return { html: '' };
  }
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) {
    return formatText(v, spec);
  }
  const opts = spec.formatOptions as {
    decimals?: number;
    locale?: string;
    thousands?: boolean;
  };
  const decimals =
    typeof opts.decimals === 'number' && Number.isFinite(opts.decimals)
      ? opts.decimals
      : 0;
  const locale =
    typeof opts.locale === 'string' ? opts.locale : 'pt-BR';
  const out = opts.thousands === false
    ? n.toFixed(decimals)
    : n.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
  return { html: escapeHtml(out) };
}

function formatCurrency(v: unknown, spec: GridColumnSpec): FormattedCell {
  if (v === null || v === undefined || v === '') return { html: '' };
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return formatText(v, spec);
  const opts = spec.formatOptions as {
    currency?: string;
    locale?: string;
  };
  const currency = typeof opts.currency === 'string' ? opts.currency : 'BRL';
  const locale = typeof opts.locale === 'string' ? opts.locale : 'pt-BR';
  const out = n.toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return { html: escapeHtml(out) };
}

function formatDate(v: unknown, spec: GridColumnSpec): FormattedCell {
  if (v === null || v === undefined || v === '') return { html: '' };
  let d: Date;
  if (v instanceof Date) {
    d = v;
  } else if (typeof v === 'number') {
    d = new Date(v);
  } else if (typeof v === 'string') {
    // Try ISO first, then DD/MM/YYYY and YYYY-MM-DD.
    d = new Date(v);
    if (Number.isNaN(d.getTime())) {
      const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) {
        d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
      }
    }
  } else {
    return formatText(v, spec);
  }
  if (Number.isNaN(d.getTime())) return formatText(v, spec);
  const opts = spec.formatOptions as {
    format?: 'date' | 'time' | 'datetime';
    locale?: string;
  };
  const format = opts.format ?? 'date';
  const locale = typeof opts.locale === 'string' ? opts.locale : 'pt-BR';
  let out: string;
  if (format === 'time') {
    out = d.toLocaleTimeString(locale);
  } else if (format === 'datetime') {
    out = d.toLocaleString(locale);
  } else {
    out = d.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
  return { html: escapeHtml(out) };
}

function formatBoolean(v: unknown, _spec: GridColumnSpec): FormattedCell {
  const isTruthy =
    v === true ||
    v === 1 ||
    v === '1' ||
    v === 'true' ||
    v === 'yes' ||
    v === 'on';
  const isFalsy =
    v === false ||
    v === 0 ||
    v === '0' ||
    v === 'false' ||
    v === 'no' ||
    v === 'off';
  if (!isTruthy && !isFalsy) return { html: '' };
  // Render as a pill — visual-only, no interactive toggle in M1.
  const cls = isTruthy
    ? 'lmgrid__bool lmgrid__bool--on'
    : 'lmgrid__bool lmgrid__bool--off';
  const label = isTruthy ? 'Sim' : 'Não';
  return {
    html: `<span class="${cls}" aria-label="${label}">${label}</span>`,
    ariaLabel: label,
  };
}

function formatChip(v: unknown, spec: GridColumnSpec): FormattedCell {
  const text = toDisplayString(v);
  if (!text) return { html: '' };
  // Look up a matching option for color/label override.
  const match = spec.options.find((o) => o.value === text);
  const label = match?.label ?? text;
  const colorStyle = match?.color
    ? ` style="--chip-color:${escapeHtml(match.color)}"`
    : '';
  return {
    html: `<span class="lmgrid__chip"${colorStyle}>${escapeHtml(label)}</span>`,
  };
}

function formatBadge(v: unknown, spec: GridColumnSpec): FormattedCell {
  const text = toDisplayString(v);
  if (!text) return { html: '' };
  const match = spec.options.find((o) => o.value === text);
  const label = match?.label ?? text;
  const colorAttr = match?.color
    ? ` data-color="${escapeHtml(match.color)}"`
    : '';
  return {
    html: `<span class="lmgrid__badge"${colorAttr}>${escapeHtml(
      label,
    )}</span>`,
  };
}

/* ------------------------------------------------------------------ */
/* Dispatcher                                                         */
/* ------------------------------------------------------------------ */

const FORMATTERS: Record<
  GridColumnSpec['type'],
  (v: unknown, spec: GridColumnSpec) => FormattedCell
> = {
  text: formatText,
  number: formatNumber,
  currency: formatCurrency,
  date: formatDate,
  boolean: formatBoolean,
  chip: formatChip,
  badge: formatBadge,
};

export function formatCell(
  value: unknown,
  spec: GridColumnSpec,
): FormattedCell {
  const fn = FORMATTERS[spec.type] ?? formatText;
  let result = fn(value, spec);
  // Apply post-formatter if declared (uppercase, lowercase, truncate).
  if (spec.formatter) {
    result = applyFormatter(result, spec);
  }
  return result;
}

function applyFormatter(
  cell: FormattedCell,
  spec: GridColumnSpec,
): FormattedCell {
  switch (spec.formatter) {
    case 'uppercase':
      return { ...cell, html: cell.html.toUpperCase() };
    case 'lowercase':
      return { ...cell, html: cell.html.toLowerCase() };
    case 'truncate': {
      const opts = spec.formatOptions as { length?: number };
      const max = typeof opts.length === 'number' ? opts.length : 30;
      // Only truncate plain text — skip if cell contains HTML tags.
      if (/<[^>]+>/.test(cell.html)) return cell;
      if (cell.html.length <= max) return cell;
      return {
        html: escapeHtml(cell.html.slice(0, max - 1) + '…'),
      };
    }
    default:
      return cell;
  }
}
