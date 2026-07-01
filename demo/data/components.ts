/**
 * LuminaUI — Component metadata + code snippets for the playground.
 *
 * Each entry contains:
 *  - name, tag, description, accent suggestion
 *  - variants: array of { name, visualDesc, technicalDesc, recommended, useCases, cssTips }
 *  - snippets:
 *      component  — the actual TypeScript source of the Web Component
 *      vanilla    — usage example in plain HTML/TS
 *      react      — usage example in React/TSX
 *
 * The component snippets are intentionally trimmed for readability in the
 * playground (full source is in /src/components/*.ts). They preserve the
 * key APIs, variant logic and CSS so users can copy-paste as a starting
 * point without dragging 600 lines of comments.
 */

export interface VariantInfo {
  name: string;
  visualDesc: string;
  technicalDesc: string;
  recommended: { intensity?: string; depth?: string; accent?: string };
  useCases: string[];
  cssTips: string[];
}

export interface ComponentSnippets {
  component: string;
  vanilla: string;
  react: string;
}

export interface ComponentMeta {
  name: string;
  tag: string;
  description: string;
  accent: string;
  variants: VariantInfo[];
  snippets: ComponentSnippets;
}

export const SHARED_VARIANTS: VariantInfo[] = [
  {
    name: 'glass',
    visualDesc: 'Frosted glass with subtle blur, saturation boost and rim light.',
    technicalDesc:
      'Uses backdrop-filter: blur(14px) saturate(1.4) on a translucent surface, with inset highlight to simulate glass edge. Conic gradient ring reveals on hover.',
    recommended: { intensity: 'medium', depth: 'medium', accent: '#7c5cff' },
    useCases: [
      'Botões em landing pages premium',
      'Cards sobre backgrounds coloridos',
      'Toolbars flutuantes',
      'Modais sobre conteúdo rico',
    ],
    cssTips: [
      'Ajuste --lumina-surface-alpha (0..1) para mais/menos transparência',
      'Use backdrop-filter diferente via part="bg" para blur mais forte',
      'Combine com theme="light" sobre imagens claras',
    ],
  },
  {
    name: 'morph',
    visualDesc: 'Shape-shifting polygon that morphs between pill and squircle on hover.',
    technicalDesc:
      'Animates clip-path polygon() points with cubic-bezier(0.34, 1.56, 0.64, 1) spring easing. The element stays in normal flow; only the visual shape transforms.',
    recommended: { intensity: 'intense', depth: 'flat', accent: '#78f0ff' },
    useCases: [
      'Botões de call-to-action únicos',
      'Badges de status com personalidade',
      'Cards com bordas vivas',
      'Tooltips com identidade',
    ],
    cssTips: [
      'Troque os pontos do clip-path para criar morphs próprios',
      'Combine com transition: border-radius para suavizar cantos',
      'Em Safari antigo use -webkit-clip-path',
    ],
  },
  {
    name: 'neural',
    visualDesc: 'Translucent surface with a living network of connected particles.',
    technicalDesc:
      'A canvas particle field runs behind the surface. Each particle drifts; pairs within 90px get a connecting line whose opacity scales with inverse distance. rAF-driven, HiDPI.',
    recommended: { intensity: 'intense', depth: 'medium', accent: '#ff6ec7' },
    useCases: [
      'Hero sections de produtos tech/IA',
      'Dashboards analíticos',
      'Cards de feature "inteligente"',
      'Botões de ações neurais / smart',
    ],
    cssTips: [
      'Reduza --lumina-intensity para 0.4 em ambientes com várias instâncias',
      'Mude --lumina-accent-rgb para colorir as partículas',
      'Pause o campo em prefers-reduced-motion (já é automático)',
    ],
  },
  {
    name: 'void',
    visualDesc: 'Deep black surface with starfield and chromatic aberration glow.',
    technicalDesc:
      'Background canvas renders wrap-around star points. Text gets text-shadow split into red and cyan channels (chromatic aberration). Border uses translucent accent at 0.2 alpha.',
    recommended: { intensity: 'extreme', depth: 'deep', accent: '#78f0ff' },
    useCases: [
      'Modos escuros premium / "pro tools"',
      'Telas de boot, splash, init',
      'Componentes em sites de tecnologia espacial/futurista',
      'Status de erro crítico ou alerta',
    ],
    cssTips: [
      'Ajuste os offsets de text-shadow para mais/menos aberração',
      'Use accent colors frias (#78f0ff, #00ff95) para combinar com o tema',
      'Sobreponha void com container void para efeito mais profundo',
    ],
  },
  {
    name: 'aura',
    visualDesc: 'Floating element with a soft radial aura that breathes around it.',
    technicalDesc:
      'A radial-gradient pseudo-element blurred 20px sits behind the surface. The host animates with a 4s translateY keyframe. On hover the aura intensifies by --lumina-intensity.',
    recommended: { intensity: 'intense', depth: 'medium', accent: '#ffd166' },
    useCases: [
      'Hero CTAs que precisam "respirar"',
      'Cards de destaque / featured',
      'Badges "live" / "new"',
      'Toggle de funcionalidades premium',
    ],
    cssTips: [
      'Mude a keyframe float para 6-8s se quiser mais suave',
      'Combine accent warm (#ffd166, #ff6ec7) para auras mais vivas',
      'Aumente blur(20px) para aura mais difusa',
    ],
  },
  {
    name: 'dimensional',
    visualDesc: '3D extruded element with parallax sheen and depth shadow.',
    technicalDesc:
      'Uses CSS transform-style: preserve-3d, perspective(800px) and rotateX/Y driven by pointer position. The bg carries a translateZ depth shadow using --lumina-depth. Sheen gradient on hover.',
    recommended: { intensity: 'intense', depth: 'deep', accent: '#7c5cff' },
    useCases: [
      'Cards de produto premium',
      'Botões de checkout / conversão',
      'Tiles de dashboards financeiros',
      'Modais com entrada dramática',
    ],
    cssTips: [
      'Ajuste perspective() para mais/menos dramaticidade (400-1200px)',
      'Aumente --lumina-depth para extrusão mais profunda (32-64px)',
      'Combine com variant="dimensional" no container pai para herdar perspectiva',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Per-component code snippets                                         */
/* ------------------------------------------------------------------ */

const BUTTON_SNIPPETS: ComponentSnippets = {
  component: `import { LuminaElement } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { intensityToMultiplier, prefersReducedMotion } from '../core/utils';

export class LuminaButton extends LuminaElement {
  static tagName = 'lumina-button';

  private field: ParticleField | null = null;
  private burstCanvas: HTMLCanvasElement | null = null;
  private burstCtx: CanvasRenderingContext2D | null = null;
  private burstParticles: BurstParticle[] = [];

  protected render(): string {
    return \`
      <span class="lumina-btn__shell" part="shell">
        <span class="lumina-btn__bg" part="bg"></span>
        <span class="lumina-btn__ring" part="ring" aria-hidden="true"></span>
        <span class="lumina-btn__aura" part="aura" aria-hidden="true"></span>
        <span class="lumina-btn__field" part="field" aria-hidden="true"></span>
        <canvas class="lumina-btn__burst" part="burst" aria-hidden="true"></canvas>
        <span class="lumina-btn__sheen" part="sheen" aria-hidden="true"></span>
        <span class="lumina-btn__content" part="content">
          <slot></slot>
        </span>
      </span>
    \`;
  }

  protected styles(): string {
    return \`
      :host {
        --lumina-btn-h: 48px;
        display: inline-block;
        cursor: pointer;
        border-radius: var(--lumina-radius-pill);
        font-family: var(--lumina-font-sans);
      }
      .lumina-btn__shell {
        position: relative;
        display: inline-flex;
        align-items: center;
        height: var(--lumina-btn-h);
        padding: 0 22px;
        border-radius: inherit;
        overflow: hidden;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lumina-btn__bg {
        position: absolute; inset: 0;
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid var(--lumina-border);
      }
      .lumina-btn__ring {
        position: absolute; inset: -1px;
        border-radius: inherit;
        background: conic-gradient(from 0deg, transparent 0%, var(--lumina-accent) 25%,
          transparent 50%, var(--lumina-accent) 75%, transparent 100%);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        padding: 1px;
        animation: lumina-btn-spin 6s linear infinite;
        animation-play-state: paused;
        opacity: 0.35;
      }
      :host(:hover) .lumina-btn__ring { animation-play-state: running; opacity: 0.7; }
      :host(:hover) .lumina-btn__shell { transform: translateY(-2px) scale(1.02); }

      /* Variant: morph */
      :host([variant="morph"]) .lumina-btn__shell {
        clip-path: polygon(12% 0,88% 0,100% 30%,100% 70%,88% 100%,12% 100%,0 70%,0 30%);
        transition: clip-path var(--lumina-speed) var(--lumina-ease-spring);
      }
      :host([variant="morph"]:hover) .lumina-btn__shell {
        clip-path: polygon(0 0,100% 0,100% 100%,0 100%);
      }

      /* Variant: dimensional */
      :host([variant="dimensional"]) .lumina-btn__bg {
        box-shadow: 0 calc(var(--lumina-depth) * 0.6) 0 calc(var(--lumina-depth) * -0.4)
          rgb(var(--lumina-accent-rgb) / 0.5);
      }

      @keyframes lumina-btn-spin { to { transform: rotate(360deg); } }
    \`;
  }

  protected mounted(): void {
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.addEventListener('click', this.onClick);
    this.maybeInitField();
    this.initBurstCanvas();
  }

  private onClick = (e: MouseEvent): void => {
    this.spawnBurst(e.offsetX, e.offsetY);
    this.dispatchEvent(new CustomEvent('lumina-press', { bubbles: true, composed: true }));
  };

  private maybeInitField(): void {
    // Spawns a ParticleField for neural/void/aura variants
    const needsField = ['neural', 'void', 'aura'].includes(this.variant);
    if (!needsField) return;
    const slot = this.$$('.lumina-btn__field');
    if (!slot) return;
    this.field = new ParticleField(this, {
      count: Math.round(20 * intensityToMultiplier(this.intensity)),
      rgb: getComputedStyle(this).getPropertyValue('--lumina-accent-rgb').trim(),
      connect: this.variant === 'neural',
      starfield: this.variant === 'void',
    });
    this.field.mount(slot);
  }

  private spawnBurst(cx: number, cy: number): void {
    // 18-particle radial burst from click point (see full source)
    // ...
  }
}

customElements.define(LuminaButton.tagName, LuminaButton);`,
  vanilla: `<!-- index.html -->
<!doctype html>
<html>
  <head>
    <script type="module" src="https://esm.sh/lumina-ui"></script>
  </head>
  <body>
    <lumina-button
      variant="dimensional"
      intensity="intense"
      accent-color="#7c5cff"
      depth="deep"
      speed="0.4"
    >
      Confirmar pedido
    </lumina-button>

    <script type="module">
      const btn = document.querySelector('lumina-button');
      btn.addEventListener('lumina-press', (e) => {
        console.log('Button pressed!', e);
      });

      // Toggle variant at runtime
      setTimeout(() => {
        btn.variant = 'void';
        btn.accentColor = '#78f0ff';
      }, 2000);
    </script>
  </body>
</html>`,
  react: `import { useEffect, useRef } from 'react';
import 'lumina-ui'; // registers <lumina-button> as a side-effect

// React does not know about custom elements by default, so we type them.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lumina-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'glass' | 'morph' | 'neural' | 'void' | 'aura' | 'dimensional';
          intensity?: 'subtle' | 'medium' | 'intense' | 'extreme';
          'accent-color'?: string;
          depth?: 'flat' | 'medium' | 'deep' | 'extrude';
          speed?: number;
        },
        HTMLElement
      >;
    }
  }
}

export function ConfirmButton({ onConfirm }: { onConfirm: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => onConfirm();
    el.addEventListener('lumina-press', handler);
    return () => el.removeEventListener('lumina-press', handler);
  }, [onConfirm]);

  return (
    <lumina-button
      ref={ref}
      variant="dimensional"
      intensity="intense"
      accent-color="#7c5cff"
      depth="deep"
      speed={0.4}
    >
      Confirmar pedido
    </lumina-button>
  );
}`,
};

const CARD_SNIPPETS: ComponentSnippets = {
  component: `import { LuminaElement } from '../core/LuminaElement';
import { ParticleField } from '../core/ParticleField';
import { throttle } from '../core/utils';

export class LuminaCard extends LuminaElement {
  static tagName = 'lumina-card';

  private tiltRaf = 0;
  private targetRX = 0; private targetRY = 0;
  private currentRX = 0; private currentRY = 0;

  protected render(): string {
    return \`
      <article class="lumina-card" part="card">
        <div class="lumina-card__glow" part="glow"></div>
        <div class="lumina-card__field" part="field"></div>
        <div class="lumina-card__glass" part="glass">
          <div class="lumina-card__sheen" part="sheen"></div>
          <div class="lumina-card__inner" part="inner">
            <slot name="media"></slot>
            <div class="lumina-card__body">
              <slot name="title"></slot>
              <slot name="subtitle"></slot>
              <slot></slot>
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </article>
    \`;
  }

  protected styles(): string {
    return \`
      :host {
        display: block;
        border-radius: var(--lumina-radius-lg);
        perspective: 800px;
      }
      .lumina-card {
        transform-style: preserve-3d;
        transition: transform var(--lumina-speed) var(--lumina-ease-spring);
      }
      .lumina-card__glow {
        position: absolute; inset: -10%;
        background: radial-gradient(400px circle at var(--lx, 50%) var(--ly, 50%),
          rgb(var(--lumina-accent-rgb) / calc(0.45 * var(--lumina-intensity))), transparent 60%);
        filter: blur(30px);
        opacity: 0;
        transition: opacity var(--lumina-speed) var(--lumina-ease-out);
      }
      :host(:hover) .lumina-card__glow { opacity: 1; }
      :host(:hover) .lumina-card { transform: translateY(-4px); }
      .lumina-card__glass {
        background: rgb(var(--lumina-surface) / var(--lumina-surface-alpha));
        backdrop-filter: blur(18px) saturate(1.5);
        border: 1px solid var(--lumina-border);
      }
      .lumina-card__inner { padding: 24px; transform: translateZ(20px); }

      /* Variant: morph - octagon border */
      :host([variant="morph"]) .lumina-card {
        clip-path: polygon(0 8%,8% 0,92% 0,100% 8%,100% 92%,92% 100%,8% 100%,0 92%);
      }

      /* Variant: dimensional - 3D tilt */
      :host([variant="dimensional"]) .lumina-card__inner { transform: translateZ(40px); }
      :host([variant="dimensional"]) .lumina-card__glass {
        box-shadow: 0 calc(var(--lumina-depth) * 0.5) 0 calc(var(--lumina-depth) * -0.3)
          rgb(var(--lumina-accent-rgb) / 0.4), var(--lumina-shadow);
      }
    \`;
  }

  protected mounted(): void {
    this.addEventListener('pointermove', this.onPointerMove);
    this.addEventListener('pointerleave', this.onPointerLeave);
    this.maybeInitField();
  }

  private onPointerMove = throttle((e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.setProperty('--lx', \`\${x}%\`);
    this.style.setProperty('--ly', \`\${y}%\`);

    if (this.variant === 'dimensional') {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      this.targetRY = px * 18;
      this.targetRX = -py * 18;
      if (!this.tiltRaf) this.tickTilt();
    }
  }, 16);

  private tickTilt = (): void => {
    this.currentRX += (this.targetRX - this.currentRX) * 0.18;
    this.currentRY += (this.targetRY - this.currentRY) * 0.18;
    const card = this.$$('.lumina-card');
    if (card) {
      card.style.transform = \`perspective(800px) rotateX(\${this.currentRX}deg)
        rotateY(\${this.currentRY}deg) translateY(-4px)\`;
    }
    if (Math.abs(this.targetRX - this.currentRX) > 0.05 ||
        Math.abs(this.targetRY - this.currentRY) > 0.05) {
      this.tiltRaf = requestAnimationFrame(this.tickTilt);
    } else { this.tiltRaf = 0; }
  };
}`,
  vanilla: `<lumina-card
  variant="dimensional"
  intensity="intense"
  accent-color="#7c5cff"
  depth="deep"
>
  <h3 slot="title">Plano Pro</h3>
  <p slot="subtitle">R$ 49/mês</p>
  <p>Tudo do Free + 100GB de storage, suporte prioritário e analytics.</p>
  <div slot="footer">
    <lumina-button variant="dimensional" accent-color="#7c5cff">Assinar</lumina-button>
  </div>
</lumina-card>`,
  react: `import 'lumina-ui';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lumina-card': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: string; intensity?: string;
          'accent-color'?: string; depth?: string;
        },
        HTMLElement
      >;
    }
  }
}

export function PricingCard() {
  return (
    <lumina-card
      variant="dimensional"
      intensity="intense"
      accent-color="#7c5cff"
      depth="deep"
    >
      <h3 slot="title">Plano Pro</h3>
      <p slot="subtitle">R$ 49/mês</p>
      <p>Tudo do Free + 100GB de storage, suporte prioritário e analytics.</p>
      <div slot="footer">
        <lumina-button variant="dimensional" accent-color="#7c5cff">
          Assinar
        </lumina-button>
      </div>
    </lumina-card>
  );
}`,
};

const INPUT_SNIPPETS: ComponentSnippets = {
  component: `export class LuminaInput extends LuminaElement {
  static tagName = 'lumina-input';

  private input: HTMLInputElement | null = null;
  private echo: HTMLCanvasElement | null = null;
  private echoRipples: Array<{x:number;y:number;life:number;maxLife:number}> = [];

  protected render(): string {
    return \`
      <label class="lumina-input">
        <span class="lumina-input__label"><slot name="label"></slot></span>
        <span class="lumina-input__shell">
          <span class="lumina-input__field"></span>
          <span class="lumina-input__bg"></span>
          <span class="lumina-input__ring"></span>
          <span class="lumina-input__bar"></span>
          <canvas class="lumina-input__echo"></canvas>
          <input class="lumina-input__el" type="text" />
        </span>
      </label>
    \`;
  }

  // The "echo" is a canvas ripple that fires at the cursor position on
  // every keystroke. The "bar" is the bottom underline that grows on focus.
  // The "ring" is the conic gradient border that spins on focus.
  // The "field" houses a neural particle network that activates on focus.
}`,
  vanilla: `<lumina-input
  variant="neural"
  intensity="intense"
  accent-color="#ff6ec7"
  placeholder="Buscar na base de conhecimento..."
></lumina-input>

<script type="module">
  const input = document.querySelector('lumina-input');
  input.addEventListener('lumina-change', (e) => {
    console.log('Value:', e.detail.value);
  });
  input.addEventListener('lumina-submit', (e) => {
    console.log('Submitted:', e.detail.value);
  });
</script>`,
  react: `export function SearchBar() {
  return (
    <lumina-input
      variant="neural"
      intensity="intense"
      accent-color="#ff6ec7"
      placeholder="Buscar..."
      onLuminaChange={(e) => console.log(e.detail.value)}
    />
  );
}`,
};

const TOGGLE_SNIPPETS: ComponentSnippets = {
  component: `export class LuminaToggle extends LuminaElement {
  static tagName = 'lumina-toggle';
  private _checked = false;

  get checked(): boolean { return this._checked; }
  set checked(v: boolean) {
    this._checked = v;
    this.setAttribute('aria-checked', String(v));
    if (v && !prefersReducedMotion()) this.burst();
  }

  protected render(): string {
    return \`
      <button class="lumina-toggle" role="switch" aria-checked="false">
        <span class="lumina-toggle__aura"></span>
        <span class="lumina-toggle__track">
          <span class="lumina-toggle__glow"></span>
          <span class="lumina-toggle__knob">
            <canvas class="lumina-toggle__burst"></canvas>
          </span>
        </span>
        <span class="lumina-toggle__label"><slot></slot></span>
      </button>
    \`;
  }

  // On click: toggle _checked, fire burst of particles from the knob,
  // dispatch 'lumina-toggle' CustomEvent with { checked } detail.
}`,
  vanilla: `<lumina-toggle
  variant="aura"
  intensity="intense"
  accent-color="#ffd166"
  checked
>
  Notificações push
</lumina-toggle>

<script type="module">
  const toggle = document.querySelector('lumina-toggle');
  toggle.addEventListener('lumina-toggle', (e) => {
    console.log('Toggle state:', e.detail.checked);
  });
</script>`,
  react: `export function NotificationToggle() {
  const [enabled, setEnabled] = useState(true);
  return (
    <lumina-toggle
      variant="aura"
      intensity="intense"
      accent-color="#ffd166"
      checked={enabled}
      onLuminaToggle={(e) => setEnabled(e.detail.checked)}
    >
      Notificações push
    </lumina-toggle>
  );
}`,
};

const MODAL_SNIPPETS: ComponentSnippets = {
  component: `export class LuminaModal extends LuminaElement {
  static tagName = 'lumina-modal';
  private _open = false;
  private previouslyFocused: HTMLElement | null = null;

  get open(): boolean { return this._open; }
  set open(v: boolean) { v ? this.showModal() : this.close(); }

  showModal(): void {
    this.previouslyFocused = document.activeElement as HTMLElement;
    this._open = true;
    this.setAttribute('data-open', '');
    this.dialog.showModal(); // native <dialog>
    // Focus first focusable; trap Tab; close on Esc
  }

  close(): void {
    this._open = false;
    this.removeAttribute('data-open');
    setTimeout(() => this.dialog.close(), 350); // let the portal close anim play
    this.previouslyFocused?.focus();
  }

  protected styles(): string {
    return \`
      .lumina-modal__panel {
        transform: translate(-50%, -50%) scale(0.6);
        opacity: 0;
        transition: transform calc(var(--lumina-speed) * 1.4) var(--lumina-ease-spring);
      }
      :host([data-open]) .lumina-modal__panel {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      .lumina-modal__portal {
        /* The portal burst: a small radial that scales 0→20 on open */
        animation: lumina-modal-burst calc(var(--lumina-speed) * 1.4) var(--lumina-ease-out) forwards;
      }
      @keyframes lumina-modal-burst {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(20); opacity: 0; }
      }
    \`;
  }
}`,
  vanilla: `<lumina-modal id="confirm-modal" variant="dimensional" depth="deep">
  <span slot="title">Confirmar exclusão</span>
  <p>Esta ação não pode ser desfeita. Deseja continuar?</p>
  <div slot="footer">
    <lumina-button variant="glass" id="cancel-btn">Cancelar</lumina-button>
    <lumina-button variant="void" accent-color="#ff5577" id="confirm-btn">Excluir</lumina-button>
  </div>
</lumina-modal>

<script type="module">
  const modal = document.getElementById('confirm-modal');
  document.getElementById('open-btn').addEventListener('click', () => modal.showModal());
  document.getElementById('cancel-btn').addEventListener('click', () => modal.close());
  document.getElementById('confirm-btn').addEventListener('click', () => {
    modal.close();
    // do the delete
  });
</script>`,
  react: `export function ConfirmDialog({ open, onClose, onConfirm }) {
  const ref = useRef(null);
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return (
    <lumina-modal ref={ref} variant="dimensional" depth="deep">
      <span slot="title">Confirmar exclusão</span>
      <p>Esta ação não pode ser desfeita.</p>
      <div slot="footer">
        <lumina-button variant="glass" onClick={onClose}>Cancelar</lumina-button>
        <lumina-button variant="void" accent-color="#ff5577" onClick={onConfirm}>
          Excluir
        </lumina-button>
      </div>
    </lumina-modal>
  );
}`,
};

const NAVIGATION_SNIPPETS: ComponentSnippets = {
  component: `export class LuminaNavigation extends LuminaElement {
  static tagName = 'lumina-navigation';
  private indicator: HTMLElement | null = null;
  private currentActive: HTMLElement | null = null;

  // Listens to clicks on <lumina-nav-item> children. When the active item
  // changes, the .lumina-nav__indicator FLIP-animates from the previous
  // position to the new one using transform: translateX() + width transition.
  // The proximity glow (.lumina-nav__glow) follows the cursor via --lx.

  private setActive(item: HTMLElement): void {
    this.querySelectorAll('lumina-nav-item').forEach(i => i.removeAttribute('active'));
    item.setAttribute('active', '');
    this.positionIndicator(item, true);
  }

  private positionIndicator(item: HTMLElement, animate: boolean): void {
    const barRect = this.$$('.lumina-nav__bar').getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    this.indicator.style.transform = \`translateX(\${itemRect.left - barRect.left - 6}px)\`;
    this.indicator.style.width = \`\${itemRect.width}px\`;
  }
}`,
  vanilla: `<lumina-navigation variant="glass" intensity="intense" accent-color="#7c5cff">
  <lumina-nav-item value="home" active>Home</lumina-nav-item>
  <lumina-nav-item value="explore">Explorar</lumina-nav-item>
  <lumina-nav-item value="docs">Documentação</lumina-nav-item>
</lumina-navigation>

<script type="module">
  const nav = document.querySelector('lumina-navigation');
  nav.addEventListener('lumina-nav-change', (e) => {
    console.log('Navigated to:', e.detail.value);
  });
</script>`,
  react: `export function TopNav({ current, onNavigate }) {
  return (
    <lumina-navigation
      variant="glass"
      intensity="intense"
      accent-color="#7c5cff"
      onLuminaNavChange={(e) => onNavigate(e.detail.value)}
    >
      <lumina-nav-item value="home" active={current === 'home'}>Home</lumina-nav-item>
      <lumina-nav-item value="explore" active={current === 'explore'}>Explorar</lumina-nav-item>
      <lumina-nav-item value="docs" active={current === 'docs'}>Docs</lumina-nav-item>
    </lumina-navigation>
  );
}`,
};

const PROGRESS_SNIPPETS: ComponentSnippets = {
  component: `export class LuminaProgress extends LuminaElement {
  static tagName = 'lumina-progress';

  // The fill width transitions with var(--lumina-speed). The shimmer is a
  // repeating linear-gradient sliding across via @keyframes. The head is
  // a glowing dot at the right edge. The trail is a canvas that spawns
  // particles drifting from the head position with slight gravity.

  set value(v: number) {
    this._value = Math.min(Math.max(v, 0), this.max);
    this.fill.style.width = \`\${(this._value / this.max) * 100}%\`;
  }

  // Indeterminate mode: width: 35% + left: -35% → 100% loop
}`,
  vanilla: `<lumina-progress
  variant="void"
  intensity="intense"
  accent-color="#78f0ff"
  value="42"
></lumina-progress>

<script type="module">
  const progress = document.querySelector('lumina-progress');
  let v = 0;
  const interval = setInterval(() => {
    v += 2;
    progress.value = v;
    if (v >= 100) clearInterval(interval);
  }, 100);
</script>`,
  react: `export function UploadProgress({ percent }) {
  return (
    <lumina-progress
      variant="void"
      intensity="intense"
      accent-color="#78f0ff"
      value={percent}
    />
  );
}`,
};

const BADGE_SNIPPETS: ComponentSnippets = {
  component: `export class LuminaBadge extends LuminaElement {
  static tagName = 'lumina-badge';

  // A small inline-flex pill with optional dot + halo.
  // The "pulse" attribute triggers two keyframes:
  //  - lumina-badge-pulse: dot scales 1→1.4 with opacity dip
  //  - lumina-badge-halo:  halo scales 0.9→1.6 with fade-out
  // Together they create the "live" / "online" breathing effect.

  // Variants:
  //  - void: chromatic aberration text-shadow (red+cyan split)
  //  - aura: floating translateY loop + radial bg
  //  - morph: pentagon clip-path "tag" shape
  //  - dimensional: extruded shadow using --lumina-depth
}`,
  vanilla: `<lumina-badge variant="aura" dot pulse accent-color="#ff6ec7">BETA</lumina-badge>
<lumina-badge variant="void" dot>offline</lumina-badge>
<lumina-badge variant="morph">v0.1.0</lumina-badge>`,
  react: `export function StatusBadge({ status }) {
  const cfg = {
    live:   { variant: 'aura', accent: '#22c55e', pulse: true, label: 'LIVE' },
    beta:   { variant: 'aura', accent: '#ff6ec7', pulse: true, label: 'BETA' },
    offline:{ variant: 'void', accent: '#78f0ff', pulse: false, label: 'offline' },
  }[status];
  return (
    <lumina-badge
      variant={cfg.variant}
      dot
      pulse={cfg.pulse}
      accent-color={cfg.accent}
    >
      {cfg.label}
    </lumina-badge>
  );
}`,
};

const TOOLTIP_SNIPPETS: ComponentSnippets = {
  component: `export class LuminaTooltip extends LuminaElement {
  static tagName = 'lumina-tooltip';

  // Wraps any element. On hover/focus-in shows a bubble with smart
  // positioning: tries the requested side first, flips to the opposite
  // side if it would overflow the viewport.

  private reposition(): void {
    const rect = this.bubble.getBoundingClientRect();
    const margin = 8;
    let newSide = this.bubble.getAttribute('data-side');
    if (newSide === 'top'    && rect.top < margin) newSide = 'bottom';
    if (newSide === 'bottom' && rect.bottom + margin > innerHeight) newSide = 'top';
    if (newSide === 'left'   && rect.left < margin) newSide = 'right';
    if (newSide === 'right'  && rect.right + margin > innerWidth) newSide = 'left';
    this.bubble.setAttribute('data-side', newSide);
  }
}`,
  vanilla: `<lumina-tooltip variant="aura" side="top" content="Clique para salvar">
  <lumina-button variant="glass" accent-color="#7c5cff">Salvar</lumina-button>
</lumina-tooltip>

<!-- Rich content via slot -->
<lumina-tooltip variant="glass" side="right">
  <lumina-button>Hover me</lumina-button>
  <div slot="content">
    <strong>Dica:</strong> Você pode usar <kbd>Cmd+K</kbd> para abrir a paleta.
  </div>
</lumina-tooltip>`,
  react: `export function HelpButton() {
  return (
    <lumina-tooltip variant="aura" side="top" content="Clique para salvar">
      <lumina-button variant="glass" accent-color="#7c5cff">
        Salvar
      </lumina-button>
    </lumina-tooltip>
  );
}`,
};

const CONTAINER_SNIPPETS: ComponentSnippets = {
  component: `export class LuminaContainer extends LuminaElement {
  static tagName = 'lumina-container';

  // The container broadcasts CSS variables to its descendants:
  //  --lumina-cursor-x, --lumina-cursor-y (percentage position)
  //  --lumina-accent, --lumina-intensity (inherited from host)
  //
  // This means any Lumina child placed inside inherits the container's
  // accent color, intensity, and can react to the cursor position via
  // the inherited --lumina-cursor-* variables.
  //
  // For neural/void/aura variants it also renders a background particle
  // field that lives behind the slotted content.

  private onPointerMove = throttle((e: PointerEvent): void => {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.setProperty('--lx', \`\${x}%\`);
    this.style.setProperty('--ly', \`\${y}%\`);
    this.style.setProperty('--lumina-cursor-x', \`\${x}%\`);
    this.style.setProperty('--lumina-cursor-y', \`\${y}%\`);
  }, 16);
}`,
  vanilla: `<lumina-container variant="neural" intensity="intense" accent-color="#7c5cff">
  <lumina-card variant="glass">
    <h3 slot="title">Dashboard</h3>
    <p>Children inherit the container's accent, intensity and cursor position.</p>
  </lumina-card>
  <lumina-button variant="aura" accent-color="#7c5cff">Action</lumina-button>
</lumina-container>`,
  react: `export function DashboardSection({ children }) {
  return (
    <lumina-container variant="neural" intensity="intense" accent-color="#7c5cff">
      {children}
    </lumina-container>
  );
}`,
};

/* ------------------------------------------------------------------ */
/* Exported registry                                                   */
/* ------------------------------------------------------------------ */

export const COMPONENTS: ComponentMeta[] = [
  {
    name: 'LuminaButton',
    tag: 'lumina-button',
    description:
      'Botão com 6 variantes morfáveis, anel cônico giratório e burst de partículas no clique.',
    accent: '#7c5cff',
    variants: SHARED_VARIANTS,
    snippets: BUTTON_SNIPPETS,
  },
  {
    name: 'LuminaCard',
    tag: 'lumina-card',
    description:
      'Cartão morfável com vidro, profundidade 3D e glow contextual que segue o cursor.',
    accent: '#7c5cff',
    variants: SHARED_VARIANTS,
    snippets: CARD_SNIPPETS,
  },
  {
    name: 'LuminaInput',
    tag: 'lumina-input',
    description:
      'Campo de entrada com eco visual no cursor, anel cônico no foco e campo neural.',
    accent: '#ff6ec7',
    variants: SHARED_VARIANTS,
    snippets: INPUT_SNIPPETS,
  },
  {
    name: 'LuminaToggle',
    tag: 'lumina-toggle',
    description: 'Interruptor com aura reativa e shower de partículas a cada toggle.',
    accent: '#ffd166',
    variants: SHARED_VARIANTS,
    snippets: TOGGLE_SNIPPETS,
  },
  {
    name: 'LuminaModal',
    tag: 'lumina-modal',
    description:
      'Modal com efeito de portal dimensional, focus trap e restauração de foco.',
    accent: '#7c5cff',
    variants: SHARED_VARIANTS,
    snippets: MODAL_SNIPPETS,
  },
  {
    name: 'LuminaNavigation',
    tag: 'lumina-navigation',
    description:
      'Barra de navegação com indicador FLIP-animado e glow de proximidade.',
    accent: '#7c5cff',
    variants: SHARED_VARIANTS,
    snippets: NAVIGATION_SNIPPETS,
  },
  {
    name: 'LuminaProgress',
    tag: 'lumina-progress',
    description:
      'Barra de progresso com shimmer contínuo e rastro de partículas orgânico.',
    accent: '#78f0ff',
    variants: SHARED_VARIANTS,
    snippets: PROGRESS_SNIPPETS,
  },
  {
    name: 'LuminaBadge',
    tag: 'lumina-badge',
    description: 'Badge com halo pulsante, flutuação e morph clip-path.',
    accent: '#ff6ec7',
    variants: SHARED_VARIANTS,
    snippets: BADGE_SNIPPETS,
  },
  {
    name: 'LuminaTooltip',
    tag: 'lumina-tooltip',
    description: 'Popover com posicionamento inteligente (auto-flip) e seta direcional.',
    accent: '#7c5cff',
    variants: SHARED_VARIANTS,
    snippets: TOOLTIP_SNIPPETS,
  },
  {
    name: 'LuminaContainer',
    tag: 'lumina-container',
    description:
      'Wrapper adaptativo que transmite contexto (cursor, accent) aos filhos Lumina.',
    accent: '#7c5cff',
    variants: SHARED_VARIANTS,
    snippets: CONTAINER_SNIPPETS,
  },
];

export function getComponent(tag: string): ComponentMeta | undefined {
  return COMPONENTS.find((c) => c.tag === tag);
}
