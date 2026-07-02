/**
 * Tests for src/core/mask.ts — mask engine.
 * Run: npx tsx --test tests/mask.test.ts
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  compileMask,
  applyMask,
  unmask,
  nextInputIndex,
  thousandsFormatter,
  currencyFormatter,
  percentFormatter,
  MASKS,
} from '../src/core/mask.ts';

// ===== compileMask =====

test('compileMask: parses # as digit input', () => {
  const tokens = compileMask('###');
  assert.equal(tokens.length, 3);
  assert.equal(tokens[0].type, 'input');
  assert.equal(tokens[0].test!('5'), true);
  assert.equal(tokens[0].test!('a'), false);
});

test('compileMask: parses A as letter input', () => {
  const tokens = compileMask('AAA');
  assert.equal(tokens[0].test!('a'), true);
  assert.equal(tokens[0].test!('Z'), true);
  assert.equal(tokens[0].test!('5'), false);
});

test('compileMask: parses ? as alnum input', () => {
  const tokens = compileMask('?');
  assert.equal(tokens[0].test!('a'), true);
  assert.equal(tokens[0].test!('5'), true);
  assert.equal(tokens[0].test!('!'), false);
});

test('compileMask: parses * as any input', () => {
  const tokens = compileMask('*');
  assert.equal(tokens[0].test!('!'), true);
  assert.equal(tokens[0].test!(' '), true);
});

test('compileMask: parses literals', () => {
  const tokens = compileMask('##-##');
  assert.equal(tokens.length, 5);
  assert.equal(tokens[0].type, 'input');
  assert.equal(tokens[1].type, 'input');
  assert.equal(tokens[2].type, 'literal');
  assert.equal(tokens[2].char, '-');
  assert.equal(tokens[3].type, 'input');
  assert.equal(tokens[4].type, 'input');
});

// ===== applyMask =====

test('applyMask: CPF mask formats correctly', () => {
  const result = applyMask('12345678900', MASKS.cpf);
  assert.equal(result.formatted, '123.456.789-00');
  assert.equal(result.clean, '12345678900');
});

test('applyMask: CPF mask strips non-digits', () => {
  const result = applyMask('abc123def456ghi789jkl00', MASKS.cpf);
  assert.equal(result.formatted, '123.456.789-00');
  assert.equal(result.clean, '12345678900');
});

test('applyMask: phone BR mask', () => {
  const result = applyMask('11999998888', MASKS.phoneBR);
  assert.equal(result.formatted, '(11) 99999-8888');
  assert.equal(result.clean, '11999998888');
});

test('applyMask: credit card mask', () => {
  const result = applyMask('4111111111111111', MASKS.creditCard);
  assert.equal(result.formatted, '4111 1111 1111 1111');
  assert.equal(result.clean, '4111111111111111');
});

test('applyMask: stops at end of mask', () => {
  const result = applyMask('123456789012345', MASKS.cpf); // CPF only has 11 input slots
  assert.equal(result.formatted, '123.456.789-01');
  assert.equal(result.clean, '12345678901');
});

test('applyMask: empty input produces empty output', () => {
  const result = applyMask('', MASKS.cpf);
  assert.equal(result.formatted, '');
  assert.equal(result.clean, '');
});

// ===== unmask =====

test('unmask: strips literals from CPF', () => {
  assert.equal(unmask('123.456.789-00', MASKS.cpf), '12345678900');
});

test('unmask: strips literals from phone', () => {
  assert.equal(unmask('(11) 99999-8888', MASKS.phoneBR), '11999998888');
});

// ===== nextInputIndex =====

test('nextInputIndex: finds next input slot', () => {
  const tokens = compileMask('##-##');
  assert.equal(nextInputIndex(tokens, 0), 0);
  assert.equal(nextInputIndex(tokens, 2), 3); // skip literal at 2
  assert.equal(nextInputIndex(tokens, 5), -1); // no more input slots
});

// ===== thousandsFormatter =====

test('thousandsFormatter: groups digits', () => {
  const fp = thousandsFormatter('.');
  assert.equal(fp.format('1234567'), '1.234.567');
  assert.equal(fp.format('0'), '0');
  assert.equal(fp.format(''), '');
  assert.equal(fp.parse('1.234.567'), '1234567');
});

test('thousandsFormatter: custom separator', () => {
  const fp = thousandsFormatter(',');
  assert.equal(fp.format('1234567'), '1,234,567');
});

// ===== currencyFormatter =====

test('currencyFormatter: formats BRL', () => {
  const fp = currencyFormatter('R$', ',', '.');
  assert.equal(fp.format('0'), 'R$ 0,00');
  assert.equal(fp.format('5'), 'R$ 0,05');
  assert.equal(fp.format('1234'), 'R$ 12,34');
  assert.equal(fp.format('123456'), 'R$ 1.234,56');
});

test('currencyFormatter: parses back to clean', () => {
  const fp = currencyFormatter('R$', ',', '.');
  assert.equal(fp.parse('R$ 1.234,56'), '1234.56');
});

test('currencyFormatter: empty input', () => {
  const fp = currencyFormatter('R$', ',', '.');
  assert.equal(fp.format(''), '');
});

// ===== percentFormatter =====

test('percentFormatter: appends %', () => {
  const fp = percentFormatter();
  assert.equal(fp.format('50'), '50%');
  assert.equal(fp.parse('50%'), '50');
});

// ===== Pre-compiled masks =====

test('MASKS: all pre-compiled masks exist', () => {
  assert.ok(MASKS.cpf);
  assert.ok(MASKS.cnpj);
  assert.ok(MASKS.phoneBR);
  assert.ok(MASKS.creditCard);
  assert.ok(MASKS.dateISO);
  assert.ok(MASKS.dateBR);
  assert.ok(MASKS.zipBR);
});

test('MASKS.cnpj: formats correctly', () => {
  const result = applyMask('11444777000161', MASKS.cnpj);
  assert.equal(result.formatted, '11.444.777/0001-61');
  assert.equal(result.clean, '11444777000161');
});

test('MASKS.zipBR: formats correctly', () => {
  const result = applyMask('01310100', MASKS.zipBR);
  assert.equal(result.formatted, '01310-100');
  assert.equal(result.clean, '01310100');
});
