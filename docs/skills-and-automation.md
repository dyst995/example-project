# Skills and automation

Use this repo as a **reference template** for other React Native projects. Automation reduces copy-paste errors; skills teach the agent *when* and *how* to run it.

## Automation (scripts)

| npm script | Script | What it does |
|------------|--------|----------------|
| `bootstrap:app` | `scripts/bootstrap-into-app.mjs` | Copy template into current RN CLI project (run from **new** app root; set `TEMPLATE` env) |
| `scaffold:api-feature` | `scripts/scaffold-api-feature.mjs` | Creates domain model, network service, RTK Query slice, patches `store/index.ts` |
| `scaffold:module` | `scripts/scaffold-module.mjs` | Creates `modules/<Feature>/` (screen + hook + barrels) |
| `validate:architecture` | `scripts/validate-architecture.mjs` | Checks module→network imports, store barrels, domain exports |

### Templates

Edit generators once, all future scaffolds benefit:

```txt
scripts/templates/
  api-feature/    # domain, network, store
  module/         # screens, hooks
```

### Typical feature flow

```bash
npm run scaffold:api-feature -- Orders
# edit DTOs, routes, service methods, API endpoints
npm run scaffold:module -- Orders
# use skill add-navigation-screen (or manual navigator wiring)
npm run validate:architecture
npm test
```

## Cursor skills (copy with the repo)

Copy `.cursor/skills/` to new projects. Each skill is a `SKILL.md` the agent loads when descriptions match.

| Skill | Triggers (examples) |
|-------|---------------------|
| **scaffold-api-feature** | "add API feature", "scaffold Profile store" |
| **scaffold-module** | "new screen module", "scaffold UI for Orders" |
| **add-navigation-screen** | "add route", "register screen in MainNavigator" |
| **structure-review** | "architecture review", "check folder structure" |
| **use-as-template** | "copy this project", "bootstrap new app from template" |

### Personal vs project skills

| Location | Scope |
|----------|--------|
| `.cursor/skills/` (this repo) | Committed — team / template |
| `~/.cursor/skills/` | Your machine — all projects |

For org-wide standards, copy this repo's `.cursor/skills/` and `docs/project-structure-guide.md` into each new app.

## Cursor rules

| File | Scope |
|------|--------|
| `.cursor/rules/architecture.mdc` | Quick layering rules when editing `src/**` |

## CI recommendation

Add to pipeline:

```bash
npm run validate:architecture
npm run lint
npm test
```

Optional: fail PRs that add `modules/**` imports from `network/**` (already in ESLint).

## What stays manual

- Backend contract (real DTO fields, refresh URL)
- Navigator UX (titles, headers, deep links)
- Secure storage policies per platform
- E2E flows (Detox) per feature

## Extending automation

| Idea | How |
|------|-----|
| New endpoint on existing feature | Copy `auth.api.ts` endpoint block; no script required |
| Stricter validation | Extend `scripts/validate-architecture.mjs` |
| Codegen from OpenAPI | Separate tool; map into `network/services` + mappers |
| PR checklist | GitHub Action running `validate:architecture` |

## Related docs

- [project-structure-guide.md](./project-structure-guide.md)
- [AGENTS.md](../AGENTS.md)
