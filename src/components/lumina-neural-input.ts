/**
 * LuminaNeuralInput — Reage ao tom emocional do texto (positivo/negativo/neutro) + sugere emojis.
 * Variants: neural | echo | adaptive
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

const POSITIVE = ['bom','ótimo','excelente','feliz','amor','perfeito','incrível','sucesso','ganhar','vitória','❤','👍','😊','🎉','✨','💪','🚀','💯'];
const NEGATIVE = ['ruim','péssimo','triste','ódio','erro','falha','perder','problema','droga','👎','😢','💀','🔥','⚠','💔','😡'];
const SENTIMENT_COLORS: Record<string, { color: string; glow: string }> = {
  positive: { color: '#22c55e', glow: '34 197 94' },
  negative: { color: '#ef4444', glow: '239 68 68' },
  neutral: { color: 'var(--lumina-accent)', glow: 'var(--lumina-accent-rgb)' },
};

export class NeuralInput extends LuminaElement {
  static tagName = 'lumina-neural-input';
  private input: HTMLInputElement | null = null;
  private reactionEl: HTMLElement | null = null;
  private currentSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';

  protected render(): string {
    return `
      <label class="lmni" part="field">
        <div class="lmni__shell" part="control">
          <div class="lmni__bg" aria-hidden="true"></div>
          <div class="lmni__glow" aria-hidden="true"></div>
          <input class="lmni__el" type="text" placeholder="Digite algo..." />
          <span class="lmni__reaction" part="reaction" aria-hidden="true"></span>
        </div>
      </label>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); --lmni-color: var(--lumina-accent); --lmni-glow: var(--lumina-accent-rgb); }
      .lmni__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmni__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color 0.3s var(--lumina-ease-out); }
      :host(:focus-within) .lmni__bg { border-color: var(--lmni-color); }
      .lmni__glow { position: absolute; inset: -2px; border-radius: inherit; pointer-events: none; opacity: 0; background: conic-gradient(from 0deg, transparent 0%, var(--lmni-color) 25%, transparent 50%, var(--lmni-color) 75%, transparent 100%); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; padding: 2px; animation: lmni-spin 4s linear infinite; animation-play-state: paused; transition: opacity 0.3s; }
      :host(:focus-within) .lmni__glow { opacity: 0.6; animation-play-state: running; }
      .lmni__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lmni-color); transition: caret-color 0.3s; }
      .lmni__el::placeholder { color: var(--lumina-text-muted); }
      .lmni__reaction { position: relative; z-index: 1; margin-right: 12px; font-size: 18px; opacity: 0; transform: scale(0); transition: opacity 0.3s, transform 0.3s var(--lumina-ease-spring); }
      .lmni__reaction[data-show] { opacity: 1; transform: scale(1); }
      @keyframes lmni-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) { .lmni__glow { animation: none !important; } .lmni__reaction { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this.input = this.$$('.lmni__el') as HTMLInputElement | null;
    this.reactionEl = this.$$('.lmni__reaction');
    this.input?.addEventListener('input', this.onInput);
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private onInput = (e: Event): void => {
    const value = (e.target as HTMLInputElement).value.toLowerCase();
    this.dispatchEvent(new CustomEvent('lumina-input', { bubbles: true, composed: true, detail: { value } }));
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let emoji = '';
    let posScore = 0; let negScore = 0;
    for (const word of POSITIVE) { if (value.includes(word.toLowerCase())) { posScore++; } }
    for (const word of NEGATIVE) { if (value.includes(word.toLowerCase())) { negScore++; } }
    if (posScore > negScore) { sentiment = 'positive'; emoji = '😊'; }
    else if (negScore > posScore) { sentiment = 'negative'; emoji = '😟'; }
    else if (value.length > 0) { emoji = '✨'; }
    if (sentiment !== this.currentSentiment) {
      this.currentSentiment = sentiment;
      const cfg = SENTIMENT_COLORS[sentiment];
      this.style.setProperty('--lmni-color', cfg.color);
      this.style.setProperty('--lmni-glow', cfg.glow);
      this.dispatchEvent(new CustomEvent('lumina-sentiment-change', { bubbles: true, composed: true, detail: { sentiment } }));
    }
    if (this.reactionEl) {
      if (emoji) { this.reactionEl.textContent = emoji; this.reactionEl.setAttribute('data-show', ''); }
      else this.reactionEl.removeAttribute('data-show');
    }
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-neural-input': NeuralInput } }
if (!customElements.get(NeuralInput.tagName)) customElements.define(NeuralInput.tagName, NeuralInput);
