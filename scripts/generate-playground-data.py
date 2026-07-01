#!/usr/bin/env python3
"""
LuminaUI — Playground data generator.

Reads demo/data/manifest.ts and produces demo/data/components.ts with
all 100 components + per-component code snippets (TypeScript source,
Vanilla HTML, React TSX).

Snippet content for the 'component' tab is a simplified view that
documents the API surface (variants, parts, events, props, slots).
For the full TypeScript source users can browse the file directly.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'demo/data/manifest.ts'
OUT = ROOT / 'demo/data/components.ts'

def parse_manifest():
    text = MANIFEST.read_text(encoding='utf-8')
    m = re.search(r'export const COMPONENTS:\s*ComponentSpec\[\]\s*=\s*\[(.*?)\n\];', text, re.DOTALL)
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
        s = obj
        s = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)', r'\1"\2"\3', s)
        def fix_quotes(match):
            content = match.group(1)
            content = content.replace('\\"', '"').replace('"', '\\"')
            return '"' + content + '"'
        s = re.sub(r"'([^']*)'", fix_quotes, s)
        s = re.sub(r',(\s*[}\]])', r'\1', s)
        parsed.append(json.loads(s))
    return parsed

def gen_component_snippet(spec):
    name = spec['name']
    tag = spec['tag']
    variants = spec.get('variants', [])
    parts = spec.get('parts', [])
    events = spec.get('events', []) or []
    props = spec.get('props', []) or []
    slots = spec.get('slots', []) or []
    class_name = name.replace('Lumina', '')
    variants_str = ' | '.join("'" + v + "'" for v in variants)
    parts_str = ', '.join(parts)
    events_str = ', '.join(events) if events else '(inherits standard lumina-* events)'
    props_lines = '\n   * '.join(p['name'] + ': ' + p['type'] for p in props) if props else '(only shared LuminaElement props)'
    slots_str = ', '.join(slots) if slots else '(none)'
    return (
        "import { LuminaElement } from '../core/LuminaElement';\n\n"
        f"export class {class_name} extends LuminaElement {{\n"
        f"  static tagName = '{tag}';\n\n"
        f"  // Accepts variants: {variants_str}\n"
        f"  // CSS parts:       {parts_str}\n"
        f"  // Events:          {events_str}\n"
        f"  // Props:\n"
        f"   * {props_lines}\n"
        f"  // Slots:           {slots_str}\n\n"
        "  protected render(): string {\n"
        f"    /* Full source: src/components/{tag}.ts */\n"
        "    return `\n"
        "      <div class=\"lmc\" part=\"root\">\n"
        "        <slot></slot>\n"
        "      </div>\n"
        "    `;\n"
        "  }\n\n"
        "  protected styles(): string {\n"
        "    /* Per-variant CSS using --lumina-* tokens */\n"
        "    return ` ... `;\n"
        "  }\n"
        "}\n\n"
        f"customElements.define({class_name}.tagName, {class_name});\n"
    )

def gen_vanilla_snippet(spec):
    tag = spec['tag']
    name = spec['name']
    variants = spec.get('variants', [])
    accent = spec.get('accent', '#7c5cff')
    v = variants[0] if variants else 'glass'
    events = spec.get('events', []) or []
    event_listener = ''
    if events:
        event_listener = (
            "\n<script type=\"module\">\n"
            f"  const el = document.querySelector('{tag}');\n"
            f"  el.addEventListener('{events[0]}', (e) => console.log(e));\n"
            "</script>\n"
        )
    return (
        f"<!-- {name} -->\n"
        f"<{tag}\n"
        f"  variant=\"{v}\"\n"
        f"  intensity=\"intense\"\n"
        f"  accent-color=\"{accent}\"\n"
        f"  speed=\"0.5\"\n"
        f"  depth=\"medium\"\n"
        ">\n"
        "  Conteúdo de exemplo\n"
        f"</{tag}>{event_listener}"
    )

def gen_react_snippet(spec):
    tag = spec['tag']
    name = spec['name']
    variants = spec.get('variants', [])
    accent = spec.get('accent', '#7c5cff')
    v = variants[0] if variants else 'glass'
    events = spec.get('events', []) or []
    event_handler = ''
    if events:
        # Convert lumina-click -> onLuminaClick
        parts = events[0].split('-')
        camel = 'on' + ''.join(p.capitalize() for p in parts)
        event_handler = f"\n      {camel}={{(e) => console.log(e)}}"
    class_name = name.replace('Lumina', '')
    return (
        "import 'lumina-ui';\n\n"
        f"export function {class_name}Example() {{\n"
        "  return (\n"
        f"    <{tag}\n"
        f"      variant=\"{v}\"\n"
        f"      intensity=\"intense\"\n"
        f"      accent-color=\"{accent}\"\n"
        f"      speed={{0.5}}{event_handler}\n"
        "    >\n"
        "      Conteúdo\n"
        f"    </{tag}>\n"
        "  );\n"
        "}\n"
    )

def main():
    components = parse_manifest()
    print(f'Parsed {len(components)} components')

    # Build snippets
    snippets_map = {}
    for spec in components:
        tag = spec['tag']
        snippets_map[tag] = {
            'component': gen_component_snippet(spec),
            'vanilla': gen_vanilla_snippet(spec),
            'react': gen_react_snippet(spec),
        }

    # Write TS file
    lines = [
        '/**',
        ' * LuminaUI v0.3.0 — Auto-generated component metadata + snippets.',
        ' * Generated by scripts/generate-playground-data.py from demo/data/manifest.ts.',
        ' *',
        f' * {len(components)} components across 8 categories.',
        ' */',
        '',
        "import type { ComponentSpec } from './manifest';",
        "import { COMPONENTS, CATEGORIES } from './manifest';",
        '',
        'export { COMPONENTS, CATEGORIES };',
        '',
        'export interface ComponentSnippets {',
        '  component: string;',
        '  vanilla: string;',
        '  react: string;',
        '}',
        '',
        'export interface ComponentMeta extends ComponentSpec {',
        '  snippets: ComponentSnippets;',
        '}',
        '',
        'const SNIPPETS: Record<string, ComponentSnippets> = {',
    ]
    for tag, sn in snippets_map.items():
        # Escape backticks and ${ in snippet content
        comp = sn['component'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        van = sn['vanilla'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        rct = sn['react'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        lines.append(f"  '{tag}': {{")
        lines.append(f"    component: `{comp}`,")
        lines.append(f"    vanilla: `{van}`,")
        lines.append(f"    react: `{rct}`,")
        lines.append('  },')
    lines.append('};')
    lines.append('')
    lines.append('export const COMPONENT_METAS: ComponentMeta[] = COMPONENTS.map((c) => ({')
    lines.append('  ...c,')
    lines.append("  snippets: SNIPPETS[c.tag] ?? { component: '// (no snippet)', vanilla: '', react: '' },")
    lines.append('}));')
    lines.append('')
    lines.append('export function getComponent(tag: string): ComponentMeta | undefined {')
    lines.append('  return COMPONENT_METAS.find((c) => c.tag === tag);')
    lines.append('}')
    lines.append('')
    lines.append("export function componentsByCategory(cat: ComponentSpec['category']): ComponentMeta[] {")
    lines.append('  return COMPONENT_METAS.filter((c) => c.category === cat);')
    lines.append('}')
    lines.append('')

    OUT.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Wrote {OUT} ({len(lines)} lines)')

if __name__ == '__main__':
    main()
