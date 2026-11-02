import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '@awesome.me/webawesome/dist/components/radio-group/radio-group.js';
import '@awesome.me/webawesome/dist/components/radio/radio.js';

export interface ToggleOption {
  value: string;
  label: string;
  icon: string;
  disabled?: boolean;
}

export class DsToggle extends LitElement {
  static override properties = {
    options:  { type: Array },
    value:    { type: String, reflect: true },
    size:     { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    name:     { type: String },
  };

  declare options:  ToggleOption[];
  declare value:    string;
  declare size:     's' | 'm' | 'l';
  declare disabled: boolean;
  declare name:     string;

  constructor() {
    super();
    this.options  = [];
    this.value    = '';
    this.size     = 'm';
    this.disabled = false;
    this.name     = 'toggle';
  }

  /* Light DOM so toggle.css reaches wa-radio children directly. */
  protected override createRenderRoot() {
    return this;
  }

  private _handleChange(e: Event) {
    const group = e.target as HTMLElement & { value: string };
    this.value = group.value;
    this.dispatchEvent(new CustomEvent('change', {
      detail:  { value: this.value },
      bubbles: true,
    }));
  }

  override render() {
    return html`
      <div class="ds-toggle ds-toggle--${this.size}">
        <wa-radio-group
          orientation="horizontal"
          name=${this.name}
          .value=${this.value}
          ?disabled=${this.disabled}
          @change=${this._handleChange}
        >
          ${this.options.map(opt => html`
            <wa-radio
              appearance="button"
              value=${opt.value}
              size=${this.size}
              ?disabled=${!!opt.disabled}
            >
              <span class="ds-toggle__option">
                ${unsafeHTML(opt.icon)}
                <span class="ds-toggle__label" data-text=${opt.label}>${opt.label}</span>
              </span>
            </wa-radio>
          `)}
        </wa-radio-group>
      </div>
    `;
  }
}

customElements.define('ds-toggle', DsToggle);
