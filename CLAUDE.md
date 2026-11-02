# CLAUDE.md

## Project
A standalone design system built on Web Awesome (web components) + Storybook + TypeScript (Vite).
It replicates the design-to-code workflow from my "Design to Code" case study, using my own tokens and dummy data. No client or employer names.

## My two goals
1. Build the design system.
2. Learn to read and understand the code. I'm a senior product designer becoming a design engineer.

## How to work with me
- Keep changes small: one component or one concept per step.
- Before changing code, say in 1–2 sentences what you'll do and why.
- After each change, explain what the key lines do in plain language. Connect it to Figma concepts when helpful (tokens = variables, variants = component properties, slots = nested instances).
- Leave one small edit per component for me to make by hand (e.g. a token value, padding, a variant). Tell me exactly which file and line.
- Don't add libraries without asking first.
- Keep explanations short and scannable.

## Conventions
- Design tokens live in `src/tokens/` as CSS custom properties.
- Components wrap or extend Web Awesome components.
- Every component gets a Storybook story showing all variants and states.
- No italic or serif type styles.

## Build order
1. ✅ Tokens (color, type, spacing)
2. ✅ Motion tokens (duration, easing)
3. ✅ Button (primary, secondary, tertiary)
4. ✅ Input
5. ✅ Combobox
6. ✅ Button icons (leading / trailing)
7. Checkbox Group (select-all / indeterminate state)
8. Switch
9. Toggle (segmented control, sliding indicator, built on radio group)
10. Stepper (multi-step progress indicator — motion centerpiece)
11. Motion docs page
12. Component status page (optional)

All components: all interactive states (hover, focus-visible, disabled), keyboard support, passing a11y checks, purposeful micro-interactions using motion tokens, prefers-reduced-motion support, short usage note per variant in story.

## Component lessons
Patterns learned while building; apply to every component going forward.

- **Light DOM components:** Storybook's global styles (list resets, margins) leak in. Defeat them with higher-specificity selectors, e.g. `.ds-combobox .ds-combobox__listbox` rather than `.ds-combobox__listbox` alone.
- **Floating dropdowns:** Use `popover="manual"` + JS `getBoundingClientRect()` positioning + a scroll listener with `{ capture: true }`. Never force a story wrapper to be tall enough to show the open state.
- **No forced-open stories:** If a variant needs the dropdown visible, open it with a user gesture in the story, not a fixed `min-height` or `overflow: visible` hack.
- **Tags / chips sizing:** Follow Web Awesome's ratio — tag height = 80% of the field height (s: 26px, m: 32px, l: 38px). Use `line-height: 1` alongside an explicit `height` to override WA's `line-height: calc(--wa-form-control-height - border)`.
- **Match WA's docs first:** Replicate the Web Awesome docs example exactly before customising. Only change fills/colors by overriding CSS custom properties with our tokens — never rewrite WA's layout or sizing.
- **Consistent sample data:** Use the same theme (e.g. fruits) across every story in a component. Don't mix themes between variants.

## Roadmap

**Later:** Glow button for a dark-mode page (reference: Radix Colors homepage hero button)

## Commits
Suggest a commit message after each completed step. I'll commit myself.
