---
name: scaffold-module
description: Scaffolds a React Native feature module (screens, hooks, barrel exports). Use when adding a new UI feature folder under modules/, new screen flow, or after scaffold-api-feature needs a screen.
---

# Scaffold Module

## When to use

- New user-facing feature UI.
- After `scaffold-api-feature` (store layer should exist first if the screen loads API data).

## Steps

1. Run:

```bash
npm run scaffold:module -- Feature
```

2. Implement hook logic in `modules/<Feature>/hooks/use<Feature>Screen.tsx`:
   - RTK Query hooks from `store/<feature>` (preferred for HTTP), or
   - `useAppSelector` + dispatch thunks (local/passcode flows).
3. Export screens only from `modules/<Feature>/index.ts`.
4. Register screen in navigation (skill **add-navigation-screen**).
5. Add tests: `modules/<Feature>/**/__tests__`.

## Module rules

- Required: `screens/`, `hooks/`.
- Public export: screens only (`modules/<Feature>/index.ts`).
- Never import `network/**` or DTOs (ESLint enforced).

## Golden reference

- `src/modules/Auth/` — login + hook + screen + error display
- `src/modules/Dashboard/` — store selectors in hook
