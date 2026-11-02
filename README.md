# Design System

A small component library I designed and built in code with Claude, using Web Awesome as the foundation.

**[View the live Storybook →](https://pperalta-ux.github.io/design-system/)**

## Why this exists

In my last role I developed a workflow where I designed components and built them directly in code with AI, then shipped them to production. This project recreates that workflow from scratch, in the open, so the process can be seen end to end.

Everything here is independent work. It is built on the open-source [Web Awesome](https://webawesome.com) library with my own tokens, sample data and documentation. It contains no code, designs, tokens or data from any employer.

## What's inside

- **Tokens:** color (WCAG AA checked), spacing, type and motion, with reduced-motion support
- **Components:** Button, Input, Combobox (single and multi-select), Checkbox Group, Switch, Toggle, Stepper
- **Docs:** usage guidance per component, a Motion page and a Component status page
- **Quality:** interaction tests (Storybook + Vitest), coverage reports and automated accessibility checks

## How it was built

1. Define tokens and map them onto Web Awesome's theme variables
2. Build each component in Storybook, matching Web Awesome's patterns first
3. Review visually, fix accessibility and motion, then write interaction tests
4. Record what was learned as rules for the next component (see `CLAUDE.md`)

## Stack

Lit · Web Awesome 3 · Storybook 10 · Vite · Vitest + Playwright · TypeScript

## Run it locally

```bash
npm install
npm run storybook
```
