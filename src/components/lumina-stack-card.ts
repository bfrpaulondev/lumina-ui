/**
 * LuminaStackCard — Cartões empilhados com rotação aleatória, física e arrastar.
 * Variants: glass | neural | minimal
 * Props: count, interactive
 * Slots: default (multiple children become the stack)
 * Events: lumina-card-select, lumina-stack-change
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

interface CardItem { el: HTMLElement; rotation: number; }

export class StackCard extends LuminaElement {
  static tagName = 'lumina-stack-card';
  static get observedAttributes(): string[] { return [...LuminaElement.observedAttributes, 'count', 'interactive']; }
  private _count = 3;
  private _interactive = true;
  private cards: CardItem[] = [];
  private currentIndex = 0;
  private dragStartX = 0;
  private dragCurrentX = 0;
  private dragging = false;

  get count(): number { return this._count; }
  set count(v: number) { this._count = v; this.setAttribute('count', String(v)); this.buildStack(); }
  get interactive(): boolean { return this._interactive; }
  set interactive(v: boolean) { this._interactive = v; if (v) this.setAttribute('interactive',''); else this.removeAttribute('interactive'); }

  protected render(): string {
    return `
      <div class="lmsc" part="stack">
        <div class="lmsc__cards" data-cards></div>
      </div>
    `;
  }
  protected styles(): string {
    return `
      :host { display: block; position: relative; width: 300px; height: 200px; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lmsc { position: relative; width: 100%; height: 100%; }
      .lmsc__cards { position: relative; width: 100%; height: 100%; }
      .lmsc__card { position: absolute; inset: 0; border-radius: var(--lumina-radius-lg); background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha)); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); border: 1px solid var(--lumina-border); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), var(--lumina-shadow); padding: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px; cursor: grab; user-select: none; transition: transform var(--lumina-speed) var(--lumina-ease-spring), opacity var(--lumina-speed) var(--lumina-ease-out); will-change: transform; touch-action: pan-y; }
      .lmsc__card[data-dragging] { transition: none; cursor: grabbing; }
      .lmsc__card[data-active] { border-color: rgb(var(--lumina-accent-rgb) / 0.5); box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.10), 0 0 30px rgb(var(--lumina-accent-rgb) / 0.3), var(--lumina-shadow); }
      .lmsc__card-title { font-size: 18px; font-weight: 700; }
      .lmsc__card-sub { font-size: 12px; color: var(--lumina-text-muted); }
      :host([variant="neural"]) .lmsc__card { border-color: rgb(var(--lumina-accent-rgb) / 0.25); }
      :host([variant="minimal"]) .lmsc__card { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; box-shadow: var(--lumina-shadow); }
      @media (prefers-reduced-motion: reduce) { .lmsc__card { transition: none !important; } }
    `;
  }
  protected mounted(): void {
    this._count = parseInt(this.getAttribute('count') ?? '3', 10) || 3;
    this._interactive = this.getAttribute('interactive') !== 'false';
    this.buildStack();
  }
  protected unmounted(): void {}
  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}
  attributeChangedCallback(name: string, _old: string|null, value: string|null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'count') { this._count = parseInt(value ?? '3', 10) || 3; this.buildStack(); }
    else if (name === 'interactive') this._interactive = value !== 'false';
  }
  private buildStack(): void {
    const container = this.$$('.lmsc__cards');
    if (!container) return;
    container.innerHTML = '';
    this.cards = [];
    // Use slotted children if present, otherwise create placeholder cards
    const slotted = Array.from(this.children).filter((c) => !c.hasAttribute('slot')) as HTMLElement[];
    const items = slotted.length > 0 ? slotted.slice(0, this._count) : [];
    const total = Math.max(this._count, items.length);
    for (let i = 0; i < this._count; i++) {
      const card = document.createElement('div');
      card.className = 'lmsc__card';
      card.setAttribute('part', 'card');
      card.setAttribute('data-index', String(i));
      const rotation = (Math.random() - 0.5) * 8;
      if (items[i]) {
        card.innerHTML = items[i].innerHTML;
      } else {
        const title = document.createElement('div');
        title.className = 'lmsc__card-title';
        title.textContent = `Card ${i + 1}`;
        const sub = document.createElement('div');
        sub.className = 'lmsc__card-sub';
        sub.textContent = `Stack item ${i + 1} de ${this._count}`;
        card.appendChild(title);
        card.appendChild(sub);
      }
      const offset = (this._count - 1 - i) * 8;
      card.style.transform = `translateY(${offset}px) scale(${1 - (this._count - 1 - i) * 0.04}) rotate(${rotation}deg)`;
      card.style.zIndex = String(this._count - i);
      if (i === 0) card.setAttribute('data-active', '');
      this.cards.push({ el: card, rotation });
      container.appendChild(card);
      if (this._interactive) {
        card.addEventListener('pointerdown', (e) => this.onPointerDown(e, i));
      }
    }
    this.currentIndex = 0;
  }
  private onPointerDown(e: PointerEvent, idx: number): void {
    if (idx !== 0 || prefersReducedMotion()) return;
    this.dragging = true;
    this.dragStartX = e.clientX;
    this.dragCurrentX = e.clientX;
    const card = this.cards[0]?.el;
    if (card) card.setAttribute('data-dragging', '');
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }
  private onPointerMove = (e: PointerEvent): void => {
    if (!this.dragging) return;
    this.dragCurrentX = e.clientX;
    const dx = this.dragCurrentX - this.dragStartX;
    const card = this.cards[0]?.el;
    if (card) {
      const rotation = this.cards[0].rotation + dx * 0.05;
      card.style.transform = `translateX(${dx}px) rotate(${rotation}deg)`;
      card.style.opacity = String(Math.max(0.3, 1 - Math.abs(dx) / 300));
    }
  };
  private onPointerUp = (): void => {
    if (!this.dragging) return;
    this.dragging = false;
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
    const dx = this.dragCurrentX - this.dragStartX;
    const threshold = 100;
    if (Math.abs(dx) > threshold) {
      this.swipeCard(dx > 0 ? 'right' : 'left');
    } else {
      this.resetCard();
    }
  };
  private swipeCard(direction: 'left' | 'right'): void {
    const card = this.cards[0]?.el;
    if (!card) return;
    const exitX = direction === 'right' ? 400 : -400;
    card.style.transform = `translateX(${exitX}px) rotate(${this.cards[0].rotation + 20}deg)`;
    card.style.opacity = '0';
    setTimeout(() => {
      // Move to bottom of stack
      const removed = this.cards.shift()!;
      removed.el.style.transition = 'none';
      removed.el.style.transform = `translateY(${(this._count - 1) * 8}px) scale(${1 - (this._count - 1) * 0.04}) rotate(${removed.rotation}deg)`;
      removed.el.style.opacity = '0';
      this.cards.push(removed);
      const container = this.$$('.lmsc__cards');
      container?.appendChild(removed.el);
      // Reorder z-index and reposition
      requestAnimationFrame(() => {
        this.cards.forEach((c, i) => {
          c.el.style.transition = '';
          const offset = i * 8;
          c.el.style.transform = `translateY(${offset}px) scale(${1 - i * 0.04}) rotate(${c.rotation}deg)`;
          c.el.style.opacity = '1';
          c.el.style.zIndex = String(this._count - i);
          c.el.removeAttribute('data-dragging');
          if (i === 0) c.el.setAttribute('data-active', ''); else c.el.removeAttribute('data-active');
        });
      });
      this.dispatchEvent(new CustomEvent('lumina-card-select', { bubbles: true, composed: true, detail: { index: 0, direction } }));
      this.dispatchEvent(new CustomEvent('lumina-stack-change', { bubbles: true, composed: true, detail: { remaining: this.cards.length } }));
    }, 300);
  }
  private resetCard(): void {
    const card = this.cards[0]?.el;
    if (card) {
      card.style.transform = `translateY(0) scale(1) rotate(${this.cards[0].rotation}deg)`;
      card.style.opacity = '1';
      card.removeAttribute('data-dragging');
    }
  }
}
declare global { interface HTMLElementTagNameMap { 'lumina-stack-card': StackCard } }
if (!customElements.get(StackCard.tagName)) customElements.define(StackCard.tagName, StackCard);
