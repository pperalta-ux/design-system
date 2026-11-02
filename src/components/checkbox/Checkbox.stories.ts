import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './checkbox.css';
import './ds-checkbox-group';

const meta = {
  title: 'Components/CheckboxGroup',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A labelled group of four fruit options. Each checkbox is independent — tick any combination. Tab moves between checkboxes; Space toggles.',
      },
    },
  },
  render: () => html`
    <wa-checkbox-group label="Favourite fruits">
      <wa-checkbox value="apple">Apple</wa-checkbox>
      <wa-checkbox value="banana">Banana</wa-checkbox>
      <wa-checkbox value="mango">Mango</wa-checkbox>
      <wa-checkbox value="strawberry">Strawberry</wa-checkbox>
    </wa-checkbox-group>
  `,
};

export const WithHint: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The hint attribute on wa-checkbox-group renders below the group label in subtle color at 12px — maps to the same pattern as Input\'s hint.',
      },
    },
  },
  render: () => html`
    <wa-checkbox-group
      label="Favourite fruits"
      hint="Pick any fruits you enjoy. You can update this later.">
      <wa-checkbox value="apple">Apple</wa-checkbox>
      <wa-checkbox value="banana">Banana</wa-checkbox>
      <wa-checkbox value="mango">Mango</wa-checkbox>
      <wa-checkbox value="strawberry">Strawberry</wa-checkbox>
    </wa-checkbox-group>
  `,
};

export const SelectAll: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The "Select all" checkbox starts indeterminate (2 of 4 selected). Clicking it checks all; clicking again unchecks all. State is managed by ds-checkbox-group — a thin Lit wrapper that tracks selected values and drives checked/.indeterminate on the WA checkboxes.',
      },
    },
  },
  render: () => html`
    <ds-checkbox-group
      label="Favourite fruits"
      .options=${[
        { value: 'apple',      label: 'Apple' },
        { value: 'banana',     label: 'Banana' },
        { value: 'mango',      label: 'Mango' },
        { value: 'strawberry', label: 'Strawberry' },
      ]}
      .values=${['apple', 'mango']}>
    </ds-checkbox-group>
  `,
};

export const Error: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Add data-invalid to the group element. The CSS selector wa-checkbox-group[data-invalid]::part(hint) turns the hint text error-red. The group label also switches to --color-error to signal the invalid state.',
      },
    },
  },
  render: () => html`
    <wa-checkbox-group
      label="Favourite fruits"
      hint="Pick at least one fruit."
      data-invalid>
      <wa-checkbox value="apple">Apple</wa-checkbox>
      <wa-checkbox value="banana">Banana</wa-checkbox>
      <wa-checkbox value="mango">Mango</wa-checkbox>
      <wa-checkbox value="strawberry">Strawberry</wa-checkbox>
    </wa-checkbox-group>
  `,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'wa-checkbox-group does not propagate disabled to children, so each wa-checkbox receives disabled individually. Mango carries disabled on its own (e.g. out of season) — it would be locked even if the group were enabled. Apple starts checked-and-disabled to show the checked-disabled visual.',
      },
    },
  },
  render: () => html`
    <wa-checkbox-group label="Favourite fruits">
      <wa-checkbox value="apple" checked disabled>Apple</wa-checkbox>
      <wa-checkbox value="banana" disabled>Banana</wa-checkbox>
      <wa-checkbox value="mango" disabled>Mango</wa-checkbox>
      <wa-checkbox value="strawberry" disabled>Strawberry</wa-checkbox>
    </wa-checkbox-group>
  `,
};
