/**
 * LuminaMorphLab — Morphing entre componentes diferentes em tempo real.
 * Permite trocar o componente exibido com transição morfica.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

const MORPHABLE = ['lumina-button','lumina-card','lumina-badge','lumina-chip','lumina-input','lumina-toggle-button'];

export class MorphLab extends LuminaElement {
  static tagName = 'lumina-morph-lab';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'target']; }
  private _target = 'lumina-button';
  private stage: HTMLElement | null = null;
  private currentIdx = 0;

  protected render(): string {
    return `
      <div class="lmml" part="root">
        <div class="lmml__stage" part="stage" data-stage></div>
        <div class="lmml__controls" part="controls">
          <button class="lmml__btn" data-dir="prev">← Anterior</button>
          <span class="lmml__label" part="label"></span>
          <button class="lmml__btn" data-dir="next">Próximo →</button>
        </div>
        <div class="lmml__timeline" part="timeline"></div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmml { display: flex; flex-direction: column; gap: 16px; padding: 24px; border-radius: var(--lumina-radius-lg); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(16px) saturate(1.4); -webkit-backdrop-filter: blur(16px) saturate(1.4); border: 1px solid var(--lumina-border); }
      .lmml__stage { min-height: 120px; display: flex; align-items: center; justify-content: center; border-radius: var(--lumina-radius-md); background: radial-gradient(circle at 50% 50%, rgb(var(--lumina-accent-rgb) / 0.05), transparent 70%); overflow: hidden; position: relative; }
      .lmml__stage > * { animation: lmml-morph 0.6s var(--lumina-ease-spring); }
      @keyframes lmml-morph { 0% { opacity: 0; transform: scale(0.3) rotate(180deg); filter: blur(20px); } 50% { opacity: 0.5; filter: blur(8px); } 100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); } }
      .lmml__controls { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .lmml__btn { appearance: none; border: 1px solid var(--lumina-border); background: rgb(var(--lumina-accent-rgb) / 0.1); color: var(--lumina-text); padding: 8px 16px; border-radius: var(--lumina-radius-pill); cursor: pointer; font: 600 13px var(--lumina-font-sans); transition: all 0.2s; }
      .lmml__btn:hover { background: rgb(var(--lumina-accent-rgb) / 0.25); transform: translateY(-1px); }
      .lmml__label { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: var(--lumina-accent); }
      .lmml__timeline { display: flex; gap: 4px; }
      .lmml__dot { flex: 1; height: 3px; border-radius: 2px; background: var(--lumina-border); transition: background 0.3s; cursor: pointer; }
      .lmml__dot[data-active] { background: var(--lumina-accent); box-shadow: 0 0 6px var(--lumina-accent); }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmml__stage > * { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this.stage = this.$$('.lmml__stage');
    this._target = this.getAttribute('target') ?? MORPHABLE[0];
    this.currentIdx = Math.max(0, MORPHABLE.indexOf(this._target));
    this.renderTimeline();
    this.renderTarget();
    this.$$('.lmml__btn[data-dir="prev"]')?.addEventListener('click', () => this.morph(-1));
    this.$$('.lmml__btn[data-dir="next"]')?.addEventListener('click', () => this.morph(1));
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'target') { this._target = value ?? MORPHABLE[0]; this.currentIdx = Math.max(0, MORPHABLE.indexOf(this._target)); this.renderTarget(); this.renderTimeline(); }
  }
  private morph(dir: number): void {
    this.currentIdx = (this.currentIdx + dir + MORPHABLE.length) % MORPHABLE.length;
    this._target = MORPHABLE[this.currentIdx];
    this.setAttribute('target', this._target);
    this.renderTarget();
    this.renderTimeline();
    this.dispatchEvent(new CustomEvent('lumina-morph', { bubbles: true, composed: true, detail: { target: this._target, index: this.currentIdx } }));
  }
  private renderTarget(): void {
    if (!this.stage) return;
    const tag = this._target;
    const el = document.createElement(tag);
    el.setAttribute('variant','glass'); el.setAttribute('intensity','intense'); el.setAttribute('accent-color','#7c5cff');
    if (tag === 'lumina-button' || tag === 'lumina-toggle-button') el.textContent = 'Morph me';
    else if (tag === 'lumina-card') el.innerHTML = '<h3 slot="title">Morph Card</h3><p>Morphing em tempo real.</p>';
    else if (tag === 'lumina-badge') { el.textContent = 'MORPH'; el.setAttribute('dot',''); }
    else if (tag === 'lumina-chip') el.textContent = 'Morph Chip';
    else if (tag === 'lumina-input') el.setAttribute('placeholder','Morph input...');
    this.stage.innerHTML = '';
    this.stage.appendChild(el);
    const label = this.$$('.lmml__label');
    if (label) label.textContent = `<${tag}>`;
  }
  private renderTimeline(): void {
    const tl = this.$$('.lmml__timeline'); if (!tl) return;
    tl.innerHTML = '';
    MORPHABLE.forEach((tag, i) => {
      const dot = document.createElement('div'); dot.className = 'lmml__dot';
      if (i === this.currentIdx) dot.setAttribute('data-active','');
      dot.addEventListener('click', () => { this.currentIdx = i; this._target = tag; this.setAttribute('target', tag); this.renderTarget(); this.renderTimeline(); });
      tl.appendChild(dot);
    });
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-morph-lab': MorphLab } }
if (!customElements.get(MorphLab.tagName)) customElements.define(MorphLab.tagName, MorphLab);
