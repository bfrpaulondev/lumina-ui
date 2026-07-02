/**
 * LuminaAutocomplete — Sugestões com highlight neural, memória (localStorage) e navegação fluida.
 * Variants: neural | glass | contextual
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

interface Suggestion { value: string; label: string; category?: string; }

export class Autocomplete extends LuminaElement {
  static tagName = 'lumina-autocomplete';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'suggestions', 'memory-key']; }
  private _suggestions: Suggestion[] = [];
  private _memoryKey = '';
  private _value = '';
  private input: HTMLInputElement | null = null;
  private suggestionsEl: HTMLElement | null = null;
  private highlightIdx = -1;
  private filtered: Suggestion[] = [];

  get suggestions(): Suggestion[] { return this._suggestions; }
  set suggestions(v: Suggestion[]) { this._suggestions = v; this.setAttribute('suggestions', JSON.stringify(v)); this.filter(); }
  get memoryKey(): string { return this._memoryKey; }
  set memoryKey(v: string) { this._memoryKey = v; this.setAttribute('memory-key', v); }

  protected render(): string {
    return `
      <div class="lmau" part="field">
        <div class="lmau__shell" part="control">
          <div class="lmau__bg" aria-hidden="true"></div>
          <input class="lmau__el" type="text" placeholder="Digite para buscar..." />
        </div>
        <div class="lmau__suggestions" part="suggestions" aria-hidden="true"></div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmau__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmau__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmau__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmau__el { position: relative; z-index: 1; width: 100%; height: 100%; padding: 0 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); }
      .lmau__el::placeholder { color: var(--lumina-text-muted); }
      .lmau__suggestions { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 1000; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); overflow: hidden; max-height: 0; opacity: 0; transition: max-height var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmau__suggestions[data-open] { max-height: 300px; opacity: 1; }
      .lmau__category { padding: 6px 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--lumina-text-muted); background: rgb(var(--lumina-accent-rgb) / 0.05); }
      .lmau__suggestion { padding: 10px 14px; cursor: pointer; font-size: 14px; color: var(--lumina-text); transition: background 0.15s; animation: lmau-fade var(--lumina-speed) var(--lumina-ease-out); }
      @keyframes lmau-fade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      .lmau__suggestion:hover, .lmau__suggestion[data-highlighted] { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lmau__suggestion[data-recent]::before { content: '🕐 '; opacity: 0.6; }
      .lmau__highlight { color: var(--lumina-accent); font-weight: 700; text-shadow: 0 0 6px rgb(var(--lumina-accent-rgb) / 0.5); }
      @media (prefers-reduced-motion: reduce) { .lmau__suggestions, .lmau__suggestion { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    const sugAttr = this.getAttribute('suggestions');
    if (sugAttr) { try { this._suggestions = JSON.parse(sugAttr); } catch { this._suggestions = []; } }
    this._memoryKey = this.getAttribute('memory-key') ?? '';
    this.input = this.$$('.lmau__el') as HTMLInputElement | null;
    this.suggestionsEl = this.$$('.lmau__suggestions');
    this.input?.addEventListener('input', this.onInput);
    this.input?.addEventListener('keydown', this.onKeydown);
    document.addEventListener('click', this.onDocClick);
  }
  protected unmounted(): void { document.removeEventListener('click', this.onDocClick); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'suggestions' && value) { try { this._suggestions = JSON.parse(value); this.filter(); } catch {} }
    else if (name === 'memory-key') this._memoryKey = value ?? '';
  }
  private onInput = (e: Event): void => {
    this._value = (e.target as HTMLInputElement).value;
    this.filter();
  };
  private onKeydown = (e: KeyboardEvent): void => {
    if (!this.suggestionsEl?.hasAttribute('data-open')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.highlightIdx = Math.min(this.highlightIdx + 1, this.filtered.length - 1); this.updateHighlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.highlightIdx = Math.max(this.highlightIdx - 1, 0); this.updateHighlight(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (this.highlightIdx >= 0 && this.filtered[this.highlightIdx]) this.select(this.filtered[this.highlightIdx]); }
    else if (e.key === 'Escape') { this.suggestionsEl?.removeAttribute('data-open'); }
  };
  private onDocClick = (e: MouseEvent): void => { if (!this.contains(e.target as Node)) this.suggestionsEl?.removeAttribute('data-open'); };
  private filter(): void {
    if (!this.suggestionsEl) return;
    const q = this._value.toLowerCase().trim();
    if (!q) { this.suggestionsEl.removeAttribute('data-open'); this.suggestionsEl.innerHTML = ''; return; }
    this.filtered = this._suggestions.filter((s) => s.label.toLowerCase().includes(q));
    // Boost recent items to top
    const recent = this.getRecent();
    this.filtered.sort((a, b) => {
      const aR = recent.includes(a.value) ? 0 : 1;
      const bR = recent.includes(b.value) ? 0 : 1;
      return aR - bR;
    });
    if (this.filtered.length === 0) { this.suggestionsEl.removeAttribute('data-open'); return; }
    let html = '';
    let lastCat = '';
    this.filtered.forEach((s, i) => {
      if (s.category && s.category !== lastCat) { html += `<div class="lmau__category">${s.category}</div>`; lastCat = s.category; }
      const idx = s.label.toLowerCase().indexOf(q);
      const before = s.label.slice(0, idx);
      const match = s.label.slice(idx, idx + q.length);
      const after = s.label.slice(idx + q.length);
      const recentAttr = recent.includes(s.value) ? 'data-recent' : '';
      html += `<div class="lmau__suggestion" data-idx="${i}" data-value="${s.value}" ${recentAttr}>${before}<span class="lmau__highlight">${match}</span>${after}</div>`;
    });
    this.suggestionsEl.innerHTML = html;
    this.suggestionsEl.setAttribute('data-open', '');
    this.highlightIdx = -1;
    this.suggestionsEl.querySelectorAll('.lmau__suggestion').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx') ?? '-1', 10);
        if (idx >= 0) this.select(this.filtered[idx]);
      });
      el.addEventListener('mouseenter', () => { this.highlightIdx = parseInt(el.getAttribute('data-idx') ?? '-1', 10); this.updateHighlight(); });
    });
  }
  private updateHighlight(): void {
    this.suggestionsEl?.querySelectorAll('.lmau__suggestion').forEach((el) => {
      const idx = parseInt(el.getAttribute('data-idx') ?? '-1', 10);
      el.toggleAttribute('data-highlighted', idx === this.highlightIdx);
      if (idx === this.highlightIdx) (el as HTMLElement).scrollIntoView({ block: 'nearest' });
    });
    if (this.highlightIdx >= 0) this.dispatchEvent(new CustomEvent('lumina-suggestion-highlight', { bubbles: true, composed: true, detail: { suggestion: this.filtered[this.highlightIdx] } }));
  }
  private select(s: Suggestion): void {
    this._value = s.label;
    if (this.input) this.input.value = s.label;
    this.suggestionsEl?.removeAttribute('data-open');
    this.saveRecent(s.value);
    this.dispatchEvent(new CustomEvent('lumina-select', { bubbles: true, composed: true, detail: { value: s.value, label: s.label } }));
  }
  private getRecent(): string[] {
    if (!this._memoryKey) return [];
    try { return JSON.parse(localStorage.getItem(`lumina-autocomplete-${this._memoryKey}`) ?? '[]'); } catch { return []; }
  }
  private saveRecent(val: string): void {
    if (!this._memoryKey) return;
    const recent = this.getRecent().filter((v) => v !== val);
    recent.unshift(val);
    localStorage.setItem(`lumina-autocomplete-${this._memoryKey}`, JSON.stringify(recent.slice(0, 5)));
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-autocomplete': Autocomplete } }
if (!customElements.get(Autocomplete.tagName)) customElements.define(Autocomplete.tagName, Autocomplete);
