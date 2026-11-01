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
1. Tokens (color, type, spacing)
2. Button
3. Input
4. Badge
5. Card
6. Component status tracker page

## Commits
Suggest a commit message after each completed step. I'll commit myself.
