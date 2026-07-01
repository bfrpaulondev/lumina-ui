/**
 * LuminaUI — Monaco editor loader.
 *
 * Loads Monaco from CDN (jsdelivr) so we don't bloat our own bundle.
 * Returns a memoized promise so all CodeViewer instances share the
 * same loaded instance. Falls back to a simple <textarea> if CDN fails.
 */

import loader from '@monaco-editor/loader';

type Monaco = any;

let monacoPromise: Promise<Monaco> | null = null;

export function loadMonaco(): Promise<Monaco> {
  if (monacoPromise) return monacoPromise;
  loader.config({
    paths: {
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs',
    },
  });
  monacoPromise = loader.init().catch((err: any) => {
    console.warn('Monaco CDN failed, falling back to basic editor:', err);
    // Return null to signal fallback — CodeViewer checks for this
    return null;
  }) as Promise<Monaco>;
  return monacoPromise;
}
