/**
 * LuminaUI — CodeViewer with Monaco (v3 — Light DOM, no shadow root).
 *
 * Critical fix: Monaco injects its CSS into document <head>, but those rules
 * don't pierce Shadow DOM. The internal <textarea class="inputarea"> ended up
 * with user-agent defaults (white bg, gray border, position:static) — showing
 * as a thin white horizontal bar across the editor area.
 *
 * Solution: render the CodeViewer in Light DOM so Monaco's CSS works.
 * We still isolate our own styles by namespacing every class with
 * `.lumina-cv__*` and scoping via the host selector.
 */

import { loadMonaco } from '../monaco';

const styles = `
:host {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  background: #0b0b14;
  border-radius: 12px;
  overflow: hidden;
}

/* All LuminaUI-controlled UI is prefixed with .lumina-cv__ so we don't
   leak styles to/from the host page. Monaco's own classes (.monaco-*)
   are managed by Monaco's own CSS. */
.lumina-cv__head {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  height: 38px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
}
.lumina-cv__tab {
  appearance: none;
  border: 0;
  background: transparent;
  color: rgba(245, 245, 255, 0.5);
  font: 500 12px 'Inter', system-ui, sans-serif;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.2s, color 0.2s;
}
.lumina-cv__tab:hover { background: rgba(255, 255, 255, 0.06); color: #fff; }
.lumina-cv__tab[data-active="true"] {
  background: rgba(124, 92, 255, 0.18);
  color: #fff;
}
.lumina-cv__spacer { flex: 1; }
.lumina-cv__action {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(245, 245, 255, 0.7);
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font: 600 11px 'Inter', system-ui, sans-serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: background 0.2s, color 0.2s;
}
.lumina-cv__action:hover { background: rgba(124, 92, 255, 0.2); color: #fff; }
.lumina-cv__action[data-copied] {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
  color: #4ade80;
}

/* Container is the editor mount point — explicit dark bg, no white flash */
.lumina-cv__container {
  position: absolute;
  top: 38px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0b0b14;
  overflow: hidden;
}
.lumina-cv__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: rgba(245, 245, 255, 0.4);
  font: 500 13px 'JetBrains Mono', monospace;
  font-style: italic;
  background: #0b0b14;
}

/* === Monaco fix — force the internal textarea to be transparent ===
   This overrides Monaco's defaults that may not apply if Monaco's CSS
   didn't load fully, or if user-agent defaults bleed through. */
.lumina-cv__container .monaco-editor .inputarea {
  background: transparent !important;
  color: transparent !important;
  border: none !important;
  outline: none !important;
  position: absolute !important;
  opacity: 0 !important;
  overflow: hidden !important;
  resize: none !important;
}
/* Make sure the editor background stays dark even if Monaco's CSS lags */
.lumina-cv__container .monaco-editor,
.lumina-cv__container .monaco-editor-background,
.lumina-cv__container .monaco-editor .margin {
  background-color: #0b0b14 !important;
}
`;

export interface CodeViewerTab {
  id: string;
  label: string;
  language: string;
  code: string;
}

export class CodeViewer extends HTMLElement {
  static tagName = 'lumina-code-viewer';

  private editor: any = null;
  private tabs: CodeViewerTab[] = [];
  private activeTabId = '';
  private onChangeCb: ((code: string, tabId: string) => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private containerEl: HTMLElement | null = null;
  private styleSheetEl: HTMLStyleElement | null = null;

  constructor() {
    super();
    // NO shadow root — use light DOM so Monaco's CSS (injected into <head>)
    // can style its own internals.
  }

  /** Expose editor so parent can call .layout() if needed. */
  get monacoEditor(): any { return this.editor; }

  setTabs(tabs: CodeViewerTab[], activeId?: string): void {
    this.tabs = tabs;
    this.activeTabId = activeId ?? tabs[0]?.id ?? '';
    this.renderShell();
    this.initEditor();
  }

  onChange(cb: (code: string, tabId: string) => void): void {
    this.onChangeCb = cb;
  }

  getCode(): string {
    return this.editor?.getValue?.() ?? '';
  }

  setCode(code: string): void {
    if (this.editor) this.editor.setValue(code);
  }

  /** Force Monaco to recompute its layout. Call after the host becomes visible. */
  relayout(): void {
    if (this.editor && this.containerEl) {
      try {
        this.editor.layout({
          width: this.containerEl.clientWidth,
          height: this.containerEl.clientHeight,
        });
      } catch {
        /* noop */
      }
    }
  }

  private renderShell(): void {
    // Inject our styles into document head (once)
    if (!document.getElementById('lumina-cv-styles')) {
      const style = document.createElement('style');
      style.id = 'lumina-cv-styles';
      style.textContent = styles;
      document.head.appendChild(style);
      this.styleSheetEl = style;
    }

    const tabsHtml = this.tabs
      .map(
        (t) =>
          `<button class="lumina-cv__tab" data-tab="${t.id}" data-active="${t.id === this.activeTabId}">${t.label}</button>`,
      )
      .join('');
    this.innerHTML = `
      <div class="lumina-cv__head">
        ${tabsHtml}
        <div class="lumina-cv__spacer"></div>
        <button class="lumina-cv__action" data-action="copy">Copiar</button>
        <button class="lumina-cv__action" data-action="reset">Reset</button>
      </div>
      <div class="lumina-cv__container">
        <div class="lumina-cv__loading">Carregando editor…</div>
      </div>
    `;
    this.querySelectorAll('.lumina-cv__tab').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.tab!;
        this.switchTab(id);
      });
    });
    this.querySelector('[data-action="copy"]')?.addEventListener('click', (e) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const code = this.getCode();
      const onDone = () => {
        btn.setAttribute('data-copied', '');
        btn.textContent = 'Copiado!';
        setTimeout(() => {
          btn.removeAttribute('data-copied');
          btn.textContent = 'Copiar';
        }, 1500);
      };
      // Prefer Clipboard API, fallback to execCommand
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(code).then(onDone).catch(() => {
          this._legacyCopy(code);
          onDone();
        });
      } else {
        this._legacyCopy(code);
        onDone();
      }
    });
    this.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
      const tab = this.tabs.find((t) => t.id === this.activeTabId);
      if (tab && this.editor) this.editor.setValue(tab.code);
    });
  }

  private _legacyCopy(text: string): void {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch { /* noop */ }
  }

  private async initEditor(): Promise<void> {
    const container = this.querySelector('.lumina-cv__container') as HTMLElement;
    if (!container) return;
    this.containerEl = container;
    const monaco = await loadMonaco();
    // Clear the loading placeholder
    container.innerHTML = '';

    const tab = this.tabs.find((t) => t.id === this.activeTabId) ?? this.tabs[0];
    if (!tab) return;

    // Fallback to textarea if Monaco CDN failed
    if (!monaco) {
      const textarea = document.createElement("textarea");
      textarea.value = tab.code;
      Object.assign(textarea.style, {
        width: "100%",
        height: "100%",
        border: "0",
        background: "#0b0b14",
        color: "#e8e8f5",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12.5px",
        padding: "12px",
        outline: "none",
        resize: "none",
        boxSizing: "border-box",
      } as CSSStyleDeclaration);
      container.appendChild(textarea);
      this.editor = {
        getValue: () => textarea.value,
        setValue: (v: string) => { textarea.value = v; },
        onDidChangeModelContent: () => {},
        layout: () => {},
      } as any;
      return;
    }

    // Define custom theme BEFORE creating the editor (prevents white flash)
    monaco.editor.defineTheme('lumina-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0b0b14',
        'editor.foreground': '#e8e8f5',
        'editor.lineHighlightBackground': '#15152a',
        'editorLineNumber.foreground': '#3a3a55',
        'editorLineNumber.activeForeground': '#7c5cff',
        'editor.selectionBackground': '#7c5cff44',
        'editorCursor.foreground': '#7c5cff',
      },
    });

    this.editor = monaco.editor.create(container, {
      value: tab.code,
      language: tab.language,
      theme: 'lumina-dark',
      automaticLayout: false,
      fontSize: 12.5,
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontLigatures: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      tabSize: 2,
      padding: { top: 12, bottom: 12 },
      lineNumbers: 'on',
      renderLineHighlight: 'gutter',
      wordWrap: 'on',
      scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
    });

    this.editor.onDidChangeModelContent(() => {
      if (this.onChangeCb) this.onChangeCb(this.getCode(), this.activeTabId);
    });

    // Reliable layout via ResizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.editor && this.containerEl) {
          try {
            this.editor.layout({
              width: this.containerEl.clientWidth,
              height: this.containerEl.clientHeight,
            });
          } catch { /* noop */ }
        }
      });
      this.resizeObserver.observe(container);
    }

    // Initial layout
    requestAnimationFrame(() => this.relayout());
  }

  private switchTab(id: string): void {
    if (id === this.activeTabId || !this.editor) return;
    this.activeTabId = id;
    this.querySelectorAll('.lumina-cv__tab').forEach((btn) => {
      (btn as HTMLElement).dataset.active = String(btn === this.querySelector(`[data-tab="${id}"]`));
    });
    const tab = this.tabs.find((t) => t.id === id);
    if (tab) {
      this.editor.setValue(tab.code);
      try {
        const monacoNs = (window as any).monaco;
        if (monacoNs) {
          const newModel = monacoNs.editor.createModel(tab.code, tab.language);
          this.editor.setModel(newModel);
        }
      } catch { /* noop */ }
      this.relayout();
    }
  }

  disconnectedCallback(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.editor) {
      try { this.editor.dispose(); } catch { /* noop */ }
      this.editor = null;
    }
    // Don't remove the global <style> — other CodeViewers may still be using it.
  }
}

if (!customElements.get(CodeViewer.tagName)) {
  customElements.define(CodeViewer.tagName, CodeViewer);
}
