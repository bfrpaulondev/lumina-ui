/**
 * LuminaSearchInput — Busca com sugestões (fade+morph), highlight neural, ícone que vira X, voz.
 * Variants: glass | neural | minimal
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class SearchInput extends LuminaElement {
  static tagName = 'lumina-search-input';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'value', 'suggestions', 'voice'];
  }
  private _value = '';
  private _suggestions: string[] = [];
  private _voice = false;
  private input: HTMLInputElement | null = null;
  private suggestionsEl: HTMLElement | null = null;
  private iconEl: HTMLElement | null = null;

  get value(): string { return this._value; }
  set value(v: string) { this._value = v; this.setAttribute('value', v); if (this.input) this.input.value = v; this.updateIcon(); this.filterSuggestions(); }
  get suggestions(): string[] { return this._suggestions; }
  set suggestions(v: string[]) { this._suggestions = v; this.setAttribute('suggestions', JSON.stringify(v)); this.filterSuggestions(); }
  get voice(): boolean { return this._voice; }
  set voice(v: boolean) { this._voice = v; if (v) this.setAttribute('voice',''); else this.removeAttribute('voice'); }

  protected render(): string {
    return `
      <div class="lms" part="field">
        <div class="lms__shell" part="control">
          <div class="lms__bg" aria-hidden="true"></div>
          <span class="lms__icon" part="icon" aria-hidden="true">🔍</span>
          <input class="lms__el" type="text" placeholder="Buscar..." />
          <button class="lms__voice" type="button" aria-label="Busca por voz" hidden>🎤</button>
        </div>
        <div class="lms__suggestions" part="suggestions" aria-hidden="true"></div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lms__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-pill); overflow: hidden; }
      .lms__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lms__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lms__icon { position: relative; z-index: 1; padding-left: 16px; font-size: 14px; opacity: 0.6; transition: transform var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lms__icon[data-clear] { transform: rotate(90deg); opacity: 1; cursor: pointer; }
      .lms__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 12px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); }
      .lms__el::placeholder { color: var(--lumina-text-muted); }
      .lms__voice { position: relative; z-index: 1; margin-right: 8px; appearance: none; border: 0; background: rgb(var(--lumina-accent-rgb) / 0.15); color: var(--lumina-accent); width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.2s; }
      .lms__voice:hover { transform: scale(1.1); }
      .lms__voice[recording] { animation: lms-pulse 1s ease-in-out infinite; }
      @keyframes lms-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgb(239 68 68 / 0.5); } 50% { box-shadow: 0 0 0 8px rgb(239 68 68 / 0); } }
      .lms__suggestions { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 1000; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); overflow: hidden; max-height: 0; opacity: 0; transition: max-height var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lms__suggestions[data-open] { max-height: 280px; opacity: 1; }
      .lms__suggestion { padding: 10px 16px; cursor: pointer; font-size: 14px; color: var(--lumina-text); transition: background 0.15s; animation: lms-fade-in var(--lumina-speed) var(--lumina-ease-out); }
      @keyframes lms-fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      .lms__suggestion:hover { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lms__highlight { color: var(--lumina-accent); font-weight: 700; }
      :host([variant="minimal"]) .lms__bg { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border-color: transparent; border-bottom: 1px solid var(--lumina-border); border-radius: 0; }
      :host([variant="minimal"]) .lms__shell { border-radius: 0; }
      @media (prefers-reduced-motion: reduce) { .lms__icon, .lms__suggestions, .lms__suggestion { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._value = this.getAttribute('value') ?? '';
    const sugAttr = this.getAttribute('suggestions');
    if (sugAttr) { try { this._suggestions = JSON.parse(sugAttr); } catch { this._suggestions = []; } }
    this._voice = this.hasAttribute('voice');
    this.input = this.$$('.lms__el') as HTMLInputElement | null;
    this.suggestionsEl = this.$$('.lms__suggestions');
    this.iconEl = this.$$('.lms__icon');
    const voiceBtn = this.$$('.lms__voice');
    if (this._voice && voiceBtn) voiceBtn.removeAttribute('hidden');
    if (this.input) {
      this.input.value = this._value;
      this.input.addEventListener('input', this.onInput);
    }
    this.iconEl?.addEventListener('click', this.onIconClick);
    voiceBtn?.addEventListener('click', this.onVoiceClick);
    document.addEventListener('click', this.onDocClick);
    this.updateIcon();
  }
  protected unmounted(): void { document.removeEventListener('click', this.onDocClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value') { this._value = value ?? ''; if (this.input) this.input.value = this._value; this.updateIcon(); this.filterSuggestions(); }
    else if (name === 'suggestions' && value) { try { this._suggestions = JSON.parse(value); this.filterSuggestions(); } catch {} }
    else if (name === 'voice') this._voice = value !== null;
  }
  private onInput = (e: Event): void => {
    this._value = (e.target as HTMLInputElement).value;
    this.updateIcon();
    this.filterSuggestions();
    this.dispatchEvent(new CustomEvent('lumina-search', { bubbles: true, composed: true, detail: { value: this._value } }));
  };
  private onIconClick = (): void => {
    if (this._value) { this.value = ''; this.input?.focus(); }
  };
  private updateIcon(): void {
    if (this._value) this.iconEl?.setAttribute('data-clear', '');
    else this.iconEl?.removeAttribute('data-clear');
    if (this.iconEl) this.iconEl.textContent = this._value ? '✕' : '🔍';
  };
  private filterSuggestions(): void {
    if (!this.suggestionsEl) return;
    const q = this._value.toLowerCase().trim();
    if (!q) { this.suggestionsEl.removeAttribute('data-open'); this.suggestionsEl.innerHTML = ''; return; }
    const filtered = this._suggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
    if (filtered.length === 0) { this.suggestionsEl.removeAttribute('data-open'); return; }
    this.suggestionsEl.innerHTML = filtered.map((s) => {
      const idx = s.toLowerCase().indexOf(q);
      const before = s.slice(0, idx);
      const match = s.slice(idx, idx + q.length);
      const after = s.slice(idx + q.length);
      return `<div class="lms__suggestion" data-value="${s}">${before}<span class="lms__highlight">${match}</span>${after}</div>`;
    }).join('');
    this.suggestionsEl.setAttribute('data-open', '');
    this.suggestionsEl.querySelectorAll('.lms__suggestion').forEach((el) => {
      el.addEventListener('click', () => {
        const val = el.getAttribute('data-value') ?? '';
        this.value = val;
        this.suggestionsEl?.removeAttribute('data-open');
        this.dispatchEvent(new CustomEvent('lumina-suggestion-select', { bubbles: true, composed: true, detail: { value: val } }));
      });
    });
  };
  private onDocClick = (e: MouseEvent): void => {
    if (!this.contains(e.target as Node)) this.suggestionsEl?.removeAttribute('data-open');
  };
  private onVoiceClick = (): void => {
    const voiceBtn = this.$$('.lms__voice');
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      this.dispatchEvent(new CustomEvent('lumina-voice-error', { bubbles: true, composed: true, detail: { message: 'Speech Recognition not supported' } }));
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;
    recognition.onstart = () => { voiceBtn?.setAttribute('recording', ''); this.dispatchEvent(new CustomEvent('lumina-voice-start', { bubbles: true, composed: true })); };
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      this.value = transcript;
    };
    recognition.onend = () => { voiceBtn?.removeAttribute('recording'); this.dispatchEvent(new CustomEvent('lumina-voice-end', { bubbles: true, composed: true })); };
    recognition.start();
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-search-input': SearchInput } }
if (!customElements.get(SearchInput.tagName)) customElements.define(SearchInput.tagName, SearchInput);
