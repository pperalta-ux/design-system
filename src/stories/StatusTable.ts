// Builds the component status table by scanning story modules at build time.
// Add a new component's stories file and it appears here automatically.

const modules = import.meta.glob('../components/**/*.stories.ts', {
  eager: true,
}) as Record<string, { default?: { title?: string }; [k: string]: unknown }>;

interface ComponentMeta {
  wa:            string;
  status:        'Stable' | 'Experimental';
  keyboard:      boolean;
  reducedMotion: boolean;
}

const COMPONENT_META: Record<string, ComponentMeta> = {
  'Components/Button': {
    wa:            'wa-button',
    status:        'Stable',
    keyboard:      true,
    reducedMotion: true,
  },
  'Components/Input': {
    wa:            'wa-input',
    status:        'Stable',
    keyboard:      true,
    reducedMotion: true,
  },
  'Components/Combobox': {
    wa:            'wa-input + wa-tag',
    status:        'Stable',
    keyboard:      true,
    reducedMotion: true,
  },
  'Components/Checkbox Group': {
    wa:            'wa-checkbox-group + wa-checkbox',
    status:        'Stable',
    keyboard:      true,
    reducedMotion: true,
  },
  'Components/Switch': {
    wa:            'wa-switch',
    status:        'Stable',
    keyboard:      true,
    reducedMotion: true,
  },
  'Components/Toggle': {
    wa:            'wa-radio-group + wa-radio',
    status:        'Stable',
    keyboard:      true,
    reducedMotion: true,
  },
  'Components/Stepper': {
    wa:            'wa-stepper + wa-step',
    status:        'Experimental',
    keyboard:      true,
    reducedMotion: true,
  },
};

// Convert a Storybook title like "Components/Button" to the docs URL path.
function titleToDocsPath(title: string): string {
  const slug = title.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
  return `?path=/docs/${slug}--docs`;
}

const STABLE_BADGE =
  `<span style="font-size:11px;padding:2px 7px;border-radius:3px;` +
  `background:#dcfce7;color:#166534;font-weight:500">Stable</span>`;
const EXPERIMENTAL_BADGE =
  `<span style="font-size:11px;padding:2px 7px;border-radius:3px;` +
  `background:#fef3c7;color:#92400e;font-weight:500">Experimental</span>`;

class DsStatusTable extends HTMLElement {
  connectedCallback() {
    const components: Array<{
      title:      string;
      storyCount: number;
      meta:       ComponentMeta | undefined;
    }> = [];

    for (const [, mod] of Object.entries(modules)) {
      const title = mod.default?.title;
      if (!title) continue;
      // All named exports in a stories file are story objects.
      const storyCount = Object.keys(mod).filter(k => k !== 'default').length;
      components.push({ title, storyCount, meta: COMPONENT_META[title] });
    }

    components.sort((a, b) => a.title.localeCompare(b.title));

    const ths = [
      'Component',
      'WA base element',
      'Stories',
      'Status',
      'Keyboard',
      'Reduced motion',
      'a11y',
    ]
      .map(h => `<th>${h}</th>`)
      .join('');

    const trs = components
      .map(({ title, storyCount, meta }) => {
        const name   = title.split('/').pop() ?? title;
        const url    = titleToDocsPath(title);
        const wa     = meta?.wa     ?? '—';
        const status = meta?.status ?? 'Stable';
        const badge  = status === 'Experimental' ? EXPERIMENTAL_BADGE : STABLE_BADGE;
        const kb     = meta?.keyboard      ?? true;
        const rm     = meta?.reducedMotion ?? true;

        return `<tr>
          <td><a href="${url}">${name}</a></td>
          <td><code>${wa}</code></td>
          <td>${storyCount}</td>
          <td>${badge}</td>
          <td>${kb ? '✓' : '—'}</td>
          <td>${rm ? '✓' : '—'}</td>
          <td>manual</td>
        </tr>`;
      })
      .join('');

    this.innerHTML =
      `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  }
}

if (!customElements.get('ds-status-table')) {
  customElements.define('ds-status-table', DsStatusTable);
}
