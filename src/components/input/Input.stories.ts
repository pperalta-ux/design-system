import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './input.css';

const meta = {
  title: 'Components/Input',
  tags: ['autodocs'],
  argTypes: {
    label:       { control: 'text' },
    placeholder: { control: 'text' },
    hint:        { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['s', 'm', 'l'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    label:       'Email address',
    placeholder: 'name@example.com',
    hint:        "We'll use this to confirm your account.",
    size:        'm',
    disabled:    false,
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Label, placeholder, and hint text all visible at once. The hint sits below the input at 12px/subtle color.' } },
  },
  render: ({ label, placeholder, hint, size }) =>
    html`<wa-input label=${label} placeholder=${placeholder} hint=${hint} size=${size}></wa-input>`,
};

export const Hover: Story = {
  parameters: {
    docs: { description: { story: 'Move your cursor over the input. The border transitions to ink (--color-text) in 150ms. No fill change.' } },
  },
  render: ({ label, placeholder, size }) =>
    html`<wa-input label=${label} placeholder=${placeholder} size=${size}></wa-input>`,
};

export const Focus: Story = {
  parameters: {
    docs: { description: { story: 'Tab into the input. The focus ring is a 2px white gap + 2px ink outer ring, matching the Button focus ring exactly.' } },
  },
  render: ({ label, placeholder, size }) =>
    html`<wa-input label=${label} placeholder=${placeholder} size=${size} autofocus></wa-input>`,
};

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'The whole element drops to 40% opacity. Pointer events are off; cursor becomes not-allowed to signal the state.' } },
  },
  render: ({ label, placeholder, hint, size }) =>
    html`<wa-input label=${label} placeholder=${placeholder} hint=${hint} size=${size} disabled></wa-input>`,
};

export const Error: Story = {
  parameters: {
    docs: { description: { story: 'Set aria-invalid="true" on the element. The border and hint text both switch to --color-error (5.4:1 on white). The hint slot carries the error message.' } },
  },
  render: ({ label, placeholder, size }) =>
    html`<wa-input
      label=${label}
      placeholder=${placeholder}
      hint="Please enter a valid email address."
      size=${size}
      aria-invalid="true">
    </wa-input>`,
};

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'Small (s), medium (m), large (l) — inheriting Web Awesome sizes to match Button heights at each scale.' } },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--space-4); max-width: 320px;">
      <wa-input size="s" label="Small"  placeholder="size s"></wa-input>
      <wa-input size="m" label="Medium" placeholder="size m"></wa-input>
      <wa-input size="l" label="Large"  placeholder="size l"></wa-input>
    </div>
  `,
};
