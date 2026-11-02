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

    // Advance step — Lit re-renders: fromEl gets `completed`, toEl gets :state(active).
    // CSS connector transition fires automatically (~var(--duration-fast)).
    this.activeIndex = fromIdx + 1;
    await this.updateComplete;

    // Wait for connector to fill, then spring both changed markers simultaneously.
    await this._delay(150);
    toEl?.classList.add('ds-step--entering');
    fromEl?.classList.add('ds-step--checking');
    await this._delay(150);

    toEl?.classList.remove('ds-step--entering');
    fromEl?.classList.remove('ds-step--checking');
    this._animating = false;
  }

  async previous(): Promise<void> {
    if (this._animating || this.isFirst) return;
    this._animating = true;

    const fromIdx = this.activeIndex;
    const steps   = [...this.querySelectorAll('wa-step')];
    const toEl    = steps[fromIdx - 1];

    // Retreat — fromIdx-1 loses `completed`; CSS connector transitions back to neutral.
    this.activeIndex = fromIdx - 1;
    await this.updateComplete;

    await this._delay(150);
    toEl?.classList.add('ds-step--entering');
    await this._delay(150);

    toEl?.classList.remove('ds-step--entering');
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
