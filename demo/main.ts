/**
 * LuminaUI — Demo page entry.
 *
 * Imports the full library (registers every custom element as a
 * side-effect) and wires up the demo-only interactions (modal open
 * buttons, hero CTA smooth scroll, nav active tracking).
 */

import '../src/index';

/* ----------------------------------------------------------------- */
/* Smooth scroll for hero CTA                                        */
/* ----------------------------------------------------------------- */

document.getElementById('hero-cta')?.addEventListener('click', () => {
  document.getElementById('buttons')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('hero-secondary')?.addEventListener('click', () => {
  window.open('https://github.com/bfrpaulondev/lumina-ui', '_blank', 'noopener');
});

/* ----------------------------------------------------------------- */
/* Modal open/close wiring                                           */
/* ----------------------------------------------------------------- */

function wireModal(openBtnId: string, modalId: string, closeBtnId?: string): void {
  const openBtn = document.getElementById(openBtnId);
  const modal = document.getElementById(modalId) as HTMLElement & {
    showModal: () => void;
    close: () => void;
  } | null;
  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => modal.showModal());
  if (closeBtnId) {
    document.getElementById(closeBtnId)?.addEventListener('click', () => modal.close());
  }
}

wireModal('open-modal-glass', 'demo-modal-glass', 'close-modal-glass');
wireModal('open-modal-dim', 'demo-modal-dim', 'close-modal-dim');
wireModal('open-modal-void', 'demo-modal-void', 'close-modal-void');

/* ----------------------------------------------------------------- */
/* Active section tracking in site-nav (scroll spy)                  */
/* ----------------------------------------------------------------- */

const navLinks = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('.site-nav a'),
);

const sectionMap = new Map<string, HTMLElement>();
navLinks.forEach((link) => {
  const id = link.getAttribute('href')?.replace('#', '');
  if (!id) return;
  const section = document.getElementById(id);
  if (section) sectionMap.set(id, section);
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = entry.target.id;
        navLinks.forEach((l) => {
          const isActive = l.getAttribute('href') === `#${id}`;
          l.style.color = isActive ? '#fff' : '';
          l.style.background = isActive ? 'rgba(124, 92, 255, 0.18)' : '';
        });
      }
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
  );
  sectionMap.forEach((section) => observer.observe(section));
}

/* ----------------------------------------------------------------- */
/* Toggle / Button event logging (helpful for testing)               */
/* ----------------------------------------------------------------- */

document.addEventListener('lumina-toggle', (e) => {
  console.log('[LuminaUI] toggle:', (e as CustomEvent).detail);
});

document.addEventListener('lumina-press', (e) => {
  const target = e.target as HTMLElement;
  console.log('[LuminaUI] press:', target.tagName, target.textContent?.trim());
});

document.addEventListener('lumina-nav-change', (e) => {
  console.log('[LuminaUI] nav:', (e as CustomEvent).detail);
});

document.addEventListener('lumina-change', (e) => {
  console.log('[LuminaUI] input:', (e as CustomEvent).detail);
});

console.log(
  '%cLuminaUI v0.1.0 loaded ✨',
  'color: #7c5cff; font-size: 14px; font-weight: bold;',
);
console.log('Components registered:', [
  'lumina-button',
  'lumina-card',
  'lumina-input',
  'lumina-toggle',
  'lumina-modal',
  'lumina-navigation',
  'lumina-nav-item',
  'lumina-progress',
  'lumina-badge',
  'lumina-tooltip',
  'lumina-container',
]);
