/**
 * LuminaAutocomplete — v2: async search + multi-select + virtualization + full keyboard nav.
 *
 * Features:
 *  - Local in-memory filtering (set `suggestions` attribute)
 *  - Async search (set `async-source` to a URL or use `setAsyncSource(fn)`)
 *  - Multi-select with removable tags (set `multi` attribute)
 *  - Virtualization for large lists (only renders visible items)
 *  - Full keyboard navigation: ↑/↓ navigate, Enter select, Esc close, Backspace remove last
 *  - Memory of recent selections (set `memory-key`)
 *  - Neural highlight of matched letters
 *  - Respects prefers-reduced-motion
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

export interface Suggestion {
  value: string;
  label: string;
  category?: string;
}

export type AsyncSourceFn = (query: string) => Promise<Suggestion[]>;

const VIRTUAL_PAGE = 30; // items rendered at a time

export class Autocomplete extends LuminaElement {
  static tagName = 'lumina-autocomplete';
  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'suggestions',
      'memory-key',
      'multi',
      'async-source',
      'placeholder',
      'min-chars',
      'value',
    ];
  }

  private _suggestions: Suggestion[] = [];
  private _memoryKey = '';
  private _multi = false;
  private _asyncUrl: string | null = null;
  private _asyncFn: AsyncSourceFn | null = null;
  private _selected: Suggestion[] = [];
  private _query = '';
  private filtered: Suggestion[] = [];
  private highlightIdx = -1;
  private open = false;
  private input: HTMLInputElement | null = null;
  private suggestionsEl: HTMLElement | null = null;
  private tagsEl: HTMLElement | null = null;
  private loadingEl: HTMLElement | null = null;
  private virtualStart = 0;
  private asyncTimer: ReturnType<typeof setTimeout> | null = null;
  private rafId: number | null = null;

  get suggestions(): Suggestion[] { return this._suggestions; }
  set suggestions(v: Suggestion[]) {
    this._suggestions = v;
    this.setAttribute('suggestions', JSON.stringify(v));
    this.filter();
  }
  get memoryKey(): string { return this._memoryKey; }
  set memoryKey(v: string) { this._memoryKey = v; this.setAttribute('memory-key', v); }
  get multi(): boolean { return this._multi; }
  set multi(v: boolean) { this._multi = v; v ? this.setAttribute('multi', '') : this.removeAttribute('multi'); }
  get value(): any { return this._multi ? this._selected.map((s) => s.value) : (this._selected[0]?.value ?? ''); }
  set value(v: any) {
    if (this._multi && Array.isArray(v)) {
      this._selected = v.map((val) => this._suggestions.find((s) => s.value === val) ?? { value: val, label: val });
    } else {
      this._selected = v ? [{ value: v, label: v }] : [];
    }
    this._renderTags();
    this._syncInput();
  }

  /** Set a custom async source function (overrides async-source URL). */
  public setAsyncSource(fn: AsyncSourceFn): void {
    this._asyncFn = fn;
  }

  protected render(): string {
    return `
      <div class="lmau" part="field">
        <div class="lmau__tags" part="tags"></div>
        <div class="lmau__shell" part="control">
          <div class="lmau__bg" aria-hidden="true"></div>
          <input class="lmau__el" type="text" placeholder="${this.getAttribute('placeholder') ?? 'Digite para buscar...'}" />
          <span class="lmau__loading" part="loading" aria-hidden="true">
            <span class="lmau__spinner"></span>
          </span>
        </div>
        <div class="lmau__suggestions" part="suggestions" role="listbox">
          <div class="lmau__virtual" part="virtual"></div>
        </div>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); position: relative; }
      .lmau__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
      .lmau__tags:empty { display: none; }
      .lmau__tag { display: inline-flex; align-items: center; gap: 6px; padding: 3px 4px 3px 10px; border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-accent-rgb) / 0.15); border: 1px solid rgb(var(--lumina-accent-rgb) / 0.3); color: var(--lumina-accent); font: 600 12px var(--lumina-font-sans); animation: lmau-tag-in var(--lumina-speed) var(--lumina-ease-spring); }
      .lmau__tag-remove { appearance: none; border: 0; background: rgb(var(--lumina-accent-rgb) / 0.2); color: var(--lumina-accent); width: 18px; height: 18px; border-radius: 50%; cursor: pointer; font: 700 12px sans-serif; line-height: 1; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
      .lmau__tag-remove:hover { background: rgb(var(--lumina-accent-rgb) / 0.4); }
      @keyframes lmau-tag-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      .lmau__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmau__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmau__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmau__el { position: relative; z-index: 1; width: 100%; height: 100%; padding: 0 38px 0 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); }
      .lmau__el::placeholder { color: var(--lumina-text-muted); }
      .lmau__loading { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; opacity: 0; transition: opacity 0.2s; z-index: 2; }
      .lmau__loading[data-on] { opacity: 1; }
      .lmau__spinner { display: block; width: 14px; height: 14px; border: 2px solid rgb(var(--lumina-accent-rgb) / 0.3); border-top-color: var(--lumina-accent); border-radius: 50%; animation: lmau-spin 0.6s linear infinite; }
      @keyframes lmau-spin { to { transform: rotate(360deg); } }
      .lmau__suggestions { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 1000; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / calc(var(--lumina-surface-alpha) + 0.15)); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border: 1px solid var(--lumina-border); box-shadow: 0 16px 48px -12px rgb(0 0 0 / 0.5); overflow: hidden; max-height: 0; opacity: 0; transition: max-height var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmau__suggestions[data-open] { max-height: 320px; opacity: 1; overflow-y: auto; }
      .lmau__virtual { position: relative; }
      .lmau__category { padding: 6px 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--lumina-text-muted); background: rgb(var(--lumina-accent-rgb) / 0.05); position: sticky; top: 0; }
      .lmau__suggestion { padding: 10px 14px; cursor: pointer; font-size: 14px; color: var(--lumina-text); transition: background 0.15s; }
      .lmau__suggestion:hover, .lmau__suggestion[data-highlighted] { background: rgb(var(--lumina-accent-rgb) / 0.15); }
      .lmau__suggestion[data-selected] { background: rgb(var(--lumina-accent-rgb) / 0.25); color: var(--lumina-accent); font-weight: 600; }
      .lmau__suggestion[data-recent]::before { content: '· recent · '; opacity: 0.6; font-size: 10px; }
      .lmau__highlight { color: var(--lumina-accent); font-weight: 700; }
      .lmau__empty { padding: 14px; font-size: 13px; color: var(--lumina-text-muted); text-align: center; }
      @media (prefers-reduced-motion: reduce) { .lmau__suggestions, .lmau__tag, .lmau__spinner { transition: none !important; animation: none !important; } }
    `;
  }

  protected mounted(): void {
    const sugAttr = this.getAttribute('suggestions');
    if (sugAttr) { try { this._suggestions = JSON.parse(sugAttr); } catch { this._suggestions = []; } }
    this._memoryKey = this.getAttribute('memory-key') ?? '';
    this._multi = this.hasAttribute('multi');
    this._asyncUrl = this.getAttribute('async-source');
    const minChars = parseInt(this.getAttribute('min-chars') ?? '1', 10) || 1;
    this.input = this.$$('.lmau__el') as HTMLInputElement | null;
    this.suggestionsEl = this.$$('.lmau__suggestions');
    this.tagsEl = this.$$('.lmau__tags');
    this.loadingEl = this.$$('.lmau__loading');
    this.input?.addEventListener('input', this.onInput);
    this.input?.addEventListener('keydown', this.onKeydown);
    this.input?.addEventListener('focus', () => this.dispatchEvent(new CustomEvent('lumina-focus', { bubbles: true, composed: true, detail: { value: this._query } })));
    this.input?.addEventListener('blur', () => this.dispatchEvent(new CustomEvent('lumina-blur', { bubbles: true, composed: true, detail: { value: this._query } })));
    this.suggestionsEl?.addEventListener('scroll', this.onScroll);
    document.addEventListener('click', this.onDocClick);
  }

  protected unmounted(): void {
    document.removeEventListener('click', this.onDocClick);
    if (this.asyncTimer) clearTimeout(this.asyncTimer);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'suggestions' && value) {
      try { this._suggestions = JSON.parse(value); this.filter(); } catch {}
    } else if (name === 'memory-key') this._memoryKey = value ?? '';
    else if (name === 'multi') this._multi = value !== null;
    else if (name === 'async-source') this._asyncUrl = value;
    else if (name === 'value' && value) {
      try { this.value = JSON.parse(value); } catch { this.value = value; }
    }
  }

  private onInput = (e: Event): void => {
    this._query = (e.target as HTMLInputElement).value;
    if (this._asyncFn || this._asyncUrl) {
      this._asyncSearch(this._query);
    } else {
      this.filter();
    }
  };

  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.highlightIdx = Math.min(this.highlightIdx + 1, this.filtered.length - 1);
      this._updateHighlight();
      this._scrollToHighlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.highlightIdx = Math.max(this.highlightIdx - 1, 0);
      this._updateHighlight();
      this._scrollToHighlight();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.highlightIdx >= 0 && this.filtered[this.highlightIdx]) {
        this._select(this.filtered[this.highlightIdx]);
      }
    } else if (e.key === 'Escape') {
      this._close();
    } else if (e.key === 'Backspace' && this._multi && !this._query && this._selected.length > 0) {
      // Remove last tag on backspace when input is empty
      this._removeTag(this._selected.length - 1);
    }
  };

  private onScroll = (): void => {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this._renderVirtual());
  };

  private onDocClick = (e: MouseEvent): void => {
    if (!this.contains(e.target as Node)) this._close();
  };

  private async _asyncSearch(query: string): Promise<void> {
    const minChars = parseInt(this.getAttribute('min-chars') ?? '1', 10) || 1;
    if (query.length < minChars) {
      this._close();
      return;
    }
    if (this.asyncTimer) clearTimeout(this.asyncTimer);
    this.loadingEl?.setAttribute('data-on', '');
    this.asyncTimer = setTimeout(async () => {
      try {
        let results: Suggestion[];
        if (this._asyncFn) {
          results = await this._asyncFn(query);
        } else if (this._asyncUrl) {
          const url = this._asyncUrl.replace('{q}', encodeURIComponent(query));
          const res = await fetch(url);
          results = await res.json();
        } else {
          results = [];
        }
        this._suggestions = results;
        this.filter();
      } catch (err) {
        this.dispatchEvent(new CustomEvent('lumina-error', { bubbles: true, composed: true, detail: { error: err } }));
      } finally {
        this.loadingEl?.removeAttribute('data-on');
      }
    }, 250); // debounce
  }

  private filter(): void {
    if (!this.suggestionsEl) return;
    const q = this._query.toLowerCase().trim();
    if (!q) {
      // Show recent items when no query
      const recent = this._getRecent();
      if (recent.length === 0) { this._close(); return; }
      this.filtered = this._suggestions.filter((s) => recent.includes(s.value));
    } else {
      this.filtered = this._suggestions.filter((s) => s.label.toLowerCase().includes(q));
      // Boost recent items
      const recent = this._getRecent();
      this.filtered.sort((a, b) => {
        const aR = recent.includes(a.value) ? 0 : 1;
        const bR = recent.includes(b.value) ? 0 : 1;
        return aR - bR;
      });
    }
    if (this.filtered.length === 0) {
      this.suggestionsEl.innerHTML = `<div class="lmau__empty">Nenhum resultado encontrado.</div>`;
      this.suggestionsEl.setAttribute('data-open', '');
      this.open = true;
      return;
    }
    this.highlightIdx = -1;
    this.virtualStart = 0;
    this._renderVirtual();
    this.suggestionsEl.setAttribute('data-open', '');
    this.open = true;
  }

  /**
   * Render only the visible items (virtualization).
   * Renders up to VIRTUAL_PAGE items starting at this.virtualStart.
   */
  private _renderVirtual(): void {
    if (!this.suggestionsEl || !this.filtered.length) return;
    const scrollTop = this.suggestionsEl.scrollTop;
    const itemHeight = 38; // approximate
    const viewportHeight = 280;
    const newStart = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
    const visibleCount = Math.min(VIRTUAL_PAGE, this.filtered.length - newStart);
    if (newStart === this.virtualStart && this.suggestionsEl.dataset.lastCount === String(visibleCount)) return;
    this.virtualStart = newStart;

    const q = this._query.toLowerCase().trim();
    const recent = this._getRecent();
    const selectedValues = this._selected.map((s) => s.value);
    const slice = this.filtered.slice(newStart, newStart + visibleCount);
    let html = '';
    let lastCat = '';
    const spacerHeight = newStart * itemHeight;
    if (spacerHeight > 0) html += `<div style="height:${spacerHeight}px"></div>`;
    slice.forEach((s, i) => {
      const realIdx = newStart + i;
      if (s.category && s.category !== lastCat) {
        html += `<div class="lmau__category">${s.category}</div>`;
        lastCat = s.category;
      }
      const idx = s.label.toLowerCase().indexOf(q);
      let labelHtml = s.label;
      if (q && idx >= 0) {
        labelHtml = s.label.slice(0, idx) + `<span class="lmau__highlight">${s.label.slice(idx, idx + q.length)}</span>` + s.label.slice(idx + q.length);
      }
      const recentAttr = recent.includes(s.value) ? 'data-recent' : '';
      const selectedAttr = selectedValues.includes(s.value) ? 'data-selected' : '';
      html += `<div class="lmau__suggestion" data-idx="${realIdx}" data-value="${s.value}" ${recentAttr} ${selectedAttr}>${labelHtml}</div>`;
    });
    const trailing = (this.filtered.length - (newStart + visibleCount)) * itemHeight;
    if (trailing > 0) html += `<div style="height:${trailing}px"></div>`;
    this.suggestionsEl.innerHTML = `<div class="lmau__virtual">${html}</div>`;
    this.suggestionsEl.dataset.lastCount = String(visibleCount);
    this._bindSuggestionClicks();
    this._updateHighlight();
  }

  private _bindSuggestionClicks(): void {
    this.suggestionsEl?.querySelectorAll('.lmau__suggestion').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx') ?? '-1', 10);
        if (idx >= 0) this._select(this.filtered[idx]);
      });
      el.addEventListener('mouseenter', () => {
        this.highlightIdx = parseInt(el.getAttribute('data-idx') ?? '-1', 10);
        this._updateHighlight();
      });
    });
  }

  private _updateHighlight(): void {
    this.suggestionsEl?.querySelectorAll('.lmau__suggestion').forEach((el) => {
      const idx = parseInt(el.getAttribute('data-idx') ?? '-1', 10);
      el.toggleAttribute('data-highlighted', idx === this.highlightIdx);
    });
    if (this.highlightIdx >= 0 && this.filtered[this.highlightIdx]) {
      this.dispatchEvent(new CustomEvent('lumina-suggestion-highlight', { bubbles: true, composed: true, detail: { suggestion: this.filtered[this.highlightIdx] } }));
    }
  }

  private _scrollToHighlight(): void {
    if (this.highlightIdx < 0) return;
    const itemHeight = 38;
    const neededTop = this.highlightIdx * itemHeight;
    const neededBottom = neededTop + itemHeight;
    const scrollTop = this.suggestionsEl?.scrollTop ?? 0;
    const viewportHeight = 280;
    if (neededTop < scrollTop) {
      if (this.suggestionsEl) this.suggestionsEl.scrollTop = neededTop;
    } else if (neededBottom > scrollTop + viewportHeight) {
      if (this.suggestionsEl) this.suggestionsEl.scrollTop = neededBottom - viewportHeight;
    }
    // If highlighted item is outside the virtual window, re-render
    if (this.highlightIdx < this.virtualStart || this.highlightIdx >= this.virtualStart + VIRTUAL_PAGE) {
      this.virtualStart = Math.max(0, this.highlightIdx - 5);
      this._renderVirtual();
    }
  }

  private _select(s: Suggestion): void {
    if (this._multi) {
      // Toggle tag
      const exists = this._selected.find((x) => x.value === s.value);
      if (exists) {
        this._selected = this._selected.filter((x) => x.value !== s.value);
      } else {
        this._selected.push(s);
      }
      this._renderTags();
      this._syncInput();
      this.dispatchEvent(new CustomEvent('lumina-select', { bubbles: true, composed: true, detail: { value: this.value, selected: s } }));
      // Re-render to show selected state
      this._renderVirtual();
    } else {
      this._selected = [s];
      this._syncInput();
      this._saveRecent(s.value);
      this._close();
      this.dispatchEvent(new CustomEvent('lumina-select', { bubbles: true, composed: true, detail: { value: s.value, label: s.label } }));
    }
  }

  private _removeTag(idx: number): void {
    const removed = this._selected[idx];
    this._selected.splice(idx, 1);
    this._renderTags();
    this._syncInput();
    this.dispatchEvent(new CustomEvent('lumina-tag-remove', { bubbles: true, composed: true, detail: { removed } }));
  }

  private _renderTags(): void {
    if (!this.tagsEl || !this._multi) return;
    if (this._selected.length === 0) {
      this.tagsEl.innerHTML = '';
      return;
    }
    this.tagsEl.innerHTML = this._selected.map((s, i) =>
      `<span class="lmau__tag">${s.label}<button class="lmau__tag-remove" data-idx="${i}" aria-label="Remover">×</button></span>`
    ).join('');
    this.tagsEl.querySelectorAll('.lmau__tag-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-idx') ?? '-1', 10);
        if (idx >= 0) this._removeTag(idx);
      });
    });
  }

  private _syncInput(): void {
    if (!this.input) return;
    if (this._multi) {
      this.input.value = '';
      this.input.placeholder = this._selected.length > 0 ? 'Adicionar outro...' : (this.getAttribute('placeholder') ?? 'Digite para buscar...');
    } else {
      this.input.value = this._selected[0]?.label ?? '';
    }
  }

  private _close(): void {
    this.suggestionsEl?.removeAttribute('data-open');
    this.open = false;
  }

  private _getRecent(): string[] {
    if (!this._memoryKey) return [];
    try { return JSON.parse(localStorage.getItem(`lumina-autocomplete-${this._memoryKey}`) ?? '[]'); } catch { return []; }
  }

  private _saveRecent(val: string): void {
    if (!this._memoryKey) return;
    const recent = this._getRecent().filter((v) => v !== val);
    recent.unshift(val);
    localStorage.setItem(`lumina-autocomplete-${this._memoryKey}`, JSON.stringify(recent.slice(0, 5)));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-autocomplete': Autocomplete;
  }
}

if (!customElements.get(Autocomplete.tagName)) {
  customElements.define(Autocomplete.tagName, Autocomplete);
}
