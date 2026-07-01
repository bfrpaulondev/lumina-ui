/**
 * API Reference — every component + every shared attribute.
 */
import type { Route } from '../app';
import { COMPONENTS } from '../data/components';
import { el, sectionHead } from './_shared';

export default async function apiSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'docs' });
  root.innerHTML = `
    ${sectionHead('⌘', 'API Reference', 'Toda a API pública da LuminaUI v0.1.0.').outerHTML}

    <h2>Atributos compartilhados</h2>
    <p>Todos os componentes Lumina aceitam estes atributos (e suas propriedades camelCase equivalentes):</p>
    ${sharedTable()}

    <h2>Eventos compartilhados</h2>
    ${eventsTable()}

    <h2>Componentes</h2>
    ${COMPONENTS.map((c) => `
      <article class="api__component" id="${c.tag}">
        <h3><code>&lt;${c.tag}&gt;</code></h3>
        <p>${c.description}</p>
        <p><strong>Atributos próprios:</strong></p>
        ${componentSpecificAttrs(c.tag)}
        <p><strong>Slots:</strong></p>
        ${componentSlots(c.tag)}
        <p><strong>CSS parts:</strong></p>
        ${componentParts(c.tag)}
        <p><strong>Eventos:</strong></p>
        ${componentEvents(c.tag)}
      </article>
    `).join('')}
  `;
  return root;
}

function sharedTable(): string {
  return `<table class="api__table">
    <thead><tr><th>Atributo</th><th>Propriedade</th><th>Tipo</th><th>Default</th></tr></thead>
    <tbody>
      <tr><td><code>variant</code></td><td><code>variant</code></td><td><code>glass | morph | neural | void | aura | dimensional</code></td><td><code>glass</code></td></tr>
      <tr><td><code>intensity</code></td><td><code>intensity</code></td><td><code>subtle | medium | intense | extreme</code></td><td><code>medium</code></td></tr>
      <tr><td><code>theme</code></td><td><code>theme</code></td><td><code>light | dark | auto | cosmic | void</code></td><td><code>auto</code></td></tr>
      <tr><td><code>animation-trigger</code></td><td><code>animationTrigger</code></td><td><code>hover | click | scroll | focus | proximity</code></td><td><code>hover</code></td></tr>
      <tr><td><code>accent-color</code></td><td><code>accentColor</code></td><td><code>string</code> (hex, hsl, rgb)</td><td><code>#7c5cff</code></td></tr>
      <tr><td><code>speed</code></td><td><code>speed</code></td><td><code>number</code> (segundos)</td><td><code>0.5</code></td></tr>
      <tr><td><code>depth</code></td><td><code>depth</code></td><td><code>flat | medium | deep | extrude</code></td><td><code>medium</code></td></tr>
    </tbody>
  </table>`;
}

function eventsTable(): string {
  return `<table class="api__table">
    <thead><tr><th>Evento</th><th>detail</th><th>Disparado por</th></tr></thead>
    <tbody>
      <tr><td><code>lumina-press</code></td><td>—</td><td>lumina-button</td></tr>
      <tr><td><code>lumina-change</code></td><td><code>{ value: string }</code></td><td>lumina-input</td></tr>
      <tr><td><code>lumina-submit</code></td><td><code>{ value: string }</code></td><td>lumina-input (Enter)</td></tr>
      <tr><td><code>lumina-toggle</code></td><td><code>{ checked: boolean }</code></td><td>lumina-toggle</td></tr>
      <tr><td><code>lumina-open</code></td><td>—</td><td>lumina-modal</td></tr>
      <tr><td><code>lumina-close</code></td><td>—</td><td>lumina-modal</td></tr>
      <tr><td><code>lumina-nav-change</code></td><td><code>{ value: string }</code></td><td>lumina-navigation</td></tr>
    </tbody>
  </table>`;
}

function componentSpecificAttrs(tag: string): string {
  const map: Record<string, Array<[string, string, string]>> = {
    'lumina-button': [
      ['disabled', 'boolean', '—'],
    ],
    'lumina-input': [
      ['type', 'string (text, email, password...)', 'text'],
      ['placeholder', 'string', '—'],
      ['value', 'string', '—'],
      ['label', 'string', '—'],
      ['name', 'string', '—'],
      ['disabled', 'boolean', '—'],
      ['required', 'boolean', '—'],
      ['invalid', 'boolean', '—'],
    ],
    'lumina-toggle': [
      ['checked', 'boolean', 'false'],
      ['disabled', 'boolean', '—'],
      ['label', 'string', '—'],
    ],
    'lumina-modal': [
      ['open', 'boolean', 'false'],
      ['closable', 'boolean', 'true'],
    ],
    'lumina-progress': [
      ['value', 'number', '0'],
      ['max', 'number', '100'],
      ['indeterminate', 'boolean', 'false'],
    ],
    'lumina-badge': [
      ['dot', 'boolean', 'false'],
      ['pulse', 'boolean', 'false'],
    ],
    'lumina-tooltip': [
      ['content', 'string', '—'],
      ['side', 'top | bottom | left | right', 'top'],
      ['delay', 'number (ms)', '200'],
    ],
    'lumina-nav-item': [
      ['active', 'boolean', 'false'],
      ['value', 'string', '—'],
    ],
  };
  const attrs = map[tag] ?? [];
  if (attrs.length === 0) return '<p><em>Sem atributos próprios.</em></p>';
  return `<table class="api__table">
    <thead><tr><th>Atributo</th><th>Tipo</th><th>Default</th></tr></thead>
    <tbody>
      ${attrs.map(([a, t, d]) => `<tr><td><code>${a}</code></td><td><code>${t}</code></td><td>${d}</td></tr>`).join('')}
    </tbody>
  </table>`;
}

function componentSlots(tag: string): string {
  const map: Record<string, string[]> = {
    'lumina-button': ['default'],
    'lumina-card': ['default', 'title', 'subtitle', 'media', 'footer'],
    'lumina-input': ['label'],
    'lumina-toggle': ['default'],
    'lumina-modal': ['default', 'title', 'footer'],
    'lumina-navigation': ['default (lumina-nav-item children)'],
    'lumina-progress': ['—'],
    'lumina-badge': ['default'],
    'lumina-tooltip': ['default (trigger)', 'content'],
    'lumina-container': ['default'],
  };
  const slots = map[tag] ?? ['default'];
  return `<p>${slots.map((s) => `<code>${s}</code>`).join(', ')}</p>`;
}

function componentParts(tag: string): string {
  const map: Record<string, string[]> = {
    'lumina-button': ['shell', 'bg', 'ring', 'aura', 'field', 'burst', 'sheen', 'content'],
    'lumina-card': ['card', 'glow', 'field', 'glass', 'sheen', 'inner', 'body'],
    'lumina-input': ['root', 'label', 'shell', 'bg', 'ring', 'bar', 'echo', 'input'],
    'lumina-toggle': ['root', 'aura', 'track', 'glow', 'knob', 'burst', 'label'],
    'lumina-modal': ['root', 'backdrop', 'portal', 'panel', 'glass', 'header', 'body', 'footer', 'close'],
    'lumina-navigation': ['root', 'glow', 'bar', 'indicator'],
    'lumina-progress': ['root', 'track', 'fill', 'shimmer', 'head', 'trail'],
    'lumina-badge': ['root', 'dot', 'halo', 'content'],
    'lumina-tooltip': ['root', 'bubble', 'glow', 'arrow', 'content'],
    'lumina-container': ['root', 'glow', 'field', 'inner'],
  };
  const parts = map[tag] ?? [];
  return `<p>${parts.map((p) => `<code>part="${p}"</code>`).join(' ')}</p>`;
}

function componentEvents(tag: string): string {
  const map: Record<string, string[]> = {
    'lumina-button': ['lumina-press'],
    'lumina-input': ['lumina-change', 'lumina-submit'],
    'lumina-toggle': ['lumina-toggle'],
    'lumina-modal': ['lumina-open', 'lumina-close'],
    'lumina-navigation': ['lumina-nav-change'],
  };
  const evts = map[tag] ?? [];
  if (evts.length === 0) return '<p><em>Sem eventos próprios.</em></p>';
  return `<p>${evts.map((e) => `<code>${e}</code>`).join(', ')}</p>`;
}
