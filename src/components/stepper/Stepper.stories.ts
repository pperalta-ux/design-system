import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { DsStepper, StepConfig } from './ds-stepper';
import './ds-stepper';
import { expect, userEvent, waitFor } from 'storybook/test';

/* ─── Shared data ─────────────────────────────────────────────────── */
const STEPS: StepConfig[] = [
  { name: 'source',    label: 'Data source' },
  { name: 'locations', label: 'Locations' },
  { name: 'timeframe', label: 'Timeframe' },
  { name: 'review',    label: 'Review' },
];

const STEPS_WITH_DESCRIPTIONS: StepConfig[] = [
  { name: 'source',    label: 'Data source', description: 'Choose your data origin' },
  { name: 'locations', label: 'Locations',   description: 'Pick one or more regions' },
  { name: 'timeframe', label: 'Timeframe',   description: 'Set the date range' },
  { name: 'review',    label: 'Review',      description: 'Confirm and generate' },
];

/* ─── Button helper ───────────────────────────────────────────────── */
function makeSvgIcon(slot: 'start' | 'end', pathD: string): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('slot', slot);
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  return svg;
}

const PATH_ARROW_LEFT  = 'M13 8H3M7 4l-4 4 4 4';
const PATH_ARROW_RIGHT = 'M3 8h10M9 4l4 4-4 4';

function makeButtons(stepper: DsStepper): HTMLElement {
  const back = document.createElement('wa-button');
  back.setAttribute('variant', 'brand');
  back.setAttribute('appearance', 'outlined');
  back.appendChild(makeSvgIcon('start', PATH_ARROW_LEFT));
  back.appendChild(document.createTextNode('Back'));

  const next = document.createElement('wa-button');
  next.setAttribute('variant', 'brand');
  next.setAttribute('appearance', 'accent');

  const syncNext = () => {
    while (next.firstChild) next.removeChild(next.firstChild);
    next.appendChild(document.createTextNode(stepper.isLast ? 'Finish' : 'Next'));
    if (!stepper.isLast) next.appendChild(makeSvgIcon('end', PATH_ARROW_RIGHT));
  };

  const sync = () => {
    if (stepper.isFirst) back.setAttribute('disabled', '');
    else back.removeAttribute('disabled');
    syncNext();
  };

  back.addEventListener('click', async () => { await stepper.previous(); sync(); });
  next.addEventListener('click', async () => { await stepper.next();     sync(); });

  sync();

  const row = document.createElement('div');
  row.style.cssText = 'display: flex; gap: var(--space-3); margin-top: 8px; justify-content: flex-end;';
  row.append(back, next);
  return row;
}

/* ─── Meta ────────────────────────────────────────────────────────── */
const meta = {
  title: 'Components/Stepper',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ─── Default (horizontal) ────────────────────────────────────────── */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use Stepper for linear multi-step flows of 3–6 steps. Use Tabs for non-linear sections where users can jump freely.',
      },
    },
  },
  render: () => {
    const stepper = document.createElement('ds-stepper') as unknown as DsStepper;
    stepper.steps       = STEPS;
    stepper.activeIndex = 1;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding: 24px; display: flex; flex-direction: column; gap: 24px;';
    wrapper.append(stepper, makeButtons(stepper));
    return wrapper;
  },
};

/* ─── Vertical ────────────────────────────────────────────────────── */
export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Vertical layout with an optional description line under each label. Useful in sidebars or narrow panels.',
      },
    },
  },
  render: () => {
    const stepper = document.createElement('ds-stepper') as unknown as DsStepper;
    stepper.steps       = STEPS_WITH_DESCRIPTIONS;
    stepper.activeIndex = 1;
    stepper.orientation = 'vertical';

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding: 24px; display: flex; flex-direction: column; gap: 24px;';
    wrapper.append(stepper, makeButtons(stepper));
    return wrapper;
  },
};

/* ─── Clickable ───────────────────────────────────────────────────── */
export const Clickable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Each step is a button; Tab to focus, Enter/Space to jump. Focus rings appear on keyboard navigation only — not on mouse click.',
      },
    },
  },
  render: () => {
    const stepper = document.createElement('ds-stepper') as unknown as DsStepper;
    stepper.steps       = STEPS;
    stepper.activeIndex = 1;
    stepper.clickable   = true;
    stepper.linear      = true;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding: 24px;';
    wrapper.append(stepper);
    return wrapper;
  },
};

/* ─── States ──────────────────────────────────────────────────────── */
export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Individual steps can be loading (async step in progress) or disabled (step not available in this context).',
      },
    },
  },
  render: () => {
    const stepper = document.createElement('ds-stepper') as unknown as DsStepper;
    stepper.steps = [
      { name: 'source',    label: 'Data source' },
      { name: 'locations', label: 'Locations' },
      { name: 'timeframe', label: 'Timeframe', loading: true },
      { name: 'review',    label: 'Review',    disabled: true },
    ];
    stepper.activeIndex = 1;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding: 24px; display: flex; flex-direction: column; gap: 24px;';
    wrapper.append(stepper, makeButtons(stepper));
    return wrapper;
  },
};

/* ─── Interaction tests ───────────────────────────────────────────── */

const settle = () => new Promise(r => setTimeout(r, 300)); // animation lock is 250ms

async function getParts(canvasElement: HTMLElement) {
  await customElements.whenDefined('wa-stepper');
  const stepper = canvasElement.querySelector('ds-stepper') as unknown as DsStepper;
  await stepper.updateComplete;
  const [back, next] = [...canvasElement.querySelectorAll('wa-button')] as HTMLElement[];
  return { stepper, back, next };
}

Default.play = async ({ canvasElement }) => {
  const { stepper, back, next } = await getParts(canvasElement);
  await expect(stepper.activeIndex).toBe(1);

  // Next advances, marks the previous step completed, and runs the motion classes
  await userEvent.click(next!);
  await waitFor(() => expect(stepper.activeIndex).toBe(2));
  const steps = () => [...stepper.querySelectorAll('wa-step')];
  await expect(steps()[1]).toHaveAttribute('completed');
  await waitFor(() => expect(steps()[2]!.classList.contains('ds-step--entering')).toBe(true));
  await settle();

  // A second click during the animation is ignored
  await userEvent.click(next!);
  await userEvent.click(next!);
  await waitFor(() => expect(stepper.activeIndex).toBe(3));
  await settle();
  await expect(stepper.activeIndex).toBe(3);

  // Last step shows Finish, and Next does nothing
  await waitFor(() => expect(next!.textContent?.trim()).toBe('Finish'));
  await stepper.next();
  await expect(stepper.activeIndex).toBe(3);

  // Back walks to the first step and disables itself
  for (const expected of [2, 1, 0]) {
    await userEvent.click(back!);
    await waitFor(() => expect(stepper.activeIndex).toBe(expected));
    await settle();
  }
  await waitFor(() => expect(back).toHaveAttribute('disabled'));
  await stepper.previous();
  await expect(stepper.activeIndex).toBe(0);
};

Clickable.play = async ({ canvasElement }) => {
  const { stepper } = await getParts(canvasElement);
  // Simulates Web Awesome's own step click, which ds-stepper syncs from
  stepper.dispatchEvent(new CustomEvent('wa-step-change', { detail: { name: 'source' }, bubbles: true }));
  await waitFor(() => expect(stepper.activeIndex).toBe(0));
  // Unknown or current step names are ignored
  stepper.dispatchEvent(new CustomEvent('wa-step-change', { detail: { name: 'nope' }, bubbles: true }));
  await expect(stepper.activeIndex).toBe(0);
};
