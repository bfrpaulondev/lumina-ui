/**
 * Tests for src/core/validation.ts — validation rules.
 * Run: npx tsx --test tests/validation.test.ts
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  required,
  email,
  url,
  min,
  max,
  pattern,
  number,
  integer,
  alpha,
  alnum,
  phoneIntl,
  phoneBR,
  cpf,
  cnpj,
  creditCard,
  date,
  hexColor,
  match,
  parseRules,
  runRules,
} from '../src/core/validation.ts';

// ===== required =====

test('required: empty string fails', () => {
  assert.equal(required(''), 'Campo obrigatório');
  assert.equal(required('   '), 'Campo obrigatório');
});

test('required: non-empty passes', () => {
  assert.equal(required('hello'), null);
  assert.equal(required('0'), null);
});

test('required: null/undefined fail', () => {
  assert.equal(required(null), 'Campo obrigatório');
  assert.equal(required(undefined), 'Campo obrigatório');
});

test('required: empty array fails', () => {
  assert.equal(required([]), 'Campo obrigatório');
  assert.equal(required(['a']), null);
});

// ===== email =====

test('email: valid emails pass', () => {
  assert.equal(email('user@example.com'), null);
  assert.equal(email('a.b@c.d.com'), null);
});

test('email: invalid emails fail', () => {
  assert.equal(email('notanemail'), 'Email inválido');
  assert.equal(email('a@'), 'Email inválido');
  assert.equal(email('@b.com'), 'Email inválido');
});

test('email: empty passes (use required for empty check)', () => {
  assert.equal(email(''), null);
});

// ===== url =====

test('url: valid http(s) URLs pass', () => {
  assert.equal(url('http://example.com'), null);
  assert.equal(url('https://example.com/path?q=1'), null);
});

test('url: invalid URLs fail', () => {
  assert.equal(url('not a url'), 'URL inválida');
  assert.equal(url('ftp://example.com'), 'URL deve ser http(s)');
});

// ===== min / max =====

test('min: string length', () => {
  assert.equal(min(5)('abc'), 'Mínimo de 5 caracteres');
  assert.equal(min(5)('abcde'), null);
});

test('min: number value', () => {
  assert.equal(min(10)(5), 'Mínimo: 10');
  assert.equal(min(10)(15), null);
});

test('max: string length', () => {
  assert.equal(max(3)('abcd'), 'Máximo de 3 caracteres');
  assert.equal(max(3)('abc'), null);
});

// ===== pattern =====

test('pattern: matches regex', () => {
  const onlyDigits = pattern(/^\d+$/, 'Apenas dígitos');
  assert.equal(onlyDigits('123'), null);
  assert.equal(onlyDigits('abc'), 'Apenas dígitos');
});

// ===== number / integer =====

test('number: valid numbers pass', () => {
  assert.equal(number('123'), null);
  assert.equal(number('1.234,56'), null);
});

test('number: non-numbers fail', () => {
  assert.equal(number('abc'), 'Deve ser um número');
});

test('integer: valid integers pass', () => {
  assert.equal(integer('42'), null);
  assert.equal(integer('-7'), null);
});

test('integer: non-integers fail', () => {
  assert.equal(integer('3.14'), 'Deve ser um número inteiro');
  assert.equal(integer('abc'), 'Deve ser um número inteiro');
});

// ===== alpha / alnum =====

test('alpha: only letters pass', () => {
  assert.equal(alpha('Hello'), null);
  assert.equal(alpha('João'), null); // accented
});

test('alpha: numbers/symbols fail', () => {
  assert.equal(alpha('Hello123'), 'Apenas letras');
});

test('alnum: letters and numbers pass', () => {
  assert.equal(alnum('abc123'), null);
});

test('alnum: symbols fail', () => {
  assert.equal(alnum('abc-123'), 'Apenas letras e números');
});

// ===== phoneIntl =====

test('phoneIntl: valid E.164 pass', () => {
  assert.equal(phoneIntl('+5511999998888'), null);
  assert.equal(phoneIntl('+1 555 123 4567'), null);
});

test('phoneIntl: invalid fail', () => {
  assert.equal(phoneIntl('11999998888'), 'Telefone inválido (use +55 11 99999-9999)');
  assert.equal(phoneIntl('+551'), 'Telefone inválido (use +55 11 99999-9999)');
});

// ===== phoneBR =====

test('phoneBR: valid 10/11 digit pass', () => {
  assert.equal(phoneBR('11999998888'), null);
  assert.equal(phoneBR('(11) 3333-4444'), null);
});

test('phoneBR: invalid DDD fail', () => {
  assert.equal(phoneBR('10999998888'), 'DDD inválido'); // DDD 10 doesn't exist
});

// ===== cpf =====

test('cpf: valid CPF passes', () => {
  assert.equal(cpf('529.982.247-25'), null); // known valid CPF
  assert.equal(cpf('52998224725'), null);
});

test('cpf: invalid checksum fails', () => {
  assert.equal(cpf('12345678900'), 'CPF inválido');
});

test('cpf: all-same-digit fails', () => {
  assert.equal(cpf('11111111111'), 'CPF inválido');
});

test('cpf: wrong length fails', () => {
  assert.equal(cpf('123456'), 'CPF deve ter 11 dígitos');
});

test('cpf: empty passes (use required)', () => {
  assert.equal(cpf(''), null);
});

// ===== cnpj =====

test('cnpj: valid CNPJ passes', () => {
  assert.equal(cnpj('11.444.777/0001-61'), null);
  assert.equal(cnpj('11444777000161'), null);
});

test('cnpj: invalid checksum fails', () => {
  assert.equal(cnpj('12345678000100'), 'CNPJ inválido');
});

// ===== creditCard (Luhn) =====

test('creditCard: valid Visa passes', () => {
  assert.equal(creditCard('4111 1111 1111 1111'), null);
  assert.equal(creditCard('4111111111111111'), null);
});

test('creditCard: invalid Luhn fails', () => {
  assert.equal(creditCard('4111 1111 1111 1112'), 'Cartão inválido');
});

test('creditCard: too short fails', () => {
  assert.equal(creditCard('123'), 'Cartão inválido');
});

// ===== date =====

test('date: valid ISO passes', () => {
  assert.equal(date('2025-01-15'), null);
  assert.equal(date('2025-12-31'), null);
});

test('date: valid BR passes', () => {
  assert.equal(date('15/01/2025'), null);
});

test('date: invalid calendar date fails', () => {
  assert.equal(date('2025-02-30'), 'Data inexistente'); // Feb 30 doesn't exist
  assert.equal(date('2025-13-01'), 'Data inexistente'); // month 13
  assert.equal(date('31/02/2025'), 'Data inexistente');
});

test('date: wrong format fails', () => {
  assert.equal(date('2025/01/15'), 'Data inválida (use YYYY-MM-DD ou DD/MM/YYYY)');
});

// ===== hexColor =====

test('hexColor: valid formats pass', () => {
  assert.equal(hexColor('#fff'), null);
  assert.equal(hexColor('#ffffff'), null);
  assert.equal(hexColor('#ffffff80'), null);
});

test('hexColor: invalid fails', () => {
  assert.equal(hexColor('fff'), 'Cor hex inválida');
  assert.equal(hexColor('#ff'), 'Cor hex inválida');
});

// ===== match (cross-field) =====

test('match: equal values pass', () => {
  const rule = match('senha');
  assert.equal(rule('abc', { senha: 'abc' }), null);
});

test('match: different values fail', () => {
  const rule = match('senha');
  assert.equal(rule('abc', { senha: 'xyz' }), 'Deve ser igual a senha');
});

test('match: missing other field fails', () => {
  const rule = match('senha');
  assert.equal(rule('abc', {}), 'Deve ser igual a senha');
});

// ===== parseRules =====

test('parseRules: parses space-separated rules', () => {
  const parsed = parseRules('required email min:8');
  assert.equal(parsed.length, 3);
  assert.equal(parsed[0].name, 'required');
  assert.equal(parsed[1].name, 'email');
  assert.equal(parsed[2].name, 'min');
});

test('parseRules: parses match:otherField', () => {
  const parsed = parseRules('match:senha');
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].name, 'match');
});

test('parseRules: parses pattern:regex', () => {
  const parsed = parseRules('pattern:^\\d+$');
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].name, 'pattern');
});

test('parseRules: handles all rules', () => {
  const parsed = parseRules('required email url number integer alpha alnum phone-intl phone-br cpf cnpj credit-card date hex-color');
  assert.equal(parsed.length, 14);
});

// ===== runRules =====

test('runRules: returns first error', () => {
  const rules = parseRules('required email');
  assert.equal(runRules('', rules), 'Campo obrigatório');
  assert.equal(runRules('notanemail', rules), 'Email inválido');
  assert.equal(runRules('user@example.com', rules), null);
});

test('runRules: respects custom messages', () => {
  const rules = parseRules('required');
  const messages = { required: 'Por favor, preencha' };
  assert.equal(runRules('', rules, {}, messages), 'Por favor, preencha');
});

test('runRules: passes allValues to match rule', () => {
  const rules = parseRules('match:senha');
  assert.equal(runRules('abc', rules, { senha: 'abc' }), null);
  assert.equal(runRules('abc', rules, { senha: 'xyz' }), 'Deve ser igual a senha');
});
