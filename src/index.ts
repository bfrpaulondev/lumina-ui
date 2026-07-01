/**
 * LuminaUI — Public entry point.
 *
 * Importing this module side-effect-registers every component with the
 * CustomElementRegistry. Tree-shakers will keep only the components you
 * actually reference if you import from the per-component paths instead.
 */

import './components/lumina-button';
import './components/lumina-card';
import './components/lumina-input';
import './components/lumina-toggle';
import './components/lumina-modal';
import './components/lumina-navigation';
import './components/lumina-progress';
import './components/lumina-badge';
import './components/lumina-tooltip';
import './components/lumina-container';

export { LuminaElement } from './core/LuminaElement';
export type { LuminaElementAttributes } from './core/LuminaElement';
export * from './core/types';
export * from './core/tokens';
export * from './core/utils';
export { ParticleField } from './core/ParticleField';
