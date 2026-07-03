/**
 * Tests for the M1 data-grid formatters and column parsing.
 *
 * Run with: npx tsx --test tests/grid.test.ts
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatCell, escapeHtml } from '../src/core/data-systems/formatters';
import type { GridColumnSpec } from '../src/components/data-systems/lumina-datagrid-column';

function makeSpec(overrides: Partial<GridColumnSpec> = {}): GridColumnSpec {
  return {
    field: 'f',
    label: 'F',
    type: 'text',
    width: 'auto',
    minWidth: '80px',
    align: 'left',
    pinned: 'none',
    hidden: false,
    sortable: false,
    editable: false,
    resizable: false,
    filterable: false,
    formatter: '',
    formatOptions: {},
    options: [],
    source: {} as any,
    ...overrides,
  };
}

/* ------------------------------------------------------------------ */
/* escapeHtml                                                          */
/* ------------------------------------------------------------------ */

test('escapeHtml escapes <, >, &, ", \'', () => {
  assert.equal(
    escapeHtml('<script>alert("x") & \'y\'</script>'),
    '&lt;script&gt;alert(&quot;x&quot;) &amp; &#39;y&#39;&lt;/script&gt;',
  );
});

test('escapeHtml passes through safe text', () => {
  assert.equal(escapeHtml('Marina Alves'), 'Marina Alves');
});

/* ------------------------------------------------------------------ */
/* text formatter                                                      */
/* ------------------------------------------------------------------ */

test('formatCell(text) returns escaped string', () => {
  const spec = makeSpec({ type: 'text' });
  assert.equal(formatCell('hello', spec).html, 'hello');
  assert.equal(formatCell('<b>x', spec).html, '&lt;b&gt;x');
});

test('formatCell(text) handles null/undefined/objects', () => {
  const spec = makeSpec({ type: 'text' });
  assert.equal(formatCell(null, spec).html, '');
  assert.equal(formatCell(undefined, spec).html, '');
  assert.equal(formatCell({ a: 1 }, spec).html, '{&quot;a&quot;:1}');
});

/* ------------------------------------------------------------------ */
/* number formatter                                                    */
/* ------------------------------------------------------------------ */

test('formatCell(number) formats with thousands separators', () => {
  const spec = makeSpec({ type: 'number' });
  // pt-BR uses '.' as thousands separator
  assert.equal(formatCell(1234567, spec).html, '1.234.567');
});

test('formatCell(number) respects decimals option', () => {
  const spec = makeSpec({
    type: 'number',
    formatOptions: { decimals: 2 },
  });
  assert.equal(formatCell(1234.5, spec).html, '1.234,50');
});

test('formatCell(number) returns empty for null/empty', () => {
  const spec = makeSpec({ type: 'number' });
  assert.equal(formatCell(null, spec).html, '');
  assert.equal(formatCell('', spec).html, '');
});

test('formatCell(number) falls back to text for non-numeric', () => {
  const spec = makeSpec({ type: 'number' });
  assert.equal(formatCell('abc', spec).html, 'abc');
});

/* ------------------------------------------------------------------ */
/* currency formatter                                                  */
/* ------------------------------------------------------------------ */

test('formatCell(currency) formats BRL by default', () => {
  const spec = makeSpec({ type: 'currency' });
  // R$ 1.234,56 (pt-BR)
  const out = formatCell(1234.56, spec).html;
  assert.ok(out.includes('R$'), `expected R$ in ${out}`);
  assert.ok(out.includes('1.234,56'), `expected 1.234,56 in ${out}`);
});

test('formatCell(currency) respects currency option', () => {
  const spec = makeSpec({
    type: 'currency',
    formatOptions: { currency: 'USD' },
  });
  const out = formatCell(99.99, spec).html;
  assert.ok(out.includes('US$') || out.includes('$'), `expected $ in ${out}`);
});

/* ------------------------------------------------------------------ */
/* date formatter                                                      */
/* ------------------------------------------------------------------ */

test('formatCell(date) formats ISO date as DD/MM/YYYY (pt-BR)', () => {
  const spec = makeSpec({ type: 'date' });
  const out = formatCell('2024-03-22', spec).html;
  // pt-BR date format is DD/MM/YYYY
  assert.match(out, /22\/03\/2024/);
});

test('formatCell(date) handles Date objects', () => {
  const spec = makeSpec({ type: 'date' });
  const out = formatCell(new Date(2024, 2, 22), spec).html;
  assert.match(out, /22\/03\/2024/);
});

test('formatCell(date) parses DD/MM/YYYY strings', () => {
  const spec = makeSpec({ type: 'date' });
  const out = formatCell('22/03/2024', spec).html;
  assert.match(out, /22\/03\/2024/);
});

test('formatCell(date) returns text fallback for invalid input', () => {
  const spec = makeSpec({ type: 'date' });
  assert.equal(formatCell('not-a-date', spec).html, 'not-a-date');
});

/* ------------------------------------------------------------------ */
/* boolean formatter                                                   */
/* ------------------------------------------------------------------ */

test('formatCell(boolean) renders Sim pill for truthy', () => {
  const spec = makeSpec({ type: 'boolean' });
  const out = formatCell(true, spec);
  assert.match(out.html, /lmgrid__bool--on/);
  assert.match(out.html, /Sim/);
  assert.equal(out.ariaLabel, 'Sim');
});

test('formatCell(boolean) renders Não pill for falsy', () => {
  const spec = makeSpec({ type: 'boolean' });
  const out = formatCell(false, spec);
  assert.match(out.html, /lmgrid__bool--off/);
  assert.match(out.html, /Não/);
});

test('formatCell(boolean) accepts string truthy/falsy', () => {
  const spec = makeSpec({ type: 'boolean' });
  assert.match(formatCell('yes', spec).html, /Sim/);
  assert.match(formatCell('no', spec).html, /Não/);
  assert.match(formatCell(1, spec).html, /Sim/);
  assert.match(formatCell(0, spec).html, /Não/);
});

test('formatCell(boolean) returns empty for ambiguous values', () => {
  const spec = makeSpec({ type: 'boolean' });
  assert.equal(formatCell('maybe', spec).html, '');
  assert.equal(formatCell(null, spec).html, '');
});

/* ------------------------------------------------------------------ */
/* chip formatter                                                      */
/* ------------------------------------------------------------------ */

test('formatCell(chip) renders chip with text', () => {
  const spec = makeSpec({ type: 'chip' });
  const out = formatCell('frontend', spec).html;
  assert.match(out, /lmgrid__chip/);
  assert.match(out, /frontend/);
});

test('formatCell(chip) uses option label when value matches', () => {
  const spec = makeSpec({
    type: 'chip',
    options: [{ value: 'fe', label: 'Frontend' }],
  });
  const out = formatCell('fe', spec).html;
  assert.match(out, /Frontend/);
  assert.doesNotMatch(out, />fe</);
});

test('formatCell(chip) applies --chip-color from option', () => {
  const spec = makeSpec({
    type: 'chip',
    options: [{ value: 'fe', label: 'Frontend', color: '#7c5cff' }],
  });
  const out = formatCell('fe', spec).html;
  assert.match(out, /--chip-color:#7c5cff/);
});

test('formatCell(chip) returns empty for empty value', () => {
  const spec = makeSpec({ type: 'chip' });
  assert.equal(formatCell('', spec).html, '');
  assert.equal(formatCell(null, spec).html, '');
});

/* ------------------------------------------------------------------ */
/* badge formatter                                                     */
/* ------------------------------------------------------------------ */

test('formatCell(badge) renders badge with status dot', () => {
  const spec = makeSpec({ type: 'badge' });
  const out = formatCell('active', spec).html;
  assert.match(out, /lmgrid__badge/);
  assert.match(out, /active/);
});

test('formatCell(badge) uses option label and color', () => {
  const spec = makeSpec({
    type: 'badge',
    options: [
      { value: 'active', label: 'Ativo', color: '#22c55e' },
    ],
  });
  const out = formatCell('active', spec).html;
  assert.match(out, /Ativo/);
  assert.match(out, /data-color="#22c55e"/);
});

test('formatCell(badge) returns empty for empty value', () => {
  const spec = makeSpec({ type: 'badge' });
  assert.equal(formatCell(null, spec).html, '');
});

/* ------------------------------------------------------------------ */
/* Post-formatters (uppercase, lowercase, truncate)                    */
/* ------------------------------------------------------------------ */

test('formatter=uppercase uppercases the output', () => {
  const spec = makeSpec({ type: 'text', formatter: 'uppercase' });
  assert.equal(formatCell('hello', spec).html, 'HELLO');
});

test('formatter=lowercase lowercases the output', () => {
  const spec = makeSpec({ type: 'text', formatter: 'lowercase' });
  assert.equal(formatCell('HELLO', spec).html, 'hello');
});

test('formatter=truncate truncates plain text', () => {
  const spec = makeSpec({
    type: 'text',
    formatter: 'truncate',
    formatOptions: { length: 8 },
  });
  const out = formatCell('abcdefghij', spec).html;
  assert.equal(out, 'abcdefg…');
});

test('formatter=truncate does not truncate HTML output (skips)', () => {
  const spec = makeSpec({
    type: 'badge',
    formatter: 'truncate',
    formatOptions: { length: 3 },
  });
  // Badge output contains HTML — formatter must skip, not mangle it.
  const out = formatCell('active', spec).html;
  assert.match(out, /lmgrid__badge/);
});

test('unknown formatter is a no-op', () => {
  const spec = makeSpec({ type: 'text', formatter: 'bogus' });
  assert.equal(formatCell('hello', spec).html, 'hello');
});

/* ------------------------------------------------------------------ */
/* Default alignment per type                                         */
/* ------------------------------------------------------------------ */
/* The align-defaulting logic lives on the LuminaDataGridColumn        */
/* element getter (it reads the `align` attribute and falls back to   */
/* a type-based default). It is verified end-to-end in the browser    */
/* demo (see /scripts/datagrid-demo.html) rather than as a pure unit  */
/* test, since exercising the getter requires a live custom element.  */
