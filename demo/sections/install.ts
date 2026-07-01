/**
 * Installation Guide.
 */
import type { Route } from '../app';
import { el, sectionHead } from './_shared';

export default async function installSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'docs' });
  root.innerHTML = `
    ${sectionHead('↓', 'Installation', 'Escolha o método de instalação que faz sentido para seu projeto.').outerHTML}

    <h2>1. npm / pnpm / yarn</h2>
    <p>Recomendado para projetos com bundler (Vite, webpack, esbuild, Rollup).</p>
    ${code('bash', 'npm install lumina-ui')}

    <h2>2. CDN (esm.sh)</h2>
    <p>Ideal para protótipos rápidos, demos no CodePen, ou HTML estático sem build.</p>
    ${code('html', `<script type="module" src="https://esm.sh/lumina-ui"></script>`)}

    <h2>3. Download direto</h2>
    <p>Baixe o bundle único <code>dist/lumina-ui.js</code> do <a href="https://github.com/bfrpaulondev/lumina-ui/releases" target="_blank" rel="noreferrer">GitHub releases</a> e hospede você mesmo.</p>
    ${code('html', `<script type="module" src="/vendor/lumina-ui.js"></script>`)}

    <h2>Tree-shaking</h2>
    <p>Importar <code>'lumina-ui'</code> registra todos os componentes como side-effect. Para registrar apenas o que você usa:</p>
    ${code('ts', `import 'lumina-ui/src/components/lumina-button';
import 'lumina-ui/src/components/lumina-card';
// apenas <lumina-button> e <lumina-card> são registrados`)}

    <h2>Requisitos</h2>
    <ul>
      <li>Navegador com suporte a ES2021 + Custom Elements + Shadow DOM + Constructible Stylesheets (todos os navegadores modernos)</li>
      <li>Sem polyfills necessários para Chrome 96+, Edge 96+, Firefox 96+, Safari 16.4+</li>
      <li>Para Safari antigo: polyfill de Constructible Stylesheets (opcional, a lib tem fallback)</li>
    </ul>
  `;
  return root;
}

function code(lang: string, content: string): string {
  return `<lumina-code-block lang="${lang}" title="${lang}">${escape(content)}</lumina-code-block>`;
}
function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
