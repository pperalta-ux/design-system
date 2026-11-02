import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './switch.css';

const meta = {
  title: 'Components/Switch',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Switch applies its change immediately and is never submitted with a form, so it has no error state. Use Checkbox when the setting requires a Save action.',
      },
    },
  },
  render: () => html`
    <wa-switch>Email notifications</wa-switch>
  `,
};

export const Checked: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The on state: track fills with --color-brand (cobalt) and the thumb slides to the right. Set the checked attribute to start in this state.',
      },
    },
  },
  render: () => html`
    <wa-switch checked>Email notifications</wa-switch>
  `,
};

export const WithHint: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The hint attribute renders below the label at 12px / --color-text-subtle. Use it for one-line clarifications — keep it shorter than the label.',
      },
    },
  },
  render: () => html`
    <wa-switch hint="You'll receive emails about account activity and security alerts.">
      Email notifications
    </wa-switch>
  `,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Three sizes driven by --height, --width, and --thumb-size in switch.css. Small (s) works well in dense lists; large (l) is a good touch target on mobile.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--space-4);">
      <wa-switch size="s">Push notifications (small)</wa-switch>
      <wa-switch size="m">Push notifications (medium)</wa-switch>
      <wa-switch size="l">Push notifications (large)</wa-switch>
    </div>
  `,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'WA applies 50% opacity to the entire component when disabled — no extra CSS needed. Show both off-disabled and on-disabled so it\'s clear the checked state is still visible through the opacity.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--space-4);">
      <wa-switch disabled>Marketing emails (off, locked)</wa-switch>
      <wa-switch disabled checked>Weekly digest (on, locked)</wa-switch>
    </div>
  `,
};
