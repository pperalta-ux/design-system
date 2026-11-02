import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import './combobox.css';
import './ds-combobox';

const FRUITS = [
  { value: 'apple',      label: 'Apple' },
  { value: 'apricot',    label: 'Apricot' },
  { value: 'banana',     label: 'Banana' },
  { value: 'blueberry',  label: 'Blueberry' },
  { value: 'cherry',     label: 'Cherry' },
  { value: 'fig',        label: 'Fig' },
  { value: 'grape',      label: 'Grape' },
  { value: 'kiwi',       label: 'Kiwi' },
  { value: 'mango',      label: 'Mango' },
  { value: 'peach',      label: 'Peach' },
];

const meta = {
  title: 'Components/Combobox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Use Combobox when the user picks from a predefined list. Use Input for free-form text. Combobox supports type-to-filter but does not accept arbitrary values. For lists over ~20 items it scales better than a Radio Group.',
      },

    },
  },
  argTypes: {
    label:       { control: 'text' },
    placeholder: { control: 'text' },
    hint:        { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['s', 'm', 'l'],
    },
    disabled: { control: 'boolean' },
    invalid:  { control: 'boolean' },
    value:    { control: 'text' },
  },
  args: {
    label:       'Favourite fruit',
    placeholder: 'Search…',
    hint:        'Type to filter the list.',
    size:        'm',
    disabled:    false,
    invalid:     false,
    value:       '',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Empty field, no selection. Type to filter; ArrowDown opens the list; Enter selects; Escape closes and clears.' } },
  },
  render: ({ label, placeholder, hint, size }) => html`
    <div style="max-width: 320px;">
      <ds-combobox
        label=${label}
        placeholder=${placeholder}
        hint=${hint}
        size=${size}
        .options=${FRUITS}
      ></ds-combobox>
    </div>
  `,
};

export const WithValue: Story = {
  parameters: {
    docs: { description: { story: 'A value is pre-selected. Open the list to see the violet checkmark beside the selected option.' } },
  },
  render: ({ label, placeholder, size }) => html`
    <div style="max-width: 320px;">
      <ds-combobox
        label=${label}
        placeholder=${placeholder}
        size=${size}
        value="mango"
        .options=${FRUITS}
      ></ds-combobox>
    </div>
  `,
};


export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Set aria-invalid="true". The border and hint text switch to --color-error. Works identically to the Input error state.' } },
  },
  render: ({ label, placeholder, size }) => html`
    <div style="max-width: 320px;">
      <ds-combobox
        label=${label}
        placeholder=${placeholder}
        hint="Please select a valid option."
        size=${size}
        aria-invalid="true"
        .options=${FRUITS}
      ></ds-combobox>
    </div>
  `,
};

export const Multiple: Story = {
  parameters: {
    docs: { description: { story: 'Selected options appear as tags. The input filters the list, and stays clear after each pick so you can keep selecting.' } },
  },
  render: ({ size }) => html`
    <div style="max-width: 320px;">
      <ds-combobox
        label="Favourite fruits"
        placeholder="Search…"
        size=${size}
        multiple
        with-clear
        .values=${['banana', 'mango']}
        .options=${FRUITS}
      ></ds-combobox>
    </div>
  `,
};

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'The whole element drops to 45% opacity. Pointer events are off; cursor becomes not-allowed.' } },
  },
  render: ({ label, placeholder, hint, size }) => html`
    <div style="max-width: 320px;">
      <ds-combobox
        label=${label}
        placeholder=${placeholder}
        hint=${hint}
        size=${size}
        value="kiwi"
        disabled
        .options=${FRUITS}
      ></ds-combobox>
    </div>
  `,
};

/* ─── Interaction tests ───────────────────────────────────────────────
   Run in the Storybook test panel (and vitest). They drive the real
   component with keyboard and pointer events and check the results. */

type ComboEl = HTMLElement & { value: string; values: string[] };

async function setup(canvasElement: HTMLElement) {
  await customElements.whenDefined('wa-input');
  const combo = canvasElement.querySelector('ds-combobox') as ComboEl;
  const input = await waitFor(() => {
    const el = combo.querySelector('wa-input')?.shadowRoot?.querySelector('input');
    if (!el) throw new globalThis.Error('wa-input not ready');
    return el as HTMLInputElement;
  });
  const options = () => [...combo.querySelectorAll('[role="option"]')];
  const listbox = () => combo.querySelector('[role="listbox"]');
  return { combo, input, options, listbox };
}

Default.play = async ({ canvasElement }) => {
  const { combo, input, options, listbox } = await setup(canvasElement);
  const onChange = fn();
  combo.addEventListener('change', onChange);

  // Typing filters the list (matches anywhere in the name, so Grape counts)
  await userEvent.click(input);
  await userEvent.type(input, 'ap');
  await waitFor(() => expect(options().map(o => o.textContent?.trim())).toEqual(['Apple', 'Apricot', 'Grape']));

  // Arrow keys + Enter select an option and close the list
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}{Enter}');
  await waitFor(() => expect(combo.value).toBe('apple'));
  await waitFor(() => expect(listbox()).toBeNull());
  await expect(onChange).toHaveBeenCalled();

  // Escape closes an open list
  await userEvent.keyboard('{ArrowDown}');
  await waitFor(() => expect(listbox()).not.toBeNull());
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(listbox()).toBeNull());

  // Chevron toggles the list open and closed
  const chevron = combo.querySelector('.ds-combobox__chevron') as HTMLElement;
  chevron.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
  await waitFor(() => expect(listbox()).not.toBeNull());
  chevron.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
  await waitFor(() => expect(listbox()).toBeNull());

  // Clicking an option selects it
  await userEvent.clear(input);
  await userEvent.type(input, 'kiw');
  await waitFor(() => expect(options()).toHaveLength(1));
  await userEvent.click(options()[0]!);
  await waitFor(() => expect(combo.value).toBe('kiwi'));
};

WithValue.play = async ({ canvasElement }) => {
  const { input, options } = await setup(canvasElement);
  await expect(input.value).toBe('Mango');

  await userEvent.click(input);
  await userEvent.keyboard('{ArrowDown}');
  await waitFor(() => {
    const selected = options().find(o => o.getAttribute('aria-selected') === 'true');
    expect(selected?.textContent?.trim()).toBe('Mango');
  });
  await userEvent.keyboard('{Tab}');
};

Multiple.play = async ({ canvasElement }) => {
  const { combo, input, options } = await setup(canvasElement);
  const tags = () => [...combo.querySelectorAll('wa-tag')].map(t => t.textContent?.trim());
  await expect(combo.values).toEqual(['banana', 'mango']);

  // Selecting a third value collapses extras into a +N tag
  await userEvent.click(input);
  await userEvent.type(input, 'cher');
  await waitFor(() => expect(options()).toHaveLength(1));
  await userEvent.keyboard('{ArrowDown}{Enter}');
  await waitFor(() => expect(combo.values).toEqual(['banana', 'mango', 'cherry']));
  await waitFor(() => expect(tags()).toContain('+1'));

  // Removing a tag deselects it
  combo.querySelector('wa-tag')!.dispatchEvent(new Event('wa-remove'));
  await waitFor(() => expect(combo.values).toEqual(['mango', 'cherry']));

  // Backspace in an empty field removes the last value
  combo.querySelector('wa-input')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }),
  );
  await waitFor(() => expect(combo.values).toEqual(['mango']));

  // Clear button removes everything
  const clear = combo.querySelector('.ds-combobox__clear') as HTMLElement;
  clear.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
  await waitFor(() => expect(combo.values).toEqual([]));
};

Disabled.play = async ({ canvasElement }) => {
  const { combo, input, listbox } = await setup(canvasElement);
  await expect(input).toBeDisabled();
  const chevron = combo.querySelector('.ds-combobox__chevron') as HTMLElement;
  chevron.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
  await new Promise(r => setTimeout(r, 100));
  await expect(listbox()).toBeNull();
};
