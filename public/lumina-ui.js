var We = Object.defineProperty;
var Ue = (c, o, t) => o in c ? We(c, o, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[o] = t;
var a = (c, o, t) => Ue(c, typeof o != "symbol" ? o + "" : o, t);
const h = {
  /* Geometry */
  radiusSm: "8px",
  radiusMd: "14px",
  radiusLg: "22px",
  radiusXl: "34px",
  radiusPill: "999px",
  /* Motion */
  easeSpring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  /* Base typography */
  fontSans: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'SF Mono', 'Fira Code', ui-monospace, monospace",
  /* Light theme surface */
  lightBg: "#f3f4fb",
  lightSurface: "255 255 255",
  lightSurfaceAlpha: "0.55",
  lightText: "#0d0b1f",
  lightTextMuted: "rgba(13, 11, 31, 0.55)",
  lightBorder: "rgba(13, 11, 31, 0.10)",
  lightGlow: "rgba(124, 92, 255, 0.35)",
  lightShadow: "0 10px 30px -10px rgba(13, 11, 31, 0.18)",
  /* Dark theme surface */
  darkBg: "#06060c",
  darkSurface: "18 18 32",
  darkSurfaceAlpha: "0.55",
  darkText: "#f5f5ff",
  darkTextMuted: "rgba(245, 245, 255, 0.55)",
  darkBorder: "rgba(255, 255, 255, 0.08)",
  darkGlow: "rgba(124, 92, 255, 0.45)",
  darkShadow: "0 20px 60px -20px rgba(0, 0, 0, 0.7)",
  /* Cosmic theme (purple / magenta / cyan aurora) */
  cosmicBg: "#0a0420",
  cosmicSurface: "40 18 78",
  cosmicSurfaceAlpha: "0.55",
  cosmicText: "#f0e6ff",
  cosmicTextMuted: "rgba(240, 230, 255, 0.55)",
  cosmicBorder: "rgba(200, 130, 255, 0.18)",
  cosmicGlow: "rgba(180, 120, 255, 0.55)",
  cosmicShadow: "0 20px 60px -20px rgba(80, 20, 120, 0.7)",
  /* Void theme (deep black / chromatic aberration) */
  voidBg: "#000000",
  voidSurface: "12 12 18",
  voidSurfaceAlpha: "0.5",
  voidText: "#e8e8f5",
  voidTextMuted: "rgba(232, 232, 245, 0.5)",
  voidBorder: "rgba(255, 255, 255, 0.06)",
  voidGlow: "rgba(120, 240, 255, 0.45)",
  voidShadow: "0 20px 60px -20px rgba(0, 0, 0, 0.9)"
}, ze = {
  light: {
    bg: h.lightBg,
    surface: h.lightSurface,
    surfaceAlpha: h.lightSurfaceAlpha,
    text: h.lightText,
    textMuted: h.lightTextMuted,
    accent: "#7c5cff",
    accentRgb: "124 92 255",
    border: h.lightBorder,
    glow: h.lightGlow,
    shadow: h.lightShadow
  },
  dark: {
    bg: h.darkBg,
    surface: h.darkSurface,
    surfaceAlpha: h.darkSurfaceAlpha,
    text: h.darkText,
    textMuted: h.darkTextMuted,
    accent: "#7c5cff",
    accentRgb: "124 92 255",
    border: h.darkBorder,
    glow: h.darkGlow,
    shadow: h.darkShadow
  },
  cosmic: {
    bg: h.cosmicBg,
    surface: h.cosmicSurface,
    surfaceAlpha: h.cosmicSurfaceAlpha,
    text: h.cosmicText,
    textMuted: h.cosmicTextMuted,
    accent: "#b478ff",
    accentRgb: "180 120 255",
    border: h.cosmicBorder,
    glow: h.cosmicGlow,
    shadow: h.cosmicShadow
  },
  void: {
    bg: h.voidBg,
    surface: h.voidSurface,
    surfaceAlpha: h.voidSurfaceAlpha,
    text: h.voidText,
    textMuted: h.voidTextMuted,
    accent: "#78f0ff",
    accentRgb: "120 240 255",
    border: h.voidBorder,
    glow: h.voidGlow,
    shadow: h.voidShadow
  }
};
function Je(c) {
  if (c === "auto") {
    const o = typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return ze[o ? "dark" : "light"];
  }
  return ze[c];
}
function Ge() {
  const c = new CSSStyleSheet();
  return c.replaceSync(`
    :host {
      /* Geometry */
      --lumina-radius-sm: ${h.radiusSm};
      --lumina-radius-md: ${h.radiusMd};
      --lumina-radius-lg: ${h.radiusLg};
      --lumina-radius-xl: ${h.radiusXl};
      --lumina-radius-pill: ${h.radiusPill};

      /* Motion */
      --lumina-ease-spring: ${h.easeSpring};
      --lumina-ease-out: ${h.easeOut};
      --lumina-ease-in-out: ${h.easeInOut};

      /* Typography */
      --lumina-font-sans: ${h.fontSans};
      --lumina-font-mono: ${h.fontMono};

      /* Theme tokens (default to dark; components override in applyTheme) */
      --lumina-bg: ${h.darkBg};
      --lumina-surface: ${h.darkSurface};
      --lumina-surface-alpha: ${h.darkSurfaceAlpha};
      --lumina-text: ${h.darkText};
      --lumina-text-muted: ${h.darkTextMuted};
      --lumina-accent: #7c5cff;
      --lumina-accent-rgb: 124 92 255;
      --lumina-border: ${h.darkBorder};
      --lumina-glow: ${h.darkGlow};
      --lumina-shadow: ${h.darkShadow};

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
  `), c;
}
const Ze = {
  subtle: 0.4,
  medium: 0.7,
  intense: 1,
  extreme: 1.6
}, Qe = {
  flat: 0,
  medium: 14,
  deep: 32,
  extrude: 64
}, fi = {
  variant: "glass",
  intensity: "medium",
  theme: "auto",
  animationTrigger: "hover",
  accentColor: "#7c5cff",
  speed: 0.5,
  depth: "medium"
};
function ti(c) {
  const o = { r: 124, g: 92, b: 255, a: 1 };
  if (typeof document > "u") return o;
  const t = document.createElement("canvas").getContext("2d");
  if (!t) return o;
  t.fillStyle = "#000", t.fillStyle = c;
  const e = t.fillStyle;
  if (e.startsWith("#")) {
    const r = e.slice(1), s = parseInt(r.slice(0, 2), 16), n = parseInt(r.slice(2, 4), 16), d = parseInt(r.slice(4, 6), 16);
    return { r: s, g: n, b: d, a: 1 };
  }
  const i = e.match(/rgba?\(([^)]+)\)/);
  if (i) {
    const r = i[1].split(",").map((s) => s.trim());
    return {
      r: parseFloat(r[0]),
      g: parseFloat(r[1]),
      b: parseFloat(r[2]),
      a: r.length === 4 ? parseFloat(r[3]) : 1
    };
  }
  return o;
}
function _i(c, o = c.a) {
  return `rgb(${c.r} ${c.g} ${c.b} / ${o})`;
}
function ei(c) {
  const o = ti(c);
  return `${o.r} ${o.g} ${o.b}`;
}
function ii(c) {
  return Qe[c];
}
function y(c) {
  return Ze[c];
}
function v(c, o, t) {
  return Math.min(Math.max(c, o), t);
}
function xi(c, o, t) {
  return c + (o - c) * t;
}
function g(c, o) {
  return c + Math.random() * (o - c);
}
function yi(c, o) {
  return c.querySelector(o);
}
function ai(c, o, t = window.devicePixelRatio || 1) {
  const e = document.createElement("canvas");
  e.width = Math.max(1, Math.floor(c * t)), e.height = Math.max(1, Math.floor(o * t)), e.style.width = `${c}px`, e.style.height = `${o}px`;
  const i = e.getContext("2d");
  return i && i.scale(t, t), e;
}
function f(c, o, t) {
  return c === null ? t : o.includes(c) ? c : t;
}
const Se = [
  "glass",
  "morph",
  "neural",
  "void",
  "aura",
  "dimensional"
], Le = [
  "subtle",
  "medium",
  "intense",
  "extreme"
], Me = [
  "light",
  "dark",
  "auto",
  "cosmic",
  "void"
], Ne = [
  "hover",
  "click",
  "scroll",
  "focus",
  "proximity"
], Ie = [
  "flat",
  "medium",
  "deep",
  "extrude"
];
function p() {
  return typeof window < "u" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function w(c, o = 16) {
  let t = 0, e = null;
  return (...i) => {
    const r = Date.now(), s = o - (r - t);
    s <= 0 ? (e && (clearTimeout(e), e = null), t = r, c(...i)) : e || (e = setTimeout(() => {
      t = Date.now(), e = null, c(...i);
    }, s));
  };
}
function wi(c) {
  return c <= 0.3 ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "cubic-bezier(0.22, 1, 0.36, 1)";
}
const E = class E extends HTMLElement {
  /* ---------------------------------------------------------------- */
  /* Lifecycle                                                        */
  /* ---------------------------------------------------------------- */
  constructor() {
    super();
    /* ---------------------------------------------------------------- */
    /* Internal state                                                   */
    /* ---------------------------------------------------------------- */
    a(this, "shadow");
    a(this, "_mounted", !1);
    a(this, "_mutationObserver", null);
    a(this, "_themeMedia");
    /* ---------------------------------------------------------------- */
    /* Common typed properties                                          */
    /* ---------------------------------------------------------------- */
    a(this, "_variant", "glass");
    a(this, "_intensity", "medium");
    a(this, "_theme", "auto");
    a(this, "_trigger", "hover");
    a(this, "_accent", "#7c5cff");
    a(this, "_speed", 0.5);
    a(this, "_depth", "medium");
    a(this, "_onMutation", (t) => {
      for (const e of t)
        e.type === "attributes" && this._applyAttribute(e.attributeName, this.getAttribute(e.attributeName));
    });
    a(this, "_onThemeMediaChange", () => {
      this._theme === "auto" && this.applyTheme();
    });
    this.shadow = this.attachShadow({ mode: "open" }), this.shadow.adoptedStyleSheets = [E.baseStyles];
  }
  /** Reflects the `variant` attribute. */
  get variant() {
    return this._variant;
  }
  set variant(t) {
    this._variant = t, this.setAttribute("variant", t);
  }
  /** Reflects the `intensity` attribute. */
  get intensity() {
    return this._intensity;
  }
  set intensity(t) {
    this._intensity = t, this.setAttribute("intensity", t);
  }
  /** Reflects the `theme` attribute. */
  get theme() {
    return this._theme;
  }
  set theme(t) {
    this._theme = t, this.setAttribute("theme", t);
  }
  /** Reflects the `animation-trigger` attribute. */
  get animationTrigger() {
    return this._trigger;
  }
  set animationTrigger(t) {
    this._trigger = t, this.setAttribute("animation-trigger", t);
  }
  /** Reflects the `accent-color` attribute. */
  get accentColor() {
    return this._accent;
  }
  set accentColor(t) {
    this._accent = t, this.setAttribute("accent-color", t);
  }
  /** Reflects the `speed` attribute (seconds). */
  get speed() {
    return this._speed;
  }
  set speed(t) {
    this._speed = t, this.setAttribute("speed", String(t));
  }
  /** Reflects the `depth` attribute. */
  get depth() {
    return this._depth;
  }
  set depth(t) {
    this._depth = t, this.setAttribute("depth", t);
  }
  connectedCallback() {
    this._parseAttributes();
    const t = this._ensureComponentStyles();
    this.shadow.adoptedStyleSheets = [
      E.baseStyles,
      t
    ], this.shadow.innerHTML = this.render(), this._theme === "auto" && typeof window < "u" && (this._themeMedia = window.matchMedia("(prefers-color-scheme: dark)"), this._themeMedia.addEventListener("change", this._onThemeMediaChange)), this._mutationObserver = new MutationObserver(this._onMutation), this._mutationObserver.observe(this, { attributes: !0 }), this.applyTheme(), this.applyConfigTokens(), this._mounted = !0, this.mounted();
  }
  disconnectedCallback() {
    this._mounted = !1, this._mutationObserver?.disconnect(), this._mutationObserver = null, this._themeMedia && (this._themeMedia.removeEventListener("change", this._onThemeMediaChange), this._themeMedia = void 0), this.unmounted();
  }
  attributeChangedCallback(t, e, i) {
    !e || e === i || this._applyAttribute(t, i);
  }
  /** Called after the first render (shadow root is populated). */
  mounted() {
  }
  /** Called before the element is removed from the DOM. */
  unmounted() {
  }
  /** Called whenever a shared attribute changes after mount. */
  onConfigChange(t) {
  }
  /* ---------------------------------------------------------------- */
  /* Attribute plumbing                                               */
  /* ---------------------------------------------------------------- */
  // Note: we still need `observedAttributes` for `attributeChangedCallback`.
  static get observedAttributes() {
    return [
      "variant",
      "intensity",
      "theme",
      "animation-trigger",
      "accent-color",
      "speed",
      "depth"
    ];
  }
  _parseAttributes() {
    this._variant = f(
      this.getAttribute("variant"),
      Se,
      "glass"
    ), this._intensity = f(
      this.getAttribute("intensity"),
      Le,
      "medium"
    ), this._theme = f(
      this.getAttribute("theme"),
      Me,
      "auto"
    ), this._trigger = f(
      this.getAttribute("animation-trigger"),
      Ne,
      "hover"
    ), this._accent = this.getAttribute("accent-color") ?? "#7c5cff", this._speed = parseFloat(this.getAttribute("speed") ?? "0.5") || 0.5, this._depth = f(
      this.getAttribute("depth"),
      Ie,
      "medium"
    );
  }
  _applyAttribute(t, e) {
    const i = {};
    switch (t) {
      case "variant":
        this._variant = f(e, Se, "glass"), i.variant = this._variant;
        break;
      case "intensity":
        this._intensity = f(e, Le, "medium"), i.intensity = this._intensity;
        break;
      case "theme":
        this._theme = f(e, Me, "auto"), i.theme = this._theme, this._rebindThemeMedia(), this.applyTheme();
        break;
      case "animation-trigger":
        this._trigger = f(e, Ne, "hover"), i["animation-trigger"] = this._trigger;
        break;
      case "accent-color":
        this._accent = e ?? "#7c5cff", i["accent-color"] = this._accent;
        break;
      case "speed":
        this._speed = parseFloat(e ?? "0.5") || 0.5, i.speed = this._speed;
        break;
      case "depth":
        this._depth = f(e, Ie, "medium"), i.depth = this._depth;
        break;
      default:
        return;
    }
    this.applyConfigTokens(), this._mounted && this.onConfigChange(i);
  }
  _rebindThemeMedia() {
    this._themeMedia && (this._themeMedia.removeEventListener("change", this._onThemeMediaChange), this._themeMedia = void 0), this._theme === "auto" && typeof window < "u" && (this._themeMedia = window.matchMedia("(prefers-color-scheme: dark)"), this._themeMedia.addEventListener("change", this._onThemeMediaChange));
  }
  /* ---------------------------------------------------------------- */
  /* Token application                                                */
  /* ---------------------------------------------------------------- */
  /** Push the current theme tokens onto `:host` as CSS variables. */
  applyTheme() {
    const t = Je(this._theme), e = this.shadow.host;
    e.style.setProperty("--lumina-bg", t.bg), e.style.setProperty("--lumina-surface", t.surface), e.style.setProperty("--lumina-surface-alpha", t.surfaceAlpha), e.style.setProperty("--lumina-text", t.text), e.style.setProperty("--lumina-text-muted", t.textMuted), e.style.setProperty("--lumina-border", t.border), e.style.setProperty("--lumina-glow", t.glow), e.style.setProperty("--lumina-shadow", t.shadow), e.style.setProperty("--lumina-accent", this._accent), e.style.setProperty("--lumina-accent-rgb", ei(this._accent));
  }
  /** Push the variant/intensity/speed/depth tokens. */
  applyConfigTokens() {
    const t = this.shadow.host;
    t.style.setProperty("--lumina-variant", this._variant), t.style.setProperty(
      "--lumina-intensity",
      String(y(this._intensity))
    ), t.style.setProperty("--lumina-speed", `${this._speed}s`), t.style.setProperty("--lumina-depth", `${ii(this._depth)}px`);
  }
  _ensureComponentStyles() {
    const t = this.constructor;
    let e = E._sheetCache.get(t);
    return e || (e = new CSSStyleSheet(), e.replaceSync(this.styles()), E._sheetCache.set(t, e)), e;
  }
  /* ---------------------------------------------------------------- */
  /* Helpers exposed to subclasses                                    */
  /* ---------------------------------------------------------------- */
  /** Typed `getElementById` against the shadow root. */
  $(t) {
    return this.shadow.getElementById(t) ?? null;
  }
  /** Typed `querySelector` against the shadow root. Defaults to HTMLElement. */
  $$(t) {
    return this.shadow.querySelector(t);
  }
  /** Returns all elements matching a selector. */
  $$$(t) {
    return Array.from(this.shadow.querySelectorAll(t));
  }
};
/* ---------------------------------------------------------------- */
/* Static registry                                                  */
/* ---------------------------------------------------------------- */
a(E, "baseStyles", Ge()), /* ---------------------------------------------------------------- */
/* Stylesheet caching                                               */
/* ---------------------------------------------------------------- */
a(E, "_sheetCache", /* @__PURE__ */ new WeakMap());
let l = E;
const ri = {
  success: "✓",
  warning: "!",
  error: "×",
  info: "i",
  glass: "i",
  neural: "◆"
};
class M extends l {
  constructor() {
    super(...arguments);
    a(this, "dismissTimer", null);
    a(this, "autoDismissMs", 0);
  }
  static get observedAttributes() {
    return [
      ...l.observedAttributes,
      "dismissible",
      "auto-dismiss"
    ];
  }
  get dismissible() {
    return this.hasAttribute("dismissible");
  }
  set dismissible(t) {
    t ? this.setAttribute("dismissible", "") : this.removeAttribute("dismissible"), this.applyDismissible();
  }
  get autoDismiss() {
    return this.autoDismissMs;
  }
  set autoDismiss(t) {
    this.autoDismissMs = t, this.setAttribute("auto-dismiss", String(t)), this.scheduleAutoDismiss();
  }
  render() {
    return `
      <div class="lma" part="alert" role="alert">
        <span class="lma__icon" part="icon" aria-hidden="true"></span>
        <div class="lma__content" part="content">
          <slot name="title"><strong class="lma__title"></strong></slot>
          <div class="lma__msg"><slot></slot></div>
        </div>
        <button class="lma__close" part="close-button" type="button" aria-label="Fechar">×</button>
      </div>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        --lma-color: var(--lumina-accent);
        --lma-color-rgb: var(--lumina-accent-rgb);
      }
      :host([variant="success"]) { --lma-color: #22c55e; --lma-color-rgb: 34 197 94; }
      :host([variant="warning"]) { --lma-color: #f59e0b; --lma-color-rgb: 245 158 11; }
      :host([variant="error"])   { --lma-color: #ef4444; --lma-color-rgb: 239 68 68; }
      :host([variant="info"])    { --lma-color: #3b82f6; --lma-color-rgb: 59 130 246; }

      .lma {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 16px;
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
        border-left: 3px solid var(--lma-color);
        box-shadow:
          0 4px 20px -8px rgb(var(--lma-color-rgb) / 0.35),
          inset 0 1px 0 0 rgb(255 255 255 / 0.08);
        animation: lma-slide-in calc(var(--lumina-speed) * 1.4) var(--lumina-ease-spring);
        will-change: transform, opacity;
      }

      @keyframes lma-slide-in {
        from { opacity: 0; transform: translateX(-12px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      .lma.is-dismissing {
        animation: lma-slide-out calc(var(--lumina-speed) * 1.2) var(--lumina-ease-out) forwards;
      }
      @keyframes lma-slide-out {
        from { opacity: 1; transform: translateX(0); }
        to   { opacity: 0; transform: translateX(20px); }
      }

      .lma__icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgb(var(--lma-color-rgb) / 0.2);
        color: var(--lma-color);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 800;
        font-style: italic;
        box-shadow: 0 0 12px rgb(var(--lma-color-rgb) / 0.4);
        font-style: normal;
        margin-top: 1px;
      }

      .lma__content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .lma__title {
        font-size: 13px;
        font-weight: 700;
        color: var(--lma-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: block;
      }
      .lma__title:empty { display: none; }

      .lma__msg {
        font-size: 14px;
        line-height: 1.5;
        color: var(--lumina-text);
      }

      .lma__close {
        flex-shrink: 0;
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--lumina-text-muted);
        font-size: 18px;
        cursor: pointer;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background var(--lumina-speed) var(--lumina-ease-out),
                    color var(--lumina-speed) var(--lumina-ease-out),
                    transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lma__close:hover {
        background: rgb(var(--lma-color-rgb) / 0.2);
        color: var(--lma-color);
        transform: rotate(90deg);
      }
      .lma__close:focus-visible {
        outline: 2px solid var(--lma-color);
        outline-offset: 2px;
      }

      /* Variant: neural — pulsing border */
      :host([variant="neural"]) .lma {
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }
      :host([variant="neural"]) .lma__icon {
        animation: lma-pulse 1.6s ease-in-out infinite;
      }
      @keyframes lma-pulse {
        0%, 100% { box-shadow: 0 0 12px rgb(var(--lma-color-rgb) / 0.4); }
        50%      { box-shadow: 0 0 24px rgb(var(--lma-color-rgb) / 0.8); }
      }

      /* Hide close button when not dismissible */
      :host(:not([dismissible])) .lma__close { display: none; }

      @media (prefers-reduced-motion: reduce) {
        .lma, .lma__icon, .lma__close { animation: none !important; transition: none !important; }
      }
    `;
  }
  mounted() {
    this.applyVariantIcon(), this.applyTitle(), this.applyDismissible(), this.$$(".lma__close")?.addEventListener("click", () => this.dismiss());
    const t = this.getAttribute("auto-dismiss");
    t && (this.autoDismissMs = parseInt(t, 10) || 0, this.scheduleAutoDismiss());
  }
  unmounted() {
    this.dismissTimer && clearTimeout(this.dismissTimer);
  }
  onConfigChange(t) {
    t.variant && this.applyVariantIcon();
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "dismissible" ? this.applyDismissible() : t === "auto-dismiss" && i ? (this.autoDismissMs = parseInt(i, 10) || 0, this.scheduleAutoDismiss()) : t === "variant" && this.applyVariantIcon();
  }
  applyVariantIcon() {
    const t = this.$$(".lma__icon");
    if (!t) return;
    const e = this.variant;
    t.textContent = ri[e] ?? "i";
  }
  applyTitle() {
    const t = this.$$(".lma__title");
    t && !this.querySelector('[slot="title"]') && (t.textContent = this.variant.charAt(0).toUpperCase() + this.variant.slice(1));
  }
  applyDismissible() {
    const t = this.$$(".lma__close");
    t && (t.style.display = this.dismissible ? "" : "none");
  }
  scheduleAutoDismiss() {
    this.dismissTimer && (clearTimeout(this.dismissTimer), this.dismissTimer = null), this.autoDismissMs > 0 && (this.dismissTimer = setTimeout(() => this.dismiss(), this.autoDismissMs));
  }
  /** Public API: dismiss with animation, then remove from DOM if slotted standalone. */
  dismiss() {
    if (p()) {
      this.dispatchEvent(new CustomEvent("lumina-close", { bubbles: !0, composed: !0 })), this.remove();
      return;
    }
    const t = this.$$(".lma");
    t ? (t.classList.add("is-dismissing"), setTimeout(() => {
      this.dispatchEvent(new CustomEvent("lumina-close", { bubbles: !0, composed: !0 })), this.remove();
    }, 400)) : (this.dispatchEvent(new CustomEvent("lumina-close", { bubbles: !0, composed: !0 })), this.remove());
  }
}
a(M, "tagName", "lumina-alert");
customElements.get(M.tagName) || customElements.define(M.tagName, M);
class N extends l {
  constructor() {
    super(...arguments);
    a(this, "_suggestions", []);
    a(this, "_memoryKey", "");
    a(this, "_value", "");
    a(this, "input", null);
    a(this, "suggestionsEl", null);
    a(this, "highlightIdx", -1);
    a(this, "filtered", []);
    a(this, "onInput", (t) => {
      this._value = t.target.value, this.filter();
    });
    a(this, "onKeydown", (t) => {
      this.suggestionsEl?.hasAttribute("data-open") && (t.key === "ArrowDown" ? (t.preventDefault(), this.highlightIdx = Math.min(this.highlightIdx + 1, this.filtered.length - 1), this.updateHighlight()) : t.key === "ArrowUp" ? (t.preventDefault(), this.highlightIdx = Math.max(this.highlightIdx - 1, 0), this.updateHighlight()) : t.key === "Enter" ? (t.preventDefault(), this.highlightIdx >= 0 && this.filtered[this.highlightIdx] && this.select(this.filtered[this.highlightIdx])) : t.key === "Escape" && this.suggestionsEl?.removeAttribute("data-open"));
    });
    a(this, "onDocClick", (t) => {
      this.contains(t.target) || this.suggestionsEl?.removeAttribute("data-open");
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "suggestions", "memory-key"];
  }
  get suggestions() {
    return this._suggestions;
  }
  set suggestions(t) {
    this._suggestions = t, this.setAttribute("suggestions", JSON.stringify(t)), this.filter();
  }
  get memoryKey() {
    return this._memoryKey;
  }
  set memoryKey(t) {
    this._memoryKey = t, this.setAttribute("memory-key", t);
  }
  render() {
    return `
      <div class="lmau" part="field">
        <div class="lmau__shell" part="control">
          <div class="lmau__bg" aria-hidden="true"></div>
          <input class="lmau__el" type="text" placeholder="Digite para buscar..." />
        </div>
        <div class="lmau__suggestions" part="suggestions" aria-hidden="true"></div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmau__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmau__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmau__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmau__el { position: relative; z-index: 1; width: 100%; height: 100%; padding: 0 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); }
      .lmau__el::placeholder { color: var(--lumina-text-muted); }
      .lmau__suggestions { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 1000; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); overflow: hidden; max-height: 0; opacity: 0; transition: max-height var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmau__suggestions[data-open] { max-height: 300px; opacity: 1; }
      .lmau__category { padding: 6px 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--lumina-text-muted); background: rgb(var(--lumina-accent-rgb) / 0.05); }
      .lmau__suggestion { padding: 10px 14px; cursor: pointer; font-size: 14px; color: var(--lumina-text); transition: background 0.15s; animation: lmau-fade var(--lumina-speed) var(--lumina-ease-out); }
      @keyframes lmau-fade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      .lmau__suggestion:hover, .lmau__suggestion[data-highlighted] { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lmau__suggestion[data-recent]::before { content: '🕐 '; opacity: 0.6; }
      .lmau__highlight { color: var(--lumina-accent); font-weight: 700; text-shadow: 0 0 6px rgb(var(--lumina-accent-rgb) / 0.5); }
      @media (prefers-reduced-motion: reduce) { .lmau__suggestions, .lmau__suggestion { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    const t = this.getAttribute("suggestions");
    if (t)
      try {
        this._suggestions = JSON.parse(t);
      } catch {
        this._suggestions = [];
      }
    this._memoryKey = this.getAttribute("memory-key") ?? "", this.input = this.$$(".lmau__el"), this.suggestionsEl = this.$$(".lmau__suggestions"), this.input?.addEventListener("input", this.onInput), this.input?.addEventListener("keydown", this.onKeydown), document.addEventListener("click", this.onDocClick);
  }
  unmounted() {
    document.removeEventListener("click", this.onDocClick);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    if (super.attributeChangedCallback(t, e, i), t === "suggestions" && i)
      try {
        this._suggestions = JSON.parse(i), this.filter();
      } catch {
      }
    else t === "memory-key" && (this._memoryKey = i ?? "");
  }
  filter() {
    if (!this.suggestionsEl) return;
    const t = this._value.toLowerCase().trim();
    if (!t) {
      this.suggestionsEl.removeAttribute("data-open"), this.suggestionsEl.innerHTML = "";
      return;
    }
    this.filtered = this._suggestions.filter((s) => s.label.toLowerCase().includes(t));
    const e = this.getRecent();
    if (this.filtered.sort((s, n) => {
      const d = e.includes(s.value) ? 0 : 1, u = e.includes(n.value) ? 0 : 1;
      return d - u;
    }), this.filtered.length === 0) {
      this.suggestionsEl.removeAttribute("data-open");
      return;
    }
    let i = "", r = "";
    this.filtered.forEach((s, n) => {
      s.category && s.category !== r && (i += `<div class="lmau__category">${s.category}</div>`, r = s.category);
      const d = s.label.toLowerCase().indexOf(t), u = s.label.slice(0, d), m = s.label.slice(d, d + t.length), b = s.label.slice(d + t.length), x = e.includes(s.value) ? "data-recent" : "";
      i += `<div class="lmau__suggestion" data-idx="${n}" data-value="${s.value}" ${x}>${u}<span class="lmau__highlight">${m}</span>${b}</div>`;
    }), this.suggestionsEl.innerHTML = i, this.suggestionsEl.setAttribute("data-open", ""), this.highlightIdx = -1, this.suggestionsEl.querySelectorAll(".lmau__suggestion").forEach((s) => {
      s.addEventListener("click", () => {
        const n = parseInt(s.getAttribute("data-idx") ?? "-1", 10);
        n >= 0 && this.select(this.filtered[n]);
      }), s.addEventListener("mouseenter", () => {
        this.highlightIdx = parseInt(s.getAttribute("data-idx") ?? "-1", 10), this.updateHighlight();
      });
    });
  }
  updateHighlight() {
    this.suggestionsEl?.querySelectorAll(".lmau__suggestion").forEach((t) => {
      const e = parseInt(t.getAttribute("data-idx") ?? "-1", 10);
      t.toggleAttribute("data-highlighted", e === this.highlightIdx), e === this.highlightIdx && t.scrollIntoView({ block: "nearest" });
    }), this.highlightIdx >= 0 && this.dispatchEvent(new CustomEvent("lumina-suggestion-highlight", { bubbles: !0, composed: !0, detail: { suggestion: this.filtered[this.highlightIdx] } }));
  }
  select(t) {
    this._value = t.label, this.input && (this.input.value = t.label), this.suggestionsEl?.removeAttribute("data-open"), this.saveRecent(t.value), this.dispatchEvent(new CustomEvent("lumina-select", { bubbles: !0, composed: !0, detail: { value: t.value, label: t.label } }));
  }
  getRecent() {
    if (!this._memoryKey) return [];
    try {
      return JSON.parse(localStorage.getItem(`lumina-autocomplete-${this._memoryKey}`) ?? "[]");
    } catch {
      return [];
    }
  }
  saveRecent(t) {
    if (!this._memoryKey) return;
    const e = this.getRecent().filter((i) => i !== t);
    e.unshift(t), localStorage.setItem(`lumina-autocomplete-${this._memoryKey}`, JSON.stringify(e.slice(0, 5)));
  }
}
a(N, "tagName", "lumina-autocomplete");
customElements.get(N.tagName) || customElements.define(N.tagName, N);
class I extends l {
  constructor() {
    super(...arguments);
    a(this, "_max", 5);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "max"];
  }
  render() {
    return '<span class="lmag" part="group"><slot></slot><span class="lmag__overflow" part="overflow"></span></span>';
  }
  styles() {
    return `
      :host { display: inline-flex; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmag { display: inline-flex; align-items: center; }
      ::slotted(lumina-avatar), ::slotted(*) { margin-left: -10px; border: 2px solid var(--lumina-bg, #06060c); border-radius: 50%; transition: transform var(--lumina-speed) var(--lumina-ease-spring), margin var(--lumina-speed) var(--lumina-ease-spring); }
      ::slotted(lumina-avatar:first-child), ::slotted(*:first-child) { margin-left: 0; }
      .lmag:hover ::slotted(lumina-avatar), .lmag:hover ::slotted(*) { margin-left: 4px; transform: translateY(-2px); }
      .lmag:hover ::slotted(*:first-child) { margin-left: 0; }
      .lmag__overflow { margin-left: -6px; padding: 0 10px; height: 32px; min-width: 32px; border-radius: 999px; background: rgb(var(--lumina-surface) / 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 2px solid var(--lumina-bg, #06060c); display: inline-flex; align-items: center; justify-content: center; font: 600 11px 'JetBrains Mono', monospace; color: var(--lumina-text-muted); cursor: pointer; transition: all var(--lumina-speed) var(--lumina-ease-spring); }
      .lmag__overflow:hover { background: rgb(var(--lumina-accent-rgb) / 0.2); color: var(--lumina-accent); transform: translateY(-2px) scale(1.05); }
      .lmag__overflow:empty { display: none; }
      :host([variant="compact"]) ::slotted(lumina-avatar), :host([variant="compact"]) ::slotted(*) { margin-left: -14px; }
      @media (prefers-reduced-motion: reduce) { ::slotted(*), .lmag__overflow { transition: none !important; } }
    `;
  }
  mounted() {
    this._max = parseInt(this.getAttribute("max") ?? "5", 10) || 5, this.updateOverflow(), this.addEventListener("slotchange", () => this.updateOverflow());
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "max" && (this._max = parseInt(i ?? "5", 10) || 5, this.updateOverflow());
  }
  updateOverflow() {
    const t = Array.from(this.querySelectorAll("lumina-avatar, [data-avatar]")), e = this.$$(".lmag__overflow");
    if (!e) return;
    const i = t.length - this._max;
    i > 0 ? (e.textContent = `+${i}`, e.title = `${i} more`, t.forEach((r, s) => {
      r.style.display = s < this._max ? "" : "none";
    })) : (e.textContent = "", t.forEach((r) => {
      r.style.display = "";
    }));
  }
}
a(I, "tagName", "lumina-avatar-group");
customElements.get(I.tagName) || customElements.define(I.tagName, I);
const Pe = ["sm", "md", "lg", "xl"], si = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 80
}, Te = ["online", "busy", "offline", "away"], ni = {
  online: "#22c55e",
  busy: "#ef4444",
  offline: "#6b7280",
  away: "#f59e0b"
};
class P extends l {
  constructor() {
    super(...arguments);
    a(this, "imgEl", null);
    a(this, "initialsEl", null);
    a(this, "statusEl", null);
    a(this, "_src", "");
    a(this, "_name", "");
    a(this, "_status", null);
    a(this, "_size", "md");
    a(this, "onClick", () => {
      this.interactive && this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
    });
    a(this, "onKeydown", (t) => {
      this.interactive && (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 })));
    });
  }
  static get observedAttributes() {
    return [
      ...l.observedAttributes,
      "src",
      "name",
      "status",
      "size",
      "interactive"
    ];
  }
  get src() {
    return this._src;
  }
  set src(t) {
    this._src = t, this.setAttribute("src", t), this.applySrc();
  }
  get name() {
    return this._name;
  }
  set name(t) {
    this._name = t, this.setAttribute("name", t), this.applyInitials();
  }
  get status() {
    return this._status;
  }
  set status(t) {
    this._status = t, t ? this.setAttribute("status", t) : this.removeAttribute("status"), this.applyStatus();
  }
  get size() {
    return this._size;
  }
  set size(t) {
    this._size = t, this.setAttribute("size", t), this.applySize();
  }
  get interactive() {
    return this.hasAttribute("interactive");
  }
  set interactive(t) {
    t ? this.setAttribute("interactive", "") : this.removeAttribute("interactive"), this.applyInteractive();
  }
  render() {
    return `
      <span class="lmav" part="avatar">
        <img class="lmav__img" part="image" alt="" />
        <span class="lmav__initials" part="initials" aria-hidden="true"></span>
        <span class="lmav__status" part="status" aria-hidden="true"></span>
        <span class="lmav__ring" aria-hidden="true"></span>
        <span class="lmav__holo" aria-hidden="true"></span>
      </span>
    `;
  }
  styles() {
    return `
      :host {
        display: inline-block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        --lmav-size: 40px;
      }

      .lmav {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--lmav-size);
        height: var(--lmav-size);
        border-radius: 50%;
        overflow: visible;
        isolation: isolate;
      }

      .lmav__img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        z-index: 1;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmav__img[data-loaded] { opacity: 1; }

      .lmav__initials {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(135deg,
          rgb(var(--lumina-accent-rgb) / 0.4),
          rgb(var(--lumina-accent-rgb) / 0.2)
        );
        color: var(--lumina-text);
        font-weight: 700;
        font-size: calc(var(--lmav-size) * 0.36);
        letter-spacing: -0.02em;
        text-transform: uppercase;
        border: 1px solid var(--lumina-border);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.15),
          var(--lumina-shadow);
      }
      .lmav__initials[data-hidden] { display: none; }

      .lmav__status {
        position: absolute;
        bottom: 0;
        right: 0;
        width: calc(var(--lmav-size) * 0.3);
        height: calc(var(--lmav-size) * 0.3);
        min-width: 10px;
        min-height: 10px;
        max-width: 16px;
        max-height: 16px;
        border-radius: 50%;
        background: var(--lmav-status, #6b7280);
        border: 2px solid var(--lumina-bg, #06060c);
        z-index: 3;
        box-shadow: 0 0 8px var(--lmav-status, #6b7280);
      }
      .lmav__status[data-busy] { animation: lmav-busy 1.2s ease-in-out infinite; }
      @keyframes lmav-busy {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(0.7); opacity: 0.7; }
      }
      .lmav__status:not([data-status]) { display: none; }

      .lmav__ring {
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        background: conic-gradient(from 0deg,
          transparent 0%,
          var(--lumina-accent) 25%,
          transparent 50%,
          var(--lumina-accent) 75%,
          transparent 100%
        );
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude;
        padding: 2px;
        opacity: 0;
        animation: lmav-spin 6s linear infinite;
        animation-play-state: paused;
      }
      :host(:hover) .lmav__ring { opacity: 0.6; animation-play-state: running; }
      :host([interactive]:hover) .lmav__ring { opacity: 1; }

      .lmav__holo {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        opacity: 0;
        background: linear-gradient(135deg,
          rgb(255 0 128 / 0.4) 0%,
          rgb(0 200 255 / 0.4) 50%,
          rgb(255 255 0 / 0.3) 100%
        );
        mix-blend-mode: overlay;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host([variant="holo"]:hover) .lmav__holo { opacity: 1; }

      /* Interactive state */
      :host([interactive]) { cursor: pointer; }
      :host([interactive]) .lmav { transition: transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host([interactive]:hover) .lmav { transform: scale(1.05); }
      :host([interactive]:active) .lmav { transform: scale(0.95); }
      :host([interactive]:focus-visible) {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 4px;
      }

      /* Variant: minimal — no ring, no blur, flat */
      :host([variant="minimal"]) .lmav__initials {
        background: rgb(var(--lumina-surface) / 0.6);
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: none;
      }
      :host([variant="minimal"]) .lmav__ring { display: none; }

      /* Variant: neural — pulsing glow around */
      :host([variant="neural"]) .lmav__ring {
        opacity: 0.4;
        animation-play-state: running;
      }
      :host([variant="neural"]) .lmav__initials {
        background:
          radial-gradient(circle at 30% 30%,
            rgb(var(--lumina-accent-rgb) / 0.5),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha))
          );
      }

      /* Variant: holo — iridescent border */
      :host([variant="holo"]) .lmav__initials {
        background: linear-gradient(135deg,
          rgb(255 0 128 / 0.3),
          rgb(0 200 255 / 0.3),
          rgb(255 255 0 / 0.3)
        );
        border-color: rgb(255 255 255 / 0.3);
      }

      @keyframes lmav-spin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        .lmav, .lmav__ring, .lmav__status, .lmav__holo {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }
  mounted() {
    this.imgEl = this.$$(".lmav__img"), this.initialsEl = this.$$(".lmav__initials"), this.statusEl = this.$$(".lmav__status"), this._src = this.getAttribute("src") ?? "", this._name = this.getAttribute("name") ?? "";
    const t = this.getAttribute("status");
    this._status = t && Te.includes(t) ? t : null, this._size = f(this.getAttribute("size"), Pe, "md"), this.applySize(), this.applySrc(), this.applyInitials(), this.applyStatus(), this.applyInteractive(), this.imgEl && (this.imgEl.addEventListener("load", () => {
      this.imgEl?.setAttribute("data-loaded", ""), this.initialsEl?.setAttribute("data-hidden", "");
    }), this.imgEl.addEventListener("error", () => {
      this.imgEl?.removeAttribute("data-loaded"), this.initialsEl?.removeAttribute("data-hidden");
    })), this.interactive && (this.getAttribute("role") !== "button" && this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.addEventListener("click", this.onClick), this.addEventListener("keydown", this.onKeydown));
  }
  unmounted() {
    this.removeEventListener("click", this.onClick), this.removeEventListener("keydown", this.onKeydown);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "src" ? (this._src = i ?? "", this.applySrc()) : t === "name" ? (this._name = i ?? "", this.applyInitials()) : t === "status" ? (this._status = i && Te.includes(i) ? i : null, this.applyStatus()) : t === "size" ? (this._size = f(i, Pe, "md"), this.applySize()) : t === "interactive" && this.applyInteractive();
  }
  applySize() {
    this.style.setProperty("--lmav-size", `${si[this._size]}px`);
  }
  applySrc() {
    this.imgEl && (this._src ? (this.imgEl.src = this._src, this.imgEl.alt = this._name || "Avatar") : (this.imgEl.removeAttribute("src"), this.imgEl.removeAttribute("data-loaded"), this.initialsEl?.removeAttribute("data-hidden")));
  }
  applyInitials() {
    if (!this.initialsEl) return;
    const t = this.computeInitials(this._name);
    this.initialsEl.textContent = t;
  }
  applyStatus() {
    this.statusEl && (this._status ? (this.statusEl.setAttribute("data-status", this._status), this.style.setProperty("--lmav-status", ni[this._status]), this._status === "busy" ? this.statusEl.setAttribute("data-busy", "") : this.statusEl.removeAttribute("data-busy")) : (this.statusEl.removeAttribute("data-status"), this.statusEl.removeAttribute("data-busy")));
  }
  applyInteractive() {
    this.interactive && this._mounted ? (this.getAttribute("role") !== "button" && this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.addEventListener("click", this.onClick), this.addEventListener("keydown", this.onKeydown)) : (this.removeAttribute("role"), this.removeAttribute("tabindex"), this.removeEventListener("click", this.onClick), this.removeEventListener("keydown", this.onKeydown));
  }
  /** Compute 1-2 letter initials from a name. */
  computeInitials(t) {
    if (!t) return "?";
    const e = t.trim().split(/\s+/);
    return e.length === 1 ? e[0].slice(0, 2).toUpperCase() : (e[0][0] + e[e.length - 1][0]).toUpperCase();
  }
}
a(P, "tagName", "lumina-avatar");
customElements.get(P.tagName) || customElements.define(P.tagName, P);
class T extends l {
  static get observedAttributes() {
    return [...l.observedAttributes, "pulse", "dot"];
  }
  render() {
    return `
      <span class="lumina-badge" part="root">
        <span class="lumina-badge__dot" part="dot" aria-hidden="true"></span>
        <span class="lumina-badge__halo" part="halo" aria-hidden="true"></span>
        <span class="lumina-badge__content" part="content">
          <slot></slot>
        </span>
      </span>
    `;
  }
  styles() {
    return `
      :host {
        display: inline-flex;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-badge {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: var(--lumina-radius-pill);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.08),
          var(--lumina-shadow);
        color: var(--lumina-text);
        overflow: visible;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring),
                    box-shadow var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-badge__dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--lumina-accent);
        box-shadow: 0 0 6px var(--lumina-accent);
        display: none;
      }
      :host([dot]) .lumina-badge__dot { display: inline-block; }

      .lumina-badge__halo {
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        background: radial-gradient(circle,
          rgb(var(--lumina-accent-rgb) / calc(0.6 * var(--lumina-intensity))),
          transparent 70%
        );
        filter: blur(8px);
        z-index: -1;
      }

      .lumina-badge__content {
        position: relative;
        z-index: 1;
      }

      /* Hover lift */
      :host(:hover) .lumina-badge {
        transform: translateY(-1px);
      }
      :host(:hover) .lumina-badge__halo { opacity: 1; }

      /* Pulse */
      :host([pulse]) .lumina-badge__dot {
        animation: lumina-badge-pulse 1.6s ease-in-out infinite;
      }
      :host([pulse]) .lumina-badge__halo {
        animation: lumina-badge-halo 1.6s ease-out infinite;
        opacity: 1;
      }

      /* Variants */
      :host([variant="void"]) .lumina-badge {
        background: rgb(0 0 0 / 0.6);
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
        color: var(--lumina-accent);
        text-shadow:
          -1px 0 1px rgb(255 0 80 / 0.5),
          1px 0 1px rgb(0 200 255 / 0.5);
      }

      :host([variant="aura"]) .lumina-badge {
        animation: lumina-badge-float 4s ease-in-out infinite;
        background:
          radial-gradient(120% 100% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.25),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%
          );
      }

      :host([variant="morph"]) .lumina-badge {
        border-radius: 4px;
        clip-path: polygon(
          0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%
        );
      }

      :host([variant="dimensional"]) .lumina-badge {
        transform: translateZ(0);
        box-shadow:
          0 4px 0 calc(var(--lumina-depth) * -0.3) rgb(var(--lumina-accent-rgb) / 0.5),
          var(--lumina-shadow);
      }

      @keyframes lumina-badge-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.4); opacity: 0.6; }
      }
      @keyframes lumina-badge-halo {
        0% { transform: scale(0.9); opacity: 0.7; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      @keyframes lumina-badge-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-badge,
        .lumina-badge__dot,
        .lumina-badge__halo {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }
  mounted() {
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
}
a(T, "tagName", "lumina-badge");
customElements.get(T.tagName) || customElements.define(T.tagName, T);
class R extends l {
  static get observedAttributes() {
    return [...l.observedAttributes];
  }
  render() {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        padding: 8px;
        border-radius: var(--lumina-radius-pill);
      }
      .lmc__glow {
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))), transparent 60%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      .lmc__inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow { transition: none !important; }
      }
`;
  }
  mounted() {
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
  /** Dispatch a CustomEvent with composed bubbling. */
  emit(o, t) {
    this.dispatchEvent(new CustomEvent(o, { bubbles: !0, composed: !0, detail: t }));
  }
  /** For overlay-style components: open/close helpers. */
  open() {
    this.setAttribute("open", ""), this.setAttribute("data-open", ""), this.emit("lumina-open");
  }
  close() {
    this.removeAttribute("open"), this.removeAttribute("data-open"), this.emit("lumina-close");
  }
}
a(R, "tagName", "lumina-breadcrumbs");
customElements.get(R.tagName) || customElements.define(R.tagName, R);
class F extends l {
  constructor() {
    super(...arguments);
    a(this, "onClick", () => {
      this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
    });
    a(this, "onKeydown", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.onClick());
    });
  }
  render() {
    return `
      <button class="lmbb" part="button" type="button">
        <span class="lmbb__bg" aria-hidden="true"></span>
        <span class="lmbb__glow" part="glow" aria-hidden="true"></span>
        <span class="lmbb__label"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmbb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        animation: lmbb-breathe calc(var(--lumina-speed) * 6) ease-in-out infinite;
        will-change: transform;
      }
      @keyframes lmbb-breathe {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.04); }
      }
      .lmbb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmbb__glow { position: absolute; inset: -25%; border-radius: inherit; pointer-events: none; z-index: 0; opacity: calc(0.3 * var(--lumina-intensity)); background: radial-gradient(60% 60% at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.5), transparent 70%); filter: blur(20px); animation: lmbb-glow-pulse calc(var(--lumina-speed) * 6) ease-in-out infinite; }
      @keyframes lmbb-glow-pulse {
        0%, 100% { opacity: calc(0.2 * var(--lumina-intensity)); }
        50%      { opacity: calc(0.5 * var(--lumina-intensity)); }
      }
      .lmbb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmbb { animation-play-state: paused; transform: scale(1.06); }
      :host(:hover) .lmbb__bg { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      :host(:focus-within) .lmbb, :host(:active) .lmbb { animation-play-state: paused; }
      :host(:active) .lmbb { transform: scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="subtle"]) .lmbb { animation: lmbb-breathe calc(var(--lumina-speed) * 10) ease-in-out infinite; }
      :host([variant="subtle"]) .lmbb__glow { animation: lmbb-glow-pulse calc(var(--lumina-speed) * 10) ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) { .lmbb, .lmbb__glow { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.$$(".lmbb")?.addEventListener("click", this.onClick), this.$$(".lmbb")?.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
}
a(F, "tagName", "lumina-breath-button");
customElements.get(F.tagName) || customElements.define(F.tagName, F);
class D extends l {
  render() {
    return `
      <article class="lmbc" part="card">
        <div class="lmbc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmbc { position: relative; display: block; border-radius: inherit; animation: lmbc-breathe calc(var(--lumina-speed) * 8) ease-in-out infinite; will-change: transform; }
      @keyframes lmbc-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.015); } }
      .lmbc__surface { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; }
      :host(:hover) .lmbc, :host(:focus-within) .lmbc, :host(:active) .lmbc { animation-play-state: paused; }
      :host([variant="subtle"]) .lmbc { animation-duration: calc(var(--lumina-speed) * 12); }
      :host([variant="subtle"]) { --lumina-intensity: 0.4; }
      :host([variant="intense"]) .lmbc { animation-duration: calc(var(--lumina-speed) * 5); }
      :host([variant="intense"]) .lmbc__surface { box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 30px rgb(var(--lumina-accent-rgb) / 0.2), var(--lumina-shadow); }
      @keyframes lmbc-breathe-intense { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
      :host([variant="intense"]) .lmbc { animation-name: lmbc-breathe-intense; }
      @media (prefers-reduced-motion: reduce) { .lmbc { animation: none !important; } }
    `;
  }
  mounted() {
    this.addEventListener("pointerenter", () => this.$$(".lmbc")?.style.setProperty("animation-play-state", "paused")), this.addEventListener("pointerleave", () => this.$$(".lmbc")?.style.setProperty("animation-play-state", "running"));
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
}
a(D, "tagName", "lumina-breath-card");
customElements.get(D.tagName) || customElements.define(D.tagName, D);
class Y extends l {
  constructor() {
    super(...arguments);
    a(this, "_multiple", !1);
    a(this, "_value", "");
    a(this, "selectedValues", /* @__PURE__ */ new Set());
    a(this, "observer", null);
    a(this, "onClick", (t) => {
      const e = t.target.closest("[data-value]");
      if (!e) return;
      const i = e.getAttribute("data-value") ?? "";
      this._multiple ? this.selectedValues.has(i) ? this.selectedValues.delete(i) : this.selectedValues.add(i) : this.selectedValues.has(i) && this.selectedValues.size === 1 ? this.selectedValues.clear() : (this.selectedValues.clear(), this.selectedValues.add(i)), this._value = Array.from(this.selectedValues).join(","), this.setAttribute("value", this._value), this.updateChildren(), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { value: this._multiple ? this._value : this.selectedValues.values().next().value ?? "", values: Array.from(this.selectedValues) } }));
    });
    a(this, "onKeydown", (t) => {
      const e = t.target.closest("[data-value]");
      if (!e) return;
      const i = Array.from(this.querySelectorAll("[data-value]")), r = i.indexOf(e);
      if (r === -1) return;
      let s = r;
      if (t.key === "ArrowRight" || t.key === "ArrowDown") s = (r + 1) % i.length;
      else if (t.key === "ArrowLeft" || t.key === "ArrowUp") s = (r - 1 + i.length) % i.length;
      else if (t.key === "Home") s = 0;
      else if (t.key === "End") s = i.length - 1;
      else return;
      t.preventDefault(), i[s].focus();
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "multiple", "value"];
  }
  get multiple() {
    return this._multiple;
  }
  set multiple(t) {
    this._multiple = t, t ? this.setAttribute("multiple", "") : this.removeAttribute("multiple"), this.syncFromValue();
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = t, this.setAttribute("value", t), this.syncFromValue();
  }
  render() {
    return '<div class="lmbg" part="group"><slot></slot></div>';
  }
  styles() {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmbg {
        position: relative; display: inline-flex; gap: 0; padding: 4px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5); -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.06), var(--lumina-shadow);
      }
      ::slotted(button), ::slotted([data-value]) {
        appearance: none; border: 0; background: transparent; color: var(--lumina-text-muted);
        font: 600 13px var(--lumina-font-sans); padding: 8px 16px; cursor: pointer; border-radius: var(--lumina-radius-pill);
        transition: background var(--lumina-speed) var(--lumina-ease-out), color var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring);
        position: relative; z-index: 1; white-space: nowrap;
      }
      ::slotted(button:hover), ::slotted([data-value]:hover) { color: var(--lumina-text); transform: translateY(-1px); }
      ::slotted(button[data-active]), ::slotted([data-value][data-active]) {
        background: linear-gradient(135deg, rgb(var(--lumina-accent-rgb) / 0.9), rgb(var(--lumina-accent-rgb) / 0.6));
        color: #fff; box-shadow: 0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.25);
      }
      ::slotted(button:focus-visible), ::slotted([data-value]:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 2px; }
      :host([variant="segmented"]) .lmbg { padding: 4px; gap: 2px; }
      :host([variant="segmented"]) ::slotted(button), :host([variant="segmented"]) ::slotted([data-value]) { flex: 1; justify-content: center; border-radius: var(--lumina-radius-md); }
      :host([variant="neural"]) .lmbg { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { ::slotted(button), ::slotted([data-value]) { transition: none !important; } }
    `;
  }
  mounted() {
    this._multiple = this.hasAttribute("multiple"), this._value = this.getAttribute("value") ?? "", this.syncFromValue(), this.observer = new MutationObserver(() => this.syncFromValue()), this.observer.observe(this, { childList: !0, subtree: !0, attributes: !0, attributeFilter: ["data-value"] }), this.addEventListener("click", this.onClick), this.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
    this.observer?.disconnect(), this.removeEventListener("click", this.onClick), this.removeEventListener("keydown", this.onKeydown);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "multiple" ? (this._multiple = i !== null, this.syncFromValue()) : t === "value" && (this._value = i ?? "", this.syncFromValue());
  }
  syncFromValue() {
    this.selectedValues = new Set(this._multiple ? this._value.split(",").filter(Boolean) : this._value ? [this._value] : []), this.updateChildren();
  }
  updateChildren() {
    Array.from(this.querySelectorAll("[data-value]")).forEach((e) => {
      const i = e.getAttribute("data-value") ?? "";
      this.selectedValues.has(i) ? e.setAttribute("data-active", "") : e.removeAttribute("data-active");
    });
  }
}
a(Y, "tagName", "lumina-button-group");
customElements.get(Y.tagName) || customElements.define(Y.tagName, Y);
class k {
  constructor(o, t) {
    a(this, "canvas");
    a(this, "ctx");
    a(this, "particles", []);
    a(this, "rafId", 0);
    a(this, "running", !1);
    a(this, "opts");
    a(this, "loop", () => {
      if (!this.running) return;
      const o = this.ctx, t = this.canvas.clientWidth, e = this.canvas.clientHeight;
      o.clearRect(0, 0, t, e);
      for (const i of this.particles) {
        i.x += i.vx, i.y += i.vy, i.life += 1, this.opts.starfield ? (i.x < 0 && (i.x = t), i.x > t && (i.x = 0), i.y < 0 && (i.y = e), i.y > e && (i.y = 0)) : i.life >= i.maxLife && (i.x = g(0, t), i.y = g(0, e), i.life = 0);
        const r = this.opts.starfield ? 0.4 + 0.6 * Math.sin(i.life / i.maxLife * Math.PI * 2) : 1 - i.life / i.maxLife;
        o.fillStyle = `rgba(${this.opts.rgb} / ${r})`, o.beginPath(), o.arc(i.x, i.y, i.size, 0, Math.PI * 2), o.fill();
      }
      if (this.opts.connect)
        for (let r = 0; r < this.particles.length; r++)
          for (let s = r + 1; s < this.particles.length; s++) {
            const n = this.particles[r], d = this.particles[s], u = n.x - d.x, m = n.y - d.y, b = Math.sqrt(u * u + m * m);
            b < 90 && (o.strokeStyle = `rgba(${this.opts.rgb} / ${(1 - b / 90) * 0.4})`, o.lineWidth = 0.6, o.beginPath(), o.moveTo(n.x, n.y), o.lineTo(d.x, d.y), o.stroke());
          }
      this.rafId = requestAnimationFrame(this.loop);
    });
    this.host = o;
    const e = o.getBoundingClientRect(), i = Math.max(1, e.width), r = Math.max(1, e.height);
    this.canvas = ai(i, r), this.canvas.style.position = "absolute", this.canvas.style.inset = "0", this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.style.pointerEvents = "none", this.canvas.setAttribute("aria-hidden", "true"), this.ctx = this.canvas.getContext("2d"), this.opts = {
      count: t.count ?? 40,
      hueRange: t.hueRange ?? [240, 320],
      sizeRange: t.sizeRange ?? [1, 3],
      speedRange: t.speedRange ?? [0.2, 0.8],
      lifeRange: t.lifeRange ?? [120, 240],
      spread: t.spread ?? Math.PI * 2,
      rgb: t.rgb,
      connect: t.connect ?? !1,
      starfield: t.starfield ?? !1
    }, this.spawn();
  }
  /** Attach the canvas to a parent element. */
  mount(o) {
    o.appendChild(this.canvas), p() || this.start();
  }
  /** Start the rAF loop. */
  start() {
    this.running || (this.running = !0, this.loop());
  }
  /** Stop the rAF loop. */
  stop() {
    this.running = !1, cancelAnimationFrame(this.rafId);
  }
  /** Remove the canvas and stop the loop. */
  destroy() {
    this.stop(), this.canvas.remove();
  }
  /** Resize the canvas to match a new width/height (CSS pixels). */
  resize(o, t) {
    const e = window.devicePixelRatio || 1;
    this.canvas.width = Math.max(1, Math.floor(o * e)), this.canvas.height = Math.max(1, Math.floor(t * e)), this.canvas.style.width = `${o}px`, this.canvas.style.height = `${t}px`, this.ctx.setTransform(e, 0, 0, e, 0, 0);
  }
  /* ------------------------------------------------------------------ */
  spawn() {
    const { count: o, hueRange: t, sizeRange: e, speedRange: i, lifeRange: r, spread: s } = this.opts, n = this.canvas.clientWidth, d = this.canvas.clientHeight;
    this.particles = [];
    for (let u = 0; u < o; u++) {
      const m = g(0, s), b = g(i[0], i[1]);
      this.particles.push({
        x: g(0, n),
        y: g(0, d),
        vx: Math.cos(m) * b,
        vy: Math.sin(m) * b,
        life: g(0, r[1]),
        maxLife: g(r[0], r[1]),
        size: g(e[0], e[1]),
        hue: g(t[0], t[1])
      });
    }
  }
}
class X extends l {
  constructor() {
    super(...arguments);
    a(this, "field", null);
    a(this, "burstCanvas", null);
    a(this, "burstCtx", null);
    a(this, "burstParticles", []);
    a(this, "burstRaf", 0);
    a(this, "contentSlot", null);
    a(this, "onClick", (t) => {
      if (this.getAttribute("disabled") !== null) {
        t.preventDefault(), t.stopPropagation();
        return;
      }
      this.spawnBurst(t.offsetX, t.offsetY), this.dispatchEvent(
        new CustomEvent("lumina-press", { bubbles: !0, composed: !0 })
      );
    });
    a(this, "onKeyDown", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.spawnBurst(
        this.clientWidth / 2,
        this.clientHeight / 2
      ), this.dispatchEvent(
        new CustomEvent("lumina-press", { bubbles: !0, composed: !0 })
      ));
    });
    a(this, "tickBurst", (t) => {
      if (!this.burstCtx || !this.burstCanvas) return;
      const e = this.burstCtx;
      e.clearRect(0, 0, this.clientWidth, this.clientHeight), this.burstParticles = this.burstParticles.filter((i) => i.life < i.maxLife);
      for (const i of this.burstParticles) {
        i.x += i.vx, i.y += i.vy, i.vx *= 0.94, i.vy *= 0.94, i.life += 1;
        const r = 1 - i.life / i.maxLife;
        e.fillStyle = `rgba(${t} / ${r})`, e.beginPath(), e.arc(i.x, i.y, Math.max(0, i.size * r), 0, Math.PI * 2), e.fill();
      }
      this.burstParticles.length > 0 ? this.burstRaf = requestAnimationFrame(() => this.tickBurst(t)) : (this.burstRaf = 0, e.clearRect(0, 0, this.clientWidth, this.clientHeight));
    });
    /* ---------------------------------------------------------------- */
    /* Pointer tracking (aura follow)                                   */
    /* ---------------------------------------------------------------- */
    a(this, "onPointerEnter", () => {
      this.variant === "aura" && this.contentSlot && (this.contentSlot.style.transition = "transform var(--lumina-speed) var(--lumina-ease-spring)");
    });
    a(this, "onPointerLeave", () => {
      this.contentSlot && (this.contentSlot.style.transform = "");
    });
  }
  /* ---------------------------------------------------------------- */
  /* Rendering                                                        */
  /* ---------------------------------------------------------------- */
  render() {
    return `
      <span class="lumina-btn__shell" part="shell">
        <span class="lumina-btn__bg" part="bg"></span>
        <span class="lumina-btn__ring" part="ring" aria-hidden="true"></span>
        <span class="lumina-btn__aura" part="aura" aria-hidden="true"></span>
        <span class="lumina-btn__field" part="field" aria-hidden="true"></span>
        <canvas class="lumina-btn__burst" part="burst" aria-hidden="true"></canvas>
        <span class="lumina-btn__sheen" part="sheen" aria-hidden="true"></span>
        <span class="lumina-btn__content" part="content">
          <slot></slot>
        </span>
      </span>
    `;
  }
  styles() {
    return `
      :host {
        --lumina-btn-h: 48px;
        --lumina-btn-px: 22px;
        display: inline-block;
        position: relative;
        cursor: pointer;
        outline: none;
        border-radius: var(--lumina-radius-pill);
        font-family: var(--lumina-font-sans);
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.02em;
        color: var(--lumina-text);
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      :host([disabled]) { cursor: not-allowed; opacity: 0.5; filter: saturate(0.4); }
      :host([disabled]) .lumina-btn__shell { pointer-events: none; }

      .lumina-btn__shell {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: var(--lumina-btn-h);
        padding: 0 var(--lumina-btn-px);
        border-radius: inherit;
        overflow: hidden;
        transition:
          transform var(--lumina-speed) var(--lumina-ease-spring),
          border-radius var(--lumina-speed) var(--lumina-ease-spring),
          box-shadow var(--lumina-speed) var(--lumina-ease-out);
        transform-style: preserve-3d;
        will-change: transform;
        isolation: isolate;
      }

      .lumina-btn__bg {
        position: absolute;
        inset: 0;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
        border-radius: inherit;
        z-index: 0;
        transition: background var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-btn__ring {
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        pointer-events: none;
        z-index: 1;
        opacity: 0.35;
        background:
          conic-gradient(
            from 0deg,
            transparent 0%,
            var(--lumina-accent) 25%,
            transparent 50%,
            var(--lumina-accent) 75%,
            transparent 100%
          );
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude;
        padding: 1px;
        animation: lumina-btn-spin 6s linear infinite;
        animation-play-state: paused;
      }

      .lumina-btn__aura {
        position: absolute;
        inset: -20%;
        border-radius: inherit;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
        background: radial-gradient(
          60% 60% at 50% 50%,
          rgb(var(--lumina-accent-rgb) / 0.45) 0%,
          transparent 70%
        );
        filter: blur(20px);
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-btn__field {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-btn__burst {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 3;
      }

      .lumina-btn__sheen {
        position: absolute;
        top: 0;
        left: -120%;
        width: 60%;
        height: 100%;
        background: linear-gradient(
          100deg,
          transparent 0%,
          rgb(255 255 255 / 0.25) 50%,
          transparent 100%
        );
        transform: skewX(-18deg);
        pointer-events: none;
        z-index: 2;
        opacity: 0;
      }

      .lumina-btn__content {
        position: relative;
        z-index: 4;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        text-shadow: 0 1px 6px rgb(0 0 0 / 0.25);
      }

      /* ----- Interactions ----- */
      :host(:hover) .lumina-btn__shell {
        transform: translateY(-2px) scale(1.02);
      }
      :host(:hover) .lumina-btn__ring { animation-play-state: running; opacity: 0.7; }
      :host(:hover) .lumina-btn__aura { opacity: calc(0.5 * var(--lumina-intensity)); }
      :host(:hover) .lumina-btn__field { opacity: 1; }
      :host(:hover) .lumina-btn__sheen {
        opacity: 1;
        left: 120%;
        transition: left calc(var(--lumina-speed) * 2.2) var(--lumina-ease-in-out),
                    opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      :host(:active) .lumina-btn__shell {
        transform: translateY(0) scale(0.97);
      }

      :host(:focus-visible) .lumina-btn__ring {
        animation-play-state: running;
        opacity: 1;
      }
      :host(:focus-visible) {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 4px;
      }

      /* ----- Variant: glass ----- */
      :host([variant="glass"]) .lumina-btn__bg {
        background:
          linear-gradient(135deg,
            rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.1)) 0%,
            rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1)) 100%
          );
        box-shadow:
          inset 0 1px 0 0 rgb(255 255 255 / 0.18),
          inset 0 -1px 0 0 rgb(0 0 0 / 0.15),
          var(--lumina-shadow);
      }

      /* ----- Variant: morph ----- */
      :host([variant="morph"]) .lumina-btn__shell {
        border-radius: var(--lumina-radius-pill);
        clip-path: polygon(
          12% 0, 88% 0, 100% 30%, 100% 70%, 88% 100%, 12% 100%, 0 70%, 0 30%
        );
        transition:
          clip-path var(--lumina-speed) var(--lumina-ease-spring),
          transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([variant="morph"]:hover) .lumina-btn__shell {
        clip-path: polygon(
          0 0, 100% 0, 100% 100%, 0 100%
        );
      }
      :host([variant="morph"]) .lumina-btn__bg {
        background:
          linear-gradient(135deg,
            rgb(var(--lumina-accent-rgb) / 0.8),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha))
          );
      }

      /* ----- Variant: neural ----- */
      :host([variant="neural"]) .lumina-btn__field { opacity: 0.7; }
      :host([variant="neural"]) .lumina-btn__bg {
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1));
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }
      :host([variant="neural"]) .lumina-btn__content {
        text-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.8);
      }

      /* ----- Variant: void ----- */
      :host([variant="void"]) .lumina-btn__field { opacity: 1; }
      :host([variant="void"]) .lumina-btn__bg {
        background: rgb(0 0 0 / 0.6);
        backdrop-filter: blur(8px);
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }
      :host([variant="void"]) .lumina-btn__ring {
        opacity: 0.6;
        animation-play-state: running;
      }
      :host([variant="void"]) .lumina-btn__content {
        color: var(--lumina-accent);
        text-shadow:
          0 0 4px var(--lumina-accent),
          -1px 0 1px rgb(255 0 80 / 0.6),
          1px 0 1px rgb(0 200 255 / 0.6);
      }

      /* ----- Variant: aura ----- */
      :host([variant="aura"]) .lumina-btn__aura { opacity: calc(0.3 * var(--lumina-intensity)); }
      :host([variant="aura"]) .lumina-btn__field { opacity: 0.6; }
      :host([variant="aura"]) .lumina-btn__bg {
        background:
          radial-gradient(120% 80% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.3),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%
          );
      }
      :host([variant="aura"]) .lumina-btn__shell {
        animation: lumina-btn-float 4s ease-in-out infinite;
      }

      /* ----- Variant: dimensional ----- */
      :host([variant="dimensional"]) .lumina-btn__shell {
        transform: perspective(400px) rotateX(0deg) translateZ(0);
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"]:hover) .lumina-btn__shell {
        transform: perspective(400px) rotateX(8deg) translateZ(calc(var(--lumina-depth) * 0.5));
      }
      :host([variant="dimensional"]) .lumina-btn__bg {
        background:
          linear-gradient(180deg,
            rgb(var(--lumina-accent-rgb) / 0.85),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha))
          );
        box-shadow:
          0 calc(var(--lumina-depth) * 0.6) 0 calc(var(--lumina-depth) * -0.4)
            rgb(var(--lumina-accent-rgb) / 0.5),
          var(--lumina-shadow);
      }
      :host([variant="dimensional"]) .lumina-btn__bg::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(115deg, transparent 30%, rgb(255 255 255 / 0.25) 50%, transparent 70%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host([variant="dimensional"]:hover) .lumina-btn__bg::after { opacity: 1; }

      /* ----- Animation keyframes ----- */
      @keyframes lumina-btn-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes lumina-btn-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-btn__shell,
        .lumina-btn__ring,
        .lumina-btn__aura,
        .lumina-btn__sheen {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }
  /* ---------------------------------------------------------------- */
  /* Lifecycle                                                        */
  /* ---------------------------------------------------------------- */
  mounted() {
    this.setAttribute("role", "button"), this.setAttribute("tabindex", this.getAttribute("disabled") === "" ? "-1" : "0"), this.contentSlot = this.$$(".lumina-btn__content"), this.addEventListener("click", this.onClick), this.addEventListener("keydown", this.onKeyDown), this.addEventListener("pointerenter", this.onPointerEnter), this.addEventListener("pointerleave", this.onPointerLeave), this.maybeInitField(), this.initBurstCanvas();
  }
  unmounted() {
    this.removeEventListener("click", this.onClick), this.removeEventListener("keydown", this.onKeyDown), this.removeEventListener("pointerenter", this.onPointerEnter), this.removeEventListener("pointerleave", this.onPointerLeave), this.field?.destroy(), this.field = null, cancelAnimationFrame(this.burstRaf);
  }
  onConfigChange(t) {
    t.variant && (this.field?.destroy(), this.field = null, this.maybeInitField()), t.intensity && this.field && (this.field?.destroy(), this.field = null, this.maybeInitField());
  }
  /* ---------------------------------------------------------------- */
  /* Particle field                                                   */
  /* ---------------------------------------------------------------- */
  maybeInitField() {
    const t = this.variant;
    if (!(t === "neural" || t === "void" || t === "aura")) return;
    const i = this.$$(".lumina-btn__field");
    if (!i) return;
    const r = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", s = y(this.intensity);
    this.field = new k(this.shadow.host, {
      count: Math.round(20 * s),
      rgb: r,
      sizeRange: [0.6, 2.2],
      speedRange: [0.15, 0.6],
      lifeRange: [80, 160],
      connect: t === "neural",
      starfield: t === "void",
      hueRange: [200, 320]
    }), this.field.mount(i);
  }
  /* ---------------------------------------------------------------- */
  /* Click burst particles                                            */
  /* ---------------------------------------------------------------- */
  initBurstCanvas() {
    this.burstCanvas = this.$$(".lumina-btn__burst"), this.burstCanvas && (this.burstCtx = this.burstCanvas.getContext("2d"));
  }
  spawnBurst(t, e) {
    if (p() || !this.burstCtx || !this.burstCanvas) return;
    const i = window.devicePixelRatio || 1, r = this.clientWidth, s = this.clientHeight;
    this.burstCanvas.width = r * i, this.burstCanvas.height = s * i, this.burstCanvas.style.width = `${r}px`, this.burstCanvas.style.height = `${s}px`, this.burstCtx.setTransform(i, 0, 0, i, 0, 0);
    const n = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", d = y(this.intensity), u = Math.round(18 * d);
    for (let m = 0; m < u; m++) {
      const b = m / u * Math.PI * 2 + Math.random() * 0.4, x = 2 + Math.random() * 4 * d;
      this.burstParticles.push({
        x: t,
        y: e,
        vx: Math.cos(b) * x,
        vy: Math.sin(b) * x,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        size: 1.5 + Math.random() * 2.5
      });
    }
    this.burstRaf || this.tickBurst(n);
  }
}
a(X, "tagName", "lumina-button");
customElements.get(X.tagName) || customElements.define(X.tagName, X);
class V extends l {
  constructor() {
    super(...arguments);
    a(this, "field", null);
    a(this, "tiltRaf", 0);
    a(this, "targetRX", 0);
    a(this, "targetRY", 0);
    a(this, "currentRX", 0);
    a(this, "currentRY", 0);
    a(this, "onPointerMove", w((t) => {
      const e = this.getBoundingClientRect(), i = (t.clientX - e.left) / e.width * 100, r = (t.clientY - e.top) / e.height * 100;
      if (this.style.setProperty("--lx", `${i}%`), this.style.setProperty("--ly", `${r}%`), this.variant === "dimensional" && !p()) {
        const s = (t.clientX - e.left) / e.width - 0.5, n = (t.clientY - e.top) / e.height - 0.5;
        this.targetRY = s * 18, this.targetRX = -n * 18, this.tiltRaf || this.tickTilt();
      }
    }, 16));
    a(this, "onPointerLeave", () => {
      this.targetRX = 0, this.targetRY = 0, this.tiltRaf || this.tickTilt();
    });
    a(this, "tickTilt", () => {
      this.currentRX += (this.targetRX - this.currentRX) * 0.18, this.currentRY += (this.targetRY - this.currentRY) * 0.18;
      const t = this.$$(".lumina-card");
      t && (t.style.transform = `perspective(800px) rotateX(${this.currentRX}deg) rotateY(${this.currentRY}deg) translateY(-4px)`), Math.abs(this.targetRX - this.currentRX) > 0.05 || Math.abs(this.targetRY - this.currentRY) > 0.05 ? this.tiltRaf = requestAnimationFrame(this.tickTilt) : this.tiltRaf = 0;
    });
  }
  render() {
    return `
      <article class="lumina-card" part="card">
        <div class="lumina-card__glow" part="glow" aria-hidden="true"></div>
        <div class="lumina-card__field" part="field" aria-hidden="true"></div>
        <div class="lumina-card__glass" part="glass">
          <div class="lumina-card__sheen" part="sheen" aria-hidden="true"></div>
          <div class="lumina-card__inner" part="inner">
            <slot name="media"></slot>
            <div class="lumina-card__body" part="body">
              <slot name="title"></slot>
              <slot name="subtitle"></slot>
              <slot></slot>
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host {
        --lumina-card-radius: var(--lumina-radius-lg);
        display: block;
        position: relative;
        border-radius: var(--lumina-card-radius);
        color: var(--lumina-text);
        perspective: 800px;
      }

      .lumina-card {
        position: relative;
        display: block;
        border-radius: var(--lumina-card-radius);
        transform-style: preserve-3d;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
        will-change: transform;
      }

      .lumina-card__glow {
        position: absolute;
        inset: -10%;
        border-radius: inherit;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
        background: radial-gradient(
          400px circle at var(--lx, 50%) var(--ly, 50%),
          rgb(var(--lumina-accent-rgb) / calc(0.45 * var(--lumina-intensity))),
          transparent 60%
        );
        filter: blur(30px);
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-card__field {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-card__glass {
        position: relative;
        z-index: 2;
        border-radius: inherit;
        overflow: hidden;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(18px) saturate(1.5);
        -webkit-backdrop-filter: blur(18px) saturate(1.5);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 0 0 rgb(255 255 255 / 0.10),
          var(--lumina-shadow);
        transform: translateZ(0);
      }

      .lumina-card__sheen {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(
          300px circle at var(--lx, 50%) var(--ly, 50%),
          rgb(255 255 255 / calc(0.18 * var(--lumina-intensity))),
          transparent 50%
        );
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
        mix-blend-mode: overlay;
      }

      .lumina-card__inner {
        position: relative;
        padding: 24px;
        transform: translateZ(20px);
      }

      .lumina-card__body {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      ::slotted([slot="title"]) {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      ::slotted([slot="subtitle"]) {
        margin: 0;
        font-size: 12px;
        font-weight: 500;
        color: var(--lumina-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      ::slotted([slot="media"]) {
        display: block;
        width: 100%;
        border-radius: calc(var(--lumina-card-radius) - 6px);
        margin-bottom: 12px;
      }
      ::slotted([slot="footer"]) {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--lumina-border);
      }

      /* Hover state */
      :host(:hover) .lumina-card__glow,
      :host(:hover) .lumina-card__sheen { opacity: 1; }
      :host(:hover) .lumina-card {
        transform: translateY(-4px);
      }

      /* ----- Variant: glass (default styling enhanced) ----- */
      :host([variant="glass"]) .lumina-card__glass {
        background:
          linear-gradient(135deg,
            rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.05)) 0%,
            rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)) 100%
          );
      }

      /* ----- Variant: morph ----- */
      :host([variant="morph"]) .lumina-card {
        clip-path: polygon(
          0 8%, 8% 0, 92% 0, 100% 8%,
          100% 92%, 92% 100%, 8% 100%, 0 92%
        );
        border-radius: 0;
        transition: clip-path var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([variant="morph"]:hover) .lumina-card {
        clip-path: polygon(
          0 0, 100% 0, 100% 100%, 0 100%
        );
      }
      :host([variant="morph"]) .lumina-card__glass { border-radius: 0; }

      /* ----- Variant: neural ----- */
      :host([variant="neural"]) .lumina-card__field { opacity: 0.4; }
      :host([variant="neural"]) .lumina-card__glass {
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1));
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }
      :host([variant="neural"]) .lumina-card__inner {
        text-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.5);
      }

      /* ----- Variant: void ----- */
      :host([variant="void"]) .lumina-card__field { opacity: 0.8; }
      :host([variant="void"]) .lumina-card__glass {
        background: rgb(0 0 0 / 0.5);
        backdrop-filter: blur(6px);
        border-color: rgb(var(--lumina-accent-rgb) / 0.2);
      }

      /* ----- Variant: aura ----- */
      :host([variant="aura"]) .lumina-card__field { opacity: 0.4; }
      :host([variant="aura"]) .lumina-card__glow {
        opacity: calc(0.25 * var(--lumina-intensity));
      }
      :host([variant="aura"]) .lumina-card {
        animation: lumina-card-float 5s ease-in-out infinite;
      }
      :host([variant="aura"]) .lumina-card__glass {
        background:
          radial-gradient(120% 100% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.18),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%
          );
      }

      /* ----- Variant: dimensional ----- */
      :host([variant="dimensional"]) .lumina-card {
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"]) .lumina-card__inner {
        transform: translateZ(40px);
      }
      :host([variant="dimensional"]) .lumina-card__glass::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(135deg,
          rgb(var(--lumina-accent-rgb) / 0.18),
          transparent 60%
        );
        pointer-events: none;
      }
      :host([variant="dimensional"]) .lumina-card__glass {
        box-shadow:
          0 calc(var(--lumina-depth) * 0.5) 0 calc(var(--lumina-depth) * -0.3)
            rgb(var(--lumina-accent-rgb) / 0.4),
          var(--lumina-shadow);
      }

      @keyframes lumina-card-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-card,
        .lumina-card__glow,
        .lumina-card__sheen {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }
  mounted() {
    this.addEventListener("pointermove", this.onPointerMove), this.addEventListener("pointerleave", this.onPointerLeave), this.maybeInitField();
  }
  unmounted() {
    this.removeEventListener("pointermove", this.onPointerMove), this.removeEventListener("pointerleave", this.onPointerLeave), this.field?.destroy(), this.field = null, cancelAnimationFrame(this.tiltRaf);
  }
  onConfigChange(t) {
    (t.variant || t.intensity) && (this.field?.destroy(), this.field = null, this.maybeInitField());
  }
  maybeInitField() {
    const t = this.variant;
    if (!(t === "neural" || t === "void" || t === "aura")) return;
    const i = this.$$(".lumina-card__field");
    if (!i) return;
    const r = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", s = y(this.intensity);
    this.field = new k(this.shadow.host, {
      count: Math.round(40 * s),
      rgb: r,
      sizeRange: [0.6, 2.2],
      speedRange: [0.15, 0.5],
      lifeRange: [120, 220],
      connect: t === "neural",
      starfield: t === "void"
    }), this.field.mount(i);
  }
}
a(V, "tagName", "lumina-card");
customElements.get(V.tagName) || customElements.define(V.tagName, V);
class H extends l {
  constructor() {
    super(...arguments);
    a(this, "_checked", !1);
    a(this, "_indeterminate", !1);
    a(this, "box", null);
    a(this, "onClick", () => {
      this._indeterminate ? (this._indeterminate = !1, this.removeAttribute("indeterminate"), this._checked = !0, this.setAttribute("checked", "")) : (this._checked = !this._checked, this._checked ? this.setAttribute("checked", "") : this.removeAttribute("checked")), this.updateState(), p() || (this.box?.setAttribute("data-ripple", ""), setTimeout(() => this.box?.removeAttribute("data-ripple"), 600)), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { checked: this._checked, indeterminate: this._indeterminate } }));
    });
    a(this, "onKeydown", (t) => {
      (t.key === " " || t.key === "Enter") && (t.preventDefault(), this.onClick());
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "checked", "indeterminate"];
  }
  get checked() {
    return this._checked;
  }
  set checked(t) {
    this._checked = t, t ? this.setAttribute("checked", "") : this.removeAttribute("checked"), this.updateState();
  }
  get indeterminate() {
    return this._indeterminate;
  }
  set indeterminate(t) {
    this._indeterminate = t, t ? this.setAttribute("indeterminate", "") : this.removeAttribute("indeterminate"), this.updateState();
  }
  render() {
    return `
      <div class="lmcb" part="box">
        <input class="lmcb__input" type="checkbox" />
        <span class="lmcb__box" part="box">
          <span class="lmcb__check" part="check">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12l5 5 9-9" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span class="lmcb__indeterminate" aria-hidden="true"></span>
          <span class="lmcb__ripple" aria-hidden="true"></span>
        </span>
        <span class="lmcb__label" part="label"><slot></slot></span>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: inline-flex; align-items: center; gap: 8px; font-family: var(--lumina-font-sans); color: var(--lumina-text); cursor: pointer; user-select: none; }
      .lmcb { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; position: relative; }
      .lmcb__input { position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0; }
      .lmcb__box { position: relative; width: 22px; height: 22px; border-radius: 6px; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 2px solid var(--lumina-border); transition: background var(--lumina-speed) var(--lumina-ease-out), border-color var(--lumina-speed) var(--lumina-ease-out); flex-shrink: 0; overflow: visible; }
      .lmcb__check { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; opacity: 0; transform: scale(0) rotate(-45deg); transition: opacity var(--lumina-speed) var(--lumina-ease-spring), transform var(--lumina-speed) var(--lumina-ease-spring); }
      .lmcb__indeterminate { position: absolute; top: 50%; left: 3px; right: 3px; height: 2px; background: #fff; transform: translateY(-50%) scaleX(0); transition: transform var(--lumina-speed) var(--lumina-ease-spring); border-radius: 1px; }
      :host([checked]) .lmcb__box { background: var(--lumina-accent); border-color: var(--lumina-accent); box-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.5); }
      :host([checked]) .lmcb__check { opacity: 1; transform: scale(1) rotate(0); }
      :host([indeterminate]) .lmcb__box { background: var(--lumina-accent); border-color: var(--lumina-accent); }
      :host([indeterminate]) .lmcb__indeterminate { transform: translateY(-50%) scaleX(1); }
      .lmcb__ripple { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; overflow: hidden; }
      .lmcb__ripple::after { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: rgb(var(--lumina-accent-rgb) / 0.4); transform: translate(-50%, -50%); }
      .lmcb__box[data-ripple] .lmcb__ripple::after { animation: lmcb-ripple 0.6s var(--lumina-ease-out); }
      @keyframes lmcb-ripple { 0% { width: 0; height: 0; opacity: 0.6; } 100% { width: 60px; height: 60px; opacity: 0; } }
      .lmcb__label { font-size: 14px; }
      :host(:focus-visible) .lmcb__box { outline: 2px solid var(--lumina-accent); outline-offset: 2px; }
      :host([variant="morph"]) .lmcb__box { border-radius: 50%; }
      :host([variant="morph"][checked]) .lmcb__box { border-radius: 6px; }
      @media (prefers-reduced-motion: reduce) { .lmcb__box, .lmcb__check, .lmcb__indeterminate { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this._checked = this.hasAttribute("checked"), this._indeterminate = this.hasAttribute("indeterminate"), this.box = this.$$(".lmcb__box"), this.setAttribute("role", "checkbox"), this.setAttribute("tabindex", "0"), this.updateState(), this.$$(".lmcb")?.addEventListener("click", this.onClick), this.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
    this.removeEventListener("keydown", this.onKeydown);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "checked" ? (this._checked = i !== null, this.updateState()) : t === "indeterminate" && (this._indeterminate = i !== null, this.updateState());
  }
  updateState() {
    this.setAttribute("aria-checked", this._indeterminate ? "mixed" : String(this._checked));
  }
}
a(H, "tagName", "lumina-checkbox");
customElements.get(H.tagName) || customElements.define(H.tagName, H);
class O extends l {
  constructor() {
    super(...arguments);
    a(this, "_removable", !0);
    a(this, "_selected", !1);
    a(this, "_selectable", !1);
    a(this, "onChipClick", () => {
      this._selectable && (this._selected = !this._selected, this._selected ? this.setAttribute("selected", "") : this.removeAttribute("selected"), this.setAttribute("aria-pressed", String(this._selected)), this.dispatchEvent(
        new CustomEvent("lumina-select", {
          bubbles: !0,
          composed: !0,
          detail: { selected: this._selected }
        })
      ));
    });
    a(this, "onKeydown", (t) => {
      this._selectable && (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.onChipClick());
    });
  }
  static get observedAttributes() {
    return [
      ...l.observedAttributes,
      "removable",
      "selected",
      "selectable"
    ];
  }
  get removable() {
    return this._removable;
  }
  set removable(t) {
    this._removable = t, t ? this.setAttribute("removable", "") : this.removeAttribute("removable"), this.applyRemoveButton();
  }
  get selected() {
    return this._selected;
  }
  set selected(t) {
    this._selected = t, t ? this.setAttribute("selected", "") : this.removeAttribute("selected");
  }
  get selectable() {
    return this._selectable;
  }
  set selectable(t) {
    this._selectable = t, t ? this.setAttribute("selectable", "") : this.removeAttribute("selectable"), this.applyRole();
  }
  render() {
    return `
      <span class="lmc" part="chip">
        <span class="lmc__check" aria-hidden="true">✓</span>
        <span class="lmc__icon" part="icon"><slot name="icon"></slot></span>
        <span class="lmc__label" part="label"><slot></slot></span>
        <button class="lmc__remove" part="remove-button" type="button" aria-label="Remover">×</button>
      </span>
    `;
  }
  styles() {
    return `
      :host {
        display: inline-flex;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lmc {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        padding-left: 14px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--lumina-border);
        font-size: 13px;
        font-weight: 600;
        color: var(--lumina-text);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 0.08),
          var(--lumina-shadow);
        cursor: default;
        transition:
          transform var(--lumina-speed) var(--lumina-ease-spring),
          background var(--lumina-speed) var(--lumina-ease-out),
          border-color var(--lumina-speed) var(--lumina-ease-out),
          opacity var(--lumina-speed) var(--lumina-ease-out);
        will-change: transform, opacity;
      }

      .lmc.is-removing {
        animation: lmc-remove calc(var(--lumina-speed) * 1.5) var(--lumina-ease-in-out) forwards;
      }
      @keyframes lmc-remove {
        0%   { opacity: 1; transform: scale(1); }
        50%  { opacity: 0.6; transform: scale(0.85); }
        100% { opacity: 0; transform: scale(0.4); margin-left: -50px; padding: 0; width: 0; }
      }

      :host([selectable]) .lmc { cursor: pointer; }
      :host([selectable]:hover) .lmc {
        background: rgb(var(--lumina-accent-rgb) / 0.12);
        border-color: rgb(var(--lumina-accent-rgb) / 0.35);
        transform: translateY(-1px);
      }
      :host([selectable]:active) .lmc { transform: scale(0.96); }

      /* Selected state */
      :host([selected]) .lmc {
        background: linear-gradient(135deg,
          rgb(var(--lumina-accent-rgb) / 0.35),
          rgb(var(--lumina-accent-rgb) / 0.18)
        );
        border-color: rgb(var(--lumina-accent-rgb) / 0.6);
        color: #fff;
        box-shadow:
          0 0 16px rgb(var(--lumina-accent-rgb) / 0.35),
          inset 0 1px 0 rgb(255 255 255 / 0.15);
      }

      .lmc__check {
        display: none;
        font-size: 11px;
        font-weight: 800;
        color: #fff;
        width: 14px;
        height: 14px;
        background: var(--lumina-accent);
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        animation: lmc-check-in var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([selected]) .lmc__check { display: inline-flex; }
      @keyframes lmc-check-in {
        from { transform: scale(0); opacity: 0; }
        to   { transform: scale(1); opacity: 1; }
      }

      .lmc__icon {
        display: inline-flex;
        align-items: center;
        font-size: 14px;
        opacity: 0.8;
      }
      .lmc__icon:empty { display: none; }

      .lmc__label { white-space: nowrap; }

      .lmc__remove {
        appearance: none;
        border: 0;
        background: rgb(255 255 255 / 0.06);
        color: var(--lumina-text-muted);
        width: 16px;
        height: 16px;
        border-radius: 50%;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        margin-left: 2px;
        transition: background var(--lumina-speed) var(--lumina-ease-out),
                    color var(--lumina-speed) var(--lumina-ease-out),
                    transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmc__remove:hover {
        background: rgb(239 68 68 / 0.4);
        color: #fff;
        transform: rotate(90deg) scale(1.1);
      }
      .lmc__remove:focus-visible {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 2px;
      }
      :host(:not([removable])) .lmc__remove { display: none; }

      /* Variant: neural */
      :host([variant="neural"]) .lmc {
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }
      :host([variant="neural"]:hover) .lmc {
        box-shadow:
          0 0 20px rgb(var(--lumina-accent-rgb) / 0.4),
          inset 0 1px 0 rgb(255 255 255 / 0.08);
      }

      /* Variant: aura — floating animation */
      :host([variant="aura"]) .lmc {
        animation: lmc-float 4s ease-in-out infinite;
        background:
          radial-gradient(120% 100% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.18),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%
          );
      }
      @keyframes lmc-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }

      /* Variant: minimal — flat */
      :host([variant="minimal"]) .lmc {
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: none;
        border-color: rgb(var(--lumina-accent-rgb) / 0.2);
      }

      @media (prefers-reduced-motion: reduce) {
        .lmc, .lmc__remove, .lmc__check { animation: none !important; transition: none !important; }
      }
    `;
  }
  mounted() {
    this._removable = this.hasAttribute("removable"), this.hasAttribute("removable") || this.setAttribute("removable", ""), this._selected = this.hasAttribute("selected"), this._selectable = this.hasAttribute("selectable"), this.applyRole(), this.applyRemoveButton(), this.$$(".lmc__remove")?.addEventListener("click", (t) => {
      t.stopPropagation(), this.removeWithAnimation();
    }), this._selectable && (this.addEventListener("click", this.onChipClick), this.addEventListener("keydown", this.onKeydown));
  }
  unmounted() {
    this.removeEventListener("click", this.onChipClick), this.removeEventListener("keydown", this.onKeydown);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "removable" ? (this._removable = i !== null, this.applyRemoveButton()) : t === "selected" ? this._selected = i !== null : t === "selectable" && (this._selectable = i !== null, this.applyRole());
  }
  applyRole() {
    this._selectable ? (this.getAttribute("role") !== "button" && this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.setAttribute("aria-pressed", String(this._selected))) : (this.removeAttribute("role"), this.removeAttribute("tabindex"), this.removeAttribute("aria-pressed"));
  }
  applyRemoveButton() {
    const t = this.$$(".lmc__remove");
    t && (t.style.display = this._removable ? "" : "none");
  }
  /** Public API: trigger the remove animation and emit lumina-remove. */
  removeWithAnimation() {
    if (this.dispatchEvent(new CustomEvent("lumina-remove", { bubbles: !0, composed: !0 })), p()) {
      this.remove();
      return;
    }
    const t = this.$$(".lmc");
    t ? (t.classList.add("is-removing"), setTimeout(() => this.remove(), 400)) : this.remove();
  }
}
a(O, "tagName", "lumina-chip");
customElements.get(O.tagName) || customElements.define(O.tagName, O);
function Re(c) {
  const o = parseInt(c.slice(1, 3), 16) / 255, t = parseInt(c.slice(3, 5), 16) / 255, e = parseInt(c.slice(5, 7), 16) / 255, i = Math.max(o, t, e), r = Math.min(o, t, e);
  let s = 0, n = 0;
  const d = (i + r) / 2;
  if (i !== r) {
    const u = i - r;
    switch (n = d > 0.5 ? u / (2 - i - r) : u / (i + r), i) {
      case o:
        s = (t - e) / u + (t < e ? 6 : 0);
        break;
      case t:
        s = (e - o) / u + 2;
        break;
      case e:
        s = (o - t) / u + 4;
        break;
    }
    s /= 6;
  }
  return [s * 360, n * 100, d * 100];
}
function $(c, o, t) {
  o /= 100, t /= 100;
  const e = (n) => (n + c / 30) % 12, i = o * Math.min(t, 1 - t), r = (n) => t - i * Math.max(-1, Math.min(e(n) - 3, Math.min(9 - e(n), 1))), s = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
  return `#${s(r(0))}${s(r(8))}${s(r(4))}`;
}
class B extends l {
  constructor() {
    super(...arguments);
    a(this, "_value", "#7c5cff");
    a(this, "trigger", null);
    a(this, "panel", null);
    a(this, "swatch", null);
    a(this, "hueSlider", null);
    a(this, "lightSlider", null);
    a(this, "history", []);
    a(this, "_open", !1);
    a(this, "onDocClick", (t) => {
      !this.contains(t.target) && this._open && this.toggle();
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "value"];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = t, this.setAttribute("value", t), this.updatePreview();
  }
  render() {
    return `
      <div class="lmcp" part="trigger">
        <button class="lmcp__trigger" part="trigger" type="button">
          <span class="lmcp__swatch" part="swatch"></span>
          <span class="lmcp__value"></span>
        </button>
        <div class="lmcp__panel" part="panel" aria-hidden="true">
          <div class="lmcp__preview" part="preview"></div>
          <div class="lmcp__control">
            <label>Hue <input class="lmcp__hue" type="range" min="0" max="360" value="260" /></label>
            <label>Sat <input class="lmcp__sat" type="range" min="0" max="100" value="100" /></label>
            <label>Light <input class="lmcp__light" type="range" min="0" max="100" value="68" /></label>
          </div>
          <div class="lmcp__harmony" data-harmony></div>
          <div class="lmcp__history" data-history></div>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmcp__trigger { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: var(--lumina-radius-md); border: 1px solid var(--lumina-border); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: pointer; color: inherit; font: 600 13px var(--lumina-font-sans); }
      .lmcp__trigger:hover { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmcp__swatch { width: 20px; height: 20px; border-radius: 4px; border: 1px solid var(--lumina-border); transition: background 0.2s, box-shadow 0.2s; }
      .lmcp__panel { position: absolute; top: calc(100% + 6px); left: 0; z-index: 1000; min-width: 240px; padding: 14px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); opacity: 0; transform: scale(0.92) translateY(-8px); pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host([data-open]) .lmcp__panel { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
      .lmcp__preview { width: 100%; height: 60px; border-radius: var(--lumina-radius-md); margin-bottom: 12px; transition: background 0.2s; box-shadow: 0 0 20px var(--lmcp-current, var(--lumina-accent)); }
      .lmcp__control { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
      .lmcp__control label { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--lumina-text-muted); }
      .lmcp__control input[type="range"] { flex: 1; }
      .lmcp__harmony { margin-bottom: 12px; }
      .lmcp__harmony-label { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lumina-text-muted); margin-bottom: 6px; }
      .lmcp__harmony-swatches { display: flex; gap: 4px; }
      .lmcp__harmony-swatch { width: 28px; height: 28px; border-radius: 6px; cursor: pointer; border: 1px solid var(--lumina-border); transition: transform 0.15s; }
      .lmcp__harmony-swatch:hover { transform: scale(1.15); }
      .lmcp__history { display: flex; gap: 4px; flex-wrap: wrap; }
      .lmcp__history-swatch { width: 20px; height: 20px; border-radius: 4px; cursor: pointer; border: 1px solid var(--lumina-border); }
      .lmcp__history-swatch:hover { transform: scale(1.2); }
      :host([variant="holo"]) .lmcp__preview { background: linear-gradient(135deg, var(--lmcp-current), rgb(255 0 128 / 0.5), rgb(0 200 255 / 0.5)) !important; }
      @media (prefers-reduced-motion: reduce) { .lmcp__panel, .lmcp__swatch { transition: none !important; } }
    `;
  }
  mounted() {
    this._value = this.getAttribute("value") ?? "#7c5cff", this.trigger = this.$$(".lmcp__trigger"), this.panel = this.$$(".lmcp__panel"), this.swatch = this.$$(".lmcp__swatch"), this.hueSlider = this.$$(".lmcp__hue"), this.lightSlider = this.$$(".lmcp__light"), this.updatePreview(), this.trigger?.addEventListener("click", () => this.toggle()), this.hueSlider?.addEventListener("input", () => this.updateFromSliders()), this.$$(".lmcp__sat")?.addEventListener("input", () => this.updateFromSliders()), this.lightSlider?.addEventListener("input", () => this.updateFromSliders()), document.addEventListener("click", this.onDocClick), this.renderHistory();
  }
  unmounted() {
    document.removeEventListener("click", this.onDocClick);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "value" && (this._value = i ?? "#7c5cff", this.updatePreview());
  }
  toggle() {
    this._open = !this._open, this._open ? (this.setAttribute("data-open", ""), this.updateSliders(), this.renderHarmony()) : this.removeAttribute("data-open");
  }
  updatePreview() {
    this.swatch && (this.swatch.style.background = this._value);
    const t = this.$$(".lmcp__value");
    t && (t.textContent = this._value);
    const e = this.$$(".lmcp__preview");
    e && (e.style.background = this._value, e.style.setProperty("--lmcp-current", this._value)), this.style.setProperty("--lmcp-current", this._value);
  }
  updateSliders() {
    const [t, e, i] = Re(this._value);
    this.hueSlider && (this.hueSlider.value = String(Math.round(t)));
    const r = this.$$(".lmcp__sat");
    r && (r.value = String(Math.round(e))), this.lightSlider && (this.lightSlider.value = String(Math.round(i)));
  }
  updateFromSliders() {
    const t = parseFloat(this.hueSlider?.value ?? "0"), e = parseFloat(this.$$(".lmcp__sat")?.value ?? "100"), i = parseFloat(this.lightSlider?.value ?? "68");
    this._value = $(t, e, i), this.setAttribute("value", this._value), this.updatePreview(), this.renderHarmony(), this.dispatchEvent(new CustomEvent("lumina-color-change", { bubbles: !0, composed: !0, detail: { value: this._value, h: t, s: e, l: i } }));
  }
  renderHarmony() {
    const t = this.$$(".lmcp__harmony");
    if (!t) return;
    const [e, i, r] = Re(this._value), s = [
      { label: "Comp", colors: [$((e + 180) % 360, i, r)] },
      { label: "Analog", colors: [$((e + 30) % 360, i, r), $((e + 330) % 360, i, r)] },
      { label: "Triad", colors: [$((e + 120) % 360, i, r), $((e + 240) % 360, i, r)] }
    ];
    t.innerHTML = '<div class="lmcp__harmony-label">Paletas harmônicas</div>', s.forEach((n) => {
      const d = document.createElement("div");
      d.className = "lmcp__harmony-swatches", d.style.marginBottom = "4px", n.colors.forEach((u) => {
        const m = document.createElement("div");
        m.className = "lmcp__harmony-swatch", m.style.background = u, m.title = u, m.addEventListener("click", () => {
          this.value = u, this.addToHistory(u), this.dispatchEvent(new CustomEvent("lumina-color-change", { bubbles: !0, composed: !0, detail: { value: u } }));
        }), d.appendChild(m);
      }), t.appendChild(d);
    });
  }
  addToHistory(t) {
    this.history = [t, ...this.history.filter((e) => e !== t)].slice(0, 8), this.renderHistory();
  }
  renderHistory() {
    const t = this.$$(".lmcp__history");
    t && (t.innerHTML = "", this.history.length !== 0 && this.history.forEach((e) => {
      const i = document.createElement("div");
      i.className = "lmcp__history-swatch", i.style.background = e, i.title = e, i.addEventListener("click", () => {
        this.value = e, this.dispatchEvent(new CustomEvent("lumina-color-change", { bubbles: !0, composed: !0, detail: { value: e } }));
      }), t.appendChild(i);
    }));
  }
}
a(B, "tagName", "lumina-color-picker");
customElements.get(B.tagName) || customElements.define(B.tagName, B);
class q extends l {
  constructor() {
    super(...arguments);
    a(this, "_shortcut", "");
    a(this, "onClick", () => {
      this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
    });
    a(this, "onKeydown", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.onClick());
    });
    a(this, "globalKeydown", (t) => {
      if (!this._shortcut) return;
      const e = this._shortcut.toLowerCase().split("+").map((u) => u.trim()), i = e[e.length - 1], r = e.includes("cmd") || e.includes("meta") || e.includes("⌘"), s = e.includes("ctrl") || e.includes("control"), n = e.includes("shift"), d = e.includes("alt") || e.includes("option");
      t.key.toLowerCase() === i && !r == !t.metaKey && !s == !t.ctrlKey && !n == !t.shiftKey && !d == !t.altKey && (t.preventDefault(), this.dispatchEvent(new CustomEvent("lumina-shortcut", { bubbles: !0, composed: !0, detail: { shortcut: this._shortcut } })), this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 })));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "shortcut"];
  }
  get shortcut() {
    return this._shortcut;
  }
  set shortcut(t) {
    this._shortcut = t, this.setAttribute("shortcut", t), this.renderShortcut();
  }
  render() {
    return `
      <button class="lmcb" part="button" type="button">
        <span class="lmcb__bg" aria-hidden="true"></span>
        <span class="lmcb__sheen" aria-hidden="true"></span>
        <span class="lmcb__label"><slot></slot></span>
        <span class="lmcb__shortcut" part="shortcut"></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmcb {
        position: relative; display: inline-flex; align-items: center; gap: 12px;
        height: 40px; padding: 0 14px; border: 0; background: transparent; color: inherit;
        font: 500 13px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-md);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmcb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out), border-color var(--lumina-speed) var(--lumina-ease-out); }
      .lmcb__sheen { position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(100deg, transparent 0%, rgb(var(--lumina-accent-rgb) / 0.4) 50%, transparent 100%); transform: skewX(-18deg); pointer-events: none; z-index: 1; opacity: 0; }
      .lmcb__label { position: relative; z-index: 2; white-space: nowrap; }
      .lmcb__shortcut { position: relative; z-index: 2; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: rgb(var(--lumina-accent-rgb) / 0.15); color: var(--lumina-accent); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.3); }
      .lmcb__shortcut:empty { display: none; }
      :host(:hover) .lmcb { transform: translateY(-1px); }
      :host(:hover) .lmcb__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); background: rgb(var(--lumina-accent-rgb) / 0.1); }
      :host(:hover) .lmcb__sheen { opacity: 1; left: 120%; transition: left calc(var(--lumina-speed) * 1.5) var(--lumina-ease-in-out), opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:active) .lmcb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="minimal"]) .lmcb__bg { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border-color: transparent; }
      :host([variant="minimal"]:hover) .lmcb__bg { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      @media (prefers-reduced-motion: reduce) { .lmcb, .lmcb__sheen { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this._shortcut = this.getAttribute("shortcut") ?? "", this.renderShortcut(), this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.$$(".lmcb")?.addEventListener("click", this.onClick), this.$$(".lmcb")?.addEventListener("keydown", this.onKeydown), this._shortcut && this.registerShortcut();
  }
  unmounted() {
    document.removeEventListener("keydown", this.globalKeydown);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "shortcut" && (this._shortcut = i ?? "", this.renderShortcut());
  }
  renderShortcut() {
    const t = this.$$(".lmcb__shortcut");
    t && (t.textContent = this._shortcut);
  }
  registerShortcut() {
    document.addEventListener("keydown", this.globalKeydown);
  }
}
a(q, "tagName", "lumina-command-button");
customElements.get(q.tagName) || customElements.define(q.tagName, q);
class K extends l {
  static get observedAttributes() {
    return [...l.observedAttributes];
  }
  render() {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        padding: 8px;
        border-radius: var(--lumina-radius-pill);
      }
      .lmc__glow {
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))), transparent 60%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      .lmc__inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow { transition: none !important; }
      }
`;
  }
  mounted() {
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
  /** Dispatch a CustomEvent with composed bubbling. */
  emit(o, t) {
    this.dispatchEvent(new CustomEvent(o, { bubbles: !0, composed: !0, detail: t }));
  }
  /** For overlay-style components: open/close helpers. */
  open() {
    this.setAttribute("open", ""), this.setAttribute("data-open", ""), this.emit("lumina-open");
  }
  close() {
    this.removeAttribute("open"), this.removeAttribute("data-open"), this.emit("lumina-close");
  }
}
a(K, "tagName", "lumina-command-palette");
customElements.get(K.tagName) || customElements.define(K.tagName, K);
class j extends l {
  constructor() {
    super(...arguments);
    a(this, "_open", !1);
    a(this, "_title", "");
    a(this, "_message", "");
    a(this, "_confirmLabel", "Confirmar");
    a(this, "_cancelLabel", "Cancelar");
    a(this, "_destructive", !1);
    a(this, "prevFocus", null);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "open", "title", "message", "confirm-label", "cancel-label", "destructive"];
  }
  get open() {
    return this._open;
  }
  set open(t) {
    t ? this.show() : this.hide();
  }
  render() {
    return `
      <div class="lmcd" part="backdrop" aria-hidden="true"></div>
      <div class="lmcd__dialog" part="dialog" role="alertdialog" aria-modal="true">
        <div class="lmcd__bg" aria-hidden="true"></div>
        <div class="lmcd__icon" part="icon" aria-hidden="true">⚠</div>
        <h2 class="lmcd__title" part="title"></h2>
        <p class="lmcd__message" part="message"></p>
        <label class="lmcd__dont-show"><input type="checkbox" class="lmcd__checkbox" /> Não mostrar novamente</label>
        <div class="lmcd__actions" part="actions">
          <button class="lmcd__cancel" type="button"></button>
          <button class="lmcd__confirm" type="button"></button>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: contents; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmcd { position: fixed; inset: 0; background: rgb(0 0 0 / 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); opacity: 0; pointer-events: none; z-index: 999; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmcd { opacity: 1; pointer-events: auto; }
      .lmcd__dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.85); opacity: 0; pointer-events: none; z-index: 1000; min-width: 380px; max-width: 90vw; padding: 32px; border-radius: var(--lumina-radius-lg); text-align: center; transition: transform calc(var(--lumina-speed) * 1.2) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmcd__dialog { transform: translate(-50%, -50%) scale(1); opacity: 1; pointer-events: auto; }
      .lmcd__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(24px) saturate(1.6); -webkit-backdrop-filter: blur(24px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 30px 80px -20px rgb(0 0 0 / 0.6); z-index: 0; }
      .lmcd__icon { position: relative; z-index: 1; font-size: 40px; margin-bottom: 12px; color: #f59e0b; }
      :host([destructive]) .lmcd__icon { color: #ef4444; }
      .lmcd__title { position: relative; z-index: 1; margin: 0 0 8px; font-size: 20px; font-weight: 700; }
      .lmcd__message { position: relative; z-index: 1; margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: rgba(245,245,255,0.7); }
      .lmcd__dont-show { position: relative; z-index: 1; display: flex; align-items: center; gap: 8px; justify-content: center; margin-bottom: 20px; font-size: 12px; color: var(--lumina-text-muted); cursor: pointer; }
      .lmcd__checkbox { accent-color: var(--lumina-accent); }
      .lmcd__actions { position: relative; z-index: 1; display: flex; gap: 12px; justify-content: center; }
      .lmcd__cancel, .lmcd__confirm { appearance: none; border: 1px solid var(--lumina-border); padding: 10px 24px; border-radius: var(--lumina-radius-pill); font: 600 14px var(--lumina-font-sans); cursor: pointer; transition: all var(--lumina-speed) var(--lumina-ease-spring); }
      .lmcd__cancel { background: transparent; color: var(--lumina-text-muted); }
      .lmcd__cancel:hover { background: rgb(255 255 255 / 0.06); color: var(--lumina-text); transform: translateY(-1px); }
      .lmcd__confirm { background: var(--lumina-accent); border-color: var(--lumina-accent); color: #fff; box-shadow: 0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4); }
      .lmcd__confirm:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 24px rgb(var(--lumina-accent-rgb) / 0.6); }
      :host([destructive]) .lmcd__confirm { background: #ef4444; border-color: #ef4444; box-shadow: 0 4px 16px rgb(239 68 68 / 0.4); }
      :host([destructive]) .lmcd__confirm:hover { box-shadow: 0 8px 24px rgb(239 68 68 / 0.6); }
      .lmcd__confirm:active, .lmcd__cancel:active { transform: scale(0.96); }
      .lmcd__confirm:focus-visible, .lmcd__cancel:focus-visible { outline: 2px solid var(--lumina-accent); outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) { .lmcd, .lmcd__dialog { transition: none !important; } }
    `;
  }
  mounted() {
    this._title = this.getAttribute("title") ?? "Confirmar ação", this._message = this.getAttribute("message") ?? "Tem certeza?", this._confirmLabel = this.getAttribute("confirm-label") ?? "Confirmar", this._cancelLabel = this.getAttribute("cancel-label") ?? "Cancelar", this._destructive = this.hasAttribute("destructive"), this.updateContent(), this.$$(".lmcd").addEventListener("click", (t) => {
      t.target === this.$$(".lmcd") && this.hide();
    }), this.$$(".lmcd__cancel").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("lumina-cancel", { bubbles: !0, composed: !0 })), this.hide();
    }), this.$$(".lmcd__confirm").addEventListener("click", () => {
      const t = this.$$(".lmcd__checkbox")?.checked ?? !1;
      this.dispatchEvent(new CustomEvent("lumina-confirm", { bubbles: !0, composed: !0, detail: { dontShowAgain: t } })), this.hide();
    }), document.addEventListener("keydown", (t) => {
      t.key === "Escape" && this._open && (this.dispatchEvent(new CustomEvent("lumina-cancel", { bubbles: !0, composed: !0 })), this.hide());
    }), this.hasAttribute("open") && requestAnimationFrame(() => this.show());
  }
  unmounted() {
    document.body.style.overflow = "";
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "open" ? i !== null ? this.show() : this.hide() : t === "title" ? this._title = i ?? "" : t === "message" ? this._message = i ?? "" : t === "confirm-label" ? this._confirmLabel = i ?? "Confirmar" : t === "cancel-label" ? this._cancelLabel = i ?? "Cancelar" : t === "destructive" && (this._destructive = i !== null, this._destructive && this.setAttribute("destructive", "")), this.updateContent();
  }
  updateContent() {
    const t = this.$$(".lmcd__title");
    t && (t.textContent = this._title);
    const e = this.$$(".lmcd__message");
    e && (e.textContent = this._message);
    const i = this.$$(".lmcd__confirm");
    i && (i.textContent = this._confirmLabel);
    const r = this.$$(".lmcd__cancel");
    r && (r.textContent = this._cancelLabel);
  }
  show() {
    this._open || (this._open = !0, this.setAttribute("data-open", ""), this.setAttribute("open", ""), this.prevFocus = document.activeElement, document.body.style.overflow = "hidden", setTimeout(() => this.$$(".lmcd__confirm")?.focus(), 120));
  }
  hide() {
    this._open && (this._open = !1, this.removeAttribute("data-open"), this.removeAttribute("open"), document.body.style.overflow = "", this.prevFocus?.focus());
  }
}
a(j, "tagName", "lumina-confirmation-dialog");
customElements.get(j.tagName) || customElements.define(j.tagName, j);
class W extends l {
  constructor() {
    super(...arguments);
    a(this, "field", null);
    a(this, "glow", null);
    a(this, "onPointerMove", w((t) => {
      const e = this.getBoundingClientRect(), i = (t.clientX - e.left) / e.width * 100, r = (t.clientY - e.top) / e.height * 100;
      this.style.setProperty("--lx", `${i}%`), this.style.setProperty("--ly", `${r}%`), this.style.setProperty("--lumina-cursor-x", `${i}%`), this.style.setProperty("--lumina-cursor-y", `${r}%`);
    }, 16));
  }
  render() {
    return `
      <div class="lumina-container" part="root">
        <div class="lumina-container__glow" part="glow" aria-hidden="true"></div>
        <div class="lumina-container__field" part="field" aria-hidden="true"></div>
        <div class="lumina-container__inner" part="inner">
          <slot></slot>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        position: relative;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-container {
        position: relative;
        display: block;
        padding: 32px;
        border-radius: var(--lumina-radius-xl);
        min-height: 80px;
      }

      .lumina-container__glow {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(
          500px circle at var(--lx, 50%) var(--ly, 50%),
          rgb(var(--lumina-accent-rgb) / calc(0.10 * var(--lumina-intensity))),
          transparent 60%
        );
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lumina-container__glow { opacity: 1; }

      .lumina-container__field {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        overflow: hidden;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-container__inner {
        position: relative;
        z-index: 1;
      }

      /* Variants */
      :host([variant="glass"]) .lumina-container {
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1));
        -webkit-backdrop-filter: blur(16px) saturate(1.3);
        backdrop-filter: blur(16px) saturate(1.3);
        -webkit-backdrop-filter: blur(16px) saturate(1.3);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 0 0 rgb(255 255 255 / 0.06),
          var(--lumina-shadow);
      }

      :host([variant="neural"]) .lumina-container__field { opacity: 0.5; }
      :host([variant="neural"]) .lumina-container {
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.15));
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        border: 1px solid rgb(var(--lumina-accent-rgb) / 0.15);
      }

      :host([variant="void"]) .lumina-container__field { opacity: 0.8; }
      :host([variant="void"]) .lumina-container {
        background: rgb(0 0 0 / 0.4);
        -webkit-backdrop-filter: blur(6px);
        backdrop-filter: blur(6px);
        border: 1px solid rgb(var(--lumina-accent-rgb) / 0.2);
      }

      :host([variant="aura"]) .lumina-container__field { opacity: 0.4; }
      :host([variant="aura"]) .lumina-container {
        background:
          radial-gradient(80% 60% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.15),
            rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)) 60%
          );
        -webkit-backdrop-filter: blur(14px);
        backdrop-filter: blur(14px);
        border: 1px solid var(--lumina-border);
      }

      :host([variant="morph"]) .lumina-container {
        clip-path: polygon(
          0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px,
          100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px)
        );
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        -webkit-backdrop-filter: blur(14px);
        backdrop-filter: blur(14px);
        border: 1px solid var(--lumina-border);
      }

      :host([variant="dimensional"]) .lumina-container {
        perspective: 1000px;
        transform-style: preserve-3d;
        background:
          linear-gradient(135deg,
            rgb(var(--lumina-accent-rgb) / 0.05),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha))
          );
        -webkit-backdrop-filter: blur(14px);
        backdrop-filter: blur(14px);
        border: 1px solid var(--lumina-border);
        box-shadow:
          0 calc(var(--lumina-depth) * 0.6) 0 calc(var(--lumina-depth) * -0.4)
            rgb(var(--lumina-accent-rgb) / 0.25),
          var(--lumina-shadow);
      }
      :host([variant="dimensional"]) .lumina-container__inner {
        transform: translateZ(calc(var(--lumina-depth) * 0.4));
        transform-style: preserve-3d;
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-container__glow,
        .lumina-container__field { transition: none !important; }
      }
    `;
  }
  mounted() {
    this.glow = this.$$(".lumina-container__glow"), this.addEventListener("pointermove", this.onPointerMove), this.maybeInitField();
  }
  unmounted() {
    this.removeEventListener("pointermove", this.onPointerMove), this.field?.destroy(), this.field = null;
  }
  onConfigChange(t) {
    (t.variant || t.intensity) && (this.field?.destroy(), this.field = null, this.maybeInitField());
  }
  maybeInitField() {
    const t = this.variant;
    if (!(t === "neural" || t === "void" || t === "aura")) return;
    const i = this.$$(".lumina-container__field");
    if (!i) return;
    const r = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", s = y(this.intensity);
    this.field = new k(this.shadow.host, {
      count: Math.round(60 * s),
      rgb: r,
      sizeRange: [0.6, 2],
      speedRange: [0.1, 0.4],
      lifeRange: [180, 320],
      connect: t === "neural",
      starfield: t === "void"
    }), this.field.mount(i);
  }
}
a(W, "tagName", "lumina-container");
customElements.get(W.tagName) || customElements.define(W.tagName, W);
class U extends l {
  render() {
    return '<div class="lmca" part="root"><div class="lmca__sensor" part="sensor" aria-hidden="true"></div><div class="lmca__output" part="output"><slot></slot></div></div>';
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmca { position: relative; }
      .lmca__sensor { position: absolute; inset: 0; pointer-events: none; opacity: 0; }
      .lmca__output { position: relative; }
      :host([data-context="modal"]) .lmca__output { --lumina-intensity: 1; --lumina-surface-alpha: 0.7; }
      :host([data-context="sidebar"]) .lmca__output { --lumina-intensity: 0.6; }
      :host([data-context="card"]) .lmca__output { --lumina-intensity: 0.8; --lumina-surface-alpha: 0.4; }
      :host([data-context="form"]) .lmca__output { --lumina-intensity: 0.5; }
      :host([data-context="drawer"]) .lmca__output { --lumina-intensity: 1; --lumina-surface-alpha: 0.7; }
      :host([data-context="page"]) .lmca__output { --lumina-intensity: 0.7; }
    `;
  }
  mounted() {
    this.detectContext();
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
  detectContext() {
    let o = "page", t = this.parentElement;
    for (; t; ) {
      const e = t.tagName.toLowerCase();
      if (e === "form") {
        o = "form";
        break;
      }
      if (e.startsWith("lumina-")) {
        if (e.includes("modal") || e.includes("dialog")) {
          o = "modal";
          break;
        }
        if (e.includes("drawer")) {
          o = "drawer";
          break;
        }
        if (e.includes("sidebar")) {
          o = "sidebar";
          break;
        }
        if (e.includes("card")) {
          o = "card";
          break;
        }
      }
      t = t.parentElement;
    }
    this.setAttribute("data-context", o), this.dispatchEvent(new CustomEvent("lumina-context-change", { bubbles: !0, composed: !0, detail: { context: o } }));
  }
}
a(U, "tagName", "lumina-context-aware");
customElements.get(U.tagName) || customElements.define(U.tagName, U);
class J extends l {
  constructor() {
    super(...arguments);
    a(this, "_autoAdapt", !0);
    a(this, "observer", null);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "auto-adapt"];
  }
  get autoAdapt() {
    return this._autoAdapt;
  }
  set autoAdapt(t) {
    this._autoAdapt = t, t ? this.setAttribute("auto-adapt", "") : this.removeAttribute("auto-adapt");
  }
  render() {
    return `
      <article class="lmcc" part="card">
        <div class="lmcc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); --lmcc-padding: 24px; --lmcc-glow: 0; }
      .lmcc { position: relative; display: block; border-radius: inherit; transition: all var(--lumina-speed) var(--lumina-ease-out); }
      .lmcc__surface { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 calc(var(--lmcc-glow) * 1px) rgb(var(--lumina-accent-rgb) / 0.3), var(--lumina-shadow); padding: var(--lmcc-padding); transition: all var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-content="image"]) { --lmcc-padding: 0px; --lmcc-glow: 20; }
      :host([data-content="image"]) .lmcc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.3); }
      :host([data-content="text"]) { --lmcc-padding: 28px; }
      :host([data-content="video"]) { --lmcc-padding: 0px; --lmcc-glow: 30; }
      :host([data-content="video"]) .lmcc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.4); }
      :host([data-content="mixed"]) { --lmcc-padding: 20px; --lmcc-glow: 15; }
      :host([variant="neural"]) .lmcc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host(:hover) { --lmcc-glow: 30; }
    `;
  }
  mounted() {
    this._autoAdapt = this.getAttribute("auto-adapt") !== "false", this.detectContent(), this._autoAdapt && (this.observer = new MutationObserver(() => this.detectContent()), this.observer.observe(this, { childList: !0, subtree: !0 }));
  }
  unmounted() {
    this.observer?.disconnect();
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "auto-adapt" && (this._autoAdapt = i !== "false", this._autoAdapt ? (this.detectContent(), this.observer?.observe(this, { childList: !0, subtree: !0 })) : this.observer?.disconnect());
  }
  detectContent() {
    const t = this.querySelectorAll("img").length, e = this.querySelectorAll("video").length, i = this.textContent?.trim().length ?? 0;
    let r = "empty";
    t > 0 && e > 0 ? r = "mixed" : e > 0 ? r = "video" : t > 0 && i > 20 ? r = "mixed" : t > 0 ? r = "image" : i > 0 && (r = "text"), this.setAttribute("data-content", r), this.dispatchEvent(new CustomEvent("lumina-context-change", { bubbles: !0, composed: !0, detail: { type: r } }));
  }
}
a(J, "tagName", "lumina-context-card");
customElements.get(J.tagName) || customElements.define(J.tagName, J);
class G extends l {
  constructor() {
    super(...arguments);
    a(this, "_value", "");
    a(this, "input", null);
    a(this, "observer", null);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "value"];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = t, this.setAttribute("value", t), this.input && (this.input.value = t);
  }
  render() {
    return `
      <label class="lmci" part="field">
        <div class="lmci__shell" part="control">
          <div class="lmci__bg" aria-hidden="true"></div>
          <input class="lmci__el" type="text" placeholder="Adaptive input..." />
        </div>
      </label>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmci-pad: 16px; }
      .lmci__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; transition: all var(--lumina-speed) var(--lumina-ease-out); }
      .lmci__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: all var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmci__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmci__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 var(--lmci-pad); border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); transition: padding var(--lumina-speed) var(--lumina-ease-out); }
      .lmci__el::placeholder { color: var(--lumina-text-muted); }
      :host([data-context="form"]) { --lmci-pad: 16px; }
      :host([data-context="modal"]) .lmci__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.3); box-shadow: 0 0 16px rgb(var(--lumina-accent-rgb) / 0.1); }
      :host([data-context="modal"]) { --lmci-pad: 20px; }
      :host([data-context="card"]) .lmci__bg { background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)); }
      :host([data-context="card"]) { --lmci-pad: 12px; }
      :host([data-context="sidebar"]) .lmci__shell { border-radius: var(--lumina-radius-sm); }
      :host([data-context="sidebar"]) { --lmci-pad: 10px; }
      @media (prefers-reduced-motion: reduce) { .lmci__shell, .lmci__bg, .lmci__el { transition: none !important; } }
    `;
  }
  mounted() {
    this._value = this.getAttribute("value") ?? "", this.input = this.$$(".lmci__el"), this.input && (this.input.value = this._value), this.input?.addEventListener("input", (t) => {
      this._value = t.target.value, this.dispatchEvent(new CustomEvent("lumina-context-change", { bubbles: !0, composed: !0, detail: { value: this._value } }));
    }), this.detectContext(), this.observer = new MutationObserver(() => this.detectContext()), this.observer.observe(document.body, { childList: !0, subtree: !0 });
  }
  unmounted() {
    this.observer?.disconnect();
  }
  onConfigChange(t) {
  }
  detectContext() {
    let t = "standalone", e = this.parentElement;
    for (; e; ) {
      const r = e.tagName.toLowerCase();
      if (r === "form") {
        t = "form";
        break;
      }
      if (r.startsWith("lumina-") && (r.includes("modal") || r.includes("dialog"))) {
        t = "modal";
        break;
      }
      if (r.startsWith("lumina-") && r.includes("card")) {
        t = "card";
        break;
      }
      if (r.startsWith("lumina-") && r.includes("sidebar")) {
        t = "sidebar";
        break;
      }
      if (r.startsWith("lumina-") && r.includes("drawer")) {
        t = "modal";
        break;
      }
      e = e.parentElement;
    }
    const i = this.getAttribute("data-context");
    this.setAttribute("data-context", t), i !== t && this.dispatchEvent(new CustomEvent("lumina-context-change", { bubbles: !0, composed: !0, detail: { context: t } }));
  }
}
a(G, "tagName", "lumina-context-input");
customElements.get(G.tagName) || customElements.define(G.tagName, G);
class Z extends l {
  constructor() {
    super(...arguments);
    a(this, "_items", []);
    a(this, "menu", null);
    a(this, "_open", !1);
    a(this, "onContextmenu", (t) => {
      this.contains(t.target) && (t.preventDefault(), this.show(t.clientX, t.clientY));
    });
    a(this, "onDocClick", (t) => {
      !this.contains(t.target) && this._open && this.hide();
    });
    a(this, "onKeydown", (t) => {
      t.key === "Escape" && this._open && this.hide();
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "items"];
  }
  render() {
    return '<div class="lmcm" part="menu" role="menu" aria-hidden="true"></div><slot></slot>';
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmcm { position: fixed; z-index: 10000; min-width: 180px; padding: 6px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.2)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.6); opacity: 0; transform: scale(0.9); pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); transform-origin: top left; }
      .lmcm[data-open] { opacity: 1; transform: scale(1); pointer-events: auto; }
      .lmcm[data-closing] { opacity: 0; transform: scale(0.95); transition: opacity calc(var(--lumina-speed) * 0.6) var(--lumina-ease-out), transform calc(var(--lumina-speed) * 0.6) var(--lumina-ease-out); }
      .lmcm__item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; color: var(--lumina-text); transition: background 0.15s; position: relative; }
      .lmcm__item:hover { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lmcm__item[disabled] { opacity: 0.4; pointer-events: none; }
      .lmcm__item-icon { font-size: 14px; opacity: 0.8; width: 16px; text-align: center; }
      .lmcm__item-label { flex: 1; }
      .lmcm__item-shortcut { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--lumina-text-muted); }
      .lmcm__separator { height: 1px; background: var(--lumina-border); margin: 4px 8px; }
      .lmcm__submenu { position: absolute; left: 100%; top: 0; min-width: 160px; padding: 6px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.2)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.6); opacity: 0; transform: translateX(-4px); pointer-events: none; transition: opacity 0.2s, transform 0.2s; }
      .lmcm__item:hover .lmcm__submenu { opacity: 1; transform: translateX(0); pointer-events: auto; }
      @media (prefers-reduced-motion: reduce) { .lmcm, .lmcm__submenu { transition: none !important; } }
    `;
  }
  mounted() {
    this.menu = this.$$(".lmcm");
    const t = this.getAttribute("items");
    if (t)
      try {
        this._items = JSON.parse(t);
      } catch {
        this._items = [];
      }
    this.renderItems(), document.addEventListener("click", this.onDocClick), document.addEventListener("contextmenu", this.onContextmenu), document.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
    document.removeEventListener("click", this.onDocClick), document.removeEventListener("contextmenu", this.onContextmenu), document.removeEventListener("keydown", this.onKeydown);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    if (super.attributeChangedCallback(t, e, i), t === "items" && i)
      try {
        this._items = JSON.parse(i), this.renderItems();
      } catch {
      }
  }
  renderItems(t, e) {
    const i = e ?? this._items, r = t ?? this.menu;
    r && (t || (r.innerHTML = ""), i.forEach((s) => {
      if (s.separator) {
        const d = document.createElement("div");
        d.className = "lmcm__separator", d.setAttribute("part", "separator"), r.appendChild(d);
        return;
      }
      const n = document.createElement("div");
      if (n.className = "lmcm__item", n.setAttribute("part", "item"), n.setAttribute("role", "menuitem"), s.disabled && n.setAttribute("disabled", ""), n.innerHTML = `<span class="lmcm__item-icon">${s.icon ?? ""}</span><span class="lmcm__item-label">${s.label}</span>${s.shortcut ? `<span class="lmcm__item-shortcut">${s.shortcut}</span>` : ""}`, s.submenu && s.submenu.length > 0) {
        const d = document.createElement("div");
        d.className = "lmcm__submenu", this.renderItems(d, s.submenu), n.appendChild(d), n.innerHTML += '<span style="margin-left:4px;">▸</span>';
      } else
        n.addEventListener("click", () => {
          this.dispatchEvent(new CustomEvent("lumina-select", { bubbles: !0, composed: !0, detail: { value: s.value ?? s.label, label: s.label } })), this.hide();
        });
      r.appendChild(n);
    }));
  }
  show(t, e) {
    this.menu && (this._open = !0, this.menu.setAttribute("data-open", ""), this.menu.style.left = `${t}px`, this.menu.style.top = `${e}px`, requestAnimationFrame(() => {
      if (!this.menu) return;
      const i = this.menu.getBoundingClientRect();
      i.right > window.innerWidth && (this.menu.style.left = `${t - i.width}px`), i.bottom > window.innerHeight && (this.menu.style.top = `${e - i.height}px`);
    }), this.dispatchEvent(new CustomEvent("lumina-show", { bubbles: !0, composed: !0, detail: { x: t, y: e } })));
  }
  hide() {
    !this._open || !this.menu || (this.menu.setAttribute("data-closing", ""), setTimeout(() => {
      this.menu?.removeAttribute("data-open"), this.menu?.removeAttribute("data-closing"), this._open = !1, this.dispatchEvent(new CustomEvent("lumina-hide", { bubbles: !0, composed: !0 }));
    }, 200));
  }
}
a(Z, "tagName", "lumina-context-menu");
customElements.get(Z.tagName) || customElements.define(Z.tagName, Z);
class Q extends l {
  constructor() {
    super(...arguments);
    a(this, "_columns", []);
    a(this, "_data", []);
    a(this, "selected", /* @__PURE__ */ new Set());
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "columns", "data"];
  }
  render() {
    return '<div class="lmdg" part="root"><div class="lmdg__header-row" part="header-row" data-header></div><div class="lmdg__body" data-body></div></div>';
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmdg-col-width: 120px; }
      .lmdg { border-radius: var(--lumina-radius-md); overflow: hidden; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); max-height: 400px; overflow-y: auto; }
      .lmdg__header-row { display: flex; gap: 0; background: rgb(var(--lumina-accent-rgb) / 0.1); border-bottom: 1px solid var(--lumina-border); position: sticky; top: 0; z-index: 2; }
      .lmdg__header-cell { padding: 10px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lumina-text-muted); cursor: grab; flex: 1; min-width: var(--lmdg-col-width); user-select: none; transition: color 0.2s; white-space: nowrap; }
      .lmdg__header-cell:hover { color: var(--lumina-accent); }
      .lmdg__header-cell[draggable="true"] { cursor: grab; }
      .lmdg__header-cell[data-dragging] { opacity: 0.4; }
      .lmdg__row { display: flex; gap: 0; border-bottom: 1px solid var(--lumina-border); cursor: pointer; transition: background 0.2s; animation: lmdg-row-in 0.3s var(--lumina-ease-out); }
      @keyframes lmdg-row-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
      .lmdg__row:hover { background: rgb(var(--lumina-accent-rgb) / 0.08); }
      .lmdg__row[data-selected] { background: rgb(var(--lumina-accent-rgb) / 0.2); box-shadow: inset 2px 0 0 var(--lumina-accent); animation: lmdg-select 0.3s var(--lumina-ease-spring); }
      @keyframes lmdg-select { 0% { transform: scale(1); } 50% { transform: scale(1.01); } 100% { transform: scale(1); } }
      .lmdg__cell { padding: 10px 14px; font-size: 13px; flex: 1; min-width: var(--lmdg-col-width); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .lmdg__checkbox { width: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .lmdg__checkbox input { accent-color: var(--lumina-accent); cursor: pointer; }
      :host([variant="dense"]) .lmdg__cell, :host([variant="dense"]) .lmdg__header-cell { padding: 6px 10px; font-size: 12px; }
      @media (prefers-reduced-motion: reduce) { .lmdg__row { animation: none !important; } }
    `;
  }
  mounted() {
    const t = this.getAttribute("columns"), e = this.getAttribute("data");
    if (t)
      try {
        this._columns = JSON.parse(t);
      } catch {
      }
    if (e)
      try {
        this._data = JSON.parse(e);
      } catch {
      }
    this.renderGrid();
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    if (super.attributeChangedCallback(t, e, i), t === "columns" && i)
      try {
        this._columns = JSON.parse(i);
      } catch {
      }
    else if (t === "data" && i)
      try {
        this._data = JSON.parse(i);
      } catch {
      }
    this.renderGrid();
  }
  renderGrid() {
    const t = this.$$(".lmdg__header-row"), e = this.$$(".lmdg__body");
    !t || !e || (t.innerHTML = '<div class="lmdg__checkbox"><input type="checkbox" class="lmdg__select-all" /></div>', this._columns.forEach((i, r) => {
      const s = document.createElement("div");
      s.className = "lmdg__header-cell", s.textContent = i, s.setAttribute("draggable", "true"), s.dataset.idx = String(r), s.addEventListener("dragstart", () => s.setAttribute("data-dragging", "")), s.addEventListener("dragend", () => s.removeAttribute("data-dragging")), s.addEventListener("dragover", (n) => n.preventDefault()), s.addEventListener("drop", () => {
        const n = parseInt(s.dataset.idx ?? "0");
        n !== r && (this._columns.splice(r, 0, this._columns.splice(n, 1)[0]), this.renderGrid());
      }), t.appendChild(s);
    }), e.innerHTML = "", this._data.forEach((i, r) => {
      const s = document.createElement("div");
      s.className = "lmdg__row", s.dataset.idx = String(r);
      const n = document.createElement("div");
      n.className = "lmdg__checkbox", n.innerHTML = `<input type="checkbox" ${this.selected.has(r) ? "checked" : ""} />`, n.querySelector("input")?.addEventListener("change", () => {
        this.selected.has(r) ? this.selected.delete(r) : this.selected.add(r), s.toggleAttribute("data-selected", this.selected.has(r)), this.dispatchEvent(new CustomEvent("lumina-select", { bubbles: !0, composed: !0, detail: { index: r, selected: Array.from(this.selected) } }));
      }), s.appendChild(n), this._columns.forEach((d) => {
        const u = document.createElement("div");
        u.className = "lmdg__cell", u.textContent = String(i[d] ?? ""), s.appendChild(u);
      }), s.addEventListener("click", (d) => {
        d.target.matches("input") || (this.selected.has(r) ? this.selected.delete(r) : this.selected.add(r), s.toggleAttribute("data-selected", this.selected.has(r)), n.querySelector("input").checked = this.selected.has(r));
      }), e.appendChild(s);
    }), this.$$(".lmdg__select-all")?.addEventListener("change", (i) => {
      const r = i.target.checked;
      this.selected = r ? new Set(this._data.map((s, n) => n)) : /* @__PURE__ */ new Set(), e.querySelectorAll(".lmdg__row").forEach((s, n) => {
        s.toggleAttribute("data-selected", this.selected.has(n));
        const d = s.querySelector("input");
        d && (d.checked = this.selected.has(n));
      });
    }));
  }
}
a(Q, "tagName", "lumina-data-grid");
customElements.get(Q.tagName) || customElements.define(Q.tagName, Q);
const oi = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], li = ["D", "S", "T", "Q", "Q", "S", "S"];
class tt extends l {
  constructor() {
    super(...arguments);
    a(this, "_value", "");
    a(this, "viewDate", /* @__PURE__ */ new Date());
    a(this, "trigger", null);
    a(this, "calendar", null);
    a(this, "_open", !1);
    a(this, "onDocClick", (t) => {
      !this.contains(t.target) && this._open && this.toggle();
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "value"];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = t, this.setAttribute("value", t), this.updateTrigger();
  }
  render() {
    return `
      <div class="lmdp" part="trigger">
        <button class="lmdp__trigger" type="button">
          <span class="lmdp__icon">📅</span>
          <span class="lmdp__value"></span>
        </button>
        <div class="lmdp__calendar" part="calendar" aria-hidden="true">
          <div class="lmdp__header">
            <button class="lmdp__prev" type="button" aria-label="Mês anterior">‹</button>
            <span class="lmdp__month"></span>
            <button class="lmdp__next" type="button" aria-label="Próximo mês">›</button>
          </div>
          <div class="lmdp__weekdays"></div>
          <div class="lmdp__days" part="day"></div>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmdp__trigger { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: var(--lumina-radius-md); border: 1px solid var(--lumina-border); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: pointer; color: inherit; font: 500 14px var(--lumina-font-sans); }
      .lmdp__trigger:hover { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmdp__calendar { position: absolute; top: calc(100% + 6px); left: 0; z-index: 1000; min-width: 280px; padding: 14px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); opacity: 0; transform: scale(0.92) translateY(-8px); pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host([data-open]) .lmdp__calendar { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
      .lmdp__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
      .lmdp__prev, .lmdp__next { appearance: none; border: 0; background: rgb(var(--lumina-accent-rgb) / 0.1); color: var(--lumina-accent); width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; transition: background 0.2s, transform 0.2s; }
      .lmdp__prev:hover, .lmdp__next:hover { background: rgb(var(--lumina-accent-rgb) / 0.3); transform: scale(1.1); }
      .lmdp__month { font-size: 14px; font-weight: 700; }
      .lmdp__weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 6px; }
      .lmdp__weekday { text-align: center; font-size: 11px; font-weight: 700; color: var(--lumina-text-muted); padding: 4px 0; }
      .lmdp__days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
      .lmdp__day { display: flex; align-items: center; justify-content: center; height: 32px; border-radius: 6px; cursor: pointer; font-size: 13px; transition: background 0.15s, transform 0.15s; animation: lmdp-fade 0.3s var(--lumina-ease-out); }
      @keyframes lmdp-fade { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
      .lmdp__day:hover { background: rgb(var(--lumina-accent-rgb) / 0.2); transform: scale(1.1); }
      .lmdp__day[data-today] { border: 1px solid rgb(var(--lumina-accent-rgb) / 0.4); }
      .lmdp__day[data-selected] { background: var(--lumina-accent); color: #fff; font-weight: 700; box-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmdp__day[data-outside] { opacity: 0.3; }
      @media (prefers-reduced-motion: reduce) { .lmdp__calendar, .lmdp__day { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    if (this._value = this.getAttribute("value") ?? "", this._value) {
      const t = new Date(this._value);
      isNaN(t.getTime()) || (this.viewDate = t);
    }
    this.trigger = this.$$(".lmdp__trigger"), this.calendar = this.$$(".lmdp__calendar"), this.updateTrigger(), this.renderWeekdays(), this.renderDays(), this.trigger?.addEventListener("click", () => this.toggle()), this.$$(".lmdp__prev")?.addEventListener("click", () => {
      this.viewDate.setMonth(this.viewDate.getMonth() - 1), this.renderDays();
    }), this.$$(".lmdp__next")?.addEventListener("click", () => {
      this.viewDate.setMonth(this.viewDate.getMonth() + 1), this.renderDays();
    }), document.addEventListener("click", this.onDocClick);
  }
  unmounted() {
    document.removeEventListener("click", this.onDocClick);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "value" && (this._value = i ?? "", this.updateTrigger(), this.renderDays());
  }
  toggle() {
    this._open = !this._open, this._open ? this.setAttribute("data-open", "") : this.removeAttribute("data-open");
  }
  updateTrigger() {
    const t = this.$$(".lmdp__value");
    t && (t.textContent = this._value ? this.formatDate(new Date(this._value)) : "Selecionar data...");
  }
  formatDate(t) {
    return `${String(t.getDate()).padStart(2, "0")}/${String(t.getMonth() + 1).padStart(2, "0")}/${t.getFullYear()}`;
  }
  renderWeekdays() {
    const t = this.$$(".lmdp__weekdays");
    t && (t.innerHTML = li.map((e) => `<div class="lmdp__weekday">${e}</div>`).join(""));
  }
  renderDays() {
    const t = this.$$(".lmdp__days"), e = this.$$(".lmdp__month");
    if (!t || !e) return;
    const i = this.viewDate.getFullYear(), r = this.viewDate.getMonth();
    e.textContent = `${oi[r]} ${i}`;
    const s = new Date(i, r, 1).getDay(), n = new Date(i, r + 1, 0).getDate(), d = new Date(i, r, 0).getDate(), u = /* @__PURE__ */ new Date();
    let m = "";
    for (let _ = s - 1; _ >= 0; _--)
      m += `<div class="lmdp__day" data-outside data-day="${d - _}">${d - _}</div>`;
    for (let _ = 1; _ <= n; _++) {
      const A = `${i}-${String(r + 1).padStart(2, "0")}-${String(_).padStart(2, "0")}`, L = _ === u.getDate() && r === u.getMonth() && i === u.getFullYear(), je = A === this._value;
      m += `<div class="lmdp__day" data-day="${_}" data-date="${A}" ${L ? "data-today" : ""} ${je ? "data-selected" : ""}>${_}</div>`;
    }
    const x = (7 - (s + n) % 7) % 7;
    for (let _ = 1; _ <= x; _++)
      m += `<div class="lmdp__day" data-outside data-day="${_}">${_}</div>`;
    t.innerHTML = m, t.querySelectorAll(".lmdp__day[data-date]").forEach((_) => {
      _.addEventListener("click", () => {
        this._value = _.getAttribute("data-date") ?? "", this.setAttribute("value", this._value), this.updateTrigger(), this.renderDays(), this.dispatchEvent(new CustomEvent("lumina-date-change", { bubbles: !0, composed: !0, detail: { value: this._value } })), this.toggle();
      });
    });
  }
}
a(tt, "tagName", "lumina-date-picker");
customElements.get(tt.tagName) || customElements.define(tt.tagName, tt);
class et extends l {
  constructor() {
    super(...arguments);
    a(this, "onMove", (t) => {
      const e = this.getAttribute("depth") ?? "medium";
      if (e === "flat") return;
      const i = this.getBoundingClientRect(), r = (t.clientX - i.left) / i.width - 0.5, s = (t.clientY - i.top) / i.height - 0.5, n = e === "extrude" ? 1 : e === "deep" ? 0.7 : 0.4, d = this.$$(".lmdc__children");
      d && (d.style.transform = `rotateY(${r * 10 * n}deg) rotateX(${-s * 10 * n}deg)`), this.dispatchEvent(new CustomEvent("lumina-depth-change", { bubbles: !0, composed: !0, detail: { depth: e, rx: -s * 10 * n, ry: r * 10 * n } }));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "depth"];
  }
  render() {
    return '<div class="lmdc" part="controller"><div class="lmdc__children" part="children"><slot></slot></div></div>';
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); perspective: 1000px; }
      .lmdc { position: relative; width: 100%; transform-style: preserve-3d; }
      .lmdc__children { transform-style: preserve-3d; transition: transform 0.3s var(--lumina-ease-out); }
      :host([depth="flat"]) .lmdc__children { transform: none; }
      :host([depth="medium"]) { perspective: 800px; }
      :host([depth="deep"]) { perspective: 600px; }
      :host([depth="extrude"]) { perspective: 400px; }
      :host([depth="medium"]) ::slotted(*), :host([depth="deep"]) ::slotted(*), :host([depth="extrude"]) ::slotted(*) { transform: translateZ(0); transition: transform 0.2s var(--lumina-ease-out); }
      :host([depth="deep"]) ::slotted(*) { transform: translateZ(10px); }
      :host([depth="extrude"]) ::slotted(*) { transform: translateZ(20px); box-shadow: 0 20px 0 -10px rgb(var(--lumina-accent-rgb) / 0.3); }
      :host([depth="extrude"]) ::slotted(*:hover) { transform: translateZ(40px) rotateX(5deg); }
      @media (prefers-reduced-motion: reduce) { .lmdc__children, ::slotted(*) { transition: none !important; transform: none !important; } }
    `;
  }
  mounted() {
    this.hasAttribute("depth") || this.setAttribute("depth", "medium"), this.addEventListener("pointermove", this.onMove);
  }
  unmounted() {
    this.removeEventListener("pointermove", this.onMove);
  }
  onConfigChange(t) {
  }
}
a(et, "tagName", "lumina-depth-controller");
customElements.get(et.tagName) || customElements.define(et.tagName, et);
class it extends l {
  constructor() {
    super(...arguments);
    a(this, "_open", !1);
    a(this, "_title", "");
    a(this, "_confirmLabel", "Confirmar");
    a(this, "_cancelLabel", "Cancelar");
    a(this, "prevFocus", null);
    a(this, "onKeydown", (t) => {
      this._open && t.key === "Escape" && (t.preventDefault(), this.hide());
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "open", "title", "confirm-label", "cancel-label"];
  }
  get open() {
    return this._open;
  }
  set open(t) {
    t ? this.show() : this.hide();
  }
  render() {
    return `
      <div class="lmdg" part="backdrop" aria-hidden="true"></div>
      <div class="lmdg__dialog" part="dialog" role="dialog" aria-modal="true">
        <div class="lmdg__bg" aria-hidden="true"></div>
        <header class="lmdg__header" part="header"><slot name="title"><span class="lmdg__title"></span></slot></header>
        <div class="lmdg__body" part="body"><slot></slot></div>
        <footer class="lmdg__footer" part="footer">
          <button class="lmdg__cancel" type="button"></button>
          <button class="lmdg__confirm" type="button"></button>
        </footer>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: contents; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmdg { position: fixed; inset: 0; background: rgb(0 0 0 / 0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); opacity: 0; pointer-events: none; z-index: 999; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmdg { opacity: 1; pointer-events: auto; }
      .lmdg__dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.92); opacity: 0; pointer-events: none; z-index: 1000; min-width: 360px; max-width: 90vw; border-radius: var(--lumina-radius-lg); overflow: hidden; transition: transform calc(var(--lumina-speed) * 1.2) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmdg__dialog { transform: translate(-50%, -50%) scale(1); opacity: 1; pointer-events: auto; }
      .lmdg__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(24px) saturate(1.6); -webkit-backdrop-filter: blur(24px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 30px 80px -20px rgb(0 0 0 / 0.6); z-index: 0; }
      .lmdg__header { position: relative; z-index: 1; padding: 20px 24px 12px; font-size: 18px; font-weight: 700; }
      .lmdg__title { display: block; }
      .lmdg__body { position: relative; z-index: 1; padding: 0 24px 20px; font-size: 14px; line-height: 1.6; color: rgba(245,245,255,0.8); }
      .lmdg__footer { position: relative; z-index: 1; display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--lumina-border); }
      .lmdg__cancel, .lmdg__confirm { appearance: none; border: 1px solid var(--lumina-border); padding: 8px 20px; border-radius: var(--lumina-radius-pill); font: 600 13px var(--lumina-font-sans); cursor: pointer; transition: all var(--lumina-speed) var(--lumina-ease-out); }
      .lmdg__cancel { background: transparent; color: var(--lumina-text-muted); }
      .lmdg__cancel:hover { background: rgb(255 255 255 / 0.06); color: var(--lumina-text); }
      .lmdg__confirm { background: var(--lumina-accent); border-color: var(--lumina-accent); color: #fff; box-shadow: 0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4); }
      .lmdg__confirm:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgb(var(--lumina-accent-rgb) / 0.6); }
      .lmdg__confirm:focus-visible, .lmdg__cancel:focus-visible { outline: 2px solid var(--lumina-accent); outline-offset: 2px; }
      :host([variant="minimal"]) .lmdg__bg { backdrop-filter: none; -webkit-backdrop-filter: none; }
      @media (prefers-reduced-motion: reduce) { .lmdg, .lmdg__dialog { transition: none !important; } }
    `;
  }
  mounted() {
    this._title = this.getAttribute("title") ?? "", this._confirmLabel = this.getAttribute("confirm-label") ?? "Confirmar", this._cancelLabel = this.getAttribute("cancel-label") ?? "Cancelar", this.$$(".lmdg__title").textContent = this._title, this.$$(".lmdg__confirm").textContent = this._confirmLabel, this.$$(".lmdg__cancel").textContent = this._cancelLabel, this.$$(".lmdg").addEventListener("click", (t) => {
      t.target === this.$$(".lmdg") && this.hide();
    }), this.$$(".lmdg__cancel").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("lumina-cancel", { bubbles: !0, composed: !0 })), this.hide();
    }), this.$$(".lmdg__confirm").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("lumina-confirm", { bubbles: !0, composed: !0 })), this.hide();
    }), document.addEventListener("keydown", this.onKeydown), this.hasAttribute("open") && requestAnimationFrame(() => this.show());
  }
  unmounted() {
    document.removeEventListener("keydown", this.onKeydown), document.body.style.overflow = "";
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "open" ? i !== null ? this.show() : this.hide() : t === "title" ? (this._title = i ?? "", this.$$(".lmdg__title") && (this.$$(".lmdg__title").textContent = this._title)) : t === "confirm-label" ? (this._confirmLabel = i ?? "Confirmar", this.$$(".lmdg__confirm") && (this.$$(".lmdg__confirm").textContent = this._confirmLabel)) : t === "cancel-label" && (this._cancelLabel = i ?? "Cancelar", this.$$(".lmdg__cancel") && (this.$$(".lmdg__cancel").textContent = this._cancelLabel));
  }
  show() {
    this._open || (this._open = !0, this.setAttribute("data-open", ""), this.setAttribute("open", ""), this.prevFocus = document.activeElement, document.body.style.overflow = "hidden", this.dispatchEvent(new CustomEvent("lumina-open", { bubbles: !0, composed: !0 })), setTimeout(() => this.shadow.querySelector(".lmdg__confirm")?.focus(), 120));
  }
  hide() {
    this._open && (this._open = !1, this.removeAttribute("data-open"), this.removeAttribute("open"), document.body.style.overflow = "", this.prevFocus?.focus(), this.dispatchEvent(new CustomEvent("lumina-close", { bubbles: !0, composed: !0 })));
  }
}
a(it, "tagName", "lumina-dialog");
customElements.get(it.tagName) || customElements.define(it.tagName, it);
class at extends l {
  constructor() {
    super(...arguments);
    a(this, "_interactive", !0);
    a(this, "targetRX", 0);
    a(this, "targetRY", 0);
    a(this, "currentRX", 0);
    a(this, "currentRY", 0);
    a(this, "raf", 0);
    a(this, "layers", []);
    a(this, "onMove", w((t) => {
      const e = this.getBoundingClientRect(), i = (t.clientX - e.left) / e.width - 0.5, r = (t.clientY - e.top) / e.height - 0.5;
      this.targetRY = i * 20, this.targetRX = -r * 20, this.raf || (this.dispatchEvent(new CustomEvent("lumina-tilt-start", { bubbles: !0, composed: !0, detail: { rx: this.targetRX, ry: this.targetRY } })), this.tick());
    }, 16));
    a(this, "onLeave", () => {
      this.targetRX = 0, this.targetRY = 0, this.raf || this.tick();
    });
    a(this, "tick", () => {
      this.currentRX += (this.targetRX - this.currentRX) * 0.15, this.currentRY += (this.targetRY - this.currentRY) * 0.15;
      const t = this.$$(".lmdc");
      t && (t.style.transform = `perspective(1000px) rotateX(${this.currentRX}deg) rotateY(${this.currentRY}deg)`), this.layers.forEach((e) => {
        const i = parseFloat(e.dataset.depth ?? "0.5");
        e.style.transform = `translateZ(${i * 30}px) translateX(${this.currentRY * i * 0.5}px) translateY(${-this.currentRX * i * 0.5}px)`;
      }), Math.abs(this.targetRX - this.currentRX) > 0.05 || Math.abs(this.targetRY - this.currentRY) > 0.05 ? this.raf = requestAnimationFrame(this.tick) : (this.raf = 0, this.targetRX === 0 && this.targetRY === 0 && this.dispatchEvent(new CustomEvent("lumina-tilt-end", { bubbles: !0, composed: !0 })));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "interactive"];
  }
  get interactive() {
    return this._interactive;
  }
  set interactive(t) {
    this._interactive = t, t ? this.setAttribute("interactive", "") : this.removeAttribute("interactive");
  }
  render() {
    return `
      <article class="lmdc" part="card">
        <div class="lmdc__layers" part="layers">
          <div class="lmdc__layer lmdc__layer--back" data-depth="0.2"></div>
          <div class="lmdc__layer lmdc__layer--mid" data-depth="0.5"></div>
          <div class="lmdc__layer lmdc__layer--front" data-depth="1">
            <div class="lmdc__surface" part="surface">
              <slot></slot>
            </div>
          </div>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); perspective: 1000px; }
      .lmdc { position: relative; display: block; border-radius: inherit; transform-style: preserve-3d; transition: transform var(--lumina-speed) var(--lumina-ease-spring); will-change: transform; }
      .lmdc__layers { position: relative; transform-style: preserve-3d; }
      .lmdc__layer { position: absolute; inset: 0; border-radius: inherit; transform-style: preserve-3d; transition: transform 0.1s var(--lumina-ease-out); }
      .lmdc__layer--back { background: radial-gradient(circle at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.15), transparent 70%); filter: blur(20px); z-index: 0; }
      .lmdc__layer--mid { background: rgb(var(--lumina-accent-rgb) / 0.08); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.15); z-index: 1; }
      .lmdc__layer--front { position: relative; z-index: 2; }
      .lmdc__surface { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: 0 calc(var(--lumina-depth) * 0.5) 0 calc(var(--lumina-depth) * -0.3) rgb(var(--lumina-accent-rgb) / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.1), var(--lumina-shadow); padding: 24px; overflow: hidden; }
      :host([variant="deep"]) .lmdc__layer--mid { transform: translateZ(-20px); }
      :host([variant="extrude"]) .lmdc__layer--mid { transform: translateZ(-40px); }
      :host([variant="extrude"]) .lmdc__layer--back { transform: translateZ(-60px); }
      @media (prefers-reduced-motion: reduce) { .lmdc, .lmdc__layer { transition: none !important; transform: none !important; } }
    `;
  }
  mounted() {
    this._interactive = this.getAttribute("interactive") !== "false", this.layers = Array.from(this.$$$(".lmdc__layer")), this._interactive && !p() && (this.addEventListener("pointermove", this.onMove), this.addEventListener("pointerleave", this.onLeave));
  }
  unmounted() {
    cancelAnimationFrame(this.raf), this.removeEventListener("pointermove", this.onMove), this.removeEventListener("pointerleave", this.onLeave);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "interactive" && (this._interactive = i !== "false");
  }
}
a(at, "tagName", "lumina-dimensional-card");
customElements.get(at.tagName) || customElements.define(at.tagName, at);
const Fe = ["left", "right", "bottom"], De = ["sm", "md", "lg", "full"], ci = { sm: "320px", md: "420px", lg: "560px", full: "100%" };
class rt extends l {
  constructor() {
    super(...arguments);
    a(this, "_open", !1);
    a(this, "_side", "right");
    a(this, "_size", "md");
    a(this, "backdrop", null);
    a(this, "panel", null);
    a(this, "prevFocus", null);
    a(this, "swipeStart", 0);
    a(this, "swiping", !1);
    a(this, "onKeydown", (t) => {
      if (this._open && (t.key === "Escape" && (t.preventDefault(), this.hide()), t.key === "Tab")) {
        const e = Array.from(this.shadow.querySelectorAll('button, [tabindex]:not([tabindex="-1"]), input'));
        if (e.length === 0) return;
        t.shiftKey && document.activeElement === e[0] ? (t.preventDefault(), e[e.length - 1].focus()) : !t.shiftKey && document.activeElement === e[e.length - 1] && (t.preventDefault(), e[0].focus());
      }
    });
    a(this, "onTouchStart", (t) => {
      t.touches.length === 1 && (this.swipeStart = this._side === "left" || this._side === "right" ? t.touches[0].clientX : t.touches[0].clientY, this.swiping = !0);
    });
    a(this, "onTouchMove", (t) => {
      if (!this.swiping || !this.panel) return;
      const e = this._side === "bottom" ? t.touches[0].clientY : t.touches[0].clientX, i = this._side === "left" ? e - this.swipeStart : this._side === "right" ? this.swipeStart - e : e - this.swipeStart;
      i > 0 && (this._side === "bottom" ? this.panel.style.transform = `translateY(${i}px)` : this.panel.style.transform = `translateX(${this._side === "left" ? i : -i}px)`);
    });
    a(this, "onTouchEnd", (t) => {
      if (!this.swiping || !this.panel) return;
      this.swiping = !1;
      const e = this._side === "bottom" ? t.changedTouches[0].clientY : t.changedTouches[0].clientX, i = this._side === "left" ? e - this.swipeStart : this._side === "right" ? this.swipeStart - e : e - this.swipeStart;
      this.panel.style.transform = "", i > 80 && this.hide();
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "open", "side", "size"];
  }
  get open() {
    return this._open;
  }
  set open(t) {
    t ? this.show() : this.hide();
  }
  render() {
    return `
      <div class="lmdm" part="backdrop" aria-hidden="true"></div>
      <aside class="lmdm__panel" part="panel" role="dialog" aria-modal="true">
        <header class="lmdm__header" part="header"><slot name="title">Drawer</slot><button class="lmdm__close" aria-label="Fechar">×</button></header>
        <div class="lmdm__content" part="content"><slot></slot></div>
      </aside>
    `;
  }
  styles() {
    return `
      :host { display: contents; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmdm-size: 420px; }
      .lmdm { position: fixed; inset: 0; background: rgb(0 0 0 / 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); opacity: 0; pointer-events: none; z-index: 999; transition: opacity calc(var(--lumina-speed) * 1.2) var(--lumina-ease-out); }
      :host([data-open]) .lmdm { opacity: 1; pointer-events: auto; }
      .lmdm__panel { position: fixed; z-index: 1000; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.1)); backdrop-filter: blur(24px) saturate(1.6); -webkit-backdrop-filter: blur(24px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 0 80px -20px rgb(0 0 0 / 0.7); display: flex; flex-direction: column; transition: transform calc(var(--lumina-speed) * 1.2) var(--lumina-ease-spring); will-change: transform; touch-action: pan-y; }
      :host([side="left"]) .lmdm__panel { top: 0; bottom: 0; left: 0; width: var(--lmdm-size); max-width: 100vw; transform: translateX(-105%); }
      :host([side="right"]) .lmdm__panel { top: 0; bottom: 0; right: 0; width: var(--lmdm-size); max-width: 100vw; transform: translateX(105%); }
      :host([side="bottom"]) .lmdm__panel { left: 0; right: 0; bottom: 0; height: var(--lmdm-size); max-height: 100vh; transform: translateY(105%); flex-direction: column; }
      :host([data-open]) .lmdm__panel { transform: translate(0); }
      .lmdm__header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--lumina-border); flex-shrink: 0; }
      .lmdm__close { appearance: none; border: 0; background: rgb(255 255 255 / 0.06); color: var(--lumina-text); width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.2s; }
      .lmdm__close:hover { transform: rotate(90deg); background: rgb(var(--lumina-accent-rgb) / 0.3); }
      .lmdm__content { flex: 1; overflow-y: auto; padding: 20px; }
      :host([variant="void"]) .lmdm__panel { background: rgb(0 0 0 / 0.85); border-color: rgb(var(--lumina-accent-rgb) / 0.2); }
      @media (prefers-reduced-motion: reduce) { .lmdm, .lmdm__panel { transition: none !important; } }
    `;
  }
  mounted() {
    this._side = f(this.getAttribute("side"), Fe, "right"), this._size = f(this.getAttribute("size"), De, "md"), this.backdrop = this.$$(".lmdm"), this.panel = this.$$(".lmdm__panel"), this.applySize(), this.backdrop?.addEventListener("click", () => this.hide()), this.$$(".lmdm__close")?.addEventListener("click", () => this.hide()), this.panel?.addEventListener("touchstart", this.onTouchStart, { passive: !0 }), this.panel?.addEventListener("touchmove", this.onTouchMove, { passive: !0 }), this.panel?.addEventListener("touchend", this.onTouchEnd), document.addEventListener("keydown", this.onKeydown), this.hasAttribute("open") && requestAnimationFrame(() => this.show());
  }
  unmounted() {
    document.removeEventListener("keydown", this.onKeydown), document.body.style.overflow = "";
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "open" ? i !== null ? this.show() : this.hide() : t === "side" ? this._side = f(i, Fe, "right") : t === "size" && (this._size = f(i, De, "md"), this.applySize());
  }
  applySize() {
    this.style.setProperty("--lmdm-size", ci[this._size]);
  }
  show() {
    this._open || (this._open = !0, this.setAttribute("data-open", ""), this.setAttribute("open", ""), this.prevFocus = document.activeElement, document.body.style.overflow = "hidden", this.dispatchEvent(new CustomEvent("lumina-open", { bubbles: !0, composed: !0 })), setTimeout(() => this.focusFirst(), 120));
  }
  hide() {
    this._open && (this._open = !1, this.removeAttribute("data-open"), this.removeAttribute("open"), document.body.style.overflow = "", this.prevFocus?.focus(), this.dispatchEvent(new CustomEvent("lumina-close", { bubbles: !0, composed: !0 })));
  }
  focusFirst() {
    this.shadow.querySelector('button, [tabindex]:not([tabindex="-1"]), input')?.focus();
  }
}
a(rt, "tagName", "lumina-drawer-modal");
customElements.get(rt.tagName) || customElements.define(rt.tagName, rt);
const Ye = ["left", "right"], Xe = ["sm", "md", "lg", "full"], di = {
  sm: "320px",
  md: "420px",
  lg: "560px",
  full: "100vw"
};
class st extends l {
  constructor() {
    super(...arguments);
    a(this, "backdrop", null);
    a(this, "panel", null);
    a(this, "_open", !1);
    a(this, "_placement", "left");
    a(this, "_size", "md");
    a(this, "previouslyFocused", null);
    a(this, "swipeStartX", 0);
    a(this, "swipeCurrentX", 0);
    a(this, "swiping", !1);
    a(this, "onKeydown", (t) => {
      if (this._open) {
        if (t.key === "Escape") {
          t.preventDefault(), this.hide();
          return;
        }
        if (t.key === "Tab") {
          const e = Array.from(
            this.shadow.querySelectorAll(
              'button, [tabindex]:not([tabindex="-1"]), input, a[href]'
            )
          );
          if (e.length === 0) return;
          const i = e[0], r = e[e.length - 1];
          t.shiftKey && document.activeElement === i ? (t.preventDefault(), r.focus()) : !t.shiftKey && document.activeElement === r && (t.preventDefault(), i.focus());
        }
      }
    });
    /* ---------------------------------------------------------------- */
    /* Swipe-to-close (mobile)                                          */
    /* ---------------------------------------------------------------- */
    a(this, "onTouchStart", (t) => {
      t.touches.length === 1 && (this.swipeStartX = t.touches[0].clientX, this.swipeCurrentX = this.swipeStartX, this.swiping = !0, this.setAttribute("data-swiping", ""));
    });
    a(this, "onTouchMove", (t) => {
      if (!this.swiping || t.touches.length !== 1) return;
      this.swipeCurrentX = t.touches[0].clientX;
      const e = this.swipeCurrentX - this.swipeStartX;
      (this._placement === "left" && e < 0 || this._placement === "right" && e > 0) && this.panel && (this.panel.style.transform = `translateX(${e}px)`);
    });
    a(this, "onTouchEnd", () => {
      if (!this.swiping) return;
      this.swiping = !1, this.removeAttribute("data-swiping");
      const t = this.swipeCurrentX - this.swipeStartX, e = 80, i = this._placement === "left" && t < -e || this._placement === "right" && t > e;
      this.panel && (this.panel.style.transform = ""), i && this.hide();
    });
  }
  static get observedAttributes() {
    return [
      ...l.observedAttributes,
      "open",
      "placement",
      "size"
    ];
  }
  get open() {
    return this._open;
  }
  set open(t) {
    t ? this.show() : this.hide();
  }
  get placement() {
    return this._placement;
  }
  set placement(t) {
    this._placement = t, this.setAttribute("placement", t);
  }
  get size() {
    return this._size;
  }
  set size(t) {
    this._size = t, this.setAttribute("size", t);
  }
  render() {
    return `
      <div class="lmd" part="backdrop" aria-hidden="true"></div>
      <aside class="lmd__drawer" part="drawer" role="dialog" aria-modal="true">
        <header class="lmd__header" part="header">
          <slot name="header"><span class="lmd__default-title">Drawer</span></slot>
          <button class="lmd__close" part="close" type="button" aria-label="Fechar">×</button>
        </header>
        <div class="lmd__content" part="content">
          <slot></slot>
        </div>
      </aside>
    `;
  }
  styles() {
    return `
      :host {
        display: contents;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        --lmd-width: 420px;
      }

      .lmd {
        position: fixed;
        inset: 0;
        background: rgb(0 0 0 / 0.6);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        opacity: 0;
        pointer-events: none;
        z-index: 999;
        transition: opacity calc(var(--lumina-speed) * 1.4) var(--lumina-ease-out);
      }
      :host([data-open]) .lmd {
        opacity: 1;
        pointer-events: auto;
      }

      .lmd__drawer {
        position: fixed;
        top: 0;
        bottom: 0;
        width: var(--lmd-width);
        max-width: 100vw;
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.1));
        -webkit-backdrop-filter: blur(24px) saturate(1.6);
        backdrop-filter: blur(24px) saturate(1.6);
        -webkit-backdrop-filter: blur(24px) saturate(1.6);
        border: 1px solid var(--lumina-border);
        box-shadow:
          0 0 80px -20px rgb(0 0 0 / 0.7),
          inset 0 1px 0 0 rgb(255 255 255 / 0.10);
        display: flex;
        flex-direction: column;
        z-index: 1000;
        transition: transform calc(var(--lumina-speed) * 1.4) var(--lumina-ease-spring);
        will-change: transform;
        touch-action: pan-y;
      }

      :host([placement="left"]) .lmd__drawer {
        left: 0;
        transform: translateX(-105%);
        border-left: 0;
        border-right: 1px solid var(--lumina-border);
      }
      :host([placement="right"]) .lmd__drawer {
        right: 0;
        transform: translateX(105%);
        border-right: 0;
        border-left: 1px solid var(--lumina-border);
      }
      :host([data-open]) .lmd__drawer {
        transform: translateX(0);
      }
      :host([data-swiping]) .lmd__drawer {
        transition: none;
      }

      .lmd__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--lumina-border);
        flex-shrink: 0;
      }
      ::slotted([slot="header"]) {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
      }
      .lmd__default-title { font-size: 16px; font-weight: 700; }

      .lmd__close {
        appearance: none;
        border: 0;
        background: rgb(255 255 255 / 0.06);
        color: var(--lumina-text);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.2s;
      }
      .lmd__close:hover {
        background: rgb(var(--lumina-accent-rgb) / 0.3);
        transform: rotate(90deg);
      }
      .lmd__close:focus-visible {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 2px;
      }

      .lmd__content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      /* Variant: void — pure black + neon edge */
      :host([variant="void"]) .lmd__drawer {
        background: rgb(0 0 0 / 0.85);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }
      :host([variant="void"]) .lmd__header {
        border-color: rgb(var(--lumina-accent-rgb) / 0.2);
      }

      /* Variant: dimensional — entrance with rotateY */
      :host([variant="dimensional"]) .lmd__drawer {
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"][placement="left"]) .lmd__drawer {
        transform: translateX(-105%) perspective(1200px) rotateY(35deg);
        transform-origin: right center;
      }
      :host([variant="dimensional"][placement="right"]) .lmd__drawer {
        transform: translateX(105%) perspective(1200px) rotateY(-35deg);
        transform-origin: left center;
      }
      :host([variant="dimensional"][data-open]) .lmd__drawer {
        transform: translateX(0) perspective(1200px) rotateY(0deg);
      }

      @media (prefers-reduced-motion: reduce) {
        .lmd, .lmd__drawer, .lmd__close {
          transition: none !important;
          animation: none !important;
        }
      }

      @media (max-width: 600px) {
        :host { --lmd-width: 100vw; }
        .lmd__drawer { width: 100vw !important; }
      }
    `;
  }
  mounted() {
    this.backdrop = this.$$(".lmd"), this.panel = this.$$(".lmd__drawer"), this._placement = f(this.getAttribute("placement"), Ye, "left"), this._size = f(this.getAttribute("size"), Xe, "md"), this.applyPlacement(), this.applySize(), this.backdrop?.addEventListener("click", () => this.hide()), this.$$(".lmd__close")?.addEventListener("click", () => this.hide()), this.panel?.addEventListener("touchstart", this.onTouchStart, { passive: !0 }), this.panel?.addEventListener("touchmove", this.onTouchMove, { passive: !0 }), this.panel?.addEventListener("touchend", this.onTouchEnd), document.addEventListener("keydown", this.onKeydown), this.hasAttribute("open") && requestAnimationFrame(() => this.show());
  }
  unmounted() {
    this.panel?.removeEventListener("touchstart", this.onTouchStart), this.panel?.removeEventListener("touchmove", this.onTouchMove), this.panel?.removeEventListener("touchend", this.onTouchEnd), document.removeEventListener("keydown", this.onKeydown), document.body.style.overflow = "";
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "open" ? i !== null ? this.show() : this.hide() : t === "placement" ? (this._placement = f(i, Ye, "left"), this.applyPlacement()) : t === "size" && (this._size = f(i, Xe, "md"), this.applySize());
  }
  applyPlacement() {
  }
  applySize() {
    this.style.setProperty("--lmd-width", di[this._size]);
  }
  /** Public API: open the drawer. */
  show() {
    this._open || (this._open = !0, this.setAttribute("data-open", ""), this.setAttribute("open", ""), this.previouslyFocused = document.activeElement, document.body.style.overflow = "hidden", this.dispatchEvent(new CustomEvent("lumina-open", { bubbles: !0, composed: !0 })), setTimeout(() => this.focusFirst(), 120));
  }
  /** Public API: close the drawer. */
  hide() {
    this._open && (this._open = !1, this.removeAttribute("data-open"), this.removeAttribute("open"), document.body.style.overflow = "", this.previouslyFocused?.focus(), this.dispatchEvent(new CustomEvent("lumina-close", { bubbles: !0, composed: !0 })));
  }
  focusFirst() {
    this.shadow.querySelector(
      'button, [tabindex]:not([tabindex="-1"]), input, a[href]'
    )?.focus();
  }
}
a(st, "tagName", "lumina-drawer");
customElements.get(st.tagName) || customElements.define(st.tagName, st);
class nt extends l {
  constructor() {
    super(...arguments);
    a(this, "_echoCount", 3);
    a(this, "container", null);
    a(this, "onClick", (t) => {
      const e = this.getBoundingClientRect(), i = t.clientX - e.left, r = t.clientY - e.top;
      this.spawnEchoes(i, r), this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 })), this.dispatchEvent(new CustomEvent("lumina-echo", { bubbles: !0, composed: !0, detail: { x: i, y: r } }));
    });
    a(this, "onKeydown", (t) => {
      if (t.key === "Enter" || t.key === " ") {
        t.preventDefault();
        const e = this.getBoundingClientRect();
        this.spawnEchoes(e.width / 2, e.height / 2), this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
      }
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "echo-count"];
  }
  get echoCount() {
    return this._echoCount;
  }
  set echoCount(t) {
    this._echoCount = t, this.setAttribute("echo-count", String(t));
  }
  render() {
    return `
      <button class="lmeb" part="button" type="button">
        <span class="lmeb__bg" aria-hidden="true"></span>
        <span class="lmeb__echo" part="echo" aria-hidden="true"></span>
        <span class="lmeb__label"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmeb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmeb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmeb__echo { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; border-radius: inherit; }
      .lmeb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmeb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmeb__bg { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      :host(:active) .lmeb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="aura"]) .lmeb { animation: lmeb-float 4s ease-in-out infinite; }
      @keyframes lmeb-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      .lmeb__wave {
        position: absolute; border-radius: 50%; pointer-events: none;
        border: 2px solid var(--lumina-accent);
        transform: translate(-50%, -50%) scale(0);
        animation: lmeb-wave calc(var(--lumina-speed) * 3) var(--lumina-ease-out) forwards;
      }
      @keyframes lmeb-wave {
        0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
        100% { transform: translate(-50%, -50%) scale(10); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) { .lmeb, .lmeb__wave { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    this._echoCount = parseInt(this.getAttribute("echo-count") ?? "3", 10) || 3, this.container = this.$$(".lmeb__echo"), this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.$$(".lmeb")?.addEventListener("click", this.onClick), this.$$(".lmeb")?.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "echo-count" && (this._echoCount = parseInt(i ?? "3", 10) || 3);
  }
  spawnEchoes(t, e) {
    if (!(p() || !this.container))
      for (let i = 0; i < this._echoCount; i++)
        setTimeout(() => {
          const r = document.createElement("span");
          r.className = "lmeb__wave", r.style.left = `${t}px`, r.style.top = `${e}px`, r.style.width = "20px", r.style.height = "20px", this.container.appendChild(r), setTimeout(() => r.remove(), 1500);
        }, i * 150);
  }
}
a(nt, "tagName", "lumina-echo-button");
customElements.get(nt.tagName) || customElements.define(nt.tagName, nt);
class ot extends l {
  constructor() {
    super(...arguments);
    a(this, "_echoIntensity", 0.7);
    a(this, "echoLayer", null);
    a(this, "onClick", (t) => {
      const e = this.getBoundingClientRect(), i = t.clientX - e.left, r = t.clientY - e.top;
      this.spawnEcho(i, r, 3), this.dispatchEvent(new CustomEvent("lumina-echo", { bubbles: !0, composed: !0, detail: { x: i, y: r, intensity: this._echoIntensity, type: "click" } }));
    });
    a(this, "onHover", () => {
      const t = this.getBoundingClientRect();
      this.spawnEcho(t.width / 2, t.height / 2, 1), this.dispatchEvent(new CustomEvent("lumina-echo", { bubbles: !0, composed: !0, detail: { type: "hover", intensity: this._echoIntensity } }));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "echo-intensity"];
  }
  get echoIntensity() {
    return this._echoIntensity;
  }
  set echoIntensity(t) {
    this._echoIntensity = v(t, 0, 1), this.setAttribute("echo-intensity", String(this._echoIntensity));
  }
  render() {
    return `
      <article class="lmec" part="card">
        <div class="lmec__echo" part="echo-layer" aria-hidden="true"></div>
        <div class="lmec__surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmec { position: relative; display: block; border-radius: inherit; overflow: hidden; }
      .lmec__echo { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 1; overflow: hidden; }
      .lmec__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; }
      .lmec__wave { position: absolute; border-radius: 50%; pointer-events: none; border: 2px solid rgb(var(--lumina-accent-rgb) / 0.6); transform: translate(-50%, -50%) scale(0); animation: lmec-wave calc(var(--lumina-speed) * 3) var(--lumina-ease-out) forwards; }
      @keyframes lmec-wave { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; } 100% { transform: translate(-50%, -50%) scale(12); opacity: 0; } }
      :host([variant="aura"]) .lmec__surface { background: radial-gradient(120% 100% at 50% 0%, rgb(var(--lumina-accent-rgb) / 0.15), rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%); }
      :host([variant="neural"]) .lmec__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmec__wave { animation: none !important; } }
    `;
  }
  mounted() {
    this._echoIntensity = v(parseFloat(this.getAttribute("echo-intensity") ?? "0.7") || 0.7, 0, 1), this.echoLayer = this.$$(".lmec__echo"), this.addEventListener("click", this.onClick), this.addEventListener("pointerenter", this.onHover);
  }
  unmounted() {
    this.removeEventListener("click", this.onClick), this.removeEventListener("pointerenter", this.onHover);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "echo-intensity" && (this._echoIntensity = v(parseFloat(i ?? "0.7") || 0.7, 0, 1));
  }
  spawnEcho(t, e, i = 1) {
    if (this.echoLayer)
      for (let r = 0; r < i; r++)
        setTimeout(() => {
          const s = document.createElement("span");
          s.className = "lmec__wave", s.style.left = `${t}px`, s.style.top = `${e}px`, s.style.width = "20px", s.style.height = "20px", s.style.opacity = String(this._echoIntensity), this.echoLayer.appendChild(s), setTimeout(() => s.remove(), 1500);
        }, r * 200);
  }
}
a(ot, "tagName", "lumina-echo-card");
customElements.get(ot.tagName) || customElements.define(ot.tagName, ot);
class lt extends l {
  constructor() {
    super(...arguments);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "echoes", []);
    a(this, "raf", 0);
    a(this, "onInteract", (t) => {
      const e = t, i = this.getBoundingClientRect(), r = e.clientX ? e.clientX - i.left : i.width / 2, s = e.clientY ? e.clientY - i.top : i.height / 2;
      this.echoes.push({ x: r, y: s, radius: 0, life: 0, maxLife: 60 }), this.querySelectorAll("lumina-card, lumina-button, lumina-badge, lumina-chip").forEach((n, d) => {
        setTimeout(() => {
          n.style.transition = "box-shadow 0.4s var(--lumina-ease-out)";
          const u = n.style.boxShadow;
          n.style.boxShadow = "0 0 20px rgb(var(--lumina-accent-rgb) / 0.6)", setTimeout(() => {
            n.style.boxShadow = u;
          }, 400);
        }, d * 50);
      }), this.dispatchEvent(new CustomEvent("lumina-echo", { bubbles: !0, composed: !0, detail: { x: r, y: s } })), this.dispatchEvent(new CustomEvent("lumina-pulse", { bubbles: !0, composed: !0 }));
    });
    a(this, "tick", () => {
      if (!this.ctx || !this.canvas) {
        this.raf = requestAnimationFrame(this.tick);
        return;
      }
      const t = window.devicePixelRatio || 1, e = this.clientWidth, i = this.clientHeight;
      this.canvas.width !== e * t && (this.canvas.width = e * t, this.canvas.height = i * t, this.canvas.style.width = `${e}px`, this.canvas.style.height = `${i}px`, this.ctx.setTransform(t, 0, 0, t, 0, 0)), this.ctx.clearRect(0, 0, e, i);
      const r = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255";
      this.echoes = this.echoes.filter((s) => s.life < s.maxLife);
      for (const s of this.echoes) {
        s.life += 1, s.radius = s.life / s.maxLife * Math.max(e, i) * 0.5;
        const n = (1 - s.life / s.maxLife) * 0.3 * (this.getAttribute("variant") === "intense" ? 1.5 : this.getAttribute("variant") === "subtle" ? 0.5 : 1);
        this.ctx.strokeStyle = `rgba(${r} / ${n})`, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2), this.ctx.stroke();
      }
      this.raf = requestAnimationFrame(this.tick);
    });
  }
  render() {
    return '<div class="lmes" part="root"><div class="lmes__source" part="source"><slot></slot></div><canvas class="lmes__echoes" aria-hidden="true"></canvas></div>';
  }
  styles() {
    return `
      :host { display: block; position: relative; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmes { position: relative; }
      .lmes__source { position: relative; z-index: 1; }
      .lmes__echoes { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
    `;
  }
  mounted() {
    this.canvas = this.$$(".lmes__echoes"), this.ctx = this.canvas?.getContext("2d") ?? null, this.addEventListener("lumina-click", this.onInteract), this.addEventListener("lumina-press", this.onInteract), this.addEventListener("click", this.onInteract), p() || (this.raf = requestAnimationFrame(this.tick));
  }
  unmounted() {
    cancelAnimationFrame(this.raf);
  }
  onConfigChange(t) {
  }
}
a(lt, "tagName", "lumina-echo-system");
customElements.get(lt.tagName) || customElements.define(lt.tagName, lt);
const Ve = ["bottom-right", "bottom-left", "top-right", "top-left"];
class ct extends l {
  constructor() {
    super(...arguments);
    a(this, "_extended", !1);
    a(this, "_position", "bottom-right");
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "extended", "position"];
  }
  get extended() {
    return this._extended;
  }
  set extended(t) {
    this._extended = t, t ? this.setAttribute("extended", "") : this.removeAttribute("extended");
  }
  get position() {
    return this._position;
  }
  set position(t) {
    this._position = t, this.setAttribute("position", t);
  }
  render() {
    return `
      <button class="lmfb" part="button" type="button">
        <span class="lmfb__bg" aria-hidden="true"></span>
        <span class="lmfb__glow" part="glow" aria-hidden="true"></span>
        <span class="lmfb__icon" part="icon"><slot></slot></span>
        <span class="lmfb__label" part="label"><slot name="label"></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { position: fixed; z-index: 900; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmfb {
        position: relative; display: inline-flex; align-items: center; gap: 0;
        height: 56px; min-width: 56px; padding: 0; border: 0; background: transparent;
        color: inherit; cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring),
                    box-shadow var(--lumina-speed) var(--lumina-ease-out),
                    min-width var(--lumina-speed) var(--lumina-ease-spring);
        animation: lmfb-enter calc(var(--lumina-speed) * 2) var(--lumina-ease-spring);
        will-change: transform;
      }
      @keyframes lmfb-enter { from { opacity: 0; transform: scale(0) rotate(-90deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
      .lmfb__bg {
        position: absolute; inset: 0; border-radius: inherit;
        background: linear-gradient(135deg, rgb(var(--lumina-accent-rgb) / 0.9), rgb(var(--lumina-accent-rgb) / 0.6));
        backdrop-filter: blur(14px) saturate(1.5);
        -webkit-backdrop-filter: blur(14px) saturate(1.5);
        box-shadow: 0 8px 24px -4px rgb(var(--lumina-accent-rgb) / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.3);
        z-index: 0;
      }
      .lmfb__glow {
        position: absolute; inset: -25%; border-radius: inherit; pointer-events: none; z-index: 0;
        opacity: 0; background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / 0.5), transparent 65%);
        filter: blur(20px); transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmfb__icon {
        position: relative; z-index: 1; font-size: 22px; width: 56px; height: 56px;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .lmfb__label {
        position: relative; z-index: 1; font-size: 14px; font-weight: 600; white-space: nowrap;
        max-width: 0; opacity: 0; overflow: hidden; transition: max-width var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out), padding var(--lumina-speed) var(--lumina-ease-spring);
        padding-right: 0;
      }
      :host([extended]) .lmfb__label { max-width: 200px; opacity: 1; padding-right: 20px; }
      :host([extended]) .lmfb { min-width: auto; }
      :host(:hover) .lmfb { transform: translateY(-4px) scale(1.04); box-shadow: 0 14px 36px -6px rgb(var(--lumina-accent-rgb) / 0.6); }
      :host(:hover) .lmfb__glow { opacity: calc(0.7 * var(--lumina-intensity)); }
      :host(:active) .lmfb { transform: translateY(-2px) scale(0.98); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([position="bottom-right"]) { bottom: 24px; right: 24px; }
      :host([position="bottom-left"])  { bottom: 24px; left: 24px; }
      :host([position="top-right"])    { top: 24px; right: 24px; }
      :host([position="top-left"])     { top: 24px; left: 24px; }
      :host([variant="aura"]) .lmfb { animation: lmfb-enter calc(var(--lumina-speed) * 2) var(--lumina-ease-spring), lmfb-float 4s ease-in-out infinite calc(var(--lumina-speed) * 2); }
      @keyframes lmfb-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      @media (prefers-reduced-motion: reduce) { .lmfb { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    this._extended = this.hasAttribute("extended"), this._position = f(this.getAttribute("position"), Ve, "bottom-right"), this.applyPosition(), this.getAttribute("role") !== "button" && this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.$$(".lmfb")?.addEventListener("click", () => this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 })));
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "extended" ? this._extended = i !== null : t === "position" && (this._position = f(i, Ve, "bottom-right"), this.applyPosition());
  }
  applyPosition() {
  }
}
a(ct, "tagName", "lumina-fab");
customElements.get(ct.tagName) || customElements.define(ct.tagName, ct);
class dt extends l {
  constructor() {
    super(...arguments);
    a(this, "_accept", "");
    a(this, "_multiple", !1);
    a(this, "_maxSize", 0);
    a(this, "files", []);
    a(this, "dropzone", null);
    a(this, "fileInput", null);
    a(this, "previewEl", null);
    a(this, "progressEl", null);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "accept", "multiple", "max-size"];
  }
  get accept() {
    return this._accept;
  }
  set accept(t) {
    this._accept = t, this.setAttribute("accept", t);
  }
  get multiple() {
    return this._multiple;
  }
  set multiple(t) {
    this._multiple = t, t ? this.setAttribute("multiple", "") : this.removeAttribute("multiple");
  }
  get maxSize() {
    return this._maxSize;
  }
  set maxSize(t) {
    this._maxSize = t, this.setAttribute("max-size", String(t));
  }
  render() {
    return `
      <div class="lmfu" part="dropzone">
        <input class="lmfu__input" type="file" ${this._accept ? `accept="${this._accept}"` : ""} ${this._multiple ? "multiple" : ""} hidden />
        <div class="lmfu__zone" data-zone>
          <div class="lmfu__bg" aria-hidden="true"></div>
          <div class="lmfu__suction" aria-hidden="true"></div>
          <div class="lmfu__content">
            <div class="lmfu__icon">📁</div>
            <div class="lmfu__text">Arraste arquivos aqui ou <span class="lmfu__link">clique para selecionar</span></div>
            <div class="lmfu__hint">${this._accept ? `Aceita: ${this._accept}` : "Qualquer tipo de arquivo"}</div>
          </div>
        </div>
        <div class="lmfu__preview" part="preview" data-preview></div>
        <div class="lmfu__progress" part="progress" data-progress hidden></div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmfu { display: flex; flex-direction: column; gap: 12px; }
      .lmfu__zone { position: relative; display: flex; align-items: center; justify-content: center; min-height: 140px; border-radius: var(--lumina-radius-lg); overflow: hidden; cursor: pointer; transition: transform var(--lumina-speed) var(--lumina-ease-spring); }
      .lmfu__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 2px dashed var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out), background var(--lumina-speed) var(--lumina-ease-out); }
      .lmfu__zone:hover .lmfu__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmfu__zone[data-dragging] .lmfu__bg { border-color: var(--lumina-accent); background: rgb(var(--lumina-accent-rgb) / 0.1); }
      .lmfu__zone[data-dragging] { transform: scale(0.97); }
      .lmfu__suction { position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / 0.4), transparent 70%); transform: translate(-50%, -50%); opacity: 0; pointer-events: none; }
      .lmfu__zone[data-dragging] .lmfu__suction { animation: lmfu-suction 0.6s var(--lumina-ease-out); }
      @keyframes lmfu-suction { 0% { width: 0; height: 0; opacity: 1; } 100% { width: 200px; height: 200px; opacity: 0; } }
      .lmfu__content { position: relative; z-index: 1; text-align: center; padding: 20px; }
      .lmfu__icon { font-size: 32px; margin-bottom: 8px; }
      .lmfu__text { font-size: 14px; color: var(--lumina-text); }
      .lmfu__link { color: var(--lumina-accent); font-weight: 600; cursor: pointer; }
      .lmfu__hint { font-size: 11px; color: var(--lumina-text-muted); margin-top: 4px; }
      .lmfu__preview { display: flex; flex-wrap: wrap; gap: 8px; }
      .lmfu__file { position: relative; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); border: 1px solid var(--lumina-border); animation: lmfu-file-in var(--lumina-speed) var(--lumina-ease-spring); }
      @keyframes lmfu-file-in { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .lmfu__file-img { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; cursor: zoom-in; transition: transform 0.2s; }
      .lmfu__file-img:hover { transform: scale(1.5); z-index: 2; }
      .lmfu__file-icon { font-size: 24px; }
      .lmfu__file-info { display: flex; flex-direction: column; gap: 2px; }
      .lmfu__file-name { font-size: 13px; font-weight: 600; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .lmfu__file-size { font-size: 11px; color: var(--lumina-text-muted); }
      .lmfu__file-remove { appearance: none; border: 0; background: rgb(239 68 68 / 0.2); color: #f87171; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
      .lmfu__file-remove:hover { background: rgb(239 68 68 / 0.4); }
      .lmfu__progress { height: 4px; border-radius: 2px; background: rgb(var(--lumina-surface) / 0.4); overflow: hidden; }
      .lmfu__progress-bar { height: 100%; width: 0%; border-radius: inherit; background: linear-gradient(90deg, rgb(var(--lumina-accent-rgb) / 0.7), var(--lumina-accent)); box-shadow: 0 0 8px var(--lumina-accent); transition: width 0.2s var(--lumina-ease-out); }
      @media (prefers-reduced-motion: reduce) { .lmfu__zone, .lmfu__file, .lmfu__progress-bar { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this._accept = this.getAttribute("accept") ?? "", this._multiple = this.hasAttribute("multiple"), this._maxSize = parseInt(this.getAttribute("max-size") ?? "0", 10) || 0, this.dropzone = this.$$(".lmfu__zone"), this.fileInput = this.$$(".lmfu__input"), this.previewEl = this.$$(".lmfu__preview"), this.progressEl = this.$$(".lmfu__progress"), this.dropzone?.addEventListener("click", () => this.fileInput?.click()), this.fileInput?.addEventListener("change", (t) => {
      const e = t.target.files;
      e && this.addFiles(Array.from(e));
    }), this.dropzone?.addEventListener("dragover", (t) => {
      t.preventDefault(), this.dropzone?.setAttribute("data-dragging", "");
    }), this.dropzone?.addEventListener("dragleave", () => this.dropzone?.removeAttribute("data-dragging")), this.dropzone?.addEventListener("drop", (t) => {
      t.preventDefault(), this.dropzone?.removeAttribute("data-dragging");
      const e = Array.from(t.dataTransfer?.files ?? []);
      e.length > 0 && this.addFiles(e);
    });
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "accept" ? this._accept = i ?? "" : t === "multiple" ? this._multiple = i !== null : t === "max-size" && (this._maxSize = parseInt(i ?? "0", 10) || 0);
  }
  addFiles(t) {
    this._multiple || (this.files = []);
    for (const e of t) {
      if (this._maxSize > 0 && e.size > this._maxSize) {
        this.dispatchEvent(new CustomEvent("lumina-file-error", { bubbles: !0, composed: !0, detail: { name: e.name, error: "size" } }));
        continue;
      }
      const i = { name: e.name, size: e.size, type: e.type, progress: 0 };
      e.type.startsWith("image/") && (i.url = URL.createObjectURL(e)), this.files.push(i), this.dispatchEvent(new CustomEvent("lumina-file-add", { bubbles: !0, composed: !0, detail: { name: e.name, size: e.size, type: e.type } })), this.simulateProgress(i);
    }
    this.renderPreview();
  }
  simulateProgress(t) {
    this.progressEl?.removeAttribute("hidden");
    const e = setInterval(() => {
      t.progress = Math.min(100, t.progress + Math.random() * 20), this.updateProgress(), t.progress >= 100 ? (clearInterval(e), this.dispatchEvent(new CustomEvent("lumina-upload-progress", { bubbles: !0, composed: !0, detail: { name: t.name, progress: 100 } })), setTimeout(() => {
        this.progressEl?.setAttribute("hidden", "");
      }, 500)) : this.dispatchEvent(new CustomEvent("lumina-upload-progress", { bubbles: !0, composed: !0, detail: { name: t.name, progress: t.progress } }));
    }, 200);
  }
  updateProgress() {
    const t = this.progressEl?.querySelector(".lmfu__progress-bar"), e = this.files.reduce((i, r) => i + r.progress, 0) / Math.max(this.files.length, 1);
    t && (t.style.width = `${e}%`);
  }
  renderPreview() {
    this.previewEl && (this.previewEl.innerHTML = "", this.files.forEach((t) => {
      const e = document.createElement("div");
      if (e.className = "lmfu__file", t.url)
        e.innerHTML = `<img class="lmfu__file-img" src="${t.url}" alt="${t.name}" /><div class="lmfu__file-info"><span class="lmfu__file-name">${t.name}</span><span class="lmfu__file-size">${this.formatSize(t.size)}</span></div><button class="lmfu__file-remove" aria-label="Remover">×</button>`;
      else {
        const i = t.type.startsWith("video/") ? "🎬" : t.type.startsWith("audio/") ? "🎵" : "📄";
        e.innerHTML = `<span class="lmfu__file-icon">${i}</span><div class="lmfu__file-info"><span class="lmfu__file-name">${t.name}</span><span class="lmfu__file-size">${this.formatSize(t.size)}</span></div><button class="lmfu__file-remove" aria-label="Remover">×</button>`;
      }
      e.querySelector(".lmfu__file-remove")?.addEventListener("click", () => this.removeFile(t)), this.previewEl.appendChild(e);
    }));
  }
  removeFile(t) {
    this.files = this.files.filter((e) => e !== t), this.renderPreview(), this.dispatchEvent(new CustomEvent("lumina-file-remove", { bubbles: !0, composed: !0, detail: { name: t.name } }));
  }
  formatSize(t) {
    return t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${(t / 1024).toFixed(1)} KB` : `${(t / (1024 * 1024)).toFixed(1)} MB`;
  }
}
a(dt, "tagName", "lumina-file-upload");
customElements.get(dt.tagName) || customElements.define(dt.tagName, dt);
class ut extends l {
  static get observedAttributes() {
    return [...l.observedAttributes];
  }
  render() {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        padding: 8px;
        border-radius: var(--lumina-radius-pill);
      }
      .lmc__glow {
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))), transparent 60%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      .lmc__inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow { transition: none !important; }
      }
`;
  }
  mounted() {
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
  /** Dispatch a CustomEvent with composed bubbling. */
  emit(o, t) {
    this.dispatchEvent(new CustomEvent(o, { bubbles: !0, composed: !0, detail: t }));
  }
  /** For overlay-style components: open/close helpers. */
  open() {
    this.setAttribute("open", ""), this.setAttribute("data-open", ""), this.emit("lumina-open");
  }
  close() {
    this.removeAttribute("open"), this.removeAttribute("data-open"), this.emit("lumina-close");
  }
}
a(ut, "tagName", "lumina-floating-nav");
customElements.get(ut.tagName) || customElements.define(ut.tagName, ut);
class mt extends l {
  constructor() {
    super(...arguments);
    a(this, "_open", !1);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "particles", []);
    a(this, "raf", 0);
    a(this, "tick", () => {
      if (!this.ctx) {
        this.raf = requestAnimationFrame(this.tick);
        return;
      }
      const t = window.innerWidth, e = window.innerHeight, i = t / 2, r = e / 2;
      this.ctx.clearRect(0, 0, t, e);
      const s = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "120 240 255";
      this.particles = this.particles.filter((n) => n.radius > 5);
      for (const n of this.particles) {
        n.angle += 0.03, n.radius *= 0.98, n.life += 1, n.x = i + Math.cos(n.angle) * n.radius, n.y = r + Math.sin(n.angle) * n.radius;
        const d = Math.max(0, 1 - n.life / 100) * 0.6;
        this.ctx.fillStyle = `rgba(${s} / ${d})`, this.ctx.beginPath(), this.ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2), this.ctx.fill();
      }
      for (; this.particles.length < 60; ) this.particles.push({ x: i, y: r, angle: Math.random() * Math.PI * 2, radius: 100 + Math.random() * 400, life: 0, size: g(1, 3) });
      this.raf = requestAnimationFrame(this.tick);
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "open"];
  }
  get open() {
    return this._open;
  }
  set open(t) {
    t ? this.show() : this.hide();
  }
  render() {
    return `
      <div class="lmfo" part="overlay">
        <div class="lmfo__backdrop" part="backdrop" aria-hidden="true"></div>
        <div class="lmfo__portal" aria-hidden="true"></div>
        <canvas class="lmfo__canvas" aria-hidden="true"></canvas>
        <div class="lmfo__content" part="content"><slot></slot></div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: contents; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmfo { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity calc(var(--lumina-speed) * 1.5) var(--lumina-ease-out); }
      :host([data-open]) .lmfo { opacity: 1; pointer-events: auto; }
      .lmfo__backdrop { position: absolute; inset: 0; background: rgb(0 0 0 / 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
      .lmfo__portal { position: absolute; top: 50%; left: 50%; width: 0; height: 0; transform: translate(-50%, -50%); border-radius: 50%; background: conic-gradient(from 0deg, transparent 0%, rgb(var(--lumina-accent-rgb) / 0.4) 15%, transparent 30%, rgb(var(--lumina-accent-rgb) / 0.6) 50%, transparent 70%, rgb(var(--lumina-accent-rgb) / 0.4) 85%, transparent 100%); filter: blur(30px); opacity: 0; pointer-events: none; }
      :host([data-open]) .lmfo__portal { animation: lmfo-portal calc(var(--lumina-speed) * 3) var(--lumina-ease-out) forwards; }
      @keyframes lmfo-portal { 0% { width: 0; height: 0; opacity: 1; } 100% { width: 200vmax; height: 200vmax; opacity: 0.3; } }
      .lmfo__canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      .lmfo__content { position: relative; z-index: 2; padding: 40px; text-align: center; max-width: 600px; }
      :host([variant="cosmic"]) .lmfo__backdrop { background: radial-gradient(ellipse at center, #0a0420 0%, #000 70%); }
      :host([variant="dimensional"]) .lmfo__backdrop { background: radial-gradient(ellipse at center, #06060c 0%, #000 70%); }
      @media (prefers-reduced-motion: reduce) { .lmfo, .lmfo__portal { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this.canvas = this.$$(".lmfo__canvas"), this.ctx = this.canvas?.getContext("2d") ?? null, this.hasAttribute("open") && requestAnimationFrame(() => this.show()), document.addEventListener("keydown", (t) => {
      t.key === "Escape" && this._open && this.hide();
    });
  }
  unmounted() {
    cancelAnimationFrame(this.raf);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "open" && (i !== null ? this.show() : this.hide());
  }
  show() {
    this._open || (this._open = !0, this.setAttribute("data-open", ""), this.setAttribute("open", ""), document.body.style.overflow = "hidden", p() || (this.resize(), this.spawnParticles(), this.raf = requestAnimationFrame(this.tick)), this.dispatchEvent(new CustomEvent("lumina-open", { bubbles: !0, composed: !0 })));
  }
  hide() {
    this._open && (this._open = !1, this.removeAttribute("data-open"), this.removeAttribute("open"), document.body.style.overflow = "", cancelAnimationFrame(this.raf), this.dispatchEvent(new CustomEvent("lumina-close", { bubbles: !0, composed: !0 })));
  }
  resize() {
    if (!this.canvas || !this.ctx) return;
    const t = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * t, this.canvas.height = window.innerHeight * t, this.ctx.setTransform(t, 0, 0, t, 0, 0);
  }
  spawnParticles() {
    const t = window.innerWidth / 2, e = window.innerHeight / 2;
    for (let i = 0; i < 60; i++)
      this.particles.push({ x: t, y: e, angle: Math.random() * Math.PI * 2, radius: 100 + Math.random() * 400, life: 0, size: g(1, 3) });
  }
}
a(mt, "tagName", "lumina-fullscreen-overlay");
customElements.get(mt.tagName) || customElements.define(mt.tagName, mt);
class ht extends l {
  constructor() {
    super(...arguments);
    a(this, "_gestures", ["hold", "swipe", "double-tap"]);
    a(this, "_holdDelay", 500);
    a(this, "pointerStartX", 0);
    a(this, "pointerStartY", 0);
    a(this, "pointerStartTime", 0);
    a(this, "holdTimer", null);
    a(this, "lastTapTime", 0);
    a(this, "feedback", null);
    a(this, "onPointerDown", (t) => {
      this.pointerStartX = t.clientX, this.pointerStartY = t.clientY, this.pointerStartTime = Date.now(), this._gestures.includes("hold") && (this.holdTimer = setTimeout(() => {
        this.emitGesture("hold"), this.holdTimer = null;
      }, this._holdDelay));
    });
    a(this, "onPointerMove", (t) => {
      if (!this.holdTimer) return;
      const e = Math.abs(t.clientX - this.pointerStartX), i = Math.abs(t.clientY - this.pointerStartY);
      (e > 10 || i > 10) && (clearTimeout(this.holdTimer), this.holdTimer = null);
    });
    a(this, "onPointerUp", (t) => {
      if (this.holdTimer) {
        clearTimeout(this.holdTimer), this.holdTimer = null;
        const e = t.clientX - this.pointerStartX, i = t.clientY - this.pointerStartY, r = Math.sqrt(e * e + i * i), s = Date.now() - this.pointerStartTime;
        if (this._gestures.includes("swipe") && r > 40 && s < 500) {
          this.emitGesture("swipe");
          return;
        }
        const n = Date.now();
        if (this._gestures.includes("double-tap") && n - this.lastTapTime < 300) {
          this.emitGesture("double-tap"), this.lastTapTime = 0;
          return;
        }
        this.lastTapTime = n, this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
      }
    });
    a(this, "onPointerCancel", () => {
      this.holdTimer && (clearTimeout(this.holdTimer), this.holdTimer = null);
    });
    a(this, "onKeydown", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 })));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "gestures", "hold-delay"];
  }
  get gestures() {
    return this._gestures;
  }
  set gestures(t) {
    this._gestures = t, this.setAttribute("gestures", t.join(","));
  }
  get holdDelay() {
    return this._holdDelay;
  }
  set holdDelay(t) {
    this._holdDelay = t, this.setAttribute("hold-delay", String(t));
  }
  render() {
    return `
      <button class="lmgb" part="button" type="button">
        <span class="lmgb__bg" aria-hidden="true"></span>
        <span class="lmgb__feedback" part="feedback" aria-hidden="true"></span>
        <span class="lmgb__label"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmgb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
        touch-action: none;
      }
      .lmgb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmgb__feedback { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 1; opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmgb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmgb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmgb__bg { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      :host(:active) .lmgb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      .lmgb__feedback[data-gesture="hold"] { background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / 0.5), transparent 70%); animation: lmgb-hold-feedback 0.4s var(--lumina-ease-out); }
      .lmgb__feedback[data-gesture="swipe"] { background: linear-gradient(90deg, transparent, rgb(var(--lumina-accent-rgb) / 0.4), transparent); animation: lmgb-swipe-feedback 0.5s var(--lumina-ease-out); }
      .lmgb__feedback[data-gesture="double-tap"] { background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / 0.6), transparent 60%); animation: lmgb-double-feedback 0.4s var(--lumina-ease-spring); }
      @keyframes lmgb-hold-feedback { 0% { opacity: 0; transform: scale(0.8); } 50% { opacity: 1; } 100% { opacity: 0; transform: scale(1.2); } }
      @keyframes lmgb-swipe-feedback { 0% { opacity: 0; transform: translateX(-100%); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateX(100%); } }
      @keyframes lmgb-double-feedback { 0% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; } 100% { opacity: 0; transform: scale(1.5); } }
      @media (prefers-reduced-motion: reduce) { .lmgb, .lmgb__feedback { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    const t = this.getAttribute("gestures");
    t && (this._gestures = t.split(",").map((i) => i.trim())), this._holdDelay = parseInt(this.getAttribute("hold-delay") ?? "500", 10) || 500, this.feedback = this.$$(".lmgb__feedback"), this.setAttribute("role", "button"), this.setAttribute("tabindex", "0");
    const e = this.$$(".lmgb");
    e?.addEventListener("pointerdown", this.onPointerDown), e?.addEventListener("pointerup", this.onPointerUp), e?.addEventListener("pointercancel", this.onPointerCancel), e?.addEventListener("pointermove", this.onPointerMove), e?.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
    this.holdTimer && clearTimeout(this.holdTimer);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "gestures" && i ? this._gestures = i.split(",").map((r) => r.trim()) : t === "hold-delay" && (this._holdDelay = parseInt(i ?? "500", 10) || 500);
  }
  emitGesture(t) {
    this.feedback && (this.feedback.setAttribute("data-gesture", t), setTimeout(() => this.feedback?.removeAttribute("data-gesture"), 500)), this.dispatchEvent(new CustomEvent("lumina-gesture", { bubbles: !0, composed: !0, detail: { type: t } }));
  }
}
a(ht, "tagName", "lumina-gesture-button");
customElements.get(ht.tagName) || customElements.define(ht.tagName, ht);
class pt extends l {
  constructor() {
    super(...arguments);
    a(this, "_blur", 18);
    a(this, "onPointerMove", w((t) => {
      const e = this.getBoundingClientRect(), i = (t.clientX - e.left) / e.width * 100, r = (t.clientY - e.top) / e.height * 100;
      this.style.setProperty("--lx", `${i}%`), this.style.setProperty("--ly", `${r}%`), this.dispatchEvent(new CustomEvent("lumina-hover", { bubbles: !0, composed: !0, detail: { x: i, y: r } }));
    }, 16));
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "blur"];
  }
  get blurAmount() {
    return this._blur;
  }
  set blurAmount(t) {
    this._blur = t, this.setAttribute("blur", String(t)), this.applyBlur();
  }
  render() {
    return `
      <article class="lmgc" part="card">
        <div class="lmgc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmgc__refraction" aria-hidden="true"></div>
        <div class="lmgc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); perspective: 800px; --lmgc-blur: 18px; }
      .lmgc { position: relative; display: block; border-radius: inherit; transition: transform var(--lumina-speed) var(--lumina-ease-spring); will-change: transform; }
      .lmgc__glow { position: absolute; inset: -10%; border-radius: inherit; pointer-events: none; z-index: 0; opacity: 0; background: radial-gradient(400px circle at var(--lx, 50%) var(--ly, 50%), rgb(var(--lumina-accent-rgb) / calc(0.4 * var(--lumina-intensity))), transparent 60%); filter: blur(30px); transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmgc__glow { opacity: 1; }
      :host(:hover) .lmgc { transform: translateY(-4px); }
      .lmgc__refraction { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 2; background: linear-gradient(135deg, rgb(255 255 255 / 0.12) 0%, transparent 30%, transparent 70%, rgb(255 255 255 / 0.08) 100%); mix-blend-mode: overlay; opacity: 0.6; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmgc__refraction { opacity: 1; background: linear-gradient(135deg, rgb(255 255 255 / 0.2) 0%, transparent 30%, transparent 70%, rgb(255 255 255 / 0.15) 100%); }
      .lmgc__surface { position: relative; z-index: 1; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(var(--lmgc-blur)) saturate(1.6); -webkit-backdrop-filter: blur(var(--lmgc-blur)) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.15), inset 0 -1px 0 0 rgb(0 0 0 / 0.1), var(--lumina-shadow); padding: 24px; overflow: hidden; }
      :host([variant="light"]) .lmgc__surface { background: rgb(255 255 255 / 0.55); border-color: rgb(255 255 255 / 0.4); }
      :host([variant="cosmic"]) .lmgc__surface { background: linear-gradient(135deg, rgb(180 120 255 / 0.25), rgb(120 240 255 / 0.15)); border-color: rgb(200 130 255 / 0.3); }
      @media (prefers-reduced-motion: reduce) { .lmgc, .lmgc__glow, .lmgc__refraction { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this._blur = parseFloat(this.getAttribute("blur") ?? "18") || 18, this.applyBlur(), this.addEventListener("pointermove", this.onPointerMove);
  }
  unmounted() {
    this.removeEventListener("pointermove", this.onPointerMove);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "blur" && (this._blur = parseFloat(i ?? "18") || 18, this.applyBlur());
  }
  applyBlur() {
    this.style.setProperty("--lmgc-blur", `${this._blur}px`);
  }
}
a(pt, "tagName", "lumina-glass-card");
customElements.get(pt.tagName) || customElements.define(pt.tagName, pt);
class bt extends l {
  constructor() {
    super(...arguments);
    a(this, "_glowIntensity", 0.6);
    a(this, "onMove", w((t) => {
      const e = this.getBoundingClientRect(), i = (t.clientX - e.left) / e.width * 100, r = (t.clientY - e.top) / e.height * 100;
      this.style.setProperty("--lx", `${i}%`), this.style.setProperty("--ly", `${r}%`), this.dispatchEvent(new CustomEvent("lumina-hover", { bubbles: !0, composed: !0, detail: { x: i, y: r } }));
    }, 16));
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "glow-intensity"];
  }
  get glowIntensity() {
    return this._glowIntensity;
  }
  set glowIntensity(t) {
    this._glowIntensity = v(t, 0, 1), this.setAttribute("glow-intensity", String(this._glowIntensity)), this.applyGlow();
  }
  render() {
    return `
      <article class="lmgl" part="card">
        <div class="lmgl__glow" part="glow" aria-hidden="true"></div>
        <div class="lmgl__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); --lmgl-intensity: 0.6; }
      .lmgl { position: relative; display: block; border-radius: inherit; }
      .lmgl__glow { position: absolute; inset: -5%; border-radius: inherit; pointer-events: none; z-index: 0; opacity: calc(0.3 * var(--lmgl-intensity)); background: radial-gradient(300px circle at var(--lx, 50%) var(--ly, 50%), rgb(var(--lumina-accent-rgb) / calc(0.8 * var(--lmgl-intensity))), transparent 60%); filter: blur(25px); transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmgl__glow { opacity: var(--lmgl-intensity); }
      .lmgl__surface { position: relative; z-index: 1; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; overflow: hidden; }
      :host([variant="aura"]) .lmgl__glow { animation: lmgl-pulse 3s ease-in-out infinite; }
      @keyframes lmgl-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      :host([variant="neural"]) .lmgl__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host([variant="void"]) .lmgl__surface { background: rgb(0 0 0 / 0.5); }
      :host([variant="void"]) .lmgl__glow { background: radial-gradient(300px circle at var(--lx, 50%) var(--ly, 50%), rgb(120 240 255 / calc(0.8 * var(--lmgl-intensity))), transparent 60%); }
      @media (prefers-reduced-motion: reduce) { .lmgl__glow { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    this._glowIntensity = v(parseFloat(this.getAttribute("glow-intensity") ?? "0.6") || 0.6, 0, 1), this.applyGlow(), this.addEventListener("pointermove", this.onMove);
  }
  unmounted() {
    this.removeEventListener("pointermove", this.onMove);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "glow-intensity" && (this._glowIntensity = v(parseFloat(i ?? "0.6") || 0.6, 0, 1), this.applyGlow());
  }
  applyGlow() {
    this.style.setProperty("--lmgl-intensity", String(this._glowIntensity));
  }
}
a(bt, "tagName", "lumina-glow-card");
customElements.get(bt.tagName) || customElements.define(bt.tagName, bt);
class gt extends l {
  constructor() {
    super(...arguments);
    a(this, "_columns", 3);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "columns"];
  }
  render() {
    return '<div class="lmgr" part="grid"><slot></slot></div>';
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmgr-cols: 3; }
      .lmgr { display: grid; grid-template-columns: repeat(var(--lmgr-cols), 1fr); gap: 16px; }
      :host([variant="masonry"]) .lmgr { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
      :host([variant="masonry"]) ::slotted(*) { flex: 1 1 calc(100% / var(--lmgr-cols) - 12px); min-width: 200px; }
      ::slotted(*) { border-radius: var(--lumina-radius-md); padding: 16px; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); transition: transform var(--lumina-speed) var(--lumina-ease-spring), box-shadow var(--lumina-speed) var(--lumina-ease-out); animation: lmgr-enter 0.4s var(--lumina-ease-spring) backwards; }
      @keyframes lmgr-enter { from { opacity: 0; transform: scale(0.8) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      ::slotted(*:hover) { transform: translateY(-6px) scale(1.03); box-shadow: 0 20px 40px -12px rgb(var(--lumina-accent-rgb) / 0.3), inset 0 1px 0 rgb(255 255 255 / 0.1); z-index: 1; }
      :host([variant="neural"]) ::slotted(*) { border-color: rgb(var(--lumina-accent-rgb) / 0.15); }
      :host([variant="neural"]) ::slotted(*:hover) { border-color: rgb(var(--lumina-accent-rgb) / 0.4); box-shadow: 0 20px 40px -12px rgb(var(--lumina-accent-rgb) / 0.4), 0 0 0 1px rgb(var(--lumina-accent-rgb) / 0.2); }
      @media (max-width: 768px) { :host { --lmgr-cols: 2; } }
      @media (max-width: 480px) { :host { --lmgr-cols: 1; } }
      @media (prefers-reduced-motion: reduce) { ::slotted(*) { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    this._columns = parseInt(this.getAttribute("columns") ?? "3", 10) || 3, this.style.setProperty("--lmgr-cols", String(this._columns)), this.applyStagger();
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "columns" && (this._columns = parseInt(i ?? "3", 10) || 3, this.style.setProperty("--lmgr-cols", String(this._columns)));
  }
  applyStagger() {
    this.querySelectorAll("*").forEach((t, e) => {
      t.style.animationDelay = `${e * 0.05}s`;
    });
  }
}
a(gt, "tagName", "lumina-grid");
customElements.get(gt.tagName) || customElements.define(gt.tagName, gt);
class vt extends l {
  constructor() {
    super(...arguments);
    a(this, "holo", null);
    a(this, "onMove", w((t) => {
      const e = this.getBoundingClientRect(), i = (t.clientX - e.left) / e.width - 0.5, r = (t.clientY - e.top) / e.height - 0.5, s = Math.atan2(r, i) * (180 / Math.PI) + 180;
      this.style.setProperty("--holo-angle", `${s}deg`);
      const n = this.$$(".lmho");
      n && (n.style.transform = `perspective(800px) rotateY(${i * 15}deg) rotateX(${-r * 15}deg)`), this.dispatchEvent(new CustomEvent("lumina-hover", { bubbles: !0, composed: !0, detail: { angle: s, x: i, y: r } }));
    }, 16));
    a(this, "onLeave", () => {
      const t = this.$$(".lmho");
      t && (t.style.transform = "");
    });
  }
  render() {
    return `
      <article class="lmho" part="card">
        <div class="lmho__holo" part="holo-layer" aria-hidden="true"></div>
        <div class="lmho__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); perspective: 800px; }
      .lmho { position: relative; display: block; border-radius: inherit; transform-style: preserve-3d; transition: transform var(--lumina-speed) var(--lumina-ease-spring); will-change: transform; }
      .lmho__holo { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 1; opacity: 0.6; background: linear-gradient(var(--holo-angle, 135deg), rgb(255 0 128 / 0.3) 0%, rgb(0 200 255 / 0.3) 25%, rgb(255 255 0 / 0.25) 50%, rgb(0 255 128 / 0.3) 75%, rgb(255 0 128 / 0.3) 100%); mix-blend-mode: overlay; transition: opacity var(--lumina-speed) var(--lumina-ease-out), background var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmho__holo { opacity: 1; }
      .lmho__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid rgb(255 255 255 / 0.2); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.15), var(--lumina-shadow); padding: 24px; overflow: hidden; }
      :host(:hover) .lmho__surface { border-color: rgb(255 255 255 / 0.4); }
      :host([variant="dimensional"]) .lmho__surface { box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.15), 0 calc(var(--lumina-depth) * 0.5) 0 calc(var(--lumina-depth) * -0.3) rgb(var(--lumina-accent-rgb) / 0.4), var(--lumina-shadow); }
      :host([variant="cosmic"]) .lmho__surface { background: linear-gradient(135deg, rgb(180 120 255 / 0.15), rgb(120 240 255 / 0.1), rgb(var(--lumina-surface) / var(--lumina-surface-alpha))); }
      :host([variant="cosmic"]) .lmho__holo { background: linear-gradient(var(--holo-angle, 135deg), rgb(180 120 255 / 0.4) 0%, rgb(120 240 255 / 0.4) 50%, rgb(255 0 200 / 0.3) 100%); }
      @media (prefers-reduced-motion: reduce) { .lmho, .lmho__holo { transition: none !important; } }
    `;
  }
  mounted() {
    this.holo = this.$$(".lmho__holo"), this.addEventListener("pointermove", this.onMove), this.addEventListener("pointerleave", this.onLeave);
  }
  unmounted() {
    this.removeEventListener("pointermove", this.onMove), this.removeEventListener("pointerleave", this.onLeave);
  }
  onConfigChange(t) {
  }
}
a(vt, "tagName", "lumina-holo-card");
customElements.get(vt.tagName) || customElements.define(vt.tagName, vt);
class ft extends l {
  constructor() {
    super(...arguments);
    a(this, "_expandOnHover", !0);
    a(this, "onEnter", () => {
      this.dispatchEvent(new CustomEvent("lumina-hover", { bubbles: !0, composed: !0, detail: { hovering: !0 } })), this._expandOnHover && this.dispatchEvent(new CustomEvent("lumina-expand", { bubbles: !0, composed: !0, detail: { expanded: !0 } }));
    });
    a(this, "onLeave", () => {
      this.dispatchEvent(new CustomEvent("lumina-hover", { bubbles: !0, composed: !0, detail: { hovering: !1 } }));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "expand-on-hover"];
  }
  get expandOnHover() {
    return this._expandOnHover;
  }
  set expandOnHover(t) {
    this._expandOnHover = t, t ? this.setAttribute("expand-on-hover", "") : this.removeAttribute("expand-on-hover");
  }
  render() {
    return `
      <article class="lmhc" part="card">
        <div class="lmhc__surface" part="surface">
          <div class="lmhc__preview" part="preview">
            <slot name="preview"></slot>
          </div>
          <div class="lmhc__expanded" part="expanded-content">
            <slot></slot>
          </div>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmhc { position: relative; display: block; border-radius: inherit; transition: transform var(--lumina-speed) var(--lumina-ease-spring), box-shadow var(--lumina-speed) var(--lumina-ease-out); will-change: transform; }
      :host(:hover) .lmhc { transform: translateY(-8px) scale(1.02); box-shadow: 0 24px 60px -20px rgb(var(--lumina-accent-rgb) / 0.4); }
      .lmhc__surface { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 20px; overflow: hidden; }
      .lmhc__preview { position: relative; z-index: 1; }
      .lmhc__expanded { position: relative; z-index: 1; max-height: 0; opacity: 0; overflow: hidden; transition: max-height calc(var(--lumina-speed) * 1.5) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out), margin var(--lumina-speed) var(--lumina-ease-spring); margin-top: 0; }
      :host(:hover) .lmhc__expanded, :host([expand-on-hover="false"]) .lmhc__expanded { max-height: 300px; opacity: 1; margin-top: 12px; }
      :host([expand-on-hover="false"]) .lmhc__expanded { transition: none; }
      :host([variant="morph"]) .lmhc { clip-path: polygon(0 8%, 8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%); }
      :host([variant="neural"]) .lmhc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmhc, .lmhc__expanded { transition: none !important; } }
    `;
  }
  mounted() {
    this._expandOnHover = this.getAttribute("expand-on-hover") !== "false", this.addEventListener("pointerenter", this.onEnter), this.addEventListener("pointerleave", this.onLeave);
  }
  unmounted() {
    this.removeEventListener("pointerenter", this.onEnter), this.removeEventListener("pointerleave", this.onLeave);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "expand-on-hover" && (this._expandOnHover = i !== "false");
  }
}
a(ft, "tagName", "lumina-hover-card");
customElements.get(ft.tagName) || customElements.define(ft.tagName, ft);
const He = ["sm", "md", "lg"], ui = { sm: 32, md: 40, lg: 52 }, Oe = ["circle", "square"];
class _t extends l {
  constructor() {
    super(...arguments);
    a(this, "_size", "md");
    a(this, "_shape", "circle");
    a(this, "_disabled", !1);
    a(this, "burstCanvas", null);
    a(this, "burstCtx", null);
    a(this, "burstParticles", []);
    a(this, "burstRaf", 0);
    a(this, "onClick", (t) => {
      if (this._disabled) {
        t.preventDefault(), t.stopPropagation();
        return;
      }
      const e = this.getBoundingClientRect(), i = t.offsetX >= 0 ? t.offsetX : e.width / 2, r = t.offsetY >= 0 ? t.offsetY : e.height / 2;
      this.spawnBurst(i, r), this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
    });
    a(this, "tickBurst", (t) => {
      if (this.burstCtx) {
        this.burstCtx.clearRect(0, 0, this.clientWidth, this.clientHeight), this.burstParticles = this.burstParticles.filter((e) => e.life < e.maxLife);
        for (const e of this.burstParticles) {
          e.x += e.vx, e.y += e.vy, e.vx *= 0.94, e.vy *= 0.94, e.life += 1;
          const i = 1 - e.life / e.maxLife;
          this.burstCtx.fillStyle = `rgba(${t} / ${i})`, this.burstCtx.beginPath(), this.burstCtx.arc(e.x, e.y, Math.max(0, e.size * i), 0, Math.PI * 2), this.burstCtx.fill();
        }
        this.burstParticles.length > 0 ? this.burstRaf = requestAnimationFrame(() => this.tickBurst(t)) : (this.burstRaf = 0, this.burstCtx.clearRect(0, 0, this.clientWidth, this.clientHeight));
      }
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "size", "shape", "disabled"];
  }
  get size() {
    return this._size;
  }
  set size(t) {
    this._size = t, this.setAttribute("size", t);
  }
  get shape() {
    return this._shape;
  }
  set shape(t) {
    this._shape = t, this.setAttribute("shape", t);
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(t) {
    this._disabled = t, t ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
  }
  render() {
    return `
      <button class="lmib" part="button" type="button">
        <span class="lmib__bg" aria-hidden="true"></span>
        <span class="lmib__ring" aria-hidden="true"></span>
        <span class="lmib__glow" part="glow" aria-hidden="true"></span>
        <canvas class="lmib__particles" part="particles" aria-hidden="true"></canvas>
        <span class="lmib__icon" part="icon"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host {
        display: inline-block;
        cursor: pointer;
        outline: none;
        --lmib-size: 40px;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        -webkit-tap-highlight-color: transparent;
      }
      :host([disabled]) { cursor: not-allowed; opacity: 0.4; }
      :host([disabled]) .lmib { pointer-events: none; }

      .lmib {
        position: relative;
        width: var(--lmib-size);
        height: var(--lmib-size);
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: visible;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
        will-change: transform;
        isolation: isolate;
      }
      :host([shape="square"]) .lmib { border-radius: var(--lumina-radius-md); }
      :host([shape="square"]) .lmib__bg { border-radius: var(--lumina-radius-md); }
      :host([shape="square"]) .lmib__ring { border-radius: var(--lumina-radius-md); }

      .lmib__bg {
        position: absolute; inset: 0;
        border-radius: 50%;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
        z-index: 0;
        transition: background var(--lumina-speed) var(--lumina-ease-out);
      }

      .lmib__ring {
        position: absolute; inset: -1px;
        border-radius: 50%;
        pointer-events: none; z-index: 1;
        opacity: 0;
        background: conic-gradient(from 0deg, transparent 0%, var(--lumina-accent) 25%, transparent 50%, var(--lumina-accent) 75%, transparent 100%);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        padding: 1px;
        animation: lmib-spin 6s linear infinite;
        animation-play-state: paused;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lmib__glow {
        position: absolute; inset: -30%;
        border-radius: 50%;
        pointer-events: none; z-index: 0;
        opacity: 0;
        background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / 0.45), transparent 65%);
        filter: blur(14px);
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lmib__particles {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        pointer-events: none; z-index: 3;
      }

      .lmib__icon {
        position: relative; z-index: 4;
        font-size: calc(var(--lmib-size) * 0.45);
        line-height: 1;
        display: inline-flex; align-items: center; justify-content: center;
      }

      :host(:hover) .lmib { transform: scale(1.1); }
      :host(:hover) .lmib__ring { animation-play-state: running; opacity: 0.7; }
      :host(:hover) .lmib__glow { opacity: calc(0.6 * var(--lumina-intensity)); }
      :host(:active) .lmib { transform: scale(0.92); }
      :host(:focus-visible) .lmib__ring { animation-play-state: running; opacity: 1; }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }

      /* Variant: minimal */
      :host([variant="minimal"]) .lmib__bg { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border-color: transparent; }
      :host([variant="minimal"]:hover) .lmib__bg { background: rgb(var(--lumina-accent-rgb) / 0.12); }

      /* Variant: aura — floating */
      :host([variant="aura"]) .lmib { animation: lmib-float 4s ease-in-out infinite; }
      :host([variant="aura"]) .lmib__glow { opacity: calc(0.3 * var(--lumina-intensity)); }
      @keyframes lmib-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }

      @keyframes lmib-spin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        .lmib, .lmib__ring, .lmib__glow { animation: none !important; transition: none !important; }
      }
    `;
  }
  mounted() {
    this._size = f(this.getAttribute("size"), He, "md"), this._shape = f(this.getAttribute("shape"), Oe, "circle"), this._disabled = this.hasAttribute("disabled"), this.applySize(), this.applyShape(), this.getAttribute("role") !== "button" && this.setAttribute("role", "button"), this.setAttribute("tabindex", this._disabled ? "-1" : "0"), this.burstCanvas = this.$$(".lmib__particles"), this.burstCtx = this.burstCanvas?.getContext("2d") ?? null, this.$$(".lmib")?.addEventListener("click", this.onClick), this.$$(".lmib")?.addEventListener("pointerenter", () => this.emitHover(!0)), this.$$(".lmib")?.addEventListener("pointerleave", () => this.emitHover(!1));
  }
  unmounted() {
    cancelAnimationFrame(this.burstRaf);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "size" ? (this._size = f(i, He, "md"), this.applySize()) : t === "shape" ? (this._shape = f(i, Oe, "circle"), this.applyShape()) : t === "disabled" && (this._disabled = i !== null, this.setAttribute("tabindex", this._disabled ? "-1" : "0"));
  }
  applySize() {
    this.style.setProperty("--lmib-size", `${ui[this._size]}px`);
  }
  applyShape() {
  }
  emitHover(t) {
    this.dispatchEvent(new CustomEvent("lumina-hover", { bubbles: !0, composed: !0, detail: { hovering: t } }));
  }
  spawnBurst(t, e) {
    if (p() || !this.burstCtx || !this.burstCanvas) return;
    const i = window.devicePixelRatio || 1, r = this.clientWidth, s = this.clientHeight;
    this.burstCanvas.width = r * i, this.burstCanvas.height = s * i, this.burstCanvas.style.width = `${r}px`, this.burstCanvas.style.height = `${s}px`, this.burstCtx.setTransform(i, 0, 0, i, 0, 0);
    const n = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", d = y(this.intensity), u = Math.round(12 * d);
    for (let m = 0; m < u; m++) {
      const b = m / u * Math.PI * 2 + Math.random() * 0.4, x = 1.5 + Math.random() * 3 * d;
      this.burstParticles.push({ x: t, y: e, vx: Math.cos(b) * x, vy: Math.sin(b) * x, life: 0, maxLife: 30 + Math.random() * 20, size: g(1, 2.5) });
    }
    this.burstRaf || this.tickBurst(n);
  }
}
a(_t, "tagName", "lumina-icon-button");
customElements.get(_t.tagName) || customElements.define(_t.tagName, _t);
class xt extends l {
  constructor() {
    super(...arguments);
    a(this, "_src", "");
    a(this, "_zoom", 1);
    a(this, "_maxZoom", 5);
    a(this, "img", null);
    a(this, "panX", 0);
    a(this, "panY", 0);
    a(this, "dragging", !1);
    a(this, "dragStartX", 0);
    a(this, "dragStartY", 0);
    a(this, "onWheel", (t) => {
      t.preventDefault(), this.zoom = this._zoom + (t.deltaY > 0 ? -0.2 : 0.2);
    });
    a(this, "onPointerDown", (t) => {
      this._zoom <= 1 || (this.dragging = !0, this.dragStartX = t.clientX - this.panX, this.dragStartY = t.clientY - this.panY, this.$$(".lmiz")?.setAttribute("data-dragging", ""), this.img?.setAttribute("data-dragging", ""));
    });
    a(this, "onPointerMove", (t) => {
      this.dragging && (this.panX = t.clientX - this.dragStartX, this.panY = t.clientY - this.dragStartY, this.updateTransform());
    });
    a(this, "onPointerUp", () => {
      this.dragging && (this.dragging = !1, this.$$(".lmiz")?.removeAttribute("data-dragging"), this.img?.removeAttribute("data-dragging"));
    });
    a(this, "onDblClick", () => {
      this._zoom > 1 ? (this.zoom = 1, this.panX = 0, this.panY = 0) : this.zoom = this._maxZoom;
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "src", "zoom", "max-zoom"];
  }
  get zoom() {
    return this._zoom;
  }
  set zoom(t) {
    this._zoom = v(t, 1, this._maxZoom), this.updateTransform(), this.dispatchEvent(new CustomEvent("lumina-zoom-change", { bubbles: !0, composed: !0, detail: { zoom: this._zoom } }));
  }
  render() {
    return `
      <div class="lmiz" part="container">
        <img class="lmiz__img" part="image" />
        <div class="lmiz__controls" part="controls">
          <button class="lmiz__btn" data-action="out" aria-label="Zoom out">−</button>
          <span class="lmiz__level">100%</span>
          <button class="lmiz__btn" data-action="in" aria-label="Zoom in">+</button>
          <button class="lmiz__btn" data-action="reset" aria-label="Reset">⟲</button>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmiz { position: relative; overflow: hidden; border-radius: var(--lumina-radius-md); background: rgb(0 0 0 / 0.3); border: 1px solid var(--lumina-border); cursor: grab; touch-action: none; }
      .lmiz__img { display: block; width: 100%; height: 100%; object-fit: cover; transform-origin: center center; transition: transform 0.15s var(--lumina-ease-out); will-change: transform; user-select: none; -webkit-user-drag: none; pointer-events: none; }
      .lmiz__img[data-dragging] { transition: none; }
      .lmiz[data-zoomed] { cursor: grab; }
      .lmiz[data-dragging] { cursor: grabbing; }
      .lmiz__controls { position: absolute; bottom: 12px; right: 12px; display: flex; align-items: center; gap: 4px; padding: 4px; border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-surface) / 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); z-index: 2; }
      .lmiz__btn { appearance: none; border: 0; background: transparent; color: var(--lumina-text); width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 16px; display: inline-flex; align-items: center; justify-content: center; transition: background 0.2s; }
      .lmiz__btn:hover { background: rgb(var(--lumina-accent-rgb) / 0.2); }
      .lmiz__level { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--lumina-text-muted); min-width: 36px; text-align: center; }
      @media (prefers-reduced-motion: reduce) { .lmiz__img { transition: none !important; } }
    `;
  }
  mounted() {
    this._src = this.getAttribute("src") ?? "", this._zoom = parseFloat(this.getAttribute("zoom") ?? "1") || 1, this._maxZoom = parseFloat(this.getAttribute("max-zoom") ?? "5") || 5, this.img = this.$$(".lmiz__img"), this.img && this._src && (this.img.src = this._src);
    const t = this.$$(".lmiz");
    t?.addEventListener("wheel", this.onWheel), t?.addEventListener("pointerdown", this.onPointerDown), document.addEventListener("pointermove", this.onPointerMove), document.addEventListener("pointerup", this.onPointerUp), t?.addEventListener("dblclick", this.onDblClick), this.$$('.lmiz__btn[data-action="in"]')?.addEventListener("click", () => {
      this.zoom = this._zoom + 0.5;
    }), this.$$('.lmiz__btn[data-action="out"]')?.addEventListener("click", () => {
      this.zoom = this._zoom - 0.5;
    }), this.$$('.lmiz__btn[data-action="reset"]')?.addEventListener("click", () => {
      this.zoom = 1, this.panX = 0, this.panY = 0, this.updateTransform();
    }), this.updateTransform();
  }
  unmounted() {
    document.removeEventListener("pointermove", this.onPointerMove), document.removeEventListener("pointerup", this.onPointerUp);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "src" && i && this.img ? this.img.src = i : t === "zoom" && (this._zoom = v(parseFloat(i ?? "1") || 1, 1, this._maxZoom), this.updateTransform());
  }
  updateTransform() {
    if (!this.img) return;
    this.img.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this._zoom})`;
    const t = this.$$(".lmiz__level");
    t && (t.textContent = `${Math.round(this._zoom * 100)}%`);
    const e = this.$$(".lmiz");
    e && (this._zoom > 1 ? e.setAttribute("data-zoomed", "") : e.removeAttribute("data-zoomed"));
  }
}
a(xt, "tagName", "lumina-image-zoom");
customElements.get(xt.tagName) || customElements.define(xt.tagName, xt);
class yt extends l {
  constructor() {
    super(...arguments);
    a(this, "field", null);
    a(this, "input", null);
    a(this, "echo", null);
    a(this, "echoCtx", null);
    a(this, "echoRipples", []);
    a(this, "echoRaf", 0);
    a(this, "onInput", (t) => {
      const e = t.target;
      this.spawnEcho(), this.dispatchEvent(
        new CustomEvent("lumina-change", {
          detail: { value: e.value },
          bubbles: !0,
          composed: !0
        })
      );
    });
    a(this, "onFocus", () => {
      (this.variant === "neural" || this.variant === "aura") && this.spawnField();
    });
    a(this, "onBlur", () => {
      this.field?.destroy(), this.field = null;
    });
    a(this, "onKeyDown", (t) => {
      t.key === "Enter" && this.dispatchEvent(
        new CustomEvent("lumina-submit", {
          detail: { value: this.input?.value ?? "" },
          bubbles: !0,
          composed: !0
        })
      );
    });
    a(this, "tickEcho", () => {
      if (!this.echoCtx) return;
      const t = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", e = this.clientWidth, i = this.clientHeight;
      this.echoCtx.clearRect(0, 0, e, i), this.echoRipples = this.echoRipples.filter((r) => r.life < r.maxLife);
      for (const r of this.echoRipples) {
        r.life += 1;
        const s = r.life / r.maxLife, n = 4 + s * 30, d = (1 - s) * 0.6;
        this.echoCtx.strokeStyle = `rgba(${t} / ${d})`, this.echoCtx.lineWidth = 1.5, this.echoCtx.beginPath(), this.echoCtx.arc(r.x, r.y, n, 0, Math.PI * 2), this.echoCtx.stroke();
      }
      this.echoRipples.length > 0 ? this.echoRaf = requestAnimationFrame(this.tickEcho) : this.echoRaf = 0;
    });
  }
  static get observedAttributes() {
    return [
      ...l.observedAttributes,
      "type",
      "placeholder",
      "value",
      "label",
      "disabled",
      "required",
      "invalid",
      "name"
    ];
  }
  /* Typed accessors for input-specific properties */
  get value() {
    return this.input?.value ?? "";
  }
  set value(t) {
    this.input && (this.input.value = t), this.setAttribute("value", t);
  }
  render() {
    return `
      <label class="lumina-input" part="root">
        <span class="lumina-input__label" part="label">
          <slot name="label"></slot>
        </span>
        <span class="lumina-input__shell" part="shell">
          <span class="lumina-input__field" part="field" aria-hidden="true"></span>
          <span class="lumina-input__bg" part="bg"></span>
          <span class="lumina-input__ring" part="ring" aria-hidden="true"></span>
          <span class="lumina-input__bar" part="bar" aria-hidden="true"></span>
          <canvas class="lumina-input__echo" part="echo" aria-hidden="true"></canvas>
          <input
            class="lumina-input__el"
            part="input"
            type="${this.getAttribute("type") ?? "text"}"
            placeholder="${this.getAttribute("placeholder") ?? ""}"
            name="${this.getAttribute("name") ?? ""}"
            ${this.hasAttribute("disabled") ? "disabled" : ""}
            ${this.hasAttribute("required") ? "required" : ""}
            aria-invalid="${this.hasAttribute("invalid")}"
          />
        </span>
      </label>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        --lumina-input-h: 52px;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-input {
        display: flex;
        flex-direction: column;
        gap: 8px;
        cursor: text;
      }

      .lumina-input__label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--lumina-text-muted);
      }
      .lumina-input__label:empty { display: none; }

      .lumina-input__shell {
        position: relative;
        display: flex;
        align-items: center;
        height: var(--lumina-input-h);
        border-radius: var(--lumina-radius-md);
        overflow: hidden;
        cursor: text;
      }

      .lumina-input__field {
        position: absolute;
        inset: -4px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-input__bg {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(12px) saturate(1.3);
        -webkit-backdrop-filter: blur(12px) saturate(1.3);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 0 0 rgb(255 255 255 / 0.10),
          var(--lumina-shadow);
        transition: border-color var(--lumina-speed) var(--lumina-ease-out),
                    box-shadow var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-input__ring {
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        background: conic-gradient(
          from 0deg,
          transparent 0%,
          var(--lumina-accent) 25%,
          transparent 50%,
          var(--lumina-accent) 75%,
          transparent 100%
        );
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude;
        padding: 2px;
        animation: lumina-input-spin 4s linear infinite;
        animation-play-state: paused;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-input__bar {
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 0;
        height: 2px;
        background: var(--lumina-accent);
        box-shadow: 0 0 8px var(--lumina-accent);
        transform: translateX(-50%);
        transition: width var(--lumina-speed) var(--lumina-ease-spring);
        z-index: 4;
      }

      .lumina-input__echo {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        mix-blend-mode: screen;
      }

      .lumina-input__el {
        position: relative;
        z-index: 3;
        width: 100%;
        height: 100%;
        padding: 0 16px;
        border: 0;
        background: transparent;
        color: var(--lumina-text);
        font-family: inherit;
        font-size: 15px;
        outline: none;
        caret-color: var(--lumina-accent);
      }
      .lumina-input__el::placeholder { color: var(--lumina-text-muted); }

      /* ----- Focus state ----- */
      :host(:focus-within) .lumina-input__field { opacity: 1; }
      :host(:focus-within) .lumina-input__ring { opacity: 0.7; animation-play-state: running; }
      :host(:focus-within) .lumina-input__bar { width: 70%; }
      :host(:focus-within) .lumina-input__bg {
        border-color: rgb(var(--lumina-accent-rgb) / 0.5);
        box-shadow:
          0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.12),
          var(--lumina-shadow);
      }

      /* ----- Invalid state ----- */
      :host([invalid]) .lumina-input__bg { border-color: rgb(255 70 90 / 0.6); }
      :host([invalid]) .lumina-input__bar { background: rgb(255 70 90); width: 100%; }
      :host([invalid]) .lumina-input__shell { animation: lumina-input-shake 0.4s; }

      /* ----- Disabled ----- */
      :host([disabled]) { opacity: 0.5; cursor: not-allowed; }
      :host([disabled]) .lumina-input__el { cursor: not-allowed; }

      /* ----- Variant-specific ----- */
      :host([variant="morph"]) .lumina-input__shell {
        border-radius: var(--lumina-radius-pill);
      }
      :host([variant="morph"]) .lumina-input__el { padding: 0 22px; }

      :host([variant="void"]) .lumina-input__bg {
        background: rgb(0 0 0 / 0.55);
        backdrop-filter: blur(6px);
      }
      :host([variant="void"]) .lumina-input__el { color: var(--lumina-accent); }

      :host([variant="aura"]:focus-within) .lumina-input__field { opacity: 1; }
      :host([variant="aura"]) .lumina-input__bg {
        background:
          radial-gradient(120% 100% at 50% 0%,
            rgb(var(--lumina-accent-rgb) / 0.18),
            rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%
          );
      }

      @keyframes lumina-input-spin { to { transform: rotate(360deg); } }
      @keyframes lumina-input-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-input__ring,
        .lumina-input__bar,
        .lumina-input__bg { animation: none !important; transition: none !important; }
      }
    `;
  }
  mounted() {
    if (this.input = this.$$(".lumina-input__el"), this.echo = this.$$(".lumina-input__echo"), this.echoCtx = this.echo?.getContext("2d") ?? null, this.input) {
      this.input.addEventListener("input", this.onInput), this.input.addEventListener("focus", this.onFocus), this.input.addEventListener("blur", this.onBlur), this.input.addEventListener("keydown", this.onKeyDown);
      const t = this.getAttribute("value");
      t !== null && (this.input.value = t);
    }
  }
  unmounted() {
    this.input?.removeEventListener("input", this.onInput), this.input?.removeEventListener("focus", this.onFocus), this.input?.removeEventListener("blur", this.onBlur), this.input?.removeEventListener("keydown", this.onKeyDown), this.field?.destroy(), this.field = null, cancelAnimationFrame(this.echoRaf);
  }
  onConfigChange(t) {
    (t.variant || t.intensity) && (this.field?.destroy(), this.field = null);
  }
  spawnField() {
    if (this.field) return;
    const t = this.$$(".lumina-input__field");
    if (!t) return;
    const e = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", i = y(this.intensity);
    this.field = new k(this.shadow.host, {
      count: Math.round(18 * i),
      rgb: e,
      sizeRange: [0.6, 1.8],
      speedRange: [0.2, 0.5],
      lifeRange: [80, 140],
      connect: this.variant === "neural"
    }), this.field.mount(t);
  }
  spawnEcho() {
    if (p() || !this.echoCtx || !this.echo || !this.input) return;
    const t = window.devicePixelRatio || 1, e = this.clientWidth, i = this.clientHeight;
    this.echo.width = e * t, this.echo.height = i * t, this.echo.style.width = `${e}px`, this.echo.style.height = `${i}px`, this.echoCtx.setTransform(t, 0, 0, t, 0, 0);
    const r = window.getComputedStyle(this.input), s = parseFloat(r.fontSize), n = parseFloat(r.paddingLeft), d = this.input.value.length * s * 0.55, u = Math.min(n + d + 2, e - 8), m = i / 2;
    this.echoRipples.push({ x: u, y: m, life: 0, maxLife: 30 }), this.echoRaf || this.tickEcho();
  }
}
a(yt, "tagName", "lumina-input");
customElements.get(yt.tagName) || customElements.define(yt.tagName, yt);
class wt extends l {
  constructor() {
    super(...arguments);
    a(this, "_images", []);
    a(this, "_currentIdx", 0);
    a(this, "_open", !1);
    a(this, "zoom", 1);
    a(this, "img", null);
    a(this, "onWheel", (t) => {
      t.preventDefault(), this.zoom = Math.max(1, Math.min(5, this.zoom + (t.deltaY > 0 ? -0.2 : 0.2))), this.img && (this.img.style.transform = `scale(${this.zoom})`, this.zoom > 1 ? this.img.setAttribute("data-zoom", "") : this.img.removeAttribute("data-zoom"));
    });
    a(this, "onKeydown", (t) => {
      this._open && (t.key === "Escape" ? this.hide() : t.key === "ArrowLeft" ? this.navigate(-1) : t.key === "ArrowRight" && this.navigate(1));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "src", "images"];
  }
  render() {
    return `
      <div class="lmlb" part="backdrop" aria-hidden="true">
        <div class="lmlb__close" aria-label="Fechar">×</div>
        <button class="lmlb__nav lmlb__prev" aria-label="Anterior">‹</button>
        <div class="lmlb__img-wrap" part="image"><img class="lmlb__img" /></div>
        <button class="lmlb__nav lmlb__next" aria-label="Próxima">›</button>
        <div class="lmlb__caption" part="caption"><slot name="caption"></slot></div>
        <div class="lmlb__thumbs" aria-hidden="true"></div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: contents; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmlb { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; gap: 16px; background: rgb(0 0 0 / 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); opacity: 0; pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmlb { opacity: 1; pointer-events: auto; }
      .lmlb__close { position: absolute; top: 20px; right: 20px; color: #fff; font-size: 32px; cursor: pointer; z-index: 2; opacity: 0.7; transition: opacity 0.2s; }
      .lmlb__close:hover { opacity: 1; }
      .lmlb__nav { position: absolute; top: 50%; transform: translateY(-50%); appearance: none; border: 0; background: rgb(255 255 255 / 0.1); color: #fff; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; font-size: 28px; z-index: 2; transition: background 0.2s, transform 0.2s; }
      .lmlb__nav:hover { background: rgb(255 255 255 / 0.2); transform: translateY(-50%) scale(1.1); }
      .lmlb__prev { left: 20px; }
      .lmlb__next { right: 20px; }
      .lmlb__img-wrap { position: relative; z-index: 1; max-width: 80vw; max-height: 75vh; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: var(--lumina-radius-lg); }
      .lmlb__img { max-width: 100%; max-height: 75vh; object-fit: contain; border-radius: inherit; transform: scale(1); transition: transform 0.2s var(--lumina-ease-out); will-change: transform; cursor: grab; }
      .lmlb__img[data-zoom] { cursor: grab; }
      .lmlb__caption { position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); color: rgba(255 255 255 / 0.8); font-size: 14px; max-width: 80vw; text-align: center; z-index: 2; }
      .lmlb__thumbs { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 2; }
      .lmlb__thumb { width: 48px; height: 48px; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s, transform 0.2s; }
      .lmlb__thumb img { width: 100%; height: 100%; object-fit: cover; }
      .lmlb__thumb[data-active] { border-color: var(--lumina-accent); }
      .lmlb__thumb:hover { transform: scale(1.1); }
      @media (prefers-reduced-motion: reduce) { .lmlb, .lmlb__img { transition: none !important; } }
    `;
  }
  mounted() {
    this.img = this.$$(".lmlb__img");
    const t = this.getAttribute("src"), e = this.getAttribute("images");
    if (e)
      try {
        this._images = JSON.parse(e);
      } catch {
        this._images = t ? [{ src: t }] : [];
      }
    else t && (this._images = [{ src: t }]);
    this.renderThumbs(), this.$$(".lmlb__close").addEventListener("click", () => this.hide()), this.$$(".lmlb__prev").addEventListener("click", () => this.navigate(-1)), this.$$(".lmlb__next").addEventListener("click", () => this.navigate(1)), this.img?.addEventListener("wheel", this.onWheel), document.addEventListener("keydown", this.onKeydown), this.addEventListener("click", (i) => {
      i.target === this.$$(".lmlb") && this.hide();
    });
  }
  unmounted() {
    document.removeEventListener("keydown", this.onKeydown);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    if (super.attributeChangedCallback(t, e, i), t === "src" && i)
      this._images = [{ src: i }], this.renderThumbs(), this.showImage(0);
    else if (t === "images" && i)
      try {
        this._images = JSON.parse(i), this.renderThumbs();
      } catch {
      }
  }
  renderThumbs() {
    const t = this.$$(".lmlb__thumbs");
    !t || this._images.length <= 1 || (t.innerHTML = "", this._images.forEach((e, i) => {
      const r = document.createElement("div");
      r.className = "lmlb__thumb", i === this._currentIdx && r.setAttribute("data-active", ""), r.innerHTML = `<img src="${e.src}" alt="" />`, r.addEventListener("click", () => this.showImage(i)), t.appendChild(r);
    }));
  }
  show(t = 0) {
    this._open = !0, this.setAttribute("data-open", ""), this.showImage(t), document.body.style.overflow = "hidden", this.dispatchEvent(new CustomEvent("lumina-open", { bubbles: !0, composed: !0 }));
  }
  hide() {
    this._open = !1, this.removeAttribute("data-open"), document.body.style.overflow = "", this.dispatchEvent(new CustomEvent("lumina-close", { bubbles: !0, composed: !0 }));
  }
  showImage(t) {
    this._currentIdx = t, this.img && this._images[t] && (this.img.src = this._images[t].src, this.zoom = 1, this.img.style.transform = "scale(1)");
    const e = this.$$(".lmlb__caption");
    e && (e.textContent = this._images[t]?.caption ?? ""), this.renderThumbs();
  }
  navigate(t) {
    this._images.length <= 1 || (this._currentIdx = (this._currentIdx + t + this._images.length) % this._images.length, this.showImage(this._currentIdx), this.dispatchEvent(new CustomEvent("lumina-navigate", { bubbles: !0, composed: !0, detail: { index: this._currentIdx } })));
  }
}
a(wt, "tagName", "lumina-lightbox");
customElements.get(wt.tagName) || customElements.define(wt.tagName, wt);
class kt extends l {
  constructor() {
    super(...arguments);
    a(this, "surface", null);
    a(this, "raf", 0);
    a(this, "targetX", 0);
    a(this, "targetY", 0);
    a(this, "currentX", 0);
    a(this, "currentY", 0);
    a(this, "onMove", w((t) => {
      const e = this.getBoundingClientRect(), i = (t.clientX - e.left) / e.width * 100, r = (t.clientY - e.top) / e.height * 100;
      this.style.setProperty("--lx", `${i}%`), this.style.setProperty("--ly", `${r}%`);
      const s = (t.clientX - e.left) / e.width - 0.5, n = (t.clientY - e.top) / e.height - 0.5;
      this.targetX = s, this.targetY = n, this.raf || this.tick(), this.dispatchEvent(new CustomEvent("lumina-interact", { bubbles: !0, composed: !0, detail: { x: s, y: n, type: "move" } }));
    }, 16));
    a(this, "onLeave", () => {
      this.targetX = 0, this.targetY = 0, this.raf || this.tick();
    });
    a(this, "tick", () => {
      if (this.currentX += (this.targetX - this.currentX) * 0.15, this.currentY += (this.targetY - this.currentY) * 0.15, this.surface) {
        const t = 40 + this.currentX * 30, e = 40 - this.currentX * 30, i = 40 + this.currentY * 30, r = 40 - this.currentY * 30;
        this.surface.style.borderRadius = `${t}% ${e}% ${i}% ${r}% / ${r}% ${i}% ${e}% ${t}%`;
      }
      Math.abs(this.targetX - this.currentX) > 0.01 || Math.abs(this.targetY - this.currentY) > 0.01 ? this.raf = requestAnimationFrame(this.tick) : (this.raf = 0, this.surface && (this.surface.style.borderRadius = "inherit"));
    });
    a(this, "onClick", (t) => {
      const e = this.getBoundingClientRect(), i = t.clientX - e.left, r = t.clientY - e.top, s = document.createElement("span");
      s.className = "lmlc__wave", s.style.left = `${i}px`, s.style.top = `${r}px`, s.style.width = "30px", s.style.height = "30px", this.surface?.appendChild(s), setTimeout(() => s.remove(), 800), this.dispatchEvent(new CustomEvent("lumina-interact", { bubbles: !0, composed: !0, detail: { x: i, y: r, type: "click" } }));
    });
  }
  render() {
    return `
      <article class="lmlc" part="card">
        <div class="lmlc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmlc { position: relative; display: block; border-radius: inherit; }
      .lmlc__surface { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; overflow: hidden; transition: border-radius 0.2s var(--lumina-ease-out); will-change: border-radius, transform; }
      .lmlc__surface::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(200px circle at var(--lx, 50%) var(--ly, 50%), rgb(var(--lumina-accent-rgb) / 0.15), transparent 60%); pointer-events: none; opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmlc__surface::before { opacity: 1; }
      .lmlc__wave { position: absolute; border-radius: 50%; pointer-events: none; border: 2px solid rgb(var(--lumina-accent-rgb) / 0.5); transform: translate(-50%, -50%) scale(0); animation: lmlc-wave 0.8s var(--lumina-ease-out) forwards; }
      @keyframes lmlc-wave { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; } 100% { transform: translate(-50%, -50%) scale(8); opacity: 0; } }
      :host([variant="glass"]) .lmlc__surface { background: linear-gradient(135deg, rgb(255 255 255 / 0.1), rgb(var(--lumina-surface) / var(--lumina-surface-alpha))); }
      :host([variant="neural"]) .lmlc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmlc__surface { transition: none !important; } .lmlc__wave { animation: none !important; } }
    `;
  }
  mounted() {
    this.surface = this.$$(".lmlc__surface"), this.addEventListener("pointermove", this.onMove), this.addEventListener("pointerleave", this.onLeave), this.addEventListener("click", this.onClick);
  }
  unmounted() {
    cancelAnimationFrame(this.raf), this.removeEventListener("pointermove", this.onMove), this.removeEventListener("pointerleave", this.onLeave), this.removeEventListener("click", this.onClick);
  }
  onConfigChange(t) {
  }
}
a(kt, "tagName", "lumina-liquid-card");
customElements.get(kt.tagName) || customElements.define(kt.tagName, kt);
class Ct extends l {
  constructor() {
    super(...arguments);
    a(this, "draggedIdx", -1);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "sortable"];
  }
  render() {
    return '<ul class="lmls" part="list"><slot></slot></ul>';
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmls { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; position: relative; }
      ::slotted(li), ::slotted([data-list-item]) { position: relative; padding: 12px 16px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid var(--lumina-border); cursor: pointer; transition: all var(--lumina-speed) var(--lumina-ease-out); animation: lmls-enter 0.4s var(--lumina-ease-spring) backwards; }
      @keyframes lmls-enter { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      ::slotted(li:hover), ::slotted([data-list-item]:hover) { background: rgb(var(--lumina-accent-rgb) / 0.1); border-color: rgb(var(--lumina-accent-rgb) / 0.3); transform: translateX(4px); box-shadow: -2px 0 0 var(--lumina-accent); }
      ::slotted(li[data-dragging]), ::slotted([data-list-item][data-dragging]) { opacity: 0.4; }
      ::slotted(li[data-drag-over]), ::slotted([data-list-item][data-drag-over]) { border-color: var(--lumina-accent); box-shadow: 0 0 0 2px rgb(var(--lumina-accent-rgb) / 0.3); }
      :host([variant="neural"]) .lmls { gap: 6px; }
      :host([variant="neural"]) ::slotted(li), :host([variant="neural"]) ::slotted([data-list-item]) { border-color: rgb(var(--lumina-accent-rgb) / 0.15); }
      :host([variant="minimal"]) ::slotted(li), :host([variant="minimal"]) ::slotted([data-list-item]) { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border: 0; border-bottom: 1px solid var(--lumina-border); border-radius: 0; }
      @media (prefers-reduced-motion: reduce) { ::slotted(li), ::slotted([data-list-item]) { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    this.applyStagger(), this.hasAttribute("sortable") && this.setupDragDrop();
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  applyStagger() {
    this.querySelectorAll("li, [data-list-item]").forEach((e, i) => {
      e.style.animationDelay = `${i * 0.06}s`;
    });
  }
  setupDragDrop() {
    const t = this.querySelectorAll("li, [data-list-item]");
    t.forEach((e, i) => {
      e.setAttribute("draggable", "true"), e.addEventListener("dragstart", () => {
        this.draggedIdx = i, e.setAttribute("data-dragging", "");
      }), e.addEventListener("dragend", () => {
        e.removeAttribute("data-dragging"), t.forEach((r) => r.removeAttribute("data-drag-over"));
      }), e.addEventListener("dragover", (r) => {
        r.preventDefault(), i !== this.draggedIdx && e.setAttribute("data-drag-over", "");
      }), e.addEventListener("dragleave", () => e.removeAttribute("data-drag-over")), e.addEventListener("drop", (r) => {
        if (r.preventDefault(), e.removeAttribute("data-drag-over"), this.draggedIdx >= 0 && this.draggedIdx !== i) {
          const s = e.parentElement;
          if (!s) return;
          const d = Array.from(s.children)[this.draggedIdx];
          i < this.draggedIdx ? s.insertBefore(d, e) : s.insertBefore(d, e.nextSibling), this.applyStagger(), this.dispatchEvent(new CustomEvent("lumina-reorder", { bubbles: !0, composed: !0, detail: { from: this.draggedIdx, to: i } }));
        }
        this.draggedIdx = -1;
      });
    });
  }
}
a(Ct, "tagName", "lumina-list");
customElements.get(Ct.tagName) || customElements.define(Ct.tagName, Ct);
class Et extends l {
  constructor() {
    super(...arguments);
    a(this, "_size", 64);
    a(this, "_overlay", !1);
    a(this, "_text", "");
    a(this, "field", null);
    a(this, "fieldHost", null);
  }
  static get observedAttributes() {
    return [
      ...l.observedAttributes,
      "size",
      "overlay",
      "text"
    ];
  }
  get size() {
    return this._size;
  }
  set size(t) {
    this._size = t, this.setAttribute("size", String(t)), this.applySize();
  }
  get overlay() {
    return this._overlay;
  }
  set overlay(t) {
    this._overlay = t, t ? this.setAttribute("overlay", "") : this.removeAttribute("overlay");
  }
  get text() {
    return this._text;
  }
  set text(t) {
    this._text = t, this.setAttribute("text", t), this.applyText();
  }
  render() {
    return `
      <div class="lml" part="container">
        <div class="lml__backdrop" aria-hidden="true"></div>
        <div class="lml__spinner" part="spinner">
          <span class="lml__ring lml__ring--1" aria-hidden="true"></span>
          <span class="lml__ring lml__ring--2" aria-hidden="true"></span>
          <span class="lml__ring lml__ring--3" aria-hidden="true"></span>
          <span class="lml__core" aria-hidden="true"></span>
          <div class="lml__particles" part="particles" aria-hidden="true"></div>
        </div>
        <div class="lml__text" part="text"></div>
      </div>
    `;
  }
  styles() {
    return `
      :host {
        display: inline-flex;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        --lml-size: 64px;
      }

      .lml {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
      }

      .lml__backdrop {
        display: none;
      }
      :host([overlay]) {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      :host([overlay]) .lml__backdrop {
        display: block;
        position: absolute;
        inset: 0;
        background: rgb(var(--lumina-surface) / 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      :host([overlay]) .lml {
        position: relative;
        z-index: 1;
        padding: 32px 48px;
        border-radius: var(--lumina-radius-lg);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
        box-shadow: 0 24px 60px -20px rgb(0 0 0 / 0.5);
      }

      .lml__spinner {
        position: relative;
        width: var(--lml-size);
        height: var(--lml-size);
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .lml__ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 2px solid transparent;
        border-top-color: var(--lumina-accent);
        animation: lml-spin 1.4s linear infinite;
      }
      .lml__ring--2 {
        inset: 12%;
        border-top-color: rgb(var(--lumina-accent-rgb) / 0.6);
        animation-duration: 1.8s;
        animation-direction: reverse;
      }
      .lml__ring--3 {
        inset: 24%;
        border-top-color: rgb(var(--lumina-accent-rgb) / 0.3);
        animation-duration: 2.2s;
      }

      .lml__core {
        width: 20%;
        height: 20%;
        border-radius: 50%;
        background: var(--lumina-accent);
        box-shadow:
          0 0 16px var(--lumina-accent),
          0 0 32px rgb(var(--lumina-accent-rgb) / 0.6);
        animation: lml-pulse 1.2s ease-in-out infinite;
      }
      @keyframes lml-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%      { transform: scale(1.4); opacity: 0.7; }
      }
      @keyframes lml-spin {
        to { transform: rotate(360deg); }
      }

      .lml__particles {
        position: absolute;
        inset: -20%;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lml__text {
        font-size: 13px;
        font-weight: 600;
        color: var(--lumina-text-muted);
        letter-spacing: 0.04em;
        text-align: center;
        display: none;
      }
      .lml__text:not(:empty) { display: block; }

      /* ----- Variant: spinner (clean, default-ish) ----- */
      :host([variant="spinner"]) .lml__ring--2,
      :host([variant="spinner"]) .lml__ring--3 { display: none; }
      :host([variant="spinner"]) .lml__core { display: none; }

      /* ----- Variant: neural — show particles ----- */
      :host([variant="neural"]) .lml__particles { opacity: 1; }
      :host([variant="neural"]) .lml__ring {
        border-top-color: transparent;
        border-color: rgb(var(--lumina-accent-rgb) / 0.2);
        border-top-color: var(--lumina-accent);
      }

      /* ----- Variant: aura — soft glow + slow rings ----- */
      :host([variant="aura"]) .lml__ring {
        border-color: rgb(var(--lumina-accent-rgb) / 0.15);
        border-top-color: rgb(var(--lumina-accent-rgb) / 0.9);
        animation-duration: 3s;
        box-shadow: 0 0 16px rgb(var(--lumina-accent-rgb) / 0.4);
      }
      :host([variant="aura"]) .lml__ring--2 {
        animation-duration: 4s;
        animation-direction: normal;
      }
      :host([variant="aura"]) .lml__ring--3 { display: none; }
      :host([variant="aura"]) .lml__core {
        animation: lml-aura-breathe 2s ease-in-out infinite;
      }
      @keyframes lml-aura-breathe {
        0%, 100% { transform: scale(1); box-shadow: 0 0 16px var(--lumina-accent); }
        50%      { transform: scale(1.6); box-shadow: 0 0 32px var(--lumina-accent), 0 0 64px rgb(var(--lumina-accent-rgb) / 0.5); }
      }

      /* ----- Variant: void — pure black with cyan starfield ----- */
      :host([variant="void"]) .lml__particles { opacity: 1; }
      :host([variant="void"]) .lml__ring {
        border-top-color: transparent;
        border-color: rgb(120 240 255 / 0.15);
        border-top-color: #78f0ff;
        box-shadow: 0 0 8px rgb(120 240 255 / 0.4);
      }
      :host([variant="void"]) .lml__core {
        background: #78f0ff;
        box-shadow:
          0 0 16px #78f0ff,
          -2px 0 4px rgb(255 0 80 / 0.6),
          2px 0 4px rgb(0 200 255 / 0.6);
      }

      /* ----- Variant: dimensional — 3D cube-ish rings ----- */
      :host([variant="dimensional"]) .lml__spinner {
        perspective: 400px;
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"]) .lml__ring {
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"]) .lml__ring--1 {
        animation: lml-dim-x 2s linear infinite;
        border-top-color: transparent;
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }
      :host([variant="dimensional"]) .lml__ring--2 {
        animation: lml-dim-y 2.4s linear infinite;
        inset: 8%;
      }
      :host([variant="dimensional"]) .lml__ring--3 {
        animation: lml-dim-z 2.8s linear infinite;
        inset: 16%;
      }
      @keyframes lml-dim-x {
        from { transform: rotateX(0deg) rotateY(0deg); }
        to   { transform: rotateX(360deg) rotateY(0deg); }
      }
      @keyframes lml-dim-y {
        from { transform: rotateX(0deg) rotateY(0deg); }
        to   { transform: rotateX(0deg) rotateY(360deg); }
      }
      @keyframes lml-dim-z {
        from { transform: rotateZ(0deg); }
        to   { transform: rotateZ(360deg); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lml__ring, .lml__core, .lml__particles {
          animation: none !important;
        }
      }
    `;
  }
  mounted() {
    this.fieldHost = this.$$(".lml__particles"), this._size = parseFloat(this.getAttribute("size") ?? "64") || 64, this._overlay = this.hasAttribute("overlay"), this._text = this.getAttribute("text") ?? "", this.applySize(), this.applyText(), p() || this.maybeInitField();
  }
  unmounted() {
    this.field?.destroy(), this.field = null;
  }
  onConfigChange(t) {
    t.variant && (this.field?.destroy(), this.field = null, this.maybeInitField());
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "size" ? (this._size = parseFloat(i ?? "64") || 64, this.applySize()) : t === "overlay" ? this._overlay = i !== null : t === "text" && (this._text = i ?? "", this.applyText());
  }
  applySize() {
    this.style.setProperty("--lml-size", `${this._size}px`);
  }
  applyText() {
    const t = this.$$(".lml__text");
    t && (t.textContent = this._text);
  }
  maybeInitField() {
    if (!this.fieldHost) return;
    const t = this.variant;
    if (t !== "neural" && t !== "void") return;
    const e = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || (t === "void" ? "120 240 255" : "124 92 255");
    this.field = new k(this.shadow.host, {
      count: 24,
      rgb: e,
      sizeRange: [0.6, 1.8],
      speedRange: [0.2, 0.6],
      lifeRange: [100, 200],
      connect: t === "neural",
      starfield: t === "void"
    }), this.field.mount(this.fieldHost);
  }
}
a(Et, "tagName", "lumina-loading");
customElements.get(Et.tagName) || customElements.define(Et.tagName, Et);
class At extends l {
  constructor() {
    super(...arguments);
    a(this, "_strength", 0.4);
    a(this, "btn", null);
    a(this, "targetX", 0);
    a(this, "targetY", 0);
    a(this, "currentX", 0);
    a(this, "currentY", 0);
    a(this, "raf", 0);
    a(this, "tracking", !1);
    a(this, "onPointerMove", (t) => {
      if (!this.btn) return;
      const e = this.getBoundingClientRect(), i = e.left + e.width / 2, r = e.top + e.height / 2, s = (t.clientX - i) * this._strength, n = (t.clientY - r) * this._strength;
      this.targetX = s, this.targetY = n, this.tracking || (this.tracking = !0, this.dispatchEvent(new CustomEvent("lumina-magnetic-start", { bubbles: !0, composed: !0, detail: { strength: this._strength } })), this.tick());
    });
    a(this, "onPointerLeave", () => {
      this.targetX = 0, this.targetY = 0;
    });
    a(this, "tick", () => {
      this.btn && (this.currentX += (this.targetX - this.currentX) * 0.15, this.currentY += (this.targetY - this.currentY) * 0.15, this.btn.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`, Math.abs(this.targetX - this.currentX) > 0.1 || Math.abs(this.targetY - this.currentY) > 0.1 || Math.abs(this.currentX) > 0.1 || Math.abs(this.currentY) > 0.1 ? this.raf = requestAnimationFrame(this.tick) : (this.tracking = !1, this.btn.style.transform = ""));
    });
    a(this, "onClick", () => {
      this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
    });
    a(this, "onKeydown", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.onClick());
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "magnetic-strength"];
  }
  get magneticStrength() {
    return this._strength;
  }
  set magneticStrength(t) {
    this._strength = v(t, 0, 1), this.setAttribute("magnetic-strength", String(this._strength));
  }
  render() {
    return `
      <button class="lmmb" part="button" type="button">
        <span class="lmmb__bg" aria-hidden="true"></span>
        <span class="lmmb__glow" part="glow" aria-hidden="true"></span>
        <span class="lmmb__label"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); padding: 20px; }
      .lmmb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform 0.3s var(--lumina-ease-out);
        will-change: transform;
      }
      .lmmb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmmb__glow { position: absolute; inset: -20%; border-radius: inherit; pointer-events: none; z-index: 0; opacity: 0; background: radial-gradient(60% 60% at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.5), transparent 70%); filter: blur(20px); transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmmb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmmb__glow { opacity: calc(0.6 * var(--lumina-intensity)); }
      :host(:active) .lmmb { transform: scale(0.97) !important; }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="aura"]) .lmmb { animation: lmmb-float 4s ease-in-out infinite; }
      @keyframes lmmb-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      @media (prefers-reduced-motion: reduce) { .lmmb { transition: none !important; animation: none !important; transform: none !important; } }
    `;
  }
  mounted() {
    this._strength = v(parseFloat(this.getAttribute("magnetic-strength") ?? "0.4") || 0.4, 0, 1), this.btn = this.$$(".lmmb"), this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), p() || (this.addEventListener("pointermove", this.onPointerMove), this.addEventListener("pointerleave", this.onPointerLeave)), this.btn?.addEventListener("click", this.onClick), this.btn?.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
    cancelAnimationFrame(this.raf);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "magnetic-strength" && (this._strength = v(parseFloat(i ?? "0.4") || 0.4, 0, 1));
  }
}
a(At, "tagName", "lumina-magnetic-button");
customElements.get(At.tagName) || customElements.define(At.tagName, At);
class $t extends l {
  static get observedAttributes() {
    return [...l.observedAttributes];
  }
  render() {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        padding: 8px;
        border-radius: var(--lumina-radius-pill);
      }
      .lmc__glow {
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))), transparent 60%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      .lmc__inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow { transition: none !important; }
      }
`;
  }
  mounted() {
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
  /** Dispatch a CustomEvent with composed bubbling. */
  emit(o, t) {
    this.dispatchEvent(new CustomEvent(o, { bubbles: !0, composed: !0, detail: t }));
  }
  /** For overlay-style components: open/close helpers. */
  open() {
    this.setAttribute("open", ""), this.setAttribute("data-open", ""), this.emit("lumina-open");
  }
  close() {
    this.removeAttribute("open"), this.removeAttribute("data-open"), this.emit("lumina-close");
  }
}
a($t, "tagName", "lumina-mega-menu");
customElements.get($t.tagName) || customElements.define($t.tagName, $t);
class zt extends l {
  constructor() {
    super(...arguments);
    a(this, "_memoryEnabled", !0);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "memory", []);
    a(this, "raf", 0);
    a(this, "hoverCount", 0);
    a(this, "clickCount", 0);
    a(this, "totalTime", 0);
    a(this, "lastTime", 0);
    a(this, "onMove", (t) => {
      const e = this.getBoundingClientRect(), i = t.clientX - e.left, r = t.clientY - e.top;
      this.memory.push({ x: i, y: r, age: 0, intensity: 1 }), this.memory.length > 100 && this.memory.shift();
    });
    a(this, "onClick", () => {
      this.clickCount++, this.updateWarmth(), this.dispatchEvent(new CustomEvent("lumina-memory-update", { bubbles: !0, composed: !0, detail: { hovers: this.hoverCount, clicks: this.clickCount, time: this.totalTime } }));
    });
    a(this, "onEnter", () => {
      this.hoverCount++, this.updateWarmth();
    });
    a(this, "onLeave", () => {
      this.updateWarmth();
    });
    a(this, "tick", () => {
      const t = Date.now(), e = (t - this.lastTime) / 1e3;
      if (this.lastTime = t, this.matches(":hover") && (this.totalTime += e), this.ctx && this.canvas) {
        const i = window.devicePixelRatio || 1, r = this.clientWidth, s = this.clientHeight;
        this.canvas.width !== r * i && (this.canvas.width = r * i, this.canvas.height = s * i, this.canvas.style.width = `${r}px`, this.canvas.style.height = `${s}px`, this.ctx.setTransform(i, 0, 0, i, 0, 0)), this.ctx.clearRect(0, 0, r, s);
        const n = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255";
        this.memory = this.memory.filter((d) => d.age < 60);
        for (const d of this.memory) {
          d.age += 1;
          const u = (1 - d.age / 60) * 0.4;
          this.ctx.fillStyle = `rgba(${n} / ${u})`, this.ctx.beginPath(), this.ctx.arc(d.x, d.y, 3 + d.age * 0.3, 0, Math.PI * 2), this.ctx.fill();
        }
      }
      this.raf = requestAnimationFrame(this.tick);
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "memory-enabled"];
  }
  get memoryEnabled() {
    return this._memoryEnabled;
  }
  set memoryEnabled(t) {
    this._memoryEnabled = t, t ? this.setAttribute("memory-enabled", "") : this.removeAttribute("memory-enabled");
  }
  render() {
    return `
      <article class="lmmc" part="card">
        <canvas class="lmmc__memory" part="memory-layer" aria-hidden="true"></canvas>
        <div class="lmmc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); --lmmc-warmth: 0; }
      .lmmc { position: relative; display: block; border-radius: inherit; overflow: hidden; }
      .lmmc__memory { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; opacity: calc(0.3 + var(--lmmc-warmth) * 0.5); }
      .lmmc__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 calc(var(--lmmc-warmth) * 30px) rgb(var(--lumina-accent-rgb) / calc(var(--lmmc-warmth) * 0.4)), var(--lumina-shadow); padding: 24px; transition: box-shadow var(--lumina-speed) var(--lumina-ease-out); }
      :host([variant="neural"]) .lmmc__surface { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host([variant="aura"]) .lmmc__surface { background: radial-gradient(120% 100% at 50% 0%, rgb(var(--lumina-accent-rgb) / calc(0.1 + var(--lmmc-warmth) * 0.2)), rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%); }
      @media (prefers-reduced-motion: reduce) { .lmmc__surface { transition: none !important; } }
    `;
  }
  mounted() {
    this._memoryEnabled = this.getAttribute("memory-enabled") !== "false", this.canvas = this.$$(".lmmc__memory"), this.ctx = this.canvas?.getContext("2d") ?? null, this._memoryEnabled && (this.addEventListener("pointermove", this.onMove), this.addEventListener("click", this.onClick), this.addEventListener("pointerenter", this.onEnter), this.addEventListener("pointerleave", this.onLeave), this.lastTime = Date.now(), this.raf = requestAnimationFrame(this.tick));
  }
  unmounted() {
    cancelAnimationFrame(this.raf), this.removeEventListener("pointermove", this.onMove), this.removeEventListener("click", this.onClick), this.removeEventListener("pointerenter", this.onEnter), this.removeEventListener("pointerleave", this.onLeave);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "memory-enabled" && (this._memoryEnabled = i !== "false");
  }
  updateWarmth() {
    const t = v(this.hoverCount * 0.1 + this.clickCount * 0.2, 0, 1);
    this.style.setProperty("--lmmc-warmth", String(t));
  }
}
a(zt, "tagName", "lumina-memory-card");
customElements.get(zt.tagName) || customElements.define(zt.tagName, zt);
class St extends l {
  constructor() {
    super(...arguments);
    a(this, "dialog", null);
    a(this, "backdrop", null);
    a(this, "portal", null);
    a(this, "previouslyFocused", null);
    a(this, "_open", !1);
    a(this, "onKeyDown", (t) => {
      if (this._open && (t.key === "Escape" && this.getAttribute("closable") !== "false" && (t.preventDefault(), this.close()), t.key === "Tab")) {
        const e = Array.from(
          this.shadow.querySelectorAll(
            'button, [tabindex]:not([tabindex="-1"]), input, a[href]'
          )
        );
        if (e.length === 0) return;
        const i = e[0], r = e[e.length - 1];
        t.shiftKey && document.activeElement === i ? (t.preventDefault(), r.focus()) : !t.shiftKey && document.activeElement === r && (t.preventDefault(), i.focus());
      }
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "open", "closable"];
  }
  get open() {
    return this._open;
  }
  set open(t) {
    t ? this.showModal() : this.close();
  }
  render() {
    return `
      <dialog class="lumina-modal" part="root">
        <div class="lumina-modal__backdrop" part="backdrop" aria-hidden="true"></div>
        <div class="lumina-modal__portal" part="portal" aria-hidden="true"></div>
        <div class="lumina-modal__panel" part="panel">
          <div class="lumina-modal__glass" part="glass">
            <div class="lumina-modal__header" part="header">
              <slot name="title"><h2 class="lumina-modal__title">Modal</h2></slot>
              <button class="lumina-modal__close" part="close" aria-label="Close">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="lumina-modal__body" part="body">
              <slot></slot>
            </div>
            <div class="lumina-modal__footer" part="footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </dialog>
    `;
  }
  styles() {
    return `
      :host {
        display: contents;
      }

      .lumina-modal {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        border: 0;
        padding: 0;
        background: transparent;
        color: var(--lumina-text);
        font-family: var(--lumina-font-sans);
        max-width: none;
        max-height: none;
      }
      .lumina-modal::backdrop { background: transparent; }

      .lumina-modal__backdrop {
        position: absolute;
        inset: 0;
        background: rgb(0 0 0 / 0.6);
        -webkit-backdrop-filter: blur(8px) saturate(0.8);
        backdrop-filter: blur(8px) saturate(0.8);
        -webkit-backdrop-filter: blur(8px) saturate(0.8);
        opacity: 0;
        transition: opacity calc(var(--lumina-speed) * 1.5) var(--lumina-ease-out);
      }

      .lumina-modal__portal {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: radial-gradient(circle,
          rgb(var(--lumina-accent-rgb) / 0.6) 0%,
          rgb(var(--lumina-accent-rgb) / 0.2) 40%,
          transparent 70%
        );
        filter: blur(30px);
        opacity: 0;
        pointer-events: none;
      }

      .lumina-modal__panel {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0.6);
        width: min(92vw, 560px);
        max-height: 86vh;
        opacity: 0;
        transition:
          transform calc(var(--lumina-speed) * 1.4) var(--lumina-ease-spring),
          opacity var(--lumina-speed) var(--lumina-ease-out);
        z-index: 2;
      }

      .lumina-modal__glass {
        position: relative;
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.1));
        -webkit-backdrop-filter: blur(24px) saturate(1.6);
        backdrop-filter: blur(24px) saturate(1.6);
        -webkit-backdrop-filter: blur(24px) saturate(1.6);
        border: 1px solid var(--lumina-border);
        border-radius: var(--lumina-radius-xl);
        box-shadow:
          0 30px 80px -20px rgb(0 0 0 / 0.6),
          inset 0 1px 0 0 rgb(255 255 255 / 0.10);
        overflow: hidden;
      }
      .lumina-modal__glass::before {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        background: conic-gradient(from 0deg,
          transparent 0%,
          rgb(var(--lumina-accent-rgb) / 0.4) 25%,
          transparent 50%,
          rgb(var(--lumina-accent-rgb) / 0.4) 75%,
          transparent 100%
        );
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude;
        padding: 2px;
        animation: lumina-modal-spin 8s linear infinite;
        opacity: 0.6;
        pointer-events: none;
      }

      .lumina-modal__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 20px 24px;
        border-bottom: 1px solid var(--lumina-border);
      }
      .lumina-modal__title { margin: 0; font-size: 18px; font-weight: 700; }
      .lumina-modal__close {
        appearance: none;
        border: 0;
        background: rgb(255 255 255 / 0.06);
        color: var(--lumina-text);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background var(--lumina-speed) var(--lumina-ease-out),
                    transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lumina-modal__close:hover {
        background: rgb(var(--lumina-accent-rgb) / 0.3);
        transform: rotate(90deg);
      }

      .lumina-modal__body {
        padding: 24px;
        overflow-y: auto;
        max-height: calc(86vh - 140px);
      }

      .lumina-modal__footer {
        padding: 16px 24px;
        border-top: 1px solid var(--lumina-border);
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .lumina-modal__footer:empty { display: none; }

      /* Open state */
      :host([data-open]) .lumina-modal__backdrop { opacity: 1; }
      :host([data-open]) .lumina-modal__panel {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      :host([data-open]) .lumina-modal__portal {
        animation: lumina-modal-burst calc(var(--lumina-speed) * 1.4) var(--lumina-ease-out) forwards;
      }

      /* Void variant */
      :host([variant="void"]) .lumina-modal__glass {
        background: rgb(0 0 0 / 0.7);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
      }
      :host([variant="void"]) .lumina-modal__title {
        color: var(--lumina-accent);
        text-shadow:
          -1px 0 1px rgb(255 0 80 / 0.6),
          1px 0 1px rgb(0 200 255 / 0.6);
      }

      /* Dimensional variant */
      :host([variant="dimensional"]) .lumina-modal__panel {
        transform: translate(-50%, -50%) scale(0.6) rotateX(40deg);
        transform-style: preserve-3d;
      }
      :host([variant="dimensional"][data-open]) .lumina-modal__panel {
        transform: translate(-50%, -50%) scale(1) rotateX(0deg);
      }

      @keyframes lumina-modal-spin { to { transform: rotate(360deg); } }
      @keyframes lumina-modal-burst {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(20); opacity: 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-modal__panel,
        .lumina-modal__backdrop,
        .lumina-modal__portal,
        .lumina-modal__glass::before {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }
  mounted() {
    this.dialog = this.$$(".lumina-modal"), this.backdrop = this.$$(".lumina-modal__backdrop"), this.portal = this.$$(".lumina-modal__portal"), this.$$(".lumina-modal__close")?.addEventListener("click", () => this.close()), this.backdrop?.addEventListener("click", () => {
      this.getAttribute("closable") !== "false" && this.close();
    }), document.addEventListener("keydown", this.onKeyDown), this.hasAttribute("open") && requestAnimationFrame(() => this.showModal());
  }
  unmounted() {
    document.removeEventListener("keydown", this.onKeyDown), this.dialog?.open && this.dialog.close();
  }
  onConfigChange(t) {
  }
  /* ---------------------------------------------------------------- */
  showModal() {
    if (!(this._open || !this.dialog)) {
      this.previouslyFocused = document.activeElement, this._open = !0, this.setAttribute("data-open", ""), this.setAttribute("open", "");
      try {
        this.dialog.showModal();
      } catch {
      }
      requestAnimationFrame(() => {
        this.$$(
          'button, [tabindex]:not([tabindex="-1"]), input, a[href]'
        )?.focus();
      }), this.dispatchEvent(new CustomEvent("lumina-open", { bubbles: !0, composed: !0 }));
    }
  }
  close() {
    !this._open || !this.dialog || (this._open = !1, this.removeAttribute("data-open"), this.removeAttribute("open"), p() ? this.dialog.close() : setTimeout(() => this.dialog?.close(), 350), this.previouslyFocused?.focus(), this.dispatchEvent(new CustomEvent("lumina-close", { bubbles: !0, composed: !0 })));
  }
}
a(St, "tagName", "lumina-modal");
customElements.get(St.tagName) || customElements.define(St.tagName, St);
const z = {
  pill: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  squircle: "polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)",
  hexagon: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
  diamond: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
  star: "polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
};
class Lt extends l {
  constructor() {
    super(...arguments);
    a(this, "_from", "pill");
    a(this, "_to", "squircle");
    a(this, "iconEl", null);
    a(this, "onEnter", () => {
      const t = this.$$(".lmob");
      t && (t.style.clipPath = z[this._to] ?? z.squircle), this._from.length <= 2 && this._to.length <= 2 && this.iconEl && (this.iconEl.textContent = this._to), this.dispatchEvent(new CustomEvent("lumina-morph-start", { bubbles: !0, composed: !0, detail: { from: this._from, to: this._to } }));
    });
    a(this, "onLeave", () => {
      const t = this.$$(".lmob");
      t && (t.style.clipPath = z[this._from] ?? z.pill), this._from.length <= 2 && this._to.length <= 2 && this.iconEl && (this.iconEl.textContent = this._from), this.dispatchEvent(new CustomEvent("lumina-morph-end", { bubbles: !0, composed: !0, detail: { from: this._to, to: this._from } }));
    });
    a(this, "onClick", () => {
      this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
    });
    a(this, "onKeydown", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.onClick());
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "from", "to"];
  }
  get from() {
    return this._from;
  }
  set from(t) {
    this._from = t, this.setAttribute("from", t), this.applyShape();
  }
  get to() {
    return this._to;
  }
  set to(t) {
    this._to = t, this.setAttribute("to", t), this.applyShape();
  }
  render() {
    return `
      <button class="lmob" part="button" type="button">
        <span class="lmob__bg" aria-hidden="true"></span>
        <span class="lmob__icon" part="icon"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmob {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; min-width: 80px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        transition: clip-path var(--lumina-speed) var(--lumina-ease-spring), transform var(--lumina-speed) var(--lumina-ease-spring);
        isolation: isolate;
      }
      .lmob__bg { position: absolute; inset: 0; background: linear-gradient(135deg, rgb(var(--lumina-accent-rgb) / 0.8), rgb(var(--lumina-surface) / var(--lumina-surface-alpha))); border: 1px solid var(--lumina-border); z-index: 0; }
      .lmob__icon { position: relative; z-index: 1; white-space: nowrap; transition: transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host(:hover) .lmob { transform: scale(1.05); }
      :host(:active) .lmob { transform: scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      @media (prefers-reduced-motion: reduce) { .lmob, .lmob__icon { transition: none !important; } }
    `;
  }
  mounted() {
    this._from = this.getAttribute("from") ?? "pill", this._to = this.getAttribute("to") ?? "squircle", this.iconEl = this.$$(".lmob__icon"), this.applyShape(), this.getAttribute("role") !== "button" && this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.$$(".lmob")?.addEventListener("click", this.onClick), this.$$(".lmob")?.addEventListener("keydown", this.onKeydown), this.addEventListener("pointerenter", this.onEnter), this.addEventListener("pointerleave", this.onLeave);
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "from" ? (this._from = i ?? "pill", this.applyShape()) : t === "to" && (this._to = i ?? "squircle", this.applyShape());
  }
  applyShape() {
    const t = this.$$(".lmob");
    t && (t.style.clipPath = z[this._from] ?? z.pill);
  }
}
a(Lt, "tagName", "lumina-morph-button");
customElements.get(Lt.tagName) || customElements.define(Lt.tagName, Lt);
const Be = {
  subtle: {
    rest: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    hover: "polygon(3% 0, 97% 0, 100% 50%, 97% 100%, 3% 100%, 0 50%)"
  },
  intense: {
    rest: "polygon(8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%, 0 8%)",
    hover: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
  },
  extreme: {
    rest: "polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%)",
    hover: "polygon(20% 0, 80% 0, 100% 50%, 80% 100%, 20% 100%, 0 50%)"
  }
};
class Mt extends l {
  constructor() {
    super(...arguments);
    a(this, "card", null);
    a(this, "onEnter", () => {
      this.applyShape("hover"), this.dispatchEvent(new CustomEvent("lumina-morph-start", { bubbles: !0, composed: !0, detail: { variant: this.variant, state: "hover" } }));
    });
    a(this, "onLeave", () => {
      this.applyShape("rest"), this.dispatchEvent(new CustomEvent("lumina-morph-end", { bubbles: !0, composed: !0, detail: { variant: this.variant, state: "rest" } }));
    });
  }
  render() {
    return `
      <article class="lmmc" part="card">
        <div class="lmmc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; color: var(--lumina-text); }
      .lmmc { position: relative; display: block; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transition: clip-path var(--lumina-speed) var(--lumina-ease-spring); }
      .lmmc__surface { position: relative; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; overflow: hidden; }
      :host(:hover) .lmmc { transform: scale(1.03); }
      @media (prefers-reduced-motion: reduce) { .lmmc { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this.card = this.$$(".lmmc"), this.applyShape("rest"), this.addEventListener("pointerenter", this.onEnter), this.addEventListener("pointerleave", this.onLeave);
  }
  unmounted() {
    this.removeEventListener("pointerenter", this.onEnter), this.removeEventListener("pointerleave", this.onLeave);
  }
  onConfigChange(t) {
    t.variant && this.applyShape("rest");
  }
  applyShape(t) {
    if (!this.card) return;
    const e = Be[this.variant] ?? Be.subtle;
    this.card.style.clipPath = e[t];
  }
}
a(Mt, "tagName", "lumina-morph-card");
customElements.get(Mt.tagName) || customElements.define(Mt.tagName, Mt);
const C = ["lumina-button", "lumina-card", "lumina-badge", "lumina-chip", "lumina-input", "lumina-toggle-button"];
class Nt extends l {
  constructor() {
    super(...arguments);
    a(this, "_target", "lumina-button");
    a(this, "stage", null);
    a(this, "currentIdx", 0);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "target"];
  }
  render() {
    return `
      <div class="lmml" part="root">
        <div class="lmml__stage" part="stage" data-stage></div>
        <div class="lmml__controls" part="controls">
          <button class="lmml__btn" data-dir="prev">← Anterior</button>
          <span class="lmml__label" part="label"></span>
          <button class="lmml__btn" data-dir="next">Próximo →</button>
        </div>
        <div class="lmml__timeline" part="timeline"></div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmml { display: flex; flex-direction: column; gap: 16px; padding: 24px; border-radius: var(--lumina-radius-lg); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(16px) saturate(1.4); -webkit-backdrop-filter: blur(16px) saturate(1.4); border: 1px solid var(--lumina-border); }
      .lmml__stage { min-height: 120px; display: flex; align-items: center; justify-content: center; border-radius: var(--lumina-radius-md); background: radial-gradient(circle at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.05), transparent 70%); overflow: hidden; position: relative; }
      .lmml__stage > * { animation: lmml-morph 0.6s var(--lumina-ease-spring); }
      @keyframes lmml-morph { 0% { opacity: 0; transform: scale(0.3) rotate(180deg); filter: blur(20px); } 50% { opacity: 0.5; filter: blur(8px); } 100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); } }
      .lmml__controls { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .lmml__btn { appearance: none; border: 1px solid var(--lumina-border); background: rgb(var(--lumina-accent-rgb) / 0.1); color: var(--lumina-text); padding: 8px 16px; border-radius: var(--lumina-radius-pill); cursor: pointer; font: 600 13px var(--lumina-font-sans); transition: all 0.2s; }
      .lmml__btn:hover { background: rgb(var(--lumina-accent-rgb) / 0.25); transform: translateY(-1px); }
      .lmml__label { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: var(--lumina-accent); }
      .lmml__timeline { display: flex; gap: 4px; }
      .lmml__dot { flex: 1; height: 3px; border-radius: 2px; background: var(--lumina-border); transition: background 0.3s; cursor: pointer; }
      .lmml__dot[data-active] { background: var(--lumina-accent); box-shadow: 0 0 6px var(--lumina-accent); }
      @media (prefers-reduced-motion: reduce) { .lmml__stage > * { animation: none !important; } }
    `;
  }
  mounted() {
    this.stage = this.$$(".lmml__stage"), this._target = this.getAttribute("target") ?? C[0], this.currentIdx = Math.max(0, C.indexOf(this._target)), this.renderTimeline(), this.renderTarget(), this.$$('.lmml__btn[data-dir="prev"]')?.addEventListener("click", () => this.morph(-1)), this.$$('.lmml__btn[data-dir="next"]')?.addEventListener("click", () => this.morph(1));
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "target" && (this._target = i ?? C[0], this.currentIdx = Math.max(0, C.indexOf(this._target)), this.renderTarget(), this.renderTimeline());
  }
  morph(t) {
    this.currentIdx = (this.currentIdx + t + C.length) % C.length, this._target = C[this.currentIdx], this.setAttribute("target", this._target), this.renderTarget(), this.renderTimeline(), this.dispatchEvent(new CustomEvent("lumina-morph", { bubbles: !0, composed: !0, detail: { target: this._target, index: this.currentIdx } }));
  }
  renderTarget() {
    if (!this.stage) return;
    const t = this._target, e = document.createElement(t);
    e.setAttribute("variant", "glass"), e.setAttribute("intensity", "intense"), e.setAttribute("accent-color", "#7c5cff"), t === "lumina-button" || t === "lumina-toggle-button" ? e.textContent = "Morph me" : t === "lumina-card" ? e.innerHTML = '<h3 slot="title">Morph Card</h3><p>Morphing em tempo real.</p>' : t === "lumina-badge" ? (e.textContent = "MORPH", e.setAttribute("dot", "")) : t === "lumina-chip" ? e.textContent = "Morph Chip" : t === "lumina-input" && e.setAttribute("placeholder", "Morph input..."), this.stage.innerHTML = "", this.stage.appendChild(e);
    const i = this.$$(".lmml__label");
    i && (i.textContent = `<${t}>`);
  }
  renderTimeline() {
    const t = this.$$(".lmml__timeline");
    t && (t.innerHTML = "", C.forEach((e, i) => {
      const r = document.createElement("div");
      r.className = "lmml__dot", i === this.currentIdx && r.setAttribute("data-active", ""), r.addEventListener("click", () => {
        this.currentIdx = i, this._target = e, this.setAttribute("target", e), this.renderTarget(), this.renderTimeline();
      }), t.appendChild(r);
    }));
  }
}
a(Nt, "tagName", "lumina-morph-lab");
customElements.get(Nt.tagName) || customElements.define(Nt.tagName, Nt);
class It extends l {
  constructor() {
    super(...arguments);
    a(this, "_options", []);
    a(this, "_selected", []);
    a(this, "_max", 0);
    a(this, "chipsEl", null);
    a(this, "menuEl", null);
    a(this, "searchEl", null);
    a(this, "_open", !1);
    a(this, "draggedChip", null);
    a(this, "toggleMenu", (t) => {
      t?.stopPropagation(), this._open = !this._open, this._open ? (this.setAttribute("data-open", ""), setTimeout(() => this.searchEl?.focus(), 50)) : this.removeAttribute("data-open");
    });
    a(this, "onDocClick", (t) => {
      !this.contains(t.target) && this._open && this.toggleMenu();
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "options", "value", "max"];
  }
  get value() {
    return this._selected.join(",");
  }
  set value(t) {
    this._selected = t ? t.split(",") : [], this.setAttribute("value", t), this.renderChips();
  }
  get options() {
    return this._options;
  }
  set options(t) {
    this._options = t, this.setAttribute("options", JSON.stringify(t)), this.renderMenu();
  }
  get max() {
    return this._max;
  }
  set max(t) {
    this._max = t, this.setAttribute("max", String(t));
  }
  render() {
    return `
      <div class="lmms" part="trigger">
        <div class="lmms__bg" aria-hidden="true"></div>
        <div class="lmms__chips" part="chips" data-chips></div>
        <button class="lmms__add" type="button" aria-label="Adicionar">+</button>
        <div class="lmms__menu" part="menu" aria-hidden="true">
          <input class="lmms__search" type="text" placeholder="Buscar..." />
          <div class="lmms__options" data-options></div>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmms { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 44px; padding: 8px 12px; border-radius: var(--lumina-radius-md); cursor: pointer; }
      .lmms__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmms__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmms__chips { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 6px; flex: 1; }
      .lmms__chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; padding-right: 4px; border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-accent-rgb) / 0.2); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.4); font-size: 12px; font-weight: 600; color: var(--lumina-text); cursor: grab; animation: lmms-chip-in var(--lumina-speed) var(--lumina-ease-spring); }
      .lmms__chip[draggable="true"] { cursor: grab; }
      .lmms__chip[data-dragging] { opacity: 0.4; }
      .lmms__chip[data-drag-over] { border-color: var(--lumina-accent); box-shadow: 0 0 8px rgb(var(--lumina-accent-rgb) / 0.5); }
      @keyframes lmms-chip-in { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .lmms__chip-remove { appearance: none; border: 0; background: rgb(var(--lumina-accent-rgb) / 0.3); color: var(--lumina-text); width: 16px; height: 16px; border-radius: 50%; cursor: pointer; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }
      .lmms__chip-remove:hover { background: rgb(239 68 68 / 0.5); }
      .lmms__add { position: relative; z-index: 1; appearance: none; border: 1px dashed var(--lumina-border); background: transparent; color: var(--lumina-text-muted); width: 28px; height: 28px; border-radius: var(--lumina-radius-md); cursor: pointer; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; }
      .lmms__add:hover { border-color: var(--lumina-accent); color: var(--lumina-accent); }
      .lmms__menu { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 1000; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); overflow: hidden; max-height: 0; opacity: 0; transition: max-height var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmms__menu { max-height: 280px; opacity: 1; }
      .lmms__search { width: 100%; padding: 10px 14px; border: 0; border-bottom: 1px solid var(--lumina-border); background: transparent; color: var(--lumina-text); font: 500 13px var(--lumina-font-sans); outline: none; }
      .lmms__options { max-height: 200px; overflow-y: auto; padding: 4px; }
      .lmms__option { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background 0.15s; }
      .lmms__option:hover { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lmms__option[data-selected] { background: rgb(var(--lumina-accent-rgb) / 0.3); }
      .lmms__option[disabled] { opacity: 0.4; pointer-events: none; }
      .lmms__option-check { color: var(--lumina-accent); font-weight: 700; }
      :host([variant="compact"]) .lmms { min-height: 36px; padding: 6px 10px; }
      @media (prefers-reduced-motion: reduce) { .lmms__menu, .lmms__chip { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this._max = parseInt(this.getAttribute("max") ?? "0", 10) || 0;
    const t = this.getAttribute("options");
    if (t)
      try {
        this._options = JSON.parse(t);
      } catch {
        this._options = [];
      }
    const e = this.getAttribute("value");
    this._selected = e ? e.split(",") : [], this.chipsEl = this.$$(".lmms__chips"), this.menuEl = this.$$(".lmms__menu"), this.searchEl = this.$$(".lmms__search"), this.renderChips(), this.renderMenu(), this.$$(".lmms__add")?.addEventListener("click", this.toggleMenu), this.searchEl?.addEventListener("input", () => this.renderMenu()), document.addEventListener("click", this.onDocClick);
  }
  unmounted() {
    document.removeEventListener("click", this.onDocClick);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    if (super.attributeChangedCallback(t, e, i), t === "options" && i)
      try {
        this._options = JSON.parse(i), this.renderMenu();
      } catch {
      }
    else t === "value" ? (this._selected = i ? i.split(",") : [], this.renderChips()) : t === "max" && (this._max = parseInt(i ?? "0", 10) || 0);
  }
  renderChips() {
    this.chipsEl && (this.chipsEl.innerHTML = "", this._selected.forEach((t) => {
      const e = this._options.find((s) => s.value === t);
      if (!e) return;
      const i = document.createElement("span");
      i.className = "lmms__chip", i.setAttribute("draggable", "true"), i.setAttribute("data-value", t), i.innerHTML = `<span>${e.label}</span>`;
      const r = document.createElement("button");
      r.className = "lmms__chip-remove", r.textContent = "×", r.addEventListener("click", (s) => {
        s.stopPropagation(), this.removeChip(t);
      }), i.appendChild(r), i.addEventListener("dragstart", (s) => {
        this.draggedChip = t, i.setAttribute("data-dragging", ""), s.dataTransfer?.setData("text/plain", t);
      }), i.addEventListener("dragend", () => {
        this.draggedChip = null, i.removeAttribute("data-dragging");
      }), i.addEventListener("dragover", (s) => {
        s.preventDefault(), i.setAttribute("data-drag-over", "");
      }), i.addEventListener("dragleave", () => i.removeAttribute("data-drag-over")), i.addEventListener("drop", (s) => {
        if (s.preventDefault(), i.removeAttribute("data-drag-over"), this.draggedChip && this.draggedChip !== t) {
          const n = this._selected.indexOf(this.draggedChip), d = this._selected.indexOf(t);
          this._selected.splice(n, 1), this._selected.splice(d, 0, this.draggedChip), this.setAttribute("value", this._selected.join(",")), this.renderChips(), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { value: this.value } }));
        }
      }), this.chipsEl.appendChild(i);
    }));
  }
  renderMenu() {
    const t = this.$$(".lmms__options");
    if (!t) return;
    const e = (this.searchEl?.value ?? "").toLowerCase().trim(), i = this._options.filter((r) => !e || r.label.toLowerCase().includes(e));
    t.innerHTML = "", i.forEach((r) => {
      const s = document.createElement("div");
      s.className = "lmms__option", s.setAttribute("data-value", r.value);
      const n = this._selected.includes(r.value);
      n && s.setAttribute("data-selected", ""), this._max > 0 && this._selected.length >= this._max && !n && s.setAttribute("disabled", ""), s.innerHTML = `<span>${r.label}</span>${n ? '<span class="lmms__option-check">✓</span>' : ""}`, s.addEventListener("click", () => this.toggleOption(r.value)), t.appendChild(s);
    });
  }
  toggleOption(t) {
    const e = this._selected.indexOf(t);
    if (e >= 0)
      this._selected.splice(e, 1);
    else {
      if (this._max > 0 && this._selected.length >= this._max) return;
      this._selected.push(t);
    }
    this.setAttribute("value", this._selected.join(",")), this.renderChips(), this.renderMenu(), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { value: this.value } }));
  }
  removeChip(t) {
    this._selected = this._selected.filter((e) => e !== t), this.setAttribute("value", this._selected.join(",")), this.renderChips(), this.renderMenu(), this.dispatchEvent(new CustomEvent("lumina-chip-remove", { bubbles: !0, composed: !0, detail: { value: t } })), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { value: this.value } }));
  }
}
a(It, "tagName", "lumina-multi-select");
customElements.get(It.tagName) || customElements.define(It.tagName, It);
class Pt extends l {
  constructor() {
    super(...arguments);
    a(this, "indicator", null);
    a(this, "items", []);
    a(this, "currentActive", null);
    a(this, "glow", null);
    a(this, "onPointerMove", w((t) => {
      const e = this.getBoundingClientRect(), i = (t.clientX - e.left) / e.width * 100;
      this.style.setProperty("--lx", `${i}%`);
    }, 16));
    a(this, "onResize", () => {
      this.currentActive && this.positionIndicator(this.currentActive, !1);
    });
  }
  render() {
    return `
      <nav class="lumina-nav" part="root">
        <div class="lumina-nav__glow" part="glow" aria-hidden="true"></div>
        <div class="lumina-nav__bar" part="bar">
          <div class="lumina-nav__indicator" part="indicator" aria-hidden="true"></div>
          <slot></slot>
        </div>
      </nav>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-nav {
        position: relative;
        padding: 12px;
        border-radius: var(--lumina-radius-pill);
      }

      .lumina-nav__glow {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(
          240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))),
          transparent 60%
        );
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lumina-nav__glow { opacity: 1; }

      .lumina-nav__bar {
        position: relative;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 0 0 rgb(255 255 255 / 0.08),
          var(--lumina-shadow);
      }

      .lumina-nav__indicator {
        position: absolute;
        top: 6px;
        left: 6px;
        height: calc(100% - 12px);
        border-radius: var(--lumina-radius-pill);
        background: linear-gradient(135deg,
          rgb(var(--lumina-accent-rgb) / 0.95),
          rgb(var(--lumina-accent-rgb) / 0.65)
        );
        box-shadow:
          0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4),
          inset 0 1px 0 rgb(255 255 255 / 0.25);
        opacity: 0;
        transition:
          transform var(--lumina-speed) var(--lumina-ease-spring),
          width var(--lumina-speed) var(--lumina-ease-spring),
          opacity var(--lumina-speed) var(--lumina-ease-out);
        z-index: 0;
        pointer-events: none;
      }
      .lumina-nav__indicator[data-active] { opacity: 1; }

      ::slotted(lumina-nav-item) {
        position: relative;
        z-index: 1;
      }

      /* Variant: void */
      :host([variant="void"]) .lumina-nav__bar {
        background: rgb(0 0 0 / 0.55);
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }

      /* Variant: morph */
      :host([variant="morph"]) .lumina-nav__indicator {
        border-radius: 8px;
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-nav__indicator,
        .lumina-nav__glow { transition: none !important; }
      }
    `;
  }
  mounted() {
    this.indicator = this.$$(".lumina-nav__indicator"), this.glow = this.$$(".lumina-nav__glow"), this.items = Array.from(this.querySelectorAll("lumina-nav-item")), this.items.forEach((e) => {
      e.addEventListener("click", () => this.setActive(e));
    });
    const t = this.items.find((e) => e.hasAttribute("active")) ?? this.items[0];
    t && requestAnimationFrame(() => this.positionIndicator(t, !1)), this.addEventListener("pointermove", this.onPointerMove), window.addEventListener("resize", this.onResize);
  }
  unmounted() {
    this.removeEventListener("pointermove", this.onPointerMove), window.removeEventListener("resize", this.onResize);
  }
  onConfigChange(t) {
  }
  setActive(t) {
    this.items.forEach((e) => e.removeAttribute("active")), t.setAttribute("active", ""), this.positionIndicator(t, !0), this.dispatchEvent(
      new CustomEvent("lumina-nav-change", {
        detail: { value: t.getAttribute("value") ?? t.textContent?.trim() },
        bubbles: !0,
        composed: !0
      })
    );
  }
  positionIndicator(t, e) {
    if (!this.indicator) return;
    const i = this.$$(".lumina-nav__bar");
    if (!i) return;
    const r = i.getBoundingClientRect(), s = t.getBoundingClientRect(), n = s.left - r.left, d = s.width;
    e ? this.indicator.style.transition = "" : p() && (this.indicator.style.transition = "none"), this.indicator.style.transform = `translateX(${n - 6}px)`, this.indicator.style.width = `${d}px`, this.indicator.setAttribute("data-active", ""), this.currentActive = t;
  }
}
a(Pt, "tagName", "lumina-navigation");
class Tt extends HTMLElement {
  constructor() {
    super();
    const o = this.attachShadow({ mode: "open" }), t = new CSSStyleSheet();
    t.replaceSync(`
      :host {
        display: inline-flex;
        align-items: center;
        height: 38px;
        padding: 0 16px;
        border-radius: var(--lumina-radius-pill);
        color: var(--lumina-text-muted);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        transition: color var(--lumina-speed) var(--lumina-ease-out);
        white-space: nowrap;
      }
      :host(:hover) { color: var(--lumina-text); }
      :host([active]) { color: #fff; font-weight: 600; }
      :host(:focus-visible) {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 2px;
      }
      ::slotted(*) { pointer-events: none; }
    `), o.adoptedStyleSheets = [t], o.innerHTML = "<slot></slot>", this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.addEventListener("keydown", (e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.click());
    });
  }
}
a(Tt, "tagName", "lumina-nav-item");
customElements.get(Pt.tagName) || customElements.define(Pt.tagName, Pt);
customElements.get(Tt.tagName) || customElements.define(Tt.tagName, Tt);
class Rt extends l {
  constructor() {
    super(...arguments);
    a(this, "_particleCount", 20);
    a(this, "field", null);
    a(this, "fieldHost", null);
    a(this, "onClick", () => {
      this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
    });
    a(this, "onKeydown", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.onClick());
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "particle-count"];
  }
  get particleCount() {
    return this._particleCount;
  }
  set particleCount(t) {
    this._particleCount = t, this.setAttribute("particle-count", String(t)), this.rebuildField();
  }
  render() {
    return `
      <button class="lmnb" part="button" type="button">
        <span class="lmnb__bg" aria-hidden="true"></span>
        <span class="lmnb__field" part="particles" aria-hidden="true"></span>
        <span class="lmnb__label"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmnb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmnb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.3); z-index: 0; }
      .lmnb__field { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 1; opacity: 0.8; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmnb__label { position: relative; z-index: 2; white-space: nowrap; text-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.8); }
      :host(:hover) .lmnb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmnb__field { opacity: 1; }
      :host(:hover) .lmnb__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.6); }
      :host(:active) .lmnb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="intense"]) .lmnb__field { opacity: 1; }
      :host([variant="intense"]) .lmnb__label { text-shadow: 0 0 16px rgb(var(--lumina-accent-rgb) / 1); }
      :host([variant="subtle"]) .lmnb__field { opacity: 0.5; }
      @media (prefers-reduced-motion: reduce) { .lmnb { transition: none !important; } }
    `;
  }
  mounted() {
    this._particleCount = parseInt(this.getAttribute("particle-count") ?? "20", 10) || 20, this.fieldHost = this.$$(".lmnb__field"), this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.$$(".lmnb")?.addEventListener("click", this.onClick), this.$$(".lmnb")?.addEventListener("keydown", this.onKeydown), p() || this.buildField();
  }
  unmounted() {
    this.field?.destroy(), this.field = null;
  }
  onConfigChange(t) {
    (t.intensity || t["accent-color"]) && this.rebuildField();
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "particle-count" && (this._particleCount = parseInt(i ?? "20", 10) || 20, this.rebuildField());
  }
  rebuildField() {
    this.field?.destroy(), this.field = null, p() || this.buildField();
  }
  buildField() {
    if (!this.fieldHost) return;
    const t = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", e = y(this.intensity);
    this.field = new k(this.shadow.host, {
      count: Math.round(this._particleCount * e),
      rgb: t,
      sizeRange: [0.6, 1.8],
      speedRange: [0.15, 0.5],
      lifeRange: [100, 200],
      connect: !0
    }), this.field.mount(this.fieldHost);
  }
}
a(Rt, "tagName", "lumina-neural-button");
customElements.get(Rt.tagName) || customElements.define(Rt.tagName, Rt);
class Ft extends l {
  constructor() {
    super(...arguments);
    a(this, "_particleCount", 40);
    a(this, "field", null);
    a(this, "fieldHost", null);
    a(this, "onMove", () => {
      this.dispatchEvent(new CustomEvent("lumina-hover", { bubbles: !0, composed: !0 }));
    });
    a(this, "onClick", () => {
      this.dispatchEvent(new CustomEvent("lumina-interact", { bubbles: !0, composed: !0, detail: { type: "click" } }));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "particle-count"];
  }
  get particleCount() {
    return this._particleCount;
  }
  set particleCount(t) {
    this._particleCount = t, this.setAttribute("particle-count", String(t)), this.rebuildField();
  }
  render() {
    return `
      <article class="lmnc" part="card">
        <div class="lmnc__particles" part="particles" aria-hidden="true"></div>
        <div class="lmnc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmnc { position: relative; display: block; border-radius: inherit; overflow: hidden; }
      .lmnc__particles { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 1; opacity: 0.5; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmnc__particles { opacity: 0.9; }
      .lmnc__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1)); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.25); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.08), var(--lumina-shadow); padding: 24px; }
      :host([variant="aura"]) .lmnc__surface { background: radial-gradient(120% 100% at 50% 0%, rgb(var(--lumina-accent-rgb) / 0.15), rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%); }
      :host([variant="void"]) .lmnc__surface { background: rgb(0 0 0 / 0.5); backdrop-filter: blur(6px); }
      @media (prefers-reduced-motion: reduce) { .lmnc__particles { opacity: 0.3; } }
    `;
  }
  mounted() {
    this._particleCount = parseInt(this.getAttribute("particle-count") ?? "40", 10) || 40, this.fieldHost = this.$$(".lmnc__particles"), p() || this.buildField(), this.addEventListener("pointermove", this.onMove), this.addEventListener("click", this.onClick);
  }
  unmounted() {
    this.field?.destroy(), this.field = null;
  }
  onConfigChange(t) {
    (t.intensity || t["accent-color"]) && this.rebuildField();
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "particle-count" && (this._particleCount = parseInt(i ?? "40", 10) || 40, this.rebuildField());
  }
  rebuildField() {
    this.field?.destroy(), this.field = null, p() || this.buildField();
  }
  buildField() {
    if (!this.fieldHost) return;
    const t = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", e = y(this.intensity);
    this.field = new k(this.shadow.host, {
      count: Math.round(this._particleCount * e),
      rgb: t,
      sizeRange: [0.6, 2],
      speedRange: [0.1, 0.4],
      lifeRange: [120, 240],
      connect: !0,
      starfield: this.variant === "void"
    }), this.field.mount(this.fieldHost);
  }
}
a(Ft, "tagName", "lumina-neural-card");
customElements.get(Ft.tagName) || customElements.define(Ft.tagName, Ft);
const mi = ["bom", "ótimo", "excelente", "feliz", "amor", "perfeito", "incrível", "sucesso", "ganhar", "vitória", "❤", "👍", "😊", "🎉", "✨", "💪", "🚀", "💯"], hi = ["ruim", "péssimo", "triste", "ódio", "erro", "falha", "perder", "problema", "droga", "👎", "😢", "💀", "🔥", "⚠", "💔", "😡"], pi = {
  positive: { color: "#22c55e", glow: "34 197 94" },
  negative: { color: "#ef4444", glow: "239 68 68" },
  neutral: { color: "var(--lumina-accent)", glow: "var(--lumina-accent-rgb)" }
};
class Dt extends l {
  constructor() {
    super(...arguments);
    a(this, "input", null);
    a(this, "reactionEl", null);
    a(this, "currentSentiment", "neutral");
    a(this, "onInput", (t) => {
      const e = t.target.value.toLowerCase();
      this.dispatchEvent(new CustomEvent("lumina-input", { bubbles: !0, composed: !0, detail: { value: e } }));
      let i = "neutral", r = "", s = 0, n = 0;
      for (const d of mi)
        e.includes(d.toLowerCase()) && s++;
      for (const d of hi)
        e.includes(d.toLowerCase()) && n++;
      if (s > n ? (i = "positive", r = "😊") : n > s ? (i = "negative", r = "😟") : e.length > 0 && (r = "✨"), i !== this.currentSentiment) {
        this.currentSentiment = i;
        const d = pi[i];
        this.style.setProperty("--lmni-color", d.color), this.style.setProperty("--lmni-glow", d.glow), this.dispatchEvent(new CustomEvent("lumina-sentiment-change", { bubbles: !0, composed: !0, detail: { sentiment: i } }));
      }
      this.reactionEl && (r ? (this.reactionEl.textContent = r, this.reactionEl.setAttribute("data-show", "")) : this.reactionEl.removeAttribute("data-show"));
    });
  }
  render() {
    return `
      <label class="lmni" part="field">
        <div class="lmni__shell" part="control">
          <div class="lmni__bg" aria-hidden="true"></div>
          <div class="lmni__glow" aria-hidden="true"></div>
          <input class="lmni__el" type="text" placeholder="Digite algo..." />
          <span class="lmni__reaction" part="reaction" aria-hidden="true"></span>
        </div>
      </label>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmni-color: var(--lumina-accent); --lmni-glow: var(--lumina-accent-rgb); }
      .lmni__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmni__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color 0.3s var(--lumina-ease-out); }
      :host(:focus-within) .lmni__bg { border-color: var(--lmni-color); }
      .lmni__glow { position: absolute; inset: -2px; border-radius: inherit; pointer-events: none; opacity: 0; background: conic-gradient(from 0deg, transparent 0%, var(--lmni-color) 25%, transparent 50%, var(--lmni-color) 75%, transparent 100%); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 2px; animation: lmni-spin 4s linear infinite; animation-play-state: paused; transition: opacity 0.3s; }
      :host(:focus-within) .lmni__glow { opacity: 0.6; animation-play-state: running; }
      .lmni__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lmni-color); transition: caret-color 0.3s; }
      .lmni__el::placeholder { color: var(--lumina-text-muted); }
      .lmni__reaction { position: relative; z-index: 1; margin-right: 12px; font-size: 18px; opacity: 0; transform: scale(0); transition: opacity 0.3s, transform 0.3s var(--lumina-ease-spring); }
      .lmni__reaction[data-show] { opacity: 1; transform: scale(1); }
      @keyframes lmni-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) { .lmni__glow { animation: none !important; } .lmni__reaction { transition: none !important; } }
    `;
  }
  mounted() {
    this.input = this.$$(".lmni__el"), this.reactionEl = this.$$(".lmni__reaction"), this.input?.addEventListener("input", this.onInput);
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
}
a(Dt, "tagName", "lumina-neural-input");
customElements.get(Dt.tagName) || customElements.define(Dt.tagName, Dt);
class Yt extends l {
  constructor() {
    super(...arguments);
    a(this, "_progress", 0);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "nodes", []);
    a(this, "raf", 0);
    a(this, "allNodes", []);
    a(this, "tick", () => {
      if (!this.ctx || !this.canvas) {
        this.raf = requestAnimationFrame(this.tick);
        return;
      }
      const t = this.canvas.clientWidth || 80;
      this.ctx.clearRect(0, 0, t, t);
      const e = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255";
      for (const r of this.nodes)
        r.x += r.vx, r.y += r.vy, (r.x < t * 0.15 || r.x > t * 0.85) && (r.vx *= -1), (r.y < t * 0.15 || r.y > t * 0.85) && (r.vy *= -1);
      const i = t * 0.35;
      for (let r = 0; r < this.nodes.length; r++)
        for (let s = r + 1; s < this.nodes.length; s++) {
          const n = this.nodes[r], d = this.nodes[s], u = n.x - d.x, m = n.y - d.y, b = Math.sqrt(u * u + m * m);
          if (b < i) {
            const x = (1 - b / i) * 0.4;
            this.ctx.strokeStyle = `rgba(${e} / ${x})`, this.ctx.lineWidth = 1, this.ctx.beginPath(), this.ctx.moveTo(n.x, n.y), this.ctx.lineTo(d.x, d.y), this.ctx.stroke();
          }
        }
      for (const r of this.nodes)
        this.ctx.fillStyle = `rgba(${e} / 0.9)`, this.ctx.beginPath(), this.ctx.arc(r.x, r.y, 3, 0, Math.PI * 2), this.ctx.fill(), this.ctx.fillStyle = `rgba(${e} / 0.3)`, this.ctx.beginPath(), this.ctx.arc(r.x, r.y, 6, 0, Math.PI * 2), this.ctx.fill();
      this.raf = requestAnimationFrame(this.tick);
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "progress"];
  }
  get progress() {
    return this._progress;
  }
  set progress(t) {
    this._progress = v(t, 0, 100), this.setAttribute("progress", String(this._progress)), this.updateNodes(), this.dispatchEvent(new CustomEvent("lumina-progress", { bubbles: !0, composed: !0, detail: { progress: this._progress } }));
  }
  render() {
    return `
      <div class="lmnl" part="loader" role="status" aria-label="Carregando">
        <canvas class="lmnl__network" part="network" aria-hidden="true"></canvas>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmnl-size: 80px; }
      .lmnl { position: relative; width: var(--lmnl-size); height: var(--lmnl-size); }
      .lmnl__network { width: 100%; height: 100%; }
      :host([variant="intense"]) { --lmnl-size: 100px; }
      :host([variant="subtle"]) { --lmnl-size: 60px; }
      @media (prefers-reduced-motion: reduce) { .lmnl__network { opacity: 0.5; } }
    `;
  }
  mounted() {
    this._progress = v(parseFloat(this.getAttribute("progress") ?? "0") || 0, 0, 100);
    const t = this.getAttribute("variant") === "intense" ? 100 : this.getAttribute("variant") === "subtle" ? 60 : 80;
    this.style.setProperty("--lmnl-size", `${t}px`), this.canvas = this.$$(".lmnl__network"), this.ctx = this.canvas?.getContext("2d") ?? null, this.initNodes(t), this.updateNodes(), p() || (this.resize(), this.raf = requestAnimationFrame(this.tick));
  }
  unmounted() {
    cancelAnimationFrame(this.raf);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "progress" && (this._progress = v(parseFloat(i ?? "0") || 0, 0, 100), this.updateNodes());
  }
  initNodes(t) {
    this.allNodes = [];
    for (let i = 0; i < 12; i++)
      this.allNodes.push({
        x: g(t * 0.2, t * 0.8),
        y: g(t * 0.2, t * 0.8),
        vx: g(-0.3, 0.3),
        vy: g(-0.3, 0.3)
      });
  }
  updateNodes() {
    const t = Math.ceil(this._progress / 100 * this.allNodes.length);
    this.nodes = this.allNodes.slice(0, Math.max(1, t));
  }
  resize() {
    if (!this.canvas || !this.ctx) return;
    const t = window.devicePixelRatio || 1, e = this.canvas.clientWidth || 80;
    this.canvas.width = e * t, this.canvas.height = e * t, this.ctx.setTransform(t, 0, 0, t, 0, 0);
  }
}
a(Yt, "tagName", "lumina-neural-loader");
customElements.get(Yt.tagName) || customElements.define(Yt.tagName, Yt);
class Xt extends l {
  constructor() {
    super(...arguments);
    a(this, "_count", 0);
    a(this, "_prevCount", 0);
    a(this, "badge", null);
    a(this, "countEl", null);
    a(this, "onClick", () => {
      this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0, detail: { count: this._count } })), this._count > 0 && (this._prevCount = this._count, this._count = 0, this.setAttribute("count", "0"), this.updateDisplay(), this.dispatchEvent(new CustomEvent("lumina-clear", { bubbles: !0, composed: !0 })));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "count"];
  }
  get count() {
    return this._count;
  }
  set count(t) {
    this._prevCount = this._count, this._count = Math.max(0, t), this.setAttribute("count", String(this._count)), this.updateDisplay(), this._count > this._prevCount && this.popAnimation();
  }
  render() {
    return `
      <span class="lmnb" part="badge">
        <slot></slot>
        <span class="lmnb__badge" aria-hidden="true">
          <span class="lmnb__count" part="count">0</span>
        </span>
      </span>
    `;
  }
  styles() {
    return `
      :host { display: inline-flex; position: relative; font-family: var(--lumina-font-sans); color: var(--lumina-text); cursor: pointer; }
      .lmnb { display: inline-flex; position: relative; }
      .lmnb__badge {
        position: absolute; top: -6px; right: -6px; min-width: 18px; height: 18px;
        padding: 0 5px; border-radius: 999px;
        background: #ff5577; color: #fff;
        font: 700 10px 'JetBrains Mono', monospace;
        display: inline-flex; align-items: center; justify-content: center;
        box-shadow: 0 0 0 2px var(--lumina-bg, #06060c), 0 0 8px rgb(255 85 119 / 0.6);
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
        z-index: 1;
      }
      .lmnb__badge[data-hidden] { transform: scale(0); opacity: 0; }
      .lmnb__badge[data-pulse] { animation: lmnb-pulse 1s ease-in-out infinite; }
      @keyframes lmnb-pulse { 0%, 100% { box-shadow: 0 0 0 2px var(--lumina-bg, #06060c), 0 0 8px rgb(255 85 119 / 0.6); } 50% { box-shadow: 0 0 0 2px var(--lumina-bg, #06060c), 0 0 16px rgb(255 85 119 / 1); } }
      .lmnb__badge[data-pop] { animation: lmnb-pop 0.4s var(--lumina-ease-spring); }
      @keyframes lmnb-pop { 0% { transform: scale(1); } 50% { transform: scale(1.5); } 100% { transform: scale(1); } }
      .lmnb__count { line-height: 1; }
      :host([variant="neural"]) .lmnb__badge { background: var(--lumina-accent); box-shadow: 0 0 0 2px var(--lumina-bg, #06060c), 0 0 12px rgb(var(--lumina-accent-rgb) / 0.7); }
      :host([variant="aura"]) .lmnb__badge { background: #ffd166; color: #1a1a2e; box-shadow: 0 0 0 2px var(--lumina-bg, #06060c), 0 0 12px rgb(255 209 102 / 0.7); }
      @media (prefers-reduced-motion: reduce) { .lmnb__badge { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    this._count = parseInt(this.getAttribute("count") ?? "0", 10) || 0, this.badge = this.$$(".lmnb__badge"), this.countEl = this.$$(".lmnb__count"), this.updateDisplay(), this.addEventListener("click", this.onClick);
  }
  unmounted() {
    this.removeEventListener("click", this.onClick);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "count" && (this._prevCount = this._count, this._count = parseInt(i ?? "0", 10) || 0, this.updateDisplay(), this._count > this._prevCount && this.popAnimation());
  }
  updateDisplay() {
    if (!this.countEl || !this.badge) return;
    const t = this._count > 99 ? "99+" : String(this._count);
    this.countEl.textContent = t, this._count === 0 ? this.badge.setAttribute("data-hidden", "") : this.badge.removeAttribute("data-hidden"), this._count > 0 ? this.badge.setAttribute("data-pulse", "") : this.badge.removeAttribute("data-pulse");
  }
  popAnimation() {
    this.badge && (this.badge.setAttribute("data-pop", ""), setTimeout(() => this.badge?.removeAttribute("data-pop"), 400));
  }
}
a(Xt, "tagName", "lumina-notification-badge");
customElements.get(Xt.tagName) || customElements.define(Xt.tagName, Xt);
class Vt extends l {
  static get observedAttributes() {
    return [...l.observedAttributes];
  }
  render() {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        padding: 8px;
        border-radius: var(--lumina-radius-pill);
      }
      .lmc__glow {
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))), transparent 60%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      .lmc__inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow { transition: none !important; }
      }
`;
  }
  mounted() {
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
  /** Dispatch a CustomEvent with composed bubbling. */
  emit(o, t) {
    this.dispatchEvent(new CustomEvent(o, { bubbles: !0, composed: !0, detail: t }));
  }
  /** For overlay-style components: open/close helpers. */
  open() {
    this.setAttribute("open", ""), this.setAttribute("data-open", ""), this.emit("lumina-open");
  }
  close() {
    this.removeAttribute("open"), this.removeAttribute("data-open"), this.emit("lumina-close");
  }
}
a(Vt, "tagName", "lumina-orbital-nav");
customElements.get(Vt.tagName) || customElements.define(Vt.tagName, Vt);
class Ht extends l {
  static get observedAttributes() {
    return [...l.observedAttributes, "page", "total"];
  }
  get page() {
    return parseFloat(this.getAttribute("page") ?? "0") || 0;
  }
  set page(o) {
    this.setAttribute("page", String(o));
  }
  get total() {
    return parseFloat(this.getAttribute("total") ?? "0") || 0;
  }
  set total(o) {
    this.setAttribute("total", String(o));
  }
  render() {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        padding: 8px;
        border-radius: var(--lumina-radius-pill);
      }
      .lmc__glow {
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))), transparent 60%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      .lmc__inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow { transition: none !important; }
      }
`;
  }
  mounted() {
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
  /** Dispatch a CustomEvent with composed bubbling. */
  emit(o, t) {
    this.dispatchEvent(new CustomEvent(o, { bubbles: !0, composed: !0, detail: t }));
  }
  /** For overlay-style components: open/close helpers. */
  open() {
    this.setAttribute("open", ""), this.setAttribute("data-open", ""), this.emit("lumina-open");
  }
  close() {
    this.removeAttribute("open"), this.removeAttribute("data-open"), this.emit("lumina-close");
  }
}
a(Ht, "tagName", "lumina-pagination");
customElements.get(Ht.tagName) || customElements.define(Ht.tagName, Ht);
class Ot extends l {
  constructor() {
    super(...arguments);
    a(this, "layerBack", null);
    a(this, "layerMid", null);
    a(this, "layerFront", null);
    a(this, "onMove", w((t) => {
      const e = this.getBoundingClientRect(), i = (t.clientX - e.left) / e.width - 0.5, r = (t.clientY - e.top) / e.height - 0.5;
      this.layerBack && (this.layerBack.style.transform = `translateX(${i * 30}px) translateY(${r * 30}px)`), this.layerMid && (this.layerMid.style.transform = `translateX(${i * 18}px) translateY(${r * 18}px)`), this.layerFront && (this.layerFront.style.transform = `translateX(${i * 8}px) translateY(${r * 8}px)`), this.dispatchEvent(new CustomEvent("lumina-parallax", { bubbles: !0, composed: !0, detail: { x: i, y: r } }));
    }, 16));
    a(this, "onLeave", () => {
      this.layerBack && (this.layerBack.style.transform = ""), this.layerMid && (this.layerMid.style.transform = ""), this.layerFront && (this.layerFront.style.transform = "");
    });
  }
  render() {
    return `
      <article class="lmpc" part="card">
        <div class="lmpc__layer lmpc__layer--back" part="layer-back" aria-hidden="true"></div>
        <div class="lmpc__layer lmpc__layer--mid" part="layer-mid" aria-hidden="true"></div>
        <div class="lmpc__layer lmpc__layer--front" part="layer-front">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); perspective: 800px; overflow: hidden; }
      .lmpc { position: relative; display: block; border-radius: inherit; transform-style: preserve-3d; min-height: 200px; overflow: hidden; }
      .lmpc__layer { position: absolute; inset: 0; border-radius: inherit; transition: transform 0.1s var(--lumina-ease-out); will-change: transform; }
      .lmpc__layer--back { background: radial-gradient(circle at 30% 30%, rgb(var(--lumina-accent-rgb) / 0.25), transparent 70%); filter: blur(15px); z-index: 0; }
      .lmpc__layer--mid { background: rgb(var(--lumina-accent-rgb) / 0.08); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.2); z-index: 1; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      .lmpc__layer--front { position: relative; z-index: 2; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; }
      :host([variant="deep"]) .lmpc__layer--back { filter: blur(25px); }
      :host([variant="deep"]) .lmpc__layer--mid { transform: translateZ(20px); }
      :host([variant="extrude"]) .lmpc__layer--back { filter: blur(30px); }
      :host([variant="extrude"]) .lmpc__layer--mid { transform: translateZ(30px); }
      :host([variant="extrude"]) .lmpc__layer--front { transform: translateZ(60px); box-shadow: 0 30px 0 -20px rgb(var(--lumina-accent-rgb) / 0.3), inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); }
      @media (prefers-reduced-motion: reduce) { .lmpc__layer { transition: none !important; transform: none !important; } }
    `;
  }
  mounted() {
    this.layerBack = this.$$(".lmpc__layer--back"), this.layerMid = this.$$(".lmpc__layer--mid"), this.layerFront = this.$$(".lmpc__layer--front"), p() || (this.addEventListener("pointermove", this.onMove), this.addEventListener("pointerleave", this.onLeave));
  }
  unmounted() {
    this.removeEventListener("pointermove", this.onMove), this.removeEventListener("pointerleave", this.onLeave);
  }
  onConfigChange(t) {
  }
}
a(Ot, "tagName", "lumina-parallax-card");
customElements.get(Ot.tagName) || customElements.define(Ot.tagName, Ot);
class Bt extends l {
  constructor() {
    super(...arguments);
    a(this, "_particleCount", 50);
    a(this, "field", null);
    a(this, "fieldHost", null);
    a(this, "burstCanvas", null);
    a(this, "burstCtx", null);
    a(this, "burstParticles", []);
    a(this, "burstRaf", 0);
    a(this, "onClick", (t) => {
      const e = this.getBoundingClientRect(), i = t.clientX - e.left, r = t.clientY - e.top;
      this.spawnBurst(i, r), this.dispatchEvent(new CustomEvent("lumina-particle-interact", { bubbles: !0, composed: !0, detail: { x: i, y: r, type: "click" } }));
    });
    a(this, "tickBurst", (t) => {
      if (this.burstCtx) {
        this.burstCtx.clearRect(0, 0, this.clientWidth, this.clientHeight), this.burstParticles = this.burstParticles.filter((e) => e.life < e.maxLife);
        for (const e of this.burstParticles) {
          e.x += e.vx, e.y += e.vy, e.vx *= 0.94, e.vy *= 0.94, e.life += 1;
          const i = 1 - e.life / e.maxLife;
          this.burstCtx.fillStyle = `rgba(${t} / ${i})`, this.burstCtx.beginPath(), this.burstCtx.arc(e.x, e.y, Math.max(0, e.size * i), 0, Math.PI * 2), this.burstCtx.fill();
        }
        this.burstParticles.length > 0 ? this.burstRaf = requestAnimationFrame(() => this.tickBurst(t)) : (this.burstRaf = 0, this.burstCtx.clearRect(0, 0, this.clientWidth, this.clientHeight));
      }
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "particle-count"];
  }
  get particleCount() {
    return this._particleCount;
  }
  set particleCount(t) {
    this._particleCount = t, this.setAttribute("particle-count", String(t)), this.rebuildField();
  }
  render() {
    return `
      <article class="lmpa" part="card">
        <div class="lmpa__particles" part="particles" aria-hidden="true"></div>
        <canvas class="lmpa__burst" aria-hidden="true"></canvas>
        <div class="lmpa__surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmpa { position: relative; display: block; border-radius: inherit; overflow: hidden; }
      .lmpa__particles { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 0; opacity: 0.6; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:hover) .lmpa__particles { opacity: 1; }
      .lmpa__burst { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
      .lmpa__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.08), var(--lumina-shadow); padding: 24px; }
      :host([variant="aura"]) .lmpa__surface { background: radial-gradient(120% 100% at 50% 0%, rgb(var(--lumina-accent-rgb) / 0.15), rgb(var(--lumina-surface) / var(--lumina-surface-alpha)) 60%); }
      :host([variant="void"]) .lmpa__surface { background: rgb(0 0 0 / 0.5); }
      @media (prefers-reduced-motion: reduce) { .lmpa__particles { opacity: 0.3; } }
    `;
  }
  mounted() {
    this._particleCount = parseInt(this.getAttribute("particle-count") ?? "50", 10) || 50, this.fieldHost = this.$$(".lmpa__particles"), this.burstCanvas = this.$$(".lmpa__burst"), this.burstCtx = this.burstCanvas?.getContext("2d") ?? null, p() || this.buildField(), this.addEventListener("click", this.onClick);
  }
  unmounted() {
    this.field?.destroy(), this.field = null, cancelAnimationFrame(this.burstRaf);
  }
  onConfigChange(t) {
    (t.intensity || t["accent-color"]) && this.rebuildField();
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "particle-count" && (this._particleCount = parseInt(i ?? "50", 10) || 50, this.rebuildField());
  }
  rebuildField() {
    this.field?.destroy(), this.field = null, p() || this.buildField();
  }
  buildField() {
    if (!this.fieldHost) return;
    const t = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", e = y(this.intensity);
    this.field = new k(this.shadow.host, {
      count: Math.round(this._particleCount * e),
      rgb: t,
      sizeRange: [0.6, 2],
      speedRange: [0.1, 0.5],
      lifeRange: [120, 240],
      connect: this.variant === "neural",
      starfield: this.variant === "void"
    }), this.field.mount(this.fieldHost);
  }
  spawnBurst(t, e) {
    if (p() || !this.burstCtx || !this.burstCanvas) return;
    const i = window.devicePixelRatio || 1, r = this.clientWidth, s = this.clientHeight;
    this.burstCanvas.width = r * i, this.burstCanvas.height = s * i, this.burstCanvas.style.width = `${r}px`, this.burstCanvas.style.height = `${s}px`, this.burstCtx.setTransform(i, 0, 0, i, 0, 0);
    const n = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", d = y(this.intensity), u = Math.round(20 * d);
    for (let m = 0; m < u; m++) {
      const b = m / u * Math.PI * 2 + Math.random() * 0.4, x = 2 + Math.random() * 4 * d;
      this.burstParticles.push({ x: t, y: e, vx: Math.cos(b) * x, vy: Math.sin(b) * x, life: 0, maxLife: 40 + Math.random() * 30, size: g(1, 2.5) });
    }
    this.burstRaf || this.tickBurst(n);
  }
}
a(Bt, "tagName", "lumina-particle-card");
customElements.get(Bt.tagName) || customElements.define(Bt.tagName, Bt);
class qt extends l {
  constructor() {
    super(...arguments);
    a(this, "_count", 60);
    a(this, "_mode", "plain");
    a(this, "field", null);
    a(this, "host", null);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "count", "mode"];
  }
  render() {
    return '<div class="lmps" part="root"><div class="lmps__bg" aria-hidden="true"></div><div class="lmps__canvas" part="canvas" aria-hidden="true"></div><div class="lmps__content"><slot></slot></div></div>';
  }
  styles() {
    return `
      :host { display: block; position: relative; font-family: var(--lumina-font-sans); color: var(--lumina-text); min-height: 200px; border-radius: var(--lumina-radius-lg); overflow: hidden; }
      .lmps { position: relative; width: 100%; height: 100%; min-height: 200px; border-radius: inherit; }
      .lmps__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); z-index: 0; }
      .lmps__canvas { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 1; }
      .lmps__content { position: relative; z-index: 2; padding: 24px; }
      :host([variant="cosmic"]) .lmps__bg { background: radial-gradient(ellipse at center, #0a0420, #000); }
      :host([variant="void"]) .lmps__bg { background: rgb(0 0 0 / 0.7); }
      @media (prefers-reduced-motion: reduce) { .lmps__canvas { opacity: 0.3; } }
    `;
  }
  mounted() {
    this._count = parseInt(this.getAttribute("count") ?? "60", 10) || 60, this._mode = this.getAttribute("mode") ?? "plain", this.host = this.$$(".lmps__canvas"), p() || this.buildField();
  }
  unmounted() {
    this.field?.destroy(), this.field = null;
  }
  onConfigChange(t) {
    (t.intensity || t["accent-color"] || t.variant) && this.rebuild();
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "count" ? (this._count = parseInt(i ?? "60", 10) || 60, this.rebuild()) : t === "mode" && (this._mode = i ?? "plain", this.rebuild());
  }
  rebuild() {
    this.field?.destroy(), this.field = null, p() || this.buildField();
  }
  buildField() {
    if (!this.host) return;
    const t = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", e = y(this.intensity);
    this.field = new k(this.shadow.host, {
      count: Math.round(this._count * e),
      rgb: t,
      sizeRange: [0.6, 2.5],
      speedRange: [0.1, 0.6],
      lifeRange: [120, 280],
      connect: this._mode === "connect",
      starfield: this._mode === "starfield"
    }), this.field.mount(this.host);
  }
  /** Public API: burst particles at position */
  burst(t, e, i = 20) {
    this.dispatchEvent(new CustomEvent("lumina-particle-burst", { bubbles: !0, composed: !0, detail: { x: t, y: e, count: i } }));
  }
}
a(qt, "tagName", "lumina-particle-system");
customElements.get(qt.tagName) || customElements.define(qt.tagName, qt);
class Kt extends l {
  constructor() {
    super(...arguments);
    a(this, "_value", "");
    a(this, "_visible", !1);
    a(this, "input", null);
    a(this, "strengthBar", null);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "particles", []);
    a(this, "raf", 0);
    a(this, "onInput", (t) => {
      this._value = t.target.value, this.updateStrength(), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { value: this._value } }));
    });
    a(this, "toggleVisibility", () => {
      this._visible = !this._visible, this.input && (this.input.type = this._visible ? "text" : "password", this.spawnRevealParticles()), this.dispatchEvent(new CustomEvent("lumina-visibility-toggle", { bubbles: !0, composed: !0, detail: { visible: this._visible } }));
    });
    a(this, "tick", (t) => {
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight), this.particles = this.particles.filter((e) => e.life < e.maxLife);
        for (const e of this.particles) {
          e.x += e.vx, e.y += e.vy, e.vy += 0.05, e.life += 1;
          const i = 1 - e.life / e.maxLife;
          this.ctx.fillStyle = `rgba(${t} / ${i})`, this.ctx.beginPath(), this.ctx.arc(e.x, e.y, 2 * i, 0, Math.PI * 2), this.ctx.fill();
        }
        this.particles.length > 0 ? this.raf = requestAnimationFrame(() => this.tick(t)) : (this.raf = 0, this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight));
      }
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "value"];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = t, this.setAttribute("value", t), this.input && (this.input.value = t), this.updateStrength();
  }
  render() {
    return `
      <label class="lmpw" part="field">
        <div class="lmpw__shell" part="control">
          <div class="lmpw__bg" aria-hidden="true"></div>
          <input class="lmpw__el" type="password" placeholder="Digite sua senha..." />
          <button class="lmpw__toggle" part="toggle" type="button" aria-label="Mostrar senha">👁</button>
        </div>
        <div class="lmpw__strength" part="strength-meter">
          <div class="lmpw__strength-bar"></div>
          <span class="lmpw__strength-label"></span>
        </div>
        <canvas class="lmpw__particles" aria-hidden="true"></canvas>
      </label>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmpw { display: flex; flex-direction: column; gap: 8px; position: relative; }
      .lmpw__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmpw__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmpw__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmpw__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); letter-spacing: 0.1em; }
      .lmpw__el::placeholder { color: var(--lumina-text-muted); letter-spacing: normal; }
      .lmpw__toggle { position: relative; z-index: 1; margin-right: 8px; appearance: none; border: 0; background: transparent; color: var(--lumina-text-muted); cursor: pointer; font-size: 16px; width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; transition: background 0.2s, transform 0.2s; }
      .lmpw__toggle:hover { background: rgb(var(--lumina-accent-rgb) / 0.15); transform: scale(1.1); }
      .lmpw__strength { display: flex; align-items: center; gap: 8px; }
      .lmpw__strength-bar { flex: 1; height: 4px; border-radius: 2px; background: rgb(var(--lumina-surface) / 0.4); overflow: hidden; position: relative; }
      .lmpw__strength-bar::after { content: ''; position: absolute; top: 0; left: 0; height: 100%; width: 0%; border-radius: inherit; transition: width 0.4s var(--lumina-ease-out), background 0.4s; }
      :host([data-strength="1"]) .lmpw__strength-bar::after { width: 25%; background: #ef4444; }
      :host([data-strength="2"]) .lmpw__strength-bar::after { width: 50%; background: #f59e0b; }
      :host([data-strength="3"]) .lmpw__strength-bar::after { width: 75%; background: #22c55e; }
      :host([data-strength="4"]) .lmpw__strength-bar::after { width: 100%; background: #22c55e; box-shadow: 0 0 12px #22c55e; }
      .lmpw__strength-label { font-size: 11px; font-weight: 600; color: var(--lumina-text-muted); min-width: 60px; text-align: right; }
      :host([data-strength="1"]) .lmpw__strength-label { color: #ef4444; }
      :host([data-strength="2"]) .lmpw__strength-label { color: #f59e0b; }
      :host([data-strength="3"]) .lmpw__strength-label { color: #22c55e; }
      :host([data-strength="4"]) .lmpw__strength-label { color: #22c55e; }
      .lmpw__particles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2; }
      :host([variant="secure"]) .lmpw__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.3); }
      @media (prefers-reduced-motion: reduce) { .lmpw__strength-bar::after { transition: none !important; } }
    `;
  }
  mounted() {
    this._value = this.getAttribute("value") ?? "", this.input = this.$$(".lmpw__el"), this.strengthBar = this.$$(".lmpw__strength-bar"), this.canvas = this.$$(".lmpw__particles"), this.ctx = this.canvas?.getContext("2d") ?? null, this.input && (this.input.value = this._value, this.input.addEventListener("input", this.onInput)), this.$$(".lmpw__toggle")?.addEventListener("click", this.toggleVisibility), this.updateStrength();
  }
  unmounted() {
    cancelAnimationFrame(this.raf);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "value" && (this._value = i ?? "", this.input && (this.input.value = this._value), this.updateStrength());
  }
  updateStrength() {
    const t = this._value;
    let e = 0;
    t.length >= 8 && e++, /[A-Z]/.test(t) && /[a-z]/.test(t) && e++, /[0-9]/.test(t) && e++, /[^A-Za-z0-9]/.test(t) && e++, this.setAttribute("data-strength", String(e));
    const i = ["", "Fraca", "Média", "Boa", "Forte"], r = this.$$(".lmpw__strength-label");
    r && (r.textContent = t.length === 0 ? "" : i[e]), this.dispatchEvent(new CustomEvent("lumina-strength-change", { bubbles: !0, composed: !0, detail: { score: e, label: i[e] } })), e === 4 && this.spawnStrengthParticles();
  }
  spawnRevealParticles() {
    if (!this.ctx || !this.canvas) return;
    const t = window.devicePixelRatio || 1, e = this.clientWidth, i = this.clientHeight;
    this.canvas.width = e * t, this.canvas.height = i * t, this.canvas.style.width = `${e}px`, this.canvas.style.height = `${i}px`, this.ctx.setTransform(t, 0, 0, t, 0, 0);
    const r = "124 92 255";
    for (let s = 0; s < 20; s++)
      this.particles.push({ x: e / 2, y: i / 2, vx: g(-2, 2), vy: g(-2, 2), life: 0, maxLife: 30 + Math.random() * 20 });
    this.raf || this.tick(r);
  }
  spawnStrengthParticles() {
    if (!this.ctx) return;
    const t = "34 197 94";
    for (let e = 0; e < 10; e++)
      this.particles.push({ x: g(0, this.clientWidth), y: this.clientHeight - 20, vx: g(-0.5, 0.5), vy: g(-2, -0.5), life: 0, maxLife: 40 });
    this.raf || this.tick(t);
  }
}
a(Kt, "tagName", "lumina-password-input");
customElements.get(Kt.tagName) || customElements.define(Kt.tagName, Kt);
class jt extends l {
  constructor() {
    super(...arguments);
    a(this, "_placement", "top");
    a(this, "_interactive", !1);
    a(this, "_open", !1);
    a(this, "pop", null);
    a(this, "onClick", (t) => {
      t.stopPropagation(), this._open ? this.hide() : this.show();
    });
    a(this, "onDocClick", (t) => {
      !this.contains(t.target) && this._open && this.hide();
    });
    a(this, "onScroll", () => {
      this._open && !this._interactive ? this.hide() : this.reposition();
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "placement", "interactive"];
  }
  get open() {
    return this._open;
  }
  render() {
    return '<span class="lmpo" part="popover"><slot></slot><div class="lmpo__pop" part="content" role="popover" aria-hidden="true"><span class="lmpo__arrow" part="arrow" aria-hidden="true"></span><slot name="content"></slot></div></span>';
  }
  styles() {
    return `
      :host { display: inline-block; position: relative; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmpo { display: inline-block; position: relative; }
      .lmpo__pop { position: absolute; z-index: 1000; min-width: 200px; max-width: 320px; padding: 14px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); opacity: 0; transform: scale(0.92); pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); }
      .lmpo__pop[data-open] { opacity: 1; transform: scale(1); pointer-events: auto; }
      .lmpo__pop[data-placement="top"] { bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%) scale(0.92); transform-origin: bottom center; }
      .lmpo__pop[data-placement="top"][data-open] { transform: translateX(-50%) scale(1); }
      .lmpo__pop[data-placement="bottom"] { top: calc(100% + 10px); left: 50%; transform: translateX(-50%) scale(0.92); transform-origin: top center; }
      .lmpo__pop[data-placement="bottom"][data-open] { transform: translateX(-50%) scale(1); }
      .lmpo__pop[data-placement="left"] { right: calc(100% + 10px); top: 50%; transform: translateY(-50%) scale(0.92); transform-origin: right center; }
      .lmpo__pop[data-placement="left"][data-open] { transform: translateY(-50%) scale(1); }
      .lmpo__pop[data-placement="right"] { left: calc(100% + 10px); top: 50%; transform: translateY(-50%) scale(0.92); transform-origin: left center; }
      .lmpo__pop[data-placement="right"][data-open] { transform: translateY(-50%) scale(1); }
      .lmpo__arrow { position: absolute; width: 10px; height: 10px; background: inherit; border: inherit; transform: rotate(45deg); z-index: -1; }
      .lmpo__pop[data-placement="top"] .lmpo__arrow { bottom: -5px; left: 50%; margin-left: -5px; border-top: none; border-left: none; }
      .lmpo__pop[data-placement="bottom"] .lmpo__arrow { top: -5px; left: 50%; margin-left: -5px; border-bottom: none; border-right: none; }
      .lmpo__pop[data-placement="left"] .lmpo__arrow { right: -5px; top: 50%; margin-top: -5px; border-left: none; border-bottom: none; }
      .lmpo__pop[data-placement="right"] .lmpo__arrow { left: -5px; top: 50%; margin-top: -5px; border-right: none; border-top: none; }
      ::slotted([slot="content"]) { font-size: 13px; line-height: 1.5; }
      @media (prefers-reduced-motion: reduce) { .lmpo__pop { transition: none !important; } }
    `;
  }
  mounted() {
    this._placement = this.getAttribute("placement") ?? "top", this._interactive = this.hasAttribute("interactive"), this.pop = this.$$(".lmpo__pop"), this.pop?.setAttribute("data-placement", this._placement), this.addEventListener("click", this.onClick), document.addEventListener("click", this.onDocClick), document.addEventListener("scroll", this.onScroll, !0);
  }
  unmounted() {
    document.removeEventListener("click", this.onDocClick), document.removeEventListener("scroll", this.onScroll, !0);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "placement" ? (this._placement = i ?? "top", this.pop?.setAttribute("data-placement", this._placement)) : t === "interactive" && (this._interactive = i !== null);
  }
  show() {
    this._open || (this._open = !0, this.pop?.setAttribute("data-open", ""), this.pop?.setAttribute("aria-hidden", "false"), this.reposition(), this.dispatchEvent(new CustomEvent("lumina-show", { bubbles: !0, composed: !0 })));
  }
  hide() {
    this._open && (this._open = !1, this.pop?.removeAttribute("data-open"), this.pop?.setAttribute("aria-hidden", "true"), this.dispatchEvent(new CustomEvent("lumina-hide", { bubbles: !0, composed: !0 })));
  }
  reposition() {
    if (!this.pop) return;
    const t = this.pop.getBoundingClientRect();
    this._placement === "top" && t.top < 8 ? (this.pop.setAttribute("data-placement", "bottom"), this._placement = "bottom") : this._placement === "bottom" && t.bottom + 8 > window.innerHeight ? (this.pop.setAttribute("data-placement", "top"), this._placement = "top") : this._placement === "left" && t.left < 8 ? (this.pop.setAttribute("data-placement", "right"), this._placement = "right") : this._placement === "right" && t.right + 8 > window.innerWidth && (this.pop.setAttribute("data-placement", "left"), this._placement = "left");
  }
}
a(jt, "tagName", "lumina-popover");
customElements.get(jt.tagName) || customElements.define(jt.tagName, jt);
class Wt extends l {
  constructor() {
    super(...arguments);
    a(this, "portal", null);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "particles", []);
    a(this, "raf", 0);
    a(this, "portalActive", !1);
    a(this, "onClick", () => {
      this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 })), this.openPortal();
    });
    a(this, "onKeydown", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.onClick());
    });
    a(this, "tick", (t, e, i) => {
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight), this.particles = this.particles.filter((r) => r.life < r.maxLife && r.radius > 2);
        for (const r of this.particles) {
          r.angle += 0.15, r.radius *= 0.96, r.life += 1, r.x = e + Math.cos(r.angle) * r.radius, r.y = i + Math.sin(r.angle) * r.radius;
          const s = 1 - r.life / r.maxLife;
          this.ctx.fillStyle = `rgba(${t} / ${s})`, this.ctx.beginPath(), this.ctx.arc(r.x, r.y, Math.max(0, r.size * s), 0, Math.PI * 2), this.ctx.fill();
        }
        this.particles.length > 0 ? this.raf = requestAnimationFrame(() => this.tick(t, e, i)) : (this.raf = 0, this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight));
      }
    });
  }
  render() {
    return `
      <button class="lmpb" part="button" type="button">
        <span class="lmpb__bg" aria-hidden="true"></span>
        <span class="lmpb__portal" part="portal" aria-hidden="true"></span>
        <canvas class="lmpb__particles" part="particles" aria-hidden="true"></canvas>
        <span class="lmpb__label"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmpb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmpb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(0 0 0 / 0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.25); z-index: 0; }
      .lmpb__portal {
        position: absolute; top: 50%; left: 50%; width: 0; height: 0;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: conic-gradient(from 0deg, transparent 0%, var(--lumina-accent) 25%, transparent 50%, var(--lumina-accent) 75%, transparent 100%);
        filter: blur(8px);
        opacity: 0;
        z-index: 1;
        pointer-events: none;
      }
      .lmpb__portal.is-active {
        animation: lmpb-portal calc(var(--lumina-speed) * 3) var(--lumina-ease-out) forwards;
      }
      @keyframes lmpb-portal {
        0%   { width: 0; height: 0; opacity: 1; transform: translate(-50%, -50%) rotate(0deg); }
        50%  { width: 80px; height: 80px; opacity: 1; transform: translate(-50%, -50%) rotate(720deg); }
        100% { width: 300px; height: 300px; opacity: 0; transform: translate(-50%, -50%) rotate(1440deg); }
      }
      .lmpb__particles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2; }
      .lmpb__label { position: relative; z-index: 3; white-space: nowrap; color: var(--lumina-accent); text-shadow: -1px 0 1px rgb(255 0 80 / 0.6), 1px 0 1px rgb(0 200 255 / 0.6); }
      :host(:hover) .lmpb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmpb__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      :host(:active) .lmpb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      @media (prefers-reduced-motion: reduce) { .lmpb__portal { animation: none !important; } }
    `;
  }
  mounted() {
    this.portal = this.$$(".lmpb__portal"), this.canvas = this.$$(".lmpb__particles"), this.ctx = this.canvas?.getContext("2d") ?? null, this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.$$(".lmpb")?.addEventListener("click", this.onClick), this.$$(".lmpb")?.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
    cancelAnimationFrame(this.raf);
  }
  onConfigChange(t) {
  }
  openPortal() {
    p() || this.portalActive || (this.portalActive = !0, this.portal?.classList.add("is-active"), this.spawnVortex(), this.dispatchEvent(new CustomEvent("lumina-portal-open", { bubbles: !0, composed: !0 })), setTimeout(() => {
      this.portal?.classList.remove("is-active"), this.portalActive = !1;
    }, 1500));
  }
  spawnVortex() {
    if (!this.ctx || !this.canvas) return;
    const t = window.devicePixelRatio || 1, e = this.clientWidth, i = this.clientHeight;
    this.canvas.width = e * t, this.canvas.height = i * t, this.canvas.style.width = `${e}px`, this.canvas.style.height = `${i}px`, this.ctx.setTransform(t, 0, 0, t, 0, 0);
    const r = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "120 240 255", s = y(this.intensity), n = Math.round(24 * s), d = e / 2, u = i / 2;
    for (let m = 0; m < n; m++)
      this.particles.push({
        x: d + Math.cos(m) * (40 + Math.random() * 60),
        y: u + Math.sin(m) * (40 + Math.random() * 60),
        angle: Math.random() * Math.PI * 2,
        radius: 40 + Math.random() * 60,
        life: 0,
        maxLife: 60 + Math.random() * 30,
        size: g(1, 2.5)
      });
    this.raf || this.tick(r, d, u);
  }
}
a(Wt, "tagName", "lumina-portal-button");
customElements.get(Wt.tagName) || customElements.define(Wt.tagName, Wt);
class Ut extends l {
  static get observedAttributes() {
    return [...l.observedAttributes];
  }
  render() {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        padding: 8px;
        border-radius: var(--lumina-radius-pill);
      }
      .lmc__glow {
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))), transparent 60%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      .lmc__inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow { transition: none !important; }
      }
`;
  }
  mounted() {
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
  /** Dispatch a CustomEvent with composed bubbling. */
  emit(o, t) {
    this.dispatchEvent(new CustomEvent(o, { bubbles: !0, composed: !0, detail: t }));
  }
  /** For overlay-style components: open/close helpers. */
  open() {
    this.setAttribute("open", ""), this.setAttribute("data-open", ""), this.emit("lumina-open");
  }
  close() {
    this.removeAttribute("open"), this.removeAttribute("data-open"), this.emit("lumina-close");
  }
}
a(Ut, "tagName", "lumina-progress-nav");
customElements.get(Ut.tagName) || customElements.define(Ut.tagName, Ut);
class Jt extends l {
  constructor() {
    super(...arguments);
    a(this, "fill", null);
    a(this, "head", null);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "trail", []);
    a(this, "raf", 0);
    a(this, "_value", 0);
    a(this, "tick", () => {
      if (!this.ctx || !this.canvas || !this.fill) {
        this.raf = requestAnimationFrame(this.tick);
        return;
      }
      const t = window.devicePixelRatio || 1, e = this.clientWidth, i = this.clientHeight;
      if ((this.canvas.width !== Math.floor(e * t) || this.canvas.height !== Math.floor(i * t)) && (this.canvas.width = Math.max(1, Math.floor(e * t)), this.canvas.height = Math.max(1, Math.floor(i * t)), this.canvas.style.width = `${e}px`, this.canvas.style.height = `${i}px`, this.ctx.setTransform(t, 0, 0, t, 0, 0)), this._value > 0 && this._value < this.max && !p()) {
        const s = this._value / this.max * e, n = y(this.intensity);
        Math.random() < 0.4 * n && this.trail.push({
          x: s,
          y: i / 2,
          vx: g(-0.3, 0.6),
          vy: g(-0.8, 0.8),
          life: 0,
          maxLife: 30 + Math.random() * 20,
          size: g(0.5, 1.6)
        });
      }
      this.ctx.clearRect(0, 0, e, i);
      const r = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255";
      this.trail = this.trail.filter((s) => s.life < s.maxLife);
      for (const s of this.trail) {
        s.x += s.vx, s.y += s.vy, s.vy += 0.02, s.life += 1;
        const n = (1 - s.life / s.maxLife) * 0.8;
        this.ctx.fillStyle = `rgba(${r} / ${n})`, this.ctx.beginPath(), this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2), this.ctx.fill();
      }
      this.raf = requestAnimationFrame(this.tick);
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "value", "max", "indeterminate"];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = Math.min(Math.max(t, 0), this.max), this.setAttribute("value", String(this._value)), this.renderValue();
  }
  get max() {
    return parseFloat(this.getAttribute("max") ?? "100") || 100;
  }
  render() {
    return `
      <div class="lumina-progress" part="root" role="progressbar"
           aria-valuemin="0" aria-valuemax="${this.max}" aria-valuenow="${this._value}">
        <div class="lumina-progress__track" part="track">
          <div class="lumina-progress__fill" part="fill">
            <div class="lumina-progress__shimmer" part="shimmer" aria-hidden="true"></div>
            <div class="lumina-progress__head" part="head" aria-hidden="true"></div>
          </div>
          <canvas class="lumina-progress__trail" part="trail" aria-hidden="true"></canvas>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-progress {
        width: 100%;
      }

      .lumina-progress__track {
        position: relative;
        height: 8px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.1));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--lumina-border);
        overflow: visible;
      }

      .lumina-progress__fill {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0%;
        border-radius: inherit;
        background: linear-gradient(90deg,
          rgb(var(--lumina-accent-rgb) / 0.7),
          var(--lumina-accent)
        );
        box-shadow:
          0 0 12px rgb(var(--lumina-accent-rgb) / 0.6),
          inset 0 1px 0 rgb(255 255 255 / 0.25);
        transition: width calc(var(--lumina-speed) * 1.5) var(--lumina-ease-out);
        overflow: hidden;
      }

      .lumina-progress__shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg,
          transparent 0%,
          rgb(255 255 255 / 0.4) 50%,
          transparent 100%
        );
        transform: translateX(-100%);
        animation: lumina-progress-shimmer 2s linear infinite;
      }

      .lumina-progress__head {
        position: absolute;
        right: -2px;
        top: 50%;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--lumina-accent);
        transform: translateY(-50%);
        box-shadow:
          0 0 12px var(--lumina-accent),
          0 0 24px rgb(var(--lumina-accent-rgb) / 0.6);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lumina-progress__fill[style*="width"]:not([style*="width: 0%"]) .lumina-progress__head {
        opacity: 1;
      }

      .lumina-progress__trail {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      /* Indeterminate mode */
      :host([indeterminate]) .lumina-progress__fill {
        width: 35% !important;
        animation: lumina-progress-indeterminate 1.6s var(--lumina-ease-in-out) infinite;
      }

      /* Variant: void */
      :host([variant="void"]) .lumina-progress__fill {
        background: linear-gradient(90deg,
          rgb(0 200 255 / 0.6),
          var(--lumina-accent)
        );
        box-shadow:
          0 0 12px var(--lumina-accent),
          -2px 0 1px rgb(255 0 80 / 0.5),
          2px 0 1px rgb(0 200 255 / 0.5);
      }

      /* Variant: morph */
      :host([variant="morph"]) .lumina-progress__fill {
        clip-path: polygon(
          0 0, 100% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%
        );
      }

      @keyframes lumina-progress-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @keyframes lumina-progress-indeterminate {
        0% { left: -35%; }
        100% { left: 100%; }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-progress__shimmer,
        .lumina-progress__fill,
        .lumina-progress__head {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }
  mounted() {
    this.fill = this.$$(".lumina-progress__fill"), this.head = this.$$(".lumina-progress__head"), this.canvas = this.$$(".lumina-progress__trail"), this.ctx = this.canvas?.getContext("2d") ?? null;
    const t = parseFloat(this.getAttribute("value") ?? "0") || 0;
    this._value = Math.min(Math.max(t, 0), this.max), this.renderValue(), p() || (this.raf = requestAnimationFrame(this.tick));
  }
  unmounted() {
    cancelAnimationFrame(this.raf);
  }
  onConfigChange(t) {
  }
  renderValue() {
    if (!this.fill) return;
    const t = this._value / this.max * 100;
    this.fill.style.width = `${t}%`, this.setAttribute("aria-valuenow", String(this._value));
    const e = this.shadow.querySelector('[role="progressbar"]');
    e && e.setAttribute("aria-valuenow", String(this._value));
  }
}
a(Jt, "tagName", "lumina-progress");
customElements.get(Jt.tagName) || customElements.define(Jt.tagName, Jt);
class Gt extends l {
  constructor() {
    super(...arguments);
    a(this, "_pulseIntensity", 0.7);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "intensity"];
  }
  get pulseIntensity() {
    return this._pulseIntensity;
  }
  set pulseIntensity(t) {
    this._pulseIntensity = v(t, 0, 1), this.setAttribute("intensity", String(this._pulseIntensity)), this.applyIntensity();
  }
  render() {
    return `
      <span class="lmpi" part="dot">
        <span class="lmpi__pulse" part="pulse" aria-hidden="true"></span>
        <span class="lmpi__pulse lmpi__pulse--2" aria-hidden="true"></span>
        <span class="lmpi__dot" aria-hidden="true"></span>
      </span>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); --lmpi-intensity: 0.7; --lmpi-speed: 2s; }
      .lmpi { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; }
      .lmpi__dot { position: relative; z-index: 2; width: 12px; height: 12px; border-radius: 50%; background: var(--lumina-accent); box-shadow: 0 0 calc(var(--lmpi-intensity) * 12px) var(--lumina-accent); }
      .lmpi__pulse { position: absolute; inset: 0; border-radius: 50%; background: var(--lumina-accent); opacity: calc(var(--lmpi-intensity) * 0.5); animation: lmpi-expand var(--lmpi-speed) var(--lumina-ease-out) infinite; }
      .lmpi__pulse--2 { animation-delay: calc(var(--lmpi-speed) * 0.5); }
      @keyframes lmpi-expand {
        0% { transform: scale(1); opacity: calc(var(--lmpi-intensity) * 0.6); }
        50% { transform: scale(2.5); opacity: calc(var(--lmpi-intensity) * 0.2); }
        100% { transform: scale(4); opacity: 0; }
      }
      :host([variant="aura"]) { --lmpi-speed: 1.8s; }
      :host([variant="aura"]) .lmpi__dot { background: #ffd166; box-shadow: 0 0 calc(var(--lmpi-intensity) * 16px) #ffd166; }
      :host([variant="aura"]) .lmpi__pulse { background: #ffd166; }
      :host([variant="subtle"]) { --lmpi-speed: 3s; }
      :host([variant="subtle"]) .lmpi__pulse { animation-timing-function: var(--lumina-ease-in-out); }
      @media (prefers-reduced-motion: reduce) { .lmpi__pulse { animation: none !important; opacity: 0; } }
    `;
  }
  mounted() {
    this._pulseIntensity = v(parseFloat(this.getAttribute("intensity") ?? "0.7") || 0.7, 0, 1), this.applyIntensity();
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "intensity" && (this._pulseIntensity = v(parseFloat(i ?? "0.7") || 0.7, 0, 1), this.applyIntensity());
  }
  applyIntensity() {
    this.style.setProperty("--lmpi-intensity", String(this._pulseIntensity));
  }
}
a(Gt, "tagName", "lumina-pulse-indicator");
customElements.get(Gt.tagName) || customElements.define(Gt.tagName, Gt);
class Zt extends l {
  constructor() {
    super(...arguments);
    a(this, "_value", "");
    a(this, "indicator", null);
    a(this, "observer", null);
    a(this, "onClick", (t) => {
      const e = t.target.closest("[data-value]");
      e && (this._value = e.getAttribute("data-value") ?? "", this.setAttribute("value", this._value), this.updateActive(), this.moveIndicator(), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { value: this._value } })));
    });
    a(this, "onKeydown", (t) => {
      const e = t.target.closest("[data-value]");
      if (!e) return;
      const i = Array.from(this.querySelectorAll("[data-value]")), r = i.indexOf(e);
      if (r === -1) return;
      let s = r;
      if (t.key === "ArrowRight" || t.key === "ArrowDown") s = (r + 1) % i.length;
      else if (t.key === "ArrowLeft" || t.key === "ArrowUp") s = (r - 1 + i.length) % i.length;
      else return;
      t.preventDefault(), i[s].focus(), this._value = i[s].getAttribute("data-value") ?? "", this.setAttribute("value", this._value), this.updateActive(), this.moveIndicator(), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { value: this._value } }));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "value"];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = t, this.setAttribute("value", t), this.moveIndicator();
  }
  render() {
    return `
      <div class="lmrg" part="group" role="radiogroup">
        <div class="lmrg__indicator" part="indicator" aria-hidden="true"></div>
        <slot></slot>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmrg { position: relative; display: inline-flex; gap: 0; padding: 4px; border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(20px) saturate(1.5); -webkit-backdrop-filter: blur(20px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.06); }
      .lmrg__indicator { position: absolute; top: 4px; left: 4px; width: 0; height: calc(100% - 8px); border-radius: var(--lumina-radius-pill); background: linear-gradient(135deg, rgb(var(--lumina-accent-rgb) / 0.9), rgb(var(--lumina-accent-rgb) / 0.6)); box-shadow: 0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.25); opacity: 0; transition: transform var(--lumina-speed) var(--lumina-ease-spring), width var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); z-index: 0; pointer-events: none; }
      .lmrg__indicator[data-active] { opacity: 1; }
      ::slotted([data-value]) { position: relative; z-index: 1; appearance: none; border: 0; background: transparent; color: var(--lumina-text-muted); font: 600 13px var(--lumina-font-sans); padding: 8px 16px; cursor: pointer; border-radius: var(--lumina-radius-pill); transition: color var(--lumina-speed) var(--lumina-ease-out); white-space: nowrap; }
      ::slotted([data-value]:hover) { color: var(--lumina-text); }
      ::slotted([data-value][data-active]) { color: #fff; }
      ::slotted([data-value]:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 2px; }
      :host([variant="segmented"]) .lmrg { border-radius: var(--lumina-radius-md); }
      :host([variant="segmented"]) ::slotted([data-value]) { flex: 1; justify-content: center; border-radius: var(--lumina-radius-sm); }
      :host([variant="neural"]) .lmrg { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host([variant="neural"]) .lmrg__indicator { box-shadow: 0 0 20px rgb(var(--lumina-accent-rgb) / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmrg__indicator { transition: none !important; } }
    `;
  }
  mounted() {
    this._value = this.getAttribute("value") ?? "", this.indicator = this.$$(".lmrg__indicator"), this.buildOptions(), this.observer = new MutationObserver(() => this.buildOptions()), this.observer.observe(this, { childList: !0, subtree: !0 }), this.addEventListener("click", this.onClick), this.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
    this.observer?.disconnect();
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "value" && (this._value = i ?? "", this.moveIndicator(), this.updateActive());
  }
  buildOptions() {
    const t = Array.from(this.querySelectorAll("[data-value]"));
    t.forEach((e) => {
      e.hasAttribute("role") || e.setAttribute("role", "radio"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "-1");
    }), !this._value && t.length > 0 && (this._value = t[0].getAttribute("data-value") ?? "", this.setAttribute("value", this._value)), this.updateActive(), requestAnimationFrame(() => this.moveIndicator());
  }
  updateActive() {
    Array.from(this.querySelectorAll("[data-value]")).forEach((e) => {
      (e.getAttribute("data-value") ?? "") === this._value ? (e.setAttribute("data-active", ""), e.setAttribute("tabindex", "0"), e.setAttribute("aria-checked", "true")) : (e.removeAttribute("data-active"), e.setAttribute("tabindex", "-1"), e.setAttribute("aria-checked", "false"));
    });
  }
  moveIndicator() {
    if (!this.indicator) return;
    const t = this.querySelector(`[data-value="${this._value}"]`);
    if (!t) {
      this.indicator.removeAttribute("data-active");
      return;
    }
    const e = this.$$(".lmrg").getBoundingClientRect(), i = t.getBoundingClientRect();
    this.indicator.style.transform = `translateX(${i.left - e.left - 4}px)`, this.indicator.style.width = `${i.width}px`, this.indicator.setAttribute("data-active", "");
  }
}
a(Zt, "tagName", "lumina-radio-group");
customElements.get(Zt.tagName) || customElements.define(Zt.tagName, Zt);
class Qt extends l {
  constructor() {
    super(...arguments);
    a(this, "_min", 0);
    a(this, "_max", 100);
    a(this, "_minVal", 25);
    a(this, "_maxVal", 75);
    a(this, "track", null);
    a(this, "fill", null);
    a(this, "thumbMin", null);
    a(this, "thumbMax", null);
    a(this, "tooltipMin", null);
    a(this, "tooltipMax", null);
    a(this, "dragging", null);
    a(this, "onPointerDown", (t) => {
      if (!this.track) return;
      const e = this.track.getBoundingClientRect(), i = (t.clientX - e.left) / e.width, r = this._min + i * (this._max - this._min), s = Math.abs(r - this._minVal), n = Math.abs(r - this._maxVal);
      this.dragging = s < n ? "min" : "max", (this.dragging === "min" ? this.thumbMin : this.thumbMax)?.setAttribute("data-dragging", ""), this.setAttribute("data-tension", ""), setTimeout(() => this.removeAttribute("data-tension"), 600), this.setValueFromPointer(t.clientX, this.dragging), t.preventDefault();
    });
    a(this, "onPointerMove", (t) => {
      this.dragging && this.setValueFromPointer(t.clientX, this.dragging);
    });
    a(this, "onPointerUp", () => {
      this.dragging && ((this.dragging === "min" ? this.thumbMin : this.thumbMax)?.removeAttribute("data-dragging"), this.dragging = null);
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "min-value", "max-value", "min", "max"];
  }
  get minValue() {
    return this._minVal;
  }
  set minValue(t) {
    this._minVal = v(t, this._min, this._maxVal), this.setAttribute("min-value", String(this._minVal)), this.updateUI();
  }
  get maxValue() {
    return this._maxVal;
  }
  set maxValue(t) {
    this._maxVal = v(t, this._minVal, this._max), this.setAttribute("max-value", String(this._maxVal)), this.updateUI();
  }
  render() {
    return `
      <div class="lmrs" part="track">
        <div class="lmrs__rail" aria-hidden="true"></div>
        <div class="lmrs__fill" part="fill" aria-hidden="true"></div>
        <div class="lmrs__thumb lmrs__thumb--min" part="thumb-min" role="slider" tabindex="0" aria-label="Mínimo">
          <div class="lmrs__tooltip" part="tooltip"></div>
        </div>
        <div class="lmrs__thumb lmrs__thumb--max" part="thumb-max" role="slider" tabindex="0" aria-label="Máximo">
          <div class="lmrs__tooltip" part="tooltip"></div>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); padding: 20px 0; }
      .lmrs { position: relative; height: 8px; cursor: pointer; touch-action: none; }
      .lmrs__rail { position: absolute; top: 50%; left: 0; right: 0; height: 8px; transform: translateY(-50%); border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.25); }
      .lmrs__fill { position: absolute; top: 50%; height: 8px; transform: translateY(-50%); border-radius: var(--lumina-radius-pill); background: linear-gradient(90deg, rgb(var(--lumina-accent-rgb) / 0.7), var(--lumina-accent)); box-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.6), inset 0 1px 0 rgb(255 255 255 / 0.25); transition: width 0.05s linear, left 0.05s linear; }
      :host([data-tension]) .lmrs__fill { animation: lmrs-tension 0.6s ease-in-out; }
      @keyframes lmrs-tension { 0%, 100% { transform: translateY(-50%) scaleY(1); } 50% { transform: translateY(-50%) scaleY(1.5); box-shadow: 0 0 24px rgb(var(--lumina-accent-rgb) / 1); } }
      .lmrs__thumb { position: absolute; top: 50%; width: 20px; height: 20px; transform: translate(-50%, -50%); border-radius: 50%; background: linear-gradient(135deg, #fff, #d8d8e8); box-shadow: 0 2px 8px rgb(0 0 0 / 0.4), 0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.15), inset 0 1px 0 rgb(255 255 255 / 0.8); cursor: grab; z-index: 2; transition: transform 0.15s var(--lumina-ease-spring); will-change: left; }
      .lmrs__thumb:hover { transform: translate(-50%, -50%) scale(1.15); }
      .lmrs__thumb[data-dragging] { cursor: grabbing; transform: translate(-50%, -50%) scale(1.3); }
      .lmrs__thumb:focus-visible { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      .lmrs__tooltip { position: absolute; bottom: calc(100% + 12px); left: 50%; transform: translateX(-50%); padding: 4px 10px; border-radius: 6px; background: rgb(var(--lumina-surface) / 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); color: var(--lumina-text); font: 600 11px 'JetBrains Mono', monospace; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmrs__thumb:hover .lmrs__tooltip, .lmrs__thumb[data-dragging] .lmrs__tooltip, .lmrs__thumb:focus-visible .lmrs__tooltip { opacity: 1; }
      :host([variant="neural"]) .lmrs__fill { animation: lmrs-pulse 2s ease-in-out infinite; }
      @keyframes lmrs-pulse { 0%, 100% { box-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.6); } 50% { box-shadow: 0 0 24px rgb(var(--lumina-accent-rgb) / 0.9); } }
      @media (prefers-reduced-motion: reduce) { .lmrs__fill, .lmrs__thumb { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this._min = parseFloat(this.getAttribute("min") ?? "0") || 0, this._max = parseFloat(this.getAttribute("max") ?? "100") || 100, this._minVal = v(parseFloat(this.getAttribute("min-value") ?? "25") || 25, this._min, this._max), this._maxVal = v(parseFloat(this.getAttribute("max-value") ?? "75") || 75, this._minVal, this._max), this.track = this.$$(".lmrs"), this.fill = this.$$(".lmrs__fill"), this.thumbMin = this.$$(".lmrs__thumb--min"), this.thumbMax = this.$$(".lmrs__thumb--max"), this.tooltipMin = this.thumbMin?.querySelector(".lmrs__tooltip") ?? null, this.tooltipMax = this.thumbMax?.querySelector(".lmrs__tooltip") ?? null, this.updateUI(), this.track?.addEventListener("pointerdown", this.onPointerDown), document.addEventListener("pointermove", this.onPointerMove), document.addEventListener("pointerup", this.onPointerUp), this.thumbMin?.addEventListener("keydown", (t) => this.onKeydown(t, "min")), this.thumbMax?.addEventListener("keydown", (t) => this.onKeydown(t, "max"));
  }
  unmounted() {
    document.removeEventListener("pointermove", this.onPointerMove), document.removeEventListener("pointerup", this.onPointerUp);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "min" ? this._min = parseFloat(i ?? "0") || 0 : t === "max" ? this._max = parseFloat(i ?? "100") || 100 : t === "min-value" ? this._minVal = v(parseFloat(i ?? "25") || 25, this._min, this._max) : t === "max-value" && (this._maxVal = v(parseFloat(i ?? "75") || 75, this._min, this._max)), this.updateUI();
  }
  updateUI() {
    if (!this.fill || !this.thumbMin || !this.thumbMax) return;
    const t = (this._minVal - this._min) / (this._max - this._min) * 100, e = (this._maxVal - this._min) / (this._max - this._min) * 100;
    this.fill.style.left = `${t}%`, this.fill.style.width = `${e - t}%`, this.thumbMin.style.left = `${t}%`, this.thumbMax.style.left = `${e}%`, this.tooltipMin && (this.tooltipMin.textContent = String(this._minVal)), this.tooltipMax && (this.tooltipMax.textContent = String(this._maxVal)), this.thumbMin.setAttribute("aria-valuenow", String(this._minVal)), this.thumbMax.setAttribute("aria-valuenow", String(this._maxVal));
  }
  setValueFromPointer(t, e) {
    if (!this.track) return;
    const i = this.track.getBoundingClientRect(), r = v((t - i.left) / i.width, 0, 1), s = this._min + r * (this._max - this._min);
    e === "min" ? this._minVal = v(Math.round(s), this._min, this._maxVal) : this._maxVal = v(Math.round(s), this._minVal, this._max), this.setAttribute("min-value", String(this._minVal)), this.setAttribute("max-value", String(this._maxVal)), this.updateUI(), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { minValue: this._minVal, maxValue: this._maxVal } }));
  }
  onKeydown(t, e) {
    const i = (this._max - this._min) / 20;
    let r = 0;
    if (t.key === "ArrowRight" || t.key === "ArrowUp") r = i;
    else if (t.key === "ArrowLeft" || t.key === "ArrowDown") r = -i;
    else return;
    t.preventDefault(), e === "min" ? this.minValue = this._minVal + r : this.maxValue = this._maxVal + r, this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { minValue: this._minVal, maxValue: this._maxVal } }));
  }
}
a(Qt, "tagName", "lumina-range-slider");
customElements.get(Qt.tagName) || customElements.define(Qt.tagName, Qt);
class te extends l {
  constructor() {
    super(...arguments);
    a(this, "_revealOnScroll", !0);
    a(this, "observer", null);
    a(this, "revealed", !1);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "reveal-on-scroll"];
  }
  get revealOnScroll() {
    return this._revealOnScroll;
  }
  set revealOnScroll(t) {
    this._revealOnScroll = t, t ? this.setAttribute("reveal-on-scroll", "") : this.removeAttribute("reveal-on-scroll");
  }
  render() {
    return `
      <article class="lmrc" part="card">
        <div class="lmrc__content" part="content">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmrc { position: relative; display: block; border-radius: inherit; }
      .lmrc__content { position: relative; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 24px; overflow: hidden; opacity: 0; transform: translateY(40px) scale(0.95); transition: opacity calc(var(--lumina-speed) * 2) var(--lumina-ease-out), transform calc(var(--lumina-speed) * 2) var(--lumina-ease-spring); }
      :host([data-revealed]) .lmrc__content { opacity: 1; transform: translateY(0) scale(1); }
      :host([reveal-on-scroll="false"]) .lmrc__content { opacity: 1; transform: none; }
      :host([variant="morph"]) .lmrc__content { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transition: clip-path calc(var(--lumina-speed) * 2) var(--lumina-ease-spring), opacity calc(var(--lumina-speed) * 2) var(--lumina-ease-out); }
      :host([variant="morph"]) .lmrc__content { clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%); }
      :host([variant="morph"][data-revealed]) .lmrc__content { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      :host([variant="neural"]) .lmrc__content { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmrc__content { transition: none !important; opacity: 1 !important; transform: none !important; } }
    `;
  }
  mounted() {
    this._revealOnScroll = this.getAttribute("reveal-on-scroll") !== "false", this._revealOnScroll && "IntersectionObserver" in window ? (this.observer = new IntersectionObserver((t) => {
      t.forEach((e) => {
        e.isIntersecting && !this.revealed && (this.revealed = !0, this.dispatchEvent(new CustomEvent("lumina-reveal-start", { bubbles: !0, composed: !0 })), requestAnimationFrame(() => {
          this.setAttribute("data-revealed", ""), setTimeout(() => this.dispatchEvent(new CustomEvent("lumina-reveal-complete", { bubbles: !0, composed: !0 })), 800);
        }), this.observer?.disconnect());
      });
    }, { threshold: 0.2 }), this.observer.observe(this)) : this.setAttribute("data-revealed", "");
  }
  unmounted() {
    this.observer?.disconnect();
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "reveal-on-scroll" && (this._revealOnScroll = i !== "false");
  }
}
a(te, "tagName", "lumina-reveal-card");
customElements.get(te.tagName) || customElements.define(te.tagName, te);
class ee extends l {
  constructor() {
    super(...arguments);
    a(this, "_rippleColor", "");
    a(this, "_rippleDuration", 600);
    a(this, "_multi", !0);
    a(this, "container", null);
    a(this, "onClick", (t) => {
      const e = this.getBoundingClientRect(), i = t.clientX - e.left, r = t.clientY - e.top;
      this.spawnRipple(i, r), this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 })), this.dispatchEvent(new CustomEvent("lumina-ripple", { bubbles: !0, composed: !0, detail: { x: i, y: r } }));
    });
    a(this, "onKeydown", (t) => {
      if (t.key === "Enter" || t.key === " ") {
        t.preventDefault();
        const e = this.getBoundingClientRect();
        this.spawnRipple(e.width / 2, e.height / 2), this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
      }
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "ripple-color", "ripple-duration", "multi"];
  }
  get rippleColor() {
    return this._rippleColor;
  }
  set rippleColor(t) {
    this._rippleColor = t, this.setAttribute("ripple-color", t);
  }
  get rippleDuration() {
    return this._rippleDuration;
  }
  set rippleDuration(t) {
    this._rippleDuration = t, this.setAttribute("ripple-duration", String(t)), this.applyDuration();
  }
  get multi() {
    return this._multi;
  }
  set multi(t) {
    this._multi = t, t ? this.setAttribute("multi", "") : this.removeAttribute("multi");
  }
  render() {
    return `
      <button class="lmrb" part="button" type="button">
        <span class="lmrb__bg" aria-hidden="true"></span>
        <span class="lmrb__ripple" part="ripple" aria-hidden="true"></span>
        <span class="lmrb__label"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmrb-duration: 600ms; }
      .lmrb {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmrb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmrb__ripple { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; border-radius: inherit; }
      .lmrb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmrb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmrb__bg { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      :host(:active) .lmrb { transform: translateY(0) scale(0.97); }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      .lmrb__ripple-dot {
        position: absolute; border-radius: 50%; pointer-events: none;
        transform: translate(-50%, -50%) scale(0);
        animation: lmrb-expand var(--lmrb-duration, 600ms) var(--lumina-ease-out) forwards;
      }
      @keyframes lmrb-expand {
        0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
        100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) { .lmrb, .lmrb__ripple-dot { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    this._rippleColor = this.getAttribute("ripple-color") ?? "", this._rippleDuration = parseInt(this.getAttribute("ripple-duration") ?? "600", 10) || 600, this._multi = this.hasAttribute("multi") || this.getAttribute("multi") === null ? !0 : this.hasAttribute("multi"), this.applyDuration(), this.container = this.$$(".lmrb__ripple"), this.setAttribute("role", "button"), this.setAttribute("tabindex", "0"), this.$$(".lmrb")?.addEventListener("click", this.onClick), this.$$(".lmrb")?.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "ripple-color" ? this._rippleColor = i ?? "" : t === "ripple-duration" ? (this._rippleDuration = parseInt(i ?? "600", 10) || 600, this.applyDuration()) : t === "multi" && (this._multi = i !== null);
  }
  applyDuration() {
    this.style.setProperty("--lmrb-duration", `${this._rippleDuration}ms`);
  }
  spawnRipple(t, e) {
    if (p() || !this.container) return;
    this._multi || (this.container.innerHTML = "");
    const i = document.createElement("span");
    i.className = "lmrb__ripple-dot", i.style.left = `${t}px`, i.style.top = `${e}px`, i.style.width = "20px", i.style.height = "20px", i.style.background = this._rippleColor || "rgb(var(--lumina-accent-rgb) / 0.4)", this.container.appendChild(i), setTimeout(() => i.remove(), this._rippleDuration + 50);
  }
}
a(ee, "tagName", "lumina-ripple-button");
customElements.get(ee.tagName) || customElements.define(ee.tagName, ee);
class ie extends l {
  constructor() {
    super(...arguments);
    a(this, "_value", "");
    a(this, "_suggestions", []);
    a(this, "_voice", !1);
    a(this, "input", null);
    a(this, "suggestionsEl", null);
    a(this, "iconEl", null);
    a(this, "onInput", (t) => {
      this._value = t.target.value, this.updateIcon(), this.filterSuggestions(), this.dispatchEvent(new CustomEvent("lumina-search", { bubbles: !0, composed: !0, detail: { value: this._value } }));
    });
    a(this, "onIconClick", () => {
      this._value && (this.value = "", this.input?.focus());
    });
    a(this, "onDocClick", (t) => {
      this.contains(t.target) || this.suggestionsEl?.removeAttribute("data-open");
    });
    a(this, "onVoiceClick", () => {
      const t = this.$$(".lms__voice");
      if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        this.dispatchEvent(new CustomEvent("lumina-voice-error", { bubbles: !0, composed: !0, detail: { message: "Speech Recognition not supported" } }));
        return;
      }
      const e = window.SpeechRecognition || window.webkitSpeechRecognition, i = new e();
      i.lang = "pt-BR", i.interimResults = !0, i.onstart = () => {
        t?.setAttribute("recording", ""), this.dispatchEvent(new CustomEvent("lumina-voice-start", { bubbles: !0, composed: !0 }));
      }, i.onresult = (r) => {
        const s = Array.from(r.results).map((n) => n[0].transcript).join("");
        this.value = s;
      }, i.onend = () => {
        t?.removeAttribute("recording"), this.dispatchEvent(new CustomEvent("lumina-voice-end", { bubbles: !0, composed: !0 }));
      }, i.start();
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "value", "suggestions", "voice"];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = t, this.setAttribute("value", t), this.input && (this.input.value = t), this.updateIcon(), this.filterSuggestions();
  }
  get suggestions() {
    return this._suggestions;
  }
  set suggestions(t) {
    this._suggestions = t, this.setAttribute("suggestions", JSON.stringify(t)), this.filterSuggestions();
  }
  get voice() {
    return this._voice;
  }
  set voice(t) {
    this._voice = t, t ? this.setAttribute("voice", "") : this.removeAttribute("voice");
  }
  render() {
    return `
      <div class="lms" part="field">
        <div class="lms__shell" part="control">
          <div class="lms__bg" aria-hidden="true"></div>
          <span class="lms__icon" part="icon" aria-hidden="true">🔍</span>
          <input class="lms__el" type="text" placeholder="Buscar..." />
          <button class="lms__voice" type="button" aria-label="Busca por voz" hidden>🎤</button>
        </div>
        <div class="lms__suggestions" part="suggestions" aria-hidden="true"></div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lms__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-pill); overflow: hidden; }
      .lms__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lms__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lms__icon { position: relative; z-index: 1; padding-left: 16px; font-size: 14px; opacity: 0.6; transition: transform var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lms__icon[data-clear] { transform: rotate(90deg); opacity: 1; cursor: pointer; }
      .lms__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 12px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); }
      .lms__el::placeholder { color: var(--lumina-text-muted); }
      .lms__voice { position: relative; z-index: 1; margin-right: 8px; appearance: none; border: 0; background: rgb(var(--lumina-accent-rgb) / 0.15); color: var(--lumina-accent); width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.2s; }
      .lms__voice:hover { transform: scale(1.1); }
      .lms__voice[recording] { animation: lms-pulse 1s ease-in-out infinite; }
      @keyframes lms-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgb(239 68 68 / 0.5); } 50% { box-shadow: 0 0 0 8px rgb(239 68 68 / 0); } }
      .lms__suggestions { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 1000; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); overflow: hidden; max-height: 0; opacity: 0; transition: max-height var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lms__suggestions[data-open] { max-height: 280px; opacity: 1; }
      .lms__suggestion { padding: 10px 16px; cursor: pointer; font-size: 14px; color: var(--lumina-text); transition: background 0.15s; animation: lms-fade-in var(--lumina-speed) var(--lumina-ease-out); }
      @keyframes lms-fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      .lms__suggestion:hover { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lms__highlight { color: var(--lumina-accent); font-weight: 700; }
      :host([variant="minimal"]) .lms__bg { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border-color: transparent; border-bottom: 1px solid var(--lumina-border); border-radius: 0; }
      :host([variant="minimal"]) .lms__shell { border-radius: 0; }
      @media (prefers-reduced-motion: reduce) { .lms__icon, .lms__suggestions, .lms__suggestion { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this._value = this.getAttribute("value") ?? "";
    const t = this.getAttribute("suggestions");
    if (t)
      try {
        this._suggestions = JSON.parse(t);
      } catch {
        this._suggestions = [];
      }
    this._voice = this.hasAttribute("voice"), this.input = this.$$(".lms__el"), this.suggestionsEl = this.$$(".lms__suggestions"), this.iconEl = this.$$(".lms__icon");
    const e = this.$$(".lms__voice");
    this._voice && e && e.removeAttribute("hidden"), this.input && (this.input.value = this._value, this.input.addEventListener("input", this.onInput)), this.iconEl?.addEventListener("click", this.onIconClick), e?.addEventListener("click", this.onVoiceClick), document.addEventListener("click", this.onDocClick), this.updateIcon();
  }
  unmounted() {
    document.removeEventListener("click", this.onDocClick);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    if (super.attributeChangedCallback(t, e, i), t === "value")
      this._value = i ?? "", this.input && (this.input.value = this._value), this.updateIcon(), this.filterSuggestions();
    else if (t === "suggestions" && i)
      try {
        this._suggestions = JSON.parse(i), this.filterSuggestions();
      } catch {
      }
    else t === "voice" && (this._voice = i !== null);
  }
  updateIcon() {
    this._value ? this.iconEl?.setAttribute("data-clear", "") : this.iconEl?.removeAttribute("data-clear"), this.iconEl && (this.iconEl.textContent = this._value ? "✕" : "🔍");
  }
  filterSuggestions() {
    if (!this.suggestionsEl) return;
    const t = this._value.toLowerCase().trim();
    if (!t) {
      this.suggestionsEl.removeAttribute("data-open"), this.suggestionsEl.innerHTML = "";
      return;
    }
    const e = this._suggestions.filter((i) => i.toLowerCase().includes(t)).slice(0, 6);
    if (e.length === 0) {
      this.suggestionsEl.removeAttribute("data-open");
      return;
    }
    this.suggestionsEl.innerHTML = e.map((i) => {
      const r = i.toLowerCase().indexOf(t), s = i.slice(0, r), n = i.slice(r, r + t.length), d = i.slice(r + t.length);
      return `<div class="lms__suggestion" data-value="${i}">${s}<span class="lms__highlight">${n}</span>${d}</div>`;
    }).join(""), this.suggestionsEl.setAttribute("data-open", ""), this.suggestionsEl.querySelectorAll(".lms__suggestion").forEach((i) => {
      i.addEventListener("click", () => {
        const r = i.getAttribute("data-value") ?? "";
        this.value = r, this.suggestionsEl?.removeAttribute("data-open"), this.dispatchEvent(new CustomEvent("lumina-suggestion-select", { bubbles: !0, composed: !0, detail: { value: r } }));
      });
    });
  }
}
a(ie, "tagName", "lumina-search-input");
customElements.get(ie.tagName) || customElements.define(ie.tagName, ie);
class ae extends l {
  constructor() {
    super(...arguments);
    a(this, "_value", "");
    a(this, "_placeholder", "Selecione...");
    a(this, "_searchable", !1);
    a(this, "_options", []);
    a(this, "trigger", null);
    a(this, "dropdown", null);
    a(this, "searchInput", null);
    a(this, "optionsContainer", null);
    a(this, "_open", !1);
    a(this, "highlightIdx", -1);
    a(this, "filteredOptions", []);
    a(this, "onTriggerClick", (t) => {
      t.stopPropagation(), this._open ? this.close() : this.open();
    });
    a(this, "onDocClick", (t) => {
      !this.contains(t.target) && this._open && this.close();
    });
    a(this, "onSearchInput", () => {
      if (!this.searchInput) return;
      const t = this.searchInput.value.toLowerCase().trim();
      this.filteredOptions = this._options.filter(
        (e) => e.label.toLowerCase().includes(t) || e.value.toLowerCase().includes(t)
      ), this.highlightIdx = -1, this.renderOptions();
    });
    a(this, "onKeydown", (t) => {
      if (!this._open && (t.key === "Enter" || t.key === " " || t.key === "ArrowDown")) {
        t.preventDefault(), this.open();
        return;
      }
      this._open && (t.key === "Escape" ? (t.preventDefault(), this.close(), this.trigger?.focus()) : t.key === "ArrowDown" ? (t.preventDefault(), this.highlightIdx = Math.min(this.highlightIdx + 1, this.filteredOptions.length - 1), this.updateHighlight()) : t.key === "ArrowUp" ? (t.preventDefault(), this.highlightIdx = Math.max(this.highlightIdx - 1, 0), this.updateHighlight()) : t.key === "Enter" ? (t.preventDefault(), this.highlightIdx >= 0 && this.filteredOptions[this.highlightIdx] && this.selectOption(this.filteredOptions[this.highlightIdx])) : t.key === "Tab" && this.close());
    });
  }
  static get observedAttributes() {
    return [
      ...l.observedAttributes,
      "value",
      "placeholder",
      "searchable",
      "options"
    ];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = t, this.setAttribute("value", t), this.updateTrigger();
  }
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(t) {
    this._placeholder = t, this.setAttribute("placeholder", t), this.updateTrigger();
  }
  get searchable() {
    return this._searchable;
  }
  set searchable(t) {
    this._searchable = t, t ? this.setAttribute("searchable", "") : this.removeAttribute("searchable"), this.applySearchable();
  }
  get options() {
    return this._options;
  }
  set options(t) {
    this._options = t, this.setAttribute("options", JSON.stringify(t)), this.filteredOptions = [...t], this.renderOptions(), this.updateTrigger();
  }
  render() {
    return `
      <div class="lmsl" part="trigger">
        <div class="lmsl__bg" aria-hidden="true"></div>
        <div class="lmsl__glow" part="glow" aria-hidden="true"></div>
        <span class="lmsl__value" part="value"></span>
        <span class="lmsl__placeholder" part="placeholder"></span>
        <span class="lmsl__chevron" aria-hidden="true">▾</span>
        <div class="lmsl__dropdown" part="dropdown" role="listbox" aria-hidden="true">
          <div class="lmsl__search-wrap" part="search">
            <input class="lmsl__search" type="text" placeholder="Buscar..." aria-label="Buscar opções" />
          </div>
          <div class="lmsl__options" part="options"></div>
          <div class="lmsl__empty" aria-hidden="true">Nenhuma opção encontrada</div>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host {
        display: inline-block;
        position: relative;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        min-width: 200px;
      }

      .lmsl {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        padding-right: 36px;
        border-radius: var(--lumina-radius-md);
        cursor: pointer;
        user-select: none;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmsl:hover { transform: translateY(-1px); }

      .lmsl__bg {
        position: absolute; inset: 0;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(12px) saturate(1.3);
        -webkit-backdrop-filter: blur(12px) saturate(1.3);
        border: 1px solid var(--lumina-border);
        box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.08), var(--lumina-shadow);
        transition: border-color var(--lumina-speed) var(--lumina-ease-out);
      }
      :host([data-open]) .lmsl__bg {
        border-color: rgb(var(--lumina-accent-rgb) / 0.5);
      }

      .lmsl__glow {
        position: absolute; inset: -2px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        background: conic-gradient(from 0deg,
          transparent 0%, var(--lumina-accent) 25%,
          transparent 50%, var(--lumina-accent) 75%, transparent 100%);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        padding: 2px;
        animation: lmsl-spin 4s linear infinite;
        animation-play-state: paused;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host([data-open]) .lmsl__glow { opacity: 0.7; animation-play-state: running; }

      .lmsl__value, .lmsl__placeholder {
        position: relative; z-index: 1;
        flex: 1;
        font-size: 14px;
      }
      .lmsl__placeholder { color: var(--lumina-text-muted); }
      .lmsl__value { display: none; }
      :host([data-has-value]) .lmsl__value { display: block; }
      :host([data-has-value]) .lmsl__placeholder { display: none; }

      .lmsl__chevron {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        color: var(--lumina-text-muted);
        z-index: 1;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([data-open]) .lmsl__chevron { transform: translateY(-50%) rotate(180deg); }

      .lmsl__dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        z-index: 1000;
        min-width: 100%;
        max-height: 280px;
        display: flex;
        flex-direction: column;
        padding: 6px;
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15));
        backdrop-filter: blur(20px) saturate(1.6);
        -webkit-backdrop-filter: blur(20px) saturate(1.6);
        border: 1px solid var(--lumina-border);
        box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5);
        opacity: 0;
        transform: scale(0.92) translateY(-8px);
        transform-origin: top center;
        pointer-events: none;
        transition:
          opacity var(--lumina-speed) var(--lumina-ease-out),
          transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([data-open]) .lmsl__dropdown {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: auto;
      }
      :host([data-flip-up]) .lmsl__dropdown {
        top: auto;
        bottom: calc(100% + 8px);
        transform-origin: bottom center;
        transform: scale(0.92) translateY(8px);
      }
      :host([data-flip-up][data-open]) .lmsl__dropdown {
        transform: scale(1) translateY(0);
      }

      .lmsl__search-wrap {
        display: none;
        padding: 4px 4px 8px;
        border-bottom: 1px solid var(--lumina-border);
        margin-bottom: 4px;
      }
      :host([searchable]) .lmsl__search-wrap { display: block; }
      .lmsl__search {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--lumina-border);
        border-radius: 8px;
        background: rgb(255 255 255 / 0.04);
        color: var(--lumina-text);
        font: 500 13px var(--lumina-font-sans);
        outline: none;
      }
      .lmsl__search:focus {
        border-color: rgb(var(--lumina-accent-rgb) / 0.5);
      }
      .lmsl__search::placeholder { color: var(--lumina-text-muted); }

      .lmsl__options {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .lmsl__option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        color: var(--lumina-text);
        transition: background 0.15s, color 0.15s;
      }
      .lmsl__option:hover,
      .lmsl__option[data-highlighted] {
        background: rgb(var(--lumina-accent-rgb) / 0.15);
      }
      .lmsl__option[data-selected] {
        background: rgb(var(--lumina-accent-rgb) / 0.3);
        color: #fff;
        font-weight: 600;
      }
      .lmsl__option-icon {
        font-size: 16px;
      }
      .lmsl__option-icon:empty { display: none; }

      .lmsl__empty {
        padding: 12px;
        text-align: center;
        font-size: 13px;
        color: var(--lumina-text-muted);
        display: none;
      }
      .lmsl__empty[data-show] { display: block; }

      /* Variant: neural */
      :host([variant="neural"]) .lmsl__bg {
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }

      @keyframes lmsl-spin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        .lmsl, .lmsl__bg, .lmsl__glow, .lmsl__chevron, .lmsl__dropdown {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
  }
  mounted() {
    this.trigger = this.$$(".lmsl"), this.dropdown = this.$$(".lmsl__dropdown"), this.searchInput = this.$$(".lmsl__search"), this.optionsContainer = this.$$(".lmsl__options"), this._placeholder = this.getAttribute("placeholder") ?? "Selecione...", this._value = this.getAttribute("value") ?? "", this._searchable = this.hasAttribute("searchable");
    const t = this.getAttribute("options");
    if (t)
      try {
        this._options = JSON.parse(t);
      } catch {
        this._options = [];
      }
    this.filteredOptions = [...this._options], this.applySearchable(), this.renderOptions(), this.updateTrigger(), this.trigger?.addEventListener("click", this.onTriggerClick), this.searchInput?.addEventListener("input", this.onSearchInput), document.addEventListener("click", this.onDocClick), document.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
    this.trigger?.removeEventListener("click", this.onTriggerClick), this.searchInput?.removeEventListener("input", this.onSearchInput), document.removeEventListener("click", this.onDocClick), document.removeEventListener("keydown", this.onKeydown);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    if (super.attributeChangedCallback(t, e, i), t === "value")
      this._value = i ?? "", this.updateTrigger();
    else if (t === "placeholder")
      this._placeholder = i ?? "Selecione...", this.updateTrigger();
    else if (t === "searchable")
      this._searchable = i !== null, this.applySearchable();
    else if (t === "options" && i)
      try {
        this._options = JSON.parse(i), this.filteredOptions = [...this._options], this.renderOptions(), this.updateTrigger();
      } catch {
        this._options = [];
      }
  }
  applySearchable() {
    this._searchable && !this.hasAttribute("searchable") ? this.setAttribute("searchable", "") : !this._searchable && this.hasAttribute("searchable") && this.removeAttribute("searchable");
  }
  updateTrigger() {
    const t = this.$$(".lmsl__placeholder"), e = this.$$(".lmsl__value");
    t && (t.textContent = this._placeholder);
    const i = this._options.find((r) => r.value === this._value);
    i ? (e && (e.textContent = (i.icon ?? "") + " " + i.label), this.setAttribute("data-has-value", "")) : this.removeAttribute("data-has-value");
  }
  renderOptions() {
    if (!this.optionsContainer) return;
    this.optionsContainer.innerHTML = "", this.filteredOptions.forEach((e, i) => {
      const r = document.createElement("div");
      r.className = "lmsl__option", r.setAttribute("role", "option"), r.setAttribute("data-value", e.value), r.setAttribute("data-idx", String(i)), e.value === this._value && r.setAttribute("data-selected", "");
      const s = document.createElement("span");
      s.className = "lmsl__option-icon", s.textContent = e.icon ?? "", r.appendChild(s);
      const n = document.createElement("span");
      n.textContent = e.label, r.appendChild(n), r.addEventListener("click", () => this.selectOption(e)), r.addEventListener("mouseenter", () => {
        this.highlightIdx = i, this.updateHighlight();
      }), this.optionsContainer.appendChild(r);
    });
    const t = this.$$(".lmsl__empty");
    t && (this.filteredOptions.length === 0 ? t.setAttribute("data-show", "") : t.removeAttribute("data-show"));
  }
  selectOption(t) {
    this._value = t.value, this.setAttribute("value", t.value), this.updateTrigger(), this.renderOptions(), this.close(), this.dispatchEvent(
      new CustomEvent("lumina-change", {
        bubbles: !0,
        composed: !0,
        detail: { value: t.value, label: t.label }
      })
    );
  }
  updateHighlight() {
    this.optionsContainer?.querySelectorAll(".lmsl__option").forEach((t) => {
      const e = parseInt(t.getAttribute("data-idx") ?? "-1", 10);
      t.toggleAttribute("data-highlighted", e === this.highlightIdx), e === this.highlightIdx && t.scrollIntoView({ block: "nearest" });
    });
  }
  /** Open the dropdown with smart positioning (flip if no space below). */
  open() {
    this._open || (this._open = !0, this.setAttribute("data-open", ""), this.dropdown?.setAttribute("aria-hidden", "false"), this.checkFlip(), this.dispatchEvent(new CustomEvent("lumina-open", { bubbles: !0, composed: !0 })), setTimeout(() => {
      this._searchable && this.searchInput?.focus();
    }, 80));
  }
  close() {
    this._open && (this._open = !1, this.removeAttribute("data-open"), this.removeAttribute("data-flip-up"), this.dropdown?.setAttribute("aria-hidden", "true"), this.searchInput && (this.searchInput.value = ""), this.filteredOptions = [...this._options], this.renderOptions(), this.dispatchEvent(new CustomEvent("lumina-close", { bubbles: !0, composed: !0 })));
  }
  /** Check if dropdown would overflow viewport bottom; if so, flip up. */
  checkFlip() {
    if (!this.trigger || p()) return;
    const t = this.trigger.getBoundingClientRect();
    window.innerHeight - t.bottom < 320 && t.top > 320 ? this.setAttribute("data-flip-up", "") : this.removeAttribute("data-flip-up");
  }
}
a(ae, "tagName", "lumina-select");
customElements.get(ae.tagName) || customElements.define(ae.tagName, ae);
class re extends l {
  static get observedAttributes() {
    return [...l.observedAttributes, "collapsed"];
  }
  get collapsed() {
    return this.hasAttribute("collapsed");
  }
  set collapsed(o) {
    o ? this.setAttribute("collapsed", "") : this.removeAttribute("collapsed");
  }
  render() {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        padding: 8px;
        border-radius: var(--lumina-radius-pill);
      }
      .lmc__glow {
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))), transparent 60%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      .lmc__inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow { transition: none !important; }
      }
`;
  }
  mounted() {
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
  /** Dispatch a CustomEvent with composed bubbling. */
  emit(o, t) {
    this.dispatchEvent(new CustomEvent(o, { bubbles: !0, composed: !0, detail: t }));
  }
  /** For overlay-style components: open/close helpers. */
  open() {
    this.setAttribute("open", ""), this.setAttribute("data-open", ""), this.emit("lumina-open");
  }
  close() {
    this.removeAttribute("open"), this.removeAttribute("data-open"), this.emit("lumina-close");
  }
}
a(re, "tagName", "lumina-sidebar");
customElements.get(re.tagName) || customElements.define(re.tagName, re);
class se extends l {
  constructor() {
    super(...arguments);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "drawing", !1);
    a(this, "lastX", 0);
    a(this, "lastY", 0);
    a(this, "points", []);
    a(this, "inkDrops", []);
    a(this, "rafId", 0);
    a(this, "onPointerDown", (t) => {
      this.drawing = !0;
      const e = this.getPos(t);
      this.lastX = e.x, this.lastY = e.y, this.points = [{ x: e.x, y: e.y, p: t.pressure || 0.5 }], this.dispatchEvent(new CustomEvent("lumina-signature-start", { bubbles: !0, composed: !0 }));
    });
    a(this, "onPointerMove", (t) => {
      if (!this.drawing || !this.ctx) return;
      const e = this.getPos(t);
      if (this.points.push({ x: e.x, y: e.y, p: t.pressure || 0.5 }), this.points.length >= 3) {
        const i = this.points[this.points.length - 3], r = this.points[this.points.length - 2], s = this.points[this.points.length - 1], n = (i.x + r.x) / 2, d = (i.y + r.y) / 2, u = (r.x + s.x) / 2, m = (r.y + s.y) / 2, b = Math.max(1, 2 + (t.pressure || 0.5) * 2);
        this.ctx.strokeStyle = this.shadow.host.style.getPropertyValue("--lumina-accent").trim() || "#7c5cff", this.ctx.lineWidth = b, this.ctx.lineCap = "round", this.ctx.lineJoin = "round", this.ctx.beginPath(), this.ctx.moveTo(n, d), this.ctx.quadraticCurveTo(r.x, r.y, u, m), this.ctx.stroke();
      }
      Math.random() < 0.05 && this.inkDrops.push({ x: e.x + (Math.random() - 0.5) * 4, y: e.y + (Math.random() - 0.5) * 4, radius: 0, life: 0 }), this.lastX = e.x, this.lastY = e.y;
    });
    a(this, "onPointerUp", () => {
      this.drawing && (this.drawing = !1, this.dispatchEvent(new CustomEvent("lumina-signature-end", { bubbles: !0, composed: !0 })));
    });
    a(this, "rafLoop", () => {
      if (this.ctx && this.canvas) {
        const t = this.shadow.host.style.getPropertyValue("--lumina-accent").trim() || "#7c5cff";
        this.inkDrops = this.inkDrops.filter((e) => e.life < 20);
        for (const e of this.inkDrops) {
          e.life += 1, e.radius += 0.3;
          const i = (1 - e.life / 20) * 0.3;
          this.ctx.fillStyle = t, this.ctx.globalAlpha = i, this.ctx.beginPath(), this.ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2), this.ctx.fill(), this.ctx.globalAlpha = 1;
        }
      }
      this.rafId = requestAnimationFrame(this.rafLoop);
    });
    a(this, "clear", () => {
      this.ctx && this.canvas && this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height), this.inkDrops = [], this.points = [];
    });
    a(this, "exportPNG", () => {
      if (!this.canvas) return;
      const t = document.createElement("a");
      t.download = "signature.png", t.href = this.canvas.toDataURL(), t.click();
    });
  }
  render() {
    return `
      <div class="lmsp" part="canvas">
        <canvas class="lmsp__canvas"></canvas>
        <div class="lmsp__toolbar" part="toolbar">
          <button class="lmsp__clear" type="button" aria-label="Limpar">🗑 Limpar</button>
          <button class="lmsp__export" type="button" aria-label="Exportar PNG">⬇ PNG</button>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmsp { position: relative; border-radius: var(--lumina-radius-lg); overflow: hidden; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); }
      .lmsp__canvas { display: block; width: 100%; height: 200px; cursor: crosshair; touch-action: none; }
      .lmsp__toolbar { display: flex; gap: 8px; padding: 8px 12px; border-top: 1px solid var(--lumina-border); background: rgb(var(--lumina-surface) / 0.3); }
      .lmsp__clear, .lmsp__export { appearance: none; border: 1px solid var(--lumina-border); background: rgb(var(--lumina-accent-rgb) / 0.1); color: var(--lumina-text); padding: 6px 12px; border-radius: 6px; cursor: pointer; font: 600 12px var(--lumina-font-sans); transition: background 0.2s; }
      .lmsp__clear:hover, .lmsp__export:hover { background: rgb(var(--lumina-accent-rgb) / 0.3); }
      :host([variant="minimal"]) .lmsp { border: 0; background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; }
      :host([variant="minimal"]) .lmsp__toolbar { background: transparent; border: 0; }
    `;
  }
  mounted() {
    this.canvas = this.$$(".lmsp__canvas"), this.ctx = this.canvas?.getContext("2d") ?? null, this.resizeCanvas(), this.canvas?.addEventListener("pointerdown", this.onPointerDown), this.canvas?.addEventListener("pointermove", this.onPointerMove), this.canvas?.addEventListener("pointerup", this.onPointerUp), this.canvas?.addEventListener("pointerleave", this.onPointerUp), this.$$(".lmsp__clear")?.addEventListener("click", this.clear), this.$$(".lmsp__export")?.addEventListener("click", this.exportPNG), window.addEventListener("resize", () => this.resizeCanvas()), p() || (this.rafId = requestAnimationFrame(this.rafLoop));
  }
  unmounted() {
    cancelAnimationFrame(this.rafId);
  }
  onConfigChange(t) {
  }
  resizeCanvas() {
    if (!this.canvas || !this.ctx) return;
    const t = window.devicePixelRatio || 1, e = this.canvas.clientWidth, i = this.canvas.clientHeight;
    this.canvas.width = e * t, this.canvas.height = i * t, this.ctx.setTransform(t, 0, 0, t, 0, 0);
  }
  getPos(t) {
    if (!this.canvas) return { x: 0, y: 0 };
    const e = this.canvas.getBoundingClientRect();
    return { x: t.clientX - e.left, y: t.clientY - e.top };
  }
}
a(se, "tagName", "lumina-signature-pad");
customElements.get(se.tagName) || customElements.define(se.tagName, se);
class ne extends l {
  constructor() {
    super(...arguments);
    a(this, "_shape", "text");
    a(this, "_width", "");
    a(this, "_height", "");
    a(this, "_count", 1);
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "shape", "width", "height", "count"];
  }
  render() {
    return '<div class="lmsk-wrap" part="skeleton"></div>';
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); }
      .lmsk-wrap { display: flex; flex-direction: column; gap: 8px; }
      .lmsk {
        position: relative; overflow: hidden;
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05));
        border: 1px solid var(--lumina-border);
        border-radius: var(--lumina-radius-sm);
      }
      .lmsk::after {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(90deg, transparent 0%, rgb(var(--lumina-accent-rgb) / 0.15) 40%, rgb(var(--lumina-accent-rgb) / 0.3) 50%, rgb(var(--lumina-accent-rgb) / 0.15) 60%, transparent 100%);
        background-size: 200% 100%;
        animation: lmsk-shimmer 2s ease-in-out infinite;
      }
      @keyframes lmsk-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .lmsk--text { height: 14px; width: 100%; border-radius: 4px; }
      .lmsk--text:nth-child(even) { width: 80%; }
      .lmsk--circle { border-radius: 50%; width: 48px; height: 48px; flex-shrink: 0; }
      .lmsk--rectangle { border-radius: var(--lumina-radius-md); width: 100%; height: 120px; }
      .lmsk--card { border-radius: var(--lumina-radius-lg); width: 100%; height: 200px; }
      .lmsk--card .lmsk-card-line { height: 12px; margin: 12px; border-radius: 4px; background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05)); position: relative; overflow: hidden; }
      .lmsk--card .lmsk-card-line::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgb(var(--lumina-accent-rgb) / 0.15) 50%, transparent); background-size: 200% 100%; animation: lmsk-shimmer 2s ease-in-out infinite; }
      :host([variant="wave"]) .lmsk::after { animation: lmsk-wave 1.8s ease-in-out infinite; background: linear-gradient(90deg, transparent, rgb(var(--lumina-accent-rgb) / 0.2), transparent); background-size: 200% 100%; }
      @keyframes lmsk-wave { 0% { background-position: -200% 0; transform: skewX(-12deg); } 100% { background-position: 200% 0; transform: skewX(-12deg); } }
      :host([variant="neural"]) .lmsk { border-color: rgb(var(--lumina-accent-rgb) / 0.2); }
      :host([variant="neural"]) .lmsk::after { background: radial-gradient(circle at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.2), transparent 70%); animation: lmsk-neural-pulse 2s ease-in-out infinite; }
      @keyframes lmsk-neural-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
      @media (prefers-reduced-motion: reduce) { .lmsk::after, .lmsk-card-line::after { animation: none !important; } }
    `;
  }
  mounted() {
    this._shape = this.getAttribute("shape") ?? "text", this._width = this.getAttribute("width") ?? "", this._height = this.getAttribute("height") ?? "", this._count = parseInt(this.getAttribute("count") ?? "1", 10) || 1, this.renderSkeletons();
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "shape" ? this._shape = i ?? "text" : t === "width" ? this._width = i ?? "" : t === "height" ? this._height = i ?? "" : t === "count" && (this._count = parseInt(i ?? "1", 10) || 1), this.renderSkeletons();
  }
  renderSkeletons() {
    const t = this.$$(".lmsk-wrap");
    if (t) {
      t.innerHTML = "";
      for (let e = 0; e < this._count; e++) {
        const i = document.createElement("div");
        i.className = `lmsk lmsk--${this._shape}`, i.setAttribute("part", "skeleton"), i.style.animationDelay = `${e * 0.15}s`, this._width && (i.style.width = this._width), this._height && (i.style.height = this._height), this._shape === "card" && (i.innerHTML = '<div class="lmsk-card-line" style="width:60%;margin-top:16px"></div><div class="lmsk-card-line" style="width:90%"></div><div class="lmsk-card-line" style="width:75%"></div>'), t.appendChild(i);
      }
    }
  }
}
a(ne, "tagName", "lumina-skeleton");
customElements.get(ne.tagName) || customElements.define(ne.tagName, ne);
class oe extends l {
  constructor() {
    super(...arguments);
    a(this, "_value", 50);
    a(this, "_min", 0);
    a(this, "_max", 100);
    a(this, "_step", 1);
    a(this, "_marks", []);
    a(this, "track", null);
    a(this, "fill", null);
    a(this, "thumb", null);
    a(this, "tooltip", null);
    a(this, "marksContainer", null);
    a(this, "dragging", !1);
    a(this, "onPointerDown", (t) => {
      this.dragging = !0, this.thumb?.setAttribute("data-dragging", ""), this.setValueFromPointer(t.clientX), t.preventDefault();
    });
    a(this, "onPointerMove", (t) => {
      this.dragging && this.setValueFromPointer(t.clientX);
    });
    a(this, "onPointerUp", () => {
      this.dragging && (this.dragging = !1, this.thumb?.removeAttribute("data-dragging"), this.dispatchEvent(
        new CustomEvent("lumina-change", {
          bubbles: !0,
          composed: !0,
          detail: { value: this._value }
        })
      ));
    });
    a(this, "onKeydown", (t) => {
      let e = 0;
      if (t.key === "ArrowRight" || t.key === "ArrowUp") e = this._step;
      else if (t.key === "ArrowLeft" || t.key === "ArrowDown") e = -this._step;
      else if (t.key === "PageUp") e = this._step * 10;
      else if (t.key === "PageDown") e = -this._step * 10;
      else if (t.key === "Home") {
        this.value = this._min, t.preventDefault();
        return;
      } else if (t.key === "End") {
        this.value = this._max, t.preventDefault();
        return;
      } else return;
      t.preventDefault(), this.value = this._value + e, this.dispatchEvent(
        new CustomEvent("lumina-input", {
          bubbles: !0,
          composed: !0,
          detail: { value: this._value }
        })
      );
    });
  }
  static get observedAttributes() {
    return [
      ...l.observedAttributes,
      "value",
      "min",
      "max",
      "step",
      "marks"
    ];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = v(t, this._min, this._max), this.setAttribute("value", String(this._value)), this.updateUI();
  }
  get min() {
    return this._min;
  }
  set min(t) {
    this._min = t, this.setAttribute("min", String(t)), this.updateUI();
  }
  get max() {
    return this._max;
  }
  set max(t) {
    this._max = t, this.setAttribute("max", String(t)), this.updateUI();
  }
  get step() {
    return this._step;
  }
  set step(t) {
    this._step = t, this.setAttribute("step", String(t));
  }
  get marks() {
    return this._marks;
  }
  set marks(t) {
    this._marks = t, this.setAttribute("marks", JSON.stringify(t)), this.renderMarks();
  }
  render() {
    return `
      <div class="lms" part="track">
        <div class="lms__rail" aria-hidden="true"></div>
        <div class="lms__fill" part="fill" aria-hidden="true"></div>
        <div class="lms__marks" aria-hidden="true"></div>
        <div class="lms__thumb" part="thumb" role="slider"
          tabindex="0"
          aria-valuemin="${this._min}"
          aria-valuemax="${this._max}"
          aria-valuenow="${this._value}">
          <div class="lms__tooltip" part="tooltip" aria-hidden="true"></div>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        width: 100%;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        padding: 16px 0;
      }

      .lms {
        position: relative;
        height: 8px;
        cursor: pointer;
        touch-action: none;
      }

      .lms__rail {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 8px;
        transform: translateY(-50%);
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--lumina-border);
        box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.25);
      }

      .lms__fill {
        position: absolute;
        top: 50%;
        left: 0;
        height: 8px;
        width: 50%;
        transform: translateY(-50%);
        border-radius: var(--lumina-radius-pill);
        background: linear-gradient(90deg,
          rgb(var(--lumina-accent-rgb) / 0.7),
          var(--lumina-accent)
        );
        box-shadow:
          0 0 12px rgb(var(--lumina-accent-rgb) / 0.6),
          inset 0 1px 0 rgb(255 255 255 / 0.25);
        transition: width 0.05s linear;
        pointer-events: none;
      }

      .lms__thumb {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: linear-gradient(135deg, #ffffff, #d8d8e8);
        box-shadow:
          0 2px 8px rgb(0 0 0 / 0.4),
          0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.15),
          inset 0 1px 0 rgb(255 255 255 / 0.8);
        cursor: grab;
        z-index: 2;
        transition:
          transform 0.15s var(--lumina-ease-spring),
          box-shadow var(--lumina-speed) var(--lumina-ease-out);
        will-change: left;
      }
      .lms__thumb:hover {
        transform: translate(-50%, -50%) scale(1.15);
        box-shadow:
          0 4px 14px rgb(0 0 0 / 0.5),
          0 0 0 6px rgb(var(--lumina-accent-rgb) / 0.2),
          inset 0 1px 0 rgb(255 255 255 / 0.8);
      }
      .lms__thumb:active,
      .lms__thumb[data-dragging] {
        cursor: grabbing;
        transform: translate(-50%, -50%) scale(1.3);
      }
      .lms__thumb:focus-visible {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 4px;
      }

      .lms__tooltip {
        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 10px;
        border-radius: 6px;
        background: rgb(var(--lumina-surface) / 0.95);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--lumina-border);
        color: var(--lumina-text);
        font: 600 11px 'JetBrains Mono', monospace;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
        box-shadow: 0 4px 12px rgb(0 0 0 / 0.3);
      }
      .lms__tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: var(--lumina-border);
      }
      .lms__thumb:hover .lms__tooltip,
      .lms__thumb[data-dragging] .lms__tooltip,
      .lms__thumb:focus-visible .lms__tooltip {
        opacity: 1;
      }

      .lms__marks {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 8px;
        transform: translateY(-50%);
        pointer-events: none;
      }
      .lms__mark {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgb(var(--lumina-accent-rgb) / 0.4);
      }
      .lms__mark[data-active] {
        background: var(--lumina-accent);
        box-shadow: 0 0 6px var(--lumina-accent);
      }
      .lms__mark-label {
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        font-size: 10px;
        color: var(--lumina-text-muted);
        font-family: 'JetBrains Mono', monospace;
        white-space: nowrap;
      }

      /* Variant: neural — pulsing fill */
      :host([variant="neural"]) .lms__fill {
        animation: lms-pulse 2s ease-in-out infinite;
      }
      @keyframes lms-pulse {
        0%, 100% { box-shadow: 0 0 12px rgb(var(--lumina-accent-rgb) / 0.6); }
        50%      { box-shadow: 0 0 24px rgb(var(--lumina-accent-rgb) / 0.9); }
      }

      /* Variant: aura — floating thumb */
      :host([variant="aura"]) .lms__thumb {
        animation: lms-float 3s ease-in-out infinite;
      }
      @keyframes lms-float {
        0%, 100% { transform: translate(-50%, -50%); }
        50%      { transform: translate(-50%, calc(-50% - 1px)); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lms__fill, .lms__thumb, .lms__tooltip { transition: none !important; animation: none !important; }
      }
    `;
  }
  mounted() {
    this.track = this.$$(".lms"), this.fill = this.$$(".lms__fill"), this.thumb = this.$$(".lms__thumb"), this.tooltip = this.$$(".lms__tooltip"), this.marksContainer = this.$$(".lms__marks"), this._min = parseFloat(this.getAttribute("min") ?? "0") || 0, this._max = parseFloat(this.getAttribute("max") ?? "100") || 100, this._step = parseFloat(this.getAttribute("step") ?? "1") || 1, this._value = v(
      parseFloat(this.getAttribute("value") ?? "50") || 50,
      this._min,
      this._max
    );
    const t = this.getAttribute("marks");
    if (t)
      try {
        this._marks = JSON.parse(t);
      } catch {
        this._marks = [];
      }
    this.renderMarks(), requestAnimationFrame(() => this.updateUI()), "ResizeObserver" in window && new ResizeObserver(() => this.updateUI()).observe(this), this.track?.addEventListener("pointerdown", this.onPointerDown), document.addEventListener("pointermove", this.onPointerMove), document.addEventListener("pointerup", this.onPointerUp), this.thumb?.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
    this.track?.removeEventListener("pointerdown", this.onPointerDown), document.removeEventListener("pointermove", this.onPointerMove), document.removeEventListener("pointerup", this.onPointerUp), this.thumb?.removeEventListener("keydown", this.onKeydown);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    if (super.attributeChangedCallback(t, e, i), t === "value" && i !== null)
      this._value = v(parseFloat(i) || 0, this._min, this._max), this.updateUI();
    else if (t === "min")
      this._min = parseFloat(i ?? "0") || 0, this.updateUI();
    else if (t === "max")
      this._max = parseFloat(i ?? "100") || 100, this.updateUI();
    else if (t === "step")
      this._step = parseFloat(i ?? "1") || 1;
    else if (t === "marks" && i)
      try {
        this._marks = JSON.parse(i), this.renderMarks();
      } catch {
        this._marks = [];
      }
  }
  updateUI() {
    if (!this.fill || !this.thumb || !this.tooltip) return;
    const t = (this._value - this._min) / (this._max - this._min) * 100;
    this.fill.style.width = `${t}%`, this.thumb.style.left = `${t}%`, this.tooltip.textContent = String(this._value), this.thumb.setAttribute("aria-valuenow", String(this._value)), this.marksContainer?.querySelectorAll(".lms__mark").forEach((e) => {
      const i = parseFloat(e.getAttribute("data-value") ?? "");
      e.toggleAttribute("data-active", i === this._value);
    });
  }
  renderMarks() {
    if (this.marksContainer) {
      this.marksContainer.innerHTML = "";
      for (const t of this._marks) {
        const e = (t.value - this._min) / (this._max - this._min) * 100, i = document.createElement("div");
        if (i.className = "lms__mark", i.style.left = `${e}%`, i.setAttribute("data-value", String(t.value)), this.marksContainer.appendChild(i), t.label) {
          const r = document.createElement("div");
          r.className = "lms__mark-label", r.style.left = `${e}%`, r.textContent = t.label, this.marksContainer.appendChild(r);
        }
      }
    }
  }
  setValueFromPointer(t) {
    if (!this.track) return;
    const e = this.track.getBoundingClientRect(), i = v((t - e.left) / e.width, 0, 1), r = this._min + i * (this._max - this._min), s = Math.round(r / this._step) * this._step, n = v(s, this._min, this._max);
    n !== this._value && (this._value = n, this.setAttribute("value", String(this._value)), this.updateUI(), this.dispatchEvent(
      new CustomEvent("lumina-input", {
        bubbles: !0,
        composed: !0,
        detail: { value: this._value }
      })
    ));
  }
}
a(oe, "tagName", "lumina-slider");
customElements.get(oe.tagName) || customElements.define(oe.tagName, oe);
class le extends l {
  constructor() {
    super(...arguments);
    a(this, "_size", 40);
    a(this, "_spinSpeed", 1);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "raf", 0);
    a(this, "particles", []);
    a(this, "time", 0);
    a(this, "tick", () => {
      if (!this.ctx) {
        this.raf = requestAnimationFrame(this.tick);
        return;
      }
      const t = this._size, e = this._size, i = t / 2, r = e / 2;
      this.ctx.clearRect(0, 0, t, e), this.time += 0.016 * this._spinSpeed;
      const s = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", n = 0.3 + 0.4 * Math.sin(this.time * 2);
      for (const d of this.particles) {
        d.angle += d.speed * this._spinSpeed, i + Math.cos(d.angle) * d.radius, r + Math.sin(d.angle) * d.radius;
        const u = 5;
        for (let m = 0; m < u; m++) {
          const b = d.angle - m * 0.05 * this._spinSpeed, x = i + Math.cos(b) * d.radius, _ = r + Math.sin(b) * d.radius, A = (1 - m / u) * n;
          this.ctx.fillStyle = `rgba(${s} / ${A})`, this.ctx.beginPath(), this.ctx.arc(x, _, Math.max(0, d.size * (1 - m / u)), 0, Math.PI * 2), this.ctx.fill();
        }
      }
      this.raf = requestAnimationFrame(this.tick);
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "size", "speed"];
  }
  render() {
    return `
      <div class="lmsp" part="spinner" role="status" aria-label="Carregando">
        <div class="lmsp__ring" aria-hidden="true"></div>
        <canvas class="lmsp__particles" part="particles" aria-hidden="true"></canvas>
        <div class="lmsp__core" aria-hidden="true"></div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmsp-size: 40px; }
      .lmsp { position: relative; width: var(--lmsp-size); height: var(--lmsp-size); display: inline-flex; align-items: center; justify-content: center; }
      .lmsp__ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid transparent; border-top-color: var(--lumina-accent); border-right-color: rgb(var(--lumina-accent-rgb) / 0.3); animation: lmsp-spin 1s linear infinite; }
      @keyframes lmsp-spin { to { transform: rotate(360deg); } }
      .lmsp__core { width: 20%; height: 20%; border-radius: 50%; background: var(--lumina-accent); box-shadow: 0 0 12px var(--lumina-accent), 0 0 24px rgb(var(--lumina-accent-rgb) / 0.5); animation: lmsp-pulse 1s ease-in-out infinite; }
      @keyframes lmsp-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.7; } }
      .lmsp__particles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      :host([variant="aura"]) .lmsp__ring { border-top-color: #ffd166; border-right-color: rgb(255 209 102 / 0.3); animation-duration: 1.5s; }
      :host([variant="aura"]) .lmsp__core { background: #ffd166; box-shadow: 0 0 12px #ffd166, 0 0 32px rgb(255 209 102 / 0.5); }
      :host([variant="glass"]) .lmsp__ring { border-top-color: rgb(255 255 255 / 0.6); border-right-color: rgb(255 255 255 / 0.15); }
      @media (prefers-reduced-motion: reduce) { .lmsp__ring, .lmsp__core { animation: none !important; } }
    `;
  }
  mounted() {
    this._size = parseInt(this.getAttribute("size") ?? "40", 10) || 40, this._spinSpeed = parseFloat(this.getAttribute("speed") ?? "1") || 1, this.style.setProperty("--lmsp-size", `${this._size}px`), this.canvas = this.$$(".lmsp__particles"), this.ctx = this.canvas?.getContext("2d") ?? null;
    for (let t = 0; t < 6; t++)
      this.particles.push({
        angle: t / 6 * Math.PI * 2,
        radius: this._size * 0.35,
        speed: 0.03 + Math.random() * 0.02,
        size: 1.5 + Math.random() * 1
      });
    p() || (this.resize(), this.raf = requestAnimationFrame(this.tick));
  }
  unmounted() {
    cancelAnimationFrame(this.raf);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "size" ? (this._size = parseInt(i ?? "40", 10) || 40, this.style.setProperty("--lmsp-size", `${this._size}px`), this.particles.forEach((r) => r.radius = this._size * 0.35)) : t === "speed" && (this._spinSpeed = parseFloat(i ?? "1") || 1);
  }
  resize() {
    if (!this.canvas || !this.ctx) return;
    const t = window.devicePixelRatio || 1;
    this.canvas.width = this._size * t, this.canvas.height = this._size * t, this.canvas.style.width = `${this._size}px`, this.canvas.style.height = `${this._size}px`, this.ctx.setTransform(t, 0, 0, t, 0, 0);
  }
}
a(le, "tagName", "lumina-spinner");
customElements.get(le.tagName) || customElements.define(le.tagName, le);
class ce extends l {
  constructor() {
    super(...arguments);
    a(this, "_menuItems", []);
    a(this, "_disabled", !1);
    a(this, "_open", !1);
    a(this, "menu", null);
    a(this, "onDocClick", (t) => {
      !this.contains(t.target) && this._open && this.closeMenu();
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "menu-items", "disabled"];
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(t) {
    this._disabled = t, t ? this.setAttribute("disabled", "") : this.removeAttribute("disabled");
  }
  get menuItems() {
    return this._menuItems;
  }
  set menuItems(t) {
    this._menuItems = t, this.renderMenu();
  }
  render() {
    return `
      <div class="lmsb" part="button">
        <button class="lmsb__primary" part="trigger" type="button">
          <span class="lmsb__bg" aria-hidden="true"></span>
          <span class="lmsb__label"><slot></slot></span>
        </button>
        <button class="lmsb__chevron" part="trigger" type="button" aria-label="Abrir menu">
          <span class="lmsb__bg" aria-hidden="true"></span>
          <span class="lmsb__chevron-icon">▾</span>
        </button>
        <div class="lmsb__menu" part="menu" role="menu" aria-hidden="true"></div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; position: relative; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      :host([disabled]) { opacity: 0.5; pointer-events: none; }
      .lmsb { position: relative; display: inline-flex; border-radius: var(--lumina-radius-pill); overflow: visible; isolation: isolate; }
      .lmsb__primary, .lmsb__chevron {
        position: relative; border: 0; background: transparent; color: inherit; cursor: pointer;
        font: 600 14px var(--lumina-font-sans); display: inline-flex; align-items: center; gap: 6px;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmsb__primary { padding: 0 22px; height: 44px; border-radius: var(--lumina-radius-pill) 0 0 var(--lumina-radius-pill); }
      .lmsb__chevron { padding: 0 12px; height: 44px; border-radius: 0 var(--lumina-radius-pill) var(--lumina-radius-pill) 0; border-left: 1px solid var(--lumina-border); }
      .lmsb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out); }
      .lmsb__primary .lmsb__bg { border-right: 0; }
      .lmsb__label, .lmsb__chevron-icon { position: relative; z-index: 1; }
      .lmsb__primary:hover .lmsb__bg, .lmsb__chevron:hover .lmsb__bg { background: rgb(var(--lumina-accent-rgb) / 0.2); }
      :host(:hover) .lmsb__primary { transform: translateY(-1px); }
      .lmsb__chevron[data-open] .lmsb__chevron-icon { transform: rotate(180deg); }
      .lmsb__chevron-icon { transition: transform var(--lumina-speed) var(--lumina-ease-spring); }
      .lmsb__menu {
        position: absolute; top: calc(100% + 8px); right: 0; min-width: 200px; z-index: 1000;
        padding: 6px; border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15));
        backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6);
        border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5);
        opacity: 0; transform: scale(0.92) translateY(-8px); transform-origin: top right; pointer-events: none;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([data-open]) .lmsb__menu { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
      .lmsb__menu-item {
        display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px;
        cursor: pointer; font-size: 14px; color: var(--lumina-text); transition: background 0.15s;
      }
      .lmsb__menu-item:hover { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lmsb__menu-item[disabled] { opacity: 0.4; pointer-events: none; }
      .lmsb__menu-item-icon { font-size: 16px; }
      @media (prefers-reduced-motion: reduce) { .lmsb__menu, .lmsb__primary, .lmsb__chevron-icon { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this._disabled = this.hasAttribute("disabled"), this.menu = this.$$(".lmsb__menu");
    const t = this.getAttribute("menu-items");
    if (t)
      try {
        this._menuItems = JSON.parse(t);
      } catch {
        this._menuItems = [];
      }
    this.renderMenu(), this.$$(".lmsb__primary")?.addEventListener("click", (e) => {
      if (this._disabled) {
        e.preventDefault();
        return;
      }
      this.dispatchEvent(new CustomEvent("lumina-click", { bubbles: !0, composed: !0 }));
    }), this.$$(".lmsb__chevron")?.addEventListener("click", (e) => {
      e.stopPropagation(), this._open ? this.closeMenu() : this.openMenu();
    }), document.addEventListener("click", this.onDocClick);
  }
  unmounted() {
    document.removeEventListener("click", this.onDocClick);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    if (super.attributeChangedCallback(t, e, i), t === "menu-items" && i)
      try {
        this._menuItems = JSON.parse(i), this.renderMenu();
      } catch {
      }
    else t === "disabled" && (this._disabled = i !== null);
  }
  renderMenu() {
    this.menu && (this.menu.innerHTML = "", this._menuItems.forEach((t) => {
      const e = document.createElement("div");
      if (e.className = "lmsb__menu-item", e.setAttribute("part", "menu-item"), e.setAttribute("role", "menuitem"), t.disabled && e.setAttribute("disabled", ""), t.icon) {
        const r = document.createElement("span");
        r.className = "lmsb__menu-item-icon", r.textContent = t.icon, e.appendChild(r);
      }
      const i = document.createElement("span");
      i.textContent = t.label, e.appendChild(i), e.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("lumina-menu-select", { bubbles: !0, composed: !0, detail: { value: t.value ?? t.label, label: t.label } })), this.closeMenu();
      }), this.menu.appendChild(e);
    }));
  }
  openMenu() {
    this._open || (this._open = !0, this.setAttribute("data-open", ""), this.$$(".lmsb__chevron")?.setAttribute("data-open", ""), this.dispatchEvent(new CustomEvent("lumina-menu-open", { bubbles: !0, composed: !0 })));
  }
  closeMenu() {
    this._open && (this._open = !1, this.removeAttribute("data-open"), this.$$(".lmsb__chevron")?.removeAttribute("data-open"), this.dispatchEvent(new CustomEvent("lumina-menu-close", { bubbles: !0, composed: !0 })));
  }
}
a(ce, "tagName", "lumina-split-button");
customElements.get(ce.tagName) || customElements.define(ce.tagName, ce);
class de extends l {
  constructor() {
    super(...arguments);
    a(this, "_count", 3);
    a(this, "_interactive", !0);
    a(this, "cards", []);
    a(this, "currentIndex", 0);
    a(this, "dragStartX", 0);
    a(this, "dragCurrentX", 0);
    a(this, "dragging", !1);
    a(this, "onPointerMove", (t) => {
      if (!this.dragging) return;
      this.dragCurrentX = t.clientX;
      const e = this.dragCurrentX - this.dragStartX, i = this.cards[0]?.el;
      if (i) {
        const r = this.cards[0].rotation + e * 0.05;
        i.style.transform = `translateX(${e}px) rotate(${r}deg)`, i.style.opacity = String(Math.max(0.3, 1 - Math.abs(e) / 300));
      }
    });
    a(this, "onPointerUp", () => {
      if (!this.dragging) return;
      this.dragging = !1, document.removeEventListener("pointermove", this.onPointerMove), document.removeEventListener("pointerup", this.onPointerUp);
      const t = this.dragCurrentX - this.dragStartX;
      Math.abs(t) > 100 ? this.swipeCard(t > 0 ? "right" : "left") : this.resetCard();
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "count", "interactive"];
  }
  get count() {
    return this._count;
  }
  set count(t) {
    this._count = t, this.setAttribute("count", String(t)), this.buildStack();
  }
  get interactive() {
    return this._interactive;
  }
  set interactive(t) {
    this._interactive = t, t ? this.setAttribute("interactive", "") : this.removeAttribute("interactive");
  }
  render() {
    return `
      <div class="lmsc" part="stack">
        <div class="lmsc__cards" data-cards></div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; width: 300px; height: 200px; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmsc { position: relative; width: 100%; height: 100%; }
      .lmsc__cards { position: relative; width: 100%; height: 100%; }
      .lmsc__card { position: absolute; inset: 0; border-radius: var(--lumina-radius-lg); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px; cursor: grab; user-select: none; transition: transform var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); will-change: transform; touch-action: pan-y; }
      .lmsc__card[data-dragging] { transition: none; cursor: grabbing; }
      .lmsc__card[data-active] { border-color: rgb(var(--lumina-accent-rgb) / 0.5); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 30px rgb(var(--lumina-accent-rgb) / 0.3), var(--lumina-shadow); }
      .lmsc__card-title { font-size: 18px; font-weight: 700; }
      .lmsc__card-sub { font-size: 12px; color: var(--lumina-text-muted); }
      :host([variant="neural"]) .lmsc__card { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host([variant="minimal"]) .lmsc__card { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; box-shadow: var(--lumina-shadow); }
      @media (prefers-reduced-motion: reduce) { .lmsc__card { transition: none !important; } }
    `;
  }
  mounted() {
    this._count = parseInt(this.getAttribute("count") ?? "3", 10) || 3, this._interactive = this.getAttribute("interactive") !== "false", this.buildStack();
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "count" ? (this._count = parseInt(i ?? "3", 10) || 3, this.buildStack()) : t === "interactive" && (this._interactive = i !== "false");
  }
  buildStack() {
    const t = this.$$(".lmsc__cards");
    if (!t) return;
    t.innerHTML = "", this.cards = [];
    const e = Array.from(this.children).filter((r) => !r.hasAttribute("slot")), i = e.length > 0 ? e.slice(0, this._count) : [];
    Math.max(this._count, i.length);
    for (let r = 0; r < this._count; r++) {
      const s = document.createElement("div");
      s.className = "lmsc__card", s.setAttribute("part", "card"), s.setAttribute("data-index", String(r));
      const n = (Math.random() - 0.5) * 8;
      if (i[r])
        s.innerHTML = i[r].innerHTML;
      else {
        const u = document.createElement("div");
        u.className = "lmsc__card-title", u.textContent = `Card ${r + 1}`;
        const m = document.createElement("div");
        m.className = "lmsc__card-sub", m.textContent = `Stack item ${r + 1} de ${this._count}`, s.appendChild(u), s.appendChild(m);
      }
      const d = (this._count - 1 - r) * 8;
      s.style.transform = `translateY(${d}px) scale(${1 - (this._count - 1 - r) * 0.04}) rotate(${n}deg)`, s.style.zIndex = String(this._count - r), r === 0 && s.setAttribute("data-active", ""), this.cards.push({ el: s, rotation: n }), t.appendChild(s), this._interactive && s.addEventListener("pointerdown", (u) => this.onPointerDown(u, r));
    }
    this.currentIndex = 0;
  }
  onPointerDown(t, e) {
    if (e !== 0 || p()) return;
    this.dragging = !0, this.dragStartX = t.clientX, this.dragCurrentX = t.clientX;
    const i = this.cards[0]?.el;
    i && i.setAttribute("data-dragging", ""), document.addEventListener("pointermove", this.onPointerMove), document.addEventListener("pointerup", this.onPointerUp);
  }
  swipeCard(t) {
    const e = this.cards[0]?.el;
    if (!e) return;
    const i = t === "right" ? 400 : -400;
    e.style.transform = `translateX(${i}px) rotate(${this.cards[0].rotation + 20}deg)`, e.style.opacity = "0", setTimeout(() => {
      const r = this.cards.shift();
      r.el.style.transition = "none", r.el.style.transform = `translateY(${(this._count - 1) * 8}px) scale(${1 - (this._count - 1) * 0.04}) rotate(${r.rotation}deg)`, r.el.style.opacity = "0", this.cards.push(r), this.$$(".lmsc__cards")?.appendChild(r.el), requestAnimationFrame(() => {
        this.cards.forEach((n, d) => {
          n.el.style.transition = "";
          const u = d * 8;
          n.el.style.transform = `translateY(${u}px) scale(${1 - d * 0.04}) rotate(${n.rotation}deg)`, n.el.style.opacity = "1", n.el.style.zIndex = String(this._count - d), n.el.removeAttribute("data-dragging"), d === 0 ? n.el.setAttribute("data-active", "") : n.el.removeAttribute("data-active");
        });
      }), this.dispatchEvent(new CustomEvent("lumina-card-select", { bubbles: !0, composed: !0, detail: { index: 0, direction: t } })), this.dispatchEvent(new CustomEvent("lumina-stack-change", { bubbles: !0, composed: !0, detail: { remaining: this.cards.length } }));
    }, 300);
  }
  resetCard() {
    const t = this.cards[0]?.el;
    t && (t.style.transform = `translateY(0) scale(1) rotate(${this.cards[0].rotation}deg)`, t.style.opacity = "1", t.removeAttribute("data-dragging"));
  }
}
a(de, "tagName", "lumina-stack-card");
customElements.get(de.tagName) || customElements.define(de.tagName, de);
const qe = {
  online: "#22c55e",
  offline: "#6b7280",
  busy: "#ef4444",
  away: "#f59e0b",
  neural: "var(--lumina-accent)"
};
class ue extends l {
  constructor() {
    super(...arguments);
    a(this, "_status", "online");
    a(this, "_tooltip", "");
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "status", "tooltip"];
  }
  get status() {
    return this._status;
  }
  set status(t) {
    this._status = t, this.setAttribute("status", t), this.applyStatus();
  }
  render() {
    return `
      <span class="lmsi" part="dot" data-status="online">
        <span class="lmsi__dot" aria-hidden="true"></span>
        <span class="lmsi__pulse" part="pulse" aria-hidden="true"></span>
        <span class="lmsi__tooltip" aria-hidden="true"></span>
        <span class="lmsi__label" part="label"><slot></slot></span>
      </span>
    `;
  }
  styles() {
    return `
      :host { display: inline-flex; align-items: center; gap: 8px; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; cursor: default; }
      .lmsi { display: inline-flex; align-items: center; gap: 8px; position: relative; }
      .lmsi__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--lmsi-color, #22c55e); box-shadow: 0 0 8px var(--lmsi-color, #22c55e); flex-shrink: 0; transition: background 0.3s; }
      .lmsi__pulse { position: absolute; left: 5px; width: 10px; height: 10px; border-radius: 50%; background: var(--lmsi-color, #22c55e); transform: translateX(-50%); opacity: 0; pointer-events: none; }
      [data-status="online"] .lmsi__dot { animation: lmsi-online-pulse 2s ease-in-out infinite; }
      [data-status="online"] .lmsi__pulse { animation: lmsi-online-ring 2s ease-out infinite; }
      @keyframes lmsi-online-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      @keyframes lmsi-online-ring { 0% { transform: translateX(-50%) scale(1); opacity: 0.6; } 100% { transform: translateX(-50%) scale(3); opacity: 0; } }
      [data-status="busy"] .lmsi__dot { animation: lmsi-busy-pulse 0.6s ease-in-out infinite; }
      [data-status="busy"] .lmsi__pulse { animation: lmsi-busy-ring 0.6s ease-out infinite; }
      @keyframes lmsi-busy-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.7); } }
      @keyframes lmsi-busy-ring { 0% { transform: translateX(-50%) scale(1); opacity: 0.4; } 100% { transform: translateX(-50%) scale(2.5); opacity: 0; } }
      [data-status="offline"] .lmsi__dot { opacity: 0.4; animation: lmsi-offline-fade 3s ease-in-out infinite; }
      @keyframes lmsi-offline-fade { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.15; } }
      [data-status="away"] .lmsi__dot { animation: lmsi-away-blink 1.5s ease-in-out infinite; }
      @keyframes lmsi-away-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      .lmsi__tooltip { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); padding: 4px 10px; border-radius: 6px; background: rgb(var(--lumina-surface) / 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); color: var(--lumina-text); font-size: 11px; font-weight: 600; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 100; }
      .lmsi:hover .lmsi__tooltip { opacity: 1; }
      .lmsi__label { font-size: 13px; font-weight: 500; }
      .lmsi__label:empty { display: none; }
      @media (prefers-reduced-motion: reduce) { .lmsi__dot, .lmsi__pulse { animation: none !important; } }
    `;
  }
  mounted() {
    this._status = this.getAttribute("status") ?? "online", this._tooltip = this.getAttribute("tooltip") ?? "", this.applyStatus();
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "status" ? (this._status = i ?? "online", this.applyStatus(), this.dispatchEvent(new CustomEvent("lumina-status-change", { bubbles: !0, composed: !0, detail: { status: this._status } }))) : t === "tooltip" && (this._tooltip = i ?? "", this.applyTooltip());
  }
  applyStatus() {
    const t = this.$$(".lmsi");
    t && t.setAttribute("data-status", this._status);
    const e = qe[this._status] ?? qe.online;
    this.style.setProperty("--lmsi-color", e), this.applyTooltip();
  }
  applyTooltip() {
    const t = this.$$(".lmsi__tooltip");
    t && (t.textContent = this._tooltip || this._status.charAt(0).toUpperCase() + this._status.slice(1));
  }
}
a(ue, "tagName", "lumina-status-indicator");
customElements.get(ue.tagName) || customElements.define(ue.tagName, ue);
class me extends l {
  static get observedAttributes() {
    return [...l.observedAttributes, "current", "total"];
  }
  get current() {
    return parseFloat(this.getAttribute("current") ?? "0") || 0;
  }
  set current(o) {
    this.setAttribute("current", String(o));
  }
  get total() {
    return parseFloat(this.getAttribute("total") ?? "0") || 0;
  }
  set total(o) {
    this.setAttribute("total", String(o));
  }
  render() {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        padding: 8px;
        border-radius: var(--lumina-radius-pill);
      }
      .lmc__glow {
        position: absolute; inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(240px circle at var(--lx, 50%) 50%,
          rgb(var(--lumina-accent-rgb) / calc(0.18 * var(--lumina-intensity))), transparent 60%);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      .lmc__inner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow { transition: none !important; }
      }
`;
  }
  mounted() {
  }
  unmounted() {
  }
  onConfigChange(o) {
  }
  /** Dispatch a CustomEvent with composed bubbling. */
  emit(o, t) {
    this.dispatchEvent(new CustomEvent(o, { bubbles: !0, composed: !0, detail: t }));
  }
  /** For overlay-style components: open/close helpers. */
  open() {
    this.setAttribute("open", ""), this.setAttribute("data-open", ""), this.emit("lumina-open");
  }
  close() {
    this.removeAttribute("open"), this.removeAttribute("data-open"), this.emit("lumina-close");
  }
}
a(me, "tagName", "lumina-step-indicator");
customElements.get(me.tagName) || customElements.define(me.tagName, me);
class he extends l {
  constructor() {
    super(...arguments);
    a(this, "_checked", !1);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "particles", []);
    a(this, "raf", 0);
    a(this, "button", null);
    a(this, "onClick", () => {
      this._checked = !this._checked, this._checked ? this.setAttribute("checked", "") : this.removeAttribute("checked"), this.setAttribute("aria-checked", String(this._checked)), this._checked && !p() && this.burst(), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { checked: this._checked } }));
    });
    a(this, "tick", (t) => {
      if (this.ctx) {
        this.ctx.clearRect(0, 0, 24, 24), this.particles = this.particles.filter((e) => e.life < e.maxLife);
        for (const e of this.particles) {
          e.x += e.vx, e.y += e.vy, e.vx *= 0.92, e.vy *= 0.92, e.life += 1;
          const i = 1 - e.life / e.maxLife;
          this.ctx.fillStyle = `rgba(${t} / ${i})`, this.ctx.beginPath(), this.ctx.arc(e.x, e.y, Math.max(0, e.size * i), 0, Math.PI * 2), this.ctx.fill();
        }
        this.particles.length > 0 ? this.raf = requestAnimationFrame(() => this.tick(t)) : (this.raf = 0, this.ctx.clearRect(0, 0, 24, 24));
      }
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "checked"];
  }
  get checked() {
    return this._checked;
  }
  set checked(t) {
    this._checked = t, t ? this.setAttribute("checked", "") : this.removeAttribute("checked");
  }
  render() {
    return `
      <button class="lmsw" part="track" type="button" role="switch" aria-checked="false">
        <span class="lmsw__aura" part="glow" aria-hidden="true"></span>
        <span class="lmsw__track">
          <span class="lmsw__glow" aria-hidden="true"></span>
          <span class="lmsw__thumb" part="thumb">
            <canvas class="lmsw__particles" part="particles" aria-hidden="true"></canvas>
          </span>
        </span>
        <span class="lmsw__label"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-flex; align-items: center; gap: 12px; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmsw { position: relative; appearance: none; border: 0; background: transparent; padding: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 12px; outline: none; font: inherit; color: inherit; }
      .lmsw:focus-visible .lmsw__track { box-shadow: 0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.2); }
      .lmsw__aura { position: absolute; width: 60px; height: 60px; left: -8px; top: 50%; transform: translateY(-50%); border-radius: 50%; background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / calc(0.5 * var(--lumina-intensity))), transparent 70%); filter: blur(12px); opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); pointer-events: none; z-index: 0; }
      :host([checked]) .lmsw__aura { opacity: 1; animation: lmsw-pulse 2s ease-in-out infinite; }
      @keyframes lmsw-pulse { 0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.6; } 50% { transform: translateY(-50%) scale(1.2); opacity: 1; } }
      .lmsw__track { position: relative; width: 56px; height: 30px; border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 4px rgb(0 0 0 / 0.25), var(--lumina-shadow); flex-shrink: 0; z-index: 1; }
      .lmsw__glow { position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(90deg, rgb(var(--lumina-accent-rgb) / 0.6), rgb(var(--lumina-accent-rgb) / 0.95)); opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([checked]) .lmsw__glow { opacity: 1; }
      .lmsw__thumb { position: absolute; top: 50%; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #fff, #d8d8e8); box-shadow: 0 2px 6px rgb(0 0 0 / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.8); transform: translateY(-50%); transition: left calc(var(--lumina-speed) * 1.2) var(--lumina-ease-spring); z-index: 2; }
      :host([checked]) .lmsw__thumb { left: 29px; }
      .lmsw__particles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      .lmsw__label { font-size: 14px; font-weight: 500; }
      .lmsw__label:empty { display: none; }
      :host([variant="void"]) .lmsw__track { background: rgb(0 0 0 / 0.6); }
      :host([variant="void"][checked]) .lmsw__thumb { box-shadow: 0 0 12px var(--lumina-accent), 0 2px 6px rgb(0 0 0 / 0.4); }
      @media (prefers-reduced-motion: reduce) { .lmsw__thumb, .lmsw__aura, .lmsw__glow { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this._checked = this.hasAttribute("checked"), this.button = this.$$(".lmsw"), this.canvas = this.$$(".lmsw__particles"), this.ctx = this.canvas?.getContext("2d") ?? null, this.setAttribute("role", "switch"), this.setAttribute("aria-checked", String(this._checked)), this.button?.addEventListener("click", this.onClick);
  }
  unmounted() {
    cancelAnimationFrame(this.raf);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "checked" && (this._checked = i !== null, this.setAttribute("aria-checked", String(this._checked)));
  }
  burst() {
    if (!this.ctx || !this.canvas) return;
    const t = window.devicePixelRatio || 1, e = 24, i = 24;
    this.canvas.width = e * t, this.canvas.height = i * t, this.canvas.style.width = `${e}px`, this.canvas.style.height = `${i}px`, this.ctx.setTransform(t, 0, 0, t, 0, 0);
    const r = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", s = y(this.intensity), n = Math.round(14 * s);
    for (let d = 0; d < n; d++) {
      const u = g(0, Math.PI * 2), m = g(1.5, 3.5);
      this.particles.push({ x: e / 2, y: i / 2, vx: Math.cos(u) * m, vy: Math.sin(u) * m, life: 0, maxLife: 30 + Math.random() * 20, size: g(0.8, 2) });
    }
    this.raf || this.tick(r);
  }
}
a(he, "tagName", "lumina-switch");
customElements.get(he.tagName) || customElements.define(he.tagName, he);
class pe extends l {
  constructor() {
    super(...arguments);
    a(this, "sortCol", -1);
    a(this, "sortDir", "asc");
    a(this, "onClick", (t) => {
      const e = t.target.closest("th[data-sort]");
      if (!e) return;
      const i = parseInt(e.getAttribute("data-sort") ?? "0", 10);
      this.sortCol === i ? this.sortDir = this.sortDir === "asc" ? "desc" : "asc" : (this.sortCol = i, this.sortDir = "asc"), this.querySelectorAll("th[data-sort]").forEach((n) => {
        n.removeAttribute("data-sorted");
      }), e.setAttribute("data-sorted", this.sortDir);
      const r = this.querySelector("tbody");
      if (!r) return;
      const s = Array.from(r.querySelectorAll("tr"));
      s.sort((n, d) => {
        const u = n.children[i], m = d.children[i], b = u?.textContent ?? "", x = m?.textContent ?? "", _ = parseFloat(b), A = parseFloat(x), L = !isNaN(_) && !isNaN(A) ? _ - A : b.localeCompare(x);
        return this.sortDir === "asc" ? L : -L;
      }), s.forEach((n, d) => {
        n.style.animation = "none", r.appendChild(n), requestAnimationFrame(() => {
          n.style.animation = `lmtb-row-morph 0.3s var(--lumina-ease-spring) ${d * 0.02}s`;
        });
      });
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "sortable"];
  }
  render() {
    return '<div class="lmtb" part="root"><table class="lmtb__table" part="table"><thead class="lmtb__head" part="head"><slot name="head"></slot></thead><tbody class="lmtb__body"><slot></slot></tbody></table></div>';
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmtb { border-radius: var(--lumina-radius-md); overflow: hidden; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); }
      .lmtb__table { width: 100%; border-collapse: collapse; }
      ::slotted(thead) { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      ::slotted(th) { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lumina-text-muted); cursor: pointer; transition: color 0.2s; white-space: nowrap; user-select: none; }
      ::slotted(th:hover) { color: var(--lumina-accent); }
      ::slotted(th[data-sort])::after { content: ' ↕'; opacity: 0.4; }
      ::slotted(th[data-sorted="asc"])::after { content: ' ↑'; opacity: 1; color: var(--lumina-accent); }
      ::slotted(th[data-sorted="desc"])::after { content: ' ↓'; opacity: 1; color: var(--lumina-accent); }
      ::slotted(td) { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid var(--lumina-border); transition: background 0.15s; }
      ::slotted(tr) { transition: all 0.3s var(--lumina-ease-spring); }
      ::slotted(tr:hover td) { background: rgb(var(--lumina-accent-rgb) / 0.08); box-shadow: inset 2px 0 0 var(--lumina-accent); }
      ::slotted(tr:last-child td) { border-bottom: 0; }
      :host([variant="compact"]) ::slotted(td), :host([variant="compact"]) ::slotted(th) { padding: 8px 12px; font-size: 12px; }
      :host([variant="neural"]) .lmtb { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { ::slotted(tr), ::slotted(td) { transition: none !important; } }
    `;
  }
  mounted() {
    this.addEventListener("click", this.onClick);
  }
  unmounted() {
    this.removeEventListener("click", this.onClick);
  }
  onConfigChange(t) {
  }
}
a(pe, "tagName", "lumina-table");
customElements.get(pe.tagName) || customElements.define(pe.tagName, pe);
const bi = ["horizontal", "vertical"];
class be extends HTMLElement {
  constructor() {
    super();
    const o = this.attachShadow({ mode: "open" }), t = new CSSStyleSheet();
    t.replaceSync(`
      :host { display: none; }
      :host([active]) { display: block; }
    `), o.adoptedStyleSheets = [t];
  }
  connectedCallback() {
    this.id || (this.id = `tab-${Math.random().toString(36).slice(2, 9)}`);
  }
}
a(be, "tagName", "lumina-tab");
class ge extends l {
  constructor() {
    super(...arguments);
    a(this, "_activeTab", "");
    a(this, "_orientation", "horizontal");
    a(this, "_lazy", !1);
    a(this, "indicator", null);
    a(this, "panelsContainer", null);
    a(this, "tabsRow", null);
    a(this, "renderedPanels", /* @__PURE__ */ new Set());
    a(this, "previousTabRect", null);
    /* ---------------------------------------------------------------- */
    /* Keyboard navigation                                              */
    /* ---------------------------------------------------------------- */
    a(this, "onTabKeydown", (t) => {
      const e = t.target;
      if (!e.classList.contains("lmt__tab")) return;
      const i = Array.from(this.tabsRow?.querySelectorAll(".lmt__tab") ?? []), r = i.indexOf(e);
      if (r === -1) return;
      let s = r;
      if (this._orientation === "horizontal")
        if (t.key === "ArrowRight") s = (r + 1) % i.length;
        else if (t.key === "ArrowLeft") s = (r - 1 + i.length) % i.length;
        else if (t.key === "Home") s = 0;
        else if (t.key === "End") s = i.length - 1;
        else return;
      else if (t.key === "ArrowDown") s = (r + 1) % i.length;
      else if (t.key === "ArrowUp") s = (r - 1 + i.length) % i.length;
      else if (t.key === "Home") s = 0;
      else if (t.key === "End") s = i.length - 1;
      else return;
      t.preventDefault();
      const n = i[s], d = n.getAttribute("data-tab-id");
      d && this.activateTab(d), n.focus();
    });
  }
  static get observedAttributes() {
    return [
      ...l.observedAttributes,
      "active-tab",
      "orientation",
      "lazy"
    ];
  }
  get activeTab() {
    return this._activeTab;
  }
  set activeTab(t) {
    this._activeTab = t, this.setAttribute("active-tab", t), this.activateTab(t);
  }
  get orientation() {
    return this._orientation;
  }
  set orientation(t) {
    this._orientation = t, this.setAttribute("orientation", t), this.applyOrientation();
  }
  get lazy() {
    return this._lazy;
  }
  set lazy(t) {
    this._lazy = t, t ? this.setAttribute("lazy", "") : this.removeAttribute("lazy");
  }
  render() {
    return `
      <div class="lmt" part="tabs" data-orientation="horizontal">
        <div class="lmt__row" part="row" role="tablist">
          <div class="lmt__indicator" part="indicator" aria-hidden="true"></div>
        </div>
        <div class="lmt__panels" part="panel"></div>
      </div>
    `;
  }
  styles() {
    return `
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lmt { display: flex; flex-direction: column; gap: 16px; }
      .lmt[data-orientation="vertical"] { flex-direction: row; gap: 20px; }
      .lmt[data-orientation="vertical"] .lmt__row { flex-direction: column; min-width: 160px; }
      .lmt[data-orientation="vertical"] .lmt__panels { flex: 1; }

      .lmt__row {
        position: relative;
        display: flex;
        gap: 4px;
        padding: 6px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid var(--lumina-border);
        box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.06), var(--lumina-shadow);
        overflow: hidden;
      }

      .lmt__indicator {
        position: absolute;
        top: 6px;
        left: 6px;
        width: 0;
        height: calc(100% - 12px);
        border-radius: var(--lumina-radius-pill);
        background: linear-gradient(135deg,
          rgb(var(--lumina-accent-rgb) / 0.95),
          rgb(var(--lumina-accent-rgb) / 0.65)
        );
        box-shadow:
          0 4px 16px rgb(var(--lumina-accent-rgb) / 0.4),
          inset 0 1px 0 rgb(255 255 255 / 0.25);
        opacity: 0;
        transition:
          transform var(--lumina-speed) var(--lumina-ease-spring),
          width var(--lumina-speed) var(--lumina-ease-spring),
          height var(--lumina-speed) var(--lumina-ease-spring),
          opacity var(--lumina-speed) var(--lumina-ease-out);
        z-index: 0;
        pointer-events: none;
      }
      .lmt__indicator[data-active] { opacity: 1; }

      .lmt__tab {
        position: relative;
        z-index: 1;
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--lumina-text-muted);
        font: 600 13px var(--lumina-font-sans);
        padding: 8px 16px;
        border-radius: var(--lumina-radius-pill);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        transition: color var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmt__tab:hover { color: var(--lumina-text); }
      .lmt__tab[data-active="true"] { color: #fff; font-weight: 700; }
      .lmt__tab:focus-visible {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 2px;
      }

      .lmt__tab-icon {
        font-size: 14px;
        opacity: 0.8;
      }

      .lmt__tab-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 700;
        background: rgb(var(--lumina-accent-rgb) / 0.25);
        color: var(--lumina-accent);
        border: 1px solid rgb(var(--lumina-accent-rgb) / 0.4);
      }

      .lmt__panels { position: relative; min-height: 40px; }
      .lmt__panel {
        animation: lmt-fade-in calc(var(--lumina-speed) * 1.2) var(--lumina-ease-out);
      }
      @keyframes lmt-fade-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Variant: segmented */
      :host([variant="segmented"]) .lmt__row {
        padding: 4px;
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) - 0.05));
      }
      :host([variant="segmented"]) .lmt__tab {
        flex: 1;
        justify-content: center;
        border-radius: var(--lumina-radius-md);
      }

      /* Variant: underline */
      :host([variant="underline"]) .lmt__row {
        padding: 0;
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: 0;
        border-bottom: 1px solid var(--lumina-border);
        box-shadow: none;
        border-radius: 0;
        gap: 0;
      }
      :host([variant="underline"]) .lmt__indicator {
        top: auto;
        bottom: -1px;
        height: 2px;
        border-radius: 0;
        box-shadow: 0 0 8px var(--lumina-accent);
      }
      :host([variant="underline"]) .lmt__tab {
        padding: 12px 18px;
        border-radius: 0;
      }
      :host([variant="underline"]) .lmt__tab[data-active="true"] {
        color: var(--lumina-accent);
      }

      /* Variant: neural */
      :host([variant="neural"]) .lmt__row {
        border-color: rgb(var(--lumina-accent-rgb) / 0.25);
      }
      :host([variant="neural"]) .lmt__indicator {
        background:
          linear-gradient(135deg,
            rgb(var(--lumina-accent-rgb) / 0.4),
            rgb(var(--lumina-accent-rgb) / 0.7)
          );
        box-shadow:
          0 0 20px rgb(var(--lumina-accent-rgb) / 0.5),
          inset 0 1px 0 rgb(255 255 255 / 0.25);
      }

      @media (prefers-reduced-motion: reduce) {
        .lmt__indicator, .lmt__panel { transition: none !important; animation: none !important; }
      }
    `;
  }
  mounted() {
    this.indicator = this.$$(".lmt__indicator"), this.panelsContainer = this.$$(".lmt__panels"), this.tabsRow = this.$$(".lmt__row"), this.applyOrientation(), this.buildTabs(), this.activateInitial(), new MutationObserver(() => this.buildTabs()).observe(this, { childList: !0 });
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  /* ---------------------------------------------------------------- */
  /* Attribute plumbing                                               */
  /* ---------------------------------------------------------------- */
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), e !== i && (t === "active-tab" && i ? (this._activeTab = i, this.activateTab(i)) : t === "orientation" ? (this._orientation = f(i, bi, "horizontal"), this.applyOrientation()) : t === "lazy" && (this._lazy = i !== null));
  }
  /* ---------------------------------------------------------------- */
  /* Building                                                         */
  /* ---------------------------------------------------------------- */
  buildTabs() {
    if (!this.tabsRow) return;
    this.tabsRow.querySelectorAll(".lmt__tab").forEach((e) => e.remove()), Array.from(this.querySelectorAll("lumina-tab")).forEach((e, i) => {
      const r = document.createElement("button");
      r.className = "lmt__tab", r.type = "button", r.setAttribute("role", "tab"), r.setAttribute("aria-selected", "false"), r.setAttribute("data-tab-id", e.id), r.tabIndex = -1;
      const s = e.getAttribute("icon"), n = e.getAttribute("label") ?? e.id, d = e.getAttribute("badge");
      if (s) {
        const m = document.createElement("span");
        m.className = "lmt__tab-icon", m.textContent = s, m.setAttribute("aria-hidden", "true"), r.appendChild(m);
      }
      const u = document.createElement("span");
      if (u.textContent = n, r.appendChild(u), d) {
        const m = document.createElement("span");
        m.className = "lmt__tab-badge", m.textContent = d, r.appendChild(m);
      }
      r.addEventListener("click", () => this.activateTab(e.id)), r.addEventListener("keydown", this.onTabKeydown), this.tabsRow.appendChild(r);
    }), this._activeTab && this.activateTab(this._activeTab);
  }
  activateInitial() {
    const t = Array.from(this.querySelectorAll("lumina-tab")), e = t.find((i) => i.id === this._activeTab) ?? t[0];
    e && this.activateTab(e.id);
  }
  activateTab(t) {
    if (!this._mounted) return;
    this._activeTab = t;
    const e = Array.from(this.querySelectorAll("lumina-tab"));
    if (this.tabsRow?.querySelectorAll(".lmt__tab").forEach((i) => {
      const r = i.getAttribute("data-tab-id") === t;
      i.setAttribute("data-active", String(r)), i.setAttribute("aria-selected", String(r)), i.setAttribute("tabindex", r ? "0" : "-1");
    }), this.moveIndicator(t), this.panelsContainer) {
      const i = e.find((r) => r.id === t);
      i && (this._lazy && !this.renderedPanels.has(t) && this.renderedPanels.add(t), p() ? (this.panelsContainer.innerHTML = "", this.appendPanelContent(i)) : (this.panelsContainer.style.opacity = "0", this.panelsContainer.style.transform = "translateY(8px)", window.setTimeout(() => {
        this.panelsContainer.innerHTML = "", this.appendPanelContent(i), this.panelsContainer.style.opacity = "1", this.panelsContainer.style.transform = "translateY(0)";
      }, 120)));
    }
    e.forEach((i) => {
      i.id === t ? i.setAttribute("active", "") : i.removeAttribute("active");
    }), this.dispatchEvent(
      new CustomEvent("lumina-tab-change", {
        bubbles: !0,
        composed: !0,
        detail: {
          id: t,
          label: e.find((i) => i.id === t)?.getAttribute("label") ?? t
        }
      })
    );
  }
  appendPanelContent(t) {
    if (!this.panelsContainer) return;
    const e = document.createElement("div");
    e.className = "lmt__panel", e.setAttribute("role", "tabpanel"), e.innerHTML = t.innerHTML || '<p style="opacity:0.5;"><em>(aba vazia)</em></p>', this.panelsContainer.appendChild(e);
  }
  moveIndicator(t) {
    if (!this.indicator || !this.tabsRow) return;
    const e = this.tabsRow.querySelector(`[data-tab-id="${t}"]`);
    if (!e) return;
    const i = this.tabsRow.getBoundingClientRect(), r = e.getBoundingClientRect();
    this._orientation === "horizontal" ? (this.indicator.style.transform = `translateX(${r.left - i.left - 6}px)`, this.indicator.style.width = `${r.width}px`, this.indicator.style.height = "calc(100% - 12px)", this.indicator.style.top = "6px", this.indicator.style.left = "6px") : (this.indicator.style.transform = `translateY(${r.top - i.top - 6}px)`, this.indicator.style.width = "calc(100% - 12px)", this.indicator.style.height = `${r.height}px`, this.indicator.style.top = "6px", this.indicator.style.left = "6px"), this.indicator.setAttribute("data-active", "");
  }
  applyOrientation() {
    const t = this.$$(".lmt");
    t && t.setAttribute("data-orientation", this._orientation);
  }
}
a(ge, "tagName", "lumina-tabs");
customElements.get(ge.tagName) || customElements.define(ge.tagName, ge);
customElements.get(be.tagName) || customElements.define(be.tagName, be);
class ve extends l {
  constructor() {
    super(...arguments);
    a(this, "_value", "");
    a(this, "_rows", 4);
    a(this, "_maxLength", 0);
    a(this, "_autoGrow", !0);
    a(this, "textarea", null);
    a(this, "counter", null);
    a(this, "onInput", (t) => {
      this._value = t.target.value, this.updateCounter(), this.autoResize(), this.dispatchEvent(new CustomEvent("lumina-input", { bubbles: !0, composed: !0, detail: { value: this._value } }));
    });
    a(this, "onChange", () => {
      this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { value: this._value } }));
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "value", "rows", "max-length", "auto-grow"];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = t, this.setAttribute("value", t), this.textarea && (this.textarea.value = t), this.updateCounter(), this.autoResize();
  }
  get rows() {
    return this._rows;
  }
  set rows(t) {
    this._rows = t, this.setAttribute("rows", String(t));
  }
  get maxLength() {
    return this._maxLength;
  }
  set maxLength(t) {
    this._maxLength = t, this.setAttribute("max-length", String(t)), this.updateCounter();
  }
  get autoGrow() {
    return this._autoGrow;
  }
  set autoGrow(t) {
    this._autoGrow = t, t ? this.setAttribute("auto-grow", "") : this.removeAttribute("auto-grow");
  }
  render() {
    return `
      <label class="lmtx" part="field">
        <div class="lmtx__shell">
          <div class="lmtx__bg" aria-hidden="true"></div>
          <div class="lmtx__glow" aria-hidden="true"></div>
          <textarea class="lmtx__el" part="control" rows="${this._rows}" placeholder="Digite algo..."></textarea>
        </div>
        <div class="lmtx__footer" part="footer">
          <span class="lmtx__counter" aria-hidden="true"></span>
        </div>
      </label>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmtx { display: flex; flex-direction: column; gap: 6px; }
      .lmtx__shell { position: relative; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmtx__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmtx__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); animation: lmtx-breathe 2s ease-in-out infinite; }
      @keyframes lmtx-breathe { 0%, 100% { box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 0 0 rgb(var(--lumina-accent-rgb) / 0); } 50% { box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.15); } }
      .lmtx__glow { position: absolute; inset: -2px; border-radius: inherit; pointer-events: none; opacity: 0; background: conic-gradient(from 0deg, transparent 0%, var(--lumina-accent) 25%, transparent 50%, var(--lumina-accent) 75%, transparent 100%); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 2px; animation: lmtx-spin 4s linear infinite; animation-play-state: paused; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmtx__glow { opacity: 0.6; animation-play-state: running; }
      .lmtx__el { position: relative; z-index: 1; width: 100%; min-height: calc(var(--lumina-input-h, 48px) * 2); padding: 12px 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; resize: none; line-height: 1.5; caret-color: var(--lumina-accent); transition: height 0.2s var(--lumina-ease-out); }
      .lmtx__el::placeholder { color: var(--lumina-text-muted); }
      .lmtx__footer { display: flex; justify-content: flex-end; padding: 0 4px; }
      .lmtx__counter { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--lumina-text-muted); transition: color 0.3s; }
      .lmtx__counter[data-warning] { color: #f59e0b; }
      .lmtx__counter[data-danger] { color: #ef4444; }
      @keyframes lmtx-spin { to { transform: rotate(360deg); } }
      :host([variant="neural"]) .lmtx__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      @media (prefers-reduced-motion: reduce) { .lmtx__glow, .lmtx__bg { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    this._value = this.getAttribute("value") ?? "", this._rows = parseInt(this.getAttribute("rows") ?? "4", 10) || 4, this._maxLength = parseInt(this.getAttribute("max-length") ?? "0", 10) || 0, this._autoGrow = this.getAttribute("auto-grow") !== "false", this.textarea = this.$$(".lmtx__el"), this.counter = this.$$(".lmtx__counter"), this.textarea && (this.textarea.value = this._value, this.textarea.addEventListener("input", this.onInput), this.textarea.addEventListener("change", this.onChange)), this.updateCounter(), this.autoResize();
  }
  unmounted() {
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "value" ? (this._value = i ?? "", this.textarea && (this.textarea.value = this._value), this.updateCounter(), this.autoResize()) : t === "rows" ? this._rows = parseInt(i ?? "4", 10) || 4 : t === "max-length" ? (this._maxLength = parseInt(i ?? "0", 10) || 0, this.updateCounter()) : t === "auto-grow" && (this._autoGrow = i !== "false");
  }
  updateCounter() {
    if (!this.counter) return;
    const t = this._value.length;
    this._maxLength > 0 ? (this.counter.textContent = `${t} / ${this._maxLength}`, this.counter.removeAttribute("data-warning"), this.counter.removeAttribute("data-danger"), t > this._maxLength * 0.9 && this.counter.setAttribute("data-warning", ""), t >= this._maxLength && this.counter.setAttribute("data-danger", "")) : this.counter.textContent = `${t} chars`;
  }
  autoResize() {
    !this._autoGrow || !this.textarea || (this.textarea.style.height = "auto", this.textarea.style.height = `${this.textarea.scrollHeight}px`);
  }
}
a(ve, "tagName", "lumina-textarea");
customElements.get(ve.tagName) || customElements.define(ve.tagName, ve);
class fe extends l {
  constructor() {
    super(...arguments);
    a(this, "_value", "12:00");
    a(this, "_format", "24h");
    a(this, "trigger", null);
    a(this, "dial", null);
    a(this, "hand", null);
    a(this, "_open", !1);
    a(this, "editing", "hour");
    a(this, "onDocClick", (t) => {
      !this.contains(t.target) && this._open && this.toggle();
    });
    a(this, "onPointerDown", (t) => {
      t.preventDefault(), this.updateFromPointer(t.clientX, t.clientY);
    });
    a(this, "onPointerMove", (t) => {
      this._open && t.buttons === 1 && this.updateFromPointer(t.clientX, t.clientY);
    });
    a(this, "onPointerUp", () => {
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "value", "format"];
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this._value = t, this.setAttribute("value", t), this.updateTrigger(), this.updateHand();
  }
  render() {
    return `
      <div class="lmtp" part="trigger">
        <button class="lmtp__trigger" type="button">
          <span class="lmtp__icon">🕐</span>
          <span class="lmtp__value"></span>
        </button>
        <div class="lmtp__panel" aria-hidden="true">
          <div class="lmtp__tabs">
            <button class="lmtp__tab" data-mode="hour" data-active>Hora</button>
            <button class="lmtp__tab" data-mode="minute">Minuto</button>
          </div>
          <div class="lmtp__dial" part="dial">
            <div class="lmtp__hand" part="hand"></div>
            <div class="lmtp__center"></div>
          </div>
          <div class="lmtp__display"></div>
        </div>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmtp__trigger { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: var(--lumina-radius-md); border: 1px solid var(--lumina-border); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: pointer; color: inherit; font: 500 14px var(--lumina-font-sans); }
      .lmtp__trigger:hover { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmtp__panel { position: absolute; top: calc(100% + 6px); left: 0; z-index: 1000; min-width: 240px; padding: 14px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); opacity: 0; transform: scale(0.92) translateY(-8px); pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); }
      :host([data-open]) .lmtp__panel { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
      .lmtp__tabs { display: flex; gap: 4px; margin-bottom: 12px; }
      .lmtp__tab { flex: 1; appearance: none; border: 1px solid var(--lumina-border); background: transparent; color: var(--lumina-text-muted); padding: 6px; border-radius: 6px; cursor: pointer; font: 600 12px var(--lumina-font-sans); transition: background 0.2s, color 0.2s; }
      .lmtp__tab[data-active] { background: rgb(var(--lumina-accent-rgb) / 0.2); color: var(--lumina-accent); border-color: rgb(var(--lumina-accent-rgb) / 0.4); }
      .lmtp__dial { position: relative; width: 200px; height: 200px; margin: 0 auto; border-radius: 50%; background: rgb(var(--lumina-surface) / 0.3); border: 1px solid var(--lumina-border); cursor: pointer; touch-action: none; }
      .lmtp__hand { position: absolute; top: 50%; left: 50%; width: 2px; height: 80px; background: var(--lumina-accent); transform-origin: bottom center; transform: translate(-50%, -100%) rotate(0deg); transition: transform 0.2s var(--lumina-ease-spring); box-shadow: 0 0 8px var(--lumina-accent); border-radius: 2px; }
      .lmtp__hand::after { content: ''; position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; border-radius: 50%; background: var(--lumina-accent); box-shadow: 0 0 12px var(--lumina-accent); }
      .lmtp__center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background: var(--lumina-accent); }
      .lmtp__display { text-align: center; font: 700 24px 'JetBrains Mono', monospace; color: var(--lumina-accent); margin-top: 12px; }
      @media (prefers-reduced-motion: reduce) { .lmtp__panel, .lmtp__hand { transition: none !important; } }
    `;
  }
  mounted() {
    this._value = this.getAttribute("value") ?? "12:00", this._format = this.getAttribute("format") ?? "24h", this.trigger = this.$$(".lmtp__trigger"), this.dial = this.$$(".lmtp__dial"), this.hand = this.$$(".lmtp__hand"), this.updateTrigger(), this.updateHand(), this.trigger?.addEventListener("click", () => this.toggle()), this.dial?.addEventListener("pointerdown", this.onPointerDown), document.addEventListener("pointermove", this.onPointerMove), document.addEventListener("pointerup", this.onPointerUp), this.shadow.querySelectorAll(".lmtp__tab").forEach((t) => {
      t.addEventListener("click", () => {
        this.editing = t.dataset.mode, this.shadow.querySelectorAll(".lmtp__tab").forEach((e) => e.removeAttribute("data-active")), t.setAttribute("data-active", ""), this.updateHand();
      });
    }), document.addEventListener("click", this.onDocClick);
  }
  unmounted() {
    document.removeEventListener("pointermove", this.onPointerMove), document.removeEventListener("pointerup", this.onPointerUp), document.removeEventListener("click", this.onDocClick);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "value" && (this._value = i ?? "12:00", this.updateTrigger(), this.updateHand());
  }
  toggle() {
    this._open = !this._open, this._open ? this.setAttribute("data-open", "") : this.removeAttribute("data-open");
  }
  updateTrigger() {
    const t = this.$$(".lmtp__value");
    t && (t.textContent = this._value);
  }
  updateHand() {
    const [t, e] = this._value.split(":").map(Number), i = this.editing === "hour" ? t % 12 * 30 : e * 6;
    this.hand && (this.hand.style.transform = `translate(-50%, -100%) rotate(${i}deg)`);
    const r = this.$$(".lmtp__display");
    r && (r.textContent = this._value);
  }
  updateFromPointer(t, e) {
    if (!this.dial) return;
    const i = this.dial.getBoundingClientRect(), r = t - i.left - i.width / 2, s = e - i.top - i.height / 2;
    let n = Math.atan2(r, -s) * (180 / Math.PI);
    n < 0 && (n += 360);
    const [d, u] = this._value.split(":").map(Number);
    if (this.editing === "hour") {
      const m = Math.round(n / 30) % 12, b = d >= 12 ? m + 12 : m;
      this._value = `${String(b).padStart(2, "0")}:${String(u).padStart(2, "0")}`;
    } else {
      const m = Math.round(n / 6) % 60;
      this._value = `${String(d).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
    this.setAttribute("value", this._value), this.updateTrigger(), this.updateHand(), this.dispatchEvent(new CustomEvent("lumina-time-change", { bubbles: !0, composed: !0, detail: { value: this._value } }));
  }
}
a(fe, "tagName", "lumina-time-picker");
customElements.get(fe.tagName) || customElements.define(fe.tagName, fe);
class _e extends l {
  constructor() {
    super(...arguments);
    a(this, "onScroll", () => {
      const t = this.getBoundingClientRect(), e = window.innerHeight, i = Math.max(0, Math.min(1, (e - t.top) / (t.height + e * 0.3)));
      this.style.setProperty("--lmtl-fill", `${i * 100}%`);
      const r = this.$$(".lmtl__line");
      r && r.style.setProperty("--fill", `${i * 100}%`);
    });
  }
  render() {
    return '<ol class="lmtl" part="timeline"><div class="lmtl__line" aria-hidden="true"></div><slot></slot></ol>';
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmtl { list-style: none; padding: 0; margin: 0; position: relative; padding-left: 32px; }
      .lmtl__line { position: absolute; left: 11px; top: 0; bottom: 0; width: 2px; background: var(--lumina-border); overflow: hidden; }
      .lmtl__line::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 0%; background: linear-gradient(180deg, var(--lumina-accent), rgb(var(--lumina-accent-rgb) / 0.3)); box-shadow: 0 0 8px var(--lumina-accent); transition: height 0.1s linear; }
      ::slotted(li), ::slotted([data-timeline-item]) { position: relative; padding: 16px 20px; margin-bottom: 8px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid var(--lumina-border); animation: lmtl-enter 0.5s var(--lumina-ease-spring) backwards; }
      @keyframes lmtl-enter { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      ::slotted(li::before), ::slotted([data-timeline-item])::before { content: ''; position: absolute; left: -27px; top: 20px; width: 12px; height: 12px; border-radius: 50%; background: var(--lumina-accent); box-shadow: 0 0 0 3px var(--lumina-bg, #06060c), 0 0 12px var(--lumina-accent); z-index: 1; }
      ::slotted(li:hover), ::slotted([data-timeline-item]:hover) { border-color: rgb(var(--lumina-accent-rgb) / 0.3); transform: translateX(4px); }
      :host([variant="neural"]) ::slotted(li), :host([variant="neural"]) ::slotted([data-timeline-item]) { border-color: rgb(var(--lumina-accent-rgb) / 0.2); }
      @media (prefers-reduced-motion: reduce) { ::slotted(li), ::slotted([data-timeline-item]) { animation: none !important; } }
    `;
  }
  mounted() {
    this.applyStagger(), "IntersectionObserver" in window && (new IntersectionObserver((e) => {
      e.forEach((i) => {
        if (i.isIntersecting) {
          const r = this.$$(".lmtl__line");
          if (r) {
            const s = this.getBoundingClientRect(), n = window.innerHeight, d = Math.max(0, Math.min(1, (n - s.top) / (s.height + n * 0.3)));
            r.querySelector("::after"), r.style.setProperty("--fill", `${d * 100}%`), this.style.setProperty("--lmtl-fill", `${d * 100}%`);
          }
        }
      });
    }, { threshold: 0 }).observe(this), window.addEventListener("scroll", this.onScroll, { passive: !0 }));
  }
  unmounted() {
    window.removeEventListener("scroll", this.onScroll);
  }
  onConfigChange(t) {
  }
  applyStagger() {
    this.querySelectorAll("li, [data-timeline-item]").forEach((t, e) => {
      t.style.animationDelay = `${e * 0.1}s`;
    });
  }
}
a(_e, "tagName", "lumina-timeline");
customElements.get(_e.tagName) || customElements.define(_e.tagName, _e);
const Ke = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
  "top-center",
  "bottom-center"
], gi = {
  success: "✓",
  error: "×",
  warning: "!",
  glass: "●",
  neural: "◆"
}, S = {
  "top-right": [],
  "top-left": [],
  "bottom-right": [],
  "bottom-left": [],
  "top-center": [],
  "bottom-center": []
};
function $e(c) {
  const o = S[c], t = c.startsWith("top"), e = 8;
  let i = 12;
  if (o.forEach((r, s) => {
    r.style.setProperty("--lmt-offset", `${i}px`), r.style.setProperty("--lmt-index", String(o.length - s)), i += r.offsetHeight + e;
  }), t) {
    let r = 12;
    o.forEach((s) => {
      s.style.setProperty("--lmt-offset", `${r}px`), r += s.offsetHeight + e;
    });
  }
}
class xe extends l {
  constructor() {
    super(...arguments);
    a(this, "_duration", 4e3);
    a(this, "_position", "top-right");
    a(this, "dismissTimer", null);
    a(this, "progressEl", null);
    a(this, "stackJoined", !1);
  }
  static get observedAttributes() {
    return [
      ...l.observedAttributes,
      "duration",
      "position"
    ];
  }
  get duration() {
    return this._duration;
  }
  set duration(t) {
    this._duration = t, this.setAttribute("duration", String(t)), this.scheduleDismiss();
  }
  get position() {
    return this._position;
  }
  set position(t) {
    this.stackJoined && (S[this._position] = S[this._position].filter((e) => e !== this), $e(this._position)), this._position = t, this.setAttribute("position", t), this.applyPosition(), this.joinStack();
  }
  render() {
    return `
      <div class="lmt" part="toast" role="alert">
        <div class="lmt__progress" part="progress" aria-hidden="true"></div>
        <span class="lmt__icon" part="icon" aria-hidden="true"></span>
        <div class="lmt__content" part="content">
          <slot></slot>
        </div>
        <div class="lmt__actions" part="actions">
          <slot name="actions"></slot>
        </div>
        <button class="lmt__close" part="close" type="button" aria-label="Fechar">×</button>
      </div>
    `;
  }
  styles() {
    return `
      :host {
        position: fixed;
        --lmt-color: var(--lumina-accent);
        --lmt-color-rgb: var(--lumina-accent-rgb);
        --lmt-offset: 12px;
        --lmt-index: 1;
        z-index: calc(10000 + var(--lmt-index));
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        pointer-events: none;
        max-width: 360px;
        transition:
          transform calc(var(--lumina-speed) * 1.4) var(--lumina-ease-spring),
          opacity calc(var(--lumina-speed) * 1.2) var(--lumina-ease-out);
      }

      :host([variant="success"]) { --lmt-color: #22c55e; --lmt-color-rgb: 34 197 94; }
      :host([variant="error"])   { --lmt-color: #ef4444; --lmt-color-rgb: 239 68 68; }
      :host([variant="warning"]) { --lmt-color: #f59e0b; --lmt-color-rgb: 245 158 11; }

      /* Positioning (CSS variables set the offset; transform places the host) */
      :host([position="top-right"])     { top: 0; right: 0; transform: translate(-12px, var(--lmt-offset)); }
      :host([position="top-left"])      { top: 0; left: 0; transform: translate(12px, var(--lmt-offset)); }
      :host([position="bottom-right"])  { bottom: 0; right: 0; transform: translate(-12px, calc(-1 * var(--lmt-offset))); }
      :host([position="bottom-left"])   { bottom: 0; left: 0; transform: translate(12px, calc(-1 * var(--lmt-offset))); }
      :host([position="top-center"])    { top: 0; left: 50%; transform: translate(-50%, var(--lmt-offset)); }
      :host([position="bottom-center"]) { bottom: 0; left: 50%; transform: translate(-50%, calc(-1 * var(--lmt-offset))); }

      /* Hidden state before show */
      :host(.is-hidden) {
        opacity: 0;
      }
      :host([position="top-right"].is-hidden)     { transform: translate(120%, var(--lmt-offset)); }
      :host([position="top-left"].is-hidden)      { transform: translate(-120%, var(--lmt-offset)); }
      :host([position="bottom-right"].is-hidden)  { transform: translate(120%, calc(-1 * var(--lmt-offset))); }
      :host([position="bottom-left"].is-hidden)   { transform: translate(-120%, calc(-1 * var(--lmt-offset))); }
      :host([position="top-center"].is-hidden)    { transform: translate(-50%, -150%); }
      :host([position="bottom-center"].is-hidden) { transform: translate(-50%, 150%); }

      .lmt {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 14px;
        padding-right: 36px;
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.1));
        backdrop-filter: blur(20px) saturate(1.6);
        -webkit-backdrop-filter: blur(20px) saturate(1.6);
        border: 1px solid var(--lumina-border);
        border-left: 3px solid var(--lmt-color);
        box-shadow:
          0 12px 40px -12px rgb(0 0 0 / 0.5),
          0 0 0 1px rgb(var(--lmt-color-rgb) / 0.1);
        pointer-events: auto;
        overflow: hidden;
      }

      .lmt__progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        width: 100%;
        background: var(--lmt-color);
        box-shadow: 0 0 8px var(--lmt-color);
        transform-origin: left;
        transform: scaleX(1);
      }
      .lmt.is-counting .lmt__progress {
        animation: lmt-progress var(--lmt-duration, 4s) linear forwards;
      }
      @keyframes lmt-progress {
        from { transform: scaleX(1); }
        to   { transform: scaleX(0); }
      }

      .lmt__icon {
        flex-shrink: 0;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgb(var(--lmt-color-rgb) / 0.2);
        color: var(--lmt-color);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 800;
        margin-top: 1px;
      }

      .lmt__content {
        flex: 1;
        min-width: 0;
        font-size: 14px;
        line-height: 1.45;
      }

      .lmt__actions {
        display: flex;
        gap: 6px;
        flex-shrink: 0;
      }
      .lmt__actions:empty { display: none; }
      ::slotted([slot="actions"]) {
        appearance: none;
        border: 1px solid rgb(var(--lmt-color-rgb) / 0.4);
        background: rgb(var(--lmt-color-rgb) / 0.15);
        color: var(--lmt-color);
        padding: 4px 10px;
        border-radius: 6px;
        font: 600 11px var(--lumina-font-sans);
        cursor: pointer;
        transition: background 0.2s;
      }
      ::slotted([slot="actions"]:hover) {
        background: rgb(var(--lmt-color-rgb) / 0.3);
      }

      .lmt__close {
        position: absolute;
        top: 8px;
        right: 8px;
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--lumina-text-muted);
        font-size: 16px;
        cursor: pointer;
        width: 22px;
        height: 22px;
        border-radius: 5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, color 0.2s;
      }
      .lmt__close:hover { background: rgb(255 255 255 / 0.1); color: #fff; }

      /* Variant: neural */
      :host([variant="neural"]) .lmt {
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }

      @media (prefers-reduced-motion: reduce) {
        :host { transition: none !important; }
        .lmt__progress { animation: none !important; }
      }
    `;
  }
  mounted() {
    this.progressEl = this.$$(".lmt__progress");
    const t = this.getAttribute("duration");
    t && (this._duration = parseInt(t, 10) || 4e3);
    const e = this.getAttribute("position");
    e && Ke.includes(e) && (this._position = e), this.applyPosition(), this.applyVariantIcon(), this.$$(".lmt__close")?.addEventListener("click", () => this.dismiss()), this.shadow.querySelectorAll('slot[name="actions"]').forEach((i) => {
      i.addEventListener("click", (r) => {
        const s = r.target;
        s.matches('[slot="actions"]') && !s.hasAttribute("data-persist") && setTimeout(() => this.dismiss(), 100);
      });
    }), this.style.setProperty("--lmt-duration", `${this._duration}ms`), requestAnimationFrame(() => {
      this.classList.remove("is-hidden"), this.joinStack(), this.startProgress(), this.scheduleDismiss();
    });
  }
  unmounted() {
    this.dismissTimer && clearTimeout(this.dismissTimer), this.leaveStack();
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "duration" && i ? (this._duration = parseInt(i, 10) || 4e3, this.style.setProperty("--lmt-duration", `${this._duration}ms`)) : t === "position" && i && Ke.includes(i) && (this._position = i);
  }
  applyPosition() {
  }
  applyVariantIcon() {
    const t = this.$$(".lmt__icon");
    t && (t.textContent = gi[this.variant] ?? "●");
  }
  joinStack() {
    this.stackJoined || (S[this._position].push(this), this.stackJoined = !0, $e(this._position));
  }
  leaveStack() {
    this.stackJoined && (S[this._position] = S[this._position].filter((t) => t !== this), this.stackJoined = !1, $e(this._position));
  }
  startProgress() {
    if (p() || this._duration <= 0) return;
    const t = this.$$(".lmt");
    t && t.classList.add("is-counting");
  }
  scheduleDismiss() {
    this.dismissTimer && clearTimeout(this.dismissTimer), this._duration > 0 && (this.dismissTimer = setTimeout(() => this.dismiss(), this._duration));
  }
  /** Pause auto-dismiss (e.g., on hover). */
  pause() {
    this.dismissTimer && (clearTimeout(this.dismissTimer), this.dismissTimer = null);
    const t = this.$$(".lmt");
    if (t) {
      t.style.animationPlayState = "paused";
      const e = this.$$(".lmt__progress");
      e && (e.style.animationPlayState = "paused");
    }
  }
  /** Resume auto-dismiss after pause. */
  resume() {
    const t = this.$$(".lmt");
    if (t) {
      t.style.animationPlayState = "running";
      const e = this.$$(".lmt__progress");
      e && (e.style.animationPlayState = "running");
    }
  }
  /** Public API: dismiss with slide-out, then remove from DOM. */
  dismiss() {
    this.dismissTimer && (clearTimeout(this.dismissTimer), this.dismissTimer = null), this.classList.add("is-hidden"), this.leaveStack(), setTimeout(() => {
      this.dispatchEvent(new CustomEvent("lumina-dismiss", { bubbles: !0, composed: !0 })), this.remove();
    }, p() ? 0 : 400);
  }
}
a(xe, "tagName", "lumina-toast");
customElements.get(xe.tagName) || customElements.define(xe.tagName, xe);
class ye extends l {
  constructor() {
    super(...arguments);
    a(this, "_pressed", !1);
    a(this, "_iconOn", "");
    a(this, "_iconOff", "");
    a(this, "burstCanvas", null);
    a(this, "burstCtx", null);
    a(this, "burstParticles", []);
    a(this, "burstRaf", 0);
    a(this, "onClick", () => {
      this._pressed = !this._pressed, this._pressed ? this.setAttribute("pressed", "") : this.removeAttribute("pressed"), this.setAttribute("aria-pressed", String(this._pressed)), this.updateIcon(), this.spawnBurst(), this.dispatchEvent(new CustomEvent("lumina-change", { bubbles: !0, composed: !0, detail: { pressed: this._pressed } }));
    });
    a(this, "onKeydown", (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.onClick());
    });
    a(this, "tick", (t) => {
      if (this.burstCtx) {
        this.burstCtx.clearRect(0, 0, this.clientWidth, this.clientHeight), this.burstParticles = this.burstParticles.filter((e) => e.life < e.maxLife);
        for (const e of this.burstParticles) {
          e.x += e.vx, e.y += e.vy, e.vx *= 0.94, e.vy *= 0.94, e.life += 1;
          const i = 1 - e.life / e.maxLife;
          this.burstCtx.fillStyle = `rgba(${t} / ${i})`, this.burstCtx.beginPath(), this.burstCtx.arc(e.x, e.y, Math.max(0, e.size * i), 0, Math.PI * 2), this.burstCtx.fill();
        }
        this.burstParticles.length > 0 ? this.burstRaf = requestAnimationFrame(() => this.tick(t)) : (this.burstRaf = 0, this.burstCtx.clearRect(0, 0, this.clientWidth, this.clientHeight));
      }
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "pressed", "icon-on", "icon-off"];
  }
  get pressed() {
    return this._pressed;
  }
  set pressed(t) {
    this._pressed = t, t ? this.setAttribute("pressed", "") : this.removeAttribute("pressed");
  }
  get iconOn() {
    return this._iconOn;
  }
  set iconOn(t) {
    this._iconOn = t, this.setAttribute("icon-on", t), this.updateIcon();
  }
  get iconOff() {
    return this._iconOff;
  }
  set iconOff(t) {
    this._iconOff = t, this.setAttribute("icon-off", t), this.updateIcon();
  }
  render() {
    return `
      <button class="lmtb" part="button" type="button" role="switch" aria-pressed="false">
        <span class="lmtb__bg" aria-hidden="true"></span>
        <span class="lmtb__glow" part="glow" aria-hidden="true"></span>
        <canvas class="lmtb__particles" aria-hidden="true"></canvas>
        <span class="lmtb__icon" aria-hidden="true"></span>
        <span class="lmtb__label"><slot></slot></span>
      </button>
    `;
  }
  styles() {
    return `
      :host { display: inline-block; cursor: pointer; outline: none; font-family: var(--lumina-font-sans); color: var(--lumina-text); -webkit-tap-highlight-color: transparent; }
      .lmtb {
        position: relative; display: inline-flex; align-items: center; gap: 8px;
        height: 44px; padding: 0 22px; border: 0; background: transparent; color: inherit;
        font: 600 14px var(--lumina-font-sans); cursor: pointer; border-radius: var(--lumina-radius-pill);
        overflow: hidden; isolation: isolate;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lmtb__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4); border: 1px solid var(--lumina-border); z-index: 0; transition: background var(--lumina-speed) var(--lumina-ease-out), border-color var(--lumina-speed) var(--lumina-ease-out); }
      .lmtb__glow { position: absolute; inset: -20%; border-radius: inherit; pointer-events: none; z-index: 0; opacity: 0; background: radial-gradient(60% 60% at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.5), transparent 70%); filter: blur(20px); transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmtb__particles { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 3; }
      .lmtb__icon { position: relative; z-index: 2; font-size: 16px; opacity: 0.8; }
      .lmtb__icon:empty { display: none; }
      .lmtb__label { position: relative; z-index: 2; white-space: nowrap; }
      :host(:hover) .lmtb { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmtb__glow { opacity: calc(0.4 * var(--lumina-intensity)); }
      :host(:active) .lmtb { transform: translateY(0) scale(0.97); }
      :host([pressed]) .lmtb__bg { background: linear-gradient(135deg, rgb(var(--lumina-accent-rgb) / 0.4), rgb(var(--lumina-accent-rgb) / 0.2)); border-color: rgb(var(--lumina-accent-rgb) / 0.6); }
      :host([pressed]) .lmtb__glow { opacity: calc(0.6 * var(--lumina-intensity)); }
      :host([pressed]) .lmtb__label { color: #fff; }
      :host(:focus-visible) { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      :host([variant="aura"]) .lmtb { animation: lmtb-float 4s ease-in-out infinite; }
      :host([variant="aura"][pressed]) .lmtb { animation: lmtb-float-pressed 2s ease-in-out infinite; }
      @keyframes lmtb-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      @keyframes lmtb-float-pressed { 0%,100% { transform: translateY(0) scale(1.02); } 50% { transform: translateY(-3px) scale(1.02); } }
      @media (prefers-reduced-motion: reduce) { .lmtb, .lmtb__glow { animation: none !important; transition: none !important; } }
    `;
  }
  mounted() {
    this._pressed = this.hasAttribute("pressed"), this._iconOn = this.getAttribute("icon-on") ?? "", this._iconOff = this.getAttribute("icon-off") ?? "", this.burstCanvas = this.$$(".lmtb__particles"), this.burstCtx = this.burstCanvas?.getContext("2d") ?? null, this.updateIcon(), this.setAttribute("role", "switch"), this.setAttribute("tabindex", "0"), this.setAttribute("aria-pressed", String(this._pressed)), this.$$(".lmtb")?.addEventListener("click", this.onClick), this.$$(".lmtb")?.addEventListener("keydown", this.onKeydown);
  }
  unmounted() {
    cancelAnimationFrame(this.burstRaf);
  }
  onConfigChange(t) {
  }
  attributeChangedCallback(t, e, i) {
    super.attributeChangedCallback(t, e, i), t === "pressed" ? (this._pressed = i !== null, this.setAttribute("aria-pressed", String(this._pressed))) : t === "icon-on" ? (this._iconOn = i ?? "", this.updateIcon()) : t === "icon-off" && (this._iconOff = i ?? "", this.updateIcon());
  }
  updateIcon() {
    const t = this.$$(".lmtb__icon");
    t && (t.textContent = this._pressed ? this._iconOn : this._iconOff);
  }
  spawnBurst() {
    if (p() || !this.burstCtx || !this.burstCanvas) return;
    const t = window.devicePixelRatio || 1, e = this.clientWidth, i = this.clientHeight;
    this.burstCanvas.width = e * t, this.burstCanvas.height = i * t, this.burstCanvas.style.width = `${e}px`, this.burstCanvas.style.height = `${i}px`, this.burstCtx.setTransform(t, 0, 0, t, 0, 0);
    const r = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", s = y(this.intensity), n = Math.round(14 * s), d = e / 2, u = i / 2;
    for (let m = 0; m < n; m++) {
      const b = m / n * Math.PI * 2, x = 1.5 + Math.random() * 3 * s;
      this.burstParticles.push({ x: d, y: u, vx: Math.cos(b) * x, vy: Math.sin(b) * x, life: 0, maxLife: 30 + Math.random() * 20, size: g(1, 2.5) });
    }
    this.burstRaf || this.tick(r);
  }
}
a(ye, "tagName", "lumina-toggle-button");
customElements.get(ye.tagName) || customElements.define(ye.tagName, ye);
class we extends l {
  constructor() {
    super(...arguments);
    a(this, "knob", null);
    a(this, "track", null);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "particles", []);
    a(this, "raf", 0);
    a(this, "_checked", !1);
    a(this, "onClick", () => {
      this.getAttribute("disabled") === null && (this.checked = !this._checked, this.dispatchEvent(
        new CustomEvent("lumina-toggle", {
          detail: { checked: this._checked },
          bubbles: !0,
          composed: !0
        })
      ));
    });
    a(this, "tick", (t) => {
      if (this.ctx) {
        this.ctx.clearRect(0, 0, 24, 24), this.particles = this.particles.filter((e) => e.life < e.maxLife);
        for (const e of this.particles) {
          e.x += e.vx, e.y += e.vy, e.vx *= 0.92, e.vy *= 0.92, e.life += 1;
          const i = 1 - e.life / e.maxLife;
          this.ctx.fillStyle = `rgba(${t} / ${i})`, this.ctx.beginPath(), this.ctx.arc(e.x, e.y, Math.max(0, e.size * i), 0, Math.PI * 2), this.ctx.fill();
        }
        this.particles.length > 0 ? this.raf = requestAnimationFrame(() => this.tick(t)) : this.raf = 0;
      }
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "checked", "disabled", "label"];
  }
  get checked() {
    return this._checked;
  }
  set checked(t) {
    this._checked = t, this.setAttribute("aria-checked", String(t)), t ? this.setAttribute("checked", "") : this.removeAttribute("checked"), t && !p() && this.burst();
  }
  render() {
    return `
      <button
        class="lumina-toggle"
        part="root"
        role="switch"
        aria-checked="${this.hasAttribute("checked")}"
        ${this.hasAttribute("disabled") ? "disabled" : ""}
      >
        <span class="lumina-toggle__aura" part="aura" aria-hidden="true"></span>
        <span class="lumina-toggle__track" part="track">
          <span class="lumina-toggle__rail" part="rail" aria-hidden="true"></span>
          <span class="lumina-toggle__glow" part="glow" aria-hidden="true"></span>
          <span class="lumina-toggle__knob" part="knob">
            <canvas class="lumina-toggle__burst" part="burst" aria-hidden="true"></canvas>
          </span>
        </span>
        <span class="lumina-toggle__label" part="label">
          <slot></slot>
        </span>
      </button>
    `;
  }
  styles() {
    return `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-toggle {
        appearance: none;
        border: 0;
        background: transparent;
        padding: 0;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        outline: none;
        font: inherit;
        color: inherit;
      }
      .lumina-toggle:disabled { cursor: not-allowed; opacity: 0.4; }

      .lumina-toggle__aura {
        position: absolute;
        width: 60px;
        height: 60px;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        background: radial-gradient(circle,
          rgb(var(--lumina-accent-rgb) / calc(0.5 * var(--lumina-intensity))),
          transparent 70%
        );
        filter: blur(12px);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
        pointer-events: none;
        z-index: 0;
      }

      .lumina-toggle__track {
        position: relative;
        width: 56px;
        height: 30px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--lumina-border);
        box-shadow:
          inset 0 1px 4px rgb(0 0 0 / 0.25),
          var(--lumina-shadow);
        flex-shrink: 0;
        z-index: 1;
      }

      .lumina-toggle__rail {
        position: absolute;
        inset: 3px;
        border-radius: inherit;
        background: rgb(0 0 0 / 0.2);
        opacity: 1;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-toggle__glow {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(90deg,
          rgb(var(--lumina-accent-rgb) / 0.6),
          rgb(var(--lumina-accent-rgb) / 0.95)
        );
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }

      .lumina-toggle__knob {
        position: absolute;
        top: 50%;
        left: 3px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ffffff, #d8d8e8);
        box-shadow:
          0 2px 6px rgb(0 0 0 / 0.4),
          inset 0 1px 0 rgb(255 255 255 / 0.6);
        transform: translateY(-50%);
        transition: left var(--lumina-speed) var(--lumina-ease-spring),
                    background var(--lumina-speed) var(--lumina-ease-out);
        z-index: 2;
      }

      .lumina-toggle__burst {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .lumina-toggle__label {
        font-size: 14px;
        font-weight: 500;
      }
      .lumina-toggle__label:empty { display: none; }

      /* Checked state */
      :host([checked]) .lumina-toggle__glow { opacity: 1; }
      :host([checked]) .lumina-toggle__knob { left: 29px; background: #fff; }
      :host([checked]) .lumina-toggle__aura { opacity: 1; }

      /* Focus */
      .lumina-toggle:focus-visible {
        outline: 2px solid var(--lumina-accent);
        outline-offset: 4px;
      }

      /* Hover */
      .lumina-toggle:hover:not(:disabled) .lumina-toggle__knob {
        box-shadow:
          0 0 0 4px rgb(var(--lumina-accent-rgb) / 0.2),
          0 2px 6px rgb(0 0 0 / 0.4),
          inset 0 1px 0 rgb(255 255 255 / 0.6);
      }

      /* Void variant: minimal black + neon knob */
      :host([variant="void"]) .lumina-toggle__track {
        background: rgb(0 0 0 / 0.6);
        border-color: rgb(var(--lumina-accent-rgb) / 0.3);
      }
      :host([variant="void"][checked]) .lumina-toggle__knob {
        box-shadow:
          0 0 12px var(--lumina-accent),
          0 2px 6px rgb(0 0 0 / 0.4);
      }

      /* Aura variant: floating knob */
      :host([variant="aura"]) .lumina-toggle__knob {
        animation: lumina-toggle-float 3s ease-in-out infinite;
      }

      /* Morph variant: knob morphs from circle to squircle */
      :host([variant="morph"]) .lumina-toggle__knob {
        border-radius: 50%;
        transition: left var(--lumina-speed) var(--lumina-ease-spring),
                    border-radius var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([variant="morph"][checked]) .lumina-toggle__knob {
        border-radius: 6px;
      }

      @keyframes lumina-toggle-float {
        0%, 100% { transform: translateY(-50%); }
        50% { transform: translateY(calc(-50% - 1px)); }
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-toggle__knob,
        .lumina-toggle__glow,
        .lumina-toggle__aura { transition: none !important; animation: none !important; }
      }
    `;
  }
  mounted() {
    this.knob = this.$$(".lumina-toggle__knob"), this.track = this.$$(".lumina-toggle__track"), this.canvas = this.$$(".lumina-toggle__burst"), this.ctx = this.canvas?.getContext("2d") ?? null, this._checked = this.hasAttribute("checked"), this.setAttribute("role", "switch"), this.setAttribute("aria-checked", String(this._checked)), this.$$(".lumina-toggle")?.addEventListener("click", this.onClick);
  }
  unmounted() {
    this.$$(".lumina-toggle")?.removeEventListener("click", this.onClick), cancelAnimationFrame(this.raf);
  }
  onConfigChange(t) {
  }
  burst() {
    if (!this.ctx || !this.canvas || !this.knob) return;
    const t = window.devicePixelRatio || 1, e = 24, i = 24;
    this.canvas.width = e * t, this.canvas.height = i * t, this.canvas.style.width = `${e}px`, this.canvas.style.height = `${i}px`, this.ctx.setTransform(t, 0, 0, t, 0, 0);
    const r = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "124 92 255", s = y(this.intensity), n = Math.round(14 * s);
    for (let d = 0; d < n; d++) {
      const u = g(0, Math.PI * 2), m = g(1.5, 3.5);
      this.particles.push({
        x: e / 2,
        y: i / 2,
        vx: Math.cos(u) * m,
        vy: Math.sin(u) * m,
        life: 0,
        maxLife: 30 + Math.random() * 20,
        size: g(0.8, 2)
      });
    }
    this.raf || this.tick(r);
  }
}
a(we, "tagName", "lumina-toggle");
customElements.get(we.tagName) || customElements.define(we.tagName, we);
class ke extends l {
  constructor() {
    super(...arguments);
    a(this, "bubble", null);
    a(this, "arrow", null);
    a(this, "hideTimer", null);
    a(this, "showTimer", null);
    a(this, "_visible", !1);
    a(this, "onEnter", () => {
      this.hideTimer && (clearTimeout(this.hideTimer), this.hideTimer = null);
      const t = parseInt(this.getAttribute("delay") ?? "200", 10);
      this.showTimer = setTimeout(() => this.show(), t);
    });
    a(this, "onLeave", () => {
      this.showTimer && (clearTimeout(this.showTimer), this.showTimer = null), this.hideTimer = setTimeout(() => this.hide(), 80);
    });
  }
  static get observedAttributes() {
    return [...l.observedAttributes, "content", "side", "delay"];
  }
  render() {
    return `
      <span class="lumina-tooltip" part="root">
        <slot></slot>
        <span class="lumina-tooltip__bubble" part="bubble" role="tooltip" aria-hidden="true">
          <span class="lumina-tooltip__glow" part="glow" aria-hidden="true"></span>
          <span class="lumina-tooltip__arrow" part="arrow" aria-hidden="true"></span>
          <span class="lumina-tooltip__content" part="content">
            <slot name="content">${this.getAttribute("content") ?? ""}</slot>
          </span>
        </span>
      </span>
    `;
  }
  styles() {
    return `
      :host {
        display: inline-block;
        position: relative;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }

      .lumina-tooltip {
        position: relative;
        display: inline-block;
      }

      .lumina-tooltip__bubble {
        position: absolute;
        z-index: 1000;
        padding: 8px 12px;
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.2));
        backdrop-filter: blur(18px) saturate(1.6);
        -webkit-backdrop-filter: blur(18px) saturate(1.6);
        border: 1px solid var(--lumina-border);
        box-shadow:
          0 10px 30px -10px rgb(0 0 0 / 0.5),
          inset 0 1px 0 rgb(255 255 255 / 0.08);
        font-size: 13px;
        font-weight: 500;
        color: var(--lumina-text);
        max-width: 260px;
        opacity: 0;
        pointer-events: none;
        transform: scale(0.85);
        transition:
          opacity var(--lumina-speed) var(--lumina-ease-out),
          transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lumina-tooltip__bubble[data-visible] {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1);
      }

      .lumina-tooltip__glow {
        position: absolute;
        inset: -8px;
        border-radius: inherit;
        background: radial-gradient(circle,
          rgb(var(--lumina-accent-rgb) / calc(0.4 * var(--lumina-intensity))),
          transparent 70%
        );
        filter: blur(12px);
        opacity: 0;
        z-index: -1;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lumina-tooltip__bubble[data-visible] .lumina-tooltip__glow { opacity: 1; }

      .lumina-tooltip__arrow {
        position: absolute;
        width: 10px;
        height: 10px;
        background: inherit;
        border: inherit;
        backdrop-filter: inherit;
        transform: rotate(45deg);
        z-index: -1;
      }

      .lumina-tooltip__content {
        position: relative;
        display: block;
      }

      /* Side variants — base position; JS adjusts at runtime */
      [data-side="top"] {
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%) scale(0.85);
        transform-origin: bottom center;
      }
      [data-side="top"][data-visible] { transform: translateX(-50%) scale(1); }

      [data-side="bottom"] {
        top: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%) scale(0.85);
        transform-origin: top center;
      }
      [data-side="bottom"][data-visible] { transform: translateX(-50%) scale(1); }

      [data-side="left"] {
        right: calc(100% + 10px);
        top: 50%;
        transform: translateY(-50%) scale(0.85);
        transform-origin: right center;
      }
      [data-side="left"][data-visible] { transform: translateY(-50%) scale(1); }

      [data-side="right"] {
        left: calc(100% + 10px);
        top: 50%;
        transform: translateY(-50%) scale(0.85);
        transform-origin: left center;
      }
      [data-side="right"][data-visible] { transform: translateY(-50%) scale(1); }

      /* Arrow positions per side */
      [data-side="top"] .lumina-tooltip__arrow {
        bottom: -5px;
        left: 50%;
        margin-left: -5px;
        border-top: none;
        border-left: none;
      }
      [data-side="bottom"] .lumina-tooltip__arrow {
        top: -5px;
        left: 50%;
        margin-left: -5px;
        border-bottom: none;
        border-right: none;
      }
      [data-side="left"] .lumina-tooltip__arrow {
        right: -5px;
        top: 50%;
        margin-top: -5px;
        border-left: none;
        border-bottom: none;
      }
      [data-side="right"] .lumina-tooltip__arrow {
        left: -5px;
        top: 50%;
        margin-top: -5px;
        border-right: none;
        border-top: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .lumina-tooltip__bubble { transition: none !important; }
      }
    `;
  }
  mounted() {
    this.bubble = this.$$(".lumina-tooltip__bubble"), this.arrow = this.$$(".lumina-tooltip__arrow");
    const t = this.getAttribute("side") ?? "top";
    this.bubble?.setAttribute("data-side", t), this.addEventListener("pointerenter", this.onEnter), this.addEventListener("pointerleave", this.onLeave), this.addEventListener("focusin", this.onEnter), this.addEventListener("focusout", this.onLeave);
  }
  unmounted() {
    this.removeEventListener("pointerenter", this.onEnter), this.removeEventListener("pointerleave", this.onLeave), this.removeEventListener("focusin", this.onEnter), this.removeEventListener("focusout", this.onLeave), this.showTimer && clearTimeout(this.showTimer), this.hideTimer && clearTimeout(this.hideTimer);
  }
  onConfigChange(t) {
  }
  show() {
    !this.bubble || this._visible || (this._visible = !0, this.bubble.setAttribute("data-visible", ""), this.bubble.setAttribute("aria-hidden", "false"), p() || this.reposition());
  }
  hide() {
    !this.bubble || !this._visible || (this._visible = !1, this.bubble.removeAttribute("data-visible"), this.bubble.setAttribute("aria-hidden", "true"));
  }
  /** Clamp the bubble inside the viewport, flipping the side if needed. */
  reposition() {
    if (!this.bubble) return;
    const t = this.bubble.getAttribute("data-side") ?? "top", e = this.bubble.getBoundingClientRect(), i = 8;
    let r = t;
    t === "top" && e.top < i && (r = "bottom"), t === "bottom" && e.bottom + i > window.innerHeight && (r = "top"), t === "left" && e.left < i && (r = "right"), t === "right" && e.right + i > window.innerWidth && (r = "left"), r !== t && this.bubble.setAttribute("data-side", r);
  }
}
a(ke, "tagName", "lumina-tooltip");
customElements.get(ke.tagName) || customElements.define(ke.tagName, ke);
class Ce extends l {
  constructor() {
    super(...arguments);
    a(this, "onClick", (t) => {
      const e = t.target.closest("li, [data-tree-node]");
      if (!e) return;
      const i = e.querySelector("ul, .lmtv__children");
      if (i) {
        const r = i.hasAttribute("data-expanded");
        r ? (i.removeAttribute("data-expanded"), e.removeAttribute("data-expanded")) : (i.setAttribute("data-expanded", ""), e.setAttribute("data-expanded", ""), e.setAttribute("data-expandable", "")), this.dispatchEvent(new CustomEvent("lumina-expand", { bubbles: !0, composed: !0, detail: { node: e.textContent?.trim(), expanded: !r } }));
      }
      this.querySelectorAll("[data-selected]").forEach((r) => r.removeAttribute("data-selected")), e.setAttribute("data-selected", ""), this.dispatchEvent(new CustomEvent("lumina-select", { bubbles: !0, composed: !0, detail: { value: e.textContent?.trim() } }));
    });
  }
  render() {
    return '<ul class="lmtv" part="tree" role="tree"><slot></slot></ul>';
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmtv { list-style: none; padding: 0; margin: 0; }
      ::slotted(ul), ::slotted(.lmtv__children) { list-style: none; padding-left: 20px; margin: 0; overflow: hidden; max-height: 0; opacity: 0; transition: max-height calc(var(--lumina-speed) * 1.5) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      ::slotted(ul[data-expanded]), ::slotted(.lmtv__children[data-expanded]) { max-height: 2000px; opacity: 1; }
      ::slotted(li), ::slotted([data-tree-node]) { position: relative; padding: 6px 12px 6px 28px; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background 0.2s; animation: lmtv-enter 0.3s var(--lumina-ease-out); }
      @keyframes lmtv-enter { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
      ::slotted(li:hover), ::slotted([data-tree-node]:hover) { background: rgb(var(--lumina-accent-rgb) / 0.1); }
      ::slotted(li[data-selected]), ::slotted([data-tree-node][data-selected]) { background: rgb(var(--lumina-accent-rgb) / 0.25); box-shadow: inset 2px 0 0 var(--lumina-accent); }
      ::slotted(li::before), ::slotted([data-tree-node])::before { content: ''; position: absolute; left: 12px; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: rgb(var(--lumina-accent-rgb) / 0.3); transform: translateY(-50%); transition: background 0.2s, box-shadow 0.2s; }
      ::slotted(li:hover::before), ::slotted([data-tree-node]:hover)::before { background: var(--lumina-accent); box-shadow: 0 0 6px var(--lumina-accent); }
      ::slotted([data-expandable]) { position: relative; }
      ::slotted([data-expandable])::after { content: '▸'; position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--lumina-text-muted); transition: transform 0.2s; }
      ::slotted([data-expanded][data-expandable])::after { transform: translateY(-50%) rotate(90deg); }
      :host([variant="minimal"]) ::slotted(li), :host([variant="minimal"]) ::slotted([data-tree-node]) { padding-left: 16px; }
      :host([variant="minimal"]) ::slotted(li::before), :host([variant="minimal"]) ::slotted([data-tree-node])::before { display: none; }
      @media (prefers-reduced-motion: reduce) { ::slotted(ul), ::slotted(.lmtv__children), ::slotted(li), ::slotted([data-tree-node]) { transition: none !important; animation: none !important; } }
    `;
  }
  mounted() {
    this.addEventListener("click", this.onClick);
  }
  unmounted() {
    this.removeEventListener("click", this.onClick);
  }
  onConfigChange(t) {
  }
}
a(Ce, "tagName", "lumina-tree-view");
customElements.get(Ce.tagName) || customElements.define(Ce.tagName, Ce);
class Ee extends l {
  constructor() {
    super(...arguments);
    a(this, "input", null);
    a(this, "micBtn", null);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "recording", !1);
    a(this, "raf", 0);
    a(this, "waveform", new Array(40).fill(0));
    a(this, "recognition", null);
    a(this, "toggleRecording", () => {
      this.recording ? this.stopRecording() : this.startRecording();
    });
    a(this, "drawWaveform", () => {
      if (!this.ctx || !this.canvas) {
        this.raf = requestAnimationFrame(this.drawWaveform);
        return;
      }
      const t = window.devicePixelRatio || 1, e = this.canvas.clientWidth, i = this.canvas.clientHeight;
      this.canvas.width !== e * t && (this.canvas.width = e * t, this.canvas.height = i * t, this.ctx.setTransform(t, 0, 0, t, 0, 0)), this.ctx.clearRect(0, 0, e, i), this.waveform.shift(), this.waveform.push(this.recording ? Math.random() * 0.8 + 0.2 : 0);
      const r = e / this.waveform.length, s = this.shadow.host.style.getPropertyValue("--lumina-accent").trim() || "#7c5cff";
      this.ctx.fillStyle = s;
      for (let n = 0; n < this.waveform.length; n++) {
        const u = this.waveform[n] * i * 0.8, m = n * r + r * 0.2, b = (i - u) / 2;
        this.ctx.fillRect(m, b, r * 0.6, u);
      }
      this.raf = requestAnimationFrame(this.drawWaveform);
    });
  }
  render() {
    return `
      <div class="lmvi" part="field">
        <div class="lmvi__shell" part="control">
          <div class="lmvi__bg" aria-hidden="true"></div>
          <input class="lmvi__el" type="text" placeholder="Fale ou digite..." />
          <button class="lmvi__mic" part="mic-button" type="button" aria-label="Falar">🎤</button>
        </div>
        <canvas class="lmvi__waveform" part="waveform" aria-hidden="true"></canvas>
      </div>
    `;
  }
  styles() {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmvi__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmvi__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmvi__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmvi__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); }
      .lmvi__el::placeholder { color: var(--lumina-text-muted); }
      .lmvi__mic { position: relative; z-index: 1; margin-right: 8px; appearance: none; border: 0; background: rgb(var(--lumina-accent-rgb) / 0.15); color: var(--lumina-accent); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.2s; }
      .lmvi__mic:hover { transform: scale(1.1); }
      .lmvi__mic[recording] { background: rgb(239 68 68 / 0.3); color: #f87171; animation: lmvi-pulse 1s ease-in-out infinite; }
      @keyframes lmvi-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgb(239 68 68 / 0.5); } 50% { box-shadow: 0 0 0 10px rgb(239 68 68 / 0); } }
      .lmvi__waveform { display: block; width: 100%; height: 40px; margin-top: 4px; opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmvi__waveform[data-active] { opacity: 1; }
    `;
  }
  mounted() {
    this.input = this.$$(".lmvi__el"), this.micBtn = this.$$(".lmvi__mic"), this.canvas = this.$$(".lmvi__waveform"), this.ctx = this.canvas?.getContext("2d") ?? null, this.micBtn?.addEventListener("click", this.toggleRecording);
  }
  unmounted() {
    cancelAnimationFrame(this.raf), this.recognition && this.recognition.stop();
  }
  onConfigChange(t) {
  }
  startRecording() {
    const t = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!t) {
      console.warn("Speech Recognition not supported");
      return;
    }
    this.recognition = new t(), this.recognition.lang = "pt-BR", this.recognition.interimResults = !0, this.recognition.continuous = !0, this.recognition.onstart = () => {
      this.recording = !0, this.micBtn?.setAttribute("recording", ""), this.canvas?.setAttribute("data-active", ""), this.raf = requestAnimationFrame(this.drawWaveform), this.dispatchEvent(new CustomEvent("lumina-voice-start", { bubbles: !0, composed: !0 }));
    }, this.recognition.onresult = (e) => {
      const i = Array.from(e.results).map((r) => r[0].transcript).join("");
      this.input && (this.input.value = i), this.dispatchEvent(new CustomEvent("lumina-transcript", { bubbles: !0, composed: !0, detail: { transcript: i } }));
    }, this.recognition.onend = () => {
      this.stopRecording();
    }, this.recognition.start();
  }
  stopRecording() {
    if (this.recording = !1, this.micBtn?.removeAttribute("recording"), this.canvas?.removeAttribute("data-active"), cancelAnimationFrame(this.raf), this.recognition)
      try {
        this.recognition.stop();
      } catch {
      }
    this.dispatchEvent(new CustomEvent("lumina-voice-end", { bubbles: !0, composed: !0 }));
  }
}
a(Ee, "tagName", "lumina-voice-input");
customElements.get(Ee.tagName) || customElements.define(Ee.tagName, Ee);
class Ae extends l {
  constructor() {
    super(...arguments);
    a(this, "canvas", null);
    a(this, "ctx", null);
    a(this, "particles", []);
    a(this, "raf", 0);
    a(this, "tick", () => {
      if (!this.ctx) {
        this.raf = requestAnimationFrame(this.tick);
        return;
      }
      const t = this.clientWidth || 300, e = this.clientHeight || 200, i = t / 2, r = e / 2;
      this.ctx.clearRect(0, 0, t, e);
      const s = this.shadow.host.style.getPropertyValue("--lumina-accent-rgb").trim() || "120 240 255";
      this.particles = this.particles.filter((n) => n.life < n.maxLife && n.radius > 2);
      for (const n of this.particles) {
        n.angle += 0.04, n.radius *= 0.985, n.life += 1, n.x = i + Math.cos(n.angle) * n.radius, n.y = r + Math.sin(n.angle) * n.radius;
        const d = (1 - n.life / n.maxLife) * 0.8;
        this.ctx.fillStyle = `rgba(${s} / ${d})`, this.ctx.beginPath(), this.ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2), this.ctx.fill();
      }
      for (; this.particles.length < 30; )
        this.particles.push({ x: i, y: r, angle: Math.random() * Math.PI * 2, radius: 20 + Math.random() * Math.max(t, e) * 0.6, life: 0, maxLife: 100 + Math.random() * 100, size: 0.5 + Math.random() * 1.5 });
      this.raf = requestAnimationFrame(this.tick);
    });
    a(this, "onMove", () => {
      this.dispatchEvent(new CustomEvent("lumina-hover", { bubbles: !0, composed: !0 }));
    });
  }
  render() {
    return `
      <article class="lmvc" part="card">
        <div class="lmvc__portal" part="portal" aria-hidden="true"></div>
        <canvas class="lmvc__canvas" aria-hidden="true"></canvas>
        <div class="lmvc__surface" part="surface">
          <slot></slot>
        </div>
      </article>
    `;
  }
  styles() {
    return `
      :host { display: block; position: relative; border-radius: var(--lumina-radius-lg); color: var(--lumina-text); }
      .lmvc { position: relative; display: block; border-radius: inherit; overflow: hidden; min-height: 200px; }
      .lmvc__portal { position: absolute; top: 50%; left: 50%; width: 80%; height: 80%; transform: translate(-50%, -50%); border-radius: 50%; background: conic-gradient(from 0deg, transparent 0%, rgb(var(--lumina-accent-rgb) / 0.3) 15%, transparent 30%, rgb(var(--lumina-accent-rgb) / 0.5) 50%, transparent 70%, rgb(var(--lumina-accent-rgb) / 0.3) 85%, transparent 100%); filter: blur(20px); animation: lmvc-spin 12s linear infinite; pointer-events: none; z-index: 0; }
      @keyframes lmvc-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
      .lmvc__canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
      .lmvc__surface { position: relative; z-index: 2; border-radius: inherit; background: rgb(0 0 0 / 0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.2); box-shadow: inset 0 0 40px rgb(0 0 0 / 0.5), var(--lumina-shadow); padding: 24px; min-height: 200px; }
      :host([variant="dimensional"]) .lmvc__surface { background: rgb(0 0 0 / 0.7); border-color: rgb(var(--lumina-accent-rgb) / 0.3); }
      :host([variant="deep"]) .lmvc__surface { background: rgb(0 0 0 / 0.85); }
      :host([variant="deep"]) .lmvc__portal { animation-duration: 8s; }
      :host(:hover) .lmvc__portal { animation-duration: 4s; }
      @media (prefers-reduced-motion: reduce) { .lmvc__portal { animation: none !important; } }
    `;
  }
  mounted() {
    this.canvas = this.$$(".lmvc__canvas"), this.ctx = this.canvas?.getContext("2d") ?? null, p() || (this.spawnParticles(), this.raf = requestAnimationFrame(this.tick)), this.addEventListener("pointermove", this.onMove);
  }
  unmounted() {
    cancelAnimationFrame(this.raf), this.removeEventListener("pointermove", this.onMove);
  }
  onConfigChange(t) {
  }
  spawnParticles() {
    if (!this.ctx || !this.canvas) return;
    const t = window.devicePixelRatio || 1, e = this.clientWidth || 300, i = this.clientHeight || 200;
    this.canvas.width = e * t, this.canvas.height = i * t, this.canvas.style.width = `${e}px`, this.canvas.style.height = `${i}px`, this.ctx.setTransform(t, 0, 0, t, 0, 0);
    for (let r = 0; r < 30; r++)
      this.particles.push({
        x: e / 2,
        y: i / 2,
        angle: Math.random() * Math.PI * 2,
        radius: 20 + Math.random() * Math.max(e, i) * 0.6,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
        size: 0.5 + Math.random() * 1.5
      });
  }
}
a(Ae, "tagName", "lumina-void-card");
customElements.get(Ae.tagName) || customElements.define(Ae.tagName, Ae);
export {
  fi as DEFAULT_CONFIG,
  Qe as DEPTH_PX,
  Ie as DEPTH_VALUES,
  Ze as INTENSITY_MULTIPLIERS,
  Le as INTENSITY_VALUES,
  l as LuminaElement,
  k as ParticleField,
  Me as THEME_VALUES,
  h as TOKENS,
  Ne as TRIGGER_VALUES,
  Se as VARIANT_VALUES,
  Ge as buildBaseStylesheet,
  v as clamp,
  f as coerceAttr,
  ai as createHiDPICanvas,
  ii as depthToPx,
  y as intensityToMultiplier,
  xi as lerp,
  ti as parseColor,
  p as prefersReducedMotion,
  yi as qs,
  g as randRange,
  Je as resolveTheme,
  _i as rgbToString,
  wi as springEase,
  w as throttle,
  ei as toRgbTriplet
};
//# sourceMappingURL=lumina-ui.js.map
