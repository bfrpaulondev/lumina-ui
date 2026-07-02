# LuminaUI

> Revolutionary futuristic Web Components library — vanilla TypeScript, no frameworks.

A library of **Web Components** (Custom Elements + Shadow DOM) that delivers **living, morphable, adaptive** interfaces by combining extreme visual aesthetics with physical and contextual interactions.

## Why LuminaUI?

- **True Web Components** — Custom Elements + Shadow DOM. Works with any framework (React, Vue, Svelte) or no framework at all.
- **Zero runtime deps** — Just HTML, CSS, TypeScript. The full bundle is ~20kb gzipped.
- **Six variants** per component — `glass`, `morph`, `neural`, `void`, `aura`, `dimensional`.
- **Advanced motion** — Web Animations API, scroll-driven, FLIP technique, GPU-friendly transforms.
- **A11y by default** — ARIA, focus management, `prefers-reduced-motion` everywhere.
- **Customizable** — All visual tokens are CSS variables. Configure via attributes or properties.

## Components

The library ships **100+ Web Components** across 8 categories (Buttons, Cards, Inputs, Navigation, Feedback, Overlays, Data Display, Unique). The original MVP components below are the most battle-tested; the rest are documented in the live playground.

**MVP (core, stable):**

| # | Component          | Highlights                                                    |
|---|--------------------|---------------------------------------------------------------|
| 1 | `lumina-button`    | 6 variants, particle burst on click, conic spinning ring      |
| 2 | `lumina-card`      | Glass + 3D tilt + cursor-following glow + particle fields     |
| 3 | `lumina-input`     | Echo ripple on keystroke, neural field on focus, FLIP shake   |
| 4 | `lumina-toggle`    | Aura ring, particle shower on toggle, morph knob              |
| 5 | `lumina-modal`     | Portal burst open/close, focus trap, Esc to close             |
| 6 | `lumina-navigation`| FLIP-animated active indicator, proximity glow                |
| 7 | `lumina-progress`  | Organic particle trail head, shimmer, indeterminate mode      |
| 8 | `lumina-badge`     | Pulsing halo, float loop, morph clip-path                     |
| 9 | `lumina-tooltip`   | Smart auto-flip positioning, directional arrow, glow          |
|10 | `lumina-container` | Adaptive wrapper that broadcasts context to Lumina children   |

## Quick start

```html
<!doctype html>
<html>
  <head>
    <!-- Stable library bundle (no hash, versioned via the v0.3.x line). -->
    <script src="https://bfrpaulondev.github.io/lumina-ui/lumina-ui.js"></script>
  </head>
  <body>
    <lumina-button variant="dimensional" intensity="intense" accent-color="#7c5cff">
      Click me
    </lumina-button>
  </body>
</html>
```

> **Note:** do **not** load the `assets/main-<hash>.js` bundle from the playground — that is the SPA demo (it logs to the console, mounts a router, and pulls in Monaco). The file above is the lib-only bundle.

Or as a library:

```bash
npm install lumina-ui
```

```ts
import 'lumina-ui'; // registers all custom elements
```

## Shared configuration

Every component accepts these attributes:

| Attribute           | Values                                             | Default     |
|---------------------|----------------------------------------------------|-------------|
| `variant`           | `glass` \| `morph` \| `neural` \| `void` \| `aura` \| `dimensional` | `glass`     |
| `intensity`         | `subtle` \| `medium` \| `intense` \| `extreme`     | `medium`    |
| `theme`             | `light` \| `dark` \| `auto` \| `cosmic` \| `void`  | `auto`      |
| `animation-trigger` | `hover` \| `click` \| `scroll` \| `focus` \| `proximity` | `hover`     |
| `accent-color`      | any CSS color (hex, hsl, rgb)                      | `#7c5cff`   |
| `speed`             | number (seconds)                                   | `0.5`       |
| `depth`             | `flat` \| `medium` \| `deep` \| `extrude`          | `medium`    |

## Form-associated components

`lumina-input`, `lumina-textarea`, `lumina-checkbox`, `lumina-switch` and `lumina-select` extend a shared `LuminaFormElement` base class that implements the [Element Internals API](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals). They work inside native `<form>` elements out of the box:

```html
<form id="myform">
  <lumina-input  name="email"    label="E-mail"    required></lumina-input>
  <lumina-select name="country" value="BR"
                options='[{"value":"BR","label":"Brasil"},{"value":"PT","label":"Portugal"}]'></lumina-select>
  <lumina-checkbox name="accept" value="yes" checked></lumina-checkbox>
  <lumina-switch   name="newsletter"></lumina-switch>
  <button type="submit">Send</button>
</form>

<script>
  document.getElementById('myform').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    console.log(Object.fromEntries(fd));
    // → { email: '...', country: 'BR', accept: 'yes', newsletter: 'on' }
  });
</script>
```

`formResetCallback` and `formStateRestoreCallback` are wired, so `<button type="reset">` and browser back/forward navigation restore the initial values automatically.

## Component API (MVP)

Each component dispatches events prefixed with `lumina-` and exposes named slots where noted. All events bubble and cross shadow boundaries (`composed: true`).

| Component           | Slots                                  | Events dispatched                              |
|---------------------|----------------------------------------|------------------------------------------------|
| `lumina-button`     | (default — button label)               | `lumina-click`                                 |
| `lumina-card`       | (default — body), `header`, `footer`   | `lumina-hover` (proximity)                     |
| `lumina-input`      | `label`                                | `lumina-focus`, `lumina-blur`, `lumina-change`, `lumina-submit` |
| `lumina-textarea`   | `label`                                | `lumina-focus`, `lumina-blur`, `lumina-input`, `lumina-change`  |
| `lumina-checkbox`   | (default — label text)                 | `lumina-focus`, `lumina-blur`, `lumina-change`  |
| `lumina-switch`     | (default — label text)                 | `lumina-focus`, `lumina-blur`, `lumina-change`  |
| `lumina-select`     | (default — trigger label)              | `lumina-focus`, `lumina-blur`, `lumina-change`, `lumina-open`, `lumina-close` |
| `lumina-toggle`     | (default — label text)                 | `lumina-change`                                 |
| `lumina-modal`      | (default — body), `title`, `footer`    | `lumina-open`, `lumina-close`                   |
| `lumina-navigation` | `link` (repeated)                      | `lumina-navigate` (detail: `{ href }`)          |
| `lumina-progress`   | (none)                                 | `lumina-complete` (when value reaches max)      |
| `lumina-badge`      | (default — badge text)                 | (none)                                          |
| `lumina-tooltip`    | (default — trigger element)            | `lumina-tooltip-show`, `lumina-tooltip-hide`    |
| `lumina-container`  | (default — children)                   | `lumina-context` (broadcasts context to children) |

### `lumina-modal` — boolean `open` attribute

The `open` attribute is a [boolean HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#boolean_attributes): its **presence** means "open", regardless of the value string. To keep the modal closed on initial render, simply omit the attribute:

```html
<!-- Closed (default) -->
<lumina-modal id="m"></lumina-modal>

<!-- Open on load -->
<lumina-modal open></lumina-modal>

<!-- ALSO closed (treats literal "false" as closed, as a courtesy) -->
<lumina-modal open="false"></lumina-modal>

<script>
  document.getElementById('m').showModal();    // open via JS
  document.getElementById('m').close();         // close via JS
</script>
```

## Demo

Live showcase: **https://bfrpaulondev.github.io/lumina-ui/**

## Project structure

```
src/
  core/
    types.ts            # Shared types & literals
    tokens.ts           # Design tokens + constructible stylesheet
    utils.ts            # Color parsing, particle helpers, throttle
    LuminaElement.ts    # Base class — shadow DOM, attribute parsing
    LuminaFormElement.ts # Form-associated base (ElementInternals)
    ParticleField.ts    # Reusable 2D particle renderer (rAF-driven)
    form-field-mixin.ts # Shared CSS for invalid/valid/floating-label
  components/
    lumina-button.ts
    lumina-card.ts
    lumina-input.ts
    lumina-textarea.ts
    lumina-checkbox.ts
    lumina-switch.ts
    lumina-select.ts
    lumina-toggle.ts
    lumina-modal.ts
    lumina-navigation.ts
    lumina-progress.ts
    lumina-badge.ts
    lumina-tooltip.ts
    lumina-container.ts
    … (100+ total)
  index.ts              # Public entry — registers all components
demo/                   # Showcase site (deployed to GH Pages)
index.html              # Demo entry HTML
.github/workflows/      # CI/CD: deploy to Pages on push to main
```

## License

MIT © Bruno Paulon
