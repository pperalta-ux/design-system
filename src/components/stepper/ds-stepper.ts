import { LitElement, html, nothing } from 'lit';
import '@awesome.me/webawesome/dist/components/stepper/stepper.js';
import '@awesome.me/webawesome/dist/components/step/step.js';
import './stepper.css';

export interface StepConfig {
  name:         string;
  label:        string;
  description?: string;
  disabled?:    boolean;
  loading?:     boolean;
}

export class DsStepper extends LitElement {
  static override properties = {
    steps:       { type: Array },
    activeIndex: { type: Number, reflect: true, attribute: 'active-index' },
    orientation: { type: String, reflect: true },
    clickable:   { type: Boolean, reflect: true },
    linear:      { type: Boolean, reflect: true },
    _animating:  { state: true },
  };

  declare steps:       StepConfig[];
  declare activeIndex: number;
  declare orientation: 'horizontal' | 'vertical' | 'auto';
  declare clickable:   boolean;
  declare linear:      boolean;
  private declare _animating: boolean;

  constructor() {
    super();
    this.steps       = [];
    this.activeIndex = 0;
    this.orientation = 'horizontal';
    this.clickable   = false;
    this.linear      = false;
    this._animating  = false;
  }

  protected override createRenderRoot() {
    return this;
  }

  get isFirst(): boolean { return this.activeIndex === 0; }
  get isLast():  boolean { return this.activeIndex === this.steps.length - 1; }

  private get _activeStepName(): string {
    return this.steps[this.activeIndex]?.name ?? '';
  }

  private _delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Sync activeIndex when user clicks a step in clickable mode (WA drives the change).
  private _syncFromWa = (e: Event): void => {
    const { name } = (e as CustomEvent<{ name: string }>).detail;
    const idx = this.steps.findIndex(s => s.name === name);
    if (idx !== -1 && idx !== this.activeIndex) {
      this._animating = false;
      this.activeIndex = idx;
    }
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('wa-step-change', this._syncFromWa);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('wa-step-change', this._syncFromWa);
  }

  async next(): Promise<void> {
    if (this._animating || this.isLast) return;
    this._animating = true;

    const fromIdx = this.activeIndex;
    const steps   = [...this.querySelectorAll('wa-step')];
    const fromEl  = steps[fromIdx];
    const toEl    = steps[fromIdx + 1];

    // Advance — connector fill transition fires automatically (--duration-fast).
    this.activeIndex = fromIdx + 1;
    await this.updateComplete;

    // Force reflow so the animation restarts cleanly if the class is already present.
    void (toEl as HTMLElement | undefined)?.offsetWidth;

    toEl?.classList.add('ds-step--entering');
    fromEl?.classList.add('ds-step--checking');

    // Release lock after connector settles (--duration-normal = 250ms).
    // Spring + ring keep playing independently; they finish at ~500ms.
    await this._delay(250);
    this._animating = false;

    // Strip classes after the full 500ms sequence (250ms already elapsed).
    void this._delay(250).then(() => {
      toEl?.classList.remove('ds-step--entering');
      fromEl?.classList.remove('ds-step--checking');
    });
  }

  async previous(): Promise<void> {
    if (this._animating || this.isFirst) return;
    this._animating = true;

    const fromIdx = this.activeIndex;

    // Retreat — connector un-fills via its background-color transition; no spring or ring.
    this.activeIndex = fromIdx - 1;
    await this.updateComplete;

    // Connector transition is --duration-normal (250ms); small buffer for settle.
    await this._delay(260);
    this._animating = false;
  }

  override render() {
    return html`
      <wa-stepper
        class="ds-stepper"
        orientation=${this.orientation}
        active=${this._activeStepName}
        ?clickable=${this.clickable}
        ?linear=${this.linear}
      >
        ${this.steps.map((step, i) => html`
          <wa-step
            name=${step.name}
            ?completed=${i < this.activeIndex}
            ?disabled=${!!step.disabled}
            ?loading=${!!step.loading}
          >
            <span class="ds-step__label" data-label=${step.label}>${step.label}</span>
            ${step.description
              ? html`<span slot="description">${step.description}</span>`
              : nothing}
          </wa-step>
        `)}
      </wa-stepper>
    `;
  }
}

customElements.define('ds-stepper', DsStepper);
