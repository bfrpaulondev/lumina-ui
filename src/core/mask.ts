/**
 * LuminaUI — Mask engine (zero-dependency).
 *
 * Mask syntax (inspired by vanilla text-mask):
 *   #  → digit (0-9)
 *   A  → letter (a-zA-Z)
 *   ?  → letter or digit
 *   *  → any character
 *   (any other char) → literal, inserted automatically and skipped on input.
 *
 * Examples:
 *   CPF:       '###.###.###-##'
 *   CNPJ:      '##.###.###/####-##'
 *   Phone BR:  '(##) #####-####'
 *   Credit card: '#### #### #### ####'
 *   Date ISO:  '####-##-##'
 *   ZIP BR:    '#####-###'
 *
 * The engine never touches the DOM — it's pure functions. Components
 * (lumina-masked-input, lumina-form) consume it to format/parse values.
 */

export type MaskChar = '#' | 'A' | '?' | '*';

/** A single mask slot: either a regex test (user input) or a literal. */
export interface MaskToken {
  type: 'input' | 'literal';
  char: string;
  test?: (ch: string) => boolean;
}

/** Compile a mask string into a list of tokens. */
export function compileMask(mask: string): MaskToken[] {
  const tokens: MaskToken[] = [];
  for (const char of mask) {
    switch (char) {
      case '#':
        tokens.push({ type: 'input', char, test: (c) => /\d/.test(c) });
        break;
      case 'A':
        tokens.push({ type: 'input', char, test: (c) => /[a-zA-Z]/.test(c) });
        break;
      case '?':
        tokens.push({ type: 'input', char, test: (c) => /[a-zA-Z0-9]/.test(c) });
        break;
      case '*':
        tokens.push({ type: 'input', char, test: () => true });
        break;
      default:
        tokens.push({ type: 'literal', char });
    }
  }
  return tokens;
}

/**
 * Apply a mask to a raw (clean) input string.
 * Returns:
 *   - formatted: the masked string (with literals)
 *   - clean:     the unmasked value (literals stripped)
 *   - cursor:    suggested cursor position after the last accepted char
 */
export function applyMask(
  raw: string,
  tokens: MaskToken[],
): { formatted: string; clean: string; cursor: number } {
  let formatted = '';
  let clean = '';
  let rawIdx = 0;
  let lastInputFormattedIdx = 0;
  for (let i = 0; i < tokens.length && rawIdx < raw.length; i++) {
    const tok = tokens[i];
    if (tok.type === 'literal') {
      formatted += tok.char;
      continue;
    }
    // Find the next raw char that passes the test
    while (rawIdx < raw.length) {
      const ch = raw[rawIdx];
      rawIdx += 1;
      if (tok.test!(ch)) {
        formatted += ch;
        clean += ch;
        lastInputFormattedIdx = formatted.length;
        break;
      }
    }
  }
  return { formatted, clean, cursor: lastInputFormattedIdx };
}

/**
 * Strip literals from a formatted string, returning only the user-typed chars.
 */
export function unmask(formatted: string, tokens: MaskToken[]): string {
  let clean = '';
  let fIdx = 0;
  for (const tok of tokens) {
    if (fIdx >= formatted.length) break;
    if (tok.type === 'literal') {
      fIdx += 1;
      continue;
    }
    const ch = formatted[fIdx];
    if (ch && tok.test!(ch)) clean += ch;
    fIdx += 1;
  }
  return clean;
}

/** Find the next input-token index at or after `from`. Returns -1 if none. */
export function nextInputIndex(tokens: MaskToken[], from: number): number {
  for (let i = from; i < tokens.length; i++) {
    if (tokens[i].type === 'input') return i;
  }
  return -1;
}

/**
 * Built-in formatters and parsers for common numeric masks.
 * A formatter converts a clean value into a display string; a parser does
 * the inverse. These are useful for big-number fields where you want to show
 * grouping separators (e.g. 1.234.567) while keeping the raw value numeric.
 */
export interface FormatterParser {
  format: (clean: string) => string;
  parse: (formatted: string) => string;
}

/** Group digits in threes with the given separator. e.g. '1234567' → '1.234.567'. */
export function thousandsFormatter(separator = '.'): FormatterParser {
  return {
    format: (clean) => {
      const digits = clean.replace(/\D/g, '');
      if (!digits) return '';
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    },
    parse: (formatted) => formatted.replace(/\D/g, ''),
  };
}

/** Currency formatter — prefixes symbol, groups thousands, fixed decimals. */
export function currencyFormatter(symbol = 'R$', decimal = ',', thousands = '.'): FormatterParser {
  return {
    format: (clean) => {
      const digits = clean.replace(/\D/g, '');
      if (!digits) return '';
      const padded = digits.padStart(3, '0');
      const intPart = padded.slice(0, -2);
      const decPart = padded.slice(-2);
      const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      return `${symbol} ${grouped}${decimal}${decPart}`;
    },
    parse: (formatted) => {
      // Remove symbol, thousands; replace decimal with '.'
      const cleaned = formatted
        .replace(new RegExp(`\\${symbol}\\s*`), '')
        .replace(new RegExp(`\\${thousands}`, 'g'), '')
        .replace(new RegExp(`\\${decimal}`), '.');
      return cleaned;
    },
  };
}

/** Percentage formatter — appends '%', parses back to clean number string. */
export function percentFormatter(): FormatterParser {
  return {
    format: (clean) => {
      const digits = clean.replace(/\D/g, '');
      if (!digits) return '';
      return `${digits}%`;
    },
    parse: (formatted) => formatted.replace(/[^\d]/g, ''),
  };
}

/** Common pre-compiled masks. */
export const MASKS = {
  cpf: compileMask('###.###.###-##'),
  cnpj: compileMask('##.###.###/####-##'),
  phoneBR: compileMask('(##) #####-####'),
  creditCard: compileMask('#### #### #### ####'),
  dateISO: compileMask('####-##-##'),
  dateBR: compileMask('##/##/####'),
  zipBR: compileMask('#####-###'),
} as const;
