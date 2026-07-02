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
    ParticleField.ts    # Reusable 2D particle renderer (rAF-driven)
  components/
    lumina-button.ts
    lumina-card.ts
    lumina-input.ts
    lumina-toggle.ts
    lumina-modal.ts
    lumina-navigation.ts
    lumina-progress.ts
    lumina-badge.ts
    lumina-tooltip.ts
    lumina-container.ts
  index.ts              # Public entry — registers all components
demo/                   # Showcase site (deployed to GH Pages)
index.html              # Demo entry HTML
.github/workflows/      # CI/CD: deploy to Pages on push to main
```

## License

MIT © Bruno Paulon
