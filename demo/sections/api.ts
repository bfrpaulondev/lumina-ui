/**
 * API Reference — every component + every shared attribute.
 * v0.3.0 — now lists all 100 components grouped by category.
 */
import type { Route } from '../app';
import { COMPONENT_METAS, CATEGORIES } from '../data/components';
import { el, sectionHead } from './_shared';

export default async function apiSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'docs' });

  const componentsByCat = CATEGORIES.map((cat) => {
    const items = COMPONENT_METAS.filter((c) => c.category === cat.id);
    return `
      <section class="api__category">
        <h2>${cat.icon} ${cat.label} <span class="api__cat-range">${cat.range}</span></h2>
        ${items.map((c) => `
          <article class="api__component" id="${c.tag}">
            <h3><code>&lt;${c.tag}&gt;</code> <span class="api__tier api__tier--${c.tier}">${c.tier}</span></h3>
            <p>${c.description}</p>
            <div class="api__component-grid">
              <div>
                <strong>Variants</strong>
                <p>${c.variants.map((v) => `<code>${v}</code>`).join(' ')}</p>
              </div>
              <div>
                <strong>Events</strong>
                <p>${(c.events ?? []).length > 0 ? c.events!.map((e) => `<code>${e}</code>`).join(' ') : '<em>(standard)</em>'}</p>
              </div>
              <div>
                <strong>CSS parts</strong>
                <p>${c.parts.map((p) => `<code>${p}</code>`).join(' ')}</p>
              </div>
              <div>
                <strong>Slots</strong>
                <p>${(c.slots ?? []).length > 0 ? c.slots!.map((s) => `<code>${s}</code>`).join(' ') : '<em>(none)</em>'}</p>
              </div>
              <div>
                <strong>Props</strong>
                <p>${(c.props ?? []).length > 0 ? c.props!.map((p) => `<code>${p.name}: ${p.type}</code>`).join(' ') : '<em>(only shared)</em>'}</p>
              </div>
            </div>
          </article>
        `).join('')}
      </section>
    `;
  }).join('');

  root.innerHTML = `
    ${sectionHead('⌘', 'API Reference', '100 componentes · 8 categorias · todos com variants, events, CSS parts, slots e props documentados.').outerHTML}

    <h2>Atributos compartilhados</h2>
    <p>Todos os componentes Lumina aceitam estes atributos (e suas propriedades camelCase equivalentes):</p>
    ${sharedTable()}

    <h2>Eventos compartilhados</h2>
    ${eventsTable()}

    ${componentsByCat}
  `;
  return root;
}

function sharedTable(): string {
  return `<table class="api__table">
    <thead><tr><th>Atributo</th><th>Propriedade</th><th>Tipo</th><th>Default</th></tr></thead>
    <tbody>
      <tr><td><code>variant</code></td><td><code>variant</code></td><td><code>string</code> (varia por componente)</td><td><code>glass</code> ou primeiro da lista</td></tr>
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
      <tr><td><code>lumina-click</code></td><td>—</td><td>todos os componentes de botão</td></tr>
      <tr><td><code>lumina-change</code></td><td>varia</td><td>inputs, toggles, selects</td></tr>
      <tr><td><code>lumina-input</code></td><td><code>{ value: string }</code></td><td>inputs de texto</td></tr>
      <tr><td><code>lumina-submit</code></td><td><code>{ value: string }</code></td><td>inputs (Enter)</td></tr>
      <tr><td><code>lumina-toggle</code></td><td><code>{ checked: boolean }</code></td><td>lumina-toggle</td></tr>
      <tr><td><code>lumina-open / lumina-close</code></td><td>—</td><td>modais, drawers, dialogs</td></tr>
      <tr><td><code>lumina-nav-change</code></td><td><code>{ value: string }</code></td><td>lumina-navigation</td></tr>
      <tr><td><code>lumina-show / lumina-hide</code></td><td>—</td><td>tooltips, popovers</td></tr>
      <tr><td><code>lumina-dismiss</code></td><td>—</td><td>alerts, toasts, chips</td></tr>
      <tr><td><code>lumina-morph</code></td><td>—</td><td>componentes morfáveis</td></tr>
      <tr><td><code>lumina-progress-complete</code></td><td>—</td><td>lumina-progress</td></tr>
      <tr><td><code>lumina-hover-start / lumina-hover-end</code></td><td>—</td><td>todos os componentes interativos</td></tr>
    </tbody>
  </table>`;
}
