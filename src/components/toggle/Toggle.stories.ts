import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './toggle.css';
import './ds-toggle';

/* ─── Icons (stroke currentColor, 1.6, 16×16 viewport) ───────────── */
const chartIcon = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
  <line x1="3"  y1="14" x2="3"  y2="10"/>
  <line x1="8"  y1="14" x2="8"  y2="6"/>
  <line x1="13" y1="14" x2="13" y2="3"/>
</svg>`;

const tableIcon = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="1" y="1" width="14" height="14" rx="2"/>
  <line x1="1"  y1="5.5" x2="15" y2="5.5"/>
  <line x1="6"  y1="5.5" x2="6"  y2="15"/>
  <line x1="11" y1="5.5" x2="11" y2="15"/>
</svg>`;

const listIcon = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
  <line x1="2" y1="4"  x2="14" y2="4"/>
  <line x1="2" y1="8"  x2="14" y2="8"/>
  <line x1="2" y1="12" x2="14" y2="12"/>
</svg>`;

const gridIcon = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="1" y="1" width="6" height="6" rx="1"/>
  <rect x="9" y="1" width="6" height="6" rx="1"/>
  <rect x="1" y="9" width="6" height="6" rx="1"/>
  <rect x="9" y="9" width="6" height="6" rx="1"/>
</svg>`;

const calendarIcon = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="1" y="3" width="14" height="12" rx="2"/>
  <line x1="1"  y1="7" x2="15" y2="7"/>
  <line x1="5"  y1="1" x2="5"  y2="5"/>
  <line x1="11" y1="1" x2="11" y2="5"/>
</svg>`;

const meta = {
  title: 'Components/Toggle',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ─── Two options ───────────────────────────────────────────────── */
export const TwoOptions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use Toggle to switch views of the same content (Chart vs Table). For submitted form choices use Radio Group; for more than ~4 options use Select.',
      },
    },
  },
  render: () => {
    const el = document.createElement('ds-toggle') as HTMLElement & {
      options: unknown[]; value: string;
    };
    el.setAttribute('name', 'view-2');
    el.options = [
      { value: 'chart', label: 'Chart', icon: chartIcon },
      { value: 'table', label: 'Table', icon: tableIcon },
    ];
    el.value = 'chart';
    return el;
  },
};

/* ─── Three options ─────────────────────────────────────────────── */
export const ThreeOptions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Three segments. The sliding fill moves with each selection; arrow keys navigate between options.',
      },
    },
  },
  render: () => {
    const el = document.createElement('ds-toggle') as HTMLElement & {
      options: unknown[]; value: string;
    };
    el.setAttribute('name', 'view-3');
    el.options = [
      { value: 'list',  label: 'List',  icon: listIcon  },
      { value: 'grid',  label: 'Grid',  icon: gridIcon  },
      { value: 'table', label: 'Table', icon: tableIcon },
    ];
    el.value = 'grid';
    return el;
  },
};

/* ─── Four options ──────────────────────────────────────────────── */
export const FourOptions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Four segments at the recommended maximum. Consider Select if the labels are longer than one word.',
      },
    },
  },
  render: () => {
    const el = document.createElement('ds-toggle') as HTMLElement & {
      options: unknown[]; value: string;
    };
    el.setAttribute('name', 'view-4');
    el.options = [
      { value: 'day',   label: 'Day',   icon: calendarIcon },
      { value: 'week',  label: 'Week',  icon: calendarIcon },
      { value: 'month', label: 'Month', icon: calendarIcon },
      { value: 'year',  label: 'Year',  icon: calendarIcon },
    ];
    el.value = 'year';
    return el;
  },
};

/* ─── Sizes ─────────────────────────────────────────────────────── */
export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Three heights (s 32px / m 40px / l 48px) match Button and Input. Use the same size as sibling controls on the page.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--space-4);">
      ${(['s', 'm', 'l'] as const).map(size => {
        const el = document.createElement('ds-toggle') as HTMLElement & {
          options: unknown[]; value: string; size: string;
        };
        el.setAttribute('name', `view-size-${size}`);
        el.options = [
          { value: 'chart', label: 'Chart', icon: chartIcon },
          { value: 'table', label: 'Table', icon: tableIcon },
        ];
        el.value = 'chart';
        el.size  = size;
        return el;
      })}
    </div>
  `,
};

/* ─── Disabled ──────────────────────────────────────────────────── */
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Top: whole group disabled (locked state). Bottom: only one option disabled while the group is interactive.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--space-4);">
      ${(() => {
        const all = document.createElement('ds-toggle') as HTMLElement & {
          options: unknown[]; value: string; disabled: boolean;
        };
        all.setAttribute('name', 'view-disabled-all');
        all.options  = [
          { value: 'chart', label: 'Chart', icon: chartIcon },
          { value: 'table', label: 'Table', icon: tableIcon },
        ];
        all.value    = 'chart';
        all.disabled = true;
        return all;
      })()}
      ${(() => {
        const one = document.createElement('ds-toggle') as HTMLElement & {
          options: unknown[]; value: string;
        };
        one.setAttribute('name', 'view-disabled-one');
        one.options = [
          { value: 'list',  label: 'List',  icon: listIcon               },
          { value: 'grid',  label: 'Grid',  icon: gridIcon, disabled: true },
          { value: 'table', label: 'Table', icon: tableIcon              },
        ];
        one.value = 'list';
        return one;
      })()}
    </div>
  `,
};
