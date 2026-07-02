/**
 * LuminaFormList — Dynamic list of fields with add/remove/move.
 *
 * Useful for "Form.List" patterns (collections of repeated field groups):
 *   - Phone numbers list
 *   - Multiple addresses
 *   - Variable list of ingredients
 *   - Dynamic form sections
 *
 * API:
 *   - Children inside the default slot become items. Each direct child is
 *     treated as one row. Wrap your fields in a <div> per row.
 *   - Use the `add-label` attribute to set the "Add" button text.
 *   - Use `max` to limit the number of items.
 *   - Methods: addItem(template), removeItem(index), moveItem(from, to)
 *   - Events: lumina-add, lumina-remove, lumina-move, lumina-stack-change
 *
 * Animations:
 *   - Items fade+slide in on add (height + opacity + transform)
 *   - Items fade+collapse on remove before being detached
 *   - Move uses FLIP technique for smooth position transitions
 *   - All animations respect prefers-reduced-motion
 *
 * Children stay in light DOM so any inner inputs keep their state and
 * validation wiring (lumina-form can still traverse them).
 */

import { LuminaElement } from '../core/LuminaElement';
import type { LuminaElementAttributes } from '../core/LuminaElement';
import { prefersReducedMotion } from '../core/utils';

export class FormList extends LuminaElement {
  static tagName = 'lumina-form-list';

  static get observedAttributes(): string[] {
    return [
      ...LuminaElement.observedAttributes,
      'add-label',
      'max',
      'movable',
    ];
  }

  get addLabel(): string { return this.getAttribute('add-label') ?? 'Adicionar'; }
  set addLabel(v: string) { this.setAttribute('add-label', v); }
  get max(): number { return parseInt(this.getAttribute('max') ?? '0', 10) || 0; }
  set max(v: number) { this.setAttribute('max', String(v)); }
  get movable(): boolean { return this.hasAttribute('movable'); }
  set movable(v: boolean) { v ? this.setAttribute('movable', '') : this.removeAttribute('movable'); }

  private itemsSlot: HTMLSlotElement | null = null;
  private container: HTMLElement | null = null;

  protected render(): string {
    return `
      <div class="lfl" part="list">
        <div class="lfl__items" part="items">
          <slot></slot>
        </div>
        <div class="lfl__footer" part="footer">
          <button class="lfl__add" part="add" type="button" data-action="add">
            <span class="lfl__add-icon" aria-hidden="true">+</span>
            <span>${this.addLabel}</span>
          </button>
        </div>
      </div>
    `;
  }

  protected styles(): string {
    return `
      :host { display: block; font-family: var(--lumina-font-sans); color: var(--lumina-text); }
      .lfl { display: flex; flex-direction: column; gap: 12px; }
      .lfl__items { display: flex; flex-direction: column; gap: 12px; }
      .lfl__footer { display: flex; }
      .lfl__add { appearance: none; display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: var(--lumina-radius-pill); border: 1px dashed rgb(var(--lumina-accent-rgb) / 0.4); background: rgb(var(--lumina-accent-rgb) / 0.08); color: var(--lumina-accent); font: 600 12px var(--lumina-font-sans); letter-spacing: 0.04em; cursor: pointer; transition: background var(--lumina-speed) var(--lumina-ease-out), border-color var(--lumina-speed) var(--lumina-ease-out), transform var(--lumina-speed) var(--lumina-ease-spring); }
      .lfl__add:hover { background: rgb(var(--lumina-accent-rgb) / 0.18); border-color: rgb(var(--lumina-accent-rgb) / 0.7); transform: translateY(-1px); }
      .lfl__add:active { transform: translateY(0); }
      .lfl__add:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      .lfl__add-icon { font-size: 16px; line-height: 1; }

      /* Items: each direct child of the slot gets wrapped visually */
      ::slotted(*) {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 12px;
        border-radius: var(--lumina-radius-md);
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        border: 1px solid var(--lumina-border);
        animation: lfl-enter var(--lumina-speed) var(--lumina-ease-spring);
      }
      ::slotted(*.lfl-leaving) { animation: lfl-leave var(--lumina-speed) var(--lumina-ease-out) forwards; }

      @keyframes lfl-enter { from { opacity: 0; transform: translateY(-8px) scale(0.98); max-height: 0; } to { opacity: 1; transform: translateY(0) scale(1); max-height: 500px; } }
      @keyframes lfl-leave { from { opacity: 1; max-height: 500px; } to { opacity: 0; max-height: 0; padding: 0; margin: 0; transform: scale(0.96); } }

      @media (prefers-reduced-motion: reduce) {
        ::slotted(*) { animation: none !important; transition: none !important; }
      }
    `;
  }

  protected mounted(): void {
    this.itemsSlot = this.$$('.lfl__items slot') as HTMLSlotElement | null;
    this.container = this.$$('.lfl__items');
    this.$$('.lfl__add')?.addEventListener('click', this.onAddClick);

    // Wire up move/remove buttons that may exist in slotted items (delegated)
    this.addEventListener('click', this.onDelegatedClick);

    // Initial enter animation for existing items
    requestAnimationFrame(() => {
      this._getItems().forEach((el) => {
        el.classList.add('lfl-mounted');
      });
    });
  }

  protected unmounted(): void {
    this.$$('.lfl__add')?.removeEventListener('click', this.onAddClick);
    this.removeEventListener('click', this.onDelegatedClick);
  }

  protected onConfigChange(_c: Partial<LuminaElementAttributes>): void {}

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'add-label') {
      const btn = this.$$('.lfl__add span:last-child');
      if (btn) btn.textContent = value ?? 'Adicionar';
    }
  }

  /** Returns all currently slotted direct child elements (the "items"). */
  private _getItems(): HTMLElement[] {
    if (!this.itemsSlot) return [];
    return this.itemsSlot
      .assignedElements({ flatten: true })
      .filter((el): el is HTMLElement => el instanceof HTMLElement);
  }

  /** Returns the number of items currently in the list. */
  public get length(): number {
    return this._getItems().length;
  }

  /**
   * Add a new item to the list. The template is either an HTML string,
   * an HTMLElement, or a function that returns one of those.
   */
  public addItem(template: string | HTMLElement | (() => string | HTMLElement)): HTMLElement | null {
    const max = this.max;
    if (max > 0 && this._getItems().length >= max) return null;
    let node: HTMLElement;
    let raw: string | HTMLElement;
    if (typeof template === 'function') raw = template();
    else raw = template;
    if (typeof raw === 'string') {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = raw.trim();
      const first = wrapper.firstElementChild;
      if (!(first instanceof HTMLElement)) return null;
      node = first;
    } else {
      node = raw;
    }
    // Append move/remove controls if movable
    if (this.movable) {
      this._appendControls(node);
    }
    this.appendChild(node);
    this._emitStackChange('add', { index: this._getItems().length - 1, item: node });
    this.dispatchEvent(new CustomEvent('lumina-add', { bubbles: true, composed: true, detail: { item: node, index: this._getItems().length - 1 } }));
    return node;
  }

  /** Remove the item at the given index (with leave animation). */
  public removeItem(index: number): void {
    const items = this._getItems();
    const item = items[index];
    if (!item) return;
    if (prefersReducedMotion()) {
      this._finalizeRemove(item, index);
      return;
    }
    item.classList.add('lfl-leaving');
    const onEnd = () => {
      item.removeEventListener('animationend', onEnd);
      this._finalizeRemove(item, index);
    };
    item.addEventListener('animationend', onEnd);
    // Fallback in case animationend doesn't fire
    setTimeout(() => {
      if (item.parentNode) {
        item.removeEventListener('animationend', onEnd);
        this._finalizeRemove(item, index);
      }
    }, 600);
  }

  private _finalizeRemove(item: HTMLElement, index: number): void {
    this.removeChild(item);
    this.dispatchEvent(new CustomEvent('lumina-remove', { bubbles: true, composed: true, detail: { index } }));
    this._emitStackChange('remove', { index });
  }

  /** Move an item from one position to another (with FLIP animation). */
  public moveItem(from: number, to: number): void {
    const items = this._getItems();
    if (from < 0 || from >= items.length || to < 0 || to >= items.length || from === to) return;
    if (prefersReducedMotion()) {
      this._doMove(items, from, to);
      return;
    }
    // FLIP: First — record positions
    const positions = new Map<HTMLElement, DOMRect>();
    items.forEach((el) => positions.set(el, el.getBoundingClientRect()));
    // Last — actually move
    this._doMove(items, from, to);
    // Invert + Play
    const newItems = this._getItems();
    newItems.forEach((el) => {
      const oldRect = positions.get(el);
      if (!oldRect) return;
      const newRect = el.getBoundingClientRect();
      const dy = oldRect.top - newRect.top;
      if (dy === 0) return;
      el.style.transition = 'none';
      el.style.transform = `translateY(${dy}px)`;
      requestAnimationFrame(() => {
        el.style.transition = `transform var(--lumina-speed) var(--lumina-ease-spring)`;
        el.style.transform = '';
      });
    });
    this.dispatchEvent(new CustomEvent('lumina-move', { bubbles: true, composed: true, detail: { from, to } }));
    this._emitStackChange('move', { from, to });
  }

  private _doMove(items: HTMLElement[], from: number, to: number): void {
    const item = items[from];
    const ref = items[to];
    if (!item || !ref) return;
    if (from < to) {
      // Move down: insert after ref
      ref.parentNode?.insertBefore(item, ref.nextSibling);
    } else {
      // Move up: insert before ref
      ref.parentNode?.insertBefore(item, ref);
    }
  }

  private _appendControls(item: HTMLElement): void {
    const controls = document.createElement('div');
    controls.className = 'lfl__controls';
    controls.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-left:auto;';
    const up = document.createElement('button');
    up.type = 'button';
    up.textContent = '↑';
    up.setAttribute('data-action', 'move-up');
    up.style.cssText = 'appearance:none;border:1px solid var(--lumina-border);background:transparent;color:var(--lumina-text-muted);width:28px;height:24px;border-radius:6px;cursor:pointer;font-size:14px;line-height:1;';
    const down = document.createElement('button');
    down.type = 'button';
    down.textContent = '↓';
    down.setAttribute('data-action', 'move-down');
    down.style.cssText = up.style.cssText;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('data-action', 'remove');
    remove.style.cssText = 'appearance:none;border:1px solid rgb(255 70 90 / 0.3);background:rgb(255 70 90 / 0.08);color:rgb(255 90 110);width:28px;height:24px;border-radius:6px;cursor:pointer;font-size:16px;line-height:1;';
    controls.append(up, down, remove);
    item.appendChild(controls);
  }

  private onAddClick = (): void => {
    // Emit a request-add event; if not prevented, do nothing (user should call addItem)
    const evt = new CustomEvent('lumina-request-add', { bubbles: true, composed: true, cancelable: true });
    if (!this.dispatchEvent(evt)) return;
    // Default behavior: emit lumina-add with no item so listener can build it
    this.dispatchEvent(new CustomEvent('lumina-add', { bubbles: true, composed: true, detail: { requested: true } }));
  };

  private onDelegatedClick = (e: Event): void => {
    const target = e.target as HTMLElement;
    const action = target?.getAttribute?.('data-action');
    if (!action) return;
    const item = target.closest('[data-lfl-item], ::slotted(*)') as HTMLElement | null;
    // Find which slotted item contains this button
    const items = this._getItems();
    const idx = items.findIndex((it) => it.contains(target));
    if (idx < 0) return;
    if (action === 'remove') this.removeItem(idx);
    else if (action === 'move-up') this.moveItem(idx, idx - 1);
    else if (action === 'move-down') this.moveItem(idx, idx + 1);
  };

  private _emitStackChange(action: string, detail: any): void {
    this.dispatchEvent(new CustomEvent('lumina-stack-change', { bubbles: true, composed: true, detail: { action, ...detail, length: this._getItems().length } }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lumina-form-list': FormList;
  }
}

if (!customElements.get(FormList.tagName)) {
  customElements.define(FormList.tagName, FormList);
}
