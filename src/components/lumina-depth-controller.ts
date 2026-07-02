/**
 * LuminaDepthController — Controla o nível de 3D (tilt, extrusão, parallax) de componentes filhos.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { formFieldSharedStyles } from '../core/form-field-mixin';

export class DepthController extends LuminaElement {
  static tagName = 'lumina-depth-controller';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'depth']; }

  protected render(): string { return `<div class="lmdc" part="controller"><div class="lmdc__children" part="children"><slot></slot></div></div>`; }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); perspective: 1000px; }
      .lmdc { position: relative; width: 100%; transform-style: preserve-3d; }
      .lmdc__children { transform-style: preserve-3d; transition: transform 0.3s var(--lumina-ease-out); }
      :host([depth="flat"]) .lmdc__children { transform: none; }
      :host([depth="medium"]) { perspective: 800px; }
      :host([depth="deep"]) { perspective: 600px; }
      :host([depth="extrude"]) { perspective: 400px; }
      :host([depth="medium"]) ::slotted(*), :host([depth="deep"]) ::slotted(*), :host([depth="extrude"]) ::slotted(*) { transform: translateZ(0); transition: transform 0.2s var(--lumina-ease-out); }
      :host([depth="deep"]) ::slotted(*) { transform: translateZ(10px); }
      :host([depth="extrude"]) ::slotted(*) { transform: translateZ(20px); box-shadow: 0 20px 0 -10px rgb(var(--lumina-accent-rgb) / 0.3); }
      :host([depth="extrude"]) ::slotted(*:hover) { transform: translateZ(40px) rotateX(5deg); }

      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      :host([invalid]) [part="bg"], :host([invalid]) [part="control"], :host([invalid]) [part="track"] { border-color: rgb(255 70 90 / 0.6) !important; box-shadow: 0 0 0 4px rgb(255 70 90 / 0.10) !important; }
      :host([valid]) [part="bg"], :host([valid]) [part="control"], :host([valid]) [part="track"] { border-color: rgb(34 197 94 / 0.5) !important; }
      ${formFieldSharedStyles}
      @media (prefers-reduced-motion: reduce) { .lmdc__children, ::slotted(*) { transition: none !important; transform: none !important; } }
    `;
  }
  protected mounted(): void {
    if (!this.hasAttribute('depth')) this.setAttribute('depth', 'medium');
    this.addEventListener('pointermove', this.onMove);
  }
  protected unmounted(): void { this.removeEventListener('pointermove', this.onMove); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private onMove = (e: PointerEvent): void => {
    const depth = this.getAttribute('depth') ?? 'medium';
    if (depth === 'flat') return;
    const rect = this.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const intensity = depth === 'extrude' ? 1 : depth === 'deep' ? 0.7 : 0.4;
    const children = this.$$('.lmdc__children');
    if (children) children.style.transform = `rotateY(${px * 10 * intensity}deg) rotateX(${-py * 10 * intensity}deg)`;
    this.dispatchEvent(new CustomEvent('lumina-depth-change', { bubbles: true, composed: true, detail: { depth, rx: -py * 10 * intensity, ry: px * 10 * intensity } }));
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-depth-controller': DepthController } }
if (!customElements.get(DepthController.tagName)) customElements.define(DepthController.tagName, DepthController);
