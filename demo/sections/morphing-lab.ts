/**
 * Morphing Laboratory — demonstrate live morph transitions between variants.
 *
 * A single LuminaButton morphs through a sequence of variants on a timer
 * or on user click. The user can also pick a custom sequence.
 */
import type { Route } from '../app';
import { el, sectionHead, VARIANTS } from './_shared';

export default async function morphingLabSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'morph-lab' });

  root.innerHTML = `
    ${sectionHead('◈', 'Morphing Laboratory', 'Veja transições morfáveis ao vivo entre variantes. Glass vira neural vira void — em loop ou no seu controle.').outerHTML}

    <div class="morph-lab__stage">
      <lumina-button
        variant="glass"
        intensity="intense"
        accent-color="#7c5cff"
        speed="0.7"
        data-morph-target
      >
        Morphing…
      </lumina-button>
    </div>

    <div class="morph-lab__status">
      Variante atual: <span data-current-variant>glass</span> · Próxima em <span data-countdown>3</span>s
    </div>

    <div class="morph-lab__controls">
      <div class="control">
        <div class="control__head"><span class="control__label">Sequência</span></div>
        <div class="morph-lab__sequence" data-sequence>
          ${VARIANTS.map((v) => `
            <label class="morph-lab__seq-item">
              <input type="checkbox" value="${v}" checked />
              <span>${v}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <label class="control">
        <div class="control__head"><span class="control__label">Intervalo (s)</span><span class="control__value" data-interval-value>3</span></div>
        <input type="range" min="1" max="8" step="0.5" value="3" data-interval />
      </label>

      <label class="control">
        <div class="control__head"><span class="control__label">Velocidade morph (s)</span><span class="control__value" data-speed-value>0.7</span></div>
        <input type="range" min="0.2" max="2" step="0.1" value="0.7" data-speed />
      </label>

      <div class="morph-lab__actions">
        <lumina-button variant="glass" intensity="medium" accent-color="#7c5cff" data-toggle-play>Pausar</lumina-button>
        <lumina-button variant="void" intensity="intense" accent-color="#78f0ff" data-next>Próxima</lumina-button>
      </div>
    </div>

    <div class="morph-lab__hint">
      <p><strong>Dica:</strong> Cada variante tem seu próprio clip-path, background, shadow e partículas. A transição é suavizada por <code>transition: all var(--lumina-speed)</code> com <code>cubic-bezier(0.34, 1.56, 0.64, 1)</code> (spring).</p>
    </div>
  `;

  const target = root.querySelector('[data-morph-target]') as HTMLElement & { variant: string };
  const currentVariantEl = root.querySelector('[data-current-variant]') as HTMLElement;
  const countdownEl = root.querySelector('[data-countdown]') as HTMLElement;
  const intervalInput = root.querySelector('[data-interval]') as HTMLInputElement;
  const intervalValue = root.querySelector('[data-interval-value]') as HTMLElement;
  const speedInput = root.querySelector('[data-speed]') as HTMLInputElement;
  const speedValue = root.querySelector('[data-speed-value]') as HTMLElement;
  const seqCheckboxes = root.querySelectorAll('[data-sequence] input') as NodeListOf<HTMLInputElement>;
  const playBtn = root.querySelector('[data-toggle-play]') as HTMLElement;
  const nextBtn = root.querySelector('[data-next]') as HTMLElement;

  let sequence: string[] = [...VARIANTS];
  let idx = 0;
  let interval = 3;
  let countdown = 3;
  let playing = true;
  let timer: ReturnType<typeof setInterval> | null = null;
  let countdownTimer: ReturnType<typeof setInterval> | null = null;

  function applyCurrentVariant(): void {
    const v = sequence[idx];
    target.variant = v;
    target.setAttribute('variant', v);
    currentVariantEl.textContent = v;
  }

  function nextVariant(): void {
    if (sequence.length === 0) return;
    idx = (idx + 1) % sequence.length;
    applyCurrentVariant();
    countdown = interval;
  }

  function startTimers(): void {
    stopTimers();
    countdownTimer = setInterval(() => {
      countdown -= 1;
      countdownEl.textContent = String(Math.max(0, countdown));
    }, 1000);
    timer = setInterval(() => {
      nextVariant();
    }, interval * 1000);
  }

  function stopTimers(): void {
    if (timer) clearInterval(timer);
    if (countdownTimer) clearInterval(countdownTimer);
    timer = null;
    countdownTimer = null;
  }

  function rebuildSequence(): void {
    sequence = Array.from(seqCheckboxes).filter((cb) => cb.checked).map((cb) => cb.value);
    if (sequence.length === 0) {
      // Force at least one
      seqCheckboxes[0].checked = true;
      sequence = [seqCheckboxes[0].value];
    }
    idx = idx % sequence.length;
    applyCurrentVariant();
  }

  seqCheckboxes.forEach((cb) => cb.addEventListener('change', rebuildSequence));
  intervalInput.addEventListener('input', () => {
    interval = parseFloat(intervalInput.value);
    intervalValue.textContent = String(interval);
    if (playing) startTimers();
  });
  speedInput.addEventListener('input', () => {
    const s = parseFloat(speedInput.value);
    speedValue.textContent = String(s);
    target.setAttribute('speed', String(s));
  });
  playBtn.addEventListener('lumina-press', () => {
    playing = !playing;
    if (playing) {
      playBtn.textContent = 'Pausar';
      startTimers();
    } else {
      playBtn.textContent = 'Continuar';
      stopTimers();
    }
  });
  nextBtn.addEventListener('lumina-press', () => {
    nextVariant();
    if (playing) startTimers();
  });

  applyCurrentVariant();
  startTimers();

  return root;
}
