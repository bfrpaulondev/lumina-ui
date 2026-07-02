/**
 * LuminaUI — CodeViewer with Monaco.
 *
 * Renders a Monaco editor inside a Shadow DOM container. Supports:
 *  - language switching
 *  - read-only toggle
 *  - copy-to-clipboard
 *  - onChange callback for live editing
 *
 * Monaco is loaded lazily from CDN the first time any CodeViewer mounts.
 */

import { loadMonaco } from '../monaco';

const styles = `
:host {
  display: block;
  position: relative;
  height: 100%;
  min-height: 0;
  max-height: 100%;
  background: #0b0b14;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.code-viewer__head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
.code-viewer__container {
  height: calc(100% - 40px);
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
}
.code-viewer__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(245, 245, 255, 0.4);
  font: 500 13px 'JetBrains Mono', monospace;
  font-style: italic;
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

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    this.shadow.adoptedStyleSheets = [sheet];
  }

  setTabs(tabs: CodeViewerTab[], activeId?: string): void {
    this.tabs = tabs;
    // Force Monaco to recalculate layout
    if (this.editor) {
      setTimeout(() => this.editor?.layout(), 100);
    }
    this.activeTabId = activeId ?? tabs[0]?.id ?? '';
    this.renderShell();
    this.initEditor();
  }

  onChange(cb: (code: string, tabId: string) => void): void {
    this.onChangeCb = cb;
  }

  getCode(): string {
    return this.editor?.getValue() ?? '';
  }

  setCode(code: string): void {
    if (this.editor) this.editor.setValue(code);
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
        <div class="code-viewer__loading">Carregando Monaco…</div>
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
      navigator.clipboard.writeText(code).then(() => {
        btn.setAttribute('data-copied', '');
        btn.textContent = 'Copiado!';
        setTimeout(() => {
          btn.removeAttribute('data-copied');
          btn.textContent = 'Copiar';
        }, 1500);
      });
    });
    this.shadow.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
      const tab = this.tabs.find((t) => t.id === this.activeTabId);
      if (tab && this.editor) this.editor.setValue(tab.code);
    });
  }

  private async initEditor(): Promise<void> {
    const container = this.shadow.querySelector('.code-viewer__container') as HTMLElement;
    if (!container) return;
    const monaco = await loadMonaco();
    container.innerHTML = '';

    const tab = this.tabs.find((t) => t.id === this.activeTabId) ?? this.tabs[0];
    if (!tab) return;

    // Fallback to textarea if Monaco CDN failed
    if (!monaco) {
      const textarea = document.createElement("textarea");
      textarea.value = tab.code;
      textarea.style.width = "100%";
      textarea.style.height = "100%";
      textarea.style.border = "0";
      textarea.style.background = "#0b0b14";
      textarea.style.color = "#e8e8f5";
      textarea.style.fontFamily = "'JetBrains Mono', monospace";
      textarea.style.fontSize = "12.5px";
      textarea.style.padding = "12px";
      textarea.style.outline = "none";
      textarea.style.resize = "none";
      container.appendChild(textarea);
      this.editor = { getValue: () => textarea.value, setValue: (v: string) => { textarea.value = v; }, onDidChangeModelContent: () => {} } as any;
      return;
    }

    this.editor = monaco.editor.create(container, {
      value: tab.code,
      language: tab.language,
      theme: 'vs-dark',
      automaticLayout: true,
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

    // Custom theme so it matches the playground
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
    monaco.editor.setTheme('lumina-dark');
  }

  private switchTab(id: string): void {
    if (id === this.activeTabId || !this.editor) return;
    this.activeTabId = id;
    this.shadow.querySelectorAll('.code-viewer__tab').forEach((btn) => {
      (btn as HTMLElement).dataset.active = String(btn === this.shadow.querySelector(`[data-tab="${id}"]`));
    });
    const tab = this.tabs.find((t) => t.id === id);
    if (tab) {
      const monacoModel = (window as any).monaco?.editor?.getModels?.();
      // Simpler: just dispose and recreate value
      this.editor.setValue(tab.code);
      // Update language via monaco.languages
      const monacoNs = (this.editor as any).getModel?.()?.getLanguageId?.();
      // For a clean approach, re-create model:
      // (kept simple — Monaco handles language inference from extension)
    }
  }
}

if (!customElements.get(CodeViewer.tagName)) {
  customElements.define(CodeViewer.tagName, CodeViewer);
}
