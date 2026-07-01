/**
 * LuminaUI — Playground app shell + hash router.
 *
 * The router is intentionally tiny (no library). It parses
 * `location.hash` like `#/playground/lumina-button` into a route
 * object and renders the matching section into <main id="route-outlet">.
 *
 * Sections are registered lazily via async importers so the initial
 * bundle stays small.
 */

import './components/code-block';
import './components/code-viewer';

export interface Route {
  section: string;
  param?: string;
}

interface SectionDef {
  id: string;
  label: string;
  group: 'playground' | 'labs' | 'docs';
  icon: string;
  loader: () => Promise<{ default: (route: Route) => Promise<HTMLElement> }>;
}

const SECTIONS: SectionDef[] = [
  // Playground
  {
    id: 'home',
    label: 'Início',
    group: 'playground',
    icon: '◆',
    loader: () => import('./sections/home'),
  },
  {
    id: 'playground',
    label: 'Playground',
    group: 'playground',
    icon: '▷',
    loader: () => import('./sections/playground'),
  },
  {
    id: 'variants',
    label: 'Variants Explorer',
    group: 'playground',
    icon: '◇',
    loader: () => import('./sections/variants'),
  },
  {
    id: 'studio',
    label: 'Make it Yours Studio',
    group: 'playground',
    icon: '✦',
    loader: () => import('./sections/studio'),
  },

  // Labs
  {
    id: 'morphing-lab',
    label: 'Morphing Laboratory',
    group: 'labs',
    icon: '◈',
    loader: () => import('./sections/morphing-lab'),
  },
  {
    id: 'particle-physics',
    label: 'Particle Physics',
    group: 'labs',
    icon: '⁂',
    loader: () => import('./sections/particle-physics'),
  },
  {
    id: 'depth-explorer',
    label: 'Depth & 3D Explorer',
    group: 'labs',
    icon: '⬢',
    loader: () => import('./sections/depth-explorer'),
  },
  {
    id: 'context-demo',
    label: 'Context Awareness',
    group: 'labs',
    icon: '◎',
    loader: () => import('./sections/context-demo'),
  },
  {
    id: 'performance',
    label: 'Performance Benchmark',
    group: 'labs',
    icon: '⚡',
    loader: () => import('./sections/performance'),
  },
  {
    id: 'a11y',
    label: 'Accessibility Inspector',
    group: 'labs',
    icon: '♿',
    loader: () => import('./sections/a11y'),
  },

  // Docs
  {
    id: 'install',
    label: 'Installation',
    group: 'docs',
    icon: '↓',
    loader: () => import('./sections/install'),
  },
  {
    id: 'quick-start',
    label: 'Quick Start',
    group: 'docs',
    icon: '→',
    loader: () => import('./sections/quick-start'),
  },
  {
    id: 'api',
    label: 'API Reference',
    group: 'docs',
    icon: '⌘',
    loader: () => import('./sections/api'),
  },
  {
    id: 'tokens',
    label: 'Design Tokens',
    group: 'docs',
    icon: '⬚',
    loader: () => import('./sections/tokens'),
  },
  {
    id: 'browser-support',
    label: 'Browser Support',
    group: 'docs',
    icon: '⌬',
    loader: () => import('./sections/browser-support'),
  },
];

const GROUP_LABELS: Record<SectionDef['group'], string> = {
  playground: 'Playground',
  labs: 'Laboratórios',
  docs: 'Documentação',
};

function parseHash(): Route {
  const hash = location.hash.replace(/^#\/?/, '');
  const [section, param] = hash.split('/');
  return { section: section || 'home', param };
}

function buildSidebar(): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';

  const groups: Record<string, SectionDef[]> = { playground: [], labs: [], docs: [] };
  for (const s of SECTIONS) groups[s.group].push(s);

  let html = `
    <a class="app-sidebar__brand" href="#/home">
      <span class="app-sidebar__mark" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
      <span class="app-sidebar__name">Lumina<span>UI</span></span>
    </a>
    <a class="app-sidebar__gh" href="https://github.com/bfrpaulondev/lumina-ui" target="_blank" rel="noreferrer">
      GitHub →
    </a>
  `;

  (['playground', 'labs', 'docs'] as const).forEach((group) => {
    html += `<div class="app-sidebar__group">
      <div class="app-sidebar__group-label">${GROUP_LABELS[group]}</div>`;
    for (const s of groups[group]) {
      html += `<a class="app-sidebar__link" href="#/${s.id}" data-section="${s.id}">
        <span class="app-sidebar__icon" aria-hidden="true">${s.icon}</span>
        <span>${s.label}</span>
      </a>`;
    }
    html += `</div>`;
  });

  sidebar.innerHTML = html;
  return sidebar;
}

async function render(): Promise<void> {
  const route = parseHash();
  const outlet = document.getElementById('route-outlet');
  if (!outlet) return;

  // Highlight active nav link
  document.querySelectorAll('.app-sidebar__link').forEach((a) => {
    a.classList.toggle('is-active', a.getAttribute('data-section') === route.section);
  });

  outlet.innerHTML = `<div class="route-loading">Carregando…</div>`;

  const sectionDef = SECTIONS.find((s) => s.id === route.section) ?? SECTIONS[0];
  try {
    const mod = await sectionDef.loader();
    const el = await mod.default(route);
    outlet.innerHTML = '';
    outlet.appendChild(el);
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'auto' });
  } catch (err) {
    console.error('Failed to load section:', err);
    outlet.innerHTML = `<div class="route-error">Failed to load section: ${String(err)}</div>`;
  }
}

export function initApp(): void {
  const root = document.getElementById('app-root');
  if (!root) return;
  root.innerHTML = `
    ${buildSidebar().outerHTML}
    <main id="route-outlet" class="app-main"></main>
  `;
  // Re-bind sidebar (innerHTML stripped events but we use links, so OK)
  window.addEventListener('hashchange', render);
  render();
}
