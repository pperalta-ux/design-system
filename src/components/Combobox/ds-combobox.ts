import { LitElement, html, nothing } from 'lit';
import { live } from 'lit/directives/live.js';

type Option    = { value: string; label: string };
type PopoverEl = HTMLElement & { showPopover(): void; hidePopover(): void };

let _uid = 0;

export class DsCombobox extends LitElement {
  static override properties = {
    label:             { type: String },
    placeholder:       { type: String },
    hint:              { type: String },
    size:              { type: String },
    disabled:          { type: Boolean },
    invalid:           { type: String,  attribute: 'aria-invalid' },
    options:           { type: Array },
    value:             { type: String },
    multiple:          { type: Boolean },
    maxOptionsVisible: { type: Number, attribute: 'max-options-visible' },
    withClear:         { type: Boolean, attribute: 'with-clear' },
    values:            { type: Array },
    _open:             { state: true },
    _filter:           { state: true },
    _focusedIndex:     { state: true },
  };

  /*
   * `declare` avoids the Lit class-field-shadowing pitfall:
   * a plain class field like `label = ''` overwrites the reactive accessor
   * that Lit creates via Object.defineProperty, silently breaking updates.
   * `declare` emits nothing at runtime — defaults live in the constructor.
   */
  declare label:             string;
  declare placeholder:       string;
  declare hint:              string;
  declare size:              string;
  declare disabled:          boolean;
  declare invalid:           string;
  declare options:           Option[];
  declare value:             string;
  declare multiple:          boolean;
  declare maxOptionsVisible: number;
  declare withClear:         boolean;
  declare values:            string[];

  private declare _open:         boolean;
  private declare _filter:       string;
  private declare _focusedIndex: number;

  private _id             = ++_uid;
  private _blurTimer      = 0;
  private _resizeObserver: ResizeObserver | null = null;

  // Stable reference so the same function can be removed from addEventListener.
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
    this.label             = '';
    this.placeholder       = '';
    this.hint              = '';
    this.size              = 'm';
    this.disabled          = false;
    this.invalid           = '';
    this.options           = [];
    this.value             = '';
    this.multiple          = false;
    this.maxOptionsVisible = 2;
    this.withClear         = false;
    this.values            = [];
    this._open             = false;
    this._filter           = '';
    this._focusedIndex     = -1;
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

  private _labelFor(val: string): string {
    return this.options.find(o => o.value === val)?.label ?? val;
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

  /**
   * The real <input> lives inside wa-input's shadow DOM, so ARIA set on the
   * wa-input host never reaches screen readers. Put the combobox semantics on
   * the inner input directly, using element references (which can point from
   * the shadow DOM out to our light-DOM listbox and options).
   */
  private _syncInnerAria() {
    type AriaInput = HTMLInputElement & {
      ariaActiveDescendantElement: Element | null;
      ariaControlsElements: Element[] | null;
    };
    const input = this.querySelector('wa-input')?.shadowRoot?.querySelector('input') as AriaInput | null;
    if (!input) return;
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', this._open ? 'true' : 'false');
    const list = this._listboxEl();
    input.ariaControlsElements = list ? [list] : null;
    input.ariaActiveDescendantElement = this._open && this._focusedIndex >= 0
      ? this.querySelector('.ds-combobox__option.is-focused')
      : null;
  }

  override async firstUpdated() {
    await customElements.whenDefined('wa-input');
    const field = this.querySelector('wa-input') as (HTMLElement & { updateComplete?: Promise<unknown> }) | null;
    await field?.updateComplete;
    this._syncInnerAria();
  }

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    // ResizeObserver for multi mode: reposition the menu when tags cause the field to grow
    if (this.multiple && !this._resizeObserver) {
      const field = this.querySelector('wa-input');
      if (field) {
        this._resizeObserver = new ResizeObserver(() => {
          if (this._open) {
            const el = this._listboxEl();
            if (el) this._positionListbox(el);
          }
        });
        this._resizeObserver.observe(field);
      }
    }

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
      // Re-render while already open (filter/selection changed) → reposition in case height changed
      const el = this._listboxEl();
      if (el) this._positionListbox(el);
    }

    // Keep the keyboard-highlighted option visible when arrowing through a long list
    if (changedProperties.has('_focusedIndex') && this._open && this._focusedIndex >= 0) {
      this.querySelector('.ds-combobox__option.is-focused')
        ?.scrollIntoView({ block: 'nearest' });
    }

    this._syncInnerAria();
  }

  // ── Actions ───────────────────────────────────────────────────────────

  private _select(opt: Option) {
    if (this.multiple) {
      // Toggle: click a selected option to deselect it
      const idx = this.values.indexOf(opt.value);
      if (idx >= 0) {
        this.values = this.values.filter(v => v !== opt.value);
      } else {
        this.values = [...this.values, opt.value];
      }
      // Clear filter but keep menu open so the user can keep picking
      this._filter       = '';
      this._focusedIndex = -1;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: [...this.values] },
        bubbles: true, composed: true,
      }));
    } else {
      const value = opt.value;
      this._closeList();
      this.value = value;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value },
        bubbles: true, composed: true,
      }));
    }
  }

  private _deselect(val: string) {
    this.values = this.values.filter(v => v !== val);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: [...this.values] },
      bubbles: true, composed: true,
    }));
  }

  private _clearAll() {
    this.values = [];
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: [] },
      bubbles: true, composed: true,
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
      case 'Backspace':
        // Remove last tag when backspace is pressed in an empty input
        if (this.multiple && this._filter === '' && this.values.length > 0) {
          this._deselect(this.values[this.values.length - 1]!);
        }
        break;
    }
  }

  private _onFocus() {
    clearTimeout(this._blurTimer);
  }

  private _onBlur() {
    // Delay so mousedown on an option or tag fires before we close
    this._blurTimer = window.setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this._closeList();
      }
    }, 150);
  }

  private _onChevronMouseDown(e: MouseEvent) {
    if (this.disabled) return;
    // preventDefault stops wa-input losing focus to the clicked element
    e.preventDefault();
    if (this._open) {
      this._closeList();
    } else {
      this._openList();
    }
    requestAnimationFrame(() => {
      const waInput = this.querySelector('wa-input');
      if (waInput) (waInput as HTMLElement).focus();
    });
  }

  private _onClearMouseDown(e: MouseEvent) {
    e.preventDefault();
    this._clearAll();
    requestAnimationFrame(() => {
      const waInput = this.querySelector('wa-input');
      if (waInput) (waInput as HTMLElement).focus();
    });
  }

  // ── Render ────────────────────────────────────────────────────────────

  override render() {
    const list      = this._filtered;
    const listboxId = `ds-combobox-listbox-${this._id}`;
    // Single mode: show selected label when not filtering.
    // Multi mode: show only the filter text; selected values appear as tags.
    const fieldVal  = this.multiple
      ? this._filter
      : (this._filter || this._selectedLabel());

    const wrapClass = [
      'ds-combobox',
      this._open              ? 'is-open'     : '',
      this.disabled           ? 'is-disabled' : '',
      this.invalid === 'true' ? 'is-invalid'  : '',
      this.multiple           ? 'is-multi'    : '',
    ].filter(Boolean).join(' ');

    const visibleValues = this.multiple
      ? this.values.slice(0, this.maxOptionsVisible)
      : [];
    const overflow = this.multiple
      ? Math.max(0, this.values.length - this.maxOptionsVisible)
      : 0;

    return html`
      <div class=${wrapClass}>
        <wa-input
          label=${this.label}
          placeholder=${this.multiple && this.values.length > 0 ? nothing : this.placeholder}
          hint=${this.hint || nothing}
          size=${this.size}
          ?disabled=${this.disabled}
          aria-invalid=${this.invalid || nothing}
          autocomplete="off"
          .value=${live(fieldVal)}
          @input=${this._onInput}
          @keydown=${this._onKeyDown}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
        >
          ${this.multiple && this.values.length > 0 ? html`
            <span slot="start" class="ds-combobox__tags">
              ${visibleValues.map(v => html`
                <wa-tag
                  size="s"
                  with-remove
                  @wa-remove=${() => this._deselect(v)}
                >${this._labelFor(v)}</wa-tag>
              `)}
              ${overflow > 0 ? html`
                <wa-tag size="s">+${overflow}</wa-tag>
              ` : nothing}
            </span>
          ` : nothing}

          ${this.withClear && this.multiple && this.values.length > 0 ? html`
            <button
              slot="end"
              class="ds-combobox__clear"
              aria-label="Clear all selections"
              @mousedown=${this._onClearMouseDown}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          ` : nothing}

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
            tabindex="0"
            role="listbox"
            aria-label=${this.label}
            aria-multiselectable=${this.multiple ? 'true' : nothing}
          >
            ${list.map((opt, i) => {
              const sel = this.multiple
                ? this.values.includes(opt.value)
                : opt.value === this.value;
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
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }
}

customElements.define('ds-combobox', DsCombobox);
