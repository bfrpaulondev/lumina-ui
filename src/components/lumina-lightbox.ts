/**
 * LuminaLightbox — Zoom wheel/pinch, navegação swipe/setas, galeria com thumbnails.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

interface GalleryImage { src: string; caption?: string; }

export class Lightbox extends LuminaElement {
  static tagName = 'lumina-lightbox';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'src', 'images']; }
  private _images: GalleryImage[] = [];
  private _currentIdx = 0;
  private _open = false;
  private zoom = 1;
  private img: HTMLImageElement | null = null;

  protected render(): string {
    return `
      <div class="lmlb" part="backdrop" aria-hidden="true">
        <div class="lmlb__close" aria-label="Fechar">×</div>
        <button class="lmlb__nav lmlb__prev" aria-label="Anterior">‹</button>
        <div class="lmlb__img-wrap" part="image"><img class="lmlb__img" /></div>
        <button class="lmlb__nav lmlb__next" aria-label="Próxima">›</button>
        <div class="lmlb__caption" part="caption"><slot name="caption"></slot></div>
        <div class="lmlb__thumbs" aria-hidden="true"></div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: contents; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmlb { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; gap: 16px; background: rgb(0 0 0 / 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); opacity: 0; pointer-events: none; transition: opacity var(--lumina-speed) var(--lumina-ease-out); }
      :host([data-open]) .lmlb { opacity: 1; pointer-events: auto; }
      .lmlb__close { position: absolute; top: 20px; right: 20px; color: #fff; font-size: 32px; cursor: pointer; z-index: 2; opacity: 0.7; transition: opacity 0.2s; }
      .lmlb__close:hover { opacity: 1; }
      .lmlb__nav { position: absolute; top: 50%; transform: translateY(-50%); appearance: none; border: 0; background: rgb(255 255 255 / 0.1); color: #fff; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; font-size: 28px; z-index: 2; transition: background 0.2s, transform 0.2s; }
      .lmlb__nav:hover { background: rgb(255 255 255 / 0.2); transform: translateY(-50%) scale(1.1); }
      .lmlb__prev { left: 20px; }
      .lmlb__next { right: 20px; }
      .lmlb__img-wrap { position: relative; z-index: 1; max-width: 80vw; max-height: 75vh; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: var(--lumina-radius-lg); }
      .lmlb__img { max-width: 100%; max-height: 75vh; object-fit: contain; border-radius: inherit; transform: scale(1); transition: transform 0.2s var(--lumina-ease-out); will-change: transform; cursor: grab; }
      .lmlb__img[data-zoom] { cursor: grab; }
      .lmlb__caption { position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); color: rgba(255 255 255 / 0.8); font-size: 14px; max-width: 80vw; text-align: center; z-index: 2; }
      .lmlb__thumbs { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 2; }
      .lmlb__thumb { width: 48px; height: 48px; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s, transform 0.2s; }
      .lmlb__thumb img { width: 100%; height: 100%; object-fit: cover; }
      .lmlb__thumb[data-active] { border-color: var(--lumina-accent); }
      .lmlb__thumb:hover { transform: scale(1.1); }
      @media (prefers-reduced-motion: reduce) { .lmlb, .lmlb__img { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this.img = this.$$('.lmlb__img') as HTMLImageElement | null;
    const src = this.getAttribute('src');
    const imagesAttr = this.getAttribute('images');
    if (imagesAttr) { try { this._images = JSON.parse(imagesAttr); } catch { this._images = src ? [{ src }] : []; } }
    else if (src) this._images = [{ src }];
    this.renderThumbs();
    this.$$('.lmlb__close')!.addEventListener('click', () => this.hide());
    this.$$('.lmlb__prev')!.addEventListener('click', () => this.navigate(-1));
    this.$$('.lmlb__next')!.addEventListener('click', () => this.navigate(1));
    this.img?.addEventListener('wheel', this.onWheel);
    document.addEventListener('keydown', this.onKeydown);
    this.addEventListener('click', (e) => { if (e.target === this.$$('.lmlb')) this.hide(); });
  }
  protected unmounted(): void { document.removeEventListener('keydown', this.onKeydown); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'src' && value) { this._images = [{ src: value }]; this.renderThumbs(); this.showImage(0); }
    else if (name === 'images' && value) { try { this._images = JSON.parse(value); this.renderThumbs(); } catch {} }
  }
  private renderThumbs(): void {
    const host = this.$$('.lmlb__thumbs'); if (!host || this._images.length <= 1) return;
    host.innerHTML = '';
    this._images.forEach((img, i) => {
      const t = document.createElement('div'); t.className = 'lmlb__thumb';
      if (i === this._currentIdx) t.setAttribute('data-active','');
      t.innerHTML = `<img src="${img.src}" alt="" />`;
      t.addEventListener('click', () => this.showImage(i));
      host.appendChild(t);
    });
  }
  public show(idx = 0): void { this._open = true; this.setAttribute('data-open',''); this.showImage(idx); document.body.style.overflow = 'hidden'; this.dispatchEvent(new CustomEvent('lumina-open', { bubbles: true, composed: true })); }
  public hide(): void { this._open = false; this.removeAttribute('data-open'); document.body.style.overflow = ''; this.dispatchEvent(new CustomEvent('lumina-close', { bubbles: true, composed: true })); }
  private showImage(idx: number): void {
    this._currentIdx = idx;
    if (this.img && this._images[idx]) { this.img.src = this._images[idx].src; this.zoom = 1; this.img.style.transform = 'scale(1)'; }
    const cap = this.$$('.lmlb__caption'); if (cap) cap.textContent = this._images[idx]?.caption ?? '';
    this.renderThumbs();
  }
  private navigate(dir: number): void {
    if (this._images.length <= 1) return;
    this._currentIdx = (this._currentIdx + dir + this._images.length) % this._images.length;
    this.showImage(this._currentIdx);
    this.dispatchEvent(new CustomEvent('lumina-navigate', { bubbles: true, composed: true, detail: { index: this._currentIdx } }));
  }
  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.zoom = Math.max(1, Math.min(5, this.zoom + (e.deltaY > 0 ? -0.2 : 0.2)));
    if (this.img) { this.img.style.transform = `scale(${this.zoom})`; if (this.zoom > 1) this.img.setAttribute('data-zoom',''); else this.img.removeAttribute('data-zoom'); }
  };
  private onKeydown = (e: KeyboardEvent): void => {
    if (!this._open) return;
    if (e.key === 'Escape') this.hide();
    else if (e.key === 'ArrowLeft') this.navigate(-1);
    else if (e.key === 'ArrowRight') this.navigate(1);
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-lightbox': Lightbox } }
if (!customElements.get(Lightbox.tagName)) customElements.define(Lightbox.tagName, Lightbox);
