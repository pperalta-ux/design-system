import type { Preview } from '@storybook/web-components-vite'
import '@awesome.me/webawesome/dist/components/button/button.js'
import '@awesome.me/webawesome/dist/components/input/input.js'
import '@awesome.me/webawesome/dist/components/tag/tag.js'
import '@awesome.me/webawesome/dist/components/checkbox/checkbox.js'
import '@awesome.me/webawesome/dist/components/checkbox-group/checkbox-group.js'
import '@awesome.me/webawesome/dist/components/switch/switch.js'
import '@awesome.me/webawesome/dist/components/radio-group/radio-group.js'
import '@awesome.me/webawesome/dist/components/radio/radio.js'
import '@awesome.me/webawesome/dist/components/stepper/stepper.js'
import '@awesome.me/webawesome/dist/components/step/step.js'
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '../src/tokens/index.css'
import '../src/components/Combobox/ds-combobox'
import '../src/components/stepper/ds-stepper'

const preview: Preview = {
  parameters: {
    options: {
      // Sections in a fixed order, components A–Z, stories kept in file order.
      // (Must be self-contained: Storybook serializes this function.)
      storySort: (a, b) => {
        const sections = ['Overview', 'Foundations', 'Components'];
        if (a.title === b.title) return 0;
        const [sa, ...ra] = a.title.split('/');
        const [sb, ...rb] = b.title.split('/');
        const ia = sections.indexOf(sa), ib = sections.indexOf(sb);
        if (ia !== ib) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        return ra.join('/').localeCompare(rb.join('/'), undefined, { numeric: true });
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;