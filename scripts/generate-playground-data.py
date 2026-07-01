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
    props = spec.get('props', []) or []
    slots = spec.get('slots', []) or ['default']
    cat = spec.get('category', '')

    # Build attribute string with shared + component-specific props
    attrs = [f'variant="{v}"', f'intensity="intense"', f'accent-color="{accent}"', 'speed="0.5"']
    for p in props:
        pname = p['name']
        ptype = p['type']
        default = p.get('default', '')
        # Skip if it would conflict with shared
        if pname in ('variant', 'intensity', 'theme', 'speed', 'accent-color', 'depth'):
            continue
        # Provide a sensible example value
        if 'boolean' in ptype:
            if default and 'true' in str(default):
                attrs.append(f'{pname}')
            # else don't add (false is default)
        elif 'number' in ptype:
            val = str(default).strip('"').strip("'") if default else '0'
            attrs.append(f'{pname}="{val}"')
        elif 'JSON' in ptype or 'array' in ptype.lower() or 'string' in ptype and 'menu-items' in pname:
            # Provide a JSON example for options/items
            if pname == 'menu-items':
                attrs.append(f'{pname}=\'[{{"label":"Editar","icon":"✎","value":"edit"}},{{"label":"Excluir","icon":"🗑","value":"delete"}}]\'')
            elif pname == 'options':
                attrs.append(f'{pname}=\'[{{"value":"a","label":"Opção A"}},{{"value":"b","label":"Opção B"}}]\'')
            elif pname == 'marks':
                attrs.append(f'{pname}=\'[{{"value":0,"label":"0"}},{{"value":50,"label":"Médio"}},{{"value":100,"label":"Máx"}}]\'')
            elif pname == 'gestures':
                attrs.append(f'{pname}="hold,swipe,double-tap"')
            else:
                if default:
                    attrs.append(f'{pname}="{str(default).strip(chr(34)).strip(chr(39))}"')
        else:
            if default:
                val = str(default).strip('"').strip("'")
                attrs.append(f'{pname}="{val}"')

    attr_str = '\n  '.join(attrs)

    # Build content / slots
    content = ''
    if tag == 'lumina-icon-button':
        content = '⚙'
    elif tag == 'lumina-fab':
        content = '+\n  <span slot="label">Nova tarefa</span>'
    elif tag == 'lumina-split-button':
        content = 'Salvar'
    elif tag == 'lumina-toggle-button':
        content = 'Modo escuro'
    elif tag == 'lumina-button-group':
        content = '  <button data-value="a">A</button>\n  <button data-value="b">B</button>\n  <button data-value="c">C</button>'
    elif tag == 'lumina-command-button':
        content = 'Buscar'
    elif tag == 'lumina-ripple-button':
        content = 'Clique com ripple'
    elif tag == 'lumina-magnetic-button':
        content = 'Aproxime o cursor'
    elif tag == 'lumina-breath-button':
        content = 'Respirando...'
    elif tag == 'lumina-neural-button':
        content = 'Neural'
    elif tag == 'lumina-portal-button':
        content = 'Entrar no portal'
    elif tag == 'lumina-echo-button':
        content = 'Eco'
    elif tag == 'lumina-morph-button':
        content = 'Morph'
    elif tag == 'lumina-gesture-button':
        content = 'Toque, segure ou arraste'
    elif cat == 'cards':
        content = '<h3 slot="title">Título</h3>\n  <p slot="subtitle">subtítulo</p>\n  <p>Conteúdo de exemplo.</p>'
    elif cat == 'inputs':
        # self-closing
        pass
    elif cat == 'feedback':
        if tag == 'lumina-progress':
            content = ''
        elif tag == 'lumina-badge':
            content = 'NEW'
        elif tag == 'lumina-chip':
            content = '<span slot="icon">⚛</span>\n  TypeScript'
        elif tag == 'lumina-toast':
            content = 'Salvo com sucesso!\n  <button slot="actions" data-action="undo">Desfazer</button>'
        elif tag == 'lumina-alert':
            content = '<span slot="title">Sucesso</span>\n  Operação concluída.'
        elif tag == 'lumina-skeleton':
            content = ''
        else:
            content = 'Conteúdo'
    elif cat == 'overlays':
        if tag in ('lumina-modal', 'lumina-dialog', 'lumina-drawer-modal', 'lumina-confirmation-dialog'):
            content = '<span slot="title">Título</span>\n  <p>Conteúdo do modal.</p>\n  <div slot="footer"><lumina-button variant="glass">OK</lumina-button></div>'
        elif tag == 'lumina-drawer':
            content = '<h2 slot="header">Filtros</h2>\n  <p>Conteúdo do drawer.</p>'
        elif tag in ('lumina-tooltip', 'lumina-popover'):
            content = 'Hover me'
        else:
            content = 'Conteúdo'
    else:
        content = 'Conteúdo de exemplo'

    # Self-closing for inputs without content
    is_self_closing = cat == 'inputs' or tag in ('lumina-progress', 'lumina-skeleton', 'lumina-spinner', 'lumina-loading', 'lumina-status-indicator', 'lumina-pulse-indicator', 'lumina-neural-loader')

    if is_self_closing:
        open_tag = f'<{tag}\n  {attr_str}\n></{tag}>'
    else:
        open_tag = f'<{tag}\n  {attr_str}\n>\n  {content}\n</{tag}>'

    # Event listener
    event_listener = ''
    if events:
        primary_event = events[0]
        # Convert lumina-click to onLuminaClick for React-style, but keep native for vanilla
        event_listener = (
            "\n<script type=\"module\">\n"
            f"  const el = document.querySelector('{tag}');\n"
            f"  el.addEventListener('{primary_event}', (e) => {{\n"
            f"    console.log('{primary_event}', e.detail);\n"
            "  });\n"
            "</script>"
        )

    return f"<!-- {name} -->\n{open_tag}{event_listener}"


def gen_react_snippet(spec):
    tag = spec['tag']
    name = spec['name']
    variants = spec.get('variants', [])
    accent = spec.get('accent', '#7c5cff')
    v = variants[0] if variants else 'glass'
    events = spec.get('events', []) or []
    props = spec.get('props', []) or []
    cat = spec.get('category', '')
    class_name = name.replace('Lumina', '')

    # Build attribute string
    attrs = [f'variant="{v}"', f'intensity="intense"', f'accent-color="{accent}"', 'speed={0.5}']
    for p in props:
        pname = p['name']
        ptype = p['type']
        default = p.get('default', '')
        if pname in ('variant', 'intensity', 'theme', 'speed', 'accent-color', 'depth'):
            continue
        if 'boolean' in ptype:
            if default and 'true' in str(default):
                attrs.append(f'{pname.replace("-","") if "-" not in pname else pname}')
        elif 'number' in ptype:
            val = str(default).strip('"').strip("'") if default else '0'
            attrs.append(f'{pname}={{{val}}}')
        elif 'JSON' in ptype or 'array' in ptype.lower():
            if pname == 'menu-items':
                attrs.append(f'menu-items=\'[{{"label":"Editar","value":"edit"}}]\'')
            elif pname == 'options':
                attrs.append(f'options={{[{{value:"a",label:"Opção A"}}]}}')
            elif pname == 'marks':
                attrs.append(f'marks={{[{{value:0,label:"0"}}]}}')
            elif pname == 'gestures':
                attrs.append(f'gestures="hold,swipe,double-tap"')
        else:
            if default:
                val = str(default).strip('"').strip("'")
                attrs.append(f'{pname}="{val}"')

    attr_str = ' '.join(attrs)

    # Content
    content = 'Conteúdo'
    if tag == 'lumina-icon-button':
        content = '⚙'
    elif tag == 'lumina-button-group':
        content = '<button data-value="a">A</button><button data-value="b">B</button>'
    elif cat == 'cards':
        content = '<h3 slot="title">Título</h3><p>Conteúdo.</p>'
    elif cat == 'inputs':
        content = ''
    elif cat == 'feedback':
        if tag == 'lumina-progress':
            content = ''
        elif tag == 'lumina-chip':
            content = 'TypeScript'

    # Event handler
    event_handler = ''
    if events:
        primary = events[0]
        parts = primary.split('-')
        camel = 'on' + ''.join(p.capitalize() for p in parts)
        event_handler = f'\n      {camel}={{(e) => console.log(e.detail)}}'

    # Self-closing?
    is_self_closing = cat == 'inputs' or tag in ('lumina-progress', 'lumina-skeleton', 'lumina-spinner', 'lumina-loading')

    if is_self_closing:
        jsx = f"    <{tag} {attr_str}{event_handler} />"
    else:
        jsx = f"    <{tag} {attr_str}{event_handler}>\n      {content}\n    </{tag}>"

    return (
        f"import 'lumina-ui';\n\n"
        f"export function {class_name}Example() {{\n"
        f"  return (\n"
        f"{jsx}\n"
        f"  );\n"
        f"}}"
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
