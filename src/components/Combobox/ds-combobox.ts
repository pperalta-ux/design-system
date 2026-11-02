import { LitElement, html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';

type Option    = { value: string; label: string };
type PopoverEl = HTMLElement & { showPopover(): void; hidePopover(): void };

let _uid = 0;

export class DsCombobox extends LitElement {
  static override properties = {
    label:         { type: String },
    placeholder:   { type: String },
    hint:          { type: String },
    size:          { type: String },
    disabled:      { type: Boolean },
    invalid:       { type: String,  attribute: 'aria-invalid' },
    options:       { type: Array },
    value:         { type: String },
    _open:         { state: true },
    _filter:       { state: true },
    _focusedIndex: { state: true },
  };

  /*
   * `declare` avoids the Lit class-field-shadowing pitfall:
   * a plain class field like `label = ''` overwrites the reactive accessor
   * that Lit creates via Object.defineProperty, silently breaking updates.
   * `declare` emits nothing at runtime — defaults live in the constructor.
   */
  declare label:       string;
  declare placeholder: string;
  declare hint:        string;
  declare size:        string;
  declare disabled:    boolean;
  declare invalid:     string;
  declare options:     Option[];
  declare value:       string;

  private declare _open:         boolean;
  private declare _filter:       string;
  private declare _focusedIndex: number;

  private _id        = ++_uid;
  private _blurTimer = 0;

  // Stable reference so the same function can be removed from addEventListener.
  // Runs on every captured scroll / resize while the menu is open.
  private _reposition = () => {
    const field = this.querySelector('wa-input');
    if (!field) return;
    const r = field.getBoundingClientRect();
    // Close if the field has scrolled fully out of the visible area
    if (r.bottom < 0 || r.top > window.innerHeight) {
      this._closeList();
      return;
    }
    const el = this._listboxEl();
    if (el) this._positionListbox(el);
  };

  constructor() {
    super();
    this.label       = '';
    this.placeholder = '';
    this.hint        = '';
    this.size        = 'm';
    this.disabled    = false;
    this.invalid     = '';
    this.options     = [];
    this.value       = '';
    this._open         = false;
    this._filter       = '';
    this._focusedIndex = -1;
  }

  // No shadow DOM — external CSS (input.css, combobox.css) can target internals
  override createRenderRoot() { return this; }

  // ── Computed ──────────────────────────────────────────────────────────

  private get _filtered(): Option[] {
    if (!this._filter) return this.options;
    const q = this._filter.toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  }

  private _selectedLabel(): string {
    return this.options.find(o => o.value === this.value)?.label ?? '';
  }

  // ── Popover helpers ───────────────────────────────────────────────────

  private _listboxEl(): PopoverEl | null {
    return this.querySelector('.ds-combobox__listbox') as PopoverEl | null;
  }

  private _positionListbox(el: PopoverEl) {
    const field = this.querySelector('wa-input');
    if (!field) return;
    const r     = field.getBoundingClientRect();
    // scrollHeight is readable synchronously once the element is in the top layer
    const menuH = Math.min(240, el.scrollHeight);

    el.style.width = `${r.width}px`;
    el.style.left  = `${r.left}px`;

    const spaceBelow = window.innerHeight - r.bottom - 4;
    if (spaceBelow < menuH && r.top > menuH + 4) {
      el.style.top = `${r.top - menuH - 4}px`; // open above
    } else {
      el.style.top = `${r.bottom + 4}px`;       // open below
    }
  }

  private _removePositionListeners() {
    window.removeEventListener('scroll', this._reposition, { capture: true });
    window.removeEventListener('resize', this._reposition);
  }

  // ── Open / close ──────────────────────────────────────────────────────

  private _openList() {
    if (this._open) return;
    this._open = true;
    // updated() fires after Lit's DOM update and calls showPopover() + positions
  }

  private _closeList() {
    if (!this._open) return;
    this._removePositionListeners();
    // hidePopover() must run BEFORE Lit removes the <ul> from the DOM
    const el = this._listboxEl();
    if (el) { try { el.hidePopover(); } catch { /* already hidden */ } }
    this._open         = false;
    this._filter       = '';
    this._focusedIndex = -1;
  }

  // ── Lit lifecycle ─────────────────────────────────────────────────────

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    if (changedProperties.has('_open') && this._open) {
      // Transition: closed → open — <ul> is now in the DOM
      const el = this._listboxEl();
      if (el) {
        el.showPopover();
        this._positionListbox(el);
        window.addEventListener('scroll', this._reposition, { passive: true, capture: true });
        window.addEventListener('resize', this._reposition, { passive: true });
      }
    } else if (this._open) {
      // Re-render while already open (filter changed) → reposition in case height changed
      const el = this._listboxEl();
      if (el) this._positionListbox(el);
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────

  private _select(opt: Option) {
    const value = opt.value;
    this._closeList();
    this.value = value;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  // ── Event handlers ────────────────────────────────────────────────────

  private _onInput(e: Event) {
    this._filter = (e.currentTarget as unknown as { value: string }).value ?? '';
    this._openList();
    this._focusedIndex = -1;
  }

  private _onKeyDown(e: KeyboardEvent) {
    const list = this._filtered;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._openList();
        this._focusedIndex = this._focusedIndex < list.length - 1
          ? this._focusedIndex + 1 : 0;
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!this._open) break;
        this._focusedIndex = this._focusedIndex > 0
          ? this._focusedIndex - 1 : list.length - 1;
        break;
      case 'Enter':
        if (this._open && this._focusedIndex >= 0) {
          e.preventDefault();
          const opt = list[this._focusedIndex];
          if (opt) this._select(opt);
        } else {
          this._openList();
        }
        break;
      case 'Escape':
        this._closeList();
        break;
      case 'Tab':
        this._closeList();
        break;
    }
  }

  private _onFocus() {
    clearTimeout(this._blurTimer);
  }

  private _onBlur() {
    // Delay so mousedown on an option fires _select before we close
    this._blurTimer = window.setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this._closeList();
      }
    }, 150);
  }

  private _onChevronMouseDown(e: MouseEvent) {
    if (this.disabled) return;
    // preventDefault stops the wa-input losing focus to the clicked element
    e.preventDefault();
    if (this._open) {
      this._closeList();
    } else {
      this._openList();
    }
    // Keep/move focus to the text field after Lit's DOM update
    requestAnimationFrame(() => {
      const waInput = this.querySelector('wa-input');
      if (waInput) (waInput as HTMLElement).focus();
    });
  }

  // ── Render ────────────────────────────────────────────────────────────

  override render() {
    const list      = this._filtered;
    const listboxId = `ds-combobox-listbox-${this._id}`;
    const fieldVal  = this._filter || this._selectedLabel();

    const wrapClass = [
      'ds-combobox',
      this._open               ? 'is-open'     : '',
      this.disabled            ? 'is-disabled' : '',
      this.invalid === 'true'  ? 'is-invalid'  : '',
    ].filter(Boolean).join(' ');

    return html`
      <div class=${wrapClass}>
        <wa-input
          label=${this.label}
          placeholder=${this.placeholder}
          hint=${this.hint || nothing}
          size=${this.size}
          ?disabled=${this.disabled}
          aria-invalid=${this.invalid || nothing}
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-haspopup="listbox"
          aria-controls=${listboxId}
          aria-autocomplete="list"
          autocomplete="off"
          .value=${live(fieldVal)}
          @input=${this._onInput}
          @keydown=${this._onKeyDown}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
        >
          <span
            slot="end"
            class="ds-combobox__chevron"
            aria-hidden="true"
            @mousedown=${this._onChevronMouseDown}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 6L8 11L13 6"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </span>
        </wa-input>

        ${this._open && list.length > 0 ? html`
          <ul
            id=${listboxId}
            class="ds-combobox__listbox"
            popover="manual"
            role="listbox"
            aria-label=${this.label}
          >
            ${list.map((opt, i) => {
              const sel = opt.value === this.value;
              const foc = i === this._focusedIndex;
              return html`
                <li
                  class="ds-combobox__option${sel ? ' is-selected' : ''}${foc ? ' is-focused' : ''}"
                  role="option"
                  aria-selected=${sel ? 'true' : 'false'}
                  @click=${() => this._select(opt)}
                  @mouseenter=${() => { this._focusedIndex = i; }}
                >
                  <span>${opt.label}</span>
                  <span class="ds-combobox__check" aria-hidden="true"></span>
                </li>
              `;
            })}
          </ul>
        ` : nothing}
      </div>
    `;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._removePositionListeners();
    clearTimeout(this._blurTimer);
  }
}

customElements.define('ds-combobox', DsCombobox);
