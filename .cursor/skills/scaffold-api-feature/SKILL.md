---
name: scaffold-api-feature
description: Scaffolds a new API-backed feature (domain, network service, RTK Query store slice) from project templates. Use when adding a feature with HTTP, new store slice, Profile-like endpoints, or when the user asks to scaffold API/store/network layers.
---

# Scaffold API Feature

## When to use

- New backend-backed capability (not passcode-only local state).
- User says: "add feature", "scaffold Profile", "new API module".

## Steps

1. Read `docs/project-structure-guide.md` section **Adding a New API-Backed Feature**.
2. Run the generator (replace `Feature` with PascalCase name):

```bash
npm run scaffold:api-feature -- Feature
```

3. Customize generated files:
   - `network/services/<feature>/routes.ts` — real paths
   - `types/*.types.ts` — DTOs
   - `mappers/*.mapper.ts` — DTO → domain
   - `*.service.ts` — methods
   - `store/<feature>/*.api.ts` — endpoints (keep `queryFn` → service)
4. Run:

```bash
npm run validate:architecture
npm test
```

## Golden reference

Copy patterns from **auth** when unsure:

- `src/network/services/auth/`
- `src/store/auth/auth.api.ts` (queryFn + service + mapper)
- `src/store/auth/auth.slice.ts` (matchers)

## Do not

- Call axios from modules or slice reducers.
- Skip mappers when DTO shape differs from domain.
- Forget `store/index.ts` registration (script patches it; verify diff).

## Optional follow-up

- Run skill **scaffold-module** for UI.
- Run skill **add-navigation-screen** to register a screen.
