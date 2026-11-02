import { LitElement, html } from 'lit';
import '@awesome.me/webawesome/dist/components/checkbox-group/checkbox-group.js';
import '@awesome.me/webawesome/dist/components/checkbox/checkbox.js';

export type CheckboxOption = { value: string; label: string; disabled?: boolean };

export class DsCheckboxGroup extends LitElement {
  static override properties = {
    label:   { type: String },
    hint:    { type: String },
    options: { type: Array },
    values:  { type: Array },
  };

  declare label:   string;
  declare hint:    string;
  declare options: CheckboxOption[];
  declare values:  string[];

  constructor() {
    super();
    this.label   = '';
    this.hint    = '';
    this.options = [];
    this.values  = [];
  }

  /* Light DOM so checkbox.css can reach wa-checkbox children directly. */
  protected override createRenderRoot() {
    return this;
  }

  private get _enabledValues() {
    return this.options.filter(o => !o.disabled).map(o => o.value);
  }

  private get _checkedCount() {
    return this._enabledValues.filter(v => this.values.includes(v)).length;
  }

  private _handleSelectAll(e: Event) {
    const cb = e.target as HTMLElement & { checked: boolean };
    this.values = cb.checked ? [...this._enabledValues] : [];
  }

  private _handleOption(e: Event, value: string) {
    const cb = e.target as HTMLElement & { checked: boolean };
    this.values = cb.checked
      ? [...this.values, value]
      : this.values.filter(v => v !== value);
  }

  override render() {
    const total  = this._enabledValues.length;
    const count  = this._checkedCount;
    const allOn  = count === total;
    const someOn = count > 0 && !allOn;

    return html`
      <wa-checkbox-group label=${this.label} hint=${this.hint}>
        <wa-checkbox
          .checked=${allOn}
          .indeterminate=${someOn}
          @change=${this._handleSelectAll}>
          Select all
        </wa-checkbox>
        ${this.options.map(opt => html`
          <wa-checkbox
            value=${opt.value}
            .checked=${this.values.includes(opt.value)}
            ?disabled=${!!opt.disabled}
            @change=${(e: Event) => this._handleOption(e, opt.value)}>
            ${opt.label}
          </wa-checkbox>
        `)}
      </wa-checkbox-group>
    `;
  }
}

customElements.define('ds-checkbox-group', DsCheckboxGroup);
