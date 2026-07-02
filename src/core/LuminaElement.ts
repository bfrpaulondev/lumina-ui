/**
 * LuminaUI — Base class for every Lumina component.
 *
 * `LuminaElement` wires up the Shadow DOM, registers the shared design
 * tokens, parses the common attributes (variant, intensity, theme,
 * animation-trigger, accent-color, speed, depth) into CSS custom
 * properties, and exposes a typed property API for each of them.
 *
 * Concrete components extend `LuminaElement` and implement `render()`
 * to declare their internal markup plus `styles()` for any
 * component-specific CSS.
 */

import { buildBaseStylesheet, resolveTheme } from './tokens';
import type {
  AnimationTrigger,
  Depth,
  Intensity,
  Theme,
  Variant,
} from './types';
import {
  coerceAttr,
  DEPTH_VALUES,
  depthToPx,
  INTENSITY_VALUES,
  intensityToMultiplier,
  THEME_VALUES,
  toRgbTriplet,
  TRIGGER_VALUES,
  VARIANT_VALUES,
} from './utils';

export interface LuminaElementAttributes {
  variant: Variant;
  intensity: Intensity;
  theme: Theme;
  'animation-trigger': AnimationTrigger;
  'accent-color': string;
  speed: number;
  depth: Depth;
}

export abstract class LuminaElement extends HTMLElement {
  /* ---------------------------------------------------------------- */
  /* Static registry                                                  */
  /* ---------------------------------------------------------------- */

  static baseStyles: CSSStyleSheet = buildBaseStylesheet();

  /* ---------------------------------------------------------------- */
  /* Internal state                                                   */
  /* ---------------------------------------------------------------- */

  protected shadow: ShadowRoot;
  protected _mounted = false;
  private _mutationObserver: MutationObserver | null = null;
  private _themeMedia?: MediaQueryList;

  /* ---------------------------------------------------------------- */
  /* Common typed properties                                          */
  /* ---------------------------------------------------------------- */

  private _variant: Variant = 'glass';
  private _intensity: Intensity = 'medium';
  private _theme: Theme = 'auto';
  private _trigger: AnimationTrigger = 'hover';
  private _accent: string = '#7c5cff';
  private _speed: number = 0.5;
  private _depth: Depth = 'medium';

  /** Reflects the `variant` attribute. */
  get variant(): Variant {
    return this._variant;
  }
  set variant(v: Variant) {
    this._variant = v;
    this.setAttribute('variant', v);
  }

  /** Reflects the `intensity` attribute. */
  get intensity(): Intensity {
    return this._intensity;
  }
  set intensity(v: Intensity) {
    this._intensity = v;
    this.setAttribute('intensity', v);
  }

  /** Reflects the `theme` attribute. */
  get theme(): Theme {
    return this._theme;
  }
  set theme(v: Theme) {
    this._theme = v;
    this.setAttribute('theme', v);
  }

  /** Reflects the `animation-trigger` attribute. */
  get animationTrigger(): AnimationTrigger {
    return this._trigger;
  }
  set animationTrigger(v: AnimationTrigger) {
    this._trigger = v;
    this.setAttribute('animation-trigger', v);
  }

  /** Reflects the `accent-color` attribute. */
  get accentColor(): string {
    return this._accent;
  }
  set accentColor(v: string) {
    this._accent = v;
    this.setAttribute('accent-color', v);
  }

  /** Reflects the `speed` attribute (seconds). */
  get speed(): number {
    return this._speed;
  }
  set speed(v: number) {
    this._speed = v;
    this.setAttribute('speed', String(v));
  }

  /** Reflects the `depth` attribute. */
  get depth(): Depth {
    return this._depth;
  }
  set depth(v: Depth) {
    this._depth = v;
    this.setAttribute('depth', v);
  }

  /* ---------------------------------------------------------------- */
  /* Lifecycle                                                        */
  /* ---------------------------------------------------------------- */

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    // Build the base sheet once per class (browsers dedupe CSSStyleSheet
    // instances when adopted via adoptedStyleSheets).
    this.shadow.adoptedStyleSheets = [LuminaElement.baseStyles];
  }

  connectedCallback(): void {
    this._parseAttributes();

    // Adopt the base stylesheet + the component's own styles. Components
    // return their stylesheet from `styles()` (cached on the class).
    const componentSheet = this._ensureComponentStyles();
    this.shadow.adoptedStyleSheets = [
      LuminaElement.baseStyles,
      componentSheet,
    ];

    // Render initial markup.
    this.shadow.innerHTML = this.render();

    // Hook into system theme changes when in `auto` mode.
    if (this._theme === 'auto' && typeof window !== 'undefined') {
      this._themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
      this._themeMedia.addEventListener('change', this._onThemeMediaChange);
    }

    // Watch attribute mutations while connected.
    this._mutationObserver = new MutationObserver(this._onMutation);
    this._mutationObserver.observe(this, { attributes: true });

    this.applyTheme();
    this.applyConfigTokens();

    this._mounted = true;
    this.mounted();
  }

  disconnectedCallback(): void {
    this._mounted = false;
    this._mutationObserver?.disconnect();
    this._mutationObserver = null;
    if (this._themeMedia) {
      this._themeMedia.removeEventListener('change', this._onThemeMediaChange);
      this._themeMedia = undefined;
    }
    this.unmounted();
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    if (!_old || _old === value) return;
    this._applyAttribute(name, value);
  }

  /* ---------------------------------------------------------------- */
  /* Hooks for subclasses                                             */
  /* ---------------------------------------------------------------- */

  /** Subclasses return their inner HTML markup. */
  protected abstract render(): string;

  /** Subclasses return their component-specific CSS as a string. */
  protected abstract styles(): string;

  /** Called after the first render (shadow root is populated). */
  protected mounted(): void {}

  /** Called before the element is removed from the DOM. */
  protected unmounted(): void {}

  /** Called whenever a shared attribute changes after mount. */
  protected onConfigChange(_changed: Partial<LuminaElementAttributes>): void {}

  /* ---------------------------------------------------------------- */
  /* Attribute plumbing                                               */
  /* ---------------------------------------------------------------- */

  // Note: we still need `observedAttributes` for `attributeChangedCallback`.
  static get observedAttributes(): string[] {
    return [
      'variant',
      'intensity',
      'theme',
      'animation-trigger',
      'accent-color',
      'speed',
      'depth',
    ];
  }

  private _onMutation = (mutations: MutationRecord[]): void => {
    for (const m of mutations) {
      if (m.type === 'attributes') {
        this._applyAttribute(m.attributeName!, this.getAttribute(m.attributeName!));
      }
    }
  };

  private _parseAttributes(): void {
    this._variant = coerceAttr(
      this.getAttribute('variant'),
      VARIANT_VALUES,
      'glass',
    );
    this._intensity = coerceAttr(
      this.getAttribute('intensity'),
      INTENSITY_VALUES,
      'medium',
    );
    this._theme = coerceAttr(
      this.getAttribute('theme'),
      THEME_VALUES,
      'auto',
    );
    this._trigger = coerceAttr(
      this.getAttribute('animation-trigger'),
      TRIGGER_VALUES,
      'hover',
    );
    this._accent = this.getAttribute('accent-color') ?? '#7c5cff';
    this._speed = parseFloat(this.getAttribute('speed') ?? '0.5') || 0.5;
    this._depth = coerceAttr(
      this.getAttribute('depth'),
      DEPTH_VALUES,
      'medium',
    );
  }

  private _applyAttribute(name: string, value: string | null): void {
    const prev: Partial<LuminaElementAttributes> = {};
    switch (name) {
      case 'variant':
        this._variant = coerceAttr(value, VARIANT_VALUES, 'glass');
        prev.variant = this._variant;
        break;
      case 'intensity':
        this._intensity = coerceAttr(value, INTENSITY_VALUES, 'medium');
        prev.intensity = this._intensity;
        break;
      case 'theme':
        this._theme = coerceAttr(value, THEME_VALUES, 'auto');
        prev.theme = this._theme;
        // Re-bind the media query listener when toggling into/out of auto.
        this._rebindThemeMedia();
        this.applyTheme();
        break;
      case 'animation-trigger':
        this._trigger = coerceAttr(value, TRIGGER_VALUES, 'hover');
        prev['animation-trigger'] = this._trigger;
        break;
      case 'accent-color':
        this._accent = value ?? '#7c5cff';
        prev['accent-color'] = this._accent;
        break;
      case 'speed':
        this._speed = parseFloat(value ?? '0.5') || 0.5;
        prev.speed = this._speed;
        break;
      case 'depth':
        this._depth = coerceAttr(value, DEPTH_VALUES, 'medium');
        prev.depth = this._depth;
        break;
      default:
        return;
    }
    this.applyConfigTokens();
    if (this._mounted) this.onConfigChange(prev);
  }

  private _onThemeMediaChange = (): void => {
    if (this._theme === 'auto') this.applyTheme();
  };

  private _rebindThemeMedia(): void {
    if (this._themeMedia) {
      this._themeMedia.removeEventListener('change', this._onThemeMediaChange);
      this._themeMedia = undefined;
    }
    if (this._theme === 'auto' && typeof window !== 'undefined') {
      this._themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
      this._themeMedia.addEventListener('change', this._onThemeMediaChange);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Token application                                                */
  /* ---------------------------------------------------------------- */

  /** Push the current theme tokens onto `:host` as CSS variables. */
  protected applyTheme(): void {
    const tokens = resolveTheme(this._theme);
    const host = this.shadow.host as HTMLElement;
    // We can't target `:host` directly from JS, but `style.setProperty` on
    // the host element cascades into the shadow root.
    host.style.setProperty('--lumina-bg', tokens.bg);
    host.style.setProperty('--lumina-surface', tokens.surface);
    host.style.setProperty('--lumina-surface-alpha', tokens.surfaceAlpha);
    host.style.setProperty('--lumina-text', tokens.text);
    host.style.setProperty('--lumina-text-muted', tokens.textMuted);
    host.style.setProperty('--lumina-border', tokens.border);
    host.style.setProperty('--lumina-glow', tokens.glow);
    host.style.setProperty('--lumina-shadow', tokens.shadow);
    host.style.setProperty('--lumina-accent', this._accent);
    host.style.setProperty('--lumina-accent-rgb', toRgbTriplet(this._accent));
  }

  /** Push the variant/intensity/speed/depth tokens. */
  protected applyConfigTokens(): void {
    const host = this.shadow.host as HTMLElement;
    host.style.setProperty('--lumina-variant', this._variant);
    host.style.setProperty(
      '--lumina-intensity',
      String(intensityToMultiplier(this._intensity)),
    );
    host.style.setProperty('--lumina-speed', `${this._speed}s`);
    host.style.setProperty('--lumina-depth', `${depthToPx(this._depth)}px`);
  }

  /* ---------------------------------------------------------------- */
  /* Stylesheet caching                                               */
  /* ---------------------------------------------------------------- */

  private static _sheetCache = new WeakMap<
    Function,
    CSSStyleSheet | null
  >();

  private _ensureComponentStyles(): CSSStyleSheet {
    const ctor = this.constructor as Function;
    let sheet = LuminaElement._sheetCache.get(ctor);
    if (!sheet) {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(this.styles());
      LuminaElement._sheetCache.set(ctor, sheet);
    }
    return sheet;
  }

  /* ---------------------------------------------------------------- */
  /* Helpers exposed to subclasses                                    */
  /* ---------------------------------------------------------------- */

  /** Typed `getElementById` against the shadow root. */
  protected $<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return (this.shadow.getElementById(id) as T | null) ?? null;
  }

  /** Typed `querySelector` against the shadow root. Defaults to HTMLElement. */
  protected $$<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    return this.shadow.querySelector<T>(selector);
  }

  /** Returns all elements matching a selector. */
  protected $$$<T extends HTMLElement = HTMLElement>(selector: string): T[] {
    return Array.from(this.shadow.querySelectorAll<T>(selector));
  }
}
