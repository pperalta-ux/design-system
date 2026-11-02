// Custom elements used by Motion.mdx:
//   ds-motion-table  – reads CSS custom properties, renders a token table
//   ds-replay-demo   – wraps a live animation demo with a Replay button

import '../components/toggle/toggle.css';
import '../components/toggle/ds-toggle';

// ── shared demo styles ────────────────────────────────────────────
function injectDemoStyles() {
  if (document.getElementById('ds-motion-demo-styles')) return;
  const s = document.createElement('style');
  s.id = 'ds-motion-demo-styles';
  s.textContent = `
    .ds-demo-box {
      border: 1px solid var(--color-border, #d4d4d4);
      border-radius: 8px;
      padding: 24px 24px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin: 4px 0 20px;
    }
    .ds-demo-stage {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 72px;
      width: 100%;
    }
    .ds-demo-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-top: 10px;
      border-top: 1px solid var(--color-border, #e5e5e5);
    }
    .ds-demo-caption {
      font-size: 12px;
      color: var(--color-text-subtle, #737373);
    }
    .ds-replay-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border: 1px solid var(--color-border, #d4d4d4);
      border-radius: 4px;
      background: var(--color-bg, #fff);
      font-size: 12px;
      cursor: pointer;
      color: var(--color-text, #171717);
      user-select: none;
      font-family: inherit;
      transition:
        background-color var(--duration-fast, 150ms) var(--ease-out, ease),
        border-color     var(--duration-fast, 150ms) var(--ease-out, ease),
        color            var(--duration-fast, 150ms) var(--ease-out, ease);
    }
    .ds-replay-btn:hover:not([disabled]) {
      background: var(--color-brand-tint, #f3f0ff);
      border-color: var(--color-brand, #6d28d9);
      color: var(--color-brand, #6d28d9);
    }
    .ds-replay-btn:active:not([disabled]) { transform: scale(0.97); }
    .ds-replay-btn[disabled] { opacity: 0.45; cursor: not-allowed; }

    /* Button press replay — targets WA's ::part(button) from outside */
    @keyframes ds-demo-btn-press {
      0%   { transform: scale(1); }
      35%  { transform: scale(0.97); }
      100% { transform: scale(1); }
    }
    wa-button.ds-demo-pressing::part(button) {
      animation: ds-demo-btn-press var(--duration-fast, 150ms)
                 var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1)) both;
    }
  `;
  document.head.appendChild(s);
}

// ── ds-motion-table ───────────────────────────────────────────────
class DsMotionTable extends HTMLElement {
  connectedCallback() {
    injectDemoStyles();
    const type = this.getAttribute('type') ?? 'duration';
    const cs   = getComputedStyle(document.documentElement);
    const get  = (v: string) => cs.getPropertyValue(v).trim() || '—';

    type Row = [string, string, string];
    let rows: Row[];

    if (type === 'duration') {
      rows = [
        ['--duration-instant', get('--duration-instant'), 'State snaps — focus ring appear, checkbox tick. Imperceptible delay, still animated.'],
        ['--duration-fast',    get('--duration-fast'),    'Micro-interactions — button press, toggle fade, switch thumb slide. Should feel instant.'],
        ['--duration-normal',  get('--duration-normal'),  'Component transitions — connector fill, step label color. Noticeable but not slow.'],
        ['--duration-slow',    get('--duration-slow'),    'Expressive sequences — stepper spring enter, ring pulse. Reserve for one key moment.'],
      ];
    } else {
      rows = [
        ['--ease-out',     get('--ease-out'),     'Most UI transitions — enters with energy, settles smoothly. (M3 standard easing.)'],
        ['--ease-in',      get('--ease-in'),       'Exits and dismissals — accelerates as element leaves. (Carbon spec easing.)'],
        ['--ease-spring',  get('--ease-spring'),   'Expressive moments — overshoots then settles. Button press, stepper marker enter.'],
        ['--ease-default', get('--ease-default'),  'Fallback / general purpose. Same as CSS ease. Prefer a specific curve in most cases.'],
      ];
    }

    const ths = ['Token', 'Value', 'Use']
      .map(h => `<th>${h}</th>`)
      .join('');
    const trs = rows
      .map(([tok, val, use]) =>
        `<tr><td><code>${tok}</code></td><td><code>${val}</code></td><td>${use}</td></tr>`
      )
      .join('');

    this.innerHTML = `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  }
}

if (!customElements.get('ds-motion-table')) {
  customElements.define('ds-motion-table', DsMotionTable);
}

// ── replay icon ───────────────────────────────────────────────────
const REPLAY_SVG = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"
  aria-hidden="true">
  <path d="M1.5 6.5a5 5 0 1 0 1-3M1.5 3.5v-2M1.5 3.5h2"
        stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// ── ds-replay-demo ────────────────────────────────────────────────
class DsReplayDemo extends HTMLElement {
  connectedCallback() {
    injectDemoStyles();
    const name = this.getAttribute('name') ?? 'button';

    const box     = document.createElement('div');
    box.className = 'ds-demo-box';
    const stage     = document.createElement('div');
    stage.className = 'ds-demo-stage';
    const footer     = document.createElement('div');
    footer.className = 'ds-demo-footer';
    const caption     = document.createElement('span');
    caption.className = 'ds-demo-caption';
    const replayBtn   = document.createElement('button');
    replayBtn.className = 'ds-replay-btn';
    replayBtn.innerHTML = `${REPLAY_SVG} Replay`;

    type Replay = () => void | Promise<void>;
    let replay: Replay;

    if (name === 'button') {
      caption.textContent = 'Button press — scale(0.97), ease-spring, fast duration';

      const waBtn = document.createElement('wa-button');
      waBtn.setAttribute('variant', 'brand');
      waBtn.setAttribute('appearance', 'accent');
      waBtn.textContent = 'Save changes';
      stage.appendChild(waBtn);

      replay = () => {
        waBtn.classList.remove('ds-demo-pressing');
        void (waBtn as HTMLElement).offsetWidth; // force reflow to restart animation
        waBtn.classList.add('ds-demo-pressing');
        waBtn.addEventListener(
          'animationend',
          () => waBtn.classList.remove('ds-demo-pressing'),
          { once: true }
        );
      };

    } else if (name === 'toggle') {
      caption.textContent = 'Toggle selection — color + fill fade, ease-out, fast duration';

      type DsToggleEl = HTMLElement & {
        options: { value: string; label: string; icon: string }[];
        value:   string;
      };
      const toggle = document.createElement('ds-toggle') as DsToggleEl;
      toggle.setAttribute('name', 'motion-demo-toggle');
      toggle.options = [
        { value: 'list',  label: 'List',
          icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><line x1="2" y1="4" x2="14" y2="4"/><line x1="2" y1="8" x2="14" y2="8"/><line x1="2" y1="12" x2="14" y2="12"/></svg>' },
        { value: 'grid',  label: 'Grid',
          icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>' },
        { value: 'table', label: 'Table',
          icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="1" width="14" height="14" rx="2"/><line x1="1" y1="5.5" x2="15" y2="5.5"/><line x1="6" y1="5.5" x2="6" y2="15"/><line x1="11" y1="5.5" x2="11" y2="15"/></svg>' },
      ];
      toggle.value = 'list';
      stage.appendChild(toggle);

      const opts = ['list', 'grid', 'table'];
      let idx = 0;
      replay = () => {
        idx = (idx + 1) % opts.length;
        toggle.value = opts[idx];
      };

    } else if (name === 'switch') {
      caption.textContent = 'Switch thumb — slide via WA transition, ease-out, fast duration';

      const sw = document.createElement('wa-switch');
      sw.textContent = 'Email notifications';
      stage.appendChild(sw);

      replay = () => sw.click();

    } else {
      // stepper
      caption.textContent = 'Stepper — spring enter + ring pulse, ease-spring, slow duration';

      type DsStepperEl = HTMLElement & {
        steps:          { name: string; label: string }[];
        activeIndex:    number;
        isLast:         boolean;
        next:           () => Promise<void>;
        updateComplete: Promise<boolean>;
      };
      const stepper = document.createElement('ds-stepper') as DsStepperEl;
      stepper.steps = [
        { name: 'plan',    label: 'Plan'    },
        { name: 'build',   label: 'Build'   },
        { name: 'review',  label: 'Review'  },
        { name: 'launch',  label: 'Launch'  },
      ];
      stepper.activeIndex = 0;
      stage.appendChild(stepper);

      replay = async () => {
        replayBtn.setAttribute('disabled', '');
        if (stepper.isLast) {
          stepper.activeIndex = 0;
          await stepper.updateComplete;
          await new Promise<void>(r => setTimeout(r, 80));
        }
        await stepper.next();
        await new Promise<void>(r => setTimeout(r, 420)); // let spring + ring finish
        replayBtn.removeAttribute('disabled');
      };
    }

    replayBtn.addEventListener('click', () => { void replay(); });
    footer.append(caption, replayBtn);
    box.append(stage, footer);
    this.appendChild(box);
  }
}

if (!customElements.get('ds-replay-demo')) {
  customElements.define('ds-replay-demo', DsReplayDemo);
}
