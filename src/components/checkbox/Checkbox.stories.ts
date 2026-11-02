import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { expect, waitFor } from 'storybook/test';
import './checkbox.css';
import './ds-checkbox-group';

const meta = {
  title: 'Components/Checkbox Group',
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
        story: 'required on each wa-checkbox uses WA\'s built-in constraint validation. Click Submit with nothing checked — :state(user-invalid) fires on every unchecked required checkbox, turning its border red; :has() propagates the error colour to the group label and hint. Check a fruit to clear that checkbox\'s error individually.',
      },
    },
  },
  render: () => html`
    <form
      @submit=${(e: Event) => e.preventDefault()}
      style="display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-4);">
      <wa-checkbox-group
        label="Favourite fruits"
        hint="Pick at least one fruit."
        required>
        <wa-checkbox value="apple"      name="fruit" required>Apple</wa-checkbox>
        <wa-checkbox value="banana"     name="fruit" required>Banana</wa-checkbox>
        <wa-checkbox value="mango"      name="fruit" required>Mango</wa-checkbox>
        <wa-checkbox value="strawberry" name="fruit" required>Strawberry</wa-checkbox>
      </wa-checkbox-group>
      <button type="submit">Submit</button>
    </form>
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

/* ─── Interaction tests ───────────────────────────────────────────── */
SelectAll.play = async ({ canvasElement }) => {
  await customElements.whenDefined('wa-checkbox');
  const group = canvasElement.querySelector('ds-checkbox-group') as HTMLElement & { values: string[] };
  // The real <input> inside wa-checkbox has pointer-events: none (the label takes the click),
  // so trigger the click on it directly
  const boxes = () => [...group.querySelectorAll('wa-checkbox')].map(
    cb => cb.shadowRoot!.querySelector('input') as HTMLInputElement,
  );
  await expect(group.values).toEqual(['apple', 'mango']);

  // Select all checks every option
  boxes()[0]!.click();
  await waitFor(() => expect(group.values).toEqual(['apple', 'banana', 'mango', 'strawberry']));

  // Clicking again clears everything
  boxes()[0]!.click();
  await waitFor(() => expect(group.values).toEqual([]));

  // A single option can be checked and unchecked
  boxes()[2]!.click(); // Banana
  await waitFor(() => expect(group.values).toEqual(['banana']));
  boxes()[2]!.click();
  await waitFor(() => expect(group.values).toEqual([]));
};
