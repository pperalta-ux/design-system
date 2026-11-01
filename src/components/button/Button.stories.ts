import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './button.css';

const meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['s', 'm', 'l'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    label: 'Button',
    size: 'm',
    disabled: false,
    loading: false,
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  parameters: {
    docs: { description: { story: 'Use for the single highest-priority action on a surface.' } },
  },
  render: ({ label, size, disabled, loading }) =>
    html`<wa-button variant="brand" appearance="accent" size=${size} ?disabled=${disabled} ?loading=${loading}>${label}</wa-button>`,
};

export const Secondary: Story = {
  parameters: {
    docs: { description: { story: 'Use alongside Primary for supporting actions.' } },
  },
  render: ({ label, size, disabled, loading }) =>
    html`<wa-button variant="brand" appearance="outlined" size=${size} ?disabled=${disabled} ?loading=${loading}>${label}</wa-button>`,
};

export const Tertiary: Story = {
  parameters: {
    docs: { description: { story: 'Use for low-emphasis actions where visual weight should stay minimal.' } },
  },
  render: ({ label, size, disabled, loading }) =>
    html`<wa-button variant="brand" appearance="plain" size=${size} ?disabled=${disabled} ?loading=${loading}>${label}</wa-button>`,
};

export const AllVariants: Story = {
  parameters: {
    docs: { description: { story: 'Primary, Secondary, and Tertiary side by side at medium size.' } },
  },
  render: () => html`
    <div style="display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap;">
      <wa-button variant="brand" appearance="accent">Primary</wa-button>
      <wa-button variant="brand" appearance="outlined">Secondary</wa-button>
      <wa-button variant="brand" appearance="plain">Tertiary</wa-button>
    </div>
  `,
};

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'All three sizes — s, m (default), l.' } },
  },
  render: () => html`
    <div style="display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap;">
      <wa-button variant="brand" appearance="accent" size="s">Small</wa-button>
      <wa-button variant="brand" appearance="accent" size="m">Medium</wa-button>
      <wa-button variant="brand" appearance="accent" size="l">Large</wa-button>
    </div>
  `,
};

export const States: Story = {
  parameters: {
    docs: { description: { story: 'Default, loading, and disabled states.' } },
  },
  render: () => html`
    <div style="display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap;">
      <wa-button variant="brand" appearance="accent">Default</wa-button>
      <wa-button variant="brand" appearance="accent" loading>Loading</wa-button>
      <wa-button variant="brand" appearance="accent" disabled>Disabled</wa-button>
    </div>
  `,
};
