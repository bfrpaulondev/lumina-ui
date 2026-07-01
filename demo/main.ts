/**
 * LuminaUI — Playground entry.
 *
 * Imports the full library (registers every custom element as a
 * side-effect), then boots the SPA app shell + router.
 */

import '../src/index';
import './styles/playground.css';
import { initApp } from './app';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Guard against duplicate initialization (BUG 8 fix)
if (!(globalThis as any).__LUMINA_VERSION) {
  (globalThis as any).__LUMINA_VERSION = '0.3.0';
  console.log(
    '%cLuminaUI Playground v0.3.0 ✨',
    'color: #7c5cff; font-size: 14px; font-weight: bold;',
  );
}
