/**
 * LuminaUI — CodeBlock with copy button.
 *
 * Simple <pre><code> block with a copy-to-clipboard button in the corner.
 * Used for short snippets where Monaco would be overkill (Vanilla, React,
 * shell commands).
 */

const styles = `
:host {
  display: block;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #0b0b14;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 12.5px;
  line-height: 1.55;
}
.code-block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(245, 245, 255, 0.6);
}
.code-block__lang {
  font-family: inherit;
  color: var(--lumina-accent, #7c5cff);
}
.code-block__copy {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(245, 245, 255, 0.8);
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-weight: 600;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.code-block__copy:hover {
  background: rgba(124, 92, 255, 0.2);
  color: #fff;
}
.code-block__copy[data-copied] {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
  color: #4ade80;
}
.code-block__pre {
  margin: 0;
  padding: 14px 16px;
  overflow: auto;
  max-height: 520px;
  color: #e8e8f5;
}
.code-block__pre code {
  font-family: inherit;
  white-space: pre;
}
`;

export class CodeBlock extends HTMLElement {
  static tagName = 'lumina-code-block';

  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    this.shadow.adoptedStyleSheets = [sheet];
  }

  connectedCallback(): void {
    const lang = this.getAttribute('lang') ?? 'ts';
    const title = this.getAttribute('title') ?? lang;
    const code = this.textContent ?? '';
    this.shadow.innerHTML = `
      <div class="code-block__head">
        <span class="code-block__lang">${title}</span>
        <button class="code-block__copy" type="button" aria-label="Copiar código">Copiar</button>
      </div>
      <pre class="code-block__pre"><code></code></pre>
    `;
    const codeEl = this.shadow.querySelector('code')!;
    codeEl.textContent = code;

    this.shadow.querySelector('.code-block__copy')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget as HTMLButtonElement;
      try {
        try {
          await navigator.clipboard.writeText(code);
        } catch(e) {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = code;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch(e2) {}
          ta.remove();
        }
        btn.setAttribute('data-copied', '');
        btn.textContent = 'Copiado!';
        setTimeout(() => {
          btn.removeAttribute('data-copied');
          btn.textContent = 'Copiar';
        }, 1600);
      } catch {
        btn.textContent = 'Erro';
      }
    });
  }
}

if (!customElements.get(CodeBlock.tagName)) {
  customElements.define(CodeBlock.tagName, CodeBlock);
}
