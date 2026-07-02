#!/usr/bin/env python3
"""
LuminaUI — End-to-end QA test runner.
Navigates to each component's playground page, checks for console errors,
and records results. Uses agent-browser CLI.
"""
import subprocess
import json
import time
import os

BASE_URL = "https://bfrpaulondev.github.io/lumina-ui/#/playground/"
SCREENSHOT_DIR = "/home/z/my-project/download/screenshots/qa-round2"

# All components to test (excluding lumina-button, lumina-card, lumina-input, 
# lumina-select, lumina-tabs, lumina-slider which were already tested)
COMPONENTS = [
    # Buttons (14)
    "lumina-icon-button", "lumina-fab", "lumina-split-button", "lumina-toggle-button",
    "lumina-button-group", "lumina-command-button", "lumina-ripple-button",
    "lumina-magnetic-button", "lumina-breath-button", "lumina-neural-button",
    "lumina-portal-button", "lumina-echo-button", "lumina-morph-button",
    "lumina-gesture-button",
    # Cards (17)
    "lumina-glass-card", "lumina-morph-card", "lumina-neural-card", "lumina-void-card",
    "lumina-dimensional-card", "lumina-hover-card", "lumina-context-card",
    "lumina-breath-card", "lumina-stack-card", "lumina-reveal-card",
    "lumina-parallax-card", "lumina-glow-card", "lumina-particle-card",
    "lumina-liquid-card", "lumina-holo-card", "lumina-memory-card", "lumina-echo-card",
    # Inputs (17)
    "lumina-textarea", "lumina-search-input", "lumina-password-input",
    "lumina-multi-select", "lumina-autocomplete", "lumina-range-slider",
    "lumina-switch", "lumina-checkbox", "lumina-radio-group",
    "lumina-file-upload", "lumina-color-picker", "lumina-date-picker",
    "lumina-time-picker", "lumina-signature-pad", "lumina-voice-input",
    "lumina-neural-input", "lumina-context-input",
    # Navigation (10)
    "lumina-breadcrumbs", "lumina-pagination", "lumina-sidebar", "lumina-drawer",
    "lumina-mega-menu", "lumina-command-palette", "lumina-floating-nav",
    "lumina-step-indicator", "lumina-progress-nav", "lumina-orbital-nav",
    # Feedback (6)
    "lumina-skeleton", "lumina-spinner", "lumina-status-indicator",
    "lumina-notification-badge", "lumina-pulse-indicator", "lumina-neural-loader",
    # Overlays (8)
    "lumina-drawer-modal", "lumina-dialog", "lumina-popover", "lumina-context-menu",
    "lumina-lightbox", "lumina-image-zoom", "lumina-fullscreen-overlay",
    "lumina-confirmation-dialog",
    # Data Display (7)
    "lumina-table", "lumina-data-grid", "lumina-list", "lumina-grid",
    "lumina-avatar-group", "lumina-timeline", "lumina-tree-view",
    # Unique (5)
    "lumina-morph-lab", "lumina-particle-system", "lumina-depth-controller",
    "lumina-context-aware", "lumina-echo-system",
]

results = []

def run_cmd(cmd):
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        return r.stdout.strip() + r.stderr.strip()
    except Exception as e:
        return str(e)

for i, tag in enumerate(COMPONENTS):
    url = BASE_URL + tag
    print(f"[{i+1}/{len(COMPONENTS)}] Testing {tag}...", flush=True)
    
    # Navigate
    run_cmd(f'agent-browser open "{url}"')
    time.sleep(4)
    
    # Clear errors first (from previous page)
    run_cmd('agent-browser errors --clear')
    time.sleep(1)
    
    # Check for errors
    err_output = run_cmd('agent-browser errors --json')
    errors = []
    try:
        data = json.loads(err_output)
        errors = data.get('data', {}).get('errors', [])
    except:
        pass
    
    # Check if component rendered
    render_check = run_cmd(f'''agent-browser eval "(function(){{ var p = document.querySelector('[data-preview-inner]'); var c = p ? p.children.length : -1; var tag = p ? p.children[0]?.tagName : 'none'; return 'children:' + c + ' first:' + tag; }})()"''')
    
    # Check preview dimensions
    dim_check = run_cmd(f'''agent-browser eval "(function(){{ var p = document.querySelector('.playground__preview'); return p ? 'w:' + p.clientWidth + ' h:' + p.clientHeight : 'missing'; }})()"''')
    
    # Check Monaco loaded
    monaco_check = run_cmd(f'''agent-browser eval "(function(){{ var v = document.querySelector('lumina-code-viewer'); var m = v?.shadowRoot?.querySelector('.monaco-editor'); return m ? 'loaded' : 'not-loaded'; }})()"''')
    
    # Check theme
    theme_check = run_cmd(f'''agent-browser eval "(function(){{ var el = document.querySelector('[data-preview-inner] > *'); return el ? el.getAttribute('theme') || 'no-theme' : 'no-element'; }})()"''')
    
    has_errors = len(errors) > 0
    status = "FAIL" if has_errors else "PASS"
    
    result = {
        'tag': tag,
        'status': status,
        'errors': [e.get('text', '')[:150] for e in errors],
        'render': render_check.strip().strip('"'),
        'dimensions': dim_check.strip().strip('"'),
        'monaco': monaco_check.strip().strip('"'),
        'theme': theme_check.strip().strip('"'),
    }
    results.append(result)
    
    if has_errors:
        # Take screenshot of failure
        safe_tag = tag.replace('/', '-')
        run_cmd(f'agent-browser screenshot {SCREENSHOT_DIR}/FAIL-{safe_tag}.png')
        print(f"  ❌ FAIL: {len(errors)} error(s)")
        for e in errors:
            print(f"     → {e.get('text', '')[:120]}")
    else:
        print(f"  ✅ PASS — render: {result['render']}, monaco: {result['monaco']}, theme: {result['theme']}")
    
    # Also check if preview has 0 width (layout issue)
    if 'w:0' in result['dimensions'] or 'h:0' in result['dimensions']:
        result['status'] = 'WARN'
        print(f"  ⚠️  WARN: preview has 0 dimensions: {result['dimensions']}")

# Summary
print("\n" + "="*80)
print("QA TEST SUMMARY")
print("="*80)
passed = sum(1 for r in results if r['status'] == 'PASS')
failed = sum(1 for r in results if r['status'] == 'FAIL')
warned = sum(1 for r in results if r['status'] == 'WARN')
print(f"Total: {len(results)} | PASS: {passed} | FAIL: {failed} | WARN: {warned}")
print()

if failed > 0:
    print("FAILED COMPONENTS:")
    for r in results:
        if r['status'] == 'FAIL':
            print(f"  ❌ {r['tag']}")
            for e in r['errors']:
                print(f"     → {e}")
    print()

if warned > 0:
    print("WARNED COMPONENTS:")
    for r in results:
        if r['status'] == 'WARN':
            print(f"  ⚠️  {r['tag']} — {r['dimensions']}")
    print()

# Save full results as JSON
with open('/home/z/my-project/download/qa-results.json', 'w') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print(f"Full results saved to /home/z/my-project/download/qa-results.json")
