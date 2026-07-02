/**
 * LuminaTimeline — Eventos com stagger, linha que se preenche com scroll, conteúdo rico.
 */
import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';

export class Timeline extends LuminaElement {
  static tagName = 'lumina-timeline';

  protected render(): string { return `<ol class="lmtl" part="timeline"><div class="lmtl__line" aria-hidden="true"></div><slot></slot></ol>`; }
  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmtl { list-style: none; padding: 0; margin: 0; position: relative; padding-left: 32px; }
      .lmtl__line { position: absolute; left: 11px; top: 0; bottom: 0; width: 2px; background: var(--lumina-border); overflow: hidden; }
      .lmtl__line::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 0%; background: linear-gradient(180deg, var(--lumina-accent), rgb(var(--lumina-accent-rgb) / 0.3)); box-shadow: 0 0 8px var(--lumina-accent); transition: height 0.1s linear; }
      ::slotted(li), ::slotted([data-timeline-item]) { position: relative; padding: 16px 20px; margin-bottom: 8px; border-radius: var(--lumina-radius-md); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid var(--lumina-border); animation: lmtl-enter 0.5s var(--lumina-ease-spring) backwards; }
      @keyframes lmtl-enter { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      ::slotted(li::before), ::slotted([data-timeline-item])::before { content: ''; position: absolute; left: -27px; top: 20px; width: 12px; height: 12px; border-radius: 50%; background: var(--lumina-accent); box-shadow: 0 0 0 3px var(--lumina-bg, #06060c), 0 0 12px var(--lumina-accent); z-index: 1; }
      ::slotted(li:hover), ::slotted([data-timeline-item]:hover) { border-color: rgb(var(--lumina-accent-rgb) / 0.3); transform: translateX(4px); }
      :host([variant="neural"]) ::slotted(li), :host([variant="neural"]) ::slotted([data-timeline-item]) { border-color: rgb(var(--lumina-accent-rgb) / 0.2); }
      @media (prefers-reduced-motion: reduce) { ::slotted(li), ::slotted([data-timeline-item]) { animation: none !important; } }
    `;
  }
  protected mounted(): void {
    this.applyStagger();
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const line = this.$$('.lmtl__line');
            if (line) {
              const rect = this.getBoundingClientRect();
              const viewportH = window.innerHeight;
              const progress = Math.max(0, Math.min(1, (viewportH - rect.top) / (rect.height + viewportH * 0.3)));
              const fill = line.querySelector('::after');
              line.style.setProperty('--fill', `${progress * 100}%`);
              // Use inline style on the pseudo-element via CSS variable
              this.style.setProperty('--lmtl-fill', `${progress * 100}%`);
            }
          }
        });
      }, { threshold: 0 });
      observer.observe(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }
  protected unmounted(): void { window.removeEventListener('scroll', this.onScroll); }
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  private applyStagger(): void { this.querySelectorAll('li, [data-timeline-item]').forEach((item, i) => { (item as HTMLElement).style.animationDelay = `${i * 0.1}s`; }); }
  private onScroll = (): void => {
    const rect = this.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (viewportH - rect.top) / (rect.height + viewportH * 0.3)));
    this.style.setProperty('--lmtl-fill', `${progress * 100}%`);
    const line = this.$$('.lmtl__line');
    if (line) (line as HTMLElement).style.setProperty('--fill', `${progress * 100}%`);
  };
}
declare global { interface HTMLElementTagNameMap { 'lumina-timeline': Timeline } }
if (!customElements.get(Timeline.tagName)) customElements.define(Timeline.tagName, Timeline);
