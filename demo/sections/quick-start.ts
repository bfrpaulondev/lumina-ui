/**
 * Quick Start — Vanilla + React.
 */
import type { Route } from '../app';
import { el, sectionHead } from './_shared';

export default async function quickStartSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'docs' });
  root.innerHTML = `
    ${sectionHead('→', 'Quick Start', 'Do zero ao primeiro componente em menos de 1 minuto.').outerHTML}

    <h2>Vanilla TS / HTML</h2>
    <p>Crie um <code>index.html</code> e importe a biblioteca:</p>
    ${code('html', `<!doctype html>
<html>
  <head>
    <script type="module" src="https://esm.sh/lumina-ui"></script>
  </head>
  <body style="background:#06060c; color:#f5f5ff; font-family:sans-serif; min-height:100vh; display:grid; place-items:center;">
    <lumina-button
      variant="dimensional"
      intensity="intense"
      accent-color="#7c5cff"
      depth="deep"
    >
      Olá, LuminaUI
    </lumina-button>

    <script type="module">
      const btn = document.querySelector('lumina-button');
      btn.addEventListener('lumina-press', () => {
        console.log('Pressed!');
      });
    </script>
  </body>
</html>`)}

    <h2>React + TypeScript</h2>
    <p>Como React não conhece custom elements por padrão, declare os tipos:</p>
    ${code('tsx', `// types/lumina.d.ts
import type { LuminaConfig } from 'lumina-ui';

declare global {
  namespace JSX {
    interface IntrinsicElements extends LuminaConfig {
      'lumina-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & LuminaConfig;
      'lumina-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & LuminaConfig;
      'lumina-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & LuminaConfig;
      // ... adicione os demais conforme precisar
    }
  }
}`)}

    <p>Depois use normalmente:</p>
    ${code('tsx', `import 'lumina-ui';
import { useState } from 'react';

export function App() {
  const [count, setCount] = useState(0);
  return (
    <lumina-button
      variant="dimensional"
      intensity="intense"
      accent-color="#7c5cff"
      depth="deep"
      onLuminaPress={() => setCount(c => c + 1)}
    >
      Cliques: {count}
    </lumina-button>
  );
}`)}

    <h2>Vue</h2>
    <p>No Vue 3, configure <code>compilerOptions.isCustomElement</code>:</p>
    ${code('ts', `// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('lumina-'),
        },
      },
    }),
  ],
});`)}
    ${code('vue', `<script setup lang="ts">
import 'lumina-ui';
</script>

<template>
  <lumina-button variant="dimensional" intensity="intense" accent-color="#7c5cff">
    Click me
  </lumina-button>
</template>`)}

    <h2>Svelte / Astro</h2>
    <p>Apenas importe a lib uma vez no entry point. Svelte e Astro lidam com custom elements nativamente:</p>
    ${code('ts', `import 'lumina-ui';`)}

    <h2>Sem framework</h2>
    <p>Sem bundler, sem framework — só HTML:</p>
    ${code('html', `<script type="module" src="https://esm.sh/lumina-ui"></script>
<lumina-button variant="aura" accent-color="#ffd166">Funciona.</lumina-button>`)}
  `;
  return root;
}

function code(lang: string, content: string): string {
  return `<lumina-code-block lang="${lang}" title="${lang}">${escape(content)}</lumina-code-block>`;
}
function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
