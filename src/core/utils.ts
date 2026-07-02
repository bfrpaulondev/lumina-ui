/**
 * LuminaUI — Internal utilities.
 */

import type {
  AnimationTrigger,
  Depth,
  Intensity,
  Theme,
  Variant,
} from './types';
import {
  DEPTH_PX,
  INTENSITY_MULTIPLIERS,
} from './types';

/* ------------------------------------------------------------------ */
/* Color parsing & conversion                                          */
/* ------------------------------------------------------------------ */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Parse any CSS color (hex / rgb / rgba / hsl / hsla) into RGB components. */
export function parseColor(input: string): RgbColor {
  const fallback: RgbColor = { r: 124, g: 92, b: 255, a: 1 };

  if (typeof document === 'undefined') return fallback;

  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return fallback;
  ctx.fillStyle = '#000';
  ctx.fillStyle = input;
  const computed = ctx.fillStyle as string;

  // Hex form
  if (computed.startsWith('#')) {
    const hex = computed.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b, a: 1 };
  }
  // rgb()/rgba() form
  const m = computed.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const parts = m[1].split(',').map((s) => s.trim());
    return {
      r: parseFloat(parts[0]),
      g: parseFloat(parts[1]),
      b: parseFloat(parts[2]),
      a: parts.length === 4 ? parseFloat(parts[3]) : 1,
    };
  }
  return fallback;
}

/** Format an RGB color as space-separated rgb() (best for `rgb(r g b / a)` syntax). */
export function rgbToString(c: RgbColor, alpha = c.a): string {
  return `rgb(${c.r} ${c.g} ${c.b} / ${alpha})`;
}

/** Convert hex/hsl/rgb to a "r g b" triplet suitable for `rgb(... / a)` composition. */
export function toRgbTriplet(input: string): string {
  const c = parseColor(input);
  return `${c.r} ${c.g} ${c.b}`;
}

/* ------------------------------------------------------------------ */
/* Numeric / dimension helpers                                         */
/* ------------------------------------------------------------------ */

/** Resolve a `depth` literal to its pixel translate. */
export function depthToPx(depth: Depth): number {
  return DEPTH_PX[depth];
}

/** Resolve an `intensity` literal to its numeric multiplier (0..2). */
export function intensityToMultiplier(intensity: Intensity): number {
  return INTENSITY_MULTIPLIERS[intensity];
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Random float in [min, max). */
export function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/* ------------------------------------------------------------------ */
/* DOM helpers                                                         */
/* ------------------------------------------------------------------ */

/** Type-narrow `querySelector` for the shadow root. */
export function qs<T extends Element = Element>(
  root: ShadowRoot | Element | Document,
  selector: string,
): T | null {
  return root.querySelector<T>(selector);
}

/** Build a `<canvas>` element pre-sized for HiDPI displays. */
export function createHiDPICanvas(
  width: number,
  height: number,
  dpr = window.devicePixelRatio || 1,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(dpr, dpr);
  return canvas;
}

/* ------------------------------------------------------------------ */
/* Attribute coercion                                                 */
/* ------------------------------------------------------------------ */

/** Coerce a raw attribute string into a typed value, with a fallback. */
export function coerceAttr<T extends string>(
  raw: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  if (raw === null) return fallback;
  return (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;
}

export const VARIANT_VALUES = [
  'glass',
  'morph',
  'neural',
  'void',
  'aura',
  'dimensional',
] as const satisfies readonly Variant[];

export const INTENSITY_VALUES = [
  'subtle',
  'medium',
  'intense',
  'extreme',
] as const satisfies readonly Intensity[];

export const THEME_VALUES = [
  'light',
  'dark',
  'auto',
  'cosmic',
  'void',
] as const satisfies readonly Theme[];

export const TRIGGER_VALUES = [
  'hover',
  'click',
  'scroll',
  'focus',
  'proximity',
] as const satisfies readonly AnimationTrigger[];

export const DEPTH_VALUES = [
  'flat',
  'medium',
  'deep',
  'extrude',
] as const satisfies readonly Depth[];

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

/** Returns true if the user prefers reduced motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Throttle a function to fire at most once per `wait` ms (trailing edge). */
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  wait = 16,
): (...args: A) => void {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: A) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}

/** Build a CSS easing string for a spring-like motion given `speed`. */
export function springEase(speed: number): string {
  // Slower speeds feel more elastic; faster speeds feel snappier.
  return speed <= 0.3
    ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    : 'cubic-bezier(0.22, 1, 0.36, 1)';
}
