/**
 * LuminaImageZoom — Zoom com wheel + drag + double click para zoom máximo.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { clamp } from '../core/utils';

export class ImageZoom extends LuminaElement {
  static tagName = 'lumina-image-zoom';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'src', 'zoom', 'max-zoom']; }
  private _src = ''; private _zoom = 1; private _maxZoom = 5;
  private img: HTMLImageElement | null = null;
  private panX = 0; private panY = 0;
  private dragging = false; private dragStartX = 0; private dragStartY = 0;

  get zoom(): number { return this._zoom; }
  set zoom(v: number) { this._zoom = clamp(v, 1, this._maxZoom); this.updateTransform(); this.dispatchEvent(new CustomEvent('lumina-zoom-change', { bubbles: true, composed: true, detail: { zoom: this._zoom } })); }

  protected render(): string {
    return `
      <div class="lmiz" part="container">
        <img class="lmiz__img" part="image" />
        <div class="lmiz__controls" part="controls">
          <button class="lmiz__btn" data-action="out" aria-label="Zoom out">−</button>
          <span class="lmiz__level">100%</span>
          <button class="lmiz__btn" data-action="in" aria-label="Zoom in">+</button>
          <button class="lmiz__btn" data-action="reset" aria-label="Reset">⟲</button>
        </div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmiz { position: relative; overflow: hidden; border-radius: var(--lumina-radius-md); background: rgb(0 0 0 / 0.3); border: 1px solid var(--lumina-border); cursor: grab; touch-action: none; }
      .lmiz__img { display: block; width: 100%; height: 100%; object-fit: cover; transform-origin: center center; transition: transform 0.15s var(--lumina-ease-out); will-change: transform; user-select: none; -webkit-user-drag: none; pointer-events: none; }
      .lmiz__img[data-dragging] { transition: none; }
      .lmiz[data-zoomed] { cursor: grab; }
      .lmiz[data-dragging] { cursor: grabbing; }
      .lmiz__controls { position: absolute; bottom: 12px; right: 12px; display: flex; align-items: center; gap: 4px; padding: 4px; border-radius: var(--lumina-radius-pill); background: rgb(var(--lumina-surface) / 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--lumina-border); z-index: 2; }
      .lmiz__btn { appearance: none; border: 0; background: transparent; color: var(--lumina-text); width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 16px; display: inline-flex; align-items: center; justify-content: center; transition: background 0.2s; }
      .lmiz__btn:hover { background: rgb(var(--lumina-accent-rgb) / 0.2); }
      .lmiz__level { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--lumina-text-muted); min-width: 36px; text-align: center; }
      @media (prefers-reduced-motion: reduce) { .lmiz__img { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._src = this.getAttribute('src') ?? '';
    this._zoom = parseFloat(this.getAttribute('zoom') ?? '1') || 1;
    this._maxZoom = parseFloat(this.getAttribute('max-zoom') ?? '5') || 5;
    this.img = this.$$('.lmiz__img') as HTMLImageElement | null;
    if (this.img && this._src) this.img.src = this._src;
    const container = this.$$('.lmiz');
    container?.addEventListener('wheel', this.onWheel);
    container?.addEventListener('pointerdown', this.onPointerDown);
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
    container?.addEventListener('dblclick', this.onDblClick);
    this.$$('.lmiz__btn[data-action="in"]')?.addEventListener('click', () => { this.zoom = this._zoom + 0.5; });
    this.$$('.lmiz__btn[data-action="out"]')?.addEventListener('click', () => { this.zoom = this._zoom - 0.5; });
    this.$$('.lmiz__btn[data-action="reset"]')?.addEventListener('click', () => { this.zoom = 1; this.panX = 0; this.panY = 0; this.updateTransform(); });
    this.updateTransform();
  }
  protected unmounted(): void { document.removeEventListener('pointermove', this.onPointerMove); document.removeEventListener('pointerup', this.onPointerUp); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'src' && value && this.img) this.img.src = value;
    else if (name === 'zoom') { this._zoom = clamp(parseFloat(value ?? '1') || 1, 1, this._maxZoom); this.updateTransform(); }
  }
  private updateTransform(): void {
    if (!this.img) return;
    this.img.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this._zoom})`;
    const level = this.$$('.lmiz__level');
    if (level) level.textContent = `${Math.round(this._zoom * 100)}%`;
    const container = this.$$('.lmiz');
    if (container) { if (this._zoom > 1) container.setAttribute('data-zoomed',''); else container.removeAttribute('data-zoomed'); }
  }
  private onWheel = (e: WheelEvent): void => { e.preventDefault(); this.zoom = this._zoom + (e.deltaY > 0 ? -0.2 : 0.2); };
  private onPointerDown = (e: PointerEvent): void => {
    if (this._zoom <= 1) return;
    this.dragging = true; this.dragStartX = e.clientX - this.panX; this.dragStartY = e.clientY - this.panY;
    this.$$('.lmiz')?.setAttribute('data-dragging',''); this.img?.setAttribute('data-dragging','');
  };
  private onPointerMove = (e: PointerEvent): void => {
    if (!this.dragging) return;
    this.panX = e.clientX - this.dragStartX; this.panY = e.clientY - this.dragStartY;
    this.updateTransform();
  };
  private onPointerUp = (): void => {
    if (!this.dragging) return;
    this.dragging = false; this.$$('.lmiz')?.removeAttribute('data-dragging'); this.img?.removeAttribute('data-dragging');
  };
  private onDblClick = (): void => { if (this._zoom > 1) { this.zoom = 1; this.panX = 0; this.panY = 0; } else { this.zoom = this._maxZoom; } };
}
declare global { interface HTMLElementTagNameMap { 'lumina-image-zoom': ImageZoom } }
if (!customElements.get(ImageZoom.tagName)) customElements.define(ImageZoom.tagName, ImageZoom);
