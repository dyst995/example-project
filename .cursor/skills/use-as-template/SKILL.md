---
name: use-as-template
description: Bootstraps a new React Native project from this repository's layered architecture (network, domain, RTK Query store, modules). Use when copying patterns to another repo, starting a greenfield app, or asking how to reuse this project as a reference.
---

# Use This Repo as a Template

## What to copy

| Area | Copy |
|------|------|
| Architecture doc | `docs/project-structure-guide.md` |
| Automation | `scripts/`, `package.json` scaffold scripts |
| Cursor | `.cursor/skills/`, `.cursor/rules/` |
| ESLint boundaries | `.eslintrc.js` overrides for `modules` and `domain` |
| Network core | `src/network/core/`, `src/network/utils/normalizeApiError.ts` |
| Store base | `src/store/api/baseApi.ts`, `src/store/hooks.ts`, `src/store/index.ts` pattern |
| Golden feature | **auth** (full stack) |
| Local-only feature | **passcode** (thunks, no HTTP) |
| UI-only state | **dashboard** (slice only) |

## Bootstrap checklist (new repo)

1. Copy folder layout: `domain/`, `network/`, `store/`, `modules/`, `navigation/`, `shared/`.
2. Copy `jest/setup.js` MMKV/keychain mocks.
3. Wire `Provider` + `AuthHydrator` + `PasscodeHydrator` in `App.tsx` (adjust as needed).
4. Set `AppURL` in `network/core/config.ts`.
5. Confirm `AuthRoutes.refresh` matches backend.
6. Install same major versions: RTK, react-redux, axios, react-navigation.
7. Run `npm run validate:architecture` in CI or pre-push.

## Feature workflow (repeatable)

```bash
npm run scaffold:api-feature -- Profile   # domain + network + store
npm run scaffold:module -- Profile         # modules/Profile
# then add-navigation-screen skill
npm run validate:architecture && npm test
```

## Skills map

| Skill | Purpose |
|-------|---------|
| `scaffold-api-feature` | Generate domain/network/store |
| `scaffold-module` | Generate modules/<Feature> |
| `add-navigation-screen` | Wire navigation |
| `structure-review` | Audit against guide |
| `use-as-template` | This file |

## Agent entry point

Read `AGENTS.md` and `docs/skills-and-automation.md` first in a new clone.
