/**
 * LuminaUI — CodeViewer with Monaco (v2 — robust layout, no white flash).
 *
 * Improvements:
 *  - Dark placeholder that matches the editor background (no white flash).
 *  - ResizeObserver to call editor.layout() when container resizes.
 *  - Exposes `editor` so parent can call layout() after route changes.
 *  - Stricter container styling (no flex bleed-through).
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
  /* No border on host — parent .playground__code already has one */
}
.code-viewer__head {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  height: 38px;
  box-sizing: border-box;
}
.code-viewer__tab {
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
.code-viewer__tab:hover { background: rgba(255, 255, 255, 0.06); color: #fff; }
.code-viewer__tab[data-active="true"] {
  background: rgba(124, 92, 255, 0.18);
  color: #fff;
}
.code-viewer__spacer { flex: 1; }
.code-viewer__action {
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
.code-viewer__action:hover { background: rgba(124, 92, 255, 0.2); color: #fff; }
.code-viewer__action[data-copied] {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
  color: #4ade80;
}
/* Container is the editor mount point — explicit dark bg, no white flash */
.code-viewer__container {
  position: absolute;
  top: 38px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0b0b14;
  overflow: hidden;
}
.code-viewer__loading {
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
`;

export interface CodeViewerTab {
  id: string;
  label: string;
  language: string;
  code: string;
}

export class CodeViewer extends HTMLElement {
  static tagName = 'lumina-code-viewer';

  private shadow: ShadowRoot;
  private editor: any = null;
  private tabs: CodeViewerTab[] = [];
  private activeTabId = '';
  private onChangeCb: ((code: string, tabId: string) => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private containerEl: HTMLElement | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    this.shadow.adoptedStyleSheets = [sheet];
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
        this.editor.layout({ width: this.containerEl.clientWidth, height: this.containerEl.clientHeight });
      } catch {
        /* noop */
      }
    }
  }

  private renderShell(): void {
    const tabsHtml = this.tabs
      .map(
        (t) =>
          `<button class="code-viewer__tab" data-tab="${t.id}" data-active="${t.id === this.activeTabId}">${t.label}</button>`,
      )
      .join('');
    this.shadow.innerHTML = `
      <div class="code-viewer__head">
        ${tabsHtml}
        <div class="code-viewer__spacer"></div>
        <button class="code-viewer__action" data-action="copy">Copiar</button>
        <button class="code-viewer__action" data-action="reset">Reset</button>
      </div>
      <div class="code-viewer__container">
        <div class="code-viewer__loading">Carregando editor…</div>
      </div>
    `;
    this.shadow.querySelectorAll('.code-viewer__tab').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.tab!;
        this.switchTab(id);
      });
    });
    this.shadow.querySelector('[data-action="copy"]')?.addEventListener('click', (e) => {
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
    this.shadow.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
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
    const container = this.shadow.querySelector('.code-viewer__container') as HTMLElement;
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

    // Define custom theme BEFORE creating the editor (prevents white flash from vs-dark default)
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
      automaticLayout: false, // we use ResizeObserver instead (more reliable)
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

    // Reliable layout via ResizeObserver — fires when container size changes
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

    // Initial layout (after a microtask to ensure DOM is settled)
    requestAnimationFrame(() => this.relayout());
  }

  private switchTab(id: string): void {
    if (id === this.activeTabId || !this.editor) return;
    this.activeTabId = id;
    this.shadow.querySelectorAll('.code-viewer__tab').forEach((btn) => {
      (btn as HTMLElement).dataset.active = String(btn === this.shadow.querySelector(`[data-tab="${id}"]`));
    });
    const tab = this.tabs.find((t) => t.id === id);
    if (tab) {
      this.editor.setValue(tab.code);
      // Update language by creating a new model
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
  }
}

if (!customElements.get(CodeViewer.tagName)) {
  customElements.define(CodeViewer.tagName, CodeViewer);
}
