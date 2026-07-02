/**
 * LuminaUI — Shared form-field CSS for all input components.
 *
 * Import `formFieldSharedStyles` and include it in your component's styles()
 * return value to get consistent:
 *   - floating-label animation (needs [data-lumina-root] + <slot name="label">)
 *   - invalid state (red border + shake)
 *   - valid state (green border)
 *   - disabled state (opacity + cursor)
 *   - prefers-reduced-motion handling
 *
 * The component is still responsible for:
 *   - Setting `data-lumina-root` on its root wrapper element
 *   - Adding a <slot name="label"></slot> when floating-label is enabled
 *   - Reflecting `invalid`, `valid`, `disabled`, `floating-label` attributes
 *   - Dispatching lumina-focus, lumina-blur, lumina-change events
 */

/**
 * Shared CSS string to include in component styles().
 * Provides floating-label, invalid/valid/disabled states, shake animation.
 */
export const formFieldSharedStyles = `
  /* Floating label — needs a [data-lumina-root] wrapper with a <slot name="label"> */
  :host([floating-label]) [data-lumina-root] { position: relative; }
  :host([floating-label]) [data-lumina-root] > ::slotted([slot="label"]),
  :host([floating-label]) [data-lumina-root] > [part="label"] {
    position: absolute;
    top: 50%;
    left: 14px;
    transform: translateY(-50%);
    z-index: 4;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    color: var(--lumina-text-muted);
    pointer-events: none;
    transition: top var(--lumina-speed) var(--lumina-ease-spring),
                font-size var(--lumina-speed) var(--lumina-ease-spring),
                color var(--lumina-speed) var(--lumina-ease-out);
    background: transparent;
    padding: 0 4px;
  }
  :host([floating-label]) [data-lumina-root]:focus-within > ::slotted([slot="label"]),
  :host([floating-label]) [data-lumina-root]:focus-within > [part="label"],
  :host([floating-label][data-has-value]) [data-lumina-root] > ::slotted([slot="label"]),
  :host([floating-label][data-has-value]) [data-lumina-root] > [part="label"] {
    top: 0;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--lumina-accent);
    transform: translateY(-50%) translateX(-2px);
  }

  /* Invalid state — red border + shake */
  :host([invalid]) [data-lumina-root] {
    animation: lumina-shake 0.4s var(--lumina-ease-spring);
  }
  :host([invalid]) [part="bg"], :host([invalid]) [part="control"] {
    border-color: rgb(255 70 90 / 0.6) !important;
    box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important;
  }

  /* Valid state — green border */
  :host([valid]) [part="bg"], :host([valid]) [part="control"] {
    border-color: rgb(34 197 94 / 0.5) !important;
  }

  /* Disabled state */
  :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }

  @keyframes lumina-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @media (prefers-reduced-motion: reduce) {
    :host([floating-label]) [data-lumina-root] > ::slotted([slot="label"]),
    :host([floating-label]) [data-lumina-root] > [part="label"],
    :host([invalid]) [data-lumina-root] { transition: none !important; animation: none !important; }
  }
`;
