/**
 * LuminaUI — Validation rules (zero-dependency, pure functions).
 *
 * Each rule is a function (value, allValues?) => string | null.
 * Returns null if valid, or an error message if invalid.
 *
 * Rules can be used standalone or via lumina-form's data-validate attribute.
 * Extracted to a pure module so they're testable without DOM.
 */

import type { FormValues } from '../components/lumina-form';

export type ValidationRule = (value: any, allValues?: FormValues) => string | null;

/** Required — value must be non-empty. */
export const required: ValidationRule = (value) => {
  if (value === null || value === undefined) return 'Campo obrigatório';
  if (typeof value === 'string' && !value.trim()) return 'Campo obrigatório';
  if (Array.isArray(value) && value.length === 0) return 'Campo obrigatório';
  return null;
};

/** Email — basic RFC-like check. */
export const email: ValidationRule = (value) => {
  if (!value) return null; // empty is OK unless combined with required
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) return 'Email inválido';
  return null;
};

/** URL — must be a valid http(s) URL. */
export const url: ValidationRule = (value) => {
  if (!value) return null;
  try {
    const u = new URL(String(value));
    if (!['http:', 'https:'].includes(u.protocol)) return 'URL deve ser http(s)';
    return null;
  } catch {
    return 'URL inválida';
  }
};

/** Minimum length (string) or minimum value (number). */
export function min(n: number): ValidationRule {
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') return value < n ? `Mínimo: ${n}` : null;
    return String(value).length < n ? `Mínimo de ${n} caracteres` : null;
  };
}

/** Maximum length (string) or maximum value (number). */
export function max(n: number): ValidationRule {
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') return value > n ? `Máximo: ${n}` : null;
    return String(value).length > n ? `Máximo de ${n} caracteres` : null;
  };
}

/** Pattern — value must match the given regex. */
export function pattern(re: RegExp, msg = 'Formato inválido'): ValidationRule {
  return (value) => {
    if (!value) return null;
    return re.test(String(value)) ? null : msg;
  };
}

/** Number — value must be a valid number. */
export const number: ValidationRule = (value) => {
  if (!value) return null;
  if (isNaN(Number(String(value).replace(/[.,\s]/g, '')))) return 'Deve ser um número';
  return null;
};

/** Integer — value must be a valid integer. */
export const integer: ValidationRule = (value) => {
  if (!value) return null;
  if (!/^-?\d+$/.test(String(value).trim())) return 'Deve ser um número inteiro';
  return null;
};

/** Alpha — only letters. */
export const alpha: ValidationRule = (value) => {
  if (!value) return null;
  return /^[a-zA-ZÀ-ÿ\s]+$/.test(String(value)) ? null : 'Apenas letras';
};

/** Alphanumeric — letters and numbers. */
export const alnum: ValidationRule = (value) => {
  if (!value) return null;
  return /^[a-zA-Z0-9]+$/.test(String(value)) ? null : 'Apenas letras e números';
};

/** Phone (international) — E.164 format: + CountryCode Number (7-15 digits total). */
export const phoneIntl: ValidationRule = (value) => {
  if (!value) return null;
  const clean = String(value).replace(/[\s\-().]/g, '');
  if (!/^\+\d{7,15}$/.test(clean)) return 'Telefone inválido (use +55 11 99999-9999)';
  return null;
};

/** Phone (Brazil) — accepts (11) 99999-9999 or 1199999999, validates area code 11-99. */
export const phoneBR: ValidationRule = (value) => {
  if (!value) return null;
  const clean = String(value).replace(/\D/g, '');
  if (clean.length !== 10 && clean.length !== 11) return 'Telefone inválido';
  const ddd = parseInt(clean.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) return 'DDD inválido';
  return null;
};

/** CPF — Brazilian individual ID, with real checksum validation. */
export const cpf: ValidationRule = (value) => {
  if (!value) return null;
  const clean = String(value).replace(/\D/g, '');
  if (clean.length !== 11) return 'CPF deve ter 11 dígitos';
  if (/^(\d)\1{10}$/.test(clean)) return 'CPF inválido';
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean[i], 10) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  if (rev !== parseInt(clean[9], 10)) return 'CPF inválido';
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean[i], 10) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  return rev === parseInt(clean[10], 10) ? null : 'CPF inválido';
};

/** CNPJ — Brazilian company ID, with real checksum validation. */
export const cnpj: ValidationRule = (value) => {
  if (!value) return null;
  const clean = String(value).replace(/\D/g, '');
  if (clean.length !== 14) return 'CNPJ deve ter 14 dígitos';
  if (/^(\d)\1{13}$/.test(clean)) return 'CNPJ inválido';
  const calc = (len: number): number => {
    const weights = len === 12 ? [5,4,3,2,9,8,7,6,5,4,3,2] : [6,5,4,3,2,9,8,7,6,5,4,3,2];
    let s = 0;
    for (let i = 0; i < len; i++) s += parseInt(clean[i], 10) * weights[i];
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  if (calc(12) !== parseInt(clean[12], 10)) return 'CNPJ inválido';
  if (calc(13) !== parseInt(clean[13], 10)) return 'CNPJ inválido';
  return null;
};

/** Credit card — Luhn algorithm check (works for Visa, Mastercard, Amex, etc.). */
export const creditCard: ValidationRule = (value) => {
  if (!value) return null;
  const clean = String(value).replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return 'Cartão inválido';
  // Luhn
  let sum = 0;
  let dbl = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let d = parseInt(clean[i], 10);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0 ? null : 'Cartão inválido';
};

/** Date — accepts ISO (YYYY-MM-DD) or BR (DD/MM/YYYY). Validates real calendar date. */
export const date: ValidationRule = (value) => {
  if (!value) return null;
  const s = String(value).trim();
  let y: number, m: number, d: number;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    [y, m, d] = s.split('-').map(Number);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    [d, m, y] = s.split('/').map(Number);
  } else {
    return 'Data inválida (use YYYY-MM-DD ou DD/MM/YYYY)';
  }
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return 'Data inexistente';
  }
  return null;
};

/** Hex color — #RGB, #RRGGBB, #RRGGBBAA. */
export const hexColor: ValidationRule = (value) => {
  if (!value) return null;
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(String(value)) ? null : 'Cor hex inválida';
};

/** Cross-field match — value must equal another field's value. */
export function match(otherName: string): ValidationRule {
  return (value, allValues = {}) => {
    if (value !== allValues[otherName]) return `Deve ser igual a ${otherName}`;
    return null;
  };
}

/**
 * Parse a data-validate string like "required email min:8 match:senha" into
 * a list of rule functions. Returns a list of { name, fn } pairs.
 */
export interface ParsedRule { name: string; fn: ValidationRule; }

export function parseRules(rulesStr: string): ParsedRule[] {
  const parts = rulesStr.split(/\s+/).filter(Boolean);
  const result: ParsedRule[] = [];
  for (const part of parts) {
    if (part === 'required') result.push({ name: 'required', fn: required });
    else if (part === 'email') result.push({ name: 'email', fn: email });
    else if (part === 'url') result.push({ name: 'url', fn: url });
    else if (part === 'number') result.push({ name: 'number', fn: number });
    else if (part === 'integer') result.push({ name: 'integer', fn: integer });
    else if (part === 'alpha') result.push({ name: 'alpha', fn: alpha });
    else if (part === 'alnum') result.push({ name: 'alnum', fn: alnum });
    else if (part === 'phone-intl') result.push({ name: 'phone-intl', fn: phoneIntl });
    else if (part === 'phone-br') result.push({ name: 'phone-br', fn: phoneBR });
    else if (part === 'cpf') result.push({ name: 'cpf', fn: cpf });
    else if (part === 'cnpj') result.push({ name: 'cnpj', fn: cnpj });
    else if (part === 'credit-card') result.push({ name: 'credit-card', fn: creditCard });
    else if (part === 'date') result.push({ name: 'date', fn: date });
    else if (part === 'hex-color') result.push({ name: 'hex-color', fn: hexColor });
    else if (part.startsWith('min:')) result.push({ name: 'min', fn: min(parseFloat(part.slice(4))) });
    else if (part.startsWith('max:')) result.push({ name: 'max', fn: max(parseFloat(part.slice(4))) });
    else if (part.startsWith('pattern:')) {
      const reStr = part.slice(8);
      // Use a safe regex constructor — pattern:regex where regex has no flags
      try {
        const re = new RegExp(reStr);
        result.push({ name: 'pattern', fn: pattern(re) });
      } catch {
        // Invalid regex — skip
      }
    } else if (part.startsWith('match:')) result.push({ name: 'match', fn: match(part.slice(6)) });
  }
  return result;
}

/**
 * Run a list of rules against a value. Returns the first error message, or null.
 * Custom messages can override defaults via the messages map keyed by rule name.
 */
export function runRules(
  value: any,
  rules: ParsedRule[],
  allValues: FormValues = {},
  messages: Record<string, string> = {},
): string | null {
  for (const { name, fn } of rules) {
    const err = fn(value, allValues);
    if (err) return messages[name] ?? err;
  }
  return null;
}
