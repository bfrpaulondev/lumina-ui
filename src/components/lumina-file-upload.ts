/**
 * LuminaFileUpload — Drag & drop com sucção, preview com zoom, progresso com glow.
 * Variants: glass | neural | drag
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

interface FileItem { name: string; size: number; type: string; url?: string; progress: number; }

export class FileUpload extends LuminaElement {
  static tagName = 'lumina-file-upload';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'accept', 'multiple', 'max-size']; }
  private _accept = '';
  private _multiple = false;
  private _maxSize = 0;
  private files: FileItem[] = [];
  private dropzone: HTMLElement | null = null;
  private fileInput: HTMLInputElement | null = null;
  private previewEl: HTMLElement | null = null;
  private progressEl: HTMLElement | null = null;

  get accept(): string { return this._accept; }
  set accept(v: string) { this._accept = v; this.setAttribute('accept', v); }
  get multiple(): boolean { return this._multiple; }
  set multiple(v: boolean) { this._multiple = v; if (v) this.setAttribute('multiple',''); else this.removeAttribute('multiple'); }
  get maxSize(): number { return this._maxSize; }
  set maxSize(v: number) { this._maxSize = v; this.setAttribute('max-size', String(v)); }

  protected render(): string {
    return `
      <div class="lmfu" part="dropzone">
        <input class="lmfu__input" type="file" ${this._accept ? `accept="${this._accept}"` : ''} ${this._multiple ? 'multiple' : ''} hidden />
        <div class="lmfu__zone" data-zone>
          <div class="lmfu__bg" aria-hidden="true"></div>
          <div class="lmfu__suction" aria-hidden="true"></div>
          <div class="lmfu__content">
            <div class="lmfu__icon">📁</div>
            <div class="lmfu__text">Arraste arquivos aqui ou <span class="lmfu__link">clique para selecionar</span></div>
            <div class="lmfu__hint">${this._accept ? `Aceita: ${this._accept}` : 'Qualquer tipo de arquivo'}</div>
          </div>
        </div>
        <div class="lmfu__preview" part="preview" data-preview></div>
        <div class="lmfu__progress" part="progress" data-progress hidden></div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmfu { display: flex; flex-direction: column; gap: 12px; }
      .lmfu__zone { position: relative; display: flex; align-items: center; justify-content: center; min-height: 140px; border-radius: var(--lumina-radius-lg); overflow: hidden; cursor: pointer; transition: transform var(--lumina-speed) var(--lumina-ease-spring); }
      .lmfu__bg { position: absolute; inset: 0; border-radius: inherit; background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(12px) saturate(1.3); -webkit-backdrop-filter: blur(12px) saturate(1.3); border: 2px dashed var(--lumina-border); transition: border-color var(--lumina-speed) var(--lumina-ease-out), background var(--lumina-speed) var(--lumina-ease-out); }
      .lmfu__zone:hover .lmfu__bg { border-color: rgb(var(--lumina-accent-rgb) / 0.5); }
      .lmfu__zone[data-dragging] .lmfu__bg { border-color: var(--lumina-accent); background: rgb(var(--lumina-accent-rgb) / 0.1); }
      .lmfu__zone[data-dragging] { transform: scale(0.97); }
      .lmfu__suction { position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: radial-gradient(circle, rgb(var(--lumina-accent-rgb) / 0.4), transparent 70%); transform: translate(-50%, -50%); opacity: 0; pointer-events: none; }
      .lmfu__zone[data-dragging] .lmfu__suction { animation: lmfu-suction 0.6s var(--lumina-ease-out); }
      @keyframes lmfu-suction { 0% { width: 0; height: 0; opacity: 1; } 100% { width: 200px; height: 200px; opacity: 0; } }
      .lmfu__content { position: relative; z-index: 1; text-align: center; padding: 20px; }
      .lmfu__icon { font-size: 32px; margin-bottom: 8px; }
      .lmfu__text { font-size: 14px; color: var(--lumina-text); }
      .lmfu__link { color: var(--lumina-accent); font-weight: 600; cursor: pointer; }
      .lmfu__hint { font-size: 11px; color: var(--lumina-text-muted); margin-top: 4px; }
      .lmfu__preview { display: flex; flex-wrap: wrap; gap: 8px; }
      .lmfu__file { position: relative; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); border: 1px solid var(--lumina-border); animation: lmfu-file-in var(--lumina-speed) var(--lumina-ease-spring); }
      @keyframes lmfu-file-in { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .lmfu__file-img { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; cursor: zoom-in; transition: transform 0.2s; }
      .lmfu__file-img:hover { transform: scale(1.5); z-index: 2; }
      .lmfu__file-icon { font-size: 24px; }
      .lmfu__file-info { display: flex; flex-direction: column; gap: 2px; }
      .lmfu__file-name { font-size: 13px; font-weight: 600; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .lmfu__file-size { font-size: 11px; color: var(--lumina-text-muted); }
      .lmfu__file-remove { appearance: none; border: 0; background: rgb(239 68 68 / 0.2); color: #f87171; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
      .lmfu__file-remove:hover { background: rgb(239 68 68 / 0.4); }
      .lmfu__progress { height: 4px; border-radius: 2px; background: rgb(var(--lumina-surface) / 0.4); overflow: hidden; }
      .lmfu__progress-bar { height: 100%; width: 0%; border-radius: inherit; background: linear-gradient(90deg, rgb(var(--lumina-accent-rgb) / 0.7), var(--lumina-accent)); box-shadow: 0 0 8px var(--lumina-accent); transition: width 0.2s var(--lumina-ease-out); }
      @media (prefers-reduced-motion: reduce) { .lmfu__zone, .lmfu__file, .lmfu__progress-bar { transition: none !important; animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this._accept = this.getAttribute('accept') ?? '';
    this._multiple = this.hasAttribute('multiple');
    this._maxSize = parseInt(this.getAttribute('max-size') ?? '0', 10) || 0;
    this.dropzone = this.$$('.lmfu__zone');
    this.fileInput = this.$$('.lmfu__input') as HTMLInputElement | null;
    this.previewEl = this.$$('.lmfu__preview');
    this.progressEl = this.$$('.lmfu__progress');
    this.dropzone?.addEventListener('click', () => this.fileInput?.click());
    this.fileInput?.addEventListener('change', (e) => { const files = (e.target as HTMLInputElement).files; if (files) this.addFiles(Array.from(files)); });
    this.dropzone?.addEventListener('dragover', (e) => { e.preventDefault(); this.dropzone?.setAttribute('data-dragging', ''); });
    this.dropzone?.addEventListener('dragleave', () => this.dropzone?.removeAttribute('data-dragging'));
    this.dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropzone?.removeAttribute('data-dragging');
      const files = Array.from(e.dataTransfer?.files ?? []);
      if (files.length > 0) this.addFiles(files);
    });
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'accept') this._accept = value ?? '';
    else if (name === 'multiple') this._multiple = value !== null;
    else if (name === 'max-size') this._maxSize = parseInt(value ?? '0', 10) || 0;
  }
  private addFiles(files: File[]): void {
    if (!this._multiple) this.files = [];
    for (const file of files) {
      if (this._maxSize > 0 && file.size > this._maxSize) {
        this.dispatchEvent(new CustomEvent('lumina-file-error', { bubbles: true, composed: true, detail: { name: file.name, error: 'size' } }));
        continue;
      }
      const item: FileItem = { name: file.name, size: file.size, type: file.type, progress: 0 };
      if (file.type.startsWith('image/')) item.url = URL.createObjectURL(file);
      this.files.push(item);
      this.dispatchEvent(new CustomEvent('lumina-file-add', { bubbles: true, composed: true, detail: { name: file.name, size: file.size, type: file.type } }));
      this.simulateProgress(item);
    }
    this.renderPreview();
  }
  private simulateProgress(item: FileItem): void {
    this.progressEl?.removeAttribute('hidden');
    const interval = setInterval(() => {
      item.progress = Math.min(100, item.progress + Math.random() * 20);
      this.updateProgress();
      if (item.progress >= 100) {
        clearInterval(interval);
        this.dispatchEvent(new CustomEvent('lumina-upload-progress', { bubbles: true, composed: true, detail: { name: item.name, progress: 100 } }));
        setTimeout(() => { this.progressEl?.setAttribute('hidden', ''); }, 500);
      } else {
        this.dispatchEvent(new CustomEvent('lumina-upload-progress', { bubbles: true, composed: true, detail: { name: item.name, progress: item.progress } }));
      }
    }, 200);
  }
  private updateProgress(): void {
    const bar = this.progressEl?.querySelector('.lmfu__progress-bar');
    const avg = this.files.reduce((s, f) => s + f.progress, 0) / Math.max(this.files.length, 1);
    if (bar) (bar as HTMLElement).style.width = `${avg}%`;
  }
  private renderPreview(): void {
    if (!this.previewEl) return;
    this.previewEl.innerHTML = '';
    this.files.forEach((f) => {
      const el = document.createElement('div');
      el.className = 'lmfu__file';
      if (f.url) {
        el.innerHTML = `<img class="lmfu__file-img" src="${f.url}" alt="${f.name}" /><div class="lmfu__file-info"><span class="lmfu__file-name">${f.name}</span><span class="lmfu__file-size">${this.formatSize(f.size)}</span></div><button class="lmfu__file-remove" aria-label="Remover">×</button>`;
      } else {
        const icon = f.type.startsWith('video/') ? '🎬' : f.type.startsWith('audio/') ? '🎵' : '📄';
        el.innerHTML = `<span class="lmfu__file-icon">${icon}</span><div class="lmfu__file-info"><span class="lmfu__file-name">${f.name}</span><span class="lmfu__file-size">${this.formatSize(f.size)}</span></div><button class="lmfu__file-remove" aria-label="Remover">×</button>`;
      }
      el.querySelector('.lmfu__file-remove')?.addEventListener('click', () => this.removeFile(f));
      this.previewEl!.appendChild(el);
    });
  }
  private removeFile(f: FileItem): void {
    this.files = this.files.filter((x) => x !== f);
    this.renderPreview();
    this.dispatchEvent(new CustomEvent('lumina-file-remove', { bubbles: true, composed: true, detail: { name: f.name } }));
  }
  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-file-upload': FileUpload } }
if (!customElements.get(FileUpload.tagName)) customElements.define(FileUpload.tagName, FileUpload);
