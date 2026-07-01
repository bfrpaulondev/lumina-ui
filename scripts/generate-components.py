#!/usr/bin/env python3
"""
LuminaUI — Component generator.

Reads demo/data/manifest.ts, parses the COMPONENTS array, and generates
a TypeScript Web Component file for every component marked tier='stub'.

Components marked tier='full' are skipped (they already have a hand-written
implementation in src/components/).

Output: src/components/<tag>.ts for each generated component.
"""

import json
import re
import os
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]  # /home/z/my-project/lumina-ui
MANIFEST = ROOT / 'demo/data/manifest.ts'
OUT_DIR = ROOT / 'src/components'

# ---------------------------------------------------------------
# Manifest parser — extract the COMPONENTS array as JSON
# ---------------------------------------------------------------

def parse_manifest() -> list:
    text = MANIFEST.read_text(encoding='utf-8')
    m = re.search(r'export const COMPONENTS:\s*ComponentSpec\[\]\s*=\s*\[(.*?)\n\];', text, re.DOTALL)
    if not m:
        raise RuntimeError('Could not locate COMPONENTS array in manifest.ts')
    body = m.group(1)
    objects = []
    depth = 0
    start = None
    in_string = False
    string_char = None
    for i, c in enumerate(body):
        if in_string:
            if c == string_char and body[i-1] != '\\':
                in_string = False
            continue
        if c in ('"', "'"):
            in_string = True
            string_char = c
            continue
        if c == '{':
            if depth == 0:
                start = i
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0 and start is not None:
                objects.append(body[start:i+1])
                start = None

    parsed = []
    for obj in objects:
        # Convert JS object syntax to JSON
        s = obj
        # 1. Quote unquoted keys (e.g. `name:` -> `"name":`)
        s = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)', r'\1"\2"\3', s)
        # 2. Convert single-quoted strings to double-quoted
        # We need to handle escapes carefully. Use a function.
        def fix_quotes(match):
            content = match.group(1)
            # Escape any double quotes inside, then unescape single quotes
            content = content.replace('\\"', '"').replace('"', '\\"')
            return '"' + content + '"'
        s = re.sub(r"'([^']*)'", fix_quotes, s)
        # 3. Remove trailing commas before } or ]
        s = re.sub(r',(\s*[}\]])', r'\1', s)
        try:
            parsed.append(json.loads(s))
        except json.JSONDecodeError as e:
            print(f'WARN: Failed to parse object: {e}')
            print(s[:300])
    return parsed

# ---------------------------------------------------------------
# Templates
# ---------------------------------------------------------------

def build_mounted(spec):
    name = spec['name']
    events = spec.get('events', []) or []
    handlers = []
    cat = spec['category']
    props = spec.get('props', []) or []
    # Detect if the component has an `open` prop — if so, skip the open() method
    # to avoid duplicate identifier. We'll only add open() for overlay components
    # that don't already declare an `open` attribute as a prop.
    has_open_prop = any(p['name'] == 'open' for p in props)

    if cat == 'buttons':
        handlers.append('    const btn = this.$$(\'.lmc\');')
        handlers.append('    btn?.addEventListener(\'click\', () => this.emit(\'lumina-click\'));')
        handlers.append('    btn?.addEventListener(\'focus\', () => this.emit(\'lumina-focus\'));')
        handlers.append('    btn?.addEventListener(\'blur\', () => this.emit(\'lumina-blur\'));')
        handlers.append('    btn?.addEventListener(\'pointerenter\', () => this.emit(\'lumina-hover-start\'));')
        handlers.append('    btn?.addEventListener(\'pointerleave\', () => this.emit(\'lumina-hover-end\'));')
    elif cat == 'feedback':
        if 'lumina-dismiss' in events or 'lumina-remove' in events or name in ('LuminaToast', 'LuminaAlert', 'LuminaChip'):
            handlers.append('    this.$$(\'.lmc__close, .lmc__remove, .lmc__action\')?.addEventListener(\'click\', () => this.emit(\'lumina-dismiss\'));')
    elif cat == 'overlays':
        if 'Modal' in name or 'Dialog' in name or 'Drawer' in name:
            handlers.append('    this.$$(\'.lmc\')?.addEventListener(\'click\', (e) => {')
            handlers.append('      if (e.target === this.$$(\'.lmc\')) { this.emit(\'lumina-backdrop-click\'); if (this.getAttribute(\'close-on-backdrop\') !== \'false\') this.close(); }')
            handlers.append('    });')

    body = '\n'.join(handlers) if handlers else '    // (no specific handlers — interactivity is CSS-driven)'

    # Add open/close helpers — but skip the open() method when `open` is declared
    # as a prop (would collide with the typed getter/setter). close() is always safe.
    overlay_helpers = ''
    if not has_open_prop:
        overlay_helpers = '''

  /** For overlay-style components: open/close helpers. */
  public open(): void {
    this.setAttribute('open', '');
    this.setAttribute('data-open', '');
    this.emit('lumina-open');
  }
  public close(): void {
    this.removeAttribute('open');
    this.removeAttribute('data-open');
    this.emit('lumina-close');
  }'''
    else:
        overlay_helpers = '''

  /** Close helper for overlay-style components. */
  public close(): void {
    this.removeAttribute('open');
    this.removeAttribute('data-open');
    this.emit('lumina-close');
  }
  /** Open helper for overlay-style components. */
  public show(): void {
    this.setAttribute('open', '');
    this.setAttribute('data-open', '');
    this.emit('lumina-open');
  }'''

    return f'''  protected mounted(): void {{
{body}
  }}

  protected unmounted(): void {{
    // Listeners auto-cleaned by the host element removal.
  }}

  protected onConfigChange(_changed: any): void {{
    // Variants are CSS-driven; nothing to rebind here.
  }}

  /** Dispatch a CustomEvent with composed bubbling. */
  private emit(name: string, detail?: unknown): void {{
    this.dispatchEvent(new CustomEvent(name, {{ bubbles: true, composed: true, detail }}));
  }}{overlay_helpers}'''

def build_props_handling(spec):
    props = spec.get('props', []) or []
    if not props:
        return ''
    # Skip props that collide with LuminaElement built-ins (depth, etc.)
    # — those are already typed on the base class.
    skip = {'depth', 'variant', 'intensity', 'theme', 'speed', 'accentColor', 'accent-color'}
    lines = []
    for p in props:
        name = p['name']
        if name in skip:
            continue
        ts_type = p['type']
        default = p.get('default')
        is_bool = ts_type == 'boolean'
        is_num = ts_type == 'number'
        if is_bool:
            lines.append(f'''  get {name}(): boolean {{
    return this.hasAttribute('{name}');
  }}
  set {name}(v: boolean) {{
    if (v) this.setAttribute('{name}', '');
    else this.removeAttribute('{name}');
  }}''')
        elif is_num:
            default_str = default if default else '0'
            default_str = str(default_str).strip('"').strip("'")
            lines.append(f'''  get {name}(): number {{
    return parseFloat(this.getAttribute('{name}') ?? '{default_str}') || 0;
  }}
  set {name}(v: number) {{
    this.setAttribute('{name}', String(v));
  }}''')
        else:
            default_str = default if default else ''
            default_str = str(default_str).strip('"').strip("'")
            if default_str:
                lines.append(f'''  get {name}(): string {{
    return this.getAttribute('{name}') ?? '{default_str}';
  }}
  set {name}(v: string) {{
    this.setAttribute('{name}', v);
  }}''')
            else:
                lines.append(f'''  get {name}(): string {{
    return this.getAttribute('{name}') ?? '';
  }}
  set {name}(v: string) {{
    this.setAttribute('{name}', v);
  }}''')
    return '\n'.join(lines)

def build_observed_attrs(spec):
    props = spec.get('props', []) or []
    if not props:
        return '  static get observedAttributes(): string[] {\n    return [...LuminaElement.observedAttributes];\n  }'
    prop_names = [p['name'] for p in props]
    quoted = ', '.join(json.dumps(n) for n in prop_names)
    return (
        '  static get observedAttributes(): string[] {\n'
        f'    return [...LuminaElement.observedAttributes, {quoted}];\n'
        '  }'
    )

def build_render(spec):
    cat = spec['category']
    if cat == 'buttons':
        return build_render_button(spec)
    if cat == 'cards':
        return build_render_card(spec)
    if cat == 'inputs':
        return build_render_input(spec)
    if cat == 'navigation':
        return build_render_nav(spec)
    if cat == 'feedback':
        return build_render_feedback(spec)
    if cat == 'overlays':
        return build_render_overlay(spec)
    if cat == 'data':
        return build_render_data(spec)
    return build_render_unique(spec)

def build_render_button(spec):
    parts = spec.get('parts', [])
    has_label_slot = 'default' in (spec.get('slots', []) or ['default'])
    label_html = '<slot></slot>' if has_label_slot else ''
    parts_html = ''
    if 'glow' in parts:
        parts_html += '\n        <span class="lmc__glow" part="glow" aria-hidden="true"></span>'
    if 'particles' in parts or 'network' in parts:
        parts_html += '\n        <span class="lmc__particles" part="particles" aria-hidden="true"></span>'
    if 'ring' in parts:
        parts_html += '\n        <span class="lmc__ring" part="ring" aria-hidden="true"></span>'
    if 'ripple' in parts:
        parts_html += '\n        <span class="lmc__ripple" part="ripple" aria-hidden="true"></span>'
    if 'echo' in parts:
        parts_html += '\n        <span class="lmc__echo" part="echo" aria-hidden="true"></span>'
    if 'portal' in parts:
        parts_html += '\n        <span class="lmc__portal" part="portal" aria-hidden="true"></span>'
    return f'''  protected render(): string {{
    return `
      <button class="lmc" part="button" tabindex="0">
        <span class="lmc__bg" aria-hidden="true"></span>{parts_html}
        <span class="lmc__label" part="label">{label_html}</span>
      </button>
    `;
  }}'''

def build_render_card(spec):
    slots = spec.get('slots', []) or ['default']
    slot_html = ''
    if 'header' in slots:
        slot_html += '\n        <div class="lmc__header" part="header"><slot name="header"></slot></div>'
    if 'media' in slots:
        slot_html += '\n        <div class="lmc__media" part="media"><slot name="media"></slot></div>'
    if 'default' in slots:
        slot_html += '\n        <div class="lmc__body" part="body"><slot></slot></div>'
    if 'footer' in slots:
        slot_html += '\n        <div class="lmc__footer" part="footer"><slot name="footer"></slot></div>'
    return f'''  protected render(): string {{
    return `
      <article class="lmc" part="card">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__surface" part="surface">{slot_html}
        </div>
      </article>
    `;
  }}'''

def build_render_input(spec):
    return '''  protected render(): string {
    return `
      <label class="lmc" part="field">
        <span class="lmc__label" part="label"><slot name="label"></slot></span>
        <span class="lmc__shell" part="control">
          <span class="lmc__bg" aria-hidden="true"></span>
          <span class="lmc__glow" part="glow" aria-hidden="true"></span>
          <slot name="left-icon"></slot>
          <input class="lmc__el" part="control" type="text" />
          <slot name="right-icon"></slot>
          <span class="lmc__echo" part="echo" aria-hidden="true"></span>
        </span>
      </label>
    `;
  }'''

def build_render_nav(spec):
    return '''  protected render(): string {
    return `
      <nav class="lmc" part="bar">
        <div class="lmc__glow" part="glow" aria-hidden="true"></div>
        <div class="lmc__inner"><slot></slot></div>
      </nav>
    `;
  }'''

def build_render_feedback(spec):
    name = spec['name']
    if name == 'LuminaToast':
        return '''  protected render(): string {
    return `
      <div class="lmc" part="toast" role="alert">
        <span class="lmc__icon" part="icon" aria-hidden="true">●</span>
        <span class="lmc__msg" part="message"><slot></slot></span>
        <button class="lmc__action" part="action" aria-label="Dismiss">×</button>
      </div>
    `;
  }'''
    if name == 'LuminaAlert':
        return '''  protected render(): string {
    return `
      <div class="lmc" part="alert" role="alert">
        <span class="lmc__icon" part="icon" aria-hidden="true">!</span>
        <div class="lmc__content">
          <slot name="title"><span class="lmc__title" part="title">Alert</span></slot>
          <p class="lmc__msg" part="message"><slot></slot></p>
        </div>
        <button class="lmc__close" part="close" aria-label="Dismiss">×</button>
      </div>
    `;
  }'''
    if name == 'LuminaSkeleton':
        return '''  protected render(): string {
    return `
      <div class="lmc lmc--skeleton" part="skeleton" aria-hidden="true"></div>
    `;
  }'''
    if name == 'LuminaLoading':
        return '''  protected render(): string {
    return `
      <div class="lmc" part="loader">
        <span class="lmc__ring" part="ring" aria-hidden="true"></span>
        <span class="lmc__core" part="core" aria-hidden="true"></span>
      </div>
    `;
  }'''
    if name == 'LuminaSpinner':
        return '''  protected render(): string {
    return `
      <div class="lmc" part="spinner" role="status" aria-label="Loading">
        <span class="lmc__particles" part="particles" aria-hidden="true"></span>
      </div>
    `;
  }'''
    if name == 'LuminaStatusIndicator':
        return '''  protected render(): string {
    return `
      <span class="lmc" part="root">
        <span class="lmc__dot" part="dot" aria-hidden="true"></span>
        <span class="lmc__pulse" part="pulse" aria-hidden="true"></span>
        <span class="lmc__label" part="label"><slot></slot></span>
      </span>
    `;
  }'''
    if name == 'LuminaNotificationBadge':
        return '''  protected render(): string {
    return `
      <span class="lmc" part="root">
        <slot></slot>
        <span class="lmc__badge" part="badge">
          <span class="lmc__count" part="count">0</span>
        </span>
      </span>
    `;
  }'''
    if name == 'LuminaPulseIndicator':
        return '''  protected render(): string {
    return `
      <span class="lmc" part="root">
        <span class="lmc__dot" part="dot" aria-hidden="true"></span>
        <span class="lmc__pulse" part="pulse" aria-hidden="true"></span>
      </span>
    `;
  }'''
    if name == 'LuminaNeuralLoader':
        return '''  protected render(): string {
    return `
      <div class="lmc" part="loader" role="status" aria-label="Loading">
        <canvas class="lmc__network" part="network" aria-hidden="true"></canvas>
      </div>
    `;
  }'''
    return '''  protected render(): string {
    return `
      <span class="lmc" part="chip">
        <span class="lmc__label" part="label"><slot></slot></span>
        <button class="lmc__remove" part="remove" aria-label="Remove">×</button>
      </span>
    `;
  }'''

def build_render_overlay(spec):
    name = spec['name']
    if name == 'LuminaDrawerModal':
        return '''  protected render(): string {
    return `
      <div class="lmc" part="backdrop" aria-hidden="true"></div>
      <aside class="lmc__panel" part="panel" role="dialog" aria-modal="true">
        <header class="lmc__header" part="header"><slot name="title">Drawer</slot></header>
        <div class="lmc__content" part="content"><slot></slot></div>
      </aside>
    `;
  }'''
    if name in ('LuminaDialog', 'LuminaConfirmationDialog'):
        return '''  protected render(): string {
    return `
      <div class="lmc" part="backdrop" aria-hidden="true"></div>
      <div class="lmc__dialog" part="dialog" role="dialog" aria-modal="true">
        <header class="lmc__header" part="header"><slot name="title">Dialog</slot></header>
        <div class="lmc__body" part="body"><slot></slot></div>
      </div>
    `;
  }'''
    if name in ('LuminaPopover', 'LuminaContextMenu'):
        return '''  protected render(): string {
    return `
      <span class="lmc" part="root">
        <slot></slot>
        <div class="lmc__pop" part="content" role="menu">
          <span class="lmc__arrow" part="arrow" aria-hidden="true"></span>
          <slot name="content"></slot>
        </div>
      </span>
    `;
  }'''
    if name == 'LuminaLightbox':
        return '''  protected render(): string {
    return `
      <div class="lmc" part="backdrop" aria-hidden="true"></div>
      <div class="lmc__img-wrap" part="image">
        <img class="lmc__img" />
      </div>
      <div class="lmc__controls" part="controls">
        <button aria-label="Previous">‹</button>
        <button aria-label="Next">›</button>
        <button aria-label="Close">×</button>
      </div>
      <div class="lmc__caption" part="caption"><slot name="caption"></slot></div>
    `;
  }'''
    if name == 'LuminaImageZoom':
        return '''  protected render(): string {
    return `
      <div class="lmc" part="container">
        <img class="lmc__img" part="image" />
        <div class="lmc__controls" part="controls">
          <button aria-label="Zoom in">+</button>
          <button aria-label="Zoom out">−</button>
        </div>
      </div>
    `;
  }'''
    if name == 'LuminaFullscreenOverlay':
        return '''  protected render(): string {
    return `
      <div class="lmc" part="overlay">
        <div class="lmc__backdrop" part="backdrop" aria-hidden="true"></div>
        <div class="lmc__content" part="content"><slot></slot></div>
      </div>
    `;
  }'''
    return '''  protected render(): string {
    return `<div class="lmc" part="root"><slot></slot></div>`;
  }'''

def build_render_data(spec):
    name = spec['name']
    if name in ('LuminaTable', 'LuminaDataGrid'):
        return '''  protected render(): string {
    return `
      <div class="lmc" part="root">
        <table class="lmc__table" part="table">
          <thead class="lmc__head" part="head"><slot name="head"></slot></thead>
          <tbody class="lmc__body"><slot></slot></tbody>
        </table>
      </div>
    `;
  }'''
    if name == 'LuminaList':
        return '''  protected render(): string {
    return `<ul class="lmc" part="list"><slot></slot></ul>`;
  }'''
    if name == 'LuminaGrid':
        return '''  protected render(): string {
    return `<div class="lmc" part="grid"><slot></slot></div>`;
  }'''
    if name == 'LuminaAvatar':
        return '''  protected render(): string {
    return `
      <span class="lmc" part="avatar">
        <img class="lmc__img" part="image" />
        <span class="lmc__fallback" part="fallback"></span>
        <span class="lmc__status" part="status" aria-hidden="true"></span>
      </span>
    `;
  }'''
    if name == 'LuminaAvatarGroup':
        return '''  protected render(): string {
    return `<span class="lmc" part="group"><slot></slot><span class="lmc__overflow" part="overflow">+N</span></span>`;
  }'''
    if name == 'LuminaTimeline':
        return '''  protected render(): string {
    return `<ol class="lmc" part="timeline"><slot></slot></ol>`;
  }'''
    if name == 'LuminaTreeView':
        return '''  protected render(): string {
    return `<ul class="lmc" part="tree" role="tree"><slot></slot></ul>`;
  }'''
    return '''  protected render(): string {
    return `<div class="lmc" part="root"><slot></slot></div>`;
  }'''

def build_render_unique(spec):
    return '''  protected render(): string {
    return `
      <div class="lmc" part="root">
        <div class="lmc__core" part="core"><slot></slot></div>
        <canvas class="lmc__canvas" part="canvas" aria-hidden="true"></canvas>
      </div>
    `;
  }'''

# CSS blocks (kept compact)

BUTTON_BASE_CSS = """
      :host {
        display: inline-block;
        cursor: pointer;
        outline: none;
        border-radius: var(--lumina-radius-pill);
        font-family: var(--lumina-font-sans);
        font-weight: 600;
        font-size: 14px;
        color: var(--lumina-text);
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      :host([disabled]) { cursor: not-allowed; opacity: 0.45; filter: saturate(0.4); }
      .lmc {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 44px;
        padding: 0 22px;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        border-radius: inherit;
        overflow: hidden;
        cursor: pointer;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring),
                    box-shadow var(--lumina-speed) var(--lumina-ease-out);
        will-change: transform;
        isolation: isolate;
      }
      .lmc:focus-visible { outline: 2px solid var(--lumina-accent); outline-offset: 4px; }
      .lmc__bg {
        position: absolute; inset: 0;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
        border-radius: inherit;
        z-index: 0;
      }
      .lmc__glow {
        position: absolute; inset: -20%;
        border-radius: inherit;
        pointer-events: none; z-index: 0;
        opacity: 0;
        background: radial-gradient(60% 60% at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.45), transparent 70%);
        filter: blur(20px);
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmc__label { position: relative; z-index: 2; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
      :host(:hover) .lmc { transform: translateY(-2px) scale(1.02); }
      :host(:hover) .lmc__glow { opacity: calc(0.6 * var(--lumina-intensity)); }
      :host(:active) .lmc { transform: translateY(0) scale(0.97); }
      @media (prefers-reduced-motion: reduce) {
        .lmc, .lmc__glow { animation: none !important; transition: none !important; }
      }
"""

CARD_BASE_CSS = """
      :host {
        display: block;
        position: relative;
        border-radius: var(--lumina-radius-lg);
        color: var(--lumina-text);
        perspective: 800px;
      }
      .lmc {
        position: relative;
        display: block;
        border-radius: inherit;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
        will-change: transform;
      }
      .lmc__glow {
        position: absolute; inset: -10%;
        border-radius: inherit;
        pointer-events: none; z-index: 0;
        opacity: 0;
        background: radial-gradient(400px circle at var(--lx, 50%) var(--ly, 50%),
          rgb(var(--lumina-accent-rgb) / calc(0.45 * var(--lumina-intensity))), transparent 60%);
        filter: blur(30px);
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lmc__glow { opacity: 1; }
      :host(:hover) .lmc { transform: translateY(-4px); }
      .lmc__surface {
        position: relative; z-index: 2;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(18px) saturate(1.5);
        -webkit-backdrop-filter: blur(18px) saturate(1.5);
        border: 1px solid var(--lumina-border);
        box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow);
        overflow: hidden;
      }
      .lmc__header { padding: 16px 20px; border-bottom: 1px solid var(--lumina-border); }
      .lmc__media { display: block; }
      .lmc__body { padding: 20px; }
      .lmc__footer { padding: 12px 20px; border-top: 1px solid var(--lumina-border); }
      ::slotted([slot="header"]) { margin: 0; font-size: 16px; font-weight: 700; }
      @media (prefers-reduced-motion: reduce) {
        .lmc, .lmc__glow { animation: none !important; transition: none !important; }
      }
"""

INPUT_BASE_CSS = """
      :host {
        display: block;
        --lumina-input-h: 48px;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc { display: flex; flex-direction: column; gap: 6px; }
      .lmc__label { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--lumina-text-muted); }
      .lmc__label:empty { display: none; }
      .lmc__shell {
        position: relative;
        display: flex;
        align-items: center;
        height: var(--lumina-input-h);
        border-radius: var(--lumina-radius-md);
        overflow: hidden;
      }
      .lmc__bg {
        position: absolute; inset: 0;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(12px) saturate(1.3);
        -webkit-backdrop-filter: blur(12px) saturate(1.3);
        border: 1px solid var(--lumina-border);
        box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow);
        transition: border-color var(--lumina-speed) var(--lumina-ease-out);
      }
      .lmc__glow {
        position: absolute; inset: -2px;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        background: conic-gradient(from 0deg, transparent 0%, var(--lumina-accent) 25%, transparent 50%, var(--lumina-accent) 75%, transparent 100%);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        padding: 2px;
        animation: lmc-spin 4s linear infinite;
        animation-play-state: paused;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:focus-within) .lmc__glow { opacity: 0.7; animation-play-state: running; }
      :host(:focus-within) .lmc__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmc__el {
        position: relative; z-index: 2;
        width: 100%; height: 100%;
        padding: 0 16px;
        border: 0; background: transparent;
        color: var(--lumina-text);
        font: inherit;
        font-size: 14px;
        outline: none;
        caret-color: var(--lumina-accent);
      }
      .lmc__el::placeholder { color: var(--lumina-text-muted); }
      .lmc__echo { position: absolute; inset: 0; pointer-events: none; }
      @keyframes lmc-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) {
        .lmc__glow, .lmc__bg { animation: none !important; transition: none !important; }
      }
"""

NAV_BASE_CSS = """
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
"""

FEEDBACK_BASE_CSS = """
      :host {
        display: inline-flex;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: var(--lumina-radius-pill);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid var(--lumina-border);
        font-size: 13px; font-weight: 600;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.08), var(--lumina-shadow);
      }
      .lmc__dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: var(--lumina-accent);
        box-shadow: 0 0 8px var(--lumina-accent);
      }
      .lmc__pulse {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
      }
      :host([variant="pulse"]) .lmc__dot,
      :host([variant="aura"]) .lmc__dot,
      :host([variant="online"]) .lmc__dot {
        animation: lmc-pulse 1.6s ease-in-out infinite;
      }
      @keyframes lmc-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.6; }
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc, .lmc__dot, .lmc__pulse { animation: none !important; transition: none !important; }
      }
"""

OVERLAY_BASE_CSS = """
      :host {
        display: contents;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        position: fixed; inset: 0;
        background: rgb(0 0 0 / 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        opacity: 0;
        transition: opacity calc(var(--lumina-speed) * 1.2) var(--lumina-ease-out);
        z-index: 1000;
      }
      :host([data-open]) .lmc,
      :host([open]) .lmc { opacity: 1; }
      @media (prefers-reduced-motion: reduce) {
        .lmc { transition: none !important; }
      }
"""

DATA_BASE_CSS = """
      :host {
        display: block;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
      }
      .lmc {
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
        overflow: hidden;
      }
      ::slotted(*) { padding: 12px 16px; border-bottom: 1px solid var(--lumina-border); }
      ::slotted(*:last-child) { border-bottom: 0; }
      @media (prefers-reduced-motion: reduce) {
        * { transition: none !important; animation: none !important; }
      }
"""

UNIQUE_BASE_CSS = """
      :host {
        display: block;
        position: relative;
        font-family: var(--lumina-font-sans);
        color: var(--lumina-text);
        border-radius: var(--lumina-radius-lg);
        overflow: hidden;
        min-height: 200px;
      }
      .lmc {
        position: relative;
        width: 100%; height: 100%;
        border-radius: inherit;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(16px) saturate(1.4);
        -webkit-backdrop-filter: blur(16px) saturate(1.4);
        border: 1px solid var(--lumina-border);
      }
      .lmc__core {
        position: relative; z-index: 2;
        padding: 24px;
      }
      .lmc__canvas {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.7;
      }
      @media (prefers-reduced-motion: reduce) {
        .lmc, .lmc__canvas { transition: none !important; animation: none !important; }
      }
"""

def build_styles(spec):
    cat = spec['category']
    if cat == 'buttons':
        extra = ''
        variants = spec.get('variants', [])
        if 'void' in variants:
            extra += """
      :host([variant="void"]) .lmc__bg { background: rgb(0 0 0 / 0.6); border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host([variant="void"]) .lmc__label { color: var(--lumina-accent); text-shadow: -1px 0 1px rgb(255 0 80 / 0.6), 1px 0 1px rgb(0 200 255 / 0.6); }
"""
        if 'morph' in variants:
            extra += """
      :host([variant="morph"]) .lmc {
        clip-path: polygon(12% 0, 88% 0, 100% 30%, 100% 70%, 88% 100%, 12% 100%, 0 70%, 0 30%);
        transition: clip-path var(--lumina-speed) var(--lumina-ease-spring), transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([variant="morph"]:hover) .lmc { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
"""
        if 'dimensional' in variants:
            extra += """
      :host([variant="dimensional"]) .lmc__bg {
        box-shadow: 0 calc(var(--lumina-depth) * 0.6) 0 calc(var(--lumina-depth) * -0.4) rgb(var(--lumina-accent-rgb) / 0.5), var(--lumina-shadow);
      }
      :host([variant="dimensional"]:hover) .lmc { transform: perspective(400px) rotateX(8deg) translateZ(calc(var(--lumina-depth) * 0.5)); }
"""
        if 'minimal' in variants:
            extra += """
      :host([variant="minimal"]) .lmc__bg { background: transparent; backdrop-filter: none; border-color: transparent; }
      :host([variant="minimal"]:hover) .lmc__bg { background: rgb(var(--lumina-accent-rgb) / 0.1); }
"""
        if 'aura' in variants:
            extra += """
      :host([variant="aura"]) .lmc { animation: lmc-float 4s ease-in-out infinite; }
      :host([variant="aura"]) .lmc__glow { opacity: calc(0.3 * var(--lumina-intensity)); }
      @keyframes lmc-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
"""
        if 'extended' in variants:
            extra += """
      :host([variant="extended"]) .lmc { padding: 0 22px; height: 56px; border-radius: var(--lumina-radius-pill); }
"""
        return f'  protected styles(): string {{\n    return `{BUTTON_BASE_CSS}{extra}`;\n  }}'
    if cat == 'cards':
        extra = ''
        variants = spec.get('variants', [])
        if 'morph' in variants:
            extra += """
      :host([variant="morph"]) .lmc { clip-path: polygon(0 8%, 8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%); border-radius: 0; }
"""
        if 'void' in variants or 'deep' in variants:
            extra += """
      :host([variant="void"]) .lmc__surface, :host([variant="deep"]) .lmc__surface {
        background: rgb(0 0 0 / 0.55); backdrop-filter: blur(6px);
      }
"""
        if 'dimensional' in variants or 'extrude' in variants:
            extra += """
      :host([variant="dimensional"]) .lmc__surface, :host([variant="extrude"]) .lmc__surface {
        box-shadow: 0 calc(var(--lumina-depth) * 0.5) 0 calc(var(--lumina-depth) * -0.3) rgb(var(--lumina-accent-rgb) / 0.4), var(--lumina-shadow);
      }
"""
        if 'holo' in variants:
            extra += """
      :host([variant="holo"]) .lmc__surface {
        background: linear-gradient(135deg, rgb(255 0 128 / 0.18), rgb(0 200 255 / 0.18));
        border-color: rgb(255 255 255 / 0.2);
      }
"""
        return f'  protected styles(): string {{\n    return `{CARD_BASE_CSS}{extra}`;\n  }}'
    if cat == 'inputs':
        return f'  protected styles(): string {{\n    return `{INPUT_BASE_CSS}`;\n  }}'
    if cat == 'navigation':
        return f'  protected styles(): string {{\n    return `{NAV_BASE_CSS}`;\n  }}'
    if cat == 'feedback':
        return f'  protected styles(): string {{\n    return `{FEEDBACK_BASE_CSS}`;\n  }}'
    if cat == 'overlays':
        return f'  protected styles(): string {{\n    return `{OVERLAY_BASE_CSS}`;\n  }}'
    if cat == 'data':
        return f'  protected styles(): string {{\n    return `{DATA_BASE_CSS}`;\n  }}'
    return f'  protected styles(): string {{\n    return `{UNIQUE_BASE_CSS}`;\n  }}'

def build_component_file(spec):
    name = spec['name']
    tag = spec['tag']
    description = spec.get('description', '')
    variants = spec.get('variants', [])
    events = spec.get('events', []) or []
    parts = spec.get('parts', [])
    props = spec.get('props', []) or []
    slots = spec.get('slots', []) or []
    tagline = spec.get('tagline', '')

    props_handling = build_props_handling(spec)
    observed_attrs = build_observed_attrs(spec)
    render_body = build_render(spec)
    styles_body = build_styles(spec)
    mounted_body = build_mounted(spec)

    events_doc = '\n   * '.join(events) if events else '(none — inherits standard)'
    parts_doc = ', '.join(parts) if parts else '(none)'
    variants_doc = ' | '.join(f'`{v}`' for v in variants)
    props_doc = ', '.join(f'`{p["name"]}`' for p in props) if props else '(none beyond shared)'
    slots_doc = ', '.join(f'`{s}`' for s in slots) if slots else '(none)'

    class_name = name.replace('Lumina', '')

    file = f'''/**
 * {name} — {tagline}
 *
 * Auto-generated stub from demo/data/manifest.ts.
 * Category: {spec['category']}
 *
 * Description: {description}
 *
 * Variants: {variants_doc}
 * Events:    {events_doc}
 * CSS parts: {parts_doc}
 * Props:     {props_doc}
 * Slots:     {slots_doc}
 *
 * This stub extends LuminaElement and accepts the shared
 * variant / intensity / theme / accent-color / speed / depth API.
 * Replace with a richer hand-written implementation as needed.
 */

import {{ LuminaElement }} from '../core/LuminaElement';

export class {class_name} extends LuminaElement {{
  static tagName = '{tag}';

{observed_attrs}

{props_handling}

{render_body}

{styles_body}

{mounted_body}
}}

declare global {{
  interface HTMLElementTagNameMap {{
    '{tag}': {class_name};
  }}
}}

if (!customElements.get({class_name}.tagName)) {{
  customElements.define({class_name}.tagName, {class_name});
}}
'''
    return file

def main():
    components = parse_manifest()
    print(f'Parsed {len(components)} components from manifest')

    to_generate = [c for c in components if c.get('tier') == 'stub']
    print(f'Generating {len(to_generate)} stub files (skipping {len(components) - len(to_generate)} full)')

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    generated = []
    for spec in to_generate:
        tag = spec['tag']
        out_path = OUT_DIR / f'{tag}.ts'
        file_content = build_component_file(spec)
        out_path.write_text(file_content, encoding='utf-8')
        generated.append(tag)

    print(f'Generated {len(generated)} files in {OUT_DIR}')

    cats = Counter(c['category'] for c in to_generate)
    for cat, n in sorted(cats.items()):
        print(f'  {cat}: {n}')

if __name__ == '__main__':
    main()
