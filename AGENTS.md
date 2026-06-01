# Agent guide

This React Native app uses a **layered architecture**. Read this before large changes.

## Primary docs

- [Bootstrap new CLI app](docs/bootstrap-new-app.md) — copy this template into a fresh `react-native init`
- [Project structure guide](docs/project-structure-guide.md) — layers, naming, RTK Query rules
- [Skills & automation](docs/skills-and-automation.md) — scripts, Cursor skills, CI checks

## Layer boundaries

| Layer | Path | Responsibility |
|-------|------|----------------|
| Network | `src/network/` | HTTP, DTOs, services, mappers |
| Domain | `src/domain/` | App models (no DTO suffix) |
| Store | `src/store/` | Redux + RTK Query; feature folders |
| Modules | `src/modules/` | Screens, feature hooks |
| Shared | `src/shared/` | Reusable UI, security, storage |
| Navigation | `src/navigation/` | Navigators, route types, enums |

## Golden references

- **API + session:** `src/store/auth/`, `src/network/services/auth/`
- **Local async (no HTTP):** `src/store/passcode/`
- **UI-only state:** `src/store/dashboard/`

## Commands

```bash
npm run scaffold:api-feature -- FeatureName   # domain + network + store
npm run scaffold:module -- FeatureName        # modules/<Feature>
npm run validate:architecture                 # layering checks
npm test
npm run lint
```

## Cursor skills (`.cursor/skills/`)

| Skill | Use when |
|-------|----------|
| `scaffold-api-feature` | New HTTP-backed feature |
| `scaffold-module` | New feature UI folder |
| `add-navigation-screen` | Register a route |
| `structure-review` | Architecture audit |
| `use-as-template` | Copy patterns to another repo |

## Rules

- ESLint blocks `modules/**` → `network/**` imports.
- Do not put MMKV/Keychain side effects in reducers.
- Prefer `signOutThunk` over bare `signOut` when clearing secure storage.
