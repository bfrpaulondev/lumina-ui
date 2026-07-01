/**
 * Variants Explorer — deep technical breakdown of each variant.
 */
import type { Route } from '../app';
import { SHARED_VARIANTS } from '../data/components';
import { el, sectionHead } from './_shared';

export default async function variantsSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'variants-explorer' });

  root.innerHTML = `
    ${sectionHead('02', 'Variants Explorer', 'Cada variante é uma combinação única de técnicas visuais. Veja a descrição técnica, parâmetros recomendados, casos de uso e dicas de CSS.').outerHTML}

    <div class="variants-explorer__list">
      ${SHARED_VARIANTS.map((v) => `
        <article class="variant-detail" id="variant-${v.name}">
          <header class="variant-detail__head">
            <div class="variant-detail__name">${v.name}</div>
            <div class="variant-detail__demo">
              <lumina-button variant="${v.name}" intensity="${v.recommended.intensity ?? 'intense'}" accent-color="${v.recommended.accent ?? '#7c5cff'}" depth="${v.recommended.depth ?? 'medium'}" speed="0.45">${v.name}</lumina-button>
            </div>
          </header>

          <div class="variant-detail__grid">
            <div class="variant-detail__col">
              <h4>Visual</h4>
              <p>${v.visualDesc}</p>

              <h4>Técnica</h4>
              <p>${v.technicalDesc}</p>
            </div>

            <div class="variant-detail__col">
              <h4>Parâmetros recomendados</h4>
              <ul class="variant-detail__params">
                <li><strong>intensity:</strong> <code>${v.recommended.intensity ?? 'intense'}</code></li>
                <li><strong>depth:</strong> <code>${v.recommended.depth ?? 'medium'}</code></li>
                <li><strong>accent-color:</strong> <code>${v.recommended.accent ?? '#7c5cff'}</code></li>
              </ul>

              <h4>Casos de uso</h4>
              <ul class="variant-detail__list">
                ${v.useCases.map((u) => `<li>${u}</li>`).join('')}
              </ul>
            </div>

            <div class="variant-detail__col">
              <h4>Dicas de CSS</h4>
              <ul class="variant-detail__tips">
                ${v.cssTips.map((t) => `<li>${t}</li>`).join('')}
              </ul>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;

  return root;
}
