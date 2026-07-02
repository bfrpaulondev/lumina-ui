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


# Per-input content for vanilla HTML snippets.
# Returns (content_html, extra_attrs) — extra_attrs are added to the open tag.
# Most inputs are self-closing (no content); only those with slots or children
# need content (lumina-input with icon slots, lumina-radio-group with buttons).
def _input_vanilla_content(tag):
    if tag == 'lumina-input':
        # Real slots: left-icon, right-icon, label
        return (
            '<span slot="label">Email</span>\n'
            '  <span slot="left-icon">@</span>\n'
            '  <span slot="right-icon">✓</span>',
            ['value="usuario@exemplo.com"', 'placeholder="Digite seu email"']
        )
    if tag == 'lumina-radio-group':
        # Has default slot for radio buttons
        return (
            '<button data-value="a">Opção A</button>\n'
            '  <button data-value="b">Opção B</button>\n'
            '  <button data-value="c">Opção C</button>',
            ['value="b"']
        )
    # Self-closing inputs — just add proper attributes
    if tag == 'lumina-textarea':
        return ('', ['placeholder="Digite sua mensagem..."', 'value="Texto inicial"'])
    if tag == 'lumina-search-input':
        return ('', ['placeholder="Buscar..."', 'suggestions=\'["TypeScript","JavaScript","Python","Rust","Go"]\''])
    if tag == 'lumina-password-input':
        return ('', ['placeholder="Digite sua senha"', 'value="secret123"'])
    if tag == 'lumina-select':
        return ('', [
            'placeholder="Escolha um país"',
            'searchable',
            'options=\'[{"value":"br","label":"Brasil","icon":"BR"},{"value":"us","label":"Estados Unidos","icon":"US"},{"value":"pt","label":"Portugal","icon":"PT"},{"value":"fr","label":"França","icon":"FR"}]\'',
        ])
    if tag == 'lumina-multi-select':
        return ('', [
            'placeholder="Selecione..."',
            'options=\'[{"value":"ts","label":"TypeScript"},{"value":"js","label":"JavaScript"},{"value":"py","label":"Python"},{"value":"rust","label":"Rust"}]\'',
            'value=\'["ts","js"]\'',
        ])
    if tag == 'lumina-autocomplete':
        return ('', [
            'placeholder="Comece a digitar..."',
            'suggestions=\'["TypeScript","JavaScript","Python","Rust","Go","Kotlin","Swift"]\'',
        ])
    if tag == 'lumina-slider':
        return ('', ['min="0"', 'max="100"', 'value="50"', 'step="5"'])
    if tag == 'lumina-range-slider':
        return ('', ['min="0"', 'max="100"', 'min-value="25"', 'max-value="75"', 'step="5"'])
    if tag == 'lumina-switch':
        return ('', ['checked'])
    if tag == 'lumina-checkbox':
        return ('', ['checked'])
    if tag == 'lumina-file-upload':
        return ('', ['accept="image/*"', 'multiple', 'max-size="5242880"'])
    if tag == 'lumina-color-picker':
        return ('', ['value="#7c5cff"'])
    if tag == 'lumina-date-picker':
        return ('', ['value="2025-01-15"'])
    if tag == 'lumina-time-picker':
        return ('', ['value="14:30"', 'format="24h"'])
    if tag == 'lumina-signature-pad':
        return ('', [])
    if tag == 'lumina-voice-input':
        return ('', [])
    if tag == 'lumina-neural-input':
        return ('', ['placeholder="Digite algo positivo ou negativo..."'])
    if tag == 'lumina-context-input':
        return ('', ['placeholder="Detecta contexto automaticamente..."'])
    return ('', [])


# React version — JSX-compatible
def _input_react_content(tag):
    if tag == 'lumina-input':
        return (
            '<span slot="label">Email</span>\n'
            '        <span slot="left-icon">@</span>\n'
            '        <span slot="right-icon">✓</span>',
            ['value="usuario@exemplo.com"', 'placeholder="Digite seu email"']
        )
    if tag == 'lumina-radio-group':
        return (
            '<button data-value="a">Opção A</button>\n'
            '        <button data-value="b">Opção B</button>\n'
            '        <button data-value="c">Opção C</button>',
            ['value="b"']
        )
    if tag == 'lumina-textarea':
        return ('', ['placeholder="Digite sua mensagem..."', 'value="Texto inicial"'])
    if tag == 'lumina-search-input':
        return ('', ['placeholder="Buscar..."', 'suggestions=\'["TypeScript","JavaScript","Python"]\''])
    if tag == 'lumina-password-input':
        return ('', ['placeholder="Digite sua senha"', 'value="secret123"'])
    if tag == 'lumina-select':
        return ('', [
            'placeholder="Escolha um país"',
            'searchable',
            'options=\'[{"value":"br","label":"Brasil"},{"value":"us","label":"EUA"}]\'',
        ])
    if tag == 'lumina-multi-select':
        return ('', [
            'placeholder="Selecione..."',
            'options=\'[{"value":"ts","label":"TypeScript"},{"value":"js","label":"JavaScript"}]\'',
            'value=\'["ts"]\'',
        ])
    if tag == 'lumina-autocomplete':
        return ('', [
            'placeholder="Comece a digitar..."',
            'suggestions=\'["TypeScript","JavaScript","Python"]\'',
        ])
    if tag == 'lumina-slider':
        return ('', ['min={0}', 'max={100}', 'value={50}', 'step={5}'])
    if tag == 'lumina-range-slider':
        return ('', ['min={0}', 'max={100}', 'min-value={25}', 'max-value={75}', 'step={5}'])
    if tag == 'lumina-switch':
        return ('', ['checked'])
    if tag == 'lumina-checkbox':
        return ('', ['checked'])
    if tag == 'lumina-file-upload':
        return ('', ['accept="image/*"', 'multiple', 'max-size="5242880"'])
    if tag == 'lumina-color-picker':
        return ('', ['value="#7c5cff"'])
    if tag == 'lumina-date-picker':
        return ('', ['value="2025-01-15"'])
    if tag == 'lumina-time-picker':
        return ('', ['value="14:30"', 'format="24h"'])
    if tag == 'lumina-neural-input':
        return ('', ['placeholder="Digite algo positivo ou negativo..."'])
    if tag == 'lumina-context-input':
        return ('', ['placeholder="Detecta contexto automaticamente..."'])
    return ('', [])


# Per-card slot content for vanilla HTML snippets.
# Uses REAL slots from the manifest — not invented 'title'/'subtitle' slots.
# Each entry shows the proper way to populate that card.
def _card_vanilla_content(tag):
    if tag == 'lumina-card':
        # Real slots: header, default, media, footer
        return (
            '<header slot="header">\n'
            '    <h3>Card Title</h3>\n'
            '    <span class="badge">NEW</span>\n'
            '  </header>\n'
            '  <div slot="media" style="height:120px;background:linear-gradient(135deg,#7c5cff,#78f0ff);border-radius:8px;"></div>\n'
            '  <p>Conteúdo principal do card. Pode conter texto, imagens, ou qualquer elemento HTML.</p>\n'
            '  <footer slot="footer">\n'
            '    <lumina-button variant="glass" size="sm">Cancelar</lumina-button>\n'
            '    <lumina-button size="sm">Confirmar</lumina-button>\n'
            '  </footer>'
        )
    if tag == 'lumina-hover-card':
        # Real slots: preview (always visible), default (revealed on hover)
        return (
            '<div slot="preview" style="padding:8px 0;">\n'
            '    <h3 style="margin:0;font-size:18px;color:#fff;">Passe o mouse</h3>\n'
            '    <p style="margin:4px 0 0;color:rgba(245,245,255,0.6);font-size:13px;">Hover para revelar mais</p>\n'
            '  </div>\n'
            '  <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;margin-top:8px;">\n'
            '    <p style="margin:0 0 8px;">Conteúdo revelado ao hover! Use para ações secundárias, detalhes, ou atalhos.</p>\n'
            '    <lumina-button size="sm" variant="glass">Ver detalhes</lumina-button>\n'
            '  </div>'
        )
    if tag == 'lumina-stack-card':
        # Children become individual cards in the stack
        return (
            '<div data-card="0" style="padding:24px;text-align:center;">\n'
            '    <h3 style="margin:0 0 8px;">Card 1</h3>\n'
            '    <p style="margin:0;color:rgba(245,245,255,0.6);">Arraste para o lado</p>\n'
            '  </div>\n'
            '  <div data-card="1" style="padding:24px;text-align:center;">\n'
            '    <h3 style="margin:0 0 8px;">Card 2</h3>\n'
            '    <p style="margin:0;color:rgba(245,245,255,0.6);">Segundo card</p>\n'
            '  </div>\n'
            '  <div data-card="2" style="padding:24px;text-align:center;">\n'
            '    <h3 style="margin:0 0 8px;">Card 3</h3>\n'
            '    <p style="margin:0;color:rgba(245,245,255,0.6);">Terceiro card</p>\n'
            '  </div>'
        )
    if tag == 'lumina-parallax-card':
        # 3 layers — back/mid/front via slots (the card has parts layer-back/mid/layer-front)
        return (
            '<div slot="back" style="height:100%;background:radial-gradient(circle at 30% 30%,#7c5cff 0%,transparent 60%);"></div>\n'
            '  <div slot="mid" style="height:100%;display:flex;align-items:center;justify-content:center;">\n'
            '    <div style="width:80px;height:80px;border-radius:50%;background:rgba(120,240,255,0.4);backdrop-filter:blur(8px);"></div>\n'
            '  </div>\n'
            '  <div slot="front" style="padding:20px;">\n'
            '    <h3 style="margin:0;color:#fff;">Parallax 3D</h3>\n'
            '    <p style="margin:4px 0 0;color:rgba(245,245,255,0.7);">3 camadas com velocidades diferentes</p>\n'
            '  </div>'
        )
    # Default cards (glass, morph, neural, void, dimensional, breath, glow,
    # particle, liquid, holo, memory, echo, context, reveal) — just default slot
    return (
        '<h3 style="margin:0 0 8px;color:#fff;">Título do Card</h3>\n'
        '  <p style="margin:0 0 12px;color:rgba(245,245,255,0.7);line-height:1.5;">\n'
        '    Conteúdo principal. Use este card para destacar informações, imagens ou ações.\n'
        '  </p>\n'
        '  <div style="display:flex;gap:8px;">\n'
        '    <lumina-button size="sm" variant="glass">Saiba mais</lumina-button>\n'
        '    <lumina-button size="sm" accent-color="#22c55e">Confirmar</lumina-button>\n'
        '  </div>'
    )


# React version — same content but JSX-compatible (self-closing tags, etc.)
def _card_react_content(tag):
    if tag == 'lumina-card':
        return (
            '<header slot="header">\n'
            '        <h3>Card Title</h3>\n'
            '        <span className="badge">NEW</span>\n'
            '      </header>\n'
            '      <div slot="media" style={{height:"120px",background:"linear-gradient(135deg,#7c5cff,#78f0ff)",borderRadius:"8px"}} />\n'
            '      <p>Conteúdo principal do card.</p>\n'
            '      <footer slot="footer">\n'
            '        <lumina-button variant="glass" size="sm">Cancelar</lumina-button>\n'
            '        <lumina-button size="sm">Confirmar</lumina-button>\n'
            '      </footer>'
        )
    if tag == 'lumina-hover-card':
        return (
            '<div slot="preview" style={{padding:"8px 0"}}>\n'
            '        <h3 style={{margin:0,color:"#fff"}}>Passe o mouse</h3>\n'
            '        <p style={{margin:"4px 0 0",color:"rgba(245,245,255,0.6)"}}>Hover para revelar mais</p>\n'
            '      </div>\n'
            '      <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:"12px"}}>\n'
            '        <p>Conteúdo revelado ao hover!</p>\n'
            '        <lumina-button size="sm" variant="glass">Ver detalhes</lumina-button>\n'
            '      </div>'
        )
    if tag == 'lumina-stack-card':
        return (
            '<div data-card="0" style={{padding:"24px",textAlign:"center"}}>\n'
            '        <h3>Card 1</h3><p>Arraste para o lado</p>\n'
            '      </div>\n'
            '      <div data-card="1" style={{padding:"24px",textAlign:"center"}}>\n'
            '        <h3>Card 2</h3><p>Segundo card</p>\n'
            '      </div>\n'
            '      <div data-card="2" style={{padding:"24px",textAlign:"center"}}>\n'
            '        <h3>Card 3</h3><p>Terceiro card</p>\n'
            '      </div>'
        )
    if tag == 'lumina-parallax-card':
        return (
            '<div slot="back" style={{height:"100%",background:"radial-gradient(circle at 30% 30%,#7c5cff 0%,transparent 60%)"}} />\n'
            '      <div slot="mid" style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>\n'
            '        <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(120,240,255,0.4)"}} />\n'
            '      </div>\n'
            '      <div slot="front" style={{padding:20}}>\n'
            '        <h3 style={{color:"#fff"}}>Parallax 3D</h3>\n'
            '        <p>3 camadas com velocidades diferentes</p>\n'
            '      </div>'
        )
    return (
        '<h3 style={{margin:"0 0 8px",color:"#fff"}}>Título do Card</h3>\n'
        '      <p style={{margin:"0 0 12px",color:"rgba(245,245,255,0.7)"}}>\n'
        '        Conteúdo principal do card.\n'
        '      </p>\n'
        '      <div style={{display:"flex",gap:8}}>\n'
        '        <lumina-button size="sm" variant="glass">Saiba mais</lumina-button>\n'
        '        <lumina-button size="sm" accent-color="#22c55e">Confirmar</lumina-button>\n'
        '      </div>'
    )


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

    # NOTE: attr_str is built AFTER content (which may add extra_attrs for inputs)

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
        content = _card_vanilla_content(tag)
    elif cat == 'inputs':
        content, extra_attrs = _input_vanilla_content(tag)
        if extra_attrs:
            attrs.extend(extra_attrs)
        # inputs are usually self-closing unless they have slot content (radio-group, input with icons)
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
    # Inputs WITH slot content (radio-group, input with icons) need open/close tags
    has_input_content = cat == 'inputs' and content
    is_self_closing = (cat == 'inputs' and not has_input_content) or tag in ('lumina-progress', 'lumina-skeleton', 'lumina-spinner', 'lumina-loading', 'lumina-status-indicator', 'lumina-pulse-indicator', 'lumina-neural-loader')

    # Build attr_str NOW (after extra_attrs from input content have been merged)
    attr_str = '\n  '.join(attrs)

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
        content = _card_react_content(tag)
    elif cat == 'inputs':
        content, extra_attrs = _input_react_content(tag)
        if extra_attrs:
            attrs.extend(extra_attrs)
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
    has_input_content = cat == 'inputs' and content
    is_self_closing = (cat == 'inputs' and not has_input_content) or tag in ('lumina-progress', 'lumina-skeleton', 'lumina-spinner', 'lumina-loading')

    # Rebuild attr_str after extra_attrs merged in
    attr_str = ' '.join(attrs)

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
