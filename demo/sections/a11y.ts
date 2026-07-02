/**
 * Accessibility Inspector — verify how LuminaUI handles:
 *  - ARIA roles / states (button, switch, dialog, progressbar, tooltip)
 *  - Keyboard navigation (Tab, Enter, Space, Esc, arrow keys)
 *  - prefers-reduced-motion
 *  - Focus visibility / focus trap (modal)
 */
import type { Route } from '../app';
import { el, sectionHead } from './_shared';

export default async function a11ySection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'a11y' });

  root.innerHTML = `
    ${sectionHead('♿', 'Accessibility Inspector', 'Veja como a biblioteca lida com screen readers, reduced motion e navegação por teclado — sem truques.').outerHTML}

    <div class="a11y__layout">
      <div class="a11y__col">
        <h3>1. ARIA roles & states</h3>
        <p>Cada componente expõe o role correto e estados ARIA refletidos via atributos.</p>
        <table class="a11y__table">
          <thead><tr><th>Componente</th><th>Role</th><th>Estados ARIA</th></tr></thead>
          <tbody>
            <tr><td><code>lumina-button</code></td><td>button</td><td>aria-disabled, aria-pressed</td></tr>
            <tr><td><code>lumina-toggle</code></td><td>switch</td><td>aria-checked</td></tr>
            <tr><td><code>lumina-modal</code></td><td>dialog</td><td>aria-modal, focus trap</td></tr>
            <tr><td><code>lumina-input</code></td><td>textbox</td><td>aria-invalid, aria-label</td></tr>
            <tr><td><code>lumina-progress</code></td><td>progressbar</td><td>aria-valuenow/min/max</td></tr>
            <tr><td><code>lumina-tooltip</code></td><td>tooltip</td><td>aria-hidden toggle</td></tr>
            <tr><td><code>lumina-navigation</code></td><td>nav (semântico)</td><td>active item via aria-current</td></tr>
          </tbody>
        </table>

        <h3>2. Live component</h3>
        <p>Use DevTools Accessibility panel (ou VoiceOver/NVDA) para inspecionar:</p>
        <div class="a11y__demo">
          <lumina-button variant="glass" intensity="medium" accent-color="#7c5cff">Botão ARIA</lumina-button>
          <lumina-toggle variant="glass" intensity="medium" accent-color="#7c5cff" checked>Switch ARIA</lumina-toggle>
          <lumina-progress variant="glass" intensity="medium" accent-color="#7c5cff" value="42"></lumina-progress>
          <lumina-badge variant="aura" dot pulse>Status</lumina-badge>
        </div>
      </div>

      <div class="a11y__col">
        <h3>3. prefers-reduced-motion</h3>
        <p>Toda animação é desativada quando o usuário pede. Ative para ver:</p>
        <div class="a11y__toggle">
          <label class="a11y__switch">
            <input type="checkbox" data-motion-toggle />
            <span>Simular <code>prefers-reduced-motion: reduce</code></span>
          </label>
        </div>
        <div class="a11y__demo">
          <lumina-button variant="aura" intensity="intense" accent-color="#ffd166">Hover me</lumina-button>
          <lumina-card variant="aura" intensity="intense" accent-color="#ffd166">
            <h3 slot="title">Card flutuante</h3>
            <p>Para de flutuar quando reduced-motion está ativo.</p>
          </lumina-card>
        </div>

        <h3>4. Keyboard navigation</h3>
        <p>Use <kbd>Tab</kbd> para percorrer. <kbd>Enter</kbd>/<kbd>Space</kbd> ativam botões e toggles.</p>
        <div class="a11y__demo">
          <lumina-button variant="glass">Botão 1</lumina-button>
          <lumina-button variant="glass">Botão 2</lumina-button>
          <lumina-toggle variant="glass">Toggle 1</lumina-toggle>
          <lumina-button variant="glass">Botão 3</lumina-button>
        </div>

        <h3>5. Focus trap (modal)</h3>
        <p>Abra o modal e use <kbd>Tab</kbd> — o foco fica preso. <kbd>Esc</kbd> fecha.</p>
        <div class="a11y__demo">
          <lumina-button variant="dimensional" intensity="intense" accent-color="#7c5cff" depth="deep" id="a11y-open-modal">Abrir modal</lumina-button>
        </div>
        <lumina-modal variant="dimensional" depth="deep" id="a11y-modal">
          <span slot="title">Focus trap demo</span>
          <p>Use Tab. O foco circula apenas entre os elementos focáveis dentro do modal.</p>
          <div slot="footer">
            <lumina-button variant="glass" id="a11y-modal-cancel">Cancelar</lumina-button>
            <lumina-button variant="dimensional" accent-color="#7c5cff">OK</lumina-button>
          </div>
        </lumina-modal>
      </div>
    </div>

    <div class="a11y__hint">
      <p><strong>Compromisso de a11y:</strong> Todos os componentes respeitam <code>prefers-reduced-motion</code>, têm roles ARIA apropriados, são navegáveis por teclado e visíveis em <code>:focus-visible</code>. O canvas de partículas usa <code>aria-hidden="true"</code> para não confundir screen readers.</p>
    </div>
  `;

  // Wire modal
  const openBtn = root.querySelector('#a11y-open-modal') as HTMLElement;
  const modal = root.querySelector('#a11y-modal') as any;
  const cancelBtn = root.querySelector('#a11y-modal-cancel') as HTMLElement;
  openBtn.addEventListener('lumina-press', () => modal.showModal());
  cancelBtn.addEventListener('lumina-press', () => modal.close());

  // Wire reduced-motion simulation
  const motionToggle = root.querySelector('[data-motion-toggle]') as HTMLInputElement;
  let styleEl: HTMLStyleElement | null = null;
  motionToggle.addEventListener('change', () => {
    if (motionToggle.checked) {
      styleEl = document.createElement('style');
      styleEl.textContent = `
        @media (prefers-reduced-motion: no-preference) {
          * { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }
        }
      `;
      document.head.appendChild(styleEl);
    } else if (styleEl) {
      styleEl.remove();
      styleEl = null;
    }
  });

  return root;
}
