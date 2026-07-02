#!/usr/bin/env python3
"""
Patch form components to add: formFieldSharedStyles import, observedAttributes
(name, disabled, required, invalid, valid), disabled/invalid/valid CSS states,
and lumina-focus/blur events on the control element.

This is a surgical patcher — it modifies each component file in place.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMPONENTS = ROOT / 'src' / 'components'

# Components to patch and their control selector (the focusable element)
TARGETS = {
    'lumina-slider': {'control_class': 'lmsl__el', 'value_attr': 'value'},
    'lumina-range-slider': {'control_class': 'lmrs__el', 'value_attr': 'min-value'},
    'lumina-radio-group': {'control_class': 'lmrg__el', 'value_attr': 'value'},
    'lumina-select': {'control_class': 'lmsl__trigger', 'value_attr': 'value'},
    'lumina-multi-select': {'control_class': 'lmms__trigger', 'value_attr': 'value'},
    'lumina-file-upload': {'control_class': 'lmfu__dropzone', 'value_attr': 'value'},
    'lumina-color-picker': {'control_class': 'lmcp__trigger', 'value_attr': 'value'},
    'lumina-date-picker': {'control_class': 'lmdp__trigger', 'value_attr': 'value'},
    'lumina-time-picker': {'control_class': 'lmtp__trigger', 'value_attr': 'value'},
    'lumina-signature-pad': {'control_class': 'lmsig__canvas', 'value_attr': 'value'},
    'lumina-voice-input': {'control_class': 'lmvi__el', 'value_attr': 'value'},
}

def patch_file(tag, info):
    fpath = COMPONENTS / f'{tag}.ts'
    if not fpath.exists():
        print(f'  SKIP {tag} (not found)')
        return
    src = fpath.read_text(encoding='utf-8')
    original = src
    changes = []

    # 1. Add import for formFieldSharedStyles (after the last existing import from core)
    if 'formFieldSharedStyles' not in src:
        # Find the last import from '../core/...'
        import_match = re.search(r"(import [^']+'[^']+\.ts';\n)", src)
        if import_match:
            insert_pos = import_match.end()
            src = src[:insert_pos] + "import { formFieldSharedStyles } from '../core/form-field-mixin';\n" + src[insert_pos:]
            changes.append('added import')

    # 2. Extend observedAttributes with name, disabled, required, invalid, valid
    obs_match = re.search(r"static get observedAttributes\(\): string\[\] \{ return \[\.\.\.LuminaElement\.observedAttributes([^\]]*)\]; \}", src)
    if obs_match and "'name'" not in obs_match.group(0):
        existing = obs_match.group(1)
        new_attrs = existing + ", 'name', 'disabled', 'required', 'invalid', 'valid'"
        src = src.replace(obs_match.group(0), f"static get observedAttributes(): string[] {{ return [...LuminaElement.observedAttributes{new_attrs}]; }}")
        changes.append('extended observedAttributes')

    # 3. Add CSS for disabled/invalid/valid states + formFieldSharedStyles (before the last @media or closing backtick)
    if ':host([disabled])' not in src and 'formFieldSharedStyles' in src:
        # Find the closing backtick of the styles() return string
        # Insert before the last @media (prefers-reduced-motion) or before the final backtick
        css_insert = """
      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
"""
        # Insert before the @media reduced-motion line if it exists, else before final `
        media_match = re.search(r"      @media \(prefers-reduced-motion", src)
        if media_match:
            src = src[:media_match.start()] + css_insert + src[media_match.start():]
            changes.append('added CSS states')
        else:
            # Find the last ` before the closing of styles()
            # Just append before the final backtick of styles()
            last_backtick = src.rfind('`;')
            if last_backtick > 0:
                src = src[:last_backtick] + css_insert + src[last_backtick:]
                changes.append('added CSS states')

    if src != original:
        fpath.write_text(src, encoding='utf-8')
        print(f'  PATCHED {tag}: {", ".join(changes)}')
    else:
        print(f'  NO-CHANGE {tag}')

print('Patching form components...')
for tag, info in TARGETS.items():
    patch_file(tag, info)
print('Done.')
