import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './button.css';

const iconPlus = html`<svg slot="start" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const iconArrowRight = html`<svg slot="end" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

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

export const LeadingIcon: Story = {
  parameters: {
    docs: { description: { story: 'Leading icon reinforces the action. SVG goes in slot="start" and inherits the button\'s text color via currentColor.' } },
  },
  render: (args) => {
    const { size } = args;
    return html`
    <div style="display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap;">
      <wa-button variant="brand" appearance="accent" size=${size}>${iconPlus} Add item</wa-button>
      <wa-button variant="brand" appearance="outlined" size=${size}>${iconPlus} Add item</wa-button>
      <wa-button variant="brand" appearance="plain" size=${size}>${iconPlus} Add item</wa-button>
    </div>
  `;
  },
};

export const TrailingIcon: Story = {
  parameters: {
    docs: { description: { story: 'Trailing icon suggests forward motion. SVG goes in slot="end" and inherits the button\'s text color via currentColor.' } },
  },
  render: (args) => {
    const { size } = args;
    return html`
    <div style="display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap;">
      <wa-button variant="brand" appearance="accent" size=${size}>Continue ${iconArrowRight}</wa-button>
      <wa-button variant="brand" appearance="outlined" size=${size}>Continue ${iconArrowRight}</wa-button>
      <wa-button variant="brand" appearance="plain" size=${size}>Continue ${iconArrowRight}</wa-button>
    </div>
  `;
  },
};
