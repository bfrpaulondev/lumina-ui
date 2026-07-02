/**
 * LuminaVoiceInput — Waveform animada, transcrição em tempo real, botão com pulso.
 * Variants: neural | aura | glass
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class VoiceInput extends LuminaElement {
  static tagName = 'lumina-voice-input';
  static get observedAttributes(): string[] {
    return [...LuminaElement.observedAttributes, 'value', 'placeholder', 'name', 'disabled', 'required', 'invalid', 'valid'];
  }
  private input: HTMLInputElement | null = null;
  private micBtn: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private recording = false;
  private raf = 0;
  private waveform: number[] = new Array(40).fill(0);
  private recognition: any = null;

  protected render(): string {
    return `
      <div class="lmvi" part="field">
        <div class="lmvi__shell" part="control">
          <div class="lmvi__bg" aria-hidden="true"></div>
          <input class="lmvi__el" type="text" placeholder="Fale ou digite..." />
          <button class="lmvi__mic" part="mic-button" type="button" aria-label="Falar">🎤</button>
        </div>
        <canvas class="lmvi__waveform" part="waveform" aria-hidden="true"></canvas>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmvi__shell { position: relative; display: flex; align-items: center; height: 44px; border-radius: var(--lumina-radius-md); overflow: hidden; }
      .lmvi__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 1px solid var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out); }
      :host(:focus-within) .lmvi__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmvi__el { position: relative; z-index: 1; flex: 1; height: 100%; padding: 0 16px; border: 0; background: transparent; color: var(--lumina-text); font: 500 14px var(--lumina-font-sans); outline: none; caret-color: var(--lumina-accent); }
      .lmvi__el::placeholder { color: var(--lumina-text-muted); }
      .lmvi__mic { position: relative; z-index: 1; margin-right: 8px; appearance: none; border: 0; background: rgb(var(--lumina-accent-rgb) / 0.15); color: var(--lumina-accent); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.2s; }
      .lmvi__mic:hover { transform: scale(1.1); }
      .lmvi__mic[recording] { background: rgb(239 68 68 / 0.3); color: #f87171; animation: lmvi-pulse 1s ease-in-out infinite; }
      @keyframes lmvi-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgb(239 68 68 / 0.5); } 50% { box-shadow: 0 0 0 10px rgb(239 68 68 / 0); } }
      .lmvi__waveform { display: block; width: 100%; height: 40px; margin-top: 4px; opacity: 0; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      .lmvi__waveform[data-active] { opacity: 1; }
      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) .lmvi__bg { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) .lmvi__bg { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
    `;
  }
  get value(): string { return this.input?.value ?? ''; }
  set value(v: string) { if (this.input) this.input.value = v; this.setAttribute('value', v); }

  protected mounted(): void {
    this.input = this.$$('.lmvi__el') as HTMLInputElement | null;
    this.micBtn = this.$$('.lmvi__mic');
    this.canvas = this.$$('.lmvi__waveform') as HTMLCanvasElement | null;
    this.ctx = this.canvas?.getContext('2d') ?? null;
    this.micBtn?.addEventListener('click', this.toggleRecording);
    this.input?.addEventListener('input', this.onInput);
    this.input?.addEventListener('focus', this.onFocus);
    this.input?.addEventListener('blur', this.onBlur);
    const initial = this.getAttribute('value');
    if (initial !== null && this.input) this.input.value = initial;
  }
  protected unmounted(): void { cancelAnimationFrame(this.raf); if (this.recognition) this.recognition.stop(); this.input?.removeEventListener('input', this.onInput); this.input?.removeEventListener('focus', this.onFocus); this.input?.removeEventListener('blur', this.onBlur); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'value' && value !== null && this.input) this.input.value = value;
    else if (name === 'disabled' && this.input) (this.input as any).disabled = value !== null;
  }
  private onInput = (e: Event): void => {
    this.dispatchEvent(new CustomEvent('lumina-change', { bubbles: true, composed: true, detail: { value: (e.target as HTMLInputElement).value } }));
  };
  private onFocus = (): void => { this.dispatchEvent(new CustomEvent('lumina-focus', { bubbles: true, composed: true, detail: { value: this.value } })); };
  private onBlur = (): void => { this.dispatchEvent(new CustomEvent('lumina-blur', { bubbles: true, composed: true, detail: { value: this.value } })); };
  private toggleRecording = (): void => {
    if (this.recording) { this.stopRecording(); } else { this.startRecording(); }
  };
  private startRecording(): void {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { console.warn('Speech Recognition not supported'); return; }
    this.recognition = new SR();
    this.recognition.lang = 'pt-BR';
    this.recognition.interimResults = true;
    this.recognition.continuous = true;
    this.recognition.onstart = () => {
      this.recording = true;
      this.micBtn?.setAttribute('recording', '');
      this.canvas?.setAttribute('data-active', '');
      this.raf = requestAnimationFrame(this.drawWaveform);
      this.dispatchEvent(new CustomEvent('lumina-voice-start', { bubbles: true, composed: true }));
    };
    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      if (this.input) this.input.value = transcript;
      this.dispatchEvent(new CustomEvent('lumina-transcript', { bubbles: true, composed: true, detail: { transcript } }));
    };
    this.recognition.onend = () => { this.stopRecording(); };
    this.recognition.start();
  }
  private stopRecording(): void {
    this.recording = false;
    this.micBtn?.removeAttribute('recording');
    this.canvas?.removeAttribute('data-active');
    cancelAnimationFrame(this.raf);
    if (this.recognition) { try { this.recognition.stop(); } catch {} }
    this.dispatchEvent(new CustomEvent('lumina-voice-end', { bubbles: true, composed: true }));
  }
  private drawWaveform = (): void => {
    if (!this.ctx || !this.canvas) { this.raf = requestAnimationFrame(this.drawWaveform); return; }
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.clientWidth; const h = this.canvas.clientHeight;
    if (this.canvas.width !== w * dpr) { this.canvas.width = w * dpr; this.canvas.height = h * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    this.ctx.clearRect(0, 0, w, h);
    // Shift waveform and add new random value (simulated)
    this.waveform.shift();
    this.waveform.push(this.recording ? Math.random() * 0.8 + 0.2 : 0);
    const barWidth = w / this.waveform.length;
    const color = (this.shadow.host as HTMLElement).style.getPropertyValue('--lumina-accent').trim() || '#7c5cff';
    this.ctx.fillStyle = color;
    for (let i = 0; i < this.waveform.length; i++) {
      const val = this.waveform[i];
      const barH = val * h * 0.8;
      const x = i * barWidth + barWidth * 0.2;
      const y = (h - barH) / 2;
      this.ctx.fillRect(x, y, barWidth * 0.6, barH);
    }
    this.raf = requestAnimationFrame(this.drawWaveform);
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-voice-input': VoiceInput } }
if (!customElements.get(VoiceInput.tagName)) customElements.define(VoiceInput.tagName, VoiceInput);
