import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
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
      story: { height: '360px' },
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
    docs: { description: { story: 'A value is pre-selected. Open the list to see the cobalt checkmark beside the selected option.' } },
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

export const Open: Story = {
  parameters: {
    docs: { description: { story: 'Dropdown open with the full list visible. Hover an option to see --color-brand-tint fill; the selected option shows a cobalt checkmark.' } },
  },
  render: ({ label, placeholder, size }) => {
    const ref = html`
      <div style="max-width: 320px; padding-bottom: 280px;">
        <ds-combobox
          id="story-open"
          label=${label}
          placeholder=${placeholder}
          size=${size}
          value="cherry"
          .options=${FRUITS}
        ></ds-combobox>
      </div>
    `;
    // Force the list open after Lit renders
    requestAnimationFrame(() => {
      const el = document.getElementById('story-open') as unknown as { _open: boolean };
      if (el) el._open = true;
    });
    return ref;
  },
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
