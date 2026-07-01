/**
 * LuminaUI — Monaco editor loader.
 *
 * Loads Monaco from CDN (jsdelivr) so we don't bloat our own bundle.
 * Returns a memoized promise so all CodeViewer instances share the
 * same loaded instance.
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
  monacoPromise = loader.init() as Promise<Monaco>;
  return monacoPromise;
}
