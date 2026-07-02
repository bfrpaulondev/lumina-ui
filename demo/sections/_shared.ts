/**
 * LuminaUI — Shared helpers for playground sections.
 */

export function el(tag: string, attrs: Record<string, string> = {}, children: (string | Node)[] = []): HTMLElement {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) {
    if (typeof c === 'string') node.appendChild(document.createTextNode(c));
    else node.appendChild(c);
  }
  return node;
}

export function sectionHead(num: string, title: string, subtitle: string): HTMLElement {
  return el('header', { class: 'section-head', html: `
    <div class="section-head__row">
      <span class="section-head__num">${num}</span>
      <h1 class="section-head__title">${title}</h1>
    </div>
    <p class="section-head__sub">${subtitle}</p>
  ` });
}

export function card(content: string): HTMLElement {
  return el('div', { class: 'card', html: content });
}

export function rangeControl(
  label: string,
  min: number,
  max: number,
  step: number,
  value: number,
  onInput: (v: number) => void,
): HTMLElement {
  const wrap = el('label', { class: 'control' });
  wrap.innerHTML = `
    <div class="control__head">
      <span class="control__label">${label}</span>
      <span class="control__value" data-value>${value}</span>
    </div>
    <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" />
  `;
  const input = wrap.querySelector('input')!;
  const valueEl = wrap.querySelector('[data-value]')!;
  input.addEventListener('input', () => {
    const v = parseFloat(input.value);
    valueEl.textContent = String(v);
    onInput(v);
  });
  return wrap;
}

export function selectControl(
  label: string,
  options: Array<{ value: string; label: string }>,
  value: string,
  onChange: (v: string) => void,
): HTMLElement {
  const wrap = el('label', { class: 'control' });
  const opts = options.map((o) => `<option value="${o.value}" ${o.value === value ? 'selected' : ''}>${o.label}</option>`).join('');
  wrap.innerHTML = `
    <div class="control__head">
      <span class="control__label">${label}</span>
    </div>
    <select>${opts}</select>
  `;
  wrap.querySelector('select')!.addEventListener('change', (e) => {
    onChange((e.target as HTMLSelectElement).value);
  });
  return wrap;
}

export function colorControl(
  label: string,
  value: string,
  onChange: (v: string) => void,
): HTMLElement {
  const wrap = el('label', { class: 'control' });
  wrap.innerHTML = `
    <div class="control__head">
      <span class="control__label">${label}</span>
      <span class="control__value" data-value>${value}</span>
    </div>
    <input type="color" value="${value}" />
  `;
  const input = wrap.querySelector('input')!;
  const valueEl = wrap.querySelector('[data-value]')!;
  input.addEventListener('input', () => {
    valueEl.textContent = input.value;
    onChange(input.value);
  });
  return wrap;
}

export function fpsMeter(): { el: HTMLElement; update: (fps: number) => void } {
  const node = el('div', { class: 'fps-meter', html: `
    <span class="fps-meter__label">FPS</span>
    <span class="fps-meter__value" data-fps>—</span>
  ` });
  return {
    el: node,
    update: (fps: number) => {
      const val = node.querySelector('[data-fps]')!;
      val.textContent = String(Math.round(fps));
      val.classList.remove('good', 'ok', 'bad');
      if (fps >= 55) val.classList.add('good');
      else if (fps >= 30) val.classList.add('ok');
      else val.classList.add('bad');
    },
  };
}

/** Run an FPS sampler that calls back each second. Returns a stop fn. */
export function startFpsSampler(onSample: (fps: number) => void): () => void {
  let raf = 0;
  let frames = 0;
  let last = performance.now();
  const tick = (): void => {
    frames += 1;
    const now = performance.now();
    if (now - last >= 1000) {
      onSample((frames * 1000) / (now - last));
      frames = 0;
      last = now;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export const VARIANTS = ['glass', 'morph', 'neural', 'void', 'aura', 'dimensional'] as const;
export const INTENSITIES = ['subtle', 'medium', 'intense', 'extreme'] as const;
export const DEPTHS = ['flat', 'medium', 'deep', 'extrude'] as const;
export const THEMES = ['light', 'dark', 'auto', 'cosmic', 'void'] as const;

export const ACCENTS = ['#7c5cff', '#78f0ff', '#ff6ec7', '#ffd166', '#22c55e', '#ff5577'];
