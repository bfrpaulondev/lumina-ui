# LuminaUI — Forms & Inputs Guide

Complete guide to building forms with LuminaUI. All examples are copy-paste ready and work in vanilla HTML, React, Vue, or any framework.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Form](#basic-form)
- [Validation](#validation)
  - [Built-in Rules](#built-in-rules)
  - [Custom Messages](#custom-messages)
  - [Async Validation](#async-validation)
  - [Cross-field Validation](#cross-field-validation)
  - [Custom Validators](#custom-validators)
  - [Validation Timing](#validation-timing)
- [Masked Inputs](#masked-inputs)
  - [Built-in Masks](#built-in-masks)
  - [Custom Masks](#custom-masks)
  - [Formatters (currency, thousands, percent)](#formatters)
- [Floating Labels](#floating-labels)
- [Dynamic Forms (Form.List)](#dynamic-forms-formlist)
- [Autocomplete](#autocomplete)
- [Variant Inheritance](#variant-inheritance)
- [Micro-interactions](#micro-interactions)
- [API Reference](#api-reference)

---

## Quick Start

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/lumina-ui@latest/dist/lumina-ui.js';
</script>

<lumina-form>
  <lumina-form-field label="Name" required>
    <lumina-input slot="control" name="name" data-validate="required"></lumina-input>
  </lumina-form-field>
  <lumina-form-field label="Email" required>
    <lumina-input slot="control" name="email" data-validate="required email"></lumina-input>
  </lumina-form-field>
</lumina-form>
```

---

## Basic Form

Wrap your fields in `<lumina-form>`. Each field goes inside a `<lumina-form-field>` (for label/error UI) with the actual input in the `control` slot.

```html
<lumina-form id="my-form" validate-on="blur">
  <lumina-form-field label="Username" required hint="3-20 characters">
    <lumina-input
      slot="control"
      name="username"
      data-validate="required min:3 max:20 alnum"
      placeholder="Pick a username"
    ></lumina-input>
    <span slot="error"></span>
  </lumina-form-field>

  <lumina-form-field label="Password" required>
    <lumina-input
      slot="control"
      name="password"
      type="password"
      data-validate="required min:8"
      placeholder="At least 8 characters"
    ></lumina-input>
    <span slot="error"></span>
  </lumina-form-field>
</lumina-form>

<script type="module">
  const form = document.querySelector('#my-form');
  form.addEventListener('lumina-submit', (e) => {
    const { values, errors, valid } = e.detail;
    if (valid) {
      console.log('Submit!', values);
      // values = { username: '...', password: '...' }
    }
  });
</script>
```

---

## Validation

### Built-in Rules

Set rules via the `data-validate` attribute (space-separated):

| Rule | Description | Example |
|------|-------------|---------|
| `required` | Non-empty | `data-validate="required"` |
| `email` | Basic email regex | `data-validate="email"` |
| `url` | Valid http(s) URL | `data-validate="url"` |
| `min:N` | String length ≥ N, or number ≥ N | `data-validate="min:8"` |
| `max:N` | String length ≤ N, or number ≤ N | `data-validate="max:140"` |
| `pattern:regex` | Must match regex | `data-validate="pattern:^[A-Z]{3}$"` |
| `number` | Valid number | `data-validate="number"` |
| `integer` | Valid integer | `data-validate="integer"` |
| `alpha` | Only letters (incl. accents) | `data-validate="alpha"` |
| `alnum` | Only letters and numbers | `data-validate="alnum"` |
| `phone-intl` | E.164 format (+CC...) | `data-validate="phone-intl"` |
| `phone-br` | Brazilian phone with valid DDD | `data-validate="phone-br"` |
| `cpf` | CPF with real checksum | `data-validate="cpf"` |
| `cnpj` | CNPJ with real checksum | `data-validate="cnpj"` |
| `credit-card` | Luhn algorithm check | `data-validate="credit-card"` |
| `date` | ISO or BR date (calendar-aware) | `data-validate="date"` |
| `hex-color` | #RGB, #RRGGBB, #RRGGBBAA | `data-validate="hex-color"` |
| `match:otherName` | Must equal another field | `data-validate="match:password"` |

Combine rules: `data-validate="required email min:5"`

### Custom Messages

Override default messages with `data-msg-<rule>`:

```html
<lumina-input
  name="name"
  data-validate="required min:3"
  data-msg-required="Por favor, digite seu nome"
  data-msg-min="Nome muito curto (mínimo 3 caracteres)"
></lumina-input>
```

### Async Validation

For backend checks (e.g. "email already registered"):

```html
<lumina-form id="signup-form">
  <lumina-form-field label="Email" required>
    <lumina-input slot="control" name="email" data-validate="required email"></lumina-input>
  </lumina-form-field>
</lumina-form>

<script type="module">
  const form = document.querySelector('#signup-form');

  form.setAsyncValidator('email', async (value) => {
    const res = await fetch(`/api/check-email?email=${encodeURIComponent(value)}`);
    const data = await res.json();
    return data.exists ? 'Email already registered' : null;
  });

  form.addEventListener('lumina-submit', async (e) => {
    const { values, valid } = e.detail;
    // valid is false if any sync OR async validator failed
    if (valid) await fetch('/api/signup', { method: 'POST', body: JSON.stringify(values) });
  });
</script>
```

The field shows a `data-loading` attribute during the async check. You can also call `form.validateAsync()` to manually await all async validators.

### Cross-field Validation

Use `match:otherFieldName` to compare fields:

```html
<lumina-form-field label="Password">
  <lumina-input slot="control" name="password" data-validate="required min:8"></lumina-input>
</lumina-form-field>

<lumina-form-field label="Confirm Password">
  <lumina-input
    slot="control"
    name="confirm"
    data-validate="required match:password"
    data-msg-match="Passwords don't match"
  ></lumina-input>
</lumina-form-field>
```

### Custom Validators

For complex sync logic:

```js
form.setValidator('username', (value, allValues) => {
  if (value.toLowerCase() === 'admin') return 'Username reserved';
  if (allValues.role === 'guest' && value.length > 10) return 'Guest usernames max 10 chars';
  return null;
});
```

### Validation Timing

Set `validate-on` on `<lumina-form>`:

| Value | Behavior |
|-------|----------|
| `submit` (default) | Validates only on submit |
| `blur` | Validates each field on blur |
| `change` | Validates on every change (after first blur) |

```html
<lumina-form validate-on="blur">
  <!-- fields validate as user tabs away -->
</lumina-form>
```

You can also validate programmatically:

```js
const errors = form.validate();          // sync rules only
const allErrors = await form.validateAsync(); // sync + async
const fieldError = form.validateField('email'); // single field
form.setErrors({ email: 'Custom error' });
form.clearErrors();
form.clearFieldError('email');
```

---

## Masked Inputs

`<lumina-masked-input>` formats user input with a mask, while keeping a clean (unmasked) value separate.

```html
<lumina-masked-input
  name="cpf"
  mask="###.###.###-##"
  placeholder="000.000.000-00"
></lumina-masked-input>

<script>
  const input = document.querySelector('lumina-masked-input[name="cpf"]');
  input.addEventListener('lumina-change', (e) => {
    console.log(e.detail.value);           // "12345678900" (clean — send to server)
    console.log(e.detail.formattedValue);  // "123.456.789-00" (what user sees)
  });
  console.log(input.value);           // "12345678900"
  console.log(input.formattedValue);  // "123.456.789-00"
</script>
```

### Built-in Masks

Mask syntax:
- `#` → digit (0-9)
- `A` → letter (a-zA-Z)
- `?` → letter or digit
- `*` → any character
- Any other char → literal (inserted automatically)

| Use case | Mask string |
|----------|-------------|
| CPF | `###.###.###-##` |
| CNPJ | `##.###.###/####-##` |
| Phone BR | `(##) #####-####` |
| Credit card | `#### #### #### ####` |
| Date ISO | `####-##-##` |
| Date BR | `##/##/####` |
| ZIP BR | `#####-###` |

### Custom Masks

```html
<!-- Brazilian plate: ABC-1234 -->
<lumina-masked-input mask="AAA-####"></lumina-masked-input>

<!-- Time: HH:MM -->
<lumina-masked-input mask="##:##"></lumina-masked-input>
```

### Formatters

For non-mask formatting (currency, thousands, percent), use the `formatter` property:

```js
import { currencyFormatter, thousandsFormatter, percentFormatter } from 'lumina-ui/core/mask';

const salary = document.querySelector('[name="salary"]');
salary.formatter = currencyFormatter('R$', ',', '.');
// "1234.56" → "R$ 1.234,56"  /  parse: "R$ 1.234,56" → "1234.56"

const population = document.querySelector('[name="population"]');
population.formatter = thousandsFormatter('.');
// "1234567" → "1.234.567"

const tax = document.querySelector('[name="tax"]');
tax.formatter = percentFormatter();
// "15" → "15%"
```

---

## Floating Labels

Add `floating-label` to `<lumina-input>` or `<lumina-masked-input>` for a Material Design-style floating label:

```html
<lumina-input floating-label>
  <span slot="label">Email</span>
</lumina-input>

<lumina-masked-input floating-label mask="###.###.###-##">
  <span slot="label">CPF</span>
</lumina-masked-input>
```

The label sits inside the input, floats to the top on focus or when the field has a value. Smooth animation (top + font-size + color transitions).

---

## Dynamic Forms (Form.List)

`<lumina-form-list>` lets users add/remove/move groups of fields:

```html
<lumina-form-list id="phones" add-label="Add phone" movable max="5">
  <div data-lfl-item style="display:flex;gap:8px;align-items:center;">
    <lumina-masked-input
      name="phone[]"
      mask="(##) #####-####"
      placeholder="(00) 00000-0000"
      style="flex:1;"
    ></lumina-masked-input>
  </div>
</lumina-form-list>

<script>
  const list = document.querySelector('#phones');

  // Add an item programmatically
  document.querySelector('#add-btn').addEventListener('click', () => {
    list.addItem(`
      <div data-lfl-item style="display:flex;gap:8px;align-items:center;">
        <lumina-masked-input name="phone[]" mask="(##) #####-####" placeholder="(00) 00000-0000" style="flex:1;"></lumina-masked-input>
      </div>
    `);
  });

  list.addEventListener('lumina-add', (e) => console.log('Added', e.detail.index));
  list.addEventListener('lumina-remove', (e) => console.log('Removed', e.detail.index));
  list.addEventListener('lumina-move', (e) => console.log('Moved', e.detail.from, '→', e.detail.to));
  list.addEventListener('lumina-stack-change', (e) => console.log('Length', e.detail.length));
</script>
```

API:
- `addItem(template)` — accepts string, HTMLElement, or function
- `removeItem(index)` — with leave animation
- `moveItem(from, to)` — with FLIP animation
- `length` — current item count
- Attributes: `add-label`, `max`, `movable`

When `movable` is set, each item gets up/down/remove buttons automatically. Children stay in light DOM so inner inputs keep their state and validation wiring.

---

## Autocomplete

```html
<!-- Single select with async search -->
<lumina-autocomplete
  name="city"
  placeholder="Search city..."
  async-source="https://api.example.com/cities?q={q}"
></lumina-autocomplete>

<!-- Multi-select with tags -->
<lumina-autocomplete
  name="langs"
  multi
  memory-key="langs"
  placeholder="Pick languages..."
  suggestions='[
    {"value":"ts","label":"TypeScript"},
    {"value":"js","label":"JavaScript"},
    {"value":"py","label":"Python"}
  ]'
></lumina-autocomplete>

<script>
  // Or set async source as a function
  const ac = document.querySelector('lumina-autocomplete[name="city"]');
  ac.setAsyncSource(async (query) => {
    const res = await fetch(`/api/cities?q=${query}`);
    return res.json(); // [{ value, label, category? }]
  });

  ac.addEventListener('lumina-select', (e) => {
    console.log('Selected:', e.detail.value, e.detail.label);
  });
</script>
```

Features:
- **Local filter**: set `suggestions` attribute (JSON array)
- **Async search**: set `async-source` URL (with `{q}` placeholder) or `setAsyncSource(fn)`
- **Multi-select**: set `multi` attribute — selected items appear as removable tags
- **Virtualization**: only 30 items rendered at a time (handles 1000+ smoothly)
- **Keyboard nav**: up/down navigate, Enter select, Esc close, Backspace removes last tag
- **Memory**: set `memory-key` to remember recent selections (localStorage)
- **Debounce**: 250ms for async search

---

## Variant Inheritance

Set `variant`, `intensity`, `accent-color`, `theme`, or `speed` on `<lumina-form>` and ALL child Lumina components inherit them — unless they set their own explicit value:

```html
<!-- All fields become neural with pink accent -->
<lumina-form variant="neural" accent-color="#ff6ec7" intensity="extreme">
  <lumina-form-field label="Name">
    <lumina-input slot="control" name="name"></lumina-input>
    <!-- inherits variant="neural", accent-color="#ff6ec7", intensity="extreme" -->
  </lumina-form-field>

  <lumina-form-field label="Email">
    <lumina-input slot="control" name="email" variant="glass"></lumina-input>
    <!-- overrides: variant="glass", but still inherits accent-color and intensity -->
  </lumina-form-field>
</lumina-form>
```

This also works for dynamically added fields (Form.List items inherit the form's config when added).

---

## Micro-interactions

All form components include smooth transitions:

- **Focus**: glow ring + animated bar expanding
- **Error**: shake animation + red border + error message fades in (not abrupt)
- **Success**: green checkmark scales in + green border
- **Async**: loading spinner appears during backend checks
- All animations respect `prefers-reduced-motion: reduce`

---

## API Reference

### `<lumina-form>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `validate-on` | `"submit"` \| `"blur"` \| `"change"` | `"submit"` | When to validate |
| `variant`, `intensity`, `accent-color`, `theme`, `speed` | string | — | Inherited by all child Lumina components |

| Method | Returns | Description |
|--------|---------|-------------|
| `getValues()` | `FormValues` | All field values keyed by name |
| `validate()` | `FormErrors` | Run sync validators, returns errors |
| `validateAsync()` | `Promise<FormErrors>` | Run sync + async validators |
| `validateField(name)` | `string \| null` | Validate single field |
| `setErrors(errors)` | void | Mark fields invalid |
| `setFieldError(name, msg)` | void | Mark single field invalid |
| `clearErrors()` | void | Clear all errors |
| `clearFieldError(name)` | void | Clear single field |
| `setValidator(name, fn)` | void | Custom sync validator |
| `setAsyncValidator(name, fn)` | void | Custom async validator |

| Event | Detail |
|-------|--------|
| `lumina-submit` | `{ values, errors, valid }` |
| `lumina-reset` | `{}` |

### `<lumina-masked-input>`

| Attribute | Description |
|-----------|-------------|
| `mask` | Mask string (e.g. `###.###.###-##`) |
| `floating-label` | Enable floating label |
| `invalid`, `valid` | Validation states |
| `value` | Clean (unmasked) value |

| Property | Description |
|----------|-------------|
| `value` | Clean value (send to server) |
| `formattedValue` | What user sees |
| `formatter` | Custom `FormatterParser` (overrides mask) |
| `setCleanValue(s)` | Set value from clean string |
| `getCleanValue()` | Get clean value |

### `<lumina-form-list>`

| Attribute | Default | Description |
|-----------|---------|-------------|
| `add-label` | `"Adicionar"` | Add button text |
| `max` | `0` (unlimited) | Max items |
| `movable` | false | Show up/down/remove buttons |

| Method | Description |
|--------|-------------|
| `addItem(template)` | Add item (string/HTMLElement/fn) |
| `removeItem(index)` | Remove with animation |
| `moveItem(from, to)` | Move with FLIP |
| `length` | Current item count |

### `<lumina-autocomplete>`

| Attribute | Description |
|-----------|-------------|
| `suggestions` | JSON array of `{value, label, category?}` |
| `async-source` | URL with `{q}` placeholder |
| `multi` | Enable multi-select with tags |
| `memory-key` | localStorage key for recent items |
| `min-chars` | Min chars before search (default 1) |

| Method | Description |
|--------|-------------|
| `setAsyncSource(fn)` | Custom async search function |
| `value` | Single value or array (if multi) |

---

## Running Tests

```bash
npm test                # all tests
npm run test:mask       # mask engine only
npm run test:validation # validation rules only
```

74 tests covering: mask compilation, applyMask/unmask, all formatters (currency/thousands/percent), all 17 validation rules (required, email, url, min, max, pattern, number, integer, alpha, alnum, phone-intl, phone-br, cpf, cnpj, credit-card, date, hex-color, match), parseRules, runRules with custom messages.
