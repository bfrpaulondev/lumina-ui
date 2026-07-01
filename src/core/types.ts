/**
 * LuminaUI — Core type system.
 *
 * Every Lumina component shares a common configuration surface so that
 * design tokens, motion intensity and visual variants stay consistent
 * across the whole library. Keep these literal unions in sync with the
 * attribute parsers in `LuminaElement`.
 */

/* ------------------------------------------------------------------ */
/* Shared configuration literals                                       */
/* ------------------------------------------------------------------ */

export type Variant =
  | 'glass'
  | 'morph'
  | 'neural'
  | 'void'
  | 'aura'
  | 'dimensional';

export type Intensity = 'subtle' | 'medium' | 'intense' | 'extreme';

export type Theme = 'light' | 'dark' | 'auto' | 'cosmic' | 'void';

export type AnimationTrigger =
  | 'hover'
  | 'click'
  | 'scroll'
  | 'focus'
  | 'proximity';

export type Depth = 'flat' | 'medium' | 'deep' | 'extrude';

/* ------------------------------------------------------------------ */
/* Shared configuration interface                                      */
/* ------------------------------------------------------------------ */

export interface LuminaConfig {
  variant: Variant;
  intensity: Intensity;
  theme: Theme;
  animationTrigger: AnimationTrigger;
  accentColor: string;
  speed: number;
  depth: Depth;
}

/* ------------------------------------------------------------------ */
/* Particle system types (used by aura / neural / void variants)       */
/* ------------------------------------------------------------------ */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export interface ParticleEmitterOptions {
  count: number;
  hueRange: [number, number];
  sizeRange: [number, number];
  speedRange: [number, number];
  lifeRange: [number, number];
  spread: number;
}

/* ------------------------------------------------------------------ */
/* Theme tokens                                                         */
/* ------------------------------------------------------------------ */

export interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceAlpha: string;
  text: string;
  textMuted: string;
  accent: string;
  accentRgb: string;
  border: string;
  glow: string;
  shadow: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Map of intensity → numeric multiplier (used to scale motion, particles, glow). */
export const INTENSITY_MULTIPLIERS: Record<Intensity, number> = {
  subtle: 0.4,
  medium: 0.7,
  intense: 1.0,
  extreme: 1.6,
};

/** Map of depth → numeric Z translate (px). */
export const DEPTH_PX: Record<Depth, number> = {
  flat: 0,
  medium: 14,
  deep: 32,
  extrude: 64,
};

/** Default shared config used when an attribute is omitted. */
export const DEFAULT_CONFIG: LuminaConfig = {
  variant: 'glass',
  intensity: 'medium',
  theme: 'auto',
  animationTrigger: 'hover',
  accentColor: '#7c5cff',
  speed: 0.5,
  depth: 'medium',
};
