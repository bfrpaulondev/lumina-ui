/**
 * LuminaUI — Design tokens.
 *
 * The tokens are exposed as a single constructible stylesheet so every
 * component registers the same CSS custom-properties in its Shadow DOM
 * without duplicating strings. Components consume these via `var(--lumina-*)`
 * and may locally override them through attributes (accent-color, intensity,
 * depth, speed).
 */

import type { Theme, ThemeTokens } from './types';

/* ------------------------------------------------------------------ */
/* Raw token map. Values are CSS strings; alpha channels use space-    */
/* separated rgb() so they can be composed at runtime.                 */
/* ------------------------------------------------------------------ */

export const TOKENS = {
  /* Geometry */
  radiusSm: '8px',
  radiusMd: '14px',
  radiusLg: '22px',
  radiusXl: '34px',
  radiusPill: '999px',

  /* Motion */
  easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',

  /* Base typography */
  fontSans:
    "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'SF Mono', 'Fira Code', ui-monospace, monospace",

  /* Light theme surface */
  lightBg: '#f3f4fb',
  lightSurface: '255 255 255',
  lightSurfaceAlpha: '0.55',
  lightText: '#0d0b1f',
  lightTextMuted: 'rgba(13, 11, 31, 0.55)',
  lightBorder: 'rgba(13, 11, 31, 0.10)',
  lightGlow: 'rgba(124, 92, 255, 0.35)',
  lightShadow: '0 10px 30px -10px rgba(13, 11, 31, 0.18)',

  /* Dark theme surface */
  darkBg: '#06060c',
  darkSurface: '18 18 32',
  darkSurfaceAlpha: '0.55',
  darkText: '#f5f5ff',
  darkTextMuted: 'rgba(245, 245, 255, 0.55)',
  darkBorder: 'rgba(255, 255, 255, 0.08)',
  darkGlow: 'rgba(124, 92, 255, 0.45)',
  darkShadow: '0 20px 60px -20px rgba(0, 0, 0, 0.7)',

  /* Cosmic theme (purple / magenta / cyan aurora) */
  cosmicBg: '#0a0420',
  cosmicSurface: '40 18 78',
  cosmicSurfaceAlpha: '0.55',
  cosmicText: '#f0e6ff',
  cosmicTextMuted: 'rgba(240, 230, 255, 0.55)',
  cosmicBorder: 'rgba(200, 130, 255, 0.18)',
  cosmicGlow: 'rgba(180, 120, 255, 0.55)',
  cosmicShadow: '0 20px 60px -20px rgba(80, 20, 120, 0.7)',

  /* Void theme (deep black / chromatic aberration) */
  voidBg: '#000000',
  voidSurface: '12 12 18',
  voidSurfaceAlpha: '0.5',
  voidText: '#e8e8f5',
  voidTextMuted: 'rgba(232, 232, 245, 0.5)',
  voidBorder: 'rgba(255, 255, 255, 0.06)',
  voidGlow: 'rgba(120, 240, 255, 0.45)',
  voidShadow: '0 20px 60px -20px rgba(0, 0, 0, 0.9)',
} as const;

/* ------------------------------------------------------------------ */
/* Theme resolution                                                    */
/* ------------------------------------------------------------------ */

const themeMap: Record<Exclude<Theme, 'auto'>, ThemeTokens> = {
  light: {
    bg: TOKENS.lightBg,
    surface: TOKENS.lightSurface,
    surfaceAlpha: TOKENS.lightSurfaceAlpha,
    text: TOKENS.lightText,
    textMuted: TOKENS.lightTextMuted,
    accent: '#7c5cff',
    accentRgb: '124 92 255',
    border: TOKENS.lightBorder,
    glow: TOKENS.lightGlow,
    shadow: TOKENS.lightShadow,
  },
  dark: {
    bg: TOKENS.darkBg,
    surface: TOKENS.darkSurface,
    surfaceAlpha: TOKENS.darkSurfaceAlpha,
    text: TOKENS.darkText,
    textMuted: TOKENS.darkTextMuted,
    accent: '#7c5cff',
    accentRgb: '124 92 255',
    border: TOKENS.darkBorder,
    glow: TOKENS.darkGlow,
    shadow: TOKENS.darkShadow,
  },
  cosmic: {
    bg: TOKENS.cosmicBg,
    surface: TOKENS.cosmicSurface,
    surfaceAlpha: TOKENS.cosmicSurfaceAlpha,
    text: TOKENS.cosmicText,
    textMuted: TOKENS.cosmicTextMuted,
    accent: '#b478ff',
    accentRgb: '180 120 255',
    border: TOKENS.cosmicBorder,
    glow: TOKENS.cosmicGlow,
    shadow: TOKENS.cosmicShadow,
  },
  void: {
    bg: TOKENS.voidBg,
    surface: TOKENS.voidSurface,
    surfaceAlpha: TOKENS.voidSurfaceAlpha,
    text: TOKENS.voidText,
    textMuted: TOKENS.voidTextMuted,
    accent: '#78f0ff',
    accentRgb: '120 240 255',
    border: TOKENS.voidBorder,
    glow: TOKENS.voidGlow,
    shadow: TOKENS.voidShadow,
  },
};

/** Resolve a `theme` value to a concrete token set (handles `auto` via prefers-color-scheme). */
export function resolveTheme(theme: Theme): ThemeTokens {
  if (theme === 'auto') {
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return themeMap[prefersDark ? 'dark' : 'light'];
  }
  return themeMap[theme];
}

/* ------------------------------------------------------------------ */
/* Shared base stylesheet (constructible)                              */
/* ------------------------------------------------------------------ */

/**
 * Returns a CSSStyleSheet that registers base Lumina custom properties
 * on the `:host` of every component. Constructible stylesheets are
 * deduplicated across components in supporting browsers and fall back
 * to inline adoption via CSSOM in older engines.
 */
export function buildBaseStylesheet(): CSSStyleSheet {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`
    :host {
      /* Geometry */
      --lumina-radius-sm: ${TOKENS.radiusSm};
      --lumina-radius-md: ${TOKENS.radiusMd};
      --lumina-radius-lg: ${TOKENS.radiusLg};
      --lumina-radius-xl: ${TOKENS.radiusXl};
      --lumina-radius-pill: ${TOKENS.radiusPill};

      /* Motion */
      --lumina-ease-spring: ${TOKENS.easeSpring};
      --lumina-ease-out: ${TOKENS.easeOut};
      --lumina-ease-in-out: ${TOKENS.easeInOut};

      /* Typography */
      --lumina-font-sans: ${TOKENS.fontSans};
      --lumina-font-mono: ${TOKENS.fontMono};

      /* Theme tokens (default to dark; components override in applyTheme) */
      --lumina-bg: ${TOKENS.darkBg};
      --lumina-surface: ${TOKENS.darkSurface};
      --lumina-surface-alpha: ${TOKENS.darkSurfaceAlpha};
      --lumina-text: ${TOKENS.darkText};
      --lumina-text-muted: ${TOKENS.darkTextMuted};
      --lumina-accent: #7c5cff;
      --lumina-accent-rgb: 124 92 255;
      --lumina-border: ${TOKENS.darkBorder};
      --lumina-glow: ${TOKENS.darkGlow};
      --lumina-shadow: ${TOKENS.darkShadow};

      /* Component-local overrides (set by attributes) */
      --lumina-variant: glass;
      --lumina-intensity: 0.7;
      --lumina-depth: 14px;
      --lumina-speed: 0.5s;

      box-sizing: border-box;
      font-family: var(--lumina-font-sans);
      color: var(--lumina-text);
      display: block;
    }

    :host([hidden]) { display: none !important; }

    *, *::before, *::after { box-sizing: border-box; }

    @media (prefers-reduced-motion: reduce) {
      :host {
        --lumina-speed: 0.001s !important;
      }
    }
  `);
  return sheet;
}
